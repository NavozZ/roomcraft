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
import View           from './pages/admin/View3D' 
import DesignDetail   from './pages/admin/DesignDetail'
import UserDashboard  from './pages/user/UserDashboard'
import UserView3D     from './pages/user/UserView3D'
import UserRoomSetup  from './pages/user/UserRoomSetup'





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
              <ProtectedRoute role="admin"><View /></ProtectedRoute>
            } />
            <Route path="/admin/design/:id" element={
              <ProtectedRoute role="admin"><DesignDetail/></ProtectedRoute>
            } />

            <Route path="/user" element={
              <ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>
            } />
            <Route path="/user/room-setup" element={
              <ProtectedRoute role="user"><UserRoomSetup/></ProtectedRoute>
            } />
            <Route path="/user/view3d/:id" element={
              <ProtectedRoute role="user"><UserView3D /></ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DesignProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
