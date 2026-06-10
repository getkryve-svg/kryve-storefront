import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useCart } from '../context/CartContext'

export default function OrderSuccessPage() {
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, [])

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 bg-[#FAF8F5] flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight mb-3">Order confirmed!</h1>
        <p className="font-body text-sm text-[#888] mb-2">
          Thank you for your purchase. You'll receive a confirmation email shortly.
        </p>
        <p className="font-body text-xs text-[#AAA] mb-10">
          Happy People Make More Money™
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 font-display font-bold text-sm tracking-widest uppercase px-8 py-4 bg-[#1A1A1A] text-white rounded-sm hover:bg-[#333] transition-colors"
        >
          Continue Shopping →
        </Link>
      </div>
    </main>
  )
}
