import colleges from '../config/colleges'
import { School2 } from 'lucide-react'

export default function ParticipatingColleges() {
  return (
    <section className="bg-white">
      <div className="section">
        <p className="eyebrow">Participating Institutions</p>
        <h2 className="mt-2 text-3xl font-bold text-navy-950 md:text-4xl">Colleges joining us</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {colleges.map((c) => (
            <div key={c} className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
              <School2 size={16} className="shrink-0 text-navy-600" />
              {c}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
