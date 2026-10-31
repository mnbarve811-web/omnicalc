'use cache'

import Link from 'next/link'
import { PILLARS } from '@/lib/calculators'

const FOOTER_LINKS = [
  { href: '/about#about', label: 'About' },
  { href: '/about#privacy', label: 'Privacy Policy' },
  { href: '/about#terms', label: 'Terms of Use' },
] as const

export async function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <nav aria-label="All calculators" className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {PILLARS.map((pillar) => (
            <div key={pillar.href}>
              <Link href={pillar.href} className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary">
                <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${pillar.dotClass}`} />
                {pillar.navLabel}
              </Link>
              <ul className="mt-3 space-y-1">
                {pillar.calculators.map((calculator) => (
                  <li key={calculator.href}>
                    <Link href={calculator.href} className="inline-block py-1 text-sm text-muted-foreground hover:text-foreground">
                      {calculator.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} OmniCalc. Free online calculators.
          </p>
          <nav aria-label="Site information" className="flex gap-5 text-sm">
            {FOOTER_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
