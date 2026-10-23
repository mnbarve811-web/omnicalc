import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Financial', href: '/financial' },
  { label: 'Fitness', href: '/fitness' },
  { label: 'Math', href: '/math' },
  { label: 'Utility', href: '/utility' },
] as const

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">
          OmniCalc
        </Link>
        <nav className="hidden sm:flex gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
