import { Link } from 'react-router-dom'
import {
  CalendarDays,
  Clock,
  MapPin,
  GraduationCap,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users2,
} from 'lucide-react'
import eventConfig from '../config/eventConfig'
import HeroInteractivePass from './HeroInteractivePass'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-gradient text-white">
      {/* Dynamic ambient backdrop lighting & subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 20%, #38BDF8 0, transparent 40%), radial-gradient(circle at 85% 70%, #EAB308 0, transparent 35%), radial-gradient(circle at 50% 90%, #2563EB 0, transparent 40%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 lg:gap-12 px-4 sm:px-5 py-12 sm:py-16 md:grid-cols-[1.15fr_0.85fr] md:py-24 items-center overflow-hidden">
        <div className="min-w-0 w-full">
          {/* Official Department & University Pill */}
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 sm:px-4 py-1.5 backdrop-blur-md mb-6">
            <span className="flex h-2 w-2 shrink-0 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-sky-300 break-words line-clamp-1 sm:line-clamp-none">
              {eventConfig.collegeName} · {eventConfig.universityName}
            </span>
          </div>

          {/* Main Hero Title */}
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white break-words">
            Career Guidance <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-400 via-sky-200 to-amber-300 bg-clip-text text-transparent">
              Program 2026
            </span>
          </h1>

          <p className="mt-3 sm:mt-4 font-display text-base font-medium text-slate-200 sm:text-xl md:text-2xl break-words">
            "{eventConfig.tagline}"
          </p>

          <p className="mt-3 flex items-start sm:items-center gap-2 text-xs sm:text-base text-slate-300">
            <GraduationCap size={18} className="text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <span>
              For Final-Year Undergraduate Students of <strong>Arts &amp; Science Colleges</strong>
            </span>
          </p>

          {/* Quick Key Info Badges */}
          <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3 text-xs">
            <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur-sm">
              <CalendarDays size={16} className="text-sky-400 shrink-0" />
              <div className="truncate">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Date</div>
                <div className="font-semibold text-slate-100 truncate">{eventConfig.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur-sm">
              <Clock size={16} className="text-sky-400 shrink-0" />
              <div className="truncate">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Time</div>
                <div className="font-semibold text-slate-100 truncate">{eventConfig.time}</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur-sm">
              <MapPin size={16} className="text-sky-400 shrink-0" />
              <div className="truncate">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Venue</div>
                <div className="font-semibold text-slate-100 truncate">L.C.T.L Auditorium</div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/register" className="btn-primary">
              <span>Register for Free</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/about" className="btn-secondary">
              Explore Program &amp; Speakers
            </Link>
          </div>

          {/* Micro Perks Ticker */}
          <div className="mt-6 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" /> Free Delegate Kit &amp; Folder
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" /> Verified Participation Certificate
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" /> Direct Industry Mentorship
            </span>
          </div>
        </div>

        {/* Right side: Bespoke 3D Holographic Pass Card */}
        <div className="flex justify-center">
          <HeroInteractivePass />
        </div>
      </div>
    </section>
  )
}

