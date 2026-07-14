import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import { getProductName } from '../data/translations'
import { resetPageScroll } from '../lib/scrollReset'

export default function CartDrawer() {
  const { t, lang } = useLanguage()
  const { items, isOpen, setIsOpen, total, updateQuantity, removeItem } = useCart()
  const navigate = useNavigate()

  if (!isOpen) return null

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 bg-black/50 z-[60]"
        onClick={() => setIsOpen(false)}
        aria-label="Close"
      />
      <aside className="fixed inset-x-0 bottom-0 z-[70] cart-sheet">
        <div className="max-w-lg mx-auto bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-lg font-black text-slate-900 inline-flex items-center gap-2">
              <span className="text-oasis-mid">🛒</span>
              {t.cart.title}
            </h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-slate-100 font-bold text-slate-500"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {items.length === 0 ? (
              <p className="text-center text-slate-500 font-semibold py-10">{t.cart.empty}</p>
            ) : (
              <ul className="space-y-3">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <img
                      src={item.images[0]}
                      alt={getProductName(item, lang)}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-slate-900">
                        {getProductName(item, lang)}
                      </p>
                      <p className="text-oasis-mid font-black text-sm mt-0.5">
                        {item.price.toFixed(3)} {t.currency}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-white border text-sm font-bold"
                        >
                          −
                        </button>
                        <span className="font-bold text-sm w-5 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-white border text-sm font-bold"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="ms-auto text-xs font-bold text-slate-400 hover:text-red-500"
                        >
                          {t.cart.remove}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="px-5 py-4 border-t border-slate-100 space-y-3 pb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-500">{t.cart.total}</span>
                <span className="font-black text-2xl text-oasis-mid">
                  {total.toFixed(3)} {t.currency}
                </span>
              </div>
              <Link
                to="/checkout"
                onClick={(event) => {
                  event.preventDefault()
                  setIsOpen(false)
                  resetPageScroll()
                  navigate('/checkout')
                }}
                className="block w-full py-3.5 rounded-2xl btn-primary text-center font-black"
              >
                {t.cart.checkout}
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
