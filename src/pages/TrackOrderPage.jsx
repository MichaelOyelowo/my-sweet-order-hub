import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

const fmt = (n) => '₦' + n.toLocaleString()

// ── Order status config ───────────────────────────────────────
const STATUSES = [
  {
    key:   'Pending',
    label: 'Order Received',
    icon:  '📋',
    desc:  'Your order has been received and is waiting for confirmation.',
    color: '#f39c12',
  },
  {
    key:   'Confirmed',
    label: 'Order Confirmed',
    icon:  '✅',
    desc:  'We have confirmed your order and payment. Getting ready to bake!',
    color: '#2196f3',
  },
  {
    key:   'Preparing',
    label: 'Being Prepared',
    icon:  '👨‍🍳',
    desc:  'Joy is in the kitchen right now making your order fresh.',
    color: '#c0392b',
  },
  {
    key:   'Ready',
    label: 'Ready for Pickup',
    icon:  '📦',
    desc:  'Your order is packed and ready. Delivery is on the way!',
    color: '#8e44ad',
  },
  {
    key:   'Delivered',
    label: 'Delivered',
    icon:  '🛵',
    desc:  'Your order has been delivered. Enjoy your snacks! 🎉',
    color: '#27ae60',
  },
]

const CANCELLED = {
  key:   'Cancelled',
  label: 'Order Cancelled',
  icon:  '❌',
  desc:  'This order has been cancelled. Please contact us on WhatsApp.',
  color: '#e74c3c',
}

function getStatusIndex(status) {
  return STATUSES.findIndex(s => s.key === status)
}

// ── Countdown Timer (only shows during Preparing) ─────────────
function PrepCountdown({ createdAt }) {
  const TOTAL = 90 * 60
  const [seconds, setSeconds] = useState(() => {
    const elapsed = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000)
    return Math.max(0, TOTAL - elapsed)
  })

  useEffect(() => {
    if (seconds <= 0) return
    const t = setInterval(() => setSeconds(p => Math.max(0, p - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  const mins     = Math.floor(seconds / 60)
  const secs     = seconds % 60
  const progress = ((TOTAL - seconds) / TOTAL) * 100
  const color    = seconds > 60 * 60 ? '#27ae60' : seconds > 30 * 60 ? '#e67e22' : '#c0392b'
  const done     = seconds <= 0

  return (
    <div className="track-countdown">
      <p className="track-countdown-label">
        {done ? '🎉 Should be ready any moment!' : 'Estimated time remaining'}
      </p>
      {!done && (
        <>
          <div className="track-countdown-digits" style={{ color }}>
            {String(mins).padStart(2, '0')}
            <span className="track-countdown-colon">:</span>
            {String(secs).padStart(2, '0')}
          </div>
          <div className="track-countdown-bar-wrap">
            <div
              className="track-countdown-bar-fill"
              style={{ width: `${progress}%`, background: color }}
            />
          </div>
        </>
      )}
    </div>
  )
}

// ── Verify Form ───────────────────────────────────────────────
function VerifyForm({ prefillRef, onFound }) {
  const [ref, setRef]       = useState(prefillRef || '')
  const [phone, setPhone]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  // Auto-search if ref is prefilled from URL
  useEffect(() => {
    if (prefillRef) {
      setRef(prefillRef.toUpperCase())
    }
  }, [prefillRef])

  const handleSearch = async () => {
    const cleanRef   = ref.trim().toUpperCase()
    const cleanPhone = phone.trim().replace(/\s/g, '')

    if (!cleanRef || !cleanPhone) {
      setError('Please enter both your order reference and phone number.')
      return
    }

    if (!cleanRef.startsWith('SH-')) {
      setError('Order reference should start with SH- (e.g. SH-0012)')
      return
    }

    setLoading(true)
    setError('')

    const { data, error: dbError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_ref', cleanRef)
      .single()

    setLoading(false)

    if (dbError || !data) {
      setError('Order not found. Please check your reference number.')
      return
    }

    // Verify phone number matches — strip leading 0 and country code for comparison
    const normalize = (p) => p.replace(/^(\+234|234|0)/, '').replace(/\s/g, '')
    if (normalize(data.phone) !== normalize(cleanPhone)) {
      setError('Phone number does not match this order. Please try again.')
      return
    }

    onFound(data)
  }

  return (
    <div className="track-verify-wrap">
      <div className="track-verify-card">

        <div className="track-verify-icon">📦</div>
        <h2 className="track-verify-title">Track Your Order</h2>
        <p className="track-verify-sub">
          Enter your order reference and the phone number you used
          when placing your order.
        </p>

        <div className="track-verify-form">
          <div className="co-field">
            <label>Order Reference *</label>
            <input
              value={ref}
              onChange={e => setRef(e.target.value.toUpperCase())}
              placeholder="e.g. SH-0012"
              style={{ fontFamily: 'monospace', letterSpacing: '0.08em', fontWeight: 700 }}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="co-field">
            <label>Phone Number *</label>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="e.g. 08012345678"
              type="tel"
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>

        {error && <p className="checkout-error">{error}</p>}

        <button
          className="checkout-submit-btn"
          onClick={handleSearch}
          disabled={loading}
          style={{ background: 'var(--accent)' }}
        >
          {loading ? <span className="checkout-spinner" /> : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
              </svg>
              Track My Order
            </>
          )}
        </button>

        <p className="co-note">
          Your order reference was sent to you via WhatsApp when you placed your order.
        </p>
      </div>
    </div>
  )
}

// ── Order Tracking Display ────────────────────────────────────
function OrderTracker({ order, onReset }) {
  const [currentOrder, setCurrentOrder] = useState(order)
  const intervalRef = useRef(null)

  const isCancelled = currentOrder.status === 'Cancelled'
  const statusConfig = isCancelled ? CANCELLED : (STATUSES.find(s => s.key === currentOrder.status) || STATUSES[0])
  const statusIdx    = getStatusIndex(currentOrder.status)

  // Poll Supabase every 30 seconds for live updates
  useEffect(() => {
    const refresh = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('id', currentOrder.id)
        .single()
      if (data) setCurrentOrder(data)
    }

    intervalRef.current = setInterval(refresh, 30000)

    // Also subscribe real-time
    const channel = supabase
      .channel(`order-${currentOrder.id}`)
      .on('postgres_changes', {
        event:  'UPDATE',
        schema: 'public',
        table:  'orders',
        filter: `id=eq.${currentOrder.id}`,
      }, payload => {
        setCurrentOrder(payload.new)
      })
      .subscribe()

    return () => {
      clearInterval(intervalRef.current)
      supabase.removeChannel(channel)
    }
  }, [currentOrder.id])

  return (
    <div className="track-result">

      {/* ── Header ── */}
      <div className="track-result-header">
        <div className="track-result-header-left">
          <div className="track-ref-badge">{currentOrder.order_ref}</div>
          <div>
            <h2 className="track-result-title">
              {statusConfig.icon} {statusConfig.label}
            </h2>
            <p className="track-result-desc">{statusConfig.desc}</p>
          </div>
        </div>
        <button className="track-new-search" onClick={onReset}>
          Track another order
        </button>
      </div>

      {/* ── Live indicator ── */}
      <div className="track-live-row">
        <span className="track-live-dot" />
        <span className="track-live-label">Live updates • refreshes every 30 seconds</span>
      </div>

      {/* ── Progress steps ── */}
      {!isCancelled && (
        <div className="track-steps">
          {STATUSES.map((s, i) => {
            const isDone    = i <= statusIdx
            const isCurrent = i === statusIdx
            const isLast    = i === STATUSES.length - 1
            return (
              <div key={s.key} className="track-step-wrap">
                <div className={`track-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                  <div
                    className="track-step-dot"
                    style={isDone ? { background: s.color, borderColor: s.color, boxShadow: `0 0 0 4px ${s.color}20` } : {}}
                  >
                    {isDone ? (
                      isCurrent ? (
                        <span className="track-step-icon">{s.icon}</span>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="white">
                          <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
                        </svg>
                      )
                    ) : null}
                  </div>
                  <div className="track-step-info">
                    <p className="track-step-label" style={isDone ? { color: s.color } : {}}>
                      {s.label}
                    </p>
                  </div>
                </div>
                {!isLast && (
                  <div
                    className="track-step-line"
                    style={i < statusIdx ? { background: STATUSES[i + 1]?.color || 'var(--accent)' } : {}}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Countdown (only during Preparing) ── */}
      {currentOrder.status === 'Preparing' && (
        <PrepCountdown createdAt={currentOrder.created_at} />
      )}

      {/* ── Order details grid ── */}
      <div className="track-details-grid">

        {/* Items */}
        <div className="track-detail-card">
          <h3 className="track-detail-title">
            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
              <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/>
            </svg>
            Your Order
          </h3>
          <div className="track-items-list">
            {currentOrder.items?.map((item, i) => (
              <div key={i} className="track-item-row">
                <span className="track-item-name">{item.name} <span className="track-item-qty">×{item.qty}</span></span>
                <span className="track-item-price">{fmt(item.total)}</span>
              </div>
            ))}
            <div className="track-item-total-row">
              <span>Total</span>
              <span>{fmt(currentOrder.total)}</span>
            </div>
          </div>
        </div>

        {/* Delivery info */}
        <div className="track-detail-card">
          <h3 className="track-detail-title">
            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
              <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-560q0-109-69.5-184.5T480-820q-101 0-170.5 75.5T240-560q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-560q0-150 96.5-245T480-900q127 0 223.5 95T800-560q0 112-79.5 229.5T480-80Zm0-480Z"/>
            </svg>
            Delivery Details
          </h3>
          <div className="track-delivery-info">
            <div className="track-delivery-row">
              <span className="tdr-label">Name</span>
              <span className="tdr-value">{currentOrder.customer_name}</span>
            </div>
            <div className="track-delivery-row">
              <span className="tdr-label">Phone</span>
              <span className="tdr-value">{currentOrder.phone}</span>
            </div>
            <div className="track-delivery-row">
              <span className="tdr-label">Address</span>
              <span className="tdr-value">{currentOrder.address}</span>
            </div>
            {currentOrder.notes && (
              <div className="track-delivery-row">
                <span className="tdr-label">Notes</span>
                <span className="tdr-value">{currentOrder.notes}</span>
              </div>
            )}
            <div className="track-delivery-row">
              <span className="tdr-label">Placed</span>
              <span className="tdr-value">
                {new Date(currentOrder.created_at).toLocaleString('en-NG', {
                  dateStyle: 'medium', timeStyle: 'short'
                })}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ── WhatsApp support button ── */}
      <div className="track-support">
        <p className="track-support-text">
          Have a question about your order?
        </p>
        <a
          className="track-wa-btn"
          href={`https://wa.me/2349029702549?text=${encodeURIComponent(
            `Hello SweetHUB! I have a question about my order *${currentOrder.order_ref}*. Can you help me please? 😊`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Chat with us on WhatsApp
        </a>
      </div>

    </div>
  )
}

// ── Main Track Order Page ─────────────────────────────────────
function TrackOrderPage() {
  const navigate               = useNavigate()
  const [searchParams]         = useSearchParams()
  const [foundOrder, setFoundOrder] = useState(null)
  const prefillRef             = searchParams.get('ref') || ''

  return (
    <div className="track-page">

      {/* ── Page Header ── */}
      <div className="track-page-header">
        <div className="track-page-header-inner">
          <button className="track-back-btn" onClick={() => navigate('/')}>
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
              <path d="M360-240 120-480l240-240 56 56-144 144h568v80H272l144 144-56 56Z"/>
            </svg>
            Back to SweetHUB
          </button>
          <p className="order-eyebrow">Order Tracking</p>
          <h1 className="track-page-title">
            Where's My <em>Order?</em>
          </h1>
          <p className="track-page-sub">
            Real-time updates straight from our kitchen to your screen.
          </p>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="track-page-body">
        {!foundOrder ? (
          <VerifyForm
            prefillRef={prefillRef}
            onFound={setFoundOrder}
          />
        ) : (
          <OrderTracker
            order={foundOrder}
            onReset={() => setFoundOrder(null)}
          />
        )}
      </div>

    </div>
  )
}

export default TrackOrderPage