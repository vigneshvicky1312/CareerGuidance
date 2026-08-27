import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, ClipboardList, ScanLine, PackageCheck,
  Handshake, FileBarChart, LogOut, Menu, X, ChevronRight,
} from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'
import eventConfig from '../../config/eventConfig'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/attendees', label: 'Attendees', icon: Users },
  { to: '/admin/registrations', label: 'Registrations', icon: ClipboardList },
  { to: '/admin/distribution', label: 'Materials', icon: PackageCheck },
  { to: '/admin/sponsors', label: 'Sponsors', icon: Handshake },
  { to: '/admin/reports', label: 'Reports', icon: FileBarChart },
  { to: '/check-in', label: 'QR Check-In', icon: ScanLine, external: true },
]

export default function AdminLayout() {
  const [navOpen, setNavOpen] = useState(false)
  const { logout } = useAdminAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  const NavContent = () => (
    <>
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 p-1.5 border border-white/15 shadow-sm">
            <img
              src="/images/cgp-logo-mark-dark-bg.png"
              alt="CGP 2026 Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-white truncate">{eventConfig.eventId} Admin</div>
            <div className="text-xs text-slate-400 truncate">{eventConfig.organizer}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ to, label, icon: Icon, end, external }) => (
          external ? (
            <a
              key={label}
              href={to}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition"
            >
              <Icon size={16} /> {label}
              <ChevronRight size={12} className="ml-auto opacity-50" />
            </a>
          ) : (
            <NavLink
              key={label}
              to={to}
              end={end}
              onClick={() => setNavOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={16} /> {label}
            </NavLink>
          )
        ))}
      </nav>

      <div className="p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 bg-slate-900 lg:flex lg:flex-col">
        <NavContent />
      </aside>

      {/* Mobile overlay */}
      {navOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setNavOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-slate-900 shadow-2xl">
            <NavContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Mobile Top Bar */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3 shadow-sm lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 p-1 border border-slate-700">
              <img
                src="/images/cgp-logo-mark-dark-bg.png"
                alt="CGP 2026 Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="font-bold text-slate-800">{eventConfig.eventId}</span>
          </div>
          <button
            onClick={() => setNavOpen((v) => !v)}
            className="rounded-lg p-1.5 hover:bg-slate-100 transition"
          >
            {navOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
