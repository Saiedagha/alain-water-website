import { SITE_CONTACT, UI } from '../data/alainContent'
import { useLanguage } from '../context/LanguageContext'

const FEATURES = [
  {
    key: 'delivery',
    icon: (
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M3 7h11v8H3z" />
        <path d="M14 10h4l3 3v2h-7V10z" />
        <circle cx="7" cy="17" r="1.6" />
        <circle cx="17" cy="17" r="1.6" />
      </svg>
    ),
    en: 'Free Home Delivery',
    ar: 'توصيل منزلي مجاني',
  },
  {
    key: 'convenience',
    icon: (
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
      </svg>
    ),
    en: 'Convenience with no more heavy lifting',
    ar: 'راحة بدون حمل ثقيل',
  },
  {
    key: 'fast',
    icon: (
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M12 21s7-5.2 7-11a7 7 0 10-14 0c0 5.8 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.2" />
      </svg>
    ),
    en: 'Fast, hassle-free delivery across the UAE',
    ar: 'توصيل سريع وسهل في أنحاء الإمارات',
  },
  {
    key: 'offers',
    icon: (
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.8 7.2 18l.9-5.4L4.2 8.7l5.4-.8L12 3z" />
      </svg>
    ),
    en: 'Exciting offers',
    ar: 'عروض مميزة',
  },
]

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" fill="currentColor" aria-hidden>
      <path d="M16.1 4C9.6 4 4.3 9.3 4.3 15.8c0 2.1.6 4.1 1.6 5.9L4 28l6.5-1.7c1.7.9 3.6 1.4 5.6 1.4 6.5 0 11.8-5.3 11.8-11.8S22.6 4 16.1 4zm0 21.5c-1.8 0-3.5-.5-5-1.3l-.4-.2-3.8 1 1-3.7-.2-.4c-1-1.6-1.5-3.4-1.5-5.2 0-5.4 4.4-9.8 9.8-9.8s9.8 4.4 9.8 9.8-4.3 9.8-9.7 9.8zm5.4-7.3c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-1.7-.8-2.8-1.5-3.9-3.4-.3-.5.3-.5.8-1.6.1-.2 0-.3 0-.5l-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 1.8.8 2.5.8 3.4.7.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4 0-.1-.2-.2-.5-.3z" />
    </svg>
  )
}

export default function ConnectWithUs() {
  const { lang } = useLanguage()
  const ui = UI[lang] || UI.en
  const c = SITE_CONTACT
  const whatsappDigits = String(c.whatsapp || '971547866055').replace(/\D/g, '')
  const whatsappHref = `https://wa.me/${whatsappDigits}`

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <h3 className="mb-9 text-left text-[2.35rem] font-black uppercase tracking-tight text-slate-900 md:mb-11 md:text-center md:text-[3rem] lg:text-[3.15rem]">
          {ui.connect}
        </h3>

        <div className="mx-auto max-w-2xl">
          <div className="space-y-3">
            <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:gap-5 md:p-5">
              <span className="mt-0.5 text-slate-900/90" aria-hidden>
                <WhatsAppIcon />
              </span>
              <div>
                <p className="text-[1.08rem] font-normal leading-none text-[#316cec]">
                  {lang === 'ar' ? 'واتساب' : 'WhatsApp'}
                </p>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block text-[1.02rem] font-normal text-slate-700 hover:text-alain-blue"
                >
                  +{whatsappDigits}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:gap-5 md:p-5">
              <span className="mt-0.5 text-slate-900/90" aria-hidden>
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M5 7l7 6 7-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <p className="text-[1.08rem] font-normal leading-none text-[#316cec]">
                  {lang === 'ar' ? 'الدعم عبر البريد' : 'Email Support'}
                </p>
                <a href={`mailto:${c.email}`} className="mt-2 block text-[1.02rem] font-normal text-slate-700 hover:text-alain-blue">
                  {c.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-y border-[#d9e7f2] bg-[#eef5fa]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-6 lg:py-12">
          {FEATURES.map((f) => (
            <div key={f.key} className="flex flex-col items-center text-center text-slate-600">
              <div className="mb-3 text-slate-500">{f.icon}</div>
              <p className="max-w-[16rem] text-sm font-medium leading-6 text-slate-700">
                {lang === 'ar' ? f.ar : f.en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
