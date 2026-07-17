import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { UI } from '../data/alainContent'
import useProducts from '../hooks/useProducts'

export default function Bestsellers() {
  const { lang } = useLanguage()
  const ui = UI[lang] || UI.en
  const { products, loading } = useProducts()
  const bestsellers = products.filter((p) => p.featured).slice(0, 8)
  const railRef = useRef(null)

  return (
    <section className="bg-white py-8 md:py-12 lg:py-14" id="bestsellers">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <h2 className="mb-5 text-3xl font-black uppercase tracking-tight text-slate-900 md:mb-8 md:text-[3.1rem] md:leading-none">
          {ui.bestsellers}
        </h2>

        {loading && !bestsellers.length ? (
          <p className="text-slate-500">
            {lang === 'ar' ? 'جاري التحميل…' : 'Loading…'}
          </p>
        ) : (
          <div>
            <div
              ref={railRef}
              dir="ltr"
              className="flex gap-4 overflow-x-auto pb-4 px-1 -mx-1 snap-x snap-mandatory scroll-smooth overscroll-x-contain md:gap-6"
              style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
            >
              {bestsellers
                .filter((product) => product.slug)
                .map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug}`}
                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    className="group block shrink-0 snap-center w-[82%] sm:w-[58%] md:w-[34%] lg:w-[24%] xl:w-[22%] first:ms-1 last:me-1"
                  >
                    <div className="overflow-hidden rounded-[14px] border border-slate-100 bg-white shadow-[0_1px_0_rgba(15,23,42,0.03)]">
                      <div className="flex aspect-square items-center justify-center bg-white p-5 md:p-6">
                        <img
                          src={product.image}
                          alt={product.name.en}
                          className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.03]"
                          loading="lazy"
                          draggable={false}
                        />
                      </div>
                      <div className="min-h-[92px] bg-[#eef4fb] px-5 py-4 text-center md:min-h-[110px] md:px-6 md:py-5">
                        <p className="text-[15px] leading-6 text-slate-700 line-clamp-2">
                          {product.name[lang] || product.name.en}
                        </p>
                        <p className="mt-1.5 text-[15px] font-medium text-slate-600">
                          {product.price.toFixed(2)} {ui.aed}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
