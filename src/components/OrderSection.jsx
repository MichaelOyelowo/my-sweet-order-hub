import { useState, useEffect, useRef } from 'react'

const PRODUCTS = [
  { id: 1,  name: 'Puff Puff',            emoji: '🟠', price: 100,  unit: 'piece',  moq: 5, category: 'Snacks' },
  { id: 2,  name: 'Chin-Chin',            emoji: '🟡', price: 100,  unit: 'sachet', moq: 5, category: 'Snacks' },
  { id: 3,  name: 'Banana Bread',         emoji: '🍞', price: 200,  unit: 'piece',  moq: 3, category: 'Snacks' },
  { id: 4,  name: 'Fish Roll',            emoji: '🐟', price: 200,  unit: 'piece',  moq: 3, category: 'Snacks' },
  { id: 5,  name: 'Sausage Roll',         emoji: '🌭', price: 200,  unit: 'piece',  moq: 3, category: 'Snacks' },
  { id: 6,  name: 'Spring Roll & Samosa', emoji: '🥢', price: 200,  unit: 'piece',  moq: 3, category: 'Snacks' },
  { id: 7,  name: 'Frank Roll',           emoji: '🌯', price: 200,  unit: 'piece',  moq: 3, category: 'Snacks' },
  { id: 8,  name: 'Buns',                 emoji: '🍡', price: 200,  unit: 'piece',  moq: 3, category: 'Snacks' },
  { id: 9,  name: 'Doughnut',             emoji: '🍩', price: 300,  unit: 'piece',  moq: 2, category: 'Snacks' },
  { id: 10, name: 'Egg Roll',             emoji: '🥚', price: 500,  unit: 'piece',  moq: 1, category: 'Pies'   },
  { id: 11, name: 'Meat Pie',             emoji: '🥧', price: 500,  unit: 'piece',  moq: 1, category: 'Pies'   },
  { id: 12, name: 'Chicken Pie',          emoji: '🍗', price: 500,  unit: 'piece',  moq: 1, category: 'Pies'   },
  { id: 13, name: 'Small Cupcake',        emoji: '🧁', price: 300,  unit: 'piece',  moq: 2, category: 'Cakes'  },
  { id: 14, name: 'Medium Cupcake',       emoji: '🎂', price: 500,  unit: 'piece',  moq: 1, category: 'Cakes'  },
  { id: 15, name: 'Cake Parfait',         emoji: '🍰', price: 1500, unit: 'piece',  moq: 1, category: 'Cakes'  },
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
    ready_soon: { emoji: '🎉', title: 'Almost ready!',                  msg: 'Your order will be ready in about 30 minutes. Get excited! 🛵',                        color: '#e67e22' },
    ready:      { emoji: '✅', title: 'Your order is ready!',           msg: 'Your SweetHUB order is on its way to you right now. Enjoy! 🎊',                        color: '#27ae60' },
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


// ── Cart Drawer ───────────────────────────────────────────────
function CartDrawer({ isOpen, onClose, cartItems, onRemove, onWhatsApp }) {
  const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0)
  const totalPieces = cartItems.reduce((sum, i) => sum + i.qty, 0)

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Your cart">

        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title-wrap">
            <h2 className="cart-drawer-title">Your Cart</h2>
            {cartItems.length > 0 && (
              <span className="cart-drawer-count">{totalPieces} piece{totalPieces !== 1 ? 's' : ''}</span>
            )}
          </div>
          <button className="cart-drawer-close" onClick={onClose} aria-label="Close cart">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="cart-drawer-items">
          {cartItems.length === 0 ? (
            <div className="cart-drawer-empty">
              <span className="cart-drawer-empty-icon">
                <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="currentColor">
                  <path d="M223.5-103.5Q200-127 200-160t23.5-56.5Q247-240 280-240t56.5 23.5Q360-193 360-160t-23.5 56.5Q313-80 280-80t-56.5-23.5Zm400 0Q600-127 600-160t23.5-56.5Q647-240 680-240t56.5 23.5Q760-193 760-160t-23.5 56.5Q713-80 680-80t-56.5-23.5ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/>
                </svg>
              </span>
              <p>Your cart is empty</p>
              <span>Add items from the menu to get started</span>
              <button className="cart-drawer-shop-btn" onClick={onClose}>Continue Shopping</button>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-drawer-item">
                <div className="cdi-emoji">{item.emoji}</div>
                <div className="cdi-info">
                  <p className="cdi-name">{item.name}</p>
                  <p className="cdi-meta">{item.qty} × {fmt(item.price)}</p>
                </div>
                <div className="cdi-right">
                  <span className="cdi-total">{fmt(item.qty * item.price)}</span>
                  <button
                    className="cdi-remove"
                    onClick={() => onRemove(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
                      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-drawer-notice">
              <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
                <path d="M480-280q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
              </svg>
              <span>Allow <strong>1hr 30min</strong> for fresh preparation</span>
            </div>

            <div className="cart-drawer-total-row">
              <span className="cart-drawer-total-label">Total</span>
              <span className="cart-drawer-total-amount">{fmt(total)}</span>
            </div>

            <button className="cart-drawer-checkout-btn" onClick={onWhatsApp}>
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Proceed to Checkout via WhatsApp
            </button>

            <button className="cart-drawer-continue-btn" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}


// ── Main Order Section ────────────────────────────────────────
function OrderSection({ onAddToCart, showCountdown, setShowCountdown }) {
  const [quantities, setQuantities]         = useState({})
  const [activeCategory, setActiveCategory] = useState('All')
  const [moqErrors, setMoqErrors]           = useState({})
  const [cartItems, setCartItems]           = useState([])
  const [cartOpen, setCartOpen]             = useState(false)
  const [addedId, setAddedId]               = useState(null)

  const filtered = PRODUCTS.filter(p =>
    activeCategory === 'All' ? true : p.category === activeCategory
  )

  // ── Qty helpers ─────────────────────────────────────────────
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

  // ── Add single card item to cart ────────────────────────────
  const handleAddCard = (product) => {
    const qty = quantities[product.id] || 0
    if (qty === 0 || qty < product.moq) {
      setMoqErrors(prev => ({ ...prev, [product.id]: true }))
      return
    }

    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty } : i)
      }
      return [...prev, { ...product, qty }]
    })

    // Update parent cart count (for navbar badge)
    const updated = (() => {
      const existing = cartItems.find(i => i.id === product.id)
      if (existing) return cartItems.map(i => i.id === product.id ? { ...i, qty } : i)
      return [...cartItems, { ...product, qty }]
    })()
    onAddToCart(updated)

    // Flash "Added" on this card
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1800)

    // Open cart drawer
    setCartOpen(true)
  }

  // ── Remove from cart ────────────────────────────────────────
  const handleRemove = (id) => {
    const updated = cartItems.filter(i => i.id !== id)
    setCartItems(updated)
    onAddToCart(updated)
  }

  // ── WhatsApp checkout ────────────────────────────────────────
  const handleWhatsApp = () => {
    if (cartItems.length === 0) return
    const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0)
    const lines = cartItems.map(i =>
      `• ${i.name} × ${i.qty} = ${fmt(i.price * i.qty)}`
    ).join('\n')
    const msg =
      `Hello SweetHUB! 🍰 I'd like to place an order:\n\n${lines}\n\n` +
      `*Total: ${fmt(total)}*\n\nPlease confirm my order. Thank you! 😊`
    sessionStorage.setItem('sweethub_ordered', 'true')
    setCartOpen(false)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0)
  const cartPieces = cartItems.reduce((sum, i) => sum + i.qty, 0)

  return (
    <>
      <section className="order-section" id="order" aria-label="Place your order">

        {/* ── Header ── */}
        <div className="order-header">
          <p className="order-eyebrow">Fresh & Made to Order</p>
          <h2 className="order-heading">Build Your <em>Perfect Order</em></h2>
          <p className="order-sub">
            Set your quantity on each item, then add to cart.
            Minimum quantities apply per item to keep things fresh.
          </p>
        </div>

        {/* ── Category Tabs ── */}
        <div className="order-tabs-wrap">
          <div className="order-tabs">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`order-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >{cat}</button>
            ))}
          </div>

          {/* Floating cart pill */}
          {cartItems.length > 0 && (
            <button className="cart-pill" onClick={() => setCartOpen(true)} aria-label="Open cart">
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/>
              </svg>
              <span>{cartPieces} piece{cartPieces !== 1 ? 's' : ''}</span>
              <span className="cart-pill-total">{fmt(cartTotal)}</span>
            </button>
          )}
        </div>

        {/* ── Product Cards Grid ── */}
        <div className="product-cards-grid">
          {filtered.map(product => {
            const qty      = quantities[product.id] || 0
            const amount   = product.price * qty
            const hasError = moqErrors[product.id]
            const isAdded  = addedId === product.id
            const inCart   = cartItems.some(i => i.id === product.id)

            return (
              <div key={product.id} className={`product-card ${inCart ? 'in-cart' : ''}`}>

                {/* Card top — emoji + name + price */}
                <div className="pc-top">
                  <div className="pc-emoji">{product.emoji}</div>
                  <div className="pc-info">
                    <p className="pc-name">{product.name}</p>
                    <p className="pc-price">{fmt(product.price)}<span className="pc-unit">/{product.unit}</span></p>
                  </div>
                  {inCart && (
                    <span className="pc-in-cart-badge">In cart</span>
                  )}
                </div>

                {/* MOQ hint */}
                {product.moq > 1 && (
                  <p className="pc-moq">Minimum {product.moq} pieces per order</p>
                )}

                {/* Qty row — stepper + line total */}
                <div className="pc-qty-row">
                  <div className="order-qty">
                    <button
                      className="qty-btn"
                      onClick={() => decrement(product.id)}
                      disabled={qty === 0}
                      aria-label={`Decrease ${product.name}`}
                    >−</button>
                    <input
                      type="number"
                      className="qty-input"
                      value={qty === 0 ? '' : qty}
                      min={0}
                      placeholder="0"
                      onChange={e => setQty(product.id, e.target.value)}
                      aria-label={`${product.name} quantity`}
                    />
                    <button
                      className="qty-btn"
                      onClick={() => increment(product.id)}
                      aria-label={`Increase ${product.name}`}
                    >+</button>
                  </div>
                  <span className={`pc-amount ${amount > 0 ? 'active' : ''}`}>
                    {amount > 0 ? fmt(amount) : '₦0'}
                  </span>
                </div>

                {/* MOQ error */}
                {hasError && (
                  <p className="pc-moq-error" role="alert">⚠️ Minimum {product.moq} pieces required</p>
                )}

                {/* Add to cart button */}
                <button
                  className={`pc-add-btn ${isAdded ? 'added' : ''}`}
                  onClick={() => handleAddCard(product)}
                  aria-label={`Add ${product.name} to cart`}
                >
                  {isAdded ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
                        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
                      </svg>
                      Added!
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
                        <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>

              </div>
            )
          })}
        </div>

        {/* Notice */}
        <div className="order-notice">
          <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
            <path d="M480-280q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
          </svg>
          <p><strong>Notice Period:</strong> Please allow <strong>1hr 30min</strong> for fresh preparation.</p>
        </div>

      </section>


      {/* ══════════════════════════════
          CUSTOM ORDER SECTION
          ══════════════════════════════ */}
      <CustomOrderSection />


      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onRemove={handleRemove}
        onWhatsApp={handleWhatsApp}
      />

      {/* Countdown — shows only when user returns from WhatsApp */}
      {showCountdown && (
        <CountdownTimer onClose={() => setShowCountdown(false)} />
      )}
    </>
  )
}


// ══════════════════════════════
// CUSTOM ORDER SECTION
// ══════════════════════════════
function CustomOrderSection() {
  const [form, setForm] = useState({
    name: '', phone: '', item: '', quantity: '', occasion: '',
    date: '', flavour: '', design: '', notes: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.item) return

    const msg =
      `Hello SweetHUB! 🎨 I have a custom order request:\n\n` +
      `👤 Name: ${form.name}\n` +
      `📞 Phone: ${form.phone}\n` +
      `🍰 Item: ${form.item}\n` +
      `${form.quantity   ? `📦 Quantity: ${form.quantity}\n`      : ''}` +
      `${form.occasion   ? `🎉 Occasion: ${form.occasion}\n`      : ''}` +
      `${form.date       ? `📅 Event Date: ${form.date}\n`        : ''}` +
      `${form.flavour    ? `😋 Flavour: ${form.flavour}\n`        : ''}` +
      `${form.design     ? `🎨 Design/Theme: ${form.design}\n`    : ''}` +
      `${form.notes      ? `📝 Extra Notes: ${form.notes}\n`      : ''}` +
      `\nPlease send me a quote. Thank you! 😊`

    sessionStorage.setItem('sweethub_ordered', 'true')
    window.open(`https://wa.me/2349029702549?text=${encodeURIComponent(msg)}`, '_blank')
    setSubmitted(true)
  }

  const resetForm = () => {
    setForm({ name: '', phone: '', item: '', quantity: '', occasion: '', date: '', flavour: '', design: '', notes: '' })
    setSubmitted(false)
  }

  return (
    <section className="custom-order-section" id="custom-order" aria-label="Custom order">

      <div className="custom-order-inner">

        {/* Left — info */}
        <div className="custom-order-left">
          <p className="order-eyebrow">Can't find what you need?</p>
          <h2 className="custom-order-heading">
            We Do <em>Custom Orders</em> Too 🎨
          </h2>
          <p className="custom-order-desc">
            Whether it's a birthday cake with your face on it, a bulk
            snack order for your event, or something completely unique —
            just tell us what you want and we'll make it happen.
          </p>

          <div className="custom-order-perks">
            <div className="co-perk">
              <span className="co-perk-icon">🎂</span>
              <div>
                <p className="co-perk-title">Custom Cakes</p>
                <p className="co-perk-sub">Any design, any flavour, any occasion</p>
              </div>
            </div>
            <div className="co-perk">
              <span className="co-perk-icon">📦</span>
              <div>
                <p className="co-perk-title">Bulk Orders</p>
                <p className="co-perk-sub">Events, parties, corporate gifting</p>
              </div>
            </div>
            <div className="co-perk">
              <span className="co-perk-icon">⚡</span>
              <div>
                <p className="co-perk-title">Fast Quote</p>
                <p className="co-perk-sub">We respond within the hour</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div className="custom-order-right">
          {submitted ? (
            <div className="custom-order-success">
              <div className="cos-emoji">🎉</div>
              <h3>Request Sent!</h3>
              <p>We've received your custom order request via WhatsApp. Our team will send you a quote within the hour.</p>
              <button className="cos-reset-btn" onClick={resetForm}>Submit Another Request</button>
            </div>
          ) : (
            <div className="custom-order-form">
              <h3 className="custom-form-title">Tell Us What You Want</h3>

              <div className="co-form-grid">
                <div className="co-field">
                  <label>Your Name *</label>
                  <input name="name" value={form.name} onChange={handle} placeholder="e.g. Amaka Johnson" />
                </div>
                <div className="co-field">
                  <label>Phone Number *</label>
                  <input name="phone" value={form.phone} onChange={handle} placeholder="e.g. 08012345678" type="tel" />
                </div>
                <div className="co-field co-field-full">
                  <label>What would you like? *</label>
                  <input name="item" value={form.item} onChange={handle} placeholder="e.g. Custom birthday cake, bulk puff puff for 200 people..." />
                </div>
                <div className="co-field">
                  <label>Quantity</label>
                  <input name="quantity" value={form.quantity} onChange={handle} placeholder="e.g. 100 pieces, 3-tier cake" />
                </div>
                <div className="co-field">
                  <label>Occasion</label>
                  <input name="occasion" value={form.occasion} onChange={handle} placeholder="e.g. Birthday, Wedding, Corporate" />
                </div>
                <div className="co-field">
                  <label>Event Date</label>
                  <input name="date" type="date" value={form.date} onChange={handle} />
                </div>
                <div className="co-field">
                  <label>Preferred Flavour</label>
                  <input name="flavour" value={form.flavour} onChange={handle} placeholder="e.g. Chocolate, Vanilla, Red Velvet" />
                </div>
                <div className="co-field co-field-full">
                  <label>Design / Theme</label>
                  <input name="design" value={form.design} onChange={handle} placeholder="e.g. Floral, cartoon characters, minimalist..." />
                </div>
                <div className="co-field co-field-full">
                  <label>Extra Notes</label>
                  <textarea name="notes" value={form.notes} onChange={handle} placeholder="Any dietary requirements, allergies, colour preferences, or special instructions..." rows={3} />
                </div>
              </div>

              <button
                className="co-submit-btn"
                onClick={handleSubmit}
                disabled={!form.name || !form.phone || !form.item}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Send Custom Request via WhatsApp
              </button>

              <p className="co-note">* Required fields. We'll reply within 1 hour with a quote.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  )
}

export default OrderSection