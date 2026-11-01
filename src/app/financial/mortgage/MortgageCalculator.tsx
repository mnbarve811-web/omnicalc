'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateMortgage, type MortgageInputs } from '@/lib/engine/financial'
import { formatCompactUsd, niceTicks } from '@/lib/format'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Field } from '@/components/common/Field'
import { CalculatorGrid, InputPanel, ResultPanel } from '@/components/common/CalculatorLayout'
import { ChartLegend, ProportionBar, ResultHero, ResultStat, ResultStats, type ProportionSegment } from '@/components/common/Result'
import { ResultActions } from '@/components/common/ResultActions'
import { MobileResultBar } from '@/components/common/MobileResultBar'

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

  const yTicks = niceTicks(Math.max(0, ...yearlyData.map((row) => row.principalPaid + row.interestPaid)))

  const loanAmount = Math.max(0, values.homePrice - values.downPayment)
  const canExport = values.homePrice > 0 && values.loanTermYears > 0 && loanAmount > 0

  const breakdown: ProportionSegment[] = result.monthlyTotal > 0
    ? [
        { label: 'Principal & interest', value: result.monthlyPrincipalAndInterest, display: fmtCurrency(result.monthlyPrincipalAndInterest), colorClass: 'bg-chart-1' },
        { label: 'Property tax', value: values.propertyTax, display: fmtCurrency(values.propertyTax), colorClass: 'bg-chart-2' },
        { label: 'Insurance', value: values.homeInsurance, display: fmtCurrency(values.homeInsurance), colorClass: 'bg-chart-4' },
        { label: 'HOA', value: values.hoa, display: fmtCurrency(values.hoa), colorClass: 'bg-chart-4-tint' },
      ]
    : []

  return (
    <CalculatorGrid>
      <InputPanel title="Loan Details">
        <Field label="Home Price" prefix="$" type="number" value={values.homePrice} onChange={(e) => setValues({ homePrice: Number(e.target.value) })} />
        <Field label="Down Payment" prefix="$" type="number" value={values.downPayment} onChange={(e) => setValues({ downPayment: Number(e.target.value) })} />
        <Field label="Loan Term" suffix="years" type="number" value={values.loanTermYears} onChange={(e) => setValues({ loanTermYears: Number(e.target.value) })} />
        <Field label="Interest Rate" suffix="%" type="number" step="0.1" value={values.interestRate} onChange={(e) => setValues({ interestRate: Number(e.target.value) })} />
        <Field label="Property Tax (monthly)" prefix="$" type="number" value={values.propertyTax} onChange={(e) => setValues({ propertyTax: Number(e.target.value) })} />
        <Field label="Home Insurance (monthly)" prefix="$" type="number" value={values.homeInsurance} onChange={(e) => setValues({ homeInsurance: Number(e.target.value) })} />
        <Field label="HOA (monthly)" prefix="$" type="number" value={values.hoa} onChange={(e) => setValues({ hoa: Number(e.target.value) })} />
      </InputPanel>

      <ResultPanel id="mortgage-results">
        <ResultHero label="Total Monthly" value={fmtCurrency(result.monthlyTotal)} caption="Estimated monthly housing cost">
          <ProportionBar label="What makes up the monthly payment" segments={breakdown} />
        </ResultHero>

        <ResultStats>
          <ResultStat label="Monthly P&I" value={fmtCurrency(result.monthlyPrincipalAndInterest)} />
          <ResultStat label="Total Interest" value={fmtCurrency(result.totalInterestPaid)} swatchClass="bg-chart-2" />
          <ResultStat label="Loan Amount" value={fmtCurrency(loanAmount)} />
        </ResultStats>

        <ResultActions
          resultsId="mortgage-results"
          filename="mortgage-amortization"
          csvRows={schedule.map((row) => ({
            Month: row.month,
            Payment: row.payment.toFixed(2),
            Principal: row.principal.toFixed(2),
            Interest: row.interest.toFixed(2),
            Balance: row.balance.toFixed(2),
          }))}
          canExport={canExport}
        />

        {/* Area chart */}
        <Card>
          <CardHeader>
            <CardTitle>Principal vs Interest Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={yearlyData} margin={{ top: 4, right: 16, left: 16, bottom: 4 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="year" tickFormatter={(v: number) => `Yr ${v}`} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis ticks={yTicks} domain={[0, yTicks[yTicks.length - 1]]} tickFormatter={formatCompactUsd} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(value: number) => fmtCurrency(value)}
                  labelFormatter={(label: number) => `Year ${label}`}
                  contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }}
                />
                <Area
                  type="monotone"
                  dataKey="principalPaid"
                  stackId="a"
                  name="Principal Paid"
                  stroke="var(--chart-1)"
                  fill="var(--chart-1-tint)"
                  fillOpacity={1}
                />
                <Area
                  type="monotone"
                  dataKey="interestPaid"
                  stackId="a"
                  name="Interest Paid"
                  stroke="var(--chart-2)"
                  fill="var(--chart-2-tint)"
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
            <ChartLegend items={[{ label: 'Principal Paid', colorClass: 'bg-chart-1-tint' }, { label: 'Interest Paid', colorClass: 'bg-chart-2-tint' }]} />
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
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">Year</TableHead>
                      <TableHead className="text-right">Principal Paid</TableHead>
                      <TableHead className="text-right">Interest Paid</TableHead>
                      <TableHead className="text-right">Remaining Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {yearlyData.map((row) => (
                      <TableRow key={row.year}>
                        <TableCell className="text-right">{row.year}</TableCell>
                        <TableCell className="text-right">{fmtCurrency(row.principalPaid)}</TableCell>
                        <TableCell className="text-right">{fmtCurrency(row.interestPaid)}</TableCell>
                        <TableCell className="text-right">{fmtCurrency(row.balance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly">
            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">Month</TableHead>
                      <TableHead className="text-right">Payment</TableHead>
                      <TableHead className="text-right">Principal</TableHead>
                      <TableHead className="text-right">Interest</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedule.map((row) => (
                      <TableRow key={row.month}>
                        <TableCell className="text-right">{row.month}</TableCell>
                        <TableCell className="text-right">{fmtCurrency(row.payment)}</TableCell>
                        <TableCell className="text-right">{fmtCurrency(row.principal)}</TableCell>
                        <TableCell className="text-right">{fmtCurrency(row.interest)}</TableCell>
                        <TableCell className="text-right">{fmtCurrency(row.balance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </ResultPanel>

      <MobileResultBar targetId="mortgage-results" value={fmtCurrency(result.monthlyTotal)} caption="per month" />
    </CalculatorGrid>
  )
}
