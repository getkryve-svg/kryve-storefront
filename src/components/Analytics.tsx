/**
 * Analytics — Meta Pixel + Google Analytics 4
 *
 * Set in .env.local:
 *   VITE_META_PIXEL_ID=your_pixel_id
 *   VITE_GA4_ID=G-XXXXXXXXXX
 */
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import type { CartItem, Order } from '../types'

// Kryve Meta Pixel — created 2026-07-07 in Events Manager (ad account 1844377862783580)
const PIXEL_ID = (import.meta.env.VITE_META_PIXEL_ID as string | undefined) || '2633405263720752'
const GA4_ID   = import.meta.env.VITE_GA4_ID   as string | undefined

// ── Type helpers ──────────────────────────────────────────────────────────────

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: unknown
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

// ── Pixel loader ─────────────────────────────────────────────────────────────

/**
 * Meta Pixel base code — this MUST stay byte-faithful to Meta's official snippet.
 *
 * History: a hand-rolled version of this stub queued calls onto `fbq.q`, but
 * fbevents.js drains `fbq.queue`, and the stub never wired up `callMethod`.
 * Result: fbevents.js loaded successfully, every init/track call went into an
 * array nothing ever read, and not one request to facebook.com/tr was ever
 * sent. The pixel read "Not active" in Events Manager because it had genuinely
 * never received an event. Do not "simplify" this function.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
function loadPixel(id: string) {
  const f = window as any
  if (f.fbq) { f.fbq('init', id); return }

  const n: any = function (...args: unknown[]) {
    n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args)
  }
  f.fbq = n
  if (!f._fbq) f._fbq = n
  n.push = n
  n.loaded = true
  n.version = '2.0'
  n.queue = []          // ← fbevents.js drains THIS. Not `.q`.

  const t = document.createElement('script')
  t.async = true
  t.src = 'https://connect.facebook.net/en_US/fbevents.js'
  const s = document.getElementsByTagName('script')[0]
  s?.parentNode?.insertBefore(t, s) ?? document.head.appendChild(t)

  f.fbq('init', id)
  // NOTE: no 'track PageView' here on purpose. The route effect below fires
  // PageView on mount and on every SPA navigation; firing it here too would
  // double-count the landing page.
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ── GA4 loader ────────────────────────────────────────────────────────────────

function loadGA4(id: string) {
  if (document.querySelector(`script[src*="${id}"]`)) return
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  document.head.appendChild(s)
  window.dataLayer = window.dataLayer || []
  window.gtag = function (...args) { window.dataLayer!.push(args) }
  window.gtag('js', new Date())
  window.gtag('config', id, { send_page_view: false })
}

// ── Public helpers (call from anywhere) ──────────────────────────────────────

export function trackPageView(path: string) {
  window.fbq?.('track', 'PageView')
  window.gtag?.('event', 'page_view', { page_path: path })
}

/**
 * Meta catalog matching.
 *
 * Shopify IDs arrive as GIDs — "gid://shopify/ProductVariant/44123456789".
 * The Meta catalog feed NEVER contains that string, so sending it produces a 0%
 * catalog match rate and "Product views: Missing" in Commerce Manager.
 *
 * The Shopify → Meta feed uses one of two retailer_id formats depending on how
 * the catalog was created:
 *   a) the bare numeric variant id            → "44123456789"
 *   b) the sales-channel format               → "shopify_US_<productId>_<variantId>"
 * We send both. Meta matches on whichever exists in the catalog and ignores the
 * other, so this works without knowing which format the catalog used.
 * Once confirmed in Commerce Manager → Catalog → Items, drop the unused one.
 */
function numericId(gid: string): string {
  return gid?.includes('/') ? gid.split('/').pop()! : gid
}

export function catalogIds(productGid: string, variantGid?: string): string[] {
  const p = numericId(productGid)
  const v = variantGid ? numericId(variantGid) : ''
  const ids = v ? [v, `shopify_US_${p}_${v}`] : [p]
  return ids.filter(Boolean)
}

export function trackViewContent(product: { id: string; title: string; price: number; drop: string; variantId?: string }) {
  window.fbq?.('track', 'ViewContent', {
    content_ids: catalogIds(product.id, product.variantId),
    content_name: product.title,
    content_type: 'product',
    value: product.price,
    currency: 'USD',
  })
  window.gtag?.('event', 'view_item', {
    currency: 'USD',
    value: product.price,
    items: [{ item_id: product.id, item_name: product.title, item_category: product.drop, price: product.price }],
  })
}

export function trackAddToCart(item: CartItem) {
  window.fbq?.('track', 'AddToCart', {
    content_ids: catalogIds(item.productId, item.variantId),
    contents: [{ id: catalogIds(item.productId, item.variantId)[0], quantity: item.quantity }],
    content_name: item.title,
    content_type: 'product',
    value: item.price * item.quantity,
    currency: 'USD',
  })
  window.gtag?.('event', 'add_to_cart', {
    currency: 'USD',
    value: item.price,
    items: [{ item_id: item.productId, item_name: item.title, price: item.price, quantity: item.quantity }],
  })
}

export function trackInitiateCheckout(subtotal: number, itemCount: number, items: CartItem[] = []) {
  window.fbq?.('track', 'InitiateCheckout', {
    value: subtotal,
    currency: 'USD',
    num_items: itemCount,
    content_type: 'product',
    content_ids: items.flatMap(i => catalogIds(i.productId, i.variantId)),
    contents: items.map(i => ({ id: catalogIds(i.productId, i.variantId)[0], quantity: i.quantity })),
  })
  window.gtag?.('event', 'begin_checkout', { currency: 'USD', value: subtotal })
}

export function trackPurchase(order: Order) {
  window.fbq?.('track', 'Purchase', { value: order.total, currency: 'USD', order_id: order.id })
  window.gtag?.('event', 'purchase', {
    transaction_id: order.id,
    value: order.total,
    currency: 'USD',
    shipping: order.shipping,
    items: order.items.map(i => ({
      item_id: i.productId,
      item_name: i.title,
      price: i.price,
      quantity: i.quantity,
    })),
  })
}

export function trackDropViewed(drop: string) {
  window.gtag?.('event', 'drop_viewed', { drop_name: drop })
  window.fbq?.('trackCustom', 'DropViewed', { drop })
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Analytics() {
  const location = useLocation()

  // Load scripts once
  useEffect(() => {
    if (PIXEL_ID) loadPixel(PIXEL_ID)
    if (GA4_ID)   loadGA4(GA4_ID)
  }, [])

  // Page view on every route change
  useEffect(() => {
    trackPageView(location.pathname + location.search)
  }, [location.pathname, location.search])

  // Listen for cart events fired from CartContext
  useEffect(() => {
    const handler = (e: Event) => {
      trackAddToCart((e as CustomEvent<CartItem>).detail)
    }
    window.addEventListener('kryve:add_to_cart', handler)
    return () => window.removeEventListener('kryve:add_to_cart', handler)
  }, [])

  return null // no UI
}
