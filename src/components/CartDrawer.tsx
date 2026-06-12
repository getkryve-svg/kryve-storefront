import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { calcShipping } from '../lib/discounts'

export default function CartDrawer() {
  const { state, dispatch, subtotal, itemCount } = useCart()
  const drawerRef = useRef<HTMLDivElement>(null)
  const navigate  = useNavigate()

  const shipping = calcShipping(subtotal, 0)
  const total    = subtotal + shipping

  useEffect(() => {
    document.body.style.overflow = state.isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [state.isOpen])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && state.isOpen) dispatch({ type: 'CLOSE_CART' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state.isOpen, dispatch])

  function goToCart() {
    dispatch({ type: 'CLOSE_CART' })
    navigate('/cart')
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-250 ${
          state.isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => dispatch({ type: 'CLOSE_CART' })}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-[#111111] flex flex-col shadow-2xl transition-transform duration-250 ease-out ${
          state.isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E0D8]">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-base tracking-tight">Cart</span>
            {itemCount > 0 && (
              <span className="font-body text-xs bg-[#39FF14] text-[#0A0A0A] rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={() => dispatch({ type: 'CLOSE_CART' })}
            className="p-1.5 hover:opacity-60 transition-opacity rounded-sm hover:bg-[#EDE8E2]"
            aria-label="Close cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
              <svg className="text-[#D8D3CC]" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <p className="font-body text-[#888] text-sm">Your cart is empty.</p>
              <button
                onClick={() => { dispatch({ type: 'CLOSE_CART' }); navigate('/shop') }}
                className="font-display font-bold text-xs tracking-widest uppercase px-6 py-3 bg-[#1A1A1A] text-white rounded-sm hover:bg-[#333] transition-colors"
              >
                Shop Now
              </button>
            </div>
          ) : (
            <ul className="space-y-4" role="list">
              {state.items.map(item => (
                <li key={item.variantId} className="flex gap-3 group">
                  {/* Product image */}
                  <Link
                    to={`/products/${item.handle}`}
                    onClick={() => dispatch({ type: 'CLOSE_CART' })}
                    className="flex-shrink-0 w-18 h-18 w-[72px] h-[72px] rounded-sm overflow-hidden bg-[#1A1A1A]"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1A1A1A]" />
                    )}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/products/${item.handle}`}
                        onClick={() => dispatch({ type: 'CLOSE_CART' })}
                        className="font-display font-semibold text-sm leading-tight hover:opacity-60 transition-opacity truncate"
                      >
                        {item.title}
                      </Link>
                      <button
                        onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.variantId })}
                        className="flex-shrink-0 p-0.5 text-[#AAA] hover:text-[#1A1A1A] transition-colors"
                        aria-label={`Remove ${item.title}`}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>

                    <p className="font-body text-xs text-[#888] mt-0.5">{item.variantTitle}</p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Qty stepper */}
                      <div className="flex items-center border border-[#333] rounded-sm">
                        <button
                          className="px-2 py-1 text-sm hover:bg-[#2A2A2A] transition-colors leading-none"
                          onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { variantId: item.variantId, quantity: item.quantity - 1 } })}
                          aria-label="Decrease quantity"
                        >−</button>
                        <span className="px-2 text-xs font-medium w-6 text-center tabular-nums">{item.quantity}</span>
                        <button
                          className="px-2 py-1 text-sm hover:bg-[#2A2A2A] transition-colors leading-none"
                          onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { variantId: item.variantId, quantity: item.quantity + 1 } })}
                          aria-label="Increase quantity"
                        >+</button>
                      </div>
                      <p className="font-body font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="px-5 py-4 border-t border-[#E5E0D8] space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between font-body text-sm text-[#888]">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-body text-sm text-[#888]">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-[#10B981]">Free</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-display font-bold text-base border-t border-[#2A2A2A] pt-2 mt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              {subtotal < 75 && (
                <p className="font-body text-[11px] text-[#39FF14] text-center">
                  Add ${(75 - subtotal).toFixed(2)} more for free shipping
                </p>
              )}
            </div>

            <button
              onClick={goToCart}
              className="w-full bg-[#39FF14] text-[#0A0A0A] font-display font-bold text-sm tracking-widest uppercase py-4 rounded-sm hover:bg-[#2EE010] active:scale-[0.97] transition-all duration-160"
            >
              View Cart & Checkout
            </button>

            <p className="font-body text-[10px] text-[#AAA] text-center">
              🔒 Secure checkout · Free returns · Ships in 5–7 days
            </p>
          </div>
        )}
      </div>
    </>
  )
}
