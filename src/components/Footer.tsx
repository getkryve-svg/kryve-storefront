import { useState } from 'react'
import { Link } from 'react-router-dom'
import { saveSubscriber } from '../lib/discounts'

export default function Footer() {
  const [email, setEmail]         = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [code, setCode]           = useState('')
  const [error, setError]         = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email.'); return }
    setCode(saveSubscriber(email))
    setSubmitted(true)
    setError('')
  }

  return (
    <footer className="border-t border-[#E5E0D8] bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand — spans 2 cols on lg */}
          <div className="lg:col-span-2">
            <Link to="/" className="font-display font-black text-2xl tracking-tight text-[#1A1A1A] hover:opacity-70 transition-opacity" style={{ WebkitFontSmoothing: 'antialiased' }}>
              hpm3<span style={{ fontSize: '0.55em', verticalAlign: 'middle', lineHeight: 1, position: 'relative', top: '-0.05em', letterSpacing: 0 }}>®</span>
            </Link>
            <p className="font-body text-sm text-[#888] mt-3 leading-relaxed max-w-xs">
              Happy People Make More Money. Premium vintage-inspired streetwear — designed to be worn, not displayed.
            </p>

            {/* Social */}
            <div className="flex gap-3 mt-5">
              {[
                {
                  href: 'https://instagram.com/hpm3official',
                  label: 'Instagram',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="2" width="20" height="20" rx="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                    </svg>
                  ),
                },
                {
                  href: 'https://tiktok.com/@hpm3',
                  label: 'TikTok',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
                    </svg>
                  ),
                },
                {
                  href: 'https://x.com/hpm3',
                  label: 'Twitter/X',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  ),
                },
              ].map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-[#E5E0D8] flex items-center justify-center text-[#888] hover:text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors"
                  aria-label={label}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="font-body text-xs font-semibold tracking-widest uppercase text-[#888] mb-4">Shop</p>
            <ul className="space-y-2.5">
              {[
                { to: '/shop',           label: 'All Products' },
                { to: '/shop?drop=Sand', label: 'Drop — Sand' },
                { to: '/shop?drop=Clay', label: 'Drop — Clay' },
                { to: '/shop?drop=Fog',  label: 'Drop — Fog' },
                { to: '/drops',          label: 'Coming Soon' },
                { to: '/size-guide',     label: 'Size Guide' },
              ].map(({ to, label }) => (
                <li key={to + label}>
                  <Link to={to} className="font-body text-sm text-[#555] hover:text-[#1A1A1A] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="font-body text-xs font-semibold tracking-widest uppercase text-[#888] mb-4">Support</p>
            <ul className="space-y-2.5">
              {[
                { to: '/orders',  label: 'Track Order' },
                { to: '/faq',     label: 'FAQ' },
                { to: '/returns', label: 'Returns & Refunds' },
                { to: '/contact', label: 'Contact Us' },
                { to: '/about',   label: 'About hpm3®' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="font-body text-sm text-[#555] hover:text-[#1A1A1A] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="font-body text-xs font-semibold tracking-widest uppercase text-[#888] mb-4">Get 10% Off</p>
            <p className="font-body text-sm text-[#555] mb-4 leading-relaxed">
              Join the movement. Early access + 10% off your first order.
            </p>

            {submitted ? (
              <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-sm p-3">
                <p className="font-body text-sm text-[#10B981] font-medium">You're in! 🎉</p>
                <p className="font-body text-xs text-[#555] mt-1">
                  Use code <strong className="tracking-wider">{code}</strong> at checkout.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2" noValidate>
                <div>
                  <label htmlFor="footer-email" className="sr-only">Email address</label>
                  <input
                    id="footer-email"
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError('') }}
                    placeholder="your@email.com"
                    className="w-full font-body text-sm px-3 py-3 border border-[#D8D3CC] rounded-sm bg-white focus:outline-none focus:border-[#1A1A1A] transition-colors"
                  />
                  {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full font-display font-semibold text-xs tracking-widest uppercase px-4 py-3 bg-[#1A1A1A] text-[#FAF8F5] rounded-sm hover:bg-[#333] active:scale-[0.97] transition-all"
                >
                  Get 10% Off
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#E5E0D8] px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#AAA] font-body">
          <p>
            <span className="font-display font-bold text-[#1A1A1A]" style={{ WebkitFontSmoothing: 'antialiased' }}>hpm3<span style={{ fontSize: '0.55em', verticalAlign: 'middle', lineHeight: 1, position: 'relative', top: '-0.05em', letterSpacing: 0 }}>®</span></span>
            {' '}— Happy People Make More Money · © {new Date().getFullYear()}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link to="/privacy"  className="hover:text-[#1A1A1A] transition-colors">Privacy Policy</Link>
            <Link to="/terms"    className="hover:text-[#1A1A1A] transition-colors">Terms of Service</Link>
            <Link to="/returns"  className="hover:text-[#1A1A1A] transition-colors">Returns</Link>
            <Link to="/faq"      className="hover:text-[#1A1A1A] transition-colors">FAQ</Link>
            <Link to="/contact"  className="hover:text-[#1A1A1A] transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
