import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import {
  STATIC_PRODUCTS, fetchProductByHandle, formatPrice,
  getProductAccent, getBadgeText, getProductBadgeClass,
  type ShopifyProduct
} from '../lib/shopify'
import type { CartItem } from '../types'

const CF = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663745291897/2HBFBRwReVdUcKECHB8taa/'

// Extended product detail copy keyed by handle
const PRODUCT_DETAIL: Record<string, {
  tagline: string
  bullets: string[]
  supplement?: {
    servings: string
    serving: string
    callouts?: string[]
    keyIngredients?: { name: string; dose: string; purpose: string }[]
  }
  ingredients?: string
  faqItems?: { q: string; a: string }[]
}> = {
  'kryve-greens-superfood-powder': {
    tagline: 'Your daily foundation. 75+ organic superfoods, adaptogens, and probiotics in a single scoop.',
    bullets: [
      '75+ organic superfoods per serving',
      'Digestive enzymes + probiotics for gut health',
      'Adaptogenic herbs for stress resilience',
      'No artificial flavors, sweeteners, or fillers',
      'Third-party tested for purity and potency',
    ],
    supplement: {
      servings: '30 servings per container',
      serving: '1 scoop (10g) · Mix with 8–10 oz of water or your favorite beverage',
      keyIngredients: [
        { name: 'Organic Spirulina', dose: '2g',     purpose: 'Nutrient-dense algae for energy and antioxidant support*' },
        { name: 'Ashwagandha (KSM-66®)', dose: '300mg', purpose: 'Adaptogenic herb to support stress resilience*' },
        { name: 'Lion\'s Mane Mushroom',  dose: '200mg', purpose: 'Cognitive support and mental clarity*' },
        { name: 'Probiotic Blend',        dose: '5B CFU', purpose: 'Gut health and digestive balance*' },
      ],
    },
    faqItems: [
      { q: 'When should I take KRYVE Greens?', a: 'Take one scoop in the morning — mixed into water, a smoothie, or juice — to start your day with foundational nutrition.' },
      { q: 'Does it taste good?', a: 'We use natural flavors and a touch of organic stevia. Most customers describe it as a mild, earthy-sweet green taste.' },
    ],
  },
  'kryve-hydrolyzed-collagen-peptides': {
    tagline: 'Grass-fed hydrolyzed collagen peptides for skin elasticity, joint comfort, and connective tissue support.',
    bullets: [
      '20g grass-fed, pasture-raised collagen peptides per serving',
      'Types I and III collagen for skin, hair, and nails',
      'Unflavored — mixes into any liquid or food',
      'Sourced from certified grass-fed bovine hide',
      'Third-party tested for heavy metals and purity',
    ],
    supplement: {
      servings: '30 servings',
      serving: '1 scoop (22g)',
      callouts: ['Hydrolyzed Collagen Peptides 20g', 'Type I Collagen', 'Type III Collagen'],
    },
    faqItems: [
      { q: 'What\'s the best way to take it?', a: 'Mix one scoop into coffee, tea, smoothies, soups, or baked goods. It dissolves completely and is tasteless.' },
      { q: 'How long until I see results?', a: 'Most users notice improvements in skin hydration within 4–6 weeks, joint comfort within 8–12 weeks.' },
    ],
  },
  'kryve-magnesium-glycinate': {
    tagline: 'Highly bioavailable magnesium glycinate for deep sleep, muscle recovery, and stress management.',
    bullets: [
      '400mg elemental magnesium glycinate per serving',
      'Glycinate form for maximum absorption and gentleness',
      'Supports deep, restful sleep and relaxation',
      'Reduces muscle cramps and exercise recovery time',
      'Formulated for long-term daily use — no laxative effect',
    ],
    supplement: {
      servings: '60 servings',
      serving: '2 capsules',
      callouts: ['Magnesium Glycinate 400mg elemental', 'Bisgylcinate chelate for absorption'],
    },
    faqItems: [
      { q: 'When should I take KRYVE Magnesium?', a: 'Take 2 capsules 30–60 minutes before bed for optimal sleep support and overnight muscle recovery.' },
      { q: 'Is magnesium glycinate safe for daily use?', a: 'Yes. Glycinate is one of the most well-tolerated forms of magnesium and is safe for long-term daily supplementation.' },
    ],
  },
  'the-kryve-stack': {
    tagline: 'The complete KRYVE daily protocol. Morning Greens, Daytime Collagen, Evening Magnesium. One complete system.',
    bullets: [
      'Includes: KRYVE Greens + Collagen + Magnesium',
      'Save $19.98 vs buying individually',
      'Free shipping included — always',
      'Complete morning-to-evening wellness protocol',
      '90-day supply when used as directed',
    ],
    faqItems: [
      { q: 'Is the Stack a subscription?', a: 'No — the KRYVE Stack is a one-time purchase. Subscribe & Save is optional for 15% off recurring orders.' },
      { q: 'What if I want to try just one product first?', a: 'No problem — all three formulas are available individually. The Stack just offers the best value.' },
    ],
  },
}

const SUPPLEMENT_HANDLES = new Set([
  'kryve-greens-superfood-powder',
  'kryve-hydrolyzed-collagen-peptides',
  'kryve-magnesium-glycinate',
  'the-kryve-stack',
])

export default function ProductPage() {
  const { handle } = useParams<{ handle: string }>()
  const { addItem } = useCart()
  const [product, setProduct] = useState<ShopifyProduct | null>(null)
  const [imgIdx, setImgIdx] = useState(0)
  const [added, setAdded] = useState(false)
  const [purchaseType, setPurchaseType] = useState<'one-time' | 'subscribe'>('one-time')

  useEffect(() => {
    if (!handle) return
    setImgIdx(0)
    const staticMatch = STATIC_PRODUCTS.find(p => p.handle === handle)
    if (staticMatch) {
      setProduct(staticMatch as unknown as ShopifyProduct)
    }
    // Also try live API — will replace static if available
    fetchProductByHandle(handle).then(p => { if (p) setProduct(p) }).catch(() => {})
  }, [handle])

  if (!handle) return <Navigate to="/shop" replace />
  if (!product) return (
    <div className="kv-page" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#666' }}>Loading product...</p>
    </div>
  )

  const detail = PRODUCT_DETAIL[product.handle]
  const isSupplementProduct = SUPPLEMENT_HANDLES.has(product.handle)
  // Build image list — add supplement facts placeholder slot for supplement products
  const baseImages = product.images.edges.map(e => e.node)
  const images = isSupplementProduct
    ? [...baseImages, { url: '__supplement_facts__', altText: 'Supplement Facts' }]
    : baseImages
  const variant = product.variants.edges[0]?.node
  const price = variant?.price.amount || product.priceRange.minVariantPrice.amount
  const compareAt = variant?.compareAtPrice?.amount
  const accent = getProductAccent(product.handle)
  const discountedPrice = (parseFloat(price) * 0.85).toFixed(2)
  const displayPrice = purchaseType === 'subscribe' ? discountedPrice : price

  function handleAddToCart() {
    if (!variant) return
    const item: CartItem = {
      variantId: variant.id,
      productId: product!.id,
      title: product!.title,
      variantTitle: variant.title,
      price: parseFloat(price),
      quantity: 1,
      image: images[0]?.url || '',
      handle: product!.handle,
    }
    addItem(item)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="kv-pdp">
      {/* Breadcrumb */}
      <nav className="kv-pdp-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/shop">Shop</Link>
        <span>/</span>
        <span>{product.title}</span>
      </nav>

      <div className="kv-pdp-layout">
        {/* Images */}
        <div className="kv-pdp-images">
          <div className="kv-pdp-main-img">
            {images[imgIdx]?.url === '__supplement_facts__' ? (
              // Supplement facts placeholder
              <div style={{
                width: '100%', height: '100%', minHeight: 360,
                background: '#F5F1ED', border: '2px dashed #C8BFB4',
                borderRadius: 12, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 12,
              }}>
                <span style={{ fontSize: '2.5rem' }}>📋</span>
                <p style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888' }}>
                  Supplement Facts
                </p>
                <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '0.75rem', color: '#AAA' }}>
                  Label image coming soon
                </p>
              </div>
            ) : (
              <img
                src={images[imgIdx]?.url || ''}
                alt={images[imgIdx]?.altText || product.title}
              />
            )}
          </div>
          {images.length > 1 && (
            <div className="kv-pdp-thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`kv-pdp-thumb${i === imgIdx ? ' active' : ''}`}
                  style={i === imgIdx ? { borderColor: accent } : {}}
                  onClick={() => setImgIdx(i)}
                  aria-label={img.url === '__supplement_facts__' ? 'Supplement Facts' : `View image ${i + 1}`}
                >
                  {img.url === '__supplement_facts__' ? (
                    <div style={{ width: '100%', height: '100%', background: '#F5F1ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📋</div>
                  ) : (
                    <img src={img.url} alt={img.altText || product.title} loading="lazy" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="kv-pdp-info">
          {detail && (
            <span className={`kv-pcard-badge ${getProductBadgeClass(product.handle)}`}>
              {getBadgeText(product.handle)}
            </span>
          )}
          <h1 className="kv-pdp-title">{product.title}</h1>
          {detail?.tagline && <p className="kv-pdp-tagline">{detail.tagline}</p>}

          <div className="kv-pdp-price-row">
            <span className="kv-pdp-price">{formatPrice(displayPrice)}</span>
            {purchaseType === 'subscribe' ? (
              <span className="kv-pdp-compare">{formatPrice(price)}</span>
            ) : compareAt && parseFloat(compareAt) > parseFloat(price) ? (
              <span className="kv-pdp-compare">{formatPrice(compareAt)}</span>
            ) : null}
          </div>

          {detail?.bullets && (
            <ul className="kv-pdp-bullets">
              {detail.bullets.map(b => (
                <li key={b}><span style={{ color: accent }}>✓</span> {b}</li>
              ))}
            </ul>
          )}

          {/* Subscribe & Save toggle */}
          <div style={{ margin: '18px 0', border: '1px solid #E5E0D8', borderRadius: 10, overflow: 'hidden' }}>
            <label
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', cursor: 'pointer', gap: 12,
                background: purchaseType === 'one-time' ? '#fff' : 'transparent',
                borderBottom: '1px solid #E5E0D8',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="radio" name="purchase-type" value="one-time"
                  checked={purchaseType === 'one-time'}
                  onChange={() => setPurchaseType('one-time')}
                  style={{ accentColor: accent, width: 16, height: 16, flexShrink: 0 }}
                />
                <span style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 600, fontSize: '0.85rem' }}>
                  One-time purchase
                </span>
              </div>
              <span style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '0.9rem' }}>
                {formatPrice(price)}
              </span>
            </label>
            <label
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', cursor: 'pointer', gap: 12,
                background: purchaseType === 'subscribe' ? '#F0FDF4' : 'transparent',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="radio" name="purchase-type" value="subscribe"
                  checked={purchaseType === 'subscribe'}
                  onChange={() => setPurchaseType('subscribe')}
                  style={{ accentColor: accent, width: 16, height: 16, flexShrink: 0 }}
                />
                <div>
                  <span style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 600, fontSize: '0.85rem' }}>
                    Subscribe &amp; Save 15%
                  </span>
                  <span style={{ display: 'block', fontFamily: 'Montserrat,sans-serif', fontSize: '0.72rem', color: '#16A34A', fontWeight: 600 }}>
                    Delivered monthly · Cancel anytime
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#16A34A' }}>
                  {formatPrice(discountedPrice)}
                </span>
                <span style={{ display: 'block', fontFamily: 'Montserrat,sans-serif', fontSize: '0.7rem', color: '#AAA', textDecoration: 'line-through' }}>
                  {formatPrice(price)}
                </span>
              </div>
            </label>
          </div>

          <button
            className="kv-pdp-atc"
            style={added ? { backgroundColor: accent, color: '#000' } : {}}
            onClick={handleAddToCart}
          >
            {added ? '✓ ADDED TO CART' : purchaseType === 'subscribe' ? 'SUBSCRIBE & SAVE 15%' : 'ADD TO CART'}
          </button>

          <p className="kv-pdp-guarantee">🔒 30-Day Money-Back Guarantee · Free shipping $75+</p>

          {/* Supplement section */}
          {detail?.supplement && (
            <div className="kv-pdp-supplement">
              <p className="kv-pdp-supplement-meta">{detail.supplement.servings} · {detail.supplement.serving}</p>

              {/* Key Ingredients table (structured) */}
              {detail.supplement.keyIngredients ? (
                <div style={{ marginTop: 14 }}>
                  <p style={{
                    fontFamily: 'Montserrat,sans-serif', fontWeight: 700,
                    fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: '#888', marginBottom: 8,
                  }}>
                    Key Ingredients
                  </p>
                  <table style={{
                    width: '100%', borderCollapse: 'collapse',
                    fontFamily: 'Montserrat,sans-serif', fontSize: '0.8rem',
                    border: '1px solid #E5E0D8', borderRadius: 8, overflow: 'hidden',
                  }}>
                    <thead>
                      <tr style={{ background: '#F5F1ED' }}>
                        <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#555', borderBottom: '1px solid #E5E0D8' }}>Ingredient</th>
                        <th style={{ textAlign: 'left', padding: '8px 10px', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#555', borderBottom: '1px solid #E5E0D8', whiteSpace: 'nowrap' }}>Dose</th>
                        <th style={{ textAlign: 'left', padding: '8px 10px', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#555', borderBottom: '1px solid #E5E0D8' }}>Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.supplement.keyIngredients.map((ing, i) => (
                        <tr key={ing.name} style={{ background: i % 2 === 0 ? '#fff' : '#FAF8F5' }}>
                          <td style={{ padding: '9px 12px', fontWeight: 600, color: '#1A1A1A', borderBottom: '1px solid #F0EBE3', verticalAlign: 'top' }}>{ing.name}</td>
                          <td style={{ padding: '9px 10px', color: '#555', borderBottom: '1px solid #F0EBE3', whiteSpace: 'nowrap', verticalAlign: 'top' }}>{ing.dose}</td>
                          <td style={{ padding: '9px 10px', color: '#666', borderBottom: '1px solid #F0EBE3', lineHeight: 1.45, verticalAlign: 'top' }}>{ing.purpose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p style={{
                    fontFamily: 'Montserrat,sans-serif', fontSize: '0.68rem',
                    color: '#AAA', marginTop: 8, lineHeight: 1.5,
                  }}>
                    *These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.
                  </p>
                </div>
              ) : detail.supplement.callouts ? (
                /* Legacy floating tags for other products */
                <div className="kv-pdp-callouts">
                  {detail.supplement.callouts.map(c => (
                    <div key={c} className="kv-pdp-callout" style={{ borderColor: accent + '44' }}>
                      {c}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* FAQ section */}
      {detail?.faqItems && (
        <div className="kv-pdp-faq">
          <h2>Common Questions</h2>
          {detail.faqItems.map(faq => (
            <details key={faq.q} className="kv-pdp-faq-item">
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      )}

      {/* Related products */}
      <div className="kv-pdp-related">
        <h2>You May Also Like</h2>
        <div className="kv-pdp-related-grid">
          {(STATIC_PRODUCTS as unknown as ShopifyProduct[])
            .filter(p => p.handle !== product.handle)
            .slice(0, 3)
            .map(p => (
              <Link key={p.id} to={`/products/${p.handle}`} className="kv-pdp-related-card">
                <img src={p.images.edges[0]?.node.url} alt={p.title} loading="lazy" />
                <p className="kv-pdp-related-title">{p.title}</p>
                <p className="kv-pdp-related-price">{formatPrice(p.priceRange.minVariantPrice.amount)}</p>
              </Link>
            ))}
        </div>
      </div>

      {/* FDA */}
      <div className="kv-fda" style={{ marginTop: 0 }}>
        <p>*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.</p>
      </div>
    </div>
  )
}
