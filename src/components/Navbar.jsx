import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'

function Navbar({ cartCount }) {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { label: 'Home',    path: '/'       },
    { label: 'Shop',    path: '/#order' },
    { label: 'Games',   path: '/games'  },
    { label: 'About',   path: '/#about' },
    { label: 'Contact', path: '/#contact' },
  ]

  const handleNav = (path) => {
    setMenuOpen(false)
    if (path.startsWith('/#')) {
      // Scroll to section on homepage
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => {
          const el = document.getElementById(path.replace('/#', ''))
          el?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } else {
        const el = document.getElementById(path.replace('/#', ''))
        el?.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate(path)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path.split('#')[0]) && path !== '/'
  }

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">

        <div className="navbar-logo">
          <img
            src={logo}
            alt="SweetHUB Logo"
            onClick={() => handleNav('/')}
            style={{ cursor: 'pointer' }}
          />
        </div>

        <ul className="navbar-links" role="menubar" aria-label="Site links">
          {links.map(({ label, path }) => (
            <li key={label} role="none">
              <a
                role="menuitem"
                href="#"
                aria-current={isActive(path) ? 'page' : undefined}
                className={`
                  ${isActive(path) ? 'active' : ''}
                  ${label === 'Games' ? 'navbar-games-link' : ''}
                `}
                onClick={(e) => {
                  e.preventDefault()
                  handleNav(path)
                }}
              >
                {label === 'Games'}
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar-right">
          <div className="navbar-search" role="search">
            <label htmlFor="search-input" className="sr-only">Search snacks</label>
            <input
              id="search-input"
              type="text"
              placeholder="Search snacks..."
              aria-label="Search snacks"
            />
            <button className="search-icon" aria-label="Submit search">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#2c2323" aria-hidden="true" focusable="false">
                <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
              </svg>
            </button>
          </div>

          <button
            className="navbar-cart"
            aria-label={`Cart, ${cartCount} items`}
            onClick={() => window.dispatchEvent(new Event('sweethub:openCart'))}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#2c2323" aria-hidden="true" focusable="false">
              <path d="M223.5-103.5Q200-127 200-160t23.5-56.5Q247-240 280-240t56.5 23.5Q360-193 360-160t-23.5 56.5Q313-80 280-80t-56.5-23.5Zm400 0Q600-127 600-160t23.5-56.5Q647-240 680-240t56.5 23.5Q760-193 760-160t-23.5 56.5Q713-80 680-80t-56.5-23.5ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/>
            </svg>
            {cartCount > 0 && (
              <span className="cart-badge" aria-hidden="true">{cartCount}</span>
            )}
          </button>

          <button className="navbar-btn" onClick={() => handleNav('/#order')}>
            Order Now
          </button>
        </div>

      </div>
    </nav>
  )
}

export default Navbar