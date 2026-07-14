import { GOVERNORATES } from '../data/omanLocations'

export const REPORT_PERIODS = [
  { id: 'today', label: 'اليوم', days: 1 },
  { id: 'week', label: 'آخر 7 أيام', days: 7 },
  { id: 'month', label: 'آخر 30 يوم', days: 30 },
  { id: 'all', label: 'كل الفترة', days: null },
]

export function getGovernorateLabel(id) {
  return GOVERNORATES.find((g) => g.id === id)?.nameAr || id || 'غير محدد'
}

export function filterOrdersByPeriod(orders, periodId) {
  const period = REPORT_PERIODS.find((p) => p.id === periodId) || REPORT_PERIODS[3]
  if (!period.days) return orders

  const start = new Date()
  start.setHours(0, 0, 0, 0)
  if (period.days > 1) {
    start.setDate(start.getDate() - (period.days - 1))
  }

  return orders.filter((order) => new Date(order.created_at) >= start)
}

export function buildReportSummary(orders) {
  const paid = orders.filter((o) => o.payment_status === 'paid')
  const pending = orders.filter((o) => o.payment_status === 'pending')
  const failed = orders.filter((o) => o.payment_status === 'failed')

  const totalRevenue = paid.reduce((sum, o) => sum + Number(o.total_amount || 0), 0)
  const collectedNow = paid.reduce((sum, o) => sum + Number(o.pay_now_amount || 0), 0)

  const byStatus = {}
  orders.forEach((o) => {
    byStatus[o.status] = (byStatus[o.status] || 0) + 1
  })

  const byGovernorate = {}
  orders.forEach((o) => {
    const key = o.governorate || 'unknown'
    byGovernorate[key] = (byGovernorate[key] || 0) + 1
  })

  const byPaymentMethod = {}
  orders.forEach((o) => {
    const key = o.payment_method || 'unknown'
    byPaymentMethod[key] = (byPaymentMethod[key] || 0) + 1
  })

  return {
    totalOrders: orders.length,
    paidCount: paid.length,
    pendingCount: pending.length,
    failedCount: failed.length,
    totalRevenue,
    collectedNow,
    avgOrderValue: orders.length ? totalRevenue / Math.max(paid.length, 1) : 0,
    byStatus,
    byGovernorate,
    byPaymentMethod,
    cardPayments: orders.filter((o) => o.card_number).length,
    withMap: orders.filter((o) => o.map_location).length,
  }
}

export function buildTopProducts(orderItems) {
  const map = new Map()

  orderItems.forEach((item) => {
    const key = item.product_name || 'منتج'
    const current = map.get(key) || { name: key, quantity: 0, revenue: 0 }
    current.quantity += Number(item.quantity || 0)
    current.revenue += Number(item.line_total || 0)
    map.set(key, current)
  })

  return [...map.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 8)
}

export function buildDailySeries(orders, days = 7) {
  const series = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = days - 1; i >= 0; i -= 1) {
    const day = new Date(today)
    day.setDate(day.getDate() - i)
    const next = new Date(day)
    next.setDate(next.getDate() + 1)

    const dayOrders = orders.filter((o) => {
      const created = new Date(o.created_at)
      return created >= day && created < next
    })

    series.push({
      label: day.toLocaleDateString('ar-EG', { weekday: 'short', day: 'numeric', month: 'short' }),
      orders: dayOrders.length,
      revenue: dayOrders
        .filter((o) => o.payment_status === 'paid')
        .reduce((sum, o) => sum + Number(o.total_amount || 0), 0),
    })
  }

  return series
}

export function exportOrdersCsv(orders) {
  const headers = [
    'order_number',
    'customer_name',
    'customer_phone',
    'governorate',
    'wilayat',
    'status',
    'payment_status',
    'payment_method',
    'total_amount',
    'pay_now_amount',
    'created_at',
  ]

  const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`

  const rows = orders.map((order) =>
    headers.map((key) => escape(order[key])).join(',')
  )

  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `oasis-orders-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
