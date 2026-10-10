import { useEffect, useMemo, useState } from 'react'
import {
  watchAllStudents,
  confirmAttendance,
  undoAttendance,
  updateMaterials,
  tsToDate,
} from '../../services/studentService'
import { exportCollegeAttendanceCSV, exportCollegeSummaryCSV } from '../../utils/exportCSV'
import colleges from '../../config/colleges'
import eventConfig from '../../config/eventConfig'
import StudentDetailModal from '../../components/StudentDetailModal'
import {
  Building2,
  Users,
  CheckCircle2,
  XCircle,
  Search,
  Download,
  Printer,
  Copy,
  Check,
  Filter,
  ArrowUpDown,
  PackageCheck,
  AlertCircle,
  Sparkles,
  Phone,
  Eye,
  UserCheck,
  Share2,
  GraduationCap,
  FileSpreadsheet,
} from 'lucide-react'

function formatTime(ts) {
  const date = tsToDate(ts)
  if (!date) return '—'
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export default function CollegeAttendance() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCollege, setSelectedCollege] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('All')
  const [kitFilter, setKitFilter] = useState('All')
  const [collegeSort, setCollegeSort] = useState('present_desc') // 'present_desc' | 'name_asc' | 'rate_desc'
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [spotSearch, setSpotSearch] = useState('')
  const [spotActionId, setSpotActionId] = useState(null)
  const [toastMessage, setToastMessage] = useState('')
  const [showPrintView, setShowPrintView] = useState(false)

  // Real-time synchronization
  useEffect(() => {
    const unsub = watchAllStudents((list) => {
      setStudents(list)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (!toastMessage) return
    const t = setTimeout(() => setToastMessage(''), 3000)
    return () => clearTimeout(t)
  }, [toastMessage])

  // All distinct colleges (combining config + database)
  const allCollegesList = useMemo(() => {
    const fromData = students.map((s) => s.college).filter(Boolean)
    return Array.from(new Set([...colleges, ...fromData])).sort()
  }, [students])

  // College-wise aggregation statistics
  const collegeStats = useMemo(() => {
    const map = new Map()

    allCollegesList.forEach((c) => {
      map.set(c, {
        name: c,
        registered: 0,
        present: 0,
        absent: 0,
        rate: 0,
        distributed: 0,
        presentStudents: [],
      })
    })

    students.forEach((s) => {
      const colName = s.college?.trim() || 'Other / Not Specified'
      if (!map.has(colName)) {
        map.set(colName, {
          name: colName,
          registered: 0,
          present: 0,
          absent: 0,
          rate: 0,
          distributed: 0,
          presentStudents: [],
        })
      }
      const entry = map.get(colName)
      entry.registered += 1
      if (s.checkedIn) {
        entry.present += 1
        entry.presentStudents.push(s)
        if (s.materialsDistributed) entry.distributed += 1
      } else {
        entry.absent += 1
      }
    })

    // Compute rates & return array
    const result = Array.from(map.values())
      .filter((c) => c.registered > 0)
      .map((c) => ({
        ...c,
        rate: c.registered ? Math.round((c.present / c.registered) * 100) : 0,
      }))

    if (collegeSort === 'present_desc') {
      result.sort((a, b) => b.present - a.present || b.registered - a.registered)
    } else if (collegeSort === 'rate_desc') {
      result.sort((a, b) => b.rate - a.rate || b.present - a.present)
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  }, [allCollegesList, students, collegeSort])

  // Overall event metrics
  const overall = useMemo(() => {
    const totalRegistered = students.length
    const presentStudents = students.filter((s) => s.checkedIn)
    const totalPresent = presentStudents.length
    const turnoutRate = totalRegistered ? Math.round((totalPresent / totalRegistered) * 100) : 0
    const collegesWithAttendance = collegeStats.filter((c) => c.present > 0).length
    const totalKits = presentStudents.filter((s) => s.materialsDistributed).length

    const topCollege = [...collegeStats].sort((a, b) => b.present - a.present)[0] || null

    return {
      totalRegistered,
      totalPresent,
      turnoutRate,
      collegesWithAttendance,
      totalKits,
      topCollege,
    }
  }, [students, collegeStats])

  // Departments for current selection
  const departments = useMemo(() => {
    const pool =
      selectedCollege === 'All'
        ? students.filter((s) => s.checkedIn)
        : students.filter((s) => s.checkedIn && s.college === selectedCollege)
    return Array.from(new Set(pool.map((s) => s.department).filter(Boolean))).sort()
  }, [students, selectedCollege])

  // Filtered present students for table view
  const filteredPresentStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return students.filter((s) => {
      // Must be present
      if (!s.checkedIn) return false

      // College filter
      if (selectedCollege !== 'All' && s.college !== selectedCollege) return false

      // Department filter
      if (departmentFilter !== 'All' && s.department !== departmentFilter) return false

      // Kit filter
      if (kitFilter === 'Distributed' && !s.materialsDistributed) return false
      if (kitFilter === 'Pending' && s.materialsDistributed) return false

      // Search term
      if (q) {
        const hay = `${s.name} ${s.registrationId} ${s.college} ${s.mobile} ${s.email} ${s.department}`.toLowerCase()
        if (!hay.includes(q)) return false
      }

      return true
    })
  }, [students, selectedCollege, departmentFilter, kitFilter, searchQuery])

  // Spot attendance search results (only for students NOT checked in yet)
  const spotSearchResults = useMemo(() => {
    const q = spotSearch.trim().toLowerCase()
    if (!q || q.length < 2) return []

    return students
      .filter((s) => {
        if (s.checkedIn) return false
        const hay = `${s.name} ${s.registrationId} ${s.mobile} ${s.college}`.toLowerCase()
        return hay.includes(q)
      })
      .slice(0, 5)
  }, [students, spotSearch])

  // Handle Mark Present from spot search
  async function handleSpotMarkPresent(student) {
    if (!student) return
    setSpotActionId(student.id)
    try {
      await confirmAttendance(student.id)
      setToastMessage(`✓ Marked ${student.name} (${student.college || 'College'}) as Present!`)
      setSpotSearch('')
    } catch (err) {
      console.error(err)
      alert('Failed to mark attendance. Please check network.')
    } finally {
      setSpotActionId(null)
    }
  }

  // Handle Undo Attendance
  async function handleUndoAttendance(student) {
    if (!confirm(`Undo attendance for ${student.name}? They will be marked Absent.`)) return
    try {
      await undoAttendance(student.id)
      setToastMessage(`Attendance undone for ${student.name}.`)
      if (selectedStudent?.id === student.id) setSelectedStudent(null)
    } catch (err) {
      console.error(err)
      alert('Failed to undo attendance.')
    }
  }

  // Handle Toggle Kit
  async function handleToggleKit(student) {
    const nextState = !student.materialsDistributed
    try {
      await updateMaterials(student.id, student.materials || {}, nextState)
      setToastMessage(nextState ? `Kit marked Distributed for ${student.name}` : `Kit reverted to Pending`)
    } catch (err) {
      console.error(err)
      alert('Failed to update materials.')
    }
  }

  // Export current list to CSV
  function handleExportCurrentList() {
    const filename =
      selectedCollege === 'All'
        ? `All_Present_Students_${new Date().toISOString().slice(0, 10)}.csv`
        : `Attendance_${selectedCollege.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30)}_${new Date().toISOString().slice(0, 10)}.csv`

    exportCollegeAttendanceCSV(filteredPresentStudents, selectedCollege, filename)
  }

  // Export college summary table
  function handleExportSummary() {
    exportCollegeSummaryCSV(collegeStats)
  }

  // Copy WhatsApp attendance summary
  function handleCopyWhatsAppSummary(college) {
    const target = college || collegeStats.find((c) => c.name === selectedCollege)

    let text = ''
    if (target) {
      text =
        `🎓 *${eventConfig.eventName} (${eventConfig.eventId})*\n` +
        `🏛️ *${eventConfig.organizer}*\n` +
        `📍 Venue: ${eventConfig.venue}\n` +
        `📅 Date: ${eventConfig.date}\n\n` +
        `📊 *ATTENDANCE REPORT - ${target.name.toUpperCase()}*\n` +
        `✅ Present: *${target.present} Students*\n` +
        `📝 Registered: ${target.registered} Students\n` +
        `📈 Attendance Rate: *${target.rate}%*\n` +
        `📦 Kits Handed Out: ${target.distributed}\n\n` +
        `Verified by ${eventConfig.facultyCoordinator}`
    } else {
      text =
        `🎓 *${eventConfig.eventName} (${eventConfig.eventId})*\n` +
        `🏛️ *${eventConfig.organizer}*\n` +
        `📅 Date: ${eventConfig.date}\n\n` +
        `📊 *OVERALL EVENT ATTENDANCE SUMMARY*\n` +
        `✅ Total Present: *${overall.totalPresent} Students*\n` +
        `📝 Total Registered: ${overall.totalRegistered} Students\n` +
        `📈 Overall Turnout: *${overall.turnoutRate}%*\n` +
        `🏫 Active Colleges Represented: *${overall.collegesPresentCount} Colleges*\n` +
        `📦 Kits Distributed: ${overall.totalKits}\n\n` +
        `Top Attending College: ${overall.topCollege?.name} (${overall.topCollege?.present} present)`
    }

    navigator.clipboard.writeText(text).then(() => {
      setToastMessage('✓ Formatted summary copied to clipboard for WhatsApp!')
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center py-20 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">Loading College Attendance Data…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl border border-slate-700 animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Title & Top Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-700 mb-2">
            <Building2 size={13} />
            College-Wise Attendance Register
          </div>
          <h1 className="text-2xl font-bold text-navy-950 sm:text-3xl">Present Students by College</h1>
          <p className="text-sm text-slate-600">
            Real-time verified attendees at the venue, organized college-by-college for instant export and sharing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => handleCopyWhatsAppSummary(null)}
            className="btn-outline !py-2 !px-3.5 text-xs font-semibold flex items-center gap-2 hover:bg-slate-100"
            title="Copy overall summary to paste into WhatsApp"
          >
            <Share2 size={14} className="text-emerald-600" />
            <span>Copy WhatsApp Summary</span>
          </button>

          <button
            onClick={handleExportSummary}
            className="btn-outline !py-2 !px-3.5 text-xs font-semibold flex items-center gap-2 hover:bg-slate-100"
            title="Export college vs attendance count comparison table"
          >
            <FileSpreadsheet size={14} className="text-indigo-600" />
            <span>Export College Summary CSV</span>
          </button>

          <button
            onClick={handleExportCurrentList}
            className="btn-primary !py-2 !px-4 text-xs font-semibold flex items-center gap-2 shadow-sm"
          >
            <Download size={14} />
            <span>
              {selectedCollege === 'All'
                ? `Export All Present (${filteredPresentStudents.length})`
                : `Export ${selectedCollege.slice(0, 22)}… (${filteredPresentStudents.length})`}
            </span>
          </button>

          <button
            onClick={() => window.print()}
            className="btn-outline !py-2 !px-3.5 text-xs font-semibold flex items-center gap-2"
            title="Print or Save as PDF"
          >
            <Printer size={14} className="text-slate-600" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      {/* Executive Key Metric Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Total Present</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-950">
            {overall.totalPresent}
            <span className="text-xs font-medium text-emerald-700 ml-1.5">
              / {overall.totalRegistered} reg
            </span>
          </div>
          <div className="mt-1 text-xs text-emerald-800 font-semibold">
            {overall.turnoutRate}% overall turnout
          </div>
        </div>

        <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/50 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-800">Colleges Present</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
              <Building2 size={18} />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-indigo-950">
            {overall.collegesPresentCount}
            <span className="text-xs font-medium text-indigo-700 ml-1.5">colleges</span>
          </div>
          <div className="mt-1 text-xs text-indigo-700">
            Active institutions at the venue
          </div>
        </div>

        <div className="rounded-2xl border border-sky-200/80 bg-sky-50/50 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-800">Top College Turnout</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
              <GraduationCap size={18} />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-extrabold text-sky-950 truncate" title={overall.topCollege?.name}>
            {overall.topCollege ? `${overall.topCollege.present} students` : '—'}
          </div>
          <div className="mt-1 text-xs text-sky-700 truncate font-medium" title={overall.topCollege?.name}>
            {overall.topCollege ? overall.topCollege.name : 'No check-ins yet'}
          </div>
        </div>

        <div className="rounded-2xl border border-violet-200/80 bg-violet-50/50 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-800">Kits Distributed</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
              <PackageCheck size={18} />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-violet-950">
            {overall.totalKits}
            <span className="text-xs font-medium text-violet-700 ml-1.5">
              ({overall.totalPresent ? Math.round((overall.totalKits / overall.totalPresent) * 100) : 0}%)
            </span>
          </div>
          <div className="mt-1 text-xs text-violet-700">
            Kits handed to present students
          </div>
        </div>
      </div>

      {/* Spot Desk Attendance Collector */}
      <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/90 to-sky-50/80 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 text-white rounded-lg shadow-sm">
              <UserCheck size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-navy-950">
                Desk Spot Attendance: Quick-Mark Student Present
              </h2>
              <p className="text-xs text-slate-600">
                Type name, registration ID, or mobile number to immediately mark an arriving student present.
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            value={spotSearch}
            onChange={(e) => setSpotSearch(e.target.value)}
            placeholder="Search student by Name, Mobile (e.g. 9876543210), or Reg ID (e.g. CGP2026-0012)…"
            className="w-full rounded-xl border border-indigo-300 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          {spotSearch && (
            <button
              onClick={() => setSpotSearch('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Spot Search Results Dropdown / Card Strip */}
        {spotSearchResults.length > 0 && (
          <div className="mt-3 divide-y divide-indigo-100 rounded-xl border border-indigo-200 bg-white shadow-lg overflow-hidden animate-fadeIn">
            {spotSearchResults.map((s) => (
              <div
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-3 p-3 hover:bg-indigo-50/50 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">{s.name}</span>
                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {s.registrationId}
                    </span>
                    <span className="text-xs text-slate-500">({s.department || s.degree})</span>
                  </div>
                  <div className="text-xs text-slate-600 truncate mt-0.5">
                    <strong>{s.college}</strong> • 📱 {s.mobile}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={spotActionId === s.id}
                    onClick={() => handleSpotMarkPresent(s)}
                    className="btn-primary !py-1.5 !px-3 text-xs font-bold flex items-center gap-1.5 shadow-sm bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle2 size={13} />
                    <span>{spotActionId === s.id ? 'Marking…' : 'Mark Present Now'}</span>
                  </button>
                  <button
                    onClick={() => setSelectedStudent(s)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    title="View details"
                  >
                    <Eye size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {spotSearch.trim().length >= 2 && spotSearchResults.length === 0 && (
          <div className="mt-2 text-xs text-slate-500 italic px-1">
            No unconfirmed attendees matching "{spotSearch}". They may already be marked present, or check the spelling.
          </div>
        )}
      </div>

      {/* College Breakdown Cards Carousel / Grid */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-indigo-600" />
            <h2 className="font-bold text-slate-900 text-base">Select College to View / Export</h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Sort by:</span>
            <select
              value={collegeSort}
              onChange={(e) => setCollegeSort(e.target.value)}
              className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-700 font-medium focus:outline-none"
            >
              <option value="present_desc">Highest Attendance First</option>
              <option value="rate_desc">Highest Turnout % First</option>
              <option value="name_asc">College Name (A–Z)</option>
            </select>
          </div>
        </div>

        {/* All Colleges quick button */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCollege('All')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-2 border ${
              selectedCollege === 'All'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <span>All Colleges Combined</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] ${
                selectedCollege === 'All' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {overall.totalPresent} Present
            </span>
          </button>
        </div>

        {/* College Badges Grid */}
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 max-h-64 overflow-y-auto pr-1">
          {collegeStats.map((c) => {
            const isSelected = selectedCollege === c.name
            return (
              <div
                key={c.name}
                onClick={() => setSelectedCollege(c.name)}
                className={`group cursor-pointer rounded-xl border p-3 transition text-left relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-slate-50/60 hover:border-indigo-300 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-xs text-slate-900 line-clamp-2" title={c.name}>
                    {c.name}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      c.present > 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {c.present} / {c.registered}
                  </span>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5 flex-1 mr-2">
                    <div className="h-1.5 flex-1 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${c.rate}%` }}
                      />
                    </div>
                    <span className="font-semibold text-slate-700 shrink-0">{c.rate}%</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopyWhatsAppSummary(c)
                      }}
                      className="p-1 text-slate-400 hover:text-emerald-600 rounded transition"
                      title="Copy WhatsApp text for this college"
                    >
                      <Copy size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        exportCollegeAttendanceCSV(c.presentStudents, c.name)
                      }}
                      disabled={c.present === 0}
                      className="p-1 text-slate-400 hover:text-indigo-600 rounded transition disabled:opacity-30"
                      title="Download CSV for this college"
                    >
                      <Download size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Student Attendance Table Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        {/* Table Controls / Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {selectedCollege === 'All'
                ? 'All Verified Present Students'
                : `Present Students: ${selectedCollege}`}
            </h2>
            <p className="text-xs text-slate-500">
              Showing {filteredPresentStudents.length} attendee
              {filteredPresentStudents.length !== 1 ? 's' : ''}
              {selectedCollege !== 'All' ? ` from ${selectedCollege}` : ''}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative min-w-[200px] max-w-xs">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search attendee by name, reg ID, mobile…"
                className="w-full rounded-xl border border-slate-200 py-1.5 pl-8 pr-3 text-xs focus:border-indigo-600 focus:outline-none"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400">
                <Search size={13} />
              </div>
            </div>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Kit Filter */}
            <select
              value={kitFilter}
              onChange={(e) => setKitFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
            >
              <option value="All">All Kit Status</option>
              <option value="Distributed">Kit Distributed</option>
              <option value="Pending">Kit Pending</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-3.5 py-3 text-center">#</th>
                <th className="px-3.5 py-3">Reg ID</th>
                <th className="px-3.5 py-3">Student Name</th>
                {selectedCollege === 'All' && <th className="px-3.5 py-3">College</th>}
                <th className="px-3.5 py-3">Degree & Department</th>
                <th className="px-3.5 py-3">Contact</th>
                <th className="px-3.5 py-3">Check-In Time</th>
                <th className="px-3.5 py-3">Kit Status</th>
                <th className="px-3.5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
              {filteredPresentStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan={selectedCollege === 'All' ? 9 : 8}
                    className="py-12 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users size={32} className="text-slate-300" />
                      <p className="font-semibold text-slate-600 text-sm">
                        No present students found matching current filters
                      </p>
                      <p className="text-xs text-slate-400">
                        {selectedCollege !== 'All'
                          ? `No checked-in attendees recorded yet for ${selectedCollege}.`
                          : 'Try resetting the search or filter options.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPresentStudents.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-indigo-50/40 transition">
                    <td className="px-3.5 py-3 text-center font-mono text-slate-400">{idx + 1}</td>

                    <td className="px-3.5 py-3 font-mono font-bold text-indigo-700 whitespace-nowrap">
                      <span className="rounded bg-indigo-50 px-2 py-0.5 border border-indigo-200">
                        {s.registrationId}
                      </span>
                    </td>

                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {s.gender || '—'} {s.year ? `• ${s.year}` : ''}
                      </div>
                    </td>

                    {selectedCollege === 'All' && (
                      <td className="px-3.5 py-3 max-w-[220px]">
                        <span className="font-semibold text-slate-800 line-clamp-2" title={s.college}>
                          {s.college}
                        </span>
                      </td>
                    )}

                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <div className="font-medium text-slate-800">{s.degree}</div>
                      <div className="text-[11px] text-slate-500">{s.department}</div>
                    </td>

                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <div className="font-mono text-slate-800 font-medium">
                        <a href={`tel:${s.mobile}`} className="hover:text-indigo-600">
                          {s.mobile}
                        </a>
                      </div>
                      {s.email && <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{s.email}</div>}
                    </td>

                    <td className="px-3.5 py-3 whitespace-nowrap font-mono text-slate-600 text-[11px]">
                      {formatTime(s.checkInTime)}
                    </td>

                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleKit(s)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition ${
                          s.materialsDistributed
                            ? 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        }`}
                        title="Click to toggle kit distributed status"
                      >
                        {s.materialsDistributed ? '✓ Kit Distributed' : 'Pending'}
                      </button>
                    </td>

                    <td className="px-3.5 py-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedStudent(s)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition"
                          title="View Pass & Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUndoAttendance(s)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                          title="Undo Attendance (Mark Absent)"
                        >
                          <XCircle size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Total Present Displayed: <strong>{filteredPresentStudents.length}</strong>
          </span>
          <div className="flex items-center gap-4">
            <span>
              Kits Distributed:{' '}
              <strong className="text-violet-700">
                {filteredPresentStudents.filter((s) => s.materialsDistributed).length}
              </strong>
            </span>
            <span>
              Pending Kits:{' '}
              <strong className="text-amber-700">
                {filteredPresentStudents.filter((s) => !s.materialsDistributed).length}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Printable Sheet (Visible during window.print()) */}
      <div className="hidden print:block print:p-8 bg-white text-black">
        <div className="border-b-2 border-black pb-4 mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight uppercase">
            {eventConfig.universityName || 'Alagappa University'}
          </h1>
          <h2 className="text-lg font-bold text-slate-800">
            {eventConfig.collegeName || 'Alagappa Institute of Management'}
          </h2>
          <h3 className="text-base font-semibold mt-1">
            {eventConfig.eventName} ({eventConfig.eventId}) — Official Attendance Register
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Date: {eventConfig.date} | Venue: {eventConfig.venue}
          </p>
          <div className="mt-3 text-sm font-bold bg-slate-100 py-1.5 border border-slate-300">
            {selectedCollege === 'All'
              ? 'COLLEGE-WISE ATTENDANCE LIST (ALL COLLEGES)'
              : `COLLEGE ATTENDANCE REGISTER: ${selectedCollege.toUpperCase()}`}
          </div>
        </div>

        <table className="w-full text-xs border-collapse border border-black mb-8">
          <thead>
            <tr className="bg-slate-100 text-black font-bold">
              <th className="border border-black p-2 text-center w-10">S.No</th>
              <th className="border border-black p-2 text-left">Reg ID</th>
              <th className="border border-black p-2 text-left">Student Name</th>
              <th className="border border-black p-2 text-left">Degree & Department</th>
              <th className="border border-black p-2 text-left">Mobile</th>
              <th className="border border-black p-2 text-center">Check-In</th>
              <th className="border border-black p-2 text-center w-28">Signature</th>
            </tr>
          </thead>
          <tbody>
            {filteredPresentStudents.map((s, idx) => (
              <tr key={s.id}>
                <td className="border border-black p-2 text-center">{idx + 1}</td>
                <td className="border border-black p-2 font-mono">{s.registrationId}</td>
                <td className="border border-black p-2 font-bold">{s.name}</td>
                <td className="border border-black p-2">
                  {s.degree} - {s.department}
                </td>
                <td className="border border-black p-2 font-mono">{s.mobile}</td>
                <td className="border border-black p-2 text-center">{formatTime(s.checkInTime)}</td>
                <td className="border border-black p-2"></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-16 flex justify-between pt-8 text-xs font-semibold">
          <div className="text-center">
            <div className="w-48 border-t border-black pt-1 mb-1" />
            <p>Faculty In-Charge / Coordinator</p>
            <p className="text-[10px] text-slate-600">({selectedCollege})</p>
          </div>

          <div className="text-center">
            <div className="w-48 border-t border-black pt-1 mb-1" />
            <p>Event Coordinator, CGP 2026</p>
            <p className="text-[10px] text-slate-600">Alagappa Institute of Management</p>
          </div>
        </div>
      </div>

      {/* Student Details & Pass Modal */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onAttendanceChange={async (stu, checkedIn) => {
            if (checkedIn) await confirmAttendance(stu.id)
            else await undoAttendance(stu.id)
          }}
          onMaterialsChange={async (stu, materials, distributed) => {
            await updateMaterials(stu.id, materials, distributed)
          }}
        />
      )}
    </div>
  )
}
