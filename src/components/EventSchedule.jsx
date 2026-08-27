import { useState } from 'react'
import {
  Clock,
  MapPin,
  User,
  Sparkles,
  Award,
  BookOpen,
  Coffee,
  CheckCircle2,
  CalendarDays,
  FileCheck,
} from 'lucide-react'
import eventConfig from '../config/eventConfig'

const scheduleData = [
  {
    id: 1,
    time: '09:00 AM – 10:00 AM',
    period: 'morning',
    track: 'general',
    title: 'Delegate Arrival, Desk Check-In & Material Kit Handover',
    speaker: 'AIM Volunteer & Registration Desk Team',
    venue: 'Main Auditorium Foyer (L.C.T.L Auditorium)',
    badge: 'Registration & Welcome',
    badgeColor: 'sky',
    description:
      'QR code pass verification at entry counters. Registered delegates receive an event file folder with printed program agenda sheets, notepad, pen, and conference materials.',
  },
  {
    id: 2,
    time: '10:00 AM – 10:30 AM',
    period: 'morning',
    track: 'inaugural',
    title: 'Grand Inauguration & Welcome Address',
    speaker: 'Dr. S. Chandramohan, Director, AIM & University Dignitaries',
    venue: 'Main Auditorium Stage',
    badge: 'Inaugural Session',
    badgeColor: 'gold',
    description:
      'Ceremonial lamp lighting, presidential address by university leadership, overview of Career Guidance Program 2026 objectives, and felicitation of distinguished guests.',
  },
  {
    id: 3,
    time: '10:30 AM – 11:45 AM',
    period: 'morning',
    track: 'corporate',
    title: 'Keynote: "Future-Proofing Your Career — AI, Corporate Demands & Campus Hiring"',
    speaker: `${eventConfig.chiefGuest?.name || 'Mr. Arvind Rajan'} (${eventConfig.chiefGuest?.designation || 'Vice President, Talent Strategy'})`,
    venue: 'Main Auditorium Stage',
    badge: 'Keynote Address',
    badgeColor: 'gold',
    description:
      'Masterclass on corporate market transitions, tech adaptation for non-engineering graduates, employer screening criteria, and high-growth trajectories across global MNCs.',
  },
  {
    id: 4,
    time: '11:45 AM – 01:00 PM',
    period: 'morning',
    track: 'higher_ed',
    title: 'Session 2: Cracking Post-Graduate Entrances (CUET / TANCET / CAT) & Research Pathways',
    speaker: 'Dr. K. Meenakshisundaram (Dean of Academic Affairs & Senior Professor)',
    venue: 'Main Auditorium Stage',
    badge: 'Higher Studies Track',
    badgeColor: 'emerald',
    description:
      'Step-by-step roadmap for MBA, M.Com, M.Sc admissions, central university fellowships, score cut-offs, and state scholarship schemes for Arts & Science students.',
  },
  {
    id: 5,
    time: '01:00 PM – 01:45 PM',
    period: 'afternoon',
    track: 'break',
    title: 'Networking Lunch & Sponsor Exhibition Interaction',
    speaker: 'Open to all Attendees & Sponsors',
    venue: 'Auditorium Banquet & Exhibition Lawn',
    badge: 'Lunch & Exhibition',
    badgeColor: 'sky',
    description:
      'Delegates interact with partner booths, explore course brochures, and network with faculty mentors and peer students from 40+ participating colleges.',
  },
  {
    id: 6,
    time: '01:45 PM – 02:45 PM',
    period: 'afternoon',
    track: 'govt_civil',
    title: 'Session 3: Roadmap to Civil Services (TNPSC / UPSC) & Banking Sector Careers',
    speaker: 'Smt. S. Priyadharshini, IAS & Mr. Ronald Rajesh (Fintech Director)',
    venue: 'Main Auditorium Stage',
    badge: 'Public Sector & BFSI',
    badgeColor: 'indigo',
    description:
      'Dual-focus session: Strategic preparation for TNPSC (Group 1, 2, 4), Union Civil Services, plus contemporary careers in Digital Banking, Wealth Management & Fintech.',
  },
  {
    id: 7,
    time: '02:45 PM – 03:45 PM',
    period: 'afternoon',
    track: 'corporate',
    title: 'Session 4: Interview Mastery, Corporate Readiness & Interactive Open Q&A Panel',
    speaker: 'Combined Industry Panel & Career Mentors',
    venue: 'Main Auditorium Stage',
    badge: 'Live Mentorship & Q&A',
    badgeColor: 'gold',
    description:
      'Direct floor interaction: Students ask burning career questions, mock interview breakdown, resume red flags, and salary negotiation insights.',
  },
  {
    id: 8,
    time: '03:45 PM – 04:30 PM',
    period: 'afternoon',
    track: 'valedictory',
    title: 'Valedictory Ceremony, Certificate Presentation & Closing Remarks',
    speaker: 'Faculty Coordinator Dr. C.K. Muthukumaran & Organizing Committee',
    venue: 'Main Auditorium Stage',
    badge: 'Certification & Concluding',
    badgeColor: 'emerald',
    description:
      'Distribution of verified participation certificates, announcement of special scholarship/placement follow-up sessions, and formal vote of thanks.',
  },
]

const trackFilters = [
  { id: 'all', label: 'All Sessions' },
  { id: 'morning', label: 'Morning Track' },
  { id: 'afternoon', label: 'Afternoon Track' },
  { id: 'corporate', label: 'Corporate & Placement' },
  { id: 'higher_ed', label: 'Higher Studies & MBA' },
  { id: 'govt_civil', label: 'Govt & Civil Services' },
]

export default function EventSchedule() {
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredSessions = scheduleData.filter((item) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'morning') return item.period === 'morning'
    if (activeFilter === 'afternoon') return item.period === 'afternoon'
    if (activeFilter === 'corporate') return item.track === 'corporate'
    if (activeFilter === 'higher_ed') return item.track === 'higher_ed'
    if (activeFilter === 'govt_civil') return item.track === 'govt_civil'
    return true
  })

  return (
    <section id="schedule" className="bg-white py-16 md:py-24">
      <div className="section !py-0">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">
            <CalendarDays size={14} className="text-sky-500" /> Complete Program Schedule
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-navy-950 sm:text-4xl">
            A Day Engineered For Your Future
          </h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            From morning keynote insights to interactive career labs and certificate distribution — plan your day at {eventConfig.venue}.
          </p>
        </div>

        {/* Track Filter Pills */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {trackFilters.map((tab) => {
            const active = activeFilter === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-navy-950 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-navy-950'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Timeline Container */}
        <div className="relative mt-12 max-w-4xl mx-auto">
          {/* Vertical Connecting Line */}
          <div className="absolute left-4 sm:left-7 top-4 bottom-4 w-0.5 bg-gradient-to-b from-sky-400 via-navy-600 to-amber-400 hidden sm:block" />

          <div className="space-y-6">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="group relative flex flex-col sm:flex-row gap-5 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-card transition-all duration-300 hover:border-slate-300 hover:shadow-card-hover sm:ml-12"
              >
                {/* Timeline Dot on larger screens */}
                <div className="absolute -left-[35px] top-6 hidden h-5 w-5 rounded-full border-4 border-white bg-navy-900 shadow-md ring-2 ring-sky-400 group-hover:scale-125 transition-transform sm:block" />

                {/* Time & Venue Column */}
                <div className="sm:w-44 shrink-0">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-sky-600">
                    <Clock size={14} className="shrink-0" />
                    <span>{session.time}</span>
                  </div>
                  <div className="mt-1.5 flex items-start gap-1.5 text-xs text-slate-500">
                    <MapPin size={13} className="shrink-0 mt-0.5 text-slate-400" />
                    <span className="leading-tight">{session.venue}</span>
                  </div>
                  <span className="mt-3 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600">
                    {session.badge}
                  </span>
                </div>

                {/* Session Details Column */}
                <div className="min-w-0 flex-1 border-t border-slate-100 pt-3 sm:border-t-0 sm:pt-0 sm:border-l sm:border-slate-100 sm:pl-5">
                  <h3 className="font-display text-base sm:text-lg font-bold text-navy-950 group-hover:text-navy-700 transition break-words">
                    {session.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-700 break-words">
                    <User size={14} className="text-amber-600 shrink-0" />
                    <span className="break-words">{session.speaker}</span>
                  </div>

                  <p className="mt-2.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {session.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Footer Note */}
        <div className="mt-10 rounded-2xl border border-sky-200/70 bg-gradient-to-r from-sky-50 via-white to-sky-50/40 p-4 text-center text-xs text-slate-600 max-w-2xl mx-auto">
          <p className="flex items-center justify-center gap-2 font-medium">
            <FileCheck size={16} className="text-sky-600 shrink-0" />
            <span>
              All attendees receive a printed program agenda schedule sheet placed inside their event file folder upon arrival for easy reference.
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
