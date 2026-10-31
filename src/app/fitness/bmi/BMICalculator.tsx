'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateBMI, type BMIInputs } from '@/lib/engine/fitness'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Field } from '@/components/common/Field'
import { CalculatorGrid, InputPanel, ResultPanel } from '@/components/common/CalculatorLayout'
import { ResultHero } from '@/components/common/Result'
import { ResultActions } from '@/components/common/ResultActions'
import { MobileResultBar } from '@/components/common/MobileResultBar'

const SCHEMA = {
  weightKg: { param: 'weight', default: 70, parse: Number, serialize: String },
  heightCm: { param: 'height', default: 170, parse: Number, serialize: String },
} as const satisfies Schema<BMIInputs>

const CATEGORIES = [
  { label: 'Underweight',   range: '< 18.5',      min: 0,    max: 18.5, color: 'bg-blue-400',   badge: 'bg-blue-100 text-blue-800' },
  { label: 'Normal weight', range: '18.5 – 24.9', min: 18.5, max: 25,   color: 'bg-green-400',  badge: 'bg-green-100 text-green-800' },
  { label: 'Overweight',    range: '25.0 – 29.9', min: 25,   max: 30,   color: 'bg-yellow-400', badge: 'bg-yellow-100 text-yellow-800' },
  { label: 'Obese',         range: '≥ 30.0',      min: 30,   max: 45,   color: 'bg-red-400',    badge: 'bg-red-100 text-red-800' },
] as const

const SCALE_MIN = 10
const SCALE_MAX = 45
const SCALE_TICKS = [10, 18.5, 25, 30, 45]

function bmiToPercent(bmi: number): number {
  const clamped = Math.max(SCALE_MIN, Math.min(SCALE_MAX, bmi))
  return ((clamped - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100
}

export function BMICalculator() {
  const [values, setValues] = useCalculatorUrl<BMIInputs & Record<string, unknown>>(
    SCHEMA as Schema<BMIInputs & Record<string, unknown>>
  )

  const result = calculateBMI(values)
  const markerPct = bmiToPercent(result.value)
  const activeCategory = CATEGORIES.find(c => c.label === result.category)
  const canExport = values.weightKg > 0 && values.heightCm > 0

  return (
    <CalculatorGrid>
      <InputPanel title="Inputs">
        <Field label="Weight (kg)" type="number" value={values.weightKg} min={1} onChange={e => setValues({ weightKg: Number(e.target.value) })} />
        <Field label="Height (cm)" type="number" value={values.heightCm} min={1} onChange={e => setValues({ heightCm: Number(e.target.value) })} />
      </InputPanel>

      <ResultPanel id="bmi-results">
        {/* The hero's only <span> is the category badge; e2e reads the category from it */}
        <ResultHero
          label="Your BMI"
          value={result.value.toFixed(1)}
          caption={
            <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${activeCategory?.badge ?? ''}`}>
              {result.category}
            </span>
          }
        >
          <figure aria-label={`BMI ${result.value.toFixed(1)} on a scale from ${SCALE_MIN} to ${SCALE_MAX}`} className="relative pt-3">
            <div aria-hidden className="flex h-3 gap-0.5 overflow-hidden rounded-full">
              {CATEGORIES.map(c => (
                <div
                  key={c.label}
                  className={`${c.color} h-full`}
                  style={{ width: `${bmiToPercent(c.max) - bmiToPercent(c.min)}%` }}
                />
              ))}
            </div>
            <div
              aria-hidden
              className="absolute top-0 -translate-x-1/2 transition-[left] duration-300 ease-out motion-reduce:transition-none"
              style={{ left: `${markerPct}%` }}
            >
              <div className="h-0 w-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-foreground" />
            </div>
            <div aria-hidden className="relative mt-2 h-4 text-xs tabular-nums text-muted-foreground">
              {SCALE_TICKS.map(tick => (
                <div
                  key={tick}
                  className="absolute -translate-x-1/2 first:translate-x-0 last:-translate-x-full"
                  style={{ left: `${bmiToPercent(tick)}%` }}
                >
                  {tick}
                </div>
              ))}
            </div>
          </figure>
        </ResultHero>

        <ResultActions
          resultsId="bmi-results"
          filename="bmi-result"
          csvRows={CATEGORIES.map(c => ({
            Category: c.label,
            'BMI Range': c.range,
            'Your BMI': result.category === c.label ? result.value.toFixed(1) : '',
          }))}
          canExport={canExport}
        />

        <Card>
          <CardHeader><CardTitle>BMI Categories</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>BMI Range</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CATEGORIES.map(c => (
                  <TableRow
                    key={c.label}
                    aria-current={result.category === c.label ? 'true' : undefined}
                    className={result.category === c.label ? 'bg-accent font-semibold' : ''}
                  >
                    <TableCell>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${c.badge}`}>
                        {c.label}
                      </span>
                    </TableCell>
                    <TableCell>{c.range}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </ResultPanel>

      <MobileResultBar targetId="bmi-results" value={result.value.toFixed(1)} caption="BMI" />
    </CalculatorGrid>
  )
}
