import { Compass, GraduationCap, Building2, Sparkles, Route, Users2 } from 'lucide-react'

const items = [
  { icon: Compass, title: 'Career Awareness', text: 'Understand the range of career opportunities open to Arts & Science graduates.' },
  { icon: GraduationCap, title: 'Higher Education', text: 'Awareness of MBA, postgraduate programs, professional courses and other paths.' },
  { icon: Building2, title: 'Industry Expectations', text: 'What companies actually look for in fresh graduates today.' },
  { icon: Sparkles, title: 'Employability Skills', text: 'Communication, teamwork, leadership, problem-solving and digital skills.' },
  { icon: Route, title: 'Career Planning', text: 'Help identifying a career path that fits individual strengths and interests.' },
  { icon: Users2, title: 'Expert Guidance', text: 'Direct interaction with experienced industry and HR professionals.' },
]

export default function PurposeCards() {
  return (
    <section id="purpose" className="bg-white">
      <div className="section">
        <p className="eyebrow">Why This Program</p>
        <h2 className="mt-2 text-3xl font-bold text-navy-950 md:text-4xl">Six reasons to attend</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-950 text-sky-400">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-navy-950">{title}</h3>
              <p className="mt-1.5 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
