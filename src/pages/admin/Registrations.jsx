import { useEffect, useMemo, useState } from 'react'
import { watchAllStudents, deleteStudent } from '../../services/studentService'
import { exportStudentsToCSV } from '../../utils/exportCSV'
import StudentDetailModal from '../../components/StudentDetailModal'
import { Download, Search, ClipboardList, Phone, Mail, Trash2, Eye, AlertTriangle } from 'lucide-react'

export default function Registrations() {
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const unsub = watchAllStudents((list) => {
      setStudents(list)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return students
    return students.filter((s) =>
      `${s.name} ${s.registrationId} ${s.college} ${s.mobile} ${s.email} ${s.district}`.toLowerCase().includes(term)
    )
  }, [students, search])

  const today = students.filter((s) => {
    if (!s.registeredAt) return false
    const d = new Date(s.registeredAt)
    const now = new Date()
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
  }).length

  async function handleDeleteStudent(student) {
    if (!student) return
    setDeleting(true)
    try {
      await deleteStudent(student.id)
      setStudents((prev) => prev.filter((s) => s.id !== student.id))
      setPendingDelete(null)
      if (selectedStudent?.id === student.id) {
        setSelectedStudent(null)
      }
    } catch (err) {
      console.error('Failed to delete student:', err)
      alert('Failed to remove student. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Data Management</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">All Registrations</h1>
          <p className="mt-1 text-sm text-slate-500">
            Total <span className="font-semibold text-indigo-600">{students.length}</span> registrations
            {today > 0 && <> · <span className="font-semibold text-emerald-600">{today} today</span></>}
          </p>
        </div>
        <button
          onClick={() => exportStudentsToCSV(filtered)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition"
        >
          <Download size={15} /> Export {filtered.length} rows
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="pl-11"
          placeholder="Search by name, ID, college, mobile, email, district…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-6">
            {[...Array(6)].map((_, i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <ClipboardList size={36} className="text-slate-300" />
            <p className="text-sm text-slate-400">No registrations found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Reg ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">College</th>
                  <th className="px-4 py-3">Degree / Dept</th>
                  <th className="px-4 py-3">Year</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">District</th>
                  <th className="px-4 py-3">Career Interest</th>
                  <th className="px-4 py-3">Registered</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s, i) => {
                  const regDate = s.registeredAt ? new Date(s.registeredAt) : null
                  return (
                    <tr key={s.id} className="transition hover:bg-indigo-50/30">
                      <td className="px-4 py-3 text-xs text-slate-400">{i + 1}</td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-bold text-indigo-600">{s.registrationId}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                            {s.name?.[0] || '?'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{s.name}</p>
                            <p className="text-xs text-slate-400">{s.gender}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-[160px]">
                        <p className="truncate text-slate-600" title={s.college}>{s.college}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-700">{s.degree}</p>
                        <p className="text-xs text-slate-400">{s.department}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{s.year}</td>
                      <td className="px-4 py-3">
                        <div className="space-y-0.5 text-xs text-slate-500">
                          <div className="flex items-center gap-1"><Phone size={10} />{s.mobile}</div>
                          <div className="flex items-center gap-1"><Mail size={10} /><span className="truncate max-w-[120px]">{s.email}</span></div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{s.district}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-700">{s.careerInterest}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {regDate ? regDate.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {s.checkedIn
                          ? <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">✓ Present</span>
                          : <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">Pending</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedStudent(s)}
                            title="View student details"
                            className="rounded-lg p-1.5 text-indigo-600 hover:bg-indigo-50 transition"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => setPendingDelete(s)}
                            title="Remove student registration"
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

      {/* Student Details Modal */}
      <StudentDetailModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onDelete={(s) => {
          setSelectedStudent(null)
          setPendingDelete(s)
        }}
      />

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
              This will delete their registration record, QR code data, and check-in status permanently.
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
