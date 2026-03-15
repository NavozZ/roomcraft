import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import { useAuth } from '../../hooks/useAuth'
import { useDesign } from '../../hooks/useDesign'
import { designService } from '../../services/designService'

// Author: Waruni

const SHAPES = [
  { id: 'rectangle', label: 'Rectangle', icon: '▭', desc: 'Standard rectangular room' },
  { id: 'l-shape',   label: 'L-Shape',   icon: '⌐', desc: 'L-shaped open plan' },
  { id: 'square',    label: 'Square',    icon: '□', desc: 'Square room' },
]
const WALL_COLOURS = [
  { label: 'White',     value: '#FFFFFF' },
  { label: 'Cream',     value: '#FAF7F2' },
  { label: 'Warm Grey', value: '#D8D0C8' },
  { label: 'Sage',      value: '#B8C8B0' },
  { label: 'Sky Blue',  value: '#B0C8D8' },
  { label: 'Blush',     value: '#D8B8B8' },
  { label: 'Olive',     value: '#C8C8A0' },
  { label: 'Charcoal',  value: '#4A4A4A' },
]
const FLOOR_TYPES = [
  { label: 'Oak',    value: '#C8A882' },
  { label: 'Walnut', value: '#7A5230' },
  { label: 'Carpet', value: '#C8C0B8' },
  { label: 'Marble', value: '#E8E8E8' },
  { label: 'Tile',   value: '#D0D8E0' },
]

function RoomPreview({ room }) {
  const { widthM = 4, heightM = 3.5, wallColour, floorColour } = room
  const maxW = 220, maxH = 160
  const scale = Math.min(maxW / widthM, maxH / heightM)
  const pw = widthM * scale, ph = heightM * scale
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <p style={{ fontSize: '0.65rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>Preview</p>
      <div style={{ width: maxW+32, height: maxH+32, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: pw, height: ph, background: floorColour, border: `3px solid ${wallColour === '#FFFFFF' ? 'rgba(255,255,255,0.5)' : wallColour}`, borderRadius: 2, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.13, backgroundImage: 'linear-gradient(rgba(0,0,0,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.5) 1px,transparent 1px)', backgroundSize: '18px 18px' }} />
          <span style={{ position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: '#555', fontFamily: 'monospace' }}>{widthM}m</span>
          <span style={{ position: 'absolute', right: -30, top: '50%', transform: 'translateY(-50%) rotate(90deg)', fontSize: 9, color: '#555', fontFamily: 'monospace' }}>{heightM}m</span>
        </div>
      </div>
      <p style={{ fontSize: '0.75rem', color: '#666' }}>
        Floor area: <span style={{ color: '#C8A882', fontWeight: 600 }}>{(widthM * heightM).toFixed(1)} m²</span>
      </p>
    </div>
  )
}

export default function UserRoomSetup() {
  const { user }         = useAuth()
  const { createDesign } = useDesign()
  const navigate         = useNavigate()

  const [step, setStep]     = useState(1)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [room, setRoom]     = useState({
    name: '', widthM: 4, heightM: 3.5,
    shape: 'rectangle', wallColour: '#FAF7F2', floorColour: '#C8A882',
  })

  const update = (k, v) => { setRoom(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!room.name.trim()) e.name = 'Please give your room a name.'
    if (room.widthM < 1 || room.widthM > 30)   e.widthM  = 'Width must be 1–30m.'
    if (room.heightM < 1 || room.heightM > 30) e.heightM = 'Depth must be 1–30m.'
    setErrors(e); return !Object.keys(e).length
  }

  const handleSubmit = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 300))
    const design = createDesign(room)
    designService.create({ ...design, userId: user.id })
    setLoading(false)
    navigate(`/user/view3d/${design.id}`)
  }

  const inputStyle = (err) => ({
    width: '100%', padding: '11px 16px', borderRadius: 10,
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${err ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`,
    color: '#FAF7F2', fontSize: '0.875rem', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s',
  })
  const labelStyle = { display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#777', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }

  return (
    <div style={{ minHeight: '100vh', background: '#0e0a06', color: '#FAF7F2' }}>
      <Navbar />
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(166,124,82,0.08), transparent 60%)', pointerEvents: 'none' }} />

      <div style={{ paddingTop: 64, position: 'relative' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2.5rem 1.5rem' }}>

          <div style={{ marginBottom: '2rem', animation: 'rc-up 0.5s ease both' }}>
            <h1 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 'clamp(2rem,5vw,2.8rem)', fontWeight: 600, color: '#FAF7F2', marginBottom: '0.3rem' }}>Set Up My Room</h1>
            <p style={{ fontSize: '0.875rem', color: '#666' }}>Enter your room's real dimensions to preview furniture in 3D.</p>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem', animation: 'rc-up 0.5s ease 0.1s both' }}>
            {['Room Details', 'Style'].map((lbl, i) => {
              const active = step === i+1, done = step > i+1
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 999, fontSize: '0.82rem', fontWeight: 500, background: active?'rgba(166,124,82,0.2)':done?'rgba(34,197,94,0.1)':'rgba(255,255,255,0.04)', border: active?'1px solid rgba(166,124,82,0.4)':done?'1px solid rgba(34,197,94,0.3)':'1px solid rgba(255,255,255,0.08)', color: active?'#C8A882':done?'#4ade80':'#555', transition: 'all 0.3s' }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, background: active?'rgba(166,124,82,0.3)':done?'rgba(34,197,94,0.2)':'rgba(255,255,255,0.06)' }}>{done ? '✓' : i+1}</span>
                    {lbl}
                  </div>
                  {i < 1 && <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.08)' }} />}
                </div>
              )
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', alignItems: 'start' }}>

            {/* Form */}
            <div style={{ animation: 'rc-up 0.5s ease 0.15s both' }}>

              {step === 1 && (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h2 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.6rem', fontWeight: 600, color: '#FAF7F2' }}>Room Details</h2>

                  <div>
                    <label style={labelStyle}>Room Name</label>
                    <input type="text" autoFocus placeholder="e.g. My Bedroom"
                      value={room.name} onChange={e => update('name', e.target.value)}
                      style={inputStyle(!!errors.name)}
                      onFocus={e => { e.target.style.borderColor='rgba(166,124,82,0.5)'; e.target.style.boxShadow='0 0 0 3px rgba(166,124,82,0.1)' }}
                      onBlur={e => { e.target.style.borderColor=errors.name?'rgba(239,68,68,0.5)':'rgba(255,255,255,0.1)'; e.target.style.boxShadow='none' }}
                    />
                    {errors.name && <p style={{ fontSize: '0.72rem', color: '#f87171', marginTop: 5 }}>⚠ {errors.name}</p>}
                  </div>

                  <div>
                    <label style={labelStyle}>Room Dimensions (metres)</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {[['widthM','Width'],['heightM','Depth']].map(([k, lbl]) => (
                        <div key={k}>
                          <p style={{ fontSize: '0.72rem', color: '#666', marginBottom: 6 }}>{lbl}</p>
                          <div style={{ position: 'relative' }}>
                            <input type="number" min={1} max={30} step={0.5}
                              value={room[k]} onChange={e => update(k, parseFloat(e.target.value)||1)}
                              style={{ ...inputStyle(!!errors[k]), paddingRight: 36 }}
                              onFocus={e => { e.target.style.borderColor='rgba(166,124,82,0.5)'; e.target.style.boxShadow='0 0 0 3px rgba(166,124,82,0.1)' }}
                              onBlur={e => { e.target.style.borderColor=errors[k]?'rgba(239,68,68,0.5)':'rgba(255,255,255,0.1)'; e.target.style.boxShadow='none' }}
                            />
                            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: '#555' }}>m</span>
                          </div>
                          {errors[k] && <p style={{ fontSize: '0.7rem', color: '#f87171', marginTop: 4 }}>⚠ {errors[k]}</p>}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Room Shape</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 4 }}>
                      {SHAPES.map(s => (
                        <button key={s.id} type="button" onClick={() => update('shape', s.id)}
                          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '14px 8px', borderRadius: 12, cursor: 'pointer', border: room.shape===s.id?'1px solid rgba(166,124,82,0.6)':'1px solid rgba(255,255,255,0.08)', background: room.shape===s.id?'rgba(166,124,82,0.12)':'rgba(255,255,255,0.03)', boxShadow: room.shape===s.id?'0 0 16px rgba(166,124,82,0.15)':'none', transition: 'all 0.2s' }}>
                          <span style={{ fontSize: '1.6rem', color: room.shape===s.id?'#C8A882':'#555' }}>{s.icon}</span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: room.shape===s.id?'#C8A882':'#777' }}>{s.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => validate() && setStep(2)}
                    style={{ width: '100%', padding: '13px', borderRadius: 10, background: 'linear-gradient(135deg,#A67C52,#7A5230)', color: '#FAF7F2', fontWeight: 600, fontSize: '0.95rem', border: 'none', cursor: 'pointer', boxShadow: '0 0 24px rgba(166,124,82,0.3)', transition: 'all 0.3s' }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow='0 0 40px rgba(166,124,82,0.5)'; e.currentTarget.style.transform='translateY(-1px)' }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow='0 0 24px rgba(166,124,82,0.3)'; e.currentTarget.style.transform='translateY(0)' }}>
                    Next: Choose Style →
                  </button>
                </div>
              )}

              {step === 2 && (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.85rem', padding: 0, transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color='#FAF7F2'}
                      onMouseLeave={e => e.currentTarget.style.color='#666'}>← Back</button>
                    <h2 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.6rem', fontWeight: 600, color: '#FAF7F2' }}>Room Style</h2>
                  </div>

                  <div>
                    <label style={labelStyle}>Wall Colour</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
                      {WALL_COLOURS.map(c => (
                        <button key={c.value} type="button" onClick={() => update('wallColour', c.value)} title={c.label}
                          style={{ width: 38, height: 38, borderRadius: 8, background: c.value, cursor: 'pointer', border: room.wallColour===c.value?'2px solid #A67C52':'2px solid rgba(255,255,255,0.1)', transform: room.wallColour===c.value?'scale(1.15)':'scale(1)', boxShadow: room.wallColour===c.value?'0 0 12px rgba(166,124,82,0.4)':'none', transition: 'all 0.2s' }} />
                      ))}
                    </div>
                    <p style={{ fontSize: '0.72rem', color: '#666' }}>Selected: <span style={{ color: '#C8A882' }}>{WALL_COLOURS.find(c=>c.value===room.wallColour)?.label}</span></p>
                  </div>

                  <div>
                    <label style={labelStyle}>Floor Type</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
                      {FLOOR_TYPES.map(f => (
                        <button key={f.value} type="button" onClick={() => update('floorColour', f.value)}
                          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '10px 4px', borderRadius: 10, cursor: 'pointer', border: room.floorColour===f.value?'1px solid rgba(166,124,82,0.6)':'1px solid rgba(255,255,255,0.08)', background: room.floorColour===f.value?'rgba(166,124,82,0.1)':'rgba(255,255,255,0.03)', transition: 'all 0.2s' }}>
                          <div style={{ width: 28, height: 28, borderRadius: 6, background: f.value, border: '1px solid rgba(255,255,255,0.12)' }} />
                          <span style={{ fontSize: '0.65rem', color: room.floorColour===f.value?'#C8A882':'#666', textAlign: 'center' }}>{f.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button onClick={handleSubmit} disabled={loading}
                    style={{ width: '100%', padding: '13px', borderRadius: 10, background: 'linear-gradient(135deg,#A67C52,#7A5230)', color: '#FAF7F2', fontWeight: 600, fontSize: '0.95rem', border: 'none', cursor: loading?'not-allowed':'pointer', boxShadow: '0 0 24px rgba(166,124,82,0.3)', transition: 'all 0.3s', opacity: loading?0.7:1 }}
                    onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow='0 0 40px rgba(166,124,82,0.5)'; e.currentTarget.style.transform='translateY(-1px)' }}}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow='0 0 24px rgba(166,124,82,0.3)'; e.currentTarget.style.transform='translateY(0)' }}>
                    {loading
                      ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                          <span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.3)', borderTop:'2px solid #FFF', borderRadius:'50%', animation:'rc-spin 0.7s linear infinite', display:'inline-block' }} />
                          Setting up room...
                        </span>
                      : '🏠 View My Room in 3D →'
                    }
                  </button>
                </div>
              )}
            </div>

            {/* Preview panel */}
            <div style={{ width: 270, flexShrink: 0, animation: 'rc-up 0.5s ease 0.25s both' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '1.5rem', position: 'sticky', top: 88 }}>
                <RoomPreview room={room} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: '1.25rem' }}>
                  {[`${room.widthM}×${room.heightM}m`, room.shape, `${(room.widthM*room.heightM).toFixed(1)} m²`].map(chip => (
                    <span key={chip} style={{ fontSize: '0.68rem', fontWeight: 600, padding: '3px 10px', borderRadius: 999, background: 'rgba(166,124,82,0.12)', border: '1px solid rgba(166,124,82,0.2)', color: '#C8A882' }}>{chip}</span>
                  ))}
                </div>
                <p style={{ fontSize: '0.72rem', color: '#444', marginTop: '1rem', lineHeight: 1.6 }}>Furniture will be placed true to your real room scale.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes rc-up   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rc-spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  )
}
