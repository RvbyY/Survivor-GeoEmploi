import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/Authcontext'
import type { ReactNode } from 'react'

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, accountType } = useAuth()

  if (!isLoggedIn || accountType !== 'admin') {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}