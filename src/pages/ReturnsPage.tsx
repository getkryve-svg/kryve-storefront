import { Link } from 'react-router-dom'

export default function ReturnsPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 bg-[#FAF8F5]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-[#8B6F47] mb-3">Policies</p>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight mb-4">Returns & Refunds</h1>
          <p className="font-body text-sm text-[#888]">We stand behind every formula. If you're not fully satisfied, we'll make it right.</p>
        </div>

        <div className="space-y-8">
          {/* Return window */}
          <div className="bg-white border border-[#E5E0D8] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#10B981]/15 flex items-center justify-center">
                <span className="text-lg">↩️</span>
              </div>
              <h2 className="font-display font-bold text-xl tracking-tight">30-Day Returns</h2>
            </div>
            <p className="font-body text-sm text-[#555] leading-relaxed mb-3">
              Return any KRYVE product within <strong>30 days of delivery</strong> for a full refund. No questions asked — your satisfaction is 100% guaranteed.
            </p>
            <div className="bg-[#F5F1ED] rounded-md p-4">
              <p className="font-body text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Eligible returns:</p>
              <ul className="space-y-1">
                {['Unopened / factory-sealed products', 'Opened products within 30 days', 'Any reason — no questions asked', 'No return shipment required'].map(item => (
                  <li key={item} className="flex items-center gap-2 font-body text-sm text-[#555]">
                    <span className="text-[#10B981] font-bold">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* How to return */}
          <div className="bg-white border border-[#E5E0D8] rounded-lg p-6">
            <h2 className="font-display font-bold text-xl tracking-tight mb-5">How to Start a Return</h2>
            <div className="space-y-4">
              {[
                { step: '1', title: 'Email us', body: 'Send your order number and reason to getkryve@gmail.com. We\'ll respond within 24 hours.' },
                { step: '2', title: 'We confirm', body: 'We\'ll reply within 24 hours to confirm your refund. No need to ship the product back.' },
                { step: '3', title: 'Refund processed', body: 'Your refund is issued to your original payment method within 3–5 business days.' },
                { step: '4', title: 'Done', body: 'You\'ll receive an email confirmation once your refund is on its way.' },
              ].map(({ step, title, body }) => (
                <div key={step} className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center flex-shrink-0 font-display font-bold text-xs mt-0.5">
                    {step}
                  </div>
                  <div>
                    <p className="font-display font-bold text-sm mb-0.5">{title}</p>
                    <p className="font-body text-sm text-[#555]">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Refund timeline */}
          <div className="bg-white border border-[#E5E0D8] rounded-lg p-6">
            <h2 className="font-display font-bold text-xl tracking-tight mb-4">Refund Timeline</h2>
            <div className="space-y-3">
              {[
                { label: 'Return received & inspected', time: '1–2 business days' },
                { label: 'Refund processed', time: '3–5 business days' },
                { label: 'Appears on statement', time: 'Up to 10 business days (bank dependent)' },
              ].map(({ label, time }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-[#F5F1ED] last:border-b-0">
                  <span className="font-body text-sm text-[#555]">{label}</span>
                  <span className="font-body text-xs font-semibold text-[#888]">{time}</span>
                </div>
              ))}
            </div>
            <p className="font-body text-xs text-[#AAA] mt-4">
              Refunds are issued to the original payment method only.
            </p>
          </div>

          {/* Non-returnable */}
          <div className="border border-amber-200 bg-amber-50 rounded-lg p-5">
            <h3 className="font-display font-bold text-base mb-2 text-amber-800">Non-Returnable Items</h3>
            <ul className="space-y-1">
              {['Items returned after 30 days', 'Products purchased from unauthorized third-party sellers', 'Final sale items (marked at checkout)'].map(item => (
                <li key={item} className="flex items-center gap-2 font-body text-sm text-amber-700">
                  <span>·</span> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center pt-4">
            <p className="font-body text-sm text-[#888] mb-4">Ready to start a return or have questions?</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 font-display font-bold text-sm tracking-widest uppercase px-8 py-4 bg-[#1A1A1A] text-white rounded-sm hover:bg-[#333] transition-colors"
            >
              Contact Support →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
