import { Link } from 'react-router-dom'
import { CalendarDays, Clock, MapPin, GraduationCap, ArrowRight } from 'lucide-react'
import eventConfig from '../config/eventConfig'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-gradient text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, #4FB6E8 0, transparent 35%), radial-gradient(circle at 85% 75%, #E8B24D 0, transparent 30%)',
        }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
        <div>
          <p className="eyebrow mb-4 text-sky-400">
            {eventConfig.collegeName} · {eventConfig.universityName}
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
            Career Guidance
            <br /> Program 2026
          </h1>
          <p className="mt-4 font-display text-xl text-sky-400 md:text-2xl">
            "{eventConfig.tagline}"
          </p>
          <p className="mt-5 flex items-center gap-2 text-sm text-slate-300 md:text-base">
            <GraduationCap size={18} className="text-sky-400" />
            For Final-Year Undergraduate Students of Arts &amp; Science Colleges
          </p>

          <div className="perforated-edge mt-8 grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 sm:grid-cols-3">
            <div className="flex items-center gap-2.5">
              <CalendarDays size={18} className="shrink-0 text-sky-400" />
              <div>
                <div className="text-xs text-slate-400">Date</div>
                <div className="text-sm font-semibold">{eventConfig.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock size={18} className="shrink-0 text-sky-400" />
              <div>
                <div className="text-xs text-slate-400">Time</div>
                <div className="text-sm font-semibold">{eventConfig.time}</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin size={18} className="shrink-0 text-sky-400" />
              <div>
                <div className="text-xs text-slate-400">Venue</div>
                <div className="text-sm font-semibold">{eventConfig.venue}</div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="btn-primary">
              Register Now <ArrowRight size={16} />
            </Link>
            <Link to="/location" className="btn-secondary">
              View Location
            </Link>
          </div>
        </div>

        {/* Signature element: a torn ticket stub echoing the event's
            paper pass + QR check-in journey. */}
        <div className="relative mx-auto flex w-full max-w-sm items-center justify-center">
          <div className="w-full rounded-2xl bg-white text-navy-950 shadow-2xl">
            <div className="flex items-center justify-between rounded-t-2xl bg-navy-900 px-5 py-3 text-white">
              <span className="font-mono text-xs tracking-widest">ADMIT ONE</span>
              <span className="font-mono text-xs tracking-widest">{eventConfig.eventId}</span>
            </div>
            <div className="space-y-3 px-5 py-6">
              <div className="font-display text-lg font-bold">{eventConfig.eventName}</div>
              <div className="text-xs text-slate-500">{eventConfig.date} · {eventConfig.time}</div>
              <div className="text-xs text-slate-500">{eventConfig.venue}</div>
              <div className="perforated-edge relative flex items-center justify-between pt-4 text-xs">
                <span className="font-mono tracking-widest text-slate-400">
                  #{eventConfig.eventId}-0001
                </span>
                <div className="grid h-14 w-14 grid-cols-4 grid-rows-4 gap-0.5">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <span
                      key={i}
                      className={`rounded-[1px] ${[1,2,3,5,8,10,12,13,14].includes(i) ? 'bg-navy-950' : 'bg-transparent'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
