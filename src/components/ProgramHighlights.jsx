import {
  Briefcase,
  GraduationCap,
  Landmark,
  Sparkles,
  Rocket,
  Users2,
  Clock,
  Mic,
  MessageCircleQuestion,
  FileCheck,
} from 'lucide-react'
import eventConfig from '../config/eventConfig'

const highlights = [
  {
    icon: Briefcase,
    title: 'Corporate Careers & Placement Trends',
    tag: 'Industry & Hiring',
    text: 'Understand real recruiter expectations, emerging job roles across IT, BFSI, FMCG, and modern campus hiring procedures.',
  },
  {
    icon: GraduationCap,
    title: 'Postgraduate Studies & Entrance Exams',
    tag: 'Higher Education',
    text: 'Strategic blueprints for MBA, M.Sc, M.Com, and cracking competitive exams like TANCET, CAT, MAT, and CUET.',
  },
  {
    icon: Landmark,
    title: 'Civil Services & Public Administration',
    tag: 'Government Careers',
    text: 'Structured preparation strategies for TNPSC (Group 1, 2, 4), UPSC, Banking, and central government examinations.',
  },
  {
    icon: Sparkles,
    title: 'Employability & Interview Mastery',
    tag: 'Skill Readiness',
    text: 'Essential soft skills, corporate communication, resume structuring, and techniques to stand out in interviews.',
  },
  {
    icon: Rocket,
    title: 'Startup Ecosystem & Entrepreneurship',
    tag: 'Self-Reliance',
    text: 'Insights into turning final-year project ideas into ventures, incubation support, and government MSME funding schemes.',
  },
  {
    icon: Users2,
    title: 'Direct Interaction & Open Q&A',
    tag: 'Live Mentorship',
    text: 'Face-to-face question-and-answer sessions with senior corporate leaders, academic deans, and civil administrators.',
  },
]

const dayFeatures = [
  { icon: Clock, label: 'Full-Day Intensive Guidance' },
  { icon: Mic, label: `${eventConfig.expertSessions} Expert Sessions` },
  { icon: MessageCircleQuestion, label: 'Interactive Student Q&A' },
  { icon: FileCheck, label: 'Free Material Kit & Certificate' },
]

export default function ProgramHighlights() {
  return (
    <section id="highlights" className="bg-white py-16 md:py-20">
      <div id="purpose" className="section !py-0">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Program Highlights & Takeaways</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl md:text-5xl">
            Everything You Need To Fast-Track Your Future
          </h2>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            A comprehensive, one-day guidance framework designed to give final-year undergraduates clear direction, competitive advantage, and actionable next steps.
          </p>
        </div>

        {/* 6 Actionable Tracks Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map(({ icon: Icon, title, tag, text }) => (
            <div
              key={title}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-paper p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-navy-600/40 hover:bg-white hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-950 text-sky-400 shadow-sm transition-all duration-300 group-hover:bg-navy-900 group-hover:text-gold-400">
                    <Icon size={22} />
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-600 shadow-sm border border-slate-200/80">
                    {tag}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-navy-950 group-hover:text-navy-700 transition">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* On-The-Day Quick Highlights Bar */}
        <div className="mt-10 rounded-2xl border border-sky-200/80 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 p-6 text-white shadow-lg">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {dayFeatures.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold-400 backdrop-blur">
                  <Icon size={20} />
                </span>
                <span className="text-xs sm:text-sm font-semibold tracking-wide text-slate-200">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
