import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LOGO_URL, SITE_CONTACT, UI } from '../data/alainContent'
import { useLanguage } from '../context/LanguageContext'

const socialLinks = [
  {
    label: 'Facebook',
    href: SITE_CONTACT.social.facebook,
    icon: (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
        <path d="M13.5 8.5H16V6h-2.5c-2 0-3.5 1.5-3.5 3.6V12H8v2.5h2V20h2.5v-5.5h2.1l.4-2.5h-2.5V9.2c0-.4.3-.7.9-.7Z" />
      </svg>
    ),
  },
  {
    label: 'X',
    href: SITE_CONTACT.social.twitter,
    icon: (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
        <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: SITE_CONTACT.social.instagram,
    icon: (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
        <rect x="5" y="5" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="3.1" fill="currentColor" />
        <circle cx="16.3" cy="7.8" r="1.05" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: SITE_CONTACT.social.youtube,
    icon: (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
        <path d="M21.1 8.5a2.2 2.2 0 0 0-1.55-1.56C18.2 6.6 12 6.6 12 6.6s-6.2 0-7.55.34A2.2 2.2 0 0 0 2.9 8.5 23 23 0 0 0 2.6 12a23 23 0 0 0 .3 3.5 2.2 2.2 0 0 0 1.55 1.56c1.35.34 7.55.34 7.55.34s6.2 0 7.55-.34a2.2 2.2 0 0 0 1.55-1.56A23 23 0 0 0 21.4 12a23 23 0 0 0-.3-3.5ZM10.4 15.1V8.9L15.9 12l-5.5 3.1Z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: SITE_CONTACT.social.tiktok,
    icon: (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
        <path d="M15.7 6.3c.5 1 1.3 1.9 2.3 2.4v2.1c-1.2 0-2.4-.4-3.4-1.1v4.6a4.3 4.3 0 1 1-4.4-4.3v2.1a2.1 2.1 0 1 0 2.3 2.1V3.9h2.2c0 .8.3 1.6.9 2.4Z" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: `https://wa.me/${SITE_CONTACT.whatsapp}`,
    icon: (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
        <path d="M12 3a8.9 8.9 0 0 0-7.7 13.4L3 21l4.8-1.2A8.9 8.9 0 1 0 12 3Zm0 16.2a7.2 7.2 0 0 1-3.7-1l-.3-.2-2.8.7.8-2.7-.2-.3A7.2 7.2 0 1 1 12 19.2Zm4.1-5.4c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.1.2-.6.8-.7 1-.1.1-.3.1-.5 0a5.9 5.9 0 0 1-1.7-1.1 6.5 6.5 0 0 1-1.1-1.4c-.1-.2 0-.3.1-.4l.4-.5c.1-.1.1-.3.2-.4 0-.1 0-.2 0-.4-.1-.1-.5-1.3-.7-1.7-.2-.4-.4-.3-.5-.3h-.4c-.1 0-.4.1-.6.3-.2.2-.8.7-.8 1.7s.8 1.9.9 2.1c.1.2 1.5 2.4 3.6 3.4.5.2.9.4 1.2.5.5.2 1 .1 1.4.1.4-.1 1.4-.6 1.6-1.2.2-.6.2-1 .1-1.1-.1-.1-.2-.1-.4-.2Z" />
      </svg>
    ),
  },
]

const exploreLinks = [
  { to: '/products', label: 'All Products' },
  { to: '/products', label: 'Shop by Category' },
  { to: '/about', label: 'Our Story' },
  { to: '/news', label: 'News' },
]

const usefulLinks = [
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/return-policy', label: 'Refund Policy' },
  { to: '/terms', label: 'Terms of Service' },
]

function StoreBadge({ type }) {
  if (type === 'google') {
    return (
      <a
        href="https://play.google.com/store"
        target="_blank"
        rel="noreferrer"
        className="flex h-[72px] w-full max-w-[360px] items-center rounded-[12px] border border-white/80 bg-black px-4 text-white shadow-[0_1px_0_rgba(255,255,255,0.08)] md:h-[46px] md:w-[134px] md:max-w-none md:rounded-[4px] md:px-3"
      >
        <svg viewBox="0 0 24 24" className="mr-3 h-8 w-8 md:mr-2 md:h-6 md:w-6" aria-hidden>
          <path d="M3 2.8 13.7 13.5 3 24V2.8Z" fill="#34A853" />
          <path d="M3 2.8 13.7 13.5 10.2 17 3 2.8Z" fill="#FBBC05" />
          <path d="M3 24 10.2 17l3.5 3.5L3 24Z" fill="#EA4335" />
          <path d="M10.2 17 13.7 13.5 21 17.9c.5.3.5 1 0 1.3L13.7 24l-3.5-7Z" fill="#4285F4" />
        </svg>
        <span className="leading-none">
          <span className="block text-[13px] font-medium text-white/95 md:text-[10px]">GET IT ON</span>
          <span className="block text-[28px] font-medium -mt-0.5 md:text-[18px]">Google Play</span>
        </span>
      </a>
    )
  }

  return (
    <a
      href="https://apps.apple.com"
      target="_blank"
      rel="noreferrer"
      className="flex h-[72px] w-full max-w-[360px] items-center rounded-[12px] border border-white/80 bg-black px-4 text-white shadow-[0_1px_0_rgba(255,255,255,0.08)] md:h-[46px] md:w-[134px] md:max-w-none md:rounded-[4px] md:px-3"
    >
      <svg viewBox="0 0 24 24" className="mr-3 h-7 w-7 md:mr-2 md:h-5 md:w-5" fill="currentColor" aria-hidden>
        <path d="M16.8 12.6c0-2.2 1.8-3.2 1.9-3.3-1-1.4-2.6-1.6-3.2-1.6-1.3-.1-2.5.8-3.2.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.9.9-3.7 2.2-1.6 2.8-.4 6.9 1.1 9.1.8 1.1 1.8 2.4 3.1 2.3 1.1 0 1.5-.7 2.9-.7s1.8.7 3.1.7c1.3 0 2.1-1.1 2.9-2.3.9-1.3 1.2-2.6 1.2-2.7-.1 0-2.3-.9-2.3-3.7Z" />
        <path d="M14.7 4.9c.6-.8 1-1.9.9-3.1-.9.1-2 .6-2.7 1.4-.6.7-1.1 1.8-.9 2.9 1 .1 2-.5 2.7-1.2Z" />
      </svg>
      <span className="leading-none">
        <span className="block text-[13px] font-medium text-white/95 md:text-[10px]">Download on the</span>
        <span className="block text-[28px] font-medium -mt-0.5 md:text-[17px]">App Store</span>
      </span>
    </a>
  )
}

function PaymentChip({ children, className = '' }) {
  return (
    <span className={`inline-flex h-7 items-center justify-center rounded-sm bg-white px-3 text-[13px] font-semibold leading-none ${className}`}>
      {children}
    </span>
  )
}

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path d="M5 9l7 7 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DesktopFooter() {
  const { lang } = useLanguage()
  const c = SITE_CONTACT

  return (
    <div className="footer-grid footer-desktop-only">
      <div className="max-w-[250px]">
        <img src={LOGO_URL} alt="Al Ain Water" className="mb-4 h-14 w-auto md:h-16" />
        <p className="max-w-[225px] text-[13px] leading-5 text-white">{c.address[lang] || c.address.en}</p>
        <div className="mt-6 space-y-1.5 text-[13px] leading-5 text-white">
          <a href={`tel:${c.phone}`} className="block font-semibold hover:opacity-90">
            {c.phoneDisplay}
          </a>
          <p className="font-semibold">{c.hours[lang] || c.hours.en}</p>
        </div>

        <div className="footer-social-row mt-6 text-white">
          {socialLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="footer-social-link hover:opacity-85"
              aria-label={item.label}
            >
              {item.icon}
            </a>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-[14px] font-normal leading-none text-white">Explore</h3>
        <ul className="space-y-3 text-[13px] leading-5 text-white">
          {exploreLinks.map((link) => (
            <li key={link.label}>
              <Link to={link.to} className="hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-4 text-[14px] font-normal leading-none text-white">Useful Links</h3>
        <ul className="space-y-3 text-[13px] leading-5 text-white">
          {usefulLinks.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className="hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="footer-store-badges md:pt-1 lg:pt-0.5">
        <StoreBadge type="google" />
        <StoreBadge type="apple" />

        <div className="mt-1 flex items-center gap-1.5 rounded-sm bg-transparent">
          <PaymentChip className="min-w-[48px] px-2 text-[12px] tracking-[-0.02em] text-slate-900">
            <span className="mr-0.5 text-[11px]"></span>Pay
          </PaymentChip>
          <PaymentChip className="min-w-[48px] text-[12px] tracking-[0.06em] text-[#1a3ea6]">VISA</PaymentChip>
          <PaymentChip className="min-w-[48px] px-2 text-[#ea001b]">
            <span className="relative flex h-3.5 w-6 items-center justify-center">
              <span className="absolute left-0 h-3.5 w-3.5 rounded-full bg-[#ea001b] opacity-90" />
              <span className="absolute right-0 h-3.5 w-3.5 rounded-full bg-[#f79e1b] opacity-90" />
            </span>
          </PaymentChip>
        </div>
      </div>
    </div>
  )
}

function MobileFooter() {
  const { lang } = useLanguage()
  const c = SITE_CONTACT
  const copyright = UI[lang]?.copyright || UI.en.copyright
  const [mobileOpen, setMobileOpen] = useState(null)

  const toggleMobile = (key) => {
    setMobileOpen((current) => (current === key ? null : key))
  }

  return (
    <div className="footer-mobile-only">
      <img src={LOGO_URL} alt="Al Ain Water" className="h-[60px] w-auto" />
      <p className="mt-6 max-w-[300px] text-[15px] leading-[1.4] text-white">{c.address[lang] || c.address.en}</p>

      <div className="mt-8 space-y-1.5 text-[15px] font-semibold leading-5 text-white">
        <a href={`tel:${c.phone}`} className="block hover:opacity-90">
          {c.phoneDisplay}
        </a>
        <p>{c.hours[lang] || c.hours.en}</p>
      </div>

      <div className="footer-social-row mt-8 text-white">
        {socialLinks.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="footer-social-link hover:opacity-85"
            aria-label={item.label}
          >
            {item.icon}
          </a>
        ))}
      </div>

      <div className="mt-6 border-t border-white/80">
        <button
          type="button"
          onClick={() => toggleMobile('explore')}
          className="flex w-full items-center justify-between py-5 text-left text-[19px] font-normal text-white"
          aria-expanded={mobileOpen === 'explore'}
        >
          <span>Explore</span>
          <span className={`transition-transform ${mobileOpen === 'explore' ? 'rotate-180' : ''}`}>
            <Chevron />
          </span>
        </button>
        {mobileOpen === 'explore' && (
          <div className="pb-4 text-[16px] leading-7 text-white">
            {exploreLinks.map((link) => (
              <div key={link.label} className="py-1">
                <Link to={link.to} className="hover:underline">
                  {link.label}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-white/80">
        <button
          type="button"
          onClick={() => toggleMobile('useful')}
          className="flex w-full items-center justify-between py-5 text-left text-[19px] font-normal text-white"
          aria-expanded={mobileOpen === 'useful'}
        >
          <span>Useful Links</span>
          <span className={`transition-transform ${mobileOpen === 'useful' ? 'rotate-180' : ''}`}>
            <Chevron />
          </span>
        </button>
        {mobileOpen === 'useful' && (
          <div className="pb-4 text-[16px] leading-7 text-white">
            {usefulLinks.map((link) => (
              <div key={link.to} className="py-1">
                <Link to={link.to} className="hover:underline">
                  {link.label}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-6">
        <StoreBadge type="google" />
        <div className="mt-4">
          <StoreBadge type="apple" />
        </div>
        <div className="mt-4 flex items-center gap-1.5 rounded-sm bg-transparent">
          <PaymentChip className="min-w-[48px] px-2 text-[12px] tracking-[-0.02em] text-slate-900">
            <span className="mr-0.5 text-[11px]"></span>Pay
          </PaymentChip>
          <PaymentChip className="min-w-[48px] text-[12px] tracking-[0.06em] text-[#1a3ea6]">VISA</PaymentChip>
          <PaymentChip className="min-w-[48px] px-2 text-[#ea001b]">
            <span className="relative flex h-3.5 w-6 items-center justify-center">
              <span className="absolute left-0 h-3.5 w-3.5 rounded-full bg-[#ea001b] opacity-90" />
              <span className="absolute right-0 h-3.5 w-3.5 rounded-full bg-[#f79e1b] opacity-90" />
            </span>
          </PaymentChip>
        </div>
      </div>

      <div className="footer-mobile-copyright mt-14 border-t border-white/15 pt-4 text-[12px] text-white/85">{copyright}</div>
    </div>
  )
}

export default function Footer() {
  const { lang } = useLanguage()
  const copyright = UI[lang]?.copyright || UI.en.copyright

  return (
    <footer className="mt-auto text-white" style={{ backgroundColor: '#2f68d6' }}>
      <div className="mx-auto max-w-[1120px] px-4 pb-8 pt-7 sm:px-6 md:px-8 md:pb-7 md:pt-8 lg:px-6 lg:pt-10">
        <MobileFooter />
        <DesktopFooter />
        <div className="footer-desktop-copyright mt-16 border-t border-white/15 pt-4 text-[12px] text-white/85 md:mt-20 md:pt-6">{copyright}</div>
      </div>
    </footer>
  )
}