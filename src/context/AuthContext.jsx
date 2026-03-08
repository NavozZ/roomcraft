import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('roomcraft_user')
      if (saved) setUser(JSON.parse(saved))
    } catch {
      localStorage.removeItem('roomcraft_user')
    } finally {
      setLoading(false)
    }
  }, [])

  const login = (username, password) => {
    // Demo accounts — Asantha will extend with real user storage
    const accounts = [
      { id: '1', name: 'Admin Designer', username: 'admin', password: 'admin123', role: 'admin' },
      { id: '2', name: 'Customer One',   username: 'user',  password: 'user123',  role: 'user'  },
    ]
    const found = accounts.find(u => u.username === username && u.password === password)
    if (found) {
      const { password: _, ...safe } = found
      setUser(safe)
      localStorage.setItem('roomcraft_user', JSON.stringify(safe))
      return { success: true, user: safe }
    }
    return { success: false, error: 'Invalid username or password' }
  }

  const register = (name, username, password, role = 'user') => {
    // TODO: Asantha — check username uniqueness against stored users
    const newUser = { id: Date.now().toString(), name, username, role }
    setUser(newUser)
    localStorage.setItem('roomcraft_user', JSON.stringify(newUser))
    return { success: true, user: newUser }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('roomcraft_user')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}