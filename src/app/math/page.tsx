import type { Metadata } from 'next'
import { PillarHub } from '@/components/common/PillarHub'

export const metadata: Metadata = {
  title: 'Math & Scientific Calculators',
  description: 'Free math calculators for statistics, scientific expressions, percentages, fractions, and quadratic equations.',
  alternates: { canonical: '/math' },
}

export default function MathPage() {
  return <PillarHub pillarId="math" />
}
