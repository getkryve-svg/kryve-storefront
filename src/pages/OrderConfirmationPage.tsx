import { useEffect } from 'react'
import { Link, useLocation, Navigate } from 'react-router-dom'
import type { Order } from '../types'

export default function OrderConfirmationPage() {
  const location = useLocation()
  const { order } = (location.state || {}) as { order?: Order }

  // Scroll to top
  useEffect(() => { window.scrollTo(0, 0) }, [])

  if (!order) return <Navigate to="/" replace />

  const addr = order.shippingAddress

  return (
    <main className="min-h-screen pt-20 pb-20 bg-[#FAF8F5]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Success header */}
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-[#10B981]/15 flex items-center justify-center mx-auto mb-5">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#10B981" strokeWidth="2.5">
              <path d="M5 14l6 6 12-12"/>
            </svg>
          </div>
          <p className="font-body text-xs tracking-[0.25em] uppercase text-[#8B6F47] mb-2">Order Confirmed</p>
          <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight mb-3">
            Thank you, {addr.firstName}!
          </h1>
          <p className="font-body text-sm text-[#888] mb-1">
            Your order <strong className="text-[#1A1A1A]">{order.id}</strong> has been placed.
          </p>
          <p className="font-body text-sm text-[#888]">
            A confirmation will be sent to <strong className="text-[#1A1A1A]">{addr.email}</strong>
          </p>
        </div>

        {/* Order details */}
        <div className="bg-white border border-[#E5E0D8] rounded-lg overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-[#E5E0D8]">
            <h2 className="font-display font-bold text-base tracking-tight">Order Details</h2>
          </div>
          <div className="p-5 space-y-4">
            {order.items.map(item => (
              <div key={item.variantId} className="flex gap-3 items-start">
                <div className="w-14 h-14 rounded-md overflow-hidden bg-[#EDE8E2] flex-shrink-0">
                  {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1">
                  <p className="font-display font-bold text-sm">{item.title}</p>
                  <p className="font-body text-xs text-[#AAA]">{item.variantTitle} × {item.quantity}</p>
                </div>
                <p className="font-display font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-[#E5E0D8] bg-[#FAF8F5] space-y-2 font-body text-sm">
            <div className="flex justify-between text-[#555]"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[#10B981]">
                <span>{order.discountCode || 'Discount'}</span>
                <span>−${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#555]">
              <span>Shipping</span>
              <span>{order.shipping === 0 ? <span className="text-[#10B981]">Free</span> : `$${order.shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-display font-bold text-base pt-2 border-t border-[#E5E0D8]">
              <span>Total</span><span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping address */}
        <div className="bg-white border border-[#E5E0D8] rounded-lg p-5 mb-6">
          <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-[#888] mb-3">Ships to</h3>
          <p className="font-body text-sm text-[#1A1A1A]">{addr.firstName} {addr.lastName}</p>
          <p className="font-body text-sm text-[#555]">
            {addr.address1}{addr.address2 ? `, ${addr.address2}` : ''}<br />
            {addr.city}, {addr.state} {addr.zip}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-body text-xs text-[#888]">Processing — ships in 3–5 business days</span>
          </div>
        </div>

        {/* What's next */}
        <div className="bg-white border border-[#E5E0D8] rounded-lg p-5 mb-8">
          <h3 className="font-display font-bold text-base tracking-tight mb-4">What happens next?</h3>
          <div className="space-y-3">
            {[
              { step: '1', title: 'Order processing', desc: 'We\'re preparing your items now. Typically 1–2 business days.' },
              { step: '2', title: 'Shipping notification', desc: 'You\'ll receive an email with tracking info once it ships.' },
              { step: '3', title: 'Delivery', desc: 'Standard shipping 3–5 business days after dispatch.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center flex-shrink-0 font-display font-bold text-xs">
                  {step}
                </div>
                <div>
                  <p className="font-display font-bold text-sm">{title}</p>
                  <p className="font-body text-xs text-[#888]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/shop"
            className="flex-1 text-center font-display font-bold text-sm tracking-widest uppercase py-4 bg-[#1A1A1A] text-white rounded-sm hover:bg-[#333] transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            to="/orders"
            className="flex-1 text-center font-display font-bold text-sm tracking-widest uppercase py-4 border-2 border-[#1A1A1A] text-[#1A1A1A] rounded-sm hover:bg-[#1A1A1A] hover:text-white transition-colors"
          >
            View Orders
          </Link>
        </div>

        {/* Support */}
        <p className="font-body text-xs text-[#AAA] text-center mt-8">
          Questions? Email{' '}
          <a href="mailto:getkryve@gmail.com" className="underline hover:text-[#1A1A1A] transition-colors">
            getkryve@gmail.com
          </a>{' '}
          — we reply within 24 hours.
        </p>
      </div>
    </main>
  )
}
