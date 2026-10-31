'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateCompoundInterest, type CompoundInterestInputs } from '@/lib/engine/financial'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const SCHEMA = {
  initialInvestment:   { param: 'init',   default: 10000, parse: Number, serialize: String },
  monthlyContribution: { param: 'monthly', default: 500,  parse: Number, serialize: String },
  annualInterestRate:  { param: 'rate',    default: 7,    parse: Number, serialize: String },
  compoundFrequency:   { param: 'freq',    default: 12,   parse: Number, serialize: String },
  years:               { param: 'years',   default: 20,   parse: Number, serialize: String },
} as const satisfies Schema<CompoundInterestInputs>

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export function CompoundInterestCalculator() {
  const [inputs, setValues] = useCalculatorUrl(SCHEMA)
  const result = calculateCompoundInterest(inputs)

  const chartData = result.yearlyBreakdown.map(d => ({
    year: d.year,
    Contributions: d.contributions,
    Interest: Math.max(0, d.balance - d.contributions),
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
      {/* Inputs */}
      <Card>
        <CardHeader><CardTitle>Inputs</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: 'Initial Investment', key: 'initialInvestment' as const, prefix: '$' },
            { label: 'Monthly Contribution', key: 'monthlyContribution' as const, prefix: '$' },
            { label: 'Annual Interest Rate (%)', key: 'annualInterestRate' as const, suffix: '%' },
            { label: 'Compound Frequency (per year)', key: 'compoundFrequency' as const },
            { label: 'Time Period (years)', key: 'years' as const },
          ].map(({ label, key, prefix, suffix }) => (
            <div key={key}>
              <label className="text-sm font-medium mb-1 block">{label}</label>
              <div className="relative">
                {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{prefix}</span>}
                <Input
                  type="number"
                  value={inputs[key]}
                  onChange={e => setValues({ [key]: Number(e.target.value) } as Partial<CompoundInterestInputs>)}
                  className={prefix ? 'pl-7' : suffix ? 'pr-7' : ''}
                />
                {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{suffix}</span>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Future Value</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{fmt(result.futureValue)}</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Total Contributions</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{fmt(result.totalContributions)}</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Interest Earned</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{fmt(result.totalInterestEarned)}</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Growth Over Time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -2 }} />
                <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => typeof v === 'number' ? fmt(v) : String(v)} />
                <Legend />
                <Area type="monotone" dataKey="Contributions" stackId="a" stroke="#6366f1" fill="#c7d2fe" />
                <Area type="monotone" dataKey="Interest" stackId="a" stroke="#10b981" fill="#a7f3d0" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Yearly Breakdown</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-right">Total Contributed</TableHead>
                  <TableHead className="text-right">Interest Earned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.yearlyBreakdown.map(row => (
                  <TableRow key={row.year}>
                    <TableCell>{row.year}</TableCell>
                    <TableCell className="text-right">{fmt(row.balance)}</TableCell>
                    <TableCell className="text-right">{fmt(row.contributions)}</TableCell>
                    <TableCell className="text-right">{fmt(row.balance - row.contributions)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
