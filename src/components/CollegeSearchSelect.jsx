import { useState, useRef, useEffect, useMemo } from 'react'
import colleges from '../config/colleges'
import { Search, ChevronDown, Check, Plus, X } from 'lucide-react'

export default function CollegeSearchSelect({
  value,
  onChange,
  error,
  id = 'college',
  placeholder = 'Search college or type your own...',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState(value || '')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  // Sync internal query when external value changes
  useEffect(() => {
    setQuery(value || '')
  }, [value])

  // Filtered colleges based on search query
  const filteredColleges = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return colleges
    return colleges.filter((c) => c.toLowerCase().includes(q))
  }, [query])

  // Check if current query exactly matches an existing college in the list
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
        // If user typed something and closed without selecting, accept what they typed
        if (query.trim() !== (value || '')) {
          onChange(query.trim())
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [query, value, onChange])

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
    setQuery(collegeName)
    onChange(collegeName)
    setIsOpen(false)
    setHighlightedIndex(-1)
    inputRef.current?.blur()
  }

  function handleClear() {
    setQuery('')
    onChange('')
    setIsOpen(true)
    setHighlightedIndex(-1)
    inputRef.current?.focus()
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
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input container */}
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
          className={`pl-10 pr-20 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
        />

        <div className="absolute right-2 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              title="Clear"
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
          >
            <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 max-h-72 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          {/* Header count info */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-3.5 py-2 text-xs text-slate-500 font-medium">
            <span>
              {query.trim()
                ? `${filteredColleges.length} result${filteredColleges.length === 1 ? '' : 's'} found`
                : `${colleges.length} participating colleges`}
            </span>
            <span className="text-[11px] text-slate-400">Type to search or enter custom</span>
          </div>

          <ul ref={listRef} className="max-h-60 overflow-y-auto py-1 text-sm" role="listbox">
            {/* Custom option when query isn't an exact match */}
            {showCustomOption && (
              <li
                role="option"
                aria-selected={highlightedIndex === filteredColleges.length}
                onClick={() => handleSelect(query.trim())}
                onMouseEnter={() => setHighlightedIndex(filteredColleges.length)}
                className={`flex cursor-pointer items-start gap-2.5 px-3.5 py-2.5 text-navy-950 transition border-b border-slate-100 bg-amber-50/50 hover:bg-amber-50 ${
                  highlightedIndex === filteredColleges.length ? 'bg-amber-100/70 font-semibold' : ''
                }`}
              >
                <Plus size={16} className="mt-0.5 shrink-0 text-amber-600" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                    Use Custom College Name:
                  </div>
                  <div className="text-sm font-medium text-slate-900 break-words">"{query.trim()}"</div>
                </div>
              </li>
            )}

            {/* Filtered list items */}
            {filteredColleges.map((c, idx) => {
              const isSelected = value === c
              const isHighlighted = highlightedIndex === idx

              return (
                <li
                  key={c}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(c)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`flex cursor-pointer items-center justify-between px-3.5 py-2.5 transition text-slate-800 ${
                    isSelected
                      ? 'bg-navy-50 font-semibold text-navy-900'
                      : isHighlighted
                      ? 'bg-slate-100'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="break-words pr-2">{c}</span>
                  {isSelected && <Check size={16} className="shrink-0 text-navy-700" />}
                </li>
              )
            })}

            {filteredColleges.length === 0 && !showCustomOption && (
              <li className="px-3.5 py-6 text-center text-sm text-slate-400">
                No colleges found. Type your college name above to add it.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
