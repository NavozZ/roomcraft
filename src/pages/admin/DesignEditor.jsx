import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import { useDesign } from '../../hooks/useDesign'
import { designService } from '../../services/designService'
import { FURNITURE_CATALOGUE } from '../../data/furnitureCatalogue'

// Author: Sadaru

const PIXELS_PER_METRE = 60  // 60px = 1 metre on canvas

// ── Colour & shading tools (Ravindu integrates here later) ────
const COLOUR_SWATCHES = [
  '#C8A882','#A67C52','#7A5230','#4A2F12',
  '#B8956A','#D4C4B0','#8B6340','#5C3D1E',
  '#A0B4C8','#A0C8A0','#C8A0A0','#C8C8A0',
  '#888888','#555555','#DDDDDD','#FFFFFF',
]

// ── Helpers ───────────────────────────────────────────────────
const mToPx = (m) => m * PIXELS_PER_METRE
const pxToM = (px) => px / PIXELS_PER_METRE

export default function DesignEditor() {
  const { id }           = useParams()
  const navigate         = useNavigate()
  const { currentDesign, loadDesign, addFurniture, updateFurniture, removeFurniture, updateRoom } = useDesign()

  const canvasRef   = useRef(null)
  const [selected, setSelected]     = useState(null)     // selected furniture id
  const [dragging, setDragging]     = useState(null)     // { id, offsetX, offsetY }
  const [saveStatus, setSaveStatus] = useState('')       // 'saved' | 'saving' | ''
  const [zoom, setZoom]             = useState(1)

  // ── Load design on mount ──────────────────────────────────
  useEffect(() => {
    if (!currentDesign || currentDesign.id !== id) {
      const saved = designService.getById(id)
      if (saved) loadDesign(saved)
      else navigate('/admin')  // design not found
    }
  }, [id])

  if (!currentDesign) {
    return (
      <div className="min-h-screen bg-wood-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-wood-200 border-t-wood-500 rounded-full animate-spin" />
      </div>
    )
  }

  const room      = currentDesign.room
  const furniture = currentDesign.furniture
  const canvasW   = mToPx(room.widthM)
  const canvasH   = mToPx(room.heightM)

  const selectedItem = furniture.find(f => f.id === selected)

  // ── Drag from palette onto canvas ─────────────────────────
  const handlePaletteDragStart = (e, catalogueItem) => {
    e.dataTransfer.setData('furniture', JSON.stringify(catalogueItem))
  }

  const handleCanvasDrop = (e) => {
    e.preventDefault()
    const raw = e.dataTransfer.getData('furniture')
    if (!raw) return
    const item = JSON.parse(raw)
    const rect  = canvasRef.current.getBoundingClientRect()
    const xPx   = (e.clientX - rect.left) / zoom
    const yPx   = (e.clientY - rect.top)  / zoom
    // Convert drop position to metres, clamped inside room
    const xM = Math.max(0, Math.min(pxToM(xPx) - item.widthM / 2, room.widthM  - item.widthM))
    const yM = Math.max(0, Math.min(pxToM(yPx) - item.depthM / 2, room.heightM - item.depthM))
    addFurniture({ ...item, x: xM, y: yM })
  }

  // ── Drag furniture already on canvas ──────────────────────
  const handleItemMouseDown = (e, itemId) => {
    e.stopPropagation()
    setSelected(itemId)
    const rect = canvasRef.current.getBoundingClientRect()
    const item = furniture.find(f => f.id === itemId)
    setDragging({
      id: itemId,
      offsetX: (e.clientX - rect.left) / zoom - mToPx(item.x),
      offsetY: (e.clientY - rect.top)  / zoom - mToPx(item.y),
    })
  }

  const handleCanvasMouseMove = (e) => {
    if (!dragging) return
    const rect = canvasRef.current.getBoundingClientRect()
    const item = furniture.find(f => f.id === dragging.id)
    const newXpx = (e.clientX - rect.left) / zoom - dragging.offsetX
    const newYpx = (e.clientY - rect.top)  / zoom - dragging.offsetY
    const xM = Math.max(0, Math.min(pxToM(newXpx), room.widthM  - item.widthM))
    const yM = Math.max(0, Math.min(pxToM(newYpx), room.heightM - item.depthM))
    updateFurniture(dragging.id, { x: xM, y: yM })
  }

  const handleCanvasMouseUp = () => setDragging(null)

  // ── Save ──────────────────────────────────────────────────
  const handleSave = () => {
    setSaveStatus('saving')
    designService.update(id, { furniture, room })
    setTimeout(() => setSaveStatus('saved'), 500)
    setTimeout(() => setSaveStatus(''), 2500)
  }

  // ── Delete selected furniture ─────────────────────────────
  const handleDelete = () => {
    if (!selected) return
    removeFurniture(selected)
    setSelected(null)
  }

  // ── Rotate selected furniture ─────────────────────────────
  const handleRotate = (deg) => {
    if (!selected) return
    const item = furniture.find(f => f.id === selected)
    updateFurniture(selected, { rotation: ((item.rotation || 0) + deg + 360) % 360 })
  }

  return (
    <div className="min-h-screen bg-wood-900 flex flex-col">
      <Navbar />

      <div className="pt-16 flex flex-1 overflow-hidden">

        {/* ── Furniture Palette (left) ── */}
        <aside className="w-48 bg-wood-800 border-r border-wood-700 flex flex-col overflow-y-auto flex-shrink-0">
          <div className="px-3 py-3 border-b border-wood-700">
            <p className="text-xs text-wood-400 uppercase tracking-widest font-medium">Furniture</p>
            <p className="text-xs text-wood-500 mt-0.5">Drag onto canvas</p>
          </div>
          <div className="p-2 grid grid-cols-2 gap-1.5 flex-1">
            {FURNITURE_CATALOGUE.map(item => (
              <div
                key={item.type}
                draggable
                onDragStart={e => handlePaletteDragStart(e, item)}
                className="flex flex-col items-center gap-1 p-2 bg-wood-700 hover:bg-wood-600 rounded-lg cursor-grab active:cursor-grabbing transition-colors border border-wood-600 hover:border-wood-400"
                title={`${item.label} — ${item.widthM}m × ${item.depthM}m`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-2xs text-wood-300 text-center leading-tight font-medium">{item.label}</span>
                <span className="text-2xs text-wood-500">{item.widthM}×{item.depthM}m</span>
              </div>
            ))}
          </div>
        </aside>

        {/* ── Canvas area (centre) ── */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* Toolbar */}
          <div className="h-12 bg-wood-800 border-b border-wood-700 flex items-center px-4 gap-3 flex-shrink-0">
            <span className="text-sm font-medium text-wood-200 font-display">{room.name}</span>
            <span className="text-wood-600">·</span>
            <span className="text-xs text-wood-400">{room.widthM}m × {room.heightM}m</span>
            <div className="flex-1" />

            {/* Zoom */}
            <div className="flex items-center gap-1">
              <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
                className="w-7 h-7 rounded bg-wood-700 hover:bg-wood-600 text-wood-300 text-sm transition-colors">−</button>
              <span className="text-xs text-wood-400 w-12 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(z => Math.min(2, z + 0.1))}
                className="w-7 h-7 rounded bg-wood-700 hover:bg-wood-600 text-wood-300 text-sm transition-colors">+</button>
            </div>

            <span className="text-wood-600">·</span>

            {/* Save */}
            <button onClick={handleSave}
              className="btn btn-primary btn-sm">
              {saveStatus === 'saving' ? '...' : saveStatus === 'saved' ? '✓ Saved' : '💾 Save'}
            </button>

            {/* View 3D */}
            <Link to={`/admin/view3d/${id}`}
              className="btn btn-secondary btn-sm">
              🏠 View 3D
            </Link>
          </div>

          {/* Canvas scroll wrapper */}
          <div className="flex-1 overflow-auto bg-wood-900 flex items-center justify-center p-8">
            <div
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.15s' }}>
              <div
                ref={canvasRef}
                onDrop={handleCanvasDrop}
                onDragOver={e => e.preventDefault()}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
                onClick={() => setSelected(null)}
                style={{
                  width:    canvasW,
                  height:   canvasH,
                  background: room.floorColour,
                  border:   `4px solid ${room.wallColour === '#FFFFFF' ? '#ccc' : room.wallColour}`,
                  position: 'relative',
                  cursor:   dragging ? 'grabbing' : 'default',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
                  // Grid overlay
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)`,
                  backgroundSize: `${PIXELS_PER_METRE}px ${PIXELS_PER_METRE}px`,
                }}
              >
                {/* Scale bar */}
                <div style={{
                  position: 'absolute', bottom: 8, left: 8,
                  display: 'flex', alignItems: 'center', gap: 4, pointerEvents: 'none',
                }}>
                  <div style={{ width: PIXELS_PER_METRE, height: 3, background: 'rgba(0,0,0,0.3)' }} />
                  <span style={{ fontSize: 10, color: 'rgba(0,0,0,0.4)', fontFamily: 'monospace' }}>1m</span>
                </div>

                {/* Furniture items */}
                {furniture.map(item => {
                  const isSelected = item.id === selected
                  const w = mToPx(item.widthM)
                  const h = mToPx(item.depthM)
                  return (
                    <div
                      key={item.id}
                      onMouseDown={e => handleItemMouseDown(e, item.id)}
                      onClick={e => { e.stopPropagation(); setSelected(item.id) }}
                      style={{
                        position:  'absolute',
                        left:      mToPx(item.x),
                        top:       mToPx(item.y),
                        width:     w,
                        height:    h,
                        background: item.colour,
                        border:    isSelected ? '2px solid #4A7AA8' : '1.5px solid rgba(0,0,0,0.2)',
                        borderRadius: 3,
                        cursor:    'grab',
                        transform: `rotate(${item.rotation || 0}deg)`,
                        transformOrigin: 'center center',
                        boxShadow: isSelected
                          ? '0 0 0 3px rgba(74,122,168,0.3), 0 2px 8px rgba(0,0,0,0.3)'
                          : '0 2px 6px rgba(0,0,0,0.2)',
                        display:   'flex',
                        alignItems:'center',
                        justifyContent: 'center',
                        userSelect: 'none',
                        transition: dragging?.id === item.id ? 'none' : 'box-shadow 0.1s',
                        filter: `brightness(${1 - (item.shading || 0) * 0.3})`,
                        zIndex: isSelected ? 10 : 1,
                      }}
                    >
                      <span style={{ fontSize: Math.min(w, h) * 0.25, opacity: 0.7 }}>{item.icon}</span>
                      {(w > 50 && h > 30) && (
                        <span style={{
                          position: 'absolute', bottom: 3,
                          fontSize: 8, color: 'rgba(255,255,255,0.7)',
                          fontFamily: 'monospace', letterSpacing: 0.5,
                          textTransform: 'uppercase',
                        }}>{item.label}</span>
                      )}

                      {isSelected && (
                        <>
                          <div className="absolute w-2.5 h-2.5 bg-blue-400 border-2 border-white rounded-sm" style={{top:0,left:0,transform:'translate(-50%,-50%)'}} />
                          <div className="absolute w-2.5 h-2.5 bg-blue-400 border-2 border-white rounded-sm" style={{top:0,right:0,transform:'translate(50%,-50%)'}} />
                          <div className="absolute w-2.5 h-2.5 bg-blue-400 border-2 border-white rounded-sm" style={{bottom:0,left:0,transform:'translate(-50%,50%)'}} />
                          <div className="absolute w-2.5 h-2.5 bg-blue-400 border-2 border-white rounded-sm" style={{bottom:0,right:0,transform:'translate(50%,50%)'}} />
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </main>

        {/* ── Right panel: properties ── */}
        <aside className="w-52 bg-wood-800 border-l border-wood-700 flex flex-col flex-shrink-0">
          <div className="px-4 py-3 border-b border-wood-700">
            <p className="text-xs text-wood-400 uppercase tracking-widest font-medium">
              {selectedItem ? selectedItem.label : 'Properties'}
            </p>
          </div>

          {selectedItem ? (
            <div className="p-4 flex flex-col gap-5 overflow-y-auto flex-1">

              {/* Colour */}
              <div>
                <p className="text-xs text-wood-400 uppercase tracking-wider mb-2">Colour</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {COLOUR_SWATCHES.map(c => (
                    <button key={c}
                      onClick={() => updateFurniture(selected, { colour: c })}
                      className={`w-8 h-8 rounded transition-all ${selectedItem.colour === c ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-wood-800 scale-110' : 'hover:scale-105'}`}
                      style={{ background: c, border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  ))}
                </div>
                {/* Custom hex */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-6 h-6 rounded flex-shrink-0" style={{ background: selectedItem.colour }} />
                  <input
                    type="color"
                    value={selectedItem.colour}
                    onChange={e => updateFurniture(selected, { colour: e.target.value })}
                    className="w-full h-7 rounded cursor-pointer border border-wood-600 bg-transparent"
                    title="Custom colour"
                  />
                </div>
              </div>

              {/* Shading */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-wood-400 uppercase tracking-wider">Shading</p>
                  <span className="text-xs text-wood-500">{Math.round((selectedItem.shading || 0) * 100)}%</span>
                </div>
                <input
                  type="range" min={0} max={1} step={0.05}
                  value={selectedItem.shading || 0}
                  onChange={e => updateFurniture(selected, { shading: parseFloat(e.target.value) })}
                  className="w-full accent-wood-500"
                />
                <div className="flex justify-between text-2xs text-wood-600 mt-1">
                  <span>Light</span><span>Dark</span>
                </div>
              </div>

              {/* Rotation */}
              <div>
                <p className="text-xs text-wood-400 uppercase tracking-wider mb-2">Rotation</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => handleRotate(-90)}
                    className="btn btn-secondary btn-sm">↺ 90°</button>
                  <button onClick={() => handleRotate(90)}
                    className="btn btn-secondary btn-sm">↻ 90°</button>
                </div>
                <p className="text-2xs text-wood-600 mt-1 text-center">{selectedItem.rotation || 0}° rotation</p>
              </div>

              {/* Position info */}
              <div className="bg-wood-700 rounded-lg p-3">
                <p className="text-xs text-wood-400 uppercase tracking-wider mb-1.5">Position</p>
                <div className="text-xs text-wood-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-wood-500">X</span>
                    <span>{selectedItem.x.toFixed(1)}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-wood-500">Y</span>
                    <span>{selectedItem.y.toFixed(1)}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-wood-500">Size</span>
                    <span>{selectedItem.widthM}×{selectedItem.depthM}m</span>
                  </div>
                </div>
              </div>

              {/* Delete */}
              <button onClick={handleDelete}
                className="btn btn-danger btn-sm w-full mt-auto">
                🗑️ Remove
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center gap-2">
              <span className="text-3xl opacity-30">🪑</span>
              <p className="text-xs text-wood-500">Click a furniture item to edit its colour, shading and rotation</p>
            </div>
          )}

          {/* Room colour (always visible) */}
          <div className="border-t border-wood-700 p-4">
            <p className="text-xs text-wood-400 uppercase tracking-wider mb-2">Wall Colour</p>
            <input
              type="color"
              value={room.wallColour || '#FAF7F2'}
              onChange={e => updateRoom({ wallColour: e.target.value })}
              className="w-full h-8 rounded cursor-pointer border border-wood-600 bg-transparent"
            />
          </div>
        </aside>
      </div>
    </div>
  )
}
