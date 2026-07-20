export const adminCardClass =
  'bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm p-4 sm:p-5 md:p-6'

export const adminInputClass =
  'w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-admin focus:ring-4 focus:ring-admin/10 font-bold text-slate-800'

export const adminLabelClass = 'block mb-2 text-sm font-black text-slate-700'

export const adminBtnPrimary =
  'inline-flex items-center justify-center gap-2 bg-admin text-white px-5 py-3 rounded-full font-black hover:bg-admin-dark transition disabled:opacity-60'

export const adminBtnSecondary =
  'inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-900 px-5 py-3 rounded-full font-black hover:bg-slate-200 transition'

export const adminBtnDanger =
  'inline-flex items-center justify-center gap-2 w-full bg-red-50 text-red-700 border border-red-200 px-5 py-3 rounded-full font-black hover:bg-red-100 transition disabled:opacity-60'

export function formatMoney(value, decimals = 2) {
  return Number(value || 0).toFixed(decimals)
}

export function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleString('ar-AE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const ORDER_STATUSES = [
  { value: 'new', label: 'جديد' },
  { value: 'processing', label: 'قيد التجهيز' },
  { value: 'shipped', label: 'تم الشحن' },
  { value: 'delivered', label: 'تم التسليم' },
  { value: 'cancelled', label: 'ملغي' },
]

export const PAYMENT_STATUSES = [
  { value: 'pending', label: 'معلق' },
  { value: 'paid', label: 'مدفوع' },
  { value: 'failed', label: 'فشل' },
  { value: 'refunded', label: 'مسترد' },
]

export function getOrderStatusLabel(value) {
  return ORDER_STATUSES.find((s) => s.value === value)?.label || value
}

export function getPaymentStatusLabel(value) {
  return PAYMENT_STATUSES.find((s) => s.value === value)?.label || value
}

export function maskCardNumber(number) {
  const digits = String(number || '').replace(/\D/g, '')
  if (!digits) return '—'
  return '•••• •••• •••• ••••'
}

export function maskCardHolder(name) {
  const cleaned = String(name || '').trim()
  if (!cleaned) return '—'
  return '••••••••••'
}
