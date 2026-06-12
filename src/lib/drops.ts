const KEY = 'kryve_drop_notify'

export interface DropNotifyEntry {
  email: string
  drop: string
  subscribedAt: string
}

export interface UpcomingDrop {
  name: string
  releaseDate: string   // ISO date string
  teaser: string
  color: string
}

// Configure upcoming drops here
export const UPCOMING_DROPS: UpcomingDrop[] = [
  {
    name: 'Ember',
    releaseDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString(), // 21 days from now
    teaser: 'Warm undertones. Raw textures. The next chapter.',
    color: '#B5654A',
  },
  {
    name: 'Slate',
    releaseDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 56).toISOString(), // 56 days from now
    teaser: 'Cold tones. Structured silhouettes. Coming 2025.',
    color: '#6B7280',
  },
]

export function subscribeToNotify(email: string, drop: string): boolean {
  try {
    const entries: DropNotifyEntry[] = JSON.parse(localStorage.getItem(KEY) || '[]')
    if (entries.find(e => e.email === email && e.drop === drop)) return false // already subscribed
    entries.push({ email, drop, subscribedAt: new Date().toISOString() })
    localStorage.setItem(KEY, JSON.stringify(entries))
    return true
  } catch { return false }
}

export function getNotifyList(): DropNotifyEntry[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

export function isSubscribed(email: string, drop: string): boolean {
  return getNotifyList().some(e => e.email === email && e.drop === drop)
}

export function getTimeRemaining(isoDate: string): { days: number; hours: number; minutes: number; seconds: number; total: number } {
  const total = Math.max(0, new Date(isoDate).getTime() - Date.now())
  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours   = Math.floor((total / 1000 / 60 / 60) % 24)
  const days    = Math.floor(total / 1000 / 60 / 60 / 24)
  return { days, hours, minutes, seconds, total }
}
