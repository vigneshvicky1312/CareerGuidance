import eventConfig from '../config/eventConfig'
import { Phone, Mail, MapPin, User } from 'lucide-react'

export default function Contact() {
  return (
    <section id="contact" className="section">
      <p className="eyebrow">Get in Touch</p>
      <h2 className="mt-2 text-3xl font-bold text-navy-950 md:text-4xl">
        {eventConfig.collegeName}
      </h2>
      <p className="mt-1 text-base font-semibold text-sky-600">
        {eventConfig.universityName}
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="card space-y-4">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="mt-0.5 shrink-0 text-navy-700" />
            <div className="text-sm text-slate-600">
              <div className="font-semibold text-navy-950">
                {eventConfig.collegeName}
              </div>
              <p className="text-xs text-slate-500 font-medium">{eventConfig.universityName}</p>
              <p className="mt-1">{eventConfig.instituteAddress}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={18} className="shrink-0 text-navy-700" />
            <a href={`tel:${eventConfig.phone}`} className="text-sm text-slate-600 hover:text-navy-800">
              {eventConfig.phone}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={18} className="shrink-0 text-navy-700" />
            <a href={`mailto:${eventConfig.email}`} className="text-sm text-slate-600 hover:text-navy-800">
              {eventConfig.email}
            </a>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <a href={`tel:${eventConfig.phone}`} className="btn-primary !px-5 !py-2.5 text-sm">
              <Phone size={14} /> Call
            </a>
            <a href={`mailto:${eventConfig.email}`} className="btn-outline !px-5 !py-2.5 text-sm">
              <Mail size={14} /> Email
            </a>
          </div>
        </div>

        <div className="card space-y-4">
          {[
            ['Faculty Coordinator', eventConfig.facultyCoordinator],
            ['Event Coordinator', eventConfig.eventCoordinator],
            ['Student Coordinator', eventConfig.studentCoordinator],
          ].map(([label, value]) => (
            <div key={label} className="flex items-start gap-3">
              <User size={18} className="mt-0.5 shrink-0 text-navy-700" />
              <div className="text-sm">
                <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
                <div className="text-slate-700">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
