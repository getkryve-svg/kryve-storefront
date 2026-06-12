import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getWishlist } from '../lib/wishlist'
import { PRODUCTS } from '../data/products'
import type { Order } from '../types'

function loadOrders(): Order[] {
  try { return JSON.parse(localStorage.getItem('kryve_orders') || '[]') } catch { return [] }
}

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-yellow-50 text-yellow-700 border-yellow-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped:    'bg-purple-50 text-purple-700 border-purple-200',
  delivered:  'bg-green-50 text-green-700 border-green-200',
}

export default function AccountPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'orders' | 'wishlist' | 'referral'>('orders')
  const [orders, setOrders] = useState<Order[]>([])
  const [wishlistIds, setWishlistIds] = useState<string[]>([])

  useEffect(() => {
    if (!user) { navigate('/auth'); return }
    setOrders(loadOrders())
    setWishlistIds(getWishlist())
  }, [user, navigate])

  if (!user) return null

  const wishlistProducts = PRODUCTS.filter(p => wishlistIds.includes(p.id))
  const referralUrl = `${window.location.origin}?ref=${user.referralCode}`

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <main className="min-h-screen pt-24 pb-16 bg-[#FAF8F5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display font-black text-3xl tracking-tight">Hey, {user.name.split(' ')[0]} 👋</h1>
            <p className="font-body text-sm text-[#888] mt-1">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="font-body text-sm text-[#888] hover:text-[#1A1A1A] transition-colors"
          >
            Sign out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white border border-[#E5E0D8] rounded-sm p-1">
          {([
            { key: 'orders',   label: `Orders (${orders.length})` },
            { key: 'wishlist', label: `Wishlist (${wishlistIds.length})` },
            { key: 'referral', label: 'Referral' },
          ] as const).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 font-display font-bold text-xs tracking-widest uppercase rounded-sm transition-colors ${
                tab === t.key ? 'bg-[#1A1A1A] text-white' : 'text-[#888] hover:text-[#1A1A1A]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Orders */}
        {tab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-white border border-[#E5E0D8] rounded-sm">
                <p className="font-body text-[#888] mb-4">No orders yet.</p>
                <Link to="/shop" className="font-display font-bold text-sm tracking-widest uppercase px-6 py-3 bg-[#1A1A1A] text-white rounded-sm hover:bg-[#333] transition-colors">
                  Shop Now
                </Link>
              </div>
            ) : orders.map(order => (
              <div key={order.id} className="bg-white border border-[#E5E0D8] rounded-sm p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-display font-bold text-sm">{order.id}</p>
                    <p className="font-body text-xs text-[#888]">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <span className={`font-body text-xs px-2.5 py-1 rounded-full border capitalize ${STATUS_COLORS[order.status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  {order.items.map(item => (
                    <div key={item.variantId} className="flex justify-between font-body text-sm">
                      <span className="text-[#555]">{item.title} — {item.variantTitle} × {item.quantity}</span>
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-display font-bold text-sm border-t border-[#E5E0D8] pt-3">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Wishlist */}
        {tab === 'wishlist' && (
          <div>
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-16 bg-white border border-[#E5E0D8] rounded-sm">
                <p className="font-body text-[#888] mb-4">Your wishlist is empty.</p>
                <Link to="/shop" className="font-display font-bold text-sm tracking-widest uppercase px-6 py-3 bg-[#1A1A1A] text-white rounded-sm hover:bg-[#333] transition-colors">
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {wishlistProducts.map(p => (
                  <Link key={p.id} to={`/products/${p.handle}`} className="group">
                    <div className="aspect-square bg-[#EDE8E2] rounded-sm overflow-hidden mb-2">
                      <img
                        src={p.images.primary}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="font-display font-bold text-sm">{p.title}</p>
                    <p className="font-body text-xs text-[#888]">${p.price}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Referral */}
        {tab === 'referral' && (
          <div className="bg-white border border-[#E5E0D8] rounded-sm p-6">
            <h2 className="font-display font-bold text-xl mb-2">Refer a Friend</h2>
            <p className="font-body text-sm text-[#888] mb-6">
              Share your link. Your friend gets <strong>10% off</strong> their first order. You get <strong>$10 credit</strong> after they purchase.
            </p>

            <div className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-sm p-4 mb-4">
              <p className="font-body text-xs text-[#888] mb-1">Your referral link</p>
              <div className="flex items-center gap-2">
                <p className="font-body text-sm text-[#1A1A1A] flex-1 truncate">{referralUrl}</p>
                <button
                  onClick={() => navigator.clipboard?.writeText(referralUrl)}
                  className="font-display font-bold text-xs tracking-widest uppercase px-3 py-2 bg-[#1A1A1A] text-white rounded-sm hover:bg-[#333] transition-colors whitespace-nowrap"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: 'Total Referrals', value: '0' },
                { label: 'Successful Orders', value: '0' },
                { label: 'Credits Earned', value: `$${user.referralCredits}` },
              ].map(s => (
                <div key={s.label} className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-sm p-4">
                  <p className="font-display font-black text-2xl">{s.value}</p>
                  <p className="font-body text-xs text-[#888] mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <p className="font-body text-xs font-semibold tracking-widest uppercase text-[#888]">How it works</p>
              {[
                'Share your unique referral link with friends',
                'Friend clicks link and shops KRYVE',
                'Friend gets 10% off their first order automatically',
                'You receive $10 store credit after their purchase',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="font-display font-black text-sm text-[#8B6F47] w-5 flex-shrink-0">{i + 1}</span>
                  <p className="font-body text-sm text-[#555]">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
