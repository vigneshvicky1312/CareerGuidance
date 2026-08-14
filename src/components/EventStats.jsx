import eventConfig from '../config/eventConfig'

const speakerCount = 1 + (eventConfig.distinguishedGuests?.length || 4)

const stats = [
  { value: `${eventConfig.expectedParticipants}+`, label: 'Expected Participants' },
  { value: `${speakerCount}`, label: 'Eminent Speakers & Mentors' },
  { value: `${eventConfig.expertSessions}+`, label: 'Expert Sessions' },
  { value: '100%', label: 'Free Registration & Kit' },
]

export default function EventStats() {
  return (
    <section className="bg-navy-gradient text-white">
      <div className="section grid grid-cols-2 gap-6 !py-14 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-3xl font-bold text-sky-400 md:text-4xl">{s.value}</div>
            <div className="mt-1 text-xs text-slate-300 md:text-sm">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
