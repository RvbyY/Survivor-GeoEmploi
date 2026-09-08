import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/Authcontext'
import type { ReactNode } from 'react'

export default function Logedinroute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}