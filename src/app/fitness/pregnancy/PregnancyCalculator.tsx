'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculatePregnancy, type PregnancyInputs } from '@/lib/engine/fitness'
import { Field } from '@/components/common/Field'
import { CalculatorGrid, InputPanel, ResultPanel } from '@/components/common/CalculatorLayout'
import { ResultHero, ResultStat, ResultStats } from '@/components/common/Result'
import { ResultActions } from '@/components/common/ResultActions'
import { MobileResultBar } from '@/components/common/MobileResultBar'
import { ResultPlaceholder } from '@/components/common/ResultPlaceholder'
import { useIsHydrated } from '@/lib/hooks/use-is-hydrated'

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
const TRIMESTER_COLORS = ['bg-chart-1/30', 'bg-chart-1/60', 'bg-chart-1'] as const
const TRIMESTER_RANGES = [
  { label: '1st Trimester', weeks: 'Wks 1–12', width: '30%' },
  { label: '2nd Trimester', weeks: 'Wks 13–27', width: '37.5%' },
  { label: '3rd Trimester', weeks: 'Wks 28–40', width: '32.5%' },
]

export function PregnancyCalculator() {
  const [values, setValues] = useCalculatorUrl<PregnancyInputs & Record<string, unknown>>(
    SCHEMA as Schema<PregnancyInputs & Record<string, unknown>>
  )

  const isHydrated = useIsHydrated()
  const result = calculatePregnancy(values)
  const { dueDate, currentWeek, trimester } = result

  // Position of marker as a percentage of the 40-week bar (clamped 0–100)
  const markerPct = Math.min(100, Math.max(0, (currentWeek / 40) * 100))

  const lmp = values.lastMenstrualPeriod
  const canExport = /^\d{4}-\d{2}-\d{2}$/.test(lmp) && !isNaN(Date.parse(lmp))

  // The default LMP and the current week both come from "today", so they render only once the visitor's clock is
  // known; the read-only input also stops typing that React would discard while hydrating
  return (
    <CalculatorGrid>
      <InputPanel title="Last Menstrual Period">
        <Field
          id="lmp-input"
          label="Date of LMP"
          type="date"
          readOnly={!isHydrated}
          value={isHydrated ? values.lastMenstrualPeriod : ''}
          onChange={(e) => setValues({ lastMenstrualPeriod: e.target.value })}
          hint="Calculated using Naegele's Rule: LMP + 280 days."
        />
      </InputPanel>

      <ResultPanel id="pregnancy-results">
        {!isHydrated ? (
          <ResultPlaceholder />
        ) : (
          <>
            <ResultHero label="Due Date" value={formatDate(dueDate)} caption="Estimated from the first day of your last period">
              <figure aria-label={`Pregnancy progress: week ${currentWeek} of 40`} className="relative pt-3">
                <div aria-hidden className="flex h-3 gap-0.5 overflow-hidden rounded-full">
                  {TRIMESTER_RANGES.map((t, i) => (
                    <div key={t.label} className={`${TRIMESTER_COLORS[i]} h-full`} style={{ width: t.width }} />
                  ))}
                </div>
                <div
                  aria-hidden
                  className="absolute top-0 -translate-x-1/2 transition-[left] duration-300 ease-out motion-reduce:transition-none"
                  style={{ left: `${markerPct}%` }}
                >
                  <div className="h-0 w-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-foreground" />
                </div>
                <div aria-hidden className="relative mt-2 h-4 text-xs font-semibold tabular-nums text-foreground">
                  <div
                    className={`absolute ${markerPct < 8 ? '' : markerPct > 92 ? '-translate-x-full' : '-translate-x-1/2'}`}
                    style={{ left: `${markerPct}%` }}
                  >
                    Wk {currentWeek}
                  </div>
                </div>
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
                  {TRIMESTER_RANGES.map((t, i) => (
                    <li key={t.label} className="flex items-center gap-2">
                      <div aria-hidden className={`h-2.5 w-2.5 shrink-0 rounded-[3px] ${TRIMESTER_COLORS[i]}`} />
                      <div className="text-foreground">{t.label}</div>
                      <div className="text-muted-foreground">({t.weeks})</div>
                    </li>
                  ))}
                </ul>
              </figure>
            </ResultHero>

            <ResultStats>
              <ResultStat label="Current Week" value={`Week ${currentWeek} of 40`} />
              <ResultStat label="Trimester" value={TRIMESTER_LABELS[trimester - 1]} />
            </ResultStats>

            <ResultActions
              resultsId="pregnancy-results"
              filename="pregnancy-due-date"
              csvRows={[
                { Milestone: 'Last Menstrual Period', Value: formatDate(lmp) },
                { Milestone: 'Estimated Due Date',    Value: formatDate(dueDate) },
                { Milestone: 'Current Week',          Value: `Week ${currentWeek} of 40` },
                { Milestone: 'Current Trimester',     Value: TRIMESTER_LABELS[trimester - 1] },
              ]}
              canExport={canExport}
            />
          </>
        )}
      </ResultPanel>

      {isHydrated && <MobileResultBar targetId="pregnancy-results" value={formatDate(dueDate)} caption="estimated" />}
    </CalculatorGrid>
  )
}
