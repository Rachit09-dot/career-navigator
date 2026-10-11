import { useState, useRef, useEffect } from 'react'
import { MapPin, X } from 'lucide-react'
import INDIA_LOCATIONS from '../data/cities'
import { useTheme } from '../context/ThemeContext'

interface Props {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export default function LocationAutocomplete({ value, onChange, placeholder = 'Type city or state...' }: Props) {
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = query.length >= 2
    ? INDIA_LOCATIONS.filter(l => l.toLowerCase().includes(query.toLowerCase())).slice(0, 10)
    : []

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

  const select = (loc: string) => {
    setQuery(loc)
    onChange(loc)
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || filtered.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)) }
    if (e.key === 'Enter') { e.preventDefault(); select(filtered[highlighted]) }
    if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
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
        {query && (
          <button onClick={() => { setQuery(''); onChange(''); setOpen(false) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border-2 border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-56 overflow-y-auto">
          {filtered.map((loc, i) => (
            <button key={loc} onMouseDown={() => select(loc)}
              className={`w-full text-left px-4 py-2.5 flex items-center gap-2 text-sm transition-colors ${
                i === highlighted ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-700'
              }`}>
              <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
              <span>{loc}</span>
            </button>
          ))}
          <button onMouseDown={() => select(query)}
            className="w-full text-left px-4 py-2.5 flex items-center gap-2 text-sm text-slate-500 hover:bg-slate-50 border-t border-slate-100">
            <span className="text-indigo-500 font-bold">+</span>
            <span>Add "<strong>{query}</strong>" manually</span>
          </button>
        </div>
      )}

      {open && query.length >= 2 && filtered.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border-2 border-slate-200 rounded-xl shadow-xl">
          <button onMouseDown={() => select(query)}
            className="w-full text-left px-4 py-3 flex items-center gap-2 text-sm text-slate-600 hover:bg-slate-50">
            <span className="text-indigo-500 font-bold">+</span>
            <span>Add "<strong>{query}</strong>"</span>
          </button>
        </div>
      )}
    </div>
  )
}
