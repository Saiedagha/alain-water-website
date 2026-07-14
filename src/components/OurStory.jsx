import { useLanguage } from '../context/LanguageContext'

const STORY_IMAGE =
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80'

export default function OurStory() {
  const { t } = useLanguage()

  return (
    <section id="about" className="py-20 md:py-24 bg-[#f4f8fb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <img
              src={STORY_IMAGE}
              alt={t.brandAr}
              className="w-full rounded-3xl shadow-lg object-cover aspect-[4/5]"
            />
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="section-title mb-2">{t.story.title}</h2>
            <p className="text-oasis-mid font-black text-lg mb-6">{t.story.subtitle}</p>
            <div className="space-y-4 text-slate-600 leading-8">
              <p>{t.story.p1}</p>
              <p>{t.story.p2}</p>
              <p>{t.story.p3}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8">
              {t.story.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white border border-sky-100 p-4 text-center shadow-sm"
                >
                  <p className="text-xl font-black text-oasis-mid">{stat.value}</p>
                  <p className="text-xs text-slate-500 font-semibold mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
