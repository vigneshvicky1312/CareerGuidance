import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Compass,
  Briefcase,
  GraduationCap,
  Landmark,
  Rocket,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Award,
} from 'lucide-react'

const streams = [
  { id: 'bcom', label: 'B.Com / Commerce', icon: '📊' },
  { id: 'bsc_cs', label: 'B.Sc CS / BCA / IT', icon: '💻' },
  { id: 'bsc_sci', label: 'B.Sc Science / Maths', icon: '🔬' },
  { id: 'ba_arts', label: 'B.A. Arts & Lit', icon: '📚' },
  { id: 'bba', label: 'BBA / Management', icon: '📈' },
]

const goals = [
  { id: 'corporate', label: 'Corporate & MNC Jobs', icon: Briefcase },
  { id: 'higher_ed', label: 'MBA & Higher Studies', icon: GraduationCap },
  { id: 'govt_civil', label: 'Govt Jobs & Civil Services', icon: Landmark },
  { id: 'fintech_banking', label: 'Banking & Financial Markets', icon: Award },
  { id: 'startup', label: 'Startups & Business', icon: Rocket },
]

const recommendations = {
  corporate: {
    title: 'Corporate Career & MNC Acceleration Path',
    badge: 'Industry High Demand',
    color: 'sky',
    keynoteMatch: 'Keynote Address by Mr. Arvind Rajan (Corporate Demands & AI Skills)',
    summary:
      'Ideal for final-year students targeting entry into Fortune 500s, IT services, consulting, and private corporations. Focuses on resume optimization, aptitude rounds, and corporate communication.',
    mustAttend: [
      'Session 1: "Future-Proofing Your Career: AI & Global Corporate Opportunities"',
      'Session 4: "Resume Mastery, Mock Interviews & Corporate Readiness Workshop"',
    ],
    prepRoadmap: [
      'Build a single-page ATS-compliant resume highlighting projects',
      'Practice quantitative aptitude and logical reasoning daily (30 mins)',
      'Sharpen LinkedIn profile and participate in off-campus hiring drives',
    ],
  },
  higher_ed: {
    title: 'Postgraduate Mastery & Top B-School Roadmap',
    badge: 'Higher Studies Pathway',
    color: 'amber',
    keynoteMatch: 'Session by Dr. K. Meenakshisundaram (CUET, TANCET, CAT & Central Univs)',
    summary:
      'Structured strategy for cracking MBA, M.Com, M.Sc entrance exams and securing admissions into premier central universities with scholarships and institutional support.',
    mustAttend: [
      'Session 2: "Cracking PG Entrances (CUET / TANCET / CAT) & National Research"',
      'Open Q&A: Direct interactions with Alagappa Institute of Management Deans',
    ],
    prepRoadmap: [
      'Map exam deadlines: TANCET (Feb/Mar), CAT (Nov), CUET-PG (Mar)',
      'Prepare high-yield sections: Verbal Ability, Data Interpretation, General Awareness',
      'Explore Alagappa University MBA specializations & merit scholarship schemes',
    ],
  },
  govt_civil: {
    title: 'Civil Services & Public Administration Roadmap',
    badge: 'Public Sector & Bureaucracy',
    color: 'emerald',
    keynoteMatch: 'Special Address by Smt. S. Priyadharshini, IAS (District Administration)',
    summary:
      'Strategic blueprints for state civil services (TNPSC Group 1, 2, 4), UPSC Civil Services, Banking (IBPS / SBI), and Railway Recruitment Boards for graduate aspirants.',
    mustAttend: [
      'Session 3: "Roadmap to Civil Services: Systematic Strategy for TNPSC & UPSC"',
      'Interactive Mentorship: How to balance final-year exams with competitive prep',
    ],
    prepRoadmap: [
      'Master Tamil Nadu State Board textbooks (Samacheer Kalvi) for TNPSC foundations',
      'Follow daily national editorial analysis and current affairs consolidation',
      'Solve previous 5 years official question papers under timed exam conditions',
    ],
  },
  fintech_banking: {
    title: 'Fintech, Modern Banking & Wealth Advisory Path',
    badge: 'BFSI & Financial Markets',
    color: 'indigo',
    keynoteMatch: 'Session by Mr. Ronald Rajesh (Senior Director, BFSI & Fintech Ops)',
    summary:
      'Targeted for Commerce, Math, and Economics graduates eager to enter rapid-growth domains like Digital Banking, Wealth Advisory, Equity Research, and Fintech Operations.',
    mustAttend: [
      'Session 3: "Next-Gen Careers in Banking, Fintech, Analytics & Wealth Advisory"',
      'Panel Discussion: Emerging skills in Financial Analytics and NISM certifications',
    ],
    prepRoadmap: [
      'Pursue foundational industry certifications (NISM Series, Excel for Finance)',
      'Prepare for Banking PO / Clerk national entrance examinations (SBI, IBPS)',
      'Understand core financial statement analysis and digital transaction ecosystems',
    ],
  },
  startup: {
    title: 'Venture Creation & Incubation Ecosystem Path',
    badge: 'Entrepreneurship & Innovation',
    color: 'rose',
    keynoteMatch: 'Innovation & Incubation Briefing by AIM Entrepreneurship Cell',
    summary:
      'Designed for aspiring founders and innovators ready to transform undergraduate projects into commercially viable startups through incubation and MSME funding.',
    mustAttend: [
      'Session 4: "Turning Student Projects into Marketable Products & Startups"',
      'Networking Hour: Connect with university incubation mentors and grant officers',
    ],
    prepRoadmap: [
      'Validate your target customer problem statement with minimum 30 user interviews',
      'Explore Startup India, Tamil Nadu EDII seed funding and university incubation grants',
      'Learn basics of unit economics, IP patents, and company registration processes',
    ],
  },
}

export default function CareerTrackMatcher() {
  const [selectedStream, setSelectedStream] = useState('bcom')
  const [selectedGoal, setSelectedGoal] = useState('corporate')

  const rec = recommendations[selectedGoal] || recommendations.corporate

  return (
    <section className="bg-slate-50/80 py-16 md:py-24 border-y border-slate-200/80">
      <div className="section !py-0">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">
            <Compass size={14} className="text-sky-500" /> Interactive Career Pathfinder
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-navy-950 sm:text-4xl">
            Find Your Personalized Guidance Track
          </h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            Select your current undergraduate discipline and target career ambition. We will instantly map out your priority conference sessions and preparation roadmap.
          </p>
        </div>

        {/* Step 1: Select Degree */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Step 1 · Your Undergraduate Stream
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {streams.map((s) => {
              const active = selectedStream === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedStream(s.id)}
                  className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all duration-200 ${
                    active
                      ? 'border-navy-800 bg-navy-950 text-white shadow-md'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-lg">{s.icon}</span>
                  <span className="text-xs font-semibold truncate">{s.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Step 2: Select Goal */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Step 2 · Your Immediate Career Goal
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {goals.map((g) => {
              const Icon = g.icon
              const active = selectedGoal === g.id
              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedGoal(g.id)}
                  className={`flex items-center gap-2.5 rounded-xl border p-3.5 text-left transition-all duration-200 ${
                    active
                      ? 'border-sky-500 bg-gradient-to-br from-navy-900 to-navy-950 text-white shadow-md ring-2 ring-sky-400/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      active ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon size={16} />
                  </span>
                  <span className="text-xs font-semibold leading-tight">{g.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Step 3: Interactive Result Card */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-card transition-all duration-300">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 font-mono text-xs font-bold text-sky-700 border border-sky-200">
                <Sparkles size={12} className="text-amber-500" /> {rec.badge}
              </span>
              <h3 className="mt-2 text-xl md:text-2xl font-bold text-navy-950">{rec.title}</h3>
            </div>
            <Link to="/register" className="btn-primary !py-2.5 text-xs">
              <span>Reserve Seat for This Track</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-600">{rec.summary}</p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Priority Sessions */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <h4 className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-navy-950">
                <BookOpen size={15} className="text-sky-600" /> Recommended Program Sessions
              </h4>
              <ul className="mt-3 space-y-2 text-xs">
                {rec.mustAttend.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700">
                    <CheckCircle2 size={15} className="text-sky-600 shrink-0 mt-0.5" />
                    <span className="font-medium leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actionable Next Steps */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <h4 className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-navy-950">
                <Award size={15} className="text-amber-600" /> Strategic Next Steps
              </h4>
              <ul className="mt-3 space-y-2 text-xs">
                {rec.prepRoadmap.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-800 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="font-medium leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
