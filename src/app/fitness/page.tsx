import type { Metadata } from 'next'
import { PillarHub } from '@/components/common/PillarHub'

export const metadata: Metadata = {
  title: 'Fitness & Health Calculators',
  description: 'Free fitness calculators for TDEE, BMI, body fat, macros, and pregnancy due date.',
  alternates: { canonical: '/fitness' },
}

export default function FitnessPage() {
  return <PillarHub pillarId="fitness" />
}
