import { Link } from 'react-router-dom'
import BrandBlock from './Brandblock'
import { useAuth } from '../context/Authcontext'
import type { Listing } from '../data/mockListings'
import mockListings from '../data/mockListings'
import { useState } from 'react'

interface HeaderProps {
  offerCount: number
}

function Header({ offerCount }: HeaderProps) {
  const { isLoggedIn, logout } = useAuth()
  const [listings] = useState<Listing[]>(mockListings)

  return (
    <header className="app-header">
      <BrandBlock />

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
    </header>
  )
}

export default Header