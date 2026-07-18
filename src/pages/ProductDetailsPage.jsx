import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import SeoMeta from '../components/SeoMeta'
import useProducts, { findProductBySlug } from '../hooks/useProducts'
import { UI } from '../data/alainContent'
import {
  buildProductBullets,
  buildProductDescription,
  getCategoryMeta,
} from '../lib/productContent'

function stripHtml(html) {
  if (!html) return ''
  if (typeof window === 'undefined') {
    return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  }
  const parser = new DOMParser()
  const doc = parser.parseFromString(String(html), 'text/html')
  return doc.body.textContent?.replace(/\s+/g, ' ').trim() || ''
}

export default function ProductDetailsPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const ui = UI[lang] || UI.en
  const { addItem } = useCart()
  const { products: allProducts, loading } = useProducts()
  const product = findProductBySlug(allProducts, slug)
  const [qty, setQty] = useState(1)
  const [imgIndex, setImgIndex] = useState(0)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setQty(1)
    setImgIndex(0)
    setAdded(false)
    window.scrollTo(0, 0)
  }, [slug])

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-slate-500">
        {lang === 'ar' ? 'جاري التحميل…' : 'Loading…'}
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="mb-4 text-xl font-bold">
          {lang === 'ar' ? 'المنتج غير موجود' : 'Product not found'}
        </p>
        <Link to="/products" className="btn-primary">
          {ui.allProducts}
        </Link>
      </div>
    )
  }

  const name = product.name[lang] || product.name.en
  const images = product.images?.length ? product.images : [product.image]
  const category = getCategoryMeta(product.category)
  const descriptionHtml =
    (lang === 'ar' ? product.descriptionAr : product.description) ||
    product.description ||
    product.descriptionAr ||
    ''
  const descriptionText =
    stripHtml(descriptionHtml) || buildProductDescription(product, lang)
  const bullets = buildProductBullets(product, lang)
  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id && p.slug)
    .slice(0, 4)

  const add = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name.en,
      nameAr: product.name.ar,
      price: product.price,
      images: product.images?.length ? product.images : [product.image],
      quantity: qty,
      isInStock: product.isInStock !== false,
    })
    navigate('/cart')
  }

  return (
    <>
      <SeoMeta
        title={`${name} – Al Ain Water`}
        description={descriptionText}
        path={`/products/${product.slug}`}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
        <nav className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500">
          <Link to="/" className="hover:text-alain-blue">
            {ui.home}
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-alain-blue">
            {ui.allProducts}
          </Link>
          {category && (
            <>
              <span>/</span>
              <Link to={`/collections/${category.slug}`} className="hover:text-alain-blue">
                {category.title?.[lang] || category.title?.en}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-slate-800 line-clamp-1">{name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[72px_minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
          <div className="hidden flex-col gap-2 lg:flex">
            {images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => setImgIndex(i)}
                className={`aspect-square overflow-hidden border bg-white p-1 ${
                  i === imgIndex ? 'border-alain-blue' : 'border-slate-200'
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-contain" />
              </button>
            ))}
          </div>

          <div>
            <div className="relative flex aspect-square items-center justify-center bg-[#f7fafc]">
              {product.badge && (
                <span className="absolute start-3 top-3 z-10 rounded bg-[#e11d2e] px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                  {product.badge}
                </span>
              )}
              <img
                src={images[imgIndex]}
                alt={name}
                className="max-h-full max-w-full object-contain p-4"
              />
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="absolute start-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow"
                    onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                    aria-label="Prev"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="absolute end-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow"
                    onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                    aria-label="Next"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div
                className="mt-3 flex gap-2 overflow-x-auto snap-x lg:hidden"
                style={{ scrollbarWidth: 'none' }}
              >
                {images.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setImgIndex(i)}
                    className={`h-16 w-16 shrink-0 snap-start overflow-hidden border bg-white p-1 ${
                      i === imgIndex ? 'border-alain-blue' : 'border-slate-200'
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {category && (
              <Link
                to={`/collections/${category.slug}`}
                className="text-xs font-bold uppercase tracking-wide text-alain-blue hover:underline"
              >
                {category.title?.[lang] || category.title?.en}
              </Link>
            )}

            <h1 className="mt-2 text-2xl font-black uppercase leading-tight text-slate-900 md:text-3xl">
              {name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className="text-xl font-bold text-slate-800">
                {product.price.toFixed(2)} {ui.aed}
              </p>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-black ${
                  product.isInStock !== false
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {product.isInStock !== false
                  ? lang === 'ar'
                    ? 'متوفر'
                    : 'In stock'
                  : lang === 'ar'
                    ? 'غير متوفر'
                    : 'Out of stock'}
              </span>
            </div>

            {descriptionHtml ? (
              <div
                className="mt-4 space-y-4 text-sm leading-7 text-slate-600"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            ) : (
              <p className="mt-4 text-sm leading-7 text-slate-600">{descriptionText}</p>
            )}

            <div className="mt-6 flex items-center gap-0 border border-slate-300 w-fit">
              <button
                type="button"
                className="h-11 w-11 text-lg font-bold"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="flex h-11 min-w-[3rem] items-center justify-center border-x border-slate-300 font-semibold">
                {qty}
              </span>
              <button
                type="button"
                className="h-11 w-11 text-lg font-bold"
                onClick={() => setQty((q) => q + 1)}
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={add}
              disabled={product.isInStock === false}
              className="mt-4 w-full bg-alain-blue py-3.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-alain-blue-dark disabled:opacity-50"
            >
              {added
                ? lang === 'ar'
                  ? 'تمت الإضافة ✓'
                  : 'Added ✓'
                : ui.addToCart}
            </button>

            <p className="mt-3 text-xs font-semibold text-emerald-700">
              {ui.freeDelivery} — {ui.fastDelivery}
            </p>

            {bullets.length > 0 && (
              <ul className="mt-8 list-disc space-y-2 ps-5 text-sm leading-7 text-slate-600">
                {bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <section className="mt-14 rounded-2xl border border-slate-100 bg-[#f7fafc] p-5 sm:p-7">
          <h2 className="text-lg font-black uppercase text-slate-900">
            {lang === 'ar' ? 'تفاصيل المنتج' : 'Product details'}
          </h2>
          {descriptionHtml ? (
            <div
              className="mt-3 space-y-4 text-sm leading-7 text-slate-600"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          ) : (
            <p className="mt-3 text-sm leading-7 text-slate-600">{descriptionText}</p>
          )}
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'العلامة' : 'Brand'}
              </p>
              <p className="mt-1 font-black text-slate-800">Al Ain Water</p>
            </div>
            <div className="rounded-xl bg-white p-4 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'الفئة' : 'Category'}
              </p>
              <p className="mt-1 font-black text-slate-800">
                {category?.title?.[lang] || category?.title?.en || '—'}
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'السعر' : 'Price'}
              </p>
              <p className="mt-1 font-black text-slate-800">
                {product.price.toFixed(2)} {ui.aed}
              </p>
            </div>
          </div>
        </section>

        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden">
          <div className="mx-auto flex max-w-lg items-center gap-3">
            <img src={product.image} alt="" className="h-12 w-12 object-contain" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-800">{name}</p>
              <p className="text-sm font-bold">
                {product.price.toFixed(2)} {ui.aed}
              </p>
            </div>
            <button
              type="button"
              onClick={add}
              className="shrink-0 bg-alain-blue px-4 py-2.5 text-xs font-bold uppercase text-white"
            >
              {ui.addToCart}
            </button>
          </div>
        </div>
        <div className="h-20 lg:hidden" />

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-xl font-black uppercase text-slate-900">
              {lang === 'ar' ? 'قد يعجبك أيضاً' : 'You may also like'}
            </h2>
            <div
              className="flex gap-4 overflow-x-auto snap-x pb-2 md:grid md:grid-cols-4 md:overflow-visible"
              style={{ scrollbarWidth: 'none' }}
            >
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.slug}`}
                  className="w-[58%] shrink-0 snap-start md:w-auto group"
                >
                  <div className="flex aspect-square items-center justify-center bg-[#f3f7fa] p-3">
                    <img
                      src={p.image}
                      alt={p.name.en}
                      className="h-full w-full object-contain transition group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-800 line-clamp-2 min-h-[2.5rem]">
                    {p.name[lang] || p.name.en}
                  </p>
                  <p className="mt-1 text-sm font-bold">
                    {p.price.toFixed(2)} {ui.aed}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
