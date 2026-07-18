import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { HERO_SLIDES } from '../data/alainContent'

export default function Hero() {
  const { lang, t } = useLanguage()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const mobileRailRef = useRef(null)

  useEffect(() => {
    if (paused || HERO_SLIDES.length <= 1) return undefined

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % HERO_SLIDES.length)
    }, 5500)

    return () => window.clearInterval(timer)
  }, [paused])

  const goTo = (nextIndex) => setIndex(nextIndex)

  useEffect(() => {
    const rail = mobileRailRef.current
    if (!rail || window.innerWidth >= 768) return

    rail.scrollTo({ left: index * rail.clientWidth, behavior: 'smooth' })
  }, [index])

  const onMobileScroll = () => {
    const rail = mobileRailRef.current
    if (!rail || rail.clientWidth === 0) return

    const nextIndex = Math.round(rail.scrollLeft / rail.clientWidth)
    if (nextIndex !== index) setIndex(nextIndex)
  }

  const getSlideTitle = (slide) => {
    if (typeof slide.alt === 'string') return slide.alt
    return slide.alt?.[lang] || slide.alt?.en || ''
  }

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: HERO_SLIDES[index]?.bg || '#0b5f9e' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => {
        window.setTimeout(() => setPaused(false), 4500)
      }}
    >
      <div className="mx-auto max-w-[100%] overflow-hidden">
        <div
          ref={mobileRailRef}
          onScroll={onMobileScroll}
          className="hero-scroller flex w-full overflow-x-auto md:hidden"
          aria-label="Hero banners"
        >
          {HERO_SLIDES.map((slide) => (
            <div
              key={slide.id}
              className="hero-slide relative shrink-0 w-full"
              style={{ background: slide.bg || '#0b5f9e' }}
            >
              <div className="flex min-h-[340px] items-center justify-center px-6 py-10 text-center text-white">
                <div className="max-w-[320px]">
                  <span className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] backdrop-blur-sm">
                    {lang === 'ar' ? 'العين' : 'Al Ain'}
                  </span>
                  <h2 className="text-[1.9rem] font-black uppercase leading-tight tracking-tight">
                    {getSlideTitle(slide)}
                  </h2>
                  <Link
                    to="/products"
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-black text-slate-900 shadow-lg transition hover:scale-[1.02]"
                  >
                    {t.hero.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="hero-track hidden w-full transition-transform duration-700 ease-in-out md:flex"
          style={{ transform: `translateX(-${index * 100}%)` }}
          aria-label="Hero banners"
        >
          {HERO_SLIDES.map((slide) => (
            <div
              key={slide.id}
              className="hero-slide relative shrink-0 w-full"
              style={{ background: slide.bg || '#0b5f9e' }}
            >
              <div className="flex h-[280px] items-center justify-center px-6 text-center text-white lg:h-[320px] xl:h-[360px]">
                <div className="max-w-[680px]">
                  <span className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.24em] backdrop-blur-sm">
                    {lang === 'ar' ? 'العين' : 'Al Ain'}
                  </span>
                  <h2 className="text-[2.3rem] font-black uppercase leading-tight tracking-tight md:text-[2.7rem] lg:text-[3.1rem]">
                    {getSlideTitle(slide)}
                  </h2>
                  <Link
                    to="/products"
                    className="mt-7 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-black text-slate-900 shadow-lg transition hover:scale-[1.02]"
                  >
                    {t.hero.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
