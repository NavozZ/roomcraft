import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Author: Asantha

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [form, setForm]         = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username.trim() || !form.password.trim()) {
      setError('Please enter both username and password.')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    const result = login(form.username.trim(), form.password)
    setLoading(false)
    if (result.success) {
      navigate(result.user.role === 'admin' ? '/admin' : '/user')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-wood-50 flex flex-col">

      {/* Navbar */}
      <div className="h-16 border-b border-wood-200 bg-wood-50/90 backdrop-blur-md flex items-center px-8 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="text-2xl">🪑</span>
          <span className="font-display text-2xl font-semibold text-wood-700 tracking-tight">RoomCraft</span>
        </Link>
      </div>

      {/* Body */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in-up">

          {/* Card */}
          <div className="bg-white border border-wood-200 rounded-2xl shadow-wood-lg overflow-hidden">

            {/* Card top */}
            <div className="bg-wood-100 border-b border-wood-200 px-8 py-6 text-center">
              <div className="text-4xl mb-2">👋</div>
              <h1 className="font-display text-3xl font-semibold text-wood-800">Welcome back</h1>
              <p className="text-sm text-wood-500 mt-1">Sign in to your RoomCraft account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-7 flex flex-col gap-5">

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-3">
                  <span className="text-lg">⚠️</span>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <label className="form-label" htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  autoFocus
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="form-label" htmlFor="password">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    className="form-input pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-wood-400 hover:text-wood-600 text-lg transition-colors"
                    tabIndex={-1}
                  >
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-3 text-base mt-1"
              >
                {loading
                  ? <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  : 'Sign In →'
                }
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-wood-200" />
                <span className="text-xs text-wood-400">or</span>
                <div className="flex-1 h-px bg-wood-200" />
              </div>

              <p className="text-center text-sm text-wood-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-wood-600 font-medium hover:text-wood-800 underline">
                  Create one here
                </Link>
              </p>
            </form>
          </div>

          {/* Demo credentials */}
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2.5">
              🔑 Demo Accounts (for testing)
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-700 font-medium">🎨 Designer (Admin)</span>
                <code className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-mono">
                  admin / admin123
                </code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-700 font-medium">🏠 Customer (User)</span>
                <code className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-mono">
                  user / user123
                </code>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
