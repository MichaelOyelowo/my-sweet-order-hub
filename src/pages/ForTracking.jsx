import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

const fmt = (n) => '₦' + Number(n || 0).toLocaleString()

// ── Origin (your kitchen) ─────────────────────────────────────
const ORIGIN = {
  name: "Mama's Kitchen",
  address: 'AP, Ile-Ife, Osun State, Nigeria',
  phone: '+234 902 970 2549',
}

// ── Order status config ───────────────────────────────────────
const STATUSES = [
  { key: 'pending',    label: 'Order Placed',  icon: '📝', etaMin: 90 },
  { key: 'confirmed',  label: 'Confirmed',     icon: '✅', etaMin: 80 },
  { key: 'preparing',  label: 'Preparing',     icon: '👨‍🍳', etaMin: 60 },
  { key: 'ready',      label: 'Ready',         icon: '🍱', etaMin: 30 },
  { key: 'on_the_way', label: 'On the Way',    icon: '🛵', etaMin: 15 },
  { key: 'delivered',  label: 'Delivered',     icon: '🎉', etaMin: 0  },
]

// ── Rate-limit helpers ────────────────────────────────────────
const RL_KEY = 'track_rl'
const RL_MAX = 5
const RL_WINDOW = 10 * 60 * 1000 // 10 min

function checkRateLimit() {
  try {
    const raw = sessionStorage.getItem(RL_KEY)
    const arr = raw ? JSON.parse(raw) : []
    const now = Date.now()
    const recent = arr.filter((t) => now - t < RL_WINDOW)
    if (recent.length >= RL_MAX) {
      const oldest = Math.min(...recent)
      const waitMs = RL_WINDOW - (now - oldest)
      return { allowed: false, waitMin: Math.ceil(waitMs / 60000) }
    }
    recent.push(now)
    sessionStorage.setItem(RL_KEY, JSON.stringify(recent))
    return { allowed: true }
  } catch {
    return { allowed: true }
  }
}

// ── Verification persistence ──────────────────────────────────
const VERIFY_KEY = 'track_verified'
function saveVerification(ref, phone) {
  try { sessionStorage.setItem(VERIFY_KEY, JSON.stringify({ ref, phone, t: Date.now() })) } catch {}
}
function loadVerification() {
  try {
    const raw = sessionStorage.getItem(VERIFY_KEY)
    if (!raw) return null
    const v = JSON.parse(raw)
    if (Date.now() - v.t > 60 * 60 * 1000) return null // 1h
    return v
  } catch { return null }
}

function TrackOrderPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [refInput, setRefInput] = useState(searchParams.get('ref') || '')
  const [phoneInput, setPhoneInput] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [now, setNow] = useState(Date.now())
  const channelRef = useRef(null)

  // Live clock for ETA countdown
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(id)
  }, [])

  // Auto-restore verification
  useEffect(() => {
    const v = loadVerification()
    if (v && !order) {
      setRefInput(v.ref)
      setPhoneInput(v.phone)
      lookup(v.ref, v.phone, true)
    }
    // eslint-disable-next-line
  }, [])

  // Realtime subscription
  useEffect(() => {
    if (!order?.id) return
    const ch = supabase
      .channel(`order-${order.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${order.id}` },
        (payload) => setOrder((o) => ({ ...o, ...payload.new }))
      )
      .subscribe()
    channelRef.current = ch
    return () => { supabase.removeChannel(ch) }
  }, [order?.id])

  const lookup = useCallback(async (ref, phone, silent = false) => {
    setError('')
    if (!ref || !phone) { setError('Please enter both reference and phone number.'); return }

    if (!silent) {
      const rl = checkRateLimit()
      if (!rl.allowed) {
        setError(`Too many attempts. Please wait ${rl.waitMin} min and try again.`)
        return
      }
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_ref', ref.trim())
        .eq('phone', phone.trim())
        .maybeSingle()

      if (error) throw error
      if (!data) { setError('No order found with that reference + phone combo.'); return }

      setOrder(data)
      saveVerification(ref.trim(), phone.trim())
    } catch (e) {
      setError(e.message || 'Lookup failed.')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSubmit = (e) => { e.preventDefault(); lookup(refInput, phoneInput) }

  const handleReorder = () => {
    if (!order?.items) return
    try {
      sessionStorage.setItem('reorder_cart', JSON.stringify(order.items))
      navigate('/order?reorder=1')
    } catch {}
  }

  const handleLogout = () => {
    sessionStorage.removeItem(VERIFY_KEY)
    setOrder(null); setRefInput(''); setPhoneInput(''); setError('')
  }

  // ── Derived data ────────────────────────────────────────────
  const currentIdx = order ? STATUSES.findIndex((s) => s.key === order.status) : -1
  const currentStatus = currentIdx >= 0 ? STATUSES[currentIdx] : null
  const isDelivered = order?.status === 'delivered'

  // Dynamic ETA — Level 1 (status-based)
  const placedAt = order?.created_at ? new Date(order.created_at).getTime() : null
  const etaTarget = placedAt && currentStatus ? placedAt + 90 * 60 * 1000 : null
  const etaRemainingMin = etaTarget ? Math.max(0, Math.round((etaTarget - now) / 60000)) : null

  // Per-step timestamps from order.status_timestamps (jsonb {confirmed: iso, preparing: iso, ...})
  const stepTime = (key) => {
    const ts = order?.status_timestamps?.[key]
    return ts ? new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null
  }

  // ── Render ──────────────────────────────────────────────────
  if (!order) {
    return (
      <div className="track-page">
        <div className="track-page-header">
          <button className="track-back-btn" onClick={() => navigate('/')}>← Home</button>
          <h1>Track Your Order</h1>
          <p>Enter your order reference and phone number to see live status.</p>
        </div>

        <div className="track-page-body">
          <form className="track-verify-card" onSubmit={handleSubmit}>
            <label>Order Reference</label>
            <input
              type="text"
              placeholder="e.g. MK-A1B2C3"
              value={refInput}
              onChange={(e) => setRefInput(e.target.value)}
              autoComplete="off"
            />
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="e.g. 08012345678"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              autoComplete="tel"
            />
            {error && <div className="track-error">{error}</div>}
            <button type="submit" className="track-submit-btn" disabled={loading}>
              {loading ? 'Looking up…' : 'Track Order →'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="track-page">
      <div className="track-page-header">
        <button className="track-back-btn" onClick={() => navigate('/')}>← Home</button>
        <div className="track-result-header">
          <div>
            <h1>Order #{order.reference}</h1>
            <p className="track-sub">Placed {placedAt ? new Date(placedAt).toLocaleString() : ''}</p>
          </div>
          <button className="track-logout" onClick={handleLogout}>Track another</button>
        </div>
      </div>

      <div className="track-page-body">

        {/* ── ETA Hero ──────────────────────────────────────── */}
        {!isDelivered && (
          <div className="track-eta-hero">
            <div className="track-eta-icon">{currentStatus?.icon || '⏱️'}</div>
            <div className="track-eta-text">
              <div className="track-eta-status">{currentStatus?.label}</div>
              <div className="track-eta-time">
                {etaRemainingMin > 0 ? `Arriving in ~${etaRemainingMin} min` : 'Arriving any moment'}
              </div>
            </div>
          </div>
        )}
        {isDelivered && (
          <div className="track-eta-hero track-delivered">
            <div className="track-eta-icon">🎉</div>
            <div className="track-eta-text">
              <div className="track-eta-status">Delivered!</div>
              <div className="track-eta-time">Enjoy your meal 🍽️</div>
            </div>
          </div>
        )}

        {/* ── Vertical Timeline ────────────────────────────── */}
        <div className="track-timeline">
          {STATUSES.map((s, i) => {
            const done = i <= currentIdx
            const active = i === currentIdx
            const time = stepTime(s.key) || (i === 0 && placedAt
              ? new Date(placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : null)
            return (
              <div key={s.key} className={`track-tl-step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
                <div className="track-tl-dot">{done ? '✓' : s.icon}</div>
                {i < STATUSES.length - 1 && (
                  <div className={`track-tl-line ${i < currentIdx ? 'filled' : ''}`}>
                    <div className="track-tl-line-fill" />
                  </div>
                )}
                <div className="track-tl-body">
                  <div className="track-tl-label">{s.label}</div>
                  {time && <div className="track-tl-time">at {time}</div>}
                  {active && !isDelivered && (
                    <div className="track-tl-pulse">In progress…</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Driver / Delivery Info ───────────────────────── */}
        <div className="track-driver-card">
          <div className="track-card-title">🛵 Delivery Info</div>
          {order.driver_name ? (
            <div className="track-driver-row">
              <div className="track-driver-avatar">
                {order.driver_name.charAt(0).toUpperCase()}
              </div>
              <div className="track-driver-info">
                <div className="track-driver-name">{order.driver_name}</div>
                {order.driver_phone && (
                  <a href={`tel:${order.driver_phone}`} className="track-driver-phone">
                    📞 {order.driver_phone}
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="track-driver-row">
              <div className="track-driver-avatar">M</div>
              <div className="track-driver-info">
                <div className="track-driver-name">Mama's Kitchen Team</div>
                <div className="track-driver-phone-text">We'll deliver this one personally 💚</div>
              </div>
            </div>
          )}
          <div className="track-route">
            <div className="track-route-row"><span>📍 From</span> {ORIGIN.address}</div>
            <div className="track-route-row"><span>🏠 To</span> {order.delivery_address || 'Your address'}</div>
          </div>
        </div>

        {/* ── Collapsible Order Summary ────────────────────── */}
        <div className="track-summary-card">
          <button className="track-summary-toggle" onClick={() => setSummaryOpen((o) => !o)}>
            <span>🧾 Order Summary ({order.items?.length || 0} items)</span>
            <span>{summaryOpen ? '▲' : '▼'}</span>
          </button>
          {summaryOpen && (
            <div className="track-summary-body">
              {order.items?.map((it, idx) => (
                <div className="track-summary-row" key={idx}>
                  <span>{it.qty}× {it.name}</span>
                  <span>{fmt(it.price * it.qty)}</span>
                </div>
              ))}
              <div className="track-summary-total">
                <span>Total</span>
                <span>{fmt(order.total)}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Reorder CTA ──────────────────────────────────── */}
        {isDelivered && (
          <button className="track-reorder-btn" onClick={handleReorder}>
            🔁 Reorder these items
          </button>
        )}
      </div>
    </div>
  )
}

export default TrackOrderPage
