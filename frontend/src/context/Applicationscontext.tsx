import { createContext, useContext, useState, type ReactNode } from 'react'

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected'

export type Application = {
  id: number
  listingId: number
  userEmail: string
  status: ApplicationStatus
  createdAt: string
}

interface ApplicationsContextType {
  applications: Application[]
  addApplication: (listingId: number, userEmail: string) => boolean
  updateApplicationStatus: (id: number, status: ApplicationStatus) => void
  removeApplication: (id: number) => void
}

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(
  undefined
)

export function ApplicationsProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>([])

  const addApplication = (listingId: number, userEmail: string) => {
    const alreadyApplied = applications.some(
      (application) =>
        application.listingId === listingId &&
        application.userEmail === userEmail
    )

    if (alreadyApplied) {
      return false
    }

    const newApplication: Application = {
      id: Date.now(),
      listingId,
      userEmail,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    setApplications((prev) => [newApplication, ...prev])

    return true
  }

  const updateApplicationStatus = (id: number, status: ApplicationStatus) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
  }

  const removeApplication = (id: number) => {
    setApplications((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <ApplicationsContext.Provider
      value={{
        applications,
        addApplication,
        updateApplicationStatus,
        removeApplication
      }}
    >
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