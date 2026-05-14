import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SEO from './components/SEO'
import Navbar from './components/Navbar'
import NavbarMobile from './components/NavbarMobile'
import Hero from './components/Hero'
import ChatStory from './components/ChatStory'
import Marquee from './components/Marquee'
import Gallery from './components/Gallery.jsx'
import GameTeaser from './components/GameTeaser.jsx'
import WhySweetHub from './components/WhySweetHub'
import Footer from './components/Footer'
import OrderSection from './components/OrderSection'
import OrderBanner from './components/OrderBanner'
import AboutUs from './pages/AboutUs'
import ReturnPage from './pages/ReturnPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import ContactPage from './pages/ContactPage'
import GamesPage from './pages/GamesPage'
import TrackOrderPage from './pages/TrackOrderPage'
import AdminPage from './pages/AdminPage'
import AuthModal from './components/AuthModal'
import { useAuth } from './hooks/useAuth'
import './App.css'


// ──────────────────────────────────────────────────────────────
// Layout wrappers — pure presentation, no hooks here
// ──────────────────────────────────────────────────────────────
function MainSite({
  cartCount, addToCart, showCountdown, setShowCountdown,
  user, displayName, avatar, onLogin, onSignup, onLogout,
}) {
     const homeSchema = [
    {
      "@context": "https://schema.org",
      "@type": ["FoodEstablishment", "LocalBusiness"],
      "name": "Jovlora",
      "description": "Handcrafted fresh snacks and baked goods delivered in under 30 minutes. Specialising in puff puff, chin-chin, cakes, meat pie, doughnuts and more.",
      "url": "https://sweethubs.netlify.app",
      "logo": "https://sweethubs.netlify.app/favicon.svg",
      "image": "https://sweethubs.netlify.app/og-image.jpg",
      "telephone": "+2349029702549",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Ile-Ife AP",
        "addressLocality": "Ile-Ife",
        "addressRegion": "Osun State",
        "addressCountry": "NG"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "7.4667",
        "longitude": "4.5557"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
          "opens": "08:00",
          "closes": "21:00"
        }
      ],
      "servesCuisine": ["Nigerian", "Pastry", "Snacks"],
      "priceRange": "₦100 - ₦5000"
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sweethubs.netlify.app/" },
        { "@type": "ListItem", "position": 2, "name": "Order", "item": "https://sweethubs.netlify.app/#order" }
      ]
    }
  ];

  return (
    <>
    <SEO 
        title="Artisan Snacks & Baked Goods, Made Fresh Daily" 
        description="Jovlora bakes Nigeria's favourite snacks — puff puff, chin-chin, meat pie, doughnuts and signature cakes, delivered to your door in Ile-Ife in under 30 minutes."
        schema={homeSchema}
      />
      <Navbar
        cartCount={cartCount}
        user={user}
        displayName={displayName}
        avatar={avatar}
        onLogin={onLogin}
        onSignup={onSignup}
        onLogout={onLogout}
      />
      <NavbarMobile
        cartCount={cartCount}
        user={user}
        displayName={displayName}
        avatar={avatar}
        onLogin={onLogin}
        onSignup={onSignup}
        onLogout={onLogout}
      />
      <Hero />
      <ChatStory />
      <Marquee />
      <OrderSection
        onAddToCart={addToCart}
        showCountdown={showCountdown}
        setShowCountdown={setShowCountdown}
      />
      <Gallery />
      <GameTeaser />
      <WhySweetHub />
      <Footer />
    </>
  )
}

function GamesLayout({ cartCount, user, displayName, avatar, onLogin, onSignup, onLogout }) {
  return (
    <>
      <Navbar cartCount={cartCount} user={user} displayName={displayName} avatar={avatar} onLogin={onLogin} onSignup={onSignup} onLogout={onLogout} />
      <NavbarMobile cartCount={cartCount} user={user} displayName={displayName} avatar={avatar} onLogin={onLogin} onSignup={onSignup} onLogout={onLogout} />
      <GamesPage onRequireLogin={onLogin} />
    </>
  )
}

function TrackOrderLayout({ cartCount, user, displayName, avatar, onLogin, onSignup, onLogout }) {
  return (
    <>
      <Navbar cartCount={cartCount} user={user} displayName={displayName} avatar={avatar} onLogin={onLogin} onSignup={onSignup} onLogout={onLogout} />
      <NavbarMobile cartCount={cartCount} user={user} displayName={displayName} avatar={avatar} onLogin={onLogin} onSignup={onSignup} onLogout={onLogout} />
      <TrackOrderPage />
    </>
  )
}

// ──────────────────────────────────────────────────────────────
// AppContent — owns auth + cart + auth modal state
// ──────────────────────────────────────────────────────────────
function AppContent() {
  // ✅ hooks live INSIDE the component (this was the main bug)
  const { user, displayName, avatar, signOut } = useAuth()

  const [cartItems, setCartItems] = useState([])
  const [showCountdown, setShowCountdown] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authTab, setAuthTab] = useState('login') // 'login' | 'signup'
  const [postOrderPrompt, setPostOrderPrompt] = useState(false)

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0)
  const addToCart = (items) => setCartItems(items)

  // Detect "back from WhatsApp" to show countdown + signup prompt
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') return
      const ordered = sessionStorage.getItem('sweethub_ordered')
      if (ordered !== 'true') return
      sessionStorage.removeItem('sweethub_ordered')
      setTimeout(() => {
        setShowCountdown(true)
        if (!user) {
          setTimeout(() => {
            setPostOrderPrompt(true)
            setAuthTab('signup')
            setAuthOpen(true)
          }, 3000)
        }
      }, 600)
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [user])

  const openLogin = () => {
    setPostOrderPrompt(false)
    setAuthTab('login')
    setAuthOpen(true)
  }
  const openSignup = () => {
    setPostOrderPrompt(false)
    setAuthTab('signup')
    setAuthOpen(true)
  }
  const handleLogout = async () => {
    await signOut()
  }

  const sharedNavProps = {
    user, displayName, avatar,
    onLogin: openLogin,
    onSignup: openSignup,
    onLogout: handleLogout,
  }

  return (
    <>
      <OrderBanner />

      <Routes>
        <Route
          path="/"
          element={
            <MainSite
              cartCount={cartCount}
              addToCart={addToCart}
              showCountdown={showCountdown}
              setShowCountdown={setShowCountdown}
              {...sharedNavProps}
            />
          }
        />
        <Route path="/privacy"     element={<PrivacyPage />} />
        <Route path="/terms"       element={<TermsPage />} />
        <Route path="/return"      element={<ReturnPage />} />
        <Route path="/contact"     element={<ContactPage />} />
        <Route path="/about"       element={<AboutUs />} />
        <Route path="/games"       element={<GamesLayout cartCount={cartCount} {...sharedNavProps} />} />
        <Route path="/track-order" element={<TrackOrderLayout cartCount={cartCount} {...sharedNavProps} />} />
        <Route path="/admin"       element={<AdminPage />} />
      </Routes>

      {/* ✅ One AuthModal, with the props AuthModal.jsx actually expects */}
      <AuthModal
        open={authOpen}
        mode={authTab}
        onClose={() => {
          setAuthOpen(false)
          setPostOrderPrompt(false)
        }}
      />
    </>
  )
}

export default function App() {
  return (
      <AppContent />
  )
}
