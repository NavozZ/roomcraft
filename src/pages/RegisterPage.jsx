import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Author: Asantha

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate     = useNavigate()
  const [searchParams] = useSearchParams()

  const [role, setRole] = useState(searchParams.get('role') || 'user')
  const [form, setForm] = useState({
    name: '', username: '', password: '', confirm: '',
  })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass]       = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading]         = useState(false)
  const [globalError, setGlobalError] = useState('')

  // Pre-select role if coming from landing page CTA
  useEffect(() => {
    const r = searchParams.get('role')
    if (r === 'admin' || r === 'user') setRole(r)
  }, [searchParams])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: '' }))
    setGlobalError('')
  }

  // Per-field validation
  const validate = () => {
    const e = {}
    if (!form.name.trim())
      e.name = 'Full name is required.'
    if (!form.username.trim())
      e.username = 'Username is required.'
    else if (form.username.trim().length < 3)
      e.username = 'Username must be at least 3 characters.'
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username.trim()))
      e.username = 'Username can only contain letters, numbers, and underscores.'
    if (!form.password)
      e.password = 'Password is required.'
    else if (form.password.length < 6)
      e.password = 'Password must be at least 6 characters.'
    if (!form.confirm)
      e.confirm = 'Please confirm your password.'
    else if (form.password !== form.confirm)
      e.confirm = 'Passwords do not match.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    const result = register(form.name.trim(), form.username.trim(), form.password, role)
    setLoading(false)
    if (result.success) {
      navigate(role === 'admin' ? '/admin' : '/user')
    } else {
      setGlobalError(result.error || 'Registration failed. Please try again.')
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
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md animate-fade-in-up">

          {/* Card */}
          <div className="bg-white border border-wood-200 rounded-2xl shadow-wood-lg overflow-hidden">

            {/* Card top */}
            <div className="bg-wood-100 border-b border-wood-200 px-8 py-6 text-center">
              <div className="text-4xl mb-2">🏡</div>
              <h1 className="font-display text-3xl font-semibold text-wood-800">Create Account</h1>
              <p className="text-sm text-wood-500 mt-1">Join RoomCraft and start designing</p>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-7 flex flex-col gap-5">

              {/* Global error */}
              {globalError && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-3">
                  <span className="text-lg">⚠️</span>
                  <p className="text-sm text-red-600">{globalError}</p>
                </div>
              )}

              {/* Role selector */}
              <div>
                <label className="form-label mb-2 block">I am a...</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-150
                      ${role === 'admin'
                        ? 'border-wood-500 bg-wood-50 shadow-wood-sm'
                        : 'border-wood-200 bg-white hover:border-wood-300'}`}
                  >
                    <span className="text-3xl">🎨</span>
                    <span className="text-sm font-semibold text-wood-700">Designer</span>
                    <span className="text-xs text-wood-400 text-center leading-tight">
                      In-store staff managing room designs
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-150
                      ${role === 'user'
                        ? 'border-wood-500 bg-wood-50 shadow-wood-sm'
                        : 'border-wood-200 bg-white hover:border-wood-300'}`}
                  >
                    <span className="text-3xl">🏠</span>
                    <span className="text-sm font-semibold text-wood-700">Customer</span>
                    <span className="text-xs text-wood-400 text-center leading-tight">
                      Visualising furniture for my room
                    </span>
                  </button>
                </div>
              </div>

              {/* Full name */}
              <div className="flex flex-col gap-1.5">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  autoFocus
                  placeholder="e.g. Navodya Perera"
                  value={form.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <label className="form-label" htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="e.g. navodya_p"
                  value={form.username}
                  onChange={handleChange}
                  className={`form-input ${errors.username ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
                />
                {errors.username
                  ? <p className="text-xs text-red-500">{errors.username}</p>
                  : <p className="text-xs text-wood-400">Letters, numbers and underscores only</p>
                }
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="form-label" htmlFor="password">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    className={`form-input pr-12 ${errors.password ? 'border-red-400' : ''}`}
                  />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-wood-400 hover:text-wood-600 text-lg" tabIndex={-1}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>

              {/* Confirm password */}
              <div className="flex flex-col gap-1.5">
                <label className="form-label" htmlFor="confirm">Confirm Password</label>
                <div className="relative">
                  <input
                    id="confirm"
                    name="confirm"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    value={form.confirm}
                    onChange={handleChange}
                    className={`form-input pr-12 ${errors.confirm ? 'border-red-400' : ''}`}
                  />
                  <button type="button" onClick={() => setShowConfirm(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-wood-400 hover:text-wood-600 text-lg" tabIndex={-1}>
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.confirm && <p className="text-xs text-red-500">{errors.confirm}</p>}
                {/* Password match indicator */}
                {form.confirm && !errors.confirm && form.password === form.confirm && (
                  <p className="text-xs text-green-600">✅ Passwords match</p>
                )}
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
                      Creating account...
                    </span>
                  : `Create ${role === 'admin' ? 'Designer' : 'Customer'} Account →`
                }
              </button>

              {/* Login link */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-wood-200" />
                <span className="text-xs text-wood-400">already registered?</span>
                <div className="flex-1 h-px bg-wood-200" />
              </div>
              <p className="text-center text-sm text-wood-500">
                <Link to="/login" className="text-wood-600 font-medium hover:text-wood-800 underline">
                  Sign in to existing account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
