import { Link, Navigate, useLocation } from 'react-router-dom'
import eventConfig from '../config/eventConfig'
import RegistrationPass from '../components/RegistrationPass'
import { PartyPopper } from 'lucide-react'

export default function RegistrationSuccess() {
  const location = useLocation()
  const student = location.state?.student

  if (!student) {
    return <Navigate to="/register" replace />
  }

  return (
    <section className="section max-w-2xl text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <PartyPopper size={26} />
      </div>
      <h1 className="mt-4 text-3xl font-bold text-navy-950 md:text-4xl">
        Registration Successful! 🎉
      </h1>
      <p className="mt-2 text-slate-600">
        Thank you for registering for the {eventConfig.eventName}.
        Your entry pass is ready — print or save the QR code below.
      </p>

      <div className="mt-10">
        <RegistrationPass student={student} />
      </div>

      <Link to="/" className="btn-outline mt-10 inline-flex">
        Back to Home
      </Link>
    </section>
  )
}
