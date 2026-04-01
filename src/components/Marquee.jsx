const items = [
  { label: 'Chocolates', emoji: '🍫' },
  { label: 'Chin-Chin',  emoji: '🍘' },
  { label: 'Cookies',    emoji: '🍪' },
  { label: 'Cakes',      emoji: '🎂' },
  { label: 'Doughnuts',  emoji: '🍩' },
  { label: 'Banana Bread', emoji: '🍌' },
  { label: 'Shawarma',   emoji: '🌯' },
  { label: 'Pizza',      emoji: '🍕' },
  { label: 'Samosa',     emoji: '🥟' },
]

function Marquee() {
  return (
    <div className="marquee-section" aria-label="Our categories">
      <div className="marquee-track">
        {/* Render twice for seamless infinite loop */}
        {[...items, ...items].map((item, i) => (
          <span key={i} className="marquee-item">
            <span className="marquee-emoji">{item.emoji}</span>
            {item.label}
            <span className="marquee-divider">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default Marquee