import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Fitness & Health Calculators',
  description: 'Free fitness calculators for TDEE, BMI, body fat, macros, and pregnancy due date.',
  alternates: { canonical: '/fitness' },
}

const CALCULATORS = [
  { title: 'TDEE Calculator', description: 'Calculate your Total Daily Energy Expenditure and calorie targets for cutting, maintaining, or bulking.', href: '/fitness/tdee' },
  { title: 'BMI Calculator', description: 'Find your Body Mass Index and see which weight category you fall into.', href: '/fitness/bmi' },
  { title: 'Body Fat Calculator', description: 'Estimate your body fat percentage using the accurate US Navy tape measurement method.', href: '/fitness/body-fat' },
  { title: 'Macro Calculator', description: 'Get your daily protein, carb, and fat targets based on your TDEE and goal.', href: '/fitness/macro' },
  { title: 'Pregnancy Due Date', description: 'Calculate your due date, current week, and trimester from your last menstrual period.', href: '/fitness/pregnancy' },
] as const

export default function FitnessPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Fitness & Health Calculators</h1>
        <p className="text-lg text-muted-foreground">
          Free, accurate tools for tracking your health, planning your nutrition, and monitoring your fitness goals.
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
