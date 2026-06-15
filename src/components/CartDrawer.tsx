import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { STATIC_PRODUCTS } from '../lib/shopify'

/** Single source of truth for free-shipping threshold.
 *  MUST match Shopify Admin › Settings › Shipping and delivery free-shipping rate.  */
const FREE_SHIPPING_THRESHOLD = 75   // dollars

/** Resolve the CURRENT primary product image by handle so cart line items always
 *  match the cards/site — even for items added before the image was updated, or
 *  added from the PDP (whose live Shopify image may differ). Falls back to the
 *  image stored on the cart item. */
function currentImage(handle: string, fallback: string): string {
  return STATIC_PRODUCTS.find(p => p.handle === handle)?.images.edges[0]?.node.url || fallback
}

export default function CartDrawer() {
  const { state, dispatch, subtotal, itemCount } = useCart()
  const drawerRef = useRef<HTMLDivElement>(null)
  const navigate  = useNavigate()

  // Free-shipping progress — integer cents math eliminates floating-point artifacts
  const THRESHOLD_CENTS  = FREE_SHIPPING_THRESHOLD * 100      // 7500
  const subtotalCents    = Math.round(subtotal * 100)
  const remainingCents   = Math.max(THRESHOLD_CENTS - subtotalCents, 0)
  const shippingPct      = Math.min((subtotalCents / THRESHOLD_CENTS) * 100, 100)
  const shippingUnlocked = subtotalCents >= THRESHOLD_CENTS
  const remaining        = remainingCents / 100                // display dollars

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

  function handleCheckout() {
    dispatch({ type: 'CLOSE_CART' })
    navigate('/cart')
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          state.isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(0,0,0,0.72)' }}
        onClick={() => dispatch({ type: 'CLOSE_CART' })}
        aria-hidden="true"
      />

      {/* ── Drawer panel ──
          Mobile  (<sm): bottom-sheet slides up from bottom, full-width, max-h-[92vh], rounded-t-xl
          Desktop (sm+): right-side panel slides in from right, max-w-[400px], full-height         */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`
          fixed z-50 flex flex-col shadow-2xl
          transition-transform duration-300 ease-out
          bottom-0 left-0 right-0 max-h-[92vh] rounded-t-xl
          sm:top-0 sm:bottom-0 sm:left-auto sm:right-0 sm:w-full sm:max-w-[400px] sm:max-h-full sm:rounded-none
          ${state.isOpen
            ? 'translate-y-0 sm:translate-x-0'
            : 'translate-y-full sm:translate-y-0 sm:translate-x-full'
          }
        `}
        style={{ background: '#0D0D0D' }}
      >
        {/* ── Drag handle (mobile only) ── */}
        <div
          className="sm:hidden flex justify-center pt-3 pb-1 flex-shrink-0"
          aria-hidden="true"
        >
          <div className="w-9 h-1 rounded-full" style={{ background: '#333' }} />
        </div>

        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid #1E1E1E' }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="font-display font-black text-sm tracking-[0.18em] uppercase"
              style={{ color: '#FFFFFF' }}
            >
              Your Cart
            </span>
            {itemCount > 0 && (
              <span
                className="font-body text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0"
                style={{ background: '#39FF14', color: '#0A0A0A' }}
              >
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={() => dispatch({ type: 'CLOSE_CART' })}
            className="flex items-center justify-center w-9 h-9 rounded-sm transition-colors"
            style={{ color: '#555' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#FFF')}
            onMouseLeave={e => (e.currentTarget.style.color = '#555')}
            aria-label="Close cart"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* ── Free-shipping progress bar (only when items present) ── */}
        {state.items.length > 0 && (
          <div className="px-5 pt-3 pb-3 flex-shrink-0" style={{ borderBottom: '1px solid #1A1A1A' }}>
            {shippingUnlocked ? (
              <p
                className="font-body text-xs font-semibold text-center mb-2"
                style={{ color: '#39FF14' }}
              >
                ✓ Free shipping unlocked!
              </p>
            ) : (
              <p className="font-body text-[11px] mb-2" style={{ color: '#888' }}>
                You're{' '}
                <span className="font-semibold" style={{ color: '#CCC' }}>
                  ${remaining.toFixed(2)}
                </span>{' '}
                away from free shipping
              </p>
            )}
            {/* Progress track */}
            <div
              className="relative h-1.5 rounded-full overflow-hidden"
              style={{ background: '#1E1E1E' }}
              role="progressbar"
              aria-valuenow={Math.round(shippingPct)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                style={{
                  width: `${shippingPct}%`,
                  background: shippingUnlocked
                    ? '#39FF14'
                    : 'linear-gradient(90deg, #1EAA00 0%, #39FF14 100%)',
                  boxShadow: shippingUnlocked ? '0 0 6px #39FF1466' : 'none',
                }}
              />
            </div>
          </div>
        )}

        {/* ── Scrollable item list ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {state.items.length === 0 ? (

            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full gap-6 px-8 text-center py-12">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: '#1A1A1A' }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.4">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </div>
              <div>
                <p
                  className="font-display font-bold text-base mb-1"
                  style={{ color: '#FFF' }}
                >
                  Your cart is empty
                </p>
                <p className="font-body text-sm" style={{ color: '#555' }}>
                  Add a formula to get started.
                </p>
              </div>
              <button
                onClick={() => { dispatch({ type: 'CLOSE_CART' }); navigate('/shop') }}
                className="font-display font-bold text-xs tracking-widest uppercase px-8 py-3.5 rounded-sm transition-all duration-150 active:scale-[0.97]"
                style={{ background: '#39FF14', color: '#0A0A0A', minHeight: 44 }}
                onMouseEnter={e => (e.currentTarget.style.background = '#2EE010')}
                onMouseLeave={e => (e.currentTarget.style.background = '#39FF14')}
              >
                Shop KRYVE
              </button>
            </div>

          ) : (
            <ul className="divide-y" style={{ borderColor: '#1A1A1A' }} role="list">
              {state.items.map(item => (
                <li key={item.variantId} className="flex gap-3.5 px-5 py-4">

                  {/* Thumbnail */}
                  <Link
                    to={`/products/${item.handle}`}
                    onClick={() => dispatch({ type: 'CLOSE_CART' })}
                    className="flex-shrink-0 rounded-sm overflow-hidden"
                    style={{ width: 72, height: 72, background: '#1A1A1A', display: 'block' }}
                    aria-label={item.title}
                  >
                    {currentImage(item.handle, item.image) ? (
                      <img
                        src={currentImage(item.handle, item.image)}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display font-black text-[10px]" style={{ color: '#333' }}>KRYVE</span>
                      </div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          to={`/products/${item.handle}`}
                          onClick={() => dispatch({ type: 'CLOSE_CART' })}
                          className="font-display font-bold text-sm leading-snug block truncate transition-opacity hover:opacity-60"
                          style={{ color: '#FFF' }}
                        >
                          {item.title}
                        </Link>
                        {item.variantTitle && item.variantTitle !== 'Default Title' && (
                          <p className="font-body text-xs mt-0.5" style={{ color: '#555' }}>
                            {item.variantTitle}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.variantId })}
                        className="flex-shrink-0 p-1 transition-colors"
                        style={{ color: '#444', minWidth: 28, minHeight: 28 }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#FF4444')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#444')}
                        aria-label={`Remove ${item.title}`}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Qty stepper */}
                      <div
                        className="flex items-center rounded-sm overflow-hidden"
                        style={{ border: '1px solid #2A2A2A', height: 32 }}
                      >
                        <button
                          className="flex items-center justify-center transition-colors font-body text-base leading-none"
                          style={{ width: 32, height: 32, color: '#888' }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#1A1A1A')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          onClick={() => dispatch({
                            type: 'UPDATE_QUANTITY',
                            payload: { variantId: item.variantId, quantity: item.quantity - 1 },
                          })}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span
                          className="font-body text-xs font-semibold text-center tabular-nums"
                          style={{ width: 28, color: '#FFF' }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          className="flex items-center justify-center transition-colors font-body text-base leading-none"
                          style={{ width: 32, height: 32, color: '#888' }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#1A1A1A')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          onClick={() => dispatch({
                            type: 'UPDATE_QUANTITY',
                            payload: { variantId: item.variantId, quantity: item.quantity + 1 },
                          })}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Line price — show slashed compare-at when available */}
                      <div className="flex items-baseline gap-1.5">
                        {item.compareAt && item.compareAt > item.price && (
                          <span
                            className="font-body text-xs line-through"
                            style={{ color: '#555' }}
                          >
                            ${(item.compareAt * item.quantity).toFixed(2)}
                          </span>
                        )}
                        <span className="font-display font-bold text-sm" style={{ color: '#FFF' }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Footer (only when items present) ── */}
        {state.items.length > 0 && (
          <div
            className="flex-shrink-0 px-5 pt-4 pb-5 space-y-4"
            style={{ borderTop: '1px solid #1E1E1E' }}
          >
            {/* Subtotal row */}
            <div className="flex justify-between items-baseline">
              <span className="font-body text-sm" style={{ color: '#666' }}>Subtotal</span>
              <span className="font-display font-bold text-base" style={{ color: '#FFF' }}>
                ${subtotal.toFixed(2)}
              </span>
            </div>

            {/* Primary CTA — CHECKOUT */}
            <button
              onClick={handleCheckout}
              className="w-full font-display font-black text-sm tracking-[0.12em] uppercase rounded-sm transition-all duration-150 active:scale-[0.97] flex items-center justify-center gap-2"
              style={{
                background: '#39FF14',
                color: '#0A0A0A',
                height: 52,
                minHeight: 52,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#2EE010')}
              onMouseLeave={e => (e.currentTarget.style.background = '#39FF14')}
            >
              Checkout
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>

            {/* Secondary: continue shopping */}
            <button
              onClick={() => dispatch({ type: 'CLOSE_CART' })}
              className="w-full font-body text-xs text-center transition-colors"
              style={{ color: '#444' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#888')}
              onMouseLeave={e => (e.currentTarget.style.color = '#444')}
            >
              Continue Shopping
            </button>

            {/* Trust row */}
            <div
              className="flex items-center justify-around pt-3"
              style={{ borderTop: '1px solid #161616' }}
            >
              {[
                { icon: '🔒', label: 'Secure Checkout' },
                { icon: '✓',  label: 'GMP Certified' },
                { icon: '🇺🇸', label: 'Made in USA' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <span className="text-sm leading-none">{icon}</span>
                  <span
                    className="font-body text-[9px] tracking-wide uppercase text-center"
                    style={{ color: '#3A3A3A' }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
