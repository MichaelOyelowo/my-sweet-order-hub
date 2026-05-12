import { useState, useEffect, useRef } from 'react'

import gallery1 from '../assets/homepage/happy-customers.webp'
import gallery2 from '../assets/homepage/smiley-colleagues.webp'
import gallery3 from '../assets/homepage/delivery.webp'

const MESSAGES = [
  { from: 'friend1', text: 'Girlll I am literally dying of hunger rn 😭', delay: 800 },
  { from: 'typing', delay: 1000 },
  { from: 'friend2', text: 'Lmaoo same!! What are you feeling like?', delay: 2000, tick: 2800 },
  { from: 'typing', delay: 4200 },
  { from: 'friend1', text: 'Honestly anything sweet at this point 😩🍰', delay: 5200 },
  { from: 'typing', delay: 6200 },
  { from: 'friend2', text: 'Okay wait, have you tried Jovlora?? 👀', delay: 7200, tick: 8000 },
  { from: 'friend1', text: 'No what is that??', delay: 8200 },
  { from: 'typing', delay: 9200 },
  { from: 'friend2', text: 'They deliver cakes, chin-chin, chocolates, everything fresh to your door — for events or just yourself 🛒🍫', delay: 10200, tick: 11200 },
  { from: 'typing', delay: 11800 },
  { from: 'friend2', text: 'Ordered like 25 mins ago and it just arrived 😭❤️', delay: 13200, tick: 14200 },
  { from: 'friend1', text: 'WAIT NO WAY ordering right now 😩🔥', delay: 15200 },
]

const SLIDES = [
  { img: gallery1, caption: 'Happy customer receiving Jovlora order', badge: '✨ Just Delivered!' },
  { img: gallery2, caption: 'Fresh from the oven, made with love', badge: '🍰 Freshly Baked' },
  { img: gallery3, caption: 'Fast delivery to your doorstep', badge: '🚀 30-min Delivery' },
]

// ── Double tick SVG ──────────────────────────────────────────
const DoubleTick = ({ isBlue }) => (
  <svg
    width="18" height="11" viewBox="0 0 18 11"
    fill="none" xmlns="http://www.w3.org/2000/svg"
    className={`wa-tick-icon ${isBlue ? 'blue' : 'grey'}`}
  >
    <path d="M1 5.5L4.5 9L11 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 5.5L9.5 9L16 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// ── Count-up hook ─────────────────────────────────────────────
function useCountUp(target, started, duration = 2000) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!started) return
    let startTime = null

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [started, target, duration])

  return count
}

// ── Stat card ─────────────────────────────────────────────────
function StatCard({ icon, target, suffix, label, sub, started, duration }) {
  const count = useCountUp(target, started, duration)

  return (
    <div className="story-stat">
      <div className="story-stat-icon">{icon}</div>
      <div>
        <div className="story-stat-title">
          <span className="story-stat-number">{count.toLocaleString()}</span>
          <span className="story-stat-suffix">{suffix}</span>
          {label && <span className="story-stat-label"> {label}</span>}
        </div>
        <div className="story-stat-sub">{sub}</div>
      </div>
    </div>
  )
}

// ── Gallery slider ────────────────────────────────────────────
function GallerySlider() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const timerRef = useRef(null)

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length)
    }, 4000)
  }

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [])

  const goTo = (index) => {
    if (animating || index === current) return
    clearInterval(timerRef.current)
    setAnimating(true)
    setTimeout(() => {
      setCurrent(index)
      setAnimating(false)
      startTimer()
    }, 300)
  }

  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length)
  const next = () => goTo((current + 1) % SLIDES.length)

  return (
    <div className="gallery-slider">
      <div className="gallery-main-wrap">
        <div className={`gallery-slide ${animating ? 'fade-out' : 'fade-in'}`}>
          <img src={SLIDES[current].img} alt={SLIDES[current].caption} />
          <div className="gallery-badge">{SLIDES[current].badge}</div>
          <div className="gallery-caption">{SLIDES[current].caption}</div>
        </div>
        <button className="gallery-arrow gallery-arrow-left" onClick={prev} aria-label="Previous">
          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
            <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/>
          </svg>
        </button>
        <button className="gallery-arrow gallery-arrow-right" onClick={next} aria-label="Next">
          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
          </svg>
        </button>
      </div>

      <div className="gallery-thumbs">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`gallery-thumb ${i === current ? 'active' : ''}`}
            onClick={() => goTo(i)}
          >
            <img src={slide.img} alt={slide.caption} />
          </div>
        ))}
      </div>

      <div className="gallery-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`gallery-dot ${i === current ? 'active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// ── Main ChatStory component ──────────────────────────────────
function ChatStory() {
  const [visible, setVisible] = useState([])
  const [blueTick, setBlueTick] = useState([])
  const [typing, setTyping] = useState(false)
  const [started, setStarted] = useState(false)
  const sectionRef = useRef(null)
  const bodyRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true)
      },
      { threshold: 0.3 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    MESSAGES.forEach((msg, i) => {
      if (msg.from === 'typing') {
        setTimeout(() => setTyping(true), msg.delay)
        setTimeout(() => setTyping(false), msg.delay + 900)
        return
      }
      setTimeout(() => {
        setVisible(prev => [...prev, i])
        setTimeout(() => {
          if (bodyRef.current)
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight
        }, 60)
      }, msg.delay)
      if (msg.tick) {
        setTimeout(() => setBlueTick(prev => [...prev, i]), msg.tick)
      }
    })
  }, [started])

  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <section className="chat-story" ref={sectionRef} aria-label="Customer story section">

      {/* ── Header ── */}
      <div className="chat-story-header">
        <p className="chat-story-eyebrow">Real Stories</p>
        <h2 className="chat-story-heading">
          Whenever you're craving something,<br />
          <em>we've got you covered</em>
        </h2>
        <p className="chat-story-sub">
          From that late-night craving to a surprise treat — Jovlora delivers happiness, fresh and fast.
        </p>
      </div>

      {/* ── Body ── */}
      <div className="chat-story-body">

        {/* LEFT — CSS phone */}
        <div className="chat-story-left">
          <div className="phone-wrapper">

            <div className="phone-notch" />

            <div className="wa-status-bar">
              <span>{now}</span>
              <span className="wa-status-icons">
                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#ffffff"><path d="M60-160v-320h120v320H60Zm240 0v-420h120v420H300Zm240 0v-520h120v520H540Zm240 0v-640h120v640H780Z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#ffffff"><path d="M409-149q-29-29-29-71t29-71q29-29 71-29t71 29q29 29 29 71t-29 71q-29 29-71 29t-71-29ZM254-346l-84-86q59-59 138.5-93.5T480-560q92 0 171.5 35T790-430l-84 84q-44-44-102-69t-124-25q-66 0-124 25t-102 69ZM84-516 0-600q92-94 215-147t265-53q142 0 265 53t215 147l-84 84q-77-77-178.5-120.5T480-680q-116 0-217.5 43.5T84-516Z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#ffffff"><path d="M160-240q-50 0-85-35t-35-85v-240q0-50 35-85t85-35h540q50 0 85 35t35 85v240q0 50-35 85t-85 35H160Zm0-80h540q17 0 28.5-11.5T740-360v-240q0-17-11.5-28.5T700-640H160q-17 0-28.5 11.5T120-600v240q0 17 11.5 28.5T160-320Zm700-60v-200h20q17 0 28.5 11.5T920-540v120q0 17-11.5 28.5T880-380h-20Zm-700 20v-240h80v240h-80Z"/></svg>
              </span>
            </div>

            <div className="wa-header">
              <div className="wa-back">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
              </div>
              <div className="wa-av">S</div>
              <div className="wa-info">
                <div className="wa-name">Sade</div>
                <div className="wa-status">online</div>
              </div>
              <div className="wa-icons">
                <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#ffffff"><path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12Z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#ffffff"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg>
              </div>
            </div>

            <div className="wa-body" ref={bodyRef}>
              <div className="wa-date"><span>Today</span></div>

              {MESSAGES.map((msg, i) => {
                if (msg.from === 'typing') return null
                if (!visible.includes(i)) return null
                const isRight = msg.from === 'friend1'
                const isBlue = blueTick.includes(i)
                return (
                  <div key={i} className={`wa-row ${isRight ? 'wa-row-right' : 'wa-row-left'}`}>
                    <div className={`wa-bubble ${isRight ? 'wa-bubble-right' : 'wa-bubble-left'}`}>
                      {msg.text}
                      <div className="wa-meta">
                        <span className="wa-time">{now}</span>
                        {isRight && (
                          <span className="wa-tick">
                            <DoubleTick isBlue={isBlue} />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}

              {typing && (
                <div className="wa-row wa-row-left">
                  <div className="wa-typing">
                    <span className="wa-dot" />
                    <span className="wa-dot" />
                    <span className="wa-dot" />
                  </div>
                </div>
              )}
            </div>

          </div>
          <div className="phone-shadow" />
        </div>

        {/* RIGHT — gallery + stats */}
        <div className="chat-story-right">

          <GallerySlider />

          <div className="story-stats">
            <StatCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                  <path d="M195-195q-35-35-35-85H60l18-80h113q17-19 40-29.5t49-10.5q26 0 49 10.5t40 29.5h167l84-360H182l4-17q6-28 27.5-45.5T264-800h456l-37 160h117l120 160-40 200h-80q0 50-35 85t-85 35q-50 0-85-35t-35-85H400q0 50-35 85t-85 35q-50 0-85-35Zm442-245h193l4-21-74-99h-95l-28 120Zm-19-273 2-7-84 360 2-7 34-146 46-200ZM20-427l20-80h220l-20 80H20Zm80-146 20-80h260l-20 80H100Zm180 333q17 0 28.5-11.5T320-280q0-17-11.5-28.5T280-320q-17 0-28.5 11.5T240-280q0 17 11.5 28.5T280-240Zm400 0q17 0 28.5-11.5T720-280q0-17-11.5-28.5T680-320q-17 0-28.5 11.5T640-280q0 17 11.5 28.5T680-240Z"/>
                </svg>
              }
              target={30}
              suffix="-min"
              label="delivery"
              sub="Fresh to your door, always"
              started={started}
              duration={1500}
            />
            <StatCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                  <path d="M603.5-298.5Q659-337 684-400H276q25 63 80.5 101.5T480-260q68 0 123.5-38.5ZM312-520l44-42 42 42 42-42-84-86-86 86 42 42Zm250 0 42-42 44 42 42-42-86-86-84 86 42 42ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480t31.5-156T197-763t127-85.5T480-880t156 31.5T763-763t85.5 127T880-480t-31.5 156T763-197t-127 85.5T480-80Zm0-80q133 0 226.5-93.5T800-480t-93.5-226.5T480-800 253.5-706.5 160-480t93.5 226.5T480-160Zm0-320Z"/>
                </svg>
              }
              target={2400}
              suffix="+"
              label="happy customers"
              sub="Lagos · Abuja · Port Harcourt"
              started={started}
              duration={2500}
            />
            <StatCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                  <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-75 29-147t81-128.5q52-56.5 125-91T475-881q21 0 43 2t45 7q-9 45 6 85t45 66.5q30 26.5 71.5 36.5t85.5-5q-26 59 7.5 113t99.5 56q1 11 1.5 20.5t.5 20.5q0 82-31.5 154.5t-85.5 127q-54 54.5-127 86T480-80Z"/>
                </svg>
              }
              target={9}
              suffix=" categories"
              label=""
              sub="Something for every craving"
              started={started}
              duration={1200}
            />
          </div>

        </div>
      </div>
    </section>
  )
}

export default ChatStory