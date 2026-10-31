'use client'

import { useId } from 'react'
import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateSalary, type SalaryInputs, type PayFrequency } from '@/lib/engine/financial'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Field } from '@/components/common/Field'
import { CalculatorGrid, InputPanel, ResultPanel } from '@/components/common/CalculatorLayout'
import { ProportionBar, ResultHero, ResultStat, ResultStats, type ProportionSegment } from '@/components/common/Result'
import { ResultActions } from '@/components/common/ResultActions'
import { MobileResultBar } from '@/components/common/MobileResultBar'

// The hook falls back to the default when parse throws, so an unknown frequency never reaches the engine
function parsePayFrequency(s: string): PayFrequency {
  const match = FREQ_OPTIONS.find(f => f.value === s)
  if (!match) throw new Error(`Unknown pay frequency: ${s}`)
  return match.value
}

const SCHEMA = {
  grossPay:        { param: 'gross',   default: 5000,     parse: Number, serialize: String },
  payFrequency:    { param: 'freq',    default: 'monthly' as PayFrequency, parse: parsePayFrequency, serialize: s => s },
  federalTaxRate:  { param: 'fed',     default: 22,       parse: Number, serialize: String },
  stateTaxRate:    { param: 'state',   default: 5,        parse: Number, serialize: String },
  otherDeductions: { param: 'other',   default: 200,      parse: Number, serialize: String },
} as const satisfies Schema<SalaryInputs>

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

const FREQ_OPTIONS: { value: PayFrequency; label: string }[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'semimonthly', label: 'Semi-monthly' },
  { value: 'monthly', label: 'Monthly' },
]

const AXIS_TICK = { fill: 'var(--muted-foreground)', fontSize: 12 }

export function SalaryCalculator() {
  const [inputs, setValues] = useCalculatorUrl(SCHEMA)
  const result = calculateSalary(inputs)
  const payFrequencyId = useId()

  // Taxes share the amber series in both the bar and the chart; other deductions stay neutral
  const deductionData = [
    { name: 'Federal Tax', value: result.federalTax, fill: 'var(--chart-2)', fillOpacity: 1 },
    { name: 'State Tax', value: result.stateTax, fill: 'var(--chart-2)', fillOpacity: 0.75 },
    { name: 'Social Security', value: result.socialSecurity, fill: 'var(--chart-2)', fillOpacity: 0.5 },
    { name: 'Medicare', value: result.medicare, fill: 'var(--chart-2)', fillOpacity: 0.3 },
    { name: 'Other', value: result.otherDeductions, fill: 'var(--chart-4)', fillOpacity: 1 },
  ].filter(d => d.value > 0)

  const canExport = inputs.grossPay > 0

  const csvRows = [
    { Item: 'Gross Pay (per period)', Amount: result.grossPay.toFixed(2) },
    { Item: 'Federal Tax', Amount: result.federalTax.toFixed(2) },
    { Item: 'State Tax', Amount: result.stateTax.toFixed(2) },
    { Item: 'Social Security (6.2%)', Amount: result.socialSecurity.toFixed(2) },
    { Item: 'Medicare (1.45%)', Amount: result.medicare.toFixed(2) },
    { Item: 'Other Deductions', Amount: result.otherDeductions.toFixed(2) },
    { Item: 'Net Pay (per period)', Amount: result.netPay.toFixed(2) },
    { Item: 'Annual Gross', Amount: result.annualGross.toFixed(2) },
    { Item: 'Annual Net', Amount: result.annualNet.toFixed(2) },
  ]

  const paycheck: ProportionSegment[] = [
    { label: 'Take-home pay', value: result.netPay, display: fmt(result.netPay), colorClass: 'bg-chart-1' },
    { label: 'Federal tax', value: result.federalTax, display: fmt(result.federalTax), colorClass: 'bg-chart-2' },
    { label: 'State tax', value: result.stateTax, display: fmt(result.stateTax), colorClass: 'bg-chart-2/75' },
    { label: 'Social Security tax', value: result.socialSecurity, display: fmt(result.socialSecurity), colorClass: 'bg-chart-2/50' },
    { label: 'Medicare tax', value: result.medicare, display: fmt(result.medicare), colorClass: 'bg-chart-2/30' },
    { label: 'Other deductions', value: result.otherDeductions, display: fmt(result.otherDeductions), colorClass: 'bg-chart-4' },
  ]

  const frequencyLabel = FREQ_OPTIONS.find(f => f.value === inputs.payFrequency)?.label ?? ''

  return (
    <CalculatorGrid>
      <InputPanel title="Inputs">
        <Field label="Gross Pay per Period" prefix="$" type="number" value={inputs.grossPay} onChange={e => setValues({ grossPay: Number(e.target.value) })} />
        <div>
          <label htmlFor={payFrequencyId} className="mb-1.5 block text-sm font-medium text-foreground">Pay Frequency</label>
          <select
            id={payFrequencyId}
            value={inputs.payFrequency}
            onChange={e => setValues({ payFrequency: e.target.value as PayFrequency })}
            className="h-11 w-full rounded-sm border border-input bg-card px-3 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:h-10 md:text-sm"
          >
            {FREQ_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        {[
          { label: 'Federal Tax Rate (%)', key: 'federalTaxRate' as const, suffix: '%' },
          { label: 'State Tax Rate (%)', key: 'stateTaxRate' as const, suffix: '%' },
          { label: 'Other Deductions ($)', key: 'otherDeductions' as const, prefix: '$' },
        ].map(({ label, key, prefix, suffix }) => (
          <Field
            key={key}
            label={label}
            prefix={prefix}
            suffix={suffix}
            type="number"
            value={inputs[key]}
            onChange={e => setValues({ [key]: Number(e.target.value) } as Partial<SalaryInputs>)}
          />
        ))}
      </InputPanel>

      <ResultPanel id="salary-results">
        <ResultHero
          label="Net Pay (per period)"
          value={fmt(result.netPay)}
          caption={`${frequencyLabel} take-home from ${fmt(result.grossPay)} gross`}
        >
          <ProportionBar label="Where each paycheck goes" segments={paycheck} />
        </ResultHero>

        <ResultStats>
          <ResultStat label="Annual Gross" value={fmt(result.annualGross)} />
          <ResultStat label="Annual Net" value={fmt(result.annualNet)} />
        </ResultStats>

        <ResultActions
          resultsId="salary-results"
          filename="salary-paycheck-breakdown"
          csvRows={csvRows}
          canExport={canExport}
        />

        <Card>
          <CardHeader><CardTitle>Deductions Breakdown</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deductionData} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                <CartesianGrid stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tickFormatter={v => `$${v}`} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" width={110} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(v: number) => fmt(v)}
                  cursor={{ fill: 'var(--muted)' }}
                  contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }}
                />
                <Bar dataKey="value" name="Amount" radius={[0, 4, 4, 0]}>
                  {deductionData.map(d => <Cell key={d.name} fill={d.fill} fillOpacity={d.fillOpacity} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Pay Breakdown</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Per Period</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow><TableCell className="font-medium">Gross Pay</TableCell><TableCell className="text-right tabular-nums">{fmt(result.grossPay)}</TableCell></TableRow>
                <TableRow><TableCell>Federal Tax</TableCell><TableCell className="text-right tabular-nums">- {fmt(result.federalTax)}</TableCell></TableRow>
                <TableRow><TableCell>State Tax</TableCell><TableCell className="text-right tabular-nums">- {fmt(result.stateTax)}</TableCell></TableRow>
                <TableRow><TableCell>Social Security (6.2%)</TableCell><TableCell className="text-right tabular-nums">- {fmt(result.socialSecurity)}</TableCell></TableRow>
                <TableRow><TableCell>Medicare (1.45%)</TableCell><TableCell className="text-right tabular-nums">- {fmt(result.medicare)}</TableCell></TableRow>
                {result.otherDeductions > 0 && <TableRow><TableCell>Other Deductions</TableCell><TableCell className="text-right tabular-nums">- {fmt(result.otherDeductions)}</TableCell></TableRow>}
                <TableRow className="font-semibold border-t-2"><TableCell>Net Pay</TableCell><TableCell className="text-right tabular-nums">{fmt(result.netPay)}</TableCell></TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </ResultPanel>

      <MobileResultBar targetId="salary-results" value={fmt(result.netPay)} caption="per paycheck" />
    </CalculatorGrid>
  )
}
