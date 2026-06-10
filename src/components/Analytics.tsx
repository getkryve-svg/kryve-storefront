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

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined
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

function loadPixel(id: string) {
  if (window.fbq) return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const n = function (...args: unknown[]) { ((n as any).q = (n as any).q || []).push(args) } as any
  n.loaded = true
  n.version = '2.0'
  n.q = []
  window.fbq = n
  window._fbq = n
  const s = document.createElement('script')
  s.async = true
  s.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(s)
  window.fbq?.('init', id)
}

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

export function trackViewContent(product: { id: string; title: string; price: number; drop: string }) {
  window.fbq?.('track', 'ViewContent', {
    content_ids: [product.id],
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
    content_ids: [item.productId],
    content_name: item.title,
    content_type: 'product',
    value: item.price,
    currency: 'USD',
  })
  window.gtag?.('event', 'add_to_cart', {
    currency: 'USD',
    value: item.price,
    items: [{ item_id: item.productId, item_name: item.title, price: item.price, quantity: item.quantity }],
  })
}

export function trackInitiateCheckout(subtotal: number, itemCount: number) {
  window.fbq?.('track', 'InitiateCheckout', { value: subtotal, currency: 'USD', num_items: itemCount })
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
    window.addEventListener('hpm3:add_to_cart', handler)
    return () => window.removeEventListener('hpm3:add_to_cart', handler)
  }, [])

  return null // no UI
}
