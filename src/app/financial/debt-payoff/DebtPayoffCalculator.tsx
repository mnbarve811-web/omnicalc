'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateDebtPayoff, type DebtItem, type DebtPayoffStrategy } from '@/lib/engine/financial'
import { formatCompactUsd } from '@/lib/format'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/common/Field'
import { CalculatorGrid, InputPanel, ResultPanel } from '@/components/common/CalculatorLayout'
import { ChartLegend, ResultHero, ResultStat, ResultStats } from '@/components/common/Result'
import { ResultActions } from '@/components/common/ResultActions'
import { MobileResultBar } from '@/components/common/MobileResultBar'

const SETTINGS_SCHEMA = {
  strategy:            { param: 'strategy', default: 'avalanche' as DebtPayoffStrategy, parse: s => s as DebtPayoffStrategy, serialize: s => s },
  extraMonthlyPayment: { param: 'extra',    default: 0, parse: Number, serialize: String },
} as const satisfies Schema<{ strategy: DebtPayoffStrategy; extraMonthlyPayment: number }>

const DEFAULT_DEBTS: DebtItem[] = [
  { name: 'Credit Card', balance: 5000, interestRate: 20, minimumPayment: 100 },
  { name: 'Car Loan', balance: 8000, interestRate: 6, minimumPayment: 200 },
]

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

const AXIS_TICK = { fill: 'var(--muted-foreground)', fontSize: 12 }

export function DebtPayoffCalculator() {
  const [settings, setSettings] = useCalculatorUrl(SETTINGS_SCHEMA)
  const [debts, setDebts] = useState<DebtItem[]>(DEFAULT_DEBTS)

  const snowball = calculateDebtPayoff({ debts, strategy: 'snowball', extraMonthlyPayment: settings.extraMonthlyPayment })
  const avalanche = calculateDebtPayoff({ debts, strategy: 'avalanche', extraMonthlyPayment: settings.extraMonthlyPayment })
  const selected = settings.strategy === 'snowball' ? snowball : avalanche

  const comparisonData = [
    { name: 'Snowball', months: snowball.monthsToDebtFree, interest: snowball.totalInterestPaid },
    { name: 'Avalanche', months: avalanche.monthsToDebtFree, interest: avalanche.totalInterestPaid },
  ]

  const canExport = debts.length > 0 && debts.every(d => d.balance > 0 && d.minimumPayment > 0) && selected.paidOff

  const csvRows = [
    { strategy: 'Snowball', result: snowball },
    { strategy: 'Avalanche', result: avalanche },
  ].map(({ strategy, result }) => ({
    Strategy: strategy,
    Selected: strategy.toLowerCase() === settings.strategy ? 'Yes' : 'No',
    'Months to Debt-Free': result.monthsToDebtFree,
    'Total Interest Paid': result.totalInterestPaid.toFixed(2),
    'Payoff Order': result.payoffOrder.join(' -> '),
  }))

  const monthsToDebtFree = selected.paidOff ? String(selected.monthsToDebtFree) : 'Never'
  const strategyName = settings.strategy === 'snowball' ? 'Snowball' : 'Avalanche'

  function updateDebt(i: number, field: keyof DebtItem, value: string | number) {
    // Inputs hand back strings; numeric fields must be converted or the engine's `+=` concatenates text
    setDebts(prev => prev.map((d, idx) => idx === i ? { ...d, [field]: field === 'name' ? value : Number(value) } : d))
  }

  function addDebt() {
    setDebts(prev => [...prev, { name: `Debt ${prev.length + 1}`, balance: 1000, interestRate: 10, minimumPayment: 25 }])
  }

  function removeDebt(i: number) {
    setDebts(prev => prev.filter((_, idx) => idx !== i))
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
                <Field label="Balance ($)" type="number" value={debt.balance} onChange={e => updateDebt(i, 'balance', e.target.value)} />
                <Field label="Rate (%)" type="number" value={debt.interestRate} onChange={e => updateDebt(i, 'interestRate', e.target.value)} />
                <Field label="Min. Payment ($)" type="number" value={debt.minimumPayment} onChange={e => updateDebt(i, 'minimumPayment', e.target.value)} />
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
      </InputPanel>

      <ResultPanel id="debt-payoff-results">
        {!selected.paidOff && (
          <p className="text-sm font-medium text-destructive" role="alert">
            These payments never pay the debt off: the interest grows faster than the monthly budget. Raise a minimum or the extra payment.
          </p>
        )}

        <ResultHero label="Months to Debt-Free" value={monthsToDebtFree} caption={`Using the ${strategyName} strategy`} />

        <ResultStats>
          <ResultStat label="Total Interest Paid" value={fmt(selected.totalInterestPaid)} swatchClass="bg-chart-2" />
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
          <CardContent>
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
