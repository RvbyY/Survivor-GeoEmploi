import { Link } from 'react-router-dom'
import type { Listing } from '../data/mockListings'

type OfferListProps = {
  listings: Listing[]
  hoveredId: number | null
  onHover: (id: number | null) => void
  collapsed: boolean
}

function OfferList({ listings, hoveredId, onHover, collapsed }: OfferListProps) {
  return (
    <div className={collapsed ? 'offer-list offer-list--collapsed' : 'offer-list'}>
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
          <p className="offer-card__company">{listing.company}</p>
          <p className="offer-card__title">{listing.title}</p>
          <p className="offer-card__summary">{listing.summary}</p>
        </Link>
      ))}
    </div>
  )
}

export default OfferList