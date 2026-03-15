import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Author: Asantha

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate      = useNavigate()
  const [searchParams] = useSearchParams()

  const [role, setRole]               = useState(searchParams.get('role') || 'user')
  const [form, setForm]               = useState({ name: '', username: '', password: '', confirm: '' })
  const [errors, setErrors]           = useState({})
  const [showPass, setShowPass]       = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading]         = useState(false)
  const [globalError, setGlobalError] = useState('')

  useEffect(() => {
    const r = searchParams.get('role')
    if (r === 'admin' || r === 'user') setRole(r)
  }, [searchParams])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: '' }))
    setGlobalError('')
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())
      e.name = 'Full name is required.'
    if (!form.username.trim())
      e.username = 'Username is required.'
    else if (form.username.trim().length < 3)
      e.username = 'Username must be at least 3 characters.'
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username.trim()))
      e.username = 'Letters, numbers and underscores only.'
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
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    const result = register(form.name.trim(), form.username.trim(), form.password, role)
    setLoading(false)
    if (result.success) navigate(role === 'admin' ? '/admin' : '/user')
    else setGlobalError(result.error || 'Registration failed. Please try again.')
  }

  // ── Shared styles ─────────────────────────────────────────────
  const inputStyle = (hasError) => ({
    width: '100%', padding: '11px 16px', borderRadius: 10,
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${hasError ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`,
    color: '#FAF7F2', fontSize: '0.875rem', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s',
  })

  const labelStyle = {
    display: 'block', fontSize: '0.72rem', fontWeight: 600,
    color: '#888', marginBottom: 7, letterSpacing: '0.06em', textTransform: 'uppercase',
  }

  const passwordStrength = () => {
    const p = form.password
    if (!p) return null
    if (p.length < 6) return { label: 'Too short', color: '#ef4444', width: '25%' }
    if (p.length < 8) return { label: 'Weak', color: '#f97316', width: '45%' }
    if (p.length < 12 || !/[0-9]/.test(p)) return { label: 'Fair', color: '#eab308', width: '65%' }
    return { label: 'Strong', color: '#22c55e', width: '100%' }
  }
  const strength = passwordStrength()

  const passwordsMatch = form.confirm && form.password === form.confirm && !errors.confirm

  return (
    <div style={{ minHeight: '100vh', background: '#0e0a06', color: '#FAF7F2', display: 'flex', flexDirection: 'column' }}>

      {/* Top bar */}
      <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <span style={{ fontSize: '1.3rem' }}>🪑</span>
          <span style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.4rem', fontWeight: 600, color: '#FAF7F2' }}>RoomCraft</span>
        </Link>
      </div>

      {/* Background glow */}
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 50% 20%, rgba(166,124,82,0.1), transparent 70%)', pointerEvents: 'none' }} />

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', position: 'relative' }}>
        <div style={{ width: '100%', maxWidth: 460, animation: 'rc-reg-up 0.5s ease forwards' }}>

          {/* Glass card */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 22, overflow: 'hidden', backdropFilter: 'blur(20px)', boxShadow: '0 0 60px rgba(0,0,0,0.5)' }}>

            {/* Card header */}
            <div style={{ padding: '1.75rem 2rem', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>🏡</div>
              <h1 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '2rem', fontWeight: 600, color: '#FAF7F2', marginBottom: '0.2rem' }}>Create Account</h1>
              <p style={{ fontSize: '0.82rem', color: '#666' }}>Join RoomCraft and start designing</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

              {/* Global error */}
              {globalError && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1rem' }}>⚠️</span>
                  <p style={{ fontSize: '0.82rem', color: '#f87171', margin: 0 }}>{globalError}</p>
                </div>
              )}

              {/* Role selector */}
              <div>
                <p style={labelStyle}>I am a...</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { id: 'admin', emoji: '🎨', title: 'Designer', desc: 'In-store staff managing designs' },
                    { id: 'user',  emoji: '🏠', title: 'Customer', desc: 'Visualising furniture for my room' },
                  ].map(r => (
                    <button key={r.id} type="button" onClick={() => setRole(r.id)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                        padding: '14px 10px', borderRadius: 12, cursor: 'pointer',
                        border: role === r.id ? '1px solid rgba(166,124,82,0.6)' : '1px solid rgba(255,255,255,0.08)',
                        background: role === r.id ? 'rgba(166,124,82,0.12)' : 'rgba(255,255,255,0.03)',
                        boxShadow: role === r.id ? '0 0 20px rgba(166,124,82,0.15)' : 'none',
                        transition: 'all 0.2s',
                      }}
                    >
                      <span style={{ fontSize: '1.75rem' }}>{r.emoji}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: role === r.id ? '#C8A882' : '#888' }}>{r.title}</span>
                      <span style={{ fontSize: '0.7rem', color: '#555', textAlign: 'center', lineHeight: 1.4 }}>{r.desc}</span>
                      {role === r.id && (
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#A67C52', marginTop: 2 }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full name */}
              <div>
                <label style={labelStyle}>Full Name</label>
                <input name="name" type="text" autoComplete="name" autoFocus
                  placeholder="e.g. Navodya Perera"
                  value={form.name} onChange={handleChange}
                  style={inputStyle(!!errors.name)}
                  onFocus={e => { e.target.style.borderColor = errors.name ? 'rgba(239,68,68,0.6)' : 'rgba(166,124,82,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(166,124,82,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = errors.name ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                />
                {errors.name && <p style={{ fontSize: '0.72rem', color: '#f87171', marginTop: 5 }}>⚠ {errors.name}</p>}
              </div>

              {/* Username */}
              <div>
                <label style={labelStyle}>Username</label>
                <input name="username" type="text" autoComplete="username"
                  placeholder="e.g. navodya_p"
                  value={form.username} onChange={handleChange}
                  style={inputStyle(!!errors.username)}
                  onFocus={e => { e.target.style.borderColor = errors.username ? 'rgba(239,68,68,0.6)' : 'rgba(166,124,82,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(166,124,82,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = errors.username ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                />
                {errors.username
                  ? <p style={{ fontSize: '0.72rem', color: '#f87171', marginTop: 5 }}>⚠ {errors.username}</p>
                  : <p style={{ fontSize: '0.7rem', color: '#555', marginTop: 5 }}>Letters, numbers and underscores only</p>
                }
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input name="password" type={showPass ? 'text' : 'password'} autoComplete="new-password"
                    placeholder="Min. 6 characters"
                    value={form.password} onChange={handleChange}
                    style={{ ...inputStyle(!!errors.password), paddingRight: 44 }}
                    onFocus={e => { e.target.style.borderColor = errors.password ? 'rgba(239,68,68,0.6)' : 'rgba(166,124,82,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(166,124,82,0.1)' }}
                    onBlur={e => { e.target.style.borderColor = errors.password ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowPass(p => !p)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#555', padding: 0, transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color='#AAA'}
                    onMouseLeave={e => e.currentTarget.style.color='#555'}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
                {/* Strength bar */}
                {strength && !errors.password && (
                  <div style={{ marginTop: 6 }}>
                    <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: strength.width, background: strength.color, borderRadius: 2, transition: 'width 0.3s, background 0.3s' }} />
                    </div>
                    <p style={{ fontSize: '0.68rem', color: strength.color, marginTop: 4 }}>{strength.label}</p>
                  </div>
                )}
                {errors.password && <p style={{ fontSize: '0.72rem', color: '#f87171', marginTop: 5 }}>⚠ {errors.password}</p>}
              </div>

              {/* Confirm password */}
              <div>
                <label style={labelStyle}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input name="confirm" type={showConfirm ? 'text' : 'password'} autoComplete="new-password"
                    placeholder="Repeat your password"
                    value={form.confirm} onChange={handleChange}
                    style={{ ...inputStyle(!!errors.confirm), paddingRight: 44 }}
                    onFocus={e => { e.target.style.borderColor = errors.confirm ? 'rgba(239,68,68,0.6)' : passwordsMatch ? 'rgba(34,197,94,0.5)' : 'rgba(166,124,82,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(166,124,82,0.1)' }}
                    onBlur={e => { e.target.style.borderColor = errors.confirm ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowConfirm(p => !p)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#555', padding: 0, transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color='#AAA'}
                    onMouseLeave={e => e.currentTarget.style.color='#555'}>
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.confirm && <p style={{ fontSize: '0.72rem', color: '#f87171', marginTop: 5 }}>⚠ {errors.confirm}</p>}
                {passwordsMatch && (
                  <p style={{ fontSize: '0.72rem', color: '#22c55e', marginTop: 5 }}>✓ Passwords match</p>
                )}
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                style={{
                  width: '100%', padding: '13px', borderRadius: 10, marginTop: 4,
                  background: 'linear-gradient(135deg, #A67C52, #7A5230)',
                  color: '#FAF7F2', fontWeight: 600, fontSize: '0.92rem',
                  border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 0 24px rgba(166,124,82,0.3)',
                  transition: 'all 0.3s', opacity: loading ? 0.7 : 1,
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow='0 0 40px rgba(166,124,82,0.55)'; e.currentTarget.style.transform='translateY(-1px)' }}}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='0 0 24px rgba(166,124,82,0.3)'; e.currentTarget.style.transform='translateY(0)' }}
              >
                {loading
                  ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                      <span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.3)', borderTop:'2px solid #FFF', borderRadius:'50%', animation:'rc-spin 0.7s linear infinite', display:'inline-block' }} />
                      Creating account...
                    </span>
                  : `Create ${role === 'admin' ? 'Designer' : 'Customer'} Account →`
                }
              </button>

              {/* Divider + login link */}
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.06)' }} />
                <span style={{ fontSize:'0.72rem', color:'#444' }}>already registered?</span>
                <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.06)' }} />
              </div>
              <p style={{ textAlign:'center', fontSize:'0.85rem', color:'#555' }}>
                <Link to="/login" style={{ color:'#A67C52', fontWeight:600, textDecoration:'none' }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration='underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration='none'}>
                  Sign in to existing account
                </Link>
              </p>

            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes rc-reg-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rc-spin    { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  )
}
