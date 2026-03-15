import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => { logout(); navigate('/') }
  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/')

  const isLanding = location.pathname === '/'

  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, height: 64,
    zIndex: 50, transition: 'all 0.3s',
    background: scrolled || !isLanding
      ? 'rgba(14,10,6,0.85)'
      : 'transparent',
    backdropFilter: scrolled || !isLanding ? 'blur(16px)' : 'none',
    borderBottom: scrolled || !isLanding ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
    boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
  }

  const linkBase = {
    padding: '6px 14px', borderRadius: 8, fontSize: '0.875rem',
    fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s',
  }
  const linkActive = { ...linkBase, color: '#C8A882', background: 'rgba(166,124,82,0.12)' }
  const linkIdle   = { ...linkBase, color: '#888', }

  return (
    <nav style={navStyle}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ fontSize: '1.4rem' }}>🪑</span>
          <span style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.5rem', fontWeight: 600, color: '#FAF7F2', letterSpacing: '-0.01em' }}>
            RoomCraft
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
          {!user && (
            <Link to="/" style={isActive('/') && location.pathname === '/' ? linkActive : linkIdle}
              onMouseEnter={e => { if (!isActive('/') || location.pathname !== '/') e.currentTarget.style.color = '#FAF7F2' }}
              onMouseLeave={e => { if (!isActive('/') || location.pathname !== '/') e.currentTarget.style.color = '#888' }}>
              Home
            </Link>
          )}
          {user?.role === 'admin' && (<>
            <Link to="/admin" style={isActive('/admin') ? linkActive : linkIdle}
              onMouseEnter={e => { if (!isActive('/admin')) e.currentTarget.style.color = '#FAF7F2' }}
              onMouseLeave={e => { if (!isActive('/admin')) e.currentTarget.style.color = '#888' }}>
              My Designs
            </Link>
            <Link to="/admin/room-setup" style={isActive('/admin/room-setup') ? linkActive : linkIdle}
              onMouseEnter={e => { if (!isActive('/admin/room-setup')) e.currentTarget.style.color = '#FAF7F2' }}
              onMouseLeave={e => { if (!isActive('/admin/room-setup')) e.currentTarget.style.color = '#888' }}>
              + New Design
            </Link>
          </>)}
          {user?.role === 'user' && (<>
            <Link to="/user" style={isActive('/user') && location.pathname === '/user' ? linkActive : linkIdle}
              onMouseEnter={e => { if (location.pathname !== '/user') e.currentTarget.style.color = '#FAF7F2' }}
              onMouseLeave={e => { if (location.pathname !== '/user') e.currentTarget.style.color = '#888' }}>
              Browse
            </Link>
            <Link to="/user/room-setup" style={isActive('/user/room-setup') ? linkActive : linkIdle}
              onMouseEnter={e => { if (!isActive('/user/room-setup')) e.currentTarget.style.color = '#FAF7F2' }}
              onMouseLeave={e => { if (!isActive('/user/room-setup')) e.currentTarget.style.color = '#888' }}>
              My Room
            </Link>
          </>)}
        </div>

        {/* Auth */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#A67C52,#7A5230)', color: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700, boxShadow: '0 0 12px rgba(166,124,82,0.4)' }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#FAF7F2', lineHeight: 1.2 }}>{user.name}</span>
              <span style={{ fontSize: '0.68rem', color: '#666', lineHeight: 1.2 }}>{user.role === 'admin' ? '🎨 Designer' : '🏠 Customer'}</span>
            </div>
            <button onClick={handleLogout} style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#888', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.color='#FAF7F2' }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='#888' }}>
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <Link to="/login" style={{ padding: '7px 16px', borderRadius: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#AAA', fontSize: '0.85rem', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='#FAF7F2' }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#AAA' }}>
              Login
            </Link>
            <Link to="/register" style={{ padding: '7px 16px', borderRadius: 8, background: 'linear-gradient(135deg,#A67C52,#7A5230)', color: '#FAF7F2', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', boxShadow: '0 0 16px rgba(166,124,82,0.3)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow='0 0 28px rgba(166,124,82,0.5)'; e.currentTarget.style.transform='translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow='0 0 16px rgba(166,124,82,0.3)'; e.currentTarget.style.transform='translateY(0)' }}>
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
