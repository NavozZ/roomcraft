import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import { useAuth } from '../../hooks/useAuth'
import { designService } from '../../services/designService'
import { useEffect, useState, useRef } from 'react'


function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr)
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7)   return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}


function useReveal(delay = 0) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
  }]
}

function GlowCard({ children, style = {}, onClick }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const ref = useRef(null)
  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (rect) setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }
  return (
    <div ref={ref} style={{ position: 'relative', overflow: 'hidden', ...style }}
      onMouseMove={onMove} onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)} onClick={onClick}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        opacity: hovered ? 1 : 0, transition: 'opacity 0.4s',
        background: `radial-gradient(300px circle at ${pos.x}px ${pos.y}px, rgba(166,124,82,0.1), transparent 60%)`,
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  )
}


function SkeletonCard() {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ height: 160, background: 'rgba(255,255,255,0.04)', animation: 'rc-shimmer 1.5s ease-in-out infinite' }} />
      <div style={{ padding: '1.25rem' }}>
        <div style={{ height: 18, width: '60%', background: 'rgba(255,255,255,0.06)', borderRadius: 6, marginBottom: 10, animation: 'rc-shimmer 1.5s ease-in-out infinite' }} />
        <div style={{ height: 12, width: '40%', background: 'rgba(255,255,255,0.04)', borderRadius: 6, marginBottom: 16, animation: 'rc-shimmer 1.5s ease-in-out infinite 0.2s' }} />
        <div style={{ height: 34, background: 'rgba(255,255,255,0.04)', borderRadius: 8, animation: 'rc-shimmer 1.5s ease-in-out infinite 0.4s' }} />
      </div>
    </div>
  )
}


function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  const colors = {
    success: { bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.25)', text: '#4ade80' },
    error:   { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)',  text: '#f87171' },
  }
  const c = colors[type] || colors.success
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: c.bg, border: `1px solid ${c.border}`,
      backdropFilter: 'blur(12px)', borderRadius: 12,
      padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10,
      animation: 'rc-toast-in 0.3s ease',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    }}>
      <span style={{ fontSize: '1rem' }}>{type === 'success' ? '✓' : '⚠'}</span>
      <span style={{ fontSize: '0.85rem', color: c.text, fontWeight: 500 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1rem', padding: 0, marginLeft: 4 }}>✕</button>
    </div>
  )
}


export default function AdminDashboard() {
  const { user } = useAuth()
  const [designs, setDesigns]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [toast, setToast]       = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null) // { id, name }

  const [headerRef, headerStyle] = useReveal(0)
  const [statsRef, statsStyle]   = useReveal(0.1)
  const [gridRef, gridStyle]     = useReveal(0.2)

  useEffect(() => {
    setTimeout(() => {
      setDesigns(designService.getByUser(user.id))
      setLoading(false)
    }, 600)
  }, [user.id])

  const handleDelete = (id, name) => setConfirmDelete({ id, name })

  const confirmDeleteAction = () => {
    if (!confirmDelete) return
    designService.delete(confirmDelete.id)
    setDesigns(prev => prev.filter(d => d.id !== confirmDelete.id))
    setToast({ message: `"${confirmDelete.name}" deleted`, type: 'success' })
    setConfirmDelete(null)
  }

  const totalFurniture = designs.reduce((sum, d) => sum + (d.furniture?.length || 0), 0)
  const lastEdited = designs.length
    ? timeAgo(Math.max(...designs.map(d => new Date(d.updatedAt))))
    : '—'

  const filtered = designs.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase())
  )

  const btnStyle = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
    padding: '7px 12px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 500,
    textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)', color: '#AAA',
    transition: 'all 0.2s', flex: 1, cursor: 'pointer',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0e0a06', color: '#FAF7F2' }}>
      <Navbar />

      
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(166,124,82,0.08), transparent 60%)', pointerEvents: 'none' }} />

      <div style={{ paddingTop: 64, position: 'relative' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem' }}>

          
          <div ref={headerRef} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', gap: 16, flexWrap: 'wrap', ...headerStyle }}>
            <div>
              <h1 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 600, color: '#FAF7F2', lineHeight: 1.1, marginBottom: '0.35rem' }}>
                My Designs
              </h1>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                Welcome back, <span style={{ color: '#C8A882' }}>{user?.name}</span>. You have {designs.length} saved design{designs.length !== 1 ? 's' : ''}.
              </p>
            </div>
            <Link to="/admin/room-setup"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 12, background: 'linear-gradient(135deg,#A67C52,#7A5230)', color: '#FAF7F2', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', boxShadow: '0 0 24px rgba(166,124,82,0.3)', transition: 'all 0.3s', flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow='0 0 40px rgba(166,124,82,0.55)'; e.currentTarget.style.transform='translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow='0 0 24px rgba(166,124,82,0.3)'; e.currentTarget.style.transform='translateY(0)' }}>
              + New Design
            </Link>
          </div>

          
          <div ref={statsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: '2rem', ...statsStyle }}>
            {[
              { label: 'Total Designs',  value: designs.length,  icon: '🗂️', glow: 'rgba(166,124,82,0.15)' },
              { label: 'Furniture Used', value: totalFurniture,  icon: '🪑', glow: 'rgba(99,102,241,0.1)' },
              { label: 'Last Edited',    value: lastEdited,      icon: '🕐', glow: 'rgba(34,197,94,0.08)' },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14, padding: '1.1rem 1.25rem',
                display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: `inset 0 0 30px ${s.glow}`,
              }}>
                <span style={{ fontSize: '1.75rem' }}>{s.icon}</span>
                <div>
                  <div style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.6rem', fontWeight: 600, color: '#FAF7F2', lineHeight: 1.1 }}>{s.value}</div>
                  <div style={{ fontSize: '0.68rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          
          {designs.length > 0 && (
            <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: '0.95rem', color: '#555' }}>🔍</span>
              <input
                type="text" placeholder="Search designs..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '10px 16px 10px 40px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: '#FAF7F2', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor='rgba(166,124,82,0.4)'}
                onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.09)'}
              />
              {search && (
                <button onClick={() => setSearch('')}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}>✕</button>
              )}
            </div>
          )}

          
          <div ref={gridRef} style={gridStyle}>
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem' }}>
                {[1,2,3].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : designs.length === 0 ? (
              
              <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20 }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.4 }}>🪑</div>
                <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.8rem', fontWeight: 600, color: '#FAF7F2', marginBottom: '0.5rem' }}>No designs yet</h3>
                <p style={{ color: '#555', fontSize: '0.875rem', marginBottom: '2rem' }}>Create your first room design to get started.</p>
                <Link to="/admin/room-setup"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 12, background: 'linear-gradient(135deg,#A67C52,#7A5230)', color: '#FAF7F2', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', boxShadow: '0 0 24px rgba(166,124,82,0.3)' }}>
                  Create First Design
                </Link>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#555' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔍</div>
                <p style={{ fontSize: '0.9rem' }}>No designs match "<span style={{ color: '#C8A882' }}>{search}</span>"</p>
                <button onClick={() => setSearch('')} style={{ marginTop: '0.75rem', background: 'none', border: 'none', color: '#A67C52', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}>Clear search</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem' }}>

                {filtered.map((design, i) => (
                  <GlowCard key={design.id}
                    style={{
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 16, overflow: 'hidden',
                      transition: 'border-color 0.3s, transform 0.3s',
                      animation: `rc-card-in 0.4s ease ${i * 0.07}s both`,
                    }}
                  >
                    
                    <div style={{ height: 160, position: 'relative', overflow: 'hidden', background: design.room?.floorColour || '#C8A882' }}>
                      
                      <div style={{ position: 'absolute', inset: 0, border: `10px solid ${design.room?.wallColour || '#FAF7F2'}`, opacity: 0.25 }} />
                      
                      <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: 'linear-gradient(rgba(0,0,0,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.4) 1px,transparent 1px)', backgroundSize: '20px 20px' }} />
                      
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '2.5rem', opacity: 0.5 }}>🏠</span>
                      </div>
                      
                      <div style={{ position: 'absolute', bottom: 10, left: 10, display: 'flex', gap: 5 }}>
                        {[design.room?.floorColour, design.room?.wallColour].filter(Boolean).map((c, ci) => (
                          <div key={ci} style={{ width: 18, height: 18, borderRadius: 4, background: c, border: '1px solid rgba(255,255,255,0.3)' }} />
                        ))}
                      </div>
                      
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(design.id, design.name) }}
                        style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(239,68,68,0.85)', border: 'none', color: '#FFF', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
                        className="delete-btn"
                        title="Delete design"
                      >✕</button>
                    </div>

                    <div style={{ padding: '1rem 1.1rem' }}>
                      
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                        <h4 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.15rem', fontWeight: 600, color: '#FAF7F2', lineHeight: 1.2 }}>{design.name}</h4>
                        <span style={{ fontSize: '0.65rem', fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: 'rgba(166,124,82,0.15)', color: '#C8A882', flexShrink: 0, marginLeft: 8 }}>
                          {design.room?.shape || 'Room'}
                        </span>
                      </div>
                      
                      <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: 3 }}>
                        {design.furniture?.length || 0} items · {design.room?.widthM}m × {design.room?.heightM}m
                      </p>
                      <p style={{ fontSize: '0.7rem', color: '#444', marginBottom: '1rem' }}>
                        {timeAgo(design.updatedAt)}
                      </p>
                      
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link to={`/admin/editor/${design.id}`} style={btnStyle}
                          onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.color='#FAF7F2' }}
                          onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='#AAA' }}>
                          ✏️ Edit
                        </Link>
                        <Link to={`/admin/view3d/${design.id}`} style={btnStyle}
                          onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.color='#FAF7F2' }}
                          onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='#AAA' }}>
                          🏠 3D
                        </Link>
                        <Link to={`/admin/design/${design.id}`} style={btnStyle}
                          onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.color='#FAF7F2' }}
                          onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='#AAA' }}>
                          👁 View
                        </Link>
                      </div>
                    </div>
                  </GlowCard>
                ))}

                
                <Link to="/admin/room-setup"
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '2.5rem', minHeight: 200, borderRadius: 16, border: '1px dashed rgba(166,124,82,0.25)', background: 'rgba(166,124,82,0.03)', textDecoration: 'none', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.border='1px dashed rgba(166,124,82,0.5)'; e.currentTarget.style.background='rgba(166,124,82,0.07)' }}
                  onMouseLeave={e => { e.currentTarget.style.border='1px dashed rgba(166,124,82,0.25)'; e.currentTarget.style.background='rgba(166,124,82,0.03)' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(166,124,82,0.12)', border: '1px solid rgba(166,124,82,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#A67C52' }}>+</div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#666' }}>New Design</span>
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>

      
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'rgba(20,14,8,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '2rem', maxWidth: 380, width: '100%', animation: 'rc-modal-in 0.25s ease', boxShadow: '0 0 60px rgba(0,0,0,0.6)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🗑️</div>
            <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.4rem', fontWeight: 600, color: '#FAF7F2', marginBottom: '0.5rem' }}>Delete design?</h3>
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
                onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.3)'; e.currentTarget.style.color='#FFF' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(239,68,68,0.2)'; e.currentTarget.style.color='#f87171' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <style>{`
        @keyframes rc-shimmer {
          0%,100% { opacity:0.6 }
          50%      { opacity:1 }
        }
        @keyframes rc-card-in {
          from { opacity:0; transform:translateY(16px) }
          to   { opacity:1; transform:translateY(0) }
        }
        @keyframes rc-toast-in {
          from { opacity:0; transform:translateY(12px) }
          to   { opacity:1; transform:translateY(0) }
        }
        @keyframes rc-modal-in {
          from { opacity:0; transform:scale(0.95) }
          to   { opacity:1; transform:scale(1) }
        }
        .delete-btn { opacity: 0 !important; }
        div:hover > div > .delete-btn,
        div:hover .delete-btn { opacity: 1 !important; }
      `}</style>
    </div>
  )
}
