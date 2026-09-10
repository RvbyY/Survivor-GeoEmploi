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
  updateUser: (userData: AuthUser) => Promise<void>
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

  const updateUser = async (userData: AuthUser) => {
    if (!session) throw new Error('Utilisateur non connecté')

    const response = await fetch('http://localhost:8080/users/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      throw new Error('Impossible de sauvegarder le profil')
    }

    const updatedUser = (await response.json()) as AuthUser
    setSession((currentSession) => {
      if (!currentSession) return null
      const nextSession = { ...currentSession, user: updatedUser }
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