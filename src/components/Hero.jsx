import { useState, useEffect } from 'react'

import chocolate1 from '../assets/chocolates/chocolate1.webp'
import chocolate2 from '../assets/chocolates/chocolate2.webp'
import chocolate3 from '../assets/chocolates/chocolate3.webp'
import chocolate4 from '../assets/chocolates/chocolate4.webp'

import chin1 from '../assets/chin-chin/chin1.webp'
import chin2 from '../assets/chin-chin/chin2.webp'
import chin3 from '../assets/chin-chin/chin3.webp'
import chin4 from '../assets/chin-chin/chin4.webp'

import cookies1 from '../assets/cookies/cookies1.webp'
import cookies2 from '../assets/cookies/cookies2.webp'
import cookies3 from '../assets/cookies/cookies3.webp'
import cookies4 from '../assets/cookies/cookies4.webp'

import cake1 from '../assets/cakes/cake1.webp'
import cake2 from '../assets/cakes/cake2.webp'
import cake3 from '../assets/cakes/cakes-stand.webp'
import cake4 from '../assets/cakes/chocolate-naked-cake.webp'

import doughnut1 from '../assets/doughnuts/doughnut1.webp'
import doughnut2 from '../assets/doughnuts/doughnut2.webp'
import doughnut3 from '../assets/doughnuts/doughnut3.webp'
import doughnut4 from '../assets/doughnuts/doughnut4.webp'

import banana_bread1 from '../assets/banana-breads/banana-bread1.webp'
import banana_bread2 from '../assets/banana-breads/banana-bread2.webp'
import banana_bread3 from '../assets/banana-breads/banana-bread3.webp'
import banana_bread4 from '../assets/banana-breads/banana-bread4.webp'

import shawarma1 from '../assets/shawarmas/shawarma1.webp'
import shawarma2 from '../assets/shawarmas/shawarma2.webp'
import shawarma3 from '../assets/shawarmas/shawarma3.webp'
import shawarma4 from '../assets/shawarmas/shawarma4.webp'

import pizza1 from '../assets/pizza/floating-slice-art-pizza.webp'
import pizza2 from '../assets/pizza/pizza-with-mushrooms.webp'
import pizza3 from '../assets/pizza/side-view-pizza.webp'
import pizza4 from '../assets/pizza/slice-crispy-pizza.webp'

import samosa1 from '../assets/samosa/samosa1.webp'
import samosa2 from '../assets/samosa/samosa2.webp'
import samosa3 from '../assets/samosa/samosa3.webp'
import samosa4 from '../assets/samosa/samosa4.webp'


const categories = [
  {
    word: 'Chocolates',
    images: [
      { img: chocolate1, label: 'Dark Truffle',     rotate: '6deg',  size: { w: 200, h: 210 }, pos: { top: '0px',   right: '0px'  } },
      { img: chocolate2, label: 'Milk Choco Box',   rotate: '-5deg', size: { w: 170, h: 185 }, pos: { top: '10px',  left: '0px'   } },
      { img: chocolate3, label: 'White Choco Bar',  rotate: '3deg',  size: { w: 155, h: 165 }, pos: { bottom: '0px', right: '20px' } },
      { img: chocolate4, label: 'Choco Praline',    rotate: '-4deg', size: { w: 140, h: 150 }, pos: { bottom: '10px', left: '10px' } },
    ]
  },
  {
    word: 'Chin-Chin',
    images: [
      { img: chin1, label: 'Crunchy Chin-Chin',  rotate: '6deg',  size: { w: 200, h: 210 }, pos: { top: '0px',    right: '0px'  } },
      { img: chin4, label: 'Coconut Chin-Chin',  rotate: '-5deg', size: { w: 170, h: 185 }, pos: { top: '10px',   left: '0px'   } },
      { img: chin3, label: 'Spicy Chin-Chin',    rotate: '3deg',  size: { w: 155, h: 165 }, pos: { bottom: '0px', right: '20px' } },
      { img: chin2, label: 'Zobo Chin-Chin',     rotate: '-4deg', size: { w: 140, h: 150 }, pos: { bottom: '10px', left: '10px' } },
    ]
  },
  {
    word: 'Cookies',
    images: [
      { img: cookies1, label: 'Choco Chip', rotate: '6deg',  size: { w: 200, h: 210 }, pos: { top: '0px',    right: '0px'  } },
      { img: cookies3, label: 'Peanut Butter', rotate: '-5deg', size: { w: 170, h: 185 }, pos: { top: '10px',   left: '0px'   } },
      { img: cookies4, label: 'Oatmeal Cookie', rotate: '3deg',  size: { w: 155, h: 165 }, pos: { bottom: '0px', right: '20px' } },
      { img: cookies2, label: 'Shortbread', rotate: '-4deg', size: { w: 140, h: 150 }, pos: { bottom: '10px', left: '10px' } },
    ]
  },
  {
    word: 'Cakes',
    images: [
      { img: cake1, label: 'Red Velvet',       rotate: '6deg',  size: { w: 200, h: 210 }, pos: { top: '0px',    right: '0px'  } },
      { img: cake2, label: 'Vanilla Sponge',   rotate: '-5deg', size: { w: 170, h: 185 }, pos: { top: '10px',   left: '0px'   } },
      { img: cake3, label: 'Birthday Cake',    rotate: '3deg',  size: { w: 155, h: 165 }, pos: { bottom: '0px', right: '20px' } },
      { img: cake4, label: 'Strawberry Cake',  rotate: '-4deg', size: { w: 140, h: 150 }, pos: { bottom: '10px', left: '10px' } },
    ]
  },
  {
    word: 'Doughnuts',
    images: [
      { img: doughnut1, label: 'Glazed Donut',     rotate: '6deg',  size: { w: 200, h: 210 }, pos: { top: '0px',    right: '0px'  } },
      { img: doughnut2, label: 'Strawberry Donut', rotate: '-5deg', size: { w: 170, h: 185 }, pos: { top: '10px',   left: '0px'   } },
      { img: doughnut3, label: 'Choco Donut',      rotate: '3deg',  size: { w: 155, h: 165 }, pos: { bottom: '0px', right: '20px' } },
      { img: doughnut4, label: 'Red Velvet Donut', rotate: '-4deg', size: { w: 140, h: 150 }, pos: { bottom: '10px', left: '10px' } },
    ]
  },
  {
    word: 'Banana Bread',
    images: [
      { img: banana_bread1, label: 'Classic',          rotate: '6deg',  size: { w: 200, h: 210 }, pos: { top: '0px',    right: '0px'  } },
      { img: banana_bread2, label: 'Choco Banana',     rotate: '-5deg', size: { w: 170, h: 185 }, pos: { top: '10px',   left: '0px'   } },
      { img: banana_bread3, label: 'Nutty Banana',     rotate: '3deg',  size: { w: 155, h: 165 }, pos: { bottom: '0px', right: '20px' } },
      { img: banana_bread4, label: 'Walnut Banana',    rotate: '-4deg', size: { w: 140, h: 150 }, pos: { bottom: '10px', left: '10px' } },
    ]
  },
  {
    word: 'Shawarma',
    images: [
      { img: shawarma1, label: 'Chicken Shawarma', rotate: '6deg',  size: { w: 200, h: 210 }, pos: { top: '0px',    right: '0px'  } },
      { img: shawarma2, label: 'Beef Shawarma',    rotate: '-5deg', size: { w: 170, h: 185 }, pos: { top: '10px',   left: '0px'   } },
      { img: shawarma3, label: 'Mixed Shawarma',   rotate: '3deg',  size: { w: 155, h: 165 }, pos: { bottom: '0px', right: '20px' } },
      { img: shawarma4, label: 'Veggie Shawarma',  rotate: '-4deg', size: { w: 140, h: 150 }, pos: { bottom: '10px', left: '10px' } },
    ]
  },
  {
    word: 'Pizza',
    images: [
      { img: pizza1, label: 'Pepperoni', rotate: '6deg',  size: { w: 200, h: 210 }, pos: { top: '0px',    right: '0px'  } },
      { img: pizza2, label: 'Margherita', rotate: '-5deg', size: { w: 170, h: 185 }, pos: { top: '10px',   left: '0px'   } },
      { img: pizza3, label: 'Veggie Pizza', rotate: '3deg',  size: { w: 155, h: 165 }, pos: { bottom: '0px', right: '20px' } },
      { img: pizza4, label: 'BBQ Chicken', rotate: '-4deg', size: { w: 140, h: 150 }, pos: { bottom: '10px', left: '10px' } },
    ]
  },
  {
    word: 'Samosa',
    images: [
      { img: samosa1, label: 'Beef Samosa', rotate: '6deg',  size: { w: 200, h: 210 }, pos: { top: '0px',    right: '0px'  } },
      { img: samosa2, label: 'Chicken Samosa', rotate: '-5deg', size: { w: 170, h: 185 }, pos: { top: '10px',   left: '0px'   } },
      { img: samosa3, label: 'Veggie Samosa', rotate: '3deg',  size: { w: 155, h: 165 }, pos: { bottom: '0px', right: '20px' } },
      { img: samosa4, label: 'Spicy Samosa', rotate: '-4deg', size: { w: 140, h: 150 }, pos: { bottom: '10px', left: '10px' } },
    ]
  },
]

function Hero() {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % categories.length)
        setVisible(true)
      }, 500)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  const goTo = (index) => {
    setVisible(false)
    setTimeout(() => {
      setCurrent(index)
      setVisible(true)
    }, 500)
  }

  const cat = categories[current]

  return (
    <section className="hero" aria-label="Hero section">
      <div className="hero-container">

        {/* ── Left side ── */}
        <div className="hero-left">
          <p className="hero-tag">The Artisanal Snack Shop</p>
          <h1 className="hero-h1"> Satisfy Your<br />
            <span className="hero-scribble">Cravings</span> with<br />
            <span className={`hero-changing ${visible ? 'visible' : ''}`}>
              {cat.word}
            </span>
          </h1>

          <p className="hero-sub">
            Discover the world's most delicious snacks delivered straight to your door. Fresh, crunchy and irresistibly
            sweet. Curated for the modern connoisseur.
          </p>

          <div className="hero-pills" role="tablist" aria-label="Snack categories">
            {categories.map((c, i) => (
              <button key={c.word} role="tab" aria-selected={i === current}
                className={`hero-pill ${i === current ? 'active' : ''}`}
                onClick={() => goTo(i)}
              >
                {c.word}
              </button>
            ))}
          </div>

          <div className="hero-btns">
            <button className="hero-btn-primary">Shop Now</button>
            <button className="hero-btn-secondary">View Menu</button>
          </div>

          <div className="hero-dots" role="tablist">
            {categories.map((_, i) => (
              <button
                key={i}
                className={`hero-dot ${i === current ? 'active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to ${categories[i].word}`}
              />
            ))}
          </div>
        </div>

        {/* ── Right side — 4 stacked images ── */}
        <div className="hero-right" aria-label={`${cat.word} images`}>
          <div className={`hero-img-stack ${visible ? 'visible' : ''}`}>
            {cat.images.map((img, i) => (
              <div key={i} className={`hero-img-card hero-img-card--${i + 1}`}
                style={{ width: img.size.w, height: img.size.h, transform: `rotate(${img.rotate})`,
                  ...img.pos,
                }}
              >
                {img.img ? (
                  <img
                    src={img.img}
                    alt={img.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ background: img.bg, width: '100%', height: '100%' }} />
                )}
                <span className="hero-img-label">{img.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default Hero