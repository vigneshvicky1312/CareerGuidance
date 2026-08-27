import { Link } from 'react-router-dom'
import eventConfig from '../config/eventConfig'
import { TicketCheck, MapPin, Phone, Mail, GraduationCap, ShieldCheck, ArrowUpRight } from 'lucide-react'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About & Tracks' },
  { to: '/about#schedule', label: 'Program Schedule' },
  { to: '/about#chief-guest', label: 'Eminent Speakers' },
  { to: '/register', label: 'Free Registration' },
  { to: '/location', label: 'Venue & Directions' },
  { to: '/sponsors', label: 'Sponsor & Partner' },
  { to: '/contact', label: 'Contact Us' },
]

export default function Footer() {
  return (
    <footer className="relative bg-navy-950 text-slate-300 border-t border-white/10 overflow-hidden">
      <div
        className="pointer-events-none absolute -top-24 right-1/4 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl"
      />

      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1.1fr]">
          {/* Col 1: Brand & Organizer */}
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-navy-600 shadow-md">
                <TicketCheck size={20} className="text-white" />
              </span>
              <div className="min-w-0 flex-1">
                <span className="font-display text-base font-extrabold tracking-tight text-white block leading-tight break-words">
                  {eventConfig.eventName}
                </span>
                <span className="font-mono text-[10px] text-sky-400 tracking-wider block uppercase break-words">
                  Alagappa Institute of Management
                </span>
              </div>
            </div>

            <p className="mt-4 max-w-sm text-xs leading-relaxed text-slate-400 break-words">
              {eventConfig.shortDescription} Organized under the auspices of Alagappa University for undergraduate career empowerment.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <ShieldCheck size={16} className="shrink-0" />
              <span>Official Alagappa University Initiative</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="min-w-0">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-amber-400">
              Program Navigation
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-2.5 text-xs">
              {links.map((l) => (
                <li key={l.to} className="min-w-0 truncate">
                  <Link
                    to={l.to}
                    className="text-slate-400 transition hover:text-sky-300 hover:underline flex items-center gap-1 truncate"
                  >
                    <span className="truncate">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Venue & Contact Coordinates */}
          <div className="min-w-0">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-amber-400">
              Venue &amp; Coordinators
            </div>
            <ul className="mt-4 space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5 min-w-0">
                <MapPin size={16} className="text-sky-400 shrink-0 mt-0.5" />
                <span className="break-words">
                  <strong className="text-white block font-medium break-words">{eventConfig.venue}</strong>
                  {eventConfig.venueAddress}
                </span>
              </li>
              <li className="flex items-center gap-2.5 min-w-0">
                <Phone size={15} className="text-sky-400 shrink-0" />
                <a href={`tel:${eventConfig.phone}`} className="hover:text-white transition break-all">
                  {eventConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5 min-w-0">
                <Mail size={15} className="text-sky-400 shrink-0" />
                <a href={`mailto:${eventConfig.email}`} className="hover:text-white transition break-all">
                  {eventConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-white/10 pt-6 text-xs text-slate-500 gap-3 text-center sm:text-left">
          <p className="break-words">© 2026 {eventConfig.organizer}. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] text-slate-400">
            <Link to="/about" className="hover:text-sky-400">About AIM</Link>
            <span>•</span>
            <Link to="/register" className="hover:text-sky-400">Free Registration</Link>
            <span>•</span>
            <Link to="/admin/login" className="hover:text-sky-400">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

