import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { LocalProduct } from '../types'
import { DROP_COLORS } from '../data/products'
import { toggleWishlist, isWishlisted } from '../lib/wishlist'
import { getStock } from '../lib/inventory'
import ProductImage from './ProductImage'

interface Props {
  product: LocalProduct
  onQuickAdd?: (product: LocalProduct) => void
}

export default function ProductCard({ product, onQuickAdd }: Props) {
  const [hovered, setHovered]     = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const dropColor = DROP_COLORS[product.drop]

  useEffect(() => { setWishlisted(isWishlisted(product.id)) }, [product.id])

  // Check if any size is in stock (for the card-level out-of-stock state)
  const totalStock = product.sizes.reduce((sum, s) => sum + getStock(product.id, s), 0)
  const isOutOfStock = totalStock === 0
  const isLowStock   = !isOutOfStock && totalStock <= 10

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const added = toggleWishlist(product.id)
    setWishlisted(added)
  }

  // Resolve badge label: product.badge overrides BADGES map
  const badgeLabel = product.badge ?? null

  return (
    <article
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container */}
      <Link
        to={`/products/${product.handle}`}
        className="block relative overflow-hidden bg-[#EDE8E2] rounded-sm aspect-[4/5] transition-transform duration-200 ease-out group-hover:scale-[1.02]"
        aria-label={`${product.title} — Drop ${product.drop}`}
      >
        {/* Product shot */}
        <ProductImage
          product={product}
          view="product"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ease-out ${hovered && !isOutOfStock ? 'opacity-0' : 'opacity-100'}`}
          loading="lazy"
        />
        {/* On-model shot (hover) */}
        <ProductImage
          product={product}
          view="model"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ease-out ${hovered && !isOutOfStock ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
        />

        {/* Out-of-stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <span className="font-display font-bold text-xs tracking-widest uppercase px-3 py-1.5 bg-white text-[#888] border border-[#D8D3CC] rounded-sm">
              Out of Stock
            </span>
          </div>
        )}

        {/* Badges — top left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span
            className="font-body text-[10px] font-semibold tracking-[0.15em] uppercase px-2 py-0.5 rounded-full text-[#FAF8F5]"
            style={{ backgroundColor: dropColor }}
          >
            {product.drop}
          </span>
          {badgeLabel && (
            <span className="font-body text-[10px] font-semibold tracking-[0.12em] uppercase px-2 py-0.5 rounded-full bg-[#1A1A1A] text-[#FAF8F5]">
              {badgeLabel}
            </span>
          )}
          {isLowStock && !badgeLabel && (
            <span className="font-body text-[10px] font-semibold tracking-[0.12em] uppercase px-2 py-0.5 rounded-full bg-orange-500 text-white">
              Low Stock
            </span>
          )}
        </div>

        {/* Wishlist heart — top right */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 ${
            wishlisted
              ? 'bg-white shadow-sm opacity-100'
              : 'bg-white/70 opacity-0 group-hover:opacity-100 hover:bg-white hover:shadow-sm'
          }`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            width="14" height="14" viewBox="0 0 24 24" strokeWidth="1.8"
            fill={wishlisted ? '#EF4444' : 'none'}
            stroke={wishlisted ? '#EF4444' : '#555'}
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>
      </Link>

      {/* Info row */}
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link to={`/products/${product.handle}`}>
            <h3 className="font-display font-semibold text-sm leading-snug hover:opacity-60 transition-opacity truncate">
              {product.title}
            </h3>
          </Link>
          <p className="font-body text-xs text-[#888] mt-0.5 truncate">{product.color}</p>
        </div>
        <p className="font-body font-medium text-sm shrink-0">${product.price}</p>
      </div>

      {/* Quick Add / Select Size */}
      {!isOutOfStock && onQuickAdd && (
        product.sizes.length > 1 ? (
          <Link
            to={`/products/${product.handle}`}
            className={`mt-2 w-full block text-center font-body text-xs font-semibold tracking-widest uppercase py-2.5 border border-[#1A1A1A] rounded-sm transition-all duration-160 hover:bg-[#1A1A1A] hover:text-[#FAF8F5] active:scale-[0.97] ${
              hovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            Select Size
          </Link>
        ) : (
          <button
            onClick={() => onQuickAdd(product)}
            className={`mt-2 w-full font-body text-xs font-semibold tracking-widest uppercase py-2.5 border border-[#1A1A1A] rounded-sm transition-all duration-160 hover:bg-[#1A1A1A] hover:text-[#FAF8F5] active:scale-[0.97] ${
              hovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            Quick Add
          </button>
        )
      )}
    </article>
  )
}
