import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const WINNERS = [
  { name: 'Chidi O.',    reward: 'Free Puff Puff',   icon: '🟠', loc: 'Ile-Ife'  },
  { name: 'Amaka J.',    reward: '10% Off',           icon: '💰', loc: 'Lagos'    },
  { name: 'Tunde B.',    reward: 'Free Delivery',     icon: '🛵', loc: 'Lekki'    },
  { name: 'Ngozi E.',    reward: 'Free Chin-Chin',    icon: '🟡', loc: 'Surulere' },
  { name: 'Emeka K.',    reward: 'Free Puff Puff',   icon: '🟠', loc: 'Ibadan'   },
  { name: 'Blessing A.', reward: '10% Off',           icon: '💰', loc: 'Abuja'    },
  { name: 'Kemi L.',     reward: 'Free Delivery',     icon: '🛵', loc: 'Yaba'     },
  { name: 'Seun F.',     reward: 'Free Chin-Chin',    icon: '🟡', loc: 'V.Island' },
  { name: 'Dayo M.',     reward: 'Free Puff Puff',   icon: '🟠', loc: 'Ajah'     },
  { name: 'Fatima R.',   reward: '10% Off',           icon: '💰', loc: 'Ikeja'    },
]

const GAMES = [
  {
    id: 'puzzle',
    icon: '🧩',
    name: 'Sliding Puzzle',
    sub: 'Arrange the tiles',
    color: '#c0392b',
    glow: 'rgba(192,57,43,0.4)',
    difficulty: 'Medium',
  },
  {
    id: 'memory',
    icon: '🃏',
    name: 'Memory Match',
    sub: 'Find the pairs',
    color: '#8e44ad',
    glow: 'rgba(142,68,173,0.4)',
    difficulty: 'Easy',
  },
  {
    id: 'catch',
    icon: '🍿',
    name: 'Catch Snacks',
    sub: 'Grab them all',
    color: '#e67e22',
    glow: 'rgba(230,126,34,0.4)',
    difficulty: 'Hard',
  },
]

const REWARDS = [
  { icon: '🟠', label: 'Free Puff Puff',  count: '5 pieces'  },
  { icon: '🟡', label: 'Free Chin-Chin',  count: '3 sachets' },
  { icon: '💰', label: '10% Off Order',   count: 'full order' },
  { icon: '🛵', label: 'Free Delivery',   count: 'next order' },
]

const FLOATERS = ['🟠','🍩','🥧','🧁','🟡','🍞','🥚','🌭','🐟','🎂','🍰','🍡']

// ── Animated char-by-char heading ────────────────────────────
function GlitchHeading({ text, className }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone]           = useState(false)
  const ref                       = useRef(null)
  const started                   = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          let i = 0
          const chars = text.split('')
          const interval = setInterval(() => {
            setDisplayed(chars.slice(0, i + 1).join(''))
            i++
            if (i >= chars.length) {
              clearInterval(interval)
              setDone(true)
            }
          }, 55)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [text])

  return (
    <span ref={ref} className={`${className} ${done ? 'typed-done' : 'typing'}`}>
      {displayed}
      {!done && <span className="gt-type-cursor">▋</span>}
    </span>
  )
}

export default function GameTeaser() {
  const navigate = useNavigate()
  const [count, setCount]         = useState(0)
  const [activeGame, setActiveGame] = useState(0)
  const [tickerPaused, setTickerPaused] = useState(false)

  // Count up
  useEffect(() => {
    let n = 0
    const target = 247
    const interval = setInterval(() => {
      n = Math.min(n + 4, target)
      setCount(n)
      if (n >= target) clearInterval(interval)
    }, 20)
    return () => clearInterval(interval)
  }, [])

  // Auto-rotate game cards
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveGame(p => (p + 1) % GAMES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const game = GAMES[activeGame]

  return (
    <section className="gt-section" aria-label="SweetHUB Game Arena">

      {/* Floating food emojis */}
      <div className="gt-floaters" aria-hidden="true">
        {FLOATERS.map((emoji, i) => (
          <span
            key={i}
            className="gt-floater"
            style={{
              '--delay':   `${i * 0.6}s`,
              '--dur':     `${16 + i * 1.1}s`,
              '--left':    `${4 + i * 8}%`,
              '--size':    `${16 + (i % 3) * 8}px`,
              '--opacity': `${0.04 + (i % 4) * 0.025}`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      {/* Grid + scan line overlay */}
      <div className="gt-grid" aria-hidden="true" />
      <div className="gt-scanlines" aria-hidden="true" />

      {/* Corner brackets */}
      <div className="gt-corner gt-corner-tl" aria-hidden="true" />
      <div className="gt-corner gt-corner-tr" aria-hidden="true" />
      <div className="gt-corner gt-corner-bl" aria-hidden="true" />
      <div className="gt-corner gt-corner-br" aria-hidden="true" />

      {/* ── Main content ── */}
      <div className="gt-inner">

        {/* LEFT */}
        <div className="gt-left">

          {/* Live badge */}
          <div className="gt-live-badge">
            <span className="gt-live-dot" />
            <span>Game Arena</span>
            <span className="gt-live-sep">·</span>
            <span className="gt-live-count">
              <span className="gt-live-num">{count}</span> playing today
            </span>
          </div>

          {/* Animated heading */}
          <div className="gt-heading">
            <span className="gt-heading-line1">
              <GlitchHeading text="Can You" className="gt-type-line" />
            </span>
            <span className="gt-heading-line2">
              Beat the
              <span className="gt-heading-accent"> Challenge?</span>
            </span>
          </div>

          {/* Description */}
          <p className="gt-desc">
            We hid something special inside our games.
            Win and you'll unlock a real reward on your next order —
            <em> puff puff, chin-chin, discounts, free delivery.</em>
            Beat us if you can. 😏
          </p>

          {/* Reward pills */}
          <div className="gt-reward-pills">
            {REWARDS.map((r, i) => (
              <div key={i} className="gt-reward-pill">
                <span className="gt-rp-icon">{r.icon}</span>
                <div className="gt-rp-text">
                  <span className="gt-rp-label">{r.label}</span>
                  <span className="gt-rp-count">{r.count}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="gt-stats">
            {[
              { num: '3',   label: 'Games'     },
              { num: '4',   label: 'Rewards'   },
              { num: '247', label: 'Won Today'  },
              { num: '30s', label: 'To Win'     },
            ].map((s, i) => (
              <div key={i} className="gt-stat">
                <span className="gt-stat-num">{s.num}</span>
                <span className="gt-stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="gt-btns">
            <button className="gt-btn-primary" onClick={() => navigate('/games')}>
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                <path d="M240-400h80v-120h120v-80H320v-120h-80v120H120v80h120v120Zm260 0h240v-80H500v80Zm0-160h240v-80H500v80ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Z"/>
              </svg>
              Enter Game Arena
            </button>
            <button className="gt-btn-ghost" onClick={() => navigate('/games')}>
              See rewards →
            </button>
          </div>

        </div>

        {/* RIGHT — interactive game showcase */}
        <div className="gt-right">
          <div className="gt-showcase">

            {/* Game selector tabs */}
            <div className="gt-game-tabs">
              {GAMES.map((g, i) => (
                <button
                  key={g.id}
                  className={`gt-game-tab ${i === activeGame ? 'active' : ''}`}
                  style={i === activeGame ? { borderColor: g.color, color: g.color } : {}}
                  onClick={() => setActiveGame(i)}
                >
                  {g.icon} {g.name}
                </button>
              ))}
            </div>

            {/* Active game card */}
            <div
              className="gt-game-card"
              style={{ '--game-color': game.color, '--game-glow': game.glow }}
              key={game.id}
            >
              {/* Animated glow border */}
              <div className="gt-game-card-border" />

              {/* Card header */}
              <div className="gt-game-card-header">
                <div className="gt-game-card-icon">{game.icon}</div>
                <div className="gt-game-card-meta">
                  <span className="gt-game-card-name">{game.name}</span>
                  <span className="gt-game-card-sub">{game.sub}</span>
                </div>
                <div
                  className="gt-game-diff"
                  style={{
                    color: game.color,
                    background: `${game.color}18`,
                    borderColor: `${game.color}40`,
                  }}
                >
                  {game.difficulty}
                </div>
              </div>

              {/* Mini game preview — animated tiles */}
              <div className="gt-game-preview">
                {game.id === 'puzzle' && (
                  <div className="gt-preview-puzzle">
                    {[1,2,3,4,5,6,7,8,''].map((n, i) => (
                      <div
                        key={i}
                        className={`gt-puzzle-tile ${n === '' ? 'empty' : ''}`}
                        style={n !== '' ? {
                          background: `hsl(${(i * 40) % 360}, 60%, 35%)`,
                          animationDelay: `${i * 0.1}s`
                        } : {}}
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                )}
                {game.id === 'memory' && (
                  <div className="gt-preview-memory">
                    {[1,2,3,4,5,6,7,8].map((n, i) => (
                      <div
                        key={i}
                        className={`gt-memory-card ${i % 3 === 0 ? 'flipped' : ''}`}
                        style={{ animationDelay: `${i * 0.15}s` }}
                      >
                        <div className="gt-mc-front">🍽️</div>
                        <div className="gt-mc-back" style={{ background: game.color }}>
                          {['🟠','🟡','🍩','🥧'][Math.floor(i / 2)]}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {game.id === 'catch' && (
                  <div className="gt-preview-catch">
                    <div className="gt-catch-items">
                      {['🟠','🍩','🟡','🥧','🧁'].map((emoji, i) => (
                        <span
                          key={i}
                          className="gt-catch-item"
                          style={{ '--fall-delay': `${i * 0.4}s`, '--fall-left': `${15 + i * 17}%` }}
                        >
                          {emoji}
                        </span>
                      ))}
                    </div>
                    <div className="gt-catch-basket">🧺</div>
                  </div>
                )}

                {/* Reward overlay */}
                <div className="gt-game-reward-overlay">
                  <span className="gt-gro-icon">🏆</span>
                  <span className="gt-gro-text">Win = Free Reward</span>
                </div>
              </div>

              {/* Progress bar — fake */}
              <div className="gt-game-card-footer">
                <div className="gt-game-progress-wrap">
                  <div className="gt-game-progress-bar" style={{ '--bar-color': game.color }} />
                </div>
                <span className="gt-game-players">
                  <span style={{ color: game.color }}>●</span> {Math.floor(40 + activeGame * 30)} playing now
                </span>
              </div>

            </div>

            {/* Win rate badge */}
            <div className="gt-winrate">
              <div className="gt-winrate-inner">
                <span className="gt-wr-num">73%</span>
                <span className="gt-wr-label">of players win on their 2nd try</span>
              </div>
              <div className="gt-wr-bar-wrap">
                <div className="gt-wr-bar" />
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ── Winner ticker ── */}
      <div
        className="gt-ticker"
        onMouseEnter={() => setTickerPaused(true)}
        onMouseLeave={() => setTickerPaused(false)}
        aria-label="Recent game winners"
      >
        <div className="gt-ticker-label">
          <span className="gt-ticker-dot" />
          LIVE WINS
        </div>
        <div className="gt-ticker-track">
          <div className={`gt-ticker-inner ${tickerPaused ? 'paused' : ''}`}>
            {[...WINNERS, ...WINNERS, ...WINNERS].map((w, i) => (
              <span key={i} className="gt-ticker-item">
                <span className="gt-ticker-icon">{w.icon}</span>
                <span className="gt-ticker-name">{w.name}</span>
                <span className="gt-ticker-won">won</span>
                <span className="gt-ticker-reward">{w.reward}</span>
                <span className="gt-ticker-loc">· {w.loc}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}