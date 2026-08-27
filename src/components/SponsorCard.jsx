import { Globe, Building2 } from 'lucide-react'

export default function SponsorCard({ sponsor, large = false }) {
  const logo = sponsor.logo || sponsor.logoUrl || sponsor.logo_url
  const website = sponsor.website || sponsor.websiteUrl || sponsor.website_url
  const category = sponsor.category || sponsor.tier || 'Sponsor'
  const name = sponsor.name || 'Official Partner'

  return (
    <a
      href={website || '#'}
      target={website ? '_blank' : undefined}
      rel="noreferrer"
      className={`card flex flex-col items-center justify-center gap-3.5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover border-slate-200 bg-white ${large ? 'py-8 px-6' : 'py-6 px-4'}`}
    >
      <div className={`flex items-center justify-center rounded-xl bg-slate-50 p-2 border border-slate-100 ${large ? 'h-24 w-48' : 'h-16 w-32'}`}>
        {logo ? (
          <img
            src={logo}
            alt={name}
            className="max-h-full max-w-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="flex items-center justify-center text-navy-950 font-bold text-base">
            <Building2 size={24} className="text-sky-600 mr-1.5" />
            <span>{name.slice(0, 3).toUpperCase()}</span>
          </div>
        )}
      </div>
      <div>
        <div className={`font-display font-bold text-navy-950 ${large ? 'text-lg' : 'text-base'}`}>
          {name}
        </div>
        <div className="mt-1 inline-block rounded-full bg-sky-50 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-sky-800 border border-sky-200">
          {category}
        </div>
      </div>
      {website && (
        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-navy-950 transition">
          <Globe size={13} className="text-sky-600" /> Visit website
        </span>
      )}
    </a>
  )
}

