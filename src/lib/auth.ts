/**
 * Lightweight client-side auth.
 * Stores hashed passwords in localStorage — fine for demo.
 * Swap this module for a real auth API (Supabase, Clerk, NextAuth) when ready.
 */

export interface User {
  id: string
  email: string
  name: string
  role: 'customer' | 'admin'
  createdAt: string
  referralCode: string
  referralCredits: number
}

const USERS_KEY   = 'hpm3_users'
const SESSION_KEY = 'hpm3_session'

// Simple hash — not cryptographically secure, demo only
async function hashPassword(pw: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw + 'hpm3_salt'))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function loadUsers(): User[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') } catch { return [] }
}

function saveUsers(users: User[]) {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)) } catch { /* ignore */ }
}

function loadPasswords(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem('hpm3_pw') || '{}') } catch { return {} }
}

function savePasswords(pws: Record<string, string>) {
  try { localStorage.setItem('hpm3_pw', JSON.stringify(pws)) } catch { /* ignore */ }
}

function genReferral(): string {
  return 'HPM3-' + Math.random().toString(36).slice(2, 8).toUpperCase()
}

export async function register(email: string, name: string, password: string): Promise<{ user: User | null; error?: string }> {
  const users = loadUsers()
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { user: null, error: 'An account with this email already exists.' }
  }
  const hash = await hashPassword(password)
  const user: User = {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    name,
    role: 'customer',
    createdAt: new Date().toISOString(),
    referralCode: genReferral(),
    referralCredits: 0,
  }
  const pws = loadPasswords()
  pws[user.id] = hash
  saveUsers([...users, user])
  savePasswords(pws)
  setSession(user)
  return { user }
}

export async function login(email: string, password: string): Promise<{ user: User | null; error?: string }> {
  const users = loadUsers()
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!user) return { user: null, error: 'No account found with this email.' }
  const hash = await hashPassword(password)
  const pws = loadPasswords()
  if (pws[user.id] !== hash) return { user: null, error: 'Incorrect password.' }
  setSession(user)
  return { user }
}

export function logout() {
  try { localStorage.removeItem(SESSION_KEY) } catch { /* ignore */ }
}

export function getSession(): User | null {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') } catch { return null }
}

function setSession(user: User) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(user)) } catch { /* ignore */ }
}

export function updateUser(updates: Partial<User>) {
  const session = getSession()
  if (!session) return
  const users = loadUsers()
  const idx = users.findIndex(u => u.id === session.id)
  if (idx === -1) return
  const updated = { ...users[idx], ...updates }
  users[idx] = updated
  saveUsers(users)
  setSession(updated)
}

export function getAllUsers(): User[] {
  return loadUsers()
}

/** Seed an admin account on first run */
export async function ensureAdmin() {
  const users = loadUsers()
  if (!users.find(u => u.role === 'admin')) {
    await register('admin@hpm3.com', 'Admin', 'hpm3admin2024')
    const u = loadUsers()
    const adm = u.find(x => x.email === 'admin@hpm3.com')
    if (adm) {
      adm.role = 'admin'
      saveUsers(u)
      setSession(adm)
    }
  }
}
