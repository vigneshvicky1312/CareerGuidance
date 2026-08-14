import { useEffect, useState, useMemo } from 'react'
import { watchAllStudents, updateMaterials } from '../../services/studentService'
import eventConfig from '../../config/eventConfig'
import { Search, PackageCheck, PackageX, Loader2 } from 'lucide-react'

export default function Distribution() {
  const [students, setStudents] = useState([])
  const [term, setTerm] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = watchAllStudents((list) => {
      setStudents(list)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const checkedInStudents = useMemo(() => students.filter((s) => s.checkedIn), [students])
  const filtered = useMemo(() => {
    const t = term.trim().toLowerCase()
    if (!t) return checkedInStudents
    return checkedInStudents.filter((s) =>
      `${s.name} ${s.registrationId}`.toLowerCase().includes(t)
    )
  }, [checkedInStudents, term])

  const completedCount = checkedInStudents.filter((s) => s.materialsDistributed).length

  async function toggle(student, key) {
    setBusyId(student.id)
    const materials = { ...student.materials, [key]: !student.materials?.[key] }
    const allChecked = eventConfig.materialsChecklist.every((m) => materials[m.key])
    try {
      await updateMaterials(student.id, materials, allChecked)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="eyebrow">Volunteer Tracking</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Materials Distribution</h1>
        <p className="mt-1 text-sm text-slate-500">Only checked-in students appear here.</p>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Checked In', value: checkedInStudents.length, color: 'bg-indigo-50 text-indigo-700' },
          { label: 'Kits Given', value: completedCount, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Pending', value: checkedInStudents.length - completedCount, color: 'bg-amber-50 text-amber-700' },
          { label: 'Items / Kit', value: eventConfig.materialsChecklist.length, color: 'bg-violet-50 text-violet-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-2xl p-4 ${color}`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="mt-0.5 text-xs font-semibold opacity-75">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input className="pl-9" placeholder="Search checked-in students…" value={term} onChange={(e) => setTerm(e.target.value)} />
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => <div key={i} className="h-48 animate-pulse rounded-2xl bg-slate-100" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 py-16 text-center">
          <PackageCheck size={36} className="text-slate-300" />
          <p className="text-sm text-slate-400">No checked-in students to show yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => {
            const checkedCount = eventConfig.materialsChecklist.filter((m) => s.materials?.[m.key]).length
            const total = eventConfig.materialsChecklist.length
            const pct = total ? Math.round((checkedCount / total) * 100) : 0
            const busy = busyId === s.id

            return (
              <div key={s.id} className={`rounded-2xl border bg-white p-5 shadow-sm transition ${s.materialsDistributed ? 'border-emerald-200' : 'border-slate-200'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                      {s.name?.[0] || '?'}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{s.name}</p>
                      <p className="font-mono text-xs text-slate-400">{s.registrationId}</p>
                    </div>
                  </div>
                  {busy
                    ? <Loader2 size={16} className="animate-spin text-slate-400 shrink-0" />
                    : s.materialsDistributed
                      ? <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700 shrink-0"><PackageCheck size={10} />Done</span>
                      : <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700 shrink-0"><PackageX size={10} />Pending</span>
                  }
                </div>

                {/* Progress */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-slate-100">
                    <div
                      className={`h-1.5 rounded-full transition-all ${pct === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{checkedCount}/{total}</span>
                </div>

                {/* Checklist */}
                <div className="mt-3 space-y-2">
                  {eventConfig.materialsChecklist.map((m) => (
                    <label key={m.key} className={`flex items-center gap-2.5 text-sm rounded-lg p-1.5 cursor-pointer transition hover:bg-slate-50 ${s.materials?.[m.key] ? 'text-slate-700' : 'text-slate-400'}`}>
                      <input
                        type="checkbox"
                        disabled={busy}
                        className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
                        checked={!!s.materials?.[m.key]}
                        onChange={() => toggle(s, m.key)}
                      />
                      <span className={s.materials?.[m.key] ? 'font-medium' : ''}>{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
