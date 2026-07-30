const MANUSCDN = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663745291897/'

const STANDARDS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="2">
        <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
    title: 'Research-Backed Ingredients',
    body: 'Every ingredient is selected based on published scientific research supporting its efficacy at the doses we use.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 9h6M9 12h6M9 15h4" />
      </svg>
    ),
    title: 'Made in the USA',
    body: 'Every KRYVE formula is manufactured in the United States.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#39FF14" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: 'Full Ingredient Transparency',
    body: 'Every ingredient is listed on the product page. No proprietary blends, no artificial additives, nothing hidden.'
  },
]

const FORMULAS = [
  {
    img: MANUSCDN + 'CqsuQnKkfpxbnepn.jpg',
    alt: 'KRYVE Greens Formula',
    label: 'Greens Superfood Powder',
    color: '#39FF14',
  },
  {
    img: MANUSCDN + 'FdJYDIskmEVewVRm.jpg',
    alt: 'KRYVE Collagen Formula',
    label: 'Hydrolyzed Collagen Peptides',
    color: '#C4857E',
  },
  {
    img: MANUSCDN + 'NqtPqnEuRqcbwzfS.jpg',
    alt: 'KRYVE Magnesium Formula',
    label: 'Magnesium Glycinate',
    color: '#9B8FD4',
  },
]

export default function SciencePage() {
  return (
    <main style={{ background: '#0A0A0A', fontFamily: 'Montserrat, sans-serif' }}>

      {/* ── HERO ── */}
      <section style={{ background: '#0A0A0A', position: 'relative', overflow: 'hidden', minHeight: 480, display: 'flex', alignItems: 'center' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${MANUSCDN}ESnRYpIJCtdBppnC.png)`,
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.4,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right,rgba(0,0,0,0.95) 0%,rgba(0,0,0,0.6) 60%,rgba(0,0,0,0.1) 100%)',
          zIndex: 1,
        }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto', padding: '80px 40px' }}>
          <div style={{
            display: 'inline-block', background: '#39FF14', color: '#0A0A0A',
            padding: '4px 14px', borderRadius: 2, fontSize: '0.72rem', fontWeight: 800,
            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20,
          }}>Our Science</div>
          <h1 style={{
            color: '#fff', fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 900,
            lineHeight: 1.0, marginBottom: 20, letterSpacing: '-0.02em', maxWidth: 700,
          }}>Science-Backed.<br />Never Guesswork.</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', maxWidth: 560, lineHeight: 1.7 }}>
            Every KRYVE formula is manufactured in the USA, with the full ingredient list published on every product page.
          </p>
        </div>
      </section>

      {/* ── OUR STANDARDS ── */}
      <section style={{ background: '#111', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: '#39FF14', letterSpacing: '0.3em', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>
              Our Commitment
            </p>
            <h2 style={{ color: '#fff', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Our Standards
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32 }} className="kv-sci-standards-grid">
            {STANDARDS.map(s => (
              <div key={s.title} style={{ background: '#0A0A0A', border: '1px solid #222', borderRadius: 12, padding: 36 }}>
                <div style={{
                  width: 52, height: 52, background: 'rgba(57,255,20,0.08)',
                  border: '1px solid rgba(57,255,20,0.25)', borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
                }}>
                  {s.icon}
                </div>
                <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, marginBottom: 12 }}>{s.title}</h3>
                <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.75 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S INSIDE ── */}
      <section style={{ background: '#0A0A0A', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: '#39FF14', letterSpacing: '0.3em', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>
              Full Transparency
            </p>
            <h2 style={{ color: '#fff', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              What Is Inside Each Formula
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }} className="kv-sci-formula-grid">
            {FORMULAS.map(f => (
              <div key={f.label} style={{ background: '#111', border: '1px solid #222', borderRadius: 12, overflow: 'hidden' }}>
                <img src={f.img} alt={f.alt} style={{ width: '100%', display: 'block' }} loading="lazy" />
                <div style={{ padding: 20 }}>
                  <h3 style={{ color: f.color, fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {f.label}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FDA DISCLAIMER ── */}
      <div style={{ textAlign: 'center', padding: '24px 40px', color: '#444', fontSize: '0.75rem', maxWidth: 900, margin: '0 auto', lineHeight: 1.6, borderTop: '1px solid #1a1a1a' }}>
        *These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease.
      </div>

    </main>
  )
}
