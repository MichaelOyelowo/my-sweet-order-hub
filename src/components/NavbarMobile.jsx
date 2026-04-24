import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function NavbarMobile({ cartCount, user, displayName, avatar, onLogin, onSignup, onLogout }) {
  const navigate    = useNavigate()
  const location    = useLocation()
  const[menuOpen, setMenuOpen]     = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [switching, setSwitching]   = useState(false)

  // Added Icons to match Jumia style
  const links =[
    { label: 'Home', path: '/', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
    { label: 'Shop', path: '/#order', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg> },
    { label: 'Games', path: '/games', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect><path d="M6 12h4"></path><path d="M8 10v4"></path></svg> },
    { label: 'About', path: '/about', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> },
    { label: 'Contact', path: '/contact', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> },
    { label: 'Track Order', path: '/track-order', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg> },
  ]

  const handleNav = (path) => {
    setMenuOpen(false)
    setSearchOpen(false)
    if (path.startsWith('/#')) {
      const hash = path.substring(1)
      if (location.pathname !== '/') {
        navigate('/' + hash)
      } else {
        navigate(hash)
        const el = document.getElementById(hash.replace('#', ''))
        el?.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate(path)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' && (location.hash === '' || location.hash === '#')
    if (path.startsWith('/#')) return location.pathname === '/' && location.hash === path.substring(1)
    return location.pathname.startsWith(path)
  }

  const handleSwitch = async () => {
    if (!user) { onLogin(); setMenuOpen(false); return }
    setSwitching(true)
    await onLogout()
    setTimeout(() => setSwitching(false), 600)
  }

  return (
    <nav className="m-navbar" role="navigation">
      <div className="m-navbar-bar">
        <div className="m-navbar-logo">
          <img src={logo} alt="SweetHUB Logo" onClick={() => handleNav('/')} style={{ cursor: 'pointer' }} />
        </div>

        <div className="m-navbar-icons">
          <button className="m-icon-btn" onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false) }}>
            {searchOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
            )}
          </button>
          <button className="m-icon-btn m-cart" onClick={() => window.dispatchEvent(new Event('sweethub:openCart'))}>
            <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px"><path d="M223.5-103.5Q200-127 200-160t23.5-56.5Q247-240 280-240t56.5 23.5Q360-193 360-160t-23.5 56.5Q313-80 280-80t-56.5-23.5Zm400 0Q600-127 600-160t23.5-56.5Q647-240 680-240t56.5 23.5Q760-193 760-160t-23.5 56.5Q713-80 680-80t-56.5-23.5ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/></svg>
            {cartCount > 0 && <span className="m-cart-badge">{cartCount}</span>}
          </button>
          <button className="m-hamburger" onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false) }}>
            <span className={`m-bar ${menuOpen ? 'open' : ''}`} />
            <span className={`m-bar ${menuOpen ? 'open' : ''}`} />
            <span className={`m-bar ${menuOpen ? 'open' : ''}`} />
          </button>
        </div>
      </div>

      <div className={`m-search-bar ${searchOpen ? 'open' : ''}`}>
        <div className="m-search-inner">
          <div className="m-search-pill">
            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
            <input type="text" placeholder="Search snacks..." autoFocus={searchOpen} />
          </div>
        </div>
      </div>

      {/* ── NEW: Dark Overlay ── */}
      <div 
        className={`m-menu-overlay ${menuOpen ? 'open' : ''}`} 
        onClick={() => setMenuOpen(false)} 
      />

      {/* ── NEW: Side Drawer Menu ── */}
      <div className={`m-menu ${menuOpen ? 'open' : ''}`}>
        
        <div className="m-menu-header">
          <img src={logo} alt="Logo" onClick={() => handleNav('/')} />
          <button className="m-menu-close" onClick={() => setMenuOpen(false)}>×</button>
        </div>

        {/* ── Auth moved to top of drawer ── */}
        <div className="m-menu-auth">
          {user ? (
            <div className="m-menu-user-row">
              <div className="m-menu-user-info">
                {avatar ? (
                  <img src={avatar} alt={displayName} className="m-menu-avatar" />
                ) : (
                  <div className="m-menu-avatar-initial">{displayName?.charAt(0).toUpperCase()}</div>
                )}
                <div>
                  <p className="m-menu-user-name">{displayName}</p>
                  <p className="m-menu-user-email">{user.email}</p>
                </div>
              </div>
              <div className="m-menu-switch-wrap">
                <span className="m-menu-switch-label">{switching ? 'Signing out...' : 'Signed in'}</span>
                <button className={`auth-switch-btn ${user ? 'on' : 'off'} ${switching ? 'switching' : ''}`} onClick={handleSwitch}>
                  <span className="auth-switch-track"><span className="auth-switch-thumb" /></span>
                  <span className="auth-switch-label">{switching ? '...' : 'ON'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="m-menu-auth-btns">
              <button className="m-menu-login" onClick={() => { onLogin(); setMenuOpen(false) }}>Login</button>
              <button className="m-menu-signup" onClick={() => { onSignup(); setMenuOpen(false) }}>Sign Up Free</button>
            </div>
          )}
        </div>

        <ul className="m-menu-links">
          {links.map(({ label, path, icon }) => (
            <li key={label}>
              <a 
                href="#"
                className={isActive(path) ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); handleNav(path) }}
              >
                {icon}
                {label}
              </a>
            </li>
          ))}
        </ul>

        <button className="m-order-btn" onClick={() => handleNav('/#order')}>
          Order Now
        </button>
      </div>
    </nav>
  )
}