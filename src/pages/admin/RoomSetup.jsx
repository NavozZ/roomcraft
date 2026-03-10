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
  { label: 'White',      value: '#FFFFFF' },
  { label: 'Cream',      value: '#FAF7F2' },
  { label: 'Warm Grey',  value: '#D8D0C8' },
  { label: 'Sage',       value: '#B8C8B0' },
  { label: 'Sky Blue',   value: '#B0C8D8' },
  { label: 'Blush',      value: '#D8B8B8' },
  { label: 'Olive',      value: '#C8C8A0' },
  { label: 'Charcoal',   value: '#4A4A4A' },
]

const FLOOR_TYPES = [
  { label: 'Oak Wood',   value: '#C8A882', pattern: 'wood' },
  { label: 'Walnut',     value: '#7A5230', pattern: 'wood' },
  { label: 'Carpet',     value: '#C8C0B8', pattern: 'carpet' },
  { label: 'Marble',     value: '#E8E8E8', pattern: 'marble' },
  { label: 'Tile',       value: '#D0D8E0', pattern: 'tile' },
]

// Preview Component
function RoomPreview({ room }) {
  const { widthM = 5, heightM = 4, shape, wallColour, floorColour } = room

  
  const maxW = 240, maxH = 180
  const scale = Math.min(maxW / widthM, maxH / heightM)
  const pw = widthM  * scale
  const ph = heightM * scale

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-xs text-wood-400 uppercase tracking-widest font-medium">Live Preview</div>

      <div className="relative flex items-center justify-center"
        style={{ width: maxW + 32, height: maxH + 32, background: '#f0ede8', borderRadius: 8, border: '2px solid #e8ddd0' }}>

        {shape === 'l-shape' ? (
          
          <div style={{ position: 'relative', width: pw, height: ph }}>
            <div style={{
              position: 'absolute', top: 0, left: 0,
              width: pw * 0.6, height: ph,
              background: floorColour, border: `3px solid ${wallColour === '#FFFFFF' ? '#ccc' : wallColour}`,
              borderRadius: 2,
            }} />
            <div style={{
              position: 'absolute', top: ph * 0.5, left: pw * 0.6,
              width: pw * 0.4, height: ph * 0.5,
              background: floorColour, border: `3px solid ${wallColour === '#FFFFFF' ? '#ccc' : wallColour}`,
              borderRadius: 2,
            }} />
          </div>
        ) : (
          <div style={{
            width: pw, height: ph,
            background: floorColour,
            border: `3px solid ${wallColour === '#FFFFFF' ? '#ccc' : wallColour}`,
            borderRadius: 2,
            position: 'relative',
          }}>
            
            <span style={{
              position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)',
              fontSize: 10, color: '#888', fontFamily: 'monospace', whiteSpace: 'nowrap',
            }}>{widthM}m wide</span>
            <span style={{
              position: 'absolute', right: -36, top: '50%', transform: 'translateY(-50%) rotate(90deg)',
              fontSize: 10, color: '#888', fontFamily: 'monospace', whiteSpace: 'nowrap',
            }}>{heightM}m deep</span>
          </div>
        )}
      </div>

      
      <div className="text-xs text-wood-400">
        Floor area: <span className="font-semibold text-wood-600">{(widthM * heightM).toFixed(1)} m²</span>
      </div>
    </div>
  )
}

//Main Component
export default function RoomSetup() {
  const { user }          = useAuth()
  const { createDesign }  = useDesign()
  const navigate          = useNavigate()

  const [step, setStep]   = useState(1) 
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const [room, setRoom] = useState({
    name:        '',
    widthM:      5,
    heightM:     4,
    shape:       'rectangle',
    wallColour:  '#FAF7F2',
    floorColour: '#C8A882',
  })

  const update = (key, val) => {
    setRoom(prev => ({ ...prev, [key]: val }))
    setErrors(prev => ({ ...prev, [key]: '' }))
  }

  
  const validateStep1 = () => {
    const e = {}
    if (!room.name.trim())        e.name    = 'Please give your room a name.'
    if (room.widthM  < 1 || room.widthM  > 30) e.widthM  = 'Width must be between 1–30 metres.'
    if (room.heightM < 1 || room.heightM > 30) e.heightM = 'Depth must be between 1–30 metres.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (validateStep1()) setStep(2)
  }

  
  const handleSubmit = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 300))

    const design = createDesign(room)

    
    designService.create({
      ...design,
      userId: user.id,
    })

    setLoading(false)
    
    navigate(`/admin/editor/${design.id}`)
  }

  return (
    <div className="min-h-screen bg-wood-50">
      <Navbar />

      <div className="pt-16">
        <div className="max-w-5xl mx-auto px-6 py-10">

          {/* Page header */}
          <div className="mb-8">
            <h1 className="font-display text-4xl font-semibold text-wood-800">Set Up Your Room</h1>
            <p className="text-wood-500 mt-1">Enter your room details before opening the design editor.</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            {['Room Details', 'Colours & Finish'].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${step === i + 1
                    ? 'bg-wood-500 text-white shadow-wood-sm'
                    : step > i + 1
                    ? 'bg-wood-200 text-wood-600'
                    : 'bg-wood-100 text-wood-400'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold
                    ${step === i + 1 ? 'bg-white/20' : ''}`}>
                    {step > i + 1 ? '✓' : i + 1}
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
                <div className="card p-8 flex flex-col gap-6 animate-fade-in-up">
                  <h2 className="font-display text-2xl text-wood-800">Room Details</h2>

                  
                  <div className="flex flex-col gap-1.5">
                    <label className="form-label" htmlFor="roomName">Room Name</label>
                    <input
                      id="roomName"
                      type="text"
                      autoFocus
                      placeholder="e.g. Living Room, Master Bedroom"
                      value={room.name}
                      onChange={e => update('name', e.target.value)}
                      className={`form-input ${errors.name ? 'border-red-400' : ''}`}
                    />
                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                  </div>

                  
                  <div>
                    <label className="form-label">Room Dimensions (metres)</label>
                    <p className="text-xs text-wood-400 mb-3">Enter the real dimensions of the room in metres.</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-wood-500 font-medium">Width (left to right)</label>
                        <div className="relative">
                          <input
                            type="number"
                            min={1} max={30} step={0.5}
                            value={room.widthM}
                            onChange={e => update('widthM', parseFloat(e.target.value) || 1)}
                            className={`form-input pr-10 ${errors.widthM ? 'border-red-400' : ''}`}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-wood-400">m</span>
                        </div>
                        {errors.widthM && <p className="text-xs text-red-500">{errors.widthM}</p>}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-wood-500 font-medium">Depth (front to back)</label>
                        <div className="relative">
                          <input
                            type="number"
                            min={1} max={30} step={0.5}
                            value={room.heightM}
                            onChange={e => update('heightM', parseFloat(e.target.value) || 1)}
                            className={`form-input pr-10 ${errors.heightM ? 'border-red-400' : ''}`}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-wood-400">m</span>
                        </div>
                        {errors.heightM && <p className="text-xs text-red-500">{errors.heightM}</p>}
                      </div>
                    </div>
                  </div>

                  
                  <div>
                    <label className="form-label">Room Shape</label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {SHAPES.map(s => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => update('shape', s.id)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center
                            ${room.shape === s.id
                              ? 'border-wood-500 bg-wood-50 shadow-wood-sm'
                              : 'border-wood-200 bg-white hover:border-wood-300'}`}
                        >
                          <span className="text-3xl">{s.icon}</span>
                          <span className="text-sm font-semibold text-wood-700">{s.label}</span>
                          <span className="text-xs text-wood-400 leading-tight">{s.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button onClick={handleNext} className="btn btn-primary w-full py-3 text-base">
                    Next: Choose Colours →
                  </button>
                </div>
              )}

              
              {step === 2 && (
                <div className="card p-8 flex flex-col gap-6 animate-fade-in-up">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setStep(1)}
                      className="text-wood-400 hover:text-wood-600 transition-colors text-sm">
                      ← Back
                    </button>
                    <h2 className="font-display text-2xl text-wood-800">Colours & Finish</h2>
                  </div>

                  
                  <div>
                    <label className="form-label">Wall Colour</label>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {WALL_COLOURS.map(c => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => update('wallColour', c.value)}
                          title={c.label}
                          className={`w-10 h-10 rounded-lg border-2 transition-all
                            ${room.wallColour === c.value
                              ? 'border-wood-600 scale-110 shadow-wood-md'
                              : 'border-wood-200 hover:border-wood-400'}`}
                          style={{ background: c.value }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-wood-400 mt-2">
                      Selected: {WALL_COLOURS.find(c => c.value === room.wallColour)?.label}
                    </p>
                  </div>

                  
                  <div>
                    <label className="form-label">Floor Type</label>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {FLOOR_TYPES.map(f => (
                        <button
                          key={f.value}
                          type="button"
                          onClick={() => update('floorColour', f.value)}
                          className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-all
                            ${room.floorColour === f.value
                              ? 'border-wood-600 shadow-wood-sm'
                              : 'border-wood-200 hover:border-wood-300'}`}
                        >
                          <div className="w-8 h-8 rounded" style={{ background: f.value, border: '1px solid rgba(0,0,0,0.1)' }} />
                          <span className="text-xs text-wood-500 leading-tight text-center">{f.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  
                  <div className="bg-wood-50 border border-wood-200 rounded-xl p-4">
                    <p className="text-xs text-wood-500 font-medium uppercase tracking-wider mb-2">Summary</p>
                    <div className="grid grid-cols-2 gap-y-1 text-sm">
                      <span className="text-wood-400">Room name</span>
                      <span className="text-wood-700 font-medium">{room.name}</span>
                      <span className="text-wood-400">Dimensions</span>
                      <span className="text-wood-700 font-medium">{room.widthM}m × {room.heightM}m</span>
                      <span className="text-wood-400">Shape</span>
                      <span className="text-wood-700 font-medium capitalize">{room.shape}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn btn-primary w-full py-3 text-base"
                  >
                    {loading
                      ? <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creating room...
                        </span>
                      : '🎨 Open Design Editor →'
                    }
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
                  <span className="badge badge-wood">{(room.widthM * room.heightM).toFixed(1)} m²</span>
                </div>

                <p className="text-xs text-wood-400 mt-4 leading-relaxed">
                  The canvas will be scaled to match your real room dimensions.
                  Furniture will be placed true to scale.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
