const KEY = 'kryve_wishlist'

export function getWishlist(): string[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

export function toggleWishlist(productId: string): boolean {
  const list = getWishlist()
  const idx = list.indexOf(productId)
  if (idx === -1) {
    list.push(productId)
    try { localStorage.setItem(KEY, JSON.stringify(list)) } catch { /* ignore */ }
    return true // added
  } else {
    list.splice(idx, 1)
    try { localStorage.setItem(KEY, JSON.stringify(list)) } catch { /* ignore */ }
    return false // removed
  }
}

export function isWishlisted(productId: string): boolean {
  return getWishlist().includes(productId)
}

export function clearWishlist() {
  try { localStorage.removeItem(KEY) } catch { /* ignore */ }
}
