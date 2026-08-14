import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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

  const title = sponsors.find((s) => s.category === 'Title Sponsor')
  const rest = sponsors.filter((s) => s.category !== 'Title Sponsor')

  return (
    <section id="sponsors-section" className="section">
      <p className="eyebrow">Our Sponsors &amp; Partners</p>
      <h2 className="mt-2 text-3xl font-bold text-navy-950 md:text-4xl">Supported by</h2>

      {title && (
        <div className="mt-10">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-gold-500">
            Title Sponsor
          </p>
          <div className="mx-auto max-w-sm">
            <SponsorCard sponsor={title} large />
          </div>
        </div>
      )}

      {rest.length > 0 && (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((s) => (
            <SponsorCard key={s.id || s.name} sponsor={s} />
          ))}
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
