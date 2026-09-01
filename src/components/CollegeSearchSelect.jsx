import { useState, useRef, useEffect, useMemo } from 'react'
import colleges, { getCollegeMeta, popularColleges } from '../config/colleges'
import {
  Search,
  ChevronDown,
  Check,
  Plus,
  X,
  Building2,
  GraduationCap,
  Sparkles,
  MapPin,
  Edit3,
} from 'lucide-react'

// Helper to highlight matching text in college name
function HighlightedText({ text, query }) {
  if (!query || !query.trim()) return <span>{text}</span>

  const terms = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)

  // Escape special regex characters in terms
  const escapedTerms = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  if (escapedTerms.length === 0) return <span>{text}</span>

  const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi')
  const parts = text.split(regex)

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="rounded bg-amber-100/90 px-0.5 font-bold text-amber-900 ring-1 ring-amber-200/50"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  )
}

const CATEGORY_TABS = [
  { id: 'all', label: 'All' },
  { id: 'autonomous', label: 'Autonomous' },
  { id: 'govt', label: 'Government' },
  { id: 'women', label: "Women's" },
  { id: 'pudukkottai', label: 'Pudukkottai' },
  { id: 'sivagangai', label: 'Sivagangai' },
  { id: 'ramanathapuram', label: 'Ramanathapuram' },
]

export default function CollegeSearchSelect({
  value,
  onChange,
  onDistrictSuggest,
  error,
  id = 'college',
  placeholder = 'Search 70+ participating colleges or type your college...',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState(value || '')
  const [activeTab, setActiveTab] = useState('all')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [isEditingCustom, setIsEditingCustom] = useState(false)

  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  // Sync internal query when external value changes
  useEffect(() => {
    setQuery(value || '')
  }, [value])

  // Get metadata for current selected value
  const selectedMeta = useMemo(() => {
    if (!value) return null
    return getCollegeMeta(value)
  }, [value])

  // Filtered colleges based on search query + category tab
  const filteredColleges = useMemo(() => {
    const q = query.trim().toLowerCase()
    const terms = q.split(/\s+/).filter(Boolean)

    return colleges.filter((c) => {
      const meta = getCollegeMeta(c)
      const lower = c.toLowerCase()

      // Tab filter
      if (activeTab === 'autonomous' && !meta.isAutonomous) return false
      if (activeTab === 'govt' && !meta.isGovt) return false
      if (activeTab === 'women' && !meta.isWomen) return false
      if (activeTab === 'pudukkottai' && meta.district !== 'Pudukkottai') return false
      if (activeTab === 'sivagangai' && meta.district !== 'Sivagangai') return false
      if (activeTab === 'ramanathapuram' && meta.district !== 'Ramanathapuram') return false

      // Search terms match (all terms must match name or district)
      if (terms.length > 0) {
        return terms.every(
          (t) =>
            lower.includes(t) ||
            (meta.district && meta.district.toLowerCase().includes(t)) ||
            (meta.typeTag && meta.typeTag.toLowerCase().includes(t))
        )
      }

      return true
    })
  }, [query, activeTab])

  // Check if current query exactly matches an existing college
  const isExactMatch = useMemo(() => {
    const q = query.trim().toLowerCase()
    return colleges.some((c) => c.toLowerCase() === q)
  }, [query])

  const showCustomOption = query.trim().length > 0 && !isExactMatch

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
        setIsEditingCustom(false)
        // If user typed something and closed without selecting, accept what they typed
        if (query.trim() !== (value || '')) {
          handleSelect(query.trim())
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [query, value])

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[highlightedIndex]
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [highlightedIndex])

  function handleInputChange(e) {
    const newQuery = e.target.value
    setQuery(newQuery)
    onChange(newQuery)
    setIsOpen(true)
    setHighlightedIndex(0)
  }

  function handleSelect(collegeName) {
    const trimmed = collegeName.trim()
    setQuery(trimmed)
    onChange(trimmed)
    setIsOpen(false)
    setIsEditingCustom(false)
    setHighlightedIndex(-1)
    inputRef.current?.blur()

    // Auto-suggest district if available
    const meta = getCollegeMeta(trimmed)
    if (meta?.district && onDistrictSuggest) {
      onDistrictSuggest(meta.district)
    }
  }

  function handleClear() {
    setQuery('')
    onChange('')
    setIsOpen(true)
    setIsEditingCustom(false)
    setHighlightedIndex(-1)
    inputRef.current?.focus()
  }

  function handleStartEditing() {
    setIsEditingCustom(true)
    setIsOpen(true)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 50)
  }

  function handleKeyDown(e) {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true)
      return
    }

    const totalOptions = filteredColleges.length + (showCustomOption ? 1 : 0)

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev + 1) % (totalOptions || 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev - 1 + totalOptions) % (totalOptions || 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (isOpen) {
        if (highlightedIndex >= 0 && highlightedIndex < filteredColleges.length) {
          handleSelect(filteredColleges[highlightedIndex])
        } else if (showCustomOption && highlightedIndex === filteredColleges.length) {
          handleSelect(query.trim())
        } else if (query.trim()) {
          handleSelect(query.trim())
        }
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setIsEditingCustom(false)
    }
  }

  // If a college is already selected and user is not actively searching/editing
  const showSelectedCard = value && !isOpen && !isEditingCustom

  return (
    <div ref={containerRef} className="relative w-full">
      {showSelectedCard ? (
        /* ── Selected College Premium Card View ── */
        <div
          onClick={handleStartEditing}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleStartEditing()
            }
          }}
          className="group relative flex cursor-pointer items-center justify-between rounded-xl border border-sky-200 bg-gradient-to-r from-sky-50/70 via-indigo-50/40 to-white p-3.5 shadow-sm transition hover:border-sky-300 hover:shadow-md"
        >
          <div className="flex items-start gap-3 pr-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-950 text-gold-400 shadow-sm transition group-hover:scale-105">
              <GraduationCap size={18} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-700">
                  Selected Institution
                </span>
                {selectedMeta?.typeTag && (
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                      selectedMeta.isAutonomous
                        ? 'bg-amber-100 text-amber-800'
                        : selectedMeta.isGovt
                        ? 'bg-sky-100 text-sky-800'
                        : selectedMeta.isWomen
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {selectedMeta.typeTag}
                  </span>
                )}
                {selectedMeta?.district && (
                  <span className="inline-flex items-center gap-0.5 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                    <MapPin size={10} /> {selectedMeta.district}
                  </span>
                )}
                {!selectedMeta && (
                  <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                    Custom Entry
                  </span>
                )}
              </div>
              <p className="mt-0.5 font-semibold text-navy-950 text-sm sm:text-base leading-snug break-words">
                {value}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleStartEditing()
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-navy-950"
            >
              <Edit3 size={13} /> Change
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              title="Clear selection"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        /* ── Search Input Field ── */
        <div className="relative flex items-center">
          <span className="pointer-events-none absolute left-3.5 text-slate-400">
            <Search size={16} />
          </span>

          <input
            ref={inputRef}
            id={id}
            type="text"
            autoComplete="off"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`pl-10 pr-20 text-sm transition focus:ring-2 focus:ring-sky-500/20 ${
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
            }`}
          />

          <div className="absolute right-2 flex items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                title="Clear input"
              >
                <X size={15} />
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setIsOpen((prev) => !prev)
                inputRef.current?.focus()
              }}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              tabIndex={-1}
              aria-label="Toggle college list"
            >
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-navy-900' : ''}`}
              />
            </button>
          </div>
        </div>
      )}

      {/* ── Dropdown Menu Popover ── */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 max-h-96 w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-100 bg-slate-50/90 px-3 py-2 scrollbar-none">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id)
                    setHighlightedIndex(0)
                  }}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                    isActive
                      ? 'bg-navy-950 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Quick Popular Picks (Visible when query is empty) */}
          {!query.trim() && activeTab === 'all' && (
            <div className="border-b border-slate-100 bg-gradient-to-b from-sky-50/40 to-transparent p-3">
              <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-800">
                <Sparkles size={13} className="text-amber-500" />
                Frequently Selected Colleges
              </div>
              <div className="flex flex-wrap gap-1.5">
                {popularColleges.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => handleSelect(col)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs hover:border-sky-400 hover:bg-sky-50 hover:text-sky-900 transition"
                  >
                    <Building2 size={11} className="text-sky-500 shrink-0" />
                    <span className="truncate max-w-[220px] sm:max-w-xs">{col}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Result Count Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-3.5 py-1.5 text-[11px] font-medium text-slate-500">
            <span>
              {query.trim()
                ? `${filteredColleges.length} institution${filteredColleges.length === 1 ? '' : 's'} found`
                : `${filteredColleges.length} colleges listed`}
            </span>
            <span className="text-slate-400 text-[10px]">
              ↑↓ keys to navigate • Enter to select
            </span>
          </div>

          {/* College Items List */}
          <ul ref={listRef} className="max-h-64 overflow-y-auto py-1 text-sm divide-y divide-slate-50" role="listbox">
            {/* Custom option when typed text isn't in the list */}
            {showCustomOption && (
              <li
                role="option"
                aria-selected={highlightedIndex === filteredColleges.length}
                onClick={() => handleSelect(query.trim())}
                onMouseEnter={() => setHighlightedIndex(filteredColleges.length)}
                className={`group flex cursor-pointer items-start gap-2.5 border-b border-amber-200/60 bg-amber-50/70 p-3 transition hover:bg-amber-100/80 ${
                  highlightedIndex === filteredColleges.length ? 'bg-amber-100 font-semibold' : ''
                }`}
              >
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-500 text-white shadow-xs">
                  <Plus size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-800">
                    <span>Use Custom College Name</span>
                    <span className="rounded bg-amber-200/80 px-1 py-0.2 text-[9px] text-amber-900 font-bold">
                      Not Listed
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs sm:text-sm font-semibold text-slate-900 break-words">
                    "{query.trim()}"
                  </div>
                  <p className="mt-0.5 text-[11px] text-amber-700/90">
                    Click or press Enter to register with this institution name.
                  </p>
                </div>
              </li>
            )}

            {/* Filtered list items */}
            {filteredColleges.map((c, idx) => {
              const isSelected = value === c
              const isHighlighted = highlightedIndex === idx
              const meta = getCollegeMeta(c)

              return (
                <li
                  key={c}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(c)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`group flex cursor-pointer items-start justify-between gap-3 px-3.5 py-2.5 transition ${
                    isSelected
                      ? 'bg-sky-50 font-semibold text-navy-950'
                      : isHighlighted
                      ? 'bg-slate-100 text-slate-900'
                      : 'hover:bg-slate-50/80 text-slate-700'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 leading-snug">
                      <GraduationCap
                        size={14}
                        className={`shrink-0 ${
                          isSelected ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      <span className="text-xs sm:text-sm text-slate-900 break-words">
                        <HighlightedText text={c} query={query} />
                      </span>
                    </div>

                    {/* Metadata tags */}
                    <div className="mt-1 flex flex-wrap items-center gap-1 pl-5">
                      {meta?.typeTag && (
                        <span
                          className={`rounded px-1.5 py-0.2 text-[10px] font-semibold ${
                            meta.isAutonomous
                              ? 'bg-amber-100 text-amber-800'
                              : meta.isGovt
                              ? 'bg-sky-100 text-sky-800'
                              : meta.isWomen
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {meta.typeTag}
                        </span>
                      )}
                      {meta?.district && (
                        <span className="inline-flex items-center gap-0.5 rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-500">
                          <MapPin size={9} /> {meta.district}
                        </span>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-600 text-white shadow-xs">
                      <Check size={12} />
                    </span>
                  )}
                </li>
              )
            })}

            {filteredColleges.length === 0 && !showCustomOption && (
              <li className="px-4 py-8 text-center">
                <Building2 size={28} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-medium text-slate-700">No colleges matched "{query}"</p>
                <p className="mt-1 text-xs text-slate-500">
                  Type your college's full name to add it as a custom entry.
                </p>
              </li>
            )}
          </ul>

          {/* Footer help tip */}
          <div className="border-t border-slate-100 bg-slate-50 px-3.5 py-2 text-center text-[11px] text-slate-500">
            Can't find your college? Type the full college name and select "Use Custom College Name".
          </div>
        </div>
      )}
    </div>
  )
}
