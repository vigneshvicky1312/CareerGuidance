import { useState } from 'react'
import colleges from '../config/colleges'
import { School2, Search, X, Building2, Sparkles, CheckCircle2 } from 'lucide-react'

export default function ParticipatingColleges() {
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')

  const half = Math.ceil(colleges.length / 2)
  const row1 = colleges.slice(0, half)
  const row2 = colleges.slice(half)

  const filtered = colleges.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase().trim())
  )

  return (
    <section className="bg-slate-50/70 py-16 md:py-20 overflow-hidden border-t border-slate-200/80">
      <div className="section !py-0">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">
            <School2 size={14} className="text-sky-500" /> Academic Representation
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-navy-950 sm:text-4xl">
            40+ Participating Colleges &amp; Universities
          </h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            Final-year undergraduate delegations from autonomous, government, and premier affiliated Arts &amp; Science colleges across Tamil Nadu.
          </p>
        </div>
      </div>

      {/* Infinite Marquee Strip: Lane 1 */}
      <div className="relative mt-10 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max gap-3.5 animate-marquee-slow hover:[animation-play-state:paused]">
          {[...row1, ...row1].map((col, idx) => (
            <div
              key={`${col}-${idx}`}
              className="flex items-center gap-2.5 rounded-full border border-slate-200/90 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:border-sky-300 hover:text-navy-950 transition"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy-950 text-gold-400 text-[10px]">
                <Building2 size={11} />
              </span>
              <span className="truncate max-w-[280px]">{col}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Infinite Marquee Strip: Lane 2 (Reverse) */}
      <div className="relative mt-3.5 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max gap-3.5 animate-marquee-reverse hover:[animation-play-state:paused]">
          {[...row2, ...row2].map((col, idx) => (
            <div
              key={`${col}-${idx}`}
              className="flex items-center gap-2.5 rounded-full border border-slate-200/90 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:border-sky-300 hover:text-navy-950 transition"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sky-400 text-[10px]">
                <School2 size={11} />
              </span>
              <span className="truncate max-w-[280px]">{col}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button to Open Full Directory */}
      <div className="mt-8 text-center">
        <button
          onClick={() => setShowModal(true)}
          className="btn-outline !py-2.5 !px-5 text-xs inline-flex items-center gap-2"
        >
          <Search size={14} /> Search All {colleges.length} Participating Colleges
        </button>
      </div>

      {/* Full Modal Directory with Instant Search */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-navy-950">
                  Participating Colleges ({colleges.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Search or verify your institution's registration
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mt-4">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search college name..."
                className="pl-10 text-xs sm:text-sm"
                autoFocus
              />
            </div>

            {/* List of Colleges */}
            <div className="mt-4 flex-1 overflow-y-auto pr-1 space-y-2 max-h-[50vh]">
              {filtered.length > 0 ? (
                filtered.map((col, idx) => (
                  <div
                    key={col}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs sm:text-sm font-medium text-slate-800"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white font-mono text-[10px] font-bold text-slate-500 shadow-sm">
                      {idx + 1}
                    </span>
                    <span className="leading-tight">{col}</span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  No colleges matched "{search}".
                </div>
              )}
            </div>

            <div className="mt-4 border-t border-slate-100 pt-3 text-right">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl bg-navy-950 px-5 py-2 text-xs font-semibold text-white hover:bg-navy-900"
              >
                Close Directory
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

