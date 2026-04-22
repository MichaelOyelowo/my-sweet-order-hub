import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

const VALUES =[
  {
    icon: '🔥',
    title: 'The Oven-Fresh Promise',
    desc: 'No microwaves. No day-old stock. When you click order, our kitchen gets to work. You get it exactly how it should be: hot, fresh, and perfect.'
  },
  {
    icon: '🛵',
    title: 'Speed Meets Quality',
    desc: 'We cracked the code on fast delivery without cutting corners. From our ovens to your doorstep in Ile-Ife in under 30 minutes.'
  },
  {
    icon: '💎',
    title: 'Premium Ingredients',
    desc: 'Great taste cannot be faked. We source the finest, freshest local ingredients to ensure every bite of our pastries and cakes is a luxury experience.'
  }
]

export default function AboutPage() {
  const navigate = useNavigate()

  // Always scroll to top when page loads
  useEffect(() => { window.scrollTo(0, 0) },[])

  return (
    <>
      <main className="about-page">
        
        {/* ── Hero Banner ── */}
        <div className="about-hero">
          <div className="about-hero-inner">
            <div className="about-breadcrumb">
              <Link to="/">Home</Link> <span>/</span> <span>About Us</span>
            </div>
            <h1 className="about-hero-title">
              Baking Happiness in <em>Ile-Ife</em>
            </h1>
            <p className="about-hero-sub">
              We didn't just want to build another bakery. We wanted to completely change 
              how you experience fresh food. No shortcuts, no excuses. Just pure, oven-fresh perfection.
            </p>
          </div>
          {/* Decorative Grid */}
          <div className="about-hero-grid" aria-hidden="true" />
        </div>

        {/* ── Our Story Section ── */}
        <div className="about-story-section">
          <div className="about-story-inner">
            <div className="about-story-content">
              <span className="about-eyebrow">Our Story</span>
              <h2>We got tired of eating cold, stale snacks.</h2>
              <p>
                Before SweetHUB, ordering snacks or pastries meant rolling the dice. You either had to leave your house and wait in long queues, or order online and pray the food didn't arrive cold or tasting like it was baked three days ago.
              </p>
              <p>
                We knew the people of Ile-Ife deserved better. So, we built a kitchen designed for one specific purpose: <strong>On-Demand Freshness.</strong>
              </p>
              <p>
                Today, SweetHUB operates on a strict zero-frozen policy. The moment your order is confirmed, our bakers start preparing it. It’s why our Puff Puff is always piping hot, our cakes are always incredibly moist, and our delivery is consistently reliable.
              </p>
            </div>
            <div className="about-story-image">
              <div className="about-image-placeholder">
                <span className="about-image-emoji">👨‍🍳</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Core Values Grid ── */}
        <div className="about-values-section">
          <div className="about-values-header">
            <h2>The SweetHUB Standard</h2>
            <p>We refuse to compromise on these three rules.</p>
          </div>
          
          <div className="about-values-grid">
            {VALUES.map((val, i) => (
              <div key={i} className="about-value-card">
                <div className="av-icon">{val.icon}</div>
                <h3 className="av-title">{val.title}</h3>
                <p className="av-desc">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <div className="about-cta-section">
          <div className="about-cta-card">
            <h2>Ready to taste the difference?</h2>
            <p>Join thousands of happy customers who refuse to settle for stale food.</p>
            <button className="about-cta-btn" onClick={() => navigate('/#order')}>
              Order Now
            </button>
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}