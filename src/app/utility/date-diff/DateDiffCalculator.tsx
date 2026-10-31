'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateDateDiff, type DateDiffInputs } from '@/lib/engine/utility'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

function today(): string {
  return new Date().toISOString().split('T')[0]
}

function oneYearAgo(): string {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 1)
  return d.toISOString().split('T')[0]
}

const SCHEMA = {
  startDate: { param: 'start', default: oneYearAgo(), parse: (s: string) => s, serialize: (s: string) => s },
  endDate:   { param: 'end',   default: today(),      parse: (s: string) => s, serialize: (s: string) => s },
} as const satisfies Schema<DateDiffInputs>

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function DateDiffCalculator() {
  const [values, setValues] = useCalculatorUrl<DateDiffInputs & Record<string, unknown>>(
    SCHEMA as Schema<DateDiffInputs & Record<string, unknown>>
  )

  const result = calculateDateDiff(values as DateDiffInputs)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
      <Card>
        <CardHeader><CardTitle>Dates</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Start Date</label>
            <Input
              type="date"
              value={values.startDate as string}
              onChange={e => setValues({ startDate: e.target.value } as Partial<DateDiffInputs & Record<string, unknown>>)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">End Date</label>
            <Input
              type="date"
              value={values.endDate as string}
              onChange={e => setValues({ endDate: e.target.value } as Partial<DateDiffInputs & Record<string, unknown>>)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Years',      value: result.years },
            { label: 'Months',     value: result.months },
            { label: 'Days',       value: result.days },
            { label: 'Total Days', value: result.totalDays },
          ].map(({ label, value }) => (
            <Card key={label}>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{value.toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-muted-foreground">
          From{' '}
          <span className="text-foreground font-medium">{formatDate(values.startDate as string)}</span>
          {' '}to{' '}
          <span className="text-foreground font-medium">{formatDate(values.endDate as string)}</span>
          {' '}is{' '}
          <span className="text-foreground font-medium">{result.years} year{result.years !== 1 ? 's' : ''}</span>
          {', '}
          <span className="text-foreground font-medium">{result.months} month{result.months !== 1 ? 's' : ''}</span>
          {', and '}
          <span className="text-foreground font-medium">{result.days} day{result.days !== 1 ? 's' : ''}</span>.
        </p>
      </div>
    </div>
  )
}
