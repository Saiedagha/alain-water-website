import { useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LOGO_URL } from '../data/alainContent'
import { supabase } from '../lib/supabase'
import useAdminNotifications, { getNotificationCount } from '../hooks/useAdminNotifications'

const menuSections = [
  {
    title: 'الرئيسية',
    items: [
      { label: 'لوحة التحكم', path: '/admin', end: true },
      { label: 'الحي', path: '/admin/hayy' },
      { label: 'التقارير', path: '/admin/reports' },
    ],
  },
  {
    title: 'المبيعات',
    items: [
      { label: 'الطلبات', path: '/admin/orders', notificationKey: 'orders' },
      { label: 'المدفوعات', path: '/admin/payments', notificationKey: 'payments' },
    ],
  },
  {
    title: 'المحتوى',
    items: [
      { label: 'المنتجات', path: '/admin/products' },
      { label: 'إضافة منتج', path: '/admin/products/add' },
      { label: 'رسائل التواصل', path: '/admin/contact-messages', notificationKey: 'messages' },
    ],
  },
]

const pageTitles = [
  { match: '/admin/hayy', title: 'الحي' },
  { match: '/admin/reports', title: 'التقارير' },
  { match: '/admin/payments', title: 'المدفوعات' },
  { match: '/admin/orders', title: 'الطلبات' },
  { match: '/admin/contact-messages', title: 'رسائل التواصل' },
  { match: '/admin/products/add', title: 'إضافة منتج' },
  { match: '/admin/products/edit', title: 'تعديل منتج' },
  { match: '/admin/products', title: 'المنتجات' },
]

const mobileTabs = [
  { label: 'الرئيسية', path: '/admin', end: true, icon: '🏠' },
  { label: 'الحي', path: '/admin/hayy', icon: '⟳' },
  { label: 'الطلبات', path: '/admin/orders', icon: '📋', notificationKey: 'orders' },
  { label: 'المدفوعات', path: '/admin/payments', icon: '💳', notificationKey: 'payments' },
  { label: 'التقارير', path: '/admin/reports', icon: '📊' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const notificationCounts = useAdminNotifications()

  const logout = async () => {
    if (supabase) await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const currentPageTitle =
    pageTitles.find((item) => location.pathname.startsWith(item.match))?.title || 'لوحة التحكم'

  const isTabActive = (tab) => {
    if (tab.end) return location.pathname === tab.path
    return location.pathname === tab.path || location.pathname.startsWith(`${tab.path}/`)
  }

  const refreshPage = () => {
    window.location.reload()
  }

  useEffect(() => {
    document.body.style.overflow = ''
  }, [location.pathname])

  const linkClass = ({ isActive }) =>
    isActive
      ? 'flex items-center justify-between gap-3 bg-alain-blue text-white px-4 py-3 rounded-xl font-black shadow-md shadow-alain-blue/20'
      : 'flex items-center justify-between gap-3 text-slate-600 hover:text-alain-navy hover:bg-sky-50 px-4 py-3 rounded-xl font-black transition'

  const renderBadge = (count) => {
    if (!count) return null
    const label = count > 99 ? '99+' : count
    return (
      <span className="min-w-[22px] h-5 px-1.5 rounded-full text-[10px] font-black flex items-center justify-center bg-red-500 text-white">
        {label}
      </span>
    )
  }

  const renderMenu = () => (
    <nav className="space-y-5">
      {menuSections.map((section) => (
        <div key={section.title}>
          <p className="px-3 mb-2 text-[11px] font-black uppercase tracking-wider text-slate-400">
            {section.title}
          </p>
          <div className="space-y-1">
            {section.items.map((item) => (
              <NavLink key={item.path} to={item.path} end={item.end} className={linkClass}>
                {() => (
                  <>
                    <span>{item.label}</span>
                    {renderBadge(getNotificationCount(notificationCounts, item.notificationKey))}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      ))}

      <div className="pt-3 border-t border-slate-100 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 font-black text-alain-blue border border-alain-blue/20 bg-sky-50 hover:bg-sky-100 transition"
        >
          عرض الموقع ↗
        </a>
        <button
          type="button"
          onClick={logout}
          className="w-full text-right text-slate-500 hover:text-red-600 hover:bg-red-50 px-4 py-3 rounded-xl font-black transition"
        >
          تسجيل الخروج
        </button>
      </div>
    </nav>
  )

  return (
    <div className="admin-shell min-h-screen w-full bg-[#f0f7fc] lg:flex lg:flex-row" dir="rtl">
      {/* Desktop sidebar — light (different from Oasis dark teal) */}
      <aside className="hidden lg:flex lg:sticky lg:top-0 lg:h-screen lg:w-[280px] lg:shrink-0 bg-white border-l border-slate-100 p-5 flex-col overflow-y-auto shadow-[ -8px_0_30px_rgba(11,46,78,0.04)]">
        <div className="mb-7 px-1">
          <img src={LOGO_URL} alt="Al Ain Water" className="h-12 w-auto object-contain mb-3" />
          <h1 className="text-xl font-black text-alain-navy">لوحة العين</h1>
          <p className="text-slate-400 mt-1 text-sm font-bold">إدارة موقع Al Ain Water</p>
        </div>
        <div className="flex-1">{renderMenu()}</div>
      </aside>

      {/* Mobile header — Al Ain blue */}
      <header className="lg:hidden sticky top-0 z-[100] w-full bg-gradient-to-l from-alain-navy to-alain-blue text-white shadow-md">
        <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-3">
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={refreshPage}
              className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center font-black"
              aria-label="تحديث"
            >
              ⟳
            </button>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center font-black"
              aria-label="الموقع"
            >
              ↗
            </a>
          </div>
          <div className="text-center min-w-0 flex-1 px-1 flex flex-col items-center">
            <img src={LOGO_URL} alt="" className="h-7 w-auto object-contain bg-white rounded-md px-1.5 py-0.5 mb-1" />
            <h1 className="text-xs font-black leading-tight truncate">لوحة العين</h1>
          </div>
          <button
            type="button"
            onClick={logout}
            className="shrink-0 rounded-xl bg-white/15 border border-white/20 px-2.5 py-2 text-[11px] font-black"
          >
            خروج
          </button>
        </div>

        <div className="w-full bg-white text-slate-800 border-t border-white/10">
          <div className="admin-mobile-tabs">
            {mobileTabs.map((tab) => {
              const active = isTabActive(tab)
              const count = getNotificationCount(notificationCounts, tab.notificationKey)
              return (
                <NavLink
                  key={tab.path}
                  to={tab.path}
                  end={tab.end}
                  className={`relative flex flex-col items-center justify-center gap-1 px-1 py-2.5 min-h-[64px] text-center transition ${
                    active ? 'text-alain-blue bg-sky-50' : 'text-slate-500'
                  }`}
                >
                  <span className="relative text-base leading-none">{tab.icon}</span>
                  <span className="block text-[10px] font-black leading-tight px-0.5">{tab.label}</span>
                  {count > 0 && (
                    <span className="absolute top-1.5 left-1.5 min-w-[15px] h-[15px] px-1 rounded-full bg-red-500 text-white text-[8px] font-black flex items-center justify-center">
                      {count > 99 ? '99+' : count}
                    </span>
                  )}
                  {active && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-alain-blue" />}
                </NavLink>
              )
            })}
          </div>
        </div>
      </header>

      <main className="flex-1 min-w-0 min-h-screen overflow-x-hidden">
        <div className="hidden lg:flex bg-white/80 backdrop-blur border-b border-slate-100 px-4 xl:px-8 py-4 items-center justify-between gap-4 min-w-0">
          <div>
            <p className="text-xs font-bold text-alain-blue mb-0.5">Al Ain Water Admin</p>
            <h1 className="text-xl xl:text-2xl font-black text-alain-navy truncate">{currentPageTitle}</h1>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 bg-alain-blue text-white px-5 py-2.5 rounded-full font-black hover:bg-alain-blue-dark transition text-sm"
          >
            الموقع ↗
          </a>
        </div>
        <div className="w-full min-w-0 px-3 py-4 sm:px-4 md:p-6 lg:p-6 xl:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
