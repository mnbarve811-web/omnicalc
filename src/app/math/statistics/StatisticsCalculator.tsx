'use client'

import { useState } from 'react'
import { calculateStatistics } from '@/lib/engine/math'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExportButtons } from '@/components/common/ExportButtons'
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

export function StatisticsCalculator() {
  const [raw, setRaw] = useState('2, 4, 4, 4, 5, 5, 7, 9')

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
        { label: 'Variance', value: fmt(result.variance) },
        { label: 'Std Dev', value: fmt(result.standardDeviation) },
      ]
    : []

  const canExport = result !== null && values.length >= 1

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Data Input</CardTitle></CardHeader>
        <CardContent>
          <label className="text-sm font-medium mb-2 block">
            Numbers (separated by commas, spaces, or new lines)
          </label>
          <textarea
            className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
            placeholder="e.g. 1, 2, 3, 4, 5 or one number per line"
            value={raw}
            onChange={e => setRaw(e.target.value)}
          />
          {values.length === 0 && raw.trim() !== '' && (
            <p className="text-sm text-destructive mt-1">No valid numbers found.</p>
          )}
        </CardContent>
      </Card>

      <div id="statistics-results" className="space-y-6">
        <ExportButtons
          resultsId="statistics-results"
          filename="statistics-summary"
          csvRows={[
            ...stats.map(({ label, value }) => ({ Metric: label, Value: value, Count: '' })),
            ...chartData.map(({ value, count }) => ({ Metric: 'Frequency', Value: value, Count: count })),
          ]}
          disabled={!canExport}
        />

      {result && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.map(({ label, value }) => (
              <Card key={label}>
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold tabular-nums">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {chartData.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Frequency Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="value" label={{ value: 'Value', position: 'insideBottom', offset: -2 }} />
                    <YAxis allowDecimals={false} label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(v: number) => [v, 'Count']} />
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </>
      )}
      </div>
    </div>
  )
}
