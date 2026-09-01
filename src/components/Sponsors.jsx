import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Handshake, ArrowRight, Building2, ShieldCheck } from 'lucide-react'
import SponsorCard from './SponsorCard'
import { watchSponsors, getActiveSponsorsOnce } from '../services/sponsorService'
import seedSponsors from '../config/sponsors'

export default function Sponsors({ compact = false }) {
  const [sponsors, setSponsors] = useState(seedSponsors || [])

  useEffect(() => {
    let unsub = () => {}
    try {
      unsub = watchSponsors((list) => {
        const active = list.filter((s) => s.active !== false)
        setSponsors(active)
      })
    } catch {
      getActiveSponsorsOnce().then((list) => {
        if (list) setSponsors(list)
      })
    }
    return () => unsub()
  }, [])

  return (
    <section id="sponsors-section" className="bg-slate-50/60 py-16 md:py-20 border-t border-slate-200/80">
      <div className="section !py-0">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-950 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-sky-300">
            <Handshake size={13} className="text-sky-400" />
            Partnership &amp; Sponsorship
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
            Supported &amp; Empowered By
          </h2>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            Proudly supported by leading industry partners, corporate organizations, and academic institutions committed to youth career empowerment.
          </p>
        </div>

        {sponsors.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sponsors.map((s) => (
              <SponsorCard key={s.id || s.docId || s.name} sponsor={s} />
            ))}
          </div>
        ) : (
          /* ── Premium "Announcement Coming Soon" Card (Matches Chief Guest Panel) ── */
          <div className="mt-10 mx-auto max-w-2xl rounded-3xl border border-dashed border-sky-300/80 bg-gradient-to-br from-sky-50/60 via-white to-amber-50/30 p-8 sm:p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-950 text-sky-400 shadow-md">
              <Handshake size={28} className="text-sky-400" />
            </div>
            <h3 className="mt-5 font-display text-xl font-bold text-navy-950 sm:text-2xl">
              Official Sponsors &amp; Partners Announcement Coming Soon
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              Corporate partnerships and sponsorship confirmations for Career Guidance Program 2026 are currently in progress. The official list of brand and education partners will be published shortly.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-sky-100/80 px-4 py-1.5 text-xs font-semibold text-sky-800">
              <span className="h-2 w-2 rounded-full bg-sky-500 animate-ping" />
              Official Partner Lineup to be Released Shortly
            </div>

            <div className="mt-8 border-t border-slate-200/60 pt-6">
              <p className="text-xs text-slate-500 mb-3">
                Want to showcase your brand to 800+ graduating students?
              </p>
              <Link
                to="/sponsors"
                className="btn-primary inline-flex items-center gap-2 !py-2.5 !px-6 text-xs sm:text-sm font-semibold shadow-md"
              >
                Become a Sponsor / Partner <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {!compact && sponsors.length > 0 && (
          <div className="mt-12 text-center">
            <Link to="/sponsors" className="btn-outline inline-flex items-center gap-2">
              Become a Sponsor <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
