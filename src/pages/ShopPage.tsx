import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import {
  STATIC_PRODUCTS, formatPrice, getProductCardClass,
  getBadgeText, getProductBadgeClass, getProductCtaClass,
  type ShopifyProduct
} from '../lib/shopify'
import type { CartItem } from '../types'

const FILTER_OPTIONS = ['All', 'Greens', 'Collagen', 'Magnesium', 'Bundles']

function matchesFilter(handle: string, filter: string) {
  if (filter === 'All') return true
  if (filter === 'Greens')    return handle.includes('greens')
  if (filter === 'Collagen')  return handle.includes('collagen')
  if (filter === 'Magnesium') return handle.includes('magnesium')
  if (filter === 'Bundles')   return handle.includes('stack')
  return true
}

export default function ShopPage() {
  const { addItem } = useCart()
  const [filter, setFilter] = useState('All')

  const products = (STATIC_PRODUCTS as unknown as ShopifyProduct[]).filter(p =>
    matchesFilter(p.handle, filter)
  )

  function handleAddToCart(product: typeof STATIC_PRODUCTS[number]) {
    const variant = product.variants.edges[0]?.node
    if (!variant) return
    const item: CartItem = {
      variantId: variant.id,
      productId: product.id,
      title: product.title,
      variantTitle: variant.title,
      price: parseFloat(variant.price.amount),
      quantity: 1,
      image: product.images.edges[0]?.node.url || '',
      handle: product.handle,
    }
    addItem(item as unknown as CartItem)
  }

  return (
    <div className="kv-shop">
      <div className="kv-shop-header">
        <p className="kv-eyebrow">THE LINE</p>
        <h1 className="kv-shop-title">SHOP ALL KRYVE</h1>
        <p className="kv-shop-sub">Science-backed formulas engineered for performance. Every batch third-party tested.</p>
      </div>

      {/* Filters */}
      <div className="kv-shop-filters">
        {FILTER_OPTIONS.map(f => (
          <button
            key={f}
            className={`kv-shop-filter-btn${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="kv-products-grid kv-shop-grid">
        {products.map(product => {
          const img1 = product.images.edges[0]?.node.url || ''
          const img2 = product.images.edges[1]?.node.url || img1
          const price = product.variants.edges[0]?.node.price.amount || product.priceRange.minVariantPrice.amount
          const compareAt = product.variants.edges[0]?.node.compareAtPrice?.amount

          return (
            <div key={product.id} className={`kv-pcard ${getProductCardClass(product.handle)}`}>
              <Link to={`/products/${product.handle}`} className="kv-pcard-img-wrap">
                <img src={img1} alt={product.title} className="kv-pcard-img kv-pcard-img-primary" loading="lazy" />
                <img src={img2} alt={product.title} className="kv-pcard-img kv-pcard-img-hover" loading="lazy" />
                <span className={`kv-pcard-badge ${getProductBadgeClass(product.handle)}`}>
                  {getBadgeText(product.handle)}
                </span>
              </Link>
              <div className="kv-pcard-body">
                <h2 className="kv-pcard-title">
                  <Link to={`/products/${product.handle}`}>{product.title}</Link>
                </h2>
                <p className="kv-pcard-desc">{product.description}</p>
                <div className="kv-pcard-price-row">
                  <span className="kv-pcard-price">{formatPrice(price)}</span>
                  {compareAt && parseFloat(compareAt) > parseFloat(price) && (
                    <span className="kv-pcard-compare">{formatPrice(compareAt)}</span>
                  )}
                </div>
                <button
                  className={`kv-pcard-cta ${getProductCtaClass(product.handle)}`}
                  onClick={() => handleAddToCart(product as unknown as typeof STATIC_PRODUCTS[number])}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#666' }}>
          <p>No products match this filter.</p>
        </div>
      )}

      {/* Guarantee strip */}
      <div className="kv-shop-guarantee">
        <span>🔒 30-Day Money-Back Guarantee</span>
        <span>🚚 Free Shipping $75+</span>
        <span>🔬 Third-Party Tested</span>
        <span>🇺🇸 Made in USA</span>
      </div>
    </div>
  )
}
