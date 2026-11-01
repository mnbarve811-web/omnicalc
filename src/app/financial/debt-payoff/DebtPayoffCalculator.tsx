'use client'

import { X } from 'lucide-react'
import { listField, useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import {
  calculateDebtPayoff,
  calculateMinimumPaymentsOnly,
  getDebtFreeDate,
  type DebtItem,
  type DebtPayoffResult,
  type DebtPayoffStrategy,
  type LumpSumPayment,
} from '@/lib/engine/financial'
import { formatCompactUsd } from '@/lib/format'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/common/Field'
import { CalculatorGrid, InputPanel, ResultPanel } from '@/components/common/CalculatorLayout'
import { ChartLegend, ResultHero, ResultStat, ResultStats } from '@/components/common/Result'
import { ResultActions } from '@/components/common/ResultActions'
import { MobileResultBar } from '@/components/common/MobileResultBar'

const DEFAULT_DEBTS: DebtItem[] = [
  { name: 'Credit Card', balance: 5000, interestRate: 20, minimumPayment: 100 },
  { name: 'Car Loan', balance: 8000, interestRate: 6, minimumPayment: 200 },
]

// A throw makes the hook fall back to the default list, so a hand-edited link cannot feed the engine bad values
function parseNonNegative(part: string): number {
  const n = Number(part)
  if (!(n >= 0)) throw new Error('Expected a non-negative number')
  return n
}

function parseMonth(part: string): number {
  const n = Number(part)
  if (!Number.isInteger(n) || n < 1) throw new Error('Expected a whole month of 1 or more')
  return n
}

const SETTINGS_SCHEMA = {
  strategy:            { param: 'strategy', default: 'avalanche' as DebtPayoffStrategy, parse: s => s as DebtPayoffStrategy, serialize: s => s },
  extraMonthlyPayment: { param: 'extra',    default: 0, parse: Number, serialize: String },
  debts: listField<DebtItem>(
    'debts',
    DEFAULT_DEBTS,
    d => [d.name, d.balance, d.interestRate, d.minimumPayment],
    ([name, balance, interestRate, minimumPayment]) => ({
      name,
      balance: parseNonNegative(balance),
      interestRate: parseNonNegative(interestRate),
      minimumPayment: parseNonNegative(minimumPayment),
    }),
  ),
  lumpSums: listField<LumpSumPayment>(
    'lump',
    [],
    l => [l.month, l.amount],
    ([month, amount]) => ({ month: parseMonth(month), amount: parseNonNegative(amount) }),
  ),
} as const satisfies Schema<{ strategy: DebtPayoffStrategy; extraMonthlyPayment: number; debts: DebtItem[]; lumpSums: LumpSumPayment[] }>

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

const monthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' })

const AXIS_TICK = { fill: 'var(--muted-foreground)', fontSize: 12 }

export function DebtPayoffCalculator() {
  const [settings, setSettings] = useCalculatorUrl(SETTINGS_SCHEMA)
  const { debts, lumpSums } = settings
  const today = new Date()

  const plan = { debts, extraMonthlyPayment: settings.extraMonthlyPayment, lumpSums }
  const snowball = calculateDebtPayoff({ ...plan, strategy: 'snowball' })
  const avalanche = calculateDebtPayoff({ ...plan, strategy: 'avalanche' })
  const minimumsOnly = calculateMinimumPaymentsOnly(debts)
  const selected = settings.strategy === 'snowball' ? snowball : avalanche

  // Savings against a baseline that never finishes would be measured against an arbitrary 1200-month cutoff
  function interestSaved(result: DebtPayoffResult): number | null {
    if (!minimumsOnly.paidOff || !result.paidOff) return null
    return minimumsOnly.totalInterestPaid - result.totalInterestPaid
  }

  function debtFreeDate(result: DebtPayoffResult): string {
    return result.paidOff ? monthYear.format(getDebtFreeDate(today, result.monthsToDebtFree)) : 'Never'
  }

  const scenarios = [
    { key: 'minimums', name: 'Minimum payments only', chartName: 'Minimums only', result: minimumsOnly },
    { key: 'snowball', name: 'Snowball', chartName: 'Snowball', result: snowball },
    { key: 'avalanche', name: 'Avalanche', chartName: 'Avalanche', result: avalanche },
  ]

  const comparisonData = scenarios.map(({ chartName, result }) => ({ name: chartName, months: result.monthsToDebtFree, interest: result.totalInterestPaid }))

  const canExport = debts.length > 0 && debts.every(d => d.balance > 0 && d.minimumPayment > 0) && selected.paidOff

  const csvRows = scenarios.map(({ key, name, result }) => ({
    Strategy: name,
    Selected: key === settings.strategy ? 'Yes' : 'No',
    'Months to Debt-Free': result.paidOff ? result.monthsToDebtFree : 'Never',
    'Debt-Free Date': debtFreeDate(result),
    'Total Interest Paid': result.totalInterestPaid.toFixed(2),
    'Interest Saved vs Minimums': key === 'minimums' ? '' : interestSaved(result)?.toFixed(2) ?? '',
    'Payoff Order': result.payoffOrder.join(' -> '),
  }))

  const monthsToDebtFree = selected.paidOff ? String(selected.monthsToDebtFree) : 'Never'
  const strategyName = settings.strategy === 'snowball' ? 'Snowball' : 'Avalanche'
  const selectedSaved = interestSaved(selected)

  function updateDebt(i: number, field: keyof DebtItem, value: string) {
    // Inputs hand back strings; numeric fields must be converted or the engine's `+=` concatenates text
    const next = field === 'name' ? value : Math.max(0, Number(value))
    setSettings(current => ({ debts: current.debts.map((d, idx) => idx === i ? { ...d, [field]: next } : d) }))
  }

  function addDebt() {
    setSettings(current => ({ debts: [...current.debts, { name: `Debt ${current.debts.length + 1}`, balance: 1000, interestRate: 10, minimumPayment: 25 }] }))
  }

  function removeDebt(i: number) {
    setSettings(current => ({ debts: current.debts.filter((_, idx) => idx !== i) }))
  }

  function updateLumpSum(i: number, field: keyof LumpSumPayment, value: string) {
    const next = field === 'month' ? Math.max(1, Math.floor(Number(value))) : Math.max(0, Number(value))
    setSettings(current => ({ lumpSums: current.lumpSums.map((l, idx) => idx === i ? { ...l, [field]: next } : l) }))
  }

  function addLumpSum() {
    setSettings(current => ({ lumpSums: [...current.lumpSums, { month: 12, amount: 1000 }] }))
  }

  function removeLumpSum(i: number) {
    setSettings(current => ({ lumpSums: current.lumpSums.filter((_, idx) => idx !== i) }))
  }

  return (
    <CalculatorGrid>
      <InputPanel title="Your Debts">
        <div className="space-y-3">
          {debts.map((debt, i) => (
            <fieldset key={i} className="space-y-3 rounded-md border border-border p-3">
              <legend className="sr-only">{`Debt ${i + 1}`}</legend>
              <div className="flex items-end gap-2">
                <Field label="Name" className="min-w-0 flex-1" value={debt.name} onChange={e => updateDebt(i, 'name', e.target.value)} />
                <Button type="button" variant="ghost" size="icon" aria-label={`Remove ${debt.name}`} onClick={() => removeDebt(i)}>
                  <X aria-hidden />
                </Button>
              </div>
              <div className="grid grid-cols-3 items-end gap-2">
                <Field label="Balance ($)" type="number" min={0} value={debt.balance} onChange={e => updateDebt(i, 'balance', e.target.value)} />
                <Field label="Rate (%)" type="number" min={0} value={debt.interestRate} onChange={e => updateDebt(i, 'interestRate', e.target.value)} />
                <Field label="Min. Payment ($)" type="number" min={0} value={debt.minimumPayment} onChange={e => updateDebt(i, 'minimumPayment', e.target.value)} />
              </div>
            </fieldset>
          ))}
          <Button type="button" variant="outline" size="sm" className="w-full" onClick={addDebt}>+ Add Debt</Button>
        </div>

        <fieldset>
          <legend className="mb-1.5 block text-sm font-medium text-foreground">Strategy</legend>
          <div className="flex gap-2">
            {(['avalanche', 'snowball'] as DebtPayoffStrategy[]).map(s => (
              <button
                key={s}
                type="button"
                aria-pressed={settings.strategy === s}
                onClick={() => setSettings({ strategy: s })}
                className={`h-11 flex-1 rounded-sm border px-4 text-sm font-medium transition-colors md:h-10 ${
                  settings.strategy === s ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-card hover:bg-muted'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {settings.strategy === 'avalanche' ? 'Pay highest interest first — minimizes total interest paid.' : 'Pay smallest balance first — builds momentum with quick wins.'}
          </p>
        </fieldset>

        <Field
          label="Extra Monthly Payment"
          prefix="$"
          type="number"
          value={settings.extraMonthlyPayment}
          onChange={e => setSettings({ extraMonthlyPayment: Number(e.target.value) })}
        />

        <fieldset className="space-y-3">
          <legend className="mb-1.5 block text-sm font-medium text-foreground">One-Time Lump Sums</legend>
          {lumpSums.map((lump, i) => (
            <div key={i} role="group" aria-label={`Lump sum ${i + 1}`} className="flex items-end gap-2">
              <Field label="Month" type="number" min={1} step={1} className="min-w-0 flex-1" value={lump.month} onChange={e => updateLumpSum(i, 'month', e.target.value)} />
              <Field label="Amount" prefix="$" type="number" min={0} className="min-w-0 flex-1" value={lump.amount} onChange={e => updateLumpSum(i, 'amount', e.target.value)} />
              <Button type="button" variant="ghost" size="icon" aria-label={`Remove lump sum ${i + 1}`} onClick={() => removeLumpSum(i)}>
                <X aria-hidden />
              </Button>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            Month 1 is your next payment. A lump sum goes to your debts in strategy order, on top of that month&apos;s budget.
          </p>
          <Button type="button" variant="outline" size="sm" className="w-full" onClick={addLumpSum}>+ Add Lump Sum</Button>
        </fieldset>
      </InputPanel>

      <ResultPanel id="debt-payoff-results">
        {!selected.paidOff && (
          <p className="text-sm font-medium text-destructive" role="alert">
            These payments never pay the debt off: the interest grows faster than the monthly budget. Raise a minimum or the extra payment.
          </p>
        )}

        <ResultHero label="Months to Debt-Free" value={monthsToDebtFree} caption={`Using the ${strategyName} strategy`} />

        <ResultStats>
          <ResultStat label="Debt-Free Date" value={debtFreeDate(selected)} />
          <ResultStat label="Total Interest Paid" value={fmt(selected.totalInterestPaid)} swatchClass="bg-chart-2" />
          <ResultStat label="Interest Saved vs Minimums" value={selectedSaved === null ? '—' : fmt(selectedSaved)} />
          <ResultStat label="Payoff Order" value={selected.payoffOrder.join(' -> ')} />
        </ResultStats>

        <ResultActions
          resultsId="debt-payoff-results"
          filename="debt-payoff-strategy-comparison"
          csvRows={csvRows}
          canExport={canExport}
        />

        <Card>
          <CardHeader><CardTitle>Strategy Comparison</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scenario</TableHead>
                  <TableHead>Months</TableHead>
                  <TableHead>Debt-Free Date</TableHead>
                  <TableHead>Total Interest</TableHead>
                  <TableHead>Interest Saved</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scenarios.map(({ key, name, result }) => {
                  const saved = interestSaved(result)
                  return (
                    <TableRow key={key} data-state={key === settings.strategy ? 'selected' : undefined}>
                      <TableCell>{name}</TableCell>
                      <TableCell>{result.paidOff ? result.monthsToDebtFree : 'Never'}</TableCell>
                      <TableCell>{debtFreeDate(result)}</TableCell>
                      <TableCell>{fmt(result.totalInterestPaid)}</TableCell>
                      <TableCell>{key === 'minimums' || saved === null ? '—' : fmt(saved)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <p className="text-xs text-muted-foreground">
              Minimum payments only pays each debt just its own minimum, with no extra payment or lump sums, and a paid-off debt&apos;s minimum is not moved to the others.
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={comparisonData} margin={{ top: 4, right: 0, left: 0, bottom: 4 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={AXIS_TICK} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" tickFormatter={formatCompactUsd} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={AXIS_TICK} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(v: number, name: string) => name === 'Total Interest' ? fmt(v) : `${v} months`}
                  cursor={{ fill: 'var(--muted)' }}
                  contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }}
                />
                <Bar yAxisId="left" dataKey="interest" name="Total Interest" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="months" name="Months" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <ChartLegend items={[{ label: 'Total Interest', colorClass: 'bg-chart-2' }, { label: 'Months', colorClass: 'bg-chart-1' }]} />
          </CardContent>
        </Card>
      </ResultPanel>

      <MobileResultBar targetId="debt-payoff-results" value={monthsToDebtFree} caption={selected.paidOff ? 'months' : 'debt-free'} />
    </CalculatorGrid>
  )
}
