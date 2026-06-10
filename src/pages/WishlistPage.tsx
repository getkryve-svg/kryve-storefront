import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getWishlist, toggleWishlist } from '../lib/wishlist'
import { PRODUCTS } from '../data/products'

export default function WishlistPage() {
  const [ids, setIds] = useState<string[]>([])

  useEffect(() => { setIds(getWishlist()) }, [])

  function remove(productId: string) {
    toggleWishlist(productId)
    setIds(getWishlist())
  }

  const products = PRODUCTS.filter(p => ids.includes(p.id))

  return (
    <main className="min-h-screen pt-24 pb-16 bg-[#FAF8F5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display font-black text-3xl tracking-tight">Wishlist</h1>
          <p className="font-body text-sm text-[#888]">{products.length} item{products.length !== 1 ? 's' : ''}</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#E5E0D8] rounded-sm">
            <svg className="mx-auto mb-4 text-[#D8D3CC]" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            <p className="font-body text-[#888] mb-4">Your wishlist is empty.</p>
            <Link to="/shop" className="font-display font-bold text-sm tracking-widest uppercase px-6 py-3 bg-[#1A1A1A] text-white rounded-sm hover:bg-[#333] transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => (
              <div key={p.id} className="group relative">
                <Link to={`/products/${p.handle}`} className="block">
                  <div className="aspect-square bg-[#EDE8E2] rounded-sm overflow-hidden mb-3">
                    <img
                      src={p.images.primary}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="font-display font-bold text-sm">{p.title}</p>
                  <p className="font-body text-xs text-[#888]">{p.drop} · ${p.price}</p>
                </Link>
                <button
                  onClick={() => remove(p.id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
