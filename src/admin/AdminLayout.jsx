import { useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LOGO_URL } from '../data/alainContent'
import { supabase } from '../lib/supabase'
import useAdminNotifications, { getNotificationCount } from '../hooks/useAdminNotifications'

const HEADER_BLUE = '#0b4f8a'
const HEADER_BLUE_BTN = '#1565a8'
const TAB_ACTIVE = '#0b4f8a'
const TAB_ACTIVE_BG = '#e8f3fb'

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
    title: 'المتجر',
    items: [
      { label: 'المنتجات', path: '/admin/products' },
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
  { match: '/admin/site-settings', title: 'إعدادات الموقع' },
  { match: '/admin/content', title: 'المحتوى' },
  { match: '/admin/pages', title: 'الصفحات' },
]

/** Oasis-style mobile tabs (RTL: first = rightmost) */
const mobileTabs = [
  { label: 'الرئيسية', path: '/admin', end: true, icon: '🏠' },
  { label: 'الحي', path: '/admin/hayy', icon: '⟳' },
  { label: 'الطلبات', path: '/admin/orders', icon: '📋', notificationKey: 'orders' },
  { label: 'المدفوعات', path: '/admin/payments', icon: '💳', notificationKey: 'payments' },
  { label: 'التقارير', path: '/admin/reports', icon: '📊' },
]

function RefreshIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 12a9 9 0 1 1-2.64-6.36"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M21 4v6h-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ExternalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 17L17 7M17 7H9M17 7v8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function formatBadge(count) {
  if (!count) return null
  if (count > 99) return '+99'
  return String(count)
}

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
      ? 'flex items-center justify-between gap-3 bg-admin text-white px-4 py-3 rounded-xl font-black shadow-md shadow-admin/20'
      : 'flex items-center justify-between gap-3 text-slate-600 hover:text-admin-deep hover:bg-admin-soft px-4 py-3 rounded-xl font-black transition'

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
          className="flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 font-black text-admin border border-admin/20 bg-admin-soft hover:bg-emerald-100 transition"
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
    <div className="admin-shell min-h-screen w-full bg-[#f3f6f9] lg:flex lg:flex-row" dir="rtl">
      <aside className="hidden lg:flex lg:sticky lg:top-0 lg:h-screen lg:w-[260px] xl:w-[280px] lg:shrink-0 bg-white border-l border-slate-100 p-5 flex-col overflow-y-auto shadow-[-8px_0_30px_rgba(11,46,78,0.04)]">
        <div className="mb-7 px-1">
          <img src={LOGO_URL} alt="Al Ain Water" className="h-12 w-auto object-contain mb-3" />
          <h1 className="text-xl font-black text-admin-deep">لوحة العين</h1>
          <p className="text-slate-400 mt-1 text-sm font-bold">إدارة موقع Al Ain Water</p>
        </div>
        <div className="flex-1">{renderMenu()}</div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Mobile navbar — Oasis layout */}
        <header
          className="lg:hidden sticky top-0 z-[100] w-full text-white shadow-md"
          style={{ backgroundColor: HEADER_BLUE }}
        >
          <div className="flex items-center justify-between gap-2 px-3 py-2.5">
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={refreshPage}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: HEADER_BLUE_BTN }}
                aria-label="تحديث"
              >
                <RefreshIcon />
              </button>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: HEADER_BLUE_BTN }}
                aria-label="الموقع"
              >
                <ExternalIcon />
              </a>
            </div>

            <div className="text-center min-w-0 flex-1 px-1">
              <h1 className="text-[14px] font-black tracking-[0.12em] uppercase truncate">
                AL AIN WATER
              </h1>
            </div>

            <button
              type="button"
              onClick={logout}
              className="shrink-0 rounded-full px-4 py-2 text-[12px] font-black text-white"
              style={{ backgroundColor: HEADER_BLUE_BTN }}
            >
              خروج
            </button>
          </div>

          <div className="w-full bg-white text-slate-700 shadow-sm">
            <div className="admin-mobile-tabs grid grid-cols-5">
              {mobileTabs.map((tab) => {
                const active = isTabActive(tab)
                const count = getNotificationCount(notificationCounts, tab.notificationKey)
                const badge = formatBadge(count)
                return (
                  <NavLink
                    key={tab.path}
                    to={tab.path}
                    end={tab.end}
                    className="relative flex flex-col items-center justify-center gap-1 px-0.5 py-2 min-h-[62px] text-center transition"
                    style={
                      active
                        ? { color: TAB_ACTIVE, backgroundColor: TAB_ACTIVE_BG }
                        : { color: '#64748b' }
                    }
                  >
                    <span className="relative text-[17px] leading-none">
                      {tab.icon}
                      {badge && (
                        <span className="absolute -top-2 -left-3 min-w-[18px] h-[16px] px-1 rounded-full bg-red-500 text-white text-[8px] font-black flex items-center justify-center leading-none">
                          {badge}
                        </span>
                      )}
                    </span>
                    <span className="block text-[10px] font-black leading-tight px-0.5">
                      {tab.label}
                    </span>
                    {active && (
                      <span
                        className="absolute inset-x-3 bottom-0 h-[3px] rounded-full"
                        style={{ backgroundColor: TAB_ACTIVE }}
                      />
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        </header>

        <div className="hidden lg:flex bg-white/80 backdrop-blur border-b border-slate-100 px-4 xl:px-8 py-4 items-center justify-between gap-4 min-w-0">
          <div className="min-w-0">
            <p className="text-xs font-bold text-admin mb-0.5">Al Ain Water Admin</p>
            <h1 className="text-xl xl:text-2xl font-black text-admin-deep truncate">{currentPageTitle}</h1>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 bg-admin text-white px-5 py-2.5 rounded-full font-black hover:bg-admin-dark transition text-sm"
          >
            الموقع ↗
          </a>
        </div>

        <main className="flex-1 min-w-0 overflow-x-hidden">
          <div className="w-full min-w-0 px-3 py-4 sm:px-4 md:p-6 lg:p-6 xl:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
