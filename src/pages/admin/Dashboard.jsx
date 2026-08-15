import { useEffect, useState, useMemo } from 'react'
import { watchAllStudents, tsToDate } from '../../services/studentService'
import eventConfig from '../../config/eventConfig'
import { Users, CheckCircle2, XCircle, TrendingUp, PackageCheck, PackageX, Activity, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

function StatCard({ label, value, sub, icon: Icon, gradient, trend }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-lg ${gradient}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">{label}</p>
          <p className="mt-2 text-4xl font-bold">{value}</p>
          {sub && <p className="mt-1 text-xs text-white/70">{sub}</p>}
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
          <Icon size={20} />
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-4 flex items-center gap-1.5">
          <div className="h-1.5 flex-1 rounded-full bg-white/20">
            <div className="h-1.5 rounded-full bg-white/60" style={{ width: `${Math.min(trend, 100)}%` }} />
          </div>
          <span className="text-xs font-semibold text-white/80">{trend}%</span>
        </div>
      )}
    </div>
  )
}

function RecentRow({ student }) {
  const time = tsToDate(student.registeredAt)
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-slate-50">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${student.checkedIn ? 'bg-emerald-500' : 'bg-slate-300'}`}>
        {student.name?.[0] || '?'}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">{student.name}</p>
        <p className="truncate text-xs text-slate-400">{student.college}</p>
      </div>
      <div className="hidden sm:block text-right shrink-0">
        <p className="font-mono text-xs font-bold text-indigo-600">{student.registrationId}</p>
        <p className="text-xs text-slate-400">{time ? time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}</p>
      </div>
      <span className={`hidden xs:inline-flex shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${student.checkedIn ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
        {student.checkedIn ? '✓ In' : 'Pending'}
      </span>
    </div>
  )
}

export default function Dashboard() {
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
    const notCheckedIn = total - checkedIn
    const distributed = students.filter((s) => s.materialsDistributed).length
    const rate = total ? Math.round((checkedIn / total) * 100) : 0
    const matRate = total ? Math.round((distributed / total) * 100) : 0
    return { total, checkedIn, notCheckedIn, distributed, rate, matRate }
  }, [students])

  const recent = students.slice(0, 8)

  const careerBreakdown = useMemo(() => {
    const counts = {}
    students.forEach((s) => {
      if (s.careerInterest) counts[s.careerInterest] = (counts[s.careerInterest] || 0) + 1
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [students])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow flex items-center gap-2">
            <Activity size={12} className="text-emerald-500" />
            Live Overview
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">{eventConfig.eventName}</h1>
          <p className="mt-1 text-sm text-slate-500">Real-time data — refreshes every 4 seconds</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Live
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label="Total Registered" value={stats.total} sub={`Target: ${eventConfig.expectedParticipants}`} icon={Users} gradient="bg-gradient-to-br from-indigo-600 to-indigo-800" trend={Math.round((stats.total / eventConfig.expectedParticipants) * 100)} />
            <StatCard label="Checked In" value={stats.checkedIn} sub="Present at event" icon={CheckCircle2} gradient="bg-gradient-to-br from-emerald-500 to-emerald-700" trend={stats.rate} />
            <StatCard label="Not Checked In" value={stats.notCheckedIn} sub="Registered but absent" icon={XCircle} gradient="bg-gradient-to-br from-rose-500 to-rose-700" />
            <StatCard label="Attendance Rate" value={`${stats.rate}%`} sub="Of all registrations" icon={TrendingUp} gradient="bg-gradient-to-br from-sky-500 to-sky-700" trend={stats.rate} />
            <StatCard label="Materials Given" value={stats.distributed} sub="Kits distributed" icon={PackageCheck} gradient="bg-gradient-to-br from-violet-500 to-violet-700" trend={stats.matRate} />
            <StatCard label="Materials Pending" value={stats.total - stats.distributed} sub="Yet to receive kit" icon={PackageX} gradient="bg-gradient-to-br from-amber-500 to-amber-700" />
          </div>

          {/* Bottom Grid */}
          <div className="grid gap-6 lg:grid-cols-5 min-w-0">
            {/* Recent Registrations */}
            <div className="rounded-2xl border border-slate-200 bg-white lg:col-span-3">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <h2 className="font-semibold text-slate-800">Recent Registrations</h2>
                <Link to="/admin/registrations" className="text-xs font-semibold text-indigo-600 hover:underline">View all →</Link>
              </div>
              <div className="divide-y divide-slate-50 px-2 py-2">
                {recent.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-400">No registrations yet</p>
                ) : (
                  recent.map((s) => <RecentRow key={s.id} student={s} />)
                )}
              </div>
            </div>

            {/* Career Breakdown */}
            <div className="rounded-2xl border border-slate-200 bg-white lg:col-span-2">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="font-semibold text-slate-800">Career Interests</h2>
                <p className="text-xs text-slate-400">Top 5 interests</p>
              </div>
              <div className="space-y-3 p-5">
                {careerBreakdown.length === 0 ? (
                  <p className="text-center text-sm text-slate-400">No data yet</p>
                ) : (
                  careerBreakdown.map(([interest, count], i) => {
                    const pct = stats.total ? Math.round((count / stats.total) * 100) : 0
                    const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-sky-500', 'bg-violet-500', 'bg-amber-500']
                    return (
                      <div key={interest}>
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="truncate font-medium text-slate-700 max-w-[160px]">{interest}</span>
                          <span className="ml-2 shrink-0 font-bold text-slate-500">{count} ({pct}%)</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100">
                          <div className={`h-2 rounded-full transition-all ${colors[i % colors.length]}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Quick Actions */}
              <div className="border-t border-slate-100 p-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Quick Actions</p>
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/admin/attendees" className="flex items-center gap-2 rounded-xl bg-indigo-50 p-3 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition">
                    <Users size={14} /> Attendees
                  </Link>
                  <Link to="/check-in" className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition">
                    <CheckCircle2 size={14} /> Check-In
                  </Link>
                  <Link to="/admin/distribution" className="flex items-center gap-2 rounded-xl bg-violet-50 p-3 text-xs font-semibold text-violet-700 hover:bg-violet-100 transition">
                    <PackageCheck size={14} /> Materials
                  </Link>
                  <Link to="/admin/reports" className="flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition">
                    <TrendingUp size={14} /> Reports
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
