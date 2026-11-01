'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateStatistics } from '@/lib/engine/math'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalculatorGrid, InputPanel, ResultPanel } from '@/components/common/CalculatorLayout'
import { ResultHero, ResultStat, ResultStats } from '@/components/common/Result'
import { ResultActions } from '@/components/common/ResultActions'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

function parseValues(raw: string): number[] {
  return raw
    .split(/[\s,;]+/)
    .map(s => s.trim())
    .filter(s => s !== '')
    .map(Number)
    .filter(n => !isNaN(n))
}

function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(4).replace(/\.?0+$/, '')
}

const SCHEMA = {
  raw: { param: 'data', default: '2, 4, 4, 4, 5, 5, 7, 9', parse: String, serialize: String },
} as const satisfies Schema<{ raw: string }>

export function StatisticsCalculator() {
  const [{ raw }, setValues] = useCalculatorUrl<{ raw: string }>(SCHEMA)

  const values = parseValues(raw)
  const result = values.length >= 1 ? calculateStatistics({ values }) : null

  const freqMap = new Map<number, number>()
  for (const v of values) freqMap.set(v, (freqMap.get(v) ?? 0) + 1)
  const chartData = Array.from(freqMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([value, count]) => ({ value: String(value), count }))

  const stats = result
    ? [
        { label: 'Count', value: String(result.count) },
        { label: 'Sum', value: fmt(result.sum) },
        { label: 'Mean', value: fmt(result.mean) },
        { label: 'Median', value: fmt(result.median) },
        { label: 'Mode', value: result.mode.length === 0 ? '—' : result.mode.map(fmt).join(', ') },
        { label: 'Range', value: fmt(result.range) },
        { label: 'Min', value: fmt(result.min) },
        { label: 'Max', value: fmt(result.max) },
        { label: 'Variance (population)', value: fmt(result.variance) },
        { label: 'Std Dev (population)', value: fmt(result.standardDeviation) },
        { label: 'Variance (sample)', value: result.sampleVariance === null ? '—' : fmt(result.sampleVariance) },
        { label: 'Std Dev (sample)', value: result.sampleStandardDeviation === null ? '—' : fmt(result.sampleStandardDeviation) },
      ]
    : []

  const canExport = result !== null && values.length >= 1

  return (
    <CalculatorGrid>
      <InputPanel title="Data Input">
        <div>
          <label htmlFor="statistics-data" className="mb-1.5 block text-sm font-medium text-foreground">
            Numbers (separated by commas, spaces, or new lines)
          </label>
          <textarea
            id="statistics-data"
            className="min-h-32 w-full resize-y rounded-sm border border-input bg-card px-3 py-2 text-base tabular-nums transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
            placeholder="e.g. 1, 2, 3, 4, 5 or one number per line"
            value={raw}
            onChange={e => setValues({ raw: e.target.value })}
          />
          {values.length === 0 && raw.trim() !== '' && (
            <p className="mt-1.5 text-sm font-medium text-destructive">No valid numbers found.</p>
          )}
        </div>
      </InputPanel>

      <ResultPanel id="statistics-results">
        {result ? (
          <>
            <ResultHero label="Mean" value={fmt(result.mean)} caption="Arithmetic average of the dataset" />

            <ResultStats>
              {stats.filter(({ label }) => label !== 'Mean').map(({ label, value }) => (
                <ResultStat key={label} label={label} value={value} />
              ))}
            </ResultStats>
          </>
        ) : (
          <p className="rounded-lg border border-dashed border-border bg-card p-5 text-sm text-muted-foreground">
            Enter at least one number to see the statistics.
          </p>
        )}

        <ResultActions
          resultsId="statistics-results"
          filename="statistics-summary"
          csvRows={[
            ...stats.map(({ label, value }) => ({ Metric: label, Value: value, Count: '' })),
            ...chartData.map(({ value, count }) => ({ Metric: 'Frequency', Value: value, Count: count })),
          ]}
          canExport={canExport}
        />

        {result && chartData.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Frequency Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 12 }}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="value" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} tickLine={false} axisLine={false} label={{ value: 'Value', position: 'insideBottom', offset: -8, fill: 'var(--muted-foreground)', fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} tickLine={false} axisLine={false} label={{ value: 'Count', angle: -90, position: 'insideLeft', fill: 'var(--muted-foreground)', fontSize: 12 }} />
                  <Tooltip
                    formatter={(v: number) => [v, 'Count']}
                    cursor={{ fill: 'var(--muted)' }}
                    contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }}
                  />
                  <Bar dataKey="count" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </ResultPanel>
    </CalculatorGrid>
  )
}
