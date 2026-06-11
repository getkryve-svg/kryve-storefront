import { useState } from 'react'
import type { LocalProduct } from '../types'
import { DROP_COLORS } from '../data/products'

// Rich per-product background tones derived from each colorway
const PRODUCT_BG: Record<string, string> = {
  // Sand drop
  'sand-tee':        '#E5D9C8',
  'sand-hoodie':     '#C9B09A',
  'sand-joggers':    '#E5D9C8',
  'sand-cap':        '#C9B09A',
  'sand-tank':       '#E5D9C8',
  'sand-sleeveless': '#C9B09A',
  // Clay drop
  'clay-tee':        '#D4886E',
  'clay-hoodie':     '#EBE2D8',
  'clay-joggers':    '#7A5644',
  'clay-cap':        '#D4886E',
  'clay-tank':       '#EBE2D8',
  'clay-sleeveless': '#7A5644',
  // Fog drop
  'fog-tee':         '#C8C3BC',
  'fog-hoodie':      '#B0ABA5',
  'fog-joggers':     '#A8B5A0',
  'fog-cap':         '#B0ABA5',
  'fog-tank':        '#C8C3BC',
  'fog-sleeveless':  '#A8B5A0',
}

const PRODUCT_TEXT: Record<string, string> = {
  'sand-tee': '#9A7D5E', 'sand-hoodie': '#FAF8F5', 'sand-joggers': '#9A7D5E',
  'sand-cap': '#FAF8F5', 'sand-tank': '#9A7D5E', 'sand-sleeveless': '#FAF8F5',
  'clay-tee': '#FAF8F5', 'clay-hoodie': '#C1694F', 'clay-joggers': '#FAF8F5',
  'clay-cap': '#FAF8F5', 'clay-tank': '#C1694F', 'clay-sleeveless': '#FAF8F5',
  'fog-tee': '#6B6560', 'fog-hoodie': '#FAF8F5', 'fog-joggers': '#FAF8F5',
  'fog-cap': '#FAF8F5', 'fog-tank': '#6B6560', 'fog-sleeveless': '#FAF8F5',
}

// SVG silhouettes per category
const SILHOUETTE: Record<string, string> = {
  Tee: `<svg viewBox="0 0 80 90" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 8 L0 28 L12 34 L12 82 L68 82 L68 34 L80 28 L60 8 L50 18 C48 26 32 26 30 18 Z" opacity="0.18"/>
  </svg>`,
  Hoodie: `<svg viewBox="0 0 80 90" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 8 C18 12 8 16 0 28 L12 34 L12 82 L68 82 L68 34 L80 28 C72 16 62 12 60 8 C54 22 26 22 20 8 Z M34 10 C36 18 44 18 46 10 L46 28 L34 28 Z" opacity="0.18"/>
  </svg>`,
  Bottoms: `<svg viewBox="0 0 80 90" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 8 L8 48 L32 88 L40 88 L44 55 L48 88 L56 88 L72 48 L72 8 Z" opacity="0.18"/>
  </svg>`,
  Tank: `<svg viewBox="0 0 80 90" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M28 8 L4 24 L14 32 L14 82 L66 82 L66 32 L76 24 L52 8 C50 16 30 16 28 8 Z" opacity="0.18"/>
  </svg>`,
  Accessories: `<svg viewBox="0 0 80 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 28 C10 14 20 6 40 6 C60 6 70 14 70 28 L70 38 C70 44 65 48 40 48 C15 48 10 44 10 38 Z" opacity="0.18"/>
    <rect x="8" y="30" width="64" height="8" rx="4" opacity="0.18"/>
  </svg>`,
}

interface Props {
  product: LocalProduct
  /** 'product'/'primary' | 'model'/'lifestyle' | 'back' | 'detail' */
  view: 'product' | 'model' | 'primary' | 'lifestyle' | 'back' | 'detail'
  className?: string
  loading?: 'lazy' | 'eager'
  imgStyle?: React.CSSProperties
}

const VIEW_LABELS: Record<string, string> = {
  product: 'product shot', primary: 'product shot',
  model: 'on model', lifestyle: 'on model',
  back: 'back view', detail: 'detail close-up',
}

// Vercel image optimization — converts PNG→WebP, resizes, compresses
// Falls back to original URL in dev (localhost) or if optimization fails
function optimizeUrl(url: string, width = 800): string {
  if (!url) return url
  // Only optimize on Vercel (not localhost)
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') return url
  return `/_vercel/image?url=${encodeURIComponent(url)}&w=${width}&q=80`
}

export default function ProductImage({ product, view, className = '', loading = 'lazy', imgStyle }: Props) {
  const rawSrc = (() => {
    if (view === 'back')    return product.images?.back    ?? ''
    if (view === 'detail')  return product.images?.detail  ?? ''
    if (view === 'lifestyle' || view === 'model') return product.images?.lifestyle ?? product.imageModel ?? ''
    return product.images?.primary ?? product.imageProduct ?? ''
  })()
  const src = optimizeUrl(rawSrc)
  const [failed, setFailed] = useState(!rawSrc) // empty URL = instant placeholder
  const alt = `${product.title} — ${VIEW_LABELS[view] ?? view}`

  if (failed) {
    const bg = PRODUCT_BG[product.id] ?? '#E8E2D8'
    const fg = PRODUCT_TEXT[product.id] ?? '#666'
    const silhouette = SILHOUETTE[product.category] ?? SILHOUETTE.Tee
    const dropColor = DROP_COLORS[product.drop]

    return (
      <div
        className={`flex flex-col items-center justify-center relative overflow-hidden select-none ${className}`}
        style={{ backgroundColor: bg }}
        aria-label={alt}
        role="img"
      >
        {/* Large silhouette background */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ color: fg }}
          dangerouslySetInnerHTML={{ __html: `<div style="width:65%;height:65%;opacity:1">${silhouette}</div>` }}
        />

        {/* Center text */}
        <div className="relative z-10 flex flex-col items-center gap-1 text-center px-4">
          <span
            className="font-display font-black text-[clamp(18px,4vw,28px)] tracking-tight leading-tight"
            style={{ color: fg }}
          >
            {product.title}
          </span>
          <span
            className="font-body text-[10px] tracking-[0.22em] uppercase mt-1"
            style={{ color: fg, opacity: 0.6 }}
          >
            {product.color}
          </span>
          <span
            className="font-body text-[9px] font-bold tracking-[0.25em] uppercase mt-2 px-2.5 py-1 rounded-full text-[#FAF8F5]"
            style={{ backgroundColor: dropColor }}
          >
            Drop — {product.drop}
          </span>
        </div>

        {/* Watermark logo */}
        <span
          className="absolute bottom-4 right-4 font-display font-black text-[11px] tracking-tight"
          style={{ color: fg, opacity: 0.25 }}
        >
          hpm3®
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ objectFit: 'cover', objectPosition: 'center', ...imgStyle }}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}
