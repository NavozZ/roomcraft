import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import Navbar from '../components/layout/Navbar'

function useTypewriter(words, speed = 80, pause = 1800) {
  const [display, setDisplay] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    const current = words[wordIdx]
    let timeout
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), speed)
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), speed / 2)
    } else if (deleting && charIdx === 0) {
      setDeleting(false)
      setWordIdx(i => (i + 1) % words.length)
    }
    setDisplay(current.slice(0, charIdx))
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, wordIdx, words, speed, pause])
  return display
}

function useScrollReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

function useParallax(speed = 0.25) {
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY * speed)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [speed])
  return offset
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, visible] = useScrollReveal()
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  )
}

function GlowCard({ children, style = {} }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const ref = useRef(null)
  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (rect) setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }
  return (
    <div ref={ref} style={{ position: 'relative', overflow: 'hidden', ...style }}
      onMouseMove={onMove} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        opacity: hovered ? 1 : 0, transition: 'opacity 0.4s',
        background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, rgba(166,124,82,0.13), transparent 60%)`,
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  )
}

const FEATURES = [
  { icon: '📐', title: '2D Room Layout',   desc: 'Drag and drop furniture onto a scaled floor plan. Rotate, resize and position everything to scale.', delay: 0 },
  { icon: '🏠', title: '3D Visualisation', desc: 'Switch to a stunning 3D view. Rotate the room 360° and zoom in to see every detail.', delay: 0.1 },
  { icon: '🎨', title: 'Colour & Shading', desc: 'Change wall colours, floor textures and furniture colours. Apply shading for realistic lighting.', delay: 0.2 },
  { icon: '💾', title: 'Save Designs',     desc: 'Save multiple room designs. Come back later, edit, and compare different layouts.', delay: 0.3 },
  { icon: '👤', title: 'Two User Roles',   desc: 'Designers manage in-store portfolios. Customers visualise rooms from home or in-shop.', delay: 0.4 },
  { icon: '📏', title: 'True to Scale',    desc: 'Enter real room dimensions. Every furniture piece is scaled accurately for realistic layouts.', delay: 0.5 },
]

const WORDS = ['living room.', 'bedroom.', 'office.', 'dining space.', 'perfect room.']

function Particles() {
  const pts = Array.from({ length: 16 }, (_, i) => ({
    id: i, size: Math.random() * 3 + 2, x: Math.random() * 100,
    delay: Math.random() * 8, dur: Math.random() * 12 + 8, op: Math.random() * 0.25 + 0.05,
  }))
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {pts.map(p => (
        <div key={p.id} style={{
          position: 'absolute', bottom: -10, left: `${p.x}%`,
          width: p.size, height: p.size, borderRadius: '50%',
          background: `rgba(166,124,82,${p.op})`,
          animation: `rc-float ${p.dur}s ${p.delay}s infinite linear`,
        }} />
      ))}
    </div>
  )
}

const glowBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  padding: '14px 32px', borderRadius: 12,
  background: 'linear-gradient(135deg, #A67C52, #7A5230)',
  color: '#FAF7F2', fontWeight: 600, fontSize: '0.95rem',
  textDecoration: 'none', boxShadow: '0 0 28px rgba(166,124,82,0.4)',
  transition: 'all 0.3s',
}
const ghostBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  padding: '14px 32px', borderRadius: 12,
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.15)',
  backdropFilter: 'blur(12px)',
  color: '#FAF7F2', fontWeight: 500, fontSize: '0.95rem',
  textDecoration: 'none', transition: 'all 0.3s',
}

export default function LandingPage() {
  const typed = useTypewriter(WORDS)
  const parallaxY = useParallax(0.25)
  const [heroVisible, setHeroVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setHeroVisible(true), 80); return () => clearTimeout(t) }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0e0a06', color: '#FAF7F2' }}>
      <Navbar />

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(166,124,82,0.18), transparent 70%)', animation:'rc-pulse-bg 6s ease-in-out infinite' }} />
        
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:'linear-gradient(rgba(166,124,82,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(166,124,82,0.05) 1px, transparent 1px)',
          backgroundSize:'60px 60px',
          transform:`translateY(${parallaxY}px)`,
        }} />
        <Particles />

        <div style={{ maxWidth:1280, margin:'0 auto', padding:'5rem 1.5rem 2rem', width:'100%', display:'flex', alignItems:'center', gap:'4rem', flexWrap:'wrap' }}>

          
          <div style={{ flex:1, minWidth:280, maxWidth:560, opacity:heroVisible?1:0, transform:heroVisible?'translateY(0)':'translateY(24px)', transition:'all 0.7s ease 0.1s' }}>
            
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 16px', borderRadius:999, background:'rgba(166,124,82,0.14)', border:'1px solid rgba(166,124,82,0.3)', marginBottom:'1.5rem' }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#A67C52', animation:'rc-blink 1.5s ease-in-out infinite' }} />
              <span style={{ fontSize:'0.68rem', fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'#C8A882' }}>Furniture Visualisation Tool</span>
            </div>
            
            <h1 style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:'clamp(2.8rem,6vw,4.8rem)', fontWeight:600, lineHeight:1.1, marginBottom:'1.5rem', color:'#FAF7F2' }}>
              Design your perfect<br />
              <span style={{ color:'#A67C52' }}>{typed}</span>
              <span style={{ borderRight:'3px solid #A67C52', marginLeft:2, animation:'rc-cursor 1s step-end infinite' }} />
            </h1>
            <p style={{ fontSize:'1.05rem', color:'#C9B99A', lineHeight:1.75, marginBottom:'2.5rem', maxWidth:460 }}>
              RoomCraft lets designers and customers visualise how furniture fits in any room — in 2D layouts and stunning 3D views.
            </p>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <Link to="/register" style={glowBtn}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 0 50px rgba(166,124,82,0.65)'; e.currentTarget.style.transform='translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='0 0 28px rgba(166,124,82,0.4)'; e.currentTarget.style.transform='translateY(0)' }}>
                ✨ Start Designing
              </Link>
              <Link to="/login" style={ghostBtn}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.transform='translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.transform='translateY(0)' }}>
                Sign In →
              </Link>
            </div>
            
            <div style={{ display:'flex', gap:32, marginTop:'3rem', paddingTop:'2rem', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
              {[['10+','Furniture Items'],['2D + 3D','Views'],['Free','To Use']].map(([v,l]) => (
                <div key={l}>
                  <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:'1.8rem', fontWeight:600, color:'#A67C52' }}>{v}</div>
                  <div style={{ fontSize:'0.72rem', color:'#666', letterSpacing:'0.05em' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          
          <div style={{ flex:1, minWidth:260, display:'flex', justifyContent:'center', opacity:heroVisible?1:0, transform:heroVisible?'translateY(0) scale(1)':'translateY(32px) scale(0.96)', transition:'all 0.9s ease 0.35s' }}>
            <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(166,124,82,0.22)', borderRadius:24, padding:2, boxShadow:'0 0 80px rgba(166,124,82,0.14), 0 0 0 1px rgba(166,124,82,0.08)', backdropFilter:'blur(20px)' }}>
              <div style={{ background:'linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))', border:'1px solid rgba(255,255,255,0.07)', borderRadius:22, padding:'1.5rem', width:300 }}>
                
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
                  <div style={{ display:'flex', gap:6 }}>
                    {['#ef4444','#f59e0b','#22c55e'].map(c => <div key={c} style={{ width:10,height:10,borderRadius:'50%',background:c,opacity:0.8 }} />)}
                  </div>
                  <span style={{ fontSize:'0.62rem', color:'#555', letterSpacing:'0.1em' }}>LIVE 2D PREVIEW</span>
                </div>
                
                <div style={{ width:'100%', height:190, background:'linear-gradient(145deg,rgba(200,168,130,0.14),rgba(122,82,48,0.09))', borderRadius:12, position:'relative', overflow:'hidden', border:'1px solid rgba(166,124,82,0.18)' }}>
                  <div style={{ position:'absolute', inset:0, opacity:0.12, backgroundImage:'linear-gradient(rgba(166,124,82,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(166,124,82,0.8) 1px,transparent 1px)', backgroundSize:'22px 22px' }} />
                  <div style={{ position:'absolute', inset:0, border:'3px solid rgba(166,124,82,0.3)', borderRadius:12, pointerEvents:'none' }} />
                  {[
                    { top:'14%',left:'5%',w:'42%',h:'24%',bg:'rgba(166,124,82,0.7)',label:'Sofa',delay:0 },
                    { top:'54%',right:'7%',w:'32%',h:'21%',bg:'rgba(122,82,48,0.65)',label:'Table',delay:0.5 },
                    { top:'7%',right:'11%',w:'18%',h:'23%',bg:'rgba(74,47,18,0.72)',label:'Wardrobe',delay:1 },
                    { top:'52%',left:'11%',w:'22%',h:'18%',bg:'rgba(200,168,130,0.6)',label:'Chair',delay:1.5 },
                  ].map((item,i) => (
                    <div key={i} style={{ position:'absolute', top:item.top, left:item.left, right:item.right, width:item.w, height:item.h, background:item.bg, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(255,255,255,0.1)', animation:`rc-float-item ${3+i*0.5}s ${item.delay}s ease-in-out infinite` }}>
                      <span style={{ fontSize:'0.52rem', color:'rgba(255,255,255,0.85)', fontWeight:600, letterSpacing:'0.05em' }}>{item.label}</span>
                    </div>
                  ))}
                </div>
                
                <div style={{ marginTop:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ display:'flex', gap:6 }}>
                    {['#C8A882','#A67C52','#7A5230','#4A2F12'].map(c => <div key={c} style={{ width:18,height:18,borderRadius:5,background:c,border:'1px solid rgba(255,255,255,0.1)' }} />)}
                  </div>
                  <span style={{ fontSize:'0.68rem', color:'#A67C52', fontWeight:600 }}>4 items placed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div style={{ position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:8, opacity:0.45 }}>
          <span style={{ fontSize:'0.65rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'#666' }}>Scroll</span>
          <div style={{ width:1, height:40, background:'linear-gradient(to bottom,#A67C52,transparent)', animation:'rc-pulse-line 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding:'7rem 1.5rem', background:'linear-gradient(180deg,#0e0a06,#130d07)' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <Reveal style={{ textAlign:'center', marginBottom:'4rem' }}>
            <h2 style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:600, color:'#FAF7F2', marginBottom:'1rem' }}>Everything you need</h2>
            <p style={{ color:'#777', fontSize:'1rem', maxWidth:440, margin:'0 auto' }}>From first sketch to final decision — RoomCraft covers the whole journey.</p>
          </Reveal>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))', gap:'1.5rem' }}>
            {FEATURES.map((f,i) => (
              <Reveal key={i} delay={f.delay}>
                <GlowCard style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'2rem', backdropFilter:'blur(10px)', height:'100%', boxSizing:'border-box' }}>
                  <div style={{ fontSize:'2rem', marginBottom:'1rem' }}>{f.icon}</div>
                  <h5 style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:'1.25rem', fontWeight:600, color:'#FAF7F2', marginBottom:'0.5rem' }}>{f.title}</h5>
                  <p style={{ fontSize:'0.85rem', color:'#777', lineHeight:1.7 }}>{f.desc}</p>
                  <div style={{ height:2, background:'linear-gradient(to right,#A67C52,transparent)', borderRadius:1, marginTop:'1.5rem', opacity:0.5 }} />
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding:'7rem 1.5rem', background:'#0a0704' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <Reveal style={{ textAlign:'center', marginBottom:'4rem' }}>
            <h2 style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:'clamp(2rem,5vw,3rem)', fontWeight:600, color:'#FAF7F2' }}>Three steps to your perfect room</h2>
          </Reveal>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'2rem' }}>
            {[
              { n:'01', title:'Set up your room', desc:'Enter your room dimensions and choose your wall and floor colours.' },
              { n:'02', title:'Place furniture', desc:'Drag furniture from the catalogue. Rotate, recolour and arrange to your taste.' },
              { n:'03', title:'View in 3D', desc:'Switch to the 3D view. Rotate the room and see exactly how it will look.' },
            ].map((s,i) => (
              <Reveal key={i} delay={i*0.15}>
                <div style={{ position:'relative', padding:'2rem', textAlign:'center' }}>
                  <div style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:'5rem', fontWeight:700, color:'rgba(166,124,82,0.1)', lineHeight:1, marginBottom:'-0.8rem', userSelect:'none' }}>{s.n}</div>
                  <div style={{ width:48, height:48, borderRadius:'50%', background:'rgba(166,124,82,0.13)', border:'1px solid rgba(166,124,82,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem', boxShadow:'0 0 20px rgba(166,124,82,0.18)' }}>
                    <span style={{ color:'#A67C52', fontWeight:700, fontSize:'0.82rem' }}>{s.n}</span>
                  </div>
                  <h4 style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:'1.3rem', fontWeight:600, color:'#FAF7F2', marginBottom:'0.6rem' }}>{s.title}</h4>
                  <p style={{ color:'#777', fontSize:'0.85rem', lineHeight:1.7 }}>{s.desc}</p>
                  {i < 2 && <div style={{ position:'absolute', top:'50%', right:'-0.5rem', color:'rgba(166,124,82,0.28)', fontSize:'1.5rem', transform:'translateY(-50%)' }}>→</div>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'7rem 1.5rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(166,124,82,0.1), transparent)' }} />
        <Reveal>
          <div style={{ maxWidth:680, margin:'0 auto', textAlign:'center', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(166,124,82,0.18)', borderRadius:24, padding:'4rem 2rem', backdropFilter:'blur(20px)', boxShadow:'0 0 80px rgba(166,124,82,0.09)', position:'relative' }}>
            <h2 style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:'clamp(2rem,5vw,3.2rem)', fontWeight:600, color:'#FAF7F2', marginBottom:'1rem' }}>Ready to start?</h2>
            <p style={{ color:'#777', fontSize:'1rem', marginBottom:'2.5rem' }}>Create your free account and design your first room today.</p>
            <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
              <Link to="/register?role=admin" style={{ ...glowBtn, padding:'14px 28px' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 0 48px rgba(166,124,82,0.6)'; e.currentTarget.style.transform='translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='0 0 28px rgba(166,124,82,0.4)'; e.currentTarget.style.transform='translateY(0)' }}>
                🎨 I'm a Designer
              </Link>
              <Link to="/register?role=user" style={{ ...ghostBtn, padding:'14px 28px' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.transform='translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.transform='translateY(0)' }}>
                🏠 I'm a Customer
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:'1px solid rgba(255,255,255,0.05)', padding:'2rem 1.5rem', textAlign:'center' }}>
        <p style={{ fontSize:'0.78rem', color:'#444' }}>© 2026 RoomCraft — PUSL3122 HCI Coursework</p>
      </footer>

      <style>{`
        @keyframes rc-pulse-bg { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes rc-blink    { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes rc-cursor   { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes rc-pulse-line { 0%,100%{opacity:0.3;transform:scaleY(1)} 50%{opacity:0.8;transform:scaleY(1.05)} }
        @keyframes rc-float    { 0%,100%{transform:translateY(0)} 10%{opacity:1} 90%{opacity:0.4} 100%{transform:translateY(-100vh);opacity:0} }
        @keyframes rc-float-item { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
      `}</style>
    </div>
  )
}
