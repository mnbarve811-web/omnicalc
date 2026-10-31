'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculatePregnancy, type PregnancyInputs } from '@/lib/engine/fitness'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ExportButtons } from '@/components/common/ExportButtons'

function tenWeeksAgo(): string {
  const now = new Date()
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - 70))
  return d.toISOString().split('T')[0]
}

// The hook falls back to the default when parse throws; an invalid date would otherwise crash the engine
function parseIsoDate(s: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || isNaN(Date.parse(s))) throw new Error('Invalid date')
  return s
}

const SCHEMA = {
  lastMenstrualPeriod: { param: 'lmp', default: tenWeeksAgo(), parse: parseIsoDate, serialize: (s: string) => s },
} as const satisfies Schema<PregnancyInputs>

function formatDate(isoDate: string): string {
  const date = new Date(isoDate + 'T00:00:00')
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const TRIMESTER_LABELS = ['1st Trimester', '2nd Trimester', '3rd Trimester'] as const
const TRIMESTER_COLORS = ['bg-pink-400', 'bg-purple-400', 'bg-indigo-400'] as const
const TRIMESTER_RANGES = [
  { label: '1st Trimester', weeks: 'Wks 1–12', start: 0, end: 12 },
  { label: '2nd Trimester', weeks: 'Wks 13–27', start: 13, end: 27 },
  { label: '3rd Trimester', weeks: 'Wks 28–40', start: 28, end: 40 },
]

export function PregnancyCalculator() {
  const [values, setValues] = useCalculatorUrl<PregnancyInputs & Record<string, unknown>>(
    SCHEMA as Schema<PregnancyInputs & Record<string, unknown>>
  )

  const result = calculatePregnancy(values)
  const { dueDate, currentWeek, trimester } = result

  // Position of marker as a percentage of the 40-week bar (clamped 0–100)
  const markerPct = Math.min(100, Math.max(0, (currentWeek / 40) * 100))

  const lmp = values.lastMenstrualPeriod
  const canExport = /^\d{4}-\d{2}-\d{2}$/.test(lmp) && !isNaN(Date.parse(lmp))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
      {/* Left column: input */}
      <Card>
        <CardHeader>
          <CardTitle>Last Menstrual Period</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="lmp-input">
              Date of LMP
            </label>
            <Input
              id="lmp-input"
              type="date"
              value={values.lastMenstrualPeriod}
              onChange={(e) => setValues({ lastMenstrualPeriod: e.target.value })}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Calculated using Naegele&apos;s Rule: LMP + 280 days.
          </p>
        </CardContent>
      </Card>

      {/* Right column: results */}
      <div id="pregnancy-results" className="space-y-6">
        <ExportButtons
          resultsId="pregnancy-results"
          filename="pregnancy-due-date"
          csvRows={[
            { Milestone: 'Last Menstrual Period', Value: formatDate(lmp) },
            { Milestone: 'Estimated Due Date',    Value: formatDate(dueDate) },
            { Milestone: 'Current Week',          Value: `Week ${currentWeek} of 40` },
            { Milestone: 'Current Trimester',     Value: TRIMESTER_LABELS[trimester - 1] },
          ]}
          disabled={!canExport}
        />

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Due Date</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatDate(dueDate)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Week</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Week {currentWeek} of 40</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Trimester</CardTitle>
            </CardHeader>
            <CardContent>
              <span className={`inline-block px-3 py-1 rounded-full text-white text-sm font-semibold ${TRIMESTER_COLORS[trimester - 1]}`}>
                {TRIMESTER_LABELS[trimester - 1]}
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Progress bar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pregnancy Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {/* 3-segment bar */}
            <div className="relative h-8 flex rounded-full overflow-hidden mb-3">
              {/* Segment 1: weeks 1-12 = 12/40 = 30% */}
              <div className="h-full bg-pink-400 flex items-center justify-center text-white text-xs font-medium" style={{ width: '30%' }}>
                Wks 1–12
              </div>
              {/* Segment 2: weeks 13-27 = 15/40 = 37.5% */}
              <div className="h-full bg-purple-400 flex items-center justify-center text-white text-xs font-medium" style={{ width: '37.5%' }}>
                Wks 13–27
              </div>
              {/* Segment 3: weeks 28-40 = 13/40 = 32.5% */}
              <div className="h-full bg-indigo-400 flex items-center justify-center text-white text-xs font-medium" style={{ width: '32.5%' }}>
                Wks 28–40
              </div>
            </div>

            {/* Marker line */}
            <div className="relative h-4 mb-1">
              <div
                className="absolute top-0 w-0.5 h-4 bg-gray-800 rounded"
                style={{ left: `calc(${markerPct}% - 1px)` }}
              />
            </div>
            <div className="relative h-5">
              <span
                className="absolute text-xs font-semibold text-gray-700 -translate-x-1/2"
                style={{ left: `${markerPct}%` }}
              >
                Wk {currentWeek}
              </span>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4">
              {TRIMESTER_RANGES.map((t, i) => (
                <div key={t.label} className="flex items-center gap-1.5 text-sm">
                  <span className={`inline-block w-3 h-3 rounded-sm ${TRIMESTER_COLORS[i]}`} />
                  <span>{t.label}</span>
                  <span className="text-muted-foreground">({t.weeks})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
