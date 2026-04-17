import { useState, useEffect, useRef } from 'react'

const PRODUCTS = [
  { id: 1,  name: 'Puff Puff',            price: 100,  unit: 'piece',  moq: 5, category: 'Snacks' },
  { id: 2,  name: 'Chin-Chin',            price: 100,  unit: 'sachet', moq: 5, category: 'Snacks' },
  { id: 3,  name: 'Banana Bread',         price: 200,  unit: 'piece',  moq: 3, category: 'Snacks' },
  { id: 4,  name: 'Fish Roll',            price: 200,  unit: 'piece',  moq: 3, category: 'Snacks' },
  { id: 5,  name: 'Sausage Roll',         price: 200,  unit: 'piece',  moq: 3, category: 'Snacks' },
  { id: 6,  name: 'Spring Roll & Samosa', price: 200,  unit: 'piece',  moq: 3, category: 'Snacks' },
  { id: 7,  name: 'Frank Roll',           price: 200,  unit: 'piece',  moq: 3, category: 'Snacks' },
  { id: 8,  name: 'Buns',                 price: 200,  unit: 'piece',  moq: 3, category: 'Snacks' },
  { id: 9,  name: 'Doughnut',             price: 300,  unit: 'piece',  moq: 2, category: 'Snacks' },
  { id: 10, name: 'Egg Roll',             price: 500,  unit: 'piece',  moq: 1, category: 'Pies'   },
  { id: 11, name: 'Meat Pie',             price: 500,  unit: 'piece',  moq: 1, category: 'Pies'   },
  { id: 12, name: 'Chicken Pie',          price: 500,  unit: 'piece',  moq: 1, category: 'Pies'   },
  { id: 13, name: 'Small Cupcake',        price: 300,  unit: 'piece',  moq: 2, category: 'Cakes'  },
  { id: 14, name: 'Medium Cupcake',       price: 500,  unit: 'piece',  moq: 1, category: 'Cakes'  },
  { id: 15, name: 'Cake Parfait',         price: 1500, unit: 'piece',  moq: 1, category: 'Cakes'  },
  { id: 16, name: 'Custom Cake',          price: 0,    unit: 'custom', moq: 1, category: 'Cakes'  },
]

const CATEGORIES = ['All', 'Snacks', 'Pies', 'Cakes']
const WHATSAPP_NUMBER = '2349029702549'
const fmt = (n) => '₦' + n.toLocaleString()

// ── Countdown Timer ───────────────────────────────────────────
function CountdownTimer({ onClose }) {
  const TOTAL = 90 * 60
  const [seconds, setSeconds] = useState(TOTAL)
  const [phase, setPhase] = useState('preparing')
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        const next = prev - 1
        if (next <= 0) { clearInterval(intervalRef.current); setPhase('ready'); return 0 }
        if (next === 60 * 60) setPhase('ready_soon')
        return next
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [])

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const progress = ((TOTAL - seconds) / TOTAL) * 100

  const phases = {
    preparing:  { emoji: '👨‍🍳', title: "We're preparing your order!", msg: 'Our team has received your order and is getting started. Fresh and made with love ❤️', color: '#c0392b' },
    ready_soon: { emoji: '🎉', title: 'Almost ready!',              msg: 'Your order will be ready for delivery in about 30 minutes. Get excited! 🛵',             color: '#e67e22' },
    ready:      { emoji: '✅', title: 'Your order is ready!',       msg: 'Your SweetHUB order is on its way to you right now. Enjoy! 🎊',                         color: '#27ae60' },
  }

  const cur = phases[phase]

  return (
    <div className="countdown-overlay">
      <div className="countdown-card">
        <button className="countdown-close" onClick={onClose} aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor">
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
          </svg>
        </button>

        <div className="countdown-emoji">{cur.emoji}</div>
        <h3 className="countdown-title">{cur.title}</h3>
        <p className="countdown-msg">{cur.msg}</p>

        {phase !== 'ready' && (
          <>
            <div className="countdown-timer">
              <span className="countdown-digits">
                {String(mins).padStart(2, '0')}
                <span className="countdown-colon">:</span>
                {String(secs).padStart(2, '0')}
              </span>
              <span className="countdown-label">estimated time remaining</span>
            </div>
            <div className="countdown-bar-wrap">
              <div className="countdown-bar-fill" style={{ width: `${progress}%`, background: cur.color }} />
            </div>
          </>
        )}

        <div className="countdown-steps">
          <div className={`countdown-step ${['preparing','ready_soon','ready'].includes(phase) ? 'done' : ''}`}>
            <div className="cs-dot" /><span>Order received</span>
          </div>
          <div className="countdown-step-line" />
          <div className={`countdown-step ${['ready_soon','ready'].includes(phase) ? 'done' : ''}`}>
            <div className="cs-dot" /><span>Being prepared</span>
          </div>
          <div className="countdown-step-line" />
          <div className={`countdown-step ${phase === 'ready' ? 'done' : ''}`}>
            <div className="cs-dot" /><span>Out for delivery</span>
          </div>
        </div>

        {phase === 'ready' && (
          <button className="countdown-done-btn" onClick={onClose}>Close & Continue Shopping</button>
        )}
      </div>
    </div>
  )
}

// ── Custom Cake Modal ─────────────────────────────────────────
function CustomCakeModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ size: '', occasion: '', date: '', notes: '' })
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const submit = () => {
    if (!form.size || !form.occasion) return
    onSubmit(form)
    onClose()
  }

  return (
    <div className="countdown-overlay">
      <div className="custom-cake-modal">
        <button className="countdown-close" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor">
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
          </svg>
        </button>
        <div className="countdown-emoji">🎂</div>
        <h3 className="countdown-title">Custom Cake Request</h3>
        <p className="countdown-msg">Tell us what you need and we'll get back to you with a quote within the hour.</p>
        <div className="custom-form">
          <div className="custom-field">
            <label>Cake Size / Layers *</label>
            <input name="size" value={form.size} onChange={handle} placeholder="e.g. 2-tier, 10 inches, feeds 50 people" />
          </div>
          <div className="custom-field">
            <label>Occasion *</label>
            <input name="occasion" value={form.occasion} onChange={handle} placeholder="e.g. Birthday, Wedding, Graduation" />
          </div>
          <div className="custom-field">
            <label>Event Date</label>
            <input name="date" type="date" value={form.date} onChange={handle} />
          </div>
          <div className="custom-field">
            <label>Special Requests</label>
            <textarea name="notes" value={form.notes} onChange={handle} placeholder="Flavour, colour, decorations, dietary needs..." rows={3} />
          </div>
        </div>
        <button className="custom-submit-btn" onClick={submit}>Send Request via WhatsApp 💬</button>
      </div>
    </div>
  )
}

// ── Main Order Section ────────────────────────────────────────
function OrderSection({ onAddToCart, showCountdown, setShowCountdown }) {
  const [quantities, setQuantities] = useState({})
  const [activeCategory, setActiveCategory] = useState('All')
  const [showCustomCake, setShowCustomCake] = useState(false)
  const [moqErrors, setMoqErrors] = useState({})
  const [cartAdded, setCartAdded] = useState(false)

  const filtered = PRODUCTS.filter(p =>
    activeCategory === 'All' ? true : p.category === activeCategory
  )

  const setQty = (id, value) => {
    const product = PRODUCTS.find(p => p.id === id)
    const num = Math.max(0, parseInt(value) || 0)
    setQuantities(prev => ({ ...prev, [id]: num }))
    if (num === 0 || num >= product.moq) {
      setMoqErrors(prev => ({ ...prev, [id]: false }))
    }
  }

  const increment = (id) => setQty(id, (quantities[id] || 0) + 1)

  const decrement = (id) => {
    const product = PRODUCTS.find(p => p.id === id)
    const current = quantities[id] || 0
    if (current === 0) return
    if (current - 1 > 0 && current - 1 < product.moq) {
      setMoqErrors(prev => ({ ...prev, [id]: true }))
      setQty(id, 0)
      return
    }
    setQty(id, current - 1)
  }

  const orderItems = PRODUCTS.filter(p => (quantities[p.id] || 0) > 0 && p.price > 0)
  const subtotal = orderItems.reduce((sum, p) => sum + p.price * (quantities[p.id] || 0), 0)
  const totalPieces = orderItems.reduce((sum, p) => sum + (quantities[p.id] || 0), 0)

  // ── Add to cart — syncs with navbar, no popup ─────────────
  const handleAddToCart = () => {
    if (orderItems.length === 0) return
    const cartData = orderItems.map(p => ({ ...p, qty: quantities[p.id] }))
    onAddToCart(cartData)
    setCartAdded(true)
    setTimeout(() => setCartAdded(false), 2000)
  }

  // ── WhatsApp order — sets flag then opens WhatsApp ────────
  const orderViaWhatsApp = () => {
    if (orderItems.length === 0) return
    const lines = orderItems.map(p =>
      `• ${p.name} × ${quantities[p.id]} = ${fmt(p.price * quantities[p.id])}`
    ).join('\n')
    const msg =
      `Hello SweetHUB! 🍰 I'd like to place an order:\n\n${lines}\n\n` +
      `*Total: ${fmt(subtotal)}*\n\n` +
      `Please confirm my order. Thank you! 😊`

    // Set flag BEFORE opening WhatsApp so it's saved when they return
    sessionStorage.setItem('sweethub_ordered', 'true')
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const handleCustomCake = (form) => {
    const msg =
      `Hello SweetHUB! 🎂 I'd like to request a custom cake:\n\n` +
      `Size/Layers: ${form.size}\nOccasion: ${form.occasion}\n` +
      `${form.date ? `Event Date: ${form.date}\n` : ''}` +
      `${form.notes ? `Special Requests: ${form.notes}\n` : ''}\n` +
      `Please send me a quote. Thank you!`
    sessionStorage.setItem('sweethub_ordered', 'true')
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <>
      <section className="order-section" id="order" aria-label="Place your order">

        <div className="order-header">
          <p className="order-eyebrow">Fresh & Made to Order</p>
          <h2 className="order-heading">Build Your <em>Perfect Order</em></h2>
          <p className="order-sub">
            Add quantities below and watch your total update live.
            Minimum 5 pieces for items ₦200 and below.
          </p>
        </div>

        <div className="order-body">

          {/* LEFT — product list */}
          <div className="order-left">
            <div className="order-tabs">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`order-tab ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >{cat}</button>
              ))}
            </div>

            <div className="order-table">
              <div className="order-table-head">
                <span>Item</span>
                <span>Price</span>
                <span>Qty</span>
                <span>Amount</span>
              </div>

              {filtered.map(product => {
                const qty = quantities[product.id] || 0
                const amount = product.price * qty
                const hasError = moqErrors[product.id]
                const isCustom = product.unit === 'custom'

                return (
                  <div key={product.id} className={`order-row ${qty > 0 ? 'active-row' : ''}`}>
                    <div className="order-item-name">
                      <span>{product.name}</span>
                      {product.moq > 1 && <span className="moq-badge">min {product.moq}</span>}
                      {hasError && <span className="moq-error">min {product.moq} required</span>}
                    </div>

                    <div className="order-item-price">
                      {isCustom
                        ? <span className="custom-price-tag">Custom</span>
                        : `${fmt(product.price)}/${product.unit}`
                      }
                    </div>

                    <div className="order-qty-wrap">
                      {isCustom ? (
                        <button className="custom-request-btn" onClick={() => setShowCustomCake(true)}>
                          Request Quote
                        </button>
                      ) : (
                        <div className="order-qty">
                          <button className="qty-btn" onClick={() => decrement(product.id)} disabled={qty === 0} aria-label="Decrease">−</button>
                          <input
                            type="number"
                            className="qty-input"
                            value={qty === 0 ? '' : qty}
                            min={0}
                            placeholder="0"
                            onChange={e => setQty(product.id, e.target.value)}
                          />
                          <button className="qty-btn" onClick={() => increment(product.id)} aria-label="Increase">+</button>
                        </div>
                      )}
                    </div>

                    <div className="order-item-total">
                      {isCustom ? '—' : amount > 0
                        ? <span className="amount-active">{fmt(amount)}</span>
                        : <span className="amount-zero">₦0</span>
                      }
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="order-notice">
              <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
                <path d="M480-280q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
              </svg>
              <p><strong>Notice Period:</strong> Please allow <strong>1hr 30min</strong> for fresh preparation. Custom orders may require additional time.</p>
            </div>
          </div>

          {/* RIGHT — live summary */}
          <div className="order-right">
            <div className="order-summary">
              <div className="summary-header">
                <h3>Order Summary</h3>
                {totalPieces > 0 && (
                  <span className="summary-count">{totalPieces} piece{totalPieces !== 1 ? 's' : ''}</span>
                )}
              </div>

              <div className="summary-items">
                {orderItems.length === 0 ? (
                  <div className="summary-empty">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" aria-hidden="true" focusable="false">
                        <path d="M223.5-103.5Q200-127 200-160t23.5-56.5Q247-240 280-240t56.5 23.5Q360-193 360-160t-23.5 56.5Q313-80 280-80t-56.5-23.5Zm400 0Q600-127 600-160t23.5-56.5Q647-240 680-240t56.5 23.5Q760-193 760-160t-23.5 56.5Q713-80 680-80t-56.5-23.5ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/>
                        </svg>
                    </span>
                    <p>No items added yet.<br />Select quantities on the left.</p>
                  </div>
                ) : (
                  orderItems.map(p => (
                    <div key={p.id} className="summary-item">
                      <div className="si-name">
                        <span>{p.name}</span>
                        <span className="si-qty">×{quantities[p.id]}</span>
                      </div>
                      <span className="si-amount">{fmt(p.price * quantities[p.id])}</span>
                    </div>
                  ))
                )}
              </div>

              {orderItems.length > 0 && (
                <div className="summary-totals">
                  <div className="summary-divider" />
                  <div className="summary-line summary-total">
                    <span>Total</span>
                    <span>{fmt(subtotal)}</span>
                  </div>
                </div>
              )}

              <div className="summary-btns">
                <button
                  className={`summary-btn-wa ${orderItems.length === 0 ? 'disabled' : ''}`}
                  onClick={orderViaWhatsApp}
                  disabled={orderItems.length === 0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Order via WhatsApp
                </button>

                <button
                  className={`summary-btn-cart ${orderItems.length === 0 ? 'disabled' : ''} ${cartAdded ? 'cart-added' : ''}`}
                  onClick={handleAddToCart}
                  disabled={orderItems.length === 0}
                >
                  {cartAdded ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
                      </svg>
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                        <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/>
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>
              </div>

              <p className="summary-moq-note">
                💡 Minimum 5 pieces for items ₦200 and below
              </p>
            </div>
          </div>

        </div>
      </section>

      {showCountdown && (
        <CountdownTimer onClose={() => setShowCountdown(false)} />
      )}

      {showCustomCake && (
        <CustomCakeModal
          onClose={() => setShowCustomCake(false)}
          onSubmit={handleCustomCake}
        />
      )}
    </>
  )
}

export default OrderSection