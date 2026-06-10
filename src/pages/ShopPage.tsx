import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { PRODUCTS, DROP_COLORS } from '../data/products'
import ProductCard from '../components/ProductCard'
import Toast from '../components/Toast'
import { useCart } from '../context/CartContext'
import type { LocalProduct } from '../types'

const DROPS      = ['All', 'Sand', 'Clay', 'Fog'] as const
const CATEGORIES = ['All', 'Tee', 'Hoodie', 'Bottoms', 'Tank', 'Accessories'] as const
const SORTS      = [
  { value: 'default',    label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'new',        label: 'Newest First' },
] as const
type SortValue = typeof SORTS[number]['value']

// Drop hero data for the collection banner
const DROP_HERO: Record<string, { subtitle: string }> = {
  Sand: { subtitle: 'Desert warmth. Vintage silhouettes. 8 pieces.' },
  Clay: { subtitle: 'Earthy tones. Elevated essentials. 8 pieces.' },
  Fog:  { subtitle: 'Muted hues. Minimal branding. 7 pieces.' },
}

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeDrop,     setActiveDrop]     = useState(searchParams.get('drop') ?? 'All')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('cat')  ?? 'All')
  const [sortBy,         setSortBy]         = useState<SortValue>('default')
  const [toast, setToast] = useState<string | null>(null)
  const { addItem } = useCart()

  // Sync URL params → state
  useEffect(() => {
    setActiveDrop(searchParams.get('drop') ?? 'All')
    setActiveCategory(searchParams.get('cat') ?? 'All')
  }, [searchParams])

  function selectDrop(drop: string) {
    const p = new URLSearchParams(searchParams)
    if (drop === 'All') p.delete('drop'); else p.set('drop', drop)
    setSearchParams(p)
  }

  function selectCategory(cat: string) {
    const p = new URLSearchParams(searchParams)
    if (cat === 'All') p.delete('cat'); else p.set('cat', cat)
    setSearchParams(p)
  }

  const filtered = PRODUCTS
    .filter(p => (activeDrop === 'All' || p.drop === activeDrop) && (activeCategory === 'All' || p.category === activeCategory))
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'new')        return (b.badge ? 1 : 0) - (a.badge ? 1 : 0)
      return 0
    })

  function handleQuickAdd(product: LocalProduct) {
    addItem({
      variantId: `${product.id}-one-size`,
      productId: product.id,
      title: product.title,
      variantTitle: 'One Size',
      price: product.price,
      quantity: 1,
      image: product.imageProduct,
      handle: product.handle,
    })
    setToast(`${product.title} added to cart`)
  }

  const showingDrop = activeDrop !== 'All' ? activeDrop : null
  const heroData    = showingDrop ? DROP_HERO[showingDrop] : null

  return (
    <main className="min-h-screen pt-16 bg-[#FAF8F5]">
      {/* Collection banner when a drop is selected */}
      {showingDrop && heroData && (
        <div
          className="w-full py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-between"
          style={{ backgroundColor: DROP_COLORS[showingDrop] + '18', borderBottom: `1px solid ${DROP_COLORS[showingDrop]}33` }}
        >
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-[#888] mb-1">Drop Collection</p>
            <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight">{showingDrop}</h1>
            <p className="font-body text-sm text-[#888] mt-1.5">{heroData.subtitle}</p>
          </div>
          <Link
            to="/drops"
            className="hidden sm:flex items-center gap-1.5 font-body text-xs text-[#888] hover:text-[#1A1A1A] transition-colors"
          >
            View all drops →
          </Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Header */}
        {!showingDrop && (
          <div className="mb-8">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-[#AAA] mb-2">hpm3®</p>
            <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight">Shop</h1>
          </div>
        )}

        {/* Filters bar */}
        <div className="flex flex-wrap gap-3 items-center mb-8">
          {/* Drop pills */}
          <div className="flex gap-2 flex-wrap" role="group" aria-label="Filter by drop">
            {DROPS.map(drop => (
              <button
                key={drop}
                onClick={() => selectDrop(drop)}
                className={`font-body text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full border transition-all duration-160 ${
                  activeDrop === drop
                    ? 'bg-[#1A1A1A] text-[#FAF8F5] border-[#1A1A1A]'
                    : 'bg-transparent text-[#555] border-[#D8D3CC] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
                }`}
                aria-pressed={activeDrop === drop}
              >
                {drop}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-4 bg-[#E5E0D8] hidden sm:block" />

          {/* Category text tabs */}
          <div className="flex gap-1 flex-wrap" role="group" aria-label="Filter by category">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => selectCategory(cat)}
                className={`font-body text-xs font-medium px-3 py-1.5 rounded-sm transition-all duration-160 ${
                  activeCategory === cat
                    ? 'bg-[#F0EBE3] text-[#1A1A1A] font-semibold'
                    : 'text-[#888] hover:text-[#1A1A1A]'
                }`}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort + count — right side */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="font-body text-xs text-[#AAA]">
              {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
            </span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortValue)}
              className="font-body text-xs text-[#555] border border-[#D8D3CC] rounded-sm px-2.5 py-2 bg-white focus:outline-none focus:border-[#1A1A1A] cursor-pointer"
              aria-label="Sort products"
            >
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {/* Active filters display */}
        {(activeDrop !== 'All' || activeCategory !== 'All') && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="font-body text-xs text-[#888]">Filtered by:</span>
            {activeDrop !== 'All' && (
              <button
                onClick={() => selectDrop('All')}
                className="flex items-center gap-1 font-body text-xs px-2.5 py-1 bg-[#1A1A1A] text-white rounded-full hover:bg-[#333] transition-colors"
              >
                {activeDrop} <span className="text-white/60 ml-0.5">×</span>
              </button>
            )}
            {activeCategory !== 'All' && (
              <button
                onClick={() => selectCategory('All')}
                className="flex items-center gap-1 font-body text-xs px-2.5 py-1 bg-[#1A1A1A] text-white rounded-full hover:bg-[#333] transition-colors"
              >
                {activeCategory} <span className="text-white/60 ml-0.5">×</span>
              </button>
            )}
            <button
              onClick={() => { selectDrop('All'); selectCategory('All') }}
              className="font-body text-xs text-[#888] underline hover:text-[#1A1A1A] transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-body text-[#AAA] text-sm mb-4">No products match your filters.</p>
            <button
              onClick={() => { selectDrop('All'); selectCategory('All') }}
              className="font-display font-bold text-sm tracking-widest uppercase px-6 py-3 border border-[#1A1A1A] rounded-sm hover:bg-[#1A1A1A] hover:text-white transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} onQuickAdd={handleQuickAdd} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {filtered.length > 0 && (
          <div className="text-center mt-16 pt-12 border-t border-[#E5E0D8]">
            <p className="font-body text-sm text-[#888] mb-4">Want to know when new drops land?</p>
            <Link
              to="/drops"
              className="font-display font-bold text-sm tracking-widest uppercase px-8 py-3.5 bg-[#1A1A1A] text-white rounded-sm hover:bg-[#333] active:scale-[0.97] transition-all"
            >
              View Upcoming Drops
            </Link>
          </div>
        )}
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </main>
  )
}
