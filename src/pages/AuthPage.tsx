import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login, register } from '../lib/auth'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail]       = useState('')
  const [name, setName]         = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const { refresh } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    if (mode === 'register' && !name) { setError('Please enter your name.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }

    setLoading(true)
    try {
      const result = mode === 'login'
        ? await login(email, password)
        : await register(email, name, password)

      if (result.error || !result.user) {
        setError(result.error || 'Something went wrong.')
      } else {
        refresh()
        navigate('/account')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen pt-24 pb-16 bg-[#FAF8F5] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="font-display font-black text-3xl tracking-tight text-[#1A1A1A]" style={{ WebkitFontSmoothing: 'antialiased' }}>
            KRYVE
          </Link>
          <p className="font-body text-sm text-[#888] mt-2">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        {/* Tab toggle */}
        <div className="flex rounded-sm border border-[#E5E0D8] overflow-hidden mb-6">
          {(['login', 'register'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError('') }}
              className={`flex-1 py-3 font-display font-bold text-xs tracking-widest uppercase transition-colors ${
                mode === m ? 'bg-[#1A1A1A] text-white' : 'bg-white text-[#888] hover:text-[#1A1A1A]'
              }`}
            >
              {m === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[#E5E0D8] rounded-sm p-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="font-body text-xs font-semibold tracking-widest uppercase text-[#555] block mb-1.5">Full Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full font-body text-sm px-3 py-3 border border-[#D8D3CC] rounded-sm focus:outline-none focus:border-[#1A1A1A] transition-colors"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label className="font-body text-xs font-semibold tracking-widest uppercase text-[#555] block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full font-body text-sm px-3 py-3 border border-[#D8D3CC] rounded-sm focus:outline-none focus:border-[#1A1A1A] transition-colors"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="font-body text-xs font-semibold tracking-widest uppercase text-[#555] block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full font-body text-sm px-3 py-3 border border-[#D8D3CC] rounded-sm focus:outline-none focus:border-[#1A1A1A] transition-colors"
              placeholder={mode === 'register' ? 'Min. 6 characters' : '••••••••'}
            />
          </div>

          {error && (
            <div className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-sm">
              <p className="font-body text-xs text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full font-display font-bold text-sm tracking-widest uppercase py-4 bg-[#1A1A1A] text-white rounded-sm hover:bg-[#333] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                  <path d="M12 2a10 10 0 0110 10"/>
                </svg>
                {mode === 'login' ? 'Signing in…' : 'Creating account…'}
              </>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>

          {mode === 'register' && (
            <p className="font-body text-[11px] text-[#AAA] text-center">
              By creating an account you agree to our{' '}
              <Link to="/faq" className="underline hover:text-[#1A1A1A]">terms</Link>.
              New members get <strong>WELCOME10</strong> — 10% off your first order.
            </p>
          )}
        </form>

        <p className="font-body text-xs text-[#888] text-center mt-4">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
            className="text-[#1A1A1A] font-semibold underline hover:no-underline">
            {mode === 'login' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </main>
  )
}
