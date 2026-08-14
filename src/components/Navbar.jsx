import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, TicketCheck } from 'lucide-react'
import eventConfig from '../config/eventConfig'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/about#highlights', label: 'Highlights' },
  { to: '/about#chief-guest', label: 'Chief Guest' },
  { to: '/about#details', label: 'Event Details' },
  { to: '/sponsors', label: 'Sponsors' },
  { to: '/location', label: 'Location' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location])

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled ? 'bg-navy-950/95 shadow-lg backdrop-blur' : 'bg-navy-950'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link to="/" className="flex items-center gap-2.5 text-white group">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-navy-600 transition group-hover:scale-105 shadow-sm">
            <TicketCheck size={18} />
          </span>
          <span className="font-display text-base font-bold tracking-tight text-white transition group-hover:text-sky-300">
            {eventConfig.eventName}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.end}
              className="text-sm font-medium text-slate-200 transition hover:text-sky-400"
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/register" className="btn-primary !px-5 !py-2 text-sm">
            Register Now
          </Link>
        </nav>

        <button
          className="text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-navy-950 px-5 pb-5 lg:hidden">
          <nav className="flex flex-col gap-1 pt-3">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                end={l.end}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/5"
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/register" className="btn-primary mt-2 w-full text-sm">
              Register Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
