import { Link, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import { CATEGORIES, LOGO_URL, NAV_PRODUCT_LINKS, SITE_CONTACT, UI } from '../data/alainContent'
import useProducts from '../hooks/useProducts'

function IconSearch({ className = 'w-[22px] h-[22px]' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="11" cy="11" r="6.4" />
      <path d="M16.4 16.4L21 21" strokeLinecap="round" />
    </svg>
  )
}

function IconCart({ className = 'w-[22px] h-[22px]' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 5h2l1.15 10a1.4 1.4 0 001.4 1.25h8.7a1.4 1.4 0 001.4-1.25L20 8H7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="20" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="17" cy="20" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconMenu() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  )
}

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  )
}

function IconLogin() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="10" height="16" rx="1.5" />
      <path d="M13 12h8M17 8l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconUser({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
      <path d="M4 20c1.4-3.2 4-4.8 8-4.8s6.6 1.6 8 4.8" strokeLinecap="round" />
    </svg>
  )
}

function SocialIcon({ type }) {
  const common = 'w-4 h-4 fill-current'
  if (type === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" className={common}>
        <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4V10c0-.6.4-1 1-1z" />
      </svg>
    )
  }
  if (type === 'x') {
    return (
      <svg viewBox="0 0 24 24" className={common}>
        <path d="M4 4l6.5 8.2L4.3 20H7l4.5-5.5L15.8 20H20l-6.7-8.4L19.5 4H17l-4.1 5L9 4H4z" />
      </svg>
    )
  }
  if (type === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" className={common}>
        <path d="M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm5 5.2A3.8 3.8 0 1015.8 12 3.8 3.8 0 0012 8.2zm5.1-.9a.9.9 0 10.9.9.9.9 0 00-.9-.9z" />
      </svg>
    )
  }
  if (type === 'youtube') {
    return (
      <svg viewBox="0 0 24 24" className={common}>
        <path d="M23 12.2s0-3.2-.4-4.7a2.9 2.9 0 00-2-2C18.8 5 12 5 12 5s-6.8 0-8.6.5a2.9 2.9 0 00-2 2C1 9 1 12.2 1 12.2s0 3.2.4 4.7a2.9 2.9 0 002 2c1.8.5 8.6.5 8.6.5s6.8 0 8.6-.5a2.9 2.9 0 002-2c.4-1.5.4-4.7.4-4.7zM9.8 15.5v-6.6l5.7 3.3-5.7 3.3z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className={common}>
      <path d="M16.5 3c-1.3 1.3-2.2 3-2.4 4.8h-2.4c0-1.5.5-3.1 1.4-4.5C12.1 2.1 11 2 9.8 2 5.5 2 3 5.8 3 10.4c0 2.7 1.1 5.1 3.1 6.7v4.9h3.3v-4.3c.5.1 1 .1 1.5.1s1 0 1.5-.1v4.3h3.3v-4.9c2-1.6 3.1-4 3.1-6.7 0-1.7-.4-3.2-1.1-4.5-.6.5-1.4.8-2.2.8z" />
    </svg>
  )
}

function UtilityIcons({ count, onSearch, cartTo = '/cart' }) {
  return (
    <div className="flex items-center gap-3 text-[#2c3e50]">
      <button type="button" className="p-0.5" aria-label="Search" onClick={onSearch}>
        <IconSearch />
      </button>
      <Link to={cartTo} className="relative p-0.5" aria-label="Cart">
        <IconCart />
        <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-[#1a7fc2] text-white text-[10px] font-bold flex items-center justify-center leading-none">
          {count}
        </span>
      </Link>
    </div>
  )
}

export default function Navbar() {
  const { lang, setLang } = useLanguage()
  const ui = UI[lang] || UI.en
  const { count } = useCart()
  const { products: allProducts } = useProducts()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const productsRef = useRef(null)

  useEffect(() => {
    setMobileOpen(false)
    setSearchOpen(false)
    setProductsOpen(false)
    setMobileProductsOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!mobileOpen) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.classList.add('mobile-menu-open')
    return () => {
      document.body.style.overflow = prev
      document.documentElement.classList.remove('mobile-menu-open')
    }
  }, [mobileOpen])

  useEffect(() => {
    const handler = (e) => {
      if (productsRef.current && !productsRef.current.contains(e.target)) {
        setProductsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggleLang = () => setLang(lang === 'ar' ? 'en' : 'ar')
  const filtered = query.trim()
    ? allProducts
        .filter((p) => {
          const q = query.toLowerCase()
          return (
            (p.name?.en || '').toLowerCase().includes(q) ||
            (p.name?.ar || '').includes(query)
          )
        })
        .slice(0, 8)
    : []

  const socials = [
    { type: 'facebook', href: SITE_CONTACT.social.facebook },
    { type: 'x', href: SITE_CONTACT.social.twitter },
    { type: 'instagram', href: SITE_CONTACT.social.instagram },
    { type: 'youtube', href: SITE_CONTACT.social.youtube },
    { type: 'tiktok', href: SITE_CONTACT.social.tiktok },
  ]

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
        {/* —— Mobile header: menu | logo center | icons —— */}
        <div className="lg:hidden relative flex items-center justify-between h-[58px] px-4">
          <button
            type="button"
            className="p-1 text-[#2c3e50] z-10"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <IconMenu />
          </button>

          <Link to="/" className="absolute left-1/2 -translate-x-1/2 z-10">
            <img src={LOGO_URL} alt="Al Ain Water" className="h-11 w-auto object-contain" />
          </Link>

          <div className="z-10">
            <UtilityIcons count={count} onSearch={() => setSearchOpen((o) => !o)} />
          </div>
        </div>

        {/* —— Desktop header —— */}
        <div className="hidden lg:block">
          <div className="mx-auto max-w-[1320px] px-5 xl:px-8">
            <div className="flex h-[74px] items-center justify-between gap-5">
              <Link to="/" className="shrink-0">
                <img src={LOGO_URL} alt="Al Ain Water" className="h-[44px] w-auto object-contain" />
              </Link>

              <nav className="flex items-center gap-8 text-[14px] font-semibold tracking-[0.02em] text-slate-800">
                <div className="relative" ref={productsRef}>
                  <button
                    type="button"
                    onClick={() => setProductsOpen((o) => !o)}
                    className="inline-flex items-center gap-1 hover:text-alain-blue transition"
                  >
                    {ui.products}
                    <span className="text-[10px] opacity-60">▾</span>
                  </button>
                  {productsOpen && (
                    <div className="absolute top-full mt-3 start-0 min-w-[240px] bg-white py-2 z-50 shadow-lg border border-slate-100">
                      {NAV_PRODUCT_LINKS.map((link) => (
                        <Link
                          key={link.slug}
                          to={`/collections/${link.slug}`}
                          className="block px-4 py-2.5 text-sm hover:bg-slate-50 hover:underline"
                          onClick={() => setProductsOpen(false)}
                        >
                          {link.title[lang] || link.title.en}
                        </Link>
                      ))}
                      <Link
                        to="/products"
                        className="mt-1 block border-t border-slate-100 px-4 py-2.5 text-sm font-semibold text-alain-blue hover:bg-slate-50"
                        onClick={() => setProductsOpen(false)}
                      >
                        {ui.allProducts}
                      </Link>
                    </div>
                  )}
                </div>
                <Link to="/about" className="hover:text-alain-blue transition">
                  {ui.story}
                </Link>
                <Link to="/contact" className="hover:text-alain-blue transition">
                  {ui.contact}
                </Link>
                <Link to="/faq" className="hover:text-alain-blue transition">
                  {ui.faq}
                </Link>
              </nav>

              <div className="flex items-center gap-5 text-slate-700">
                <UtilityIcons count={count} onSearch={() => setSearchOpen((o) => !o)} />
                <button
                  type="button"
                  onClick={toggleLang}
                  className="inline-flex items-center gap-1 text-sm font-semibold hover:text-alain-blue"
                >
                  {ui.langSwitch}
                  <span className="text-[10px] opacity-60">▾</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {searchOpen && (
          <div className="px-4 lg:px-6 pb-4 max-w-7xl mx-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={ui.searchPlaceholder}
              className="w-full border border-slate-200 rounded-full px-5 py-3 outline-none focus:border-alain-blue"
              autoFocus
            />
            {filtered.length > 0 && (
              <div className="mt-2 bg-white border border-slate-100 rounded-2xl shadow-lg overflow-hidden">
                {filtered.map((p) => (
                  <Link
                    key={p.id}
                    to={`/products/${p.slug}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0"
                    onClick={() => {
                      setSearchOpen(false)
                      setQuery('')
                    }}
                  >
                    <img src={p.image} alt="" className="w-12 h-12 object-contain" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{p.name[lang] || p.name.en}</p>
                      <p className="text-xs text-alain-blue">
                        {p.price.toFixed(2)} {ui.aed}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      {/* —— Full-screen mobile menu (exact reference layout) —— */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-white flex flex-col" dir="ltr">
          {/* Menu header */}
          <div className="relative flex items-center justify-between h-[58px] px-4 border-b border-slate-100 shrink-0">
            <button type="button" className="p-1 text-[#8a94a0] z-10" aria-label="Close" onClick={closeMobile}>
              <IconClose />
            </button>
            <Link to="/" className="absolute left-1/2 -translate-x-1/2" onClick={closeMobile}>
              <img src={LOGO_URL} alt="Al Ain Water" className="h-11 w-auto object-contain" />
            </Link>
            <div className="z-10">
              <UtilityIcons
                count={count}
                onSearch={() => {
                  closeMobile()
                  setSearchOpen(true)
                }}
              />
            </div>
          </div>

          {/* Nav links */}
          <div className="flex-1 overflow-y-auto">
            <nav className="px-5 pt-1">
              <button
                type="button"
                onClick={() => setMobileProductsOpen((o) => !o)}
                className="w-full flex items-center justify-between py-4 border-b border-slate-200 text-[17px] font-medium text-[#2c3e50]"
              >
                <span>{ui.products}</span>
                <span className={`text-slate-400 transition ${mobileProductsOpen ? 'rotate-90' : ''}`}>›</span>
              </button>
              {mobileProductsOpen && (
                <div className="border-b border-slate-200 bg-slate-50/80">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/collections/${cat.slug}`}
                      onClick={closeMobile}
                      className="block px-4 py-3 text-[15px] text-slate-600 border-b border-slate-100 last:border-0"
                    >
                      {cat.title[lang] || cat.title.en}
                    </Link>
                  ))}
                  <Link
                    to="/products"
                    onClick={closeMobile}
                    className="block px-4 py-3 text-[15px] font-semibold text-alain-blue"
                  >
                    {ui.allProducts}
                  </Link>
                </div>
              )}
              <Link
                to="/about"
                onClick={closeMobile}
                className="block py-4 border-b border-slate-200 text-[17px] font-medium text-[#2c3e50]"
              >
                {ui.story}
              </Link>
              <Link
                to="/contact"
                onClick={closeMobile}
                className="block py-4 border-b border-slate-200 text-[17px] font-medium text-[#2c3e50]"
              >
                {ui.contact}
              </Link>
              <Link
                to="/faq"
                onClick={closeMobile}
                className="block py-4 border-b border-slate-200 text-[17px] font-medium text-[#2c3e50]"
              >
                {ui.faq}
              </Link>
            </nav>

            {/* Socials */}
            <div className="flex items-center justify-center gap-3 px-5 pt-10 pb-6">
              {socials.map((s) => (
                <a
                  key={s.type}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-11 h-11 rounded-full bg-[#e8f1f8] text-[#1a3a5c] flex items-center justify-center"
                  aria-label={s.type}
                >
                  <SocialIcon type={s.type} />
                </a>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="shrink-0 border-t border-slate-200 relative pt-5 pb-4 px-4">
            <a
              href={`https://wa.me/${SITE_CONTACT.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="absolute -top-7 left-4 flex flex-col items-center"
            >
              <span className="w-[54px] h-[54px] rounded-full bg-[#25D366] shadow-lg flex items-center justify-center">
                <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white" aria-hidden>
                  <path d="M16.1 4C9.6 4 4.3 9.3 4.3 15.8c0 2.1.6 4.1 1.6 5.9L4 28l6.5-1.7c1.7.9 3.6 1.4 5.6 1.4 6.5 0 11.8-5.3 11.8-11.8S22.6 4 16.1 4zm0 21.5c-1.8 0-3.5-.5-5-1.3l-.4-.2-3.8 1 1-3.7-.2-.4c-1-1.6-1.5-3.4-1.5-5.2 0-5.4 4.4-9.8 9.8-9.8s9.8 4.4 9.8 9.8-4.3 9.8-9.7 9.8zm5.4-7.3c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-1.7-.8-2.8-1.5-3.9-3.4-.3-.5.3-.5.8-1.6.1-.2 0-.3 0-.5l-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 1.8.8 2.5.8 3.4.7.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4 0-.1-.2-.2-.5-.3z" />
                </svg>
              </span>
              <span className="text-[11px] text-slate-500 mt-1 font-medium">{ui.chatWithUs}</span>
            </a>

            <div className="flex items-center justify-end gap-3 pr-1 text-[15px] font-medium text-[#2c3e50] mb-4">
              <button
                type="button"
                onClick={() => {
                  closeMobile()
                  window.location.assign('/admin/login')
                }}
                className="inline-flex items-center gap-1.5 text-[#1a7fc2]"
              >
                <IconLogin />
                <span>{ui.login}</span>
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={() => {
                  closeMobile()
                  window.location.assign('/admin/login')
                }}
                className="inline-flex items-center gap-1.5 text-[#1a7fc2]"
              >
                <IconUser className="w-4 h-4" />
                <span>{ui.signUp || 'Sign Up'}</span>
              </button>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={toggleLang}
                className="inline-flex items-center gap-1 text-[14px] text-[#2c3e50] font-medium"
              >
                {ui.langSwitch}
                <span className="text-[10px] text-slate-400">▾</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
