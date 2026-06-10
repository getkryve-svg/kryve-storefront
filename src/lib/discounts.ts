import type { DiscountCode } from '../types'

/** All valid discount codes. In production, validate server-side. */
export const DISCOUNT_CODES: DiscountCode[] = [
  { code: 'WELCOME10', type: 'percent', value: 10, minOrder: 0 },
  { code: 'HPM3GANG', type: 'percent', value: 15, minOrder: 50 },
  { code: 'SAND20',   type: 'percent', value: 20, minOrder: 100 },
  { code: 'FREESHIP', type: 'fixed',   value: 8,  minOrder: 0 },
  { code: 'DROP15',   type: 'percent', value: 15, minOrder: 75 },
]

export function validateCode(code: string, subtotal: number): { valid: boolean; discount: DiscountCode | null; error?: string } {
  const found = DISCOUNT_CODES.find(d => d.code === code.toUpperCase().trim())
  if (!found) return { valid: false, discount: null, error: 'Invalid discount code.' }
  if (found.expiresAt && new Date(found.expiresAt) < new Date()) {
    return { valid: false, discount: null, error: 'This code has expired.' }
  }
  if (found.minOrder && subtotal < found.minOrder) {
    return { valid: false, discount: null, error: `Minimum order $${found.minOrder} required.` }
  }
  return { valid: true, discount: found }
}

export function applyDiscount(subtotal: number, discount: DiscountCode | null): number {
  if (!discount) return 0
  if (discount.type === 'percent') return Math.round(subtotal * (discount.value / 100) * 100) / 100
  return Math.min(discount.value, subtotal)
}

export function calcShipping(subtotal: number, discountAmount: number): number {
  const afterDiscount = subtotal - discountAmount
  return afterDiscount >= 100 ? 0 : 8
}

const SUB_KEY = 'hpm3_subscribers'

export function saveSubscriber(email: string): string {
  // Generate one-time discount code for new subscribers
  const code = 'WELCOME10'
  try {
    const existing = JSON.parse(localStorage.getItem(SUB_KEY) || '[]') as string[]
    if (!existing.includes(email)) {
      localStorage.setItem(SUB_KEY, JSON.stringify([...existing, email]))
    }
  } catch { /* ignore */ }
  return code
}
