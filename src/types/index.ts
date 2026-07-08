export interface ProductImage {
  url: string
  altText?: string
}

export interface ProductVariant {
  id: string
  title: string
  price: string
  availableForSale: boolean
  selectedOptions: { name: string; value: string }[]
}

export interface Product {
  id: string
  handle: string
  title: string
  description: string
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string }
  }
  images: { edges: { node: ProductImage }[] }
  variants: { edges: { node: ProductVariant }[] }
  tags: string[]
}

export interface CartItem {
  sellingPlanId?: string
  subscriptionLabel?: string
  variantId: string
  productId: string
  title: string
  variantTitle: string
  price: number
  compareAt?: number
  quantity: number
  image: string
  handle: string
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { variantId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }

export interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address1: string
  address2: string
  city: string
  state: string
  zip: string
  country: string
}

export interface Order {
  id: string
  items: CartItem[]
  subtotal: number
  shipping: number
  discount: number
  total: number
  shippingAddress: ShippingAddress
  discountCode?: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  createdAt: string
}

export interface DiscountCode {
  code: string
  type: 'percent' | 'fixed'
  value: number
  minOrder?: number
  expiresAt?: string
}

// Local product data for fallback / pre-seeding
export interface ProductImages {
  primary: string   // flat-lay / product-only (catalog grid)
  lifestyle: string // on-model (hover state + ads)
  back: string      // back view angle
  detail: string    // logo / stitching close-up
}

export interface LocalProduct {
  id: string
  handle: string
  title: string
  drop: 'Sand' | 'Clay' | 'Fog'
  price: number
  sizes: string[]
  images: ProductImages
  /** @deprecated use images.primary */ imageProduct: string
  /** @deprecated use images.lifestyle */ imageModel: string
  color: string
  category: string
  description: string
  badge?: string
}
