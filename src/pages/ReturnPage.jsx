import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

export default function ReturnPage() {
  // Always scroll to top when page loads
  useEffect(() => { window.scrollTo(0, 0) },[])
    return (
    <main className="legal-page">
      <div className="legal-hero">
        <div className="legal-breadcrumb">
          <Link to="/">Home</Link> <span>/</span> <span>Refund Policy</span>
        </div>
        <h1 className="legal-title">Refund & Return Policy</h1>
        <p className="legal-updated">Last Updated: April 2026</p>
      </div>

      <div className="legal-container">
        <div className="legal-content">
          <h2>1. Perishable Goods Policy</h2>
          <p>Because Jovlora provides freshly baked, perishable food items, <strong>we do not accept physical returns</strong> of our products once they have been delivered and accepted.</p>

          <h2>2. Order Cancellations</h2>
          <ul>
            <li><strong>Standard Orders:</strong> You may cancel your order for a full refund if the cancellation is made <em>before</em> our kitchen begins preparation. Once preparation has started, cancellations are not permitted.</li>
            <li><strong>Custom/Bulk Orders:</strong> Cancellations must be made at least 48 hours in advance. Deposits for custom orders are non-refundable within 48 hours of the scheduled delivery time.</li>
          </ul>

          <h2>3. Quality Issues & Replacements</h2>
          <p>Your satisfaction is our top priority. If you receive an order that is incorrect, missing items, or does not meet our quality standards, please contact us immediately.</p>
          <ul>
            <li>You must notify us via WhatsApp (+234 902 970 2549) within <strong>2 hours</strong> of receiving your delivery.</li>
            <li>Please provide your Order Reference and a photo of the item in question.</li>
            <li>If verified, we will happily provide a replacement of the item or issue a refund to your original payment method.</li>
          </ul>

          <h2>4. Late or Missing Delivery</h2>
          <p>If your order has not arrived within the estimated delivery window, please contact our support team. If an order fails to be delivered entirely due to a fault on our end, a full refund will be issued.</p>

          <h2>5. Refund Processing Time</h2>
          <p>Approved refunds are processed immediately on our end. Depending on your bank or payment provider, it may take 3-5 business days for the funds to reflect in your account.</p>
        </div>
      </div>

      <Footer />
    </main>
  )
}
