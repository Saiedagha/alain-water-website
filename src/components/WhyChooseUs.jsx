import { useLanguage } from '../context/LanguageContext'

const ICON_STYLES = [
  'bg-sky-100 text-sky-600',
  'bg-blue-100 text-blue-600',
  'bg-emerald-100 text-emerald-600',
  'bg-green-100 text-green-600',
  'bg-violet-100 text-violet-600',
  'bg-pink-100 text-pink-600',
]

const ICONS = ['💧', '🚚', '✓', '🌿', '👥', '🎧']

export default function WhyChooseUs() {
  const { t } = useLanguage()

  return (
    <section className="py-20 md:py-24 bg-[#f4f8fb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">{t.why.title}</h2>
          <p className="section-subtitle mx-auto">{t.why.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.why.items.map((item, index) => (
            <div
              key={item.title}
              className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 card-hover"
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-4 ${ICON_STYLES[index]}`}
              >
                {ICONS[index]}
              </div>
              <h3 className="font-black text-slate-900 text-lg mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-7">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
