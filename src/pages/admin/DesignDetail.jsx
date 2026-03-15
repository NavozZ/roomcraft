// DesignDetail.jsx — Navodya
import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import { designService } from '../../services/designService'

function timeAgo(d) {
  const diff = Date.now() - new Date(d)
  const m = Math.floor(diff/60000), h = Math.floor(diff/3600000), day = Math.floor(diff/86400000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  if (day < 7) return `${day}d ago`
  return new Date(d).toLocaleDateString()
}

export default function DesignDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [design, setDesign] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    const d = designService.getById(id)
    if (d) setDesign(d)
    else navigate('/admin')
  }, [id])

  const handleDelete = () => {
    designService.delete(id)
    navigate('/admin')
  }

  if (!design) return (
    <div style={{ minHeight: '100vh', background: '#0e0a06', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '2px solid rgba(166,124,82,0.2)', borderTop: '2px solid #A67C52', borderRadius: '50%', animation: 'rc-spin 0.8s linear infinite' }} />
      <style>{`@keyframes rc-spin { to{transform:rotate(360deg)} }`}</style>
    </div>
  )

  const { room, furniture, name, createdAt, updatedAt } = design

  const actionBtn = {
    display: 'inline-flex', alignItems: 'center', gap: 7,
    padding: '9px 20px', borderRadius: 10, fontSize: '0.875rem',
    fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0e0a06', color: '#FAF7F2' }}>
      <Navbar />

      {/* bg glow */}
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(166,124,82,0.08), transparent 60%)', pointerEvents: 'none' }} />

      <div style={{ paddingTop: 64, position: 'relative' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '2.5rem 1.5rem' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: 16, animation: 'rc-up 0.5s ease both' }}>
            <div>
              <Link to="/admin"
                style={{ fontSize: '0.8rem', color: '#666', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color='#C8A882'}
                onMouseLeave={e => e.currentTarget.style.color='#666'}>
                ← My Designs
              </Link>
              <h1 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 'clamp(1.8rem,5vw,2.8rem)', fontWeight: 600, color: '#FAF7F2', marginBottom: '0.3rem' }}>
                {name}
              </h1>
              <p style={{ fontSize: '0.78rem', color: '#555' }}>
                Created {new Date(createdAt).toLocaleDateString()} · Last edited {timeAgo(updatedAt)}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link to={`/admin/editor/${id}`}
                style={{ ...actionBtn, background: 'linear-gradient(135deg,#A67C52,#7A5230)', color: '#FAF7F2', boxShadow: '0 0 20px rgba(166,124,82,0.3)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 0 36px rgba(166,124,82,0.5)'; e.currentTarget.style.transform='translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='0 0 20px rgba(166,124,82,0.3)'; e.currentTarget.style.transform='translateY(0)' }}>
                ✏️ Edit Design
              </Link>
              <Link to={`/admin/view3d/${id}`}
                style={{ ...actionBtn, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#AAA' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.color='#FAF7F2' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='#AAA' }}>
                🏠 View 3D
              </Link>
            </div>
          </div>

          {/* Cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem', marginBottom: '1.25rem', animation: 'rc-up 0.5s ease 0.1s both' }}>

            {/* Room info card */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.5rem' }}>
              <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.2rem', fontWeight: 600, color: '#FAF7F2', marginBottom: '1rem' }}>Room</h3>

              {/* Mini room thumbnail */}
              <div style={{ width: '100%', height: 100, background: room?.floorColour || '#C8A882', border: `3px solid ${room?.wallColour || '#FAF7F2'}`, borderRadius: 8, marginBottom: '1.25rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: 'linear-gradient(rgba(0,0,0,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.5) 1px,transparent 1px)', backgroundSize: '16px 16px' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '2rem', opacity: 0.5 }}>🏠</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['Name',   room?.name],
                  ['Size',   `${room?.widthM}m × ${room?.heightM}m`],
                  ['Area',   `${((room?.widthM||0)*(room?.heightM||0)).toFixed(1)} m²`],
                  ['Shape',  room?.shape],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                    <span style={{ color: '#555' }}>{k}</span>
                    <span style={{ color: '#C8A882', fontWeight: 500, textTransform: 'capitalize' }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                  <span style={{ color: '#555' }}>Wall</span>
                  <div style={{ width: 20, height: 20, borderRadius: 5, background: room?.wallColour, border: '1px solid rgba(255,255,255,0.15)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                  <span style={{ color: '#555' }}>Floor</span>
                  <div style={{ width: 20, height: 20, borderRadius: 5, background: room?.floorColour, border: '1px solid rgba(255,255,255,0.15)' }} />
                </div>
              </div>
            </div>

            {/* Furniture list card */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.5rem' }}>
              <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.2rem', fontWeight: 600, color: '#FAF7F2', marginBottom: '1rem' }}>
                Furniture
                <span style={{ fontSize: '0.85rem', fontWeight: 400, color: '#555', marginLeft: 8 }}>({furniture?.length || 0} items)</span>
              </h3>

              {!furniture?.length ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                  <div style={{ fontSize: '2.5rem', opacity: 0.3, marginBottom: '0.75rem' }}>🪑</div>
                  <p style={{ fontSize: '0.82rem', color: '#555', marginBottom: '1.25rem' }}>No furniture placed yet</p>
                  <Link to={`/admin/editor/${id}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 8, background: 'linear-gradient(135deg,#A67C52,#7A5230)', color: '#FAF7F2', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>
                    Open Editor
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 280, overflowY: 'auto' }}>
                  {furniture.map((item, i) => (
                    <div key={item.id}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', animation: `rc-card-in 0.3s ease ${i*0.04}s both` }}>
                      {/* Colour dot */}
                      <div style={{ width: 24, height: 24, borderRadius: 6, background: item.colour, border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0,
                        filter: `brightness(${1-(item.shading||0)*0.4})` }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#FAF7F2', flex: 1 }}>{item.label}</span>
                      <span style={{ fontSize: '0.7rem', color: '#555' }}>{item.widthM}×{item.depthM}m</span>
                      <span style={{ fontSize: '0.7rem', color: '#444' }}>({item.x.toFixed(1)}, {item.y.toFixed(1)})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Danger zone */}
          <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 16, padding: '1.5rem', animation: 'rc-up 0.5s ease 0.2s both' }}>
            <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.1rem', fontWeight: 600, color: '#f87171', marginBottom: '0.4rem' }}>Delete Design</h3>
            <p style={{ fontSize: '0.82rem', color: '#666', marginBottom: '1rem' }}>This will permanently remove the design and all its furniture.</p>
            <button onClick={() => setShowConfirm(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 8, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.25)'; e.currentTarget.style.color='#FFF' }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(239,68,68,0.15)'; e.currentTarget.style.color='#f87171' }}>
              🗑️ Delete This Design
            </button>
          </div>

        </div>
      </div>

      {/* Delete confirmation modal */}
      {showConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'rgba(20,14,8,0.97)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '2rem', maxWidth: 380, width: '100%', animation: 'rc-modal 0.25s ease', boxShadow: '0 0 60px rgba(0,0,0,0.6)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🗑️</div>
            <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.4rem', fontWeight: 600, color: '#FAF7F2', marginBottom: '0.5rem' }}>Delete design?</h3>
            <p style={{ fontSize: '0.875rem', color: '#888', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              "<span style={{ color: '#C8A882' }}>{name}</span>" will be permanently deleted. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowConfirm(false)}
                style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#AAA', cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.color='#FAF7F2' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='#AAA' }}>
                Cancel
              </button>
              <button onClick={handleDelete}
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
        @keyframes rc-up      { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rc-spin    { to{transform:rotate(360deg)} }
        @keyframes rc-card-in { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rc-modal   { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
      `}</style>
    </div>
  )
}
