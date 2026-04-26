import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  ArrowUpRight,
  Sparkles,
  Clock,
  Leaf,
  HeartHandshake,
  Quote,
  ChevronRight,
} from 'lucide-react'
import Footer from '../components/Footer'
import michael from '../assets/team/michael.webp'

// ── Team data ─────────────────────────────────────────────────
// When ready, import real photos and assign to `img`
// import joy from '../assets/team/joy.webp'
// import michael from '../assets/team/michael.webp'
// import janet from '../assets/team/janet.webp'

const TEAM = [
  {
    name: 'Joy Yaya',
    role: 'Founder & Head Pastry Chef',
    img: null,
    initials: 'JY',
    story: [
      "Joy founded SweetHUB on a single conviction: that pastry, when made with discipline and intention, becomes a form of hospitality.",
      "Trained through years of self-directed practice and refined by an exacting standard for ingredients and technique, she leads our kitchen and oversees every recipe that bears the SweetHUB name.",
      "Her work is governed by a simple principle — consistency is non-negotiable, and quality is never delegated.",
    ],
    quote: 'We do not bake to impress. We bake to be trusted.',
    expertise: ['Recipe Development', 'Quality Standards', 'Pastry Direction', 'Kitchen Leadership'],
  },
  {
    name: 'Michael Oyelowo',
    role: 'Co-Founder & Managing Director',
    img: michael,
    initials: 'MO',
    story: [
      "Michael leads strategy, brand, and growth at SweetHUB. A 2024 graduate of Obafemi Awolowo University, he established the company to bring structured, reliable pastry delivery to a market that had long lacked it.",
      "He oversees the company's operations, technology, and customer experience — building the systems that allow craftsmanship to scale without compromise.",
      "His role is to ensure that every part of the business outside the kitchen meets the same standard as the work inside it.",
    ],
    quote: 'Craft creates the product. Systems create the company.',
    expertise: ['Brand Strategy', 'Operations', 'Technology', 'Business Development'],
  },
  {
    name: 'Janet Yaya',
    role: 'Head of Operations & Supply',
    img: null,
    initials: 'JY',
    story: [
      "Janet leads procurement, inventory, and daily operations. She is responsible for ensuring that every ingredient meets our specification and that the kitchen never operates below capacity.",
      "Her work spans supplier relationships, quality auditing, and the operational rhythm that allows the team to deliver consistently, day after day.",
      "She is the operational backbone of SweetHUB — quiet, methodical, and indispensable.",
    ],
    quote: 'Excellence in the final product begins with discipline in the supply chain.',
    expertise: ['Procurement', 'Supply Chain', 'Quality Auditing', 'Daily Operations'],
  },
]

const MILESTONES = [
  { year: '2024', event: 'SweetHUB founded in Ile-Ife, Osun State.' },
  { year: '2024', event: 'First commercial deliveries launched.' },
  { year: '2025', event: 'Online ordering platform released at sweethub.ng.' },
  { year: '2025', event: 'Crossed 2,400 served customers and 5,000 fulfilled orders.' },
]

const VALUES = [
  {
    Icon: Leaf,
    title: 'Made fresh, never stocked.',
    desc: 'Every order is prepared on the day. We hold no frozen inventory and offer no exceptions to this rule.',
  },
  {
    Icon: Sparkles,
    title: 'Quality is a standard, not a claim.',
    desc: 'Ingredients, technique, and presentation are governed by internal specifications that do not change with demand.',
  },
  {
    Icon: Clock,
    title: 'Reliability is the product.',
    desc: 'A 30-minute delivery window, met consistently, is more valuable than a faster window met occasionally.',
  },
  {
    Icon: HeartHandshake,
    title: 'The customer relationship is long-term.',
    desc: 'We build for repeat customers, not single transactions. Every interaction is treated accordingly.',
  },
]

// ── Animated counter ──────────────────────────────────────────
function useCountUp(target, started, duration = 2000) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!started) return
    let startTime = null
    const step = (ts) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, target, duration])
  return count
}

function Stats() {
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const customers = useCountUp(2400, started, 2200)
  const orders = useCountUp(5000, started, 2500)
  const mins = useCountUp(30, started, 1200)
  const years = useCountUp(3, started, 1000)

  const items = [
    { value: `${customers.toLocaleString()}+`, label: 'Customers Served' },
    { value: `${orders.toLocaleString()}+`, label: 'Orders Fulfilled' },
    { value: `${mins} min`, label: 'Average Delivery' },
    { value: `${years}+ yrs`, label: 'Operating Experience' },
  ]

  return (
    <section ref={ref} className="about-stats">
      <div className="about-stats-inner">
        {items.map((it, i) => (
          <div className="about-stat" key={i}>
            <div className="about-stat-num">{it.value}</div>
            <div className="about-stat-label">{it.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Team card ─────────────────────────────────────────────────
function TeamCard({ member }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <article ref={ref} className={`team-card ${visible ? 'visible' : ''}`}>
      <div className="team-photo-wrap">
        {member.img ? (
          <img className="team-photo" src={member.img} alt={member.name} />
        ) : (
          <div className="team-photo-placeholder">
            <span>{member.initials}</span>
          </div>
        )}
      </div>

      <div className="team-card-body">
        <header className="team-card-header">
          <div>
            <div className="team-role">{member.role}</div>
            <h3 className="team-name">{member.name}</h3>
          </div>
        </header>

        <div className="team-divider" />

        <div className="team-story">
          {member.story.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <blockquote className="team-quote">
          <Quote className="team-quote-icon" size={18} strokeWidth={1.5} />
          <span>{member.quote}</span>
        </blockquote>

        <ul className="team-expertise">
          {member.expertise.map(t => <li key={t}>{t}</li>)}
        </ul>
      </div>
    </article>
  )
}

// ── Main page ─────────────────────────────────────────────────
export default function AboutUs() {
  return (
    <>
      <main className="about-page">

        {/* ── Hero ── */}
        <section className="about-hero">
          <div className="about-hero-inner">
            <nav className="about-crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <ChevronRight size={14} strokeWidth={1.5} />
              <span>About</span>
            </nav>

            <div className="about-hero-eyebrow">Est. 2024 — Ile-Ife, Nigeria</div>

            <h1 className="about-hero-title">
              A small kitchen,<br />
              <em>held to a serious standard.</em>
            </h1>

            <p className="about-hero-sub">
              SweetHUB is an independent pastry company founded on the conviction that
              consistency, freshness, and reliability should not be exceptional —
              they should be the baseline.
            </p>

            <div className="about-hero-meta">
              <span className="about-hero-location">
                <MapPin size={14} strokeWidth={1.5} />
                AP Junction, Ile-Ife · Osun State
              </span>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <Stats />

        {/* ── Origin story ── */}
        <section className="about-origin">
          <div className="about-origin-inner">
            <div className="about-origin-text">
              <div className="about-section-eyebrow">Our Origin</div>
              <h2 className="about-section-title">
                Built to solve a problem<br />
                <em>worth solving.</em>
              </h2>

              <p>
                SweetHUB began with a clear observation: residents of Ile-Ife had
                limited access to pastry of dependable quality, prepared the same day,
                and delivered within a window they could plan around.
              </p>

              <p>
                Joy had built a reputation locally for the standard of her work.
                Michael, on completing his degree at OAU in 2024, recognised that this
                standard could be extended — through proper systems, infrastructure, and
                brand discipline — to a far broader customer base. Janet completed the
                team by taking ownership of the operational layer.
              </p>

              <p>
                The company we built is small by design. It is structured to protect the
                quality of the product, not to dilute it. Every order is fulfilled by
                the same three people who founded the business.
              </p>
            </div>

            <aside className="about-origin-side">
              <div className="about-section-eyebrow">Timeline</div>
              <h3 className="about-milestones-title">Key milestones</h3>

              <ol className="about-milestones">
                {MILESTONES.map((m, i) => (
                  <li className="about-milestone" key={i}>
                    <div className="am-rail">
                      <span className="am-dot" />
                      {i < MILESTONES.length - 1 && <span className="am-line" />}
                    </div>
                    <div className="am-content">
                      <div className="am-year">{m.year}</div>
                      <div className="am-event">{m.event}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </section>

        {/* ── Team ── */}
        <section className="about-team-section">
          <div className="about-team-header">
            <div className="about-section-eyebrow">Leadership</div>
            <h2 className="about-section-title">
              Three founders. <em>One standard.</em>
            </h2>
            <p className="about-team-sub">
              SweetHUB is operated end-to-end by its founders. Every order you place is
              produced, packed, and accounted for by the same three people.
            </p>
          </div>

          <div className="about-team-grid">
            {TEAM.map((m) => <TeamCard key={m.name} member={m} />)}
          </div>
        </section>

        {/* ── Values ── */}
        <section className="about-values">
          <div className="about-values-inner">
            <div className="about-values-header">
              <div className="about-section-eyebrow">Operating Principles</div>
              <h2 className="about-section-title">
                The standards we will <em>not negotiate.</em>
              </h2>
            </div>

            <div className="about-values-grid">
              {VALUES.map(({ Icon, title, desc }, i) => (
                <div className="about-value-card" key={i}>
                  <div className="avc-icon-wrap">
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                  <h3 className="avc-title">{title}</h3>
                  <p className="avc-desc">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="about-cta">
          <div className="about-cta-inner">
            <div className="about-cta-eyebrow">Order Today</div>
            <h2>
              Now that you understand <em>how we work —</em><br />
              experience the result.
            </h2>
            <p>
              Browse the menu, place an order, and see the standard for yourself.
              Same-day preparation. Thirty-minute delivery. No exceptions.
            </p>
            <div className="about-cta-btns">
              <Link to="/#order" className="about-cta-primary">
                View the Menu
                <ArrowUpRight size={18} strokeWidth={2} />
              </Link>
              <Link to="/contact" className="about-cta-secondary">
                Contact Us
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
