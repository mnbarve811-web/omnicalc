'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateAutoLoan, type AutoLoanInputs } from '@/lib/engine/financial'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Field } from '@/components/common/Field'
import { CalculatorGrid, InputPanel, ResultPanel } from '@/components/common/CalculatorLayout'
import { ProportionBar, ResultHero, ResultStat, ResultStats, type ProportionSegment } from '@/components/common/Result'
import { ResultActions } from '@/components/common/ResultActions'
import { MobileResultBar } from '@/components/common/MobileResultBar'

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

const AXIS_TICK = { fill: 'var(--muted-foreground)', fontSize: 12 }

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

  const canExport = inputs.vehiclePrice > 0 && inputs.loanTermMonths > 0 && result.loanBalance > 0

  const loanCost: ProportionSegment[] = result.monthlyPayment > 0
    ? [
        { label: 'Principal', value: result.loanBalance, display: fmt(result.loanBalance), colorClass: 'bg-chart-1' },
        { label: 'Interest', value: result.totalInterestPaid, display: fmt(result.totalInterestPaid), colorClass: 'bg-chart-2' },
      ]
    : []

  return (
    <CalculatorGrid>
      <InputPanel title="Inputs">
        {[
          { label: 'Vehicle Price', key: 'vehiclePrice' as const, prefix: '$' },
          { label: 'Down Payment', key: 'downPayment' as const, prefix: '$' },
          { label: 'Trade-In Value', key: 'tradeInValue' as const, prefix: '$' },
          { label: 'Annual Interest Rate (%)', key: 'interestRate' as const, suffix: '%' },
          { label: 'Loan Term (months)', key: 'loanTermMonths' as const },
          { label: 'Sales Tax Rate (%)', key: 'salesTaxRate' as const, suffix: '%' },
        ].map(({ label, key, prefix, suffix }) => (
          <Field
            key={key}
            label={label}
            prefix={prefix}
            suffix={suffix}
            type="number"
            value={inputs[key]}
            onChange={e => setValues({ [key]: Number(e.target.value) } as Partial<AutoLoanInputs>)}
          />
        ))}
      </InputPanel>

      <ResultPanel id="auto-loan-results">
        <ResultHero label="Monthly Payment" value={fmt(result.monthlyPayment)} caption={`Estimated payment over ${inputs.loanTermMonths} months`}>
          <ProportionBar label="Principal and interest repaid over the loan" segments={loanCost} />
        </ResultHero>

        <ResultStats>
          <ResultStat label="Loan Amount" value={fmt(result.loanBalance)} />
          <ResultStat label="Total Interest" value={fmt(result.totalInterestPaid)} />
        </ResultStats>

        <ResultActions
          resultsId="auto-loan-results"
          filename="auto-loan-amortization"
          csvRows={result.amortizationSchedule.map((row) => ({
            Month: row.month,
            Payment: row.payment.toFixed(2),
            Principal: row.principal.toFixed(2),
            Interest: row.interest.toFixed(2),
            Balance: row.balance.toFixed(2),
          }))}
          canExport={canExport}
        />

        <Card>
          <CardHeader><CardTitle>Principal vs Interest by Year</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={yearlyData} margin={{ top: 4, right: 16, left: 16, bottom: 4 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="year" tickFormatter={(v: number) => `Yr ${v}`} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(v: number) => fmt(v)}
                  labelFormatter={(label: number) => `Year ${label}`}
                  contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }}
                />
                <Legend wrapperStyle={{ fontSize: 13 }} />
                <Area type="monotone" dataKey="principalPaid" stackId="a" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.55} name="Principal" />
                <Area type="monotone" dataKey="interestPaid" stackId="a" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.4} name="Interest" />
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
      </ResultPanel>

      <MobileResultBar targetId="auto-loan-results" value={fmt(result.monthlyPayment)} caption="per month" />
    </CalculatorGrid>
  )
}
