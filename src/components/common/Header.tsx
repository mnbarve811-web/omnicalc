'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { PILLARS } from '@/lib/calculators'
import { CalculatorSearch } from './CalculatorSearch'

export function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 md:px-6">
        <Link href="/" className="text-lg font-semibold tracking-[-0.02em] text-foreground">
          OmniCalc
        </Link>

        <nav aria-label="Calculator categories" className="hidden flex-1 items-center gap-1 sm:flex">
          {PILLARS.map((pillar) => (
            <Link
              key={pillar.href}
              href={pillar.href}
              aria-current={isActive(pillar.href) ? 'page' : undefined}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-secondary hover:text-foreground aria-[current=page]:text-foreground"
            >
              <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${pillar.dotClass}`} />
              {pillar.navLabel}
            </Link>
          ))}
        </nav>

        <CalculatorSearch className="hidden w-64 md:block" />

        <button
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="-mr-2 ml-auto flex h-11 w-11 items-center justify-center rounded-md text-foreground hover:bg-secondary sm:hidden"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isMenuOpen && (
        <div id="mobile-menu" className="max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-border px-4 pb-6 pt-4 sm:hidden">
          <CalculatorSearch onNavigate={() => setIsMenuOpen(false)} />
          <nav aria-label="All calculators" className="mt-5 grid gap-6">
            {PILLARS.map((pillar) => (
              <div key={pillar.href}>
                <Link
                  href={pillar.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-1 text-sm font-semibold text-foreground"
                >
                  <span aria-hidden className={`h-2 w-2 rounded-full ${pillar.dotClass}`} />
                  {pillar.title}
                </Link>
                <ul className="mt-1 grid grid-cols-2 gap-x-4">
                  {pillar.calculators.map((calculator) => (
                    <li key={calculator.href}>
                      <Link
                        href={calculator.href}
                        onClick={() => setIsMenuOpen(false)}
                        aria-current={pathname === calculator.href ? 'page' : undefined}
                        className="block py-2.5 text-sm text-muted-foreground aria-[current=page]:font-medium aria-[current=page]:text-foreground"
                      >
                        {calculator.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
