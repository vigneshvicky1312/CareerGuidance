import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import eventConfig from '../../config/eventConfig'
import { ShieldCheck, Loader2, Eye, EyeOff } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, loading: authLoading, login } = useAdminAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/admin', { replace: true })
    }
  }, [user, authLoading, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email.trim(), password)
      navigate('/admin', { replace: true })
    } catch (err) {
      console.error(err)
      setError(err.message || 'Invalid username/email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl bg-white/5 p-1 shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
          <div className="rounded-[22px] bg-white p-8">
            {/* Logo */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-lg shadow-indigo-500/30">
              <ShieldCheck size={26} className="text-white" />
            </div>

            <h1 className="mt-5 text-center text-2xl font-bold text-slate-900">Admin Login</h1>
            <p className="mt-1.5 text-center text-sm text-slate-500">{eventConfig.eventName}</p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div>
                <label htmlFor="admin-username">Username or Email</label>
                <input
                  id="admin-username"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter username or email"
                  required
                  autoComplete="username"
                />
              </div>

              <div>
                <label htmlFor="admin-password">Password</label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  <span>⚠</span> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-60"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
