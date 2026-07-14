import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { adminBtnPrimary, adminCardClass, formatMoney } from './adminStyles'

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
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="بحث في المنتجات..."
          className="border border-slate-300 rounded-2xl px-4 py-3 font-bold max-w-md w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link to="/admin/products/add" className={adminBtnPrimary}>
          + إضافة منتج
        </Link>
      </div>

      <div className={adminCardClass}>
        {loading ? (
          <p className="font-bold text-slate-500">جاري التحميل...</p>
        ) : filtered.length === 0 ? (
          <p className="font-bold text-slate-500">لا توجد منتجات.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
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
                      <div className="flex items-center gap-3">
                        {product.image_url && (
                          <img src={product.image_url} alt="" className="w-12 h-12 rounded-xl object-cover" />
                        )}
                        <div>
                          <p className="font-black text-slate-900">{product.name}</p>
                          <p className="text-sm text-slate-500 font-bold">{product.name_ar}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 font-black text-alain-blue">{formatMoney(product.price)} AED</td>
                    <td className="py-4 font-bold">{product.sort_order}</td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => toggleVisibility(product)}
                          className={`text-xs font-black px-2 py-1 rounded-lg ${product.is_visible ? 'bg-green-100 text-green-700' : 'bg-slate-200'}`}
                        >
                          {product.is_visible ? 'ظاهر' : 'مخفي'}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleFeatured(product)}
                          className={`text-xs font-black px-2 py-1 rounded-lg ${product.is_featured ? 'bg-amber-100 text-amber-700' : 'bg-slate-100'}`}
                        >
                          {product.is_featured ? 'مميز' : 'عادي'}
                        </button>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="text-sm font-black text-alain-blue hover:underline"
                        >
                          تعديل
                        </Link>
                        <button
                          type="button"
                          onClick={() => deleteProduct(product.id)}
                          className="text-sm font-black text-red-600 hover:underline"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
