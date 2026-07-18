import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { CATEGORIES, UI } from '../data/alainContent'

export default function CategoryCircles() {
  const { lang } = useLanguage()
  const ui = UI[lang] || UI.en

  return (
    <section className="bg-white py-10 md:py-12 lg:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          dir="ltr"
          className="mobile-carousel md:hidden flex flex-row-reverse gap-4 overflow-x-auto pb-3 px-1 -mx-1 snap-x snap-mandatory scroll-smooth overscroll-x-contain select-none"
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/collections/${cat.slug}`}
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
              className="group flex w-[72%] min-w-[182px] max-w-[220px] shrink-0 snap-center flex-col items-center text-center first:ms-1 last:me-1 sm:w-[54%]"
            >
              <div className="aspect-square w-full overflow-hidden rounded-full bg-gradient-to-b from-[#d7eef8] to-white p-2.5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
                <img
                  src={cat.image}
                  alt={cat.title.en}
                  className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                  loading="lazy"
                  draggable={false}
                />
              </div>
              <h4 className="mt-3 text-[15px] font-bold leading-tight text-slate-900">
                {cat.title[lang] || cat.title.en}
              </h4>
              <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-alain-blue">
                {ui.explore}
                <span aria-hidden>{lang === 'ar' ? '‹' : '>'}</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="mx-auto hidden max-w-6xl grid-cols-4 gap-8 md:grid">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/collections/${cat.slug}`}
              className="group flex flex-col items-center text-center"
            >
              <div className="flex h-[10.5rem] w-[10.5rem] items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-[#d7eef8] to-white p-3 shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 transition group-hover:shadow-md">
                <img
                  src={cat.image}
                  alt={cat.title.en}
                  className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <h4 className="mt-4 text-base lg:text-lg font-bold text-slate-900">
                {cat.title[lang] || cat.title.en}
              </h4>
              <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-alain-blue">
                {ui.explore}
                <span aria-hidden>{lang === 'ar' ? '‹' : '>'}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
