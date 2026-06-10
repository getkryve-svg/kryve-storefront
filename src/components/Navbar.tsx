import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { getWishlist } from '../lib/wishlist'

const SHOP_DROPS = [
  { to: '/shop',            label: 'All Products' },
  { to: '/shop?drop=Sand',  label: 'Drop — Sand' },
  { to: '/shop?drop=Clay',  label: 'Drop — Clay' },
  { to: '/shop?drop=Fog',   label: 'Drop — Fog' },
  { to: '/drops',           label: 'Coming Soon ↗' },
]

export default function Navbar() {
  const { itemCount } = useCart()
  const { user, isAdmin } = useAuth()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [shopOpen, setShopOpen]   = useState(false)
  const [wishCount, setWishCount] = useState(0)
  const shopRef = useRef<HTMLDivElement>(null)
  const location  = useLocation()
  const navigate  = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change + refresh wishlist count
  useEffect(() => {
    setMenuOpen(false)
    setShopOpen(false)
    setWishCount(getWishlist().length)
  }, [location.pathname, location.search])

  // Close shop dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) {
        setShopOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isHome  = location.pathname === '/'
  const isLight = !scrolled && isHome  // white text on dark hero

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled || !isHome
            ? 'bg-[#FAF8F5]/95 backdrop-blur-sm shadow-[0_1px_0_0_rgba(0,0,0,0.08)]'
            : 'bg-transparent'
        }`}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link
              to="/"
              className={`font-display font-black text-[22px] tracking-tight hover:opacity-70 transition-opacity select-none ${isLight ? 'text-white' : 'text-[#1A1A1A]'}`}
              style={{ WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}
              aria-label="hpm3® — Home"
            >
              hpm3<span style={{ fontSize: '0.5em', verticalAlign: 'super', lineHeight: 1, position: 'relative', top: '-0.1em', letterSpacing: 0 }}>®</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden sm:flex items-center gap-7">

              {/* Shop dropdown */}
              <div ref={shopRef} className="relative">
                <button
                  onClick={() => setShopOpen(o => !o)}
                  className={`flex items-center gap-1 font-body text-sm font-medium tracking-widest uppercase transition-opacity hover:opacity-60 ${isLight ? 'text-white' : 'text-[#1A1A1A]'} ${location.pathname === '/shop' ? 'opacity-100' : 'opacity-75'}`}
                >
                  Shop
                  <svg
                    width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"
                    className={`transition-transform duration-200 ${shopOpen ? 'rotate-180' : ''}`}
                  >
                    <polyline points="2,3 5,7 8,3"/>
                  </svg>
                </button>

                {/* Dropdown */}
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-44 bg-white border border-[#E5E0D8] rounded-sm shadow-xl transition-all duration-150 ${
                    shopOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                  }`}
                >
                  {SHOP_DROPS.map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setShopOpen(false)}
                      className="block px-4 py-3 font-body text-sm text-[#555] hover:text-[#1A1A1A] hover:bg-[#FAF8F5] transition-colors border-b border-[#F0EBE3] last:border-0"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              {[
                { to: '/about',   label: 'About' },
                { to: '/faq',     label: 'FAQ' },
                { to: '/contact', label: 'Contact' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`font-body text-sm font-medium tracking-widest uppercase transition-opacity hover:opacity-60 ${isLight ? 'text-white' : 'text-[#1A1A1A]'} ${location.pathname === to ? 'opacity-100' : 'opacity-75'}`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-3">

              {/* Wishlist */}
              <button
                onClick={() => navigate('/wishlist')}
                className={`relative hidden sm:flex items-center hover:opacity-60 transition-opacity ${isLight ? 'text-white' : 'text-[#1A1A1A]'}`}
                aria-label="Wishlist"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
                {wishCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#8B6F47] text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishCount > 9 ? '9+' : wishCount}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={() => navigate('/cart')}
                className={`relative flex items-center hover:opacity-60 transition-opacity ${isLight ? 'text-white' : 'text-[#1A1A1A]'}`}
                aria-label={`Cart — ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#1A1A1A] text-[#FAF8F5] text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>

              {/* Account / Auth */}
              <button
                onClick={() => navigate(user ? '/account' : '/auth')}
                className={`hidden sm:flex items-center hover:opacity-60 transition-opacity ${isLight ? 'text-white' : 'text-[#1A1A1A]'}`}
                aria-label={user ? 'My Account' : 'Sign In'}
              >
                {user ? (
                  <div className="w-7 h-7 rounded-full bg-[#8B6F47] flex items-center justify-center text-white text-xs font-display font-bold">
                    {user.name[0].toUpperCase()}
                  </div>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                )}
              </button>

              {/* Admin badge */}
              {isAdmin && (
                <Link to="/admin" className="hidden sm:flex items-center">
                  <span className="font-body text-[10px] px-2 py-0.5 bg-[#1A1A1A] text-white rounded-full">Admin</span>
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(o => !o)}
                className={`sm:hidden flex flex-col gap-1.5 p-1 hover:opacity-60 transition-opacity ${isLight ? 'text-white' : 'text-[#1A1A1A]'}`}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                <span className={`w-5 h-0.5 bg-current transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`w-5 h-0.5 bg-current transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`w-5 h-0.5 bg-current transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <div
        className={`fixed inset-x-0 top-16 z-40 bg-[#FAF8F5] border-b border-[#E5E0D8] transition-all duration-200 sm:hidden ${
          menuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="px-4 py-4 space-y-1">
          {[
            { to: '/shop',      label: 'Shop All' },
            { to: '/shop?drop=Sand', label: '  ↳ Drop — Sand' },
            { to: '/shop?drop=Clay', label: '  ↳ Drop — Clay' },
            { to: '/shop?drop=Fog',  label: '  ↳ Drop — Fog' },
            { to: '/drops',     label: 'Coming Soon' },
            { to: '/about',     label: 'About' },
            { to: '/faq',       label: 'FAQ' },
            { to: '/contact',   label: 'Contact' },
            { to: '/cart',      label: `Cart (${itemCount})` },
            { to: '/wishlist',  label: `Wishlist (${wishCount})` },
            { to: user ? '/account' : '/auth', label: user ? `Account — ${user.name}` : 'Sign In / Register' },
            ...(isAdmin ? [{ to: '/admin', label: '⚙ Admin Dashboard' }] : []),
          ].map(({ to, label }) => (
            <Link
              key={to + label}
              to={to}
              className="block font-body text-sm font-medium py-2.5 border-b border-[#F0EBE3] last:border-b-0 hover:text-[#8B6F47] transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
