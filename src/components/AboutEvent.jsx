import { Compass, BookOpen, Briefcase, Award, CheckCircle2 } from 'lucide-react'
import eventConfig from '../config/eventConfig'

const programPillars = [
  {
    icon: Compass,
    title: 'Career Awareness & Market Trends',
    desc: 'In-depth exploration of corporate job roles, industry demands, and hiring patterns for Arts & Science graduates.',
  },
  {
    icon: BookOpen,
    title: 'Higher Education & Entrance Exams',
    desc: 'Structured roadmaps for MBA, PG degrees, and competitive exams including TNPSC, UPSC, CAT, and TANCET.',
  },
  {
    icon: Briefcase,
    title: 'Workplace Readiness & Skills',
    desc: 'Actionable guidance on modern resume building, interview techniques, soft skills, and workplace adaptation.',
  },
  {
    icon: Award,
    title: 'Direct Expert Mentorship',
    desc: 'Interactive question-and-answer sessions and one-on-one perspectives with experienced domain leaders.',
  },
]

const programTakeaways = [
  'Comprehensive overview of career trajectories across Banking, IT, Management, and Public Sectors',
  'Step-by-step preparation strategies for central and state entrance tests and fellowships',
  'Practical insights into essential soft skills, technical proficiencies, and digital literacy',
  'Complimentary attendee career kit, resource booklet, and participation certificate',
]

export default function AboutEvent() {
  return (
    <section id="about" className="section">
      <div className="max-w-3xl">
        <p className="eyebrow">About the Program</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy-950 md:text-4xl">
          A guided roadmap from classroom to career
        </h2>
        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
          The <span className="font-semibold text-navy-950">{eventConfig.eventName}</span> is an intensive, high-impact guidance initiative structured specifically for final-year undergraduate students. It delivers clarity, strategic direction, and real-world tools to navigate post-graduation decisions across corporate employment, higher education, civil services, and entrepreneurship.
        </p>
      </div>

      {/* 4 Program Pillars */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {programPillars.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-950 text-sky-400 shadow-sm transition group-hover:bg-navy-900 group-hover:text-gold-400">
              <Icon size={20} />
            </span>
            <h3 className="mt-4 font-display text-base font-bold text-navy-950">{title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">{desc}</p>
          </div>
        ))}
      </div>

      {/* Program Takeaways Card */}
      <div className="mt-8 rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50/70 via-paper to-white p-6 md:p-8">
        <h3 className="font-display text-lg font-bold text-navy-950 sm:text-xl">
          What You Will Gain From This Program
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {programTakeaways.map((item) => (
            <div key={item} className="flex items-start gap-2.5">
              <CheckCircle2 size={18} className="text-sky-600 shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm font-medium text-slate-700 leading-snug">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
