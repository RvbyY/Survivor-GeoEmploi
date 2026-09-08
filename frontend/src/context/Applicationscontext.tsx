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

  return (
    <ApplicationsContext.Provider
      value={{
        applications,
        addApplication,
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