import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { CATEGORIES, UI } from '../data/alainContent'

export default function CategoryCircles() {
  const { lang } = useLanguage()
  const ui = UI[lang] || UI.en

  return (
    <section className="py-10 md:py-16 bg-white">
      {/* Mobile: horizontal swipe like alainwater.com (~474px shows ~2.2 circles) */}
      <div
        className="md:hidden flex gap-5 overflow-x-auto snap-x snap-mandatory px-4 pb-2 touch-pan-x"
        style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
      >
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            to={`/collections/${cat.slug}`}
            className="group flex w-[42%] min-w-[148px] max-w-[180px] shrink-0 snap-start flex-col items-center text-center"
          >
            <div className="aspect-square w-full overflow-hidden rounded-full bg-gradient-to-b from-[#d7eef8] to-white p-2">
              <img
                src={cat.image}
                alt={cat.title.en}
                className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                loading="lazy"
                draggable={false}
              />
            </div>
            <h4 className="mt-3 text-[15px] font-bold text-slate-900 leading-tight">
              {cat.title[lang] || cat.title.en}
            </h4>
            <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-alain-blue">
              {ui.explore}
              <span aria-hidden>{lang === 'ar' ? '‹' : '>'}</span>
            </span>
          </Link>
        ))}
      </div>

      {/* Desktop / tablet: 4-up row */}
      <div className="mx-auto hidden max-w-6xl grid-cols-4 gap-10 px-4 sm:px-6 md:grid">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            to={`/collections/${cat.slug}`}
            className="group flex flex-col items-center text-center"
          >
            <div className="h-48 w-48 overflow-hidden rounded-full bg-gradient-to-b from-[#d7eef8] to-white p-3 shadow-sm transition group-hover:shadow-md">
              <img
                src={cat.image}
                alt={cat.title.en}
                className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <h4 className="mt-4 text-lg font-bold text-slate-900">
              {cat.title[lang] || cat.title.en}
            </h4>
            <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-alain-blue">
              {ui.explore}
              <span aria-hidden>{lang === 'ar' ? '‹' : '>'}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
