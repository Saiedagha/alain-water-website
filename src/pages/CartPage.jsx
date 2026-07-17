import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import SeoMeta from '../components/SeoMeta'
import { UI } from '../data/alainContent'

export default function CartPage() {
  const { lang } = useLanguage()
  const ui = UI[lang] || UI.en
  const { items, updateQuantity, removeItem, total, count } = useCart()

  return (
    <>
      <SeoMeta title={`${ui.cart} – Al Ain Water`} description={ui.cartEmpty} path="/cart" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14 min-h-[60vh]">
        <nav className="text-sm text-slate-500 mb-8">
          <Link to="/" className="hover:text-alain-blue">
            {ui.home}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-800">{ui.cart}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-black uppercase text-center mb-10 tracking-tight">
          {ui.cart}
        </h1>

        {count === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-slate-700 mb-2">{ui.cartEmpty}</p>
            <p className="text-slate-500 mb-8">{ui.cartReady}</p>
            <Link to="/products" className="btn-primary">
              {ui.shopNow}
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 border border-slate-100 rounded-2xl bg-white"
                >
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    className="w-24 h-24 object-contain bg-[#f3f7fa] rounded-xl"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900">
                      {lang === 'ar' ? item.nameAr || item.name : item.name}
                    </p>
                    <p className="text-sm text-alain-blue font-bold mt-1">
                      {Number(item.price).toFixed(2)} {ui.aed}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <label className="text-xs text-slate-500">{ui.quantity}</label>
                      <div className="flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-9 w-9 items-center justify-center text-lg font-bold text-slate-700 transition hover:bg-slate-50"
                          aria-label={`Decrease quantity for ${lang === 'ar' ? item.nameAr || item.name : item.name}`}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, Number(e.target.value) || 1)}
                          className="h-9 w-14 border-x border-slate-200 px-2 text-center outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-9 w-9 items-center justify-center text-lg font-bold text-slate-700 transition hover:bg-slate-50"
                          aria-label={`Increase quantity for ${lang === 'ar' ? item.nameAr || item.name : item.name}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-red-500 font-semibold ms-auto"
                      >
                        {ui.remove}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="border border-slate-100 rounded-2xl p-6 h-fit bg-[#f8fafc]">
              <div className="flex justify-between font-bold text-lg mb-6">
                <span>{ui.total}</span>
                <span>
                  {Number(total).toFixed(2)} {ui.aed}
                </span>
              </div>
              <Link to="/checkout" className="btn-primary w-full mb-3">
                {ui.checkout}
              </Link>
              <Link
                to="/products"
                className="block text-center text-sm font-semibold text-alain-blue hover:underline"
              >
                {ui.continueShopping}
              </Link>
            </aside>
          </div>
        )}
      </div>
    </>
  )
}
