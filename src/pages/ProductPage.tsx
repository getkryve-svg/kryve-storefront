import { useState, useEffect, useRef } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { trackViewContent } from '../components/Analytics'
import { useCart } from '../context/CartContext'
import {
  STATIC_PRODUCTS, fetchProductByHandle, formatPrice,
  getProductAccent, getBadgeText, getProductBadgeClass,
  type ShopifyProduct
} from '../lib/shopify'
import type { CartItem } from '../types'


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
    // Copy verified line-by-line against the supplier spec (Supliful JTP0GREE).
    // Every ingredient and claim below appears on the actual label. Do not add
    // ingredient counts, doses, or certifications that the supplier does not state.
    tagline: 'Your daily foundation. 21+ whole-food ingredients in one scoop, with adaptogens and prebiotic fiber.',
    bullets: [
      '21+ whole-food ingredients in one scoop',
      'Prebiotic inulin to support healthy gut flora',
      'Ashwagandha + Panax ginseng for stress resilience',
      'Antioxidant fruits — acai, blueberry, pomegranate, cranberry',
      'Non-GMO, vegan-friendly, made in the USA',
    ],
    supplement: {
      servings: '30 servings per container · 4.44oz (126g)',
      serving: '1 scoop · Mix with 6–8 oz of cold water or your favorite beverage, once daily',
      keyIngredients: [
        { name: 'Barley Grass, Wheat Grass & Spirulina', dose: 'Included', purpose: 'Chlorophyll-rich greens for foundational vitamins and minerals*' },
        { name: 'Ashwagandha & Panax Ginseng (root)',    dose: 'Included', purpose: 'Adaptogens traditionally used to support stress response and vitality*' },
        { name: 'Acai, Blueberry, Pomegranate & Cranberry', dose: 'Included', purpose: 'Antioxidant fruits to help combat oxidative stress*' },
        { name: 'Inulin (prebiotic fiber)',              dose: 'Included', purpose: 'Prebiotic fiber to support healthy gut flora and digestion*' },
        { name: 'Turmeric & Black Pepper Extract',       dose: 'Included', purpose: 'Traditional botanicals; black pepper supports absorption*' },
      ],
    },
    faqItems: [
      { q: 'When should I take KRYVE Greens?', a: 'Take one scoop in the morning — mixed into water, a smoothie, or juice — to start your day with foundational nutrition. Consume within 10 minutes of mixing.' },
      { q: 'What does it taste like?', a: 'It is unsweetened and unflavored, so it tastes green and earthy — barley grass, wheatgrass and spirulina lead, with a little tartness from the berries. Most people prefer it in juice or a smoothie rather than plain water.' },
    ],
  },
  'kryve-hydrolyzed-collagen-peptides': {
    // Verified against the supplier spec (Supliful RLC8COLL). Single-ingredient
    // formula: bovine hide collagen peptides. No vitamin C, no disclosed gram
    // dose, no third-party testing claim. Do not reintroduce any of those.
    tagline: 'Grass-fed hydrolyzed collagen peptides — a single clean ingredient for skin, hair, nails, and joints.',
    bullets: [
      'Hydrolyzed collagen peptides from grass-fed bovine hide',
      'Types I and III collagen — the types in skin, hair, and connective tissue*',
      'One ingredient only — no additives, no flavoring',
      'Unflavored — mixes into any chilled beverage',
      'Gluten-free, lactose-free, corn-free · Made in the USA',
    ],
    supplement: {
      servings: '28 servings per container · 9.88oz (280g)',
      serving: '1 level scoop · Mix into 8–10 oz of chilled water or your preferred beverage',
      keyIngredients: [
        { name: 'Bovine Hide Collagen Peptides', dose: 'Single ingredient', purpose: 'Hydrolyzed for easier absorption; rich in glycine, proline, hydroxyproline and alanine*' },
        { name: 'Type I & III Collagen',         dose: 'Included',          purpose: 'The collagen types found in skin, hair, nails, muscles and bones*' },
      ],
    },
    faqItems: [
      { q: 'What\'s the best way to take it?', a: 'Add one level scoop to 8–10 oz of chilled water or your preferred beverage in a shaker cup and mix for about five seconds. It is unflavored, so it also stirs into coffee, smoothies or food.' },
      { q: 'What is actually in it?', a: 'One ingredient: grass-fed bovine hide collagen peptides. No sweeteners, no flavoring, no fillers.' },
    ],
  },
  'kryve-magnesium-glycinate': {
    // Verified against the supplier spec (Supliful VOX4MGNE): 275mg elemental
    // magnesium from 2,500mg magnesium glycinate, 3 capsules per serving,
    // 90 capsules per bottle = 30 servings. Do not restore 400mg / 2 caps / 120.
    tagline: 'One of the most bioavailable forms of magnesium — for relaxation, muscle support, and healthy sleep.*',
    bullets: [
      '275mg elemental magnesium from 2,500mg magnesium glycinate',
      'Glycinate — a gentle, well-tolerated form',
      'Supports muscle relaxation and the nervous system*',
      'Supports healthy sleep patterns*',
      'Gluten-free, non-GMO, vegan-friendly · Made in the USA',
    ],
    supplement: {
      servings: '30 servings per container · 90 capsules',
      serving: '3 capsules once daily, or as directed by your healthcare professional',
      keyIngredients: [
        { name: 'Magnesium (from 2,500mg Magnesium Glycinate)', dose: '275mg elemental', purpose: 'A highly bioavailable form supporting nerve function, muscle health and energy production*' },
      ],
    },
    faqItems: [
      { q: 'When should I take KRYVE Magnesium?', a: 'Take 3 capsules once daily. Many people prefer the evening, since magnesium supports muscle relaxation and healthy sleep patterns.*' },
      { q: 'Why glycinate?', a: 'Glycinate is one of the most bioavailable and well-tolerated forms of magnesium, which is why we chose it for daily use.' },
    ],
  },
  'the-kryve-stack': {
    tagline: 'The complete KRYVE daily protocol. Morning Greens, Daytime Collagen, Evening Magnesium. One complete system.',
    bullets: [
      'Includes: KRYVE Greens + Collagen + Magnesium',
      'Save $19.98 vs buying individually',
      'Free shipping included — always',
      'Complete morning-to-evening wellness protocol',
      'About a 30-day supply of each formula',
    ],
    faqItems: [
      { q: 'Is the Stack a subscription?', a: 'No — the KRYVE Stack is a one-time purchase. Subscribe & Save is optional for 15% off recurring orders.' },
      { q: 'What if I want to try just one product first?', a: 'No problem — all three formulas are available individually. The Stack just offers the best value.' },
    ],
  },
}

export default function ProductPage() {
  const { handle } = useParams<{ handle: string }>()
  const { addItem } = useCart()
  const [product, setProduct] = useState<ShopifyProduct | null>(null)
  const [imgIdx, setImgIdx] = useState(0)
  const [added, setAdded] = useState(false)
  const [purchaseType, setPurchaseType] = useState<'one-time' | 'subscribe'>('subscribe')

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

  // Meta ViewContent / GA4 view_item — fires once per product, after the live
  // product resolves so the variant id (what the Meta catalog matches on) is real.
  const viewedRef = useRef<string | null>(null)
  useEffect(() => {
    if (!product) return
    if (viewedRef.current === product.id) return
    viewedRef.current = product.id
    const v = product.variants?.edges?.[0]?.node
    trackViewContent({
      id: product.id,
      variantId: v?.id,
      title: product.title,
      price: parseFloat(v?.price?.amount || product.priceRange.minVariantPrice.amount || '0'),
      drop: product.handle,
    })
  }, [product])

  if (!handle) return <Navigate to="/shop" replace />
  if (!product) return (
    <div className="kv-page" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#666' }}>Loading product...</p>
    </div>
  )

  const detail = PRODUCT_DETAIL[product.handle]
  // Gallery renders only the real product images that exist
  const images = product.images.edges.map(e => e.node)
  const variant = product.variants.edges[0]?.node
  const price = variant?.price.amount || product.priceRange.minVariantPrice.amount
  const compareAt = variant?.compareAtPrice?.amount
  const accent = getProductAccent(product.handle)
  // Real selling plan from Shopify (The Ritual Membership) — first monthly plan
  const sellingPlan = product.sellingPlanGroups?.edges?.[0]?.node?.sellingPlans?.edges?.[0]?.node
  const sellingPlanId = sellingPlan?.id
  // Derive the effective option WITHOUT a hook (avoids rules-of-hooks crash after early returns):
  // if a product has no subscription plan, treat the default 'subscribe' as one-time.
  const effectiveType: 'one-time' | 'subscribe' = (purchaseType === 'subscribe' && !sellingPlanId) ? 'one-time' : purchaseType
  const subPct = sellingPlan?.priceAdjustments?.[0]?.adjustmentValue?.adjustmentPercentage ?? 15
  const discountedPrice = (parseFloat(price) * (1 - subPct / 100)).toFixed(2)
  const displayPrice = effectiveType === 'subscribe' ? discountedPrice : price

  function handleAddToCart() {
    if (!variant) return
    const item: CartItem = {
      variantId: variant.id,
      productId: product!.id,
      title: product!.title,
      variantTitle: variant.title,
      price: parseFloat(price),
      ...(compareAt && parseFloat(compareAt) > parseFloat(price)
        ? { compareAt: parseFloat(compareAt) }
        : {}),
      quantity: 1,
      image: images[0]?.url || '',
      handle: product!.handle,
      ...(effectiveType === 'subscribe' && sellingPlanId
        ? { sellingPlanId, subscriptionLabel: `Ritual Membership — ${subPct}% off`, price: parseFloat(discountedPrice) }
        : {}),
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
            <img
              src={images[imgIdx]?.url || ''}
              alt={images[imgIdx]?.altText || product.title}
            />
          </div>
          {images.length > 1 && (
            <div className="kv-pdp-thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`kv-pdp-thumb${i === imgIdx ? ' active' : ''}`}
                  style={i === imgIdx ? { borderColor: accent } : {}}
                  onClick={() => setImgIdx(i)}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img.url} alt={img.altText || product.title} loading="lazy" />
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
            {effectiveType === 'subscribe' ? (
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

          {/* Purchase options — subscription-first (AG1/IM8 pattern): Subscribe leads with a BEST VALUE badge, one-time below */}
          <div style={{ margin: '18px 0', border: '1px solid #222', borderRadius: 10, overflow: 'hidden', background: '#111' }}>
            {/* Subscribe & Save — DEFAULT hero option */}
            {!!sellingPlanId && (
            <label
              style={{
                position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                // top padding leaves headroom for the "Best Value" badge, which sits
                // INSIDE the card — the wrapper has overflow:hidden for its rounded
                // corners, so anything overhanging the top edge gets clipped off.
                padding: '30px 16px 14px', cursor: 'pointer', gap: 12,
                background: effectiveType === 'subscribe' ? accent + '22' : 'transparent',
                boxShadow: effectiveType === 'subscribe' ? `inset 0 0 0 2px ${accent}` : 'none',
                borderBottom: '1px solid #222',
              }}
            >
              <span style={{
                position: 'absolute', top: 8, right: 14,
                background: accent, color: '#0A0A0A', fontFamily: 'Montserrat,sans-serif',
                fontWeight: 800, fontSize: '0.58rem', letterSpacing: '0.08em',
                padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase',
              }}>Best Value · Most Popular</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="radio" name="purchase-type" value="subscribe"
                  checked={effectiveType === 'subscribe'}
                  onChange={() => setPurchaseType('subscribe')}
                  style={{ accentColor: accent, width: 16, height: 16, flexShrink: 0 }}
                />
                <div>
                  <span style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                    Subscribe &amp; Save 15%
                  </span>
                  <span style={{ display: 'block', fontFamily: 'Montserrat,sans-serif', fontSize: '0.72rem', color: '#22C55E', fontWeight: 600 }}>
                    Free shipping · 60-day guarantee
                  </span>
                  <span style={{ display: 'block', fontFamily: 'Montserrat,sans-serif', fontSize: '0.68rem', color: '#999', marginTop: 2 }}>
                    Auto-renews every month at {formatPrice(discountedPrice)}. Skip, pause, or cancel anytime — no fees.
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, fontSize: '1rem', color: '#22C55E' }}>
                  {formatPrice(discountedPrice)}
                </span>
                <span style={{ display: 'block', fontFamily: 'Montserrat,sans-serif', fontSize: '0.7rem', color: '#777', textDecoration: 'line-through' }}>
                  {formatPrice(price)}
                </span>
              </div>
            </label>
            )}
            {/* One-time purchase — secondary */}
            <label
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', cursor: 'pointer', gap: 12,
                background: effectiveType === 'one-time' ? accent + '22' : 'transparent',
                boxShadow: effectiveType === 'one-time' ? `inset 0 0 0 1.5px ${accent}` : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="radio" name="purchase-type" value="one-time"
                  checked={effectiveType === 'one-time'}
                  onChange={() => setPurchaseType('one-time')}
                  style={{ accentColor: accent, width: 16, height: 16, flexShrink: 0 }}
                />
                <span style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 600, fontSize: '0.85rem', color: '#bbb' }}>
                  One-time purchase
                </span>
              </div>
              <span style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#bbb' }}>
                {formatPrice(price)}
              </span>
            </label>
          </div>

          <button
            className="kv-pdp-atc"
            style={added ? { backgroundColor: accent, color: '#000' } : {}}
            onClick={handleAddToCart}
          >
            {added ? '✓ ADDED TO CART' : effectiveType === 'subscribe' ? 'SUBSCRIBE & SAVE 15%' : 'ADD TO CART'}
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
