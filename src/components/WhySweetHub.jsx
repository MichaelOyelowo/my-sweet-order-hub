import { useState, useEffect, useRef } from 'react'

// ── Typewriter lines ──────────────────────────────────────────
const LINES =[
  { text: '> Why choose SweetHUB?',         color: '#ffb84d', speed: 55  }, /* Warm Gold */
  { text: '  Because we bake fresh.',        color: '#fffdfa', speed: 60  }, /* Soft Cream */
  { text: '  Every. Single. Day.',           color: '#e74c3c', speed: 80  }, /* Brand Red Highlight */
  { text: '',                                color: '',        speed: 0   },
  { text: '> No frozen. No reheated.',       color: '#ffb84d', speed: 55  },
  { text: '  Your order starts the moment', color: '#fffdfa', speed: 50  },
  { text: '  you place it. 🍰',              color: '#fffdfa', speed: 60  },
  { text: '',                                color: '',        speed: 0   },
  { text: '> Delivery in 30 minutes.',       color: '#ffb84d', speed: 55  },
  { text: '  We don\'t keep you waiting.',   color: '#fffdfa', speed: 55  },
  { text: '  Hunger won\'t either. 😄',      color: '#e74c3c', speed: 60  },
  { text: '',                                color: '',        speed: 0   },
  { text: '> Custom orders welcome.',        color: '#ffb84d', speed: 55  },
  { text: '  Your vision. Our kitchen.',     color: '#fffdfa', speed: 60  },
  { text: '  Made exactly how you want.',    color: '#fffdfa', speed: 55  },
  { text: '',                                color: '',        speed: 0   },
  { text: '> 2,400+ happy customers',        color: '#ffb84d', speed: 55  },
  { text: '  can\'t be wrong. 😍',           color: '#e74c3c', speed: 70  },
  { text: '',                                color: '',        speed: 0   },
  { text: '> Ready to taste the difference?',color: '#ffb84d', speed: 48  },
  { text: '  Order now. ↓',                  color: '#e74c3c', speed: 80  },
]

const TRUST_CARDS = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="currentColor">
        <path d="M195-195q-35-35-35-85H60l18-80h113q17-19 40-29.5t49-10.5q26 0 49 10.5t40 29.5h167l84-360H182l4-17q6-28 27.5-45.5T264-800h456l-37 160h117l120 160-40 200h-80q0 50-35 85t-85 35q-50 0-85-35t-35-85H400q0 50-35 85t-85 35q-50 0-85-35Zm442-245h193l4-21-74-99h-95l-28 120Zm-19-273 2-7-84 360 2-7 34-146 46-200ZM20-427l20-80h220l-20 80H20Zm80-146 20-80h260l-20 80H100Zm180 333q17 0 28.5-11.5T320-280q0-17-11.5-28.5T280-320q-17 0-28.5 11.5T240-280q0 17 11.5 28.5T280-240Zm400 0q17 0 28.5-11.5T720-280q0-17-11.5-28.5T680-320q-17 0-28.5 11.5T640-280q0 17 11.5 28.5T680-240Z"/>
      </svg>
    ),
    title: '30-Min Delivery',
    desc: 'From our kitchen to your door in under 30 minutes. Fresh, hot and exactly on time.',
    stat: '< 30 min',
    statLabel: 'average delivery',
    accent: '#f5a623',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="currentColor">
        <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
      </svg>
    ),
    title: 'Made Fresh Daily',
    desc: 'No frozen stock. No shortcuts. Every item is baked fresh the moment you order.',
    stat: '100%',
    statLabel: 'fresh every order',
    accent: '#c0392b',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="currentColor">
        <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/>
      </svg>
    ),
    title: '2,400+ Happy Customers',
    desc: 'Real people, real reviews. Our customers keep coming back because quality never lies.',
    stat: '4.9 ★',
    statLabel: 'average rating',
    accent: '#4a7c59',
  },
]

// ── Typewriter hook ───────────────────────────────────────────
function useTypewriter(started) {
  const [displayedLines, setDisplayedLines] = useState([])
  const [currentLine, setCurrentLine]       = useState(0)
  const [currentChar, setCurrentChar]       = useState(0)
  const [showCursor, setShowCursor]         = useState(true)
  const timeoutRef = useRef(null)

  // Cursor blink
  useEffect(() => {
    const t = setInterval(() => setShowCursor(p => !p), 530)
    return () => clearInterval(t)
  }, [])

  // Typing engine
  useEffect(() => {
    if (!started) return
    if (currentLine >= LINES.length) return

    const line = LINES[currentLine]

    // Empty line — just add it and move on after a pause
    if (line.text === '') {
      timeoutRef.current = setTimeout(() => {
        setDisplayedLines(prev => [...prev, { text: '', color: '' }])
        setCurrentLine(l => l + 1)
        setCurrentChar(0)
      }, 320)
      return
    }

    // Still typing current line
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
      }, line.speed + (Math.random() * 25 - 12)) // slight randomness = human feel
      return
    }

    // Line finished — pause then move to next
    timeoutRef.current = setTimeout(() => {
      setCurrentLine(l => l + 1)
      setCurrentChar(0)
    }, currentLine % 4 === 2 ? 600 : 180) // longer pause at end of blocks

    return () => clearTimeout(timeoutRef.current)
  }, [started, currentLine, currentChar])

  const isFinished = currentLine >= LINES.length

  return { displayedLines, showCursor, isFinished, currentLine }
}

// ── Trust card ────────────────────────────────────────────────
function TrustCard({ card, index, visible }) {
  return (
    <div
      className={`why-card ${visible ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="why-card-top">
        <div className="why-card-icon" style={{ color: card.accent, background: `${card.accent}18` }}>
          {card.icon}
        </div>
        <div className="why-card-stat-wrap">
          <span className="why-card-stat" style={{ color: card.accent }}>{card.stat}</span>
          <span className="why-card-stat-label">{card.statLabel}</span>
        </div>
      </div>
      <h3 className="why-card-title">{card.title}</h3>
      <p className="why-card-desc">{card.desc}</p>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function WhySweetHUB() {
  const [started, setStarted] = useState(false)
  const [cardsVisible, setCardsVisible] = useState(false)
  const sectionRef = useRef(null)

  // Start when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
          setTimeout(() => setCardsVisible(true), 400)
        }
      },
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

      {/* ── Section header ── */}
      <div className="why-header">
        <p className="why-eyebrow">The SweetHUB Difference</p>
        <h2 className="why-heading">
          Why thousands choose <em>us</em>
        </h2>
      </div>

      <div className="why-body">

        {/* ── LEFT — dark terminal with typewriter ── */}
        <div className="why-terminal-wrap">
          <div className="why-terminal">

            {/* Terminal title bar */}
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

            {/* Terminal body */}
            <div className="why-terminal-body" aria-live="polite" aria-label="Typing animation">

              {/* Rendered lines */}
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
                  {/* Cursor on the active line */}
                  {i === currentLine && !isFinished && (
                    <span
                      className="why-cursor"
                      style={{ opacity: showCursor ? 1 : 0 }}
                    >▋</span>
                  )}
                </div>
              ))}

              {/* Cursor at end if still on unrendered line */}
              {displayedLines.length === 0 && (
                <div className="why-terminal-line">
                  <span
                    className="why-cursor"
                    style={{ opacity: showCursor ? 1 : 0 }}
                  >▋</span>
                </div>
              )}

              {/* Final cursor blink when done */}
              {isFinished && (
                <div className="why-terminal-line">
                  <span
                    className="why-cursor"
                    style={{ opacity: showCursor ? 1 : 0 }}
                  >▋</span>
                </div>
              )}

            </div>

            {/* Terminal footer */}
            <div className="why-terminal-footer">
              <span className="wtf-dot" />
              <span>SweetHUB v1.0 · Ile-Ife, Nigeria</span>
            </div>

          </div>
        </div>

        {/* ── RIGHT — trust cards ── */}
        <div className="why-cards-wrap">
          <div className="why-cards">
            {TRUST_CARDS.map((card, i) => (
              <TrustCard
                key={card.title}
                card={card}
                index={i}
                visible={cardsVisible}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className={`why-cta ${cardsVisible ? 'visible' : ''}`}>
            <p>Still not convinced? Try one order.</p>
            <p className="why-cta-sub">
              We guarantee you'll be back for more.
            </p>
            <a href="#order" className="why-cta-btn">
              Order Now
              <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
                <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/>
              </svg>
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}