import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import { useAuth } from '../../hooks/useAuth'
import { designService } from '../../services/designService'

export default function UserDashboard() {
  const { user } = useAuth()
  const [designs, setDesigns] = useState([])

  useEffect(() => {
    setDesigns(designService.getByUser(user.id))
  }, [user.id])

  const latest = designs[designs.length - 1]

  return (
    <div className="min-h-screen bg-wood-50">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-10">

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-4xl font-semibold text-wood-800">
                Hello, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p className="text-wood-500 mt-1">Visualise furniture in your room before you buy.</p>
            </div>
            <Link to="/user/room-setup" className="btn btn-primary btn-lg">
              Set Up My Room
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link to="/user/room-setup"
              className="card p-8 flex flex-col items-center text-center gap-3 hover:shadow-wood-md transition-shadow no-underline group">
              <span className="text-5xl">📐</span>
              <h3 className="font-display text-xl text-wood-800">Set Up My Room</h3>
              <p className="text-sm text-wood-400">Enter your room dimensions and preview furniture in 3D</p>
            </Link>

            {latest ? (
              <Link to={`/user/view3d/${latest.id}`}
                className="card p-8 flex flex-col items-center text-center gap-3 hover:shadow-wood-md transition-shadow no-underline">
                <span className="text-5xl">🏠</span>
                <h3 className="font-display text-xl text-wood-800">View in 3D</h3>
                <p className="text-sm text-wood-400">Continue with: {latest.room?.name}</p>
                <span className="badge badge-wood">Open →</span>
              </Link>
            ) : (
              <div className="card p-8 flex flex-col items-center text-center gap-3 opacity-50">
                <span className="text-5xl">🏠</span>
                <h3 className="font-display text-xl text-wood-800">View in 3D</h3>
                <p className="text-sm text-wood-400">Set up a room first</p>
              </div>
            )}

            <div className="card p-8 flex flex-col items-center text-center gap-3">
              <span className="text-5xl">💾</span>
              <h3 className="font-display text-xl text-wood-800">My Rooms</h3>
              <p className="text-sm text-wood-400">
                {designs.length === 0 ? 'No saved rooms yet' : `${designs.length} saved room${designs.length>1?'s':''}`}
              </p>
              {designs.length > 0 && (
                <div className="w-full space-y-1 mt-1">
                  {designs.slice(-3).reverse().map(d => (
                    <Link key={d.id} to={`/user/view3d/${d.id}`}
                      className="flex items-center justify-between px-3 py-2 bg-wood-50 rounded-lg text-sm no-underline hover:bg-wood-100 transition-colors">
                      <span className="text-wood-700 font-medium">{d.room?.name}</span>
                      <span className="text-xs text-wood-400">{d.room?.widthM}×{d.room?.heightM}m</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
