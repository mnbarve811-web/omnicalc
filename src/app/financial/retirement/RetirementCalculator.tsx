'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateRetirement, type RetirementInputs } from '@/lib/engine/financial'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

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

export function RetirementCalculator() {
  const [inputs, setValues] = useCalculatorUrl(SCHEMA)
  const result = calculateRetirement(inputs)

  const allPoints = [
    ...result.growthPhase.map(p => ({ ...p, phase: 'Accumulation' })),
    ...result.drawdownPhase.slice(1).map(p => ({ ...p, phase: 'Drawdown' })),
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
      <Card>
        <CardHeader><CardTitle>Inputs</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: 'Current Age', key: 'currentAge' as const },
            { label: 'Retirement Age', key: 'retirementAge' as const },
            { label: 'Current Savings ($)', key: 'currentSavings' as const, prefix: '$' },
            { label: 'Annual Savings ($)', key: 'annualSavings' as const, prefix: '$' },
            { label: 'Expected Annual Return (%)', key: 'expectedReturn' as const, suffix: '%' },
            { label: 'Annual Expenses in Retirement ($)', key: 'annualExpenses' as const, prefix: '$' },
          ].map(({ label, key, prefix, suffix }) => (
            <div key={key}>
              <label className="text-sm font-medium mb-1 block">{label}</label>
              <div className="relative">
                {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{prefix}</span>}
                <Input
                  type="number"
                  value={inputs[key]}
                  onChange={e => setValues({ [key]: Number(e.target.value) } as Partial<RetirementInputs>)}
                  className={prefix ? 'pl-7' : suffix ? 'pr-7' : ''}
                />
                {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{suffix}</span>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Balance at Retirement</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold">{fmt(result.balanceAtRetirement)}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Years of Funding</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {result.projectedRunout === null ? '50+ years' : `${result.yearsOfFunding} years`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Funds Run Out</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {result.projectedRunout === null ? 'Never' : `Age ${result.projectedRunout}`}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Balance Over Time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={allPoints}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" label={{ value: 'Age', position: 'insideBottom', offset: -2 }} />
                <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => fmt(v)} labelFormatter={l => `Age ${l}`} />
                <ReferenceLine x={inputs.retirementAge} stroke="#ef4444" strokeDasharray="4 4" label="Retirement" />
                <Line type="monotone" dataKey="balance" stroke="#6366f1" dot={false} name="Balance" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
