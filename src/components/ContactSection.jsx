import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import useSiteSettings from '../hooks/useSiteSettings'
import { submitContactMessage } from '../lib/contactForm'

export default function ContactSection() {
  const { t, lang } = useLanguage()
  const { settings } = useSiteSettings()
  const isAr = lang === 'ar' || lang === 'ur'
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const phone = settings.phone || '+96895330047'
  const email = settings.email || 'Ainalalain@gmail.com'
  const location = isAr ? settings.address_ar || settings.address : settings.address
  const hours = isAr ? settings.hours_ar || settings.hours : settings.hours

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

  const info = [
    { label: t.contact.phone, value: phone, href: `tel:${phone}` },
    { label: t.contact.whatsapp, value: phone, href: `https://wa.me/${phone.replace(/\D/g, '')}` },
    { label: t.contact.email, value: email, href: `mailto:${email}` },
    { label: t.contact.location, value: location, href: '#' },
    { label: t.contact.hours, value: hours, href: '#' },
  ]

  return (
    <section id="contact" className="py-20 md:py-24 oasis-gradient-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">{t.contact.title}</h2>
          <p className="section-subtitle mx-auto">{t.contact.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-3">
            {info.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex gap-4 rounded-2xl bg-white border border-sky-100 p-4 hover:shadow-md transition card-hover"
              >
                <div className="w-10 h-10 rounded-xl oasis-gradient text-white flex items-center justify-center shrink-0 text-sm font-black">
                  {item.label[0]}
                </div>
                <div>
                  <p className="text-xs font-black text-oasis-light uppercase tracking-wide">{item.label}</p>
                  <p className="font-bold text-oasis-dark mt-1">{item.value}</p>
                </div>
              </a>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white border border-sky-100 p-6 md:p-8 shadow-sm space-y-4"
          >
            <div>
              <label className="block text-sm font-bold text-oasis-dark mb-1.5">{t.contact.name}</label>
              <input
                name="name"
                required
                type="text"
                placeholder={t.contact.namePh}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-oasis-light/40"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-oasis-dark mb-1.5">{t.contact.email}</label>
              <input
                name="email"
                required
                type="email"
                placeholder={t.contact.emailPh}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-oasis-light/40"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-oasis-dark mb-1.5">{t.contact.message}</label>
              <textarea
                name="message"
                required
                rows={4}
                placeholder={t.contact.messagePh}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-oasis-light/40 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl oasis-gradient text-white font-black hover:opacity-95 transition disabled:opacity-60"
            >
              {submitting ? '...' : t.contact.send}
            </button>
            {error && <p className="text-center text-sm font-bold text-red-600">{error}</p>}
            {sent && <p className="text-center text-sm font-bold text-green-600">{t.contact.sent}</p>}
          </form>
        </div>
      </div>
    </section>
  )
}
