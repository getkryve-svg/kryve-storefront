import { useState } from 'react'
import { Link } from 'react-router-dom'

const FAQS = [
  {
    category: 'Shipping',
    items: [
      {
        q: 'How long does delivery take?',
        a: 'Standard shipping takes 3–5 business days after dispatch. Orders are processed in 1–2 business days. Free shipping on all orders over $75.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Currently we ship within the US. International shipping is coming soon. Sign up for our newsletter to be notified when your country goes live.',
      },
      {
        q: 'How much does shipping cost?',
        a: 'Flat rate $8 on orders under $75. Free shipping on orders $75+. Use code WELCOME10 for 10% off your first order.',
      },
      {
        q: 'Can I change my shipping address after ordering?',
        a: 'Email getkryve@gmail.com within 2 hours of placing your order and we\'ll do our best to update it before it ships.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    items: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 30-day money-back guarantee. If you\'re not satisfied with your KRYVE product for any reason, contact us within 30 days of delivery for a full refund — no questions asked.',
      },
      {
        q: 'How do I start a return?',
        a: 'Email getkryve@gmail.com with your order number and reason for return. We\'ll process your refund within 24 hours — no need to ship the product back.',
      },
      {
        q: 'How long do refunds take?',
        a: 'Refunds are processed within 3–5 business days. You\'ll receive an email confirmation when your refund is issued.',
      },
      {
        q: 'Do I need to return the product?',
        a: 'No. Our 30-day guarantee is hassle-free — we issue your refund without requiring you to ship the product back.',
      },
    ],
  },
  {
    category: 'Products & Supplements',
    items: [
      {
        q: 'Are KRYVE supplements third-party tested?',
        a: 'Yes. Every batch of KRYVE Greens, Collagen, and Magnesium is third-party tested for purity and potency. Certificates of analysis are available on request.',
      },
      {
        q: 'Where are KRYVE supplements manufactured?',
        a: 'All KRYVE formulas are manufactured in the USA in a GMP-certified (Good Manufacturing Practice) facility, meeting the highest standards for quality and safety.',
      },
      {
        q: 'Are KRYVE products safe to take together?',
        a: 'Yes — KRYVE Greens, Collagen, and Magnesium are designed to complement each other as a complete daily protocol. The KRYVE Stack combines all three for maximum benefit.',
      },
      {
        q: 'Do KRYVE products contain allergens?',
        a: 'KRYVE Greens and Magnesium are gluten-free. KRYVE Collagen is derived from grass-fed bovine. Please review the full ingredient list on each product page, and consult your doctor if you have specific allergies or medical conditions.',
      },
    ],
  },
  {
    category: 'Dosage & Usage',
    items: [
      {
        q: 'When should I take KRYVE Greens?',
        a: 'Take one scoop of KRYVE Greens each morning — mixed into water, a smoothie, or juice — to start your day with foundational nutrition and clean energy.',
      },
      {
        q: 'When should I take KRYVE Collagen?',
        a: 'Mix one scoop of KRYVE Collagen into coffee, tea, a smoothie, or any liquid at any time of day. It\'s unflavored and dissolves completely in hot or cold liquids.',
      },
      {
        q: 'When should I take KRYVE Magnesium?',
        a: 'Take 2 capsules of KRYVE Magnesium Glycinate 30–60 minutes before bed for optimal sleep support and overnight muscle recovery.',
      },
      {
        q: 'How long until I see results?',
        a: 'Most customers notice improved energy and digestion within 1–2 weeks of KRYVE Greens. Collagen benefits are typically felt within 4–8 weeks. Magnesium sleep support is often noticed within the first few nights.',
      },
    ],
  },
  {
    category: 'Subscribe & Save',
    items: [
      {
        q: 'What is the Subscribe & Save option?',
        a: 'Subscribe & Save lets you receive your KRYVE supplements automatically every month and save 15% on every order. You can cancel, pause, or modify your subscription at any time.',
      },
      {
        q: 'How do I manage my subscription?',
        a: 'Log into your KRYVE account to pause, skip, change frequency, or cancel your subscription at any time — no fees, no commitments.',
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
        a: 'Check your spam folder first. If it\'s not there, email getkryve@gmail.com with your name and order details and we\'ll resend it immediately.',
      },
      {
        q: 'Can I cancel my order?',
        a: 'Orders can be cancelled within 2 hours of placement. Email getkryve@gmail.com immediately with your order number.',
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
