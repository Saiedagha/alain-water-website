import { Link } from 'react-router-dom'
import { LOGO_URL, SITE_CONTACT, UI } from '../data/alainContent'
import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
  const { lang } = useLanguage()
  const ui = UI[lang] || UI.en
  const c = SITE_CONTACT

  const exploreLinks = [
    { to: '/products', label: ui.allProducts },
    { to: '/products', label: ui.shopByCategory },
    { to: '/about', label: ui.story },
    { to: '/news', label: ui.newsShort || 'News' },
  ]

  const usefulLinks = [
    { to: '/faq', label: ui.faq },
    { to: '/contact', label: ui.contact },
    { to: '/privacy-policy', label: ui.privacy },
    { to: '/return-policy', label: ui.refund },
    { to: '/terms', label: ui.terms },
  ]

  return (
    <footer className="mt-auto bg-alain-footer text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <img src={LOGO_URL} alt="Al Ain Water" className="mb-4 h-12 w-auto brightness-0 invert" />
            <p className="mb-3 text-sm leading-7 text-white/75">{c.address[lang] || c.address.en}</p>
            <a href={`tel:${c.phone}`} className="mb-1 block font-semibold text-white hover:text-sky-200">
              {c.phoneDisplay}
            </a>
            <p className="mb-4 text-sm text-white/60">{c.hours[lang] || c.hours.en}</p>
            <div className="mt-2 flex flex-wrap gap-3">
              {[
                { href: c.social.facebook, label: 'Facebook' },
                { href: c.social.twitter, label: 'X' },
                { href: c.social.instagram, label: 'Instagram' },
                { href: c.social.youtube, label: 'YouTube' },
                { href: c.social.tiktok, label: 'TikTok' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-xs font-bold hover:bg-white/25"
                  aria-label={s.label}
                >
                  {s.label[0]}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-black">{ui.explore}</h3>
            <ul className="space-y-2">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-white/70 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-black">{ui.usefulLinks}</h3>
            <ul className="space-y-2">
              {usefulLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-white/70 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-lg border border-white/25 bg-black/20 px-3 py-2 hover:bg-black/30"
            >
              <span className="text-2xl" aria-hidden>
                ▶
              </span>
              <span className="text-left text-xs leading-tight">
                <span className="block text-white/60">GET IT ON</span>
                <span className="font-bold">Google Play</span>
              </span>
            </a>
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-lg border border-white/25 bg-black/20 px-3 py-2 hover:bg-black/30"
            >
              <span className="text-2xl" aria-hidden>
               
              </span>
              <span className="text-left text-xs leading-tight">
                <span className="block text-white/60">Download on the</span>
                <span className="font-bold">App Store</span>
              </span>
            </a>
            <div className="flex flex-wrap items-center gap-2 rounded-md bg-white px-3 py-2">
              <span className="text-xs font-bold text-slate-800">Apple Pay</span>
              <span className="text-xs font-black tracking-widest text-[#1a1f71]">VISA</span>
              <span className="text-xs font-bold text-[#eb001b]">Mastercard</span>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/15 pt-6 text-center text-sm text-white/55">
          {ui.copyright}
        </div>
      </div>
    </footer>
  )
}
