import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

// ── Team data ─────────────────────────────────────────────────
// Replace img src with real photos when ready
// import joy    from '../assets/team/joy.webp'
// import michael from '../assets/team/michael.webp'
// import janet  from '../assets/team/janet.webp'

const TEAM = [
  {
    name: 'Joy Yaya',
    role: 'Head Chef, Founder & Baker',
    img: null, // replace with: joy
    color: '#c0392b',
    accent: 'rgba(192,57,43,0.08)',
    story: [
      "Joy didn't just learn to bake — she was born with flour in her hands. From a young age, she discovered something most people take years to find: the power of food to make a person feel genuinely seen and cared for.",
      "What sets Joy apart isn't just skill — it's the way she thinks about baking differently. Every item that leaves her kitchen is crafted to surprise you. To make you pause, take another bite, and wonder how something can taste this good.",
      "She's been baking for years, and not one of those years was wasted. Every recipe refined, every technique mastered, every customer amazed — that's Joy's legacy, baked into every single order.",
    ],
    quote: "I don't just bake snacks. I bake moments people remember.",
    tags: ['Head Baker', 'Founder', 'Recipe Developer', 'Quality Control'],
  },
  {
    name: 'Michael Oyelowo',
    role: 'Chief Architect & Growth Strategist',
    img: null, // replace with: michael
    color: '#e67e22',
    accent: 'rgba(230,126,34,0.08)',
    story: [
      "Michael graduated from Obafemi Awolowo University in 2024 with one mission: to solve a problem that bothered him every single day. People in Ile-Ife waking up, craving something delicious and fresh, with nowhere to turn.",
      "He looked at what Joy was already doing — incredible baking, loyal customers — and saw something she couldn't yet see herself. A brand. A platform. A business that could bring those snacks directly to anyone who needed them, anytime they needed them.",
      "Michael isn't the one in the kitchen. He's the one who built everything around it. The website, the strategy, the systems, the vision. He turned a local passion into a proper brand — and he's just getting started.",
    ],
    quote: "Joy had the magic. I just made sure the world could find it.",
    tags: ['Brand Strategy', 'Digital Growth', 'Systems Builder', 'OAU Graduate 2024'],
  },
  {
    name: 'Janet Yaya',
    role: 'Head of Operations & Supply',
    img: null, // replace with: janet
    color: '#8e44ad',
    accent: 'rgba(142,68,173,0.08)',
    story: [
      "Every great kitchen runs on what's inside it — and Janet makes sure SweetHUB never runs short. From sourcing the freshest ingredients to making sure the right materials are always in stock, Janet is the quiet force behind every order that goes out.",
      "But her role goes beyond logistics. Janet is the emotional anchor of the SweetHUB team. On the days when things get hard — and every business has those days — she's the one keeping spirits up, keeping the team grounded, and reminding everyone why they started.",
      "She doesn't need a fancy title to describe what she does. She just shows up, every single day, and makes everything work. That's the kind of person every business prays for.",
    ],
    quote: "If Joy bakes the heart of SweetHUB, I make sure it keeps beating.",
    tags: ['Procurement', 'Supply Chain', 'Team Morale', 'Operations'],
  },
]

const MILESTONES = [
  { year: '2024', event: 'Michael graduates from OAU', icon: '🎓' },
  { year: '2024', event: 'SweetHUB concept born in Ile-Ife', icon: '💡' },
  { year: '2024', event: 'First orders delivered fresh to doors', icon: '🛵' },
  { year: '2025', event: '2,400+ happy customers and counting', icon: '❤️' },
  { year: '2025', event: 'SweetHUB.ng launches online', icon: '🌐' },
]

const VALUES = [
  {
    icon: '🍰',
    title: 'Freshness above all',
    desc: 'Every order starts from scratch. No frozen stock. No shortcuts. Ever.',
  },
  {
    icon: '🤝',
    title: 'No pressure, just love',
    desc: "If we don't wow you, you never have to order again. But we're confident you'll be back.",
  },
  {
    icon: '⚡',
    title: 'Speed without compromise',
    desc: '30 minutes to your door. Fresh, hot, and exactly as you ordered.',
  },
  {
    icon: '🎨',
    title: 'Different by design',
    desc: "Joy doesn't bake the same way twice. We exist to surprise you, every single time.",
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
      const eased    = 1 - Math.pow(1 - progress, 3)
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
  const orders    = useCountUp(5000, started, 2500)
  const mins      = useCountUp(30,   started, 1200)
  const years     = useCountUp(3,    started, 1000)

  return (
    <div className="about-stats" ref={ref}>
      <div className="about-stat">
        <span className="about-stat-num">{customers.toLocaleString()}+</span>
        <span className="about-stat-label">Happy Customers</span>
      </div>
      <div className="about-stat">
        <span className="about-stat-num">{orders.toLocaleString()}+</span>
        <span className="about-stat-label">Orders Delivered</span>
      </div>
      <div className="about-stat">
        <span className="about-stat-num">{mins}</span>
        <span className="about-stat-label">Min Avg Delivery</span>
      </div>
      <div className="about-stat">
        <span className="about-stat-num">{years}+</span>
        <span className="about-stat-label">Years of Baking</span>
      </div>
    </div>
  )
}

// ── Team card ─────────────────────────────────────────────────
function TeamCard({ member, index }) {
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
    <div
      ref={ref}
      className={`team-card ${visible ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Photo */}
      <div className="team-photo-wrap" style={{ background: member.accent }}>
        {member.img ? (
          <img src={member.img} alt={member.name} className="team-photo" />
        ) : (
          <div className="team-photo-placeholder" style={{ background: member.color }}>
            <span>{member.name.split(' ').map(n => n[0]).join('')}</span>
          </div>
        )}
        {/* Color strip at bottom of photo */}
        <div className="team-photo-strip" style={{ background: member.color }} />
      </div>

      {/* Info */}
      <div className="team-card-body">
        <div className="team-card-header">
          <div>
            <h3 className="team-name">{member.name}</h3>
            <p className="team-role" style={{ color: member.color }}>{member.role}</p>
          </div>
        </div>

        {/* Story paragraphs */}
        <div className="team-story">
          {member.story.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Quote */}
        <blockquote
          className="team-quote"
          style={{
            borderLeftColor: member.color,
            background: member.accent,
          }}
        >
          <span className="team-quote-mark" style={{ color: member.color }}>"</span>
          {member.quote}
        </blockquote>

        {/* Tags */}
        <div className="team-tags">
          {member.tags.map(tag => (
            <span
              key={tag}
              className="team-tag"
              style={{ background: member.accent, color: member.color }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <>
      <main className="about-page">

        {/* ── Hero ── */}
        <div className="about-hero">
          <div className="about-hero-inner">
            <div className="contact-breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <span>About Us</span>
            </div>
            <p className="about-hero-eyebrow">Our Story</p>
            <h1 className="about-hero-title">
              Made in <em>Ile-Ife.</em><br />
              Delivered with <em>love.</em>
            </h1>
            <p className="about-hero-sub">
              SweetHUB started with one question — why should finding fresh,
              delicious snacks be so hard? We decided it shouldn't be.
              Three people, one kitchen, and a whole lot of passion later,
              here we are.
            </p>

            <div className="about-hero-location">
              <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
                <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/>
              </svg>
              Ile-Ife AP, Osun State, Nigeria
            </div>
          </div>

          {/* Blobs */}
          <div className="about-hero-blob about-blob-1" aria-hidden="true" />
          <div className="about-hero-blob about-blob-2" aria-hidden="true" />
          <div className="about-hero-blob about-blob-3" aria-hidden="true" />
        </div>

        {/* ── Stats ── */}
        <Stats />

        {/* ── Origin story ── */}
        <div className="about-origin">
          <div className="about-origin-inner">

            <div className="about-origin-text">
              <p className="about-section-eyebrow">How it started</p>
              <h2 className="about-section-title">
                A problem worth <em>solving</em>
              </h2>
              <p>
                Every morning in Ile-Ife, people wake up wanting something
                fresh, something delicious, something that doesn't come wrapped
                in plastic from yesterday. Finding it? That was the problem.
              </p>
              <p>
                Michael had watched Joy bake for long enough to know she had
                something special. But special alone doesn't reach people.
                You need a system. You need a brand. You need a plan.
              </p>
              <p>
                Fresh out of OAU in 2024, he sat down with Joy and said —
                <em> "Let's stop keeping this a secret."</em>
              </p>
              <p>
                SweetHUB was born that day. Not in a boardroom. Not with
                investors. Just three people who believed that great food
                deserves to reach great people — fast, fresh, and with
                a whole lot of heart.
              </p>
            </div>

            <div className="about-origin-milestones">
              <h3 className="about-milestones-title">Our journey</h3>
              {MILESTONES.map((m, i) => (
                <div key={i} className="about-milestone">
                  <div className="am-icon">{m.icon}</div>
                  <div className="am-line">
                    <div className="am-dot" />
                    {i < MILESTONES.length - 1 && <div className="am-connector" />}
                  </div>
                  <div className="am-content">
                    <span className="am-year">{m.year}</span>
                    <p className="am-event">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── Team ── */}
        <div className="about-team-section">
          <div className="about-team-header">
            <p className="about-section-eyebrow">The people behind every bite</p>
            <h2 className="about-section-title">Meet the <em>team</em></h2>
            <p className="about-team-sub">
              Small team. Big heart. Every order you place is touched
              by at least one of these three people.
            </p>
          </div>

          <div className="about-team-grid">
            {TEAM.map((member, i) => (
              <TeamCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </div>

        {/* ── Values ── */}
        <div className="about-values">
          <div className="about-values-inner">
            <div className="about-values-header">
              <p className="about-section-eyebrow">What we stand for</p>
              <h2 className="about-section-title">Our <em>values</em></h2>
            </div>
            <div className="about-values-grid">
              {VALUES.map((v, i) => (
                <div key={i} className="about-value-card">
                  <span className="avc-icon">{v.icon}</span>
                  <h3 className="avc-title">{v.title}</h3>
                  <p className="avc-desc">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <div className="about-cta">
          <div className="about-cta-inner">
            <h2>
              Now that you know us —<br />
              <em>let's feed you.</em>
            </h2>
            <p>
              Every order is a little piece of what Joy, Michael and Janet
              put their hearts into. We can't wait for you to taste it.
            </p>
            <div className="about-cta-btns">
              <Link to="/#order" className="about-cta-primary">
                Order Now
                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
                  <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/>
                </svg>
              </Link>
              <Link to="/contact" className="about-cta-secondary">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}