import { useLayoutEffect, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { usePresenceStage } from '../context/PresenceStageContext'
import { useCart } from '../context/CartContext'
import useSiteSettings from '../hooks/useSiteSettings'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { getProductName } from '../data/translations'
import {
  GOVERNORATES,
  WILAYATS,
  getGovernorateLabel,
  getWilayatLabel,
} from '../data/omanLocations'
import { isValidOmaniPhone, normalizeOmaniPhone } from '../lib/omanPhone'
import { resetPageScrollDelayed } from '../lib/scrollReset'
import SeoMeta from '../components/SeoMeta'
import { PAGE_SEO } from '../data/seo'
import { stringifyMapLocation } from '../lib/mapLocation'
import { calculatePayNowAmount } from '../lib/orderAmounts'
import OmaniPhoneInput from '../components/OmaniPhoneInput'
import OmanMapPicker, { MapPickerButton } from '../components/OmanMapPicker'

const INITIAL_FORM = {
  fullName: '',
  mobile: '',
  governorate: '',
  wilayat: '',
  manualAddress: '',
  orderNotes: '',
  mapLocation: null,
}

function buildFormFromOrder(order) {
  if (!order) return INITIAL_FORM

  let mobile = String(order.mobile || order.customer_phone || '').replace(/\D/g, '')
  if (mobile.startsWith('968')) mobile = mobile.slice(3)

  return {
    fullName: order.fullName || order.customer_name || '',
    mobile,
    governorate: order.governorate || '',
    wilayat: order.wilayat || '',
    manualAddress: order.manualAddress || '',
    orderNotes: order.orderNotes || order.customer_notes || '',
    mapLocation: order.mapLocation || null,
  }
}

export default function CheckoutPage() {
  const { t, lang } = useLanguage()
  const { items, total } = useCart()
  const { settings } = useSiteSettings()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState(() => buildFormFromOrder(location.state?.restoreOrder))
  const [paymentMethod, setPaymentMethod] = useState(
    location.state?.restoreOrder?.paymentMethod || 'deposit'
  )
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)
  const { setStageOverride } = usePresenceStage()

  const c = t.checkout
  const wilayats = form.governorate ? WILAYATS[form.governorate] || [] : []
  const depositAmount = Number(settings.deposit_amount || 1)
  const payNow = calculatePayNowAmount(total, paymentMethod, depositAmount)

  useLayoutEffect(() => resetPageScrollDelayed(), [])

  useEffect(() => {
    setStageOverride('checkout_personal')
    return () => setStageOverride(null)
  }, [setStageOverride])

  const update = (field, value) => {
    setForm((current) => {
      const next = { ...current, [field]: value }
      if (field === 'governorate') next.wilayat = ''
      return next
    })
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  const validateMobileField = (mobile, { onBlur = false } = {}) => {
    const digits = mobile.trim()
    if (!digits) {
      return onBlur ? c.errors.mobile : ''
    }
    if (digits.length === 8 && !isValidOmaniPhone(digits)) {
      return c.errors.mobileInvalid
    }
    return ''
  }

  const handleMobileChange = (value) => {
    setForm((current) => ({ ...current, mobile: value }))
    setErrors((current) => {
      if (value.length === 8 && !isValidOmaniPhone(value)) {
        return { ...current, mobile: c.errors.mobileInvalid }
      }
      return { ...current, mobile: '' }
    })
  }

  const handleMobileBlur = () => {
    setErrors((current) => ({
      ...current,
      mobile: validateMobileField(form.mobile, { onBlur: true }),
    }))
  }

  const validate = () => {
    const next = {}
    if (!form.fullName.trim()) next.fullName = c.errors.fullName

    if (!form.mobile.trim()) {
      next.mobile = c.errors.mobile
    } else if (!isValidOmaniPhone(form.mobile)) {
      next.mobile = c.errors.mobileInvalid
    }

    if (!form.governorate) next.governorate = c.errors.governorate
    if (!form.wilayat) next.wilayat = c.errors.wilayat
    if (!form.manualAddress.trim() && !form.mapLocation) {
      next.manualAddress = c.errors.address
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    const normalizedPhone = normalizeOmaniPhone(form.mobile)
    if (!normalizedPhone) {
      setErrors((current) => ({ ...current, mobile: c.errors.mobileInvalid }))
      return
    }

    setSubmitting(true)

    const orderPayload = {
      ...form,
      mobile: normalizedPhone,
      paymentMethod,
      total,
      payNow,
      items: items.map((item) => ({
        id: item.id,
        name: getProductName(item, lang),
        quantity: item.quantity,
        price: item.price,
        image: item.images?.[0],
      })),
    }

    const isUuid = (id) =>
      typeof id === 'string' &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

    if (isSupabaseConfigured && items.every((item) => isUuid(item.id))) {
      const mapLabel = form.mapLocation?.label || ''
      const addressParts = [form.manualAddress.trim(), mapLabel].filter(Boolean)
      const mapPayload = stringifyMapLocation(form.mapLocation)

      const { data: orderId, error } = await supabase.rpc('place_guest_order', {
        p_customer_name: form.fullName,
        p_customer_phone: normalizedPhone,
        p_governorate: form.governorate,
        p_wilayat: form.wilayat,
        p_customer_address: addressParts.join(' | ') || form.manualAddress,
        p_map_location: mapPayload,
        p_customer_notes: form.orderNotes || '',
        p_customer_email: '',
        p_items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
        p_payment_method: paymentMethod,
        p_pay_now_amount: payNow,
      })

      setSubmitting(false)

      if (error) {
        setErrors({ submit: error.message || c.errors?.submit || 'تعذر إنشاء الطلب' })
        return
      }

      navigate('/checkout/confirm', {
        state: { order: { ...orderPayload, orderId } },
      })
      return
    }

    window.setTimeout(() => {
      navigate('/checkout/confirm', { state: { order: orderPayload } })
      setSubmitting(false)
    }, 400)
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="font-bold text-slate-500 mb-4">{t.cart.empty}</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn-primary px-6 py-3 rounded-xl"
        >
          {t.nav.home}
        </button>
      </div>
    )
  }

  return (
    <>
      <SeoMeta
        title={PAGE_SEO.checkout.title}
        description={PAGE_SEO.checkout.description}
        path={PAGE_SEO.checkout.path}
        noindex={PAGE_SEO.checkout.noindex}
      />
      <section id="checkout-top" className="py-10 md:py-14 bg-[#f4f8fb] min-h-[70vh]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900">{c.title}</h1>
            <p className="text-slate-500 mt-2 font-medium">{c.subtitle}</p>
          </div>

          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 mb-6 flex items-center gap-3 text-emerald-800 font-semibold text-sm">
            <span className="text-lg">🚚</span>
            {c.freeDeliveryBanner}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div
              className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 md:p-6 space-y-4"
              onFocusCapture={() => setStageOverride('checkout_personal')}
            >
              <h2 className="font-black text-lg text-slate-900">{c.personalInfo}</h2>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  {c.fullName}
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  placeholder={c.fullNamePh}
                  className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 ${
                    errors.fullName ? 'border-red-300' : 'border-slate-200'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1 font-semibold">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  {c.mobile}
                </label>
                <OmaniPhoneInput
                  value={form.mobile}
                  onChange={handleMobileChange}
                  onBlur={handleMobileBlur}
                  placeholder={c.mobilePh}
                  error={errors.mobile}
                />
              </div>
            </div>

            <div
              className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 md:p-6 space-y-4"
              onFocusCapture={() => setStageOverride('checkout_delivery')}
            >
              <h2 className="font-black text-lg text-slate-900">{c.deliveryAddress}</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    {c.governorate}
                  </label>
                  <select
                    value={form.governorate}
                    onChange={(e) => update('governorate', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 ${
                      errors.governorate ? 'border-red-300' : 'border-slate-200'
                    }`}
                  >
                    <option value="">{c.governoratePh}</option>
                    {GOVERNORATES.map((gov) => (
                      <option key={gov.id} value={gov.id}>
                        {getGovernorateLabel(gov, lang)}
                      </option>
                    ))}
                  </select>
                  {errors.governorate && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">{errors.governorate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    {c.wilayat}
                  </label>
                  <select
                    value={form.wilayat}
                    onChange={(e) => update('wilayat', e.target.value)}
                    disabled={!form.governorate}
                    className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:opacity-50 ${
                      errors.wilayat ? 'border-red-300' : 'border-slate-200'
                    }`}
                  >
                    <option value="">{c.wilayatPh}</option>
                    {wilayats.map((w) => (
                      <option key={w.id} value={w.id}>
                        {getWilayatLabel(w, lang)}
                      </option>
                    ))}
                  </select>
                  {errors.wilayat && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">{errors.wilayat}</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-700 mb-3">{c.locationTitle}</p>

                <MapPickerButton
                  value={form.mapLocation}
                  onClick={() => setMapOpen(true)}
                />

                {form.mapLocation && (
                  <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <p className="text-sm text-emerald-800 font-bold flex items-center gap-2">
                      <span>✓</span>
                      {c.mapSelected}
                    </p>
                    {form.mapLocation.label && (
                      <p className="text-xs text-emerald-700 font-semibold mt-1 leading-6">
                        {form.mapLocation.label}
                      </p>
                    )}
                  </div>
                )}

                <OmanMapPicker
                  open={mapOpen}
                  initialLocation={form.mapLocation}
                  onClose={() => setMapOpen(false)}
                  onConfirm={(location) => {
                    update('mapLocation', location)
                    setErrors((current) => ({ ...current, manualAddress: '' }))
                    setMapOpen(false)
                  }}
                />

                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-sm text-slate-400 font-bold shrink-0">{c.or}</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  ✍️ {c.manualAddress}
                </label>
                <textarea
                  rows={3}
                  value={form.manualAddress}
                  onChange={(e) => update('manualAddress', e.target.value)}
                  placeholder={c.manualAddressPh}
                  className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 resize-none ${
                    errors.manualAddress ? 'border-red-300' : 'border-slate-200'
                  }`}
                />
                {errors.manualAddress && (
                  <p className="text-red-500 text-xs mt-1 font-semibold">{errors.manualAddress}</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 md:p-6">
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                {c.orderNotes}
              </label>
              <textarea
                rows={3}
                value={form.orderNotes}
                onChange={(e) => update('orderNotes', e.target.value)}
                placeholder={c.orderNotesPh}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 resize-none"
              />
            </div>

            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 md:p-6 space-y-4">
              <h2 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <span>💳</span>
                {c.paymentTitle}
              </h2>

              <label
                className={`block rounded-2xl border-2 p-4 cursor-pointer transition ${
                  paymentMethod === 'deposit'
                    ? 'border-oasis-mid bg-sky-50/60'
                    : 'border-slate-100 hover:border-sky-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'deposit'}
                    onChange={() => setPaymentMethod('deposit')}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-black text-slate-900">{c.payDeposit}</p>
                    <p className="text-sm text-slate-500 mt-1 leading-6">{c.payDepositHint}</p>
                  </div>
                </div>
              </label>

              <label
                className={`block rounded-2xl border-2 p-4 cursor-pointer transition ${
                  paymentMethod === 'full'
                    ? 'border-oasis-mid bg-sky-50/60'
                    : 'border-slate-100 hover:border-sky-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'full'}
                    onChange={() => setPaymentMethod('full')}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-black text-slate-900">{c.payFull}</p>
                    <p className="text-sm text-slate-500 mt-1 leading-6">
                      {c.payFullHint.replace('{total}', total.toFixed(3))}
                    </p>
                  </div>
                </div>
              </label>
            </div>

            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 md:p-6">
              <h2 className="font-black text-lg text-slate-900 mb-4">{c.orderSummary}</h2>
              <ul className="space-y-3 mb-4">
                {items.map((item) => (
                  <li key={item.id} className="flex justify-between gap-3 text-sm">
                    <span className="text-slate-700 font-semibold">
                      {getProductName(item, lang)} × {item.quantity}
                    </span>
                    <span className="font-black text-oasis-mid shrink-0">
                      {(item.price * item.quantity).toFixed(3)} {t.currency}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-slate-100 pt-3 space-y-2 text-sm">
                <div className="flex justify-between font-semibold text-slate-600">
                  <span>{c.subtotal}</span>
                  <span>
                    {total.toFixed(3)} {t.currency}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-slate-600">
                  <span>{c.deliveryFee}</span>
                  <span className="text-emerald-600">{c.free}</span>
                </div>
                <div className="flex justify-between font-black text-slate-900 text-base pt-1">
                  <span>{c.payNowLabel}</span>
                  <span className="text-oasis-mid">
                    {payNow.toFixed(3)} {t.currency}
                  </span>
                </div>
              </div>
            </div>

            {errors.submit && (
              <p className="text-red-500 text-sm font-bold text-center">{errors.submit}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl btn-primary font-black text-lg disabled:opacity-60"
            >
              {submitting ? c.submitting : c.submit}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
