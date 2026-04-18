import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

const ADMIN_PASSWORD = 'sweethub2024'  // ← change this to your own password
const fmt = (n) => '₦' + n.toLocaleString()

const STATUS_COLORS = {
  'Pending':    { bg: '#fff3cd', color: '#856404', dot: '#f0ad4e' },
  'Confirmed':  { bg: '#cce5ff', color: '#004085', dot: '#2196f3' },
  'Preparing':  { bg: '#fff8e1', color: '#c0392b', dot: '#c0392b' },
  'Ready':      { bg: '#e8f5e9', color: '#1b5e20', dot: '#4caf50' },
  'Delivered':  { bg: '#e2e3e5', color: '#383d41', dot: '#888'    },
  'Cancelled':  { bg: '#f8d7da', color: '#721c24', dot: '#e74c3c' },
}

const STATUSES = Object.keys(STATUS_COLORS)

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS['Pending']
  return (
    <span className="admin-status-badge" style={{ background: s.bg, color: s.color }}>
      <span className="admin-status-dot" style={{ background: s.dot }} />
      {status}
    </span>
  )
}

export default function AdminPage() {
  const [authed, setAuthed]       = useState(() => sessionStorage.getItem('sh_admin') === 'true')
  const [password, setPassword]   = useState('')
  const [pwError, setPwError]     = useState(false)

  const [orders, setOrders]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [filter, setFilter]       = useState('All')
  const [search, setSearch]       = useState('')
  const [selected, setSelected]   = useState(null) // order detail modal
  const [updating, setUpdating]   = useState(null) // order id being updated

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('sh_admin', 'true')
      setAuthed(true)
    } else {
      setPwError(true)
      setTimeout(() => setPwError(false), 2000)
    }
  }

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setOrders(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!authed) return
    fetchOrders()

    // Real-time subscription — new orders appear instantly
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [authed, fetchOrders])

  const updateStatus = async (id, status) => {
    setUpdating(id)
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    if (selected?.id === id) setSelected(prev => ({ ...prev, status }))
    setUpdating(null)
  }

  // ── Login screen ──────────────────────────────────────────
  if (!authed) {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <div className="admin-login-logo">🍰</div>
          <h1 className="admin-login-title">SweetHUB Admin</h1>
          <p className="admin-login-sub">Enter your password to access the dashboard</p>
          <div className={`admin-login-field ${pwError ? 'error' : ''}`}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              placeholder="Password"
              autoFocus
            />
          </div>
          {pwError && <p className="admin-login-error">Incorrect password. Try again.</p>}
          <button className="admin-login-btn" onClick={login}>Sign In</button>
        </div>
      </div>
    )
  }

  // ── Filter + search ───────────────────────────────────────
  const filtered = orders.filter(o => {
    const matchStatus = filter === 'All' || o.status === filter
    const q = search.toLowerCase()
    const matchSearch = !q ||
      o.order_ref?.toLowerCase().includes(q) ||
      o.customer_name?.toLowerCase().includes(q) ||
      o.phone?.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length
    return acc
  }, {})

  // ── Dashboard ─────────────────────────────────────────────
  return (
    <div className="admin-page">

      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-left">
          <h1 className="admin-title">🍰 SweetHUB Orders</h1>
          <p className="admin-subtitle">{orders.length} total orders</p>
        </div>
        <div className="admin-header-right">
          <button className="admin-refresh-btn" onClick={fetchOrders}>
            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
              <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/>
            </svg>
            Refresh
          </button>
          <button className="admin-logout-btn" onClick={() => { sessionStorage.removeItem('sh_admin'); setAuthed(false) }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="admin-stats">
        {[
          { label: 'Total Orders',    value: orders.length,                                              color: '#c0392b' },
          { label: 'Pending',         value: counts['Pending'] || 0,                                     color: '#f0ad4e' },
          { label: 'In Progress',     value: (counts['Confirmed'] || 0) + (counts['Preparing'] || 0),    color: '#2196f3' },
          { label: 'Delivered',       value: counts['Delivered'] || 0,                                   color: '#27ae60' },
          { label: 'Total Revenue',   value: fmt(orders.filter(o => o.status === 'Delivered').reduce((s, o) => s + o.total, 0)), color: '#7c3aed', isText: true },
        ].map(s => (
          <div key={s.label} className="admin-stat-card">
            <p className="admin-stat-label">{s.label}</p>
            <p className="admin-stat-value" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div className="admin-controls">
        <div className="admin-filter-tabs">
          {['All', ...STATUSES].map(s => (
            <button
              key={s}
              className={`admin-filter-tab ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {s}
              {s !== 'All' && counts[s] > 0 && (
                <span className="admin-filter-count">{counts[s]}</span>
              )}
            </button>
          ))}
        </div>
        <input
          className="admin-search"
          type="text"
          placeholder="Search by ref, name or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Orders table */}
      {loading ? (
        <div className="admin-loading">
          <div className="admin-spinner" />
          <p>Loading orders...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <p>No orders found {filter !== 'All' ? `with status "${filter}"` : ''}.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id} className="admin-table-row" onClick={() => setSelected(order)}>
                  <td><span className="admin-ref">{order.order_ref}</span></td>
                  <td className="admin-name">{order.customer_name}</td>
                  <td className="admin-phone">{order.phone}</td>
                  <td className="admin-items-count">{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</td>
                  <td className="admin-total">{fmt(order.total)}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <select
                      className="admin-status-select"
                      value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value)}
                      disabled={updating === order.id}
                      style={{ background: STATUS_COLORS[order.status]?.bg, color: STATUS_COLORS[order.status]?.color }}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="admin-date">
                    {new Date(order.created_at).toLocaleDateString('en-NG', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <button
                      className="admin-wa-btn"
                      onClick={() => {
                        const lines = order.items.map(i => `• ${i.name} × ${i.qty} = ${fmt(i.total)}`).join('\n')
                        const msg = `Hi ${order.customer_name}! 👋 Your SweetHUB order *${order.order_ref}* has been confirmed ✅\n\n${lines}\n\n*Total: ${fmt(order.total)}*\n\nPlease send payment to:\nBank: GTB\nAccount: 012XXXXXXX\nName: SweetHUB\n\nThank you! 🍰`
                        window.open(`https://wa.me/${order.phone.replace(/^0/, '234')}?text=${encodeURIComponent(msg)}`, '_blank')
                      }}
                      title="Message customer on WhatsApp"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 0 24 24" width="16px" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order detail modal */}
      {selected && (
        <div className="admin-modal-overlay" onClick={() => setSelected(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h2 className="admin-modal-ref">{selected.order_ref}</h2>
                <p className="admin-modal-date">
                  {new Date(selected.created_at).toLocaleString('en-NG', { dateStyle: 'full', timeStyle: 'short' })}
                </p>
              </div>
              <button className="admin-modal-close" onClick={() => setSelected(null)}>×</button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-modal-grid">
                <div className="admin-modal-section">
                  <h3>Customer</h3>
                  <p><strong>{selected.customer_name}</strong></p>
                  <p>📞 {selected.phone}</p>
                  <p>📍 {selected.address}</p>
                  {selected.notes && <p>📝 {selected.notes}</p>}
                </div>
                <div className="admin-modal-section">
                  <h3>Status</h3>
                  <StatusBadge status={selected.status} />
                  <select
                    className="admin-status-select admin-modal-status-select"
                    value={selected.status}
                    onChange={e => updateStatus(selected.id, e.target.value)}
                    disabled={updating === selected.id}
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="admin-modal-items">
                <h3>Order Items</h3>
                {selected.items?.map((item, i) => (
                  <div key={i} className="admin-modal-item">
                    <span>{item.name} × {item.qty}</span>
                    <span>{fmt(item.total)}</span>
                  </div>
                ))}
                <div className="admin-modal-item admin-modal-total">
                  <span>Total</span>
                  <span>{fmt(selected.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}