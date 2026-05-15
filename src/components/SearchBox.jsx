import { useState, useRef, useEffect } from 'react'
import { useSearch } from '../context/SearchContext'

// ── All products with images for the dropdown ─────────────────
// We keep a lightweight version here — just what the dropdown needs
// Import the same images you use in OrderSection
import imgPuffPuff     from '../assets/homepage/puff-puff-pepper.webp'
import imgChinChin     from '../assets/homepage/crumpy-chin-chin.webp'
import imgBananaBread  from '../assets/homepage/sliced-peanut-butter-banana-bread.webp'
import imgFishRoll     from '../assets/fish-roll/fish-roll1.webp'
import imgBakedFish    from '../assets/fish-roll/baked-fish-roll.webp'
import imgSausageRoll  from '../assets/sausage/sausage5.webp'
import imgSamosa       from '../assets/samosa/samosa1.webp'
import imgSpringRoll   from '../assets/spring-rolls/spring-roll1.webp'
import imgFrankRoll    from '../assets/frank-rolls/frank-roll.webp'
import imgBuns         from '../assets/buns/buns1.webp'
import imgDoughnut     from '../assets/doughnuts/doughnut2.webp'
import imgChocoDough   from '../assets/doughnuts/chocolate-dough1.webp'
import imgJamDough     from '../assets/doughnuts/jam-dough1.webp'
import imgMilkyDough   from '../assets/doughnuts/milky-dough1.webp'
import imgEggRoll      from '../assets/homepage/eggroll.webp'
import imgMeatPie      from '../assets/homepage/meat-pie.webp'
import imgChickenPie   from '../assets/homepage/chicken-pie1.webp'
import imgSmallCake    from '../assets/cakes/cupcake1.webp'
import imgMediumCake   from '../assets/homepage/cupcake.webp'
import imgParfait      from '../assets/cakes/cakeparfait.webp'

const ALL_PRODUCTS = [
  { id: 1,  name: 'Puff Puff',          category: 'Snacks', price: 100,  img: imgPuffPuff    },
  { id: 2,  name: 'Chin-Chin',          category: 'Snacks', price: 100,  img: imgChinChin    },
  { id: 3,  name: 'Banana Bread',       category: 'Snacks', price: 500,  img: imgBananaBread },
  { id: 4,  name: 'Fish Roll',          category: 'Snacks', price: 600,  img: imgFishRoll    },
  { id: 5,  name: 'Baked Fish Roll',    category: 'Snacks', price: 600,  img: imgBakedFish   },
  { id: 6,  name: 'Sausage Roll',       category: 'Snacks', price: 800,  img: imgSausageRoll },
  { id: 7,  name: 'Samosa',             category: 'Snacks', price: 400,  img: imgSamosa      },
  { id: 8,  name: 'Spring Roll',        category: 'Snacks', price: 400,  img: imgSpringRoll  },
  { id: 9,  name: 'Frank Roll',         category: 'Snacks', price: 800,  img: imgFrankRoll   },
  { id: 10, name: 'Buns',               category: 'Snacks', price: 100,  img: imgBuns        },
  { id: 11, name: 'Doughnut',           category: 'Snacks', price: 300,  img: imgDoughnut    },
  { id: 12, name: 'Chocolate Doughnut', category: 'Snacks', price: 1000, img: imgChocoDough  },
  { id: 13, name: 'Jam Doughnut',       category: 'Snacks', price: 500,  img: imgJamDough    },
  { id: 14, name: 'Milky Doughnut',     category: 'Snacks', price: 1300, img: imgMilkyDough  },
  { id: 15, name: 'Egg Roll',           category: 'Pies',   price: 500,  img: imgEggRoll     },
  { id: 16, name: 'Meat Pie',           category: 'Pies',   price: 1000, img: imgMeatPie     },
  { id: 17, name: 'Chicken Pie',        category: 'Pies',   price: 500,  img: imgChickenPie  },
  { id: 18, name: 'Small Cupcake',      category: 'Cakes',  price: 300,  img: imgSmallCake   },
  { id: 19, name: 'Medium Cupcake',     category: 'Cakes',  price: 500,  img: imgMediumCake  },
  { id: 20, name: 'Cake Parfait',       category: 'Cakes',  price: 1500, img: imgParfait     },
]

const CAT_COLORS = {
  Snacks: '#8e44ad',
  Pies:   '#e67e22',
  Cakes:  '#c0392b',
}

const fmt = (n) => '₦' + n.toLocaleString()

export default function SearchBox({ isMobile = false }) {
  const { applySearch, clearSearch, searchTerm } = useSearch()
  const [inputVal, setInputVal] = useState('')
  const [open, setOpen]         = useState(false)
  const wrapRef  = useRef(null)
  const inputRef = useRef(null)

  // Sync input when search is cleared externally
  useEffect(() => {
    if (!searchTerm) setInputVal('')
  }, [searchTerm])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const normalize = (value) => value.trim().toLowerCase()
  const query = normalize(inputVal)
  const queryParts = query.split(/\s+/).filter(Boolean)

  // Filter products based on input
  const results = query === ''
    ? ALL_PRODUCTS                           // show ALL when empty
    : ALL_PRODUCTS.filter(p => {
        const haystack = `${p.name} ${p.category}`.toLowerCase()
        return queryParts.every(part => haystack.includes(part))
      })

  // Group by category for display
  const grouped = results.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category].push(p)
    return acc
  }, {})

  const handleSelect = (product) => {
    setInputVal(product.name)
    setOpen(false)
    inputRef.current?.blur()
    applySearch(product.name, product.id)
  }

  const handleClear = () => {
    setInputVal('')
    clearSearch()
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
    if (e.key === 'Enter' && inputVal.trim()) {
      applySearch(inputVal.trim())
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div
      ref={wrapRef}
      className={`sb-wrap ${isMobile ? 'sb-mobile' : ''}`}
    >
      {/* Input */}
      <div className={`sb-input-row ${open ? 'focused' : ''} ${searchTerm ? 'has-value' : ''}`}>
        <svg className="sb-search-icon" xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
          <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
        </svg>

        <input
          ref={inputRef}
          type="text"
          className="sb-input"
          placeholder="Search snacks..."
          value={inputVal}
          onChange={e => { setInputVal(e.target.value) }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          aria-label="Search products"
        />

        {(inputVal || searchTerm) && (
          <button className="sb-clear" onClick={handleClear} aria-label="Clear">
            <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="sb-dropdown" role="listbox">

          {/* Header */}
          <div className="sb-dropdown-header">
            {inputVal.trim() === '' ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="currentColor">
                  <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                </svg>
                All {ALL_PRODUCTS.length} products
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="currentColor">
                  <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                </svg>
                {results.length} result{results.length !== 1 ? 's' : ''} for "<strong>{inputVal}</strong>"
              </>
            )}
          </div>

          {/* No results */}
          {results.length === 0 && (
            <div className="sb-no-results">
              <span>😕</span>
              <p>No products match "<strong>{inputVal}</strong>"</p>
              <span className="sb-nr-hint">Try: puff puff, cake, meat pie...</span>
            </div>
          )}

          {/* Grouped product rows */}
          {Object.entries(grouped).map(([category, products]) => (
            <div key={category} className="sb-group">

              {/* Category label */}
              <div
                className="sb-group-label"
                style={{ color: CAT_COLORS[category] }}
              >
                <span
                  className="sb-group-dot"
                  style={{ background: CAT_COLORS[category] }}
                />
                {category}
              </div>

              {/* Product rows */}
              {products.map(product => {
                const query    = inputVal.toLowerCase()
                const name     = product.name
                const matchIdx = name.toLowerCase().indexOf(query)

                return (
                  <button
                    key={product.id}
                    className="sb-product-row"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      handleSelect(product)
                    }}
                    role="option"
                  >
                    {/* Thumbnail */}
                    <div className="sb-thumb">
                      <img
                        src={product.img}
                        alt={product.name}
                        loading="lazy"
                      />
                    </div>

                    {/* Name + category */}
                    <div className="sb-product-info">
                      <span className="sb-product-name">
                        {inputVal.trim() && matchIdx >= 0 ? (
                          <>
                            {name.slice(0, matchIdx)}
                            <mark>{name.slice(matchIdx, matchIdx + query.length)}</mark>
                            {name.slice(matchIdx + query.length)}
                          </>
                        ) : name}
                      </span>
                    </div>

                    {/* Price */}
                    <span className="sb-product-price">
                      {fmt(product.price)}
                    </span>

                    {/* Arrow */}
                    <svg className="sb-arrow" xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
                      <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
                    </svg>
                  </button>
                )
              })}
            </div>
          ))}

        </div>
      )}
    </div>
  )
}