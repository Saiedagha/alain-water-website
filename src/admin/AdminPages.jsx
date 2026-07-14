import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { adminBtnPrimary, adminCardClass, adminInputClass, adminLabelClass } from './adminStyles'

export default function AdminPages() {
  const [pages, setPages] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('site_pages').select('*').order('slug')
    setPages(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const save = async () => {
    if (!selected) return
    setSaving(true)
    setMessage('')

    const { error } = await supabase
      .from('site_pages')
      .update({
        title: selected.title,
        title_ar: selected.title_ar,
        content: selected.content,
        content_ar: selected.content_ar,
        is_published: selected.is_published,
        updated_at: new Date().toISOString(),
      })
      .eq('id', selected.id)

    setSaving(false)
    setMessage(error ? error.message : 'تم الحفظ')
    if (!error) load()
  }

  const update = (field, value) => setSelected((p) => ({ ...p, [field]: value }))

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className={adminCardClass}>
        <h2 className="font-black text-lg mb-4">الصفحات</h2>
        {loading ? (
          <p className="font-bold text-slate-500">جاري التحميل...</p>
        ) : (
          <div className="space-y-2">
            {pages.map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => setSelected(page)}
                className={`w-full text-right p-3 rounded-xl font-bold ${
                  selected?.id === page.id ? 'bg-sky-50 border border-alain-blue/30' : 'bg-slate-50'
                }`}
              >
                {page.title_ar || page.title}
                <span className="block text-xs text-slate-400">{page.slug}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={`lg:col-span-2 ${adminCardClass} space-y-4`}>
        {!selected ? (
          <p className="font-bold text-slate-500">اختر صفحة للتعديل</p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={adminLabelClass}>العنوان (EN)</label>
                <input className={adminInputClass} value={selected.title} onChange={(e) => update('title', e.target.value)} />
              </div>
              <div>
                <label className={adminLabelClass}>العنوان (AR)</label>
                <input className={adminInputClass} value={selected.title_ar || ''} onChange={(e) => update('title_ar', e.target.value)} />
              </div>
            </div>

            <div>
              <label className={adminLabelClass}>المحتوى (EN) — HTML</label>
              <textarea className={`${adminInputClass} min-h-[200px] font-mono text-sm`} value={selected.content} onChange={(e) => update('content', e.target.value)} dir="ltr" />
            </div>
            <div>
              <label className={adminLabelClass}>المحتوى (AR) — HTML</label>
              <textarea className={`${adminInputClass} min-h-[200px] font-mono text-sm`} value={selected.content_ar || ''} onChange={(e) => update('content_ar', e.target.value)} />
            </div>

            <label className="flex items-center gap-2 font-bold">
              <input type="checkbox" checked={selected.is_published} onChange={(e) => update('is_published', e.target.checked)} />
              منشور
            </label>

            {message && <p className="font-bold text-alain-blue">{message}</p>}

            <button type="button" onClick={save} disabled={saving} className={adminBtnPrimary}>
              {saving ? 'جاري الحفظ...' : 'حفظ الصفحة'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
