'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateCompoundInterest, type CompoundInterestInputs } from '@/lib/engine'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const SCHEMA = {
  initialInvestment:   { param: 'init',  default: 10000, parse: Number, serialize: String },
  monthlyContribution: { param: 'mo',    default: 200,   parse: Number, serialize: String },
  annualInterestRate:  { param: 'rate',  default: 7,     parse: Number, serialize: String },
  compoundFrequency:   { param: 'freq',  default: 12,    parse: Number, serialize: String },
  years:               { param: 'yrs',   default: 20,    parse: Number, serialize: String },
} satisfies Schema<CompoundInterestInputs>

const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

function sliderVal(v: number | readonly number[]): number {
  return Array.isArray(v) ? (v as number[])[0] : (v as number)
}

const FREQ_OPTIONS = [
  { label: 'Annually', value: 1 },
  { label: 'Quarterly', value: 4 },
  { label: 'Monthly', value: 12 },
  { label: 'Daily', value: 365 },
]

export function CompoundInterestCalculator() {
  const [values, setValues] = useCalculatorUrl(SCHEMA)
  const result = calculateCompoundInterest(values)

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader><CardTitle>Investment Details</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Initial Investment: {fmt(values.initialInvestment)}</label>
            <Slider min={0} max={500000} step={1000} value={[values.initialInvestment]}
              onValueChange={(v) => setValues({ initialInvestment: sliderVal(v) })} />
            <Input type="number" value={values.initialInvestment}
              onChange={e => setValues({ initialInvestment: Number(e.target.value) || 0 })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Monthly Contribution: {fmt(values.monthlyContribution)}</label>
            <Slider min={0} max={5000} step={50} value={[values.monthlyContribution]}
              onValueChange={(v) => setValues({ monthlyContribution: sliderVal(v) })} />
            <Input type="number" value={values.monthlyContribution}
              onChange={e => setValues({ monthlyContribution: Number(e.target.value) || 0 })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Annual Interest Rate: {values.annualInterestRate}%</label>
            <Slider min={0} max={20} step={0.25} value={[values.annualInterestRate]}
              onValueChange={(v) => setValues({ annualInterestRate: sliderVal(v) })} />
            <Input type="number" step="0.25" value={values.annualInterestRate}
              onChange={e => setValues({ annualInterestRate: Number(e.target.value) || 0 })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Compounding Frequency</label>
            <Tabs value={String(values.compoundFrequency)} onValueChange={v => setValues({ compoundFrequency: Number(v) })}>
              <TabsList>
                {FREQ_OPTIONS.map(o => <TabsTrigger key={o.value} value={String(o.value)}>{o.label}</TabsTrigger>)}
              </TabsList>
            </Tabs>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Time Period: {values.years} years</label>
            <Slider min={1} max={50} step={1} value={[values.years]}
              onValueChange={(v) => setValues({ years: sliderVal(v) })} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'Future Value', value: fmt(result.futureValue) },
          { label: 'Total Contributions', value: fmt(result.totalContributions) },
          { label: 'Total Interest Earned', value: fmt(result.totalInterestEarned) },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Growth Over Time</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={result.yearlyBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
              <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => fmt(v)} />
              <Area type="monotone" dataKey="contributions" stackId="1" stroke="#64748b" fill="#e2e8f0" name="Contributions" />
              <Area type="monotone" dataKey="interest" stackId="1" stroke="#16a34a" fill="#dcfce7" name="Interest Earned" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
