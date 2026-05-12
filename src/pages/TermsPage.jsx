import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

export default function TermsPage() {
  useEffect(() => { window.scrollTo(0, 0) },[])

  return (
    <main className="legal-page">
      <div className="legal-hero">
        <div className="legal-breadcrumb">
          <Link to="/">Home</Link> <span>/</span> <span>Terms of Service</span>
        </div>
        <h1 className="legal-title">Terms of Service</h1>
        <p className="legal-updated">Last Updated: April 2026</p>
      </div>

      <div className="legal-container">
        <div className="legal-content">
          <h2>1. Agreement to Terms</h2>
          <p>By accessing our website and placing an order with Jovlora, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.</p>

          <h2>2. Orders and Pricing</h2>
          <ul>
            <li>All products are subject to availability. Because we bake fresh to order, there is a standard 1-hour 30-minute preparation window for most items.</li>
            <li>Prices for our products are subject to change without notice.</li>
            <li>We reserve the right to refuse or cancel any order for reasons including, but not limited to: product unavailability, errors in the description or price, or suspected fraudulent activity.</li>
          </ul>

          <h2>3. Delivery Estimates</h2>
          <p>Our "30-Minute Delivery" metric is an average estimate that begins <em>after</em> the preparation period is complete and the food has left our kitchen. Delivery times may occasionally be affected by severe weather, traffic, or conditions outside our control in Ile-Ife.</p>

          <h2>4. Custom & Bulk Orders</h2>
          <p>Custom cakes and bulk event orders require advanced notice. A non-refundable deposit may be required to secure your date and confirm your custom order.</p>

          <h2>5. Intellectual Property</h2>
          <p>The SweetHUB brand, logos, images, and website design are the intellectual property of SweetHUB. You may not use, reproduce, or distribute our materials without express written permission.</p>

          <h2>6. Modifications</h2>
          <p>We reserve the right to modify these terms at any time. Changes take effect immediately upon posting to the website. Your continued use of the service constitutes acceptance of the modified terms.</p>
        </div>
      </div>

      <Footer />
    </main>
  )
}