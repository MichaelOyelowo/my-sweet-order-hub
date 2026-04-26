// This is the full /games page.
import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabaseClient'

// ── Config ────────────────────────────────────────────────────
const WHATSAPP = '2349029702549'
const fmt      = (n) => '₦' + n.toLocaleString()


// ── Rewards ───────────────────────────────────────────────────
const REWARDS = [
  { id: 'puffpuff', emoji: '🟠', label: 'Free Puff Puff',     desc: '5 free pieces of puff puff on your next order',  code: 'WIN-PUFF'    },
  { id: 'chinchin', emoji: '🟡', label: 'Free Chin-Chin',     desc: '3 free sachets of chin-chin on your next order', code: 'WIN-CHIN'    },
  { id: 'discount', emoji: '💰', label: '10% Off Your Order', desc: '10% discount on your entire next order',         code: 'WIN-10OFF'   },
  { id: 'delivery', emoji: '🛵', label: 'Free Delivery',      desc: 'Free delivery on your next order',               code: 'WIN-DELIVER' },
]

const FOODS = [
  { id: 1,  name: 'Puff Puff',    emoji: '🟠', color: '#e67e22' },
  { id: 2,  name: 'Chin-Chin',    emoji: '🟡', color: '#f1c40f' },
  { id: 3,  name: 'Doughnut',     emoji: '🍩', color: '#e91e8c' },
  { id: 4,  name: 'Meat Pie',     emoji: '🥧', color: '#8b4513' },
  { id: 5,  name: 'Fish Roll',    emoji: '🐟', color: '#3498db' },
  { id: 6,  name: 'Cupcake',      emoji: '🧁', color: '#9b59b6' },
  { id: 7,  name: 'Banana Bread', emoji: '🍞', color: '#d4a017' },
  { id: 8,  name: 'Egg Roll',     emoji: '🥚', color: '#f39c12' },
  { id: 9,  name: 'Sausage Roll', emoji: '🌭', color: '#c0392b' },
  { id: 10, name: 'Buns',         emoji: '🍡', color: '#d35400' },
]

const fmtTime  = (s) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`
const genCode  = (base) => `${base}-${Math.random().toString(36).slice(2,6).toUpperCase()}`
const randItem = (arr)  => arr[Math.floor(Math.random() * arr.length)]

// ── Game configs ──────────────────────────────────────────────
const GAME_CONFIGS = [
  { id: 'puzzle', name: 'Sliding Puzzle',   emoji: '🧩', tagline: 'Slide the tiles into order',      time: '3 minutes', tip: 'Use arrow keys or click tiles', color: '#c0392b' },
  { id: 'memory', name: 'Memory Match',     emoji: '🃏', tagline: 'Find all matching food pairs',    time: '2 minutes', tip: 'Remember where each food hides', color: '#8e44ad' },
  { id: 'catch',  name: 'Catch the Snacks', emoji: '🍿', tagline: 'Catch 15 snacks in your basket', time: '60 seconds', tip: 'Move mouse or arrow keys',       color: '#e67e22' },
]


// ── SLIDING PUZZLE ────────────────────────────────────────────
const GRID  = 4
const TILES = GRID * GRID
const EMPTY = TILES - 1

const TILE_COLORS = [
  '#c0392b','#e67e22','#f39c12','#d35400',
  '#8e44ad','#2980b9','#27ae60','#16a085',
  '#922b21','#1a5276','#1e8449','#6c3483',
  '#784212','#1b4f72','#0e6655','#117a65',
]

const TILE_LABELS = [
  'Puff Puff','Chin-Chin','Doughnut','Meat Pie',
  'Fish Roll','Cupcake','Banana','Egg Roll',
  'Sausage','Buns','Frank Roll','Samosa',
  'Parfait','Chicken Pie','Cake','',
]

function getNeighbors(idx) {
  const r = Math.floor(idx / GRID), c = idx % GRID
  const n = []
  if (r > 0)        n.push(idx - GRID)
  if (r < GRID - 1) n.push(idx + GRID)
  if (c > 0)        n.push(idx - 1)
  if (c < GRID - 1) n.push(idx + 1)
  return n
}

function shufflePuzzle() {
  const t = Array.from({ length: TILES }, (_, i) => i)
  let empty = TILES - 1
  for (let i = 0; i < 1000; i++) {
    const nb   = getNeighbors(empty)
    const pick = nb[Math.floor(Math.random() * nb.length)]
    t[empty] = t[pick]; t[pick] = EMPTY; empty = pick
  }
  return t
}

function isPuzzleSolved(t) { return t.every((v, i) => v === i) }

function SlidingPuzzle({ onWin }) {
  const [tiles, setTiles]       = useState(shufflePuzzle)
  const [moves, setMoves]       = useState(0)
  const [timeLeft, setTimeLeft] = useState(3 * 60)
  const timerRef                = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) { clearInterval(timerRef.current); return 0 }
        return p - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  useEffect(() => { if (timeLeft === 0) onWin(false) }, [timeLeft])

  const move = useCallback((idx) => {
    setTiles(prev => {
      const empty = prev.indexOf(EMPTY)
      if (!getNeighbors(empty).includes(idx)) return prev
      const next = [...prev]
      next[empty] = next[idx]; next[idx] = EMPTY
      if (isPuzzleSolved(next)) { clearInterval(timerRef.current); setTimeout(() => onWin(true), 300) }
      return next
    })
    setMoves(m => m + 1)
  }, [])

  useEffect(() => {
    const handleKey = (e) => {
      setTiles(prev => {
        const empty = prev.indexOf(EMPTY)
        const r = Math.floor(empty / GRID), c = empty % GRID
        let target = null
        if (e.key === 'ArrowUp'    && r < GRID - 1) target = empty + GRID
        if (e.key === 'ArrowDown'  && r > 0)        target = empty - GRID
        if (e.key === 'ArrowLeft'  && c < GRID - 1) target = empty + 1
        if (e.key === 'ArrowRight' && c > 0)        target = empty - 1
        if (target === null) return prev
        const next = [...prev]
        next[empty] = next[target]; next[target] = EMPTY
        if (isPuzzleSolved(next)) { clearInterval(timerRef.current); setTimeout(() => onWin(true), 300) }
        setMoves(m => m + 1)
        return next
      })
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const pct    = (timeLeft / (3 * 60)) * 100
  const tColor = timeLeft > 60 ? '#27ae60' : timeLeft > 30 ? '#e67e22' : '#c0392b'

  return (
    <div className="game-wrap">
      <div className="game-topbar">
        <div className="game-stat"><span className="gs-label">Moves</span><span className="gs-val">{moves}</span></div>
        <div className="game-timer-ring-wrap">
          <svg viewBox="0 0 44 44" className="game-timer-svg">
            <circle cx="22" cy="22" r="18" fill="none" stroke="#f0e6dc" strokeWidth="3"/>
            <circle cx="22" cy="22" r="18" fill="none" stroke={tColor} strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 18}`}
              strokeDashoffset={`${2 * Math.PI * 18 * (1 - pct / 100)}`}
              strokeLinecap="round"
              style={{ transform:'rotate(-90deg)', transformOrigin:'center', transition:'stroke-dashoffset 1s linear, stroke .5s' }}
            />
          </svg>
          <span className="game-timer-txt" style={{ color: tColor }}>{fmtTime(timeLeft)}</span>
        </div>
        <div className="game-stat"><span className="gs-label">Target</span><span className="gs-val">1→15</span></div>
      </div>
      <div className="puzzle-grid">
        {tiles.map((val, idx) => {
          const isEmpty = val === EMPTY
          const canMove = getNeighbors(tiles.indexOf(EMPTY)).includes(idx)
          return (
            <button key={idx} className={`puzzle-tile ${isEmpty ? 'empty' : ''} ${canMove ? 'movable' : ''}`}
              onClick={() => move(idx)} disabled={isEmpty}
              style={isEmpty ? {} : { background: TILE_COLORS[val] }}>
              {!isEmpty && <><span className="pt-num">{val + 1}</span><span className="pt-lbl">{TILE_LABELS[val]}</span></>}
            </button>
          )
        })}
      </div>
      <p className="game-hint">Click tiles next to the empty space • Arrow keys work too</p>
    </div>
  )
}

// ── MEMORY MATCH ──────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildCards() {
  const pairs = FOODS.slice(0, 8).flatMap(f => [{ ...f, uid: `${f.id}-a` }, { ...f, uid: `${f.id}-b` }])
  return shuffle(pairs)
}

function MemoryMatch({ onWin }) {
  const [cards, setCards]       = useState(buildCards)
  const [flipped, setFlipped]   = useState([])
  const [matched, setMatched]   = useState([])
  const [moves, setMoves]       = useState(0)
  const [timeLeft, setTimeLeft] = useState(2 * 60)
  const [locked, setLocked]     = useState(false)
  const timerRef                = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(p => { if (p <= 1) { clearInterval(timerRef.current); return 0 } return p - 1 })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  useEffect(() => { if (timeLeft === 0) onWin(false) }, [timeLeft])

  useEffect(() => {
    if (flipped.length !== 2) return
    setLocked(true); setMoves(m => m + 1)
    const [a, b] = flipped
    if (cards[a].id === cards[b].id) {
      const nm = [...matched, cards[a].id]
      setMatched(nm); setFlipped([]); setLocked(false)
      if (nm.length === 8) { clearInterval(timerRef.current); setTimeout(() => onWin(true), 400) }
    } else {
      setTimeout(() => { setFlipped([]); setLocked(false) }, 900)
    }
  }, [flipped])

  const flip = (idx) => {
    if (locked || flipped.includes(idx) || matched.includes(cards[idx].id) || flipped.length === 2) return
    setFlipped(p => [...p, idx])
  }

  const pct    = (timeLeft / (2 * 60)) * 100
  const tColor = timeLeft > 40 ? '#27ae60' : timeLeft > 20 ? '#e67e22' : '#c0392b'

  return (
    <div className="game-wrap">
      <div className="game-topbar">
        <div className="game-stat"><span className="gs-label">Pairs</span><span className="gs-val">{matched.length}/8</span></div>
        <div className="game-timer-ring-wrap">
          <svg viewBox="0 0 44 44" className="game-timer-svg">
            <circle cx="22" cy="22" r="18" fill="none" stroke="#f0e6dc" strokeWidth="3"/>
            <circle cx="22" cy="22" r="18" fill="none" stroke={tColor} strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 18}`}
              strokeDashoffset={`${2 * Math.PI * 18 * (1 - pct / 100)}`}
              strokeLinecap="round"
              style={{ transform:'rotate(-90deg)', transformOrigin:'center', transition:'stroke-dashoffset 1s linear, stroke .5s' }}
            />
          </svg>
          <span className="game-timer-txt" style={{ color: tColor }}>{fmtTime(timeLeft)}</span>
        </div>
        <div className="game-stat"><span className="gs-label">Moves</span><span className="gs-val">{moves}</span></div>
      </div>
      <div className="memory-grid">
        {cards.map((card, idx) => {
          const isFaceUp = flipped.includes(idx) || matched.includes(card.id)
          const isMatched = matched.includes(card.id)
          return (
            <button key={card.uid} className={`memory-card ${isFaceUp ? 'face-up' : ''} ${isMatched ? 'matched' : ''}`}
              onClick={() => flip(idx)} disabled={isFaceUp} aria-label={isFaceUp ? card.name : 'Hidden card'}>
              <div className="mc-inner">
                <div className="mc-back"><span>🍽️</span></div>
                <div className="mc-front" style={{ background: card.color }}>
                  <span className="mc-emoji">{card.emoji}</span>
                  <span className="mc-name">{card.name}</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
      <p className="game-hint">Find all 8 matching pairs to win!</p>
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// CATCH THE SNACKS — Updated with PS controller UI
// ════════════════════════════════════════════════════════════

const BASKET_W    = 72
const GAME_W      = 320
const ITEM_SIZE   = 36
const FALL_SPEED  = 5.5      // faster than before (was 3)
const SPAWN_RATE  = 1000     // faster spawns (was 1400)
const WIN_SCORE   = 15
const MAX_MISS    = 5
const BASKET_STEP = 18       // pixels per controller press

function CatchSnacks({ onWin }) {
  const [basketX, setBasketX]     = useState(GAME_W / 2 - BASKET_W / 2)
  const [items, setItems]         = useState([])
  const [score, setScore]         = useState(0)
  const [missed, setMissed]       = useState(0)
  const [timeLeft, setTimeLeft]   = useState(60)
  const [combo, setCombo]         = useState(0)
  const [comboMsg, setComboMsg]   = useState(null) // { text, id }
  const [catchFlash, setCatchFlash] = useState(false)

  const gameRef    = useRef(null)
  const basketRef  = useRef(basketX)
  const itemsRef   = useRef([])
  const rafRef     = useRef(null)
  const spawnRef   = useRef(null)
  const timerRef   = useRef(null)
  const scoreRef   = useRef(0)
  const missRef    = useRef(0)
  const comboRef   = useRef(0)
  const nextId     = useRef(0)
  const keysRef    = useRef({})
  const btnRef     = useRef({ left: false, right: false })
  const gameActive = useRef(true)

  basketRef.current = basketX

  // ── Haptic vibration ─────────────────────────────────────
  const vibrate = (pattern) => {
    if (navigator.vibrate) navigator.vibrate(pattern)
  }

  // ── Combo message helper ──────────────────────────────────
  const showCombo = (streak) => {
    const msgs = {
      3:  '🔥 Combo x3!',
      5:  '⚡ Combo x5!',
      7:  '💥 INSANE x7!',
      10: '🏆 GODLIKE x10!',
    }
    const text = msgs[streak]
    if (text) {
      const id = Date.now()
      setComboMsg({ text, id })
      setTimeout(() => setComboMsg(null), 1200)
    }
  }

  // ── Mouse / touch move ────────────────────────────────────
  const handlePointerMove = useCallback((clientX) => {
    const rect = gameRef.current?.getBoundingClientRect()
    if (!rect) return
    const rel = clientX - rect.left - BASKET_W / 2
    setBasketX(Math.max(0, Math.min(GAME_W - BASKET_W, rel)))
  }, [])

  useEffect(() => {
    const onMouse = (e) => handlePointerMove(e.clientX)
    const onTouch = (e) => {
      // Only track touches inside the game arena
      const rect = gameRef.current?.getBoundingClientRect()
      if (!rect) return
      const t = e.touches[0]
      if (t.clientY >= rect.top && t.clientY <= rect.bottom) {
        handlePointerMove(t.clientX)
      }
    }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('touchmove', onTouch, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [handlePointerMove])

  // ── Keyboard controls ─────────────────────────────────────
  useEffect(() => {
    const onDown = (e) => { keysRef.current[e.key] = true }
    const onUp   = (e) => { keysRef.current[e.key] = false }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [])

  // ── Controller button press handlers ─────────────────────
  const pressLeft  = () => { btnRef.current.left  = true }
  const releaseLeft  = () => { btnRef.current.left  = false }
  const pressRight = () => { btnRef.current.right = true }
  const releaseRight = () => { btnRef.current.right = false }

  // ── Basket movement loop (keyboard + controller) ──────────
  useEffect(() => {
    const moveLoop = setInterval(() => {
      const left  = keysRef.current['ArrowLeft']  || keysRef.current['a'] || btnRef.current.left
      const right = keysRef.current['ArrowRight'] || keysRef.current['d'] || btnRef.current.right
      if (left)  setBasketX(p => Math.max(0, p - BASKET_STEP))
      if (right) setBasketX(p => Math.min(GAME_W - BASKET_W, p + BASKET_STEP))
    }, 16)
    return () => clearInterval(moveLoop)
  }, [])

  // ── Spawn items ───────────────────────────────────────────
  useEffect(() => {
    spawnRef.current = setInterval(() => {
      if (!gameActive.current) return
      const food = randItem(FOODS)
      const x    = Math.random() * (GAME_W - ITEM_SIZE)
      itemsRef.current = [...itemsRef.current, {
        id: nextId.current++, x, y: -ITEM_SIZE, food,
        speedMult: 0.85 + Math.random() * 0.5, // slight speed variation per item
      }]
    }, SPAWN_RATE)
    return () => clearInterval(spawnRef.current)
  }, [])

  // ── Game loop ─────────────────────────────────────────────
  useEffect(() => {
    const loop = () => {
      const bx = basketRef.current
      itemsRef.current = itemsRef.current
        .map(item => ({ ...item, y: item.y + FALL_SPEED * item.speedMult }))
        .filter(item => {
          // Caught
          if (
            item.y + ITEM_SIZE >= 260 &&
            item.y <= 295 &&
            item.x + ITEM_SIZE >= bx &&
            item.x <= bx + BASKET_W
          ) {
            scoreRef.current += 1
            comboRef.current += 1
            setScore(scoreRef.current)
            setCombo(comboRef.current)
            showCombo(comboRef.current)
            setCatchFlash(true)
            setTimeout(() => setCatchFlash(false), 120)
            vibrate(30) // short buzz on catch

            if (scoreRef.current >= WIN_SCORE) {
              gameActive.current = false
              cancelAnimationFrame(rafRef.current)
              clearInterval(spawnRef.current)
              clearInterval(timerRef.current)
              vibrate([50, 30, 50, 30, 100]) // win pattern
              setTimeout(() => onWin(true), 300)
            }
            return false
          }
          // Missed
          if (item.y > 305) {
            missRef.current += 1
            comboRef.current = 0
            setMissed(missRef.current)
            setCombo(0)
            vibrate([80, 40, 80]) // miss buzz

            if (missRef.current >= MAX_MISS) {
              gameActive.current = false
              cancelAnimationFrame(rafRef.current)
              clearInterval(spawnRef.current)
              clearInterval(timerRef.current)
              setTimeout(() => onWin(false), 300)
            }
            return false
          }
          return true
        })
      setItems([...itemsRef.current])
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // ── Timer ─────────────────────────────────────────────────
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) {
          gameActive.current = false
          clearInterval(timerRef.current)
          cancelAnimationFrame(rafRef.current)
          clearInterval(spawnRef.current)
          onWin(scoreRef.current >= WIN_SCORE)
          return 0
        }
        return p - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  const tColor  = timeLeft > 20 ? '#27ae60' : timeLeft > 10 ? '#e67e22' : '#c0392b'
  const pctTime = (timeLeft / 60) * 100

  return (
    <div className="game-wrap catch-wrap">

      {/* ── Stats bar ── */}
      <div className="game-topbar">
        <div className="game-stat">
          <span className="gs-label">Caught</span>
          <span className="gs-val">{score}/{WIN_SCORE}</span>
        </div>
        <div className="game-timer-ring-wrap">
          <svg viewBox="0 0 44 44" className="game-timer-svg">
            <circle cx="22" cy="22" r="18" fill="none" stroke="#f0e6dc" strokeWidth="3"/>
            <circle cx="22" cy="22" r="18" fill="none" stroke={tColor} strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 18}`}
              strokeDashoffset={`${2 * Math.PI * 18 * (1 - pctTime / 100)}`}
              strokeLinecap="round"
              style={{ transform:'rotate(-90deg)', transformOrigin:'center', transition:'stroke-dashoffset 1s linear, stroke .5s' }}
            />
          </svg>
          <span className="game-timer-txt" style={{ color: tColor }}>{timeLeft}s</span>
        </div>
        <div className="game-stat">
          <span className="gs-label">Missed</span>
          <span className="gs-val" style={{ color: missRef.current > 0 ? '#c0392b' : 'inherit' }}>
            {missed}/{MAX_MISS}
          </span>
        </div>
      </div>

      {/* Combo badge */}
      {combo >= 3 && (
        <div className="catch-combo-badge">
          🔥 {combo} combo
        </div>
      )}

      {/* Score bar */}
      <div className="catch-score-bar-wrap">
        <div
          className="catch-score-bar-fill"
          style={{ width: `${(score / WIN_SCORE) * 100}%` }}
        />
        <span className="catch-score-bar-label">{score} / {WIN_SCORE} snacks caught</span>
      </div>

      {/* ── Game arena ── */}
      <div
        className={`catch-arena ${catchFlash ? 'catch-flash' : ''}`}
        ref={gameRef}
        style={{ width: GAME_W, height: 300 }}
      >
        {/* Falling items */}
        {items.map(item => (
          <div
            key={item.id}
            className="catch-item"
            style={{ left: item.x, top: item.y, width: ITEM_SIZE, height: ITEM_SIZE }}
            aria-hidden="true"
          >
            <span>{item.food.emoji}</span>
          </div>
        ))}

        {/* Basket */}
        <div
          className="catch-basket"
          style={{ left: basketX, width: BASKET_W }}
          aria-label="Basket"
        >
          🧺
        </div>

        {/* Miss dots */}
        <div className="catch-misses">
          {Array.from({ length: MAX_MISS }).map((_, i) => (
            <span key={i} className={`catch-miss-dot ${i < missed ? 'lost' : ''}`} />
          ))}
        </div>

        {/* Floating combo message */}
        {comboMsg && (
          <div key={comboMsg.id} className="catch-combo-pop" aria-live="polite">
            {comboMsg.text}
          </div>
        )}
      </div>

      {/* ── PS-style controller ── */}
      <div className="catch-controller" aria-label="Game controller">

        {/* Left button */}
        <button
          className="ctrl-btn ctrl-left"
          onPointerDown={pressLeft}
          onPointerUp={releaseLeft}
          onPointerLeave={releaseLeft}
          aria-label="Move left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="currentColor">
            <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/>
          </svg>
        </button>

        {/* Centre display */}
        <div className="ctrl-centre">
          <div className="ctrl-centre-inner">
            <span className="ctrl-score">{score}</span>
            <span className="ctrl-score-label">caught</span>
          </div>
        </div>

        {/* Right button */}
        <button
          className="ctrl-btn ctrl-right"
          onPointerDown={pressRight}
          onPointerUp={releaseRight}
          onPointerLeave={releaseRight}
          aria-label="Move right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="currentColor">
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
          </svg>
        </button>

      </div>

      <p className="game-hint">Tap ← → buttons · Move mouse · Arrow keys</p>
    </div>
  )
}

// ── REWARD SCREEN ─────────────────────────────────────────────
const COOLDOWN_DAYS = 7
const COOLDOWN_MS   = COOLDOWN_DAYS * 24 * 60 * 60 * 1000

function formatCountdown(ms) {
  if (ms <= 0) return '0d 00h 00m 00s'
  const totalSec = Math.floor(ms / 1000)
  const days  = Math.floor(totalSec / 86400)
  const hours = Math.floor((totalSec % 86400) / 3600)
  const mins  = Math.floor((totalSec % 3600) / 60)
  const secs  = totalSec % 60
  const pad = (n) => String(n).padStart(2, '0')
  return `${days}d ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`
}

function splitCountdown(ms) {
  const safe = Math.max(0, ms)
  const totalSec = Math.floor(safe / 1000)
  const pad = (n) => String(n).padStart(2, '0')
  return {
    days:  String(Math.floor(totalSec / 86400)),
    hours: pad(Math.floor((totalSec % 86400) / 3600)),
    mins:  pad(Math.floor((totalSec % 3600) / 60)),
    secs:  pad(totalSec % 60),
  }
}

const COOLDOWN_STYLES = `
.cooldown-screen{
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:32px 20px;text-align:center;color:#fff;
  background:radial-gradient(circle at 50% 0%, rgba(255,107,157,0.25), transparent 60%),
             linear-gradient(160deg,#1a1033 0%,#2a1654 60%,#1a1033 100%);
  border-radius:24px;min-height:520px;position:relative;overflow:hidden;
}
.cooldown-screen::before{
  content:"";position:absolute;inset:-2px;border-radius:24px;padding:2px;
  background:linear-gradient(135deg,#ff6b9d,#a855f7,#06b6d4);
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
  -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;opacity:.7;
}
.cooldown-emoji{font-size:64px;margin-bottom:12px;animation:cooldown-bounce 2.4s ease-in-out infinite;}
@keyframes cooldown-bounce{0%,100%{transform:translateY(0) rotate(-5deg);}50%{transform:translateY(-10px) rotate(5deg);}}
.cooldown-title{font-size:28px;font-weight:800;margin:0 0 8px;
  background:linear-gradient(90deg,#ff6b9d,#a855f7);-webkit-background-clip:text;background-clip:text;color:transparent;}
.cooldown-sub{font-size:15px;line-height:1.5;color:rgba(255,255,255,.75);max-width:340px;margin:0 0 24px;}
.cooldown-label{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;
  color:rgba(255,255,255,.55);margin-bottom:14px;}
.cooldown-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;width:100%;max-width:340px;margin-bottom:8px;}
.cooldown-cell{
  background:linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02));
  border:1px solid rgba(255,255,255,0.12);border-radius:14px;padding:14px 6px 10px;
  box-shadow:0 8px 24px -12px rgba(168,85,247,.6),inset 0 1px 0 rgba(255,255,255,.08);
}
.cooldown-num{font-size:34px;font-weight:800;font-variant-numeric:tabular-nums;line-height:1;
  color:#fff;text-shadow:0 0 18px rgba(255,107,157,.55);}
.cooldown-unit{font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;
  color:rgba(255,255,255,.6);margin-top:6px;}
.cooldown-cell.pulse .cooldown-num{animation:cooldown-pulse 1s ease-in-out infinite;}
@keyframes cooldown-pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.65;transform:scale(.95);}}
.cooldown-ready{font-size:12px;color:rgba(255,255,255,.6);margin:18px 0 24px;}
.cooldown-back{
  background:linear-gradient(135deg,#ff6b9d,#a855f7);color:#fff;border:none;
  padding:12px 28px;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;
  box-shadow:0 10px 30px -10px rgba(168,85,247,.8);transition:transform .15s ease;
}
.cooldown-back:hover{transform:translateY(-2px);}
`


// localStorage key — works for both logged-in AND anonymous users
const LAST_CLAIM_KEY = 'sweethub_last_reward_claim_at'

function readLocalLastClaim() {
  try {
    const raw = localStorage.getItem(LAST_CLAIM_KEY)
    if (!raw) return null
    const ts = Number(raw)
    if (!Number.isFinite(ts)) return null
    return new Date(ts)
  } catch { return null }
}
function writeLocalLastClaim(date) {
  try { localStorage.setItem(LAST_CLAIM_KEY, String(date.getTime())) } catch {}
}

function RewardScreen({ onClose }) {
  const { user } = useAuth()                    // ✅ hook inside component
  const [chosen, setChosen] = useState(null)
  const [code, setCode]     = useState('')
  const [copied, setCopied] = useState(false)
  const [claiming, setClaiming] = useState(false)

  // Cooldown state — start with localStorage value so cooldown applies INSTANTLY
  // (even before Supabase responds, even for anonymous users)
  const [checking, setChecking]   = useState(true)
  const [lastClaim, setLastClaim] = useState(() => readLocalLastClaim())
  const [now, setNow]             = useState(() => Date.now())

  // 1) On mount: also look up the user's most recent claim from Supabase
  //    and use whichever is MORE RECENT (server vs local) — server wins ties.
  useEffect(() => {
    let cancelled = false
    const check = async () => {
      if (!user) { setChecking(false); return }
      try {
        const { data, error } = await supabase
          .from('reward_claims')
          .select('claimed_at')
          .eq('user_id', user.id)
          .order('claimed_at', { ascending: false })
          .limit(1)
        if (cancelled) return
        if (error) {
          console.error('Cooldown check error:', error)
        } else if (data && data.length > 0 && data[0].claimed_at) {
          const serverDate = new Date(data[0].claimed_at)
          setLastClaim(prev => {
            const winner = (!prev || serverDate.getTime() > prev.getTime()) ? serverDate : prev
            writeLocalLastClaim(winner)
            return winner
          })
        }
      } catch (err) {
        console.error('Cooldown check failed:', err)
      } finally {
        if (!cancelled) setChecking(false)
      }
    }
    check()
    return () => { cancelled = true }
  }, [user])

  // 2) Tick every second while we're in cooldown
  const cooldownEndsAt = lastClaim ? lastClaim.getTime() + COOLDOWN_MS : 0
  const msLeft         = cooldownEndsAt - now
  const inCooldown     = lastClaim && msLeft > 0

  useEffect(() => {
    if (!inCooldown) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [inCooldown])

  const pick = async (r) => {
    if (!user) {
      alert('Please log in or sign up first to claim your reward!')
      return
    }
    // Hard guard: never allow claiming during cooldown
    if (inCooldown) return

    setClaiming(true)
    try {
      const { data, error } = await supabase.rpc('claim_reward', {
        _reward_id:    r.id,
        _reward_label: r.label,
      })
      const nowDate = new Date()
      if (error) {
        console.error('Claim error:', error)
        setChosen(r)
        setCode(genCode(r.code))
      } else {
        setChosen(r)
        setCode(data?.[0]?.coupon_code || genCode(r.code))
      }
      // Start the 7-day cooldown immediately — both in state AND localStorage
      setLastClaim(nowDate)
      setNow(nowDate.getTime())
      writeLocalLastClaim(nowDate)
    } catch (err) {
      console.error('Unexpected error:', err)
      const nowDate = new Date()
      setChosen(r)
      setCode(genCode(r.code))
      setLastClaim(nowDate)
      setNow(nowDate.getTime())
      writeLocalLastClaim(nowDate)
    } finally {
      setClaiming(false)
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    })
  }

  // ⛔ COOLDOWN GATE — checked FIRST, before "chosen" or anything else.
  // This prevents users from claiming again by re-winning a game,
  // and works for both logged-in users (Supabase) and anonymous users (localStorage).
  if (inCooldown) {
    const readyDate = new Date(cooldownEndsAt)
    const dateStr = readyDate.toLocaleString(undefined, {
      weekday: 'long', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
    const t = splitCountdown(msLeft)
    return (
      <>
        <style>{COOLDOWN_STYLES}</style>
        <div className="cooldown-screen">
          <div className="cooldown-emoji">🎮</div>
          <h2 className="cooldown-title">Keep having fun! 😜</h2>
          <p className="cooldown-sub">
            You already claimed a reward this week. Play as much as you like —
            come back to claim another reward in:
          </p>

          <div className="cooldown-label">Next reward unlocks in</div>
          <div className="cooldown-grid">
            <div className="cooldown-cell">
              <div className="cooldown-num">{t.days}</div>
              <div className="cooldown-unit">Days</div>
            </div>
            <div className="cooldown-cell">
              <div className="cooldown-num">{t.hours}</div>
              <div className="cooldown-unit">Hours</div>
            </div>
            <div className="cooldown-cell">
              <div className="cooldown-num">{t.mins}</div>
              <div className="cooldown-unit">Mins</div>
            </div>
            <div className="cooldown-cell pulse">
              <div className="cooldown-num">{t.secs}</div>
              <div className="cooldown-unit">Secs</div>
            </div>
          </div>

          <div className="cooldown-ready">🗓 Available on {dateStr}</div>
          <button className="cooldown-back" onClick={onClose}>Back to games →</button>
        </div>
      </>
    )
  }

  // While we look up the user's last claim, show a tiny loader
  if (user && checking) return (
    <div className="puzzle-screen puzzle-result won">
      <div className="puzzle-result-emoji">⏳</div>
      <h2 className="puzzle-result-title">Checking your rewards…</h2>
      <p className="puzzle-result-sub">One sec while we load your status.</p>
    </div>
  )

  // Reward successfully claimed — show the code
  if (chosen) return (
    <div className="puzzle-screen puzzle-claimed">
      <div className="puzzle-result-emoji">{chosen.emoji}</div>
      <h2 className="puzzle-result-title">Reward Unlocked! 🎁</h2>
      <p className="puzzle-result-sub">{chosen.desc}</p>
      <div className="puzzle-code-box">
        <span className="puzzle-code-label">Your reward code</span>
        <div className="puzzle-code-display">
          <span className="puzzle-code-text">{code}</span>
          <button className="puzzle-code-copy" onClick={copy}>{copied ? '✓ Copied!' : 'Copy'}</button>
        </div>
      </div>
      <div className="puzzle-redeem-steps">
        <p className="prs-title">How to redeem:</p>
        <div className="prs-step"><span>1</span><p>Copy your code above</p></div>
        <div className="prs-step"><span>2</span><p>Place your order via WhatsApp</p></div>
        <div className="prs-step"><span>3</span><p>Mention your code — we'll apply it! 😊</p></div>
      </div>
      <a className="puzzle-wa-btn"
        href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hello SweetHUB! 🎮 I just won the game challenge!\n\nMy reward code: *${code}*\n(${chosen.label})\n\nI'd like to place an order and redeem my reward 😊`)}`}
        target="_blank" rel="noopener noreferrer" onClick={onClose}>
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        Order Now & Redeem on WhatsApp
      </a>
      <button className="puzzle-skip" onClick={onClose}>I'll order later</button>
    </div>
  )

  return (
    <div className="puzzle-screen puzzle-result won">
      <div className="puzzle-confetti">
        {['🎉','🎊','✨','🎁','🏆','⭐','🎈','💫'].map((e, i) => (
          <span key={i} className="confetti-piece" style={{ '--delay':`${i * 0.1}s`, '--x':`${10 + i * 11}%` }}>{e}</span>
        ))}
      </div>
      <div className="puzzle-result-emoji">🏆</div>
      <h2 className="puzzle-result-title">You crushed it!</h2>
      <p className="puzzle-result-sub">Amazing job! Now pick your reward 👇</p>
      <div className="puzzle-rewards-grid">
        {REWARDS.map(r => (
          <button
            key={r.id}
            className={`puzzle-reward-card ${claiming ? 'claiming' : ''}`}
            onClick={() => pick(r)}
            disabled={claiming}
          >
            <span className="prc-emoji">{r.emoji}</span>
            <span className="prc-label">{r.label}</span>
            <span className="prc-desc">{r.desc}</span>
            <span className="prc-pick">
              {claiming ? 'Claiming...' : 'Pick this →'}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── MAIN GAMES PAGE ───────────────────────────────────────────
function GamesPage() {
  const [selectedGame, setSelectedGame] = useState(null)
  const [phase, setPhase]               = useState('select') // select → playing → won → lost
  const config = GAME_CONFIGS.find(g => g.id === selectedGame)

  const startGame = (id) => { setSelectedGame(id); setPhase('playing') }
  const handleWin = (won) => setPhase(won ? 'won' : 'lost')
  const reset     = ()    => { setSelectedGame(null); setPhase('select') }

  return (
    <div className="games-page">

      {/* Header */}
      <div className="games-page-header">
        <div className="games-page-header-inner">
          <p className="order-eyebrow">SweetHUB Game Arena</p>
          <h1 className="games-page-title">
            Play. Win.
            <span className="games-title-accent"> Eat Free.</span>
          </h1>
          <p className="games-page-sub">
            Beat any challenge below and win a real reward on your next order.
            A different game every visit.
          </p>
        </div>
      </div>

      <div className="games-page-body">

        {/* Game selection */}
        {phase === 'select' && (
          <div className="games-select-grid">
            {GAME_CONFIGS.map(g => (
              <button
                key={g.id}
                className="games-select-card"
                onClick={() => startGame(g.id)}
                style={{ '--game-color': g.color }}
              >
                <div className="gsc-icon">{g.emoji}</div>
                <h2 className="gsc-name">{g.name}</h2>
                <p className="gsc-tagline">{g.tagline}</p>
                <div className="gsc-meta">
                  <span>⏱️ {g.time}</span>
                  <span>💡 {g.tip}</span>
                </div>
                <div className="gsc-play-btn" style={{ background: g.color }}>
                  Play Now →
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Active game */}
        {phase === 'playing' && config && (
          <div className="games-active-wrap">
            <div className="games-active-header">
              <div className="games-active-info">
                <span className="games-active-icon">{config.emoji}</span>
                <span className="games-active-name">{config.name}</span>
              </div>
              <button className="games-give-up" onClick={reset}>← Back to Games</button>
            </div>
            <div className="puzzle-modal games-inline-modal">
              {selectedGame === 'puzzle' && <SlidingPuzzle onWin={handleWin} />}
              {selectedGame === 'memory' && <MemoryMatch   onWin={handleWin} />}
              {selectedGame === 'catch'  && <CatchSnacks   onWin={handleWin} />}
            </div>
          </div>
        )}

        {/* Won */}
        {phase === 'won' && (
          <div className="puzzle-modal games-inline-modal">
            <RewardScreen onClose={reset} />
          </div>
        )}

        {/* Lost */}
        {phase === 'lost' && (
          <div className="puzzle-modal games-inline-modal">
            <div className="puzzle-screen puzzle-result lost">
              <div className="puzzle-result-emoji">⏰</div>
              <h2 className="puzzle-result-title">So close!</h2>
              <p className="puzzle-result-sub">You almost had it! 😅 Try again or pick a different game.</p>
              <div className="puzzle-lost-btns">
                <button className="puzzle-retry-btn" onClick={() => setPhase('playing')}>Try Again 🔄</button>
                <button className="puzzle-skip" onClick={reset}>Pick a different game</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default GamesPage
