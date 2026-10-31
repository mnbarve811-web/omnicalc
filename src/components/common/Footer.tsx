'use cache'

import Link from 'next/link'

const FOOTER_LINKS = [
  { href: '/about#about', label: 'About' },
  { href: '/about#privacy', label: 'Privacy Policy' },
  { href: '/about#terms', label: 'Terms of Use' },
] as const

export async function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} OmniCalc. Free online calculators.
        </p>
        <nav aria-label="Site information" className="flex gap-4 text-sm">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
