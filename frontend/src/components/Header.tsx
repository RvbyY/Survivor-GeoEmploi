import { Link } from 'react-router-dom'
import BrandBlock from './Brandblock'
import { useAuth } from '../context/Authcontext'
import type { Listing } from '../data/mockListings'
import mockListings from '../data/mockListings'
import { useState } from 'react'

function Header() {
  const { isLoggedIn, logout } = useAuth()
  const [listings] = useState<Listing[]>(mockListings)

  return (
    <header className="app-header">
      <Link to="/">
          <BrandBlock />
      </Link>

      <nav className="app-header__nav">
        <Link to="/" className="app-header__link">
          Accueil
        </Link>

        <Link to="/map" className="app-header__link">
          Emplois
        </Link>
      </nav>

      <div className="app-header__account">
        {isLoggedIn ? (
          <button
            className="btn btn--secondary-on-dark"
            onClick={logout}
          >
            Se déconnecter
          </button>
        ) : (
          <Link
            to="/login"
            className="btn btn--secondary-on-dark"
          >
            Se connecter
          </Link>
        )}

        <span className="offer-count">
          {listings.length} offre{listings.length > 1 ? 's' : ''}
        </span>
      </div>
    </header>
  )
}

export default Header
