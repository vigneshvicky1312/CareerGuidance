import { tsToDate } from '../services/studentService'
import { Eye } from 'lucide-react'

export default function StudentTable({ students, onSelect }) {
  if (students.length === 0) {
    return <p className="py-10 text-center text-sm text-slate-400">No matching registrations.</p>
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="w-full min-w-[840px] text-left text-sm">
        <thead className="bg-navy-950 text-xs uppercase tracking-wide text-slate-300">
          <tr>
            <th className="px-4 py-3">Registration ID</th>
            <th className="px-4 py-3">Student</th>
            <th className="px-4 py-3">College</th>
            <th className="px-4 py-3">Department</th>
            <th className="px-4 py-3">Check-In Status</th>
            <th className="px-4 py-3">Check-In Time</th>
            <th className="px-4 py-3">Materials</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {students.map((s) => {
            const time = tsToDate(s.checkInTime)
            return (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-navy-800">{s.registrationId}</td>
                <td className="px-4 py-3 font-medium text-navy-950">{s.name}</td>
                <td className="px-4 py-3 text-slate-600">{s.college}</td>
                <td className="px-4 py-3 text-slate-600">{s.department}</td>
                <td className="px-4 py-3">
                  {s.checkedIn ? (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">✅ Checked In</span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">Not Checked In</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500">{time ? time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                <td className="px-4 py-3">
                  {s.materialsDistributed ? (
                    <span className="text-xs font-medium text-emerald-700">Distributed</span>
                  ) : (
                    <span className="text-xs font-medium text-gold-500">Pending</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => onSelect(s)} className="flex items-center gap-1 text-xs font-semibold text-navy-700 hover:text-sky-600">
                    <Eye size={14} /> View
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
