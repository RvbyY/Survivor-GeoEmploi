import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useListings } from '../context/Listingscontext'
import { useApplications, type ApplicationStatus } from '../context/Applicationscontext'
import { useAccounts, type AccountType } from '../context/Accountscontext'
import { useReports } from '../context/Reportscontext'
import { useAuth } from '../context/Authcontext'

type Tab = 'offers' | 'applications' | 'accounts' | 'reports'

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('offers')
  const { listings, removeListing } = useListings()
  const { applications, updateApplicationStatus, removeApplication } = useApplications()
  const { accounts, isLoading, error, updateAccountType, removeAccount } = useAccounts()
  const { reports, updateReportStatus, removeReport } = useReports()
  const { logout } = useAuth();

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Administration</h1>

        <button
          className="btn btn--primary"
          onClick={logout}
        >
          Déconnexion
        </button>
      </div>
      <div className="admin-tabs">
        <button className={tab === 'offers' ? 'admin-tab admin-tab--active' : 'admin-tab'} onClick={() => setTab('offers')}>
          Offres ({listings.length})
        </button>
        <button className={tab === 'applications' ? 'admin-tab admin-tab--active' : 'admin-tab'} onClick={() => setTab('applications')}>
          Candidatures ({applications.length})
        </button>
        <button className={tab === 'accounts' ? 'admin-tab admin-tab--active' : 'admin-tab'} onClick={() => setTab('accounts')}>
          Comptes ({accounts.length})
        </button>
        <button className={tab === 'reports' ? 'admin-tab admin-tab--active' : 'admin-tab'} onClick={() => setTab('reports')}>
          Signalements ({reports.filter((r) => r.status === 'pending').length})
        </button>
      </div>

      {tab === 'offers' && (
        <table className="admin-table">
          <thead>
            <tr><th>Titre</th><th>Entreprise</th><th>Adresse</th><th></th></tr>
          </thead>
          <tbody>
            {listings.map((l) => (
              <tr key={l.id}>
                <td>{l.title}</td>
                <td>{l.company}</td>
                <td>{l.address}</td>
                <td>
                  <Link to={`/offres/${l.id}`} className="btn btn--secondary">Voir</Link>
                  <button onClick={() => removeListing(l.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === 'applications' && (
        <table className="admin-table">
          <thead>
            <tr><th>Candidat</th><th>Offre</th><th>Statut</th><th></th></tr>
          </thead>
          <tbody>
            {applications.map((a) => {
              const offer = listings.find((l) => l.id === a.listingId)
              return (
                <tr key={a.id}>
                  <td>{a.userEmail}</td>
                  <td>{offer?.title ?? `Offre #${a.listingId}`}</td>
                  <td>
                    <select
                      value={a.status}
                      onChange={(e) => updateApplicationStatus(a.id, e.target.value as ApplicationStatus)}
                    >
                      <option value="pending">En attente</option>
                      <option value="accepted">Acceptée</option>
                      <option value="rejected">Refusée</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => removeApplication(a.id)}>Supprimer</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}

      {tab === 'accounts' && (
        <>
          {isLoading && <p>Chargement...</p>}
          {error && <p className="admin-error">{error}</p>}
          <table className="admin-table">
            <thead>
              <tr><th>Nom</th><th>E-mail</th><th>Rôle</th><th></th></tr>
            </thead>
            <tbody>
              {accounts.map((acc) => (
                <tr key={acc.id}>
                  <td>{acc.name}</td>
                  <td>{acc.email}</td>
                  <td>
                    <select
                      value={acc.accountType}
                      onChange={(e) => updateAccountType(acc.id, e.target.value as AccountType)}
                    >
                      <option value="jobseeker">Candidat</option>
                      <option value="employer">Employeur</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => removeAccount(acc.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === 'reports' && (
        <table className="admin-table">
          <thead>
            <tr><th>Offre</th><th>Motif</th><th>Commentaire</th><th>Statut</th><th></th></tr>
          </thead>
          <tbody>
            {reports.map((r) => {
              const offer = listings.find((l) => l.id === r.offerId)
              return (
                <tr key={r.id}>
                  <td>{offer?.title ?? `Offre #${r.offerId}`}</td>
                  <td>{r.reason}</td>
                  <td>{r.comment || '—'}</td>
                  <td>{r.status === 'pending' ? 'En attente' : r.status === 'resolved' ? 'Résolu' : 'Rejeté'}</td>
                  <td>
                    <button onClick={() => updateReportStatus(r.id, 'resolved')}>Résoudre</button>
                    <button onClick={() => updateReportStatus(r.id, 'dismissed')}>Rejeter</button>
                    <button onClick={() => removeReport(r.id)}>Supprimer</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}