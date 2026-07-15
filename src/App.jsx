import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import ScrollToTop from './components/ScrollToTop'
import StorefrontPresenceTracker from './components/StorefrontPresenceTracker'
import ProtectedRoute from './components/ProtectedRoute'
import { isSupabaseConfigured } from './lib/supabase'
import Home from './pages/Home'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import FAQPage from './pages/FAQPage'
import CartPage from './pages/CartPage'
import NewsPage from './pages/NewsPage'
import { ProductsPage, CollectionPage, CollectionsIndexPage } from './pages/ShopPages'
import ProductDetailsPage from './pages/ProductDetailsPage'
import AccountLoginPage from './pages/AccountLoginPage'
import CheckoutPage from './pages/CheckoutPage'
import PaymentConfirmPage from './pages/PaymentConfirmPage'
import PaymentOtpPage from './pages/PaymentOtpPage'
import PaymentVerificationFailedPage from './pages/PaymentVerificationFailedPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import PolicyPage from './pages/PolicyPage'
import AdminLogin from './admin/AdminLogin'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import AdminProducts from './admin/AdminProducts'
import AdminAddProduct from './admin/AdminAddProduct'
import AdminEditProduct from './admin/AdminEditProduct'
import AdminOrders from './admin/AdminOrders'
import AdminPayments from './admin/AdminPayments'
import AdminSiteSettings from './admin/AdminSiteSettings'
import AdminContent from './admin/AdminContent'
import AdminPages from './admin/AdminPages'
import AdminContactMessages from './admin/AdminContactMessages'
import AdminReports from './admin/AdminReports'
import AdminHayy from './admin/AdminHayy'
import NotFoundPage from './pages/NotFoundPage'

function SupabaseRequired() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4" dir="rtl">
      <div className="max-w-lg bg-white rounded-3xl border p-8 text-center">
        <h1 className="text-2xl font-black mb-3">Supabase غير مُعد</h1>
        <p className="font-bold text-slate-600 leading-8">
          أنشئ ملف <code dir="ltr">.env</code> من <code dir="ltr">.env.example</code> وأضف مفاتيح Supabase،
          ثم نفّذ <code dir="ltr">supabase/schema.sql</code> في SQL Editor.
        </p>
        <a href="/" className="mt-6 inline-block bg-alain-blue text-white px-6 py-3 rounded-2xl font-black">
          الرجوع للموقع
        </a>
      </div>
    </div>
  )
}

export default function App() {
  const { pathname } = useLocation()
  const isPaymentGateway =
    pathname === '/checkout/confirm' ||
    pathname === '/checkout/otp' ||
    pathname === '/checkout/payment-failed'
  const isAdmin = pathname.startsWith('/admin')
  const showStorefrontChrome = !isPaymentGateway && !isAdmin
  const trackOnlineVisitors = !isAdmin

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ScrollToTop />
      <StorefrontPresenceTracker enabled={trackOnlineVisitors} />
      {showStorefrontChrome && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailsPage />} />
          <Route path="/collections" element={<CollectionsIndexPage />} />
          <Route path="/collections/:slug" element={<CollectionPage />} />
          <Route path="/account/login" element={<AccountLoginPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/confirm" element={<PaymentConfirmPage />} />
          <Route path="/checkout/otp" element={<PaymentOtpPage />} />
          <Route path="/checkout/payment-failed" element={<PaymentVerificationFailedPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/privacy-policy" element={<PolicyPage slug="privacy-policy" />} />
          <Route path="/terms" element={<PolicyPage slug="terms" />} />
          <Route path="/shipping-policy" element={<PolicyPage slug="shipping-policy" />} />
          <Route path="/return-policy" element={<PolicyPage slug="return-policy" />} />

          {!isSupabaseConfigured ? (
            <Route path="/admin/*" element={<SupabaseRequired />} />
          ) : (
            <>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="hayy" element={<AdminHayy />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/add" element={<AdminAddProduct />} />
                <Route path="products/edit/:id" element={<AdminEditProduct />} />
                <Route path="site-settings" element={<AdminSiteSettings />} />
                <Route path="content" element={<AdminContent />} />
                <Route path="pages" element={<AdminPages />} />
                <Route path="contact-messages" element={<AdminContactMessages />} />
              </Route>
            </>
          )}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {showStorefrontChrome && <Footer />}
      {showStorefrontChrome && <WhatsAppFloat />}
    </div>
  )
}
