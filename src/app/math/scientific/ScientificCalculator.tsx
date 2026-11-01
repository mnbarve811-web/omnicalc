'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateScientific, type AngleMode, type ScientificInputs } from '@/lib/engine/math'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CalculatorGrid } from '@/components/common/CalculatorLayout'
import { ResultActions } from '@/components/common/ResultActions'

const ANGLE_MODES: { value: AngleMode; label: string }[] = [
  { value: 'deg', label: 'Degrees' },
  { value: 'rad', label: 'Radians' },
]

function parseAngleMode(s: string): AngleMode {
  const match = ANGLE_MODES.find(m => m.value === s)
  if (!match) throw new Error(`Unknown angle mode: ${s}`)
  return match.value
}

const SCHEMA = {
  expression: { param: 'expr',  default: 'sin(30) + √(16)', parse: String, serialize: String },
  angleMode:  { param: 'angle', default: 'deg' as AngleMode, parse: parseAngleMode, serialize: (s: AngleMode) => s },
} as const satisfies Schema<ScientificInputs>

type KeypadKey =
  | { label: string; insert: string; ariaLabel?: string }
  | { label: string; action: 'clear' | 'backspace' | 'equals'; ariaLabel: string }

const KEYPAD: KeypadKey[] = [
  { label: 'sin', insert: 'sin(' }, { label: 'cos', insert: 'cos(' }, { label: 'tan', insert: 'tan(' },
  { label: '(', insert: '(' }, { label: ')', insert: ')' },
  { label: 'sin⁻¹', insert: 'asin(', ariaLabel: 'arcsine' }, { label: 'cos⁻¹', insert: 'acos(', ariaLabel: 'arccosine' },
  { label: 'tan⁻¹', insert: 'atan(', ariaLabel: 'arctangent' }, { label: 'xʸ', insert: '^', ariaLabel: 'power' },
  { label: 'n!', insert: '!', ariaLabel: 'factorial' },
  { label: 'ln', insert: 'ln(' }, { label: 'log', insert: 'log(' }, { label: '√', insert: '√(', ariaLabel: 'square root' },
  { label: 'π', insert: 'π', ariaLabel: 'pi' }, { label: 'e', insert: 'e' },
  { label: '7', insert: '7' }, { label: '8', insert: '8' }, { label: '9', insert: '9' },
  { label: '÷', insert: ' ÷ ', ariaLabel: 'divide' }, { label: 'C', action: 'clear', ariaLabel: 'clear' },
  { label: '4', insert: '4' }, { label: '5', insert: '5' }, { label: '6', insert: '6' },
  { label: '×', insert: ' × ', ariaLabel: 'multiply' }, { label: '⌫', action: 'backspace', ariaLabel: 'backspace' },
  { label: '1', insert: '1' }, { label: '2', insert: '2' }, { label: '3', insert: '3' },
  { label: '−', insert: ' − ', ariaLabel: 'minus' }, { label: '%', insert: '%', ariaLabel: 'percent' },
  { label: '0', insert: '0' }, { label: '.', insert: '.', ariaLabel: 'decimal point' },
  { label: 'x²', insert: '^2', ariaLabel: 'square' }, { label: '+', insert: ' + ', ariaLabel: 'plus' },
  { label: '=', action: 'equals', ariaLabel: 'equals' },
]

const FUNCTION_REFERENCE = [
  { syntax: 'sin cos tan', meaning: 'Trigonometry (uses the angle mode)' },
  { syntax: 'asin acos atan', meaning: 'Inverse trigonometry' },
  { syntax: 'sinh cosh tanh', meaning: 'Hyperbolic functions' },
  { syntax: 'ln log', meaning: 'Natural log and base-10 log' },
  { syntax: 'sqrt √ cbrt', meaning: 'Square root and cube root' },
  { syntax: 'abs exp', meaning: 'Absolute value and eˣ' },
  { syntax: '^ ! %', meaning: 'Power, factorial, percent' },
  { syntax: 'pi π e', meaning: 'Constants' },
] as const

export function ScientificCalculator() {
  const [values, setValues] = useCalculatorUrl<ScientificInputs & Record<string, unknown>>(
    SCHEMA as Schema<ScientificInputs & Record<string, unknown>>
  )
  const result = calculateScientific(values)
  const canExport = values.expression.trim() !== '' && result.value !== null && result.error === null

  function commitResult() {
    if (result.value !== null) setValues({ expression: result.display })
  }

  function pressKey(key: KeypadKey) {
    if ('insert' in key) { setValues(current => ({ expression: current.expression + key.insert })); return }
    if (key.action === 'clear') { setValues({ expression: '' }); return }
    if (key.action === 'backspace') { setValues(current => ({ expression: current.expression.trimEnd().slice(0, -1).trimEnd() })); return }
    commitResult()
  }

  return (
    <CalculatorGrid>
      {/* Hand-built instead of InputPanel so the angle toggle can share the header row and the keypad fits one viewport */}
      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <h2 data-slot="card-title" className="text-base font-semibold tracking-[-0.01em]">
            Expression
          </h2>
          <div className="grid grid-cols-2 gap-1 rounded-sm bg-muted p-1" role="group" aria-label="Angle mode">
            {ANGLE_MODES.map(m => (
              <button
                key={m.value}
                type="button"
                aria-pressed={values.angleMode === m.value}
                onClick={() => setValues({ angleMode: m.value })}
                className={`min-h-11 rounded-[4px] px-3 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:min-h-9 ${
                  values.angleMode === m.value
                    ? 'bg-card text-foreground shadow-[0_1px_2px_rgba(20,27,45,0.12)]'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            aria-label="Expression"
            className="h-12 font-mono text-lg md:h-12 md:text-lg"
            value={values.expression}
            onChange={e => setValues({ expression: e.target.value })}
            onKeyDown={e => { if (e.key === 'Enter') commitResult() }}
            autoComplete="off"
            spellCheck={false}
          />

          {/* The display sits inside the calculator so it stays next to the keypad on every screen size */}
          <div id="scientific-results" className="scroll-mt-20 rounded-sm bg-muted/60 px-4 py-3">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-medium text-muted-foreground">Result</p>
              <p className="text-xs text-muted-foreground">
                Angles in {values.angleMode === 'deg' ? 'degrees' : 'radians'}
              </p>
            </div>
            {result.error !== null ? (
              <p className="mt-1 text-base font-medium text-destructive" role="alert">{result.error}</p>
            ) : (
              <p className="mt-1 text-right text-4xl font-semibold leading-tight tracking-[-0.03em] tabular-nums break-all text-foreground" aria-live="polite">{result.display || '0'}</p>
            )}
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {KEYPAD.map(key => (
              <button
                key={key.label}
                type="button"
                aria-label={key.ariaLabel}
                onClick={() => pressKey(key)}
                className={`h-11 rounded-sm border text-sm md:h-10 font-medium transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px ${
                  'action' in key && key.action === 'equals'
                    ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                    : /^[0-9.]$/.test(key.label)
                      ? 'border-border bg-card text-base tabular-nums text-foreground hover:bg-muted'
                      : 'border-transparent bg-secondary text-secondary-foreground hover:bg-muted-foreground/15'
                }`}
              >
                {key.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="min-w-0 space-y-4">
        <ResultActions
          resultsId="scientific-results"
          filename="scientific-calculation"
          csvRows={[{
            Expression: values.expression,
            'Angle mode': values.angleMode === 'deg' ? 'Degrees' : 'Radians',
            Result: result.display,
          }]}
          canExport={canExport}
        />

        <Card>
          <CardHeader><CardTitle>Supported Functions</CardTitle></CardHeader>
          <CardContent>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-sm">
              {FUNCTION_REFERENCE.map(row => (
                <div key={row.syntax} className="contents">
                  <dt className="font-mono font-medium text-foreground">{row.syntax}</dt>
                  <dd className="text-muted-foreground">{row.meaning}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </div>
    </CalculatorGrid>
  )
}
