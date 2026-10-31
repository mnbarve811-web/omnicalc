import Link from 'next/link'
import { findPillarByHref } from '@/lib/calculators'

export function RelatedCalculators({ href }: { href: string }) {
  const pillar = findPillarByHref(href)
  if (pillar === undefined) return null
  const related = pillar.calculators.filter((calculator) => calculator.href !== href)

  return (
    <section aria-labelledby="related-heading" className="mt-16 border-t border-border pt-10">
      <h2 id="related-heading" className="text-xl font-semibold tracking-[-0.02em]">
        More {pillar.navLabel.toLowerCase()} calculators
      </h2>
      <ul className="mt-5 grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((calculator) => (
          <li key={calculator.href} className="border-t border-border">
            <Link href={calculator.href} className="group block py-4">
              <span className="flex items-center gap-2 font-medium text-foreground group-hover:text-primary">
                <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${pillar.dotClass}`} />
                {calculator.title}
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">{calculator.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
