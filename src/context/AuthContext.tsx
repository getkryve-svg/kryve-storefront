import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { getSession, logout as authLogout, type User } from '../lib/auth'

interface AuthContextValue {
  user: User | null
  isAdmin: boolean
  refresh: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAdmin: false,
  refresh: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getSession())

  function refresh() { setUser(getSession()) }

  function logout() {
    authLogout()
    setUser(null)
  }

  // Re-sync if localStorage changes in another tab
  useEffect(() => {
    const handler = () => setUser(getSession())
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAdmin: user?.role === 'admin', refresh, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }
