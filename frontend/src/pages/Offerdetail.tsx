import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/Authcontext'
import mockListings from '../data/mockListings'

export default function OfferDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()

  const listing = mockListings.find((item) => item.id === Number(id))

  if (!listing) {
    return (
      <div className="status-page">
        <h1>Offre introuvable</h1>
        <p>Cette offre n'existe plus ou a été retirée.</p>
        <div className="status-page__divider" />
        <Link to="/map">
          ← Retour aux offres
        </Link>
      </div>
    )
  }

  function handleApply() {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    // TODO: replace with a real call once the backend candidacy endpoint exists.
    alert('Candidature envoyée (démo) !')
  }

  return (
    <div className="offer-detail">
      <main className="offer-detail__content">
        <Link to="/map" className="offer-detail__back">
          ← Retour aux offres
        </Link>

        <p className="offer-detail__company">{listing.company}</p>
        <h1>{listing.title}</h1>
        <p className="offer-detail__summary">{listing.summary}</p>

        <button className="btn btn--primary offer-detail__apply" onClick={handleApply}>
          Postuler
        </button>
      </main>
    </div>
  )
}