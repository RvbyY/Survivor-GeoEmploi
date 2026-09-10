import { Link } from 'react-router-dom'
import BrandBlock from './Brandblock'
import { useAuth } from '../context/Authcontext'
import { useListings } from '../context/Listingscontext'

function Header() {
  const { isLoggedIn, accountType } = useAuth()
  const { listings } = useListings()

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
          <Link
            className="btn btn--secondary-on-dark"
            to={accountType === 'admin' ? '/admin' : '/profil'}
          >
            {accountType === 'admin' ? 'Administration' : 'Profil'}
          </Link>
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