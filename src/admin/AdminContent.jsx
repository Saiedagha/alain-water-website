import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { adminBtnPrimary, adminCardClass, adminInputClass, adminLabelClass } from './adminStyles'

const SECTIONS = [
  { key: 'faq', label: 'الأسئلة الشائعة (JSON)' },
  { key: 'testimonials', label: 'آراء العملاء (JSON)' },
  { key: 'why', label: 'لماذا نحن (JSON)' },
  { key: 'story', label: 'قصتنا (JSON)' },
  { key: 'quality', label: 'جودة المياه (JSON)' },
  { key: 'delivery', label: 'التوصيل (JSON)' },
]

export default function AdminContent() {
  const [content, setContent] = useState({})
  const [activeSection, setActiveSection] = useState('faq')
  const [jsonText, setJsonText] = useState('{}')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('content_json')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        const json = data?.content_json || {}
        setContent(json)
        setJsonText(JSON.stringify(json[activeSection] || {}, null, 2))
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    setJsonText(JSON.stringify(content[activeSection] || {}, null, 2))
  }, [activeSection, content])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')

    let parsed
    try {
      parsed = JSON.parse(jsonText)
    } catch {
      setMessage('JSON غير صالح — تأكد من الصيغة')
      setSaving(false)
      return
    }

    const nextContent = { ...content, [activeSection]: parsed }

    const { error } = await supabase
      .from('site_settings')
      .update({ content_json: nextContent, updated_at: new Date().toISOString() })
      .eq('id', 1)

    setSaving(false)
    if (error) {
      setMessage(error.message)
    } else {
      setContent(nextContent)
      setMessage('تم حفظ المحتوى بنجاح')
    }
  }

  if (loading) return <p className="font-bold text-slate-500">جاري التحميل...</p>

  return (
    <div className="space-y-5 max-w-5xl">
      <div className={`${adminCardClass} bg-sky-50 border-alain-blue/20`}>
        <p className="font-bold text-alain-navy leading-7">
          عدّل محتوى أقسام الموقع بصيغة JSON. يمكنك نسخ البنية من ملف الترجمة الحالي ثم تخصيصها.
          عند تفعيل Supabase، يمكن للموقع قراءة هذا المحتوى ديناميكياً.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SECTIONS.map((section) => (
          <button
            key={section.key}
            type="button"
            onClick={() => setActiveSection(section.key)}
            className={`px-4 py-2 rounded-xl font-black text-sm ${
              activeSection === section.key ? 'bg-alain-blue text-white' : 'bg-white border border-slate-200'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      <div className={`${adminCardClass} space-y-4`}>
        <label className={adminLabelClass}>محتوى القسم: {activeSection}</label>
        <textarea
          className={`${adminInputClass} font-mono text-sm min-h-[400px]`}
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          dir="ltr"
        />
        {message && (
          <p className={`font-bold ${message.includes('نجاح') ? 'text-green-700' : 'text-red-600'}`}>{message}</p>
        )}
        <button type="button" onClick={handleSave} disabled={saving} className={adminBtnPrimary}>
          {saving ? 'جاري الحفظ...' : 'حفظ المحتوى'}
        </button>
      </div>
    </div>
  )
}
