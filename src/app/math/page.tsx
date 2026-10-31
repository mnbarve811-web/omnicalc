import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Math & Scientific Calculators',
  description: 'Free math calculators for statistics, scientific expressions, percentages, fractions, and quadratic equations.',
  alternates: { canonical: '/math' },
}

const CALCULATORS = [
  { title: 'Statistics Calculator', description: 'Calculate mean, median, mode, standard deviation, variance, and more from any dataset.', href: '/math/statistics' },
  { title: 'Scientific Calculator', description: 'Evaluate expressions with sin, cos, tan, logs, powers, roots, and factorials in degrees or radians.', href: '/math/scientific' },
  { title: 'Percentage Calculator', description: 'Find what percent X is of Y, calculate percentage change, or find X% of any number.', href: '/math/percentage' },
  { title: 'Fractions Calculator', description: 'Add, subtract, multiply, and divide fractions with fully simplified results and mixed numbers.', href: '/math/fractions' },
  { title: 'Quadratic Equation Solver', description: 'Solve ax² + bx + c = 0 instantly — get real roots, discriminant, and step-by-step display.', href: '/math/quadratic' },
] as const

export default function MathPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Math & Scientific Calculators</h1>
        <p className="text-lg text-muted-foreground">
          Free, accurate math tools for students, engineers, and everyday problem-solving.
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
