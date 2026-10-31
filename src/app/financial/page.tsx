import type { Metadata } from 'next'
import { PillarHub } from '@/components/common/PillarHub'

export const metadata: Metadata = {
  title: 'Financial Calculators',
  description: 'Free financial calculators for mortgage, loans, investments, and retirement planning.',
  alternates: { canonical: '/financial' },
}

export default function FinancialPage() {
  return <PillarHub pillarId="financial" />
}
