import { useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

const WHATSAPP = '2349029702549'

const FAQS =[
  {
    q: 'How long does delivery take?',
    a: 'We deliver within 30 minutes for standard orders in Ile-Ife. Custom orders may take longer.'
  },
  {
    q: 'Do you take bulk or event orders?',
    a: 'Absolutely! We love catering for events. Use the custom order form or message us directly.'
  },
  {
    q: 'What are your operating hours?',
    a: 'We are open Monday to Saturday, 8am to 9pm. Sunday orders by prior arrangement.'
  },
]

const CONTACT_INFO =[
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    ),
    label: 'WhatsApp',
    value: '+234 902 970 2549',
    sub: 'Chat with us instantly',
    href: 'https://wa.me/2349029702549',
    color: '#25d366',
    bg: 'rgba(37,211,102,0.08)',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/>
      </svg>
    ),
    label: 'Email',
    value: 'hello@sweethub.ng',
    sub: 'We reply within the hour',
    href: 'mailto:hello@sweethub.ng',
    color: '#c0392b',
    bg: 'rgba(192,57,43,0.08)',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/>
      </svg>
    ),
    label: 'Location',
    value: 'Ile-Ife, Osun State',
    sub: 'Nigeria',
    href: 'https://maps.google.com/?q=Ile-Ife,Osun,Nigeria',
    color: '#e67e22',
    bg: 'rgba(230,126,34,0.08)',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path d="M520-496v-184q0-17-11.5-28.5T480-720q-17 0-28.5 11.5T440-680v192q0 8 3 15.5t9 13.5l132 132q11 11 28 11t28-11q11-11 11-28t-11-28L520-496ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
      </svg>
    ),
    label: 'Hours',
    value: 'Mon – Sat, 8am – 9pm',
    sub: 'Sunday by arrangement',
    href: null,
    color: '#8e44ad',
    bg: 'rgba(142,68,173,0.08)',
  },
]

export default function ContactPage() {
  const[form, setForm] = useState({
    name: '', phone: '', subject: '', message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const[openFaq, setOpenFaq] = useState(null)

  const handle = (e) => setForm({ ...form,[e.target.name]: e.target.value })

  const handleSubmit = () => {
    if (!form.name || !form.message) return

    const msg =
      `Hello SweetHUB! I'd like to get in touch.\n\n` +
      `*Name:* ${form.name}\n` +
      `${form.phone   ? `*Phone:* ${form.phone}\n`     : ''}` +
      `${form.subject ? `*Subject:* ${form.subject}\n` : ''}` +
      `\n*Message:*\n${form.message}\n\n` +
      `Sent via sweethubs.netlify.app`

    window.open(
      `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`,
      '_blank'
    )
    setSubmitted(true)
  }

  const reset = () => {
    setForm({ name: '', phone: '', subject: '', message: '' })
    setSubmitted(false)
  }

  return (
    <>
      <main className="contact-page">

        {/* ── Hero banner ── */}
        <div className="contact-hero">
          <div className="contact-hero-inner">
            <div className="contact-breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <span>Contact</span>
            </div>
            <h1 className="contact-hero-title">
              Let's <em>Talk</em>
            </h1>
            <p className="contact-hero-sub">
              Got a question, a bulk order, or just want to say hi?
              We're always happy to hear from you. We respond fast — usually within minutes.
            </p>
          </div>

          {/* Decorative blobs */}
          <div className="contact-hero-blob contact-hero-blob-1" aria-hidden="true" />
          <div className="contact-hero-blob contact-hero-blob-2" aria-hidden="true" />
        </div>

        {/* ── Contact info cards ── */}
        <div className="contact-cards-section">
          <div className="contact-cards-inner">
            {CONTACT_INFO.map(item => (
              <div key={item.label} className="contact-info-card">
                {item.href ? (
                  /* FIX 1: Added <a tag here */
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="cic-link"
                  >
                    <div className="cic-icon" style={{ color: item.color, background: item.bg }}>
                      {item.icon}
                    </div>
                    <div className="cic-text">
                      <span className="cic-label">{item.label}</span>
                      <span className="cic-value">{item.value}</span>
                      <span className="cic-sub">{item.sub}</span>
                    </div>
                    <div className="cic-arrow" style={{ color: item.color }}>→</div>
                  </a>
                ) : (
                  <div className="cic-link">
                    <div className="cic-icon" style={{ color: item.color, background: item.bg }}>
                      {item.icon}
                    </div>
                    <div className="cic-text">
                      <span className="cic-label">{item.label}</span>
                      <span className="cic-value">{item.value}</span>
                      <span className="cic-sub">{item.sub}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Main two-column section ── */}
        <div className="contact-main">
          <div className="contact-main-inner">

            {/* LEFT — form */}
            <div className="contact-form-wrap">
              <div className="contact-form-header">
                <h2 className="contact-form-title">Send us a message</h2>
                <p className="contact-form-sub">
                  Fill in the form and we'll open WhatsApp with your message pre-filled.
                  Super fast, no waiting.
                </p>
              </div>

              {submitted ? (
                <div className="contact-success">
                  <div className="contact-success-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="currentColor">
                      <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
                    </svg>
                  </div>
                  <h3>WhatsApp opened!</h3>
                  <p>Your message has been pre-filled in WhatsApp. Just hit send and we'll reply shortly.</p>
                  <button className="contact-reset-btn" onClick={reset}>
                    Send another message
                  </button>
                </div>
              ) : (
                <div className="contact-form">
                  <div className="contact-form-row">
                    <div className="contact-field">
                      <label>Your Name *</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handle}
                        placeholder="e.g. Amaka Johnson"
                        autoFocus
                      />
                    </div>
                    <div className="contact-field">
                      <label>Phone Number</label>
                      <input
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handle}
                        placeholder="e.g. 08012345678"
                      />
                    </div>
                  </div>

                  <div className="contact-field">
                    <label>Subject</label>
                    <input
                      name="subject"
                      value={form.subject}
                      onChange={handle}
                      placeholder="e.g. Bulk order for event, Custom cake enquiry..."
                    />
                  </div>

                  <div className="contact-field">
                    <label>Message *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handle}
                      placeholder="Tell us what you need. The more detail, the better we can help!"
                      rows={5}
                    />
                  </div>

                  {/* Quick subject chips */}
                  <div className="contact-chips">
                    <span className="contact-chips-label">Quick topics:</span>
                    {['Bulk Order', 'Custom Cake', 'Delivery Query', 'General Enquiry', 'Partnership'].map(chip => (
                      <button
                        key={chip}
                        className="contact-chip"
                        onClick={() => setForm({ ...form, subject: chip })}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  <button
                    className="contact-submit"
                    onClick={handleSubmit}
                    disabled={!form.name || !form.message}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Send via WhatsApp
                  </button>

                  <p className="contact-note">
                    * Required fields. Your message opens directly in WhatsApp.
                  </p>
                </div>
              )}
            </div>

            {/* RIGHT — map + FAQ */}
            <div className="contact-right">

              {/* Map visual */}
              <div className="contact-map-wrap">
                <div className="contact-map-header">
                  <div className="contact-map-dot" />
                  <span>We're located in Ile-Ife, Osun State</span>
                </div>
                <iframe
                  className="contact-map"
                  title="SweetHUB Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31694.35834699744!2d4.5557!3d7.4667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1039f26da5a4d2a5%3A0x6e4b7a5d7d4c58c4!2sIle-Ife%2C%20Osun%20State%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1234567890"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                
                {/* FIX 2: Added <a tag here */}
                <a
                  href="https://maps.google.com/?q=Ile-Ife,Osun,Nigeria"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-map-link"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
                    <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/>
                  </svg>
                  Open in Google Maps
                </a>
              </div>

              {/* FAQ accordion */}
              <div className="contact-faq">
                <h3 className="contact-faq-title">Quick Answers</h3>
                {FAQS.map((faq, i) => (
                  <div
                    key={i}
                    className={`contact-faq-item ${openFaq === i ? 'open' : ''}`}
                  >
                    <button
                      className="contact-faq-q"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      aria-expanded={openFaq === i}
                    >
                      <span>{faq.q}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="currentColor"
                        className="faq-chevron"
                      >
                        <path d="M480-360 280-560h400L480-360Z"/>
                      </svg>
                    </button>
                    {openFaq === i && (
                      <div className="contact-faq-a">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* ── Bottom WhatsApp CTA ── */}
        <div className="contact-wa-cta">
          <div className="contact-wa-cta-inner">
            <div className="contact-wa-cta-text">
              <h2>Prefer to chat directly?</h2>
              <p>Skip the form — open WhatsApp and talk to us right now. We're always online.</p>
            </div>
            
            {/* FIX 3: Added <a tag here */}
            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hello SweetHUB! I'd like to make an enquiry.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-wa-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 0 24 24" width="22px" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Chat on WhatsApp Now
            </a>
          </div>
        </div>

      </main>

      <Footer />
    </>
  )
}