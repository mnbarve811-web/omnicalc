import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { findPillarByHref } from '@/lib/calculators'
import { SITE_URL } from '@/lib/site-url'
import { StructuredData } from './StructuredData'

export function Breadcrumbs({ href, title }: { href: string; title: string }) {
  const pillar = findPillarByHref(href)
  const trail = [
    { name: 'Home', href: '/' },
    ...(pillar && pillar.href !== href ? [{ name: pillar.navLabel, href: pillar.href }] : []),
    { name: title, href },
  ]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.href === '/' ? SITE_URL : `${SITE_URL}${item.href}`,
    })),
  }

  return (
    <nav aria-label="Breadcrumb">
      <StructuredData schemas={[schema]} />
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1
          return (
            <li key={item.href} className="flex items-center gap-1">
              {isLast ? (
                <span aria-current="page" className="text-foreground">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.href} className="rounded-sm py-1 hover:text-foreground">
                    {item.name}
                  </Link>
                  <ChevronRight aria-hidden className="h-3.5 w-3.5" />
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
