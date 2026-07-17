import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { uploadSiteAsset } from '../lib/upload'
import {
  adminBtnPrimary,
  adminCardClass,
  adminInputClass,
  adminLabelClass,
} from './adminStyles'

export default function AdminSiteSettings() {
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        setForm(data || { id: 1 })
        setLoading(false)
      })
  }, [])

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handleAsset = async (field, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadSiteAsset(file, field)
      update(field, url)
    } catch (err) {
      setMessage(err.message)
    }
    setUploading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const { error } = await supabase
      .from('site_settings')
      .update({
        ...form,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)

    setSaving(false)
    setMessage(error ? error.message : 'تم حفظ الإعدادات بنجاح')
  }

  if (loading || !form) return <p className="font-bold text-slate-500">جاري التحميل...</p>

  const fields = [
    { key: 'brand_name', label: 'اسم العلامة (EN)' },
    { key: 'brand_name_ar', label: 'اسم العلامة (AR)' },
    { key: 'brand_subtitle', label: 'الشعار الفرعي (EN)' },
    { key: 'brand_subtitle_ar', label: 'الشعار الفرعي (AR)' },
    { key: 'phone', label: 'الهاتف', ltr: true },
    { key: 'whatsapp', label: 'واتساب', ltr: true },
    { key: 'email', label: 'البريد', ltr: true },
    { key: 'address', label: 'العنوان (EN)' },
    { key: 'address_ar', label: 'العنوان (AR)' },
    { key: 'hours', label: 'ساعات العمل (EN)' },
    { key: 'hours_ar', label: 'ساعات العمل (AR)' },
    { key: 'hero_title', label: 'عنوان الهيرو (EN)' },
    { key: 'hero_subtitle', label: 'وصف الهيرو (EN)' },
    { key: 'hero_badge', label: 'شارة الهيرو' },
    { key: 'footer_description', label: 'وصف الفوتر (EN)' },
    { key: 'footer_description_ar', label: 'وصف الفوتر (AR)' },
    { key: 'social_instagram', label: 'Instagram', ltr: true },
    { key: 'social_facebook', label: 'Facebook', ltr: true },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-4xl">
      {message && (
        <div className={`p-4 rounded-2xl font-bold ${message.includes('نجاح') ? 'bg-green-50 text-green-700' : message.includes('فشل') || message.includes('error') ? 'bg-red-50 text-red-600' : 'bg-admin-soft text-admin-dark'}`}>
          {message}
        </div>
      )}

      <div className={`${adminCardClass} space-y-4`}>
        <h2 className="text-xl font-black">معلومات التواصل والعلامة</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {fields.map(({ key, label, ltr }) => (
            <div key={key}>
              <label className={adminLabelClass}>{label}</label>
              <input
                className={adminInputClass}
                value={form[key] || ''}
                onChange={(e) => update(key, e.target.value)}
                dir={ltr ? 'ltr' : undefined}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={`${adminCardClass} space-y-4`}>
        <h2 className="text-xl font-black">الدفع والتوصيل</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={adminLabelClass}>مبلغ العربون (AED)</label>
            <input
              type="number"
              step="0.01"
              className={adminInputClass}
              value={form.deposit_amount ?? 5}
              onChange={(e) => update('deposit_amount', e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 font-bold pb-3">
              <input
                type="checkbox"
                checked={form.delivery_free !== false}
                onChange={(e) => update('delivery_free', e.target.checked)}
              />
              توصيل مجاني
            </label>
          </div>
        </div>
      </div>

      <div className={`${adminCardClass} space-y-4`}>
        <h2 className="text-xl font-black">الصور</h2>
        {['logo_url', 'hero_image_url'].map((field) => (
          <div key={field}>
            <label className={adminLabelClass}>{field === 'logo_url' ? 'الشعار' : 'صورة الهيرو'}</label>
            <input type="file" accept="image/*" onChange={(e) => handleAsset(field, e)} className="block mb-2" />
            {form[field] && <img src={form[field]} alt="" className="h-24 rounded-xl object-contain border mb-2" />}
            <input className={adminInputClass} value={form[field] || ''} onChange={(e) => update(field, e.target.value)} dir="ltr" />
          </div>
        ))}
        {uploading && <p className="text-sm font-bold text-slate-500">جاري رفع الصورة...</p>}
      </div>

      <div className={`${adminCardClass} space-y-4`}>
        <h2 className="text-xl font-black">Paymob (للتفعيل لاحقاً)</h2>
        <label className="flex items-center gap-2 font-bold">
          <input type="checkbox" checked={Boolean(form.paymob_enabled)} onChange={(e) => update('paymob_enabled', e.target.checked)} />
          تفعيل Paymob
        </label>
        {['paymob_api_key', 'paymob_merchant_id', 'paymob_integration_id', 'paymob_iframe_id', 'paymob_hmac_secret'].map((key) => (
          <div key={key}>
            <label className={adminLabelClass}>{key}</label>
            <input className={adminInputClass} value={form[key] || ''} onChange={(e) => update(key, e.target.value)} dir="ltr" />
          </div>
        ))}
      </div>

      <button type="submit" disabled={saving || uploading} className={adminBtnPrimary}>
        {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
      </button>
    </form>
  )
}
