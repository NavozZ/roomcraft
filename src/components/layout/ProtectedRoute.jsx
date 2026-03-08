import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-wood-50 gap-4">
        <div className="w-8 h-8 border-2 border-wood-200 border-t-wood-500 rounded-full animate-spin" />
        <p className="font-display text-lg text-wood-400">Loading RoomCraft...</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/user'} replace />
  }

  return children
}