import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { markContactMessagesSeen } from '../hooks/useAdminNotifications'
import { adminCardClass, formatDate } from './adminStyles'

export default function AdminContactMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data || [])
    setLoading(false)
    markContactMessagesSeen()
    window.dispatchEvent(new Event('oasis-contact-seen'))
  }

  useEffect(() => {
    load()
  }, [])

  const markRead = async (msg) => {
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', msg.id)
    setSelected({ ...msg, is_read: true })
    load()
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className={adminCardClass}>
        <h2 className="font-black text-lg mb-4">الرسائل ({messages.length})</h2>
        {loading ? (
          <p className="font-bold text-slate-500">جاري التحميل...</p>
        ) : messages.length === 0 ? (
          <p className="font-bold text-slate-500">لا توجد رسائل.</p>
        ) : (
          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            {messages.map((msg) => (
              <button
                key={msg.id}
                type="button"
                onClick={() => {
                  setSelected(msg)
                  if (!msg.is_read) markRead(msg)
                }}
                className={`w-full text-right p-3 rounded-xl ${
                  selected?.id === msg.id ? 'bg-sky-50 border border-alain-blue/30' : msg.is_read ? 'bg-slate-50' : 'bg-amber-50 border border-amber-100'
                }`}
              >
                <p className="font-black text-slate-900">{msg.name}</p>
                <p className="text-sm font-bold text-slate-600 truncate">{msg.subject || msg.message}</p>
                <p className="text-xs text-slate-400 font-bold">{formatDate(msg.created_at)}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={`lg:col-span-2 ${adminCardClass}`}>
        {!selected ? (
          <p className="font-bold text-slate-500">اختر رسالة</p>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-black">{selected.name}</h2>
            <p className="font-bold text-slate-600">{selected.email}</p>
            {selected.phone && <p className="font-bold text-slate-600">{selected.phone}</p>}
            {selected.subject && <p className="font-black text-alain-blue-dark">{selected.subject}</p>}
            <p className="font-bold text-slate-800 leading-8 whitespace-pre-wrap">{selected.message}</p>
            <p className="text-sm text-slate-400 font-bold">{formatDate(selected.created_at)}</p>
          </div>
        )}
      </div>
    </div>
  )
}
