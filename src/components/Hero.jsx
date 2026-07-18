import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { HERO_SLIDES } from '../data/alainContent'

export default function Hero() {
  const { lang, t } = useLanguage()
  const slide = HERO_SLIDES[0]
  const heroBackground = '/assets/hero/iimg.png'

  const getSlideTitle = (currentSlide) => {
    if (typeof currentSlide.alt === 'string') return currentSlide.alt
    return currentSlide.alt?.[lang] || currentSlide.alt?.en || ''
  }

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(11, 41, 74, 0.42), rgba(11, 41, 74, 0.42)), url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="mx-auto max-w-[100%] overflow-hidden">
        <div
          className="hero-scroller flex w-full overflow-x-auto md:hidden"
          aria-label="Hero banner"
          style={{
            backgroundImage: `linear-gradient(rgba(11, 41, 74, 0.42), rgba(11, 41, 74, 0.42)), url(${heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div
            className="hero-slide relative shrink-0 w-full"
            style={{ background: 'transparent' }}
          >
            <div className="flex min-h-[340px] items-center justify-center px-6 py-10 text-center text-white">
              <div className="max-w-[320px]">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-[16px] font-black text-slate-900 shadow-xl transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-2xl"
                  style={{ animation: 'hero-cta-breathe 2.2s ease-in-out infinite' }}
                >
                  {t.hero.cta}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div
          className="hero-track hidden w-full md:flex"
          aria-label="Hero banner"
          style={{
            backgroundImage: `linear-gradient(rgba(11, 41, 74, 0.42), rgba(11, 41, 74, 0.42)), url(${heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div
            className="hero-slide relative shrink-0 w-full"
            style={{ background: 'transparent' }}
          >
            <div className="flex h-[280px] items-center justify-center px-6 text-center text-white lg:h-[320px] xl:h-[360px]">
              <div className="max-w-[680px]">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center rounded-full bg-white px-10 py-4.5 text-[18px] font-black text-slate-900 shadow-2xl transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-2xl"
                  style={{ animation: 'hero-cta-breathe 2.2s ease-in-out infinite' }}
                >
                  {t.hero.cta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
