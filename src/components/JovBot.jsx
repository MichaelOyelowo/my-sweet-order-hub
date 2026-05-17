import { useState, useEffect, useRef } from 'react'

const PRODUCTS_CONTEXT = `
Jovlora's full product menu (freshly made in Ile-Ife, Nigeria):

SNACKS: Puff Puff (₦100, min 5), Chin-Chin (₦100, min 5), Banana Bread (₦500), 
Fish Roll (₦600), Baked Fish Roll (₦600), Sausage Roll (₦800), Samosa (₦400, min 2), 
Spring Roll (₦400, min 2), Frank Roll (₦800), Buns (₦100, min 3), 
Doughnut (₦300, min 2), Chocolate Doughnut (₦1000), Jam Doughnut (₦500), 
Milky Doughnut (₦1300)

PIES: Egg Roll (₦500), Meat Pie (₦1000), Chicken Pie (₦500)

CAKES: Small Cupcake (₦300, min 2), Medium Cupcake (₦500), Cake Parfait (₦1500)

Delivery: 30 minutes · Ile-Ife, Osun State · WhatsApp: +2349029702549
`

const SYSTEM_PROMPT = `You are JovBot, Jovlora's smart snack advisor. Jovlora is a premium fresh snack brand in Ile-Ife, Nigeria.

Your personality: Warm, intelligent, witty. You feel like a knowledgeable friend who genuinely understands food and mood. Not robotic, not overly excited — just real and helpful. Occasionally use Nigerian expressions naturally (chai, no cap, e go better) but don't overdo it.

Your job: Understand the customer's mood or craving and recommend the perfect Jovlora snack with genuine reasoning. Also suggest drink pairings (Zobo, Chapman, cold water, tea) and light lifestyle tips that complement the snack.

Rules:
1. Keep responses SHORT — max 3 sentences. This is a chat widget.
2. Always recommend Jovlora products only
3. Explain WHY that snack matches their current state — make it feel personal
4. Be subtly cheeky about why Jovlora is uniquely perfect for their situation
5. End recommendations with a soft nudge to order via WhatsApp or click Order Now
6. If asked unrelated things, bring it back to snacks gracefully

MENU: ${PRODUCTS_CONTEXT}

Open with a short, warm, intelligent greeting — ask about their mood. Max 2 sentences.`

const MOOD_CHIPS = [
  { emoji: '😫', label: 'Stressed'    },
  { emoji: '🥱', label: 'Bored'       },
  { emoji: '🎉', label: 'Celebrating' },
  { emoji: '😴', label: 'Tired'       },
  { emoji: '📚', label: 'Studying'    },
  { emoji: '💔', label: 'Sad'         },
  { emoji: '🤩', label: 'Excited'     },
  { emoji: '😤', label: 'Frustrated'  },
]

// ── JovBot logo — clean geometric J mark ─────────────────────
function JovLogo({ size = 32, dark = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="12" fill={dark ? '#2d1a0e' : '#c0392b'} />
      <text
        x="20" y="27"
        textAnchor="middle"
        fontSize="20"
        fontWeight="800"
        fontFamily="Georgia, serif"
        fill="white"
        letterSpacing="-1"
      >J</text>
    </svg>
  )
}

export default function JovBot() {
  const [open, setOpen]             = useState(false)
  const [showTeaser, setShowTeaser] = useState(false)
  const [teaserVisible, setTeaserVisible] = useState(false)
  const [dismissed, setDismissed]   = useState(false)
  const [messages, setMessages]     = useState([])
  const [input, setInput]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [moodsShown, setMoodsShown] = useState(false)
  const [unread, setUnread]         = useState(0)
  const messagesEndRef = useRef(null)
  const inputRef       = useRef(null)

  // Show teaser after 5s
  useEffect(() => {
    const t1 = setTimeout(() => setShowTeaser(true), 5000)
    const t2 = setTimeout(() => setTeaserVisible(true), 5200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) {
      setUnread(0)
      setTimeout(() => inputRef.current?.focus(), 350)
    }
  }, [open])

  const handleOpen = async () => {
    setOpen(true)
    setShowTeaser(false)
    setTeaserVisible(false)
    if (messages.length === 0) await sendToAPI([], '__GREETING__')
  }

  const handleDismiss = (e) => {
    e.stopPropagation()
    setShowTeaser(false)
    setTeaserVisible(false)
    setDismissed(true)
  }

  const sendToAPI = async (history, userMessage) => {
    setLoading(true)
    const isGreeting = userMessage === '__GREETING__'

    const apiMessages = isGreeting
      ? [{ role: 'user', content: 'Greet me and ask about my mood. 2 sentences max, warm and intelligent.' }]
      : [
          ...history.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: userMessage }
        ]

    try {
      const res = await fetch('https://sweethub-emails.michaelkingreat.workers.dev/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system: SYSTEM_PROMPT, messages: apiMessages }),
      })

      const data  = await res.json()
      const reply = data?.content?.[0]?.text || "Something went wrong. Try again?"

      const botMsg = { role: 'assistant', content: reply, id: Date.now() }

      if (isGreeting) {
        setMessages([botMsg])
        setTimeout(() => setMoodsShown(true), 700)
      } else {
        setMessages(prev => [...prev, botMsg])
        if (!open) setUnread(n => n + 1)
        if (reply.toLowerCase().includes('feel') || reply.toLowerCase().includes('mood')) {
          setTimeout(() => setMoodsShown(true), 500)
        }
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "Connection issue. Please try again.", id: Date.now() }
      ])
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return
    const userMsg = { role: 'user', content: text.trim(), id: Date.now() }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setMoodsShown(false)
    await sendToAPI(next, text.trim())
  }

  const handleMood = (m) => {
    setMoodsShown(false)
    sendMessage(`${m.emoji} ${m.label}`)
  }

  const formatText = (text) => {
    return text.split('\n').map((line, i, arr) => {
      const parts = line.split(/\*\*(.*?)\*\*/g)
      return (
        <span key={i}>
          {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
          {i < arr.length - 1 && <br />}
        </span>
      )
    })
  }

  return (
    <>
      {/* ── Teaser card ── */}
      {showTeaser && !open && (
        <div className={`jb-teaser ${teaserVisible ? 'visible' : ''}`}>
          <button className="jb-teaser-x" onClick={handleDismiss} aria-label="Dismiss">
            <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="currentColor">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
            </svg>
          </button>
          <div className="jb-teaser-row">
            <JovLogo size={36} />
            <div>
              <p className="jb-teaser-name">JovBot</p>
              <p className="jb-teaser-tagline">What's your mood right now?</p>
            </div>
          </div>
          <p className="jb-teaser-msg">
            I'll find the perfect Jovlora snack for how you're feeling. Takes 30 seconds.
          </p>
          <button className="jb-teaser-btn" onClick={handleOpen}>
            Get a snack recommendation →
          </button>
        </div>
      )}

      {/* ── FAB ── */}
      {!open && (
        <button
          className={`jb-fab ${dismissed || !showTeaser ? 'jb-fab-visible' : ''}`}
          onClick={handleOpen}
          aria-label="Open JovBot"
        >
          <JovLogo size={28} />
          {unread > 0 && <span className="jb-unread">{unread}</span>}
        </button>
      )}

      {/* ── Chat window ── */}
      {open && (
        <div className="jb-window" role="dialog" aria-label="JovBot chat">

          {/* Header */}
          <div className="jb-header">
            <div className="jb-header-brand">
              <JovLogo size={36} dark />
              <div>
                <p className="jb-header-name">JovBot</p>
                <div className="jb-header-status">
                  <span className="jb-status-dot" />
                  <span>Online · Jovlora Snack Advisor</span>
                </div>
              </div>
            </div>
            <div className="jb-header-btns">
              <button
                className="jb-hbtn"
                title="Restart"
                onClick={() => { setMessages([]); setMoodsShown(false); sendToAPI([], '__GREETING__') }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
                  <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/>
                </svg>
              </button>
              <button className="jb-hbtn" onClick={() => setOpen(false)} title="Close">
                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="jb-msgs">

            {messages.length === 0 && !loading && (
              <div className="jb-splash">
                <JovLogo size={48} />
                <p>JovBot is starting up...</p>
              </div>
            )}

            {messages.map(msg => (
              <div
                key={msg.id}
                className={`jb-row ${msg.role === 'user' ? 'jb-row-user' : 'jb-row-bot'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="jb-row-avatar"><JovLogo size={24} /></div>
                )}
                <div className="jb-bubble">
                  {formatText(msg.content)}
                </div>
              </div>
            ))}

            {/* Typing */}
            {loading && (
              <div className="jb-row jb-row-bot">
                <div className="jb-row-avatar"><JovLogo size={24} /></div>
                <div className="jb-bubble jb-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}

            {/* Mood chips */}
            {moodsShown && !loading && (
              <div className="jb-chips">
                {MOOD_CHIPS.map(m => (
                  <button key={m.label} className="jb-chip" onClick={() => handleMood(m)}>
                    {m.emoji} {m.label}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions */}
          <div className="jb-quick">
            {[
              { icon: '🔥', text: 'Most popular'       },
              { icon: '💰', text: 'Budget pick'         },
              { icon: '🎲', text: 'Surprise me'         },
              { icon: '⚡', text: 'Quick delivery pick' },
            ].map(q => (
              <button
                key={q.text}
                className="jb-quick-btn"
                onClick={() => sendMessage(`${q.icon} ${q.text}`)}
              >
                {q.icon} {q.text}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="jb-input-area">
            <input
              ref={inputRef}
              className="jb-input"
              type="text"
              placeholder="Type your mood or craving..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              disabled={loading}
              autoComplete="off"
            />
            <button
              className="jb-send"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              aria-label="Send"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
                <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/>
              </svg>
            </button>
          </div>

          {/* Footer */}
          <div className="jb-foot">
            Powered by <strong>Jovlora AI</strong>
            <span className="jb-foot-sep">·</span>
            <a href="https://wa.me/2349029702549" target="_blank" rel="noopener noreferrer">
              Order on WhatsApp
            </a>
          </div>

        </div>
      )}
    </>
  )
}