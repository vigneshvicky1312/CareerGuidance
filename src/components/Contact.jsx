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

      <div className="mt-10 grid gap-6 sm:gap-8 md:grid-cols-2">
        <div className="card space-y-4 min-w-0 p-5 sm:p-6">
          <div className="flex items-start gap-3 min-w-0">
            <MapPin size={18} className="mt-0.5 shrink-0 text-navy-700" />
            <div className="text-sm text-slate-600 min-w-0 flex-1">
              <div className="font-semibold text-navy-950 break-words">
                {eventConfig.collegeName}
              </div>
              <p className="text-xs text-slate-500 font-medium break-words">{eventConfig.universityName}</p>
              <p className="mt-1 break-words">{eventConfig.instituteAddress}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 min-w-0">
            <Phone size={18} className="shrink-0 text-navy-700" />
            <a href={`tel:${eventConfig.phone}`} className="text-sm text-slate-600 hover:text-navy-800 break-all">
              {eventConfig.phone}
            </a>
          </div>
          <div className="flex items-center gap-3 min-w-0">
            <Mail size={18} className="shrink-0 text-navy-700" />
            <a href={`mailto:${eventConfig.email}`} className="text-sm text-slate-600 hover:text-navy-800 break-all">
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

        <div className="card space-y-4 min-w-0 p-5 sm:p-6">
          {[
            ['Director cum Head of Department', eventConfig.director],
            ['Faculty Coordinator', eventConfig.facultyCoordinator],
            ['Student Coordinator', eventConfig.studentCoordinator],
          ].map(([label, value]) => (
            <div key={label} className="flex items-start gap-3 min-w-0">
              <User size={18} className="mt-0.5 shrink-0 text-navy-700" />
              <div className="text-sm min-w-0 flex-1">
                <div className="text-xs uppercase tracking-wide text-slate-400 font-medium">{label}</div>
                <div className="text-slate-700 break-words mt-0.5">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
