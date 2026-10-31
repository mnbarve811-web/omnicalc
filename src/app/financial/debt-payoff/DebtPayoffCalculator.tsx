'use client'

import { useState } from 'react'
import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateDebtPayoff, type DebtItem, type DebtPayoffStrategy } from '@/lib/engine/financial'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ExportButtons } from '@/components/common/ExportButtons'

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

  const canExport = debts.length > 0 && debts.every(d => d.balance > 0 && d.minimumPayment > 0)

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

  function updateDebt(i: number, field: keyof DebtItem, value: string | number) {
    setDebts(prev => prev.map((d, idx) => idx === i ? { ...d, [field]: typeof value === 'string' ? value : Number(value) } : d))
  }

  function addDebt() {
    setDebts(prev => [...prev, { name: `Debt ${prev.length + 1}`, balance: 1000, interestRate: 10, minimumPayment: 25 }])
  }

  function removeDebt(i: number) {
    setDebts(prev => prev.filter((_, idx) => idx !== i))
  }

  return (
    <div className="space-y-6">
      {/* Debt list */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Debts</CardTitle>
          <Button variant="outline" size="sm" onClick={addDebt}>+ Add Debt</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Balance ($)</TableHead>
                <TableHead>Rate (%)</TableHead>
                <TableHead>Min. Payment ($)</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {debts.map((debt, i) => (
                <TableRow key={i}>
                  <TableCell><Input value={debt.name} onChange={e => updateDebt(i, 'name', e.target.value)} className="h-8" /></TableCell>
                  <TableCell><Input type="number" value={debt.balance} onChange={e => updateDebt(i, 'balance', e.target.value)} className="h-8" /></TableCell>
                  <TableCell><Input type="number" value={debt.interestRate} onChange={e => updateDebt(i, 'interestRate', e.target.value)} className="h-8" /></TableCell>
                  <TableCell><Input type="number" value={debt.minimumPayment} onChange={e => updateDebt(i, 'minimumPayment', e.target.value)} className="h-8" /></TableCell>
                  <TableCell><Button variant="ghost" size="sm" onClick={() => removeDebt(i)} className="text-red-500">x</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Strategy</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {(['avalanche', 'snowball'] as DebtPayoffStrategy[]).map(s => (
                <button
                  key={s}
                  onClick={() => setSettings({ strategy: s })}
                  className={`flex-1 py-2 px-4 rounded-md border text-sm font-medium transition-colors ${
                    settings.strategy === s ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {settings.strategy === 'avalanche' ? 'Pay highest interest first — minimizes total interest paid.' : 'Pay smallest balance first — builds momentum with quick wins.'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Extra Monthly Payment</CardTitle></CardHeader>
          <CardContent>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                type="number"
                value={settings.extraMonthlyPayment}
                onChange={e => setSettings({ extraMonthlyPayment: Number(e.target.value) })}
                className="pl-7"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <div id="debt-payoff-results" className="space-y-6">
        <ExportButtons
          resultsId="debt-payoff-results"
          filename="debt-payoff-strategy-comparison"
          csvRows={csvRows}
          disabled={!canExport}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Months to Debt-Free</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{selected.monthsToDebtFree}</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Total Interest Paid</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{fmt(selected.totalInterestPaid)}</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">Payoff Order</CardTitle></CardHeader><CardContent><p className="text-sm">{selected.payoffOrder.join(' -> ')}</p></CardContent></Card>
        </div>

        {/* Comparison chart */}
        <Card>
          <CardHeader><CardTitle>Strategy Comparison</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(v: number, name: string) => name === 'interest' ? fmt(v) : `${v} months`} />
                <Legend />
                <Bar yAxisId="left" dataKey="interest" name="Total Interest" fill="#ef4444" />
                <Bar yAxisId="right" dataKey="months" name="Months" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
