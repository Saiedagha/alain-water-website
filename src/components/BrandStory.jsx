import { BRAND_STORY } from '../data/alainContent'
import { useLanguage } from '../context/LanguageContext'

export default function BrandStory() {
  const { lang } = useLanguage()
  const body = BRAND_STORY.body[lang] || BRAND_STORY.body.en

  return (
    <section className="bg-white py-14 md:py-18 lg:py-24">
      <div className="mx-auto flex max-w-[940px] flex-col items-center px-4 text-center sm:px-6">
        <img
          src={BRAND_STORY.videoThumb}
          alt={BRAND_STORY.title.en}
          className="h-[210px] w-auto max-w-full object-contain sm:h-[235px] md:h-[255px]"
          loading="lazy"
        />

        {lang === 'ar' ? (
          <h3 className="relative mt-7 inline-block text-[2.2rem] font-black leading-none tracking-tight text-slate-900 md:text-[3rem] lg:text-[3.15rem]">
            {BRAND_STORY.title.ar}
            <span
              className="pointer-events-none absolute -bottom-3 left-1/2 h-[5px] w-[82%] -translate-x-1/2 rotate-[-1deg] rounded-full bg-[#2f67d3]"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute -bottom-5 left-1/2 h-[3px] w-[70%] -translate-x-[42%] rotate-[1.5deg] rounded-full bg-[#2f67d3]/95"
              aria-hidden
            />
          </h3>
        ) : (
          <h3 className="relative mt-7 inline-block text-[2.15rem] font-black uppercase leading-none tracking-tight text-slate-900 md:text-[3rem] lg:text-[3.2rem]">
            UAE&apos;S FAVORITE WATER BRAND
            <span
              className="pointer-events-none absolute -bottom-3 left-1/2 h-[5px] w-[82%] -translate-x-1/2 rotate-[-1deg] rounded-full bg-[#2f67d3]"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute -bottom-5 left-1/2 h-[3px] w-[70%] -translate-x-[42%] rotate-[1.5deg] rounded-full bg-[#2f67d3]/95"
              aria-hidden
            />
          </h3>
        )}

        <p className="mx-auto mt-6 max-w-[860px] text-[18px] leading-[1.68] text-slate-700 md:text-[20px] md:leading-[1.7]">
          {body}
        </p>
      </div>
    </section>
  )
}
