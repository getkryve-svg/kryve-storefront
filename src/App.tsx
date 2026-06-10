import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import Analytics from './components/Analytics'
import { initInventory } from './lib/inventory'

// Pages — Store
import HomePage             from './pages/HomePage'
import ShopPage             from './pages/ShopPage'
import ProductPage          from './pages/ProductPage'

// Pages — Checkout
import CartPage             from './pages/CartPage'
import CheckoutPage         from './pages/CheckoutPage'
import PaymentPage          from './pages/PaymentPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import OrderSuccessPage      from './pages/OrderSuccessPage'
import OrdersPage           from './pages/OrdersPage'

// Pages — Account
import AuthPage             from './pages/AuthPage'
import AccountPage          from './pages/AccountPage'
import WishlistPage         from './pages/WishlistPage'
import AdminPage            from './pages/AdminPage'

// Pages — Drops
import DropsPage            from './pages/DropsPage'

// Pages — Content
import AboutPage            from './pages/AboutPage'
import FAQPage              from './pages/FAQPage'
import SizeGuidePage        from './pages/SizeGuidePage'
import ReturnsPage          from './pages/ReturnsPage'
import ContactPage          from './pages/ContactPage'
import PrivacyPage          from './pages/PrivacyPage'
import TermsPage            from './pages/TermsPage'

// Init inventory defaults on first load
initInventory()

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Analytics />
            <Navbar />
            <CartDrawer />
            <ErrorBoundary>
              <Routes>
                {/* Store */}
                <Route path="/"                    element={<HomePage />} />
                <Route path="/shop"                element={<ShopPage />} />
                <Route path="/products/:handle"    element={<ProductPage />} />
                <Route path="/product/:handle"     element={<ProductPage />} />

                {/* Drops */}
                <Route path="/drops"               element={<DropsPage />} />

                {/* Checkout */}
                <Route path="/cart"                element={<CartPage />} />
                <Route path="/checkout"            element={<CheckoutPage />} />
                <Route path="/payment"             element={<PaymentPage />} />
                <Route path="/order-confirmation"  element={<OrderConfirmationPage />} />
                <Route path="/order-success"       element={<OrderSuccessPage />} />
                <Route path="/orders"              element={<OrdersPage />} />

                {/* Account */}
                <Route path="/auth"                element={<AuthPage />} />
                <Route path="/account"             element={<AccountPage />} />
                <Route path="/wishlist"            element={<WishlistPage />} />
                <Route path="/admin"               element={<AdminPage />} />

                {/* Content */}
                <Route path="/about"               element={<AboutPage />} />
                <Route path="/faq"                 element={<FAQPage />} />
                <Route path="/size-guide"          element={<SizeGuidePage />} />
                <Route path="/returns"             element={<ReturnsPage />} />
                <Route path="/contact"             element={<ContactPage />} />
                <Route path="/privacy"             element={<PrivacyPage />} />
                <Route path="/terms"               element={<TermsPage />} />

                {/* Fallback */}
                <Route path="*"                    element={<HomePage />} />
              </Routes>
            </ErrorBoundary>
            <Footer />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
