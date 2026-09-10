import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/Authcontext'
import { useListings } from '../context/Listingscontext'
import { useApplications } from '../context/Applicationscontext'

export default function Profil() {
  const { user, accountType, logout, updateUser } = useAuth()
  const { listings, removeListing } = useListings()
  const { applications } = useApplications()

  const [isEditing, setIsEditing] = useState(false)

  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [companyName, setCompanyName] = useState(
    user?.companyName ?? ''
  )
  const [saveError, setSaveError] = useState('')

  if (!user || !accountType) {
    return (
      <main className="profile-page">
        <div className="profile-empty">
          <h1>Vous n'êtes pas connecté</h1>

          <p>
            Connectez-vous pour accéder à votre profil.
          </p>

          <Link to="/login" className="btn btn--primary">
            Se connecter
          </Link>
        </div>
      </main>
    )
  }

  const myApplications = applications.filter(
    (application) => application.userEmail === user.email
  )

  const myListings = listings.filter(
    (listing) => listing.company === user.companyName
  )

  function handleEdit() {
    if (!user) {
      return
    }

    setName(user.name)
    setEmail(user.email)
    setCompanyName(user.companyName ?? '')
    setIsEditing(true)
  }

  function handleCancel() {
    if (!user) {
      return
    }

    setName(user.name)
    setEmail(user.email)
    setCompanyName(user.companyName ?? '')
    setIsEditing(false)
  }

  async function handleSave() {
    setSaveError('')

    try {
      await updateUser({
        name: name.trim(),
        email: email.trim(),
        companyName:
          accountType === 'employer'
            ? companyName.trim()
            : null,
      })
      setIsEditing(false)
    } catch {
      setSaveError('Impossible de sauvegarder les modifications.')
    }
  }

  return (
    <main className="profile-page">
      <div className="profile-container">

        {/* PROFILE INFORMATION */}
        <section className="profile-header">

          <div className="profile-header__info">

            <p className="profile-header__eyebrow">
              {accountType === 'employer'
                ? 'ESPACE EMPLOYEUR'
                : 'ESPACE CANDIDAT'}
            </p>

            {isEditing ? (
              <div className="profile-edit-form">

                <label>
                  <span>Nom</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                  />
                </label>

                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                  />
                </label>

                {accountType === 'employer' && (
                  <label>
                    <span>Entreprise</span>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(event) =>
                        setCompanyName(event.target.value)
                      }
                    />
                  </label>
                )}

              </div>
            ) : (
              <>
                <h1>{user.name}</h1>

                <p className="profile-header__email">
                  {user.email}
                </p>

                {accountType === 'employer' &&
                  user.companyName && (
                    <p className="profile-header__company">
                      {user.companyName}
                    </p>
                  )}
              </>
            )}

          </div>

          <div className="profile-header__actions">

            {isEditing ? (
              <>
                <button
                  className="btn btn--secondary"
                  onClick={handleCancel}
                >
                  Annuler
                </button>

                <button
                  className="btn btn--primary"
                  onClick={handleSave}
                  disabled={!name.trim() || !email.trim()}
                >
                  Enregistrer
                </button>
                {saveError && <p role="alert">{saveError}</p>}
              </>
            ) : (
              <button
                className="btn btn--primary"
                onClick={handleEdit}
              >
                Modifier le profil
              </button>
            )}

            <button
              className="btn btn--secondary"
              onClick={logout}
            >
              Déconnexion
            </button>

          </div>

        </section>

        {/* EMPLOYER */}
        {accountType === 'employer' ? (
          <section className="profile-section">

            <div className="profile-section__heading">
              <div>
                <p className="profile-section__eyebrow">
                  GESTION
                </p>

                <h2>Mes offres</h2>
              </div>

              <span className="profile-count">
                {myListings.length}
              </span>
            </div>

            {myListings.length === 0 ? (
              <div className="profile-empty-section">

                <h3>Aucune offre publiée</h3>

                <p>
                  Vous n'avez actuellement aucune offre
                  associée à votre entreprise.
                </p>

                <Link
                  to="/publier"
                  className="btn btn--primary"
                >
                  Publier une offre
                </Link>

              </div>
            ) : (
              <div className="profile-list">

                {myListings.map((listing) => {
                  const listingApplications =
                    applications.filter(
                      (application) =>
                        application.listingId === listing.id
                    )

                  return (
                    <article
                      className="profile-list__item"
                      key={listing.id}
                    >
                      <div className="profile-list__content">

                        <p className="profile-list__company">
                          {listing.company}
                        </p>

                        <h3>{listing.title}</h3>

                        <p className="profile-list__location">
                          {listing.address}
                        </p>

                      </div>

                     <div className="profile-list__actions">

                        <div className="profile-applications">
                          {listingApplications.length === 0 ? (
                            <span className="profile-badge">
                              Aucune candidature
                            </span>
                          ) : (
                            listingApplications.map((application) => (
                              <div key={application.id} className="profile-application">
                                <strong>{application.userName}</strong>
                                <span>{application.userEmail}</span>

                                <span
                                  className={`profile-status profile-status--${application.status}`}
                                >
                                  {application.status === 'pending' && 'En attente'}
                                  {application.status === 'accepted' && 'Acceptée'}
                                  {application.status === 'rejected' && 'Refusée'}
                                </span>
                              </div>
                            ))
                          )}
                        </div>

                        <Link
                          to={`/offres/${listing.id}`}
                          className="btn btn--secondary"
                        >
                          Voir l'offre
                        </Link>

                        <button
                          className="btn btn--secondary"
                          onClick={() => removeListing(listing.id)}
                        >
                          Supprimer
                        </button>

                      </div>
                    </article>
                  )
                })}

              </div>
            )}

          </section>
        ) : (
          /* JOBSEEKER */
          <section className="profile-section">

            <div className="profile-section__heading">

              <div>
                <p className="profile-section__eyebrow">
                  SUIVI
                </p>

                <h2>Mes candidatures</h2>
              </div>

              <span className="profile-count">
                {myApplications.length}
              </span>

            </div>

            {myApplications.length === 0 ? (
              <div className="profile-empty-section">

                <h3>Aucune candidature</h3>

                <p>
                  Vous n'avez encore postulé à aucune offre.
                </p>

                <Link
                  to="/map"
                  className="btn btn--primary"
                >
                  Voir les offres
                </Link>

              </div>
            ) : (
              <div className="profile-list">

                {myApplications.map((application) => {

                  const currentListing = listings.find(
                    (item) =>
                      item.id === application.listingId
                  )

                  if (!currentListing) {
                    return null
                  }

                  return (
                    <article
                      className="profile-list__item"
                      key={application.id}
                    >
                      <div className="profile-list__content">

                        <p className="profile-list__company">
                          {currentListing.company}
                        </p>

                        <h3>{currentListing.title}</h3>

                        <p className="profile-list__location">
                          {currentListing.address}
                        </p>

                        <p className="profile-list__date">
                          Candidature du{' '}
                          {new Date(
                            application.createdAt
                          ).toLocaleDateString('fr-FR')}
                        </p>

                      </div>

                      <div className="profile-list__actions">

                        <span
                          className={`profile-status profile-status--${application.status}`}
                        >
                          {application.status === 'pending' &&
                            'En attente'}

                          {application.status === 'accepted' &&
                            'Acceptée'}

                          {application.status === 'rejected' &&
                            'Refusée'}
                        </span>

                        <Link
                          to={`/offre/${currentListing.id}`}
                          className="btn btn--secondary"
                        >
                          Voir l'offre
                        </Link>

                      </div>
                    </article>
                  )
                })}

              </div>
            )}

          </section>
        )}

      </div>
    </main>
  )
}