import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// ── OrderBanner ───────────────────────────────────────────────
// Slides down at the top of the page when the customer returns
// from WhatsApp after placing an order.
// Shows their order ref and a link to the tracking page.

function OrderBanner() {
  const navigate  = useNavigate()
  const [visible, setVisible]   = useState(false)
  const [orderRef, setOrderRef] = useState('')
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if customer just came back from WhatsApp
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const ordered = sessionStorage.getItem('sweethub_ordered')
        const ref     = sessionStorage.getItem('sweethub_order_ref')
        if (ordered === 'true' && ref) {
          sessionStorage.removeItem('sweethub_ordered')
          setOrderRef(ref)
          setTimeout(() => setVisible(true), 700)
        }
      }
    }

    // Also check on mount in case they already returned
    const ordered = sessionStorage.getItem('sweethub_ordered')
    const ref     = sessionStorage.getItem('sweethub_order_ref')
    if (ordered === 'true' && ref) {
      sessionStorage.removeItem('sweethub_ordered')
      setOrderRef(ref)
      setTimeout(() => setVisible(true), 700)
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  // Auto dismiss after 12 seconds
  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setVisible(false), 12000)
      return () => clearTimeout(t)
    }
  }, [visible])

  const handleTrack = () => {
    setVisible(false)
    navigate(`/track-order?ref=${orderRef}`)
  }

  const handleDismiss = () => {
    setVisible(false)
    setDismissed(true)
  }

  if (dismissed || !orderRef) return null

  return (
    <div
      className={`order-banner ${visible ? 'order-banner-visible' : ''}`}
      role="alert"
      aria-live="polite"
    >
      <div className="order-banner-inner">
        <div className="ob-left">
          <span className="ob-icon">🎉</span>
          <div className="ob-text">
            <p className="ob-title">Order <strong>{orderRef}</strong> confirmed!</p>
            <p className="ob-sub">We're getting started on your order right now.</p>
          </div>
        </div>
        <div className="ob-right">
          <button className="ob-track-btn" onClick={handleTrack}>
            Track Order
            <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
              <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/>
            </svg>
          </button>
          <button className="ob-dismiss" onClick={handleDismiss} aria-label="Dismiss">
            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Progress bar that counts down 12 seconds */}
      <div className="ob-progress">
        <div className={`ob-progress-fill ${visible ? 'ob-progress-animate' : ''}`} />
      </div>
    </div>
  )
}

export default OrderBanner