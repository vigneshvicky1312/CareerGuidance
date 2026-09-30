import { useEffect } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import eventConfig from '../config/eventConfig'
import RegistrationPass from '../components/RegistrationPass'
import { PartyPopper } from 'lucide-react'

const sampleStudent = {
  name: 'Vicky V',
  college: 'Alagappa Government Arts College, Karaikudi',
  department: 'B.Sc. Computer Science (Final Year)',
  registrationId: 'CGP2026-0020',
  email: 'vicky@example.com',
  phone: '+91 99944 39565',
}

export default function RegistrationSuccess() {
  const location = useLocation()
  const student = location.state?.student || sampleStudent
  const isExisting = location.state?.isExisting || false

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return (
    <section className="section max-w-2xl w-full overflow-x-hidden text-center">
      <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${isExisting ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
        <PartyPopper size={26} />
      </div>
      <h1 className="mt-4 text-3xl font-bold text-navy-950 md:text-4xl">
        {isExisting ? 'Entry Pass Retrieved! 🎟️' : 'Registration Successful! 🎉'}
      </h1>
      <p className="mt-2 text-slate-600">
        {isExisting ? (
          <>
            Welcome back, <strong>{student.name}</strong>! You are already registered for <strong>{eventConfig.eventName}</strong>. Your entry pass is displayed below.
          </>
        ) : (
          <>
            Thank you for registering for the <strong>{eventConfig.eventName}</strong>. Your entry pass is ready — tap the button below to download your PDF.
          </>
        )}
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
