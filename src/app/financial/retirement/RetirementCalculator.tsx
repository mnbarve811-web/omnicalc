'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateRetirement, type RetirementInputs } from '@/lib/engine/financial'
import { formatCompactUsd } from '@/lib/format'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field } from '@/components/common/Field'
import { CalculatorGrid, InputPanel, ResultPanel } from '@/components/common/CalculatorLayout'
import { ResultHero, ResultStat, ResultStats } from '@/components/common/Result'
import { ResultActions } from '@/components/common/ResultActions'
import { MobileResultBar } from '@/components/common/MobileResultBar'

const SCHEMA = {
  currentAge:      { param: 'age',        default: 30,     parse: Number, serialize: String },
  retirementAge:   { param: 'retire',     default: 65,     parse: Number, serialize: String },
  currentSavings:  { param: 'saved',      default: 50000,  parse: Number, serialize: String },
  annualSavings:   { param: 'annual',     default: 15000,  parse: Number, serialize: String },
  expectedReturn:  { param: 'return',     default: 7,      parse: Number, serialize: String },
  annualExpenses:  { param: 'expenses',   default: 60000,  parse: Number, serialize: String },
} as const satisfies Schema<RetirementInputs>

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

const AXIS_TICK = { fill: 'var(--muted-foreground)', fontSize: 12 }

export function RetirementCalculator() {
  const [inputs, setValues] = useCalculatorUrl(SCHEMA)
  const result = calculateRetirement(inputs)

  const allPoints = [
    ...result.growthPhase.map(p => ({ ...p, phase: 'Accumulation' })),
    ...result.drawdownPhase.slice(1).map(p => ({ ...p, phase: 'Drawdown' })),
  ]

  const canExport =
    inputs.currentAge > 0 &&
    inputs.retirementAge > inputs.currentAge &&
    (inputs.currentSavings > 0 || inputs.annualSavings > 0)

  return (
    <CalculatorGrid>
      <InputPanel title="Inputs">
        {[
          { label: 'Current Age', key: 'currentAge' as const },
          { label: 'Retirement Age', key: 'retirementAge' as const },
          { label: 'Current Savings ($)', key: 'currentSavings' as const, prefix: '$' },
          { label: 'Annual Savings ($)', key: 'annualSavings' as const, prefix: '$' },
          { label: 'Expected Annual Return (%)', key: 'expectedReturn' as const, suffix: '%' },
          { label: 'Annual Expenses in Retirement ($)', key: 'annualExpenses' as const, prefix: '$' },
        ].map(({ label, key, prefix, suffix }) => (
          <Field
            key={key}
            label={label}
            prefix={prefix}
            suffix={suffix}
            type="number"
            value={inputs[key]}
            onChange={e => setValues({ [key]: Number(e.target.value) } as Partial<RetirementInputs>)}
          />
        ))}
      </InputPanel>

      <ResultPanel id="retirement-results">
        <ResultHero
          label="Balance at Retirement"
          value={fmt(result.balanceAtRetirement)}
          caption={`Projected savings at age ${inputs.retirementAge}`}
        />

        <ResultStats>
          <ResultStat
            label="Years of Funding"
            value={result.projectedRunout === null ? '50+ years' : `${result.yearsOfFunding} years`}
          />
          <ResultStat
            label="Funds Run Out"
            value={result.projectedRunout === null ? 'Never' : `Age ${result.projectedRunout}`}
          />
        </ResultStats>

        <ResultActions
          resultsId="retirement-results"
          filename="retirement-projection"
          csvRows={allPoints.map((point) => ({
            Age: point.age,
            Phase: point.phase,
            Balance: point.balance.toFixed(2),
          }))}
          canExport={canExport}
        />

        <Card>
          <CardHeader><CardTitle>Balance Over Time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={allPoints} margin={{ top: 16, right: 16, left: 16, bottom: 4 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="age" tickFormatter={(v: number) => `Age ${v}`} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={formatCompactUsd} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(v: number) => fmt(v)}
                  labelFormatter={l => `Age ${l}`}
                  contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }}
                />
                <ReferenceLine
                  x={inputs.retirementAge}
                  stroke="var(--muted-foreground)"
                  strokeDasharray="4 4"
                  label={{ value: 'Retirement', position: 'top', fill: 'var(--muted-foreground)', fontSize: 12 }}
                />
                <Line type="monotone" dataKey="balance" stroke="var(--chart-1)" strokeWidth={2} dot={false} name="Balance" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </ResultPanel>

      <MobileResultBar targetId="retirement-results" value={fmt(result.balanceAtRetirement)} caption="at retirement" />
    </CalculatorGrid>
  )
}
