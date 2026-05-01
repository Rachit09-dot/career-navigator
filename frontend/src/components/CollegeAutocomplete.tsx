import { useState, useRef, useEffect, useCallback } from 'react'
import { Search, X, GraduationCap, Loader2 } from 'lucide-react'
import INDIA_COLLEGES from '../data/colleges'
import { useTheme } from '../context/ThemeContext'

interface Props {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

// Debounce helper
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function CollegeAutocomplete({ value, onChange, placeholder = 'Search your college...' }: Props) {
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const [apiResults, setApiResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debouncedQuery = useDebounce(query, 350)

  // Local static results (instant)
  const localResults = query.length >= 2
    ? INDIA_COLLEGES.filter(c => c.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : []

  // Merge: local first, then API (deduplicated)
  const allResults = [
    ...localResults,
    ...apiResults.filter(r => !localResults.some(l => l.toLowerCase() === r.toLowerCase()))
  ].slice(0, 12)

  // Fetch from HipoLabs API (free, no key needed)
  useEffect(() => {
    if (debouncedQuery.length < 3) { setApiResults([]); return }
    setLoading(true)
    const controller = new AbortController()
    fetch(
      `https://universities.hipolabs.com/search?country=India&name=${encodeURIComponent(debouncedQuery)}`,
      { signal: controller.signal }
    )
      .then(r => r.json())
      .then((data: Array<{ name: string }>) => {
        setApiResults(data.map(d => d.name).slice(0, 10))
        setLoading(false)
      })
      .catch(() => setLoading(false))
    return () => controller.abort()
  }, [debouncedQuery])

  useEffect(() => { setQuery(value) }, [value])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const select = (college: string) => {
    setQuery(college)
    onChange(college)
    setOpen(false)
    setApiResults([])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || allResults.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h + 1, allResults.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)) }
    if (e.key === 'Enter') { e.preventDefault(); if (allResults[highlighted]) select(allResults[highlighted]) }
    if (e.key === 'Escape') setOpen(false)
  }

  const showDropdown = open && query.length >= 2 && (allResults.length > 0 || loading)

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); setHighlighted(0) }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-9 pr-9 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all text-sm"
          autoComplete="off"
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 animate-spin" />}
        {!loading && query && (
          <button onClick={() => { setQuery(''); onChange(''); setOpen(false); setApiResults([]) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-white border-2 border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-64 overflow-y-auto">
          {allResults.map((college, i) => (
            <button key={college} onMouseDown={() => select(college)}
              className={`w-full text-left px-4 py-2.5 flex items-center gap-2 text-sm transition-colors ${
                i === highlighted ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-700'
              }`}>
              <GraduationCap className="w-4 h-4 flex-shrink-0 text-slate-400" />
              <span className="truncate">{college}</span>
            </button>
          ))}
          {loading && allResults.length === 0 && (
            <div className="px-4 py-3 text-sm text-slate-500 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Searching colleges...
            </div>
          )}
          <button onMouseDown={() => select(query)}
            className="w-full text-left px-4 py-2.5 flex items-center gap-2 text-sm text-slate-500 hover:bg-slate-50 border-t border-slate-100">
            <span className="text-indigo-500 font-bold">+</span>
            <span>Add "<strong>{query}</strong>" manually</span>
          </button>
        </div>
      )}

      {open && query.length >= 2 && !loading && allResults.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border-2 border-slate-200 rounded-xl shadow-xl">
          <button onMouseDown={() => select(query)}
            className="w-full text-left px-4 py-3 flex items-center gap-2 text-sm text-slate-600 hover:bg-slate-50">
            <span className="text-indigo-500 font-bold">+</span>
            <span>Add "<strong>{query}</strong>" as your college</span>
          </button>
        </div>
      )}
    </div>
  )
}
