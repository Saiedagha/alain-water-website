import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { UI } from '../data/alainContent'
import useProducts from '../hooks/useProducts'

export default function Bestsellers() {
  const { lang } = useLanguage()
  const ui = UI[lang] || UI.en
  const { products, loading } = useProducts()
  const bestsellers = products.filter((p) => p.featured).slice(0, 10)

  return (
    <section className="bg-white py-8 md:py-14" id="bestsellers">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="section-title mb-6 text-left md:mb-10 md:text-center">
          {ui.bestsellers}
        </h2>

        {loading && !bestsellers.length ? (
          <p className="text-slate-500">
            {lang === 'ar' ? 'جاري التحميل…' : 'Loading…'}
          </p>
        ) : (
          <>
            <div
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 touch-pan-x md:hidden"
              style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
            >
              {bestsellers
                .filter((product) => product.slug)
                .map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug}`}
                    className="w-[58%] min-w-[200px] max-w-[240px] shrink-0 snap-start"
                  >
                    <div className="flex aspect-square items-center justify-center overflow-hidden rounded-sm bg-[#f3f7fa] p-3">
                      <img
                        src={product.image}
                        alt={product.name.en}
                        className="h-full w-full object-contain"
                        loading="lazy"
                        draggable={false}
                      />
                    </div>
                    <p className="mt-3 text-center text-sm font-semibold leading-snug text-slate-800 line-clamp-2 min-h-[2.5rem]">
                      {product.name[lang] || product.name.en}
                    </p>
                    <p className="mt-1 text-center text-sm font-bold text-slate-900">
                      {product.price.toFixed(2)} {ui.aed}
                    </p>
                  </Link>
                ))}
            </div>

            <div className="mx-auto hidden max-w-7xl grid-cols-2 gap-6 md:grid md:grid-cols-3 lg:grid-cols-5">
              {bestsellers
                .filter((product) => product.slug)
                .map((product) => (
                  <Link key={product.id} to={`/products/${product.slug}`} className="group flex flex-col">
                    <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-[#f3f7fa] p-3 shadow-sm transition group-hover:shadow-md">
                      <img
                        src={product.image}
                        alt={product.name.en}
                        className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <p className="mt-3 text-sm font-semibold leading-snug text-slate-800 transition group-hover:text-alain-blue line-clamp-2 min-h-[2.5rem]">
                      {product.name[lang] || product.name.en}
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-900">
                      {product.price.toFixed(2)} {ui.aed}
                    </p>
                  </Link>
                ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
