import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      background: '#0A0A0A',
      borderTop: '1px solid #1a1a1a',
      padding: '60px 40px 30px',
      fontFamily: 'Montserrat, sans-serif',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: 40,
      }} className="kv-footer-grid">
        {/* Brand */}
        <div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: 3, marginBottom: 12 }}>
            KRYVE
          </div>
          <p style={{ color: '#888', fontSize: 13, lineHeight: 1.7, maxWidth: 260 }}>
            Premium science-backed supplements engineered for performance. Drive. Thrive. Kryve.
          </p>
          <div style={{ display: 'flex', gap: 16, marginTop: 20 }}>
            <a href="https://instagram.com/getkryve" target="_blank" rel="noopener noreferrer"
              style={{ color: '#888', textDecoration: 'none', fontSize: 13 }}>
              Instagram
            </a>
            <a href="https://tiktok.com/@getkryve" target="_blank" rel="noopener noreferrer"
              style={{ color: '#888', textDecoration: 'none', fontSize: 13 }}>
              TikTok
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 style={{ color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>
            Shop
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { label: 'KRYVE Greens', to: '/products/kryve-greens-superfood-powder' },
              { label: 'KRYVE Collagen', to: '/products/kryve-hydrolyzed-collagen-peptides' },
              { label: 'KRYVE Magnesium', to: '/products/kryve-magnesium-glycinate' },
              { label: 'The Stack — Save $19.98', to: '/products/the-kryve-stack', green: true },
            ].map(item => (
              <li key={item.to} style={{ marginBottom: 10 }}>
                <Link to={item.to} style={{
                  color: item.green ? '#39FF14' : '#888',
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: item.green ? 700 : 400,
                }}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Info */}
        <div>
          <h4 style={{ color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>
            Info
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { label: 'Our Science', to: '/science' },
              { label: 'FAQ', to: '/faq' },
              { label: 'About KRYVE', to: '/about' },
              { label: 'Contact', to: '/contact' },
            ].map(item => (
              <li key={item.to} style={{ marginBottom: 10 }}>
                <Link to={item.to} style={{ color: '#888', textDecoration: 'none', fontSize: 13 }}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 style={{ color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>
            Legal
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { label: 'Privacy Policy', to: '/privacy' },
              { label: 'Terms of Service', to: '/terms' },
              { label: 'Shipping Policy', to: '/shipping' },
              { label: 'Refund Policy', to: '/refunds' },
            ].map(item => (
              <li key={item.to} style={{ marginBottom: 10 }}>
                <Link to={item.to} style={{ color: '#888', textDecoration: 'none', fontSize: 13 }}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        maxWidth: 1200,
        margin: '40px auto 0',
        paddingTop: 30,
        borderTop: '1px solid #1a1a1a',
      }}>
        <p style={{ color: '#555', fontSize: 11, lineHeight: 1.6, textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          *These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary. Consult your physician before use if pregnant, nursing, under 18, or have a medical condition.
        </p>
        <p style={{ color: '#444', fontSize: 11, textAlign: 'center', marginTop: 16 }}>
          © 2025 High Power Society LLC. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
