import RegistrationForm from '../components/RegistrationForm'
import eventConfig from '../config/eventConfig'

export default function Register() {
  return (
    <section className="section max-w-2xl">
      <p className="eyebrow">Student Registration</p>
      <h1 className="mt-2 text-3xl font-bold text-navy-950 md:text-4xl">Register for {eventConfig.eventName}</h1>
      <p className="mt-3 text-slate-600">
        Fill in your details below. You'll receive a unique registration ID and QR code —
        keep it handy for check-in on {eventConfig.date}.
      </p>
      <div className="mt-8">
        <RegistrationForm />
      </div>
    </section>
  )
}
