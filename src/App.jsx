import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DesignProvider } from './context/DesignContext'
import ProtectedRoute from './components/layout/ProtectedRoute'

import LandingPage    from './pages/LandingPage'
import LoginPage      from './pages/LoginPage'
import RegisterPage   from './pages/RegisterPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import RoomSetup      from './pages/admin/RoomSetup'
import DesignEditor   from './pages/admin/DesignEditor'
import UserDashboard  from './pages/user/UserDashboard'

function ComingSoon({ label }) {
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12, background:'#FAF7F2' }}>
      <div style={{ fontSize:48 }}>🚧</div>
      <h2 style={{ fontFamily:'serif', fontSize:28, color:'#4A2F12' }}>{label}</h2>
      <p style={{ color:'#A67C52', fontSize:14 }}>This page is being built.</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DesignProvider>
          <Routes>
            <Route path="/"         element={<LandingPage />} />
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/admin" element={
              <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/room-setup" element={
              <ProtectedRoute role="admin"><RoomSetup /></ProtectedRoute>
            } />
            <Route path="/admin/editor/:id" element={
              <ProtectedRoute role="admin"><DesignEditor /></ProtectedRoute>
            } />
            <Route path="/admin/view3d/:id" element={
              <ProtectedRoute role="admin"><ComingSoon label="3D View — Mayumi is building this" /></ProtectedRoute>
            } />
            <Route path="/admin/design/:id" element={
              <ProtectedRoute role="admin"><ComingSoon label="Design Detail" /></ProtectedRoute>
            } />

            <Route path="/user" element={
              <ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>
            } />
            <Route path="/user/room-setup" element={
              <ProtectedRoute role="user"><RoomSetup /></ProtectedRoute>
            } />
            <Route path="/user/view3d/:id" element={
              <ProtectedRoute role="user"><ComingSoon label="3D View — Mayumi is building this" /></ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DesignProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
