import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => { logout(); navigate('/') }
  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-wood-50/90 backdrop-blur-md border-b border-wood-200 z-50 shadow-wood-sm">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between gap-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline flex-shrink-0">
          <span className="text-2xl">🪑</span>
          <span className="font-display text-2xl font-semibold text-wood-700 tracking-tight">
            RoomCraft
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1 flex-1">
          {!user && (
            <Link to="/"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all no-underline
                ${isActive('/') && location.pathname === '/'
                  ? 'text-wood-700 bg-wood-100'
                  : 'text-wood-500 hover:text-wood-700 hover:bg-wood-100'}`}>
              Home
            </Link>
          )}

          {user?.role === 'admin' && (<>
            <Link to="/admin"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all no-underline
                ${isActive('/admin') ? 'text-wood-700 bg-wood-100' : 'text-wood-500 hover:text-wood-700 hover:bg-wood-100'}`}>
              My Designs
            </Link>
            <Link to="/admin/room-setup"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all no-underline
                ${isActive('/admin/room-setup') ? 'text-wood-700 bg-wood-100' : 'text-wood-500 hover:text-wood-700 hover:bg-wood-100'}`}>
              + New Design
            </Link>
          </>)}

          {user?.role === 'user' && (<>
            <Link to="/user"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all no-underline
                ${isActive('/user') ? 'text-wood-700 bg-wood-100' : 'text-wood-500 hover:text-wood-700 hover:bg-wood-100'}`}>
              Browse
            </Link>
            <Link to="/user/room-setup"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all no-underline
                ${isActive('/user/room-setup') ? 'text-wood-700 bg-wood-100' : 'text-wood-500 hover:text-wood-700 hover:bg-wood-100'}`}>
              My Room
            </Link>
          </>)}
        </div>

        {/* Auth area */}
        {user ? (
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-wood-500 text-white flex items-center justify-center text-sm font-semibold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-medium text-wood-800 leading-tight">{user.name}</span>
              <span className="text-xs text-wood-400 leading-tight">
                {user.role === 'admin' ? '🎨 Designer' : '🏠 Customer'}
              </span>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link to="/login"    className="btn btn-ghost btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  )
}