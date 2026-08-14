import { Link } from 'react-router-dom'
import eventConfig from '../config/eventConfig'

const links = [
  { to: '/', label: 'Home' },
  { to: '/register', label: 'Registration' },
  { to: '/location', label: 'Location' },
  { to: '/sponsors', label: 'Sponsors' },
  { to: '/contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-300">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <div className="font-display text-lg font-bold text-white">{eventConfig.eventName}</div>
            <p className="mt-1 text-sm text-sky-400">Organized by {eventConfig.organizer}</p>
            <p className="mt-3 max-w-xs text-sm text-slate-400">{eventConfig.shortDescription}</p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">Quick Links</div>
            <ul className="mt-3 space-y-2 text-sm">
              {links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-sky-400">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">Contact</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>{eventConfig.instituteAddress || eventConfig.address}</li>
              <li>{eventConfig.phone}</li>
              <li>{eventConfig.email}</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
          © 2026 {eventConfig.organizer}. All Rights Reserved.
        </div>
      </div>
    </footer>
  )
}
