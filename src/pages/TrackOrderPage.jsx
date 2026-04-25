import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

const fmt = (n) => '₦' + n.toLocaleString()

// ── Premium SVG Icons ─────────────────────────────────────────
const Icons = {
  Receipt: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
  Check: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
  Flame: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>,
  Package: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>,
  Truck: () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>,
  Cancel: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
}

// ── Order status config ───────────────────────────────────────
const STATUSES =[
  { key: 'Pending',   label: 'Order Received',   icon: <Icons.Receipt />, desc: 'Your order has been received and is waiting for confirmation.' },
  { key: 'Confirmed', label: 'Order Confirmed',  icon: <Icons.Check />,   desc: 'We have confirmed your order and payment. Getting ready to bake!' },
  { key: 'Preparing', label: 'Being Prepared',   icon: <Icons.Flame />,   desc: 'Joy is in the kitchen right now making your order fresh.' },
  { key: 'Ready',     label: 'Ready for Pickup', icon: <Icons.Package />, desc: 'Your order is packed and ready. Delivery is on the way!' },
  { key: 'Delivered', label: 'Delivered',        icon: <Icons.Truck />,   desc: 'Your order has been delivered. Enjoy your snacks! 🎉' },
]

const CANCELLED = { key: 'Cancelled', label: 'Order Cancelled', icon: <Icons.Cancel />, desc: 'This order has been cancelled. Please contact us on WhatsApp.' }

function getStatusIndex(status) {
  return STATUSES.findIndex(s => s.key === status)
}

// ── Countdown Timer ─────────────
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
  },[])

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const progress = ((TOTAL - seconds) / TOTAL) * 100
  const done = seconds <= 0

  return (
    <div className="track-countdown">
      <p className="track-countdown-label">
        {done ? '🎉 Should be ready any moment!' : 'Estimated time remaining'}
      </p>
      {!done && (
        <>
          <div className="track-countdown-digits">
            {String(mins).padStart(2, '0')}
            <span className="track-countdown-colon">:</span>
            {String(secs).padStart(2, '0')}
          </div>
          <div className="track-countdown-bar-wrap">
            <div className="track-countdown-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </>
      )}
    </div>
  )
}

// ── Verify Form ───────────────────────────────────────────────
function VerifyForm({ prefillRef, onFound }) {
  const [ref, setRef] = useState(prefillRef || '')
  const[phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { if (prefillRef) setRef(prefillRef.toUpperCase()) }, [prefillRef])

  const handleSearch = async () => {
    const cleanRef = ref.trim().toUpperCase()
    const cleanPhone = phone.trim().replace(/\s/g, '')

    if (!cleanRef || !cleanPhone) return setError('Please enter both your order reference and phone number.')
    if (!cleanRef.startsWith('SH-')) return setError('Order reference should start with SH- (e.g. SH-0012)')

    setLoading(true)
    setError('')

    const { data, error: dbError } = await supabase.from('orders').select('*').eq('order_ref', cleanRef).single()
    setLoading(false)

    if (dbError || !data) return setError('Order not found. Please check your reference number.')

    const normalize = (p) => p.replace(/^(\+234|234|0)/, '').replace(/\s/g, '')
    if (normalize(data.phone) !== normalize(cleanPhone)) return setError('Phone number does not match this order.')

    onFound(data)
  }

  return (
    <div className="track-verify-wrap">
      <div className="track-verify-card">
        <div className="track-verify-icon"><Icons.Package /></div>
        <h2 className="track-verify-title">Track Your Order</h2>
        <p className="track-verify-sub">Enter your order reference and the phone number you used when placing your order.</p>

        <div className="track-verify-form">
          <div className="co-field">
            <label>Order Reference *</label>
            <input
              value={ref}
              onChange={e => setRef(e.target.value.toUpperCase())}
              placeholder="e.g. SH-0012"
              className="track-input-mono"
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

        {error && <p className="track-error-msg">{error}</p>}

        <button className="track-btn-primary" onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Track My Order'}
        </button>
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
  const statusIdx = getStatusIndex(currentOrder.status)

  useEffect(() => {
    const refresh = async () => {
      const { data } = await supabase.from('orders').select('*').eq('id', currentOrder.id).single()
      if (data) setCurrentOrder(data)
    }
    intervalRef.current = setInterval(refresh, 30000)

    const channel = supabase.channel(`order-${currentOrder.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${currentOrder.id}` }, 
      payload => setCurrentOrder(payload.new)).subscribe()

    return () => { clearInterval(intervalRef.current); supabase.removeChannel(channel) }
  },[currentOrder.id])

  return (
    <div className="track-result">
      {/* ── Main Tracker Card ── */}
      <div className="track-card status-card">
        <div className="track-status-header">
          <div className="track-status-left">
            <span className="track-ref-badge">{currentOrder.order_ref}</span>
            <h2 className="track-status-title">{statusConfig.label}</h2>
            <p className="track-status-desc">{statusConfig.desc}</p>
          </div>
          <button className="track-btn-secondary" onClick={onReset}>Track another order</button>
        </div>

        <div className="track-live-indicator">
          <span className="track-live-dot" /> Live updates • Refreshes every 30s
        </div>

        {/* ── Flawless Responsive Progress Bar ── */}
        {!isCancelled && (
          <div className="track-progress-container">
            {STATUSES.map((s, i) => {
              const isDone = i <= statusIdx
              const isCurrent = i === statusIdx
              const isLast = i === STATUSES.length - 1

              return (
                <div key={s.key} className="track-node-wrap">
                  
                  {/* The Icon & Label */}
                  <div className={`track-node ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                    <div className="track-node-icon">
                      {isDone && !isCurrent ? <Icons.Check /> : s.icon}
                    </div>
                    <p className="track-node-label">{s.label}</p>
                  </div>

                  {/* The Line connecting to the next node (Hidden on the last step) */}
                  {!isLast && (
                    <div 
                      className="track-line" 
                      style={{ background: i < statusIdx ? '#f68b1e' : '#eee' }}
                    />
                  )}

                </div>
              )
            })}
          </div>
        )}
      </div>

      {currentOrder.status === 'Preparing' && <PrepCountdown createdAt={currentOrder.created_at} />}

      {/* ── Order Details Grid ── */}
      <div className="track-details-grid">
        <div className="track-card">
          <h3 className="track-card-title">Order Summary</h3>
          <div className="track-items-list">
            {currentOrder.items?.map((item, i) => (
              <div key={i} className="track-item-row">
                <span className="track-item-name">{item.name} <span className="track-item-qty">x{item.qty}</span></span>
                <span className="track-item-price">{fmt(item.total)}</span>
              </div>
            ))}
            <div className="track-item-total">
              <span>Total</span>
              <span>{fmt(currentOrder.total)}</span>
            </div>
          </div>
        </div>

        <div className="track-card">
          <h3 className="track-card-title">Delivery Details</h3>
          <div className="track-delivery-list">
            <div className="track-delivery-row"><span className="tdl-label">Name</span><span className="tdl-value">{currentOrder.customer_name}</span></div>
            <div className="track-delivery-row"><span className="tdl-label">Phone</span><span className="tdl-value">{currentOrder.phone}</span></div>
            <div className="track-delivery-row"><span className="tdl-label">Address</span><span className="tdl-value">{currentOrder.address}</span></div>
            {currentOrder.notes && <div className="track-delivery-row"><span className="tdl-label">Notes</span><span className="tdl-value">{currentOrder.notes}</span></div>}
          </div>
        </div>
      </div>

      <div className="track-support-box">
        <p>Need help with your order?</p>
        <a className="track-wa-btn" href={`https://wa.me/2349029702549?text=${encodeURIComponent(`Hello SweetHUB! I have a question about my order *${currentOrder.order_ref}*.`)}`} target="_blank" rel="noopener noreferrer">
          Chat with Support
        </a>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────
export default function TrackOrderPage() {
  const navigate = useNavigate()
  const[searchParams] = useSearchParams()
  const [foundOrder, setFoundOrder] = useState(null)
  const prefillRef = searchParams.get('ref') || ''

  return (
    <div className="track-page">
      <div className="track-page-header">
        <div className="track-page-header-inner">
          <button className="track-back-btn" onClick={() => navigate('/')}>
             ← Back to SweetHUB
          </button>
          <h1 className="track-page-title">Track Your Order</h1>
        </div>
      </div>

      <div className="track-page-body">
        {!foundOrder ? (
          <VerifyForm prefillRef={prefillRef} onFound={setFoundOrder} />
        ) : (
          <OrderTracker order={foundOrder} onReset={() => setFoundOrder(null)} />
        )}
      </div>
    </div>
  )
}