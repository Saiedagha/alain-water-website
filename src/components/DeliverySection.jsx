import { GOVERNORATES, GOVERNORATES_AR } from '../data/products'
import { useLanguage } from '../context/LanguageContext'

const FEATURE_ICONS = ['📦', '🚚', '🕐']

export default function DeliverySection() {
  const { t, lang } = useLanguage()
  const isAr = lang === 'ar' || lang === 'ur'
  const governorates = isAr ? GOVERNORATES_AR : GOVERNORATES

  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">{t.delivery.title}</h2>
          <p className="section-subtitle mx-auto">{t.delivery.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            {t.delivery.features.slice(0, 3).map((feature, index) => (
              <div
                key={feature.title}
                className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 flex gap-4 card-hover"
              >
                <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center text-xl shrink-0">
                  {FEATURE_ICONS[index]}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-7">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl bg-sky-50 border border-sky-100 p-6 md:p-8">
            <h3 className="font-black text-oasis-mid mb-5 inline-flex items-center gap-2">
              <span>🚚</span>
              {t.delivery.governoratesTitle}
            </h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {governorates.map((gov) => (
                <span
                  key={gov}
                  className="px-3 py-1.5 rounded-full bg-white text-sm font-semibold text-slate-700 border border-sky-100"
                >
                  {gov}
                </span>
              ))}
            </div>
            <div className="rounded-2xl bg-white p-5 text-center border border-sky-100">
              <p className="text-2xl font-black text-oasis-mid mb-1">{t.delivery.freeBadge}</p>
              <p className="text-sm text-slate-500 font-medium">{t.delivery.freeNote}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
