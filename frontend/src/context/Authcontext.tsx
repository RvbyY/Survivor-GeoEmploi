import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type AccountType = 'jobseeker' | 'employer' | 'admin'

interface AuthUser {
  email: string
  name: string
  companyName: string | null
}

interface AuthContextType {
  isLoggedIn: boolean
  accountType: AccountType | null
  user: AuthUser | null
  token: string | null
  login: (accountType: AccountType, user: AuthUser, token: string) => void
  logout: () => void
  updateUser: (userData: AuthUser) => void
}

type StoredSession = {
  accountType: AccountType
  user: AuthUser
  token: string
}

const sessionStorageKey = 'geoemploi-auth-session'

function readStoredSession(): StoredSession | null {
  const storedSession = localStorage.getItem(sessionStorageKey)
  if (!storedSession) return null

  try {
    const session = JSON.parse(storedSession) as StoredSession
    if (!session.accountType || !session.user || !session.token) return null
    return session
  } catch {
    localStorage.removeItem(sessionStorageKey)
    return null
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [session, setSession] = useState<StoredSession | null>(readStoredSession)

  const login = (type: AccountType, userData: AuthUser, authToken: string) => {
    const nextSession = { accountType: type, user: userData, token: authToken }
    localStorage.setItem(sessionStorageKey, JSON.stringify(nextSession))
    setSession(nextSession)
  }

  const updateUser = (userData: AuthUser) => {
    setSession((currentSession) => {
      if (!currentSession) return null
      const nextSession = { ...currentSession, user: userData }
      localStorage.setItem(sessionStorageKey, JSON.stringify(nextSession))
      return nextSession
    })
  }

  const logout = () => {
    localStorage.removeItem(sessionStorageKey)
    setSession(null)
  }

  const contextValue = useMemo(
    () => ({
      isLoggedIn: session !== null,
      accountType: session?.accountType ?? null,
      user: session?.user ?? null,
      token: session?.token ?? null,
      login,
      logout,
      updateUser,
    }),
    [session],
  )

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}