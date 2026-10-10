import RegistrationForm from '../components/RegistrationForm'
import eventConfig from '../config/eventConfig'
import { GraduationCap } from 'lucide-react'

export default function Register() {
  const isOpen = eventConfig.isRegistrationOpen !== false

  return (
    <section className="section max-w-2xl">
      {isOpen ? (
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/90 border border-amber-300/90 px-3 py-1 text-xs font-semibold text-amber-900 mb-3">
          <GraduationCap size={14} className="text-amber-700 shrink-0" />
          Final-Year Undergraduates Only
        </div>
      ) : (
        <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-100/90 border border-rose-300/90 px-3 py-1 text-xs font-semibold text-rose-800 mb-3">
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
          </span>
          Online Registrations Closed
        </div>
      )}

      <p className="eyebrow">{isOpen ? 'Student Registration' : 'Registration Closed'}</p>
      <h1 className="mt-2 text-3xl font-bold text-navy-950 md:text-4xl">
        {isOpen ? `Register for ${eventConfig.eventName}` : 'Registrations Are Now Closed'}
      </h1>
      <p className="mt-3 text-slate-600">
        {isOpen
          ? `Fill in your details below. This program is dedicated to outgoing final-year students taking steps toward their careers and higher studies. You'll receive a unique registration ID and QR entry pass for check-in (${eventConfig.date}).`
          : eventConfig.registrationClosedMessage ||
            `Online registration for ${eventConfig.eventName} is now closed. If you have already registered, retrieve your official QR Entry Pass below.`}
      </p>
      <div className="mt-8">
        <RegistrationForm />
      </div>
    </section>
  )
}
