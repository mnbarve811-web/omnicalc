'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateFraction, type FractionInputs, type FractionOperation } from '@/lib/engine/math'
import { Input } from '@/components/ui/input'
import { CalculatorGrid, InputPanel, ResultPanel } from '@/components/common/CalculatorLayout'
import { ResultStat, ResultStats } from '@/components/common/Result'
import { ResultActions } from '@/components/common/ResultActions'
import { MobileResultBar } from '@/components/common/MobileResultBar'

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
    <div className="flex flex-col items-center gap-1.5">
      <Input
        type="number"
        aria-label={`${label} numerator`}
        value={numerator}
        onChange={e => onNumeratorChange(Number(e.target.value))}
        className="w-24 text-center text-lg font-semibold md:text-lg"
      />
      <div aria-hidden className="h-0.5 w-24 rounded-full bg-foreground" />
      <Input
        type="number"
        aria-label={`${label} denominator`}
        value={denominator}
        onChange={e => onDenominatorChange(Number(e.target.value))}
        className="w-24 text-center text-lg font-semibold md:text-lg"
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
    <CalculatorGrid>
      <InputPanel title="Inputs">
        <div>
          <p className="mb-1.5 text-sm font-medium text-foreground">Operation</p>
          <div className="grid grid-cols-2 gap-1 rounded-sm bg-muted p-1 sm:grid-cols-4 lg:grid-cols-2">
            {OPERATIONS.map(({ op, label, symbol }) => (
              <button
                key={op}
                type="button"
                aria-pressed={values.operation === op}
                onClick={() => setValues({ operation: op })}
                className={`min-h-11 rounded-[4px] px-2 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:min-h-10 ${
                  values.operation === op
                    ? 'bg-card text-foreground shadow-[0_1px_2px_rgba(20,27,45,0.12)]'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {symbol} {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-5 py-2">
          <FractionInput
            label="First fraction"
            numerator={values.numerator1}
            denominator={values.denominator1}
            onNumeratorChange={v => setValues({ numerator1: v })}
            onDenominatorChange={v => setValues({ denominator1: v })}
          />
          <span aria-hidden className="text-2xl font-semibold text-muted-foreground">{activeSymbol}</span>
          <FractionInput
            label="Second fraction"
            numerator={values.numerator2}
            denominator={values.denominator2}
            onNumeratorChange={v => setValues({ numerator2: v })}
            onDenominatorChange={v => setValues({ denominator2: v })}
          />
        </div>
      </InputPanel>

      <ResultPanel id="fractions-results">
        {/* ResultHero takes a string value; the stacked fraction needs markup, so the hero is built here with the same styling */}
        <section
          data-slot="card"
          aria-live="polite"
          aria-atomic="true"
          className="rounded-lg border border-border bg-card p-5 shadow-[0_1px_2px_rgba(20,27,45,0.04),0_8px_24px_-18px_rgba(20,27,45,0.22)] md:p-6"
        >
          <p data-slot="card-title" className="text-sm font-medium text-muted-foreground">
            Result
          </p>
          {/* The engine returns 0/1 as a safe value here, which would read as a real answer */}
          {!canExport ? (
            <p className="mt-2 text-base font-medium text-destructive" role="status">
              Undefined: a denominator is 0 or the division is by 0
            </p>
          ) : (
            <div data-slot="card-content" className="mt-2 inline-flex flex-col items-center gap-1.5 text-[2.75rem] font-semibold leading-none tracking-[-0.035em] tabular-nums text-foreground md:text-6xl">
              <span>{result.numerator}</span>
              <div aria-hidden className="h-1 w-full min-w-12 rounded-full bg-foreground" />
              <span>{result.denominator}</span>
            </div>
          )}
        </section>

        {canExport && (
          <ResultStats>
            <ResultStat label="Decimal" value={decimalDisplay} />
            <ResultStat label="Mixed Number" value={result.mixed} />
          </ResultStats>
        )}

        <ResultActions
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
          canExport={canExport}
        />
      </ResultPanel>

      <MobileResultBar
        targetId="fractions-results"
        value={canExport ? `${result.numerator}/${result.denominator}` : '—'}
        caption="simplified"
      />
    </CalculatorGrid>
  )
}
