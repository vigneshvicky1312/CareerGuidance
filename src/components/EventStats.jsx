import eventConfig from '../config/eventConfig'
import colleges from '../config/colleges'
import { Users, Mic, BookOpen, Gift, School2 } from 'lucide-react'

const speakerCount = (eventConfig.chiefGuest ? 1 : 0) + (eventConfig.distinguishedGuests?.length || 0)

const stats = [
  {
    icon: Users,
    value: `${eventConfig.expectedParticipants}+`,
    label: 'Expected Delegates',
    sub: 'Final-year UG students',
  },
  {
    icon: Mic,
    value: `${speakerCount}`,
    label: 'Distinguished Dignitaries',
    sub: 'Corporate & administrative leaders',
  },
  {
    icon: School2,
    value: `${colleges.length}+`,
    label: 'Participating Colleges',
    sub: 'Across Tamil Nadu districts',
  },
  {
    icon: Gift,
    value: '100% Free',
    label: 'Registration & Kits',
    sub: 'Sponsored guidance initiative',
  },
]

export default function EventStats() {
  return (
    <section className="relative overflow-hidden bg-navy-gradient text-white border-y border-white/10">
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            'radial-gradient(circle at 80% 20%, #38BDF8 0, transparent 40%), radial-gradient(circle at 20% 80%, #EAB308 0, transparent 40%)',
        }}
      />
      <div className="section relative grid grid-cols-2 gap-3 sm:gap-6 !py-10 md:!py-12 md:grid-cols-4 px-4 sm:px-5">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className="flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/20 min-w-0"
            >
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 mb-2">
                <Icon size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div className="font-display text-xl sm:text-3xl lg:text-4xl font-extrabold text-white break-words">
                {s.value}
              </div>
              <div className="mt-1 text-xs sm:text-sm font-bold text-sky-300 break-words leading-tight">{s.label}</div>
              <div className="mt-0.5 text-[10px] sm:text-[11px] text-slate-400 break-words leading-snug">{s.sub}</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

