import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import { useAuth } from '../../hooks/useAuth'

// Author: Asantha

export default function AdminDashboard() {
  const { user } = useAuth()

  // Placeholder — Asantha will replace with real data from designService
  const designs = []

  return (
    <div className="min-h-screen bg-wood-50">
      <Navbar />

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-4xl font-semibold text-wood-800">
                My Designs
              </h1>
              <p className="text-wood-500 mt-1">
                Welcome back, {user?.name}. You have {designs.length} saved designs.
              </p>
            </div>
            <Link to="/admin/room-setup" className="btn btn-primary btn-lg">
              + New Design
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Designs', value: designs.length, icon: '🗂️' },
              { label: 'Furniture Used', value: 0,             icon: '🪑' },
              { label: 'Last Edited',    value: '—',           icon: '🕐' },
            ].map((s, i) => (
              <div key={i} className="card p-5 flex items-center gap-4">
                <span className="text-3xl">{s.icon}</span>
                <div>
                  <div className="font-display text-2xl font-semibold text-wood-800">{s.value}</div>
                  <div className="text-xs text-wood-400 uppercase tracking-wide">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Design grid */}
          {designs.length === 0 ? (
            // Empty state
            <div className="card p-16 text-center">
              <div className="text-6xl mb-4">🪑</div>
              <h3 className="font-display text-2xl text-wood-700 mb-2">No designs yet</h3>
              <p className="text-wood-400 mb-6 text-sm">
                Create your first room design to get started.
              </p>
              <Link to="/admin/room-setup" className="btn btn-primary">
                Create First Design
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {designs.map(design => (
                <div key={design.id} className="card hover:shadow-wood-md transition-shadow">
                  {/* Thumbnail */}
                  <div className="h-40 bg-wood-100 flex items-center justify-center border-b border-wood-200">
                    <span className="text-4xl opacity-40">🏠</span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-display text-lg text-wood-800">{design.name}</h4>
                      <span className="badge badge-wood text-2xs">{design.room?.shape || 'Room'}</span>
                    </div>
                    <p className="text-xs text-wood-400 mb-4">
                      {design.furniture?.length || 0} items · {design.room?.widthM}m × {design.room?.heightM}m
                    </p>
                    <div className="flex gap-2">
                      <Link to={`/admin/editor/${design.id}`} className="btn btn-secondary btn-sm flex-1 justify-center">
                        ✏️ Edit
                      </Link>
                      <Link to={`/admin/view3d/${design.id}`} className="btn btn-secondary btn-sm flex-1 justify-center">
                        🏠 3D View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add new card */}
              <Link to="/admin/room-setup"
                className="card border-dashed border-2 border-wood-300 flex flex-col items-center justify-center p-10 gap-3 hover:border-wood-400 hover:bg-wood-50 transition-all no-underline min-h-[200px]">
                <div className="w-12 h-12 rounded-full bg-wood-100 flex items-center justify-center text-2xl">+</div>
                <span className="text-sm font-medium text-wood-500">New Design</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
