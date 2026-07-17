import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { NEWS_POSTS, UI } from '../data/alainContent'

export default function NewsSection() {
  const { lang } = useLanguage()
  const ui = UI[lang] || UI.en
  const railRef = useRef(null)
  const dragRef = useRef({ isDown: false, startX: 0, startLeft: 0, moved: false })

  const scrollRail = (direction) => {
    if (!railRef.current) return
    const amount = railRef.current.clientWidth * 0.85
    railRef.current.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  const onPointerDown = (event) => {
    if (!railRef.current) return
    dragRef.current = {
      isDown: true,
      startX: event.clientX,
      startLeft: railRef.current.scrollLeft,
      moved: false,
    }
    railRef.current.setPointerCapture?.(event.pointerId)
  }

  const onPointerMove = (event) => {
    if (!dragRef.current.isDown || !railRef.current) return
    const deltaX = event.clientX - dragRef.current.startX
    if (Math.abs(deltaX) > 5) {
      dragRef.current.moved = true
    }
    railRef.current.scrollLeft = dragRef.current.startLeft - deltaX
  }

  const onPointerUp = (event) => {
    dragRef.current.isDown = false
    railRef.current?.releasePointerCapture?.(event.pointerId)
  }

  const onRailClickCapture = (event) => {
    if (dragRef.current.moved) {
      event.preventDefault()
      event.stopPropagation()
      dragRef.current.moved = false
    }
  }

  return (
    <section className="bg-white py-14 md:py-16 lg:py-20">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-3xl font-black text-slate-900">{ui.news}</h3>
            <p className="mt-1 text-slate-500">{ui.newsSub}</p>
          </div>
          <Link to="/news" className="text-sm font-semibold text-alain-blue hover:underline">
            {ui.viewAll}
          </Link>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => scrollRail(-1)}
            className="absolute left-0 top-1/2 z-10 hidden h-12 w-12 -translate-x-1/2 -translate-y-[58%] items-center justify-center rounded-full border border-slate-100 bg-white text-2xl text-slate-700 shadow-[0_4px_16px_rgba(15,23,42,0.12)] transition hover:bg-slate-50 md:grid"
            aria-label="Scroll news left"
          >
            ←
          </button>

          <div
            ref={railRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onClickCapture={onRailClickCapture}
            className="flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory md:gap-6"
            style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', touchAction: 'pan-y' }}
          >
            {NEWS_POSTS.map((post) => (
              <article
                key={post.id}
                className="group w-[84%] shrink-0 snap-start sm:w-[60%] md:w-[36%] lg:w-[31%]"
              >
                <div className="overflow-hidden rounded-[20px] bg-white shadow-sm ring-1 ring-slate-100">
                  <Link to={post.href} className="block overflow-hidden bg-slate-100">
                    <img
                      src={post.image}
                      alt={post.title.en}
                      className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>
                  <div className="px-5 pb-5 pt-4">
                    {post.date && (
                      <p className="text-xs font-medium text-slate-400">{post.date}</p>
                    )}
                    <h5 className="mt-2 text-lg font-bold leading-snug text-slate-900 line-clamp-2">
                      <Link to={post.href} className="hover:text-alain-blue">
                        {post.title[lang] || post.title.en}
                      </Link>
                    </h5>
                    <p className="mt-2 text-sm leading-6 text-slate-500 line-clamp-3">
                      {post.excerpt[lang] || post.excerpt.en}
                    </p>
                    <Link
                      to={post.href}
                      className="mt-3 inline-block text-sm font-semibold text-alain-blue hover:underline"
                    >
                      {ui.readMore}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollRail(1)}
            className="absolute right-0 top-1/2 z-10 hidden h-12 w-12 translate-x-1/2 -translate-y-[58%] items-center justify-center rounded-full border border-slate-100 bg-white text-2xl text-slate-700 shadow-[0_4px_16px_rgba(15,23,42,0.12)] transition hover:bg-slate-50 md:grid"
            aria-label="Scroll news right"
          >
            →
          </button>
        </div>
      </div>
    </section>
  )
}
