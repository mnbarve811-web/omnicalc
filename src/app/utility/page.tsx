import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Utility Calculators',
  description: 'Free utility calculators for unit conversion, date differences, and geometry.',
  alternates: { canonical: '/utility' },
}

const CALCULATORS = [
  { title: 'Unit Converter', description: 'Convert between length, weight, volume, temperature, speed, area, and pressure units.', href: '/utility/unit-conversion' },
  { title: 'Date Calculator', description: 'Find the exact difference between two dates in years, months, and days.', href: '/utility/date-diff' },
  { title: 'Geometry Calculator', description: 'Calculate area, perimeter, volume, and surface area for circles, rectangles, spheres, and more.', href: '/utility/geometry' },
] as const

export default function UtilityPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Utility Calculators</h1>
        <p className="text-lg text-muted-foreground">
          Free, practical tools for everyday conversions, date calculations, and geometry.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {CALCULATORS.map((calc) => (
          <Link key={calc.href} href={calc.href}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>{calc.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{calc.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  )
}
