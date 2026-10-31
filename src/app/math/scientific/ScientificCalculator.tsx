'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateScientific, type AngleMode, type ScientificInputs } from '@/lib/engine/math'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ExportButtons } from '@/components/common/ExportButtons'

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
    if ('insert' in key) { setValues({ expression: values.expression + key.insert }); return }
    if (key.action === 'clear') { setValues({ expression: '' }); return }
    if (key.action === 'backspace') { setValues({ expression: values.expression.trimEnd().slice(0, -1).trimEnd() }); return }
    commitResult()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] gap-8">
      <Card>
        <CardHeader><CardTitle>Expression</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2" role="group" aria-label="Angle mode">
            {ANGLE_MODES.map(m => (
              <button
                key={m.value}
                type="button"
                aria-pressed={values.angleMode === m.value}
                onClick={() => setValues({ angleMode: m.value })}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium border transition-colors ${
                  values.angleMode === m.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground border-border hover:bg-muted'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <Input
            aria-label="Expression"
            className="font-mono text-lg h-12"
            value={values.expression}
            onChange={e => setValues({ expression: e.target.value })}
            onKeyDown={e => { if (e.key === 'Enter') commitResult() }}
            autoComplete="off"
            spellCheck={false}
          />

          <div className="grid grid-cols-5 gap-2">
            {KEYPAD.map(key => (
              <button
                key={key.label}
                type="button"
                aria-label={key.ariaLabel}
                onClick={() => pressKey(key)}
                className={`h-11 rounded-md text-sm font-medium border transition-colors ${
                  'action' in key && key.action === 'equals'
                    ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
                    : /^[0-9.]$/.test(key.label)
                      ? 'bg-background text-foreground border-border hover:bg-muted font-mono text-base'
                      : 'bg-muted text-foreground border-border hover:bg-muted/70'
                }`}
              >
                {key.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div id="scientific-results" className="space-y-6">
        <ExportButtons
          resultsId="scientific-results"
          filename="scientific-calculation"
          csvRows={[{
            Expression: values.expression,
            'Angle mode': values.angleMode === 'deg' ? 'Degrees' : 'Radians',
            Result: result.display,
          }]}
          disabled={!canExport}
        />
        <Card>
          <CardHeader><CardTitle>Result</CardTitle></CardHeader>
          <CardContent>
            {result.error !== null ? (
              <p className="text-lg font-medium text-destructive" role="alert">{result.error}</p>
            ) : (
              <p className="text-4xl font-bold font-mono break-all" aria-live="polite">{result.display || '0'}</p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Angles in {values.angleMode === 'deg' ? 'degrees' : 'radians'}
            </p>
          </CardContent>
        </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Supported Functions</CardTitle></CardHeader>
          <CardContent>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              {FUNCTION_REFERENCE.map(row => (
                <div key={row.syntax} className="contents">
                  <dt className="font-mono font-medium">{row.syntax}</dt>
                  <dd className="text-muted-foreground">{row.meaning}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
