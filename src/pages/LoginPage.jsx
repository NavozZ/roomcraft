import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'


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
    if (!form.username.trim() || !form.password.trim()) { setError('Please enter both username and password.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    const result = login(form.username.trim(), form.password)
    setLoading(false)
    if (result.success) navigate(result.user.role === 'admin' ? '/admin' : '/user')
    else setError(result.error)
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 10,
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#FAF7F2', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0e0a06', display: 'flex', flexDirection: 'column' }}>

      {/* Minimal top bar */}
      <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <span>🪑</span>
          <span style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.4rem', fontWeight: 600, color: '#FAF7F2' }}>RoomCraft</span>
        </Link>
      </div>

      {/* Background glow */}
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 30%, rgba(166,124,82,0.1), transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' }}>
        <div style={{ width: '100%', maxWidth: 420, animation: 'rc-fade-up 0.5s ease forwards' }}>

          {/* Glass card */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, overflow: 'hidden', backdropFilter: 'blur(20px)', boxShadow: '0 0 60px rgba(0,0,0,0.4)' }}>

            {/* Card top */}
            <div style={{ padding: '2rem', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👋</div>
              <h1 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '2rem', fontWeight: 600, color: '#FAF7F2', marginBottom: '0.25rem' }}>Welcome back</h1>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>Sign in to your RoomCraft account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>⚠️</span>
                  <p style={{ fontSize: '0.85rem', color: '#f87171', margin: 0 }}>{error}</p>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#AAA', marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Username</label>
                <input name="username" type="text" autoComplete="username" autoFocus placeholder="Enter your username"
                  value={form.username} onChange={handleChange} style={inputStyle}
                  onFocus={e => { e.target.style.borderColor='rgba(166,124,82,0.5)'; e.target.style.boxShadow='0 0 0 3px rgba(166,124,82,0.1)' }}
                  onBlur={e => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#AAA', marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input name="password" type={showPass ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password"
                    value={form.password} onChange={handleChange} style={{ ...inputStyle, paddingRight: 48 }}
                    onFocus={e => { e.target.style.borderColor='rgba(166,124,82,0.5)'; e.target.style.boxShadow='0 0 0 3px rgba(166,124,82,0.1)' }}
                    onBlur={e => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none' }}
                  />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#555', transition: 'color 0.2s', padding: 0 }}
                    onMouseEnter={e => e.currentTarget.style.color='#AAA'}
                    onMouseLeave={e => e.currentTarget.style.color='#555'}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', borderRadius: 10, background: 'linear-gradient(135deg,#A67C52,#7A5230)', color: '#FAF7F2', fontWeight: 600, fontSize: '0.95rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 0 24px rgba(166,124,82,0.3)', transition: 'all 0.3s', opacity: loading ? 0.7 : 1 }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow='0 0 40px rgba(166,124,82,0.55)'; e.currentTarget.style.transform='translateY(-1px)' }}}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='0 0 24px rgba(166,124,82,0.3)'; e.currentTarget.style.transform='translateY(0)' }}>
                {loading
                  ? <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}>
                      <span style={{ width:14,height:14,border:'2px solid rgba(255,255,255,0.3)',borderTop:'2px solid #FFF',borderRadius:'50%',animation:'rc-spin 0.7s linear infinite',display:'inline-block' }} />
                      Signing in...
                    </span>
                  : 'Sign In →'
                }
              </button>

              <div style={{ display:'flex',alignItems:'center',gap:12 }}>
                <div style={{ flex:1,height:1,background:'rgba(255,255,255,0.06)' }} />
                <span style={{ fontSize:'0.75rem',color:'#444' }}>or</span>
                <div style={{ flex:1,height:1,background:'rgba(255,255,255,0.06)' }} />
              </div>

              <p style={{ textAlign:'center',fontSize:'0.85rem',color:'#555' }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color:'#A67C52',fontWeight:600,textDecoration:'none' }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration='underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration='none'}>
                  Create one here
                </Link>
              </p>
            </form>
          </div>

          {/* Demo credentials */}
          <div style={{ marginTop:'1rem', background:'rgba(166,124,82,0.07)', border:'1px solid rgba(166,124,82,0.15)', borderRadius:14, padding:'1rem 1.25rem' }}>
            <p style={{ fontSize:'0.7rem',fontWeight:700,color:'#A67C52',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.75rem' }}>🔑 Demo Accounts</p>
            <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
              {[['🎨 Designer (Admin)','admin / admin123'],['🏠 Customer (User)','user / user123']].map(([label,creds]) => (
                <div key={label} style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                  <span style={{ fontSize:'0.78rem',color:'#C8A882' }}>{label}</span>
                  <code style={{ background:'rgba(166,124,82,0.12)',color:'#C8A882',padding:'3px 10px',borderRadius:6,fontSize:'0.75rem',fontFamily:'monospace' }}>{creds}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes rc-fade-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rc-spin    { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  )
}
