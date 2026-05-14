import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabaseClient'
import logo from '../assets/jovlora.png'

const ADMIN_PASSWORD = 'jovlora2024'
const fmt = (n) => '₦' + Number(n || 0).toLocaleString()

// ── Jovlora payment details ──────────────────────────────────
const PAYMENT = {
  bankName:      'Opay',
  accountNumber: '9029702549',
  accountName:   'Joy Yaya',
}

const WHATSAPP_NUMBER = '2349029702549'

// ── WhatsApp message templates per status ─────────────────────
function buildWAMessage(order, status) {
  const itemLines = (order.items || [])
    .map(i => `  • ${i.name} × ${i.qty} = ${fmt(i.total)}`)
    .join('\n')

  const header = `Hello ${order.customer_name}! 👋 This is Jovlora 🍰`
  const ref    = `Order Ref: *${order.order_ref}*`
  const items  = `\n*Your Order:*\n${itemLines}\n*Total: ${fmt(order.total)}*`

  const payment =
    `\n\n💳 *Payment Details:*\n` +
    `Bank: ${PAYMENT.bankName}\n` +
    `Account No: *${PAYMENT.accountNumber}*\n` +
    `Account Name: ${PAYMENT.accountName}\n` +
    `Amount: *${fmt(order.total)}*\n\n` +
    `Please send payment and reply with your receipt to confirm. 🙏`

  const templates = {
    Pending: (
      `${header}\n\n` +
      `We received your order! 🎉\n${ref}\n${items}` +
      payment +
      `\n\nWe'll start preparing immediately after payment is confirmed!`
    ),
    Confirmed: (
      `${header}\n\n` +
      `✅ Your order has been *confirmed!*\n${ref}\n${items}` +
      payment +
      `\n\nPlease complete payment so we can start baking fresh for you! 🍩`
    ),
    Preparing: (
      `${header}\n\n` +
      `👨‍🍳 We are *currently preparing* your order!\n${ref}\n${items}\n\n` +
      `Your fresh snacks are being made right now. ` +
      `Delivery is on its way soon! 🛵`
    ),
    Ready: (
      `${header}\n\n` +
      `🎁 Your order is *READY* and out for delivery!\n${ref}\n${items}\n\n` +
      `Our rider is heading to:\n📍 ${order.address || 'your address'}\n\n` +
      `Please be available to receive your order! 😊`
    ),
    Delivered: (
      `${header}\n\n` +
      `✅ Your order has been *delivered!*\n${ref}\n${items}\n\n` +
      `We hope you enjoy every bite! 😋\n` +
      `Thank you for choosing Jovlora 🍰\n\n` +
      `Please leave us a review — it means the world to us! ⭐⭐⭐⭐⭐`
    ),
    Cancelled: (
      `${header}\n\n` +
      `❌ Your order *${order.order_ref}* has been cancelled.\n\n` +
      `We're sorry about that! If you'd like to reorder or need help, ` +
      `just message us and we'll sort it out. 🙏`
    ),
  }

  return templates[status] || templates['Confirmed']
}

function openWA(order, status) {
  const phone = (order.phone || '').replace(/^0/, '234').replace(/\s/g, '')
  const msg   = buildWAMessage(order, status)
  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
    '_blank'
  )
}

// ── Status config ─────────────────────────────────────────────
const STATUS_COLORS = {
  'Pending':   { bg: '#fff3cd', color: '#856404', dot: '#f0ad4e' },
  'Confirmed': { bg: '#cce5ff', color: '#004085', dot: '#2196f3' },
  'Preparing': { bg: '#fff8e1', color: '#c0392b', dot: '#c0392b' },
  'Ready':     { bg: '#e8f5e9', color: '#1b5e20', dot: '#4caf50' },
  'Delivered': { bg: '#e2e3e5', color: '#383d41', dot: '#888'    },
  'Cancelled': { bg: '#f8d7da', color: '#721c24', dot: '#e74c3c' },
}
const STATUSES = Object.keys(STATUS_COLORS)

// ── Status badge ──────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS['Pending']
  return (
    <span className="admin-status-badge" style={{ background: s.bg, color: s.color }}>
      <span className="admin-status-dot" style={{ background: s.dot }} />
      {status}
    </span>
  )
}

// ── Confirm dialog ────────────────────────────────────────────
function ConfirmDialog({ open, title, message, confirmLabel, danger, onConfirm, onCancel }) {
  if (!open) return null
  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div className="admin-confirm" onClick={e => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="admin-confirm-actions">
          <button className="admin-btn-ghost" onClick={onCancel}>Cancel</button>
          <button
            className={danger ? 'admin-btn-danger' : 'admin-btn-primary'}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── WA message preview modal ──────────────────────────────────
function WAPreviewModal({ order, onClose }) {
  const [selectedStatus, setSelectedStatus] = useState(order.status || 'Confirmed')

  if (!order) return null

  const msg = buildWAMessage(order, selectedStatus)

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal admin-wa-preview" onClick={e => e.stopPropagation()}>

        <div className="admin-modal-header">
          <div>
            <h2 className="admin-modal-ref">💬 WhatsApp Message</h2>
            <p className="admin-modal-date">
              Sending to {order.customer_name} — {order.phone}
            </p>
          </div>
          <button className="admin-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="admin-modal-body">

          {/* Status selector */}
          <div className="admin-wa-status-pick">
            <p className="admin-wa-label">Choose message type:</p>
            <div className="admin-wa-status-tabs">
              {STATUSES.map(s => (
                <button
                  key={s}
                  className={`admin-wa-tab ${selectedStatus === s ? 'active' : ''}`}
                  style={selectedStatus === s ? {
                    background: STATUS_COLORS[s].bg,
                    color: STATUS_COLORS[s].color,
                    borderColor: STATUS_COLORS[s].dot,
                  } : {}}
                  onClick={() => setSelectedStatus(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Message preview — styled like WhatsApp */}
          <div className="admin-wa-preview-box">
            <div className="admin-wa-preview-header">
              <div className="admin-wa-preview-dot" />
              <span>Message Preview</span>
            </div>
            <div className="admin-wa-bubble">
              {msg.split('\n').map((line, i) => (
                <p key={i} className={
                  line.startsWith('*') && line.endsWith('*')
                    ? 'wa-bold'
                    : line.startsWith('  •')
                    ? 'wa-item'
                    : 'wa-line'
                }>
                  {line.replace(/\*/g, '') || '\u00A0'}
                </p>
              ))}
            </div>
          </div>

          {/* Payment box reminder */}
          {(selectedStatus === 'Pending' || selectedStatus === 'Confirmed') && (
            <div className="admin-payment-reminder">
              <p className="apr-title">💳 Payment details included in message:</p>
              <div className="apr-details">
                <span><strong>Bank:</strong> {PAYMENT.bankName}</span>
                <span><strong>Account:</strong> {PAYMENT.accountNumber}</span>
                <span><strong>Name:</strong> {PAYMENT.accountName}</span>
                <span><strong>Amount:</strong> {fmt(order.total)}</span>
              </div>
            </div>
          )}

          {/* Send button */}
          <button
            className="admin-wa-send-btn"
            onClick={() => { openWA(order, selectedStatus); onClose() }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Open WhatsApp & Send
          </button>

        </div>
      </div>
    </div>
  )
}

// ── Main AdminPage ────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed]     = useState(() => sessionStorage.getItem('sh_admin') === 'true')
  const [password, setPassword] = useState('')
  const [pwError, setPwError]   = useState(false)

  const [orders, setOrders]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('All')
  const [search, setSearch]     = useState('')
  const [view, setView]         = useState('active')
  const [selected, setSelected] = useState(null)
  const [waOrder, setWaOrder]   = useState(null)  // order for WA preview
  const [updating, setUpdating] = useState(null)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [confirm, setConfirm]   = useState(null)
  const [toast, setToast]       = useState(null)

  const showToast = (msg, kind = 'success') => {
    setToast({ msg, kind })
    setTimeout(() => setToast(null), 2500)
  }

  // ── Auth ──────────────────────────────────────────────────
  const login = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('sh_admin', 'true')
      setAuthed(true)
    } else {
      setPwError(true)
      setTimeout(() => setPwError(false), 2000)
    }
  }

  // ── Fetch orders ──────────────────────────────────────────
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
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [authed, fetchOrders])

  // ── Actions ───────────────────────────────────────────────
  const updateStatus = async (id, status) => {
    setUpdating(id)
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (!error) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
      if (selected?.id === id) setSelected(prev => ({ ...prev, status }))
      showToast(`Status updated to ${status}`)
    }
    setUpdating(null)
  }

  const archiveOrders = async (ids, archive = true) => {
    const { error } = await supabase
      .from('orders')
      .update({ archived: archive, archived_at: archive ? new Date().toISOString() : null })
      .in('id', ids)
    if (error) return showToast('Action failed', 'error')
    setOrders(prev => prev.map(o => ids.includes(o.id)
      ? { ...o, archived: archive }
      : o))
    setSelectedIds(new Set())
    showToast(archive ? `Archived ${ids.length} order(s)` : `Restored ${ids.length} order(s)`)
  }

  const deleteOrders = async (ids) => {
    const { error } = await supabase.from('orders').delete().in('id', ids)
    if (error) return showToast('Delete failed', 'error')
    setOrders(prev => prev.filter(o => !ids.includes(o.id)))
    setSelectedIds(new Set())
    if (selected && ids.includes(selected.id)) setSelected(null)
    showToast(`Deleted ${ids.length} order(s)`)
  }

  const bulkUpdateStatus = async (status) => {
    const ids = [...selectedIds]
    if (!ids.length) return
    const { error } = await supabase.from('orders').update({ status }).in('id', ids)
    if (error) return showToast('Update failed', 'error')
    setOrders(prev => prev.map(o => ids.includes(o.id) ? { ...o, status } : o))
    setSelectedIds(new Set())
    showToast(`Updated ${ids.length} order(s) to ${status}`)
  }

  // ── Login UI ──────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <div className="admin-login-logo"><img src={logo} alt="jovlora logo" style={{ width: "120px", height: "auto" }} /></div>
          <h1 className="admin-login-title">Jovlora Admin</h1>
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

  // ── Derived data ──────────────────────────────────────────
  const visible = useMemo(() =>
    orders.filter(o => view === 'archived' ? o.archived : !o.archived),
    [orders, view]
  )

  const filtered = visible.filter(o => {
    const matchStatus = filter === 'All' || o.status === filter
    const q = search.toLowerCase()
    const matchSearch = !q ||
      o.order_ref?.toLowerCase().includes(q) ||
      o.customer_name?.toLowerCase().includes(q) ||
      o.phone?.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = visible.filter(o => o.status === s).length
    return acc
  }, {})

  const activeCount   = orders.filter(o => !o.archived).length
  const archivedCount = orders.filter(o => o.archived).length
  const revenue       = visible
    .filter(o => o.status === 'Delivered')
    .reduce((s, o) => s + Number(o.total || 0), 0)

  const allSelected = filtered.length > 0 && filtered.every(o => selectedIds.has(o.id))
  const toggleAll   = () => allSelected
    ? setSelectedIds(new Set())
    : setSelectedIds(new Set(filtered.map(o => o.id)))
  const toggleOne = (id) => {
    const next = new Set(selectedIds)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelectedIds(next)
  }

  // ── Dashboard ─────────────────────────────────────────────
  return (
    <div className="admin-page">

      {/* ── Header ── */}
      <div className="admin-header">
        <div className="admin-header-left">
          <h1 className="admin-title">Jovlora Orders</h1>
          <p className="admin-subtitle">{activeCount} active · {archivedCount} archived</p>
        </div>
        <div className="admin-header-right">
          <div className="admin-view-switch">
            <button
              className={view === 'active' ? 'active' : ''}
              onClick={() => { setView('active'); setSelectedIds(new Set()) }}
            >
              Active <span>{activeCount}</span>
            </button>
            <button
              className={view === 'archived' ? 'active' : ''}
              onClick={() => { setView('archived'); setSelectedIds(new Set()) }}
            >
              Archived <span>{archivedCount}</span>
            </button>
          </div>
          <button className="admin-refresh-btn" onClick={fetchOrders}>↻ Refresh</button>
          <button
            className="admin-logout-btn"
            onClick={() => { sessionStorage.removeItem('sh_admin'); setAuthed(false) }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="admin-stats">
        {[
          { label: 'Total Orders',  value: activeCount,              accent: '#c0392b' },
          { label: 'Pending',       value: counts['Pending']  || 0, accent: '#f0ad4e' },
          { label: 'In Progress',
            value: (counts['Confirmed']||0) + (counts['Preparing']||0) + (counts['Ready']||0),
            accent: '#2196f3' },
          { label: 'Delivered',     value: counts['Delivered'] || 0, accent: '#27ae60' },
          { label: 'Revenue',       value: fmt(revenue),              accent: '#7c3aed' },
        ].map(s => (
          <div key={s.label} className="admin-stat-card">
            <span className="admin-stat-bar" style={{ background: s.accent }} />
            <p className="admin-stat-label">{s.label}</p>
            <p className="admin-stat-value" style={{ color: s.accent }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Payment info bar ── */}
      <div className="admin-payment-bar">
        <span className="apb-label">💳 Payment Account</span>
        <span className="apb-item"><strong>Bank:</strong> {PAYMENT.bankName}</span>
        <span className="apb-divider" />
        <span className="apb-item"><strong>Account No:</strong> {PAYMENT.accountNumber}</span>
        <span className="apb-divider" />
        <span className="apb-item"><strong>Name:</strong> {PAYMENT.accountName}</span>
        <button
          className="apb-copy"
          onClick={() => {
            navigator.clipboard.writeText(PAYMENT.accountNumber)
            showToast('Account number copied!')
          }}
        >
          Copy Account No
        </button>
      </div>

      {/* ── Controls ── */}
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

      {/* ── Bulk action bar ── */}
      {selectedIds.size > 0 && (
        <div className="admin-bulkbar">
          <div className="admin-bulkbar-info">
            <strong>{selectedIds.size}</strong> selected
            <button className="admin-bulkbar-clear" onClick={() => setSelectedIds(new Set())}>
              Clear
            </button>
          </div>
          <div className="admin-bulkbar-actions">
            <select
              className="admin-bulk-status"
              defaultValue=""
              onChange={e => {
                if (e.target.value) { bulkUpdateStatus(e.target.value); e.target.value = '' }
              }}
            >
              <option value="" disabled>Change status…</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {view === 'active' ? (
              <button
                className="admin-btn-secondary"
                onClick={() => setConfirm({
                  title: 'Archive orders?',
                  msg: `Archive ${selectedIds.size} order(s)?`,
                  label: 'Archive',
                  action: () => archiveOrders([...selectedIds], true),
                })}
              >📦 Archive</button>
            ) : (
              <button
                className="admin-btn-secondary"
                onClick={() => archiveOrders([...selectedIds], false)}
              >↩ Restore</button>
            )}

            <button
              className="admin-btn-danger"
              onClick={() => setConfirm({
                title: 'Delete permanently?',
                msg: `Delete ${selectedIds.size} order(s)? Cannot be undone.`,
                label: 'Delete forever',
                danger: true,
                action: () => deleteOrders([...selectedIds]),
              })}
            >🗑 Delete</button>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      {loading ? (
        <div className="admin-loading">
          <div className="admin-spinner" />
          <p>Loading orders...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <p>No {view} orders found{filter !== 'All' ? ` with status "${filter}"` : ''}.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                </th>
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
                <tr
                  key={order.id}
                  className={`admin-table-row ${selectedIds.has(order.id) ? 'selected' : ''}`}
                  onClick={() => setSelected(order)}
                >
                  <td onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(order.id)}
                      onChange={() => toggleOne(order.id)}
                    />
                  </td>
                  <td><span className="admin-ref">{order.order_ref}</span></td>
                  <td className="admin-name">{order.customer_name}</td>
                  <td>
                    {/* Clickable phone — opens WA preview */}
                    <button
                      className="admin-phone-btn"
                      onClick={e => { e.stopPropagation(); setWaOrder(order) }}
                      title="Send WhatsApp message"
                    >
                      📱 {order.phone}
                    </button>
                  </td>
                  <td className="admin-items-count">
                    {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                  </td>
                  <td className="admin-total">{fmt(order.total)}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <select
                      className="admin-status-select"
                      value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value)}
                      disabled={updating === order.id}
                      style={{
                        background: STATUS_COLORS[order.status]?.bg,
                        color: STATUS_COLORS[order.status]?.color,
                      }}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="admin-date">
                    {new Date(order.created_at).toLocaleDateString('en-NG', {
                      day: 'numeric', month: 'short',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className="admin-row-actions">
                      {/* WhatsApp quick send */}
                      <button
                        className="admin-icon-btn admin-wa"
                        title="Send WhatsApp"
                        onClick={() => setWaOrder(order)}
                      >
                        💬
                      </button>
                      {view === 'active' ? (
                        <button
                          className="admin-icon-btn"
                          title="Archive"
                          onClick={() => setConfirm({
                            title: 'Archive this order?',
                            msg: `Archive ${order.order_ref}?`,
                            label: 'Archive',
                            action: () => archiveOrders([order.id], true),
                          })}
                        >📦</button>
                      ) : (
                        <button
                          className="admin-icon-btn"
                          title="Restore"
                          onClick={() => archiveOrders([order.id], false)}
                        >↩</button>
                      )}
                      <button
                        className="admin-icon-btn admin-danger"
                        title="Delete permanently"
                        onClick={() => setConfirm({
                          title: 'Delete this order?',
                          msg: `Delete ${order.order_ref}? Cannot be undone.`,
                          label: 'Delete forever',
                          danger: true,
                          action: () => deleteOrders([order.id]),
                        })}
                      >🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Order detail modal ── */}
      {selected && (
        <div className="admin-modal-overlay" onClick={() => setSelected(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>

            <div className="admin-modal-header">
              <div>
                <h2 className="admin-modal-ref">{selected.order_ref}</h2>
                <p className="admin-modal-date">
                  {new Date(selected.created_at).toLocaleString('en-NG', {
                    dateStyle: 'full', timeStyle: 'short',
                  })}
                </p>
              </div>
              <button className="admin-modal-close" onClick={() => setSelected(null)}>×</button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-modal-grid">
                <div className="admin-modal-section">
                  <h3>Customer</h3>
                  <p><strong>{selected.customer_name}</strong></p>
                  <p>
                    {/* Clickable phone in modal too */}
                    <button
                      className="admin-phone-btn admin-phone-btn-lg"
                      onClick={() => { setSelected(null); setWaOrder(selected) }}
                    >
                      📱 {selected.phone}
                    </button>
                  </p>
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

              {/* Order items */}
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

              {/* Payment details in modal */}
              <div className="admin-modal-payment">
                <h3>💳 Payment Details to Send</h3>
                <div className="amp-row">
                  <span className="amp-label">Bank</span>
                  <span className="amp-value">{PAYMENT.bankName}</span>
                </div>
                <div className="amp-row">
                  <span className="amp-label">Account No</span>
                  <span className="amp-value amp-accent">{PAYMENT.accountNumber}</span>
                </div>
                <div className="amp-row">
                  <span className="amp-label">Account Name</span>
                  <span className="amp-value">{PAYMENT.accountName}</span>
                </div>
                <div className="amp-row">
                  <span className="amp-label">Amount</span>
                  <span className="amp-value amp-accent">{fmt(selected.total)}</span>
                </div>
              </div>

              {/* Footer actions */}
              <div className="admin-modal-footer">
                <button
                  className="admin-wa-send-btn admin-wa-send-sm"
                  onClick={() => { setSelected(null); setWaOrder(selected) }}
                >
                  💬 Send WhatsApp Message
                </button>

                {selected.archived ? (
                  <button
                    className="admin-btn-secondary"
                    onClick={() => { archiveOrders([selected.id], false); setSelected(null) }}
                  >↩ Restore</button>
                ) : (
                  <button
                    className="admin-btn-secondary"
                    onClick={() => setConfirm({
                      title: 'Archive this order?',
                      msg: `Archive ${selected.order_ref}?`,
                      label: 'Archive',
                      action: () => { archiveOrders([selected.id], true); setSelected(null) },
                    })}
                  >📦 Archive</button>
                )}

                <button
                  className="admin-btn-danger"
                  onClick={() => setConfirm({
                    title: 'Delete this order?',
                    msg: `Delete ${selected.order_ref}? Cannot be undone.`,
                    label: 'Delete forever',
                    danger: true,
                    action: () => { deleteOrders([selected.id]); setSelected(null) },
                  })}
                >🗑 Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── WhatsApp preview modal ── */}
      {waOrder && (
        <WAPreviewModal
          order={waOrder}
          onClose={() => setWaOrder(null)}
        />
      )}

      {/* ── Confirm dialog ── */}
      <ConfirmDialog
        open={!!confirm}
        title={confirm?.title}
        message={confirm?.msg}
        confirmLabel={confirm?.label}
        danger={confirm?.danger}
        onCancel={() => setConfirm(null)}
        onConfirm={() => { confirm?.action?.(); setConfirm(null) }}
      />

      {/* ── Toast ── */}
      {toast && (
        <div className={`admin-toast ${toast.kind}`}>{toast.msg}</div>
      )}

    </div>
  )
}