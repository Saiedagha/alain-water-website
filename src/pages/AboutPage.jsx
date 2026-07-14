import { BRAND_STORY } from '../data/alainContent'
import SeoMeta from '../components/SeoMeta'
import { useLanguage } from '../context/LanguageContext'

export default function AboutPage() {
  const { lang } = useLanguage()

  return (
    <>
      <SeoMeta title="Our Story – Al Ain Water" path="/about" />

      {/* Hero matching alainwater.com/pages/about */}
      <section className="relative flex min-h-[320px] items-center justify-center overflow-hidden md:min-h-[420px]">
        <img
          src={BRAND_STORY.videoThumb}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative px-4 py-16 text-center text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/90">
            {lang === 'ar' ? 'اكتشف معاييرنا' : 'DISCOVER OUR STANDARDS'}
          </p>
          <h1 className="mt-3 text-3xl font-black uppercase tracking-tight md:text-5xl">
            {lang === 'ar' ? 'نظرة داخل مصنعنا' : 'AN INSIGHT INTO OUR FACTORY'}
          </h1>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2">
          <img src={BRAND_STORY.videoThumb} alt="" className="w-full object-cover" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Al Ain Water</p>
            <h2 className="mt-2 text-3xl font-black uppercase text-slate-900 md:text-4xl">
              {lang === 'ar' ? 'أكثر من ثلاثة عقود' : 'Over Three Decades'}
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              {BRAND_STORY.body[lang] || BRAND_STORY.body.en}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white pb-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Al Ain Water</p>
            <h2 className="mt-2 text-3xl font-black uppercase text-slate-900 md:text-4xl">
              {lang === 'ar' ? 'التزام مياه العين' : "Al Ain Water's Commitment"}
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              {lang === 'ar'
                ? 'كعلامة بلا تنازل عن الجودة والتراث، تبقى مياه العين ملتزمة بالنقاء والاستدامة وتقديم الترطيب الذي تثق به الإمارات يومياً.'
                : 'As a brand with an attitude of uncompromising quality and heritage, Al Ain Water remains committed to purity, sustainability, and delivering hydration the UAE trusts every day.'}
            </p>
          </div>
          <div className="order-1 overflow-hidden bg-[#0b6bb8] md:order-2">
            <img
              src={BRAND_STORY.videoThumb}
              alt=""
              className="aspect-square w-full object-cover opacity-90 mix-blend-luminosity"
            />
          </div>
        </div>
      </section>
    </>
  )
}
