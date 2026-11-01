'use client'

import { useId } from 'react'
import { X } from 'lucide-react'
import { listField, useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import {
  calculateExtraPaymentSavings,
  calculateMortgage,
  compareMortgageTerms,
  type LumpSum,
  type MortgageInputs,
} from '@/lib/engine/financial'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Field } from '@/components/common/Field'
import { CalculatorGrid, InputPanel, ResultPanel } from '@/components/common/CalculatorLayout'
import { ProportionBar, ResultHero, ResultStat, ResultStats, type ProportionSegment } from '@/components/common/Result'
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
  extraMonthlyPayment: { param: 'extra', default: 0, parse: Number, serialize: String },
  lumpSums: listField<LumpSum>('lump', [], l => [l.month, l.amount], ([month, amount]) => ({ month: Number(month), amount: Number(amount) })),
  biweekly: { param: 'bw', default: false, parse: (s: string) => s === '1', serialize: (b: boolean) => (b ? '1' : '0') },
} as const satisfies Schema<MortgageForm>

type MortgageForm = Required<MortgageInputs>

const fmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function fmtCurrency(n: number): string {
  return fmt.format(n)
}

function formatPayoffTime(months: number): string {
  const years = Math.floor(months / 12)
  const remainder = months % 12
  if (years === 0) return `${remainder} mo`
  if (remainder === 0) return `${years} yr`
  return `${years} yr ${remainder} mo`
}

function lumpSumMonthError(lump: LumpSum, termMonths: number): string | undefined {
  if (Number.isInteger(lump.month) && lump.month >= 1 && lump.month <= termMonths) return undefined
  return `Enter a whole month from 1 to ${termMonths}`
}

function lumpSumAmountError(lump: LumpSum): string | undefined {
  return lump.amount < 0 ? 'Amount cannot be negative' : undefined
}

// URL and typed values are untrusted: invalid extras are dropped rather than passed to the engine
function toEngineInputs(values: MortgageForm): MortgageInputs {
  const termMonths = Math.max(0, values.loanTermYears * 12)
  return {
    ...values,
    extraMonthlyPayment: Math.max(0, values.extraMonthlyPayment),
    lumpSums: values.lumpSums.filter(l => !lumpSumMonthError(l, termMonths) && !lumpSumAmountError(l) && l.amount > 0),
  }
}

interface YearlyRow {
  year: number
  principalPaid: number
  interestPaid: number
  balance: number
}

export function MortgageCalculator() {
  const [values, setValues] = useCalculatorUrl<MortgageForm & Record<string, unknown>>(
    SCHEMA as Schema<MortgageForm & Record<string, unknown>>
  )
  const downPercentLabelId = useId()
  const inputs = toEngineInputs(values)
  const result = calculateMortgage(inputs)
  const savings = calculateExtraPaymentSavings(inputs)
  const termComparison = compareMortgageTerms(inputs)
  const hasExtras = (inputs.extraMonthlyPayment ?? 0) > 0 || (inputs.lumpSums ?? []).length > 0 || values.biweekly
  const termMonths = Math.max(0, values.loanTermYears * 12)
  const downPercent = values.homePrice > 0 ? Math.min(100, Math.max(0, (values.downPayment / values.homePrice) * 100)) : 0

  function updateLumpSum(index: number, patch: Partial<LumpSum>) {
    setValues({ lumpSums: values.lumpSums.map((lump, i) => (i === index ? { ...lump, ...patch } : lump)) })
  }

  function addLumpSum() {
    setValues({ lumpSums: [...values.lumpSums, { month: Math.min(12, Math.max(1, termMonths)), amount: 5000 }] })
  }

  function removeLumpSum(index: number) {
    setValues({ lumpSums: values.lumpSums.filter((_, i) => i !== index) })
  }

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

  const breakdown: ProportionSegment[] = result.monthlyTotal > 0
    ? [
        { label: 'Principal & interest', value: result.monthlyPrincipalAndInterest, display: fmtCurrency(result.monthlyPrincipalAndInterest), colorClass: 'bg-chart-1' },
        { label: 'Property tax', value: values.propertyTax, display: fmtCurrency(values.propertyTax), colorClass: 'bg-chart-4' },
        { label: 'Insurance', value: values.homeInsurance, display: fmtCurrency(values.homeInsurance), colorClass: 'bg-chart-4/60' },
        { label: 'HOA', value: values.hoa, display: fmtCurrency(values.hoa), colorClass: 'bg-chart-4/30' },
      ]
    : []

  return (
    <CalculatorGrid>
      <InputPanel title="Loan Details">
        <Field label="Home Price" prefix="$" type="number" value={values.homePrice} onChange={(e) => setValues({ homePrice: Number(e.target.value) })} />
        <Field label="Down Payment" prefix="$" type="number" value={values.downPayment} onChange={(e) => setValues({ downPayment: Number(e.target.value) })} />
        <div>
          <div className="mb-2 flex items-baseline justify-between text-sm">
            <span id={downPercentLabelId} className="font-medium text-foreground">Down Payment (%)</span>
            <span className="tabular-nums text-muted-foreground">{downPercent.toFixed(1)}%</span>
          </div>
          <Slider
            aria-labelledby={downPercentLabelId}
            min={0}
            max={100}
            step={1}
            value={downPercent}
            disabled={values.homePrice <= 0}
            onValueChange={(value) => {
              // The shared Slider is typed for ranges too, but this one has a single thumb
              const percent = typeof value === 'number' ? value : value[0]
              setValues({ downPayment: Math.round((values.homePrice * percent) / 100) })
            }}
          />
        </div>
        <Field label="Loan Term" suffix="years" type="number" value={values.loanTermYears} onChange={(e) => setValues({ loanTermYears: Number(e.target.value) })} />
        <Field label="Interest Rate" suffix="%" type="number" step="0.1" value={values.interestRate} onChange={(e) => setValues({ interestRate: Number(e.target.value) })} />
        <Field label="Property Tax (monthly)" prefix="$" type="number" value={values.propertyTax} onChange={(e) => setValues({ propertyTax: Number(e.target.value) })} />
        <Field label="Home Insurance (monthly)" prefix="$" type="number" value={values.homeInsurance} onChange={(e) => setValues({ homeInsurance: Number(e.target.value) })} />
        <Field label="HOA (monthly)" prefix="$" type="number" value={values.hoa} onChange={(e) => setValues({ hoa: Number(e.target.value) })} />

        <Accordion defaultValue={hasExtras ? ['advanced'] : []}>
          <AccordionItem value="advanced" className="border-t">
            <AccordionTrigger>Advanced options: extra payments</AccordionTrigger>
            <AccordionContent className="space-y-5 pt-2">
              <Field
                label="Extra Monthly Payment"
                prefix="$"
                type="number"
                min={0}
                hint="Added to principal every month"
                error={values.extraMonthlyPayment < 0 ? 'Amount cannot be negative' : undefined}
                value={values.extraMonthlyPayment}
                onChange={(e) => setValues({ extraMonthlyPayment: Number(e.target.value) })}
              />

              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">One-time Lump Sums</p>
                {values.lumpSums.map((lump, i) => (
                  <fieldset key={i} className="rounded-md border border-border p-3">
                    <legend className="sr-only">{`Lump sum ${i + 1}`}</legend>
                    <div className="flex items-start gap-2">
                      <Field
                        label="Month"
                        type="number"
                        min={1}
                        max={termMonths}
                        className="w-24 shrink-0"
                        error={lumpSumMonthError(lump, termMonths)}
                        value={lump.month}
                        onChange={(e) => updateLumpSum(i, { month: Number(e.target.value) })}
                      />
                      <Field
                        label="Amount"
                        prefix="$"
                        type="number"
                        min={0}
                        className="min-w-0 flex-1"
                        error={lumpSumAmountError(lump)}
                        value={lump.amount}
                        onChange={(e) => updateLumpSum(i, { amount: Number(e.target.value) })}
                      />
                      <Button type="button" variant="ghost" size="icon" className="mt-6" aria-label={`Remove lump sum ${i + 1}`} onClick={() => removeLumpSum(i)}>
                        <X aria-hidden />
                      </Button>
                    </div>
                  </fieldset>
                ))}
                <Button type="button" variant="outline" size="sm" className="w-full" onClick={addLumpSum}>+ Add Lump Sum</Button>
              </div>

              <fieldset>
                <legend className="mb-1.5 block text-sm font-medium text-foreground">Payment Frequency</legend>
                <div className="flex gap-2">
                  {[{ label: 'Monthly', biweekly: false }, { label: 'Biweekly', biweekly: true }].map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      aria-pressed={values.biweekly === option.biweekly}
                      onClick={() => setValues({ biweekly: option.biweekly })}
                      className={`h-11 flex-1 rounded-sm border px-4 text-sm font-medium transition-colors md:h-10 ${
                        values.biweekly === option.biweekly ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-card hover:bg-muted'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {values.biweekly
                    ? `Half the monthly P&I (${fmtCurrency(result.monthlyPrincipalAndInterest / 2)}) every two weeks: 26 payments a year, the same as 13 monthly payments.`
                    : 'One principal and interest payment each month.'}
                </p>
              </fieldset>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </InputPanel>

      <ResultPanel id="mortgage-results">
        <ResultHero label="Total Monthly" value={fmtCurrency(result.monthlyTotal)} caption="Estimated monthly housing cost">
          <ProportionBar label="What makes up the monthly payment" segments={breakdown} />
        </ResultHero>

        <ResultStats>
          <ResultStat label="Monthly P&I" value={fmtCurrency(result.monthlyPrincipalAndInterest)} />
          <ResultStat label="Total Interest" value={fmtCurrency(result.totalInterestPaid)} />
          <ResultStat label="Loan Amount" value={fmtCurrency(loanAmount)} />
          <ResultStat label="Payoff Time" value={formatPayoffTime(savings.payoffMonths)} />
          {values.biweekly && <ResultStat label="Biweekly P&I" value={fmtCurrency(result.monthlyPrincipalAndInterest / 2)} />}
          {hasExtras && <ResultStat label="Interest Saved" value={fmtCurrency(savings.interestSaved)} />}
          {hasExtras && <ResultStat label="Time Saved" value={formatPayoffTime(savings.monthsSaved)} />}
        </ResultStats>

        <ResultActions
          resultsId="mortgage-results"
          filename="mortgage-amortization"
          csvRows={schedule.map((row) => ({
            Month: row.month,
            Payment: row.payment.toFixed(2),
            Extra: row.extra.toFixed(2),
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
                <YAxis tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(value: number) => fmtCurrency(value)}
                  labelFormatter={(label: number) => `Year ${label}`}
                  contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }}
                />
                <Legend wrapperStyle={{ fontSize: 13 }} />
                <Area
                  type="monotone"
                  dataKey="principalPaid"
                  stackId="a"
                  name="Principal Paid"
                  stroke="var(--chart-1)"
                  fill="var(--chart-1)"
                  fillOpacity={0.55}
                />
                <Area
                  type="monotone"
                  dataKey="interestPaid"
                  stackId="a"
                  name="Interest Paid"
                  stroke="var(--chart-2)"
                  fill="var(--chart-2)"
                  fillOpacity={0.4}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compare Loan Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">
              {hasExtras
                ? 'Each term uses your price, down payment and rate, with the same extra payments, lump sums and payment frequency.'
                : 'Each term uses your price, down payment and rate.'}
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Term</TableHead>
                  <TableHead>Monthly P&amp;I</TableHead>
                  <TableHead>Total Interest</TableHead>
                  <TableHead>Payoff Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {termComparison.map((row) => (
                  <TableRow
                    key={row.termYears}
                    aria-current={row.termYears === values.loanTermYears ? 'true' : undefined}
                    className={row.termYears === values.loanTermYears ? 'bg-muted/60 font-medium' : undefined}
                  >
                    <TableCell>{`${row.termYears} years`}</TableCell>
                    <TableCell>{fmtCurrency(row.monthlyPrincipalAndInterest)}</TableCell>
                    <TableCell>{fmtCurrency(row.totalInterestPaid)}</TableCell>
                    <TableCell>{formatPayoffTime(row.payoffMonths)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                {values.biweekly && (
                  <p className="mb-3 text-sm text-muted-foreground">Biweekly: each month adds up the two or three payments made in it.</p>
                )}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Extra</TableHead>
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
                        <TableCell>{fmtCurrency(row.extra)}</TableCell>
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
      </ResultPanel>

      <MobileResultBar targetId="mortgage-results" value={fmtCurrency(result.monthlyTotal)} caption="per month" />
    </CalculatorGrid>
  )
}
