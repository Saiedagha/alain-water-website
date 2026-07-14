import { useCallback, useEffect, useRef, useState } from 'react'
import { HERO_SLIDES } from '../data/alainContent'

export default function Hero() {
  const scrollerRef = useRef(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback((i) => {
    const el = scrollerRef.current
    if (!el) return
    const slide = el.children[i]
    if (!slide) return
    el.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' })
    setIndex(i)
  }, [])

  const syncIndexFromScroll = useCallback(() => {
    const el = scrollerRef.current
    if (!el || !el.children.length) return
    const slideWidth = el.children[0].getBoundingClientRect().width
    if (!slideWidth) return
    const next = Math.round(el.scrollLeft / slideWidth)
    setIndex(Math.max(0, Math.min(HERO_SLIDES.length - 1, next)))
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return undefined

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(syncIndexFromScroll)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('scroll', onScroll)
    }
  }, [syncIndexFromScroll])

  useEffect(() => {
    if (paused) return undefined
    const timer = setInterval(() => {
      goTo((index + 1) % HERO_SLIDES.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [index, paused, goTo])

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
      <div
        ref={scrollerRef}
        className="hero-scroller flex w-full overflow-x-auto overflow-y-hidden overscroll-x-contain touch-pan-x"
        aria-label="Hero banners"
      >
        {HERO_SLIDES.map((slide) => (
          <div
            key={slide.id}
            className="hero-slide relative shrink-0 snap-center snap-always"
            style={{ background: slide.bg || '#0b5f9e' }}
          >
            {/* Mobile: dedicated crop — clear product + text, swipe between slides */}
            <div className="relative w-full overflow-hidden sm:hidden min-h-[190px] max-h-[260px] aspect-[150/58]">
              <img
                src={slide.mobileImage || slide.image}
                alt={slide.alt}
                draggable={false}
                decoding="async"
                className="absolute inset-0 h-full w-full object-contain object-center select-none pointer-events-none"
                sizes="100vw"
              />
            </div>

            {/* Tablet / desktop */}
            <div className="relative hidden sm:block w-full h-[300px] md:h-[380px] lg:h-[460px] overflow-hidden">
              <img
                src={slide.image}
                alt={slide.alt}
                draggable={false}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-center select-none pointer-events-none"
                sizes="100vw"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {HERO_SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Slide ${i + 1}`}
            aria-current={i === index ? 'true' : undefined}
            onClick={() => {
              setPaused(true)
              goTo(i)
              window.setTimeout(() => setPaused(false), 4500)
            }}
            className={`transition-all duration-300 rounded-full ${
              i === index ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/55 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
