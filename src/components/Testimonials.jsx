import { useLanguage } from '../context/LanguageContext'

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5 text-amber-400 text-sm">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < count ? '★' : '☆'}</span>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const { t } = useLanguage()

  return (
    <section className="py-20 md:py-24 bg-[#f4f8fb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">{t.testimonials.title}</h2>
          <p className="section-subtitle mx-auto">{t.testimonials.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.testimonials.items.map((item) => (
            <article
              key={item.name}
              className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 card-hover flex flex-col"
            >
              <span className="text-4xl text-sky-200 font-serif leading-none mb-3">&ldquo;</span>
              <p className="text-slate-600 text-sm leading-7 flex-1">{item.text}</p>
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-oasis-mid text-white font-black flex items-center justify-center text-sm">
                    {item.name[0]}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-sm">{item.name}</p>
                    <p className="text-xs text-slate-400 font-semibold">{item.city}</p>
                  </div>
                </div>
                <Stars count={5} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
