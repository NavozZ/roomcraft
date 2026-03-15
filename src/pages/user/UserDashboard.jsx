// UserDashboard.jsx — Navodya
import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import { useAuth } from '../../hooks/useAuth'
import { designService } from '../../services/designService'

function useReveal(delay = 0) {
  const ref = useRef(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return [ref, { opacity: v?1:0, transform: v?'translateY(0)':'translateY(20px)', transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s` }]
}

function timeAgo(d) {
  const diff = Date.now() - new Date(d)
  const m = Math.floor(diff/60000), h = Math.floor(diff/3600000), day = Math.floor(diff/86400000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  if (day < 7) return `${day}d ago`
  return new Date(d).toLocaleDateString()
}

export default function UserDashboard() {
  const { user } = useAuth()
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)

  const [hRef, hStyle] = useReveal(0)
  const [cRef, cStyle] = useReveal(0.1)
  const [rRef, rStyle] = useReveal(0.2)

  useEffect(() => {
    setTimeout(() => { setDesigns(designService.getByUser(user.id)); setLoading(false) }, 500)
  }, [user.id])

  const [confirmDelete, setConfirmDelete] = useState(null)

  const handleDelete = (id, name) => setConfirmDelete({ id, name })
  const confirmDeleteAction = () => {
    if (!confirmDelete) return
    designService.delete(confirmDelete.id)
    setDesigns(prev => prev.filter(d => d.id !== confirmDelete.id))
    setConfirmDelete(null)
  }

  const latest = designs.filter(d => d.id !== confirmDelete?.id).slice(-1)[0] ?? designs[designs.length - 1]
  const firstName = user?.name?.split(' ')[0]

  const cardBase = {
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16, padding: '2rem', textDecoration: 'none',
    display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12,
    transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0e0a06', color: '#FAF7F2' }}>
      <Navbar />
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(166,124,82,0.08), transparent 60%)', pointerEvents: 'none' }} />

      <div style={{ paddingTop: 64, position: 'relative' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1.5rem' }}>

          {/* Header */}
          <div ref={hRef} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: 16, ...hStyle }}>
            <div>
              <h1 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 600, color: '#FAF7F2', marginBottom: '0.3rem' }}>
                Hello, {firstName} 👋
              </h1>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>Visualise furniture in your room before you buy.</p>
            </div>
            <Link to="/user/room-setup"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 12, background: 'linear-gradient(135deg,#A67C52,#7A5230)', color: '#FAF7F2', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', boxShadow: '0 0 24px rgba(166,124,82,0.3)', transition: 'all 0.3s', flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow='0 0 40px rgba(166,124,82,0.55)'; e.currentTarget.style.transform='translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow='0 0 24px rgba(166,124,82,0.3)'; e.currentTarget.style.transform='translateY(0)' }}>
              Set Up My Room
            </Link>
          </div>

          {/* Main 3 cards */}
          <div ref={cRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1.25rem', marginBottom: '2.5rem', ...cStyle }}>

            {/* Set up room */}
            <Link to="/user/room-setup" style={cardBase}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(166,124,82,0.4)'; e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(0,0,0,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(166,124,82,0.12)', border: '1px solid rgba(166,124,82,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem' }}>📐</div>
              <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.25rem', fontWeight: 600, color: '#FAF7F2' }}>Set Up My Room</h3>
              <p style={{ fontSize: '0.82rem', color: '#666', lineHeight: 1.6 }}>Enter your room dimensions and preview furniture in 3D</p>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '4px 12px', borderRadius: 999, background: 'rgba(166,124,82,0.15)', border: '1px solid rgba(166,124,82,0.25)', color: '#C8A882' }}>Start →</span>
            </Link>

            {/* View in 3D */}
            {latest ? (
              <Link to={`/user/editor/${latest.id}`} style={cardBase}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(166,124,82,0.4)'; e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(0,0,0,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}>
                {/* Mini room thumbnail */}
                <div style={{ width: 64, height: 48, borderRadius: 8, background: latest.room?.floorColour || '#C8A882', border: `3px solid ${latest.room?.wallColour || '#FAF7F2'}`, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'linear-gradient(rgba(0,0,0,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.5) 1px,transparent 1px)', backgroundSize: '12px 12px' }} />
                </div>
                <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.25rem', fontWeight: 600, color: '#FAF7F2' }}>Edit My Room</h3>
                <p style={{ fontSize: '0.82rem', color: '#666' }}>Continue with: <span style={{ color: '#C8A882' }}>{latest.room?.name}</span></p>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '4px 12px', borderRadius: 999, background: 'rgba(166,124,82,0.15)', border: '1px solid rgba(166,124,82,0.25)', color: '#C8A882' }}>Open Editor →</span>
              </Link>
            ) : (
              <div style={{ ...cardBase, opacity: 0.4, cursor: 'default' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem' }}>🏠</div>
                <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.25rem', fontWeight: 600, color: '#FAF7F2' }}>View in 3D</h3>
                <p style={{ fontSize: '0.82rem', color: '#666' }}>Set up a room first</p>
              </div>
            )}

            {/* Saved rooms */}
            <div style={{ ...cardBase, cursor: 'default', alignItems: loading ? 'center' : designs.length > 0 ? 'stretch' : 'center', textAlign: designs.length > 0 ? 'left' : 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem' }}>💾</div>
                <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.25rem', fontWeight: 600, color: '#FAF7F2' }}>My Rooms</h3>
              </div>

              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', marginTop: 8 }}>
                  {[1,2].map(i => <div key={i} style={{ height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.04)', animation: 'rc-shimmer 1.5s ease-in-out infinite' }} />)}
                </div>
              ) : designs.length === 0 ? (
                <p style={{ fontSize: '0.82rem', color: '#555' }}>No saved rooms yet</p>
              ) : (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                  <p style={{ fontSize: '0.72rem', color: '#555', marginBottom: 4 }}>{designs.length} saved room{designs.length>1?'s':''}</p>
                  {designs.slice(-3).reverse().map(d => (
                    <Link key={d.id} to={`/user/editor/${d.id}`}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, textDecoration: 'none', transition: 'background 0.2s', border: '1px solid rgba(255,255,255,0.06)' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(166,124,82,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.04)'}>
                      <span style={{ fontSize: '0.8rem', color: '#C8A882', fontWeight: 500 }}>{d.room?.name}</span>
                      <span style={{ fontSize: '0.68rem', color: '#555' }}>{timeAgo(d.updatedAt)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent rooms list */}
          {designs.length > 1 && (
            <div ref={rRef} style={rStyle}>
              <h2 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.5rem', fontWeight: 600, color: '#FAF7F2', marginBottom: '1rem' }}>All Rooms</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1rem' }}>
                {designs.map((d, i) => (
                  <Link key={d.id} to={`/user/editor/${d.id}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, textDecoration: 'none', transition: 'all 0.2s', animation: `rc-card-in 0.4s ease ${i*0.06}s both` }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(166,124,82,0.35)'; e.currentTarget.style.transform='translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.transform='translateY(0)' }}>
                    <div style={{ width: 44, height: 36, borderRadius: 6, background: d.room?.floorColour || '#C8A882', border: `2px solid ${d.room?.wallColour || '#FAF7F2'}`, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.875rem', color: '#FAF7F2', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.room?.name}</p>
                      <p style={{ fontSize: '0.7rem', color: '#555', marginTop: 2 }}>{d.room?.widthM}m × {d.room?.heightM}m · {timeAgo(d.updatedAt)}</p>
                    </div>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(d.id, d.room?.name) }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '0.8rem', padding: '2px 4px', transition: 'color 0.2s', flexShrink: 0 }}
                      onMouseEnter={e => e.currentTarget.style.color='#f87171'}
                      onMouseLeave={e => e.currentTarget.style.color='#555'}
                      title="Delete room"
                    >✕</button>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'rgba(20,14,8,0.97)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '2rem', maxWidth: 380, width: '100%', animation: 'rc-modal 0.25s ease', boxShadow: '0 0 60px rgba(0,0,0,0.6)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🗑️</div>
            <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.4rem', fontWeight: 600, color: '#FAF7F2', marginBottom: '0.5rem' }}>Delete room?</h3>
            <p style={{ fontSize: '0.875rem', color: '#888', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              "<span style={{ color: '#C8A882' }}>{confirmDelete.name}</span>" will be permanently deleted. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmDelete(null)}
                style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#AAA', cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.color='#FAF7F2' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='#AAA' }}>
                Cancel
              </button>
              <button onClick={confirmDeleteAction}
                style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.35)'; e.currentTarget.style.color='#FFF' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(239,68,68,0.2)'; e.currentTarget.style.color='#f87171' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes rc-shimmer  { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes rc-card-in  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rc-modal    { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
      `}</style>
    </div>
  )
}
