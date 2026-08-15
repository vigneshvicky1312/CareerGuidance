import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import eventConfig from '../config/eventConfig'
import QRScanner from '../components/QRScanner'
import {
  findStudentByRegistrationId,
  confirmAttendance,
  undoAttendance,
  updateMaterials,
  watchAllStudents,
  tsToDate,
} from '../services/studentService'
import { parseStudentQrValue } from '../utils/qrGenerator'
import { playSuccessBeep, playAlreadyBeep, playErrorBeep } from '../utils/audioFeedback'
import {
  ScanLine,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  ArrowRight,
  PackageCheck,
  PackageX,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  Users,
  Clock,
  Check,
  Maximize2,
  Minimize2,
  ChevronRight,
  Phone,
  Building,
  GraduationCap,
  Sparkle,
} from 'lucide-react'

export default function CheckIn() {
  // Modes: 'scanning' | 'verified' | 'already' | 'invalid' | 'confirmed'
  const [mode, setMode] = useState('scanning')
  const [activeTab, setActiveTab] = useState('scanner') // 'scanner' | 'search' | 'recent'
  const [student, setStudent] = useState(null)
  const [manualId, setManualId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [busy, setBusy] = useState(false)
  const [materials, setMaterials] = useState({})
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [autoNext, setAutoNext] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [allStudents, setAllStudents] = useState([])
  const lastScan = useRef('')
  const countdownTimer = useRef(null)

  // Live polling for total event attendance stats and quick search list
  useEffect(() => {
    const unsub = watchAllStudents((list) => {
      setAllStudents(list)
    })
    return () => unsub()
  }, [])

  function cancelCountdown() {
    if (countdownTimer.current) {
      clearInterval(countdownTimer.current)
      countdownTimer.current = null
    }
    setCountdown(null)
  }

  // Auto-countdown to return to scanner after successful confirmation (only if enabled)
  useEffect(() => {
    if (mode === 'confirmed' && autoNext) {
      setCountdown(6)
      countdownTimer.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimer.current)
            countdownTimer.current = null
            scanNext()
            return null
          }
          return prev - 1
        })
      }, 1000)
    } else {
      cancelCountdown()
    }

    return () => {
      cancelCountdown()
    }
  }, [mode, autoNext])

  // Keybindings (Enter to confirm, Space to scan next)
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      if (e.key === 'Enter') {
        if (mode === 'verified') {
          e.preventDefault()
          handleConfirm()
        } else if (mode === 'confirmed' || mode === 'already' || mode === 'invalid') {
          e.preventDefault()
          scanNext()
        }
      } else if (e.key === ' ' || e.key === 'Escape') {
        if (mode === 'confirmed' || mode === 'already' || mode === 'invalid') {
          e.preventDefault()
          scanNext()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mode, student, materials])

  // Lookup student record by registration ID
  const lookup = useCallback(
    async (registrationId) => {
      if (!registrationId) return
      setBusy(true)
      cancelCountdown()
      try {
        const found = await findStudentByRegistrationId(registrationId)
        if (!found || (found.eventId && found.eventId !== eventConfig.eventId)) {
          setStudent(null)
          setMode('invalid')
          if (soundEnabled) playErrorBeep()
          return
        }
        setStudent(found)
        // Default to all checked if new check-in or use existing materials
        const studentMats = found.materials && Object.keys(found.materials).length > 0
          ? found.materials
          : eventConfig.materialsChecklist.reduce((acc, m) => ({ ...acc, [m.key]: true }), {})
        setMaterials(studentMats)

        if (found.checkedIn) {
          setMode('already')
          if (soundEnabled) playAlreadyBeep()
        } else {
          setMode('verified')
          if (soundEnabled) playSuccessBeep()
        }
      } catch (err) {
        console.error('Error in student lookup:', err)
        setStudent(null)
        setMode('invalid')
        if (soundEnabled) playErrorBeep()
      } finally {
        setBusy(false)
      }
    },
    [soundEnabled]
  )

  function handleScan(raw) {
    if (!raw || raw === lastScan.current) return
    lastScan.current = raw
    const parsed = parseStudentQrValue(raw)
    if (!parsed || !parsed.registrationId) {
      setMode('invalid')
      if (soundEnabled) playErrorBeep()
      return
    }
    lookup(parsed.registrationId)
  }

  function handleManualSearch(e) {
    e?.preventDefault()
    lookup(manualId.trim())
  }

  async function handleConfirm(customMaterials = null) {
    if (!student) return
    setBusy(true)
    try {
      await confirmAttendance(student.id)

      const finalMaterials = customMaterials !== null ? customMaterials : materials
      const anyChecked = Object.values(finalMaterials).some(Boolean)
      const allChecked = eventConfig.materialsChecklist.every((m) => finalMaterials[m.key])

      await updateMaterials(student.id, finalMaterials, anyChecked)

      setStudent((s) => ({
        ...s,
        checkedIn: true,
        checkInTime: new Date().toISOString(),
        materials: finalMaterials,
        materialsDistributed: anyChecked,
      }))
      setMaterials(finalMaterials)
      setMode('confirmed')
      if (soundEnabled) playSuccessBeep()
    } catch (err) {
      console.error('Error confirming attendance:', err)
      alert('Could not record attendance. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function handleUndoCheckIn() {
    if (!student) return
    setBusy(true)
    cancelCountdown()
    try {
      await undoAttendance(student.id)
      setStudent((s) => ({ ...s, checkedIn: false, checkInTime: null }))
      setMode('verified')
    } catch (err) {
      console.error('Failed to undo check-in:', err)
      alert('Could not undo attendance.')
    } finally {
      setBusy(false)
    }
  }

  function toggleMaterial(key) {
    cancelCountdown() // Stop any auto-timer so user can select comfortably
    const updated = { ...materials, [key]: !materials[key] }
    setMaterials(updated)
    if (student && student.checkedIn) {
      const anyChecked = Object.values(updated).some(Boolean)
      updateMaterials(student.id, updated, anyChecked).catch(console.error)
      setStudent((s) => ({ ...s, materials: updated, materialsDistributed: anyChecked }))
    }
  }

  function handleSelectAllMaterials(checked) {
    cancelCountdown() // Stop any auto-timer
    const updated = {}
    eventConfig.materialsChecklist.forEach((m) => {
      updated[m.key] = checked
    })
    setMaterials(updated)
    if (student && student.checkedIn) {
      updateMaterials(student.id, updated, checked).catch(console.error)
      setStudent((s) => ({ ...s, materials: updated, materialsDistributed: checked }))
    }
  }

  function scanNext() {
    cancelCountdown()
    lastScan.current = ''
    setStudent(null)
    setManualId('')
    setMode('scanning')
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setIsFullscreen(false)
    }
  }

  // Stats calculation
  const totalCount = allStudents.length
  const checkedInCount = allStudents.filter((s) => s.checkedIn).length
  const attendanceRate = totalCount ? Math.round((checkedInCount / totalCount) * 100) : 0
  const recentCheckedIn = useMemo(() => {
    return allStudents
      .filter((s) => s.checkedIn)
      .sort((a, b) => new Date(b.checkInTime || 0) - new Date(a.checkInTime || 0))
      .slice(0, 10)
  }, [allStudents])

  // Live search filtering
  const searchResults = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return []
    return allStudents
      .filter((s) => `${s.name} ${s.registrationId} ${s.mobile} ${s.college}`.toLowerCase().includes(term))
      .slice(0, 8)
  }, [allStudents, searchTerm])

  return (
    <div className="min-h-[85vh] py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Top Control Bar & Live Stats */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <p className="eyebrow !text-indigo-600">Volunteer QR Check-In Counter</p>
              </div>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">Attendee Verification</h1>
            </div>

            {/* Quick Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSoundEnabled((v) => !v)}
                title={soundEnabled ? 'Mute audio feedback' : 'Enable audio feedback'}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  soundEnabled
                    ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 bg-white text-slate-400'
                }`}
              >
                {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                <span className="hidden sm:inline">{soundEnabled ? 'Sound On' : 'Muted'}</span>
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                title="Toggle Fullscreen Scanner"
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 transition"
              >
                {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>
            </div>
          </div>

          {/* Live Progress Bar */}
          <div className="mt-5 rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">
                Attendance Progress:{' '}
                <span className="font-bold text-emerald-600">{checkedInCount}</span> / {totalCount} Students
              </span>
              <span className="font-bold text-indigo-600">{attendanceRate}%</span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 transition-all duration-500"
                style={{ width: `${attendanceRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* ────────── STATE 1: SCANNING MODE ────────── */}
        {mode === 'scanning' && (
          <div className="space-y-6">
            {/* View Selector Tabs */}
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab('scanner')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition ${
                  activeTab === 'scanner'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ScanLine size={15} /> Camera Scanner
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('search')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition ${
                  activeTab === 'search'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Search size={15} /> Instant Search
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('recent')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition ${
                  activeTab === 'recent'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Clock size={15} /> Recent ({recentCheckedIn.length})
              </button>
            </div>

            {/* TAB 1: Live QR Scanner */}
            {activeTab === 'scanner' && (
              <div className="space-y-4">
                <QRScanner onScan={handleScan} active={mode === 'scanning' && activeTab === 'scanner'} />

                {/* Quick Manual Entry Bar */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Quick ID Key-In
                  </p>
                  <form onSubmit={handleManualSearch} className="flex gap-2">
                    <div className="relative flex-1">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        value={manualId}
                        onChange={(e) => setManualId(e.target.value.toUpperCase())}
                        placeholder={`e.g. ${eventConfig.eventId}-0001`}
                        className="pl-9 font-mono uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={busy || !manualId.trim()}
                      className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                      Verify <ArrowRight size={15} />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 2: Instant Search & Filter */}
            {activeTab === 'search' && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900">Find Registered Student</h3>
                  <p className="text-xs text-slate-500">Search by student name, Reg ID, mobile number, or college</p>
                </div>

                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Type name, mobile (e.g. 9876...), or ID..."
                    autoFocus
                    className="pl-10 text-base"
                  />
                </div>

                <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 overflow-hidden">
                  {searchTerm.trim() === '' ? (
                    <div className="p-8 text-center text-sm text-slate-400">
                      Type above to search registered attendees
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-400">
                      No matching student found for "{searchTerm}"
                    </div>
                  ) : (
                    searchResults.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => lookup(s.registrationId)}
                        className="flex cursor-pointer items-center justify-between p-3.5 transition hover:bg-indigo-50/50"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ${
                              s.checkedIn ? 'bg-emerald-500' : 'bg-indigo-600'
                            }`}
                          >
                            {s.name?.[0] || '?'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{s.name}</p>
                            <p className="text-xs text-slate-400 truncate max-w-xs">
                              {s.college} • {s.department}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="font-mono text-xs font-bold text-indigo-600">
                              {s.registrationId}
                            </span>
                            <p className="text-[11px] text-slate-400">{s.mobile}</p>
                          </div>
                          <ChevronRight size={16} className="text-slate-300" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: Recent Check-Ins List */}
            {activeTab === 'recent' && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">Recent Check-Ins</h3>
                    <p className="text-xs text-slate-500">Latest confirmed attendees at this counter</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                    {recentCheckedIn.length} recent
                  </span>
                </div>

                {recentCheckedIn.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-12 text-center text-slate-400">
                    <Users size={32} className="text-slate-300" />
                    <p className="text-sm">No students checked in yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 overflow-hidden">
                    {recentCheckedIn.map((s) => {
                      const time = tsToDate(s.checkInTime)
                      return (
                        <div
                          key={s.id}
                          onClick={() => lookup(s.registrationId)}
                          className="flex cursor-pointer items-center justify-between p-3.5 transition hover:bg-slate-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                              ✓
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{s.name}</p>
                              <p className="text-xs text-slate-400">{s.college}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-mono text-xs font-bold text-indigo-600">
                              {s.registrationId}
                            </span>
                            <p className="text-[11px] text-slate-400">
                              {time ? time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ────────── STATE 2: VERIFIED (READY TO CONFIRM) ────────── */}
        {mode === 'verified' && student && (
          <div className="rounded-3xl border-2 border-indigo-500 bg-white p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <Sparkles size={20} />
                <h2 className="text-lg font-bold text-slate-900">Valid Registration Found</h2>
              </div>
              <span className="rounded-full bg-indigo-100 px-3 py-1 font-mono text-xs font-bold text-indigo-700">
                {student.registrationId}
              </span>
            </div>

            {/* Profile Overview Card */}
            <StudentDetailCard student={student} />

            {/* Materials Checklist (Pre-selection before confirming) */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <PackageCheck size={16} className="text-indigo-600" />
                  Kit Materials to Issue
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleSelectAllMaterials(true)}
                    className="font-semibold text-indigo-600 hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => handleSelectAllMaterials(false)}
                    className="font-semibold text-slate-500 hover:underline"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {eventConfig.materialsChecklist.map((m) => (
                  <label
                    key={m.key}
                    className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-sm cursor-pointer transition select-none ${
                      materials[m.key]
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-medium'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 accent-emerald-600 cursor-pointer"
                      checked={!!materials[m.key]}
                      onChange={() => toggleMaterial(m.key)}
                    />
                    <span>{m.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => handleConfirm(materials)}
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition active:scale-[0.98] disabled:opacity-50"
              >
                <CheckCircle2 size={18} /> Confirm Attendance &amp; Issue Selected Kits (Enter)
              </button>

              <button
                type="button"
                onClick={scanNext}
                disabled={busy}
                className="w-full rounded-2xl py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition"
              >
                Cancel / Scan Different Student
              </button>
            </div>
          </div>
        )}

        {/* ────────── STATE 3: ATTENDANCE CONFIRMED ────────── */}
        {mode === 'confirmed' && student && (
          <div className="rounded-3xl border-2 border-emerald-500 bg-white p-6 shadow-xl space-y-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-md">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Attendance Confirmed! 🎉</h2>
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">{student.name}</span> is checked in.
              </p>
            </div>

            <StudentDetailCard student={student} showTime />

            {/* Materials Distribution Checklist */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <PackageCheck size={16} className="text-indigo-600" />
                  Kit &amp; Stationery Checklist
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleSelectAllMaterials(true)}
                    className="font-semibold text-indigo-600 hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => handleSelectAllMaterials(false)}
                    className="font-semibold text-slate-500 hover:underline"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {eventConfig.materialsChecklist.map((m) => (
                  <label
                    key={m.key}
                    className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-sm cursor-pointer transition select-none ${
                      materials[m.key]
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-medium'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 accent-emerald-600 cursor-pointer"
                      checked={!!materials[m.key]}
                      onChange={() => toggleMaterial(m.key)}
                    />
                    <span>{m.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Scan Next Button with optional countdown */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={scanNext}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-indigo-600 transition active:scale-[0.98]"
              >
                <ScanLine size={18} />
                Done &amp; Scan Next Student {countdown !== null ? `(${countdown}s)` : '➡️'}
              </button>

              {countdown !== null && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={cancelCountdown}
                    className="text-xs text-amber-600 font-semibold hover:underline"
                  >
                    ⏸ Pause auto-advance timer
                  </button>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoNext}
                    onChange={(e) => setAutoNext(e.target.checked)}
                    className="rounded border-slate-300 accent-indigo-600 cursor-pointer"
                  />
                  Auto-advance to next student after confirmation
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ────────── STATE 4: ALREADY CHECKED IN ────────── */}
        {mode === 'already' && student && (
          <div className="rounded-3xl border-2 border-amber-400 bg-white p-6 shadow-xl space-y-6">
            <div className="flex items-center gap-3 rounded-2xl bg-amber-50 p-4 text-amber-800 border border-amber-200">
              <AlertTriangle size={24} className="text-amber-600 shrink-0" />
              <div>
                <h3 className="font-bold">Already Checked In ⚠️</h3>
                <p className="text-xs text-amber-700">
                  This pass was already scanned at{' '}
                  <span className="font-semibold">
                    {tsToDate(student.checkInTime)?.toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    }) || 'earlier today'}
                  </span>
                  .
                </p>
              </div>
            </div>

            <StudentDetailCard student={student} showTime />

            {/* Materials Status */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Kit Distribution
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    student.materialsDistributed
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {student.materialsDistributed ? 'All Distributed' : 'Pending Items'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {eventConfig.materialsChecklist.map((m) => (
                  <label
                    key={m.key}
                    className={`flex items-center gap-2.5 rounded-xl border p-2 text-xs cursor-pointer transition select-none ${
                      materials[m.key]
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-medium'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded border-slate-300 accent-emerald-600 cursor-pointer"
                      checked={!!materials[m.key]}
                      onChange={() => toggleMaterial(m.key)}
                    />
                    <span>{m.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={scanNext}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition active:scale-[0.98]"
              >
                <ScanLine size={18} /> Scan Next Student (Space / Enter)
              </button>

              <button
                type="button"
                onClick={handleUndoCheckIn}
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
              >
                <RotateCcw size={14} /> Undo Check-In For This Student
              </button>
            </div>
          </div>
        )}

        {/* ────────── STATE 5: INVALID PASS ────────── */}
        {mode === 'invalid' && (
          <div className="rounded-3xl border-2 border-rose-300 bg-white p-8 shadow-xl text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600 shadow-md">
              <XCircle size={36} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Unrecognized QR Pass ❌</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              This code does not match any registered student for {eventConfig.eventName}.
            </p>

            <div className="rounded-2xl bg-rose-50/60 p-4 border border-rose-100 text-xs text-rose-700 max-w-md mx-auto text-left space-y-1">
              <p className="font-semibold">Possible causes:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Student registered for a different event or year.</li>
                <li>QR code is blurred or distorted on phone screen.</li>
                <li>Student has not completed the registration form yet.</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={scanNext}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition"
              >
                <ScanLine size={16} /> Scan Again
              </button>
              <button
                type="button"
                onClick={() => {
                  scanNext()
                  setActiveTab('search')
                }}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <Search size={16} /> Manual Search
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StudentDetailCard({ student, showTime }) {
  const time = tsToDate(student.checkInTime)
  const regDate = tsToDate(student.registeredAt)

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 space-y-4">
      {/* Student Banner */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-xl font-bold text-white shadow-md shadow-indigo-500/20">
          {student.name?.[0] || '?'}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-xl font-bold text-slate-900">{student.name}</h3>
          <p className="text-xs text-slate-500">
            {student.gender} • {student.year}
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
        <div>
          <dt className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">College</dt>
          <dd className="font-medium text-slate-800 line-clamp-1">{student.college || '—'}</dd>
        </div>
        <div>
          <dt className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Degree &amp; Dept</dt>
          <dd className="font-medium text-slate-800">
            {student.degree} — {student.department}
          </dd>
        </div>
        <div>
          <dt className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Contact</dt>
          <dd className="font-medium text-slate-800">
            {student.mobile || '—'} {student.email ? `• ${student.email}` : ''}
          </dd>
        </div>
        <div>
          <dt className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Career Interest</dt>
          <dd className="font-medium text-indigo-700">{student.careerInterest || '—'}</dd>
        </div>
        {showTime && time && (
          <div className="col-span-full pt-1 border-t border-slate-200/60">
            <dt className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              Checked In At
            </dt>
            <dd className="font-semibold text-emerald-700">
              {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}{' '}
              ({time.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})
            </dd>
          </div>
        )}
      </dl>
    </div>
  )
}
