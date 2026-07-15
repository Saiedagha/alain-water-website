import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { adminBtnPrimary, adminCardClass, formatMoney } from './adminStyles'

function ProductStatusButtons({ product, onToggleVisibility, onToggleFeatured }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onToggleVisibility(product)}
        className={`text-xs font-black px-2.5 py-1.5 rounded-lg ${
          product.is_visible ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
        }`}
      >
        {product.is_visible ? 'ظاهر' : 'مخفي'}
      </button>
      <button
        type="button"
        onClick={() => onToggleFeatured(product)}
        className={`text-xs font-black px-2.5 py-1.5 rounded-lg ${
          product.is_featured ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
        }`}
      >
        {product.is_featured ? 'مميز' : 'عادي'}
      </button>
    </div>
  )
}

function ProductActions({ product, onDelete }) {
  return (
    <div className="flex items-center gap-3">
      <Link
        to={`/admin/products/edit/${product.id}`}
        className="text-sm font-black text-admin hover:underline"
      >
        تعديل
      </Link>
      <button
        type="button"
        onClick={() => onDelete(product.id)}
        className="text-sm font-black text-red-600 hover:underline"
      >
        حذف
      </button>
    </div>
  )
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order')
      .order('created_at', { ascending: false })

    if (!error) setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const toggleVisibility = async (product) => {
    await supabase.from('products').update({ is_visible: !product.is_visible }).eq('id', product.id)
    load()
  }

  const toggleFeatured = async (product) => {
    await supabase.from('products').update({ is_featured: !product.is_featured }).eq('id', product.id)
    load()
  }

  const deleteProduct = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return
    await supabase.from('products').delete().eq('id', id)
    load()
  }

  const filtered = products.filter((p) => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      p.name?.toLowerCase().includes(q) ||
      p.name_ar?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="بحث في المنتجات..."
          className="border border-slate-300 rounded-2xl px-4 py-3 font-bold w-full sm:max-w-md order-2 sm:order-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link to="/admin/products/add" className={`${adminBtnPrimary} w-full sm:w-auto order-1 sm:order-2`}>
          + إضافة منتج
        </Link>
      </div>

      <div className={adminCardClass}>
        {loading ? (
          <p className="font-bold text-slate-500">جاري التحميل...</p>
        ) : filtered.length === 0 ? (
          <p className="font-bold text-slate-500">لا توجد منتجات.</p>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="lg:hidden space-y-3">
              {filtered.map((product) => (
                <article
                  key={product.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-xl bg-white border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <span className="text-slate-300 text-lg">📦</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-slate-900 text-sm leading-6 break-words">
                        {product.name}
                      </p>
                      {product.name_ar && (
                        <p className="text-xs text-slate-500 font-bold mt-0.5 break-words">
                          {product.name_ar}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                        <p className="font-black text-admin text-sm">
                          {formatMoney(product.price)} AED
                        </p>
                        <p className="text-xs font-bold text-slate-400">ترتيب: {product.sort_order}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
                    <ProductStatusButtons
                      product={product}
                      onToggleVisibility={toggleVisibility}
                      onToggleFeatured={toggleFeatured}
                    />
                    <ProductActions product={product} onDelete={deleteProduct} />
                  </div>
                </article>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="text-right text-sm text-slate-500 border-b border-slate-100">
                    <th className="pb-3 font-black">المنتج</th>
                    <th className="pb-3 font-black">السعر</th>
                    <th className="pb-3 font-black">الترتيب</th>
                    <th className="pb-3 font-black">الحالة</th>
                    <th className="pb-3 font-black">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr key={product.id} className="border-b border-slate-50">
                      <td className="py-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt=""
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            ) : (
                              <span className="text-slate-300">📦</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-black text-slate-900 truncate max-w-[280px] xl:max-w-none">
                              {product.name}
                            </p>
                            <p className="text-sm text-slate-500 font-bold truncate max-w-[280px] xl:max-w-none">
                              {product.name_ar}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 font-black text-admin whitespace-nowrap">
                        {formatMoney(product.price)} AED
                      </td>
                      <td className="py-4 font-bold">{product.sort_order}</td>
                      <td className="py-4">
                        <ProductStatusButtons
                          product={product}
                          onToggleVisibility={toggleVisibility}
                          onToggleFeatured={toggleFeatured}
                        />
                      </td>
                      <td className="py-4">
                        <ProductActions product={product} onDelete={deleteProduct} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
