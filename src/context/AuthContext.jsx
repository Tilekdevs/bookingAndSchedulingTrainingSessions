/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from 'react'
import { loginUser } from '../api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    setLoading(true)
    try {
      const response = await loginUser({ email, password })

      const userData = {
        email: response.email,
        role: response.role,
        token: response.token,
      }

      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      setLoading(false)
      return userData
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}