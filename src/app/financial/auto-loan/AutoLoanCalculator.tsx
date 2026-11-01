'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateAutoLoan, compareAutoLoanTerms, type AutoLoanInputs } from '@/lib/engine/financial'
import { formatCompactUsd, niceTicks } from '@/lib/format'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Field } from '@/components/common/Field'
import { CalculatorGrid, InputPanel, ResultPanel } from '@/components/common/CalculatorLayout'
import { ChartLegend, ProportionBar, ResultHero, ResultStat, ResultStats, type ProportionSegment } from '@/components/common/Result'
import { ResultActions } from '@/components/common/ResultActions'
import { MobileResultBar } from '@/components/common/MobileResultBar'

// URL values are untrusted; throwing makes the hook fall back to the field's default
function parseNonNegative(raw: string): number {
  const n = Number(raw)
  if (!Number.isFinite(n)) throw new Error(`Invalid number: ${raw}`)
  return Math.max(0, n)
}

function parseFlag(raw: string): boolean {
  if (raw === '1') return true
  if (raw === '0') return false
  throw new Error(`Invalid flag: ${raw}`)
}

const serializeFlag = (v: boolean) => (v ? '1' : '0')

const SCHEMA = {
  vehiclePrice:        { param: 'price', default: 30000, parse: parseNonNegative, serialize: String },
  downPayment:         { param: 'down',  default: 5000,  parse: parseNonNegative, serialize: String },
  tradeInValue:        { param: 'trade', default: 0,     parse: parseNonNegative, serialize: String },
  interestRate:        { param: 'rate',  default: 6.0,   parse: parseNonNegative, serialize: String },
  loanTermMonths:      { param: 'term',  default: 60,    parse: Number,           serialize: String },
  salesTaxRate:        { param: 'tax',   default: 8,     parse: parseNonNegative, serialize: String },
  extraMonthlyPayment: { param: 'extra', default: 0,     parse: parseNonNegative, serialize: String },
  fees:                { param: 'fees',  default: 0,     parse: parseNonNegative, serialize: String },
  feesFinanced:        { param: 'ffin',  default: true,  parse: parseFlag,        serialize: serializeFlag },
  tradeInReducesTax:   { param: 'ttax',  default: true,  parse: parseFlag,        serialize: serializeFlag },
} as const satisfies Schema<Required<AutoLoanInputs>>

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

const AXIS_TICK = { fill: 'var(--muted-foreground)', fontSize: 12 }

function formatMonths(months: number): string {
  const years = Math.floor(months / 12)
  const rest = months % 12
  if (years === 0) return `${rest} mo`
  if (rest === 0) return `${years} yr`
  return `${years} yr ${rest} mo`
}

export function AutoLoanCalculator() {
  const [inputs, setValues] = useCalculatorUrl(SCHEMA)
  const result = calculateAutoLoan(inputs)
  const termRows = compareAutoLoanTerms(inputs)
  const hasExtraPayment = inputs.extraMonthlyPayment > 0 && result.payoffMonths > 0
  const hasAdvancedValues = inputs.extraMonthlyPayment !== 0 || inputs.fees !== 0 || !inputs.feesFinanced || !inputs.tradeInReducesTax
  const taxablePrice = inputs.tradeInReducesTax ? Math.max(0, inputs.vehiclePrice - inputs.tradeInValue) : inputs.vehiclePrice

  const yearlyData: { year: number; principalPaid: number; interestPaid: number }[] = []
  for (let y = 0; y < Math.ceil(result.amortizationSchedule.length / 12); y++) {
    const slice = result.amortizationSchedule.slice(y * 12, (y + 1) * 12)
    yearlyData.push({
      year: y + 1,
      principalPaid: slice.reduce((s, r) => s + r.principal, 0),
      interestPaid: slice.reduce((s, r) => s + r.interest, 0),
    })
  }
  const yTicks = niceTicks(Math.max(0, ...yearlyData.map((row) => row.principalPaid + row.interestPaid)))

  const canExport = inputs.vehiclePrice > 0 && inputs.loanTermMonths > 0 && result.loanBalance > 0

  const loanCost: ProportionSegment[] = result.monthlyPayment > 0
    ? [
        { label: 'Principal', value: result.loanBalance, display: fmt(result.loanBalance), colorClass: 'bg-chart-1' },
        { label: 'Interest', value: result.totalInterestPaid, display: fmt(result.totalInterestPaid), colorClass: 'bg-chart-2' },
      ]
    : []

  // The term is not clamped: a zero or negative term is a valid "no loan" state the engine handles
  const setNumber = (key: keyof typeof inputs, raw: string) =>
    setValues({ [key]: key === 'loanTermMonths' ? Number(raw) : Math.max(0, Number(raw)) })

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
            min={key === 'loanTermMonths' ? undefined : 0}
            value={inputs[key]}
            onChange={e => setNumber(key, e.target.value)}
          />
        ))}

        <Accordion defaultValue={hasAdvancedValues ? ['advanced'] : []}>
          <AccordionItem value="advanced">
            <AccordionTrigger>Advanced options</AccordionTrigger>
            <AccordionContent className="space-y-5 pt-2">
              <Field
                label="Extra Monthly Payment"
                prefix="$"
                type="number"
                min={0}
                hint="Added to every payment to pay the loan off sooner"
                value={inputs.extraMonthlyPayment}
                onChange={e => setNumber('extraMonthlyPayment', e.target.value)}
              />
              <Field
                label="Fees"
                prefix="$"
                type="number"
                min={0}
                hint="Registration, title and documentation fees"
                value={inputs.fees}
                onChange={e => setNumber('fees', e.target.value)}
              />
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <input
                    type="checkbox"
                    className="size-4 accent-primary"
                    checked={inputs.feesFinanced}
                    onChange={e => setValues({ feesFinanced: e.target.checked })}
                  />
                  Finance fees in the loan
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <input
                    type="checkbox"
                    className="size-4 accent-primary"
                    checked={inputs.tradeInReducesTax}
                    onChange={e => setValues({ tradeInReducesTax: e.target.checked })}
                  />
                  Trade-in reduces taxable price
                </label>
                <p className="mt-1.5 text-xs text-muted-foreground">Most states tax only the price minus the trade-in value</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </InputPanel>

      <ResultPanel id="auto-loan-results">
        <ResultHero
          label="Monthly Payment"
          value={fmt(result.monthlyPayment)}
          caption={hasExtraPayment
            ? `Plus ${fmt(inputs.extraMonthlyPayment)} extra a month, paid off in ${result.payoffMonths} months`
            : `Estimated payment over ${inputs.loanTermMonths} months`}
        >
          <ProportionBar label="Principal and interest repaid over the loan" segments={loanCost} />
        </ResultHero>

        <ResultStats>
          <ResultStat label="Loan Amount" value={fmt(result.loanBalance)} />
          <ResultStat label="Total Interest" value={fmt(result.totalInterestPaid)} swatchClass="bg-chart-2" />
          <ResultStat label="Total Cost" value={fmt(result.totalCost)} />
          {hasExtraPayment && (
            <>
              <ResultStat label="Payoff Time" value={formatMonths(result.payoffMonths)} />
              <ResultStat label="Interest Saved" value={fmt(result.interestSaved)} />
              <ResultStat label="Time Saved" value={formatMonths(result.monthsSaved)} />
            </>
          )}
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
          <CardHeader><CardTitle>Cost Breakdown</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Vehicle price</TableCell>
                  <TableCell className="text-right">{fmt(inputs.vehiclePrice)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sales tax ({inputs.salesTaxRate}% of {fmt(taxablePrice)})</TableCell>
                  <TableCell className="text-right">+{fmt(result.salesTax)}</TableCell>
                </TableRow>
                {inputs.feesFinanced && (
                  <TableRow>
                    <TableCell>Fees (financed)</TableCell>
                    <TableCell className="text-right">+{fmt(inputs.fees)}</TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell>Down payment</TableCell>
                  <TableCell className="text-right">&minus;{fmt(inputs.downPayment)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Trade-in</TableCell>
                  <TableCell className="text-right">&minus;{fmt(inputs.tradeInValue)}</TableCell>
                </TableRow>
                <TableRow className="font-semibold">
                  <TableCell>Amount financed</TableCell>
                  <TableCell className="text-right">{fmt(result.loanBalance)}</TableCell>
                </TableRow>
                {!inputs.feesFinanced && (
                  <TableRow>
                    <TableCell>Fees (paid upfront)</TableCell>
                    <TableCell className="text-right">{fmt(result.upfrontFees)}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Compare Loan Terms</CardTitle></CardHeader>
          <CardContent>
            {inputs.extraMonthlyPayment > 0 && (
              <p className="mb-2 text-sm text-muted-foreground">Based on scheduled payments, without the extra payment.</p>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Term</TableHead>
                  <TableHead className="text-right">Monthly Payment</TableHead>
                  <TableHead className="text-right">Total Interest</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {termRows.map(row => {
                  const isCurrentTerm = row.termMonths === inputs.loanTermMonths
                  return (
                    <TableRow key={row.termMonths} aria-current={isCurrentTerm ? 'true' : undefined} className={isCurrentTerm ? 'bg-muted font-semibold' : undefined}>
                      <TableCell>{row.termMonths} months</TableCell>
                      <TableCell className="text-right">{fmt(row.monthlyPayment)}</TableCell>
                      <TableCell className="text-right">{fmt(row.totalInterest)}</TableCell>
                      <TableCell className="text-right">{fmt(row.totalCost)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Principal vs Interest by Year</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={yearlyData} margin={{ top: 4, right: 16, left: 16, bottom: 4 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="year" tickFormatter={(v: number) => `Yr ${v}`} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                <YAxis ticks={yTicks} domain={[0, yTicks[yTicks.length - 1]]} tickFormatter={formatCompactUsd} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(v: number) => fmt(v)}
                  labelFormatter={(label: number) => `Year ${label}`}
                  contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }}
                />
                <Area type="monotone" dataKey="principalPaid" stackId="a" stroke="var(--chart-1)" fill="var(--chart-1-tint)" fillOpacity={1} name="Principal" />
                <Area type="monotone" dataKey="interestPaid" stackId="a" stroke="var(--chart-2)" fill="var(--chart-2-tint)" fillOpacity={1} name="Interest" />
              </AreaChart>
            </ResponsiveContainer>
            <ChartLegend items={[{ label: 'Principal', colorClass: 'bg-chart-1-tint' }, { label: 'Interest', colorClass: 'bg-chart-2-tint' }]} />
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
