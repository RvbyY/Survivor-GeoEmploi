import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/Authcontext'
import { useListings } from '../context/Listingscontext'
import { useApplications } from '../context/Applicationscontext'

function formatFullDate(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return ''
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function OfferDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { isLoggedIn, user, accountType } = useAuth()
  const { listings } = useListings()
  const { applications, addApplication } = useApplications()

  const listing = listings.find((item) => item.id === Number(id))

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

  const alreadyApplied = Boolean(
    isLoggedIn &&
    user &&
    applications.some(
      (application) =>
        application.listingId === listing.id &&
        application.userEmail === user.email
    )
  )

  function handleApply() {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    if (accountType !== 'jobseeker') {
      alert('Seuls les candidats peuvent postuler à une offre.')
      return
    }

    if (!user) {
      return
    }

    if (!listing) {
      return
    }

    const success = addApplication(listing.id, user.email)

    if (!success) {
      alert('Vous avez déjà postulé à cette offre.')
      return
    }

    alert('Candidature envoyée !')
  }

  return (
    <div className="offer-detail">
      <main className="offer-detail__content">
        <Link to="/map" className="offer-detail__back">
          ← Retour aux offres
        </Link>

        <p className="offer-detail__company">
          {listing.company}
        </p>

        <h1>{listing.title}</h1>

        <p className="offer-detail__summary">
          {listing.description}
        </p>

        <br />
        <p className="offer-detail__date">
          Publié le {formatFullDate(listing.date)}
        </p>

        <button
          className="btn btn--primary offer-detail__apply"
          onClick={handleApply}
          disabled={alreadyApplied}
        >
          {alreadyApplied ? 'Candidature envoyée' : 'Postuler'}
        </button>
      </main>
    </div>
  )
}