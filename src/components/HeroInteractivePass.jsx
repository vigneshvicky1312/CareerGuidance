import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, QrCode, ShieldCheck, ArrowUpRight, GraduationCap } from 'lucide-react'
import eventConfig from '../config/eventConfig'

export default function HeroInteractivePass() {
  const cardRef = useRef(null)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Dampened 3D tilt calculation
    const rotateX = ((y - centerY) / centerY) * -10
    const rotateY = ((x - centerX) / centerX) * 10

    setCoords({ x: rotateX, y: rotateY })
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setCoords({ x: 0, y: 0 })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  return (
    <div className="relative mx-auto flex w-full max-w-[320px] sm:max-w-sm flex-col items-center justify-center overflow-hidden sm:overflow-visible">
      {/* Decorative ambient underglow */}
      <div className="pointer-events-none absolute -inset-2 rounded-3xl bg-gradient-to-r from-sky-500/20 via-gold-500/20 to-indigo-500/20 blur-xl transition-opacity duration-500" />

      {/* Floating Micro-Badge */}
      <div className="mb-3 flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/20 bg-navy-900/90 px-3 sm:px-3.5 py-1 text-[10px] sm:text-[11px] font-medium text-slate-200 shadow-md backdrop-blur-md max-w-full truncate">
        <span className="flex h-2 w-2 shrink-0 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono text-amber-400">100% Free Delegate Pass</span>
        <span className="text-slate-400">•</span>
        <span className="text-slate-300">All Sessions Access</span>
      </div>

      {/* 3D Holographic Pass Card Container */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${coords.x}deg) rotateY(${coords.y}deg) scale3d(1.02, 1.02, 1.02)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
        }}
        className="group relative w-full overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-white via-slate-50 to-slate-100 p-0 text-navy-950 shadow-pass-3d transition-shadow duration-300 select-none"
      >
        {/* Dynamic Holographic / Glare Overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.45) 0%, rgba(56,189,248,0.15) 35%, rgba(234,179,8,0.1) 60%, transparent 80%)`,
          }}
        />

        {/* Pass Header Band */}
        <div className="relative z-10 flex items-center justify-between border-b border-navy-800/20 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-850 px-5 py-3.5 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 p-1 ring-1 ring-white/20">
              <img
                src="/images/cgp-logo-mark-dark-bg.png"
                alt="CGP Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-sky-400">
                Official Delegate Pass
              </div>
              <div className="font-display text-xs font-bold leading-none text-white">
                AIM · {eventConfig.eventId}
              </div>
            </div>
          </div>
          <span className="rounded-md border border-gold-400/30 bg-gold-400/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-gold-300">
            Admit One
          </span>
        </div>

        {/* Pass Main Body */}
        <div className="relative z-10 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Event Programme
              </p>
              <h3 className="font-display text-lg font-extrabold leading-tight text-navy-950">
                {eventConfig.eventName}
              </h3>
              <p className="text-xs font-medium text-sky-700 mt-0.5">
                Alagappa Institute of Management
              </p>
            </div>
            {/* Hologram Emblem */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 via-navy-800 to-sky-900 p-2 shadow-inner ring-2 ring-gold-400/30">
              <Sparkles size={20} className="text-gold-400 animate-pulse" />
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-100/90 p-2.5 text-xs">
            <div>
              <span className="font-mono text-[10px] uppercase text-slate-400 block">Date & Time</span>
              <span className="font-semibold text-navy-950 block truncate">{eventConfig.date}</span>
              <span className="text-[11px] text-slate-500 block">{eventConfig.time}</span>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase text-slate-400 block">Auditorium</span>
              <span className="font-semibold text-navy-950 block truncate">L.C.T.L Auditorium</span>
              <span className="text-[11px] text-slate-500 block truncate">Karaikudi</span>
            </div>
          </div>

          {/* Perforated Stub Line */}
          <div className="perforated-edge relative my-4 pt-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  Digital Pass ID
                </span>
                <p className="font-mono text-xs font-bold tracking-widest text-navy-950">
                  #CGP2026-VIP-ENTRY
                </p>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                  <ShieldCheck size={13} />
                  <span>Verified Registration</span>
                </div>
              </div>

              {/* QR Code Graphic Box */}
              <div className="flex flex-col items-center justify-center rounded-xl border border-slate-300 bg-white p-2 shadow-sm">
                <QrCode size={40} className="text-navy-950" />
                <span className="mt-0.5 font-mono text-[8px] uppercase tracking-widest text-slate-400">
                  Scan At Gate
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <Link
            to="/register"
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-navy-950 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-navy-900 group-hover:bg-navy-900"
          >
            <span>Claim Your Student Pass</span>
            <ArrowUpRight size={14} className="text-gold-400" />
          </Link>
        </div>

        {/* Barcode Strip Footer */}
        <div className="relative z-10 flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-2">
          <div className="flex h-5 items-center gap-0.5">
            {[4, 2, 6, 3, 7, 2, 5, 3, 2, 6, 4, 3, 6, 2, 5, 4, 2, 6, 3, 5].map((h, i) => (
              <span
                key={i}
                style={{ height: `${h * 2.5}px` }}
                className={`w-[2px] rounded-full ${i % 3 === 0 ? 'bg-navy-950' : 'bg-slate-400'}`}
              />
            ))}
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400">
            SECURE ADMISSION · FREE ENTRY
          </span>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-slate-400">
        ✨ Hover &amp; move cursor to inspect 3D pass hologram
      </p>
    </div>
  )
}
