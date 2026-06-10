import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { PRODUCTS, DROP_COLORS } from '../data/products'
import { useCart } from '../context/CartContext'
import { getStock, isInStock } from '../lib/inventory'
import { toggleWishlist, isWishlisted } from '../lib/wishlist'
import Toast from '../components/Toast'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/ProductImage'

export default function ProductPage() {
  const { handle } = useParams<{ handle: string }>()
  const product = PRODUCTS.find(p => p.handle === handle)
  const { addItem } = useCart()

  const [selectedSize, setSelectedSize] = useState<string | null>(
    product?.sizes.length === 1 ? product.sizes[0] : null
  )
  type ImageView = 'primary' | 'lifestyle' | 'back' | 'detail'
  const [activeImage, setActiveImage] = useState<ImageView>('primary')
  const [toast, setToast] = useState<string | null>(null)
  const [sizeError, setSizeError] = useState(false)
  const [addedFeedback, setAddedFeedback] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  useEffect(() => {
    if (product) setWishlisted(isWishlisted(product.id))
  }, [product])

  if (!product) return <Navigate to="/shop" replace />

  const dropColor = DROP_COLORS[product.drop]
  const related = PRODUCTS.filter(p => p.drop === product.drop && p.id !== product.id).slice(0, 4)

  function handleAddToCart() {
    if (!selectedSize) { setSizeError(true); return }
    setSizeError(false)

    if (!isInStock(product!.id, selectedSize)) {
      setToast('This size is out of stock.')
      return
    }

    addItem({
      variantId: `${product!.id}-${selectedSize}`,
      productId: product!.id,
      title: product!.title,
      variantTitle: selectedSize,
      price: product!.price,
      quantity: 1,
      image: product!.imageProduct,
      handle: product!.handle,
    })

    setAddedFeedback(true)
    setTimeout(() => setAddedFeedback(false), 600)
    setToast(`${product!.title} — ${selectedSize} added to cart`)
  }

  function handleWishlist() {
    const added = toggleWishlist(product!.id)
    setWishlisted(added)
    setToast(added ? '♥ Added to wishlist' : 'Removed from wishlist')
  }

  return (
    <main className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 font-body text-xs text-[#AAA] flex items-center gap-2" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[#1A1A1A] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#1A1A1A] transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/shop?drop=${product.drop}`} className="hover:text-[#1A1A1A] transition-colors">{product.drop}</Link>
          <span>/</span>
          <span className="text-[#1A1A1A]">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <div>
            <div
              className="relative overflow-hidden rounded-sm bg-[#EDE8E2] aspect-[4/5] group cursor-zoom-in"
              role="img"
              aria-label={`${product.title} — ${activeImage} view`}
            >
              <ProductImage
                product={product}
                view={activeImage}
                className="w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.04]"
                loading="eager"
              />
            </div>

            <div className="flex gap-2.5 mt-3">
              {(['primary', 'lifestyle', 'back', 'detail'] as ImageView[]).map((view) => {
                const labels = { primary: 'Product', lifestyle: 'On-model', back: 'Back', detail: 'Detail' }
                return (
                  <button
                    key={view}
                    onClick={() => setActiveImage(view)}
                    className={`relative overflow-hidden rounded-sm bg-[#EDE8E2] w-16 h-20 flex-shrink-0 transition-all duration-160 ${
                      activeImage === view ? 'ring-2 ring-[#1A1A1A] opacity-100' : 'opacity-50 hover:opacity-100'
                    }`}
                    aria-label={labels[view]}
                    aria-pressed={activeImage === view}
                  >
                    <ProductImage product={product} view={view} className="w-full h-full object-cover" loading="lazy" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Product info */}
          <div className="lg:pt-2">
            <div className="flex items-start justify-between mb-4">
              <span
                className="inline-block font-body text-[10px] font-semibold tracking-[0.2em] uppercase px-3 py-1 rounded-full text-[#FAF8F5]"
                style={{ backgroundColor: dropColor }}
              >
                Drop — {product.drop}
              </span>
              {/* Wishlist */}
              <button
                onClick={handleWishlist}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-[#E5E0D8] hover:border-[#1A1A1A] transition-colors"
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth="1.5"
                  fill={wishlisted ? '#EF4444' : 'none'}
                  stroke={wishlisted ? '#EF4444' : 'currentColor'}
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </button>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight mb-1">{product.title}</h1>
            <p className="font-body text-sm text-[#888] mb-4">{product.color}</p>
            <p className="font-display font-bold text-2xl mb-6">${product.price}</p>
            <p className="font-body text-sm text-[#555] leading-relaxed mb-8">{product.description}</p>

            {/* Size selector */}
            {product.sizes.length > 1 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="font-body text-xs font-semibold tracking-widest uppercase">
                    Size
                    {selectedSize && <span className="ml-2 font-normal normal-case tracking-normal text-[#888]">— {selectedSize}</span>}
                  </label>
                  <Link to="/size-guide" className="font-body text-xs text-[#AAA] hover:text-[#1A1A1A] transition-colors underline underline-offset-2">
                    Size Guide
                  </Link>
                </div>
                <div className="flex gap-2 flex-wrap" role="group" aria-label="Select size">
                  {product.sizes.map(size => {
                    const stock = getStock(product.id, size)
                    const outOfStock = stock === 0
                    const lowStock = stock > 0 && stock <= 5
                    return (
                      <button
                        key={size}
                        onClick={() => { if (!outOfStock) { setSelectedSize(size); setSizeError(false) } }}
                        disabled={outOfStock}
                        className={`relative font-body text-sm font-medium w-12 h-12 border rounded-sm transition-all duration-160 ${
                          outOfStock
                            ? 'opacity-30 cursor-not-allowed border-[#D8D3CC] line-through'
                            : selectedSize === size
                            ? 'bg-[#1A1A1A] text-[#FAF8F5] border-[#1A1A1A]'
                            : sizeError
                            ? 'border-red-400 hover:border-[#1A1A1A]'
                            : 'border-[#D8D3CC] hover:border-[#1A1A1A]'
                        }`}
                        aria-pressed={selectedSize === size}
                        aria-label={`Size ${size}${outOfStock ? ' — Out of Stock' : lowStock ? ` — Only ${stock} left` : ''}`}
                        title={outOfStock ? 'Out of stock' : lowStock ? `Only ${stock} left` : undefined}
                      >
                        {size}
                        {lowStock && !outOfStock && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full" />
                        )}
                      </button>
                    )
                  })}
                </div>
                {sizeError && <p className="font-body text-xs text-red-500 mt-2" role="alert">Please select a size.</p>}
                {selectedSize && getStock(product.id, selectedSize) <= 5 && getStock(product.id, selectedSize) > 0 && (
                  <p className="font-body text-xs text-orange-500 mt-2">
                    ⚡ Only {getStock(product.id, selectedSize)} left in {selectedSize}
                  </p>
                )}
              </div>
            )}

            {/* Add to cart + buy now */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className={`flex-1 font-display font-bold text-sm tracking-widest uppercase py-4 rounded-sm transition-all duration-160 ${
                  addedFeedback
                    ? 'bg-[#4A5E3A] text-[#FAF8F5] scale-[0.97]'
                    : 'bg-[#1A1A1A] text-[#FAF8F5] hover:bg-[#333] active:scale-[0.97]'
                }`}
              >
                {addedFeedback ? 'Added ✓' : 'Add to Cart'}
              </button>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-4 mt-5">
              {[
                { icon: '🔒', text: 'Secure checkout' },
                { icon: '↩️', text: '30-day returns' },
                { icon: '🚚', text: 'Free shipping $100+' },
              ].map(t => (
                <span key={t.text} className="flex items-center gap-1.5 font-body text-xs text-[#888]">
                  <span>{t.icon}</span>{t.text}
                </span>
              ))}
            </div>

            {/* Accordion details */}
            <div className="mt-10 border-t border-[#E5E0D8] pt-8 space-y-4">
              {[
                {
                  title: 'Details',
                  content: [
                    'Garment-dyed for vintage character',
                    'Embroidered hpm3® logo',
                    'Oversized / relaxed fit',
                    '100% heavyweight cotton (or premium fleece blend)',
                    'Made to order — ships in 5–7 business days',
                  ],
                },
                {
                  title: 'Shipping & Returns',
                  content: [
                    'Free shipping on orders over $100',
                    'Standard: 5–7 business days',
                    '30-day returns — see our Returns page',
                    'Items must be unworn and unwashed',
                  ],
                },
                {
                  title: 'Care Instructions',
                  content: [
                    'Machine wash cold, inside out',
                    'Tumble dry low or hang dry',
                    'Do not bleach or iron embroidery',
                    'Wash with similar colors',
                  ],
                },
              ].map(({ title, content }) => (
                <details key={title} className="group border-t border-[#E5E0D8] pt-4 first:border-t-0 first:pt-0">
                  <summary className="flex justify-between items-center font-body text-xs font-semibold tracking-widest uppercase cursor-pointer list-none hover:opacity-60 transition-opacity">
                    {title}
                    <span className="transition-transform group-open:rotate-45 text-lg leading-none">+</span>
                  </summary>
                  <div className="mt-4 space-y-2">
                    {content.map(line => (
                      <p key={line} className="font-body text-sm text-[#555] leading-relaxed">• {line}</p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-20 sm:mt-28">
            <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight mb-8">
              More from Drop {product.drop}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </main>
  )
}
