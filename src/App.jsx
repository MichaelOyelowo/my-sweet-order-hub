import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import NavbarMobile from './components/NavbarMobile'
import Hero from './components/Hero'
import ChatStory from './components/ChatStory'
import Marquee from './components/Marquee'
import LeadModal from './components/LeadModal'
import OrderSection from './components/OrderSection'
import './App.css'

function App() {
  const [cartItems, setCartItems] = useState([])
  const [showCountdown, setShowCountdown] = useState(false);
  // Check if user returned from WhatsApp
  useEffect(() => {
  const handleVisibility = () => {
    if (document.visibilityState === 'visible') {
      const ordered = sessionStorage.getItem('sweethub_ordered')
      if (ordered === 'true') {
        sessionStorage.removeItem('sweethub_ordered')
        setTimeout(() => setShowCountdown(true), 600)
      }
    }
  }
  document.addEventListener('visibilitychange', handleVisibility)
  return () => document.removeEventListener('visibilitychange', handleVisibility)
}, [])
const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0)

  const addToCart = (items) => {
    setCartItems(items)
  }

  return (
    <>
      <Navbar cartCount={cartCount} />
      <NavbarMobile cartCount={cartCount} />
      <Hero />
      <ChatStory />
      <Marquee />
      <LeadModal />
      <OrderSection
        onAddToCart={addToCart}
        showCountdown={showCountdown}
        setShowCountdown={setShowCountdown}
      />
    </>
  )
}

export default App


