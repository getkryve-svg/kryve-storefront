const STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN
const API_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN
const API_URL = `https://${STORE_DOMAIN}/api/2024-01/graphql.json`

const isConfigured = STORE_DOMAIN && STORE_DOMAIN !== 'your-store.myshopify.com' && API_TOKEN && API_TOKEN !== 'your-token-here'

async function shopifyFetch(query: string, variables?: Record<string, unknown>) {
  if (!isConfigured) throw new Error('Shopify not configured')

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': API_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`)
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0].message)
  return json.data
}

const PRODUCTS_QUERY = `
  query Products($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          tags
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          images(first: 2) {
            edges { node { url altText } }
          }
          variants(first: 20) {
            edges {
              node {
                id
                title
                availableForSale
                price { amount currencyCode }
                selectedOptions { name value }
              }
            }
          }
        }
      }
    }
  }
`

export async function fetchProducts() {
  const data = await shopifyFetch(PRODUCTS_QUERY, { first: 50 })
  return data.products.edges.map((e: { node: unknown }) => e.node)
}

const CREATE_CART_MUTATION = `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`

export async function createCheckout(items: { merchandiseId: string; quantity: number }[]) {
  const data = await shopifyFetch(CREATE_CART_MUTATION, { lines: items })
  const { cart, userErrors } = data.cartCreate
  if (userErrors.length) throw new Error(userErrors[0].message)
  return cart.checkoutUrl as string
}

export { isConfigured }
