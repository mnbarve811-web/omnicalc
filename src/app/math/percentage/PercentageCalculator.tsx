'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculatePercentage, type PercentageInputs, type PercentageMode } from '@/lib/engine/math'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ExportButtons } from '@/components/common/ExportButtons'

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
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
      <Card>
        <CardHeader><CardTitle>Inputs</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2" role="group" aria-label="Calculation mode">
            {MODES.map(m => (
              <button
                key={m.value}
                type="button"
                aria-pressed={values.mode === m.value}
                onClick={() => setValues({ mode: m.value })}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium border transition-colors ${
                  values.mode === m.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground border-border hover:bg-muted'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div>
            <label htmlFor="percentage-x" className="text-sm font-medium mb-1 block">{inputLabels.x}</label>
            <Input
              id="percentage-x"
              type="number"
              value={values.x}
              onChange={e => setValues({ x: Number(e.target.value) })}
            />
          </div>

          <div>
            <label htmlFor="percentage-y" className="text-sm font-medium mb-1 block">{inputLabels.y}</label>
            <Input
              id="percentage-y"
              type="number"
              value={values.y}
              onChange={e => setValues({ y: Number(e.target.value) })}
            />
          </div>
        </CardContent>
      </Card>

      <div id="percentage-results" className="space-y-6">
        <ExportButtons
          resultsId="percentage-results"
          filename="percentage-calculation"
          csvRows={[{
            Mode: modeLabel,
            [inputLabels.x]: values.x,
            [inputLabels.y]: values.y,
            Result: formatResult(values.mode, result.result),
            Summary: result.label,
          }]}
          disabled={!canExport}
        />
        <Card>
          <CardHeader><CardTitle>Result</CardTitle></CardHeader>
          <CardContent>
            <p className="text-5xl font-bold tabular-nums">{formatResult(values.mode, result.result)}</p>
            <p className="text-muted-foreground mt-3 text-lg">{result.label}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
