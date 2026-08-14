import { useEffect, useMemo, useState } from 'react'
import { watchAllStudents, confirmAttendance, undoAttendance, deleteStudent, tsToDate } from '../../services/studentService'
import colleges from '../../config/colleges'
import eventConfig from '../../config/eventConfig'
import StudentDetailModal from '../../components/StudentDetailModal'
import { Search, Filter, CheckCircle2, XCircle, Users, Download, Trash2, AlertTriangle } from 'lucide-react'
import { exportStudentsToCSV } from '../../utils/exportCSV'

function Badge({ checkedIn }) {
  return checkedIn
    ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700"><CheckCircle2 size={10} />Checked In</span>
    : <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500"><XCircle size={10} />Absent</span>
}

function MatBadge({ distributed }) {
  return distributed
    ? <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-bold text-violet-700">Distributed</span>
    : <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700">Pending</span>
}

export default function Attendees() {
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [checkinFilter, setCheckinFilter] = useState('All')
  const [collegeFilter, setCollegeFilter] = useState('All')
  const [departmentFilter, setDepartmentFilter] = useState('All')
  const [careerFilter, setCareerFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const [pendingConfirm, setPendingConfirm] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = watchAllStudents((list) => {
      setStudents(list)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const departments = useMemo(
    () => Array.from(new Set(students.map((s) => s.department).filter(Boolean))).sort(),
    [students]
  )

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return students.filter((s) => {
      if (term) {
        const hay = `${s.name} ${s.registrationId} ${s.college} ${s.mobile} ${s.email}`.toLowerCase()
        if (!hay.includes(term)) return false
      }
      if (checkinFilter === 'Checked In' && !s.checkedIn) return false
      if (checkinFilter === 'Not Checked In' && s.checkedIn) return false
      if (collegeFilter !== 'All' && s.college !== collegeFilter) return false
      if (departmentFilter !== 'All' && s.department !== departmentFilter) return false
      if (careerFilter !== 'All' && s.careerInterest !== careerFilter) return false
      return true
    })
  }, [students, searchTerm, checkinFilter, collegeFilter, departmentFilter, careerFilter])

  async function applyAttendanceChange(student, checkedIn) {
    if (checkedIn) await confirmAttendance(student.id)
    else await undoAttendance(student.id)
    setPendingConfirm(null)
    setSelected(null)
  }

  async function handleDeleteStudent(student) {
    if (!student) return
    setDeleting(true)
    try {
      await deleteStudent(student.id)
      setStudents((prev) => prev.filter((s) => s.id !== student.id))
      setPendingDelete(null)
      if (selected?.id === student.id) {
        setSelected(null)
      }
    } catch (err) {
      console.error('Failed to delete student:', err)
      alert('Failed to remove student. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  const checkedInCount = students.filter((s) => s.checkedIn).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Attendee Management</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Attendees</h1>
          <p className="mt-1 text-sm text-slate-500">
            <span className="font-semibold text-emerald-600">{checkedInCount}</span> checked in out of{' '}
            <span className="font-semibold">{students.length}</span> registered
          </p>
        </div>
        <button onClick={() => exportStudentsToCSV(filtered, 'attendees.csv')} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <Filter size={12} /> Filters
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="pl-9" placeholder="Search name, ID, college, mobile…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <select value={checkinFilter} onChange={(e) => setCheckinFilter(e.target.value)}>
            {['All', 'Checked In', 'Not Checked In'].map((o) => <option key={o}>{o}</option>)}
          </select>
          <select value={collegeFilter} onChange={(e) => setCollegeFilter(e.target.value)}>
            <option>All</option>
            {colleges.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={careerFilter} onChange={(e) => setCareerFilter(e.target.value)}>
            <option value="All">All Career Interests</option>
            {eventConfig.careerInterests.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of {students.length} registrations
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-6">
            {[...Array(5)].map((_, i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Users size={36} className="text-slate-300" />
            <p className="text-sm text-slate-400">No matching attendees found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3">Reg ID</th>
                  <th className="px-5 py-3">College</th>
                  <th className="px-5 py-3">Department</th>
                  <th className="px-5 py-3">Attendance</th>
                  <th className="px-5 py-3">Materials</th>
                  <th className="px-5 py-3">Check-In Time</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => {
                  const time = tsToDate(s.checkInTime)
                  return (
                    <tr key={s.id} className="transition hover:bg-indigo-50/40">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${s.checkedIn ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                            {s.name?.[0] || '?'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{s.name}</p>
                            <p className="text-xs text-slate-400">{s.year} • {s.gender}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs font-bold text-indigo-600">{s.registrationId}</td>
                      <td className="px-5 py-3 max-w-[180px]">
                        <p className="truncate text-slate-700" title={s.college}>{s.college}</p>
                      </td>
                      <td className="px-5 py-3 text-slate-600">{s.department}</td>
                      <td className="px-5 py-3"><Badge checkedIn={s.checkedIn} /></td>
                      <td className="px-5 py-3"><MatBadge distributed={s.materialsDistributed} /></td>
                      <td className="px-5 py-3 text-xs text-slate-500">
                        {time ? time.toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }) : '—'}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelected(s)}
                            className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 transition"
                          >
                            View
                          </button>
                          <button
                            onClick={() => setPendingDelete(s)}
                            title="Remove student"
                            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <StudentDetailModal
        student={selected}
        onClose={() => setSelected(null)}
        onMarkCheckedIn={(s) => setPendingConfirm({ student: s, next: true })}
        onUndoCheckIn={(s) => setPendingConfirm({ student: s, next: false })}
        onDelete={(s) => {
          setSelected(null)
          setPendingDelete(s)
        }}
      />

      {/* Attendance Confirm Modal */}
      {pendingConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${pendingConfirm.next ? 'bg-emerald-100' : 'bg-rose-100'}`}>
              {pendingConfirm.next ? <CheckCircle2 size={24} className="text-emerald-600" /> : <XCircle size={24} className="text-rose-600" />}
            </div>
            <h3 className="font-bold text-slate-900">{pendingConfirm.next ? 'Confirm Attendance' : 'Undo Check-In'}</h3>
            <p className="mt-2 text-sm text-slate-500">
              {pendingConfirm.next ? 'Mark' : 'Unmark'}{' '}
              <span className="font-mono font-semibold text-slate-700">{pendingConfirm.student.registrationId}</span> as{' '}
              {pendingConfirm.next ? 'checked in?' : 'not checked in?'}
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button onClick={() => setPendingConfirm(null)} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
              <button
                onClick={() => applyAttendanceChange(pendingConfirm.student, pendingConfirm.next)}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition ${pendingConfirm.next ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {pendingDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <AlertTriangle size={28} />
            </div>
            <h3 className="text-center text-lg font-bold text-slate-900">Remove Student Registration?</h3>
            <p className="mt-2 text-center text-sm text-slate-600">
              Are you sure you want to remove <span className="font-semibold text-slate-900">{pendingDelete.name}</span> (
              <span className="font-mono font-semibold text-indigo-600">{pendingDelete.registrationId}</span>)?
            </p>
            <p className="mt-1 text-center text-xs text-rose-500">
              This will delete their registration record, QR code data, and attendance status permanently.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setPendingDelete(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => handleDeleteStudent(pendingDelete)}
                className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-rose-700 transition disabled:opacity-50"
              >
                <Trash2 size={15} />
                {deleting ? 'Removing…' : 'Yes, Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
