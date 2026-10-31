'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateMortgage, type MortgageInputs } from '@/lib/engine/financial'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExportButtons } from '@/components/common/ExportButtons'

const SCHEMA = {
  homePrice:     { param: 'price', default: 400000, parse: Number, serialize: String },
  downPayment:   { param: 'down',  default: 80000,  parse: Number, serialize: String },
  loanTermYears: { param: 'term',  default: 30,     parse: Number, serialize: String },
  interestRate:  { param: 'rate',  default: 7.0,    parse: Number, serialize: String },
  propertyTax:   { param: 'tax',   default: 300,    parse: Number, serialize: String },
  homeInsurance: { param: 'ins',   default: 120,    parse: Number, serialize: String },
  hoa:           { param: 'hoa',   default: 0,      parse: Number, serialize: String },
} as const satisfies Schema<MortgageInputs>

const fmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function fmtCurrency(n: number): string {
  return fmt.format(n)
}

interface YearlyRow {
  year: number
  principalPaid: number
  interestPaid: number
  balance: number
}

export function MortgageCalculator() {
  const [values, setValues] = useCalculatorUrl<MortgageInputs & Record<string, unknown>>(
    SCHEMA as Schema<MortgageInputs & Record<string, unknown>>
  )
  const result = calculateMortgage(values)

  const yearlyData: YearlyRow[] = []
  const schedule = result.amortizationSchedule
  for (let i = 0; i < schedule.length; i += 12) {
    const chunk = schedule.slice(i, i + 12)
    const year = Math.ceil((i + 1) / 12)
    const principalPaid = chunk.reduce((sum, r) => sum + r.principal, 0)
    const interestPaid = chunk.reduce((sum, r) => sum + r.interest, 0)
    const balance = chunk[chunk.length - 1]?.balance ?? 0
    yearlyData.push({ year, principalPaid, interestPaid, balance })
  }

  const loanAmount = Math.max(0, values.homePrice - values.downPayment)
  const canExport = values.homePrice > 0 && values.loanTermYears > 0 && loanAmount > 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
      {/* Left column: inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Home Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                type="number"
                className="pl-7"
                value={values.homePrice}
                onChange={(e) => setValues({ homePrice: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Down Payment</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                type="number"
                className="pl-7"
                value={values.downPayment}
                onChange={(e) => setValues({ downPayment: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Loan Term</label>
            <div className="relative">
              <Input
                type="number"
                className="pr-16"
                value={values.loanTermYears}
                onChange={(e) => setValues({ loanTermYears: Number(e.target.value) })}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">years</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Interest Rate</label>
            <div className="relative">
              <Input
                type="number"
                step="0.1"
                className="pr-8"
                value={values.interestRate}
                onChange={(e) => setValues({ interestRate: Number(e.target.value) })}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Property Tax (monthly)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                type="number"
                className="pl-7"
                value={values.propertyTax}
                onChange={(e) => setValues({ propertyTax: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Home Insurance (monthly)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                type="number"
                className="pl-7"
                value={values.homeInsurance}
                onChange={(e) => setValues({ homeInsurance: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">HOA (monthly)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                type="number"
                className="pl-7"
                value={values.hoa}
                onChange={(e) => setValues({ hoa: Number(e.target.value) })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right column: results */}
      <div id="mortgage-results" className="space-y-6">
        <ExportButtons
          resultsId="mortgage-results"
          filename="mortgage-amortization"
          csvRows={schedule.map((row) => ({
            Month: row.month,
            Payment: row.payment.toFixed(2),
            Principal: row.principal.toFixed(2),
            Interest: row.interest.toFixed(2),
            Balance: row.balance.toFixed(2),
          }))}
          disabled={!canExport}
        />

        {/* Summary tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xs text-muted-foreground font-normal">Monthly P&I</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">{fmtCurrency(result.monthlyPrincipalAndInterest)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xs text-muted-foreground font-normal">Total Monthly</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">{fmtCurrency(result.monthlyTotal)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xs text-muted-foreground font-normal">Total Interest</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">{fmtCurrency(result.totalInterestPaid)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xs text-muted-foreground font-normal">Loan Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">{fmtCurrency(loanAmount)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Area chart */}
        <Card>
          <CardHeader>
            <CardTitle>Principal vs Interest Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={yearlyData} margin={{ top: 4, right: 16, left: 16, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" tickFormatter={(v: number) => `Yr ${v}`} />
                <YAxis tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: number) => fmtCurrency(value)}
                  labelFormatter={(label: number) => `Year ${label}`}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="principalPaid"
                  stackId="a"
                  name="Principal Paid"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="interestPaid"
                  stackId="a"
                  name="Interest Paid"
                  stroke="#dc2626"
                  fill="#dc2626"
                  fillOpacity={0.4}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Amortization table */}
        <Tabs defaultValue="yearly">
          <TabsList>
            <TabsTrigger value="yearly">Yearly Summary</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Detail</TabsTrigger>
          </TabsList>

          <TabsContent value="yearly">
            <Card>
              <CardContent className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead>Principal Paid</TableHead>
                      <TableHead>Interest Paid</TableHead>
                      <TableHead>Remaining Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {yearlyData.map((row) => (
                      <TableRow key={row.year}>
                        <TableCell>{row.year}</TableCell>
                        <TableCell>{fmtCurrency(row.principalPaid)}</TableCell>
                        <TableCell>{fmtCurrency(row.interestPaid)}</TableCell>
                        <TableCell>{fmtCurrency(row.balance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly">
            <Card>
              <CardContent className="pt-4">
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
                    {schedule.map((row) => (
                      <TableRow key={row.month}>
                        <TableCell>{row.month}</TableCell>
                        <TableCell>{fmtCurrency(row.payment)}</TableCell>
                        <TableCell>{fmtCurrency(row.principal)}</TableCell>
                        <TableCell>{fmtCurrency(row.interest)}</TableCell>
                        <TableCell>{fmtCurrency(row.balance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
