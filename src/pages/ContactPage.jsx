import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import useSiteSettings from '../hooks/useSiteSettings'
import { submitContactMessage } from '../lib/contactForm'
import PageHero from '../components/PageHero'
import SeoMeta from '../components/SeoMeta'
import { PAGE_SEO } from '../data/seo'
import { SITE_CONTACT } from '../data/alainContent'

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function ContactPage() {
  const { t, lang } = useLanguage()
  const { settings } = useSiteSettings()
  const isAr = lang === 'ar' || lang === 'ur'
  const seo = PAGE_SEO.contact

  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const email = settings.email || SITE_CONTACT.email
  const whatsappRaw = settings.whatsapp || SITE_CONTACT.whatsapp
  const whatsappDigits = String(whatsappRaw).replace(/\D/g, '') || '971547866055'
  const whatsappDisplay = `+${whatsappDigits}`
  const location =
    (isAr ? settings.address_ar || settings.address : settings.address) ||
    SITE_CONTACT.address[isAr ? 'ar' : 'en']
  const hours =
    (isAr ? settings.hours_ar || settings.hours : settings.hours) ||
    SITE_CONTACT.hours[isAr ? 'ar' : 'en']

  const info = [
    {
      label: t.contact.whatsapp,
      value: whatsappDisplay,
      href: `https://wa.me/${whatsappDigits}`,
      icon: <WhatsAppIcon />,
    },
    { label: t.contact.email, value: email, href: `mailto:${email}`, icon: '✉️' },
    { label: t.contact.location, value: location, href: '#', icon: '📍' },
    { label: t.contact.hours, value: hours, href: '#', icon: '🕐' },
  ]

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    const formData = new FormData(event.target)
    const result = await submitContactMessage({
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      subject: t.contact.title,
    })

    setSubmitting(false)

    if (!result.ok) {
      setError(result.error || 'تعذر إرسال الرسالة')
      return
    }

    setSent(true)
    event.target.reset()
  }

  return (
    <>
      <SeoMeta title={seo.title} description={seo.description} path={seo.path} />
      <PageHero title={t.contact.title} subtitle={t.contact.subtitle} />
      <section className="py-16 md:py-20 bg-[#f4f8fb]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8">
          <div className="space-y-3">
            {info.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex gap-4 rounded-2xl bg-white border border-slate-100 p-4 card-hover shadow-sm"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-slate-700 [&_svg]:h-5 [&_svg]:w-5">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wide">
                    {item.label}
                  </p>
                  <p className="font-bold text-slate-800 mt-1">{item.value}</p>
                </div>
              </a>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white border border-slate-100 p-6 md:p-8 shadow-sm space-y-4"
          >
            <input
              name="name"
              required
              type="text"
              placeholder={t.contact.namePh}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
            <input
              name="email"
              required
              type="email"
              placeholder={t.contact.emailPh}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
            <textarea
              name="message"
              required
              rows={4}
              placeholder={t.contact.messagePh}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-200 resize-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl btn-primary font-black disabled:opacity-60"
            >
              {submitting ? '...' : t.contact.send}
            </button>
            {error && <p className="text-center text-sm font-bold text-red-600">{error}</p>}
            {sent && (
              <p className="text-center text-sm font-bold text-green-600">{t.contact.sent}</p>
            )}
          </form>
        </div>
      </section>
    </>
  )
}
