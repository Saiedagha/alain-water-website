import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import useSiteSettings from '../hooks/useSiteSettings'
import { submitContactMessage } from '../lib/contactForm'
import PageHero from '../components/PageHero'
import SeoMeta from '../components/SeoMeta'
import { PAGE_SEO } from '../data/seo'

export default function ContactPage() {
  const { t, lang } = useLanguage()
  const { settings } = useSiteSettings()
  const isAr = lang === 'ar' || lang === 'ur'
  const seo = PAGE_SEO.contact

  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const phone = settings.phone || '+96895330047'
  const email = settings.email || 'Ainalalain@gmail.com'
  const location = isAr ? settings.address_ar || settings.address : settings.address
  const hours = isAr ? settings.hours_ar || settings.hours : settings.hours

  const info = [
    { label: t.contact.phone, value: phone, href: `tel:${phone}`, icon: '📞' },
    {
      label: t.contact.whatsapp,
      value: phone,
      href: `https://wa.me/${phone.replace(/\D/g, '')}`,
      icon: '💬',
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
                <div className="w-11 h-11 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
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
