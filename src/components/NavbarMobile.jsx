import { useState } from 'react'
import logo from '../assets/logo.png'

function NavbarMobile() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [activeLink, setActiveLink] = useState('Home')
    const cartCount = 3

    const links = ['Home', 'Shop', 'Bundles', 'About', 'Contact']

    return(
        <nav className="m-navbar" role="navigation" aria-label="Mobile navigation">
            {/* ── Top bar ── */}
            <div className="m-navbar-bar">
                <div className="m-navbar-logo">
                    <img src={logo} alt="SweetHub Logo" />
                </div>
                <div className="m-navbar-icons">
                    {/* Search icon */}
                    <button
                        className="m-icon-btn"
                        aria-label={searchOpen ? 'Close search' : 'Open search'}
                        aria-expanded={searchOpen}
                        onClick={() => {
                        setSearchOpen(!searchOpen)
                        setMenuOpen(false)
                        }}
                    >
                    {searchOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" aria-hidden="true" focusable="false">
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                        </svg>
                        ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" aria-hidden="true" focusable="false">
                            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                        </svg>
                    )}
                    </button>

                    {/* Cart icon */}
                    <button
                        className="m-icon-btn m-cart"
                        aria-label={`Cart, ${cartCount} items`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" aria-hidden="true" focusable="false">
                        <path d="M223.5-103.5Q200-127 200-160t23.5-56.5Q247-240 280-240t56.5 23.5Q360-193 360-160t-23.5 56.5Q313-80 280-80t-56.5-23.5Zm400 0Q600-127 600-160t23.5-56.5Q647-240 680-240t56.5 23.5Q760-193 760-160t-23.5 56.5Q713-80 680-80t-56.5-23.5ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/>
                        </svg>
                        {cartCount > 0 && (
                        <span className="m-cart-badge" aria-hidden="true">{cartCount}</span>
                        )}
                    </button>

                    {/* Hamburger */}
                    <button
                        className="m-hamburger"
                        onClick={() => {
                        setMenuOpen(!menuOpen)
                        setSearchOpen(false)
                        }}
                        aria-expanded={menuOpen}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    >
                        <span className={`m-bar ${menuOpen ? 'open' : ''}`}></span>
                        <span className={`m-bar ${menuOpen ? 'open' : ''}`}></span>
                        <span className={`m-bar ${menuOpen ? 'open' : ''}`}></span>
                    </button>
                </div>
            </div>

            {/* ── Search bar — slides down ── */}
            <div className={`m-search-bar ${searchOpen ? 'open' : ''}`} aria-hidden={!searchOpen}>
            <div className="m-search-inner">
                <div className="m-search-pill">
                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" aria-hidden="true" focusable="false">
                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                </svg>
                <input
                    type="text"
                    placeholder="Search chocolates, chin-chin..."
                    aria-label="Mobile search"
                    autoFocus={searchOpen}
                />
                </div>
            </div>
            </div>

            {/* ── Menu — slides down ── */}
            <div className={`m-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen} id="mobile-menu">
                <ul role="menubar">
                {links.map(link => (
                    <li key={link} role="none">
                    <a
                        href="#"
                        role="menuitem"
                        className={activeLink === link ? 'active' : ''}
                        aria-current={activeLink === link ? 'page' : undefined}
                        onClick={() => {
                        setActiveLink(link)
                        setMenuOpen(false)
                        }}
                    >
                        {link}
                    </a>
                    </li>
                ))}
                </ul>
                <button className="m-order-btn">Order Now</button>
            </div>

        </nav>
    )
}

export default NavbarMobile