import { Globe } from 'lucide-react'

export default function SponsorCard({ sponsor, large = false }) {
  return (
    <a
      href={sponsor.website || '#'}
      target={sponsor.website ? '_blank' : undefined}
      rel="noreferrer"
      className={`card flex flex-col items-center justify-center gap-3 text-center transition hover:-translate-y-1 ${large ? 'py-10' : 'py-6'}`}
    >
      <div className={`flex items-center justify-center ${large ? 'h-24 w-48' : 'h-14 w-28'}`}>
        <img
          src={sponsor.logo}
          alt={sponsor.name}
          className="max-h-full max-w-full object-contain"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
      </div>
      <div>
        <div className={`font-display font-semibold text-navy-950 ${large ? 'text-lg' : 'text-sm'}`}>
          {sponsor.name}
        </div>
        <div className="mt-0.5 text-xs uppercase tracking-wide text-sky-600">{sponsor.category}</div>
      </div>
      {sponsor.website && (
        <span className="flex items-center gap-1 text-xs text-slate-400">
          <Globe size={12} /> Visit website
        </span>
      )}
    </a>
  )
}
