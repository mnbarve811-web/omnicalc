'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { ALL_CALCULATORS } from '@/lib/calculators'

const MAX_RESULTS = 8

function matchCalculators(query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return []
  return ALL_CALCULATORS.filter((calculator) => {
    const haystack = `${calculator.title} ${calculator.name} ${calculator.keywords} ${calculator.pillar.navLabel}`.toLowerCase()
    return terms.every((term) => haystack.includes(term))
  }).slice(0, MAX_RESULTS)
}

interface CalculatorSearchProps {
  onNavigate?: () => void
  className?: string
}

export function CalculatorSearch({ onNavigate, className = '' }: CalculatorSearchProps) {
  const router = useRouter()
  const listId = useId()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const results = matchCalculators(query)
  const showList = isOpen && query.trim().length > 0

  function finish() {
    setQuery('')
    setIsOpen(false)
    onNavigate?.()
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' && results.length > 0) {
      event.preventDefault()
      setIsOpen(true)
      setActiveIndex((index) => (index + 1) % results.length)
      return
    }
    if (event.key === 'ArrowUp' && results.length > 0) {
      event.preventDefault()
      setActiveIndex((index) => (index - 1 + results.length) % results.length)
      return
    }
    if (event.key === 'Enter' && showList && results[activeIndex]) {
      event.preventDefault()
      router.push(results[activeIndex].href)
      finish()
      return
    }
    if (event.key === 'Escape') {
      setQuery('')
      setIsOpen(false)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        role="combobox"
        aria-label="Search calculators"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList && results[activeIndex] ? `${listId}-${activeIndex}` : undefined}
        placeholder="Search calculators"
        autoComplete="off"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setActiveIndex(0)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onKeyDown={handleKeyDown}
        className="h-11 w-full rounded-md border border-border bg-card pl-9 pr-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:border-input focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25 md:h-9 md:text-sm [&::-webkit-search-cancel-button]:hidden"
      />
      {showList && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Matching calculators"
          className="absolute inset-x-0 top-full z-50 mt-1.5 max-h-96 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-[0_12px_32px_-12px_rgba(20,27,45,0.28)]"
        >
          {results.length === 0 ? (
            <li className="px-3 py-2.5 text-sm text-muted-foreground">
              No calculator matches “{query.trim()}”. Try a broader word, like loan or weight.
            </li>
          ) : (
            results.map((calculator, index) => (
              <li key={calculator.href} id={`${listId}-${index}`} role="option" aria-selected={index === activeIndex}>
                <Link
                  href={calculator.href}
                  tabIndex={-1}
                  // Keeps focus in the input so its blur doesn't unmount the list before the click lands
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={finish}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm ${index === activeIndex ? 'bg-accent text-accent-foreground' : 'text-foreground'}`}
                >
                  <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${calculator.pillar.dotClass}`} />
                  <span className="flex-1">{calculator.title}</span>
                  <span className="text-xs text-muted-foreground">{calculator.pillar.navLabel}</span>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
