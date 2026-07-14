import { useLanguage } from '../context/LanguageContext'

const QUALITY_IMAGE =
  'https://images.unsplash.com/photo-1532187863486-abf9db5811ce?auto=format&fit=crop&w=900&q=80'

function QualityIcon({ type }) {
  const icons = {
    ph: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <ellipse cx="12" cy="12" rx="9" ry="4" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
      </svg>
    ),
    tds: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M12 2c-4 6-7 9.5-7 13a7 7 0 0 0 14 0c0-3.5-3-7-7-13zm0 17a4 4 0 0 1-4-4c0-2.2 1.8-4.5 4-7.7 2.2 3.2 4 5.5 4 7.7a4 4 0 0 1-4 4z" />
      </svg>
    ),
    stages: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 3v2M15 3v2M9 19v2M15 19v2M5 9H3M5 15H3M21 9h-2M21 15h-2" />
        <rect x="7" y="7" width="10" height="10" rx="2" />
        <path d="M10 12h4" />
      </svg>
    ),
    minerals: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M8 20h8M10 20V10l-3-4h10l-3 4v10" />
        <path d="M8 6h8" />
      </svg>
    ),
    iso: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3l7 4v5c0 4.5-3 8.5-7 9-4-.5-7-4.5-7-9V7l7-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    daily: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 3h6v4H9zM6 7h12v14H6z" />
        <path d="M9 12h6M9 16h4" />
      </svg>
    ),
  }

  return icons[type]
}

const ICON_TYPES = ['ph', 'tds', 'stages', 'minerals', 'iso', 'daily']

function QualityCard({ item, iconType }) {
  return (
    <article className="flex items-start gap-3 rounded-xl bg-white p-3.5 shadow-[0_4px_14px_rgba(15,23,42,0.05)] border border-slate-100/80">
      <div className="w-9 h-9 rounded-full bg-[#1f8fc7] text-white flex items-center justify-center shrink-0">
        <QualityIcon type={iconType} />
      </div>

      <div className="flex-1 min-w-0 text-start">
        <h3 className="font-black text-[#1f8fc7] text-[15px] leading-tight" dir="ltr">
          {item.title}
        </h3>
        <p className="font-bold text-slate-900 text-xs mt-1 leading-snug">{item.subtitle}</p>
        <p className="text-[11px] text-slate-500 leading-5 mt-1.5">{item.desc}</p>
      </div>
    </article>
  )
}

export default function WaterQuality() {
  const { t } = useLanguage()

  return (
    <section className="py-12 md:py-14 bg-[#eef6fb] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-[1.75rem] font-black text-[#0b3d5c] mb-2">{t.quality.title}</h2>
          <p className="text-sm md:text-[15px] text-slate-500">{t.quality.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-4 lg:gap-5 items-stretch">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 order-1">
            {t.quality.items.map((item, index) => (
              <QualityCard key={item.title} item={item} iconType={ICON_TYPES[index]} />
            ))}
          </div>

          <div className="relative order-2 min-h-[220px] lg:min-h-0">
            <div className="relative h-full min-h-[220px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#cfeaf8] via-[#b8dff3] to-[#9fd0eb] shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
              <img
                src={QUALITY_IMAGE}
                alt=""
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-30"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#7ec4e8]/30 to-transparent" />

              <div className="absolute top-4 start-4 bg-white rounded-xl px-3 py-2 shadow-md border border-sky-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#1f8fc7] text-white flex items-center justify-center shrink-0">
                  <QualityIcon type="iso" />
                </div>
                <div>
                  <p className="font-black text-[#0b3d5c] text-xs leading-tight">{t.quality.badgeTitle}</p>
                  <p className="text-[10px] text-slate-500 font-bold mt-0.5">{t.quality.badgeSubtitle}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
