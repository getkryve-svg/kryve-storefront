import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { itemCount, dispatch } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => { setMenuOpen(false) }, [location])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav className={`kv-nav${scrolled ? ' kv-nav--scrolled' : ''}`}>
        <div className="kv-nav-inner">
          {/* Hamburger — mobile only */}
          <button
            className="kv-hamburger"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <span /><span /><span />
          </button>

          {/* Logo */}
          <Link to="/" className="kv-nav-logo-link">
            <span className="kv-nav-wordmark">KRYVE</span>
          </Link>

          {/* Desktop links */}
          <div className="kv-nav-links">
            <Link to="/shop">Shop</Link>
            <Link to="/products/the-kryve-stack">The Stack</Link>
            <Link to="/science">Our Science</Link>
          </div>

          {/* Right actions */}
          <div className="kv-nav-actions">
            <button
              className="kv-cart-btn"
              aria-label={`Open cart${itemCount > 0 ? `, ${itemCount} items` : ''}`}
              onClick={() => dispatch({ type: 'OPEN_CART' })}
            >
              <svg width="20" height="19" viewBox="0 0 22 21" fill="none">
                <path d="M1 1h3.5l2.2 10.2A2 2 0 008.65 13H17a2 2 0 001.95-1.57L21 5H5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="18" r="1.5" fill="currentColor"/>
                <circle cx="16.5" cy="18" r="1.5" fill="currentColor"/>
              </svg>
              {itemCount > 0 && (
                <span className="kv-cart-count">{itemCount}</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile nav overlay */}
      <div
        className={`kv-mobile-nav-overlay${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile nav drawer */}
      <div className={`kv-mobile-nav${menuOpen ? ' open' : ''}`}>
        <div className="kv-mobile-nav-head">
          <span className="kv-mobile-nav-logo">KRYVE</span>
          <button
            className="kv-mobile-nav-close"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="kv-mobile-nav-links">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop All</Link>
          <Link to="/products/the-kryve-stack" className="nav-green">The Stack</Link>
          <Link to="/science">Our Science</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/about">About KRYVE</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </>
  )
}
