/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

const mockUsers = [
  { email: 'client@example.com', password: '123456', role: 'client' },
  { email: 'trainer@example.com', password: '123456', role: 'trainer' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const [loading, setLoading] = useState(false)

  const login = (email, password) => {
    setLoading(true)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const found = mockUsers.find(
          u => u.email === email && u.password === password
        )

        if (found) {
          const { password, ...userData } = found 
          setUser(userData)
          localStorage.setItem('user', JSON.stringify(userData))
          resolve(userData)
        } else {
          reject('Неверный email или пароль')
        }
        setLoading(false)
      }, 500)
    })
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
