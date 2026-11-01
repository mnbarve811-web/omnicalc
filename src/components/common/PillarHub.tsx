import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PILLARS, type Pillar } from '@/lib/calculators'
import { Breadcrumbs } from './Breadcrumbs'

export function PillarHub({ pillarId }: { pillarId: Pillar['id'] }) {
  const pillar = PILLARS.find((candidate) => candidate.id === pillarId)!
  const otherPillars = PILLARS.filter((candidate) => candidate.id !== pillarId)

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-6 md:px-6 md:pt-8">
      <Breadcrumbs href={pillar.href} title={pillar.title} />
      <h1 className="mt-4 flex items-center gap-3 text-3xl font-semibold tracking-[-0.03em] md:text-[2.5rem] md:leading-[1.1]">
        <span aria-hidden className={`h-3 w-3 shrink-0 rounded-full ${pillar.dotClass}`} />
        {pillar.title}
      </h1>
      <p className="mt-2 max-w-[65ch] text-base text-muted-foreground md:text-lg">{pillar.description}</p>

      <ul className="mt-10 grid grid-cols-1 gap-x-12 border-t border-border md:grid-cols-2 md:border-t-0">
        {pillar.calculators.map((calculator) => (
          <li key={calculator.href} className="border-b border-border md:[&:nth-child(-n+2)]:border-t">
            <Link
              href={calculator.href}
              className="group flex h-full items-start justify-between gap-6 rounded-sm py-5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              <span>
                <span className="block text-lg font-semibold tracking-[-0.01em] text-foreground group-hover:text-primary">
                  {calculator.title}
                </span>
                <span className="mt-1.5 block text-sm leading-6 text-muted-foreground">{calculator.description}</span>
              </span>
              <ArrowRight
                aria-hidden
                className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-primary motion-reduce:transition-none"
              />
            </Link>
          </li>
        ))}
      </ul>

      <nav aria-label="Other categories" className="mt-16 border-t border-border pt-8">
        <h2 className="text-sm font-semibold text-foreground">Other categories</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {otherPillars.map((other) => (
            <li key={other.href}>
              <Link
                href={other.href}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm text-foreground hover:border-primary/40 hover:text-primary"
              >
                <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${other.dotClass}`} />
                {other.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  )
}
