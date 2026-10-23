import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'OmniCalc — Free Online Calculators',
  alternates: { canonical: '/' },
}

const PILLARS = [
  {
    title: 'Financial Calculators',
    description:
      'Mortgage, auto loan, compound interest, retirement, salary, and debt payoff.',
    href: '/financial',
    count: 6,
  },
  {
    title: 'Fitness & Health',
    description: 'BMI, TDEE, body fat, macros, and pregnancy due date.',
    href: '/fitness',
    count: 5,
  },
  {
    title: 'Math & Scientific',
    description:
      'Statistics, scientific calculator, percentages, fractions, and algebra.',
    href: '/math',
    count: 5,
  },
  {
    title: 'Utility',
    description: 'Unit conversions, date calculations, and geometry.',
    href: '/utility',
    count: 3,
  },
] as const

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">OmniCalc</h1>
        <p className="text-lg text-muted-foreground">
          Free, fast, accurate calculators for financial planning, health
          tracking, math, and everyday use.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {PILLARS.map((pillar) => (
          <Link key={pillar.href} href={pillar.href}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>{pillar.title}</CardTitle>
                <CardDescription>{pillar.count} calculators</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {pillar.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  )
}
