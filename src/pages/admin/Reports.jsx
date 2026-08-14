import { useEffect, useMemo, useState } from 'react'
import { watchAllStudents } from '../../services/studentService'
import { exportStudentsToCSV } from '../../utils/exportCSV'
import eventConfig from '../../config/eventConfig'
import { Download, TrendingUp, Users, BarChart2, PieChart } from 'lucide-react'

function MiniBar({ label, value, max, color = 'bg-indigo-500' }) {
  const pct = max ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-36 shrink-0 truncate text-xs text-slate-600">{label}</span>
      <div className="h-2 flex-1 rounded-full bg-slate-100">
        <div className={`h-2 rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 shrink-0 text-right text-xs font-bold text-slate-500">{value}</span>
      <span className="w-10 shrink-0 text-right text-xs text-slate-400">{pct}%</span>
    </div>
  )
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700">
        <Icon size={16} className="text-indigo-500" />
        {title}
      </div>
      {children}
    </div>
  )
}

export default function Reports() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = watchAllStudents((list) => {
      setStudents(list)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const stats = useMemo(() => {
    const total = students.length
    const checkedIn = students.filter((s) => s.checkedIn).length
    const distributed = students.filter((s) => s.materialsDistributed).length
    const male = students.filter((s) => s.gender === 'Male').length
    const female = students.filter((s) => s.gender === 'Female').length
    const finalYear = students.filter((s) => s.year === 'Final Year').length
    const preYear = students.filter((s) => s.year === 'Pre-Final Year').length
    const veg = students.filter((s) => s.foodPreference === 'Vegetarian').length
    const nonVeg = students.filter((s) => s.foodPreference === 'Non-Vegetarian').length

    const byCareer = {}
    students.forEach((s) => { if (s.careerInterest) byCareer[s.careerInterest] = (byCareer[s.careerInterest] || 0) + 1 })

    const byCollege = {}
    students.forEach((s) => { if (s.college) byCollege[s.college] = (byCollege[s.college] || 0) + 1 })

    const byDept = {}
    students.forEach((s) => { if (s.department) byDept[s.department] = (byDept[s.department] || 0) + 1 })

    const byDistrict = {}
    students.forEach((s) => { if (s.district) byDistrict[s.district] = (byDistrict[s.district] || 0) + 1 })

    return {
      total, checkedIn, distributed, male, female, finalYear, preYear, veg, nonVeg,
      byCareer: Object.entries(byCareer).sort((a, b) => b[1] - a[1]),
      byCollege: Object.entries(byCollege).sort((a, b) => b[1] - a[1]).slice(0, 10),
      byDept: Object.entries(byDept).sort((a, b) => b[1] - a[1]).slice(0, 10),
      byDistrict: Object.entries(byDistrict).sort((a, b) => b[1] - a[1]).slice(0, 8),
    }
  }, [students])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-48 animate-pulse rounded-2xl bg-slate-100" />)}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Analytics</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Reports</h1>
          <p className="mt-1 text-sm text-slate-500">Full breakdown of {stats.total} registrations</p>
        </div>
        <button
          onClick={() => exportStudentsToCSV(students)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition"
        >
          <Download size={15} /> Export All Data
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Registered', value: stats.total, bg: 'bg-gradient-to-br from-indigo-500 to-indigo-700' },
          { label: 'Attended', value: stats.checkedIn, bg: 'bg-gradient-to-br from-emerald-500 to-emerald-700' },
          { label: 'Kits Given', value: stats.distributed, bg: 'bg-gradient-to-br from-violet-500 to-violet-700' },
          { label: 'Absent', value: stats.total - stats.checkedIn, bg: 'bg-gradient-to-br from-rose-500 to-rose-700' },
        ].map(({ label, value, bg }) => (
          <div key={label} className={`rounded-2xl p-4 text-white shadow ${bg}`}>
            <p className="text-3xl font-bold">{value}</p>
            <p className="mt-1 text-xs font-semibold text-white/70">{label}</p>
          </div>
        ))}
      </div>

      {/* Two-column grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Career Interests */}
        <Section title="By Career Interest" icon={TrendingUp}>
          <div className="space-y-3">
            {stats.byCareer.map(([k, v]) => <MiniBar key={k} label={k} value={v} max={stats.total} color="bg-indigo-500" />)}
          </div>
        </Section>

        {/* Gender & Year */}
        <Section title="Demographics" icon={PieChart}>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Gender</p>
              <div className="space-y-2">
                <MiniBar label="Male" value={stats.male} max={stats.total} color="bg-sky-500" />
                <MiniBar label="Female" value={stats.female} max={stats.total} color="bg-pink-500" />
                {stats.total - stats.male - stats.female > 0 && (
                  <MiniBar label="Other" value={stats.total - stats.male - stats.female} max={stats.total} color="bg-violet-400" />
                )}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Year of Study</p>
              <div className="space-y-2">
                <MiniBar label="Final Year" value={stats.finalYear} max={stats.total} color="bg-amber-500" />
                <MiniBar label="Pre-Final Year" value={stats.preYear} max={stats.total} color="bg-orange-400" />
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Food Preference</p>
              <div className="space-y-2">
                <MiniBar label="Vegetarian" value={stats.veg} max={stats.total} color="bg-emerald-500" />
                <MiniBar label="Non-Vegetarian" value={stats.nonVeg} max={stats.total} color="bg-red-500" />
              </div>
            </div>
          </div>
        </Section>

        {/* Top Colleges */}
        <Section title="Top Colleges by Registrations" icon={Users}>
          <div className="space-y-3">
            {stats.byCollege.map(([k, v]) => <MiniBar key={k} label={k} value={v} max={stats.total} color="bg-emerald-500" />)}
          </div>
        </Section>

        {/* Dept & District */}
        <div className="space-y-6">
          <Section title="Top Departments" icon={BarChart2}>
            <div className="space-y-3">
              {stats.byDept.map(([k, v]) => <MiniBar key={k} label={k} value={v} max={stats.total} color="bg-violet-500" />)}
            </div>
          </Section>
          <Section title="Top Districts" icon={BarChart2}>
            <div className="space-y-3">
              {stats.byDistrict.map(([k, v]) => <MiniBar key={k} label={k} value={v} max={stats.total} color="bg-amber-500" />)}
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}
