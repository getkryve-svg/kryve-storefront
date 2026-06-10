import { useState } from 'react'
import { Link } from 'react-router-dom'

const FAQS = [
  {
    category: 'Shipping',
    items: [
      {
        q: 'How long does delivery take?',
        a: 'Standard shipping takes 3–5 business days after dispatch. Orders are processed in 1–2 business days. Free shipping on all orders over $100.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Currently we ship within the US. International shipping is coming soon. Sign up for our newsletter to be notified when your country goes live.',
      },
      {
        q: 'How much does shipping cost?',
        a: 'Flat rate $8 on orders under $100. Free shipping on orders $100+. Use code FREESHIP to get free shipping on any order.',
      },
      {
        q: 'Can I change my shipping address after ordering?',
        a: 'Email support@hpm3.com within 2 hours of placing your order and we\'ll do our best to update it before it ships.',
      },
    ],
  },
  {
    category: 'Returns & Exchanges',
    items: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in original condition with tags attached. See our Returns page for full details.',
      },
      {
        q: 'How do I start a return?',
        a: 'Email support@hpm3.com with your order number and reason for return. We\'ll send you a prepaid return label within 24 hours.',
      },
      {
        q: 'How long do refunds take?',
        a: 'Once we receive your return, refunds are processed within 3–5 business days. You\'ll receive an email confirmation when your refund is issued.',
      },
      {
        q: 'Can I exchange for a different size?',
        a: 'Yes. Mention the size you\'d like in your return request email. We\'ll ship the exchange within 2 business days of receiving your return.',
      },
    ],
  },
  {
    category: 'Sizing',
    items: [
      {
        q: 'How do hpm3® pieces fit?',
        a: 'All our garments are designed with an intentional oversized silhouette. If you prefer a closer fit, size down one. Check our Size Guide for exact measurements.',
      },
      {
        q: 'Do items run true to size?',
        a: 'Our tees and hoodies run about one size large by design. Bottoms run true to size. See the Size Guide for detailed measurements.',
      },
      {
        q: 'Is there a size guide?',
        a: 'Yes — check out our full Size Guide with measurements for every category.',
      },
    ],
  },
  {
    category: 'Products & Care',
    items: [
      {
        q: 'What materials are hpm3® products made from?',
        a: 'We use 100% heavyweight cotton for tees and tanks, premium fleece blends for hoodies and joggers. All fabrics are garment-dyed for a vintage feel.',
      },
      {
        q: 'How do I care for my hpm3® pieces?',
        a: 'Machine wash cold, inside out, with similar colors. Tumble dry low or hang dry. Do not bleach. Iron inside out on low if needed. Avoid the dryer for best longevity.',
      },
      {
        q: 'Will colors fade over time?',
        a: 'Garment-dyed pieces develop a beautiful vintage character with washes — that\'s intentional. Cold washing inside out preserves the color best.',
      },
    ],
  },
  {
    category: 'Orders & Payment',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards (Visa, Mastercard, Amex, Discover) via Stripe. All payments are encrypted and secure.',
      },
      {
        q: 'Can I use a discount code?',
        a: 'Yes — enter your code at checkout before proceeding to payment. Only one code per order. Try WELCOME10 for 10% off your first order.',
      },
      {
        q: 'I haven\'t received my order confirmation email.',
        a: 'Check your spam folder first. If it\'s not there, email support@hpm3.com with your name and order details and we\'ll resend it immediately.',
      },
      {
        q: 'Can I cancel my order?',
        a: 'Orders can be cancelled within 2 hours of placement. Email support@hpm3.com immediately with your order number.',
      },
    ],
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[#E5E0D8] last:border-b-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start justify-between py-5 text-left gap-4"
        aria-expanded={open}
      >
        <span className="font-display font-bold text-base text-[#1A1A1A]">{q}</span>
        <span
          className="text-xl font-light flex-shrink-0 mt-0.5 transition-transform duration-200"
          style={{ transform: open ? 'rotate(45deg)' : 'none' }}
        >+</span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? '300px' : '0', opacity: open ? 1 : 0 }}
      >
        <p className="font-body text-sm text-[#555] leading-relaxed pb-5">{a}</p>
      </div>
    </div>
  )
}

export default function FAQPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 bg-[#FAF8F5]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-[#8B6F47] mb-3">Help Center</p>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight mb-4">FAQs</h1>
          <p className="font-body text-sm text-[#888]">
            Can't find your answer?{' '}
            <Link to="/contact" className="text-[#1A1A1A] underline underline-offset-2 hover:opacity-60 transition-opacity">
              Contact us
            </Link>{' '}
            — we reply within 24 hours.
          </p>
        </div>

        {/* FAQ sections */}
        <div className="space-y-10">
          {FAQS.map(section => (
            <div key={section.category}>
              <h2 className="font-display font-bold text-xl tracking-tight mb-4 pb-3 border-b-2 border-[#1A1A1A]">
                {section.category}
              </h2>
              <div className="bg-white rounded-lg border border-[#E5E0D8] px-5 divide-y divide-[#E5E0D8]">
                {section.items.map(item => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still need help */}
        <div className="mt-14 text-center bg-[#1A1A1A] rounded-lg p-8">
          <h3 className="font-display font-bold text-xl text-white mb-2">Still need help?</h3>
          <p className="font-body text-sm text-white/60 mb-6">Our team replies within 24 hours.</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 font-display font-bold text-sm tracking-widest uppercase px-8 py-3.5 bg-white text-[#1A1A1A] rounded-sm hover:bg-[#EDE8E2] transition-colors"
          >
            Contact Support →
          </Link>
        </div>
      </div>
    </main>
  )
}
