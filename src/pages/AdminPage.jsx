import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabaseClient'

const ADMIN_PASSWORD = 'sweethub2024'
const fmt = (n) => '₦' + Number(n || 0).toLocaleString()

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

/* -------- Tiny confirm dialog -------- */
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

export default function AdminPage() {
  const [authed, setAuthed]     = useState(() => sessionStorage.getItem('sh_admin') === 'true')
  const [password, setPassword] = useState('')
  const [pwError, setPwError]   = useState(false)

  const [orders, setOrders]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('All')
  const [search, setSearch]     = useState('')
  const [view, setView]         = useState('active')   // 'active' | 'archived'
  const [selected, setSelected] = useState(null)
  const [updating, setUpdating] = useState(null)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [confirm, setConfirm]   = useState(null)        // { title, msg, action, label, danger }
  const [toast, setToast]       = useState(null)

  const showToast = (msg, kind = 'success') => {
    setToast({ msg, kind })
    setTimeout(() => setToast(null), 2500)
  }

  /* ---------- AUTH ---------- */
  const login = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('sh_admin', 'true')
      setAuthed(true)
    } else {
      setPwError(true)
      setTimeout(() => setPwError(false), 2000)
    }
  }

  /* ---------- FETCH ---------- */
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

  /* ---------- ACTIONS ---------- */
  const updateStatus = async (id, status) => {
    setUpdating(id)
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (!error) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
      if (selected?.id === id) setSelected(prev => ({ ...prev, status }))
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
      ? { ...o, archived: archive, archived_at: archive ? new Date().toISOString() : null }
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

  /* ---------- LOGIN UI ---------- */
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

  /* ---------- DERIVED ---------- */
  const visible = useMemo(() => orders.filter(o => view === 'archived' ? o.archived : !o.archived), [orders, view])

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

  const allSelected = filtered.length > 0 && filtered.every(o => selectedIds.has(o.id))
  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set())
    else setSelectedIds(new Set(filtered.map(o => o.id)))
  }
  const toggleOne = (id) => {
    const next = new Set(selectedIds)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelectedIds(next)
  }

  /* ---------- DASHBOARD ---------- */
  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-left">
          <h1 className="admin-title">🍰 SweetHUB Orders</h1>
          <p className="admin-subtitle">
            {activeCount} active · {archivedCount} archived
          </p>
        </div>
        <div className="admin-header-right">
          <div className="admin-view-switch">
            <button
              className={view === 'active' ? 'active' : ''}
              onClick={() => { setView('active'); setSelectedIds(new Set()) }}
            >Active <span>{activeCount}</span></button>
            <button
              className={view === 'archived' ? 'active' : ''}
              onClick={() => { setView('archived'); setSelectedIds(new Set()) }}
            >Archived <span>{archivedCount}</span></button>
          </div>
          <button className="admin-refresh-btn" onClick={fetchOrders}>↻ Refresh</button>
          <button className="admin-logout-btn" onClick={() => { sessionStorage.removeItem('sh_admin'); setAuthed(false) }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="admin-stats">
        {[
          { label: 'Total Orders',  value: activeCount, accent: '#c0392b' },
          { label: 'Pending',       value: counts['Pending'] || 0, accent: '#f0ad4e' },
          { label: 'In Progress',   value: (counts['Confirmed']||0)+(counts['Preparing']||0), accent: '#2196f3' },
          { label: 'Delivered',     value: counts['Delivered'] || 0, accent: '#27ae60' },
          { label: 'Revenue',       value: fmt(visible.filter(o => o.status === 'Delivered').reduce((s,o)=>s+Number(o.total||0),0)), accent: '#7c3aed' },
        ].map(s => (
          <div key={s.label} className="admin-stat-card">
            <span className="admin-stat-bar" style={{ background: s.accent }} />
            <p className="admin-stat-label">{s.label}</p>
            <p className="admin-stat-value" style={{ color: s.accent }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="admin-controls">
        <div className="admin-filter-tabs">
          {['All', ...STATUSES].map(s => (
            <button
              key={s}
              className={`admin-filter-tab ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {s}
              {s !== 'All' && counts[s] > 0 && <span className="admin-filter-count">{counts[s]}</span>}
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

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="admin-bulkbar">
          <div className="admin-bulkbar-info">
            <strong>{selectedIds.size}</strong> selected
            <button className="admin-bulkbar-clear" onClick={() => setSelectedIds(new Set())}>Clear</button>
          </div>
          <div className="admin-bulkbar-actions">
            <select
              className="admin-bulk-status"
              defaultValue=""
              onChange={e => { if (e.target.value) { bulkUpdateStatus(e.target.value); e.target.value = '' } }}
            >
              <option value="" disabled>Change status…</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {view === 'active' ? (
              <button
                className="admin-btn-secondary"
                onClick={() => setConfirm({
                  title: 'Archive orders?',
                  msg: `Archive ${selectedIds.size} order(s)? They will be hidden but kept for your records.`,
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
                msg: `Permanently delete ${selectedIds.size} order(s)? This cannot be undone.`,
                label: 'Delete forever',
                danger: true,
                action: () => deleteOrders([...selectedIds]),
              })}
            >🗑 Delete</button>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="admin-loading"><div className="admin-spinner" /><p>Loading orders...</p></div>
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
                    <div className="admin-row-actions">
                      <button
                        className="admin-icon-btn admin-wa"
                        title="WhatsApp customer"
                        onClick={() => {
                          const lines = (order.items || []).map(i => `• ${i.name} × ${i.qty} = ${fmt(i.total)}`).join('\n')
                          const msg = `Hi ${order.customer_name}! 👋 Your SweetHUB order *${order.order_ref}* has been confirmed ✅\n\n${lines}\n\n*Total: ${fmt(order.total)}*\n\nThank you! 🍰`
                          window.open(`https://wa.me/${order.phone.replace(/^0/, '234')}?text=${encodeURIComponent(msg)}`, '_blank')
                        }}
                      >💬</button>

                      {view === 'active' ? (
                        <button
                          className="admin-icon-btn"
                          title="Archive"
                          onClick={() => setConfirm({
                            title: 'Archive this order?',
                            msg: `Archive ${order.order_ref}? You can restore it later.`,
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
                          msg: `Permanently delete ${order.order_ref}? This cannot be undone.`,
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

      {/* Detail modal */}
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

              <div className="admin-modal-footer">
                {selected.archived ? (
                  <button
                    className="admin-btn-secondary"
                    onClick={() => { archiveOrders([selected.id], false); setSelected(null) }}
                  >↩ Restore order</button>
                ) : (
                  <button
                    className="admin-btn-secondary"
                    onClick={() => setConfirm({
                      title: 'Archive this order?',
                      msg: `Archive ${selected.order_ref}? You can restore it later.`,
                      label: 'Archive',
                      action: () => { archiveOrders([selected.id], true); setSelected(null) },
                    })}
                  >📦 Archive</button>
                )}
                <button
                  className="admin-btn-danger"
                  onClick={() => setConfirm({
                    title: 'Delete this order?',
                    msg: `Permanently delete ${selected.order_ref}? This cannot be undone.`,
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

      {/* Confirm dialog */}
      <ConfirmDialog
        open={!!confirm}
        title={confirm?.title}
        message={confirm?.msg}
        confirmLabel={confirm?.label}
        danger={confirm?.danger}
        onCancel={() => setConfirm(null)}
        onConfirm={() => { confirm?.action?.(); setConfirm(null) }}
      />

      {/* Toast */}
      {toast && (
        <div className={`admin-toast ${toast.kind}`}>{toast.msg}</div>
      )}
    </div>
  )
}
