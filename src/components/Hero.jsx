import { useEffect, useRef, useState } from 'react'
import { HERO_SLIDES } from '../data/alainContent'

export default function Hero() {
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
          style={{ touchAction: 'pan-y pinch-zoom' }}
          aria-label="Hero banners"
        >
          {HERO_SLIDES.map((slide) => (
            <div
              key={slide.id}
              className="hero-slide relative shrink-0 w-full"
              style={{ background: slide.bg || '#0b5f9e' }}
            >
              <img
                src={slide.mobileImage || slide.image}
                alt={slide.alt}
                draggable={false}
                decoding="async"
                className="block h-auto w-full select-none object-cover object-center pointer-events-none"
                sizes="100vw"
              />
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
              <div className="relative hidden w-full overflow-hidden md:block h-[280px] lg:h-[320px] xl:h-[360px]">
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
