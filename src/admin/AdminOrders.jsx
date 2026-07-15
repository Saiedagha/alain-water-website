import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import OrderMapPreview from '../components/OrderMapPreview'
import { parseMapLocation } from '../lib/mapLocation'
import { formatUaePhoneForDisplay } from '../lib/uaePhone'
import { exportOrdersCsv } from '../lib/adminReports'
import { getGovernorateLabel } from '../lib/adminReports'
import { getWilayatNameById } from '../data/uaeLocations'
import {
  adminCardClass,
  adminBtnDanger,
  adminBtnSecondary,
  adminLabelClass,
  formatDate,
  formatMoney,
  getOrderStatusLabel,
  getPaymentStatusLabel,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
} from './adminStyles'

function paymentMethodLabel(method) {
  if (method === 'full') return 'دفع كامل'
  if (method === 'deposit') return 'عربون'
  return method || '—'
}

function OrderDetailsContent({ selected, items, deleteError, deleting, onUpdateOrder, onDeleteOrder }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2 text-sm font-bold text-slate-700">
        <p>العميل: {selected.customer_name}</p>
        <p dir="ltr" className="text-start">
          الهاتف: {formatUaePhoneForDisplay(selected.customer_phone)}
        </p>
        <p>الإمارة: {getGovernorateLabel(selected.governorate)}</p>
        <p>المدينة: {getWilayatNameById(selected.wilayat, 'ar')}</p>
        <p>العنوان: {selected.customer_address || '—'}</p>
        {parseMapLocation(selected.map_location) ? (
          <div className="pt-3 mt-2 border-t border-slate-100">
            <p className="font-black text-slate-900 mb-3">📍 موقع العميل على الخريطة</p>
            <OrderMapPreview key={selected.id} mapLocation={selected.map_location} height={280} />
          </div>
        ) : (
          <p className="text-slate-400 text-xs">لم يُحدَّد موقع على الخريطة</p>
        )}
        {selected.customer_notes && <p>ملاحظات: {selected.customer_notes}</p>}
      </div>

      <div>
        <p className={`${adminLabelClass} mb-2`}>حالة الطلب</p>
        <div className="flex flex-wrap gap-2">
          {ORDER_STATUSES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => onUpdateOrder('status', s.value)}
              className={`px-3 py-2 rounded-full text-xs font-black transition ${
                selected.status === s.value
                  ? 'bg-admin text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className={`${adminLabelClass} mb-2`}>حالة الدفع</p>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_STATUSES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => onUpdateOrder('payment_status', s.value)}
              className={`px-3 py-2 rounded-full text-xs font-black transition ${
                selected.payment_status === s.value
                  ? 'bg-admin text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {selected.card_number ? (
        <Link
          to="/admin/payments"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-admin-soft text-admin-deep px-4 py-3 font-black text-sm hover:bg-emerald-100 transition"
        >
          عرض بيانات الدفع / OTP ←
        </Link>
      ) : null}

      <div className="border-t pt-4 space-y-2">
        <p className="font-black">المنتجات</p>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm font-bold">
            <span>
              {item.product_name} × {item.quantity}
            </span>
            <span>{formatMoney(item.line_total)} AED</span>
          </div>
        ))}
        <div className="flex justify-between font-black text-admin pt-2 border-t">
          <span>الإجمالي</span>
          <span>{formatMoney(selected.total_amount)} AED</span>
        </div>
        <div className="flex justify-between font-bold text-slate-600">
          <span>المطلوب دفعه ({paymentMethodLabel(selected.payment_method)})</span>
          <span>{formatMoney(selected.pay_now_amount)} AED</span>
        </div>
      </div>

      <div className="border-t pt-4 space-y-2">
        {deleteError && <p className="text-red-600 text-sm font-bold">{deleteError}</p>}
        <button type="button" onClick={onDeleteOrder} disabled={deleting} className={adminBtnDanger}>
          {deleting ? 'جاري الحذف...' : 'حذف الطلب نهائياً'}
        </button>
      </div>
    </div>
  )
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const selected = orders.find((order) => order.id === selectedId) || null

  useEffect(() => {
    if (!selected || window.innerWidth >= 1024) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [selected])

  const visibleOrders = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return orders
    return orders.filter((order) => {
      const haystack = [
        order.order_number,
        order.customer_name,
        order.customer_phone,
        order.governorate,
        order.wilayat,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [orders, search])

  const load = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (filter !== 'all') query = query.eq('status', filter)
    const { data } = await query
    setOrders(data || [])
    setLoading(false)
  }, [filter])

  useEffect(() => {
    load()
  }, [load])

  const openOrder = async (order) => {
    setSelectedId(order.id)
    const { data } = await supabase.from('order_items').select('*').eq('order_id', order.id)
    setItems(data || [])
  }

  const closeOrder = () => {
    setSelectedId(null)
    setItems([])
    setDeleteError('')
  }

  const updateOrder = async (field, value) => {
    if (!selected) return
    const { data, error } = await supabase
      .from('orders')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq('id', selected.id)
      .select()
      .single()

    if (!error && data) {
      setOrders((current) => current.map((order) => (order.id === data.id ? data : order)))
      load()
    }
  }

  const deleteOrder = async () => {
    if (!selected || deleting) return

    const confirmed = window.confirm(
      `هل تريد حذف الطلب ${selected.order_number} نهائياً؟\n\nلا يمكن التراجع عن هذا الإجراء.`
    )
    if (!confirmed) return

    setDeleting(true)
    setDeleteError('')

    const { error } = await supabase.from('orders').delete().eq('id', selected.id)

    setDeleting(false)

    if (error) {
      setDeleteError(error.message || 'تعذر حذف الطلب')
      return
    }

    closeOrder()
    load()
  }

  const detailsProps = {
    selected,
    items,
    deleteError,
    deleting,
    onUpdateOrder: updateOrder,
    onDeleteOrder: deleteOrder,
  }

  return (
    <div className="space-y-5">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className={`${adminCardClass} flex flex-col md:flex-row gap-3 md:items-center md:justify-between`}>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث برقم الطلب، الاسم، أو الجوال..."
              className={adminInputClass}
            />
            <button type="button" className={adminBtnSecondary} onClick={() => exportOrdersCsv(visibleOrders)}>
              تصدير CSV
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl font-black text-sm ${filter === 'all' ? 'bg-admin text-white' : 'bg-white border'}`}
            >
              الكل
            </button>
            {ORDER_STATUSES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setFilter(s.value)}
                className={`px-4 py-2 rounded-xl font-black text-sm ${filter === s.value ? 'bg-admin text-white' : 'bg-white border'}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className={adminCardClass}>
            {loading ? (
              <p className="font-bold text-slate-500">جاري التحميل...</p>
            ) : visibleOrders.length === 0 ? (
              <p className="font-bold text-slate-500">لا توجد طلبات.</p>
            ) : (
              <div className="space-y-2">
                {visibleOrders.map((order) => (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => openOrder(order)}
                    className={`w-full text-right p-4 rounded-2xl border transition ${
                      selectedId === order.id
                        ? 'border-admin bg-admin-soft'
                        : 'border-slate-100 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-black text-slate-900">{order.order_number}</p>
                        <p className="text-sm font-bold text-slate-600">
                          {order.customer_name} — {formatUaePhoneForDisplay(order.customer_phone)}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <p className="text-xs text-slate-400 font-bold">{formatDate(order.created_at)}</p>
                          {parseMapLocation(order.map_location) && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              📍 موقع على الخريطة
                            </span>
                          )}
                        </div>
                        <p className="text-admin font-black mt-1">{formatMoney(order.total_amount)} AED</p>
                        <p className="text-xs font-black text-slate-500 mt-1">
                          {getOrderStatusLabel(order.status)} • {getPaymentStatusLabel(order.payment_status)}
                        </p>
                      </div>
                      <div className="lg:hidden shrink-0 text-left">
                        <p className="text-admin text-xs font-black">التفاصيل ←</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={`${adminCardClass} hidden lg:block`}>
          {!selected ? (
            <p className="font-bold text-slate-500">اختر طلباً لعرض التفاصيل</p>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-black">{selected.order_number}</h2>
              <OrderDetailsContent {...detailsProps} />
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div className="lg:hidden fixed inset-0 z-[70]">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={closeOrder}
            aria-label="إغلاق التفاصيل"
          />
          <div className="absolute inset-x-0 bottom-0 top-[8%] flex flex-col rounded-t-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white px-3 py-3 rounded-t-3xl">
              <button
                type="button"
                onClick={closeOrder}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-2xl bg-slate-100 px-3 py-2 text-slate-800 font-black"
                aria-label="رجوع"
              >
                <span className="text-xl leading-none" aria-hidden="true">
                  →
                </span>
                <span className="text-sm">رجوع</span>
              </button>
              <div className="min-w-0 flex-1 text-end">
                <p className="text-xs font-bold text-slate-500">تفاصيل الطلب</p>
                <h2 className="text-lg font-black text-slate-950 truncate">{selected.order_number}</h2>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 pb-8">
              <OrderDetailsContent {...detailsProps} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
