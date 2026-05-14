import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabaseClient'

import { 
  Trophy, Clock, Timer, Hash, MousePointer2, 
  Gamepad2, Clipboard, CheckCircle2, Lock, 
  ArrowLeft, RefreshCw, Smartphone, Zap, 
  ShoppingBasket, Lightbulb, ExternalLink,
  Gift, Percent, Truck, Cookie
} from 'lucide-react'

const WHATSAPP = '2349029702549'
const fmt      = (n) => '₦' + n.toLocaleString()

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

const GAME_CONFIGS = [
  { id: 'puzzle', name: 'Sliding Puzzle',   emoji: '🧩', tagline: 'Slide the tiles into order',      time: '3 minutes',  tip: 'Use arrow keys or click tiles',  color: '#c0392b' },
  { id: 'memory', name: 'Memory Match',     emoji: '🃏', tagline: 'Find all matching food pairs',    time: '2 minutes',  tip: 'Remember where each food hides', color: '#8e44ad' },
  { id: 'catch',  name: 'Catch the Snacks', emoji: '🍿', tagline: 'Catch 15 snacks in your basket', time: '60 seconds', tip: 'Move mouse or arrow keys',       color: '#e67e22' },
]

// ══════════════════════════════════════════════════════════════
// COUNTDOWN HOOK
// ══════════════════════════════════════════════════════════════
function useCountdown(targetDate) {
  const getTimeLeft = (target) => {
    const diff    = Math.max(0, new Date(target).getTime() - Date.now())
    const days    = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    return { days, hours, minutes, seconds, total: diff }
  }

  const [timeLeft, setTimeLeft] = useState(() =>
    targetDate ? getTimeLeft(targetDate) : { days:0, hours:0, minutes:0, seconds:0, total:0 }
  )

  useEffect(() => {
    if (!targetDate) return
    setTimeLeft(getTimeLeft(targetDate))
    const t = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000)
    return () => clearInterval(t)
  }, [targetDate])

  return timeLeft
}

// ══════════════════════════════════════════════════════════════
// COOLDOWN TIMER DISPLAY
// ══════════════════════════════════════════════════════════════
function CooldownTimer({ nextClaimAt }) {
  const { days, hours, minutes, seconds, total } = useCountdown(nextClaimAt)
  if (total <= 0) return null

  const units = [
    { value: days,    label: days === 1    ? 'Day'    : 'Days'    },
    { value: hours,   label: hours === 1   ? 'Hour'   : 'Hours'   },
    { value: minutes, label: minutes === 1 ? 'Minute' : 'Minutes' },
    { value: seconds, label: seconds === 1 ? 'Second' : 'Seconds' },
  ]

  const pctWaited = Math.round(100 - (total / (7 * 24 * 60 * 60 * 1000)) * 100)

  return (
    <div className="reward-cooldown">
      <div className="rcd-header">
        <span className="rcd-icon">⏳</span>
        <div>
          <p className="rcd-title">Next reward available in</p>
          <p className="rcd-sub">Keep playing and having fun — your next reward is waiting!</p>
        </div>
      </div>

      <div className="rcd-timer">
        {units.map((u, i) => (
          <div key={u.label} className="rcd-unit">
            <div>
              <div className="rcd-value">{String(u.value).padStart(2, '0')}</div>
              <span className="rcd-label">{u.label}</span>
            </div>
            {i < units.length - 1 && <span className="rcd-colon">:</span>}
          </div>
        ))}
      </div>

      <div className="rcd-progress-wrap">
        <div className="rcd-progress-fill" style={{ width: `${pctWaited}%` }} />
      </div>
      <p className="rcd-progress-label">{pctWaited}% of waiting done 😄</p>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// REWARD SCREEN — with 7-day cooldown
// ══════════════════════════════════════════════════════════════
function RewardScreen({ onClose, gameId = 'unknown' }) {
  const { user }                      = useAuth()
  const [phase, setPhase]             = useState('checking') // checking | pick | cooldown | claimed | noauth
  const [chosen, setChosen]           = useState(null)
  const [code, setCode]               = useState('')
  const [copied, setCopied]           = useState(false)
  const [claiming, setClaiming]       = useState(false)
  const [nextClaimAt, setNextClaimAt] = useState(null)

  // ── Check cooldown on mount ──────────────────────────────────
  useEffect(() => {
    const check = async () => {
      if (!user) { setPhase('noauth'); return }

      const { data } = await supabase
        .from('reward_claims')
        .select('claimed_at')
        .eq('user_id', user.id)
        .order('claimed_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!data) { setPhase('pick'); return }

      const next = new Date(new Date(data.claimed_at).getTime() + 7 * 24 * 60 * 60 * 1000)
      if (new Date() < next) {
        setNextClaimAt(next)
        setPhase('cooldown')
      } else {
        setPhase('pick')
      }
    }
    check()
  }, [user])

  // ── Claim reward ─────────────────────────────────────────────
  const pick = async (reward) => {
    if (!user) { setPhase('noauth'); return }
    setClaiming(true)

    try {
      const { data, error: rpcError } = await supabase.rpc('claim_reward', {
        _reward_id:    reward.id,
        _reward_label: reward.label,
        _game_id:      gameId,
      })

      if (rpcError) {
        if (rpcError.message?.includes('COOLDOWN:')) {
          const epoch = parseFloat(rpcError.message.split('COOLDOWN:')[1])
          setNextClaimAt(new Date(epoch * 1000))
          setPhase('cooldown')
          return
        }
        throw rpcError
      }

      const result = Array.isArray(data) ? data[0] : data
      setChosen(reward)
      setCode(result?.coupon_code || genCode(reward.code))
      setPhase('claimed')

    } catch (err) {
      console.error('Claim error:', err)
      setChosen(reward)
      setCode(genCode(reward.code))
      setPhase('claimed')
    } finally {
      setClaiming(false)
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    })
  }

  // ── Checking ─────────────────────────────────────────────────
  if (phase === 'checking') return (
    <div className="puzzle-screen" style={{ minHeight: 200 }}>
      <div className="reward-checking">
        <span className="reward-checking-spinner" />
        <p>Checking your eligibility...</p>
      </div>
    </div>
  )

  // ── Not authenticated ─────────────────────────────────────────
  if (phase === 'noauth') return (
    <div className="puzzle-screen puzzle-claimed">
      <div className="puzzle-result-emoji">🔐</div>
      <h2 className="puzzle-result-title">Almost there!</h2>
      <p className="puzzle-result-sub">
        You crushed it! 🎉 To claim your reward you need to be logged in
        so we can save it for you.
      </p>
      <div className="reward-noauth-btns">
        <button
          className="puzzle-start-btn"
          style={{ background: 'var(--accent)', width: '100%' }}
          onClick={onClose}
        >
          Login to Claim →
        </button>
        <button className="puzzle-skip" onClick={onClose}>Maybe later</button>
      </div>
    </div>
  )

  // ── Cooldown active ───────────────────────────────────────────
  if (phase === 'cooldown') return (
    <div className="puzzle-screen puzzle-claimed">
      <div className="puzzle-confetti">
        {['🎮','🎯','⭐','🕹️','🏅','💪'].map((e, i) => (
          <span key={i} className="confetti-piece"
            style={{ '--delay':`${i * 0.15}s`, '--x':`${8 + i * 15}%` }}>
            {e}
          </span>
        ))}
      </div>

      <div className="puzzle-result-emoji">🎮</div>
      <h2 className="puzzle-result-title">You're on a roll!</h2>
      <p className="puzzle-result-sub">
        You already claimed a reward recently. Come back when your
        timer hits zero and claim again! 🔥
      </p>

      <CooldownTimer nextClaimAt={nextClaimAt} />

      <div className="reward-cooldown-actions">
        <p className="reward-cooldown-tip">
          💡 <strong>Tip:</strong> Practice now so when your cooldown ends
          you crush it faster than ever 😄
        </p>
        <button className="puzzle-retry-btn" onClick={onClose}>
          Keep Playing 🎮
        </button>
        <button className="puzzle-skip" onClick={onClose}>Back to games</button>
      </div>
    </div>
  )

  // ── Reward claimed ────────────────────────────────────────────
  if (phase === 'claimed' && chosen) return (
    <div className="puzzle-screen puzzle-claimed">
      <div className="puzzle-result-emoji">{chosen.emoji}</div>
      <h2 className="puzzle-result-title">Reward Unlocked! 🎁</h2>
      <p className="puzzle-result-sub">{chosen.desc}</p>

      <div className="puzzle-code-box">
        <span className="puzzle-code-label">Your reward code</span>
        <div className="puzzle-code-display">
          <span className="puzzle-code-text">{code}</span>
          <button className="puzzle-code-copy" onClick={copy}>
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="reward-next-claim">
        <span>🗓️</span>
        <span>Next reward available in <strong>7 days</strong></span>
      </div>

      <div className="puzzle-redeem-steps">
        <p className="prs-title">How to redeem:</p>
        <div className="prs-step"><span>1</span><p>Copy your code above</p></div>
        <div className="prs-step"><span>2</span><p>Place your order via WhatsApp</p></div>
        <div className="prs-step"><span>3</span><p>Mention your code — we'll apply it! 😊</p></div>
      </div>

      <a
        className="puzzle-wa-btn"
        href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
          `Hello Jovlora! 🎮 I just won the game challenge!\n\nMy reward code: *${code}*\n(${chosen.label})\n\nI'd like to place an order and redeem my reward 😊`
        )}`}
        target="_blank" rel="noopener noreferrer" onClick={onClose}
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        Order Now & Redeem on WhatsApp
      </a>
      <button className="puzzle-skip" onClick={onClose}>I'll order later</button>
    </div>
  )

  // ── Pick reward ───────────────────────────────────────────────
  return (
    <div className="puzzle-screen puzzle-result won">
      <div className="puzzle-confetti">
        {['🎉','🎊','✨','🎁','🏆','⭐','🎈','💫'].map((e, i) => (
          <span key={i} className="confetti-piece"
            style={{ '--delay':`${i * 0.1}s`, '--x':`${10 + i * 11}%` }}>
            {e}
          </span>
        ))}
      </div>
      <div className="puzzle-result-emoji">🏆</div>
      <h2 className="puzzle-result-title">You crushed it!</h2>
      <p className="puzzle-result-sub">
        Pick your reward below 👇
        <br />
        <span className="reward-one-claim-note">One reward per 7 days</span>
      </p>
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
            <span className="prc-pick">{claiming ? '⏳ Claiming...' : 'Pick this →'}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// SLIDING PUZZLE
// ══════════════════════════════════════════════════════════════
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
            <button key={idx}
              className={`puzzle-tile ${isEmpty ? 'empty' : ''} ${canMove ? 'movable' : ''}`}
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

// ══════════════════════════════════════════════════════════════
// MEMORY MATCH
// ══════════════════════════════════════════════════════════════
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildCards() {
  const pairs = FOODS.slice(0, 8).flatMap(f => [
    { ...f, uid: `${f.id}-a` },
    { ...f, uid: `${f.id}-b` },
  ])
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
          const isFaceUp  = flipped.includes(idx) || matched.includes(card.id)
          const isMatched = matched.includes(card.id)
          return (
            <button key={card.uid}
              className={`memory-card ${isFaceUp ? 'face-up' : ''} ${isMatched ? 'matched' : ''}`}
              onClick={() => flip(idx)} disabled={isFaceUp}
              aria-label={isFaceUp ? card.name : 'Hidden card'}>
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

// ══════════════════════════════════════════════════════════════
// CATCH THE SNACKS — PS controller + combos
// ══════════════════════════════════════════════════════════════
const BASKET_W    = 72
const GAME_W      = 320
const ITEM_SIZE   = 36
const FALL_SPEED  = 5.5
const SPAWN_RATE  = 1000
const WIN_SCORE   = 15
const MAX_MISS    = 5
const BASKET_STEP = 18

function CatchSnacks({ onWin }) {
  const [basketX, setBasketX]       = useState(GAME_W / 2 - BASKET_W / 2)
  const [items, setItems]           = useState([])
  const [score, setScore]           = useState(0)
  const [missed, setMissed]         = useState(0)
  const [timeLeft, setTimeLeft]     = useState(60)
  const [combo, setCombo]           = useState(0)
  const [comboMsg, setComboMsg]     = useState(null)
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

  const vibrate = (p) => { if (navigator.vibrate) navigator.vibrate(p) }

  const showCombo = (streak) => {
    const msgs = { 3:'🔥 Combo x3!', 5:'⚡ Combo x5!', 7:'💥 INSANE x7!', 10:'🏆 GODLIKE x10!' }
    const text = msgs[streak]
    if (text) {
      const id = Date.now()
      setComboMsg({ text, id })
      setTimeout(() => setComboMsg(null), 1200)
    }
  }

  const handlePointerMove = useCallback((clientX) => {
    const rect = gameRef.current?.getBoundingClientRect()
    if (!rect) return
    setBasketX(Math.max(0, Math.min(GAME_W - BASKET_W, clientX - rect.left - BASKET_W / 2)))
  }, [])

  useEffect(() => {
    const onMouse = (e) => handlePointerMove(e.clientX)
    const onTouch = (e) => {
      const rect = gameRef.current?.getBoundingClientRect()
      if (!rect) return
      const t = e.touches[0]
      if (t.clientY >= rect.top && t.clientY <= rect.bottom) handlePointerMove(t.clientX)
    }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('touchmove', onTouch, { passive: true })
    return () => { window.removeEventListener('mousemove', onMouse); window.removeEventListener('touchmove', onTouch) }
  }, [handlePointerMove])

  useEffect(() => {
    const onDown = (e) => { keysRef.current[e.key] = true }
    const onUp   = (e) => { keysRef.current[e.key] = false }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp) }
  }, [])

  const pressLeft    = () => { btnRef.current.left  = true  }
  const releaseLeft  = () => { btnRef.current.left  = false }
  const pressRight   = () => { btnRef.current.right = true  }
  const releaseRight = () => { btnRef.current.right = false }

  useEffect(() => {
    const loop = setInterval(() => {
      if (keysRef.current['ArrowLeft']  || keysRef.current['a'] || btnRef.current.left)  setBasketX(p => Math.max(0, p - BASKET_STEP))
      if (keysRef.current['ArrowRight'] || keysRef.current['d'] || btnRef.current.right) setBasketX(p => Math.min(GAME_W - BASKET_W, p + BASKET_STEP))
    }, 16)
    return () => clearInterval(loop)
  }, [])

  useEffect(() => {
    spawnRef.current = setInterval(() => {
      if (!gameActive.current) return
      const food = randItem(FOODS)
      const x    = Math.random() * (GAME_W - ITEM_SIZE)
      itemsRef.current = [...itemsRef.current, { id: nextId.current++, x, y: -ITEM_SIZE, food, speedMult: 0.85 + Math.random() * 0.5 }]
    }, SPAWN_RATE)
    return () => clearInterval(spawnRef.current)
  }, [])

  useEffect(() => {
    const loop = () => {
      const bx = basketRef.current
      itemsRef.current = itemsRef.current
        .map(item => ({ ...item, y: item.y + FALL_SPEED * item.speedMult }))
        .filter(item => {
          if (item.y + ITEM_SIZE >= 260 && item.y <= 295 && item.x + ITEM_SIZE >= bx && item.x <= bx + BASKET_W) {
            scoreRef.current += 1; comboRef.current += 1
            setScore(scoreRef.current); setCombo(comboRef.current)
            showCombo(comboRef.current)
            setCatchFlash(true); setTimeout(() => setCatchFlash(false), 120)
            vibrate(30)
            if (scoreRef.current >= WIN_SCORE) {
              gameActive.current = false
              cancelAnimationFrame(rafRef.current); clearInterval(spawnRef.current); clearInterval(timerRef.current)
              vibrate([50,30,50,30,100]); setTimeout(() => onWin(true), 300)
            }
            return false
          }
          if (item.y > 305) {
            missRef.current += 1; comboRef.current = 0
            setMissed(missRef.current); setCombo(0); vibrate([80,40,80])
            if (missRef.current >= MAX_MISS) {
              gameActive.current = false
              cancelAnimationFrame(rafRef.current); clearInterval(spawnRef.current); clearInterval(timerRef.current)
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

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) {
          gameActive.current = false
          clearInterval(timerRef.current); cancelAnimationFrame(rafRef.current); clearInterval(spawnRef.current)
          onWin(scoreRef.current >= WIN_SCORE); return 0
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
      <div className="game-topbar">
        <div className="game-stat"><span className="gs-label">Caught</span><span className="gs-val">{score}/{WIN_SCORE}</span></div>
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
          <span className="gs-val" style={{ color: missRef.current > 0 ? '#c0392b' : 'inherit' }}>{missed}/{MAX_MISS}</span>
        </div>
      </div>

      {combo >= 3 && <div className="catch-combo-badge">🔥 {combo} combo</div>}

      <div className="catch-score-bar-wrap">
        <div className="catch-score-bar-fill" style={{ width: `${(score / WIN_SCORE) * 100}%` }} />
        <span className="catch-score-bar-label">{score} / {WIN_SCORE} snacks caught</span>
      </div>

      <div className={`catch-arena ${catchFlash ? 'catch-flash' : ''}`} ref={gameRef} style={{ width: GAME_W, height: 300 }}>
        {items.map(item => (
          <div key={item.id} className="catch-item" style={{ left: item.x, top: item.y, width: ITEM_SIZE, height: ITEM_SIZE }} aria-hidden="true">
            <span>{item.food.emoji}</span>
          </div>
        ))}
        <div className="catch-basket" style={{ left: basketX, width: BASKET_W }} aria-label="Basket">🧺</div>
        <div className="catch-misses">
          {Array.from({ length: MAX_MISS }).map((_, i) => (
            <span key={i} className={`catch-miss-dot ${i < missed ? 'lost' : ''}`} />
          ))}
        </div>
        {comboMsg && (
          <div key={comboMsg.id} className="catch-combo-pop" aria-live="polite">{comboMsg.text}</div>
        )}
      </div>

      <div className="catch-controller" aria-label="Game controller">
        <button className="ctrl-btn ctrl-left" onPointerDown={pressLeft} onPointerUp={releaseLeft} onPointerLeave={releaseLeft} aria-label="Move left">
          <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="currentColor">
            <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/>
          </svg>
        </button>
        <div className="ctrl-centre">
          <div className="ctrl-centre-inner">
            <span className="ctrl-score">{score}</span>
            <span className="ctrl-score-label">caught</span>
          </div>
        </div>
        <button className="ctrl-btn ctrl-right" onPointerDown={pressRight} onPointerUp={releaseRight} onPointerLeave={releaseRight} aria-label="Move right">
          <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="currentColor">
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
          </svg>
        </button>
      </div>
      <p className="game-hint">Tap ← → buttons · Move mouse · Arrow keys</p>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// MAIN GAMES PAGE
// ══════════════════════════════════════════════════════════════
function GamesPage() {
  const [selectedGame, setSelectedGame] = useState(null)
  const [phase, setPhase]               = useState('select') // select → playing → won → lost
  const config = GAME_CONFIGS.find(g => g.id === selectedGame)

  const startGame = (id) => { setSelectedGame(id); setPhase('playing') }
  const handleWin = (won) => setPhase(won ? 'won' : 'lost')
  const reset     = ()    => { setSelectedGame(null); setPhase('select') }

  return (
    <div className="games-page">
      <div className="games-page-header">
        <div className="games-page-header-inner">
          <p className="order-eyebrow">Jovlora Game Arena</p>
          <h1 className="games-page-title">
            Play. Win.
            <span className="games-title-accent"> Eat Free.</span>
          </h1>
          <p className="games-page-sub">
            Beat any challenge and win a real reward on your next order.
            One reward per 7 days — make it count! 🏆
          </p>
        </div>
      </div>

      <div className="games-page-body">
        {phase === 'select' && (
          <div className="games-select-grid">
            {GAME_CONFIGS.map(g => (
              <button key={g.id} className="games-select-card" onClick={() => startGame(g.id)} style={{ '--game-color': g.color }}>
                <div className="gsc-icon">{g.emoji}</div>
                <h2 className="gsc-name">{g.name}</h2>
                <p className="gsc-tagline">{g.tagline}</p>
                <div className="gsc-meta">
                  <span>⏱️ {g.time}</span>
                  <span>💡 {g.tip}</span>
                </div>
                <div className="gsc-play-btn" style={{ background: g.color }}>Play Now →</div>
              </button>
            ))}
          </div>
        )}

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

        {phase === 'won' && (
          <div className="puzzle-modal games-inline-modal">
            <RewardScreen onClose={reset} gameId={selectedGame || 'unknown'} />
          </div>
        )}

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