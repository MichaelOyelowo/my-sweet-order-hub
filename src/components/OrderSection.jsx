import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

// ── Images ────────────────────────────────────────────────────
import imgPuffPuff    from '../assets/homepage/puff-puff-pepper.webp'
import imgPuffPuff1 from '../assets/homepage/puff-puff1.webp'
import imgPuffPuff2 from '../assets/homepage/puff-puff.webp'
import imgChinChin    from '../assets/homepage/crumpy-chin-chin.webp'
import imgChinChin1    from '../assets/chin-chin/chin1.webp'
import imgChinChin2    from '../assets/chin-chin/chin2.webp'
import imgBananaBread from '../assets/homepage/sliced-peanut-butter-banana-bread.webp'
import imgBananaBread1 from '../assets/banana-breads/banana-bread1.webp'
import imgBananaBread2 from '../assets/banana-breads/banana-bread5.webp'
import imgFishRoll1    from '../assets/fish-roll/fish-roll1.webp'
import imgFishRoll2    from '../assets/fish-roll/fish-roll4.webp'
import imgFishRoll3    from '../assets/fish-roll/fish-roll5.webp'
import imgSausageRoll1 from '../assets/sausage/sausage5.webp'
import imgSausageRoll2 from '../assets/sausage/sausage4.webp'
import imgSausageRoll3 from '../assets/sausage/sausage2.webp'
import imgSamosa1  from '../assets/samosa/samosa1.webp'
import imgSamosa2  from '../assets/samosa/samosa4.webp'
import imgSamosa3  from '../assets/samosa/samosa5.webp'
import imgSpringRoll1 from '../assets/spring-rolls/spring-roll1.webp'
import imgSpringRoll2 from '../assets/spring-rolls/spring-roll2.webp'
import imgSpringRoll3 from '../assets/spring-rolls/spring-roll3.webp'
import imgFrankRoll1   from '../assets/frank-rolls/frank-roll.webp'
import imgFrankRoll2   from '../assets/frank-rolls/frank-roll1.webp'
import imgFrankRoll3   from '../assets/frank-rolls/frank-roll2.webp'
import imgBuns1  from '../assets/buns/buns1.webp'
import imgBuns2  from '../assets/buns/buns2.webp'
import imgBuns3  from '../assets/buns/buns3.webp'
import imgDoughnut1    from '../assets/doughnuts/doughnut2.webp'
import imgDoughnut2    from '../assets/doughnuts/doughnut5.webp'
import imgDoughnut3    from '../assets/doughnuts/doughnut6.webp'
import imgEggRoll1    from '../assets/homepage/eggroll.webp'
import imgEggRoll2    from '../assets/homepage/egg-roll1.webp'
import imgEggRoll3    from '../assets/homepage/egg-roll2.webp'
import imgMeatPie1    from '../assets/homepage/meat-pie.webp'
import imgMeatPie2     from '../assets/homepage/meat-pie1.webp'
import imgMeatPie3     from '../assets/homepage/meat-pie2.webp'
import imgChickenPie1  from '../assets/homepage/chicken-pie1.webp'
import imgChickenPie2  from '../assets/homepage/chicken-pie2.webp'
import imgChickenPie3  from '../assets/homepage/chicken-pie3.webp'
import imgSmallCake1   from '../assets/cakes/cupcake1.webp'
import imgSmallCake2  from '../assets/cakes/cupcake2.webp'
import imgSmallCake3   from '../assets/cakes/cupcake3.webp'
import imgMediumCake1  from '../assets/homepage/cupcake.webp'
import imgMediumCake2   from '../assets/cakes/cupcake4.webp'
import imgMediumCake3   from '../assets/cakes/cupcake5.webp'

import imgParfait1 from '../assets/cakes/cakeparfait.webp'
import imgParfait2 from  '../assets/cakes/cake-parfait1.webp'
import imgParfait3 from '../assets/cakes/cake-parfait2.webp'



// ══════════════════════════════════════════════════════════════
// PRODUCTS — each item has an `images` array.
//   images: [imgPuffPuff, imgPuffPuff2, imgPuffPuff3]
// The hover cycle will pick them up automatically — no other
// code changes needed.
// ══════════════════════════════════════════════════════════════
const PRODUCTS = [
  {
    id: 1, name: 'Puff Puff', category: 'Snacks',
    price: 100, unit: 'piece', moq: 5, pairWith: [2, 9],
    images: [
      imgPuffPuff,
      imgPuffPuff1,
      imgPuffPuff2,
    ],
  },
  {
    id: 2, name: 'Chin-Chin', category: 'Snacks',
    price: 100, unit: 'sachet', moq: 5, pairWith: [1, 8],
    images: [
      imgChinChin,
      imgChinChin1,
      imgChinChin2,
    ],
  },
  {
    id: 3, name: 'Banana Bread', category: 'Snacks',
    price: 200, unit: 'piece', moq: 3, pairWith: [13, 14],
    images: [
      imgBananaBread,
      imgBananaBread1,
      imgBananaBread2,
    ],
  },
  {
    id: 4, name: 'Fish Roll', category: 'Snacks',
    price: 200, unit: 'piece', moq: 3, pairWith: [5, 7],
    images: [
      imgFishRoll1,
      imgFishRoll2,
      imgFishRoll3,
    ],
  },
  {
    id: 5, name: 'Sausage Roll', category: 'Snacks',
    price: 200, unit: 'piece', moq: 3, pairWith: [4, 6],
    images: [
      imgSausageRoll1,
      imgSausageRoll2,
      imgSausageRoll3,
    ],
  },
  {
    id: 6, name: 'Samosa', category: 'Snacks',
    price: 200, unit: 'piece', moq: 3, pairWith: [5, 10],
    images: [
      imgSamosa1,
      imgSamosa2,
      imgSamosa3,
    ],
  },
  {
    id: 7, name: 'Spring Roll', category: 'Snacks',
    price: 200, unit: 'piece', moq: 3, pairWith: [5, 10],
    images: [
      imgSpringRoll1,
      imgSpringRoll2,
      imgSpringRoll3,
    ],
  },
  {
    id: 8, name: 'Frank Roll', category: 'Snacks',
    price: 200, unit: 'piece', moq: 3, pairWith: [4, 11],
    images: [
      imgFrankRoll1,
      imgFrankRoll2,
      imgFrankRoll3,
    ],
  },
  {
    id: 9, name: 'Buns', category: 'Snacks',
    price: 200, unit: 'piece', moq: 3, pairWith: [2, 9],
    images: [
      imgBuns1,
      imgBuns2,
      imgBuns3,
    ],
  },
  {
    id: 10, name: 'Doughnut', category: 'Snacks',
    price: 300, unit: 'piece', moq: 2, pairWith: [13, 15],
    images: [
      imgDoughnut3,
      imgDoughnut2,
      imgDoughnut1,
    ],
  },
  {
    id: 11, name: 'Egg Roll', category: 'Pies',
    price: 500, unit: 'piece', moq: 1, pairWith: [11, 12],
    images: [
      imgEggRoll1,
      imgEggRoll2,
      imgEggRoll3,
    ],
  },
  {
    id: 12, name: 'Meat Pie', category: 'Pies',
    price: 500, unit: 'piece', moq: 1, pairWith: [10, 12],
    images: [
      imgMeatPie1,
      imgMeatPie2,
      imgMeatPie3,
    ],
  },
  {
    id: 13, name: 'Chicken Pie', category: 'Pies',
    price: 500, unit: 'piece', moq: 1, pairWith: [10, 11],
    images: [
      imgChickenPie1,
      imgChickenPie2,
      imgChickenPie3,
    ],
  },
  {
    id: 14, name: 'Small Cupcake', category: 'Cakes',
    price: 300, unit: 'piece', moq: 2, pairWith: [14, 15],
    images: [
      imgSmallCake1,
      imgSmallCake2,
      imgSmallCake3,
    ],
  },
  {
    id: 15, name: 'Medium Cupcake', category: 'Cakes',
    price: 500, unit: 'piece', moq: 1, pairWith: [13, 15],
    images: [
      imgMediumCake1,
      imgMediumCake2,
      imgMediumCake3,
    ],
  },
  {
    id: 16, name: 'Cake Parfait', category: 'Cakes',
    price: 1500, unit: 'piece', moq: 1, pairWith: [13, 14],
    images: [
      imgParfait1,
      imgParfait2,
      imgParfait3,
    ],
  },
]

const CATEGORIES     = ['All', 'Snacks', 'Pies', 'Cakes']
const WHATSAPP_NUMBER = '2349029702549'
const STORAGE_KEY    = 'sweethub_cart'
const fmt = (n) => '₦' + n.toLocaleString()

const UPSELL_MSGS = [
  (name, pair) => `🔥 People who love ${name} also grab some ${pair}!`,
  (name, pair) => `😍 ${name} + ${pair} = the perfect combo. Just saying! 👀`,
  (name, pair) => `✨ Don't forget ${pair} — it pairs amazingly with your ${name}!`,
  (name, pair) => `🎉 Your ${name} is in! Psst... ${pair} would make this order even better 😄`,
]

const loadCart = () => {
  try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : [] }
  catch { return [] }
}
const saveCart = (items) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch {}
}


// ══════════════════════════════════════════════════════════════
// PRODUCT IMAGE CYCLER
// Shows the first image by default.
// On hover: cycles through the images array every 700ms.
// On mouse leave: snaps back to the first image.
// The dot indicators at the bottom show which image is active.
// ══════════════════════════════════════════════════════════════
function ProductImageCycler({ images, alt, inCart }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef(null)
  const hasMultiple = images.length > 1

  const startCycling = () => {
    if (!hasMultiple) return
    setIsHovered(true)
    // Start from next image immediately on hover
    setActiveIdx(1 % images.length)
    intervalRef.current = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % images.length)
    }, 700)
  }

  const stopCycling = () => {
    setIsHovered(false)
    clearInterval(intervalRef.current)
    // Snap back to first image
    setActiveIdx(0)
  }

  // Cleanup on unmount
  useEffect(() => () => clearInterval(intervalRef.current), [])

  return (
    <div
      className="pc-img-wrap"
      onMouseEnter={startCycling}
      onMouseLeave={stopCycling}
      // Touch support — tap to cycle on mobile
      onTouchStart={() => {
        if (!hasMultiple) return
        setActiveIdx(prev => (prev + 1) % images.length)
      }}
    >
      {/* All images stacked — only active one is visible */}
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={i === 0 ? alt : `${alt} view ${i + 1}`}
          className={`pc-img pc-img-slide ${i === activeIdx ? 'pc-img-active' : ''}`}
          loading={i === 0 ? 'eager' : 'lazy'}
        />
      ))}

      {/* In cart badge */}
      {inCart && <span className="pc-in-cart-badge">✓ In Cart</span>}

      {/* MOQ badge — shown via parent, not here */}

      {/* Image dot indicators — only show if multiple images */}
      {hasMultiple && (
        <div className="pc-img-dots" aria-hidden="true">
          {images.map((_, i) => (
            <span
              key={i}
              className={`pc-img-dot ${i === activeIdx ? 'active' : ''}`}
            />
          ))}
        </div>
      )}

      {/* Hover hint — only shows on first hover before cycling starts */}
      {hasMultiple && !isHovered && (
        <div className="pc-img-hint" aria-hidden="true">
          <span>Hover to see more</span>
        </div>
      )}
    </div>
  )
}


// ── Upsell Toast ──────────────────────────────────────────────
function UpsellToast({ product, pairProduct, onDismiss, onAddPair }) {
  const msgFn = UPSELL_MSGS[Math.floor(Math.random() * UPSELL_MSGS.length)]
  const msg   = msgFn(product.name, pairProduct.name)

  useEffect(() => {
    const t = setTimeout(onDismiss, 6000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="upsell-toast" role="alert" aria-live="polite">
      <div className="upsell-toast-img">
        <img src={pairProduct.images[0]} alt={pairProduct.name} />
      </div>
      <div className="upsell-toast-body">
        <p className="upsell-toast-msg">{msg}</p>
        <button className="upsell-toast-add" onClick={onAddPair}>
          Add {pairProduct.name} →
        </button>
      </div>
      <button className="upsell-toast-close" onClick={onDismiss} aria-label="Dismiss">×</button>
    </div>
  )
}


// ── Checkout Modal ────────────────────────────────────────────
function CheckoutModal({ cartItems, onClose, onSuccess }) {
  const [form, setForm]       = useState({ name: '', phone: '', email: '', address: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const total  = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0)
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const sendEmail = async (orderRef) => {
    const itemRows = cartItems.map(i => `
      <tr>
        <td style="padding:10px 14px;border-bottom:1px solid #faf4ef;font-size:14px;color:#1a1a1a;">${i.name}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #faf4ef;font-size:14px;color:#888;text-align:center;">×${i.qty}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #faf4ef;font-size:14px;color:#c0392b;font-weight:700;text-align:right;">₦${(i.price * i.qty).toLocaleString()}</td>
      </tr>
    `).join('')

    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f8f4f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f4f0;padding:40px 16px;">
    <tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
      <tr><td align="center" style="padding-bottom:24px;">
        <h1 style="margin:0;font-size:32px;font-weight:800;color:#c0392b;">SweetHUB</h1>
        <p style="margin:4px 0 0;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.1em;">Fresh & Made to Order</p>
      </td></tr>
      <tr><td style="background:white;border-radius:20px;overflow:hidden;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="background:#c0392b;padding:28px 32px;text-align:center;">
            <div style="font-size:40px;margin-bottom:10px;">🎉</div>
            <h2 style="margin:0 0 6px;font-size:22px;font-weight:800;color:white;">Order Confirmed!</h2>
            <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.85);">We've received your order and we're getting started</p>
          </td></tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:24px 32px 0;text-align:center;">
            <span style="display:inline-block;background:rgba(192,57,43,0.08);color:#c0392b;font-size:13px;font-weight:700;padding:6px 18px;border-radius:20px;">Order ${orderRef}</span>
          </td></tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:20px 32px 8px;">
            <p style="margin:0;font-size:15px;color:#1a1a1a;line-height:1.6;">
              Hi <strong>${form.name}</strong> 👋,<br/>
              Thank you for your order! We'll send you a WhatsApp message shortly with payment details.
            </p>
          </td></tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0 0;">
          <tr><td style="padding:0 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #faf4ef;border-radius:12px;overflow:hidden;">
              <thead><tr style="background:#faf3ee;">
                <th style="padding:10px 14px;font-size:11px;font-weight:700;text-transform:uppercase;color:#888;text-align:left;">Item</th>
                <th style="padding:10px 14px;font-size:11px;font-weight:700;text-transform:uppercase;color:#888;text-align:center;">Qty</th>
                <th style="padding:10px 14px;font-size:11px;font-weight:700;text-transform:uppercase;color:#888;text-align:right;">Amount</th>
              </tr></thead>
              <tbody>${itemRows}</tbody>
              <tfoot><tr style="background:#fff8f3;">
                <td colspan="2" style="padding:14px;font-size:15px;font-weight:700;color:#1a1a1a;">Total</td>
                <td style="padding:14px;font-size:18px;font-weight:800;color:#c0392b;text-align:right;">₦${total.toLocaleString()}</td>
              </tr></tfoot>
            </table>
          </td></tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:20px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f4;border-radius:12px;">
              <tr><td style="padding:16px;">
                <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;color:#888;">Delivery Address</p>
                <p style="margin:0;font-size:14px;color:#1a1a1a;">📍 ${form.address}</p>
                ${form.notes ? `<p style="margin:8px 0 0;font-size:13px;color:#888;">📝 ${form.notes}</p>` : ''}
              </td></tr>
            </table>
          </td></tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:0 32px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8f0;border:1px solid #f0e6dc;border-radius:12px;">
              <tr><td style="padding:14px 16px;font-size:13px;color:#888;line-height:1.6;">
                ⏱️ <strong style="color:#1a1a1a;">Preparation time:</strong>
                Please allow <strong style="color:#c0392b;">1 hour 30 minutes</strong> for fresh preparation.
              </td></tr>
            </table>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:24px 0 0;text-align:center;">
        <p style="margin:0 0 4px;font-size:13px;color:#888;">Questions? WhatsApp us at
          <a href="https://wa.me/2349029702549" style="color:#c0392b;text-decoration:none;font-weight:600;">+234 902 970 2549</a>
        </p>
        <p style="margin:0;font-size:11px;color:#bbb;">© ${new Date().getFullYear()} SweetHUB · Fresh & Made to Order</p>
      </td></tr>
    </table></td></tr>
  </table>
</body></html>`

    try {
      await fetch('https://sweethub-emails.michaelkingreat.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from:    'SweetHUB <onboarding@resend.dev>',
          to:      [form.email],
          subject: `Order ${orderRef} Confirmed 🎉 – SweetHUB`,
          html,
        }),
      })
    } catch (err) {
      console.warn('Email send failed (non-critical):', err)
    }
  }

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.address.trim()) {
      setError('Please fill in all required fields.')
      return
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    setError('')

    const items = cartItems.map(i => ({
      id: i.id, name: i.name, qty: i.qty, price: i.price, total: i.price * i.qty,
    }))

    const { data, error: dbError } = await supabase
      .from('orders')
      .insert([{
        customer_name: form.name.trim(),
        phone:         form.phone.trim(),
        email:         form.email.trim(),
        address:       form.address.trim(),
        notes:         form.notes.trim() || null,
        items, total, status: 'Pending',
      }])
      .select()
      .single()

    if (dbError) {
      console.error('Supabase error:', dbError)
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    const orderRef = data.order_ref
    sendEmail(orderRef)

    const lines = cartItems
      .map(i => `• ${i.name} × ${i.qty} = ₦${(i.price * i.qty).toLocaleString()}`)
      .join('\n')

    const msg =
      `Hello SweetHUB! 🍰 I just placed an order:\n\n` +
      `🔖 Order Ref: *${orderRef}*\n\n${lines}\n\n` +
      `*Total: ₦${total.toLocaleString()}*\n\n` +
      `👤 Name: ${form.name}\n📞 Phone: ${form.phone}\n📍 Address: ${form.address}\n` +
      `${form.notes ? `📝 Notes: ${form.notes}\n` : ''}` +
      `\nPlease confirm my order. Thank you! 😊`

    setLoading(false)
    sessionStorage.setItem('sweethub_ordered', 'true')
    sessionStorage.setItem('sweethub_order_ref', orderRef)
    onSuccess(orderRef)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="countdown-overlay" role="dialog" aria-modal="true" aria-label="Complete your order">
      <div className="checkout-modal">
        <button className="countdown-close" onClick={onClose} aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor">
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
          </svg>
        </button>
        <div className="checkout-modal-header">
          <div className="checkout-modal-icon">🛒</div>
          <h3 className="checkout-modal-title">Almost there!</h3>
          <p className="checkout-modal-sub">Fill in your details — we'll send a confirmation email and message you on WhatsApp with payment info.</p>
        </div>
        <div className="checkout-summary">
          {cartItems.map(i => (
            <div key={i.id} className="checkout-summary-row">
              <span>{i.name} × {i.qty}</span>
              <span>₦{(i.price * i.qty).toLocaleString()}</span>
            </div>
          ))}
          <div className="checkout-summary-total">
            <span>Total</span><span>₦{total.toLocaleString()}</span>
          </div>
        </div>
        <div className="checkout-form">
          {[
            { name:'name',    label:'Your Name *',       type:'text',  placeholder:'e.g. Amaka Johnson'           },
            { name:'phone',   label:'Phone Number *',    type:'tel',   placeholder:'e.g. 08012345678'             },
            { name:'email',   label:'Email Address *',   type:'email', placeholder:'e.g. amaka@gmail.com'         },
            { name:'address', label:'Delivery Address *',type:'text',  placeholder:'e.g. 12 Musa Street, Ile-Ife' },
            { name:'notes',   label:'Extra Notes (optional)',type:'text',placeholder:'e.g. Call when you arrive'  },
          ].map(f => (
            <div key={f.name} className="co-field">
              <label>{f.label}</label>
              <input
                name={f.name} type={f.type} value={form[f.name]}
                onChange={handle} placeholder={f.placeholder}
                autoFocus={f.name === 'name'}
              />
            </div>
          ))}
        </div>
        {error && <p className="checkout-error">{error}</p>}
        <button className="checkout-submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? <span className="checkout-spinner" /> : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Confirm & Order via WhatsApp
            </>
          )}
        </button>
        <p className="co-note">A confirmation email will be sent automatically to your inbox.</p>
      </div>
    </div>
  )
}


// ── Cart Drawer ───────────────────────────────────────────────
function CartDrawer({ isOpen, onClose, cartItems, onRemove, onCheckout }) {
  const total       = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0)
  const totalPieces = cartItems.reduce((sum, i) => sum + i.qty, 0)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      <div className={`cart-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose} aria-hidden="true" />
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Your cart">
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
        <div className="cart-drawer-items">
          {cartItems.length === 0 ? (
            <div className="cart-drawer-empty">
              <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="currentColor">
                <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/>
              </svg>
              <p>Your cart is empty</p>
              <span>Add items from the menu above</span>
              <button className="cart-drawer-shop-btn" onClick={onClose}>Browse Menu</button>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-drawer-item">
                <div className="cdi-img">
                  <img src={item.images[0]} alt={item.name} />
                </div>
                <div className="cdi-info">
                  <p className="cdi-name">{item.name}</p>
                  <p className="cdi-meta">{item.qty} × {fmt(item.price)}</p>
                </div>
                <div className="cdi-right">
                  <span className="cdi-total">{fmt(item.qty * item.price)}</span>
                  <button className="cdi-remove" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.name}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
                      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
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
            <button className="cart-drawer-checkout-btn" onClick={onCheckout}>
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Proceed to Order
            </button>
            <button className="cart-drawer-continue-btn" onClick={onClose}>Continue Shopping</button>
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
  const [cartItems, setCartItems]           = useState(loadCart)
  const [cartOpen, setCartOpen]             = useState(false)
  const [checkoutOpen, setCheckoutOpen]     = useState(false)
  const [addedId, setAddedId]               = useState(null)
  const [upsell, setUpsell]                 = useState(null)
  const [orderRef, setOrderRef]             = useState(null)
  const upsellShownRef                      = useRef(new Set())

  useEffect(() => {
    saveCart(cartItems)
    onAddToCart(cartItems)
  }, [cartItems])

  useEffect(() => {
    const handler = () => setCartOpen(true)
    window.addEventListener('sweethub:openCart', handler)
    return () => window.removeEventListener('sweethub:openCart', handler)
  }, [])

  const filtered = PRODUCTS.filter(p =>
    activeCategory === 'All' ? true : p.category === activeCategory
  )

  const setQty = (id, value) => {
    const product = PRODUCTS.find(p => p.id === id)
    const num     = Math.max(0, parseInt(value) || 0)
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

  const handleAddCard = (product) => {
    const qty = quantities[product.id] || 0
    if (qty === 0 || qty < product.moq) {
      setMoqErrors(prev => ({ ...prev, [product.id]: true }))
      return
    }
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty } : i)
      return [...prev, { ...product, qty }]
    })
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1800)

    if (!upsellShownRef.current.has(product.id)) {
      upsellShownRef.current.add(product.id)
      const pairId = product.pairWith?.find(pid =>
        !cartItems.some(i => i.id === pid) && pid !== product.id
      )
      if (pairId) {
        const pairProduct = PRODUCTS.find(p => p.id === pairId)
        if (pairProduct) setTimeout(() => setUpsell({ product, pairProduct }), 400)
      }
    }
    setCartOpen(true)
  }

  const handleUpsellAdd = () => {
    if (!upsell) return
    const p = upsell.pairProduct
    setQuantities(prev => ({ ...prev, [p.id]: p.moq }))
    setCartItems(prev => {
      if (prev.find(i => i.id === p.id)) return prev
      return [...prev, { ...p, qty: p.moq }]
    })
    setUpsell(null)
  }

  const handleRemove = (id) => setCartItems(prev => prev.filter(i => i.id !== id))

  const handleOrderSuccess = (ref) => {
    setOrderRef(ref)
    setCheckoutOpen(false)
    setCartOpen(false)
    setCartItems([])
    localStorage.removeItem(STORAGE_KEY)
  }

  const cartTotal  = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0)
  const cartPieces = cartItems.reduce((sum, i) => sum + i.qty, 0)

  return (
    <>
      <section className="order-section" id="order" aria-label="Place your order">
        <div className="order-header">
          <p className="order-eyebrow">Fresh & Made to Order</p>
          <h2 className="order-heading">Build Your <em>Perfect Order</em></h2>
          <p className="order-sub">
            Set your quantity, add to cart, and order via WhatsApp.
            Hover over any item to see more photos. Minimum quantities apply per item.
          </p>
        </div>

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
          {cartItems.length > 0 && (
            <button className="cart-pill" onClick={() => setCartOpen(true)} aria-label="Open cart">
              <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
                <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/>
              </svg>
              <span>{cartPieces} piece{cartPieces !== 1 ? 's' : ''}</span>
              <span className="cart-pill-total">{fmt(cartTotal)}</span>
            </button>
          )}
        </div>

        <div className="product-cards-grid">
          {filtered.map(product => {
            const qty      = quantities[product.id] || 0
            const amount   = product.price * qty
            const hasError = moqErrors[product.id]
            const isAdded  = addedId === product.id
            const inCart   = cartItems.some(i => i.id === product.id)

            return (
              <div key={product.id} className={`product-card ${inCart ? 'in-cart' : ''}`}>

                {/* ── Image cycler replaces old pc-img-wrap ── */}
                <ProductImageCycler
                  images={product.images}
                  alt={product.name}
                  inCart={inCart}
                />

                {/* MOQ badge — outside cycler so it doesn't conflict */}
                {product.moq > 1 && (
                  <span className="pc-moq-badge pc-moq-badge-outside">min {product.moq}</span>
                )}

                <div className="pc-body">
                  <div className="pc-top-row">
                    <p className="pc-name">{product.name}</p>
                    <p className="pc-price">{fmt(product.price)}<span className="pc-unit">/{product.unit}</span></p>
                  </div>
                  <div className="pc-qty-row">
                    <div className="order-qty">
                      <button className="qty-btn" onClick={() => decrement(product.id)} disabled={qty === 0} aria-label="Decrease">−</button>
                      <input
                        type="number" className="qty-input"
                        value={qty === 0 ? '' : qty} min={0} placeholder="0"
                        onChange={e => setQty(product.id, e.target.value)}
                      />
                      <button className="qty-btn" onClick={() => increment(product.id)} aria-label="Increase">+</button>
                    </div>
                    <span className={`pc-amount ${amount > 0 ? 'active' : ''}`}>
                      {amount > 0 ? fmt(amount) : '₦—'}
                    </span>
                  </div>
                  {hasError && (
                    <p className="pc-moq-error" role="alert">⚠️ Min {product.moq} pieces required</p>
                  )}
                  <button className={`pc-add-btn ${isAdded ? 'added' : ''}`} onClick={() => handleAddCard(product)}>
                    {isAdded ? (
                      <><svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg> Added!</>
                    ) : (
                      <><svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg> Add to Cart</>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="order-notice">
          <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
            <path d="M480-280q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
          </svg>
          <p><strong>Notice Period:</strong> Please allow <strong>1hr 30min</strong> for fresh preparation.</p>
        </div>
      </section>

      <CustomOrderSection />

      {upsell && (
        <UpsellToast
          product={upsell.product}
          pairProduct={upsell.pairProduct}
          onDismiss={() => setUpsell(null)}
          onAddPair={handleUpsellAdd}
        />
      )}

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onRemove={handleRemove}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true) }}
      />

      {checkoutOpen && (
        <CheckoutModal
          cartItems={cartItems}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={handleOrderSuccess}
        />
      )}
    </>
  )
}


// ── Custom Order Section ──────────────────────────────────────
function CustomOrderSection() {
  const [form, setForm]           = useState({ name:'',phone:'',item:'',quantity:'',occasion:'',date:'',flavour:'',design:'',notes:'' })
  const [submitted, setSubmitted] = useState(false)
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.item) return
    const msg =
      `Hello SweetHUB! 🎨 Custom order request:\n\n` +
      `👤 Name: ${form.name}\n📞 Phone: ${form.phone}\n🍰 Item: ${form.item}\n` +
      `${form.quantity ? `📦 Qty: ${form.quantity}\n` : ''}` +
      `${form.occasion ? `🎉 Occasion: ${form.occasion}\n` : ''}` +
      `${form.date     ? `📅 Date: ${form.date}\n` : ''}` +
      `${form.flavour  ? `😋 Flavour: ${form.flavour}\n` : ''}` +
      `${form.design   ? `🎨 Design: ${form.design}\n` : ''}` +
      `${form.notes    ? `📝 Notes: ${form.notes}\n` : ''}` +
      `\nPlease send a quote. Thank you! 😊`
    const customRef = 'CR-' + Date.now().toString().slice(-6)
    sessionStorage.setItem('sweethub_ordered', 'true')
    sessionStorage.setItem('sweethub_order_ref', customRef)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
    setSubmitted(true)
  }

  return (
    <section className="custom-order-section" id="custom-order" aria-label="Custom order">
      <div className="custom-order-inner">
        <div className="custom-order-left">
          <p className="order-eyebrow">Can't find what you need?</p>
          <h2 className="custom-order-heading">We Do <em>Custom Orders</em> Too 🎨</h2>
          <p className="custom-order-desc">
            Birthday cake with your face on it? Bulk snacks for your event?
            Something completely unique? Just tell us — we'll make it happen.
          </p>
          <div className="custom-order-perks">
            {[
              { icon: '🎂', title: 'Custom Cakes', sub: 'Any design, any flavour, any occasion' },
              { icon: '📦', title: 'Bulk Orders',  sub: 'Events, parties, corporate gifting'   },
              { icon: '⚡', title: 'Fast Quote',   sub: 'We respond within the hour'           },
            ].map(p => (
              <div key={p.title} className="co-perk">
                <span className="co-perk-icon">{p.icon}</span>
                <div>
                  <p className="co-perk-title">{p.title}</p>
                  <p className="co-perk-sub">{p.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="custom-order-right">
          {submitted ? (
            <div className="custom-order-success">
              <div className="cos-emoji">🎉</div>
              <h3>Request Sent!</h3>
              <p>We'll send you a quote via WhatsApp within the hour.</p>
              <button className="cos-reset-btn" onClick={() => { setSubmitted(false); setForm({ name:'',phone:'',item:'',quantity:'',occasion:'',date:'',flavour:'',design:'',notes:'' }) }}>
                Submit Another Request
              </button>
            </div>
          ) : (
            <div className="custom-order-form">
              <h3 className="custom-form-title">Tell Us What You Want</h3>
              <div className="co-form-grid">
                {[
                  { name:'name',     label:'Your Name *',          placeholder:'e.g. Amaka Johnson',                    full:false, type:'text' },
                  { name:'phone',    label:'Phone Number *',        placeholder:'e.g. 08012345678',                      full:false, type:'tel'  },
                  { name:'item',     label:'What would you like? *',placeholder:'e.g. Birthday cake, bulk puff puff...', full:true,  type:'text' },
                  { name:'quantity', label:'Quantity',              placeholder:'e.g. 100 pieces, 3-tier cake',          full:false, type:'text' },
                  { name:'occasion', label:'Occasion',              placeholder:'e.g. Birthday, Wedding, Corporate',     full:false, type:'text' },
                  { name:'date',     label:'Event Date',            placeholder:'',                                      full:false, type:'date' },
                  { name:'flavour',  label:'Preferred Flavour',     placeholder:'e.g. Chocolate, Vanilla, Red Velvet',   full:false, type:'text' },
                  { name:'design',   label:'Design / Theme',        placeholder:'e.g. Floral, cartoon, minimalist...',   full:true,  type:'text' },
                ].map(f => (
                  <div key={f.name} className={`co-field ${f.full ? 'co-field-full' : ''}`}>
                    <label>{f.label}</label>
                    <input name={f.name} type={f.type} value={form[f.name]} onChange={handle} placeholder={f.placeholder} />
                  </div>
                ))}
                <div className="co-field co-field-full">
                  <label>Extra Notes</label>
                  <textarea name="notes" value={form.notes} onChange={handle} placeholder="Dietary requirements, allergies, colour preferences..." rows={3} />
                </div>
              </div>
              <button className="co-submit-btn" onClick={handleSubmit} disabled={!form.name || !form.phone || !form.item}>
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Send Custom Request via WhatsApp
              </button>
              <p className="co-note">* Required. We'll reply within 1 hour with a quote.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default OrderSection