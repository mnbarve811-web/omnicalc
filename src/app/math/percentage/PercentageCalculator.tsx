'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculatePercentage, type PercentageInputs, type PercentageMode } from '@/lib/engine/math'
import { Field } from '@/components/common/Field'
import { CalculatorGrid, InputPanel, ResultPanel } from '@/components/common/CalculatorLayout'
import { ResultHero } from '@/components/common/Result'
import { ResultActions } from '@/components/common/ResultActions'
import { MobileResultBar } from '@/components/common/MobileResultBar'

const MODES: { value: PercentageMode; label: string }[] = [
  { value: 'whatIsXPercentOfY', label: 'X% of Y' },
  { value: 'xIsWhatPercentOfY', label: 'X is what % of Y' },
  { value: 'percentChange',     label: '% Change' },
]

function parseMode(s: string): PercentageMode {
  const match = MODES.find(m => m.value === s)
  if (!match) throw new Error(`Unknown percentage mode: ${s}`)
  return match.value
}

const SCHEMA = {
  mode: { param: 'mode', default: 'whatIsXPercentOfY' as PercentageMode, parse: parseMode, serialize: (s: PercentageMode) => s },
  x:    { param: 'x',    default: 20, parse: Number, serialize: String },
  y:    { param: 'y',    default: 80, parse: Number, serialize: String },
} as const satisfies Schema<PercentageInputs>

function getInputLabels(mode: PercentageMode): { x: string; y: string } {
  if (mode === 'whatIsXPercentOfY') return { x: 'Percentage (%)', y: 'Of what number?' }
  if (mode === 'xIsWhatPercentOfY') return { x: 'What number (X)?', y: 'Of what number (Y)?' }
  return { x: 'New value', y: 'Original value' }
}

function formatResult(mode: PercentageMode, result: number): string {
  const rounded = Math.round(result * 100) / 100
  if (mode === 'whatIsXPercentOfY') return String(rounded)
  if (mode === 'percentChange' && rounded > 0) return `+${rounded}%`
  return `${rounded}%`
}

export function PercentageCalculator() {
  const [values, setValues] = useCalculatorUrl<PercentageInputs & Record<string, unknown>>(
    SCHEMA as Schema<PercentageInputs & Record<string, unknown>>
  )
  const result = calculatePercentage(values)
  const inputLabels = getInputLabels(values.mode)
  const canExport = Number.isFinite(values.x) && Number.isFinite(values.y) && (values.mode === 'whatIsXPercentOfY' || values.y !== 0)
  const modeLabel = MODES.find(m => m.value === values.mode)?.label ?? values.mode

  return (
    <CalculatorGrid>
      <InputPanel title="Inputs">
        <div className="grid grid-cols-3 gap-1 rounded-sm bg-muted p-1" role="group" aria-label="Calculation mode">
          {MODES.map(m => (
            <button
              key={m.value}
              type="button"
              aria-pressed={values.mode === m.value}
              onClick={() => setValues({ mode: m.value })}
              className={`min-h-11 rounded-[4px] px-2 py-1.5 text-sm leading-tight font-medium text-balance transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:min-h-10 ${
                values.mode === m.value
                  ? 'bg-card text-foreground shadow-[0_1px_2px_rgba(20,27,45,0.12)]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <Field id="percentage-x" label={inputLabels.x} type="number" value={values.x} onChange={e => setValues({ x: Number(e.target.value) })} />
        <Field id="percentage-y" label={inputLabels.y} type="number" value={values.y} onChange={e => setValues({ y: Number(e.target.value) })} />
      </InputPanel>

      <ResultPanel id="percentage-results">
        <ResultHero label="Result" value={formatResult(values.mode, result.result)} caption={result.label} />

        <ResultActions
          resultsId="percentage-results"
          filename="percentage-calculation"
          csvRows={[{
            Mode: modeLabel,
            [inputLabels.x]: values.x,
            [inputLabels.y]: values.y,
            Result: formatResult(values.mode, result.result),
            Summary: result.label,
          }]}
          canExport={canExport}
        />
      </ResultPanel>

      <MobileResultBar targetId="percentage-results" value={formatResult(values.mode, result.result)} caption="answer" />
    </CalculatorGrid>
  )
}
