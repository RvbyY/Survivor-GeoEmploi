import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useAuth } from './Authcontext'

export type AccountType = 'jobseeker' | 'employer' | 'admin'

export type Account = {
  id: number
  name: string
  email: string
  accountType: AccountType
  companyName: string | null
}

interface AccountsContextType {
  accounts: Account[]
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
  updateAccountType: (id: number, accountType: AccountType) => void
  removeAccount: (id: number) => void
}

const AccountsContext = createContext<AccountsContextType | undefined>(undefined)

export function AccountsProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:8080/users')
      if (!response.ok) throw new Error('Failed to load accounts')
      const data = await response.json()
      setAccounts(
        data.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          accountType: u.accountType,
          companyName: u.companyName,
        }))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  // NOTE: local-only until the backend accepts a target id + checks admin role
  // (updateUser/deleteUser currently only act on the caller's own JWT id)
  const updateAccountType = (id: number, accountType: AccountType) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, accountType } : a)))
  }

  const removeAccount = (id: number) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <AccountsContext.Provider value={{ accounts, isLoading, error, refresh, updateAccountType, removeAccount }}>
      {children}
    </AccountsContext.Provider>
  )
}

export function useAccounts() {
  const ctx = useContext(AccountsContext)
  if (!ctx) throw new Error('useAccounts must be used within AccountsProvider')
  return ctx
}