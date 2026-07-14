import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import SeoMeta from '../components/SeoMeta'
import useProducts from '../hooks/useProducts'
import {
  ALL_CATEGORIES,
  COLLECTION_META,
  UI,
} from '../data/alainContent'

function ProductCard({ product }) {
  const { lang } = useLanguage()
  const ui = UI[lang] || UI.en

  return (
    <Link to={`/products/${product.slug}`} className="group flex flex-col">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-white p-3">
        {product.badge && (
          <span className="absolute start-2 top-2 z-10 rounded bg-[#e11d2e] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
            {product.badge}
          </span>
        )}
        <img
          src={product.image}
          alt={product.name.en}
          className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      {/* Light info bar like original alainwater.com cards */}
      <div className="bg-[#eef5fa] px-3 py-3 text-center">
        <p className="text-sm font-semibold leading-snug text-slate-800 line-clamp-2 min-h-[2.5rem]">
          {product.name[lang] || product.name.en}
        </p>
        <p className="mt-1 text-sm font-bold text-slate-900">
          {product.price.toFixed(2)} {ui.aed}
        </p>
      </div>
    </Link>
  )
}

function CollectionBanner({ slug, title }) {
  const { lang } = useLanguage()
  const meta = COLLECTION_META[slug]
  if (!meta) return null

  const heading = meta.heading?.[lang] || meta.heading?.en || title
  const sub = meta.sub?.[lang] || meta.sub?.en

  if (meta.banner === 'offers') {
    return (
      <div className="relative mb-8 overflow-hidden bg-gradient-to-r from-[#0b6bb8] via-[#1aa0d8] to-[#7dff4a]">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 md:py-14">
          <div className="rounded-sm bg-[#1f8a4c] px-5 py-3 text-sm font-black uppercase tracking-wide text-white md:text-base">
            {sub}
          </div>
          <h2 className="max-w-md text-2xl font-black uppercase leading-tight text-[#0b2e4e] md:text-4xl">
            {heading}
            <span className="mt-2 block h-1 w-24 bg-[#0b2e4e]" />
            <span className="mt-1 block h-0.5 w-16 bg-[#0b2e4e]/50" />
          </h2>
        </div>
      </div>
    )
  }

  if (meta.banner === 'dispenser') {
    return (
      <div className="relative mb-8 overflow-hidden bg-[#dfeaf3]">
        <div className="mx-auto flex max-w-7xl items-end px-4 py-12 sm:px-6 md:py-16">
          <h2 className="text-3xl font-black uppercase leading-none text-[#0b2e4e] md:text-5xl">
            {heading}
          </h2>
        </div>
      </div>
    )
  }

  return (
    <div className="relative mb-8 overflow-hidden bg-gradient-to-r from-[#d7ebf7] to-[#eef6fb]">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-10 sm:px-6 md:py-14">
        {sub && <p className="text-sm font-bold uppercase tracking-wide text-[#0b3d66]">{sub}</p>}
        <h2 className="text-3xl font-black uppercase text-[#0b3d66] md:text-5xl">{heading}</h2>
      </div>
    </div>
  )
}

function FilterSidebar({ products, sort, setSort }) {
  const { lang } = useLanguage()
  const [open, setOpen] = useState({ brand: true, size: true, packaging: true, type: true })

  return (
    <aside className="w-full shrink-0 md:w-56 lg:w-64">
      <label className="mb-4 block text-sm font-semibold text-slate-700">
        {lang === 'ar' ? 'ترتيب حسب' : 'Sort by'}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="mt-1 w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm"
        >
          <option value="featured">{lang === 'ar' ? 'مميز' : 'Featured'}</option>
          <option value="price-asc">{lang === 'ar' ? 'السعر: الأقل' : 'Price: Low to High'}</option>
          <option value="price-desc">{lang === 'ar' ? 'السعر: الأعلى' : 'Price: High to Low'}</option>
          <option value="title">{lang === 'ar' ? 'الاسم' : 'Alphabetically'}</option>
        </select>
      </label>

      {[
        { key: 'type', label: lang === 'ar' ? 'نوع المياه' : 'Water Type', value: `Bottled Water (${products.length})` },
        { key: 'brand', label: lang === 'ar' ? 'العلامة' : 'Brand', value: `Al Ain Water (${products.length})` },
      ].map((block) => (
        <div key={block.key} className="border-t border-slate-200 py-3">
          <button
            type="button"
            className="flex w-full items-center justify-between text-sm font-semibold text-slate-800"
            onClick={() => setOpen((o) => ({ ...o, [block.key]: !o[block.key] }))}
          >
            {block.label}
            <span className="text-xs text-slate-400">{open[block.key] ? '▴' : '▾'}</span>
          </button>
          {open[block.key] && (
            <label className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" defaultChecked className="accent-alain-blue" />
              {block.value}
            </label>
          )}
        </div>
      ))}
    </aside>
  )
}

function sortProducts(list, sort) {
  const arr = [...list]
  if (sort === 'price-asc') arr.sort((a, b) => a.price - b.price)
  else if (sort === 'price-desc') arr.sort((a, b) => b.price - a.price)
  else if (sort === 'title') arr.sort((a, b) => a.name.en.localeCompare(b.name.en))
  return arr
}

export function CollectionsIndexPage() {
  const { lang } = useLanguage()
  const ui = UI[lang] || UI.en

  return (
    <>
      <SeoMeta title="Shop by Category – Al Ain Water" path="/collections" />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-alain-blue">
            {ui.home}
          </Link>
          <span className="mx-2">/</span>
          <span>Shop</span>
          <span className="mx-2">/</span>
          <span>Collections</span>
        </nav>
        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 md:text-4xl">
          {ui.shopByCategory}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-500">
          {lang === 'ar'
            ? 'اكتشف مجموعتنا المتنوعة لتناسب كل الأذواق والمناسبات.'
            : 'Discover our diverse range of products to suit every preference and occasion.'}
        </p>

        <div className="mt-12 hidden grid-cols-5 gap-8 md:grid">
          {ALL_CATEGORIES.map((cat) => (
            <Link key={cat.id} to={`/collections/${cat.slug}`} className="group text-center">
              <div className="mx-auto aspect-square w-full max-w-[180px] overflow-hidden rounded-full bg-gradient-to-b from-[#d7eef8] to-white p-3">
                <img src={cat.image} alt="" className="h-full w-full object-contain" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900">{cat.title[lang] || cat.title.en}</h3>
            </Link>
          ))}
        </div>

        <div
          className="mt-10 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 md:hidden"
          style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
        >
          {ALL_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/collections/${cat.slug}`}
              className="w-[42%] min-w-[150px] shrink-0 snap-start text-center"
            >
              <div className="aspect-square overflow-hidden rounded-full bg-gradient-to-b from-[#d7eef8] to-white p-3">
                <img src={cat.image} alt="" className="h-full w-full object-contain" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900">{cat.title[lang] || cat.title.en}</h3>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

export function ProductsPage() {
  const { lang } = useLanguage()
  const ui = UI[lang] || UI.en
  const [sort, setSort] = useState('featured')
  const { products: allProducts, loading } = useProducts()
  const products = useMemo(() => sortProducts(allProducts, sort), [allProducts, sort])

  return (
    <>
      <SeoMeta title={`${ui.allProducts} – Al Ain Water`} path="/products" />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-alain-blue">
            {ui.home}
          </Link>
          <span className="mx-2">/</span>
          <span>{ui.allProducts}</span>
        </nav>
        <div className="flex flex-col gap-8 md:flex-row">
          <FilterSidebar products={products} sort={sort} setSort={setSort} />
          <div className="min-w-0 flex-1">
            <p className="mb-4 text-end text-sm text-slate-500">
              {products.length} {lang === 'ar' ? 'منتج' : 'products'}
            </p>
            {loading ? (
              <p className="text-slate-500">{lang === 'ar' ? 'جاري التحميل…' : 'Loading…'}</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export function CollectionPage() {
  const { slug } = useParams()
  const { lang } = useLanguage()
  const ui = UI[lang] || UI.en
  const [sort, setSort] = useState('featured')
  const { products: allProducts, loading } = useProducts()
  const meta = COLLECTION_META[slug]
  const category = ALL_CATEGORIES.find((c) => c.slug === slug)
  const title = category
    ? category.title[lang] || category.title.en
    : NAV_TITLE(slug, lang, ui)

  const filtered = useMemo(() => {
    const catId = meta?.id || category?.id
    if (!catId) return allProducts
    return allProducts.filter((p) => p.category === catId)
  }, [meta, category, allProducts])

  const products = useMemo(() => sortProducts(filtered, sort), [filtered, sort])

  return (
    <>
      <SeoMeta title={`${title} – Al Ain Water`} path={`/collections/${slug}`} />

      {/* Secondary category bar like original collection pages */}
      <div className="hidden border-b border-slate-100 bg-white lg:block">
        <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-6 py-3 text-sm font-medium text-slate-700">
          {ALL_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/collections/${cat.slug}`}
              className={`shrink-0 hover:text-alain-blue ${
                cat.slug === slug ? 'font-bold text-alain-blue' : ''
              }`}
            >
              {cat.title[lang] || cat.title.en}
            </Link>
          ))}
        </div>
      </div>

      <CollectionBanner slug={slug} title={title} />
      <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row">
          <FilterSidebar products={products} sort={sort} setSort={setSort} />
          <div className="min-w-0 flex-1">
            <p className="mb-4 text-end text-sm text-slate-500">
              {products.length} {lang === 'ar' ? 'منتج' : 'products'}
            </p>
            {loading ? (
              <p className="text-slate-500">{lang === 'ar' ? 'جاري التحميل…' : 'Loading…'}</p>
            ) : products.length === 0 ? (
              <p className="text-slate-500">{ui.cartReady}</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function NAV_TITLE(slug, lang, ui) {
  const map = {
    subscriptions: lang === 'ar' ? 'الاشتراكات' : 'Subscriptions',
  }
  return map[slug] || ui.allProducts
}

export function ProductDetailsPage() {
  const { slug } = useParams()
  const { lang } = useLanguage()
  const ui = UI[lang] || UI.en
  const { addItem } = useCart()
  const { products: allProducts, loading } = useProducts()
  const product = allProducts.find((p) => p.slug === slug)
  const [qty, setQty] = useState(1)
  const [imgIndex, setImgIndex] = useState(0)

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
        <p className="mb-4 text-xl font-bold">Product not found</p>
        <Link to="/products" className="btn-primary">
          {ui.allProducts}
        </Link>
      </div>
    )
  }

  const name = product.name[lang] || product.name.en
  const images = product.images?.length ? product.images : [product.image]
  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const add = () => {
    addItem({
      id: product.id,
      name: product.name.en,
      nameAr: product.name.ar,
      price: product.price,
      images: product.images?.length ? product.images : [product.image],
      quantity: qty,
      isInStock: product.isInStock !== false,
    })
  }

  return (
    <>
      <SeoMeta title={`${name} – Al Ain Water`} path={`/products/${slug}`} />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-alain-blue">
            {ui.home}
          </Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-alain-blue">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-800">{name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[72px_1fr_1fr] lg:gap-10">
          {/* Desktop vertical thumbs */}
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

          {/* Main image + mobile swipe */}
          <div>
            <div className="relative flex aspect-square items-center justify-center bg-[#f7fafc]">
              <img src={images[imgIndex]} alt={name} className="max-h-full max-w-full object-contain p-4" />
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
            {/* Mobile horizontal thumbs */}
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
            <h1 className="text-2xl font-black uppercase leading-tight text-slate-900 md:text-3xl">{name}</h1>
            <p className="mt-3 text-xl font-bold text-slate-800">
              {product.price.toFixed(2)} {ui.aed}
            </p>

            <div className="mt-6 flex items-center gap-0 border border-slate-300">
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
              <button type="button" className="h-11 w-11 text-lg font-bold" onClick={() => setQty((q) => q + 1)}>
                +
              </button>
            </div>

            <button
              type="button"
              onClick={add}
              className="mt-4 w-full bg-alain-blue py-3.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-alain-blue-dark"
            >
              {ui.addToCart}
            </button>

            {product.bullets?.length > 0 && (
              <ul className="mt-8 list-disc space-y-2 ps-5 text-sm leading-7 text-slate-600">
                {product.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Mobile sticky cart bar like original PDP */}
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
                <div key={p.id} className="w-[58%] shrink-0 snap-start md:w-auto">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
