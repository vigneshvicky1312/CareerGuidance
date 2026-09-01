import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import eventConfig from '../config/eventConfig'
import colleges from '../config/colleges'
import { registerStudent } from '../services/studentService'
import { Loader2 } from 'lucide-react'
import Toast from './Toast'

const initialForm = {
  name: '',
  gender: '',
  college: '',
  degree: '',
  department: '',
  year: '',
  mobile: '',
  email: '',
  district: '',
  careerInterest: '',
  foodPreference: '',
  consent: false,
}

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Name is required.'
  if (!form.gender) errors.gender = 'Please select gender.'
  if (!form.college || !form.college.trim()) errors.college = 'Please select or enter your college.'
  if (!form.degree.trim()) errors.degree = 'Degree is required.'
  if (!form.department.trim()) errors.department = 'Department is required.'
  if (!form.year) errors.year = 'Please select your year.'
  if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) errors.mobile = 'Enter a valid 10-digit mobile number.'
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errors.email = 'Enter a valid email address.'
  if (!form.district.trim()) errors.district = 'District is required.'
  if (!form.careerInterest) errors.careerInterest = 'Please select a career interest.'
  if (!form.consent) errors.consent = 'Please accept the consent to continue.'
  return errors
}

export default function RegistrationForm() {
  const [form, setForm]           = useState(initialForm)
  const [errors, setErrors]       = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [toasts, setToasts]       = useState([])
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

  async function handleSubmit(e) {
    e.preventDefault()
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
      navigate('/registration-success', { state: { student } })
    } catch (err) {
      console.error(err)
      addToast('Something went wrong while saving your registration. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Toast toasts={toasts} remove={removeToast} />

      <form onSubmit={handleSubmit} noValidate className="card space-y-5">
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
              list="college-options"
              value={form.college}
              onChange={(e) => update('college', e.target.value)}
              placeholder="Enter your college name (e.g. Alagappa Government Arts College)"
              autoComplete="off"
            />
            <datalist id="college-options">
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
            <label htmlFor="year">Year *</label>
            <select id="year" value={form.year} onChange={(e) => update('year', e.target.value)}>
              <option value="">Select</option>
              <option>Final Year</option>
              <option>Pre-Final Year</option>
            </select>
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

          <div className="sm:col-span-2">
            <label htmlFor="foodPreference">Food Preference (optional)</label>
            <select id="foodPreference" value={form.foodPreference} onChange={(e) => update('foodPreference', e.target.value)}>
              <option value="">Not specified</option>
              <option>Vegetarian</option>
              <option>Non-Vegetarian</option>
            </select>
          </div>
        </div>

        <label className="flex items-start gap-2.5 text-sm text-slate-600">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300"
            checked={form.consent}
            onChange={(e) => update('consent', e.target.checked)}
          />
          I agree to share the above details with the {eventConfig.organizer} for the purpose of
          registration, attendance and event communication.
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
