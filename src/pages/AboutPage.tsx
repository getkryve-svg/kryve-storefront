import { Link } from 'react-router-dom'

const CF = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663745291897/2HBFBRwReVdUcKECHB8taa/'

export default function AboutPage() {
  return (
    <div className="kv-page">
      <div className="kv-page-hero">
        <p className="kv-eyebrow">OUR STORY</p>
        <h1 className="kv-page-title">BUILT DIFFERENT.<br/>BACKED BY SCIENCE.</h1>
        <p className="kv-page-sub">KRYVE was founded on a simple belief: you shouldn't have to choose between premium quality and real results. We exist to prove that the two are inseparable.</p>
      </div>

      <div className="kv-page-section kv-about-mission">
        <div className="kv-about-img">
          <img
            src="https://kryve-2.myshopify.com/cdn/shop/files/product-stack-card-v2-5M7HZWrzS5KvdiNgzRMQUZ.webp?v=1781072407"
            alt="KRYVE products"
            loading="lazy"
          />
        </div>
        <div className="kv-about-text">
          <p className="kv-eyebrow">THE MISSION</p>
          <h2>No Fillers. No Shortcuts. No Compromise.</h2>
          <p>Most supplement brands bulk their formulas out with cheap binders and artificial flavors. We don't. Every KRYVE formula is built from ingredients you can actually read on the label — and we tell you exactly what is in each one.</p>
          <p>Every KRYVE formula is manufactured in the United States, is non-GMO, and contains no artificial additives. Our full ingredient lists are published on each product page — nothing hidden behind a proprietary blend.</p>
        </div>
      </div>

      <div className="kv-page-section kv-about-values">
        <p className="kv-eyebrow">OUR VALUES</p>
        <h2>What We Stand For</h2>
        <div className="kv-about-values-grid">
          {[
            { icon: '🔬', title: 'Science First', body: 'Every ingredient is backed by peer-reviewed research. We cite our sources because we\'re proud of them.' },
            { icon: '🌿', title: 'Clean Inputs', body: 'USDA certified organic ingredients wherever possible. No GMOs, no artificial anything.' },
            { icon: '📋', title: 'Full Transparency', body: 'No proprietary blends. Every dose is on the label because you deserve to know exactly what you\'re putting in your body.' },
            { icon: '🏆', title: 'Results-Focused', body: 'We measure success by your outcomes, not our margins. That\'s why 89% of customers say they\'d recommend KRYVE.' },
          ].map(v => (
            <div key={v.title} className="kv-about-value-card">
              <span className="kv-about-value-icon">{v.icon}</span>
              <h3>{v.title}</h3>
              <p>{v.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="kv-page-cta">
        <h2>Ready to Start?</h2>
        <p>Join thousands of people building a better daily routine with KRYVE.</p>
        <Link to="/shop" className="kv-page-cta-btn">SHOP THE LINE</Link>
      </div>
    </div>
  )
}
