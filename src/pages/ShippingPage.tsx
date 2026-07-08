export default function ShippingPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 bg-[#FAF8F5]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-[#8B6F47] mb-3">Policies</p>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight mb-4">Shipping Policy</h1>
          <p className="font-body text-sm text-[#888]">Fast, tracked delivery across the United States.</p>
        </div>

        <div className="space-y-8">
          <div className="bg-white border border-[#E5E0D8] rounded-lg p-6">
            <h2 className="font-display font-bold text-xl tracking-tight mb-4">Processing & Delivery</h2>
            <ul className="space-y-2">
              {[
                'Orders are processed within 1–3 business days.',
                'Standard delivery: 5–8 business days after processing.',
                'You will receive a tracking link by email as soon as your order ships.',
                'Orders are shipped Monday–Friday, excluding US holidays.',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 font-body text-sm text-[#555]">
                  <span className="text-[#10B981] font-bold">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-[#E5E0D8] rounded-lg p-6">
            <h2 className="font-display font-bold text-xl tracking-tight mb-4">Shipping Rates</h2>
            <ul className="space-y-2">
              {[
                'FREE standard shipping on all orders of $75 or more.',
                'FREE standard shipping on every Ritual Membership (subscription) order.',
                'Orders under $75 ship at the carrier rate shown at checkout.',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 font-body text-sm text-[#555]">
                  <span className="text-[#10B981] font-bold">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-[#E5E0D8] rounded-lg p-6">
            <h2 className="font-display font-bold text-xl tracking-tight mb-4">Coverage & Issues</h2>
            <p className="font-body text-sm text-[#555] leading-relaxed mb-3">
              We currently ship to all 50 US states. If your order arrives damaged, is lost in transit,
              or hasn&apos;t arrived within 15 business days, contact us and we&apos;ll replace it or refund
              you in full — your choice.
            </p>
            <p className="font-body text-sm text-[#555] leading-relaxed">
              Questions? Reach us any time via the <a href="/contact" className="text-[#8B6F47] underline">contact page</a>.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
