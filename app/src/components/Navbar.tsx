import { useState, useCallback } from 'react'
import './Navbar.css'

const links = [
  { label: 'Home', href: '#home', scrollToTop: true },
  { label: 'RSVP', href: '#rsvp' },
  { label: 'Story', href: '#story' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Registry', href: '#registry' },
  { label: 'Q&A', href: '#qa' },
  { label: 'Moments', href: '#moments' },
]

function smoothScroll(href: string, scrollToTop?: boolean) {
  if (scrollToTop) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  const el = document.querySelector(href)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <nav className="navbar">
      <div className="navbar-desktop">
        {links.map((link) => (
          <a
            key={link.label}
            className="navbar-link"
            href={link.href}
            onClick={(e) => {
              e.preventDefault()
              smoothScroll(link.href, link.scrollToTop)
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="navbar-mobile">
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <span />
          <span />
          <span />
        </button>

        {menuOpen && (
          <div className="navbar-overlay" onClick={closeMenu} />
        )}

        <div className={`navbar-sidebar ${menuOpen ? 'open' : ''}`}>
          <button
            className="navbar-close"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            &#10005;
          </button>
          <p className="navbar-sidebar-title">Vy &amp; Andy</p>
          {links.map((link) => (
            <a
              key={link.label}
              className="navbar-sidebar-link"
              href={link.href}
              onClick={(e) => {
                e.preventDefault()
                closeMenu()
                smoothScroll(link.href, link.scrollToTop)
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            className="navbar-sidebar-rsvp"
            href="#rsvp"
            onClick={(e) => {
              e.preventDefault()
              closeMenu()
              smoothScroll('#rsvp')
            }}
          >
            RSVP
          </a>
        </div>
      </div>
    </nav>
  )
}
