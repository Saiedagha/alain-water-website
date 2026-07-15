import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import {
  REPORT_PERIODS,
  buildDailySeries,
  buildReportSummary,
  buildTopProducts,
  exportOrdersCsv,
  filterOrdersByPeriod,
  getGovernorateLabel,
} from '../lib/adminReports'
import AdminBarChart from './components/AdminBarChart'
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  adminBtnPrimary,
  adminBtnSecondary,
  adminCardClass,
  formatMoney,
} from './adminStyles'

function StatCard({ label, value, sub, accent = 'text-slate-950' }) {
  return (
    <div className={`${adminCardClass} min-w-0`}>
      <p className="text-slate-500 font-bold text-xs sm:text-sm leading-snug">{label}</p>
      <p className={`text-xl sm:text-3xl font-black mt-2 break-words ${accent}`}>{value}</p>
      {sub && <p className="text-admin font-bold text-[11px] sm:text-sm mt-1 leading-snug">{sub}</p>}
    </div>
  )
}

export default function AdminReports() {
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('month')
  const [orders, setOrders] = useState([])
  const [orderItems, setOrderItems] = useState([])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [ordersRes, itemsRes] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('order_items').select('*'),
      ])
      setOrders(ordersRes.data || [])
      setOrderItems(itemsRes.data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filteredOrders = useMemo(
    () => filterOrdersByPeriod(orders, period),
    [orders, period]
  )

  const summary = useMemo(() => buildReportSummary(filteredOrders), [filteredOrders])

  const filteredOrderIds = useMemo(
    () => new Set(filteredOrders.map((o) => o.id)),
    [filteredOrders]
  )

  const topProducts = useMemo(
    () => buildTopProducts(orderItems.filter((item) => filteredOrderIds.has(item.order_id))),
    [orderItems, filteredOrderIds]
  )

  const dailySeries = useMemo(() => buildDailySeries(filteredOrders, 7), [filteredOrders])

  const statusChart = ORDER_STATUSES.map((s) => ({
    label: s.label,
    value: summary.byStatus[s.value] || 0,
  })).filter((item) => item.value > 0)

  const governorateChart = Object.entries(summary.byGovernorate)
    .map(([id, value]) => ({ label: getGovernorateLabel(id), value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  const paymentStatusChart = PAYMENT_STATUSES.map((s) => ({
    label: s.label,
    value: filteredOrders.filter((o) => o.payment_status === s.value).length,
  })).filter((item) => item.value > 0)

  const paymentMethodChart = Object.entries(summary.byPaymentMethod).map(([id, value]) => ({
    label: id === 'deposit' ? 'دفعة مقدمة' : id === 'full' ? 'دفع كامل' : id,
    value,
  }))

  if (loading) {
    return <p className="font-bold text-slate-500">جاري تحميل التقارير...</p>
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className={`${adminCardClass} flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4`}>
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-black text-slate-950">تقارير الموقع</h2>
          <p className="text-slate-500 font-bold text-sm mt-1">
            ملخص الطلبات والإيرادات والمنتجات الأكثر طلباً
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {REPORT_PERIODS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPeriod(item.id)}
              className={`px-3 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm ${
                period === item.id ? 'bg-admin text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="إجمالي الطلبات" value={summary.totalOrders} sub={`${summary.paidCount} مدفوع`} />
        <StatCard
          label="إيرادات مدفوعة"
          value={`${formatMoney(summary.totalRevenue)} AED`}
          sub={`محصّل الآن: ${formatMoney(summary.collectedNow)} AED`}
          accent="text-admin"
        />
        <StatCard
          label="متوسط قيمة الطلب"
          value={`${formatMoney(summary.avgOrderValue)} AED`}
          sub={`${summary.pendingCount} معلّق`}
        />
        <StatCard
          label="مدفوعات بالبطاقة"
          value={summary.cardPayments}
          sub={`${summary.withMap} طلب بموقع خريطة`}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <div className={adminCardClass}>
          <h3 className="font-black text-base sm:text-lg mb-4">الطلبات حسب الحالة</h3>
          <AdminBarChart items={statusChart} />
        </div>

        <div className={adminCardClass}>
          <h3 className="font-black text-base sm:text-lg mb-4">حالة الدفع</h3>
          <AdminBarChart items={paymentStatusChart} />
        </div>

        <div className={adminCardClass}>
          <h3 className="font-black text-base sm:text-lg mb-4">الطلبات حسب الإمارة</h3>
          <AdminBarChart items={governorateChart} />
        </div>

        <div className={adminCardClass}>
          <h3 className="font-black text-base sm:text-lg mb-4">طرق الدفع</h3>
          <AdminBarChart items={paymentMethodChart} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <div className={adminCardClass}>
          <h3 className="font-black text-base sm:text-lg mb-4">آخر 7 أيام</h3>
          <AdminBarChart
            items={dailySeries.map((day) => ({ label: day.label, value: day.orders }))}
            formatValue={(value) => `${value} طلب`}
          />
        </div>

        <div className={adminCardClass}>
          <h3 className="font-black text-base sm:text-lg mb-4">إيرادات آخر 7 أيام (AED)</h3>
          <AdminBarChart
            items={dailySeries.map((day) => ({ label: day.label, value: day.revenue }))}
            formatValue={(value) => formatMoney(value)}
          />
        </div>
      </div>

      <div className={adminCardClass}>
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <h3 className="font-black text-base sm:text-lg">المنتجات الأكثر طلباً</h3>
          <button
            type="button"
            className={`${adminBtnSecondary} w-full sm:w-auto`}
            onClick={() => exportOrdersCsv(filteredOrders)}
          >
            تصدير CSV
          </button>
        </div>

        {topProducts.length === 0 ? (
          <p className="font-bold text-slate-500">لا توجد مبيعات في هذه الفترة.</p>
        ) : (
          <div className="overflow-x-auto -mx-1 px-1">
            <table className="w-full text-sm min-w-[420px]">
              <thead>
                <tr className="text-slate-500 border-b">
                  <th className="text-right py-3 font-black">المنتج</th>
                  <th className="text-right py-3 font-black">الكمية</th>
                  <th className="text-right py-3 font-black">الإيراد</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product) => (
                  <tr key={product.name} className="border-b border-slate-100">
                    <td className="py-3 font-bold text-slate-800 break-words">{product.name}</td>
                    <td className="py-3 font-black text-admin whitespace-nowrap">{product.quantity}</td>
                    <td className="py-3 font-black whitespace-nowrap">{formatMoney(product.revenue)} AED</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className={`${adminCardClass} flex flex-col sm:flex-row sm:flex-wrap gap-3`}>
        <button
          type="button"
          className={`${adminBtnPrimary} w-full sm:w-auto`}
          onClick={() => exportOrdersCsv(filteredOrders)}
        >
          تصدير كل الطلبات (CSV)
        </button>
        <p className="text-sm font-bold text-slate-500 sm:self-center">
          {filteredOrders.length} طلب في الفترة المحددة
        </p>
      </div>
    </div>
  )
}
