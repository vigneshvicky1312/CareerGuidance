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
    <div className="relative flex min-h-screen w-full max-w-full items-center justify-center overflow-x-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4">
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
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 p-2.5 shadow-xl shadow-slate-950/20 border border-slate-800">
              <img
                src="/images/cgp-logo-mark-dark-bg.png"
                alt="CGP 2026 Logo"
                className="h-full w-full object-contain"
              />
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
                  placeholder="Enter username or email (e.g. admin)"
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
                <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3.5 text-xs text-red-600 leading-relaxed border border-red-100">
                  <span className="text-sm font-bold">⚠</span>
                  <div>
                    <p className="font-semibold">{error}</p>
                    <p className="mt-0.5 text-[11px] text-red-500">
                      Default credentials: Username <code className="font-mono font-bold bg-red-100/70 px-1 py-0.5 rounded">admin</code> / Password <code className="font-mono font-bold bg-red-100/70 px-1 py-0.5 rounded">cgp2026</code>
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-60 cursor-pointer"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? 'Signing in…' : 'Sign In'}
              </button>

              <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin')
                    setPassword('cgp2026')
                    setError('')
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition cursor-pointer hover:underline"
                >
                  Fill Default Credentials (admin / cgp2026)
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
