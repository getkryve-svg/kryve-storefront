import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAllStock, setStock } from '../lib/inventory'
import { PRODUCTS } from '../data/products'
import { getAllUsers } from '../lib/auth'
import { DISCOUNT_CODES } from '../lib/discounts'
import { getNotifyList } from '../lib/drops'
import type { Order } from '../types'

// ── Revenue Sparkline (last 14 days) ─────────────────────────────────────────
function RevenueChart({ orders }: { orders: Order[] }) {
  const days = 14
  const labels: string[] = []
  const data: number[]   = []

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    labels.push(key.slice(5)) // MM-DD
    const dayTotal = orders
      .filter(o => o.createdAt.slice(0, 10) === key)
      .reduce((s, o) => s + o.total, 0)
    data.push(dayTotal)
  }

  const maxVal = Math.max(...data, 1)
  const W = 600, H = 80, padX = 0, padY = 4
  const pts = data.map((v, i) => {
    const x = padX + (i / (days - 1)) * (W - padX * 2)
    const y = H - padY - ((v / maxVal) * (H - padY * 2))
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="bg-white border border-[#E5E0D8] rounded-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-sm">Revenue — Last 14 Days</h2>
        <span className="font-display font-bold text-lg">${data.reduce((a, b) => a + b, 0).toFixed(0)}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-16" preserveAspectRatio="none">
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B6F47" stopOpacity="0.25"/>
            <stop offset="100%" stopColor="#8B6F47" stopOpacity="0.02"/>
          </linearGradient>
        </defs>
        {/* Area fill */}
        <polygon
          points={`0,${H} ${pts} ${W},${H}`}
          fill="url(#revGrad)"
        />
        {/* Line */}
        <polyline points={pts} fill="none" stroke="#8B6F47" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
        {/* Data points */}
        {data.map((v, i) => {
          const x = padX + (i / (days - 1)) * (W - padX * 2)
          const y = H - padY - ((v / maxVal) * (H - padY * 2))
          return v > 0 ? <circle key={i} cx={x} cy={y} r="3" fill="#8B6F47"/> : null
        })}
      </svg>
      {/* X-axis labels */}
      <div className="flex justify-between mt-1">
        {labels.filter((_, i) => i % 2 === 0).map(l => (
          <span key={l} className="font-body text-[9px] text-[#AAA]">{l}</span>
        ))}
      </div>
    </div>
  )
}

function loadOrders(): Order[] {
  try { return JSON.parse(localStorage.getItem('hpm3_orders') || '[]') } catch { return [] }
}
function saveOrders(orders: Order[]) {
  try { localStorage.setItem('hpm3_orders', JSON.stringify(orders)) } catch { /* ignore */ }
}

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered'] as const
const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-yellow-50 text-yellow-700 border-yellow-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped:    'bg-purple-50 text-purple-700 border-purple-200',
  delivered:  'bg-green-50 text-green-700 border-green-200',
}

type Tab = 'overview' | 'orders' | 'inventory' | 'customers' | 'codes' | 'drops'

export default function AdminPage() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('overview')
  const [orders, setOrdersState] = useState<Order[]>([])
  const [stock, setStockState] = useState<Record<string, number>>({})
  const [editStock, setEditStock] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!user) { navigate('/auth'); return }
    if (!isAdmin) { navigate('/'); return }
    setOrdersState(loadOrders())
    setStockState(getAllStock())
  }, [user, isAdmin, navigate])

  if (!user || !isAdmin) return null

  // ── Analytics ──────────────────────────────────────────────────────────────
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0)
  const totalOrders  = orders.length
  const avgOrder     = totalOrders ? totalRevenue / totalOrders : 0
  const productSales: Record<string, number> = {}
  orders.forEach(o => o.items.forEach(i => {
    productSales[i.title] = (productSales[i.title] || 0) + i.quantity
  }))
  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // ── Update order status ────────────────────────────────────────────────────
  function updateStatus(orderId: string, status: string) {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: status as Order['status'] } : o)
    setOrdersState(updated)
    saveOrders(updated)
  }

  // ── Update stock ───────────────────────────────────────────────────────────
  function applyStockEdit(productId: string, size: string) {
    const key = `${productId}:${size}`
    const val = parseInt(editStock[key] ?? '')
    if (!isNaN(val)) {
      setStock(productId, size, val)
      setStockState(getAllStock())
      setEditStock(prev => { const n = { ...prev }; delete n[key]; return n })
    }
  }

  const users = getAllUsers()
  const dropNotifyList = getNotifyList()
  const subscribers: string[] = (() => {
    try { return JSON.parse(localStorage.getItem('hpm3_subscribers') || '[]') } catch { return [] }
  })()

  const TABS: { key: Tab; label: string }[] = [
    { key: 'overview',   label: 'Overview' },
    { key: 'orders',     label: `Orders (${totalOrders})` },
    { key: 'inventory',  label: 'Inventory' },
    { key: 'customers',  label: `Customers (${users.length})` },
    { key: 'codes',      label: 'Codes' },
    { key: 'drops',      label: `Drops (${dropNotifyList.length})` },
  ]

  return (
    <main className="min-h-screen pt-20 pb-16 bg-[#F5F2EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6 border-b border-[#E5E0D8] mb-6">
          <div>
            <h1 className="font-display font-black text-2xl">Admin Dashboard</h1>
            <p className="font-body text-xs text-[#888]">hpm3® operations</p>
          </div>
          <span className="font-body text-xs px-2.5 py-1 bg-[#1A1A1A] text-white rounded-full">Admin</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white border border-[#E5E0D8] rounded-sm p-1 flex-wrap">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`py-2 px-4 font-display font-bold text-xs tracking-wider uppercase rounded-sm transition-colors ${
                tab === t.key ? 'bg-[#1A1A1A] text-white' : 'text-[#888] hover:text-[#1A1A1A]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Revenue',  value: `$${totalRevenue.toFixed(2)}`,   sub: 'All time' },
                { label: 'Total Orders',   value: totalOrders,                      sub: 'All time' },
                { label: 'Avg Order',      value: `$${avgOrder.toFixed(2)}`,        sub: 'Per order' },
                { label: 'Subscribers',    value: subscribers.length,              sub: 'Email list' },
              ].map(s => (
                <div key={s.label} className="bg-white border border-[#E5E0D8] rounded-sm p-5">
                  <p className="font-body text-xs text-[#888] mb-1">{s.label}</p>
                  <p className="font-display font-black text-2xl">{s.value}</p>
                  <p className="font-body text-xs text-[#AAA] mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            <RevenueChart orders={orders} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Top products */}
              <div className="bg-white border border-[#E5E0D8] rounded-sm p-5">
                <h2 className="font-display font-bold text-sm mb-4">Top Products</h2>
                {topProducts.length === 0 ? (
                  <p className="font-body text-xs text-[#AAA]">No sales yet.</p>
                ) : topProducts.map(([title, qty]) => (
                  <div key={title} className="flex justify-between py-2 border-b border-[#F0EBE3] last:border-b-0">
                    <span className="font-body text-sm text-[#555]">{title}</span>
                    <span className="font-display font-bold text-sm">{qty} sold</span>
                  </div>
                ))}
              </div>

              {/* Recent orders */}
              <div className="bg-white border border-[#E5E0D8] rounded-sm p-5">
                <h2 className="font-display font-bold text-sm mb-4">Recent Orders</h2>
                {orders.slice(0, 5).length === 0 ? (
                  <p className="font-body text-xs text-[#AAA]">No orders yet.</p>
                ) : orders.slice(0, 5).map(o => (
                  <div key={o.id} className="flex items-center justify-between py-2 border-b border-[#F0EBE3] last:border-b-0">
                    <div>
                      <p className="font-body text-xs font-semibold">{o.id}</p>
                      <p className="font-body text-[11px] text-[#AAA]">{o.shippingAddress?.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-xs">${o.total.toFixed(2)}</p>
                      <span className={`font-body text-[10px] px-1.5 py-0.5 rounded border ${STATUS_COLORS[o.status]}`}>{o.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab === 'orders' && (
          <div className="space-y-3">
            {orders.length === 0 && (
              <div className="text-center py-16 bg-white border border-[#E5E0D8] rounded-sm">
                <p className="font-body text-[#888]">No orders yet.</p>
              </div>
            )}
            {orders.map(order => (
              <div key={order.id} className="bg-white border border-[#E5E0D8] rounded-sm p-5">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-display font-bold text-sm">{order.id}</p>
                    <p className="font-body text-xs text-[#888]">
                      {new Date(order.createdAt).toLocaleDateString()} · {order.shippingAddress?.email}
                    </p>
                    {order.shippingAddress && (
                      <p className="font-body text-xs text-[#AAA] mt-0.5">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}, {order.shippingAddress.city}, {order.shippingAddress.state}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value)}
                      className={`font-body text-xs px-3 py-1.5 rounded border cursor-pointer ${STATUS_COLORS[order.status]}`}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <p className="font-display font-bold text-sm">${order.total.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {order.items.map(item => (
                    <span key={item.variantId} className="font-body text-xs px-2 py-1 bg-[#FAF8F5] border border-[#E5E0D8] rounded">
                      {item.title} {item.variantTitle} ×{item.quantity}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── INVENTORY ── */}
        {tab === 'inventory' && (
          <div className="bg-white border border-[#E5E0D8] rounded-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#FAF8F5] border-b border-[#E5E0D8]">
                <tr>
                  <th className="text-left font-body text-xs tracking-widest uppercase text-[#888] px-5 py-3">Product</th>
                  <th className="text-left font-body text-xs tracking-widest uppercase text-[#888] px-3 py-3">Drop</th>
                  <th className="text-left font-body text-xs tracking-widest uppercase text-[#888] px-3 py-3">Size</th>
                  <th className="text-center font-body text-xs tracking-widest uppercase text-[#888] px-3 py-3">Stock</th>
                  <th className="text-center font-body text-xs tracking-widest uppercase text-[#888] px-3 py-3">Update</th>
                </tr>
              </thead>
              <tbody>
                {PRODUCTS.flatMap(p =>
                  p.sizes.map(size => {
                    const key = `${p.id}:${size}`
                    const qty = stock[key] ?? 20
                    const low = qty <= 5
                    return (
                      <tr key={key} className="border-b border-[#F0EBE3] last:border-0 hover:bg-[#FAF8F5]">
                        <td className="px-5 py-2.5 font-body text-sm">{p.title}</td>
                        <td className="px-3 py-2.5 font-body text-xs text-[#888]">{p.drop}</td>
                        <td className="px-3 py-2.5 font-body text-xs">{size}</td>
                        <td className="px-3 py-2.5 text-center">
                          <span className={`font-display font-bold text-sm ${low ? 'text-red-500' : 'text-[#1A1A1A]'}`}>
                            {qty}
                            {low && qty > 0 && <span className="ml-1 text-[10px] font-body">⚠️</span>}
                            {qty === 0 && <span className="ml-1 text-[10px]">OUT</span>}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="number"
                              min="0"
                              placeholder={String(qty)}
                              value={editStock[key] ?? ''}
                              onChange={e => setEditStock(prev => ({ ...prev, [key]: e.target.value }))}
                              className="w-16 font-body text-xs px-2 py-1 border border-[#D8D3CC] rounded focus:outline-none focus:border-[#1A1A1A] text-center"
                            />
                            <button
                              onClick={() => applyStockEdit(p.id, size)}
                              className="font-body text-xs px-2 py-1 bg-[#1A1A1A] text-white rounded hover:bg-[#333] transition-colors"
                            >
                              Set
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── CUSTOMERS ── */}
        {tab === 'customers' && (
          <div className="bg-white border border-[#E5E0D8] rounded-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#FAF8F5] border-b border-[#E5E0D8]">
                <tr>
                  {['Name', 'Email', 'Role', 'Joined', 'Orders', 'Referral Code'].map(h => (
                    <th key={h} className="text-left font-body text-xs tracking-widest uppercase text-[#888] px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const userOrders = orders.filter(o => o.shippingAddress?.email === u.email)
                  return (
                    <tr key={u.id} className="border-b border-[#F0EBE3] last:border-0 hover:bg-[#FAF8F5]">
                      <td className="px-5 py-3 font-body text-sm">{u.name}</td>
                      <td className="px-5 py-3 font-body text-xs text-[#888]">{u.email}</td>
                      <td className="px-5 py-3">
                        <span className={`font-body text-xs px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-[#1A1A1A] text-white' : 'bg-[#F0EBE3] text-[#555]'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-body text-xs text-[#888]">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-3 font-display font-bold text-sm">{userOrders.length}</td>
                      <td className="px-5 py-3 font-body text-xs text-[#8B6F47]">{u.referralCode}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── DISCOUNT CODES ── */}
        {tab === 'codes' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-sm p-4">
              <p className="font-body text-xs text-amber-700">
                Codes are currently hardcoded in <code>src/lib/discounts.ts</code>.
                To create codes dynamically, connect a database (Supabase, PlanetScale).
              </p>
            </div>
            <div className="bg-white border border-[#E5E0D8] rounded-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#FAF8F5] border-b border-[#E5E0D8]">
                  <tr>
                    {['Code', 'Type', 'Value', 'Min Order', 'Expires'].map(h => (
                      <th key={h} className="text-left font-body text-xs tracking-widest uppercase text-[#888] px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DISCOUNT_CODES.map(code => (
                    <tr key={code.code} className="border-b border-[#F0EBE3] last:border-0">
                      <td className="px-5 py-3 font-display font-bold text-sm text-[#8B6F47]">{code.code}</td>
                      <td className="px-5 py-3 font-body text-xs capitalize">{code.type === 'percent' ? '% Off' : '$ Off'}</td>
                      <td className="px-5 py-3 font-body text-sm">{code.type === 'percent' ? `${code.value}%` : `$${code.value}`}</td>
                      <td className="px-5 py-3 font-body text-xs text-[#888]">{code.minOrder ? `$${code.minOrder}` : '—'}</td>
                      <td className="px-5 py-3 font-body text-xs text-[#888]">{code.expiresAt || 'No expiry'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── DROP NOTIFICATIONS ── */}
        {tab === 'drops' && (
          <div className="space-y-4">
            <div className="bg-white border border-[#E5E0D8] rounded-sm p-5">
              <h2 className="font-display font-bold text-sm mb-4">Drop Notification Subscribers ({dropNotifyList.length})</h2>
              {dropNotifyList.length === 0 ? (
                <p className="font-body text-xs text-[#AAA]">No drop notification subscribers yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E0D8]">
                      {['Email', 'Drop', 'Subscribed'].map(h => (
                        <th key={h} className="text-left font-body text-xs tracking-widest uppercase text-[#888] pb-2">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dropNotifyList.map((e, i) => (
                      <tr key={i} className="border-b border-[#F0EBE3] last:border-0">
                        <td className="py-2 font-body text-xs">{e.email}</td>
                        <td className="py-2 font-body text-xs text-[#8B6F47]">{e.drop}</td>
                        <td className="py-2 font-body text-xs text-[#AAA]">{new Date(e.subscribedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="bg-white border border-[#E5E0D8] rounded-sm p-5">
              <h2 className="font-display font-bold text-sm mb-2">Email Subscribers ({subscribers.length})</h2>
              <p className="font-body text-xs text-[#888] mb-3">Newsletter signups from the footer/homepage.</p>
              {subscribers.length === 0 ? (
                <p className="font-body text-xs text-[#AAA]">No email subscribers yet.</p>
              ) : (
                <div className="space-y-1">
                  {subscribers.map((email, i) => (
                    <p key={i} className="font-body text-xs text-[#555] py-1 border-b border-[#F0EBE3] last:border-0">{email}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
