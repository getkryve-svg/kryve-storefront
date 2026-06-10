/**
 * Client-side inventory management.
 * In production this hits a real DB API. For now: localStorage with defaults.
 */
import { PRODUCTS } from '../data/products'

const KEY = 'hpm3_inventory'

function buildDefaults(): Record<string, number> {
  const defaults: Record<string, number> = {}
  PRODUCTS.forEach(p => {
    p.sizes.forEach(size => {
      defaults[`${p.id}:${size}`] = (size === 'XS' || size === 'XXL') ? 8 : 20
    })
  })
  return defaults
}

function load(): Record<string, number> {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, number>
      // Merge in any new products added since last init
      const defaults = buildDefaults()
      let merged = false
      Object.entries(defaults).forEach(([k, v]) => {
        if (!(k in parsed)) { parsed[k] = v; merged = true }
      })
      if (merged) localStorage.setItem(KEY, JSON.stringify(parsed))
      return parsed
    }
  } catch { /* ignore */ }
  const defaults = buildDefaults()
  try { localStorage.setItem(KEY, JSON.stringify(defaults)) } catch { /* ignore */ }
  return defaults
}

function save(inv: Record<string, number>) {
  try { localStorage.setItem(KEY, JSON.stringify(inv)) } catch { /* ignore */ }
}

export function getStock(productId: string, size: string): number {
  return load()[`${productId}:${size}`] ?? 20
}

export function getAllStock(): Record<string, number> {
  return load()
}

export function setStock(productId: string, size: string, qty: number) {
  const inv = load()
  inv[`${productId}:${size}`] = Math.max(0, qty)
  save(inv)
}

export function decrementStock(productId: string, size: string, qty = 1): boolean {
  const inv = load()
  const key = `${productId}:${size}`
  const current = inv[key] ?? 20
  if (current < qty) return false
  inv[key] = current - qty
  save(inv)
  return true
}

export function isInStock(productId: string, size: string): boolean {
  return getStock(productId, size) > 0
}

/** Call once on app start to ensure defaults are written */
export function initInventory() { load() }
