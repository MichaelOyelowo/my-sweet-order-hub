import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Fake winner names for the ticker ─────────────────────────
const WINNERS = [
  'Chidi won Free Puff Puff 🟠',
  'Amaka won 10% Off 💰',
  'Tunde won Free Delivery 🛵',
  'Ngozi won Free Chin-Chin 🟡',
  'Emeka won Free Puff Puff 🟠',
  'Blessing won 10% Off 💰',
  'Kemi won Free Delivery 🛵',
  'Seun won Free Chin-Chin 🟡',
  'Dayo won Free Puff Puff 🟠',
  'Yemi won 10% Off 💰',
]

// ── Floating food items that drift across the banner ─────────
const FLOATERS = ['🟠','🍩','🥧','🧁','🟡','🍞','🥚','🌭','🐟','🎂']

function GameTeaser() {
  const navigate       = useNavigate()
  const [count, setCount] = useState(0)
  const countRef       = useRef(null)

  // Count up to 247 (fake players today)
  useEffect(() => {
    let n = 0
    const target = 247
    const step = Math.ceil(target / 60)
    countRef.current = setInterval(() => {
      n = Math.min(n + step, target)
      setCount(n)
      if (n >= target) clearInterval(countRef.current)
    }, 24)
    return () => clearInterval(countRef.current)
  }, [])

  return (
    <section className="gt-section" aria-label="SweetHUB Game Arena">

      {/* ── Floating food emojis in background ── */}
      <div className="gt-floaters" aria-hidden="true">
        {FLOATERS.map((emoji, i) => (
          <span
            key={i}
            className="gt-floater"
            style={{
              '--delay':  `${i * 0.7}s`,
              '--dur':    `${14 + i * 1.3}s`,
              '--left':   `${5 + i * 9}%`,
              '--size':   `${18 + (i % 3) * 8}px`,
              '--opacity': `${0.06 + (i % 4) * 0.03}`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      {/* ── Grid overlay ── */}
      <div className="gt-grid" aria-hidden="true" />

      {/* ── Corner brackets ── */}
      <div className="gt-corner gt-corner-tl" aria-hidden="true" />
      <div className="gt-corner gt-corner-tr" aria-hidden="true" />
      <div className="gt-corner gt-corner-bl" aria-hidden="true" />
      <div className="gt-corner gt-corner-br" aria-hidden="true" />

      {/* ── Main content ── */}
      <div className="gt-inner">

        {/* Left — text content */}
        <div className="gt-left">

          <div className="gt-live-badge">
            <span className="gt-live-dot" />
            <span>Game Arena</span>
            <span className="gt-live-sep">·</span>
            <span className="gt-live-count">{count} playing today</span>
          </div>

          <h2 className="gt-heading">
            <span className="gt-heading-line1">Can You</span>
            <span className="gt-heading-line2">
              Beat the
              <span className="gt-heading-accent"> Challenge?</span>
            </span>
          </h2>

          <p className="gt-desc">
            We hid something special behind our games.
            Win and you'll find out exactly what it is — 
            but we promise your next order will feel
            <em> very different.</em>
          </p>

          <div className="gt-stats">
            <div className="gt-stat">
              <span className="gt-stat-num">3</span>
              <span className="gt-stat-label">Games</span>
            </div>
            <div className="gt-stat-divider" />
            <div className="gt-stat">
              <span className="gt-stat-num">4</span>
              <span className="gt-stat-label">Rewards</span>
            </div>
            <div className="gt-stat-divider" />
            <div className="gt-stat">
              <span className="gt-stat-num">1</span>
              <span className="gt-stat-label">Click Away</span>
            </div>
          </div>

          <div className="gt-btns">
            <button
              className="gt-btn-primary"
              onClick={() => navigate('/games')}
              aria-label="Go to Game Arena"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor" aria-hidden="true">
                <path d="M240-400h80v-120h120v-80H320v-120h-80v120H120v80h120v120Zm260 0h240v-80H500v80Zm0-160h240v-80H500v80ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Z"/>
              </svg>
              Enter Game Arena
            </button>

            <button
              className="gt-btn-ghost"
              onClick={() => navigate('/games')}
            >
              What can I win? →
            </button>
          </div>

        </div>

        {/* Right — visual card stack */}
        <div className="gt-right" aria-hidden="true">
          <div className="gt-card-stack">

            {/* Back card */}
            <div className="gt-card gt-card-back">
              <div className="gt-card-icon">🃏</div>
              <span className="gt-card-label">Memory Match</span>
            </div>

            {/* Middle card */}
            <div className="gt-card gt-card-mid">
              <div className="gt-card-icon">🍿</div>
              <span className="gt-card-label">Catch Snacks</span>
            </div>

            {/* Front card */}
            <div className="gt-card gt-card-front">
              <div className="gt-card-shine" />
              <div className="gt-card-content">
                <div className="gt-card-icon-large">🧩</div>
                <span className="gt-card-title">Sliding Puzzle</span>
                <span className="gt-card-sub">Solve it. Win it.</span>
                <div className="gt-card-reward">
                  <span className="gt-reward-dot" />
                  <span>Reward inside</span>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="gt-floating-badge">
              🏆 Win free snacks!
            </div>

          </div>
        </div>

      </div>

      {/* ── Winner ticker ── */}
      <div className="gt-ticker" aria-hidden="true">
        <div className="gt-ticker-label">Recent wins</div>
        <div className="gt-ticker-track">
          <div className="gt-ticker-inner">
            {[...WINNERS, ...WINNERS].map((w, i) => (
              <span key={i} className="gt-ticker-item">
                <span className="gt-ticker-star">★</span>
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}

export default GameTeaser