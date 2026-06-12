import { Link } from 'react-router-dom'

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 bg-[#FAF8F5]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="font-body text-xs tracking-widest uppercase text-[#888] mb-3">Legal</p>
          <h1 className="font-display font-black text-4xl tracking-tight">Terms of Service</h1>
          <p className="font-body text-sm text-[#888] mt-3">Last updated: January 1, 2026</p>
        </div>

        <div className="space-y-10 font-body text-[#555] text-sm leading-relaxed">

          <section>
            <h2 className="font-display font-bold text-lg text-[#1A1A1A] mb-3">1. Agreement to Terms</h2>
            <p>By accessing or using KRYVE ("the Store," "we," "us," or "our"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Store.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[#1A1A1A] mb-3">2. Products and Pricing</h2>
            <ul className="space-y-2 ml-4">
              <li>• All prices are displayed in USD and are subject to change without notice.</li>
              <li>• We reserve the right to limit quantities or refuse orders at our discretion.</li>
              <li>• Product images are for illustrative purposes; actual colors may vary slightly due to screen settings.</li>
              <li>• We are not responsible for typographical errors in pricing. If a pricing error occurs, we will notify you before processing your order.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[#1A1A1A] mb-3">3. Orders and Payment</h2>
            <ul className="space-y-2 ml-4">
              <li>• By placing an order, you represent that you are 18 years or older and have the legal capacity to enter into a contract.</li>
              <li>• We accept Visa, Mastercard, American Express, and other cards via Stripe.</li>
              <li>• Payment is processed securely by Stripe. We do not store credit card information.</li>
              <li>• Orders are confirmed only after payment has been successfully processed.</li>
              <li>• We reserve the right to cancel any order and issue a full refund if we are unable to fulfill it.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[#1A1A1A] mb-3">4. Shipping</h2>
            <ul className="space-y-2 ml-4">
              <li>• Standard shipping takes 5–7 business days within the United States.</li>
              <li>• Free shipping on orders over $75 (after discounts).</li>
              <li>• We are not responsible for delays caused by shipping carriers or customs.</li>
              <li>• Risk of loss passes to you upon delivery to the carrier.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[#1A1A1A] mb-3">5. Returns and Refunds</h2>
            <p className="mb-3">Please see our <Link to="/returns" className="text-[#8B6F47] underline">Returns Policy</Link> for full details. In summary:</p>
            <ul className="space-y-2 ml-4">
              <li>• We accept returns within 30 days of delivery.</li>
              <li>• Items must be unopened, unused, and in original condition.</li>
              <li>• Refunds are processed within 5–10 business days of receiving the return.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[#1A1A1A] mb-3">6. Intellectual Property</h2>
            <p>All content on KRYVE, including but not limited to text, graphics, logos, images, product designs, and software, is the property of KRYVE and protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[#1A1A1A] mb-3">7. Discount Codes and Promotions</h2>
            <ul className="space-y-2 ml-4">
              <li>• Discount codes are single-use unless otherwise stated and cannot be combined with other offers.</li>
              <li>• We reserve the right to cancel or modify promotions at any time.</li>
              <li>• Referral credits have no cash value and expire after 12 months.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[#1A1A1A] mb-3">8. User Accounts</h2>
            <ul className="space-y-2 ml-4">
              <li>• You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>• You agree to notify us immediately of any unauthorized use of your account.</li>
              <li>• We reserve the right to terminate accounts that violate these terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[#1A1A1A] mb-3">9. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, KRYVE shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Store or products purchased through the Store. Our liability is limited to the amount you paid for the specific product in question.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[#1A1A1A] mb-3">10. Governing Law</h2>
            <p>These Terms of Service are governed by the laws of the United States. Any disputes shall be resolved in courts of competent jurisdiction.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[#1A1A1A] mb-3">11. Changes to Terms</h2>
            <p>We reserve the right to update these terms at any time. Continued use of the Store after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-[#1A1A1A] mb-3">12. Contact</h2>
            <div className="p-4 bg-white border border-[#E5E0D8] rounded-sm">
              <p>Questions? Contact us at <a href="mailto:getkryve@gmail.com" className="text-[#8B6F47] underline">getkryve@gmail.com</a></p>
              <p className="mt-2"><Link to="/contact" className="font-display font-bold text-sm text-[#1A1A1A] underline">Contact Form →</Link></p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
