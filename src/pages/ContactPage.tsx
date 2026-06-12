import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  function set(k: keyof typeof form, v: string) {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  function validate() {
    const e: Partial<typeof form> = {}
    if (!form.name.trim())    e.name    = 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (!form.message.trim()) e.message = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!validate()) return
    // In production: POST to your backend or a service like Formspree
    console.info('Contact form:', form)
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen pt-24 pb-16 bg-[#FAF8F5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-[#8B6F47] mb-3">Get in Touch</p>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight mb-4">Contact Us</h1>
          <p className="font-body text-sm text-[#888]">We reply to every message within 24 hours.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          {/* Form */}
          <div>
            {submitted ? (
              <div className="bg-white border border-[#E5E0D8] rounded-lg p-10 text-center">
                <div className="w-14 h-14 rounded-full bg-[#10B981]/15 flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                    <path d="M5 12l4 4 10-10"/>
                  </svg>
                </div>
                <h2 className="font-display font-bold text-2xl tracking-tight mb-2">Message sent!</h2>
                <p className="font-body text-sm text-[#888]">
                  We'll get back to you at <strong>{form.email}</strong> within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-[#E5E0D8] rounded-lg p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs font-semibold tracking-widest uppercase text-[#555] block mb-1.5">Name</label>
                    <input
                      value={form.name} onChange={e => set('name', e.target.value)}
                      className={`w-full font-body text-sm px-3 py-3 border rounded-sm focus:outline-none transition-colors ${errors.name ? 'border-red-400' : 'border-[#D8D3CC] focus:border-[#1A1A1A]'}`}
                      placeholder="Your name"
                    />
                    {errors.name && <p className="font-body text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold tracking-widest uppercase text-[#555] block mb-1.5">Email</label>
                    <input
                      type="email" value={form.email} onChange={e => set('email', e.target.value)}
                      className={`w-full font-body text-sm px-3 py-3 border rounded-sm focus:outline-none transition-colors ${errors.email ? 'border-red-400' : 'border-[#D8D3CC] focus:border-[#1A1A1A]'}`}
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="font-body text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="font-body text-xs font-semibold tracking-widest uppercase text-[#555] block mb-1.5">Subject</label>
                  <select
                    value={form.subject} onChange={e => set('subject', e.target.value)}
                    className="w-full font-body text-sm px-3 py-3 border border-[#D8D3CC] rounded-sm focus:outline-none focus:border-[#1A1A1A] transition-colors"
                  >
                    <option value="">Select a topic</option>
                    <option value="order">Order question</option>
                    <option value="shipping">Shipping & delivery</option>
                    <option value="return">Returns & refunds</option>
                    <option value="product">Product question</option>
                    <option value="wholesale">Wholesale inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-body text-xs font-semibold tracking-widest uppercase text-[#555] block mb-1.5">Message</label>
                  <textarea
                    value={form.message} onChange={e => set('message', e.target.value)}
                    rows={5}
                    className={`w-full font-body text-sm px-3 py-3 border rounded-sm focus:outline-none transition-colors resize-none ${errors.message ? 'border-red-400' : 'border-[#D8D3CC] focus:border-[#1A1A1A]'}`}
                    placeholder="How can we help?"
                  />
                  {errors.message && <p className="font-body text-xs text-red-500 mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full font-display font-bold text-sm tracking-widest uppercase py-4 bg-[#1A1A1A] text-white rounded-sm hover:bg-[#333] active:scale-[0.98] transition-all"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact info sidebar */}
          <div className="space-y-4">
            <div className="bg-white border border-[#E5E0D8] rounded-lg p-5">
              <h3 className="font-display font-bold text-base mb-4">Contact Info</h3>
              <div className="space-y-3">
                {[
                  { icon: '✉️', label: 'Email', value: 'getkryve@gmail.com', href: 'mailto:getkryve@gmail.com' },
                  { icon: '⏱️', label: 'Response time', value: 'Within 24 hours' },
                  { icon: '📍', label: 'Location', value: 'United States' },
                ].map(({ icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="text-base">{icon}</span>
                    <div>
                      <p className="font-body text-xs text-[#AAA]">{label}</p>
                      {href ? (
                        <a href={href} className="font-body text-sm text-[#1A1A1A] hover:underline">{value}</a>
                      ) : (
                        <p className="font-body text-sm text-[#1A1A1A]">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#E5E0D8] rounded-lg p-5">
              <h3 className="font-display font-bold text-base mb-4">Follow Us</h3>
              <div className="space-y-2">
                {[
                  { platform: 'Instagram', handle: '@getkryve', href: 'https://instagram.com/getkryve' },
                  { platform: 'TikTok',    handle: '@getkryve', href: 'https://tiktok.com/@getkryve' },
                ].map(({ platform, handle, href }) => (
                  <a key={platform} href={href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between group hover:bg-[#F5F1ED] rounded-md px-2 py-1.5 -mx-2 transition-colors">
                    <span className="font-body text-sm text-[#555]">{platform}</span>
                    <span className="font-body text-xs text-[#8B6F47] group-hover:underline">{handle}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-[#1A1A1A] rounded-lg p-5">
              <p className="font-body text-xs text-white/50 mb-2">Quick links</p>
              {[
                { label: 'Track my order', href: '/orders' },
                { label: 'Start a return', href: '/returns' },
                { label: 'FAQs', href: '/faq' },
                { label: 'Shop supplements', href: '/shop' },
              ].map(({ label, href }) => (
                <a key={label} href={href}
                  className="block font-body text-sm text-white/80 hover:text-white py-1.5 hover:translate-x-1 transition-all">
                  {label} →
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
