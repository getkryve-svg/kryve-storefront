import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UPCOMING_DROPS, subscribeToNotify, getTimeRemaining, type UpcomingDrop } from '../lib/drops'
import { PRODUCTS, DROP_COLORS } from '../data/products'

function Countdown({ releaseDate }: { releaseDate: string }) {
  const [time, setTime] = useState(getTimeRemaining(releaseDate))

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeRemaining(releaseDate)), 1000)
    return () => clearInterval(id)
  }, [releaseDate])

  if (time.total <= 0) return (
    <div className="font-display font-black text-2xl text-[#10B981] tracking-wider">LIVE NOW</div>
  )

  return (
    <div className="flex items-center gap-3">
      {[
        { label: 'Days',    value: time.days },
        { label: 'Hours',   value: time.hours },
        { label: 'Minutes', value: time.minutes },
        { label: 'Seconds', value: time.seconds },
      ].map(({ label, value }) => (
        <div key={label} className="text-center">
          <div className="font-display font-black text-3xl sm:text-4xl leading-none">
            {String(value).padStart(2, '0')}
          </div>
          <div className="font-body text-[10px] tracking-widest uppercase text-[#888] mt-1">{label}</div>
        </div>
      ))}
    </div>
  )
}

function NotifyForm({ drop }: { drop: UpcomingDrop }) {
  const [email, setEmail] = useState('')
  const [done, setDone]   = useState(false)
  const [error, setError] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email.'); return }
    subscribeToNotify(email, drop.name)
    setDone(true)
    setError('')
  }

  if (done) return (
    <div className="flex items-center gap-2 font-body text-sm text-[#10B981]">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="2,8 6,12 14,4"/>
      </svg>
      You're on the list for {drop.name}!
    </div>
  )

  return (
    <form onSubmit={submit} className="flex gap-2 flex-wrap">
      <input
        type="email"
        value={email}
        onChange={e => { setEmail(e.target.value); setError('') }}
        placeholder="your@email.com"
        className="flex-1 min-w-[200px] font-body text-sm px-3 py-2.5 border border-[#D8D3CC] rounded-sm bg-white focus:outline-none focus:border-[#1A1A1A] transition-colors"
      />
      <button
        type="submit"
        className="font-display font-bold text-xs tracking-widest uppercase px-5 py-2.5 rounded-sm transition-colors"
        style={{ backgroundColor: drop.color, color: '#FAF8F5' }}
      >
        Notify Me
      </button>
      {error && <p className="w-full font-body text-xs text-red-500">{error}</p>}
    </form>
  )
}

export default function DropsPage() {
  const drops = ['Sand', 'Clay', 'Fog'] as const

  return (
    <main className="min-h-screen pt-24 pb-16 bg-[#FAF8F5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-14">
          <p className="font-body text-xs tracking-widest uppercase text-[#8B6F47] mb-3">Seasonal Releases</p>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight">Drops</h1>
          <p className="font-body text-sm text-[#888] mt-3 max-w-md mx-auto">
            Three drops per year. Limited quantities. Once it's gone, it's gone.
          </p>
        </div>

        {/* Active drops */}
        <div className="mb-16">
          <p className="font-body text-xs font-semibold tracking-widest uppercase text-[#888] mb-6">Available Now</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {drops.map(drop => {
              const products = PRODUCTS.filter(p => p.drop === drop)
              const hero = products.find(p => p.category === 'Hoodie') || products[0]
              return (
                <Link
                  key={drop}
                  to={`/shop?drop=${drop}`}
                  className="group relative aspect-[3/4] rounded-sm overflow-hidden"
                >
                  <img
                    src={hero?.images.lifestyle || hero?.images.primary}
                    alt={`${drop} drop`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="font-body text-xs text-white/70 mb-1">Drop {drops.indexOf(drop) + 1} of 3</p>
                    <p className="font-display font-black text-2xl text-white mb-2">{drop}</p>
                    <span className="font-body text-xs text-white/80">Shop {products.length} pieces →</span>
                  </div>
                  <div
                    className="absolute top-4 left-4 font-body text-xs px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: DROP_COLORS[drop] }}
                  >
                    In Stock
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Upcoming drops */}
        <div>
          <p className="font-body text-xs font-semibold tracking-widest uppercase text-[#888] mb-6">Coming Soon</p>
          <div className="space-y-6">
            {UPCOMING_DROPS.map(drop => (
              <div
                key={drop.name}
                className="relative overflow-hidden rounded-sm border border-[#E5E0D8] bg-white p-6 sm:p-8"
              >
                {/* Color accent */}
                <div
                  className="absolute top-0 left-0 bottom-0 w-1"
                  style={{ backgroundColor: drop.color }}
                />

                <div className="pl-4">
                  <div className="flex flex-wrap items-start justify-between gap-6 mb-6">
                    <div>
                      <p className="font-body text-xs text-[#888] mb-1">Next Drop</p>
                      <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight">
                        Drop — {drop.name}
                      </h2>
                      <p className="font-body text-sm text-[#888] mt-2 max-w-sm">{drop.teaser}</p>
                    </div>
                    <div>
                      <p className="font-body text-[10px] tracking-widest uppercase text-[#888] mb-2">Releasing in</p>
                      <Countdown releaseDate={drop.releaseDate} />
                    </div>
                  </div>

                  <div>
                    <p className="font-body text-xs font-semibold text-[#555] mb-2">Get notified when it drops</p>
                    <NotifyForm drop={drop} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
