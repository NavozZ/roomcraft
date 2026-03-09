import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import { useAuth } from '../../hooks/useAuth'

// Author: Navodya

export default function UserDashboard() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-wood-50">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-4xl font-semibold text-wood-800">
                Hello, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p className="text-wood-500 mt-1">
                Visualise furniture in your room before you buy.
              </p>
            </div>
            <Link to="/user/room-setup" className="btn btn-primary btn-lg">
              Set Up My Room
            </Link>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link to="/user/room-setup"
              className="card p-8 flex flex-col items-center text-center gap-3 hover:shadow-wood-md transition-shadow no-underline group">
              <span className="text-5xl">📐</span>
              <h3 className="font-display text-xl text-wood-800">Set Up My Room</h3>
              <p className="text-sm text-wood-400">Enter your room dimensions and start placing furniture</p>
            </Link>

            <div className="card p-8 flex flex-col items-center text-center gap-3 opacity-60">
              <span className="text-5xl">🏠</span>
              <h3 className="font-display text-xl text-wood-800">View in 3D</h3>
              <p className="text-sm text-wood-400">Set up a room first to view it in 3D</p>
            </div>

            <div className="card p-8 flex flex-col items-center text-center gap-3 opacity-60">
              <span className="text-5xl">💾</span>
              <h3 className="font-display text-xl text-wood-800">Saved Designs</h3>
              <p className="text-sm text-wood-400">No saved designs yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
