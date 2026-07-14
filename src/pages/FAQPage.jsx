import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import PageHero from '../components/PageHero'
import SeoMeta from '../components/SeoMeta'
import { PAGE_SEO } from '../data/seo'

export default function FAQPage() {
  const { t } = useLanguage()
  const [openIndex, setOpenIndex] = useState(0)
  const seo = PAGE_SEO.faq

  return (
    <>
      <SeoMeta title={seo.title} description={seo.description} path={seo.path} />
      <PageHero title={t.faq.title} subtitle={t.faq.subtitle} />
      <section className="py-16 md:py-20 bg-[#f4f8fb]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-3">
          {t.faq.items.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={item.q}
                className="rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-start font-bold text-slate-800 hover:bg-sky-50/50 transition"
                >
                  <span>{item.q}</span>
                  <span className="text-slate-300 shrink-0">{isOpen ? '▴' : '▾'}</span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-slate-500 text-sm leading-7 border-t border-slate-50 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
