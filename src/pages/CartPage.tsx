import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { PRODUCTS } from '../data/products'
import { validateCode, applyDiscount, calcShipping } from '../lib/discounts'
import { trackInitiateCheckout } from '../components/Analytics'
import type { DiscountCode } from '../types'

export default function CartPage() {
  const { state, dispatch, subtotal, itemCount, clearCart } = useCart()
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState<DiscountCode | null>(null)
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')

  const discountAmount = applyDiscount(subtotal, discount)
  const shipping = calcShipping(subtotal, discountAmount)
  const total = subtotal - discountAmount + shipping

  function handleApplyCoupon() {
    const result = validateCode(coupon, subtotal)
    if (!result.valid) {
      setCouponError(result.error || 'Invalid code.')
      setCouponSuccess('')
      setDiscount(null)
    } else {
      setDiscount(result.discount)
      setCouponError('')
      const amt = applyDiscount(subtotal, result.discount)
      setCouponSuccess(
        result.discount!.type === 'percent'
          ? `${result.discount!.value}% off applied!`
          : `$${amt.toFixed(2)} off applied!`
      )
    }
  }

  async function handleCheckout() {
    setCheckoutLoading(true)
    setCheckoutError('')
    trackInitiateCheckout(subtotal, itemCount)

    try {
      const origin = window.location.origin
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: state.items.map(item => ({
            id: item.productId,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            size: item.variantTitle,
            image: item.image || undefined,
          })),
          successUrl: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${origin}/cart`,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Checkout failed')
      window.location.href = data.url
    } catch (err) {
      console.error(err)
      setCheckoutError('Unable to start checkout. Please try again.')
      setCheckoutLoading(false)
    }
  }

  if (state.items.length === 0) {
    return (
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto text-center py-24">
          <div className="w-16 h-16 rounded-full bg-[#EDE8E2] flex items-center justify-center mx-auto mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </div>
          <h1 className="font-display font-black text-3xl tracking-tight mb-3">Your cart is empty</h1>
          <p className="font-body text-sm text-[#888] mb-8">Looks like you haven't added anything yet.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 font-display font-bold text-sm tracking-widest uppercase px-8 py-4 bg-[#1A1A1A] text-white rounded-sm hover:bg-[#333] transition-colors"
          >
            Shop the Collection →
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-24 pb-16 bg-[#FAF8F5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight">Your Cart</h1>
          <span className="font-body text-sm text-[#888]">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          {/* Line items */}
          <div className="space-y-0 border-t border-[#E5E0D8]">
            {state.items.map(item => {
              const product = PRODUCTS.find(p => p.id === item.productId)
              return (
                <div key={item.variantId} className="flex gap-4 py-6 border-b border-[#E5E0D8]">
                  {/* Image */}
                  <Link to={`/products/${item.handle}`} className="flex-shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-[#EDE8E2]">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-display font-black text-[#CCC] text-xs">hpm3®</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link to={`/products/${item.handle}`}>
                          <p className="font-display font-bold text-sm tracking-tight hover:opacity-60 transition-opacity">
                            {item.title}
                          </p>
                        </Link>
                        {product && (
                          <p className="font-body text-xs text-[#8B6F47] mt-0.5">{product.color}</p>
                        )}
                        <p className="font-body text-xs text-[#AAA] mt-1">Size: {item.variantTitle}</p>
                      </div>
                      <p className="font-display font-bold text-sm flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center gap-3 mt-4">
                      <div className="flex items-center border border-[#D8D3CC] rounded-sm">
                        <button
                          onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { variantId: item.variantId, quantity: item.quantity - 1 } })}
                          className="w-9 h-9 flex items-center justify-center text-lg font-light hover:bg-[#F5F1ED] transition-colors"
                          aria-label="Decrease quantity"
                        >−</button>
                        <span className="w-8 text-center font-body text-sm">{item.quantity}</span>
                        <button
                          onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { variantId: item.variantId, quantity: item.quantity + 1 } })}
                          className="w-9 h-9 flex items-center justify-center text-lg font-light hover:bg-[#F5F1ED] transition-colors"
                          aria-label="Increase quantity"
                        >+</button>
                      </div>
                      <button
                        onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.variantId })}
                        className="font-body text-xs text-[#AAA] hover:text-red-500 transition-colors underline underline-offset-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="pt-4">
              <button
                onClick={() => { if (window.confirm('Clear cart?')) clearCart() }}
                className="font-body text-xs text-[#AAA] hover:text-[#1A1A1A] transition-colors underline underline-offset-2"
              >
                Clear cart
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-white rounded-lg border border-[#E5E0D8] p-6 sticky top-24">
              <h2 className="font-display font-bold text-lg tracking-tight mb-5">Order Summary</h2>

              {/* Discount code */}
              <div className="mb-5">
                <label className="font-body text-xs font-semibold tracking-widest uppercase block mb-2">
                  Discount Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={e => { setCoupon(e.target.value.toUpperCase()); setCouponError(''); setCouponSuccess('') }}
                    placeholder="WELCOME10"
                    className="flex-1 font-body text-sm px-3 py-2.5 border border-[#D8D3CC] rounded-sm focus:outline-none focus:border-[#1A1A1A] transition-colors uppercase"
                    onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="font-display font-bold text-xs tracking-wider uppercase px-4 py-2.5 bg-[#1A1A1A] text-white rounded-sm hover:bg-[#333] transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="font-body text-xs text-red-500 mt-1.5">{couponError}</p>}
                {couponSuccess && <p className="font-body text-xs text-[#10B981] mt-1.5">✓ {couponSuccess}</p>}
              </div>

              {/* Totals */}
              <div className="space-y-2.5 border-t border-[#E5E0D8] pt-4">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-[#555]">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between font-body text-sm text-[#10B981]">
                    <span>Discount ({discount?.code})</span>
                    <span>−${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-body text-sm">
                  <span className="text-[#555]">Shipping</span>
                  <span>{shipping === 0 ? <span className="text-[#10B981]">Free</span> : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping > 0 && subtotal < 100 && (
                  <p className="font-body text-[11px] text-[#888]">
                    Add ${(100 - subtotal + discountAmount).toFixed(2)} more for free shipping
                  </p>
                )}
                <div className="flex justify-between font-display font-bold text-base border-t border-[#E5E0D8] pt-3 mt-3">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full mt-6 font-display font-bold text-sm tracking-widest uppercase py-4 bg-[#1A1A1A] text-white rounded-sm hover:bg-[#333] active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {checkoutLoading ? 'Redirecting to Stripe...' : 'Proceed to Checkout →'}
              </button>
              {checkoutError && (
                <p className="font-body text-xs text-red-500 mt-2 text-center">{checkoutError}</p>
              )}

              <Link
                to="/shop"
                className="block text-center font-body text-xs text-[#AAA] hover:text-[#1A1A1A] transition-colors mt-4 underline underline-offset-2"
              >
                Continue Shopping
              </Link>

              {/* Trust signals */}
              <div className="mt-6 pt-5 border-t border-[#E5E0D8] flex flex-col gap-2">
                {[
                  { icon: '🔒', text: 'Secure checkout powered by Stripe' },
                  { icon: '↩️', text: '30-day returns, no questions asked' },
                  { icon: '🚚', text: 'Free shipping on orders over $100' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2">
                    <span className="text-sm">{icon}</span>
                    <span className="font-body text-[11px] text-[#888]">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
