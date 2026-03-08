import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'

const FEATURES = [
  { icon: '📐', title: '2D Room Layout',     desc: 'Drag and drop furniture onto a scaled floor plan. Rotate, resize and position everything to scale.' },
  { icon: '🏠', title: '3D Visualisation',   desc: 'Switch to a stunning 3D view. Rotate the room 360° and zoom in to see every detail.' },
  { icon: '🎨', title: 'Colour & Shading',   desc: 'Change wall colours, floor textures and furniture colours. Apply shading for realistic lighting.' },
  { icon: '💾', title: 'Save Designs',       desc: 'Save multiple room designs. Come back later, edit, and compare different layouts.' },
  { icon: '👤', title: 'Two User Roles',     desc: 'Designers manage in-store portfolios. Customers visualise rooms from home or in-shop.' },
  { icon: '📏', title: 'True to Scale',      desc: 'Enter real room dimensions. Every furniture piece is scaled accurately for realistic layouts.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-wood-50">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 min-h-screen flex items-center justify-between gap-16 pt-16">

        {/* Left: copy */}
        <div className="flex-1 max-w-xl animate-fade-in-up">
          <span className="inline-block px-3 py-1 bg-wood-100 border border-wood-300 rounded-full text-xs font-medium text-wood-600 uppercase tracking-widest mb-6">
            Furniture Visualisation Tool
          </span>

          <h1 className="font-display text-6xl font-semibold leading-tight text-wood-900 mb-6">
            Design your perfect<br />
            <em className="text-wood-500 italic">room, before you buy.</em>
          </h1>

          <p className="text-lg text-wood-600 leading-relaxed mb-8">
            RoomCraft lets designers and customers visualise how furniture
            fits in any room — in 2D layouts and stunning 3D views.
          </p>

          <div className="flex gap-3 flex-wrap">
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Designing
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In
            </Link>
          </div>
        </div>

        {/* Right: room preview card */}
        <div className="flex-1 flex justify-center items-center">
          <div className="bg-white border-2 border-wood-200 rounded-2xl p-6 shadow-wood-xl w-80">
            {/* Fake 2D room */}
            <div className="w-full h-56 bg-amber-50 rounded-lg border-2 border-wood-300 relative mb-3 overflow-hidden">
              {/* Grid lines */}
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'linear-gradient(#A67C52 1px, transparent 1px), linear-gradient(90deg, #A67C52 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
              {/* Furniture shapes */}
              <div className="absolute top-[18%] left-[8%] w-[44%] h-[28%] bg-wood-500 rounded opacity-85" />
              <div className="absolute bottom-[12%] right-[8%] w-[34%] h-[20%] bg-wood-400 rounded opacity-85" />
              <div className="absolute top-[8%] right-[14%] w-[18%] h-[20%] bg-wood-600 rounded opacity-75" />
              <div className="absolute bottom-[34%] left-[16%] w-[20%] h-[16%] bg-wood-300 rounded opacity-85" />
              {/* Labels */}
              <span className="absolute top-[22%] left-[10%] text-2xs text-white font-medium">Sofa</span>
              <span className="absolute bottom-[16%] right-[11%] text-2xs text-white font-medium">Table</span>
            </div>
            <p className="text-center text-xs text-wood-400 font-medium uppercase tracking-widest">
              Live 2D Preview
            </p>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="bg-wood-100 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-5xl text-center text-wood-900 mb-3">
            Everything you need
          </h2>
          <p className="text-center text-wood-600 text-lg mb-14">
            From first sketch to final decision — RoomCraft covers the whole journey.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="card p-8 hover:shadow-wood-md transition-shadow duration-200">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h5 className="font-display text-xl text-wood-800 mb-2">{f.title}</h5>
                <p className="text-sm text-wood-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="bg-wood-700 py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-5xl text-wood-50 mb-4">Ready to start?</h2>
          <p className="text-wood-300 text-lg mb-10">
            Create your free account and design your first room today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register?role=admin"
              className="btn btn-lg bg-wood-50 text-wood-700 hover:bg-white">
              🎨 I'm a Designer
            </Link>
            <Link to="/register?role=user"
              className="btn btn-lg border border-wood-400 text-wood-100 hover:bg-wood-600">
              🏠 I'm a Customer
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-wood-200 py-8 text-center">
        <p className="text-sm text-wood-400">
          © 2026 RoomCraft — PUSL3122 HCI Coursework
        </p>
      </footer>
    </div>
  )
}