import eventConfig from '../config/eventConfig'
import { CalendarDays, Clock, MapPin, School, GraduationCap, Users } from 'lucide-react'

const items = [
  { icon: CalendarDays, label: 'Date', value: eventConfig.date },
  { icon: Clock, label: 'Time', value: eventConfig.time },
  { icon: MapPin, label: 'Venue', value: eventConfig.venue },
  { icon: School, label: 'Organized By', value: eventConfig.organizer },
  { icon: GraduationCap, label: 'Target Audience', value: 'Final-Year UG Students, Arts & Science' },
  { icon: Users, label: 'Expected Participants', value: `${eventConfig.expectedParticipants}+` },
]

export default function EventDetails() {
  return (
    <section id="details" className="section">
      <p className="eyebrow">Event Details</p>
      <h2 className="mt-2 text-3xl font-bold text-navy-950 md:text-4xl">Everything you need to know</h2>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="card flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-950 text-sky-400">
              <Icon size={19} />
            </span>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
              <div className="mt-0.5 font-display font-semibold text-navy-950">{value}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
