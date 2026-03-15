import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0e0a06', gap: 16 }}>
        <div style={{ width: 32, height: 32, border: '2px solid rgba(166,124,82,0.2)', borderTop: '2px solid #A67C52', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.1rem', color: '#555' }}>Loading RoomCraft...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/user'} replace />
  }

  return children
}