import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { uploadProductImage } from '../lib/upload'
import {
  adminBtnPrimary,
  adminBtnSecondary,
  adminCardClass,
  adminInputClass,
  adminLabelClass,
} from './adminStyles'

const INITIAL = {
  name: '',
  name_ar: '',
  slug: '',
  category: '',
  description: '',
  description_ar: '',
  price: '',
  sort_order: 0,
  is_visible: true,
  is_featured: false,
  is_in_stock: true,
  stock_quantity: 999,
  image_url: '',
}

export default function AdminAddProduct() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handleImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadProductImage(file)
      update('image_url', url)
    } catch (err) {
      setError(err.message || 'فشل رفع الصورة')
    }
    setUploading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const slug =
      form.slug.trim() ||
      form.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

    const base = {
      name: form.name.trim(),
      name_ar: form.name_ar.trim(),
      description: form.description.trim(),
      description_ar: form.description_ar.trim(),
      price: Number(form.price) || 0,
      sort_order: Number(form.sort_order) || 0,
      is_visible: form.is_visible,
      is_featured: form.is_featured,
      is_in_stock: form.is_in_stock,
      stock_quantity: Number(form.stock_quantity) || 0,
      image_url: form.image_url || null,
    }

    let { error: insertError } = await supabase.from('products').insert({
      ...base,
      slug: slug || null,
      category: form.category.trim() || null,
    })

    // Older schemas may not have slug/category yet
    if (insertError && /slug|category/i.test(insertError.message)) {
      ;({ error: insertError } = await supabase.from('products').insert(base))
    }

    setLoading(false)
    if (insertError) {
      setError(insertError.message)
      return
    }
    navigate('/admin/products')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      <div className="flex gap-3">
        <Link to="/admin/products" className={adminBtnSecondary}>رجوع</Link>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl font-bold">{error}</div>}

      <div className={`${adminCardClass} space-y-4`}>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={adminLabelClass}>اسم المنتج (EN)</label>
            <input className={adminInputClass} value={form.name} onChange={(e) => update('name', e.target.value)} required />
          </div>
          <div>
            <label className={adminLabelClass}>اسم المنتج (AR)</label>
            <input className={adminInputClass} value={form.name_ar} onChange={(e) => update('name_ar', e.target.value)} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={adminLabelClass}>Slug (رابط المنتج)</label>
            <input
              className={adminInputClass}
              value={form.slug}
              onChange={(e) => update('slug', e.target.value)}
              placeholder="al-ain-water-5-gallon"
              dir="ltr"
            />
          </div>
          <div>
            <label className={adminLabelClass}>التصنيف</label>
            <input
              className={adminInputClass}
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              placeholder="bottled-water"
              dir="ltr"
            />
          </div>
        </div>

        <div>
          <label className={adminLabelClass}>الوصف (EN)</label>
          <textarea className={adminInputClass} rows={3} value={form.description} onChange={(e) => update('description', e.target.value)} />
        </div>
        <div>
          <label className={adminLabelClass}>الوصف (AR)</label>
          <textarea className={adminInputClass} rows={3} value={form.description_ar} onChange={(e) => update('description_ar', e.target.value)} />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className={adminLabelClass}>السعر (OMR)</label>
            <input type="number" step="0.001" className={adminInputClass} value={form.price} onChange={(e) => update('price', e.target.value)} required />
          </div>
          <div>
            <label className={adminLabelClass}>ترتيب العرض</label>
            <input type="number" className={adminInputClass} value={form.sort_order} onChange={(e) => update('sort_order', e.target.value)} />
          </div>
          <div>
            <label className={adminLabelClass}>المخزون</label>
            <input type="number" className={adminInputClass} value={form.stock_quantity} onChange={(e) => update('stock_quantity', e.target.value)} />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 font-bold">
            <input type="checkbox" checked={form.is_visible} onChange={(e) => update('is_visible', e.target.checked)} />
            ظاهر في الموقع
          </label>
          <label className="flex items-center gap-2 font-bold">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => update('is_featured', e.target.checked)} />
            منتج مميز
          </label>
          <label className="flex items-center gap-2 font-bold">
            <input type="checkbox" checked={form.is_in_stock} onChange={(e) => update('is_in_stock', e.target.checked)} />
            متوفر
          </label>
        </div>

        <div>
          <label className={adminLabelClass}>صورة المنتج</label>
          <input type="file" accept="image/*" onChange={handleImage} className="block mb-2" />
          {uploading && <p className="text-sm font-bold text-slate-500">جاري رفع الصورة...</p>}
          {form.image_url && (
            <img src={form.image_url} alt="" className="w-32 h-32 rounded-2xl object-cover border" />
          )}
          <input
            className={`${adminInputClass} mt-2`}
            placeholder="أو الصق رابط الصورة"
            value={form.image_url}
            onChange={(e) => update('image_url', e.target.value)}
            dir="ltr"
          />
        </div>

        <button type="submit" disabled={loading || uploading} className={adminBtnPrimary}>
          {loading ? 'جاري الحفظ...' : 'حفظ المنتج'}
        </button>
      </div>
    </form>
  )
}
