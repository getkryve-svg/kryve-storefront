export default function SciencePage() {
  return (
    <main style={{ background: '#0a0a0a', minHeight: '70vh', padding: 'clamp(80px,10vw,140px) clamp(16px,4vw,60px) 80px', fontFamily: 'Montserrat, sans-serif' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ color: '#39FF14', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16 }}>
          Evidence-Based
        </p>
        <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1px', marginBottom: 24 }}>
          The Science Behind KRYVE
        </h1>
        <p style={{ color: '#aaa', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: 620, margin: '0 auto 48px' }}>
          Every KRYVE formula is built on peer-reviewed research, GMP-certified manufacturing, and rigorous quality testing.
          We don't chase trends — we follow the data.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, textAlign: 'left', marginTop: 48 }}>
          {[
            { title: 'GMP-Certified Facility', body: 'Every batch is manufactured in a facility certified to Good Manufacturing Practice standards.' },
            { title: '40+ Whole-Food Ingredients', body: 'Our Greens formula sources from organic fruits, vegetables, adaptogens, and probiotics.' },
            { title: 'Third-Party Tested', body: 'Independent lab verification for purity, potency, and heavy metal safety on every lot.' },
            { title: 'Zero Artificial Fillers', body: 'No proprietary blends, no synthetic dyes, no unnecessary additives — ever.' },
          ].map(card => (
            <div key={card.title} style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: '28px 24px' }}>
              <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, marginBottom: 10 }}>{card.title}</h3>
              <p style={{ color: '#888', fontSize: '0.875rem', lineHeight: 1.7 }}>{card.body}</p>
            </div>
          ))}
        </div>

        <p style={{ color: '#555', fontSize: '0.75rem', marginTop: 64, lineHeight: 1.6 }}>
          *These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease.
        </p>
      </div>
    </main>
  )
}
