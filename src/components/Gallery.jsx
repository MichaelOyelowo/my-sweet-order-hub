import { useState, useRef, useEffect } from 'react'

import banana_bread1 from '../assets/banana-breads/banana-bread5.webp'
import banana_bread2 from '../assets/banana-breads/banana-bread6.webp'
import banana_bread3 from '../assets/banana-breads/banana-bread7.webp'

import cake1  from '../assets/cakes/birthday-layer-cake.webp'
import cake2  from '../assets/cakes/cake-red-velvet.webp'
import cake3  from '../assets/cakes/choco.webp'
import cake5  from '../assets/cakes/chocolate-cake.webp'
import cake6  from '../assets/cakes/chocolate-cake1.webp'
import cake7  from '../assets/cakes/chocolate-cake3.webp'
import cake8  from '../assets/cakes/cupcake-choco.webp'
import cake9  from '../assets/cakes/cupcake-orange.webp'
import cake10 from '../assets/cakes/cupcake-vallina.webp'
import cake11 from '../assets/cakes/red-velvet.webp'
import cake12 from '../assets/cakes/wedding-cake.webp'
import cake13 from '../assets/cakes/wedding-cake1.webp'
import cake14 from '../assets/cakes/wedding-cake2.webp'

import chin from '../assets/chin-chin/chin-chin.webp'

import dough1 from '../assets/doughnuts/doughnut5.webp'
import dough2 from '../assets/doughnuts/doughnut6.webp'

import buns       from '../assets/homepage/buns.webp'
import chicken_pie from '../assets/homepage/chicken-pie.webp'
import meat_pie   from '../assets/homepage/meat-pie.webp'
import frank_roll  from '../assets/homepage/frank-roll.webp'
import frank_roll1 from '../assets/homepage/frank-roll1.webp'
import puff       from '../assets/homepage/puff-puff.webp'
import puff1      from '../assets/homepage/puff-puff1.webp'

import samosa  from '../assets/samosa/samosa-spring.webp'
import samosa1 from '../assets/samosa/samosa5.webp'

// ── Gallery data — all real images connected ──────────────────
const GALLERY_ITEMS = [
  { id: 1,  category: 'Cakes',  label: 'Red Velvet Cake',        tag: 'Fan Favourite', img: cake2,        height: 'tall'   },
  { id: 2,  category: 'Snacks', label: 'Crunchy Chin-Chin',      tag: 'Yummy',   img: chin,         height: 'short'  },
  { id: 3,  category: 'Pies',   label: 'Freshly Baked Meat Pie', tag: 'Hot 🔥',        img: meat_pie,     height: 'medium' },
  { id: 4,  category: 'Snacks', label: 'Glazed Doughnuts',       tag: 'New Taste',   img: dough1,       height: 'short'  },
  { id: 5,  category: 'Cakes',  label: 'Birthday Layer Cake',    tag: 'Custom Order',  img: cake1,        height: 'tall'   },
  { id: 6,  category: 'Snacks', label: 'Puff Puff Bites',        tag: 'Hot 🔥',        img: puff,         height: 'short'  },
  { id: 7,  category: 'Cakes',  label: 'Chocolate Cake',         tag: 'Fan Favourite', img: cake5,        height: 'medium' },
  { id: 8,  category: 'Pies',   label: 'Chicken Pie',            tag: 'Yummy',   img: chicken_pie,  height: 'short'  },
  { id: 9,  category: 'Snacks', label: 'Banana Bread Slices',    tag: 'Healthy Pick',  img: banana_bread1,height: 'tall'   },
  { id: 10, category: 'Snacks', label: 'Spring Roll & Samosa',   tag: 'Crispy 🔥',     img: samosa,       height: 'tall'   },
  { id: 11, category: 'Cakes',  label: 'Choco Cupcakes',         tag: 'New Taste',   img: cake8,        height: 'medium' },
  { id: 12, category: 'Snacks', label: 'Frank Roll',             tag: 'Hot 🔥',        img: frank_roll,   height: 'short'  },
  // Load more
  { id: 13, category: 'Snacks', label: 'Banana Bread Loaf',      tag: 'Healthy Pick',  img: banana_bread3,height: 'medium'  },
  { id: 14, category: 'Snacks', label: 'Crispy Doughnut',        tag: 'Fan Favourite', img: dough2,       height: 'medium' },
  { id: 15, category: 'Snacks', label: 'Fresh Buns',             tag: 'Hot 🔥',        img: buns,         height: 'short'  },
  { id: 16, category: 'Cakes',  label: 'Orange Cupcake',         tag: 'New Taste',   img: cake9,        height: 'short'  },
  { id: 17, category: 'Cakes',  label: 'Chocolate Layer Cake',   tag: 'Yummy',   img: cake6,        height: 'tall'   },
  { id: 18, category: 'Snacks', label: 'Samosa Bites',           tag: 'Crispy 🔥',     img: samosa1,      height: 'short'  },
  { id: 19, category: 'Cakes',  label: 'Wedding Cake',           tag: 'Custom Order',  img: cake12,       height: 'tall'   },
  { id: 20, category: 'Cakes',  label: 'Red Velvet Slice',       tag: 'Fan Favourite', img: cake11,       height: 'medium' },
  { id: 21, category: 'Snacks', label: 'Puff Puff Fresh',        tag: 'Hot 🔥',        img: puff1,        height: 'short'  },
  { id: 22, category: 'Cakes',  label: 'Wedding Cake Classic',   tag: 'Custom Order',  img: cake13,       height: 'tall'   },
  { id: 23, category: 'Pies',   label: 'Frank Roll Fresh',       tag: 'Yummy',   img: frank_roll1,  height: 'medium' },
  { id: 24, category: 'Cakes',  label: 'Vanilla Cupcake',        tag: 'New Taste',   img: cake10,       height: 'short'  },
  { id: 25, category: 'Cakes',  label: 'Dark Chocolate Cake',    tag: 'Fan Favourite', img: cake7,        height: 'tall'   },
  { id: 26, category: 'Cakes',  label: 'Tiered Wedding Cake',    tag: 'Custom Order',  img: cake14,       height: 'medium' },
  { id: 27, category: 'Snacks', label: 'Banana Bread Loaf',      tag: 'Healthy Pick',  img: banana_bread2,height: 'short'  },
  { id: 28, category: 'Cakes',  label: 'Rich Choco Bite',        tag: 'Yummy',   img: cake3,        height: 'medium' },

]

const CATEGORIES    = ['All', 'Snacks', 'Cakes', 'Pies']
const INITIAL_COUNT = 12

const TAG_STYLES = {
  'Fan Favourite': { bg: 'rgba(192,57,43,0.88)',  color: '#fff' },
  'Yummy':   { bg: 'rgba(39,174,96,0.88)',  color: '#fff' },
  'New Taste':   { bg: 'rgba(41,128,185,0.88)', color: '#fff' },
  'Hot 🔥':        { bg: 'rgba(231,76,60,0.88)',  color: '#fff' },
  'Custom Order':  { bg: 'rgba(155,89,182,0.88)', color: '#fff' },
  'Healthy Pick':  { bg: 'rgba(39,174,96,0.88)',  color: '#fff' },
  'Crispy 🔥':     { bg: 'rgba(230,126,34,0.88)', color: '#fff' },
}

// ── Category emoji map ────────────────────────────────────────
const CAT_EMOJI = {
  All:    '✦',
  Snacks: '',
  Cakes:  '',
  Pies:   '',
}

// ── Single gallery card ───────────────────────────────────────
function GalleryCard({ item, index }) {
  const [visible, setVisible]   = useState(false)
  const [loaded, setLoaded]     = useState(false)
  const [error, setError]       = useState(false)
  const ref = useRef(null)

  // Scroll-triggered entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.08, rootMargin: '0px 0px 40px 0px' }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const tagStyle = TAG_STYLES[item.tag] || { bg: 'rgba(0,0,0,0.75)', color: '#fff' }

  return (
    <div
      ref={ref}
      className={`gallery-card gallery-card--${item.height} ${visible ? 'visible' : ''} ${loaded ? 'img-loaded' : ''}`}
      style={{ transitionDelay: `${(index % 3) * 70}ms` }}
      aria-label={item.label}
    >
      {/* Skeleton shimmer while image loads */}
      {!loaded && !error && (
        <div className="gallery-skeleton" aria-hidden="true" />
      )}

      {/* Real photo */}
      <div className="gallery-card-img">
        <img
          src={item.img}
          alt={item.label}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{ opacity: loaded ? 1 : 0 }}
        />

        {/* Fallback if image fails */}
        {error && (
          <div className="gallery-img-fallback" aria-hidden="true">
            <span>🍽️</span>
          </div>
        )}
      </div>

      {/* Tag */}
      <div
        className="gallery-tag"
        style={{ background: tagStyle.bg, color: tagStyle.color }}
      >
        {item.tag}
      </div>

      {/* Hover overlay */}
      <div className="gallery-overlay">
        <div className="gallery-overlay-inner">
          <span className="gallery-overlay-category">{item.category}</span>
          <p className="gallery-overlay-label">{item.label}</p>
        </div>
      </div>
    </div>
  )
}

// ── Main Gallery component ────────────────────────────────────
export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [showAll, setShowAll]               = useState(false)
  const [animating, setAnimating]           = useState(false)

  const filtered  = GALLERY_ITEMS.filter(item =>
    activeCategory === 'All' ? true : item.category === activeCategory
  )
  const displayed = showAll ? filtered : filtered.slice(0, INITIAL_COUNT)
  const hasMore   = filtered.length > INITIAL_COUNT && !showAll

  const handleCategory = (cat) => {
    if (cat === activeCategory) return
    setAnimating(true)
    setTimeout(() => {
      setActiveCategory(cat)
      setShowAll(false)
      setAnimating(false)
    }, 200)
  }

  return (
    <section className="gallery-section" id="gallery" aria-label="Food gallery">

      {/* Header */}
      <div className="gallery-header">
        <p className="gallery-eyebrow">Moments Made Sweeter</p>
        <h2 className="gallery-heading">
          A Taste Worth <em>Sharing</em>
        </h2>
        <p className="gallery-sub">
          From first bites to shared smiles, every order tells a story.
          Take a look at how our treats are making every moment a little sweeter.
        </p>
      </div>

      {/* Filters */}
      <div className="gallery-filters" role="tablist" aria-label="Filter by category">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeCategory === cat}
            className={`gallery-filter-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => handleCategory(cat)}
          >
            <span className="gfb-emoji">{CAT_EMOJI[cat]}</span>
            {cat}
          </button>
        ))}
      </div>

      {/* Count indicator */}
      <p className="gallery-showing">
        Showing <strong>{displayed.length}</strong> of <strong>{filtered.length}</strong> photos
        {activeCategory !== 'All' && ` in ${activeCategory}`}
      </p>

      {/* Masonry grid */}
      <div className={`gallery-grid ${animating ? 'animating' : ''}`}>
        {displayed.map((item, index) => (
          <GalleryCard
            key={`${item.id}-${activeCategory}`}
            item={item}
            index={index}
          />
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="gallery-load-more-wrap">
          <button className="gallery-load-more" onClick={() => setShowAll(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
              <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
            </svg>
            Load More Photos
          </button>
          <p className="gallery-count">
            {filtered.length - displayed.length} more photos waiting
          </p>
        </div>
      )}

      {/* Show less */}
      {showAll && filtered.length > INITIAL_COUNT && (
        <div className="gallery-load-more-wrap">
          <button
            className="gallery-load-more ghost"
            onClick={() => {
              setShowAll(false)
              document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Show Less ↑
          </button>
        </div>
      )}

      {/* CTA */}
      {/* ── Glowing Call to Action ── */}
      <div className="gallery-cta-wrapper">
        <div className="gallery-cta-card">
          <p>Want something this good for yourself?</p>
          <a href="#order" className="gallery-cta-btn">
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
              <path d="M223.5-103.5Q200-127 200-160t23.5-56.5Q247-240 280-240t56.5 23.5Q360-193 360-160t-23.5 56.5Q313-80 280-80t-56.5-23.5Zm400 0Q600-127 600-160t23.5-56.5Q647-240 680-240t56.5 23.5Q760-193 760-160t-23.5 56.5Q713-80 680-80t-56.5-23.5ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/>
            </svg>
            Order Now
          </a>
        </div>
      </div>

    </section>
  )
}