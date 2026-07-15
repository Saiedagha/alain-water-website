import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LOGO_URL } from '../data/alainContent'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      setErrorMessage(
        'Supabase غير مُعد لمشروع العين. أضف مفاتيح مشروع مستقل في ملف .env ثم أعد تشغيل npm run dev.'
      )
      return
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    setLoading(false)

    if (error) {
      const msg = error.message?.toLowerCase() || ''
      if (msg.includes('failed to fetch') || msg.includes('network')) {
        setErrorMessage(
          'تعذر الاتصال بـ Supabase. تأكد من مفاتيح مشروع العين في .env ثم أعد تشغيل npm run dev.'
        )
      } else if (msg.includes('email not confirmed')) {
        setErrorMessage(
          'الإيميل غير مفعّل. من Supabase: Authentication → Users → Confirm user.'
        )
      } else if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
        setErrorMessage('البريد أو كلمة المرور غير صحيحة.')
      } else {
        setErrorMessage(error.message || 'تعذر تسجيل الدخول. حاول مرة أخرى.')
      }
      return
    }

    const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin')

    if (adminError) {
      await supabase.auth.signOut()
      setErrorMessage(
        `خطأ في التحقق من الأدمن: ${adminError.message}. شغّل schema.sql و link-admin.sql.`
      )
      return
    }

    if (!isAdmin) {
      await supabase.auth.signOut()
      setErrorMessage('هذا الحساب غير مصرح له بدخول لوحة العين.')
      return
    }

    if (data.user) navigate('/admin')
  }

  return (
    <div
      className="min-h-screen px-4 py-10 flex items-center justify-center"
      dir="rtl"
      style={{
        background:
          'radial-gradient(ellipse at top, #e8f6ee 0%, #f4fbf7 45%, #ffffff 100%)',
      }}
    >
      <div className="w-full max-w-[1080px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[28px] border border-slate-100 shadow-[0_20px_60px_rgba(31,138,76,0.14)] overflow-hidden">
        <div
          className="hidden lg:flex flex-col justify-between p-10 text-white relative overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #0f3d24 0%, #166b3a 48%, #1f8a4c 100%)',
          }}
        >
          <div className="absolute -top-16 -start-16 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-10 -end-10 w-40 h-40 rounded-full bg-emerald-300/30 blur-xl" />

          <div className="relative z-10">
            <img
              src={LOGO_URL}
              alt="Al Ain Water"
              className="h-16 w-auto object-contain bg-white/95 rounded-2xl px-3 py-2 mb-8"
            />
            <p className="text-emerald-100 text-sm font-bold tracking-wide mb-2">AL AIN WATER</p>
            <h1 className="text-4xl xl:text-5xl font-black leading-tight">لوحة تحكم العين</h1>
            <p className="text-white/75 mt-4 font-bold leading-8 max-w-sm">
              إدارة المنتجات والطلبات والمحتوى بإطلالة مميزة لعلامة مياه العين.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur px-4 py-5">
              <p className="text-emerald-100/80 text-xs font-bold">المنتجات</p>
              <p className="text-xl font-black mt-2">كتالوج المياه</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur px-4 py-5">
              <p className="text-emerald-100/80 text-xs font-bold">الطلبات</p>
              <p className="text-xl font-black mt-2">متابعة مباشرة</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="p-6 sm:p-8 md:p-10 lg:p-12 bg-white">
          <div className="mb-8 text-center lg:text-right">
            <img
              src={LOGO_URL}
              alt="Al Ain Water"
              className="h-14 w-auto object-contain mx-auto lg:mx-0 mb-5"
            />
            <h1 className="text-3xl md:text-4xl font-black text-admin-deep">تسجيل الدخول</h1>
            <p className="text-slate-500 mt-3 font-bold leading-7">
              ادخل بيانات أدمن موقع العين
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm font-bold">
              {errorMessage}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-black text-slate-700">البريد الإلكتروني</label>
              <input
                type="email"
                className="w-full border border-slate-200 rounded-full px-5 py-3.5 outline-none focus:border-admin focus:ring-4 focus:ring-admin/10 text-left bg-slate-50/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                dir="ltr"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-black text-slate-700">كلمة المرور</label>
              <input
                type="password"
                className="w-full border border-slate-200 rounded-full px-5 py-3.5 outline-none focus:border-admin focus:ring-4 focus:ring-admin/10 text-left bg-slate-50/50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                dir="ltr"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full bg-admin text-white py-4 rounded-full font-black text-lg hover:bg-admin-dark disabled:opacity-60 transition shadow-lg shadow-admin/25"
          >
            {loading ? 'جاري تسجيل الدخول...' : 'دخول لوحة العين'}
          </button>

          <Link
            to="/"
            className="mt-4 block text-center border border-slate-200 text-admin-deep py-3.5 rounded-full font-black hover:bg-slate-50 transition"
          >
            الرجوع للموقع
          </Link>
        </form>
      </div>
    </div>
  )
}
