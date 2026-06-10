/**
 * PaymentPage — Stripe Elements integration
 *
 * Requirements:
 *   npm install @stripe/stripe-js @stripe/react-stripe-js
 *   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_... in .env.local
 *
 * Backend needed: a /api/create-payment-intent endpoint that:
 *   1. Receives { amount, currency, metadata }
 *   2. Calls Stripe's PaymentIntent API with your secret key
 *   3. Returns { clientSecret }
 *
 * Until the backend exists, the form renders in "demo mode" and
 * simulates a successful payment after 2 seconds.
 */
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { trackPurchase } from '../components/Analytics'
import type { ShippingAddress, DiscountCode, Order } from '../types'

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined
const DEMO_MODE  = !STRIPE_KEY

function generateOrderId() {
  return 'HPM3-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase()
}

function saveOrder(order: Order) {
  try {
    const prev = JSON.parse(localStorage.getItem('hpm3_orders') || '[]') as Order[]
    localStorage.setItem('hpm3_orders', JSON.stringify([order, ...prev]))
  } catch { /* ignore */ }
}

export default function PaymentPage() {
  const { state: cartState, clearCart } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const { shippingAddress, discount, discountAmount = 0, shipping = 8, total } = (location.state || {}) as {
    shippingAddress?: ShippingAddress
    discount?: DiscountCode | null
    discountAmount?: number
    shipping?: number
    total?: number
  }

  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc]       = useState('')
  const [nameOnCard, setNameOnCard] = useState(
    shippingAddress ? `${shippingAddress.firstName} ${shippingAddress.lastName}` : ''
  )
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const subtotal = cartState.items.reduce((s, i) => s + i.price * i.quantity, 0)
  const orderTotal = total ?? subtotal + shipping - discountAmount

  if (!shippingAddress || cartState.items.length === 0) {
    return (
      <main className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="font-body text-[#888] mb-4">Please complete checkout from the beginning.</p>
          <Link to="/cart" className="font-display font-bold text-sm underline">Back to cart</Link>
        </div>
      </main>
    )
  }

  // Format card number with spaces
  function fmtCard(v: string) {
    return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  }
  // Format expiry MM/YY
  function fmtExpiry(v: string) {
    const digits = v.replace(/\D/g, '').slice(0, 4)
    return digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits
  }

  async function handlePay() {
    setError('')
    const digits = cardNumber.replace(/\s/g, '')
    if (digits.length < 16) { setError('Please enter a valid card number.'); return }
    if (expiry.length < 5)   { setError('Please enter a valid expiry date.'); return }
    if (cvc.length < 3)      { setError('Please enter your CVC.'); return }

    setProcessing(true)

    if (DEMO_MODE) {
      // ── DEMO MODE: simulate payment ──────────────────────────────────────────
      await new Promise(r => setTimeout(r, 2000))

      const order: Order = {
        id: generateOrderId(),
        items: cartState.items,
        subtotal,
        shipping,
        discount: discountAmount,
        total: orderTotal,
        shippingAddress: shippingAddress!,
        discountCode: discount?.code,
        status: 'processing',
        createdAt: new Date().toISOString(),
      }
      saveOrder(order)
      trackPurchase(order)
      clearCart()
      navigate('/order-confirmation', { state: { order } })
      return
    }

    // ── LIVE MODE ────────────────────────────────────────────────────────────
    // Stripe is loaded via <script src="https://js.stripe.com/v3/"> in index.html
    // so window.Stripe is available globally — no npm package needed.
    // To go live:
    //   1. Add VITE_STRIPE_PUBLISHABLE_KEY=pk_live_... to .env.local
    //   2. Deploy /api/create-checkout-session (Vercel Edge / Netlify Function)
    //   3. Add <script src="https://js.stripe.com/v3/"></script> to index.html
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const StripeConstructor = (window as any).Stripe
      if (!StripeConstructor) throw new Error('Stripe.js not loaded — add the script tag to index.html')
      const stripe = StripeConstructor(STRIPE_KEY!)

      // Create a Checkout Session on your backend
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartState.items,
          email: shippingAddress!.email,
          shippingAddress: shippingAddress!,
          discountCode: discount?.code,
          successUrl: `${window.location.origin}/order-confirmation`,
          cancelUrl: `${window.location.origin}/payment`,
        }),
      })
      const { sessionId, error: apiError } = await res.json()
      if (apiError) throw new Error(apiError)

      // Redirect to Stripe-hosted checkout (browser navigates away)
      const result = await stripe.redirectToCheckout({ sessionId })
      if (result?.error) throw new Error(result.error.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.')
      setProcessing(false)
    }
  }

  return (
    <main className="min-h-screen pt-20 pb-16 bg-[#FAF8F5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Progress */}
        <div className="flex items-center gap-2 font-body text-xs text-[#AAA] mb-10 pt-4">
          <Link to="/cart" className="hover:text-[#1A1A1A] transition-colors">Cart</Link>
          <span>›</span>
          <Link to="/checkout" className="hover:text-[#1A1A1A] transition-colors">Shipping</Link>
          <span>›</span>
          <span className="text-[#1A1A1A] font-semibold">Payment</span>
          <span>›</span>
          <span>Confirmation</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display font-black text-2xl tracking-tight">Payment</h1>
              <div className="flex items-center gap-1.5 font-body text-xs text-[#888]">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="1" y="3" width="10" height="7" rx="1"/><path d="M1 6h10"/>
                </svg>
                Secured by Stripe
              </div>
            </div>

            {DEMO_MODE && (
              <div className="mb-5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-sm">
                <p className="font-body text-xs text-amber-700">
                  <strong>Demo mode</strong> — Add <code>VITE_STRIPE_PUBLISHABLE_KEY</code> to <code>.env.local</code> and set up the
                  <code>/api/create-payment-intent</code> backend endpoint to go live. Payments simulate successfully.
                </p>
              </div>
            )}

            {/* Shipping summary */}
            <div className="mb-6 p-4 bg-white border border-[#E5E0D8] rounded-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-body text-xs font-semibold tracking-widest uppercase text-[#888] mb-1">Ship to</p>
                  <p className="font-body text-sm text-[#1A1A1A]">
                    {shippingAddress.firstName} {shippingAddress.lastName}
                  </p>
                  <p className="font-body text-xs text-[#888]">
                    {shippingAddress.address1}{shippingAddress.address2 ? `, ${shippingAddress.address2}` : ''},{' '}
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
                  </p>
                </div>
                <Link to="/checkout" className="font-body text-xs text-[#8B6F47] hover:underline">Edit</Link>
              </div>
            </div>

            {/* Card form */}
            <div className="space-y-4">
              <div>
                <label className="font-body text-xs font-semibold tracking-widest uppercase text-[#555] block mb-1.5">
                  Name on Card
                </label>
                <input
                  value={nameOnCard}
                  onChange={e => setNameOnCard(e.target.value)}
                  className="w-full font-body text-sm px-3 py-3 border border-[#D8D3CC] rounded-sm focus:outline-none focus:border-[#1A1A1A] transition-colors"
                  placeholder="Jeremy Smith"
                />
              </div>

              <div>
                <label className="font-body text-xs font-semibold tracking-widest uppercase text-[#555] block mb-1.5">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    value={cardNumber}
                    onChange={e => setCardNumber(fmtCard(e.target.value))}
                    className="w-full font-body text-sm px-3 py-3 border border-[#D8D3CC] rounded-sm focus:outline-none focus:border-[#1A1A1A] transition-colors pr-12 tracking-wider"
                    placeholder={DEMO_MODE ? '4242 4242 4242 4242' : '•••• •••• •••• ••••'}
                    inputMode="numeric"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 opacity-40">
                    {/* Card brand icons (simplified) */}
                    <div className="w-7 h-4 bg-blue-700 rounded-sm" />
                    <div className="w-7 h-4 bg-red-500 rounded-sm" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs font-semibold tracking-widest uppercase text-[#555] block mb-1.5">
                    Expiry Date
                  </label>
                  <input
                    value={expiry}
                    onChange={e => setExpiry(fmtExpiry(e.target.value))}
                    className="w-full font-body text-sm px-3 py-3 border border-[#D8D3CC] rounded-sm focus:outline-none focus:border-[#1A1A1A] transition-colors"
                    placeholder="MM/YY"
                    inputMode="numeric"
                  />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold tracking-widest uppercase text-[#555] block mb-1.5">
                    CVC
                  </label>
                  <input
                    value={cvc}
                    onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="w-full font-body text-sm px-3 py-3 border border-[#D8D3CC] rounded-sm focus:outline-none focus:border-[#1A1A1A] transition-colors"
                    placeholder="•••"
                    inputMode="numeric"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-sm">
                <p className="font-body text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#E5E0D8]">
              <Link to="/checkout" className="font-body text-sm text-[#AAA] hover:text-[#1A1A1A] transition-colors">
                ← Back
              </Link>
              <button
                onClick={handlePay}
                disabled={processing}
                className="font-display font-bold text-sm tracking-widest uppercase px-10 py-4 bg-[#1A1A1A] text-white rounded-sm hover:bg-[#333] active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed min-w-[200px] flex items-center justify-center gap-3"
              >
                {processing ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                      <path d="M12 2a10 10 0 0110 10" />
                    </svg>
                    Processing…
                  </>
                ) : (
                  `Pay $${orderTotal.toFixed(2)}`
                )}
              </button>
            </div>

            <p className="font-body text-[11px] text-[#AAA] text-center mt-4">
              🔒 Your payment info is encrypted and never stored on our servers.
            </p>
          </div>

          {/* Summary sidebar */}
          <div className="bg-white rounded-lg border border-[#E5E0D8] p-5 h-fit sticky top-24">
            <h2 className="font-display font-bold text-base tracking-tight mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {cartState.items.map(item => (
                <div key={item.variantId} className="flex gap-3 items-start">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-[#EDE8E2] flex-shrink-0">
                      {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                    </div>
                    <span className="absolute -top-1.5 -right-1.5 bg-[#1A1A1A] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-xs truncate">{item.title}</p>
                    <p className="font-body text-[11px] text-[#AAA]">{item.variantTitle}</p>
                  </div>
                  <p className="font-display font-bold text-xs">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-[#E5E0D8] pt-4 space-y-2 font-body text-sm">
              <div className="flex justify-between text-[#555]"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#10B981]"><span>{discount?.code}</span><span>−${discountAmount.toFixed(2)}</span></div>
              )}
              <div className="flex justify-between text-[#555]">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-[#10B981]">Free</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-display font-bold text-base border-t border-[#E5E0D8] pt-2">
                <span>Total</span><span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
