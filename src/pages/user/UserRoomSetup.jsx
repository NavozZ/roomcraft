import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import { useAuth } from '../../hooks/useAuth'
import { useDesign } from '../../hooks/useDesign'
import { designService } from '../../services/designService'

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
  { label: 'Oak Wood', value: '#C8A882' },
  { label: 'Walnut',   value: '#7A5230' },
  { label: 'Carpet',   value: '#C8C0B8' },
  { label: 'Marble',   value: '#E8E8E8' },
  { label: 'Tile',     value: '#D0D8E0' },
]

function RoomPreview({ room }) {
  const { widthM = 5, heightM = 4, wallColour, floorColour } = room
  const maxW = 220, maxH = 160
  const scale = Math.min(maxW / widthM, maxH / heightM)
  const pw = widthM * scale, ph = heightM * scale
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs text-wood-400 uppercase tracking-widest font-medium">Preview</p>
      <div className="flex items-center justify-center"
        style={{ width: maxW + 32, height: maxH + 32, background: '#f0ede8', borderRadius: 8, border: '2px solid #e8ddd0' }}>
        <div style={{
          width: pw, height: ph, background: floorColour,
          border: `3px solid ${wallColour === '#FFFFFF' ? '#ccc' : wallColour}`,
          borderRadius: 2, position: 'relative',
        }}>
          <span style={{ position:'absolute', bottom:-22, left:'50%', transform:'translateX(-50%)', fontSize:10, color:'#888', fontFamily:'monospace' }}>{widthM}m</span>
          <span style={{ position:'absolute', right:-32, top:'50%', transform:'translateY(-50%) rotate(90deg)', fontSize:10, color:'#888', fontFamily:'monospace' }}>{heightM}m</span>
        </div>
      </div>
      <p className="text-xs text-wood-400">{(widthM * heightM).toFixed(1)} m²</p>
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
    name: '', widthM: 4, heightM: 3.5, shape: 'rectangle',
    wallColour: '#FAF7F2', floorColour: '#C8A882',
  })

  const update = (k, v) => {
    setRoom(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!room.name.trim()) e.name = 'Please give your room a name.'
    if (room.widthM  < 1 || room.widthM  > 30) e.widthM  = 'Width must be 1–30m.'
    if (room.heightM < 1 || room.heightM > 30) e.heightM = 'Depth must be 1–30m.'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 300))
    const design = createDesign(room)
    designService.create({ ...design, userId: user.id })
    setLoading(false)
    navigate(`/user/view3d/${design.id}`)
  }

  return (
    <div className="min-h-screen bg-wood-50">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="mb-8">
            <h1 className="font-display text-4xl font-semibold text-wood-800">Set Up My Room</h1>
            <p className="text-wood-500 mt-1">Enter your room's real dimensions and style to preview furniture.</p>
          </div>

          
          <div className="flex items-center gap-3 mb-8">
            {['Room Details', 'Style'].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${step === i+1 ? 'bg-wood-500 text-white' : step > i+1 ? 'bg-wood-200 text-wood-600' : 'bg-wood-100 text-wood-400'}`}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                    {step > i+1 ? '✓' : i+1}
                  </span>
                  {s}
                </div>
                {i < 1 && <div className="w-8 h-px bg-wood-300" />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">

              {step === 1 && (
                <div className="card p-8 flex flex-col gap-6">
                  <h2 className="font-display text-2xl text-wood-800">Room Details</h2>

                  <div className="flex flex-col gap-1.5">
                    <label className="form-label">Room Name</label>
                    <input type="text" autoFocus placeholder="e.g. My Bedroom"
                      value={room.name} onChange={e => update('name', e.target.value)}
                      className={`form-input ${errors.name ? 'border-red-400':''}`} />
                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="form-label">Room Dimensions</label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {[['widthM','Width'],['heightM','Depth']].map(([k, lbl]) => (
                        <div key={k} className="flex flex-col gap-1.5">
                          <label className="text-xs text-wood-500 font-medium">{lbl}</label>
                          <div className="relative">
                            <input type="number" min={1} max={30} step={0.5}
                              value={room[k]}
                              onChange={e => update(k, parseFloat(e.target.value)||1)}
                              className={`form-input pr-10 ${errors[k]?'border-red-400':''}`} />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-wood-400">m</span>
                          </div>
                          {errors[k] && <p className="text-xs text-red-500">{errors[k]}</p>}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Room Shape</label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {SHAPES.map(s => (
                        <button key={s.id} type="button" onClick={() => update('shape', s.id)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center
                            ${room.shape===s.id ? 'border-wood-500 bg-wood-50' : 'border-wood-200 bg-white hover:border-wood-300'}`}>
                          <span className="text-3xl">{s.icon}</span>
                          <span className="text-sm font-semibold text-wood-700">{s.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => validate() && setStep(2)} className="btn btn-primary w-full py-3">
                    Next: Choose Style →
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="card p-8 flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setStep(1)} className="text-wood-400 hover:text-wood-600 text-sm">← Back</button>
                    <h2 className="font-display text-2xl text-wood-800">Room Style</h2>
                  </div>

                  <div>
                    <label className="form-label">Wall Colour</label>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {WALL_COLOURS.map(c => (
                        <button key={c.value} type="button" onClick={() => update('wallColour', c.value)}
                          title={c.label}
                          className={`w-10 h-10 rounded-lg border-2 transition-all
                            ${room.wallColour===c.value ? 'border-wood-600 scale-110 shadow-wood-md' : 'border-wood-200 hover:border-wood-400'}`}
                          style={{ background: c.value }} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Floor Type</label>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {FLOOR_TYPES.map(f => (
                        <button key={f.value} type="button" onClick={() => update('floorColour', f.value)}
                          className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-all
                            ${room.floorColour===f.value ? 'border-wood-600' : 'border-wood-200 hover:border-wood-300'}`}>
                          <div className="w-8 h-8 rounded" style={{ background: f.value }} />
                          <span className="text-xs text-wood-500 text-center leading-tight">{f.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button onClick={handleSubmit} disabled={loading} className="btn btn-primary w-full py-3 text-base">
                    {loading
                      ? <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Setting up room...
                        </span>
                      : '🏠 View My Room in 3D →'}
                  </button>
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <div className="card p-8 sticky top-24">
                <RoomPreview room={room} />
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="badge badge-wood">{room.widthM}m × {room.heightM}m</span>
                  <span className="badge badge-wood capitalize">{room.shape}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
