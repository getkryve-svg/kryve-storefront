import { useState, useEffect, useRef, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { STATIC_PRODUCTS, formatPrice, getBadgeText, getProductBadgeClass, type ShopifyProduct } from '../lib/shopify'
import type { CartItem } from '../types'

// ── Hero slides — exact match to live kryve-2.myshopify.com ─────────────────
const CF = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663745291897/2HBFBRwReVdUcKECHB8taa/'

const HERO_SLIDES = [
  {
    bg: 'https://cdn.shopify.com/s/files/1/0824/2108/8515/t/1/assets/hero-couple-v6.png',
    bgPos: 'center top',
    badge: { bg: '#7A5C00', color: '#D4AF37', text: 'SAVE $19.98' },
    eyebrow: { color: '#D4AF37', text: 'The Complete Stack' },
    h1: ['ONE RITUAL.', 'TOTAL RESULTS.'],
    sub: 'All 3 KRYVE formulas together - your complete daily foundation.*',
    btn: { text: 'GET THE STACK $129.99', to: '/products/the-kryve-stack', cls: 'kv-hbtn-gd' },
  },
  {
    bg: CF + 'hero-greens-v4-FpC5SLDGRGgRaFpT6mgAVm.webp',
    bgPos: 'center top',
    badge: { bg: '#064E3B', color: '#39FF14', text: 'BEST SELLER' },
    eyebrow: { color: '#39FF14', text: 'Greens Superfood Powder' },
    h1: ['Fuel Your', 'Foundation.'],
    sub: '75+ superfoods. Clean energy, immune support, and gut health in every scoop.*',
    btn: { text: 'SHOP GREENS $49.99', to: '/products/kryve-greens-superfood-powder', cls: 'kv-hbtn-g' },
  },
  {
    bg: CF + 'hero-collagen-v10-A4n7BnVLv8sW9Dc2eJEZkZ.webp',
    bgPos: 'center center',
    badge: { bg: '#6B2737', color: '#F4C2C8', text: 'GRASS-FED' },
    eyebrow: { color: '#B76E79', text: 'Collagen Peptides' },
    h1: ['Glow From', 'Within.'],
    sub: 'Grass-fed hydrolyzed collagen for radiant skin, strong hair, and joint support.*',
    btn: { text: 'SHOP COLLAGEN $54.99', to: '/products/kryve-hydrolyzed-collagen-peptides', cls: 'kv-hbtn-r' },
  },
  {
    bg: CF + 'hero-magnesium-v4-69X7SALdjYbiafchJLksSj.webp',
    bgPos: 'center top',
    badge: { bg: '#3B1F6B', color: '#C4B5FD', text: 'HIGH ABSORPTION' },
    eyebrow: { color: '#7C3AED', text: 'Magnesium Glycinate' },
    h1: ['Rest. Recover.', 'Rise.'],
    sub: 'High-absorption magnesium for deep sleep, stress relief, and muscle recovery.*',
    btn: { text: 'SHOP MAGNESIUM $39.99', to: '/products/kryve-magnesium-glycinate', cls: 'kv-hbtn-v' },
  },
  {
    bg: CF + 'hero-stack-v4-AaFoRVQvMorhuG9icoJQ6w.webp',
    bgPos: 'center top',
    badge: { bg: '#7A5C00', color: '#D4AF37', text: 'SAVE $19.98' },
    eyebrow: { color: '#D4AF37', text: 'The Complete Stack' },
    h1: ['The KRYVE', 'Stack.'],
    sub: 'All 3 formulas. One daily ritual.\nFree shipping included.',
    btn: { text: 'GET THE STACK $129.99', to: '/products/the-kryve-stack', cls: 'kv-hbtn-gd' },
  },
]

// ── Compare table — exact match to live ──────────────────────────────────────
const COMPARE_ROWS = [
  {
    feature: 'Number of formulas',
    kryve: { text: '✓ 3 Complete Formulas', yes: true },
    leading: { text: '✗', label: '1 Formula', yes: false },
    womens: { text: '✗', label: '1 Formula', yes: false },
  },
  {
    feature: 'Greens superfood blend',
    kryve: { text: '✓ Included', yes: true },
    leading: { text: '✓', label: 'Included', yes: true },
    womens: { text: '✓', label: 'Included', yes: true },
  },
  {
    feature: 'Collagen formula',
    kryve: { text: '✓ Included', yes: true },
    leading: { text: '✗', label: 'Not offered', yes: false },
    womens: { text: '✗', label: 'Not offered', yes: false },
  },
  {
    feature: 'Magnesium formula',
    kryve: { text: '✓ Included', yes: true },
    leading: { text: '✗', label: 'Not offered', yes: false },
    womens: { text: '✗', label: 'Not offered', yes: false },
  },
  {
    feature: 'Complete bundle option',
    kryve: { text: '✓ $129.99', yes: true },
    leading: { text: '✗', label: 'Not available', yes: false },
    womens: { text: '✗', label: 'Not available', yes: false },
  },
  {
    feature: 'GMP-Certified Facility',
    kryve: { text: '✓ Yes', yes: true },
    leading: { text: '✓', label: 'Yes', yes: true },
    womens: { text: '✓', label: 'Yes', yes: true },
    last: true,
  },
]

// ── Why KRYVE stats ───────────────────────────────────────────────────────────
const WHY_STATS = [
  { target: 75, suffix: '+', label: 'Superfoods & Nutrients', custom: null },
  { target: 0, suffix: '', label: 'Artificial Fillers', custom: 'Zero' },
  { target: 3, suffix: '', label: 'Targeted Formulas', custom: null },
  { target: 1, suffix: '', label: 'Daily Ritual', custom: null },
]

// ── Why KRYVE benefits ────────────────────────────────────────────────────────
const WHY_BENEFITS = [
  {
    title: 'Science-Backed Formulas',
    body: 'Every ingredient chosen for efficacy, not filler. Backed by research, built for results.',
  },
  {
    title: 'Third-Party Tested',
    body: 'Every batch tested for purity and potency. What is on the label is in the bottle.',
  },
  {
    title: 'Manufactured in a GMP-Certified Facility',
    body: 'Made in USA-based facilities meeting strict GMP quality standards.',
  },
]

// ── Gallery images ────────────────────────────────────────────────────────────
const GALLERY_IMGS = [
  {
    url: CF + 'lifestyle-greens-v3-KfcLMaiaeyYpSLVdVWffMR.png',
    alt: 'KRYVE Greens Superfood Powder lifestyle',
    large: true,
  },
  {
    url: CF + 'lifestyle-magnesium-v5-hVvzLiSqemDZuhQKSsuqqr.webp',
    alt: 'KRYVE Magnesium Glycinate lifestyle',
    large: false,
  },
  {
    url: CF + 'lifestyle-collagen-v4-Q9JwTfxrYCUtVv3dWchrir.webp',
    alt: 'KRYVE Collagen Peptides lifestyle',
    large: false,
  },
]

// ── HIW icons (SVG paths matching live site) ──────────────────────────────────
const HIW_STEPS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="1.5">
        <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8l-2 4h12l-2-4z"/>
      </svg>
    ),
    step: 'Step 01',
    title: 'Choose Your Formula',
    body: 'Select the supplement that fits your goals, or get all three in The Stack.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    step: 'Step 02',
    title: 'Make It a Ritual',
    body: 'One scoop or capsule daily. Simple. Consistent. Powerful.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="1.5">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    step: 'Step 03',
    title: 'Feel the Difference',
    body: 'Experience the results within weeks.*',
  },
]

// ── Hero component ────────────────────────────────────────────────────────────
function Hero() {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  // Once the mobile user interacts, autoplay stops for the session permanently
  const userControlledRef = useRef(false)
  const touchRef = useRef<{ x: number; y: number } | null>(null)

  function go(n: number) {
    setCurrent((n + HERO_SLIDES.length) % HERO_SLIDES.length)
  }

  function clearTimer() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }

  // Desktop: arrow/dot click — always restarts (original desktop behaviour)
  function startTimer() {
    clearTimer()
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % HERO_SLIDES.length), 5000)
  }

  // Mobile: any user interaction → permanent stop
  function mobileTakeControl() {
    userControlledRef.current = true
    clearTimer()
  }

  // Initial autoplay + tab-visibility handling
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function startAutoplay() {
      if (userControlledRef.current || prefersReduced) return
      clearTimer()
      timerRef.current = setInterval(() => setCurrent(c => (c + 1) % HERO_SLIDES.length), 5000)
    }

    startAutoplay()

    const onVisibility = () => {
      if (document.hidden) clearTimer()
      else startAutoplay()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => { clearTimer(); document.removeEventListener('visibilitychange', onVisibility) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Touch swipe (mobile only) ─────────────────────────────────────────────
  function onTouchStart(e: React.TouchEvent) {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!touchRef.current) return
    const dx = Math.abs(e.touches[0].clientX - touchRef.current.x)
    const dy = Math.abs(e.touches[0].clientY - touchRef.current.y)
    // Vertical-dominant gesture → abandon so the page can scroll normally
    if (dy > dx + 5) touchRef.current = null
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (!touchRef.current) return
    const dx = e.changedTouches[0].clientX - touchRef.current.x
    const dy = Math.abs(e.changedTouches[0].clientY - touchRef.current.y)
    touchRef.current = null
    // Require: clear horizontal swipe — threshold met AND dx dominates dy.
    // Without the dy guard a diagonal real-world scroll (dx≈45 dy≈40) passes
    // the 40px test and permanently kills autoplay on first page scroll.
    if (Math.abs(dx) < 40 || Math.abs(dx) <= dy) return
    mobileTakeControl()
    setCurrent(c => (c + (dx < 0 ? 1 : -1) + HERO_SLIDES.length) % HERO_SLIDES.length)
  }

  const slide = HERO_SLIDES[current]

  return (
    <section className="kv-hero-section">
      {/* Desktop carousel — hidden on mobile via CSS */}
      <div className="kv-hw">
        {HERO_SLIDES.map((s, i) => (
          <div
            key={i}
            className={`kv-sl${i === current ? ' on' : ''}`}
            style={{
              backgroundImage: `url(${s.bg})`,
              backgroundPosition: s.bgPos,
              backgroundSize: 'cover',
            }}
          >
            <img className="kv-sl-img" src={s.bg} alt="" aria-hidden="true" draggable={false} />
          </div>
        ))}
        <div className="kv-ov" />
        {HERO_SLIDES.map((s, i) => (
          <div key={i} className={`kv-tx${i === current ? ' on' : ''}`}>
            <div className="kv-hbadge" style={{ background: s.badge.bg, color: s.badge.color }}>
              {s.badge.text}
            </div>
            <p className="kv-hey" style={{ color: s.eyebrow.color }}>{s.eyebrow.text}</p>
            <h1 className="kv-hh1">{s.h1[0]}<br />{s.h1[1]}</h1>
            <p className="kv-hsub">{s.sub}</p>
            <Link to={s.btn.to} className={`kv-hbtn ${s.btn.cls}`}>{s.btn.text}</Link>
          </div>
        ))}
        <button className="kv-harr kv-hprev" onClick={() => { go(current - 1); startTimer() }} aria-label="Previous slide">←</button>
        <button className="kv-harr kv-hnext" onClick={() => { go(current + 1); startTimer() }} aria-label="Next slide">→</button>
        <div className="kv-hdots">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} className={`kv-hdot${i === current ? ' on' : ''}`} onClick={() => { go(i); startTimer() }} aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
      </div>

      {/* Mobile stacked layout — swipe + dots, arrows hidden via CSS */}
      <div
        className="kv-hero-mobile"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className={`kv-hero-mobile-img${current === HERO_SLIDES.length - 1 ? ' kv-hero-mobile-img--stack' : ''}`}>
          <img src={slide.bg} alt="" draggable={false} />
          {/* Arrow buttons kept in markup (desktop fallback); hidden on mobile by CSS */}
          <button className="kv-hero-mobile-prev" onClick={() => { go(current - 1); mobileTakeControl() }} aria-label="Previous">←</button>
          <button className="kv-hero-mobile-next" onClick={() => { go(current + 1); mobileTakeControl() }} aria-label="Next">→</button>
        </div>
        <div className="kv-hero-mobile-text">
          <div className="kv-hbadge" style={{ background: slide.badge.bg, color: slide.badge.color }}>
            {slide.badge.text}
          </div>
          <p className="kv-hey" style={{ color: slide.eyebrow.color }}>{slide.eyebrow.text}</p>
          <h1 className="kv-hh1">{slide.h1[0]}<br />{slide.h1[1]}</h1>
          <p className="kv-hsub">{slide.sub}</p>
          <Link to={slide.btn.to} className={`kv-hbtn ${slide.btn.cls}`}>{slide.btn.text}</Link>
        </div>
        <div className="kv-hero-mobile-dots">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`kv-hdot${i === current ? ' on' : ''}`}
              onClick={() => { go(i); mobileTakeControl() }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Why counter ───────────────────────────────────────────────────────────────
function CounterStat({ target, suffix, label, custom }: typeof WHY_STATS[number]) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    // custom stats (target=0) don't need animation — they display static text
    const el = ref.current
    if (!el || animated.current || custom !== null) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true
        const duration = 1400
        const start = performance.now()
        const step = (now: number) => {
          const elapsed = now - start
          const progress = Math.min(elapsed / duration, 1)
          // easeOutCubic so it lands cleanly on the final value
          const ease = 1 - Math.pow(1 - progress, 3)
          setCount(Math.round(ease * target))
          if (progress < 1) requestAnimationFrame(step)
          else setCount(target) // guarantee exact final value
        }
        requestAnimationFrame(step)
        obs.disconnect()
      }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, custom])

  return (
    <div ref={ref} className="kv-fade" style={{ textAlign: 'center', padding: '48px 24px', background: '#111', transitionDelay: '0s' }}>
      {custom !== null ? (
        // Static display for "Zero Artificial Fillers" — no animated number
        <span style={{ color: '#39FF14', fontSize: '3.5rem', fontWeight: 900, display: 'block', fontFamily: 'Montserrat,sans-serif' }}>
          {custom}
        </span>
      ) : (
        <span className="counter-number" style={{ color: '#39FF14', fontSize: '3.5rem', fontWeight: 900, display: 'block', fontFamily: 'Montserrat,sans-serif' }}>
          {count}{suffix}
        </span>
      )}
      <p style={{ color: '#fff', fontWeight: 700, margin: '12px 0 0', fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'Montserrat,sans-serif' }}>
        {label}
      </p>
    </div>
  )
}

// ── Newsletter ────────────────────────────────────────────────────────────────
function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email) return
    setDone(true)
  }

  return (
    <section style={{ background: '#0A0A0A', padding: 'clamp(50px,7vw,100px) clamp(16px,4vw,40px)', borderTop: '1px solid #222' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }} className="kv-fade">
        <p style={{ color: '#39FF14', letterSpacing: '0.3em', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700, fontFamily: 'Montserrat,sans-serif' }}>
          Stay in the Loop
        </p>
        <h2 style={{ color: '#fff', fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 900, marginBottom: 16, fontFamily: 'Montserrat,sans-serif' }}>
          Join the KRYVE Movement
        </h2>
        <p style={{ color: '#888', fontSize: '1rem', marginBottom: 40 }}>
          Get exclusive offers, wellness tips, and early access to new products.
        </p>
        {done ? (
          <p style={{ color: '#39FF14', fontSize: '1rem', padding: '20px 0' }}>
            ✓ You're in! Check your inbox.
          </p>
        ) : (
          <form
            className="kv-nl-form"
            onSubmit={handleSubmit}
            style={{ display: 'flex', maxWidth: 480, margin: '0 auto 16px' }}
          >
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                flex: 1,
                background: '#111',
                border: '1px solid #333',
                borderRight: 'none',
                color: '#fff',
                padding: '16px 20px',
                fontSize: '16px',
                outline: 'none',
                borderRadius: '2px 0 0 2px',
                fontFamily: 'Montserrat,sans-serif',
              }}
            />
            <button
              type="submit"
              style={{
                background: '#39FF14',
                color: '#0A0A0A',
                border: 'none',
                padding: '16px 24px',
                fontWeight: 800,
                fontSize: '0.875rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                borderRadius: '0 2px 2px 0',
                whiteSpace: 'nowrap',
                fontFamily: 'Montserrat,sans-serif',
              }}
            >
              SUBSCRIBE
            </button>
          </form>
        )}
        <p style={{ color: '#555', fontSize: '0.8rem' }}>No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  )
}

// ── Main HomePage ─────────────────────────────────────────────────────────────
export default function HomePage() {
  const { addItem } = useCart()

  // Activate .kv-fade elements on scroll (matches live site IntersectionObserver pattern)
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.kv-fade')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target) } })
      },
      { threshold: 0.15 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  function handleAddToCart(product: typeof STATIC_PRODUCTS[number]) {
    const variant = product.variants.edges[0]?.node
    if (!variant) return
    const item: CartItem = {
      variantId: variant.id,
      productId: product.id,
      title: product.title,
      variantTitle: variant.title,
      price: parseFloat(variant.price.amount),
      quantity: 1,
      image: product.images.edges[0]?.node.url || '',
      handle: product.handle,
    }
    addItem(item)
  }

  const products3 = (STATIC_PRODUCTS as unknown as ShopifyProduct[]).filter(p => !p.handle.includes('stack'))

  return (
    <main>
      {/* ── HERO ── */}
      <Hero />

      {/* ── TRUST BAR ── */}
      <section style={{ background: '#111', borderTop: '1px solid #222', padding: '28px clamp(16px,4vw,40px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }} className="kv-fade kv-trust-grid">
          {[
            {
              svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="2"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>,
              title: 'Science-Backed',
              sub: 'Research-Supported Formulas',
            },
            {
              svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>,
              title: 'GMP-Certified Facility',
              sub: 'Manufactured to GMP Standards',
            },
            {
              svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
              title: 'Made in USA',
              sub: 'USA-Based Manufacturing',
            },
            {
              svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
              title: 'No Fillers',
              sub: 'Premium Ingredients Only',
            },
          ].map(item => (
            <div key={item.title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              {item.svg}
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'Montserrat,sans-serif' }}>{item.title}</div>
                <div style={{ color: '#888', fontSize: '0.8rem' }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="kv-products">
        <h2 className="kv-products-title">Premium Supplements. Real Results.</h2>
        <p className="kv-products-sub">Science-backed formulas crafted for high performers</p>
        <div className="kv-pcards">
          {products3.map(product => {
            const img = product.images.edges[0]?.node.url || ''
            const price = product.variants.edges[0]?.node.price.amount || product.priceRange.minVariantPrice.amount
            const compareAt = product.variants.edges[0]?.node.compareAtPrice?.amount
            const handle = product.handle
            const cardCls = handle.includes('greens') ? 'kv-pcard-greens' : handle.includes('collagen') ? 'kv-pcard-collagen' : 'kv-pcard-magnesium'
            const badgeCls = getProductBadgeClass(handle)
            const ctaCls = handle.includes('greens') ? 'cta-greens' : handle.includes('collagen') ? 'cta-collagen' : 'cta-magnesium'
            const badgeTxt = getBadgeText(handle)
            const ctaTxt = handle.includes('greens') ? 'Shop Greens →' : handle.includes('collagen') ? 'Shop Collagen →' : 'Shop Magnesium →'
            return (
              <div key={product.id} className={`kv-pcard ${cardCls}`}>
                <div className="kv-pcard-img-wrap" style={{ position: 'relative' }}>
                  <span className={`kv-pcard-badge ${badgeCls}`}>{badgeTxt}</span>
                  <img src={img} alt={product.title} loading={handle.includes('greens') ? 'eager' : 'lazy'} />
                </div>
                <div className="kv-pcard-body">
                  <div className="kv-pcard-name">{product.title}</div>
                  <div className="kv-pcard-desc">{product.description}</div>
                  <div className="kv-pcard-price">
                    <span className="kv-price-current">{formatPrice(price)}</span>
                    {compareAt && parseFloat(compareAt) > parseFloat(price) && (
                      <span className="kv-price-compare">{formatPrice(compareAt)}</span>
                    )}
                  </div>
                  <Link to={`/products/${handle}`} className={`kv-pcard-cta ${ctaCls}`}>
                    {ctaTxt}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── COMPARE ── */}
      <section className="kv-cmp-wrap">
        <div className="kv-cmp-inner">
          <div className="kv-cmp-head">
            <p className="kv-cmp-eyebrow">The Difference</p>
            <h2 className="kv-cmp-title">How We Stack Up</h2>
            <p className="kv-cmp-sub">KRYVE is the only brand built for your complete daily stack.</p>
          </div>
          <div className="kv-cmp-table-wrap">
            <div className="kv-cmp-table-outer">
              <table className="kv-cmp-table">
                <thead>
                  <tr>
                    <th className="kv-cmp-th-feat">Feature</th>
                    <th className="kv-cmp-th-kryve">
                      <span className="kv-cmp-best">★ BEST VALUE</span><br />KRYVE
                    </th>
                    <th className="kv-cmp-th-other">Leading Greens Brand</th>
                    <th className="kv-cmp-th-other">Popular Women's Brand</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={`${i % 2 === 0 ? 'kv-cmp-tr-a' : 'kv-cmp-tr-b'}${row.last ? ' kv-cmp-last' : ''}`}
                    >
                      <td className="kv-cmp-feat">{row.feature}</td>
                      <td className="kv-cmp-kryve-cell">
                        <span className="kv-cmp-yes">✓</span> {row.kryve.text.replace('✓ ', '')}
                      </td>
                      <td>
                        <span className={row.leading.yes ? 'kv-cmp-yes' : 'kv-cmp-no'}>
                          {row.leading.yes ? '✓' : '✗'}
                        </span>{' '}
                        <span style={{ color: row.leading.yes ? '#39FF14' : '#FF4444' }}>
                          {row.leading.label}
                        </span>
                      </td>
                      <td>
                        <span className={row.womens.yes ? 'kv-cmp-yes' : 'kv-cmp-no'}>
                          {row.womens.yes ? '✓' : '✗'}
                        </span>{' '}
                        <span style={{ color: row.womens.yes ? '#39FF14' : '#FF4444' }}>
                          {row.womens.label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="kv-cmp-disclaimer">*Based on publicly available product information as of 2025. Individual results may vary.</p>
        </div>
      </section>

      {/* ── BUILT TO STACK ── */}
      <section className="kv-stack">
        <div className="kv-stack-inner">
          {/* Left: text */}
          <div className="kv-stack-left">
            <div className="kv-stack-eyebrow">The Complete System</div>
            <h2 className="kv-stack-title">Built to <span>Stack.</span><br />Designed to Perform.</h2>
            <p className="kv-stack-sub">All 3 formulas. One daily ritual.<br />Free shipping included.</p>
            <div className="kv-stack-cta-row">
              <Link to="/products/the-kryve-stack" className="kv-stack-cta">
                Shop The Stack — Save 20%
              </Link>
              <span className="kv-stack-note">Free shipping on orders $75+</span>
            </div>
          </div>
          {/* Right: bottles */}
          <div className="kv-stack-right">
            <div className="kv-stack-row">
              <div className="kv-stack-col kv-stack-col-left">
                <div className="kv-stack-spot">
                  <div className="kv-stack-img-box">
                    <img src="/images/product-greens-themed.png" alt="KRYVE Greens" />
                  </div>
                </div>
              </div>
              <div className="kv-stack-col kv-stack-col-center">
                <div className="kv-stack-spot">
                  <div className="kv-stack-img-box">
                    <img src="/images/product-collagen-themed.png" alt="KRYVE Collagen" />
                  </div>
                </div>
              </div>
              <div className="kv-stack-col kv-stack-col-right">
                <div className="kv-stack-spot">
                  <div className="kv-stack-img-box">
                    <img src="/images/product-magnesium-real-studio.png" alt="KRYVE Magnesium" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY KRYVE ── */}
      <section style={{ background: '#111', padding: 'clamp(50px,7vw,100px) clamp(16px,4vw,40px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Header */}
          <div className="kv-fade" style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ color: '#39FF14', letterSpacing: '0.3em', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700, fontFamily: 'Montserrat,sans-serif' }}>
              The Difference
            </p>
            <h2 style={{ color: '#fff', fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'Montserrat,sans-serif' }}>
              Why KRYVE?
            </h2>
          </div>

          {/* Stats grid */}
          <div className="kv-4col kv-why-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2, marginBottom: 72, background: '#222', borderRadius: 12, overflow: 'hidden' }}>
            {WHY_STATS.map((s, i) => (
              <CounterStat key={i} {...s} />
            ))}
          </div>

          {/* 2-col benefits */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="kv-2col">
            <div className="kv-fade">
              {WHY_BENEFITS.map((b, i) => (
                <div key={i} style={{ marginBottom: 28, paddingBottom: 28, borderBottom: i < WHY_BENEFITS.length - 1 ? '1px solid #222' : 'none' }}>
                  <strong style={{ color: '#39FF14', fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'Montserrat,sans-serif' }}>
                    {b.title}
                  </strong>
                  <p style={{ color: '#aaa', marginTop: 10, lineHeight: 1.75, fontSize: '0.95rem' }}>{b.body}</p>
                </div>
              ))}
              <Link to="/science" style={{ color: '#39FF14', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none' }}>
                Our Science →
              </Link>
            </div>
            <div className="kv-fade kv-why-img" style={{ transitionDelay: '0.15s' }}>
              <img
                src={CF + 'hero-stack-v4-AaFoRVQvMorhuG9icoJQ6w.webp'}
                alt="KRYVE Science"
                loading="lazy"
                style={{ width: '100%', borderRadius: 12, display: 'block' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className="kv-gallery">
        <div className="kv-gallery-inner">
          <div className="kv-gallery-header">
            <p className="kv-gallery-eyebrow">Real People. Real Results.</p>
            <h2 className="kv-gallery-title">The KRYVE Lifestyle</h2>
          </div>
          <div className="kv-gal-grid">
            {GALLERY_IMGS.map((img, i) => (
              <div key={i} className={`kv-gal-item${img.large ? ' kv-gal-large' : ''}`}>
                <img src={img.url} alt={img.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: '#111', padding: 'clamp(50px,7vw,100px) clamp(16px,4vw,40px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="kv-fade" style={{ textAlign: 'center', marginBottom: 72 }}>
            <p style={{ color: '#39FF14', letterSpacing: '0.3em', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700, fontFamily: 'Montserrat,sans-serif' }}>
              Simple by Design
            </p>
            <h2 style={{ color: '#fff', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'Montserrat,sans-serif' }}>
              How It Works
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }} className="kv-3col">
            {HIW_STEPS.map((step, i) => (
              <div key={i} className="kv-fade" style={{ textAlign: 'center', padding: '0 32px' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', border: '2px solid #39FF14', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', background: '#0A0A0A' }}>
                  {step.icon}
                </div>
                <div style={{ color: '#39FF14', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10, fontFamily: 'Montserrat,sans-serif' }}>
                  {step.step}
                </div>
                <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, marginBottom: 10, fontFamily: 'Montserrat,sans-serif' }}>
                  {step.title}
                </h3>
                <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.7 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <Newsletter />

      {/* ── FDA ── */}
      <section style={{ background: '#0A0A0A', padding: '20px clamp(16px,4vw,40px)', borderTop: '1px solid #111' }}>
        <p style={{ color: '#444', fontSize: 11, textAlign: 'center', maxWidth: 900, margin: '0 auto', lineHeight: 1.6 }}>
          *These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary.
        </p>
      </section>
    </main>
  )
}
