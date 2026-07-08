// KRYVE Storefront API client — read-only (products + cart/checkout only)
// Zero write operations to Shopify Admin API.

const STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'kryve-2.myshopify.com'
// Public Storefront API token (Headless channel "Kryve Headless") — public by design, safe client-side
const API_TOKEN    = import.meta.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN || '35967892ecc81f9435316e842465eef8'
const API_URL      = `https://${STORE_DOMAIN}/api/2024-01/graphql.json`

export const isConfigured =
  !!API_TOKEN && API_TOKEN !== 'your-storefront-token-here'

// ── Canonical product handles ──────────────────────────────────────────────
export const PRODUCT_HANDLES = {
  greens:    'kryve-greens-superfood-powder',
  collagen:  'kryve-hydrolyzed-collagen-peptides',
  magnesium: 'kryve-magnesium-glycinate',
  stack:     'the-kryve-stack',
} as const

// ── Fallback static data — exact match to live kryve-2.myshopify.com ──────
export const STATIC_PRODUCTS = [
  {
    id: 'gid://shopify/Product/9473700036867',
    handle: 'kryve-greens-superfood-powder',
    title: 'KRYVE Greens Superfood Powder',
    description: '40+ whole-food ingredients. Energy, immunity & gut health.*',
    tags: ['greens', 'superfood', 'energy', 'immune-support'],
    priceRange: { minVariantPrice: { amount: '49.99', currencyCode: 'USD' } },
    compareAtPriceRange: { maxVariantPrice: { amount: '64.99', currencyCode: 'USD' } },
    images: { edges: [
      { node: { url: '/images/product-greens-themed.png', altText: 'KRYVE Greens Superfood Powder' } },
      { node: { url: 'https://cdn.shopify.com/s/files/1/0824/2108/8515/files/product-greens-hover-Lj85wqwdkdZHkj4istPPyn.webp', altText: 'KRYVE Greens lifestyle' } },
    ]},
    variants: { edges: [{ node: { id: 'gid://shopify/ProductVariant/48355256336643', title: 'Default Title', availableForSale: true, price: { amount: '49.99', currencyCode: 'USD' }, compareAtPrice: { amount: '64.99', currencyCode: 'USD' } } }] },
  },
  {
    id: 'gid://shopify/Product/9473700331779',
    handle: 'kryve-hydrolyzed-collagen-peptides',
    title: 'KRYVE Hydrolyzed Collagen Peptides',
    description: 'Grass-fed Type I & III. Skin, joint & recovery support.*',
    tags: ['collagen', 'grass-fed', 'skin', 'hair', 'joints'],
    priceRange: { minVariantPrice: { amount: '54.99', currencyCode: 'USD' } },
    compareAtPriceRange: { maxVariantPrice: { amount: '59.99', currencyCode: 'USD' } },
    images: { edges: [
      { node: { url: '/images/product-collagen-themed.png', altText: 'KRYVE Hydrolyzed Collagen Peptides' } },
      { node: { url: 'https://cdn.shopify.com/s/files/1/0824/2108/8515/files/lifestyle-collagen-v3-kTUV8zu9u3UFBdzmhguU7N.png', altText: 'KRYVE Collagen lifestyle' } },
    ]},
    variants: { edges: [{ node: { id: 'gid://shopify/ProductVariant/48355257483523', title: 'Default Title', availableForSale: true, price: { amount: '54.99', currencyCode: 'USD' }, compareAtPrice: { amount: '59.99', currencyCode: 'USD' } } }] },
  },
  {
    id: 'gid://shopify/Product/9473700626691',
    handle: 'kryve-magnesium-glycinate',
    title: 'KRYVE Magnesium Glycinate',
    description: 'Ultra-absorbable glycinate form. Sleep, stress & muscle recovery.*',
    tags: ['magnesium', 'glycinate', 'sleep', 'recovery', 'stress-relief'],
    priceRange: { minVariantPrice: { amount: '39.99', currencyCode: 'USD' } },
    compareAtPriceRange: { maxVariantPrice: { amount: '54.99', currencyCode: 'USD' } },
    images: { edges: [
      { node: { url: '/images/product-magnesium-real-studio.png', altText: 'KRYVE Magnesium Glycinate' } },
      { node: { url: 'https://cdn.shopify.com/s/files/1/0824/2108/8515/files/product-magnesium-hover-7Z3S9KuA7Dspk5wRSTC4vx.webp', altText: 'KRYVE Magnesium lifestyle' } },
    ]},
    variants: { edges: [{ node: { id: 'gid://shopify/ProductVariant/48355258401027', title: 'Default Title', availableForSale: true, price: { amount: '39.99', currencyCode: 'USD' }, compareAtPrice: { amount: '54.99', currencyCode: 'USD' } } }] },
  },
  {
    id: 'gid://shopify/Product/9473813119235',
    handle: 'the-kryve-stack',
    title: 'The KRYVE Stack',
    description: 'All 3 formulas. One daily ritual. Free shipping included.',
    tags: ['bundle', 'stack', 'best-seller'],
    priceRange: { minVariantPrice: { amount: '129.99', currencyCode: 'USD' } },
    compareAtPriceRange: { maxVariantPrice: { amount: '149.97', currencyCode: 'USD' } },
    images: { edges: [
      { node: { url: 'https://cdn.shopify.com/s/files/1/0824/2108/8515/files/product-stack-card-v2-5M7HZWrzS5KvdiNgzRMQUZ.webp', altText: 'The KRYVE Stack' } },
      { node: { url: 'https://cdn.shopify.com/s/files/1/0824/2108/8515/files/product-stack-hover-YbBDgUg3Pzq5MZGe66BgGM.webp', altText: 'The KRYVE Stack lifestyle' } },
    ]},
    variants: { edges: [{ node: { id: 'gid://shopify/ProductVariant/48355649421571', title: 'Default Title', availableForSale: true, price: { amount: '129.99', currencyCode: 'USD' }, compareAtPrice: { amount: '149.97', currencyCode: 'USD' } } }] },
  },
]

// ── GraphQL fetch ──────────────────────────────────────────────────────────
async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!isConfigured) throw new Error('KRYVE: Shopify Storefront API not configured — add VITE_SHOPIFY_STOREFRONT_API_TOKEN to .env.local')

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': API_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) throw new Error(`Shopify Storefront API error: ${res.status}`)
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0].message)
  return json.data as T
}

// ── Types ──────────────────────────────────────────────────────────────────
export interface ShopifyProduct {
  id: string
  handle: string
  title: string
  description: string
  tags: string[]
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } }
  compareAtPriceRange?: { maxVariantPrice: { amount: string; currencyCode: string } }
  images: { edges: Array<{ node: { url: string; altText: string | null } }> }
  variants: { edges: Array<{ node: { id: string; title: string; availableForSale: boolean; price: { amount: string; currencyCode: string }; compareAtPrice?: { amount: string; currencyCode: string } | null } }> }
  sellingPlanGroups?: { edges: Array<{ node: { name: string; sellingPlans: { edges: Array<{ node: { id: string; name: string; priceAdjustments: Array<{ adjustmentValue: { adjustmentPercentage?: number } }> } }> } } }> }
}

// ── Queries ────────────────────────────────────────────────────────────────
const PRODUCTS_QUERY = `
  query KryveProducts($first: Int!, $query: String) {
    products(first: $first, query: $query, sortKey: TITLE) {
      edges {
        node {
          id handle title description tags
          priceRange { minVariantPrice { amount currencyCode } }
          compareAtPriceRange { maxVariantPrice { amount currencyCode } }
          images(first: 3) { edges { node { url altText } } }
          variants(first: 5) {
            edges { node {
              id title availableForSale
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
            }}
          }
        }
      }
    }
  }
`

const PRODUCT_BY_HANDLE_QUERY = `
  query KryveProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id handle title description tags
      sellingPlanGroups(first: 2) {
        edges { node { name sellingPlans(first: 5) { edges { node {
          id name
          priceAdjustments { adjustmentValue { ... on SellingPlanPercentagePriceAdjustment { adjustmentPercentage } } }
        }}}}}
      }
      priceRange { minVariantPrice { amount currencyCode } }
      compareAtPriceRange { maxVariantPrice { amount currencyCode } }
      images(first: 5) { edges { node { url altText } } }
      variants(first: 10) {
        edges { node {
          id title availableForSale
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
        }}
      }
    }
  }
`

// ── Read-only API functions ────────────────────────────────────────────────
export async function fetchProducts(): Promise<ShopifyProduct[]> {
  if (!isConfigured) return STATIC_PRODUCTS as unknown as ShopifyProduct[]
  const data = await shopifyFetch<{ products: { edges: Array<{ node: ShopifyProduct }> } }>(
    PRODUCTS_QUERY,
    { first: 10, query: 'tag:kryve' }
  )
  return data.products.edges.map(e => e.node)
}

export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  if (!isConfigured) {
    return STATIC_PRODUCTS.find(p => p.handle === handle) as unknown as ShopifyProduct || null
  }
  const data = await shopifyFetch<{ productByHandle: ShopifyProduct | null }>(
    PRODUCT_BY_HANDLE_QUERY,
    { handle }
  )
  return data.productByHandle
}

// ── Cart / Checkout (write to Shopify cart, read-only to Admin) ───────────
const CREATE_CART_MUTATION = `
  mutation KryveCartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { id checkoutUrl totalQuantity cost { totalAmount { amount currencyCode } } }
      userErrors { field message }
    }
  }
`

export async function createCheckout(
  items: { merchandiseId: string; quantity: number; sellingPlanId?: string }[]
): Promise<string> {
  if (!isConfigured) throw new Error('Configure VITE_SHOPIFY_STOREFRONT_API_TOKEN to enable checkout')
  const data = await shopifyFetch<{ cartCreate: { cart: { checkoutUrl: string }; userErrors: Array<{ message: string }> } }>(
    CREATE_CART_MUTATION,
    { lines: items }
  )
  const { cart, userErrors } = data.cartCreate
  if (userErrors.length) throw new Error(userErrors[0].message)
  return cart.checkoutUrl
}

// ── Helpers ────────────────────────────────────────────────────────────────
export function formatPrice(amount: string, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(parseFloat(amount))
}

export function getProductAccent(handle: string): string {
  if (handle.includes('greens'))    return '#39FF14'
  if (handle.includes('collagen'))  return '#B76E79'
  if (handle.includes('magnesium')) return '#7C3AED'
  if (handle.includes('stack'))     return '#D4AF37'
  return '#39FF14'
}

export function getProductCardClass(handle: string): string {
  if (handle.includes('greens'))    return 'kv-pcard-greens'
  if (handle.includes('collagen'))  return 'kv-pcard-collagen'
  if (handle.includes('magnesium')) return 'kv-pcard-magnesium'
  return 'kv-pcard-stack'
}

export function getProductBadgeClass(handle: string): string {
  if (handle.includes('greens'))    return 'badge-greens'
  if (handle.includes('collagen'))  return 'badge-collagen'
  if (handle.includes('magnesium')) return 'badge-magnesium'
  return 'badge-stack'
}

export function getProductCtaClass(handle: string): string {
  if (handle.includes('greens'))    return 'cta-greens'
  if (handle.includes('collagen'))  return 'cta-collagen'
  if (handle.includes('magnesium')) return 'cta-magnesium'
  return 'cta-stack'
}

export function getBadgeText(handle: string): string {
  if (handle.includes('greens'))    return 'BEST SELLER'
  if (handle.includes('collagen'))  return 'GRASS-FED'
  if (handle.includes('magnesium')) return 'HIGH ABSORPTION'
  return 'SAVE $19.98'
}
