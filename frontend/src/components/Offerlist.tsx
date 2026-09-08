import { Link } from 'react-router-dom'
import type { Listing } from '../data/mockListings'
import { useAuth } from '../context/Authcontext';

type OfferListProps = {
  listings: Listing[]
  hoveredId: number | null
  onHover: (id: number | null) => void
  collapsed: boolean
}

function formatRelativeDate(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return ''

  const diffMs = date.getTime() - Date.now()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
  const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' })
  return rtf.format(diffDays, 'day')
}

function OfferList({ listings, hoveredId, onHover, collapsed }: OfferListProps) {
  const { isLoggedIn, accountType } = useAuth();

  return (
    <div className={collapsed ? 'offer-list offer-list--collapsed' : 'offer-list'}>
      <div className="offer-list__header">
        <span className="offer-list__count">{listings.length} offres</span>
        {isLoggedIn && accountType === 'employer' && (
          <Link to="/publier" className="offer-list__publish">
            Publier une offre
          </Link>
        )}
      </div>

      {listings.map((listing) => (
        <Link
          key={listing.id}
          to={`/offres/${listing.id}`}
          className={
            listing.id === hoveredId
              ? 'offer-card offer-card--active'
              : 'offer-card'
          }
          onMouseEnter={() => onHover(listing.id)}
          onMouseLeave={() => onHover(null)}
        >
          <p className="offer-card__company">
            {listing.company} · {formatRelativeDate(listing.date)}
          </p>
          <p className="offer-card__title">{listing.title}</p>
          <p className="offer-card__description">{listing.description}</p>
        </Link>
      ))}
    </div>
  )
}

export default OfferList