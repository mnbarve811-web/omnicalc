'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateSalary, type SalaryInputs, type PayFrequency } from '@/lib/engine/financial'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ExportButtons } from '@/components/common/ExportButtons'

const SCHEMA = {
  grossPay:        { param: 'gross',   default: 5000,     parse: Number, serialize: String },
  payFrequency:    { param: 'freq',    default: 'monthly' as PayFrequency, parse: s => s as PayFrequency, serialize: s => s },
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

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#6366f1', '#8b5cf6']

export function SalaryCalculator() {
  const [inputs, setValues] = useCalculatorUrl(SCHEMA)
  const result = calculateSalary(inputs)

  const deductionData = [
    { name: 'Federal Tax', value: result.federalTax },
    { name: 'State Tax', value: result.stateTax },
    { name: 'Social Security', value: result.socialSecurity },
    { name: 'Medicare', value: result.medicare },
    { name: 'Other', value: result.otherDeductions },
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
      <Card>
        <CardHeader><CardTitle>Inputs</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Gross Pay per Period</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                type="number"
                value={inputs.grossPay}
                onChange={e => setValues({ grossPay: Number(e.target.value) })}
                className="pl-7"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Pay Frequency</label>
            <select
              value={inputs.payFrequency}
              onChange={e => setValues({ payFrequency: e.target.value as PayFrequency })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {FREQ_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          {[
            { label: 'Federal Tax Rate (%)', key: 'federalTaxRate' as const },
            { label: 'State Tax Rate (%)', key: 'stateTaxRate' as const },
            { label: 'Other Deductions ($)', key: 'otherDeductions' as const },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="text-sm font-medium mb-1 block">{label}</label>
              <Input
                type="number"
                value={inputs[key]}
                onChange={e => setValues({ [key]: Number(e.target.value) } as Partial<SalaryInputs>)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div id="salary-results" className="space-y-6">
        <ExportButtons
          resultsId="salary-results"
          filename="salary-paycheck-breakdown"
          csvRows={csvRows}
          disabled={!canExport}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Net Pay (per period)</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{fmt(result.netPay)}</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Annual Gross</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{fmt(result.annualGross)}</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Annual Net</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{fmt(result.annualNet)}</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Deductions Breakdown</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deductionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={v => `$${v}`} />
                <YAxis type="category" dataKey="name" width={110} />
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Bar dataKey="value" name="Amount">
                  {deductionData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
                <TableRow><TableCell className="font-medium">Gross Pay</TableCell><TableCell className="text-right">{fmt(result.grossPay)}</TableCell></TableRow>
                <TableRow><TableCell>Federal Tax</TableCell><TableCell className="text-right text-red-600">- {fmt(result.federalTax)}</TableCell></TableRow>
                <TableRow><TableCell>State Tax</TableCell><TableCell className="text-right text-red-600">- {fmt(result.stateTax)}</TableCell></TableRow>
                <TableRow><TableCell>Social Security (6.2%)</TableCell><TableCell className="text-right text-red-600">- {fmt(result.socialSecurity)}</TableCell></TableRow>
                <TableRow><TableCell>Medicare (1.45%)</TableCell><TableCell className="text-right text-red-600">- {fmt(result.medicare)}</TableCell></TableRow>
                {result.otherDeductions > 0 && <TableRow><TableCell>Other Deductions</TableCell><TableCell className="text-right text-red-600">- {fmt(result.otherDeductions)}</TableCell></TableRow>}
                <TableRow className="font-bold border-t-2"><TableCell>Net Pay</TableCell><TableCell className="text-right text-green-600">{fmt(result.netPay)}</TableCell></TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
