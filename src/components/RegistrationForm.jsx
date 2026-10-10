import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import eventConfig from '../config/eventConfig'
import colleges from '../config/colleges'
import { registerStudent, findStudentByMobile, findStudentByRegistrationId } from '../services/studentService'
import { Loader2, GraduationCap, AlertCircle, Ticket, Search, X, MapPin, Calendar, Phone, QrCode, ArrowRight } from 'lucide-react'
import Toast from './Toast'

const initialForm = {
  name: '',
  gender: '',
  college: '',
  degree: '',
  department: '',
  year: 'Final Year',
  mobile: '',
  email: '',
  district: '',
  careerInterest: '',
  consent: false,
}

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Name is required.'
  if (!form.gender) errors.gender = 'Please select gender.'
  if (!form.college || !form.college.trim()) errors.college = 'Please select or enter your college.'
  if (!form.degree.trim()) errors.degree = 'Degree is required.'
  if (!form.department.trim()) errors.department = 'Department is required.'
  if (!form.year) {
    errors.year = 'Please select your year.'
  } else if (form.year !== 'Final Year') {
    errors.year = 'This event is exclusively for Final Year students.'
  }
  if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) errors.mobile = 'Enter a valid 10-digit mobile number.'
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errors.email = 'Enter a valid email address.'
  if (!form.district.trim()) errors.district = 'District is required.'
  if (!form.careerInterest) errors.careerInterest = 'Please select a career interest.'
  if (!form.consent) errors.consent = 'Please confirm your eligibility and accept the consent to continue.'
  return errors
}

export default function RegistrationForm() {
  const [form, setForm]           = useState(initialForm)
  const [errors, setErrors]       = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [toasts, setToasts]       = useState([])
  const [existingStudent, setExistingStudent] = useState(null)
  const [showLookup, setShowLookup] = useState(false)
  const [lookupMobile, setLookupMobile] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupError, setLookupError] = useState('')
  const navigate = useNavigate()

  /* ── Toast helpers ── */
  const addToast = useCallback((message, type = 'error') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, type, message }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  async function handleLookupSubmit(e) {
    e?.preventDefault()
    const raw = lookupMobile.trim()
    if (!raw) {
      setLookupError('Please enter your 10-digit mobile number or Registration ID.')
      return
    }

    setLookupLoading(true)
    setLookupError('')
    try {
      let student = null
      const digitsOnly = raw.replace(/\D/g, '')

      // If looks like a 10-digit phone number
      if (digitsOnly.length === 10 && !raw.toUpperCase().startsWith('CGP')) {
        student = await findStudentByMobile(digitsOnly)
      } else {
        // Try searching as registration ID
        student = await findStudentByRegistrationId(raw)
        // If not found and input is numbers only (e.g. "42"), pad it
        if (!student && /^\d+$/.test(raw)) {
          const padded = `${eventConfig.eventId}-${raw.padStart(4, '0')}`
          student = await findStudentByRegistrationId(padded)
        }
      }

      if (student) {
        setShowLookup(false)
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        navigate('/registration-success', { state: { student, isExisting: true } })
      } else {
        setLookupError(
          eventConfig.isRegistrationOpen === false
            ? 'No registration found for these details. Online registrations have closed.'
            : 'No existing registration found. Please check your details or register below.'
        )
      }
    } catch (err) {
      setLookupError(err.message || 'Error looking up registration. Please try again.')
    } finally {
      setLookupLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (eventConfig.isRegistrationOpen === false) {
      addToast('Online registrations are currently closed.', 'error')
      return
    }
    if (submitting) return

    const validationErrors = validate(form)
    setErrors(validationErrors)

    const errorCount = Object.keys(validationErrors).length
    if (errorCount > 0) {
      addToast(
        errorCount === 1
          ? Object.values(validationErrors)[0]
          : `${errorCount} fields need attention — please review the form.`,
        'error'
      )
      // scroll the first errored field into view
      const firstKey = Object.keys(validationErrors)[0]
      document.getElementById(firstKey)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSubmitting(true)
    try {
      const student = await registerStudent(form)
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      navigate('/registration-success', { state: { student } })
    } catch (err) {
      console.error(err)
      if ((err.status === 409 || err.data?.error === 'already_registered') && (err.student || err.data?.student)) {
        const student = err.student || err.data?.student
        setExistingStudent(student)
        return
      }
      addToast(err.message || 'Something went wrong while saving your registration. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // ─────────────────────────────────────────────────────────────
  // If Registrations Are Closed, Show Dedicated Pass Retrieval
  // ─────────────────────────────────────────────────────────────
  if (eventConfig.isRegistrationOpen === false) {
    return (
      <div className="space-y-6">
        <Toast toasts={toasts} remove={removeToast} />

        <div className="card border-rose-200 bg-white p-6 sm:p-8 shadow-xl rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 h-28 w-28 rounded-full bg-rose-50 blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3.5 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-sm shrink-0">
              <Ticket size={24} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                Registrations Closed
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-navy-950 mt-1">
                Retrieve Your Event Entry Pass
              </h2>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            Online registration is now officially closed. If you previously registered, enter your <strong>10-digit registered mobile number</strong> or <strong>Registration ID</strong> (e.g. {eventConfig.eventId}-0042) below to view, download, or print your official QR Entry Pass.
          </p>

          <form onSubmit={handleLookupSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="closedLookup" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Registered Mobile Number or Registration ID
              </label>
              <div className="relative">
                <input
                  id="closedLookup"
                  type="text"
                  value={lookupMobile}
                  onChange={(e) => setLookupMobile(e.target.value)}
                  placeholder="e.g. 9876543210 or CGP2026-0042"
                  className="w-full pr-12 text-base py-3 px-4 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  autoFocus
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                  <Search size={20} />
                </div>
              </div>

              {lookupError && (
                <div className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{lookupError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={lookupLoading}
              className="btn-primary w-full justify-center !py-3.5 text-sm font-bold shadow-lg shadow-indigo-600/20"
            >
              {lookupLoading ? <Loader2 size={18} className="animate-spin" /> : <Ticket size={18} />}
              {lookupLoading ? 'Locating Your Pass…' : 'Find & Download My Pass'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 grid gap-3 sm:grid-cols-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-indigo-600 shrink-0" />
              <span><strong>Date:</strong> {eventConfig.date} ({eventConfig.time})</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-indigo-600 shrink-0" />
              <span className="truncate"><strong>Venue:</strong> {eventConfig.venue}</span>
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <Phone size={15} className="text-indigo-600 shrink-0" />
              <span>
                <strong>Queries / Assistance:</strong> {eventConfig.facultyCoordinator} ({eventConfig.phone})
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Toast toasts={toasts} remove={removeToast} />

      {/* Already Registered Quick-Link Banner */}
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-indigo-50/90 border border-indigo-200/80 px-4 py-3 text-xs sm:text-sm text-indigo-950 mb-5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 shrink-0">
            <Ticket size={16} />
          </div>
          <span className="font-medium text-slate-700">Already registered previously?</span>
        </div>
        <button
          type="button"
          onClick={() => {
            setLookupError('')
            setLookupMobile(form.mobile || '')
            setShowLookup(true)
          }}
          className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1 cursor-pointer shrink-0"
        >
          Find My Pass <span aria-hidden="true">&rarr;</span>
        </button>
      </div>

      {/* Duplicate Registration Modal */}
      {existingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="card max-w-md w-full bg-white p-6 shadow-2xl rounded-2xl border border-amber-300 relative animate-scaleUp">
            <button
              type="button"
              onClick={() => setExistingStudent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <div className="p-2.5 bg-amber-100 rounded-xl">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 leading-tight">Already Registered!</h3>
                <p className="text-xs text-amber-700 font-medium">Duplicate registration prevented</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 mt-2">
              This mobile number (<strong>{form.mobile}</strong>) is already registered in our system. You do not need to register again.
            </p>

            <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/90 text-sm space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-semibold text-slate-900">{existingStudent.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Registration ID:</span>
                <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {existingStudent.registrationId}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">College:</span>
                <span className="text-slate-700 text-right truncate max-w-[200px]">{existingStudent.college}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
                  navigate('/registration-success', { state: { student: existingStudent, isExisting: true } })
                }}
                className="btn-primary w-full justify-center py-2.5 shadow-md"
              >
                View & Download Your Entry Pass 🎟️
              </button>
              <button
                type="button"
                onClick={() => setExistingStudent(null)}
                className="btn-outline w-full justify-center text-xs py-2 text-slate-600"
              >
                Close & Check My Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Find My Pass Lookup Modal */}
      {showLookup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="card max-w-md w-full bg-white p-6 shadow-2xl rounded-2xl border border-indigo-200 relative animate-scaleUp">
            <button
              type="button"
              onClick={() => {
                setShowLookup(false)
                setLookupError('')
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 text-indigo-600 mb-3">
              <div className="p-2.5 bg-indigo-100 rounded-xl">
                <Ticket size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 leading-tight">Retrieve Entry Pass</h3>
                <p className="text-xs text-slate-500">Search using your registered mobile number</p>
              </div>
            </div>

            <form onSubmit={handleLookupSubmit} className="space-y-4 mt-4">
              <div>
                <label htmlFor="lookupMobile" className="text-xs font-semibold text-slate-700">
                  Registered Mobile Number
                </label>
                <div className="mt-1 relative">
                  <input
                    id="lookupMobile"
                    type="tel"
                    value={lookupMobile}
                    onChange={(e) => setLookupMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full pr-10 text-base"
                    autoFocus
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                    <Search size={18} />
                  </div>
                </div>
                {lookupError && (
                  <p className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                    {lookupError}
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={lookupLoading}
                  className="btn-primary w-full justify-center py-2.5"
                >
                  {lookupLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                  {lookupLoading ? 'Searching…' : 'Find My Pass'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowLookup(false)}
                  className="btn-outline py-2.5 px-4 text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="card space-y-5">
        {/* Eligibility Notice Banner */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/90 p-4 text-amber-950 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-200/80 text-amber-900">
              <GraduationCap size={18} />
            </div>
            <div className="text-xs sm:text-sm">
              <h3 className="font-bold text-amber-950">
                Eligibility: Exclusively for Final-Year Students
              </h3>
              <p className="mt-0.5 text-amber-900/90 leading-relaxed">
                This event is tailored specifically for <strong>final-year undergraduates</strong> who are completing their degree and taking steps toward their future career, job placements, and higher education. <em>Please note: This program is not open for pre-final years.</em>
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name">Student Name *</label>
            <input id="name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Full name" />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="gender">Gender *</label>
            <select id="gender" value={form.gender} onChange={(e) => update('gender', e.target.value)}>
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            {errors.gender && <p className="mt-1 text-xs text-red-600">{errors.gender}</p>}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="college">College Name *</label>
            <input
              id="college"
              list="colleges-list"
              value={form.college}
              onChange={(e) => update('college', e.target.value)}
              placeholder="e.g. Alagappa Government Arts College"
            />
            <datalist id="colleges-list">
              {colleges.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            {errors.college && <p className="mt-1 text-xs text-red-600">{errors.college}</p>}
          </div>

          <div>
            <label htmlFor="degree">Degree *</label>
            <input id="degree" value={form.degree} onChange={(e) => update('degree', e.target.value)} placeholder="e.g. B.Com, B.A, B.Sc" />
            {errors.degree && <p className="mt-1 text-xs text-red-600">{errors.degree}</p>}
          </div>

          <div>
            <label htmlFor="department">Department *</label>
            <input id="department" value={form.department} onChange={(e) => update('department', e.target.value)} placeholder="e.g. Commerce, English" />
            {errors.department && <p className="mt-1 text-xs text-red-600">{errors.department}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="year">Year of Study *</label>
              <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded border border-amber-300">
                Final Year Only
              </span>
            </div>
            <select
              id="year"
              value={form.year}
              onChange={(e) => update('year', e.target.value)}
              className="bg-slate-50 font-medium text-slate-800 border-slate-300"
            >
              <option value="Final Year">Final Year (Graduating / Outgoing Batch)</option>
            </select>
            <p className="mt-1 text-[11px] leading-tight text-slate-500">
              Only final-year outgoing students are eligible to attend. Pre-final years are not eligible.
            </p>
            {errors.year && <p className="mt-1 text-xs text-red-600">{errors.year}</p>}
          </div>

          <div>
            <label htmlFor="mobile">Mobile Number *</label>
            <input
              id="mobile"
              value={form.mobile}
              onChange={(e) => update('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit mobile number"
            />
            {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="email">Email ID *</label>
            <input id="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="district">District *</label>
            <input id="district" value={form.district} onChange={(e) => update('district', e.target.value)} placeholder="e.g. Sivagangai" />
            {errors.district && <p className="mt-1 text-xs text-red-600">{errors.district}</p>}
          </div>

          <div>
            <label htmlFor="careerInterest">Interested Career Area *</label>
            <select id="careerInterest" value={form.careerInterest} onChange={(e) => update('careerInterest', e.target.value)}>
              <option value="">Select</option>
              {eventConfig.careerInterests.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            {errors.careerInterest && <p className="mt-1 text-xs text-red-600">{errors.careerInterest}</p>}
          </div>
        </div>

        <label className="flex items-start gap-2.5 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            checked={form.consent}
            onChange={(e) => update('consent', e.target.checked)}
          />
          <span>
            I confirm that I am a <strong>final-year student</strong> completing my studies, and I agree to share the above details with {eventConfig.organizer} for the purpose of registration, attendance, and event communication.
          </span>
        </label>
        {errors.consent && <p className="-mt-3 text-xs text-red-600">{errors.consent}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
          {submitting ? 'Registering…' : 'Register Now'}
        </button>
      </form>
    </>
  )
}
