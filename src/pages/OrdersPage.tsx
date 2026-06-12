import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Order } from '../types'

const STATUS_COLORS: Record<Order['status'], string> = {
  pending:    'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped:    'bg-purple-100 text-purple-700',
  delivered:  'bg-green-100 text-green-700',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('kryve_orders') || '[]') as Order[]
      setOrders(saved)
    } catch { setOrders([]) }
  }, [])

  return (
    <main className="min-h-screen pt-24 pb-16 bg-[#FAF8F5]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight">Your Orders</h1>
          <Link to="/shop" className="font-body text-sm text-[#888] hover:text-[#1A1A1A] transition-colors">
            Continue Shopping →
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full bg-[#EDE8E2] flex items-center justify-center mx-auto mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                <rect x="9" y="3" width="6" height="4" rx="1"/>
              </svg>
            </div>
            <p className="font-display font-bold text-xl mb-2">No orders yet</p>
            <p className="font-body text-sm text-[#888] mb-8">When you place an order, it will appear here.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 font-display font-bold text-sm tracking-widest uppercase px-8 py-4 bg-[#1A1A1A] text-white rounded-sm hover:bg-[#333] transition-colors"
            >
              Shop the Collection →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white border border-[#E5E0D8] rounded-lg overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-[#E5E0D8] flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="font-body text-xs text-[#888]">Order</p>
                    <p className="font-display font-bold text-sm">{order.id}</p>
                  </div>
                  <div className="text-right sm:text-left">
                    <p className="font-body text-xs text-[#888]">Placed</p>
                    <p className="font-body text-sm">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-[#888]">Total</p>
                    <p className="font-display font-bold text-sm">${order.total.toFixed(2)}</p>
                  </div>
                  <span className={`text-xs font-body font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="p-5 flex gap-3 overflow-x-auto">
                  {order.items.map(item => (
                    <div key={item.variantId} className="flex-shrink-0 text-center">
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-[#EDE8E2] mb-1.5">
                        {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                      </div>
                      <p className="font-body text-[10px] text-[#888] max-w-[64px] truncate">{item.title}</p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-5 pb-4 flex gap-3">
                  <Link
                    to="/order-confirmation"
                    state={{ order }}
                    className="font-body text-xs font-medium text-[#1A1A1A] hover:underline"
                  >
                    View details
                  </Link>
                  <span className="text-[#D8D3CC]">·</span>
                  <a
                    href={`mailto:getkryve@gmail.com?subject=Order ${order.id}`}
                    className="font-body text-xs font-medium text-[#888] hover:text-[#1A1A1A] transition-colors"
                  >
                    Get help
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
