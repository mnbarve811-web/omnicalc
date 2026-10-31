'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateAutoLoan, type AutoLoanInputs } from '@/lib/engine/financial'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const SCHEMA = {
  vehiclePrice:   { param: 'price',    default: 30000, parse: Number, serialize: String },
  downPayment:    { param: 'down',     default: 5000,  parse: Number, serialize: String },
  tradeInValue:   { param: 'trade',    default: 0,     parse: Number, serialize: String },
  interestRate:   { param: 'rate',     default: 6.0,   parse: Number, serialize: String },
  loanTermMonths: { param: 'term',     default: 60,    parse: Number, serialize: String },
  salesTaxRate:   { param: 'tax',      default: 8,     parse: Number, serialize: String },
} as const satisfies Schema<AutoLoanInputs>

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export function AutoLoanCalculator() {
  const [inputs, setValues] = useCalculatorUrl(SCHEMA)
  const result = calculateAutoLoan(inputs)

  const yearlyData: { year: number; principalPaid: number; interestPaid: number }[] = []
  for (let y = 0; y < Math.ceil(inputs.loanTermMonths / 12); y++) {
    const slice = result.amortizationSchedule.slice(y * 12, (y + 1) * 12)
    yearlyData.push({
      year: y + 1,
      principalPaid: slice.reduce((s, r) => s + r.principal, 0),
      interestPaid: slice.reduce((s, r) => s + r.interest, 0),
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
      <Card>
        <CardHeader><CardTitle>Inputs</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: 'Vehicle Price', key: 'vehiclePrice' as const, prefix: '$' },
            { label: 'Down Payment', key: 'downPayment' as const, prefix: '$' },
            { label: 'Trade-In Value', key: 'tradeInValue' as const, prefix: '$' },
            { label: 'Annual Interest Rate (%)', key: 'interestRate' as const, suffix: '%' },
            { label: 'Loan Term (months)', key: 'loanTermMonths' as const },
            { label: 'Sales Tax Rate (%)', key: 'salesTaxRate' as const, suffix: '%' },
          ].map(({ label, key, prefix, suffix }) => (
            <div key={key}>
              <label className="text-sm font-medium mb-1 block">{label}</label>
              <div className="relative">
                {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{prefix}</span>}
                <Input
                  type="number"
                  value={inputs[key]}
                  onChange={e => setValues({ [key]: Number(e.target.value) } as Partial<AutoLoanInputs>)}
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
          <Card><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Monthly Payment</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{fmt(result.monthlyPayment)}</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Loan Amount</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{fmt(result.loanBalance)}</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Total Interest</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{fmt(result.totalInterestPaid)}</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Principal vs Interest by Year</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -2 }} />
                <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Legend />
                <Area type="monotone" dataKey="principalPaid" stackId="a" stroke="#6366f1" fill="#c7d2fe" name="Principal" />
                <Area type="monotone" dataKey="interestPaid" stackId="a" stroke="#f59e0b" fill="#fde68a" name="Interest" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Amortization Schedule</CardTitle></CardHeader>
          <CardContent className="overflow-auto max-h-80">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Payment</TableHead>
                  <TableHead className="text-right">Principal</TableHead>
                  <TableHead className="text-right">Interest</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.amortizationSchedule.map(row => (
                  <TableRow key={row.month}>
                    <TableCell>{row.month}</TableCell>
                    <TableCell className="text-right">{fmt(row.payment)}</TableCell>
                    <TableCell className="text-right">{fmt(row.principal)}</TableCell>
                    <TableCell className="text-right">{fmt(row.interest)}</TableCell>
                    <TableCell className="text-right">{fmt(row.balance)}</TableCell>
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
