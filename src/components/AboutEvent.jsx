import { Compass, BookOpen, Briefcase, Award, Sparkles } from 'lucide-react'
import eventConfig from '../config/eventConfig'

const programPillars = [
  {
    icon: Compass,
    title: 'Career Awareness & Hiring Dynamics',
    desc: 'In-depth exploration of corporate job roles, industry demands, and actual hiring benchmarks for Arts & Science graduates across Fortune 500s.',
    accent: 'sky',
  },
  {
    icon: BookOpen,
    title: 'Higher Studies & PG Blueprint',
    desc: 'Structured preparation roadmaps for MBA, M.Com, M.Sc and competitive national entrances including TANCET, CAT, MAT, and CUET.',
    accent: 'gold',
  },
  {
    icon: Briefcase,
    title: 'Workplace Readiness & Soft Skills',
    desc: 'Actionable coaching on ATS-friendly resume structuring, corporate communication, group discussion tactics, and interview confidence.',
    accent: 'emerald',
  },
  {
    icon: Award,
    title: 'Direct Industry Mentorship',
    desc: 'Unfiltered question-and-answer interactions with senior HR vice presidents, district administrators, and university deans.',
    accent: 'indigo',
  },
]

export default function AboutEvent() {
  return (
    <section id="about" className="section">
      <div className="max-w-3xl">
        <span className="eyebrow">
          <Sparkles size={14} className="text-sky-500" /> About the Program
        </span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl md:text-5xl">
          A Strategic Bridge From Classroom to Corporate Career
        </h2>
        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
          The <strong className="text-navy-950">{eventConfig.eventName}</strong> is an intensive, high-impact guidance initiative organized by <strong className="text-navy-950">{eventConfig.collegeName}</strong>. Structured specifically for final-year undergraduate scholars, it cuts through ambiguity to deliver proven career clarity, competitive exam roadmaps, and direct access to corporate mentors.
        </p>
      </div>

      {/* 4 Program Pillars */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {programPillars.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-card-hover"
          >
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-950 text-sky-400 shadow-sm transition-all duration-300 group-hover:bg-navy-900 group-hover:text-gold-400">
                <Icon size={22} />
              </span>
              <h3 className="mt-5 font-display text-base font-bold text-navy-950 group-hover:text-navy-700 transition">
                {title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

