import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

// Guards /admin/* routes: only signed-in admins get through, everyone
// else is bounced to the admin login page.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAdminAuth()

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-400">Loading…</div>
  }
  if (!user) {
    return <Navigate to="/admin/login" replace />
  }
  return children
}
