import eventConfig from '../config/eventConfig'
import LocationQR from './LocationQR'
import { MapPin, Navigation, ExternalLink } from 'lucide-react'

export default function LocationSection() {
  return (
    <section id="location" className="section">
      <p className="eyebrow">Event Location</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy-950 md:text-4xl">
        Find your way to the venue
      </h2>
      <p className="mt-2 text-sm text-slate-600 sm:text-base">
        Join us at the landmark {eventConfig.venue} for the Career Guidance Program 2026.
      </p>

      {/* Top Grid: Venue Card & QR Code */}
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="card flex flex-col justify-between">
          <div>
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-950 text-gold-400 shadow-sm">
                <MapPin size={22} />
              </span>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-600">
                  Official Venue
                </span>
                <h3 className="font-display text-xl font-bold text-navy-950 sm:text-2xl mt-0.5">
                  {eventConfig.venue}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{eventConfig.address}</p>
                {eventConfig.landmark && (
                  <p className="mt-1 text-xs text-slate-500">
                    <span className="font-medium text-slate-700">Landmark:</span> {eventConfig.landmark}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900">
                Auditorium Facilities
              </h4>
              <ul className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <li className="flex items-center gap-1.5">✓ Air-Conditioned Hall</li>
                <li className="flex items-center gap-1.5">✓ Ample Student Seating</li>
                <li className="flex items-center gap-1.5">✓ Registration Desks</li>
                <li className="flex items-center gap-1.5">✓ Two-Wheeler / Bus Parking</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={eventConfig.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary w-full sm:w-auto"
            >
              <Navigation size={16} /> Open in Google Maps
            </a>
            <a
              href={eventConfig.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-outline !py-2.5 text-xs w-full sm:w-auto flex items-center justify-center gap-1.5"
            >
              Get Directions <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <LocationQR />
      </div>

      {/* Embedded Google Map */}
      {eventConfig.googleMapsEmbedUrl && (
        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-card">
          <div className="mb-2 flex items-center justify-between px-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-700">
                Interactive Venue Map
              </span>
            </div>
            <a
              href={eventConfig.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-sky-600 hover:underline flex items-center gap-1"
            >
              View Larger Map <ExternalLink size={12} />
            </a>
          </div>
          <div className="relative aspect-[16/9] w-full min-h-[350px] max-h-[480px] overflow-hidden rounded-2xl bg-slate-100">
            <iframe
              src={eventConfig.googleMapsEmbedUrl}
              title={eventConfig.venue}
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      )}
    </section>
  )
}
