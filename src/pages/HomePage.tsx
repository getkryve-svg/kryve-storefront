import { Link } from 'react-router-dom'
import { PRODUCTS, DROP_COLORS } from '../data/products'
import ProductImage from '../components/ProductImage'
import { useCart } from '../context/CartContext'
import { useState, useEffect, useRef, useCallback } from 'react'
import Toast from '../components/Toast'
import type { LocalProduct } from '../types'

// ── Data ──────────────────────────────────────────────────────────────────────

// girl → guy → girl order  (Fog woman, Sand man, Clay woman)
const DROPS = ['Fog', 'Sand', 'Clay'] as const
type Drop = typeof DROPS[number]

const DROP_HERO_PRODUCT: Record<Drop, LocalProduct> = {
  Fog:  PRODUCTS.find(p => p.id === 'fog-hoodie')!,        // different model from carousel fog-fitted-tee woman
  Sand: PRODUCTS.find(p => p.id === 'sand-joggers')!,      // different model from carousel sand-tee man
  Clay: PRODUCTS.find(p => p.id === 'clay-hoodie')!,       // different model from carousel clay-fitted-tank woman
}

// Dedicated carousel hero images — decoupled from product images.
const DROP_HERO_IMAGE: Record<Drop, string> = {
  Fog:  PRODUCTS.find(p => p.id === 'fog-fitted-tee')!.images?.lifestyle || '',                                            // woman — fitted tee (CloudFront ✅)
  Sand: '/images/hpm3_sand_01_tee_lifestyle.png',                                                                           // tee — front-facing man, face visible
  Clay: PRODUCTS.find(p => p.id === 'clay-fitted-tank')!.images?.lifestyle || '',                                          // woman — fitted tank (CloudFront ✅)
  // Clay man (camel jacket, saved for product page / about page use):
  // 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1920&q=80&fit=crop&auto=format'
}

const DROP_SUBTITLES: Record<Drop, string> = {
  Sand: 'Desert warmth. Vintage silhouettes.',
  Clay: 'Earthy tones. Elevated essentials.',
  Fog:  'Muted hues. Minimal branding.',
}

// Mix of men's + women's across all 3 drops
const GRID_PRODUCTS = [
  PRODUCTS.find(p => p.id === 'sand-hoodie')!,       // Sand men's
  PRODUCTS.find(p => p.id === 'sand-fitted-tee')!,   // Sand women's
  PRODUCTS.find(p => p.id === 'clay-tee')!,          // Clay men's
  PRODUCTS.find(p => p.id === 'clay-sleeveless')!,   // Clay women's
  PRODUCTS.find(p => p.id === 'fog-tee')!,           // Fog men's
  PRODUCTS.find(p => p.id === 'fog-sleeveless')!,    // Fog women's
]

// Urgency metadata — which products have which badges
const BADGES: Record<string, 'new' | 'low-stock' | 'both'> = {
  'sand-hoodie':       'low-stock',
  'sand-fitted-tee':   'new',
  'clay-tee':          'low-stock',
  'clay-sleeveless':   'new',
  'fog-tee':           'low-stock',
  'fog-sleeveless':    'new',
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// Counts up from 0 → target over `duration` ms when triggered
function useCounter(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [active, target, duration])
  return count
}

// ── Sticky CTA ────────────────────────────────────────────────────────────────

function StickyCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past ~90vh (past hero)
      setVisible(window.scrollY > window.innerHeight * 0.9)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className="fixed bottom-6 right-4 sm:right-6 z-50 transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <Link
        to="/shop"
        className="flex items-center gap-2 font-display font-bold text-sm tracking-widest uppercase px-6 py-3.5 sm:px-8 sm:py-4 rounded-full shadow-2xl transition-all duration-150 active:scale-[0.97] hover:scale-[1.04]"
        style={{ backgroundColor: '#1A1A1A', color: '#FAF8F5', boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 2h2l2.5 7h5l1.5-4.5H5.5"/>
          <circle cx="7" cy="13" r="1" fill="currentColor" stroke="none"/>
          <circle cx="12" cy="13" r="1" fill="currentColor" stroke="none"/>
        </svg>
        Shop Now
      </Link>
    </div>
  )
}

// ── Hero Carousel ─────────────────────────────────────────────────────────────

function HeroCarousel() {
  const [active, setActive]   = useState(0)
  const [leaving, setLeaving] = useState<number | null>(null)
  const [imgLoaded, setImgLoaded] = useState(false)
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeRef  = useRef(0)   // always mirrors `active` without closure staleness

  const changeTo = useCallback((next: number) => {
    const curr = activeRef.current
    if (next === curr) return
    setLeaving(curr)
    setActive(next)
    activeRef.current = next
    // Remove the leaving slide overlay once CSS fade-out finishes (700ms)
    setTimeout(() => setLeaving(null), 700)
  }, [])

  const goTo    = useCallback((idx: number) => changeTo(idx), [changeTo])
  const advance = useCallback((dir: 1 | -1) => {
    changeTo((activeRef.current + dir + DROPS.length) % DROPS.length)
  }, [changeTo])

  useEffect(() => {
    timerRef.current = setTimeout(() => advance(1), 6000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [active, advance])

  const drop = DROPS[active]
  const product = DROP_HERO_PRODUCT[drop]
  const dropColor = DROP_COLORS[drop]

  return (
    <section
      className="relative w-full overflow-hidden bg-[#111]"
      style={{
        // 56.25% = 16:9 on desktop, cap at 780px, floor at 480px on mobile
        height: 'clamp(480px, 56.25vw, 780px)',
      }}
    >
      {/* Loading skeleton — pulses until first image loads */}
      <div
        className="absolute inset-0 bg-[#222] transition-opacity duration-500"
        style={{ opacity: imgLoaded ? 0 : 1, pointerEvents: 'none' }}
        aria-hidden="true"
      >
        {/* Subtle animated shimmer */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
            animation: 'shimmer 1.8s ease-in-out infinite',
          }}
        />
      </div>

      {/* Slides — all pre-rendered; CSS handles crossfade + Ken Burns scale */}
      {DROPS.map((d, i) => {
        const isActive  = i === active
        const isLeaving = i === leaving
        return (
          <div
            key={d}
            className="absolute inset-0 overflow-hidden"
            style={{
              opacity: isActive ? 1 : isLeaving ? 0 : 0,
              transition: isActive ? 'opacity 700ms ease-in-out' : isLeaving ? 'opacity 700ms ease-in-out' : 'none',
              zIndex: isActive ? 2 : isLeaving ? 1 : 0,
            }}
            aria-hidden={!isActive}
          >
            <img
              src={DROP_HERO_IMAGE[d]}
              alt={`${d} drop lifestyle`}
              className="w-full h-full"
              style={{
                objectFit: d === 'Sand' ? 'contain' : 'cover',
                objectPosition: d === 'Fog' ? '50% 0%' : d === 'Sand' ? '50% 50%' : '50% 12%',
                backgroundColor: d === 'Sand' ? '#111' : 'transparent',
                // Ken Burns: active slides slowly zoom in, leaving slides freeze
                transform: isActive ? 'scale(1.04)' : 'scale(1.0)',
                transition: isActive ? 'transform 7s ease-out' : 'transform 700ms ease-in-out',
                transformOrigin: '55% 30%',
              }}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              onLoad={() => { if (isActive) setImgLoaded(true) }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
          </div>
        )
      })}

      {/* Slide content — re-mounts on each slide change to replay the fade-up animation */}
      {[active].map(a => (
      <div
        key={a}
        className="absolute inset-0 flex flex-col justify-end pl-16 pr-16 sm:pl-20 sm:pr-20 lg:pl-24 lg:pr-24 pb-16 sm:pb-20 z-10"
        style={{ animation: 'slideContentIn 600ms ease-out both' }}
      >
        <div className="flex items-center gap-3 mb-3 sm:mb-4">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dropColor }} />
          <span className="font-body text-[11px] tracking-[0.3em] uppercase text-white/60">Drop {active + 1} of 3</span>
        </div>
        <h1 className="font-display font-black text-[clamp(40px,9vw,112px)] leading-none tracking-tight text-white mb-2 sm:mb-3">
          {drop}
        </h1>
        <p className="font-body text-sm sm:text-base text-white/55 mb-6 sm:mb-8 tracking-wide max-w-xs">
          {DROP_SUBTITLES[drop]}
        </p>
        <Link
          to={`/shop?drop=${drop}`}
          className="inline-flex items-center gap-2 font-display font-bold text-sm tracking-widest uppercase px-7 py-3.5 sm:px-8 sm:py-4 rounded-sm transition-all duration-150 active:scale-[0.97] hover:brightness-110 w-fit min-h-[48px]"
          style={{ backgroundColor: dropColor, color: '#FAF8F5' }}
        >
          Shop {drop}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 7h10M8 3l4 4-4 4"/>
          </svg>
        </Link>
      </div>
      ))}

      {/* Arrow buttons — vertically centered, clear of content area */}
      <button
        onClick={() => advance(-1)}
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white transition-all duration-150 hover:scale-110 active:scale-95"
        style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
        aria-label="Previous slide"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M10 3L5 8l5 5"/>
        </svg>
      </button>
      <button
        onClick={() => advance(1)}
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white transition-all duration-150 hover:scale-110 active:scale-95"
        style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
        aria-label="Next slide"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M6 3l5 5-5 5"/>
        </svg>
      </button>

      {/* Dot indicators — left-aligned with content so they never overlap the shirt logo */}
      <div className="absolute bottom-5 sm:bottom-7 left-16 sm:left-20 lg:left-24 flex gap-2 items-center z-20">
        {DROPS.map((d, i) => (
          <button
            key={d}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="p-1" // larger touch target
          >
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: i === active ? 22 : 7,
                height: 7,
                backgroundColor: i === active ? DROP_COLORS[d] : 'rgba(255,255,255,0.35)',
              }}
            />
          </button>
        ))}
      </div>

    </section>
  )
}

// ── Featured Drops ────────────────────────────────────────────────────────────

function FeaturedDrops() {
  const { ref, inView } = useInView(0.15)

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
      <div ref={ref}>
        <div
          className="text-center mb-12"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <p className="font-body text-[11px] tracking-[0.3em] uppercase text-[#8B6F47] mb-3">The Collection</p>
          <h2 className="font-display font-black text-4xl sm:text-5xl tracking-tight text-[#1A1A1A]">
            Three Drops. One Vision.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {DROPS.map((drop, i) => {
            const product = DROP_HERO_PRODUCT[drop]
            const dropColor = DROP_COLORS[drop]
            // Alternate: odd cards slide from left, even from right
            const xOffset = i % 2 === 0 ? '-20px' : '20px'
            return (
              <Link
                key={drop}
                to={`/shop?drop=${drop}`}
                className="group relative block overflow-hidden bg-[#EDE8E2] aspect-[3/4] md:aspect-square"
                style={{
                  borderRadius: 8,
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translate(0,0)' : `translate(${xOffset}, 28px)`,
                  transition: `opacity 0.65s ease ${i * 100}ms, transform 0.65s ease ${i * 100}ms`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 48px rgba(0,0,0,0.2)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)' }}
                aria-label={`Shop Drop ${i + 1} — ${drop}`}
              >
                <ProductImage
                  product={product} view="lifestyle"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                  loading="eager"
                  imgStyle={{ objectPosition: drop === 'Clay' ? '50% 0%' : '50% 8%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span
                    className="inline-block font-body text-[10px] tracking-[0.22em] uppercase px-2.5 py-1 rounded-full text-white mb-3"
                    style={{ backgroundColor: dropColor }}
                  >
                    Drop {i + 1}
                  </span>
                  <p className="font-display font-black text-3xl sm:text-4xl tracking-tight text-white mb-1">{drop}</p>
                  <p className="font-body text-xs text-white/55 mb-5 tracking-wide">{DROP_SUBTITLES[drop]}</p>
                  <span className="inline-flex items-center gap-2 font-display font-bold text-xs tracking-widest uppercase text-white border border-white/30 px-4 py-2.5 rounded-sm group-hover:bg-white group-hover:text-[#1A1A1A] group-hover:border-white transition-all duration-200">
                    Shop {drop}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 6h8M6 2l4 4-4 4"/>
                    </svg>
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* See All Products CTA */}
        <div
          className="text-center mt-10"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease 400ms, transform 0.6s ease 400ms',
          }}
        >
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 font-display font-bold text-sm tracking-widest uppercase px-10 py-4 border-2 border-[#1A1A1A] text-[#1A1A1A] rounded-sm hover:bg-[#1A1A1A] hover:text-[#FAF8F5] active:scale-[0.97] transition-all duration-200"
          >
            See All Products
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 7h10M8 3l4 4-4 4"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── Grid Card ─────────────────────────────────────────────────────────────────

function GridCard({ product, onAdd, animIn, delay }: {
  product: LocalProduct
  onAdd: (p: LocalProduct) => void
  animIn: boolean
  delay: number
}) {
  const [hovered, setHovered] = useState(false)
  const [adding, setAdding] = useState(false)
  const hasBack = !!product.images?.back
  const badge = BADGES[product.id]

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setAdding(true)
    onAdd(product)
    setTimeout(() => setAdding(false), 900)
  }

  return (
    <div
      style={{
        opacity: animIn ? 1 : 0,
        transform: animIn ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <Link
        to={`/products/${product.handle}`}
        className="group block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image container */}
        <div
          className="relative overflow-hidden bg-[#EDE8E2] aspect-square mb-3 transition-all duration-200"
          style={{
            borderRadius: 8,
            transform: hovered ? 'scale(1.02)' : 'scale(1)',
            boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          {/* Primary */}
          <div className={`absolute inset-0 transition-opacity duration-200 ${hovered && hasBack ? 'opacity-0' : 'opacity-100'}`}>
            <ProductImage product={product} view="primary" className="w-full h-full object-cover" loading="lazy" imgStyle={{ objectPosition: '50% 8%' }} />
          </div>
          {/* Back on hover */}
          {hasBack && (
            <div className={`absolute inset-0 transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
              <ProductImage product={product} view="back" className="w-full h-full object-cover" loading="lazy" />
            </div>
          )}

          {/* Badges row */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {/* Drop badge */}
            <span
              className="font-body text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-1 rounded-full text-white w-fit"
              style={{ backgroundColor: DROP_COLORS[product.drop] }}
            >
              {product.drop}
            </span>
            {/* New badge */}
            {(badge === 'new' || badge === 'both') && (
              <span className="font-body text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-1 rounded-full text-white w-fit bg-[#1A1A1A] animate-pulse">
                New
              </span>
            )}
            {/* Low stock badge */}
            {(badge === 'low-stock' || badge === 'both') && (
              <span className="font-body text-[9px] font-bold tracking-[0.12em] uppercase px-2 py-1 rounded-full w-fit bg-[#FEF3C7] text-[#92400E]">
                Low Stock
              </span>
            )}
          </div>

          {/* Quick add overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 p-3 transition-all duration-200"
            style={{
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateY(0)' : 'translateY(8px)',
            }}
          >
            <button
              onClick={handleAdd}
              className={`w-full font-display font-bold text-xs tracking-widest uppercase py-3 rounded-sm transition-all duration-150 active:scale-[0.97] min-h-[48px] ${
                adding
                  ? 'bg-[#10B981] text-white'
                  : 'bg-[#1A1A1A]/90 backdrop-blur-sm text-white hover:bg-[#1A1A1A]'
              }`}
            >
              {adding ? 'Added ✓' : 'Quick Add'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-display font-bold text-sm tracking-tight text-[#1A1A1A] group-hover:opacity-60 transition-opacity duration-200">
              {product.title}
            </p>
            <p className="font-body text-xs text-[#8B6F47] mt-0.5">{product.color}</p>
          </div>
          <p className="font-display font-bold text-sm text-[#1A1A1A] flex-shrink-0">${product.price}</p>
        </div>
      </Link>
    </div>
  )
}

// ── Social Proof ──────────────────────────────────────────────────────────────

function SocialProof() {
  const { ref, inView } = useInView(0.3)
  const count = useCounter(1000, 2000, inView)

  return (
    <div
      ref={ref}
      className="flex items-center justify-center gap-2 py-6"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      {/* Avatar stack */}
      <div className="flex -space-x-2">
        {['#C8B89A', '#C1694F', '#9A9590', '#8A9E8A', '#B8AFA6'].map((color, i) => (
          <div
            key={i}
            className="w-7 h-7 rounded-full border-2 border-[#F5F1ED] flex items-center justify-center"
            style={{ backgroundColor: color, zIndex: 5 - i }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="white" opacity={0.6}>
              <circle cx="6" cy="4" r="2.5"/>
              <path d="M1 11c0-2.76 2.24-5 5-5s5 2.24 5 5"/>
            </svg>
          </div>
        ))}
      </div>
      <p className="font-body text-sm text-[#555]">
        Join <span className="font-bold text-[#1A1A1A]">{count.toLocaleString()}+</span> hpm3® Members
      </p>
    </div>
  )
}

// ── Brand Story ───────────────────────────────────────────────────────────────

function BrandStory() {
  const { ref, inView } = useInView(0.15)
  const storyProduct = PRODUCTS.find(p => p.id === 'clay-cropped-hoodie')!

  return (
    <section className="bg-[#F5F1ED] py-20 sm:py-32 overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div
            className="relative aspect-[3/4] rounded-sm overflow-hidden bg-[#EDE8E2]"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateX(0)' : 'translateX(-32px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            <ProductImage product={storyProduct} view="lifestyle" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Text */}
          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateX(0)' : 'translateX(32px)',
              transition: 'opacity 0.7s ease 200ms, transform 0.7s ease 200ms',
            }}
          >
            <p className="font-body text-[11px] tracking-[0.3em] uppercase text-[#8B6F47] mb-5">Our Story</p>
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-[56px] tracking-tight leading-[1.05] text-[#1A1A1A] mb-6">
              hpm3® —<br />
              <span style={{ color: '#8B6F47' }}>Happy People</span><br />
              Make More Money
            </h2>
            <p className="font-body text-base text-[#555] leading-relaxed mb-5">
              Premium vintage-inspired streetwear designed for culture creators. Each drop is limited, intentional, and crafted for those who make moves.
            </p>
            <p className="font-body text-sm text-[#888] leading-relaxed mb-10">
              Three seasonal drops. Twenty-three pieces. Zero compromise on quality or intention. When you wear hpm3®, you're not just wearing a brand — you're wearing a mindset.
            </p>

            <div className="grid grid-cols-3 gap-6 border-t border-[#DDD8D0] pt-8">
              {[
                { value: '3', label: 'Seasonal Drops' },
                { value: '23', label: 'Pieces Total' },
                { value: '100%', label: 'Premium Cotton' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="font-display font-black text-3xl text-[#1A1A1A]">{value}</p>
                  <p className="font-body text-xs text-[#888] mt-1 tracking-wide">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Footer CTA ────────────────────────────────────────────────────────────────

function FooterCTA() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { ref, inView } = useInView(0.2)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <section className="bg-[#1A1A1A] py-20 sm:py-28 px-4">
      <div
        ref={ref}
        className="max-w-xl mx-auto text-center"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}
      >
        <p className="font-body text-[11px] tracking-[0.3em] uppercase text-[#8B6F47] mb-4">Stay Close</p>
        <h2 className="font-display font-black text-4xl sm:text-5xl tracking-tight text-white mb-4">
          Join the Movement
        </h2>
        <p className="font-body text-sm text-white/45 mb-10 leading-relaxed">
          Early access to new drops. No spam. Just culture.
        </p>

        {submitted ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#10B981]/20 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#10B981" strokeWidth="2.5">
                <path d="M4 11l5 5 9-9"/>
              </svg>
            </div>
            <p className="font-display font-bold text-white text-lg">You're in.</p>
            <p className="font-body text-sm text-white/45">First drop access coming soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 font-body text-sm px-5 py-4 rounded-sm bg-white/10 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-[#8B6F47] transition-colors min-h-[48px]"
            />
            <button
              type="submit"
              className="font-display font-bold text-sm tracking-widest uppercase px-8 py-4 rounded-sm bg-[#10B981] text-white hover:bg-[#0ea572] hover:scale-[1.03] active:scale-[0.97] transition-all duration-150 min-h-[48px] whitespace-nowrap"
            >
              Get Early Access
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { addItem } = useCart()
  const [toast, setToast] = useState<string | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [gridInView, setGridInView] = useState(false)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setGridInView(true); obs.disconnect() } },
      { threshold: 0.05 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  function handleQuickAdd(product: LocalProduct) {
    const size = product.sizes.length === 1 ? product.sizes[0] : product.sizes[2] ?? product.sizes[0]
    addItem({
      variantId: `${product.id}-${size}`,
      productId: product.id,
      title: product.title,
      variantTitle: size,
      price: product.price,
      quantity: 1,
      image: product.imageProduct,
      handle: product.handle,
    })
    setToast(`${product.title} added to cart`)
  }

  return (
    <main>
      <HeroCarousel />

      {/* Marquee strip */}
      <div className="bg-[#1A1A1A] py-3 overflow-hidden select-none" aria-hidden="true">
        <div className="marquee-track">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="font-display font-black text-sm tracking-widest uppercase text-white/20 mr-10 whitespace-nowrap">
              Happy People Make More Money &nbsp;&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      <FeaturedDrops />

      {/* Product Grid */}
      <section className="bg-[#F5F1ED] py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={gridRef}
            className="text-center mb-12"
            style={{
              opacity: gridInView ? 1 : 0,
              transform: gridInView ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            <p className="font-body text-[11px] tracking-[0.3em] uppercase text-[#8B6F47] mb-3">Fan Favorites</p>
            <h2 className="font-display font-black text-4xl sm:text-5xl tracking-tight text-[#1A1A1A] mb-3">
              Shop the Drops
            </h2>
            <p className="font-body text-sm text-[#888] max-w-sm mx-auto">
              Hover to see the back view. Tap to explore the full product.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {GRID_PRODUCTS.map((product, i) => (
              <GridCard
                key={product.id}
                product={product}
                onAdd={handleQuickAdd}
                animIn={gridInView}
                delay={i * 100}
              />
            ))}
          </div>

          {/* Social proof + CTA */}
          <SocialProof />

          <div
            className="text-center mt-4"
            style={{
              opacity: gridInView ? 1 : 0,
              transition: 'opacity 0.7s ease 700ms',
            }}
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 font-display font-bold text-sm tracking-widest uppercase px-10 py-4 bg-[#1A1A1A] text-[#FAF8F5] rounded-sm hover:bg-[#333] hover:scale-[1.03] active:scale-[0.97] transition-all duration-150"
            >
              View All 23 Products
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 7h10M8 3l4 4-4 4"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <BrandStory />
      <FooterCTA />

      {/* Sticky CTA */}
      <StickyCTA />

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </main>
  )
}
