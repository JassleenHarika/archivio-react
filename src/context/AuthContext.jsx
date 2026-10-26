import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('archivioCurrentUser')) || null
    } catch {
      return null
    }
  })

  function login(userData) {
    localStorage.setItem('archivioCurrentUser', JSON.stringify(userData))
    setUser(userData)
  }

  function logout() {
    localStorage.removeItem('archivioCurrentUser')
    setUser(null)
  }

  function updateUser(updatedUser) {
    localStorage.setItem('archivioCurrentUser', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}