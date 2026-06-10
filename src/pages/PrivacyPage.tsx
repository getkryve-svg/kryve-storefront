import { Link } from 'react-router-dom'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 bg-[#FAF8F5]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="font-body text-xs tracking-widest uppercase text-[#888] mb-3">Legal</p>
          <h1 className="font-display font-black text-4xl tracking-tight">Privacy Policy</h1>
          <p className="font-body text-sm text-[#888] mt-3">Last updated: January 1, 2026</p>
        </div>

        <div className="prose-hpm3 space-y-10 font-body text-[#555] text-sm leading-relaxed">

          <section>
            <h2 className="font-display font-bold text-lg text-[#1A1A1A] mb-3">1. Information We Collect</h2>
            <p className="mb-3">When you shop at hpm3®, we collect information you provide directly:</p>
            <ul className="space-y-2 ml-4">
              <li>• <strong>Account information:</strong> Name, email address, and password when you create an account.</li>
              <li>• <strong>Order information:</strong> Shipping address, billing address, and payment details (processed securely by Stripe — we never store your card number).</li>
              <li>• <strong>Communications:</strong> Messages you send us via our contact form or email.</li>
              <li>• <strong>Newsletter:</strong> Email address if you subscribe to our mailing list.</li>
            </ul>
            <p className="mt-3">We also collect information automatically:</p>
            <ul className="space-y-2 ml-4 mt-2">
              <li>• <strong>Usage data:</strong> Pages visited, time on site, referring URLs (via Google Analytics 4).</li>
              <li>• <strong>Device data:</strong> Browser type, IP address, device type.</li>
              <li>• <strong>Cookies:</strong> Session cookies for cart persistence and analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[#1A1A1A] mb-3">2. How We Use Your Information</h2>
            <ul className="space-y-2 ml-4">
              <li>• Process and fulfill your orders</li>
              <li>• Send order confirmation and shipping notifications</li>
              <li>• Respond to customer service inquiries</li>
              <li>• Send marketing emails (only if you opted in — unsubscribe at any time)</li>
              <li>• Improve our website and product offerings</li>
              <li>• Prevent fraud and ensure security</li>
              <li>• Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[#1A1A1A] mb-3">3. Sharing Your Information</h2>
            <p className="mb-3">We do not sell your personal information. We share data only with:</p>
            <ul className="space-y-2 ml-4">
              <li>• <strong>Stripe:</strong> Payment processing. Stripe's privacy policy applies to payment data.</li>
              <li>• <strong>Shipping carriers:</strong> Your address is shared with our shipping partners to deliver orders.</li>
              <li>• <strong>Analytics providers:</strong> Google Analytics and Meta Pixel receive anonymized usage data.</li>
              <li>• <strong>Legal requirements:</strong> We may disclose information when required by law.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[#1A1A1A] mb-3">4. Cookies</h2>
            <p className="mb-3">We use cookies for:</p>
            <ul className="space-y-2 ml-4">
              <li>• <strong>Essential cookies:</strong> Cart contents, session authentication (required for site to function).</li>
              <li>• <strong>Analytics cookies:</strong> Google Analytics to understand site usage (you can opt out via browser settings).</li>
              <li>• <strong>Marketing cookies:</strong> Meta Pixel for advertising measurement on Facebook/Instagram.</li>
            </ul>
            <p className="mt-3">You can disable cookies in your browser settings, though this may affect site functionality.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[#1A1A1A] mb-3">5. Data Retention</h2>
            <p>We retain your personal data for as long as necessary to fulfill the purposes outlined in this policy, or as required by law. Order records are retained for 7 years for accounting and legal compliance. You may request deletion of your account and associated data at any time.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[#1A1A1A] mb-3">6. Your Rights</h2>
            <p className="mb-3">Depending on your location, you may have the right to:</p>
            <ul className="space-y-2 ml-4">
              <li>• Access the personal data we hold about you</li>
              <li>• Correct inaccurate personal data</li>
              <li>• Request deletion of your personal data</li>
              <li>• Opt out of marketing communications</li>
              <li>• Data portability (receive your data in a machine-readable format)</li>
            </ul>
            <p className="mt-3">To exercise these rights, contact us at <a href="mailto:privacy@hpm3.com" className="text-[#8B6F47] underline">privacy@hpm3.com</a>.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[#1A1A1A] mb-3">7. Security</h2>
            <p>We take security seriously. All payment processing is handled by Stripe (PCI DSS compliant). Passwords are hashed. Our site uses HTTPS encryption. However, no method of transmission over the internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[#1A1A1A] mb-3">8. Children's Privacy</h2>
            <p>hpm3® is not directed to children under 13. We do not knowingly collect personal information from children under 13.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[#1A1A1A] mb-3">9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting a notice on our website.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[#1A1A1A] mb-3">10. Contact Us</h2>
            <p>Questions about this Privacy Policy? Contact us:</p>
            <div className="mt-3 p-4 bg-white border border-[#E5E0D8] rounded-sm">
              <p><strong>hpm3® Brand</strong></p>
              <p>Email: <a href="mailto:privacy@hpm3.com" className="text-[#8B6F47] underline">privacy@hpm3.com</a></p>
              <p className="mt-2">
                <Link to="/contact" className="font-display font-bold text-sm text-[#1A1A1A] underline">Contact Form →</Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
