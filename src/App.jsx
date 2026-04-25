import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import NavbarMobile from './components/NavbarMobile'
import Hero from './components/Hero'
// import FryerAnimation from './components/FryerAnimation';
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
  return (
    <>
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
      {/* <FryerAnimation /> */}
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
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
