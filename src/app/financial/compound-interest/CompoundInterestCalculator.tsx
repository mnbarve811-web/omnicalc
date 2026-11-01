'use client'

import { useId } from 'react'
import { X } from 'lucide-react'
import { listField, useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import {
  calculateCompoundInterest,
  compareInterestRates,
  toTodaysDollars,
  type AdditionalContribution,
  type CompoundInterestInputs,
} from '@/lib/engine/financial'
import { formatCompactUsd, niceTicks } from '@/lib/format'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/common/Field'
import { CalculatorGrid, InputPanel, ResultPanel } from '@/components/common/CalculatorLayout'
import { ChartLegend, ProportionBar, ResultHero, ResultStat, ResultStats, type ProportionSegment } from '@/components/common/Result'
import { ResultActions } from '@/components/common/ResultActions'
import { MobileResultBar } from '@/components/common/MobileResultBar'

type CalculatorInputs = Required<CompoundInterestInputs>

// URLs are untrusted: each year simulates up to 52 periods, once per rate in the comparison table
const MAX_YEARS = 100

const CONTRIBUTION_FREQUENCIES = [
  { value: 52, label: 'Weekly', amountLabel: 'Weekly Contribution' },
  { value: 26, label: 'Biweekly', amountLabel: 'Biweekly Contribution' },
  { value: 12, label: 'Monthly', amountLabel: 'Monthly Contribution' },
  { value: 4, label: 'Quarterly', amountLabel: 'Quarterly Contribution' },
  { value: 1, label: 'Annually', amountLabel: 'Annual Contribution' },
]

const RATE_OFFSETS = [-2, -1, 0, 1, 2]

const clampTo = (min: number, max: number) => (raw: string) => Math.min(max, Math.max(min, Number(raw)))
const parseYear = (min: number) => (raw: string) => Math.round(clampTo(min, MAX_YEARS)(raw))
const parseNonNegative = clampTo(0, Number.MAX_SAFE_INTEGER)

function parseContributionFrequency(raw: string): number {
  const value = Number(raw)
  if (!CONTRIBUTION_FREQUENCIES.some(f => f.value === value)) throw new Error(`Unsupported contribution frequency ${raw}`)
  return value
}

const SCHEMA = {
  initialInvestment:          { param: 'init',    default: 10000, parse: parseNonNegative, serialize: String },
  monthlyContribution:        { param: 'monthly', default: 500,   parse: parseNonNegative, serialize: String },
  annualInterestRate:         { param: 'rate',    default: 7,     parse: clampTo(-100, 100), serialize: String },
  compoundFrequency:          { param: 'freq',    default: 12,    parse: parseNonNegative, serialize: String },
  years:                      { param: 'years',   default: 20,    parse: parseYear(0), serialize: String },
  contributionFrequency:      { param: 'cf',      default: 12,    parse: parseContributionFrequency, serialize: String },
  annualContributionIncrease: { param: 'inc',     default: 0,     parse: clampTo(0, 100), serialize: String },
  inflationRate:              { param: 'infl',    default: 3,     parse: clampTo(0, 100), serialize: String },
  taxRate:                    { param: 'tax',     default: 0,     parse: clampTo(0, 100), serialize: String },
  additionalContributions: listField<AdditionalContribution>(
    'extra',
    [],
    item => [item.year, item.amount],
    ([year, amount]) => ({ year: parseYear(1)(year), amount: parseNonNegative(amount) }),
  ),
} as const satisfies Schema<CalculatorInputs>

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

const AXIS_TICK = { fill: 'var(--muted-foreground)', fontSize: 12 }

export function CompoundInterestCalculator() {
  const [inputs, setValues] = useCalculatorUrl(SCHEMA)
  const contributionFrequencyId = useId()
  // The headline figures are pre-tax; the tax setting only feeds the after-tax estimate
  const pretaxInputs = { ...inputs, taxRate: 0 }
  const result = calculateCompoundInterest(pretaxInputs)
  const hasTax = inputs.taxRate > 0
  const afterTax = hasTax ? calculateCompoundInterest(inputs) : null
  const hasInflation = inputs.inflationRate > 0
  const todaysDollars = toTodaysDollars(result.futureValue, inputs.inflationRate, Math.max(0, inputs.years))
  const rateComparison = compareInterestRates(pretaxInputs, RATE_OFFSETS)
  const currentRate = Math.round(inputs.annualInterestRate * 100) / 100

  const frequency = CONTRIBUTION_FREQUENCIES.find(f => f.value === inputs.contributionFrequency) ?? CONTRIBUTION_FREQUENCIES[2]
  const extras = inputs.additionalContributions
  const hasAdvanced = inputs.annualContributionIncrease > 0 || hasTax || extras.length > 0 || inputs.inflationRate !== SCHEMA.inflationRate.default

  const chartData = result.yearlyBreakdown.map(d => ({
    year: d.year,
    Contributions: d.contributions,
    Interest: Math.max(0, d.balance - d.contributions),
    "Today's Dollars": d.inflationAdjustedBalance,
  }))
  const yTicks = niceTicks(Math.max(0, ...chartData.map((d) => d.Contributions + d.Interest)))

  const canExport =
    inputs.years > 0 &&
    inputs.compoundFrequency > 0 &&
    (inputs.initialInvestment > 0 || inputs.monthlyContribution > 0 || extras.some(e => e.amount > 0))

  const growth: ProportionSegment[] = [
    { label: 'Your contributions', value: result.totalContributions, display: fmt(result.totalContributions), colorClass: 'bg-chart-4' },
    { label: 'Interest earned', value: result.totalInterestEarned, display: fmt(result.totalInterestEarned), colorClass: 'bg-chart-1' },
  ]

  function updateExtra(index: number, patch: Partial<AdditionalContribution>) {
    setValues({ additionalContributions: extras.map((e, i) => i === index ? { ...e, ...patch } : e) })
  }

  function addExtra() {
    setValues({ additionalContributions: [...extras, { year: Math.min(5, Math.max(1, inputs.years)), amount: 1000 }] })
  }

  function removeExtra(index: number) {
    setValues({ additionalContributions: extras.filter((_, i) => i !== index) })
  }

  return (
    <CalculatorGrid>
      <InputPanel title="Inputs">
        <Field label="Initial Investment" prefix="$" type="number" min={0} value={inputs.initialInvestment} onChange={e => setValues({ initialInvestment: Number(e.target.value) })} />
        <div>
          <label htmlFor={contributionFrequencyId} className="mb-1.5 block text-sm font-medium text-foreground">Contribution Frequency</label>
          <select
            id={contributionFrequencyId}
            value={inputs.contributionFrequency}
            onChange={e => setValues({ contributionFrequency: Number(e.target.value) })}
            className="h-11 w-full rounded-sm border border-input bg-card px-3 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:h-10 md:text-sm"
          >
            {CONTRIBUTION_FREQUENCIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>
        {[
          { label: frequency.amountLabel, key: 'monthlyContribution' as const, prefix: '$' },
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
            onChange={e => setValues({ [key]: Number(e.target.value) } as Partial<CalculatorInputs>)}
          />
        ))}

        <Accordion defaultValue={hasAdvanced ? ['advanced'] : []}>
          <AccordionItem value="advanced">
            <AccordionTrigger>Advanced options</AccordionTrigger>
            <AccordionContent className="space-y-5 pt-2">
              <Field
                label="Annual Contribution Increase (%)"
                suffix="%"
                type="number"
                min={0}
                hint="Raises the regular contribution at the start of each year."
                value={inputs.annualContributionIncrease}
                onChange={e => setValues({ annualContributionIncrease: Number(e.target.value) })}
              />
              <Field
                label="Inflation Rate (%)"
                suffix="%"
                type="number"
                min={0}
                hint="Used to show the future value in today's dollars."
                value={inputs.inflationRate}
                onChange={e => setValues({ inflationRate: Number(e.target.value) })}
              />
              <Field
                label="Tax on Returns (%)"
                suffix="%"
                type="number"
                min={0}
                hint="Approximation for a taxable account: this share of each year's growth is paid as tax that year."
                value={inputs.taxRate}
                onChange={e => setValues({ taxRate: Number(e.target.value) })}
              />
              <fieldset className="space-y-3">
                <legend className="mb-1.5 block text-sm font-medium text-foreground">Additional Contributions</legend>
                <p className="text-xs text-muted-foreground">One-time deposits made at the start of the chosen year.</p>
                {extras.map((extra, i) => (
                  <div key={i} className="flex items-end gap-2">
                    <Field label="Year" type="number" min={1} className="w-20" value={extra.year} onChange={e => updateExtra(i, { year: Number(e.target.value) })} />
                    <Field label="Amount" prefix="$" type="number" min={0} className="min-w-0 flex-1" value={extra.amount} onChange={e => updateExtra(i, { amount: Number(e.target.value) })} />
                    <Button type="button" variant="ghost" size="icon" aria-label={`Remove additional contribution ${i + 1}`} onClick={() => removeExtra(i)}>
                      <X aria-hidden />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" className="w-full" onClick={addExtra}>+ Add Contribution</Button>
              </fieldset>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </InputPanel>

      <ResultPanel id="compound-interest-results">
        <ResultHero label="Future Value" value={fmt(result.futureValue)} caption={`Balance after ${inputs.years} years`}>
          <ProportionBar label="What the future value is made of" segments={growth} />
        </ResultHero>

        <ResultStats>
          <ResultStat label="Total Contributions" value={fmt(result.totalContributions)} />
          <ResultStat label="Interest Earned" value={fmt(result.totalInterestEarned)} />
          <ResultStat label="In Today's Dollars" value={fmt(todaysDollars)} />
          {afterTax && <ResultStat label="After-Tax Value (approx.)" value={fmt(afterTax.futureValue)} />}
        </ResultStats>

        <ResultActions
          resultsId="compound-interest-results"
          filename="compound-interest-growth"
          csvRows={result.yearlyBreakdown.map((row, i) => ({
            Year: row.year,
            Balance: row.balance.toFixed(2),
            'Total Contributed': row.contributions.toFixed(2),
            'Interest Earned': (row.balance - row.contributions).toFixed(2),
            ...(hasInflation && { "Balance in Today's Dollars": row.inflationAdjustedBalance.toFixed(2) }),
            ...(afterTax && { 'After-Tax Balance': afterTax.yearlyBreakdown[i].balance.toFixed(2) }),
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
                {hasInflation && (
                  <Area type="monotone" dataKey="Today's Dollars" stroke="var(--foreground)" strokeDasharray="5 4" fill="none" />
                )}
              </AreaChart>
            </ResponsiveContainer>
            <ChartLegend
              items={[
                { label: 'Contributions', colorClass: 'bg-chart-4-tint' },
                { label: 'Interest', colorClass: 'bg-chart-1-tint' },
                ...(hasInflation ? [{ label: "Today's Dollars (dashed)", colorClass: 'bg-foreground' }] : []),
              ]}
            />
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
                  {hasInflation && <TableHead className="text-right">Today&apos;s Dollars</TableHead>}
                  {afterTax && <TableHead className="text-right">After Tax</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.yearlyBreakdown.map((row, i) => (
                  <TableRow key={row.year}>
                    <TableCell>{row.year}</TableCell>
                    <TableCell className="text-right">{fmt(row.balance)}</TableCell>
                    <TableCell className="text-right">{fmt(row.contributions)}</TableCell>
                    <TableCell className="text-right">{fmt(row.balance - row.contributions)}</TableCell>
                    {hasInflation && <TableCell className="text-right">{fmt(row.inflationAdjustedBalance)}</TableCell>}
                    {afterTax && <TableCell className="text-right">{fmt(afterTax.yearlyBreakdown[i].balance)}</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Compare Interest Rates</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rate</TableHead>
                  <TableHead className="text-right">Future Value</TableHead>
                  <TableHead className="text-right">Difference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rateComparison.map(row => {
                  const isCurrent = row.annualInterestRate === currentRate
                  const difference = row.futureValue - result.futureValue
                  return (
                    <TableRow key={row.annualInterestRate} className={isCurrent ? 'font-semibold' : undefined}>
                      <TableCell>{`${row.annualInterestRate}%${isCurrent ? ' (current)' : ''}`}</TableCell>
                      <TableCell className="text-right">{fmt(row.futureValue)}</TableCell>
                      <TableCell className="text-right">{isCurrent ? '–' : `${difference > 0 ? '+' : '−'}${fmt(Math.abs(difference))}`}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </ResultPanel>

      <MobileResultBar targetId="compound-interest-results" value={fmt(result.futureValue)} caption={`in ${inputs.years} years`} />
    </CalculatorGrid>
  )
}
