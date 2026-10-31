'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateFraction, type FractionInputs, type FractionOperation } from '@/lib/engine/math'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ExportButtons } from '@/components/common/ExportButtons'

const OPERATIONS: { op: FractionOperation; label: string; symbol: string }[] = [
  { op: 'add',      label: 'Add',      symbol: '+' },
  { op: 'subtract', label: 'Subtract', symbol: '−' },
  { op: 'multiply', label: 'Multiply', symbol: '×' },
  { op: 'divide',   label: 'Divide',   symbol: '÷' },
]

// Throwing on an unknown op makes useCalculatorUrl fall back to the default instead of trusting the URL.
function parseOperation(s: string): FractionOperation {
  const match = OPERATIONS.find(o => o.op === s)
  if (!match) throw new Error(`Unknown fraction operation: ${s}`)
  return match.op
}

const SCHEMA = {
  numerator1:   { param: 'n1', default: 1,     parse: Number,         serialize: String },
  denominator1: { param: 'd1', default: 2,     parse: Number,         serialize: String },
  numerator2:   { param: 'n2', default: 1,     parse: Number,         serialize: String },
  denominator2: { param: 'd2', default: 3,     parse: Number,         serialize: String },
  operation:    { param: 'op', default: 'add' as FractionOperation, parse: parseOperation, serialize: s => s },
} as const satisfies Schema<FractionInputs>

function FractionInput({
  label,
  numerator,
  denominator,
  onNumeratorChange,
  onDenominatorChange,
}: {
  label: string
  numerator: number
  denominator: number
  onNumeratorChange: (v: number) => void
  onDenominatorChange: (v: number) => void
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Input
        type="number"
        aria-label={`${label} numerator`}
        value={numerator}
        onChange={e => onNumeratorChange(Number(e.target.value))}
        className="w-20 text-center text-lg font-semibold"
      />
      <div className="w-20 border-t-2 border-foreground" />
      <Input
        type="number"
        aria-label={`${label} denominator`}
        value={denominator}
        onChange={e => onDenominatorChange(Number(e.target.value))}
        className="w-20 text-center text-lg font-semibold"
      />
    </div>
  )
}

export function FractionsCalculator() {
  const [values, setValues] = useCalculatorUrl<FractionInputs & Record<string, unknown>>(
    SCHEMA as Schema<FractionInputs & Record<string, unknown>>
  )

  const result = calculateFraction(values)
  const activeSymbol = OPERATIONS.find(o => o.op === values.operation)?.symbol ?? '+'
  const activeLabel = OPERATIONS.find(o => o.op === values.operation)?.label ?? values.operation
  const canExport = values.denominator1 !== 0 && values.denominator2 !== 0
    && (values.operation !== 'divide' || values.numerator2 !== 0)
    && Number.isFinite(result.decimal)
  const decimalDisplay = Number.isFinite(result.decimal) ? result.decimal.toFixed(4).replace(/\.?0+$/, '') : '—'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
      <Card>
        <CardHeader><CardTitle>Inputs</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm font-medium mb-2">Operation</p>
            <div className="flex gap-2 flex-wrap">
              {OPERATIONS.map(({ op, label, symbol }) => (
                <button
                  key={op}
                  type="button"
                  aria-pressed={values.operation === op}
                  onClick={() => setValues({ operation: op })}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                    values.operation === op
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:bg-muted'
                  }`}
                >
                  {symbol} {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center">
            <FractionInput
              label="First fraction"
              numerator={values.numerator1}
              denominator={values.denominator1}
              onNumeratorChange={v => setValues({ numerator1: v })}
              onDenominatorChange={v => setValues({ denominator1: v })}
            />
            <span className="text-2xl font-bold text-muted-foreground">{activeSymbol}</span>
            <FractionInput
              label="Second fraction"
              numerator={values.numerator2}
              denominator={values.denominator2}
              onNumeratorChange={v => setValues({ numerator2: v })}
              onDenominatorChange={v => setValues({ denominator2: v })}
            />
          </div>
        </CardContent>
      </Card>

      <div id="fractions-results" className="space-y-4">
        <ExportButtons
          resultsId="fractions-results"
          filename="fraction-calculation"
          csvRows={[{
            'First fraction': `${values.numerator1}/${values.denominator1}`,
            Operation: activeLabel,
            'Second fraction': `${values.numerator2}/${values.denominator2}`,
            Result: `${result.numerator}/${result.denominator}`,
            'Mixed number': result.mixed,
            Decimal: decimalDisplay,
          }]}
          disabled={!canExport}
        />
        <Card>
          <CardHeader><CardTitle>Result</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl font-bold">{result.numerator}</span>
              <div className="w-16 border-t-4 border-foreground" />
              <span className="text-4xl font-bold">{result.denominator}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Decimal</p>
                <p className="text-2xl font-semibold">
                  {Number.isFinite(result.decimal) ? result.decimal.toFixed(4).replace(/\.?0+$/, '') : '—'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Mixed Number</p>
                <p className="text-2xl font-semibold">{result.mixed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
