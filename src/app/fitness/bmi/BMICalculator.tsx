'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateBMI, type BMIInputs } from '@/lib/engine/fitness'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
      {/* Left: Inputs */}
      <Card>
        <CardHeader><CardTitle>Inputs</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Weight (kg)</label>
            <Input
              type="number"
              value={values.weightKg}
              min={1}
              onChange={e => setValues({ weightKg: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Height (cm)</label>
            <Input
              type="number"
              value={values.heightCm}
              min={1}
              onChange={e => setValues({ heightCm: Number(e.target.value) })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Right: Results */}
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6 flex items-center gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Your BMI</p>
              <p className="text-5xl font-bold">{result.value.toFixed(1)}</p>
            </div>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${activeCategory?.badge ?? ''}`}>
              {result.category}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>BMI Scale</CardTitle></CardHeader>
          <CardContent>
            <div className="relative mt-2 mb-6">
              <div className="flex h-6 rounded-full overflow-hidden">
                {CATEGORIES.map(c => (
                  <div
                    key={c.label}
                    className={`${c.color} h-full`}
                    style={{ width: `${bmiToPercent(c.max) - bmiToPercent(c.min)}%` }}
                  />
                ))}
              </div>
              <div
                className="absolute top-0 -translate-x-1/2"
                style={{ left: `${markerPct}%` }}
              >
                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-foreground" />
              </div>
              <div className="relative h-4 mt-2 text-xs text-muted-foreground">
                {SCALE_TICKS.map(tick => (
                  <span
                    key={tick}
                    className="absolute -translate-x-1/2 first:translate-x-0 last:-translate-x-full"
                    style={{ left: `${bmiToPercent(tick)}%` }}
                  >
                    {tick}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

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
                    className={result.category === c.label ? 'font-semibold' : ''}
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
      </div>
    </div>
  )
}
