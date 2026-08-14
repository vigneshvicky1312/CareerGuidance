import { Link, Navigate, useLocation } from 'react-router-dom'
import eventConfig from '../config/eventConfig'
import QRCodeCard from '../components/QRCodeCard'
import RegistrationPass from '../components/RegistrationPass'
import { PartyPopper } from 'lucide-react'

export default function RegistrationSuccess() {
  const location = useLocation()
  const student = location.state?.student

  if (!student) {
    return <Navigate to="/register" replace />
  }

  return (
    <section className="section max-w-3xl text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <PartyPopper size={26} />
      </div>
      <h1 className="mt-4 text-3xl font-bold text-navy-950 md:text-4xl">Registration Successful! 🎉</h1>
      <p className="mt-2 text-slate-600">
        Thank you for registering for the {eventConfig.eventName}.
      </p>

      <dl className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-left text-sm shadow-card">
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-400">Student Name</dt>
          <dd className="font-semibold text-navy-950">{student.name}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-400">College</dt>
          <dd className="font-semibold text-navy-950">{student.college}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-400">Registration ID</dt>
          <dd className="font-mono font-semibold text-navy-950">{student.registrationId}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-400">Event Date</dt>
          <dd className="font-semibold text-navy-950">{eventConfig.date}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs uppercase tracking-wide text-slate-400">Venue</dt>
          <dd className="font-semibold text-navy-950">{eventConfig.venue}</dd>
        </div>
      </dl>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <QRCodeCard registrationId={student.registrationId} />
        <RegistrationPass student={student} />
      </div>

      <Link to="/" className="btn-outline mt-10 inline-flex">
        Back to Home
      </Link>
    </section>
  )
}
