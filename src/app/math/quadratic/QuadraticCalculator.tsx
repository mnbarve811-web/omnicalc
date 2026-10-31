'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateQuadratic, type QuadraticInputs } from '@/lib/engine/math'
import { Field } from '@/components/common/Field'
import { CalculatorGrid, InputPanel, ResultPanel } from '@/components/common/CalculatorLayout'
import { ResultHero, ResultStat, ResultStats } from '@/components/common/Result'
import { ResultActions } from '@/components/common/ResultActions'
import { MobileResultBar } from '@/components/common/MobileResultBar'

const SCHEMA = {
  a: { param: 'a', default: 1,  parse: Number, serialize: String },
  b: { param: 'b', default: -5, parse: Number, serialize: String },
  c: { param: 'c', default: 6,  parse: Number, serialize: String },
} as const satisfies Schema<QuadraticInputs>

function formatNumber(n: number): string {
  return Number(n.toPrecision(6)).toString()
}

function describeDiscriminant(a: number, discriminant: number): string {
  if (a === 0) return 'Not defined for a linear equation'
  if (discriminant > 0) return 'Positive — two distinct real roots'
  if (discriminant === 0) return 'Zero — one repeated real root'
  return 'Negative — no real roots'
}

function NumberLine({ roots }: { roots: [number] | [number, number] }) {
  const min = Math.min(...roots) - 1
  const max = Math.max(...roots) + 1
  const range = max - min
  const toPercent = (v: number) => ((v - min) / range) * 100

  const ticks: number[] = []
  const step = range <= 4 ? 0.5 : range <= 10 ? 1 : Math.ceil(range / 8)
  const start = Math.ceil(min / step) * step
  // Rounding each step avoids floating-point drift producing ticks like 0.30000000000000004
  for (let t = start; t <= max + 1e-9; t = Math.round((t + step) * 1e9) / 1e9) {
    ticks.push(t)
  }

  return (
    <div className="px-2">
      <p className="text-sm font-medium text-muted-foreground mb-3">Number Line</p>
      <div className="relative h-10" role="img" aria-label={`Number line marking roots at ${roots.map(formatNumber).join(' and ')}`}>
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-border" />
        {ticks.map((t) => (
          <div
            key={t}
            className="absolute flex flex-col items-center"
            style={{ left: `${toPercent(t)}%`, transform: 'translateX(-50%)' }}
          >
            <div className="w-px h-2 bg-muted-foreground mt-3" />
            <span className="mt-0.5 text-xs tabular-nums text-muted-foreground">{Number(t.toPrecision(4))}</span>
          </div>
        ))}
        {roots.map((r, i) => (
          <div
            key={i}
            className="absolute top-0"
            style={{ left: `${toPercent(r)}%`, transform: 'translateX(-50%)' }}
          >
            <div className="w-3 h-3 rounded-full bg-primary border-2 border-background shadow mt-2.5" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function QuadraticCalculator() {
  const [values, setValues] = useCalculatorUrl<QuadraticInputs & Record<string, unknown>>(
    SCHEMA as Schema<QuadraticInputs & Record<string, unknown>>
  )
  const result = calculateQuadratic(values)
  const canExport = values.a !== 0 && Number.isFinite(values.b) && Number.isFinite(values.c)

  return (
    <CalculatorGrid>
      <InputPanel title="Equation">
        <p className="text-lg font-medium tracking-[-0.01em] text-foreground">ax² + bx + c = 0</p>
        <Field label="Coefficient a" suffix="x²" type="number" value={values.a} onChange={(e) => setValues({ a: Number(e.target.value) })} />
        <Field label="Coefficient b" suffix="x" type="number" value={values.b} onChange={(e) => setValues({ b: Number(e.target.value) })} />
        <Field label="Coefficient c" type="number" value={values.c} onChange={(e) => setValues({ c: Number(e.target.value) })} />
      </InputPanel>

      <ResultPanel id="quadratic-results">
        <ResultHero label="Roots" value={result.rootsDisplay} caption={describeDiscriminant(values.a, result.discriminant)}>
          {result.roots.length > 0 && <NumberLine roots={result.roots as [number] | [number, number]} />}
        </ResultHero>

        <ResultStats>
          <ResultStat label="Discriminant (b² − 4ac)" value={formatNumber(result.discriminant)} />
        </ResultStats>

        <ResultActions
          resultsId="quadratic-results"
          filename="quadratic-roots"
          csvRows={[{
            a: values.a,
            b: values.b,
            c: values.c,
            Discriminant: formatNumber(result.discriminant),
            'Root 1': result.roots[0] !== undefined ? formatNumber(result.roots[0]) : '',
            'Root 2': result.roots[1] !== undefined ? formatNumber(result.roots[1]) : '',
            Roots: result.rootsDisplay,
          }]}
          canExport={canExport}
        />
      </ResultPanel>

      <MobileResultBar targetId="quadratic-results" value={result.rootsDisplay} caption="solution" />
    </CalculatorGrid>
  )
}
