'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateDateDiff, type DateDiffInputs } from '@/lib/engine/utility'
import { Field } from '@/components/common/Field'
import { CalculatorGrid, InputPanel, ResultPanel } from '@/components/common/CalculatorLayout'
import { ResultHero, ResultStat, ResultStats } from '@/components/common/Result'
import { ResultActions } from '@/components/common/ResultActions'
import { MobileResultBar } from '@/components/common/MobileResultBar'
import { ResultPlaceholder } from '@/components/common/ResultPlaceholder'
import { useIsHydrated } from '@/lib/hooks/use-is-hydrated'

// Built from local date parts: toISOString() is UTC, which is already tomorrow on a North American evening
function toLocalIsoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function today(): string {
  return toLocalIsoDate(new Date())
}

function oneYearAgo(): string {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 1)
  return toLocalIsoDate(d)
}

// The hook falls back to the default when parse throws, so a malformed URL date never reaches the engine
function parseIsoDate(s: string): string {
  if (!isValidIsoDate(s)) throw new Error(`Invalid date: ${s}`)
  return s
}

const SCHEMA = {
  startDate: { param: 'start', default: oneYearAgo(), parse: parseIsoDate, serialize: (s: string) => s },
  endDate:   { param: 'end',   default: today(),      parse: parseIsoDate, serialize: (s: string) => s },
} as const satisfies Schema<DateDiffInputs>

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function isValidIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(value).getTime())
}

export function DateDiffCalculator() {
  const [values, setValues] = useCalculatorUrl<DateDiffInputs & Record<string, unknown>>(
    SCHEMA as Schema<DateDiffInputs & Record<string, unknown>>
  )

  const isHydrated = useIsHydrated()
  const result = calculateDateDiff(values as DateDiffInputs)
  const canExport = isValidIsoDate(values.startDate as string) && isValidIsoDate(values.endDate as string)

  // The defaults are "today" and "a year ago", so nothing date-derived renders until the visitor's clock is known;
  // read-only inputs also stop typing that React would discard while hydrating
  return (
    <CalculatorGrid>
      <InputPanel title="Dates">
        <Field
          label="Start Date"
          type="date"
          readOnly={!isHydrated}
          value={isHydrated ? (values.startDate as string) : ''}
          onChange={e => setValues({ startDate: e.target.value } as Partial<DateDiffInputs & Record<string, unknown>>)}
        />
        <Field
          label="End Date"
          type="date"
          readOnly={!isHydrated}
          value={isHydrated ? (values.endDate as string) : ''}
          onChange={e => setValues({ endDate: e.target.value } as Partial<DateDiffInputs & Record<string, unknown>>)}
        />
      </InputPanel>

      <ResultPanel id="date-diff-results">
        {!isHydrated ? (
          <ResultPlaceholder />
        ) : (
          <>
            <ResultHero
              label="Total Days"
              value={result.totalDays.toLocaleString()}
              caption={
                <p>
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
              }
            />
    
            <ResultStats>
              <ResultStat label="Years" value={result.years.toLocaleString()} />
              <ResultStat label="Months" value={result.months.toLocaleString()} />
              <ResultStat label="Days" value={result.days.toLocaleString()} />
            </ResultStats>
    
            <ResultActions
              resultsId="date-diff-results"
              filename="date-difference"
              csvRows={[{
                'Start Date': values.startDate,
                'End Date': values.endDate,
                Years: result.years,
                Months: result.months,
                Days: result.days,
                'Total Days': result.totalDays,
              }]}
              canExport={canExport}
            />
          </>
        )}
      </ResultPanel>

      {isHydrated && (
        <MobileResultBar targetId="date-diff-results" value={result.totalDays.toLocaleString()} caption="days between the dates" />
      )}
    </CalculatorGrid>
  )
}
