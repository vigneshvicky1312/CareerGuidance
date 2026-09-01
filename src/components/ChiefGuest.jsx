import { useState } from 'react'
import eventConfig from '../config/eventConfig'
import {
  BadgeCheck,
  Mic,
  GraduationCap,
  Briefcase,
  Sparkles,
  BookOpen,
  Award,
  Building2,
  Quote,
} from 'lucide-react'

function getInitials(name) {
  if (!name) return 'CG'
  const parts = name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.|Prof\.|Smt\.)\s+/i, '').trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return (parts[0] || 'CG').slice(0, 2).toUpperCase()
}

function GuestAvatar({ src, name, className, initialsClassName = 'text-lg' }) {
  const [imgError, setImgError] = useState(false)
  const initials = getInitials(name)

  if (!src || imgError) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-navy-800 via-navy-900 to-sky-900 font-display font-bold text-sky-200 shadow-inner ${className}`}
      >
        <span className={initialsClassName}>{initials}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={name}
      className={`object-cover ${className}`}
      onError={() => setImgError(true)}
    />
  )
}

const badgeColorMap = {
  gold: {
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    ring: 'ring-amber-400/30',
    accent: 'text-amber-600',
  },
  sky: {
    badge: 'bg-sky-100 text-sky-800 border-sky-200',
    ring: 'ring-sky-400/30',
    accent: 'text-sky-600',
  },
  indigo: {
    badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    ring: 'ring-indigo-400/30',
    accent: 'text-indigo-600',
  },
  emerald: {
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    ring: 'ring-emerald-400/30',
    accent: 'text-emerald-600',
  },
}

export default function ChiefGuest() {
  const cg = eventConfig.chiefGuest
  const guests = eventConfig.distinguishedGuests || []

  if (!cg && guests.length === 0) {
    return (
      <section id="chief-guest" className="bg-slate-50/70 py-16 md:py-20 border-t border-slate-200/80">
        <div className="section !py-0">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-950 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-sky-300">
              <Sparkles size={13} className="text-gold-400" />
              Distinguished Personalities &amp; Speakers
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
              Learn From Industry Titans &amp; Eminent Leaders
            </h2>
            <p className="mt-3 text-base text-slate-600 sm:text-lg">
              Guiding Arts &amp; Science undergraduates with actionable roadmaps across corporate recruitment, competitive exams, finance, higher education, and entrepreneurship.
            </p>
          </div>

          <div className="mt-10 mx-auto max-w-2xl rounded-3xl border border-dashed border-sky-300/80 bg-gradient-to-br from-sky-50/60 via-white to-amber-50/30 p-8 sm:p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-950 text-gold-400 shadow-md">
              <Sparkles size={28} />
            </div>
            <h3 className="mt-5 font-display text-xl font-bold text-navy-950 sm:text-2xl">
              Chief Guest &amp; Speaker Lineup Announcement Coming Soon
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              We are finalizing the distinguished panel of corporate HR leaders, civil administration officers, and academic dignitaries for Career Guidance Program 2026.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-sky-100/80 px-4 py-1.5 text-xs font-semibold text-sky-800">
              <span className="h-2 w-2 rounded-full bg-sky-500 animate-ping" />
              Official Announcement to be Released Shortly
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="chief-guest" className="bg-slate-50/70 py-16 md:py-24">
      <div className="section !py-0">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-950 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-sky-300">
            <Sparkles size={13} className="text-gold-400" />
            Distinguished Personalities & Speakers
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl md:text-5xl">
            Learn From Industry Titans & Eminent Leaders
          </h2>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            Guiding Arts & Science undergraduates with actionable roadmaps across corporate recruitment, competitive exams, finance, higher education, and entrepreneurship.
          </p>
        </div>

        {/* ─── MAIN SPEAKER / CHIEF GUEST (HERO CARD) ─── */}
        {cg && (
          <div className="relative mt-12 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-navy-950/5 transition md:p-10 lg:p-12">
            {/* Background decorative glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-sky-100/50 blur-3xl" />
            <div className="pointer-events-none absolute -left-24 -bottom-24 h-80 w-80 rounded-full bg-gold-400/10 blur-3xl" />

            {/* Featured Badge */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
                <span className="h-2 w-2 rounded-full bg-gold-400 animate-pulse" />
                {cg.badge || 'Chief Guest & Keynote Speaker'}
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-500">
                <Award size={14} className="text-gold-500" /> Keynote Address • CGP 2026
              </span>
            </div>

            <div className="grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-12 items-center">
              {/* Photo / Avatar */}
              <div className="flex flex-col items-center">
                <div className="group relative aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-2xl bg-navy-950 shadow-lg ring-4 ring-navy-900/10">
                  <GuestAvatar
                    src={cg.photo}
                    name={cg.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    initialsClassName="text-4xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-0 transition group-hover:opacity-100 flex items-end p-4">
                    <p className="text-xs font-medium text-slate-200 flex items-center gap-1">
                      <Quote size={12} className="text-gold-400" /> {cg.organization}
                    </p>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <span className="inline-block rounded-lg bg-navy-50 px-3 py-1 text-xs font-medium text-navy-800">
                    Keynote Dignitary
                  </span>
                </div>
              </div>

              {/* Speaker Content */}
              <div className="min-w-0 w-full">
                <div>
                  <h3 className="font-display text-2xl font-bold text-navy-950 sm:text-3xl md:text-4xl break-words">
                    {cg.name}
                  </h3>
                  <p className="mt-1.5 text-base font-semibold text-sky-600 sm:text-lg break-words">
                    {cg.designation}
                  </p>
                  <p className="flex items-center gap-1.5 text-sm font-medium text-slate-600 mt-1 break-words">
                    <Building2 size={15} className="text-slate-400 shrink-0" />
                    <span className="break-words">{cg.organization}</span>
                  </p>
                </div>

                {/* Keynote Topic Highlight Banner */}
                {cg.keynoteTopic && (
                  <div className="mt-5 rounded-2xl border border-sky-200/70 bg-gradient-to-r from-sky-50 via-white to-sky-50/40 p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-950 text-gold-400 shadow-sm">
                        <Mic size={18} />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-sky-800">
                          Keynote Topic
                        </span>
                        <p className="mt-0.5 text-sm font-semibold text-navy-950 md:text-base leading-snug">
                          "{cg.keynoteTopic}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Key Credentials Pills */}
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-slate-50/70 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm text-navy-700">
                      <GraduationCap size={16} />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400 block">
                        Qualification
                      </span>
                      <span className="text-xs font-semibold text-slate-800 sm:text-sm">
                        {cg.qualification}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-slate-50/70 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm text-navy-700">
                      <Briefcase size={16} />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400 block">
                        Experience
                      </span>
                      <span className="text-xs font-semibold text-slate-800 sm:text-sm">
                        {cg.experience}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expertise Badges */}
                {cg.expertise && cg.expertise.length > 0 && (
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-slate-500 mr-1">Focus Areas:</span>
                    {cg.expertise.map((e) => (
                      <span
                        key={e}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-navy-950 shadow-sm"
                      >
                        <BadgeCheck size={13} className="text-sky-500" /> {e}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bio text */}
                <p className="mt-5 text-sm leading-relaxed text-slate-600 sm:text-base border-t border-slate-100 pt-4">
                  {cg.bio}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─── 4 ADDITIONAL GUESTS FROM VARIOUS DESIGNATIONS ─── */}
        {guests.length > 0 && (
          <div className="mt-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-sky-600">
                  Multidisciplinary Panel
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-navy-950 sm:text-3xl">
                  Distinguished Guests & Mentors
                </h3>
              </div>
              <p className="text-sm text-slate-500 max-w-md">
                Representing higher education, civil administration, banking & finance, and startup entrepreneurship.
              </p>
            </div>

            <div className={`mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 ${guests.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
              {guests.map((g) => {
                const style = badgeColorMap[g.badgeColor] || badgeColorMap.sky
                return (
                  <div
                    key={g.id || g.name}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-slate-300"
                  >
                    <div>
                      {/* Guest Role Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${style.badge}`}
                        >
                          <Sparkles size={11} /> {g.roleBadge}
                        </span>
                      </div>

                      {/* Avatar & Info */}
                      <div className="mt-5 flex items-center gap-3.5">
                        <div
                          className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-navy-950 ring-2 ${style.ring}`}
                        >
                          <GuestAvatar
                            src={g.photo}
                            name={g.name}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                            initialsClassName="text-base"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="truncate font-display text-base font-bold text-navy-950 group-hover:text-sky-600 transition">
                            {g.name}
                          </h4>
                          <p className="text-xs font-semibold text-slate-700 line-clamp-2 mt-0.5">
                            {g.designation}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {g.organization}
                          </p>
                        </div>
                      </div>

                      {/* Topic / Specialization Pill */}
                      <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                        <div className="flex items-start gap-2">
                          <BookOpen size={14} className={`shrink-0 mt-0.5 ${style.accent}`} />
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                              Session Focus
                            </span>
                            <p className="text-xs font-semibold text-navy-950 line-clamp-2 leading-tight">
                              {g.sessionTopic || g.specialization}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Bio brief */}
                      <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-3">
                        {g.bio}
                      </p>
                    </div>

                    {/* Footer / Qualification */}
                    <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-medium text-slate-700 truncate">{g.qualification}</span>
                      <span className="shrink-0 text-sky-600 font-medium">Session Speaker</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

