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

export default function ConnectWithUs() {
  const { lang } = useLanguage()
  const ui = UI[lang] || UI.en
  const c = SITE_CONTACT

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <h3 className="mb-9 text-left text-[2.35rem] font-black uppercase tracking-tight text-slate-900 md:mb-11 md:text-center md:text-[3rem] lg:text-[3.15rem]">
          {ui.connect}
        </h3>

        <div className="grid gap-8 md:grid-cols-2 md:gap-x-20 md:gap-y-14 lg:gap-x-28">
          <div className="space-y-8 md:space-y-10">
            <div className="flex items-start gap-4 md:gap-5">
              <span className="mt-0.5 text-slate-900/90" aria-hidden>
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 5h4l2 5-2.5 1.5a12 12 0 006 6L16 15l5 2v4a2 2 0 01-2 2A16 16 0 013 7a2 2 0 012-2z" />
                </svg>
              </span>
              <div>
                <p className="text-[1.08rem] font-normal leading-none text-[#316cec]">{lang === 'ar' ? 'الهاتف' : 'Phone'}</p>
                <a href={`tel:${c.phone}`} className="mt-2 block text-[1.02rem] font-normal text-slate-700 hover:text-alain-blue">
                  {c.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 md:gap-5">
              <span className="mt-0.5 text-slate-900/90" aria-hidden>
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="+971547866055" />
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

          <div className="md:pt-0.5">
            <div className="mb-4 flex items-center gap-3 md:mb-5">
              <span className="text-slate-900/90" aria-hidden>
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="8" cy="10" r="3" />
                  <circle cx="16" cy="10" r="3" />
                  <path d="M3 19c1.2-3 3.2-4.5 5-4.5s3.8 1.5 5 4.5M11 19c1.2-3 3.2-4.5 5-4.5s3.8 1.5 5 4.5" />
                </svg>
              </span>
              <p className="text-[1.08rem] font-normal leading-none text-[#316cec]">
                {lang === 'ar' ? 'تجدنا على' : 'Find Us On'}
              </p>
            </div>
            <ul className="space-y-4 text-[1.02rem] font-normal text-slate-800 md:space-y-5">
              <li className="flex items-center gap-3 md:gap-4">
                <a
                  href={c.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#316cec] text-[0.82rem] font-black leading-none text-white"
                  aria-label="Facebook"
                >
                  f
                </a>
                <a href={c.social.facebook} target="_blank" rel="noreferrer" className="hover:text-alain-blue">
                  @alainwater
                </a>
              </li>
              <li className="flex items-center gap-3 md:gap-4">
                <a
                  href={c.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#316cec] text-white"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                    <rect x="5" y="5" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.8" />
                    <circle cx="12" cy="12" r="3.2" fill="currentColor" />
                    <circle cx="16.2" cy="7.8" r="1.1" fill="currentColor" />
                  </svg>
                </a>
                <a href={c.social.instagram} target="_blank" rel="noreferrer" className="hover:text-alain-blue">
                  @alainwaterofficial
                </a>
              </li>
              <li className="flex items-center gap-3 md:gap-4">
                <a
                  href={c.social.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#316cec] text-white"
                  aria-label="X"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </a>
                <a href={c.social.twitter} target="_blank" rel="noreferrer" className="hover:text-alain-blue">
                  @alainwaterme
                </a>
              </li>
            </ul>
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
