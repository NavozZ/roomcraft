import { createContext, useState, useEffect } from 'react'

// Author: Asantha

export const AuthContext = createContext(null)

// Keys for localStorage
const SESSION_KEY = 'roomcraft_user'
const USERS_KEY   = 'roomcraft_users'

// Built-in demo accounts (always available)
const DEMO_ACCOUNTS = [
  { id: 'demo-admin', name: 'Admin Designer', username: 'admin', password: 'admin123', role: 'admin' },
  { id: 'demo-user',  name: 'Customer One',   username: 'user',  password: 'user123',  role: 'user'  },
]

// ── Helpers ──────────────────────────────────────────────────
const loadUsers = () => {
  try {
    const stored = localStorage.getItem(USERS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch { return [] }
}

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

const getAllAccounts = () => [...DEMO_ACCOUNTS, ...loadUsers()]

// ─────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session on page load
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY)
      if (saved) setUser(JSON.parse(saved))
    } catch {
      localStorage.removeItem(SESSION_KEY)
    } finally {
      setLoading(false)
    }
  }, [])

  // ── login ──────────────────────────────────────────────────
  const login = (username, password) => {
    const all   = getAllAccounts()
    const found = all.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    )
    if (!found) {
      return { success: false, error: 'Invalid username or password. Please try again.' }
    }
    const { password: _, ...safeUser } = found
    setUser(safeUser)
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser))
    return { success: true, user: safeUser }
  }

  // ── register ───────────────────────────────────────────────
  const register = (name, username, password, role = 'user') => {
    // Check username not already taken
    const all = getAllAccounts()
    const taken = all.find(u => u.username.toLowerCase() === username.toLowerCase())
    if (taken) {
      return { success: false, error: 'That username is already taken. Please choose another.' }
    }

    const newUser = {
      id:       `user-${Date.now()}`,
      name:     name.trim(),
      username: username.trim(),
      password,
      role,
    }

    // Save to registered users list
    const registered = loadUsers()
    saveUsers([...registered, newUser])

    // Auto-login
    const { password: _, ...safeUser } = newUser
    setUser(safeUser)
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser))
    return { success: true, user: safeUser }
  }

  // ── logout ─────────────────────────────────────────────────
  const logout = () => {
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
  }

  // ── updateUser ─────────────────────────────────────────────
  // Lets you update the current session (e.g. display name change)
  const updateUser = (changes) => {
    const updated = { ...user, ...changes }
    setUser(updated)
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
