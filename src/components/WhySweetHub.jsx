import { useState, useEffect, useRef } from 'react'

import amaka from '../assets/homepage/amaka.webp'
import abbie from '../assets/homepage/abbie.webp'
import tunde from '../assets/homepage/tunde.webp'
import blessing from '../assets/homepage/blessing.webp'
import chioma from '../assets/homepage/chioma.webp'
import faith from '../assets/homepage/faith.webp'
import janet from '../assets/homepage/janet.webp'


// ── Typewriter lines ──────────────────────────────────────────
const LINES = [
  { text: '> Why choose SweetHUB?',          color: '#ffb84d', speed: 55 },
  { text: '  Because we bake fresh.',         color: '#fffdfa', speed: 60 },
  { text: '  Every. Single. Day.',            color: '#e74c3c', speed: 80 },
  { text: '',                                 color: '',        speed: 0  },
  { text: '> No frozen. No reheated.',        color: '#ffb84d', speed: 55 },
  { text: '  Your order starts the moment',  color: '#fffdfa', speed: 50 },
  { text: '  you place it. ',                 color: '#fffdfa', speed: 60 },
  { text: '',                                 color: '',        speed: 0  },
  { text: '> Delivery in 30 minutes.',        color: '#ffb84d', speed: 55 },
  { text: "  We don't keep you waiting.",     color: '#fffdfa', speed: 55 },
  { text: "  Hunger won't either.",           color: '#e74c3c', speed: 60 },
  { text: '',                                 color: '',        speed: 0  },
  { text: '> Custom orders welcome.',         color: '#ffb84d', speed: 55 },
  { text: '  Your vision. Our kitchen.',      color: '#fffdfa', speed: 60 },
  { text: '  Made exactly how you want.',     color: '#fffdfa', speed: 55 },
  { text: '',                                 color: '',        speed: 0  },
  { text: '> 2,400+ happy customers',         color: '#ffb84d', speed: 55 },
  { text: "  can't be wrong.",                color: '#e74c3c', speed: 70 },
  { text: '',                                 color: '',        speed: 0  },
  { text: '> Ready to taste the difference?', color: '#ffb84d', speed: 48 },
  { text: '  Order now. ↓',                   color: '#e74c3c', speed: 80 },
]

const CUSTOMERS = [
  {
    id: 1,
    name: 'Amaka J.',
    location: 'Ojaja',
    img: amaka,
    color: '#c0392b',
    review: "SweetHUB puff puff hits different. I can't order from anywhere else anymore!",
    order: 'Puff Puff x 50',
    rating: 5,
  },
  {
    id: 2,
    name: 'Tunde B.',
    location: 'Lekki',
    img: tunde,
    color: '#e67e22',
    review: "Ordered sweethub chin-chin for my office staff. Everyone finished it in 10 minutes. Reordering!",
    order: 'Chin-Chin x 100',
    rating: 5,
  },
  {
    id: 3,
    name: 'Chioma N.',
    location: 'Victoria Island',
    img: chioma,
    color: '#8e44ad',
    review: "The custom birthday cake was EVERYTHING. My friends thought I flew it in from Dubai.",
    order: 'Custom Cake',
    rating: 5,
  },
  {
    id: 4,
    name: 'Abbie O.',
    location: 'Phase 2',
    img: abbie,
    color: '#4a7c59',
    review: "Meat pie arrived hot in 28 minutes. I literally timed it. These guys are serious!",
    order: 'Meat Pie x 3',
    rating: 5,
  },
  {
    id: 5,
    name: 'Janet K.',
    location: 'Ikeja',
    img: janet,
    color: '#2980b9',
    review: "Wedding snacks sorted! 200 guests, zero complaints. SweetHUB saved my wedding.",
    order: 'Bulk Order',
    rating: 5,
  },
  {
    id: 6,
    name: 'Faith O.',
    location: 'Lagos',
    img: faith,
    color: '#d35400',
    review: "Doughnuts for breakfast every Saturday now. My whole family is completely addicted.",
    order: 'Doughnut x 6',
    rating: 5,
  },
  {
    id: 7,
    name: 'Blessing E.',
    location: 'Mayfair',
    img: blessing,
    color: '#b7950b',
    review: "The cake parfait is an experience. I cried a little. It is honestly that good.",
    order: 'Cake Parfait x 4',
    rating: 5,
  },
]

// ── Typewriter hook ───────────────────────────────────────────
function useTypewriter(started) {
  const [displayedLines, setDisplayedLines] = useState([])
  const [currentLine, setCurrentLine]       = useState(0)
  const [currentChar, setCurrentChar]       = useState(0)
  const [showCursor, setShowCursor]         = useState(true)
  const timeoutRef                          = useRef(null)

  useEffect(() => {
    const t = setInterval(() => setShowCursor(p => !p), 530)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!started) return
    if (currentLine >= LINES.length) return
    const line = LINES[currentLine]

    if (line.text === '') {
      timeoutRef.current = setTimeout(() => {
        setDisplayedLines(prev => [...prev, { text: '', color: '' }])
        setCurrentLine(l => l + 1)
        setCurrentChar(0)
      }, 320)
      return
    }

    if (currentChar < line.text.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayedLines(prev => {
          const next = [...prev]
          if (next.length <= currentLine) {
            next.push({ text: line.text[currentChar], color: line.color })
          } else {
            next[currentLine] = {
              text: next[currentLine].text + line.text[currentChar],
              color: line.color,
            }
          }
          return next
        })
        setCurrentChar(c => c + 1)
      }, line.speed + (Math.random() * 25 - 12))
      return
    }

    timeoutRef.current = setTimeout(() => {
      setCurrentLine(l => l + 1)
      setCurrentChar(0)
    }, currentLine % 4 === 2 ? 600 : 180)

    return () => clearTimeout(timeoutRef.current)
  }, [started, currentLine, currentChar])

  const isFinished = currentLine >= LINES.length
  return { displayedLines, showCursor, isFinished, currentLine }
}

// ── Orbital reviews ───────────────────────────────────────────
function OrbitalReviews() {
  const ORBIT_DURATION = 30000
  const ORBIT_R        = 130
  const CENTER         = 160

  const [angle, setAngle]       = useState(0)
  const [active, setActive]     = useState(0)
  const [featured, setFeatured] = useState(CUSTOMERS[0])
  const [fading, setFading]     = useState(false)
  const rafRef                  = useRef(null)
  const startRef                = useRef(null)
  const lastActive              = useRef(0)

  useEffect(() => {
    const step = (ts) => {
      if (!startRef.current) startRef.current = ts
      const elapsed  = ts - startRef.current
      const newAngle = (elapsed / ORBIT_DURATION) * 360
      setAngle(newAngle)

      const count  = CUSTOMERS.length
      const topIdx = CUSTOMERS.reduce((closest, _, i) => {
        const itemAngle    = ((360 / count) * i + newAngle) % 360
        const distToTop    = Math.abs(((itemAngle - 270 + 360) % 360))
        const closestAngle = ((360 / count) * closest + newAngle) % 360
        const closestDist  = Math.abs(((closestAngle - 270 + 360) % 360))
        return distToTop < closestDist ? i : closest
      }, 0)

      if (topIdx !== lastActive.current) {
        lastActive.current = topIdx
        setActive(topIdx)
        setFading(true)
        setTimeout(() => {
          setFeatured(CUSTOMERS[topIdx])
          setFading(false)
        }, 280)
      }

      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const count = CUSTOMERS.length

  return (
    <div className="orbital-wrap">

      <div className="orbital-svg-container">
        <svg
          className="orbital-svg"
          viewBox="0 0 320 320"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Dashed orbit ring */}
          <circle
            cx={CENTER} cy={CENTER} r={ORBIT_R}
            fill="none"
            stroke="rgba(192,57,43,0.15)"
            strokeWidth="1.5"
            strokeDasharray="5 7"
          />

          {/* Center blob */}
          <g transform="translate(95, 95) scale(0.65)">
            <path
              fill="rgba(192,57,43,0.07)"
              stroke="rgba(192,57,43,0.12)"
              strokeWidth="1"
              d="M39,-61.8C50.6,-53.3,59.9,-42.5,68.6,-29.6C77.2,-16.6,85.1,-1.6,82.5,11.4C79.9,24.4,66.8,35.5,55,45.7C43.1,56,32.6,65.4,19.8,70.7C7,75.9,-8,77.1,-21.7,73.3C-35.5,69.6,-48,61,-56.8,49.8C-65.6,38.6,-70.7,24.7,-73.2,10.2C-75.8,-4.3,-75.8,-19.5,-69.4,-30.9C-62.9,-42.3,-50,-49.9,-37.3,-57.9C-24.7,-65.9,-12.3,-74.2,0.7,-75.3C13.7,-76.4,27.5,-70.3,39,-61.8Z"
              transform="translate(100 100)"
            />
          </g>

          {/* Orbiting avatars */}
          {CUSTOMERS.map((customer, i) => {
            const baseAngle = (360 / count) * i
            const currAngle = ((baseAngle + angle) % 360) * (Math.PI / 180)
            const x         = CENTER + ORBIT_R * Math.cos(currAngle)
            const y         = CENTER + ORBIT_R * Math.sin(currAngle)
            const isActive  = i === active
            const size      = isActive ? 26 : 20

            return (
              <g key={customer.id} transform={`translate(${x}, ${y})`}>
                {/* Double glow rings on active */}
                {isActive && (
                  <>
                    <circle cx={0} cy={0} r={size + 8}
                      fill="none"
                      stroke={customer.color}
                      strokeWidth="1.5"
                      opacity="0.25"
                    />
                    <circle cx={0} cy={0} r={size + 4}
                      fill="none"
                      stroke={customer.color}
                      strokeWidth="1"
                      opacity="0.5"
                    />
                  </>
                )}

                {/* Avatar circle — acts as clip + background */}
                <clipPath id={`clip-${customer.id}`}>
                  <circle cx={0} cy={0} r={size} />
                </clipPath>

                {/* Background fill */}
                <circle
                  cx={0} cy={0} r={size}
                  fill={customer.img ? '#f5f0eb' : customer.color}
                  stroke={customer.color}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  style={{
                    filter: isActive
                      ? `drop-shadow(0 4px 10px ${customer.color}66)`
                      : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                    transition: 'all 0.4s ease'
                  }}
                />

                {/* Real photo — clipped to circle */}
                {customer.img ? (
                  <image
                    href={customer.img}
                    x={-size} y={-size}
                    width={size * 2}
                    height={size * 2}
                    clipPath={`url(#clip-${customer.id})`}
                    preserveAspectRatio="xMidYMid slice"
                    style={{ transition: 'all 0.4s ease' }}
                  />
                ) : (
                  /* Placeholder initials when no photo */
                  <text
                    x={0} y={0}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={isActive ? '13' : '10'}
                    fontWeight="700"
                    fill="white"
                    fontFamily="system-ui, sans-serif"
                    style={{ userSelect: 'none', transition: 'font-size 0.4s ease' }}
                  >
                    {customer.name.charAt(0)}
                  </text>
                )}
              </g>
            )
          })}
        </svg>

        {/* Featured card over blob */}
        <div className={`orbital-featured ${fading ? 'fading' : ''}`}>

          {/* Avatar */}
          <div
            className="of-avatar"
            style={{
              borderColor: featured.color,
              boxShadow: `0 4px 16px ${featured.color}44`,
            }}
          >
            {featured.img ? (
              <img
                src={featured.img}
                alt={featured.name}
                className="of-avatar-img"
              />
            ) : (
              /* Placeholder initials */
              <div
                className="of-avatar-placeholder"
                style={{ background: featured.color }}
              >
                {featured.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="of-name">{featured.name}</div>
          <div className="of-location">{featured.location}</div>
          <p className="of-review">"{featured.review}"</p>
          <div
            className="of-order"
            style={{
              color: featured.color,
              background: `${featured.color}15`,
              borderColor: `${featured.color}25`,
            }}
          >
            {featured.order}
          </div>
          <div className="of-stars">
            {'★'.repeat(featured.rating)}
          </div>

        </div>
      </div>

      {/* VIP CTA — reuses your exact why-cta styles */}
      <div className="orbital-cta why-cta visible">
        <p>Still not convinced? Try one order.</p>
        <p className="why-cta-sub">We guarantee you'll be back for more.</p>
        <a href="#order" className="why-cta-btn">
          Order Now
          <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
            <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/>
          </svg>
        </a>
      </div>

    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function WhySweetHUB() {
  const [started, setStarted] = useState(false)
  const sectionRef            = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [started])

  const { displayedLines, showCursor, isFinished, currentLine } = useTypewriter(started)

  return (
    <section
      className="why-section"
      id="why-sweethub"
      ref={sectionRef}
      aria-label="Why choose SweetHUB"
    >

      <div className="why-header">
        <p className="why-eyebrow">The SweetHUB Difference</p>
        <h2 className="why-heading">
          Why thousands choose <em>us</em>
        </h2>
      </div>

      <div className="why-body">

        {/* LEFT — terminal */}
        <div className="why-terminal-wrap">
          <div className="why-terminal">

            <div className="why-terminal-bar">
              <div className="why-terminal-dots">
                <span className="wtd wtd-red"   />
                <span className="wtd wtd-yellow" />
                <span className="wtd wtd-green"  />
              </div>
              <span className="why-terminal-title">sweethub — fresh_batch.log</span>
              <span className="why-terminal-tag">
                {isFinished ? '✓ done' : '● running'}
              </span>
            </div>

            <div className="why-terminal-body" aria-live="polite">
              {displayedLines.map((line, i) => (
                <div key={i} className="why-terminal-line">
                  {line.text === '' ? (
                    <span>&nbsp;</span>
                  ) : (
                    <span
                      className={line.text.startsWith('>') ? 'wt-prompt' : 'wt-body'}
                      style={{ color: line.color }}
                    >
                      {line.text}
                    </span>
                  )}
                  {i === currentLine && !isFinished && (
                    <span className="why-cursor" style={{ opacity: showCursor ? 1 : 0 }}>▋</span>
                  )}
                </div>
              ))}
              {displayedLines.length === 0 && (
                <div className="why-terminal-line">
                  <span className="why-cursor" style={{ opacity: showCursor ? 1 : 0 }}>▋</span>
                </div>
              )}
              {isFinished && (
                <div className="why-terminal-line">
                  <span className="why-cursor" style={{ opacity: showCursor ? 1 : 0 }}>▋</span>
                </div>
              )}
            </div>

            <div className="why-terminal-footer">
              <span className="wtf-dot" />
              <span>SweetHUB v1.0 · Ile-Ife, Nigeria</span>
            </div>

          </div>
        </div>

        {/* RIGHT — orbital */}
        <OrbitalReviews />

      </div>
    </section>
  )
}