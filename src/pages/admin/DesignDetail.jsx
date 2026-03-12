// DesignDetail.jsx — Navodya
import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import { designService } from '../../services/designService'

export default function DesignDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [design, setDesign] = useState(null)

  useEffect(() => {
    const d = designService.getById(id)
    if (d) setDesign(d)
    else navigate('/admin')
  }, [id])

  const handleDelete = () => {
    if (window.confirm('Delete this design? This cannot be undone.')) {
      designService.delete(id)
      navigate('/admin')
    }
  }

  if (!design) return (
    <div className="min-h-screen bg-wood-50 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-wood-200 border-t-wood-500 rounded-full animate-spin" />
    </div>
  )

  const { room, furniture, name, createdAt, updatedAt } = design

  return (
    <div className="min-h-screen bg-wood-50">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <Link to="/admin" className="text-sm text-wood-400 hover:text-wood-600 mb-2 inline-block">← My Designs</Link>
              <h1 className="font-display text-4xl font-semibold text-wood-800">{name}</h1>
              <p className="text-wood-400 text-sm mt-1">
                Created {new Date(createdAt).toLocaleDateString()} ·
                Last edited {new Date(updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Link to={`/admin/editor/${id}`} className="btn btn-primary">✏️ Edit Design</Link>
              <Link to={`/admin/view3d/${id}`} className="btn btn-secondary">🏠 View 3D</Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Room info */}
            <div className="card p-6">
              <h3 className="font-display text-lg text-wood-800 mb-4">Room</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-wood-400">Name</span>
                  <span className="text-wood-700 font-medium">{room?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-wood-400">Size</span>
                  <span className="text-wood-700 font-medium">{room?.widthM}m × {room?.heightM}m</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-wood-400">Area</span>
                  <span className="text-wood-700 font-medium">{((room?.widthM||0) * (room?.heightM||0)).toFixed(1)} m²</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-wood-400">Shape</span>
                  <span className="text-wood-700 font-medium capitalize">{room?.shape}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-wood-400">Wall colour</span>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded border border-wood-200" style={{ background: room?.wallColour }} />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-wood-400">Floor</span>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded border border-wood-200" style={{ background: room?.floorColour }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Furniture list */}
            <div className="card p-6 md:col-span-2">
              <h3 className="font-display text-lg text-wood-800 mb-4">
                Furniture <span className="text-wood-400 text-base font-normal">({furniture?.length || 0} items)</span>
              </h3>
              {furniture?.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl">🪑</span>
                  <p className="text-wood-400 text-sm mt-2">No furniture placed yet</p>
                  <Link to={`/admin/editor/${id}`} className="btn btn-primary btn-sm mt-4">Open Editor</Link>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {furniture.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-wood-50 rounded-lg">
                      <div className="w-6 h-6 rounded flex-shrink-0" style={{ background: item.colour }} />
                      <span className="text-sm font-medium text-wood-700 flex-1">{item.label}</span>
                      <span className="text-xs text-wood-400">{item.widthM}×{item.depthM}m</span>
                      <span className="text-xs text-wood-400">at ({item.x.toFixed(1)}, {item.y.toFixed(1)})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Danger zone */}
          <div className="mt-8 card p-6 border-red-200">
            <h3 className="font-display text-lg text-red-700 mb-2">Delete Design</h3>
            <p className="text-sm text-wood-500 mb-4">This will permanently remove the design and all its furniture.</p>
            <button onClick={handleDelete} className="btn btn-danger btn-sm">🗑️ Delete This Design</button>
          </div>

        </div>
      </div>
    </div>
  )
}
