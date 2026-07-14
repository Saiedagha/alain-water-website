import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { buildDailySeries, buildReportSummary } from '../lib/adminReports'
import AdminBarChart from './components/AdminBarChart'
import {
  ORDER_STATUSES,
  adminBtnPrimary,
  adminBtnSecondary,
  adminCardClass,
  formatDate,
  formatMoney,
  getOrderStatusLabel,
} from './adminStyles'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProducts: 0,
    visibleProducts: 0,
    totalOrders: 0,
    newOrders: 0,
    deliveredOrders: 0,
    pendingMessages: 0,
    pendingPayments: 0,
    totalRevenue: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [recentProducts, setRecentProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let active = true

    const load = async () => {
      setLoading(true)
      setLoadError('')

      try {
        const [productsRes, ordersRes, messagesRes, paymentsRes] = await Promise.all([
          supabase.from('products').select('*').order('sort_order'),
          supabase.from('orders').select('*').order('created_at', { ascending: false }),
          supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
          supabase.from('orders').select('id', { count: 'exact', head: true }).eq('manual_payment_status', 'pending'),
        ])

        if (!active) return

        const products = productsRes.data || []
        const allOrders = ordersRes.data || []

        const paidRevenue = allOrders
          .filter((o) => o.payment_status === 'paid')
          .reduce((sum, o) => sum + Number(o.total_amount || 0), 0)

        setOrders(allOrders)
        setStats({
          totalProducts: products.length,
          visibleProducts: products.filter((p) => p.is_visible).length,
          totalOrders: allOrders.length,
          newOrders: allOrders.filter((o) => o.status === 'new').length,
          deliveredOrders: allOrders.filter((o) => o.status === 'delivered').length,
          pendingMessages: messagesRes.count || 0,
          pendingPayments: paymentsRes.count || 0,
          totalRevenue: paidRevenue,
        })

        setRecentOrders(allOrders.slice(0, 5))
        setRecentProducts(products.slice(0, 5))
      } catch (error) {
        if (!active) return
        console.error(error)
        setLoadError('تعذر تحميل بيانات لوحة التحكم. حاول تحديث الصفحة.')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [])

  const summary = useMemo(() => buildReportSummary(orders), [orders])
  const dailySeries = useMemo(() => buildDailySeries(orders, 7), [orders])
  const statusChart = ORDER_STATUSES.map((s) => ({
    label: s.label,
    value: summary.byStatus[s.value] || 0,
  })).filter((item) => item.value > 0)

  if (loading) {
    return <p className="font-bold text-slate-500">جاري تحميل لوحة التحكم...</p>
  }

  if (loadError) {
    return (
      <div className={`${adminCardClass} text-center space-y-4`}>
        <p className="font-bold text-red-600">{loadError}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center bg-alain-blue text-white px-5 py-3 rounded-2xl font-black hover:bg-alain-blue-dark transition"
        >
          تحديث الصفحة
        </button>
      </div>
    )
  }

  const cards = [
    { label: 'المنتجات', value: stats.totalProducts, sub: `${stats.visibleProducts} ظاهر`, link: '/admin/products' },
    { label: 'الطلبات', value: stats.totalOrders, sub: `${stats.newOrders} جديد`, link: '/admin/orders' },
    { label: 'مدفوعات معلّقة', value: stats.pendingPayments, sub: 'بانتظار المراجعة', link: '/admin/payments' },
    { label: 'رسائل جديدة', value: stats.pendingMessages, sub: 'غير مقروءة', link: '/admin/contact-messages' },
    { label: 'إيرادات مدفوعة', value: `${formatMoney(stats.totalRevenue)} AED`, sub: `${stats.deliveredOrders} تم التسليم`, link: '/admin/reports' },
  ]

  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0 max-w-full">
      <div className={`${adminCardClass} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-l from-sky-50 to-white`}>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-2xl font-black text-slate-950 leading-snug">
            مرحباً بك في لوحة العين
          </h2>
          <p className="text-slate-500 font-bold text-sm mt-1">
            {stats.newOrders} طلب جديد
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className={`${adminBtnSecondary} w-full sm:w-auto text-sm sm:text-base`}
          >
            الدخول للموقع ↗
          </a>
          <Link
            to="/admin/reports"
            className={`${adminBtnPrimary} w-full sm:w-auto text-sm sm:text-base`}
          >
            عرض التقارير الكاملة
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 min-w-0">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className={`${adminCardClass} hover:shadow-md transition min-h-[112px] flex flex-col justify-between min-w-0`}
          >
            <p className="text-slate-500 font-bold text-xs sm:text-sm leading-snug">{card.label}</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-950 mt-2 leading-none">{card.value}</p>
            <p className="text-alain-blue font-bold text-[11px] sm:text-sm mt-1 leading-snug">{card.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <div className={adminCardClass}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-base sm:text-xl font-black text-slate-950">الطلبات آخر 7 أيام</h2>
            <Link to="/admin/reports" className="text-alain-blue font-black text-sm">التفاصيل</Link>
          </div>
          <AdminBarChart
            items={dailySeries.map((day) => ({ label: day.label, value: day.orders }))}
            formatValue={(value) => `${value}`}
          />
        </div>

        <div className={adminCardClass}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-base sm:text-xl font-black text-slate-950">توزيع حالات الطلبات</h2>
            <Link to="/admin/orders" className="text-alain-blue font-black text-sm">عرض الكل</Link>
          </div>
          <AdminBarChart items={statusChart} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <div className={adminCardClass}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-base sm:text-xl font-black text-slate-950">آخر الطلبات</h2>
            <Link to="/admin/orders" className="text-alain-blue font-black text-sm">عرض الكل</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-slate-500 font-bold">لا توجد طلبات بعد.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50">
                  <div>
                    <p className="font-black text-slate-900">{order.order_number}</p>
                    <p className="text-sm text-slate-500 font-bold">{order.customer_name}</p>
                    <p className="text-xs font-bold text-alain-blue mt-1">{getOrderStatusLabel(order.status)}</p>
                  </div>
                  <div className="text-left">
                    <p className="font-black text-alain-blue">{formatMoney(order.total_amount)} AED</p>
                    <p className="text-xs text-slate-400 font-bold">{formatDate(order.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={adminCardClass}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-base sm:text-xl font-black text-slate-950">المنتجات</h2>
            <Link to="/admin/products/add" className="text-alain-blue font-black text-sm">إضافة منتج</Link>
          </div>
          {recentProducts.length === 0 ? (
            <p className="text-slate-500 font-bold">لا توجد منتجات.</p>
          ) : (
            <div className="space-y-3">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50">
                  {product.image_url && (
                    <img src={product.image_url} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-900 truncate">{product.name}</p>
                    <p className="text-sm text-alain-blue font-bold">{formatMoney(product.price)} AED</p>
                  </div>
                  <span className={`text-xs font-black px-2 py-1 rounded-lg ${product.is_visible ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                    {product.is_visible ? 'ظاهر' : 'مخفي'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
