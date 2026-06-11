import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CartProvider } from './context/CartContext'
import AnnouncementBar from './components/AnnouncementBar'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'

// Pages
import HomePage    from './pages/HomePage'
import ShopPage    from './pages/ShopPage'
import ProductPage from './pages/ProductPage'
import AboutPage   from './pages/AboutPage'
import FAQPage     from './pages/FAQPage'
import ContactPage from './pages/ContactPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage   from './pages/TermsPage'
import SciencePage  from './pages/SciencePage'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <BrowserRouter>
          <AnnouncementBar />
          <Navbar />
          <CartDrawer />
          <ErrorBoundary>
            <Routes>
              <Route path="/"                 element={<HomePage />} />
              <Route path="/shop"             element={<ShopPage />} />
              <Route path="/products/:handle" element={<ProductPage />} />
              <Route path="/about"            element={<AboutPage />} />
              <Route path="/faq"              element={<FAQPage />} />
              <Route path="/contact"          element={<ContactPage />} />
              <Route path="/privacy"          element={<PrivacyPage />} />
              <Route path="/terms"            element={<TermsPage />} />
              <Route path="/science"          element={<SciencePage />} />
              <Route path="*"                 element={<HomePage />} />
            </Routes>
          </ErrorBoundary>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </QueryClientProvider>
  )
}
