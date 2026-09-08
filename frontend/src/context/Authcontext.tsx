import { createContext, useContext, useState, type ReactNode } from 'react'

type AccountType = 'jobseeker' | 'employer'

interface AuthUser {
  email: string
  name: string
  companyName: string | null
}

interface AuthContextType {
  isLoggedIn: boolean
  accountType: AccountType | null
  user: AuthUser | null
  login: (accountType: AccountType, user: AuthUser) => void
  logout: () => void
  updateUser: (userData: AuthUser) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [accountType, setAccountType] = useState<AccountType | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)

  const login = (type: AccountType, userData: AuthUser) => {
    setIsLoggedIn(true)
    setAccountType(type)
    setUser(userData)
  }

  const updateUser = (userData: AuthUser) => {
    setUser(userData)
  }

  const logout = () => {
    setIsLoggedIn(false)
    setAccountType(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, accountType, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}