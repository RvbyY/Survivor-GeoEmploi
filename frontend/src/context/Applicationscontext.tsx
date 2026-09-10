import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from './Authcontext'

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected'

export type Application = {
  id: number
  listingId: number
  userId: number
  userName: string
  userEmail: string
  status: ApplicationStatus
  createdAt: string
}

interface ApplicationsContextType {
  applications: Application[]
  addApplication: (listingId: number, userEmail: string) => Promise<boolean>
  updateApplicationStatus: (id: number, status: ApplicationStatus) => Promise<void>
  removeApplication: (id: number) => Promise<void>
}

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(
  undefined
)

export function ApplicationsProvider({ children }: Readonly<{ children: ReactNode }>) {
  const { token } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])

  useEffect(() => {
    if (!token) {
      setApplications([])
      return
    }

    fetch('http://localhost:8080/candidacy', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Impossible de charger les candidatures')
        return response.json() as Promise<Application[]>
      })
      .then(setApplications)
      .catch(() => setApplications([]))
  }, [token])

  const addApplication = async (listingId: number, _userEmail: string) => {
    if (!token) return false

    const response = await fetch('http://localhost:8080/candidacy/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ listingId }),
    })
    if (response.status === 409) return false
    if (!response.ok) throw new Error('Impossible d’envoyer la candidature')

    const createdApplication = await response.json()
    setApplications((previous) => [{
      id: createdApplication.id,
      listingId,
      userId: createdApplication.candidate_id,
      userName: createdApplication.candidate_name,
      userEmail: _userEmail,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }, ...previous])
    return true
  }

  const updateApplicationStatus = async (id: number, status: ApplicationStatus) => {
    if (!token) return
    const response = await fetch('http://localhost:8080/candidacy/update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status }),
    })
    if (!response.ok) throw new Error('Impossible de mettre à jour la candidature')
    setApplications((previous) => previous.map((application) =>
      application.id === id ? { ...application, status } : application,
    ))
  }

  const removeApplication = async (id: number) => {
    if (!token) return
    const response = await fetch(`http://localhost:8080/candidacy/delete?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error('Impossible de supprimer la candidature')
    setApplications((previous) => previous.filter((application) => application.id !== id))
  }

  const contextValue = useMemo(
    () => ({ applications, addApplication, updateApplicationStatus, removeApplication }),
    [applications, token],
  )

  return (
    <ApplicationsContext.Provider value={contextValue}>
      {children}
    </ApplicationsContext.Provider>
  )
}

export function useApplications() {
  const ctx = useContext(ApplicationsContext)

  if (!ctx) {
    throw new Error(
      'useApplications must be used within ApplicationsProvider'
    )
  }

  return ctx
}