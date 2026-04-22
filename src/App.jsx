import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import NavbarMobile from './components/NavbarMobile'
import Hero from './components/Hero'
import ChatStory from './components/ChatStory'
import Marquee from './components/Marquee'
// import OrderSection from './components/OrderSection'
// import PuzzleGame from './components/PuzzleGame'
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
import './App.css'


function MainSite({ cartCount, addToCart, showCountdown, setShowCountdown }) {
  return (
    <>
      <Navbar cartCount={cartCount} />
      <NavbarMobile cartCount={cartCount} />
      <Hero />
      <ChatStory />
      <Marquee />
      <OrderSection
        onAddToCart={addToCart}
        showCountdown={showCountdown}
        setShowCountdown={setShowCountdown}
      />
      {/* <PuzzleGame /> */}
      <Gallery/>
      <GameTeaser/>
      <WhySweetHub />
      <Footer />
    </>
  )
}

// ── Games page wrapper (has its own navbar) ───────────────────
function GamesLayout({ cartCount }) {
  return (
    <>
      <Navbar cartCount={cartCount} />
      <NavbarMobile cartCount={cartCount} />
      <GamesPage />
    </>
  )
}

// --- Track Order Page ------------------------------------------------
function TrackOrderLayout({ cartCount}) {
  return (
    <>
      <Navbar cartCount={cartCount} />
      <NavbarMobile cartCount={cartCount} />
      <TrackOrderPage />
    </>
  )
}

// ── App — router + shared state ───────────────────────────────
function App() {
  const [cartItems, setCartItems]           = useState([])
  const [showCountdown, setShowCountdown]   = useState(false)

  // Show countdown when user returns from WhatsApp tab
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const ordered = sessionStorage.getItem('sweethub_ordered')
        if (ordered === 'true') {
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0)
  const addToCart = (items) => setCartItems(items)

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainSite
              cartCount={cartCount}
              addToCart={addToCart}
              showCountdown={showCountdown}
              setShowCountdown={setShowCountdown}
            />
          }
        />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/return" element={<ReturnPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/games" element={<GamesLayout cartCount={cartCount} />} />
        <Route path="/track-order" element={<TrackOrderLayout cartCount={cartCount} />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App