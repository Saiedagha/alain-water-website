import useProducts from '../hooks/useProducts'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import { getProductDescription, getProductName } from '../data/translations'

export default function ProductsSection() {
  const { t, lang } = useLanguage()
  const { addItem } = useCart()
  const { products, loading, fromDb, error } = useProducts()

  return (
    <section id="products" className="py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">{t.products.title}</h2>
          <p className="section-subtitle mx-auto">{t.products.subtitle}</p>
        </div>

        {loading && (
          <p className="text-center font-bold text-slate-500 mb-6">جاري تحميل المنتجات...</p>
        )}

        {error && (
          <p className="text-center font-bold text-red-600 mb-6">
            تعذر تحميل المنتجات من قاعدة البيانات.
          </p>
        )}

        {!loading && fromDb && products.length === 0 && (
          <p className="text-center font-bold text-slate-500 mb-6">لا توجد منتجات ظاهرة حالياً.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const outOfStock = product.isInStock === false

            return (
            <article
              key={product.id}
              className="rounded-2xl border border-slate-100 bg-white overflow-hidden card-hover shadow-sm flex flex-col"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-oasis-dark to-oasis-mid overflow-hidden relative">
                <img
                  src={product.images[0]}
                  alt={getProductName(product, lang)}
                  className="w-full h-full object-cover opacity-90"
                  loading="lazy"
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-black text-slate-900 text-base">
                  {getProductName(product, lang)}
                </h3>
                <p className="text-sm text-slate-500 mt-1 leading-6 flex-1">
                  {getProductDescription(product, lang)}
                </p>
                <div className="flex items-center justify-between mt-4 gap-2">
                  <span className="font-black text-oasis-mid text-lg whitespace-nowrap">
                    {product.price.toFixed(3)} {t.currency}
                  </span>
                  <button
                    type="button"
                    onClick={() => addItem(product)}
                    disabled={outOfStock}
                    className="btn-primary text-sm px-4 py-2.5 rounded-xl shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-lg leading-none">+</span>
                    {outOfStock ? (lang === 'ar' || lang === 'ur' ? 'غير متوفر' : 'Out of stock') : t.products.addToCart}
                  </button>
                </div>
              </div>
            </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
