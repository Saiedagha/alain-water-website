import { useEffect, useState } from 'react'
import { HERO_SLIDES } from '../data/alainContent'

export default function Hero() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || HERO_SLIDES.length <= 1) return undefined

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % HERO_SLIDES.length)
    }, 5500)

    return () => window.clearInterval(timer)
  }, [paused])

  const goTo = (nextIndex) => setIndex(nextIndex)

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
          className="hero-track flex w-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
          aria-label="Hero banners"
        >
          {HERO_SLIDES.map((slide) => (
            <div
              key={slide.id}
              className="hero-slide relative shrink-0 w-full"
              style={{ background: slide.bg || '#0b5f9e' }}
            >
              <div className="relative w-full overflow-hidden md:hidden min-h-[220px] max-h-[320px] aspect-[16/10]">
                <img
                  src={slide.mobileImage || slide.image}
                  alt={slide.alt}
                  draggable={false}
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-center select-none pointer-events-none"
                  sizes="100vw"
                />
              </div>

              <div className="relative hidden w-full overflow-hidden md:block h-[340px] lg:h-[420px] xl:h-[500px]">
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
