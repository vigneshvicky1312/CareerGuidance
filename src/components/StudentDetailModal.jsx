import { X, Trash2 } from 'lucide-react'
import { tsToDate } from '../services/studentService'

export default function StudentDetailModal({ student, onClose, onMarkCheckedIn, onUndoCheckIn, onDelete }) {
  if (!student) return null
  const regTime = tsToDate(student.registeredAt)
  const checkTime = tsToDate(student.checkInTime)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Student Details</h3>
            <p className="text-xs font-mono font-semibold text-indigo-600">{student.registrationId}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition">
            <X size={20} />
          </button>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          {[
            ['Name', student.name],
            ['Gender', student.gender],
            ['College', student.college],
            ['Degree', student.degree],
            ['Department', student.department],
            ['Year', student.year],
            ['Mobile', student.mobile],
            ['Email', student.email],
            ['District', student.district],
            ['Career Interest', student.careerInterest],
            ['Food Preference', student.foodPreference],
            ['Registered', regTime ? regTime.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'],
          ].map(([label, value]) => (
            <div key={label} className="col-span-1">
              <dt className="text-xs uppercase tracking-wide text-slate-400">{label}</dt>
              <dd className="font-medium text-slate-800">{value || '—'}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 text-sm border border-slate-100">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">Attendance</dt>
            <dd className="font-semibold text-slate-800">{student.checkedIn ? 'Checked In' : 'Not Checked In'}</dd>
            {checkTime && <dd className="text-xs text-slate-500">{checkTime.toLocaleString('en-IN')}</dd>}
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">Materials</dt>
            <dd className="font-semibold text-slate-800">{student.materialsDistributed ? 'Distributed' : 'Pending'}</dd>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap gap-2">
            {!student.checkedIn && onMarkCheckedIn && (
              <button
                onClick={() => onMarkCheckedIn(student)}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-700 transition"
              >
                Mark Checked In
              </button>
            )}
            {student.checkedIn && onUndoCheckIn && (
              <button
                onClick={() => onUndoCheckIn(student)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Undo Check-In
              </button>
            )}
          </div>

          {onDelete && (
            <button
              onClick={() => onDelete(student)}
              className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition"
            >
              <Trash2 size={14} /> Remove Student
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
