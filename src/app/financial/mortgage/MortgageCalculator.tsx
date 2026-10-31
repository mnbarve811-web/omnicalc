'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateMortgage, type MortgageInputs } from '@/lib/engine'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const SCHEMA = {
  homePrice:     { param: 'price', default: 300000, parse: Number, serialize: String },
  downPayment:   { param: 'down',  default: 60000,  parse: Number, serialize: String },
  interestRate:  { param: 'rate',  default: 6.5,    parse: Number, serialize: String },
  loanTermYears: { param: 'term',  default: 30,     parse: Number, serialize: String },
  propertyTax:   { param: 'tax',   default: 200,    parse: Number, serialize: String },
  homeInsurance: { param: 'ins',   default: 100,    parse: Number, serialize: String },
  hoa:           { param: 'hoa',   default: 0,      parse: Number, serialize: String },
} satisfies Schema<MortgageInputs>

const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

function sliderVal(v: number | readonly number[]): number {
  return Array.isArray(v) ? (v as number[])[0] : (v as number)
}

export function MortgageCalculator() {
  const [values, setValues] = useCalculatorUrl(SCHEMA)
  const result = calculateMortgage(values)

  let cumInterest = 0
  const chartData: Array<{ year: number; balance: number; interestPaid: number }> = []
  result.amortizationSchedule.forEach(row => {
    cumInterest += row.interest
    if (row.month % 12 === 0) {
      chartData.push({ year: row.month / 12, balance: Math.round(row.balance), interestPaid: Math.round(cumInterest) })
    }
  })

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader><CardTitle>Loan Details</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Home Price: {fmt(values.homePrice)}</label>
            <Slider min={50000} max={2000000} step={10000} value={[values.homePrice]}
              onValueChange={(v) => setValues({ homePrice: sliderVal(v) })} />
            <Input type="number" value={values.homePrice}
              onChange={e => { const v = Number(e.target.value); if (v > 0) setValues({ homePrice: v }) }} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Down Payment: {fmt(values.downPayment)} ({Math.round(values.downPayment / values.homePrice * 100)}%)</label>
            <Slider min={0} max={values.homePrice} step={5000} value={[values.downPayment]}
              onValueChange={(v) => setValues({ downPayment: sliderVal(v) })} />
            <Input type="number" value={values.downPayment}
              onChange={e => { const v = Number(e.target.value); if (v >= 0) setValues({ downPayment: v }) }} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Interest Rate: {values.interestRate}%</label>
            <Slider min={1} max={15} step={0.1} value={[values.interestRate]}
              onValueChange={(v) => setValues({ interestRate: sliderVal(v) })} />
            <Input type="number" step="0.1" value={values.interestRate}
              onChange={e => { const v = Number(e.target.value); if (v > 0) setValues({ interestRate: v }) }} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Loan Term</label>
            <Tabs value={String(values.loanTermYears)} onValueChange={v => setValues({ loanTermYears: Number(v) })}>
              <TabsList>
                {[10, 15, 20, 30].map(y => <TabsTrigger key={y} value={String(y)}>{y} yr</TabsTrigger>)}
              </TabsList>
            </Tabs>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Property Tax/mo</label>
              <Input type="number" value={values.propertyTax}
                onChange={e => setValues({ propertyTax: Number(e.target.value) || 0 })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Home Insurance/mo</label>
              <Input type="number" value={values.homeInsurance}
                onChange={e => setValues({ homeInsurance: Number(e.target.value) || 0 })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">HOA/mo</label>
              <Input type="number" value={values.hoa}
                onChange={e => setValues({ hoa: Number(e.target.value) || 0 })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Monthly P&I', value: fmt(result.monthlyPrincipalAndInterest) },
          { label: 'Monthly Total', value: fmt(result.monthlyTotal) },
          { label: 'Total Interest', value: fmt(result.totalInterestPaid) },
          { label: 'Loan Amount', value: fmt(values.homePrice - values.downPayment) },
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
        <CardHeader><CardTitle>Balance vs. Interest Paid Over Time</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
              <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => fmt(v)} />
              <Area type="monotone" dataKey="balance" stackId="1" stroke="#2563eb" fill="#dbeafe" name="Remaining Balance" />
              <Area type="monotone" dataKey="interestPaid" stackId="2" stroke="#dc2626" fill="#fee2e2" name="Cumulative Interest" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Amortization Schedule</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-auto max-h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.amortizationSchedule.map(row => (
                  <TableRow key={row.month}>
                    <TableCell>{row.month}</TableCell>
                    <TableCell>{fmt(row.payment)}</TableCell>
                    <TableCell>{fmt(row.principal)}</TableCell>
                    <TableCell>{fmt(row.interest)}</TableCell>
                    <TableCell>{fmt(row.balance)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
