'use client'

import { useState } from 'react'

// data-slot="card" / "card-title" / "card-content" are kept so e2e helpers can read figures by label.
// Never nest one data-slot="card" inside another: the helpers filter cards by the label they contain.

interface ResultHeroProps {
  label: string
  value: string
  caption?: React.ReactNode
  children?: React.ReactNode
}

export function ResultHero({ label, value, caption, children }: ResultHeroProps) {
  const [initialValue] = useState(value)
  const hasChanged = value !== initialValue

  return (
    <section
      data-slot="card"
      aria-live="polite"
      aria-atomic="true"
      className="rounded-lg border border-border bg-card p-5 shadow-[0_1px_2px_rgba(20,27,45,0.04),0_8px_24px_-18px_rgba(20,27,45,0.22)] md:p-6"
    >
      <p data-slot="card-title" className="text-sm font-medium text-muted-foreground">
        {label}
      </p>
      {/* Re-keying on value restarts the flash so each change is visible; the first render never flashes */}
      <p
        key={value}
        data-slot="card-content"
        className={`mt-1 w-fit rounded-sm text-[2.75rem] font-semibold leading-none tracking-[-0.035em] tabular-nums text-foreground md:text-6xl ${hasChanged ? 'omni-flash' : ''}`}
      >
        {value}
      </p>
      {caption && <div className="mt-2 text-sm text-muted-foreground">{caption}</div>}
      {children && <div className="mt-5">{children}</div>}
    </section>
  )
}

export function ResultStats({ children }: { children: React.ReactNode }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-lg border border-border bg-card p-5 sm:grid-cols-3 md:px-6">
      {children}
    </dl>
  )
}

export function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div data-slot="card">
      <dt data-slot="card-title" className="text-xs font-medium text-muted-foreground">
        {label}
      </dt>
      <dd data-slot="card-content" className="mt-0.5 text-lg font-semibold tracking-[-0.01em] tabular-nums text-foreground">
        {value}
      </dd>
    </div>
  )
}

export interface ProportionSegment {
  label: string
  value: number
  display: string
  colorClass: string
}

export function ProportionBar({ segments, label }: { segments: ProportionSegment[]; label: string }) {
  const total = segments.reduce((sum, segment) => sum + Math.max(0, segment.value), 0)
  const visible = segments.filter((segment) => segment.value > 0)

  return (
    <figure>
      <figcaption className="sr-only">{label}</figcaption>
      <div aria-hidden className="flex h-3 gap-0.5 overflow-hidden rounded-full bg-muted">
        {total > 0 &&
          visible.map((segment) => (
            <div
              key={segment.label}
              className={`h-full transition-[flex-grow] duration-300 ease-out motion-reduce:transition-none ${segment.colorClass}`}
              style={{ flexGrow: segment.value, flexBasis: 0 }}
            />
          ))}
      </div>
      <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
        {visible.map((segment) => (
          <li key={segment.label} className="flex items-center gap-2">
            <span aria-hidden className={`h-2.5 w-2.5 shrink-0 rounded-[3px] ${segment.colorClass}`} />
            <span className="text-muted-foreground">{segment.label}</span>
            <span className="ml-auto font-medium tabular-nums text-foreground">{segment.display}</span>
            <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">
              {total > 0 ? `${Math.round((segment.value / total) * 100)}%` : ''}
            </span>
          </li>
        ))}
      </ul>
    </figure>
  )
}
