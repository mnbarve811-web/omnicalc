'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateCompoundInterest, type CompoundInterestInputs } from '@/lib/engine/financial'
import { formatCompactUsd, niceTicks } from '@/lib/format'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Field } from '@/components/common/Field'
import { CalculatorGrid, InputPanel, ResultPanel } from '@/components/common/CalculatorLayout'
import { ChartLegend, ProportionBar, ResultHero, ResultStat, ResultStats, type ProportionSegment } from '@/components/common/Result'
import { ResultActions } from '@/components/common/ResultActions'
import { MobileResultBar } from '@/components/common/MobileResultBar'

const SCHEMA = {
  initialInvestment:   { param: 'init',   default: 10000, parse: Number, serialize: String },
  monthlyContribution: { param: 'monthly', default: 500,  parse: Number, serialize: String },
  annualInterestRate:  { param: 'rate',    default: 7,    parse: Number, serialize: String },
  compoundFrequency:   { param: 'freq',    default: 12,   parse: Number, serialize: String },
  years:               { param: 'years',   default: 20,   parse: Number, serialize: String },
} as const satisfies Schema<CompoundInterestInputs>

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

const AXIS_TICK = { fill: 'var(--muted-foreground)', fontSize: 12 }

export function CompoundInterestCalculator() {
  const [inputs, setValues] = useCalculatorUrl(SCHEMA)
  const result = calculateCompoundInterest(inputs)

  const chartData = result.yearlyBreakdown.map(d => ({
    year: d.year,
    Contributions: d.contributions,
    Interest: Math.max(0, d.balance - d.contributions),
  }))
  const yTicks = niceTicks(Math.max(0, ...chartData.map((d) => d.Contributions + d.Interest)))

  const canExport =
    inputs.years > 0 &&
    inputs.compoundFrequency > 0 &&
    (inputs.initialInvestment > 0 || inputs.monthlyContribution > 0)

  const growth: ProportionSegment[] = [
    { label: 'Your contributions', value: result.totalContributions, display: fmt(result.totalContributions), colorClass: 'bg-chart-4' },
    { label: 'Interest earned', value: result.totalInterestEarned, display: fmt(result.totalInterestEarned), colorClass: 'bg-chart-1' },
  ]

  return (
    <CalculatorGrid>
      <InputPanel title="Inputs">
        {[
          { label: 'Initial Investment', key: 'initialInvestment' as const, prefix: '$' },
          { label: 'Monthly Contribution', key: 'monthlyContribution' as const, prefix: '$' },
          { label: 'Annual Interest Rate (%)', key: 'annualInterestRate' as const, suffix: '%' },
          { label: 'Compound Frequency (per year)', key: 'compoundFrequency' as const },
          { label: 'Time Period (years)', key: 'years' as const },
        ].map(({ label, key, prefix, suffix }) => (
          <Field
            key={key}
            label={label}
            prefix={prefix}
            suffix={suffix}
            type="number"
            value={inputs[key]}
            onChange={e => setValues({ [key]: Number(e.target.value) } as Partial<CompoundInterestInputs>)}
          />
        ))}
      </InputPanel>

      <ResultPanel id="compound-interest-results">
        <ResultHero label="Future Value" value={fmt(result.futureValue)} caption={`Balance after ${inputs.years} years`}>
          <ProportionBar label="What the future value is made of" segments={growth} />
        </ResultHero>

        <ResultStats>
          <ResultStat label="Total Contributions" value={fmt(result.totalContributions)} />
          <ResultStat label="Interest Earned" value={fmt(result.totalInterestEarned)} />
        </ResultStats>

        <ResultActions
          resultsId="compound-interest-results"
          filename="compound-interest-growth"
          csvRows={result.yearlyBreakdown.map((row) => ({
            Year: row.year,
            Balance: row.balance.toFixed(2),
            'Total Contributed': row.contributions.toFixed(2),
            'Interest Earned': (row.balance - row.contributions).toFixed(2),
          }))}
          canExport={canExport}
        />

        <Card>
          <CardHeader><CardTitle>Growth Over Time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 4, right: 16, left: 16, bottom: 4 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="year" tickFormatter={(v: number) => `Yr ${v}`} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                <YAxis ticks={yTicks} domain={[0, yTicks[yTicks.length - 1]]} tickFormatter={formatCompactUsd} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(v) => typeof v === 'number' ? fmt(v) : String(v)}
                  labelFormatter={(label: number) => `Year ${label}`}
                  contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }}
                />
                <Area type="monotone" dataKey="Contributions" stackId="a" stroke="var(--chart-4)" fill="var(--chart-4-tint)" fillOpacity={1} />
                <Area type="monotone" dataKey="Interest" stackId="a" stroke="var(--chart-1)" fill="var(--chart-1-tint)" fillOpacity={1} />
              </AreaChart>
            </ResponsiveContainer>
            <ChartLegend items={[{ label: 'Contributions', colorClass: 'bg-chart-4-tint' }, { label: 'Interest', colorClass: 'bg-chart-1-tint' }]} />
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
      </ResultPanel>

      <MobileResultBar targetId="compound-interest-results" value={fmt(result.futureValue)} caption={`in ${inputs.years} years`} />
    </CalculatorGrid>
  )
}
