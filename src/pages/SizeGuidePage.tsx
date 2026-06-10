export default function SizeGuidePage() {
  const tops = [
    { size: 'XS', chest: '34–36"', length: '27"', sleeve: '32"' },
    { size: 'S',  chest: '36–38"', length: '28"', sleeve: '33"' },
    { size: 'M',  chest: '38–40"', length: '29"', sleeve: '34"' },
    { size: 'L',  chest: '40–42"', length: '30"', sleeve: '35"' },
    { size: 'XL', chest: '42–44"', length: '31"', sleeve: '36"' },
    { size: 'XXL',chest: '44–46"', length: '32"', sleeve: '37"' },
  ]
  const bottoms = [
    { size: 'XS', waist: '26–28"', hip: '34–36"', inseam: '30"' },
    { size: 'S',  waist: '28–30"', hip: '36–38"', inseam: '30"' },
    { size: 'M',  waist: '30–32"', hip: '38–40"', inseam: '31"' },
    { size: 'L',  waist: '32–34"', hip: '40–42"', inseam: '31"' },
    { size: 'XL', waist: '34–36"', hip: '42–44"', inseam: '32"' },
    { size: 'XXL',waist: '36–38"', hip: '44–46"', inseam: '32"' },
  ]

  return (
    <main className="min-h-screen pt-24 pb-16 bg-[#FAF8F5]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-[#8B6F47] mb-3">Fit Guide</p>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight mb-4">Size Guide</h1>
          <p className="font-body text-sm text-[#888] max-w-sm mx-auto">
            hpm3® is designed with an intentional oversized fit. Measurements below are body measurements — not garment dimensions.
          </p>
        </div>

        {/* Fit philosophy */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { label: 'Tees & Tanks', fit: 'Oversized', tip: 'Size down for a closer fit' },
            { label: 'Hoodies', fit: 'Relaxed', tip: 'True to oversized — size down if preferred' },
            { label: 'Joggers', fit: 'True to size', tip: 'Standard fit, tapered cuff' },
          ].map(({ label, fit, tip }) => (
            <div key={label} className="bg-white border border-[#E5E0D8] rounded-lg p-5 text-center">
              <p className="font-display font-bold text-sm mb-1">{label}</p>
              <p className="font-body text-xs text-[#8B6F47] font-semibold mb-1">{fit}</p>
              <p className="font-body text-[11px] text-[#AAA]">{tip}</p>
            </div>
          ))}
        </div>

        {/* Tops */}
        <section className="mb-10">
          <h2 className="font-display font-bold text-2xl tracking-tight mb-4">Tops (Tees, Tanks, Hoodies)</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#1A1A1A] text-white">
                  {['Size','Chest','Length','Sleeve'].map(h => (
                    <th key={h} className="font-body text-xs font-semibold tracking-widest uppercase px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tops.map((row, i) => (
                  <tr key={row.size} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F5F1ED]'}>
                    <td className="font-display font-bold text-sm px-4 py-3">{row.size}</td>
                    <td className="font-body text-sm px-4 py-3 text-[#555]">{row.chest}</td>
                    <td className="font-body text-sm px-4 py-3 text-[#555]">{row.length}</td>
                    <td className="font-body text-sm px-4 py-3 text-[#555]">{row.sleeve}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Bottoms */}
        <section className="mb-12">
          <h2 className="font-display font-bold text-2xl tracking-tight mb-4">Bottoms (Joggers)</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#1A1A1A] text-white">
                  {['Size','Waist','Hip','Inseam'].map(h => (
                    <th key={h} className="font-body text-xs font-semibold tracking-widest uppercase px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bottoms.map((row, i) => (
                  <tr key={row.size} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F5F1ED]'}>
                    <td className="font-display font-bold text-sm px-4 py-3">{row.size}</td>
                    <td className="font-body text-sm px-4 py-3 text-[#555]">{row.waist}</td>
                    <td className="font-body text-sm px-4 py-3 text-[#555]">{row.hip}</td>
                    <td className="font-body text-sm px-4 py-3 text-[#555]">{row.inseam}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* How to measure */}
        <section className="bg-white border border-[#E5E0D8] rounded-lg p-6 mb-8">
          <h2 className="font-display font-bold text-xl tracking-tight mb-5">How to Measure</h2>
          <div className="space-y-4">
            {[
              { part: 'Chest', how: 'Measure around the fullest part of your chest, keeping the tape level under your arms.' },
              { part: 'Waist', how: 'Measure around your natural waistline, keeping the tape comfortably loose.' },
              { part: 'Hip',   how: 'Measure around the fullest part of your hips, approximately 8" below your natural waist.' },
              { part: 'Inseam',how: 'Measure from the crotch seam to the bottom of the leg along the inner leg.' },
            ].map(({ part, how }) => (
              <div key={part} className="flex gap-4">
                <span className="font-display font-bold text-sm w-16 flex-shrink-0 text-[#8B6F47]">{part}</span>
                <p className="font-body text-sm text-[#555] leading-relaxed">{how}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="font-body text-xs text-[#AAA] text-center">
          Not sure about your size?{' '}
          <a href="mailto:support@hpm3.com" className="underline hover:text-[#1A1A1A] transition-colors">
            Email us
          </a>{' '}
          and we'll help you find the right fit.
        </p>
      </div>
    </main>
  )
}
