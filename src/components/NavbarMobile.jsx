import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'

function NavbarMobile({ cartCount, user, displayName, avatar, onLogin, onSignup, onLogout }) {
  const navigate    = useNavigate()
  const location    = useLocation()
  const [menuOpen, setMenuOpen]     = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [switching, setSwitching]   = useState(false)

  const links = [
    { label: 'Home',        path: '/'           },
    { label: 'Shop',        path: '/#order'     },
    { label: 'Games',       path: '/games'      },
    { label: 'About',       path: '/about'      },
    { label: 'Contact',     path: '/contact'    },
    { label: 'Track Order', path: '/track-order'},
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
    <nav className="m-navbar" role="navigation" aria-label="Mobile navigation">

      {/* ── Top bar ── */}
      <div className="m-navbar-bar">
        <div className="m-navbar-logo">
          <img
            src={logo}
            alt="SweetHUB Logo"
            onClick={() => handleNav('/')}
            style={{ cursor: 'pointer' }}
          />
        </div>

        <div className="m-navbar-icons">

          {/* Search */}
          <button
            className="m-icon-btn"
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            aria-expanded={searchOpen}
            onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false) }}
          >
            {searchOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px">
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px">
                <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
              </svg>
            )}
          </button>

          {/* Cart */}
          <button
            className="m-icon-btn m-cart"
            aria-label={`Cart, ${cartCount} items`}
            onClick={() => window.dispatchEvent(new Event('sweethub:openCart'))}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px">
              <path d="M223.5-103.5Q200-127 200-160t23.5-56.5Q247-240 280-240t56.5 23.5Q360-193 360-160t-23.5 56.5Q313-80 280-80t-56.5-23.5Zm400 0Q600-127 600-160t23.5-56.5Q647-240 680-240t56.5 23.5Q760-193 760-160t-23.5 56.5Q713-80 680-80t-56.5-23.5ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/>
            </svg>
            {cartCount > 0 && <span className="m-cart-badge">{cartCount}</span>}
          </button>

          {/* Hamburger */}
          <button
            className="m-hamburger"
            onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false) }}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={`m-bar ${menuOpen ? 'open' : ''}`} />
            <span className={`m-bar ${menuOpen ? 'open' : ''}`} />
            <span className={`m-bar ${menuOpen ? 'open' : ''}`} />
          </button>

        </div>
      </div>

      {/* ── Search bar ── */}
      <div className={`m-search-bar ${searchOpen ? 'open' : ''}`} aria-hidden={!searchOpen}>
        <div className="m-search-inner">
          <div className="m-search-pill">
            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px">
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
            </svg>
            <input
              type="text"
              placeholder="Search snacks..."
              aria-label="Mobile search"
              autoFocus={searchOpen}
            />
          </div>
        </div>
      </div>

      {/* ── Menu ── */}
      <div className={`m-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <ul role="menubar">
          {links.map(({ label, path }) => (
            <li key={label} role="none">
              
              <a  href="#"
                role="menuitem"
                className={isActive(path) ? 'active' : ''}
                aria-current={isActive(path) ? 'page' : undefined}
                onClick={(e) => { e.preventDefault(); handleNav(path) }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* ── Auth section in menu ── */}
        <div className="m-menu-auth">
          {user ? (
            <div className="m-menu-user-row">
              {/* Avatar + name */}
              <div className="m-menu-user-info">
                {avatar ? (
                  <img src={avatar} alt={displayName} className="m-menu-avatar" />
                ) : (
                  <div className="m-menu-avatar-initial">
                    {displayName?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="m-menu-user-name">{displayName}</p>
                  <p className="m-menu-user-email">{user.email}</p>
                </div>
              </div>

              {/* Switch toggle */}
              <div className="m-menu-switch-wrap">
                <span className="m-menu-switch-label">
                  {switching ? 'Signing out...' : 'Signed in'}
                </span>
                <button
                  className={`auth-switch-btn ${user ? 'on' : 'off'} ${switching ? 'switching' : ''}`}
                  onClick={handleSwitch}
                  aria-label="Toggle sign out"
                >
                  <span className="auth-switch-track">
                    <span className="auth-switch-thumb" />
                  </span>
                  <span className="auth-switch-label">
                    {switching ? '...' : 'ON'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="m-menu-auth-btns">
              <button className="m-menu-login" onClick={() => { onLogin(); setMenuOpen(false) }}>
                Login
              </button>
              <button className="m-menu-signup" onClick={() => { onSignup(); setMenuOpen(false) }}>
                Sign Up Free
              </button>
            </div>
          )}
        </div>

        <button className="m-order-btn" onClick={() => handleNav('/#order')}>
          Order Now
        </button>
      </div>

    </nav>
  )
}

export default NavbarMobile