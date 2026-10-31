import type { Metadata } from 'next'
import { PillarHub } from '@/components/common/PillarHub'

export const metadata: Metadata = {
  title: 'Utility Calculators',
  description: 'Free utility calculators for unit conversion, date differences, and geometry.',
  alternates: { canonical: '/utility' },
}

export default function UtilityPage() {
  return <PillarHub pillarId="utility" />
}
