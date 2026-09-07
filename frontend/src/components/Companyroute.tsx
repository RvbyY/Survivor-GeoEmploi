import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/Authcontext'
import type { ReactNode } from 'react'

export default function Companyroute({ children }: { children: ReactNode }) {
  const { isLoggedIn, accountType } = useAuth()

  if (!isLoggedIn || accountType !== 'employer') {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}