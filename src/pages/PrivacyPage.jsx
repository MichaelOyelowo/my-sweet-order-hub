import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

export default function PrivacyPage() {
  // Always scroll to top when page loads
  useEffect(() => { window.scrollTo(0, 0) },[])

  return (
    <main className="legal-page">
      <div className="legal-hero">
        <div className="legal-breadcrumb">
          <Link to="/">Home</Link> <span>/</span> <span>Privacy Policy</span>
        </div>
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-updated">Last Updated: April 2026</p>
      </div>

      <div className="legal-container">
        <div className="legal-content">
          <h2>1. Introduction</h2>
          <p>At SweetHUB, we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website or place an order with us.</p>

          <h2>2. Information We Collect</h2>
          <p>To provide you with our fresh bakery products and delivery services, we collect the following information:</p>
          <ul>
            <li><strong>Identity Data:</strong> First name and last name.</li>
            <li><strong>Contact Data:</strong> Delivery address, email address, and phone number (WhatsApp).</li>
            <li><strong>Transaction Data:</strong> Details about payments and the products you have purchased from us.</li>
          </ul>

          <h2>3. How We Use Your Data</h2>
          <p>We only use your personal data for the following purposes:</p>
          <ul>
            <li>To process and deliver your order.</li>
            <li>To communicate with you via WhatsApp regarding order status and delivery updates.</li>
            <li>To send order confirmation receipts via email.</li>
            <li>To manage any custom order inquiries or customer service requests.</li>
          </ul>

          <h2>4. Data Sharing</h2>
          <p><strong>We do not sell your personal data to third parties.</strong> We only share your data with trusted third-party service providers necessary to run our business, such as delivery logistics partners and secure email routing services (e.g., Resend).</p>

          <h2>5. Contact Us</h2>
          <p>If you have any questions about this privacy policy or want to request the deletion of your data, please contact us at <a href="mailto:hello@sweethub.ng">hello@sweethub.ng</a> or via WhatsApp at +234 902 970 2549.</p>
        </div>
      </div>

      <Footer />
    </main>
  )
}