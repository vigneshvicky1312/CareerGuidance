import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Handshake } from 'lucide-react'
import SponsorCard from './SponsorCard'
import { watchSponsors, getActiveSponsorsOnce } from '../services/sponsorService'
import seedSponsors from '../config/sponsors'

export default function Sponsors({ compact = false }) {
  const [sponsors, setSponsors] = useState(seedSponsors)

  useEffect(() => {
    let unsub = () => {}
    try {
      unsub = watchSponsors((list) => {
        const active = list.filter((s) => s.active !== false)
        if (active.length) setSponsors(active)
      })
    } catch {
      getActiveSponsorsOnce().then((list) => list.length && setSponsors(list))
    }
    return () => unsub()
  }, [])

  return (
    <section id="sponsors-section" className="section">
      <div className="text-center max-w-3xl mx-auto">
        <span className="eyebrow !text-sky-600">
          <Handshake size={14} className="text-sky-600" /> Our Sponsors &amp; Partners
        </span>
        <h2 className="mt-3 text-3xl font-extrabold text-navy-950 sm:text-4xl">
          Supported &amp; Empowered By
        </h2>
        <p className="mt-3 text-sm text-slate-600 sm:text-base">
          Proudly supported by leading industry partners, organizations, and academic institutions committed to youth career development.
        </p>
      </div>

      {sponsors.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sponsors.map((s) => (
            <SponsorCard key={s.id || s.docId || s.name} sponsor={s} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 text-sm">
          Sponsor partners will be announced shortly.
        </div>
      )}

      {!compact && (
        <div className="mt-10 text-center">
          <Link to="/sponsors" className="btn-outline">
            Become a Sponsor
          </Link>
        </div>
      )}
    </section>
  )
}

