import RegistrationForm from '../components/RegistrationForm'
import eventConfig from '../config/eventConfig'
import { GraduationCap } from 'lucide-react'

export default function Register() {
  return (
    <section className="section max-w-2xl">
      <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/90 border border-amber-300/90 px-3 py-1 text-xs font-semibold text-amber-900 mb-3">
        <GraduationCap size={14} className="text-amber-700 shrink-0" />
        Final-Year Undergraduates Only
      </div>
      <p className="eyebrow">Student Registration</p>
      <h1 className="mt-2 text-3xl font-bold text-navy-950 md:text-4xl">Register for {eventConfig.eventName}</h1>
      <p className="mt-3 text-slate-600">
        Fill in your details below. This program is dedicated to outgoing final-year students taking steps toward their careers and higher studies. You'll receive a unique registration ID and QR entry pass for check-in ({eventConfig.date}).
      </p>
      <div className="mt-8">
        <RegistrationForm />
      </div>
    </section>
  )
}
