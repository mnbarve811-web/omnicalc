import type { Metadata } from 'next'
import { CalculatorShell } from '@/components/common/CalculatorShell'
import { UnitConversionCalculator } from './UnitConversionCalculator'

export const metadata: Metadata = {
  title: 'Unit Converter',
  description: 'Convert between length, weight, volume, temperature, speed, area, and pressure units.',
  alternates: { canonical: '/utility/unit-conversion' },
}

export default function UnitConversionPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Unit Converter</h1>
      <p className="text-muted-foreground mb-8">Convert between common units across 7 categories.</p>
      <CalculatorShell>
        <UnitConversionCalculator />
      </CalculatorShell>
    </main>
  )
}
