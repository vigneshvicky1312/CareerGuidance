import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, TicketCheck, ArrowRight, Sparkles } from 'lucide-react'
import eventConfig from '../config/eventConfig'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About & Tracks' },
  { to: '/about#schedule', label: 'Schedule' },
  { to: '/about#chief-guest', label: 'Speakers' },
  { to: '/sponsors', label: 'Sponsors' },
  { to: '/location', label: 'Venue' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-navy-950/85 backdrop-blur-xl shadow-lg shadow-navy-950/20 py-2.5'
          : 'bg-navy-950 py-3.5'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5">
        {/* Brand Logo & Event Title */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 text-white group min-w-0 max-w-[calc(100vw-80px)] sm:max-w-none">
          <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 via-sky-500 to-navy-600 shadow-md transition duration-300 group-hover:scale-105 group-hover:shadow-glow-sky">
            <TicketCheck size={18} className="text-white sm:w-5 sm:h-5" />
          </span>
          <div className="min-w-0 flex-1">
            <span className="font-display text-sm sm:text-base font-extrabold tracking-tight text-white transition group-hover:text-sky-300 block leading-tight truncate">
              {eventConfig.eventName}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] text-sky-400 tracking-wider block uppercase truncate">
              Alagappa Institute of Management
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `text-xs font-semibold tracking-wide transition duration-200 relative py-1 ${
                  isActive
                    ? 'text-sky-400'
                    : 'text-slate-300 hover:text-white'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}

          <Link to="/register" className="btn-primary !px-4 !py-2 text-xs">
            <span>Register Free</span>
            <ArrowRight size={13} />
          </Link>
        </nav>

        {/* Mobile menu hamburger toggle */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white lg:hidden hover:bg-white/15"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="border-t border-white/10 bg-navy-950/95 px-5 pb-6 pt-3 backdrop-blur-2xl lg:hidden">
          <nav className="flex flex-col gap-1.5">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                      : 'text-slate-200 hover:bg-white/5'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/register" className="btn-primary mt-3 w-full text-xs !py-3">
              <span>Register Now · Free Pass</span>
              <ArrowRight size={14} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

