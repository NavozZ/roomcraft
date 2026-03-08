import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

/** useAuth — quick access to auth state in any component */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
