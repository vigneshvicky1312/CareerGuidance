import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { watchAuthState, loginAdmin as apiLogin, logoutAdmin as apiLogout } from '../services/authService'

const AdminAuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
})

export const useAdminAuth = () => useContext(AdminAuthContext)

export default function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = useCallback(() => {
    return watchAuthState((u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    const unsub = checkAuth()
    return () => unsub()
  }, [checkAuth])

  const login = async (identifier, password) => {
    const loggedInUser = await apiLogin(identifier, password)
    setUser(loggedInUser)
    setLoading(false)
    return loggedInUser
  }

  const logout = async () => {
    await apiLogout()
    setUser(null)
  }

  return (
    <AdminAuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}
