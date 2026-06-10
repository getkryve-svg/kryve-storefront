import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import type { ShippingAddress, DiscountCode } from '../types'

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
]

const EMPTY: ShippingAddress = {
  firstName: '', lastName: '', email: '', phone: '',
  address1: '', address2: '', city: '', state: '', zip: '', country: 'US',
}

export default function CheckoutPage() {
  const { state: cartState, subtotal } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const { discount, discountAmount = 0, shipping = 8, total } = (location.state || {}) as {
    discount?: DiscountCode | null
    discountAmount?: number
    shipping?: number
    total?: number
  }

  const orderTotal = total ?? subtotal + shipping - discountAmount
  const [addr, setAddr] = useState<ShippingAddress>(EMPTY)
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({})
  const [sameAsBilling, setSameAsBilling] = useState(true)

  function set(field: keyof ShippingAddress, value: string) {
    setAddr(a => ({ ...a, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  function validate(): boolean {
    const e: Partial<ShippingAddress> = {}
    if (!addr.firstName.trim()) e.firstName = 'Required'
    if (!addr.lastName.trim())  e.lastName  = 'Required'
    if (!addr.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr.email)) e.email = 'Valid email required'
    if (!addr.address1.trim()) e.address1 = 'Required'
    if (!addr.city.trim())     e.city     = 'Required'
    if (!addr.state)           e.state    = 'Required'
    if (!addr.zip.trim())      e.zip      = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleContinue() {
    if (!validate()) return
    navigate('/payment', {
      state: { shippingAddress: addr, discount, discountAmount, shipping, total: orderTotal },
    })
  }

  if (cartState.items.length === 0) {
    return (
      <main className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="font-body text-[#888] mb-4">Your cart is empty.</p>
          <Link to="/shop" className="font-display font-bold text-sm underline">Shop now</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-20 pb-16 bg-[#FAF8F5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Progress breadcrumb */}
        <div className="flex items-center gap-2 font-body text-xs text-[#AAA] mb-10 pt-4">
          <Link to="/cart" className="hover:text-[#1A1A1A] transition-colors">Cart</Link>
          <span>›</span>
          <span className="text-[#1A1A1A] font-semibold">Shipping</span>
          <span>›</span>
          <span>Payment</span>
          <span>›</span>
          <span>Confirmation</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
          {/* Form */}
          <div>
            <h1 className="font-display font-black text-2xl tracking-tight mb-6">Shipping Information</h1>

            <div className="space-y-5">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="First Name" error={errors.firstName}>
                  <input value={addr.firstName} onChange={e => set('firstName', e.target.value)}
                    className={inputCls(!!errors.firstName)} placeholder="Jeremy" />
                </Field>
                <Field label="Last Name" error={errors.lastName}>
                  <input value={addr.lastName} onChange={e => set('lastName', e.target.value)}
                    className={inputCls(!!errors.lastName)} placeholder="Smith" />
                </Field>
              </div>

              <Field label="Email Address" error={errors.email}>
                <input type="email" value={addr.email} onChange={e => set('email', e.target.value)}
                  className={inputCls(!!errors.email)} placeholder="you@example.com" />
              </Field>

              <Field label="Phone (optional)">
                <input type="tel" value={addr.phone} onChange={e => set('phone', e.target.value)}
                  className={inputCls(false)} placeholder="+1 (555) 000-0000" />
              </Field>

              <Field label="Address" error={errors.address1}>
                <input value={addr.address1} onChange={e => set('address1', e.target.value)}
                  className={inputCls(!!errors.address1)} placeholder="123 Main Street" />
              </Field>

              <Field label="Apartment, suite, etc. (optional)">
                <input value={addr.address2} onChange={e => set('address2', e.target.value)}
                  className={inputCls(false)} placeholder="Apt 4B" />
              </Field>

              <div className="grid grid-cols-[1fr_100px_110px] gap-4">
                <Field label="City" error={errors.city}>
                  <input value={addr.city} onChange={e => set('city', e.target.value)}
                    className={inputCls(!!errors.city)} placeholder="New York" />
                </Field>
                <Field label="State" error={errors.state}>
                  <select value={addr.state} onChange={e => set('state', e.target.value)}
                    className={inputCls(!!errors.state)}>
                    <option value="">—</option>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="ZIP" error={errors.zip}>
                  <input value={addr.zip} onChange={e => set('zip', e.target.value)}
                    className={inputCls(!!errors.zip)} placeholder="10001" maxLength={10} />
                </Field>
              </div>

              {/* Billing toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sameAsBilling}
                  onChange={e => setSameAsBilling(e.target.checked)}
                  className="w-4 h-4 rounded border-[#D8D3CC] accent-[#1A1A1A]"
                />
                <span className="font-body text-sm text-[#555]">Billing address same as shipping</span>
              </label>
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#E5E0D8]">
              <Link to="/cart" className="font-body text-sm text-[#AAA] hover:text-[#1A1A1A] transition-colors flex items-center gap-1">
                ← Back to cart
              </Link>
              <button
                onClick={handleContinue}
                className="font-display font-bold text-sm tracking-widest uppercase px-10 py-4 bg-[#1A1A1A] text-white rounded-sm hover:bg-[#333] active:scale-[0.98] transition-all duration-150"
              >
                Continue to Payment →
              </button>
            </div>
          </div>

          {/* Order summary sidebar */}
          <OrderSummary
            items={cartState.items}
            subtotal={subtotal}
            discountAmount={discountAmount}
            discount={discount}
            shipping={shipping}
            total={orderTotal}
          />
        </div>
      </div>
    </main>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function inputCls(hasError: boolean) {
  return `w-full font-body text-sm px-3 py-3 border rounded-sm focus:outline-none transition-colors ${
    hasError ? 'border-red-400 focus:border-red-500' : 'border-[#D8D3CC] focus:border-[#1A1A1A]'
  }`
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-body text-xs font-semibold tracking-widest uppercase text-[#555] block mb-1.5">{label}</label>
      {children}
      {error && <p className="font-body text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

function OrderSummary({ items, subtotal, discountAmount, discount, shipping, total }: {
  items: import('../types').CartItem[]
  subtotal: number
  discountAmount: number
  discount?: import('../types').DiscountCode | null
  shipping: number
  total: number
}) {
  return (
    <div className="bg-white rounded-lg border border-[#E5E0D8] p-5 h-fit sticky top-24">
      <h2 className="font-display font-bold text-base tracking-tight mb-4">Order Summary</h2>
      <div className="space-y-3 mb-4">
        {items.map(item => (
          <div key={item.variantId} className="flex gap-3 items-start">
            <div className="relative">
              <div className="w-12 h-12 rounded-md overflow-hidden bg-[#EDE8E2] flex-shrink-0">
                {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
              </div>
              <span className="absolute -top-1.5 -right-1.5 bg-[#1A1A1A] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-xs truncate">{item.title}</p>
              <p className="font-body text-[11px] text-[#AAA]">{item.variantTitle}</p>
            </div>
            <p className="font-display font-bold text-xs flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-[#E5E0D8] pt-4 space-y-2 text-sm font-body">
        <div className="flex justify-between text-[#555]">
          <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-[#10B981]">
            <span>{discount?.code}</span><span>−${discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-[#555]">
          <span>Shipping</span>
          <span>{shipping === 0 ? <span className="text-[#10B981]">Free</span> : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between font-display font-bold text-base border-t border-[#E5E0D8] pt-2 mt-2">
          <span>Total</span><span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
