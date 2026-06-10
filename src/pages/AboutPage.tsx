import { Link } from 'react-router-dom'
import { PRODUCTS } from '../data/products'
import ProductImage from '../components/ProductImage'

export default function AboutPage() {
  const hero = PRODUCTS.find(p => p.id === 'fog-hoodie')!
  const clay = PRODUCTS.find(p => p.id === 'clay-tee')!

  return (
    <main className="min-h-screen pt-16 bg-[#FAF8F5]">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden bg-[#1A1A1A]">
        <ProductImage product={hero} view="lifestyle" className="w-full h-full object-cover opacity-60" loading="eager" />
        <div className="absolute inset-0 flex flex-col items-center justify-end text-center px-4 pb-12">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-white/60 mb-3">Our Story</p>
          <p className="font-body text-base sm:text-lg text-white/70 max-w-md">
            Happy People Make More Money
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-[#8B6F47] mb-4">The Mission</p>
            <h2 className="font-display font-black text-4xl sm:text-5xl tracking-tight text-[#1A1A1A] leading-tight mb-6">
              Dress for the<br />life you're<br />building.
            </h2>
            <p className="font-body text-base text-[#555] leading-relaxed mb-5">
              hpm3® started with a simple belief: the way you dress affects the way you think, and the way you think affects the money you make.
            </p>
            <p className="font-body text-base text-[#555] leading-relaxed mb-8">
              We build premium vintage-inspired streetwear for people who are out here making moves. Culture creators. Entrepreneurs. Athletes. Dreamers with a plan.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 font-display font-bold text-sm tracking-widest uppercase px-8 py-4 bg-[#1A1A1A] text-white rounded-sm hover:bg-[#333] transition-colors"
            >
              Shop the Collection →
            </Link>
          </div>
          <div className="aspect-[3/4] rounded-lg overflow-hidden bg-[#EDE8E2]">
            <ProductImage product={clay} view="lifestyle" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#1A1A1A] py-20 sm:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-[#8B6F47] mb-3">What We Stand For</p>
            <h2 className="font-display font-black text-4xl sm:text-5xl tracking-tight text-white">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Limited & Intentional',
                body: 'Three drops per year. Twenty-three pieces total. Every item is designed with purpose — no filler, no waste.',
              },
              {
                title: 'Premium Fabrication',
                body: 'Heavyweight cotton, garment-dyed fleece, and premium blends. Quality that gets better with every wash.',
              },
              {
                title: 'Minimal Branding',
                body: 'Tonal embroidery over loud logos. The hpm3® mark is subtle because we trust you know what it stands for.',
              },
              {
                title: 'Culture First',
                body: 'We\'re not chasing trends — we\'re building a wardrobe for people who set them.',
              },
              {
                title: 'Made to Move',
                body: 'Relaxed fits designed for real life. Whether you\'re closing deals or hitting the gym, hpm3® moves with you.',
              },
              {
                title: 'Built to Last',
                body: 'Vintage-inspired because the classics endure. These aren\'t fast fashion pieces — they\'re investments.',
              },
            ].map(({ title, body }) => (
              <div key={title} className="border border-white/10 rounded-lg p-6">
                <h3 className="font-display font-bold text-lg text-white mb-3">{title}</h3>
                <p className="font-body text-sm text-white/60 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 sm:py-24 px-4 bg-[#F5F1ED]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { value: '3', label: 'Seasonal Drops' },
              { value: "23", label: "Pieces Per Year" },
              { value: '1000+', label: 'Community Members' },
              { value: '100%', label: 'Premium Cotton' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="font-display font-black text-4xl sm:text-5xl text-[#1A1A1A] mb-2">{value}</p>
                <p className="font-body text-xs text-[#888] tracking-wide uppercase">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <h2 className="font-display font-black text-4xl sm:text-5xl tracking-tight mb-5">
          Ready to make moves?
        </h2>
        <p className="font-body text-sm text-[#888] mb-8 max-w-sm mx-auto">
          Three drops. Twenty-three pieces. Zero compromise.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 font-display font-bold text-sm tracking-widest uppercase px-10 py-4 bg-[#1A1A1A] text-white rounded-sm hover:bg-[#333] active:scale-[0.97] transition-all"
        >
          Shop hpm3® →
        </Link>
      </section>
    </main>
  )
}
