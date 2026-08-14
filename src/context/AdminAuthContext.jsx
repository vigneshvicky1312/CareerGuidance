import { createContext, useContext, useEffect, useState } from 'react'
import { watchAuthState } from '../services/authService'

const AdminAuthContext = createContext({ user: null, loading: true })
export const useAdminAuth = () => useContext(AdminAuthContext)

// Wraps all /admin/* routes so both ProtectedRoute (the gatekeeper)
// and AdminLayout (the sidebar/logout button) share one auth state
// instead of each running its own onAuthStateChanged listener.
export default function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = watchAuthState((u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  return (
    <AdminAuthContext.Provider value={{ user, loading }}>
      {children}
    </AdminAuthContext.Provider>
  )
}
