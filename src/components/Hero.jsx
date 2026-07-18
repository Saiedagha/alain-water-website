import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { HERO_SLIDES } from '../data/alainContent'

export default function Hero() {
  const { lang, t } = useLanguage()
  const slide = HERO_SLIDES[0]

  const getSlideTitle = (currentSlide) => {
    if (typeof currentSlide.alt === 'string') return currentSlide.alt
    return currentSlide.alt?.[lang] || currentSlide.alt?.en || ''
  }

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(11, 41, 74, 0.42), rgba(11, 41, 74, 0.42)), url(${slide?.image || ''})`,
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
            backgroundImage: `linear-gradient(rgba(11, 41, 74, 0.42), rgba(11, 41, 74, 0.42)), url(${slide?.mobileImage || slide?.image || ''})`,
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
        </div>

        <div
          className="hero-track hidden w-full md:flex"
          aria-label="Hero banner"
          style={{
            backgroundImage: `linear-gradient(rgba(11, 41, 74, 0.42), rgba(11, 41, 74, 0.42)), url(${slide?.image || ''})`,
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
        </div>
      </div>
    </section>
  )
}
