'use client'

import { useId } from 'react'
import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import {
  calculateSalary,
  PAY_PERIODS_PER_YEAR,
  SOCIAL_SECURITY_WAGE_BASE,
  SUPPLEMENTAL_FEDERAL_RATE,
  type SalaryInputs,
  type PayFrequency,
  type PayType,
  type RetirementUnit,
} from '@/lib/engine/financial'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Field } from '@/components/common/Field'
import { CalculatorGrid, InputPanel, ResultPanel } from '@/components/common/CalculatorLayout'
import { ProportionBar, ResultHero, ResultStat, ResultStats, type ProportionSegment } from '@/components/common/Result'
import { ResultActions } from '@/components/common/ResultActions'
import { MobileResultBar } from '@/components/common/MobileResultBar'

const HOURS_PER_WEEK_MAX = 168

// The hook falls back to the default when parse throws, so an unknown frequency never reaches the engine
function parsePayFrequency(s: string): PayFrequency {
  const match = FREQ_OPTIONS.find(f => f.value === s)
  if (!match) throw new Error(`Unknown pay frequency: ${s}`)
  return match.value
}

function parseAmount(s: string): number {
  const n = Number(s)
  if (!Number.isFinite(n) || n < 0) throw new Error(`Invalid amount: ${s}`)
  return n
}

function parsePercent(s: string): number {
  const n = parseAmount(s)
  if (n > 100) throw new Error(`Invalid percentage: ${s}`)
  return n
}

function parseHours(s: string): number {
  const n = parseAmount(s)
  if (n > HOURS_PER_WEEK_MAX) throw new Error(`Invalid hours: ${s}`)
  return n
}

const toAmount = (raw: string) => Math.max(0, Number(raw))
const toHours = (raw: string) => Math.min(HOURS_PER_WEEK_MAX, toAmount(raw))

const SCHEMA = {
  grossPay:               { param: 'gross',  default: 5000,     parse: parseAmount, serialize: String },
  payFrequency:           { param: 'freq',   default: 'monthly' as PayFrequency, parse: parsePayFrequency, serialize: s => s },
  federalTaxRate:         { param: 'fed',    default: 22,       parse: parsePercent, serialize: String },
  stateTaxRate:           { param: 'state',  default: 5,        parse: parsePercent, serialize: String },
  otherDeductions:        { param: 'other',  default: 200,      parse: parseAmount, serialize: String },
  payType:                { param: 'type',   default: 'salary' as PayType, parse: s => (s === 'hourly' ? 'hourly' : 'salary'), serialize: s => s },
  hourlyRate:             { param: 'rate',   default: 25,       parse: parseAmount, serialize: String },
  hoursPerWeek:           { param: 'hours',  default: 40,       parse: parseHours, serialize: String },
  overtimeHoursPerWeek:   { param: 'ot',     default: 0,        parse: parseHours, serialize: String },
  overtimeMultiplier:     { param: 'otx',    default: 1.5,      parse: parseAmount, serialize: String },
  annualBonus:            { param: 'bonus',  default: 0,        parse: parseAmount, serialize: String },
  annualCommission:       { param: 'comm',   default: 0,        parse: parseAmount, serialize: String },
  supplementalFlatRate:   { param: 'supp',   default: false,    parse: s => s === '1', serialize: b => (b ? '1' : '0') },
  retirementContribution: { param: 'ret',    default: 0,        parse: parseAmount, serialize: String },
  retirementUnit:         { param: 'retu',   default: 'percent' as RetirementUnit, parse: s => (s === 'amount' ? 'amount' : 'percent'), serialize: s => s },
  pretaxHealth:           { param: 'health', default: 0,        parse: parseAmount, serialize: String },
} as const satisfies Schema<Required<SalaryInputs>>

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

const fmtRate = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

const FREQ_OPTIONS: { value: PayFrequency; label: string }[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'semimonthly', label: 'Semi-monthly' },
  { value: 'monthly', label: 'Monthly' },
]

const PAY_TYPE_OPTIONS: { value: PayType; label: string }[] = [
  { value: 'salary', label: 'Salaried' },
  { value: 'hourly', label: 'Hourly' },
]

const RETIREMENT_UNIT_OPTIONS: { value: RetirementUnit; label: string }[] = [
  { value: 'percent', label: '% of gross' },
  { value: 'amount', label: '$ per paycheck' },
]

const AXIS_TICK = { fill: 'var(--muted-foreground)', fontSize: 12 }

function toggleClass(isActive: boolean) {
  return `flex-1 py-2 px-3 rounded-md border text-sm font-medium transition-colors ${
    isActive ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-input hover:bg-muted'
  }`
}

export function SalaryCalculator() {
  const [inputs, setValues] = useCalculatorUrl(SCHEMA)
  const result = calculateSalary(inputs)
  const payFrequencyId = useId()
  const payTypeLabelId = useId()
  const retirementUnitLabelId = useId()
  const supplementalId = useId()
  const isHourly = inputs.payType === 'hourly'
  const periods = PAY_PERIODS_PER_YEAR[inputs.payFrequency]

  // Sections holding non-default values start open so a shared link shows what changed
  const openSections = [
    isHourly && inputs.overtimeHoursPerWeek > 0 && 'overtime',
    (inputs.annualBonus > 0 || inputs.annualCommission > 0 || inputs.supplementalFlatRate) && 'bonus',
    (inputs.retirementContribution > 0 || inputs.pretaxHealth > 0) && 'pretax',
  ].filter((s): s is string => typeof s === 'string')

  const hoursError = inputs.hoursPerWeek + (isHourly ? inputs.overtimeHoursPerWeek : 0) > HOURS_PER_WEEK_MAX
    ? 'Regular plus overtime hours cannot exceed 168 a week'
    : undefined

  // Taxes share the amber series in both the bar and the chart; pre-tax savings are green, other deductions neutral
  const deductionData = [
    { name: 'Federal Tax', value: result.federalTax, fill: 'var(--chart-2)', fillOpacity: 1 },
    { name: 'State Tax', value: result.stateTax, fill: 'var(--chart-2)', fillOpacity: 0.75 },
    { name: 'Social Security', value: result.socialSecurity, fill: 'var(--chart-2)', fillOpacity: 0.5 },
    { name: 'Medicare', value: result.medicare + result.additionalMedicare, fill: 'var(--chart-2)', fillOpacity: 0.3 },
    { name: 'Retirement', value: result.retirementContribution, fill: 'var(--chart-3)', fillOpacity: 1 },
    { name: 'Health / HSA', value: result.pretaxHealth, fill: 'var(--chart-4)', fillOpacity: 0.6 },
    { name: 'Other', value: result.otherDeductions, fill: 'var(--chart-4)', fillOpacity: 1 },
  ].filter(d => d.value > 0)

  const canExport = result.annualGross > 0

  const csvRows = [
    { Item: 'Gross Pay (per period)', Amount: result.grossPay.toFixed(2) },
    { Item: 'Federal Tax', Amount: result.federalTax.toFixed(2) },
    { Item: 'State Tax', Amount: result.stateTax.toFixed(2) },
    { Item: 'Social Security (6.2%)', Amount: result.socialSecurity.toFixed(2) },
    { Item: 'Medicare (1.45%)', Amount: result.medicare.toFixed(2) },
    { Item: 'Additional Medicare (0.9%)', Amount: result.additionalMedicare.toFixed(2) },
    { Item: 'Pre-tax Retirement', Amount: result.retirementContribution.toFixed(2) },
    { Item: 'Pre-tax Health / HSA / FSA', Amount: result.pretaxHealth.toFixed(2) },
    { Item: 'Other Deductions', Amount: result.otherDeductions.toFixed(2) },
    { Item: 'Net Pay (per period)', Amount: result.netPay.toFixed(2) },
    { Item: 'Monthly Gross', Amount: result.monthlyGross.toFixed(2) },
    { Item: 'Monthly Net', Amount: result.monthlyNet.toFixed(2) },
    { Item: 'Annual Gross', Amount: result.annualGross.toFixed(2) },
    { Item: 'Annual Net', Amount: result.annualNet.toFixed(2) },
    { Item: 'Equivalent Hourly Rate', Amount: result.equivalentHourlyRate.toFixed(2) },
  ]

  const paycheck: ProportionSegment[] = [
    { label: 'Take-home pay', value: result.netPay, display: fmt(result.netPay), colorClass: 'bg-chart-1' },
    { label: 'Federal tax', value: result.federalTax, display: fmt(result.federalTax), colorClass: 'bg-chart-2' },
    { label: 'State tax', value: result.stateTax, display: fmt(result.stateTax), colorClass: 'bg-chart-2/75' },
    { label: 'Social Security tax', value: result.socialSecurity, display: fmt(result.socialSecurity), colorClass: 'bg-chart-2/50' },
    { label: 'Medicare tax', value: result.medicare + result.additionalMedicare, display: fmt(result.medicare + result.additionalMedicare), colorClass: 'bg-chart-2/30' },
    { label: 'Retirement', value: result.retirementContribution, display: fmt(result.retirementContribution), colorClass: 'bg-chart-3' },
    { label: 'Health / HSA / FSA', value: result.pretaxHealth, display: fmt(result.pretaxHealth), colorClass: 'bg-chart-4/60' },
    { label: 'Other deductions', value: result.otherDeductions, display: fmt(result.otherDeductions), colorClass: 'bg-chart-4' },
  ]

  const breakdownRows: { label: string; perPeriod: number; isDeduction?: boolean; isSubItem?: boolean; show?: boolean }[] = [
    { label: 'Gross Pay', perPeriod: result.grossPay },
    { label: isHourly ? 'Regular pay' : 'Base salary', perPeriod: result.annualBasePay / periods, isSubItem: true, show: result.annualBasePay !== result.annualGross },
    { label: 'Overtime', perPeriod: result.annualOvertimePay / periods, isSubItem: true, show: result.annualOvertimePay > 0 },
    { label: 'Bonus', perPeriod: inputs.annualBonus / periods, isSubItem: true, show: inputs.annualBonus > 0 },
    { label: 'Commission', perPeriod: inputs.annualCommission / periods, isSubItem: true, show: inputs.annualCommission > 0 },
    { label: 'Pre-tax Retirement', perPeriod: result.retirementContribution, isDeduction: true, show: result.retirementContribution > 0 },
    { label: 'Pre-tax Health / HSA / FSA', perPeriod: result.pretaxHealth, isDeduction: true, show: result.pretaxHealth > 0 },
    { label: 'Federal Tax', perPeriod: result.federalTax, isDeduction: true },
    { label: 'State Tax', perPeriod: result.stateTax, isDeduction: true },
    { label: 'Social Security (6.2%)', perPeriod: result.socialSecurity, isDeduction: true },
    { label: 'Medicare (1.45%)', perPeriod: result.medicare, isDeduction: true },
    { label: 'Additional Medicare (0.9%)', perPeriod: result.additionalMedicare, isDeduction: true, show: result.additionalMedicare > 0 },
    { label: 'Other Deductions', perPeriod: result.otherDeductions, isDeduction: true, show: result.otherDeductions > 0 },
  ]

  const frequencyLabel = FREQ_OPTIONS.find(f => f.value === inputs.payFrequency)?.label ?? ''

  return (
    <CalculatorGrid>
      <InputPanel title="Inputs">
        <div>
          <p id={payTypeLabelId} className="mb-1.5 block text-sm font-medium text-foreground">Pay Type</p>
          <div role="group" aria-labelledby={payTypeLabelId} className="flex gap-2">
            {PAY_TYPE_OPTIONS.map(o => (
              <button key={o.value} type="button" aria-pressed={inputs.payType === o.value} onClick={() => setValues({ payType: o.value })} className={toggleClass(inputs.payType === o.value)}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
        {isHourly
          ? <Field label="Hourly Rate" prefix="$" type="number" min={0} step="0.01" value={inputs.hourlyRate} onChange={e => setValues({ hourlyRate: toAmount(e.target.value) })} />
          : <Field label="Gross Pay per Period" prefix="$" type="number" min={0} value={inputs.grossPay} onChange={e => setValues({ grossPay: toAmount(e.target.value) })} />}
        <div>
          <label htmlFor={payFrequencyId} className="mb-1.5 block text-sm font-medium text-foreground">Pay Frequency</label>
          <select
            id={payFrequencyId}
            value={inputs.payFrequency}
            onChange={e => setValues({ payFrequency: e.target.value as PayFrequency })}
            className="h-11 w-full rounded-sm border border-input bg-card px-3 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:h-10 md:text-sm"
          >
            {FREQ_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <Field
          label="Regular Hours per Week"
          type="number"
          min={0}
          max={HOURS_PER_WEEK_MAX}
          value={inputs.hoursPerWeek}
          hint={isHourly ? 'Paid at your hourly rate for 52 weeks a year.' : 'Used only to show the equivalent hourly rate.'}
          error={hoursError}
          onChange={e => setValues({ hoursPerWeek: toHours(e.target.value) })}
        />
        <Field label="Federal Tax Rate (%)" suffix="%" type="number" min={0} max={100} value={inputs.federalTaxRate} onChange={e => setValues({ federalTaxRate: Math.min(100, toAmount(e.target.value)) })} />
        <Field label="State Tax Rate (%)" suffix="%" type="number" min={0} max={100} value={inputs.stateTaxRate} onChange={e => setValues({ stateTaxRate: Math.min(100, toAmount(e.target.value)) })} />
        <Field
          label="Other Deductions ($)"
          prefix="$"
          type="number"
          min={0}
          value={inputs.otherDeductions}
          hint="After-tax, per paycheck: Roth 401(k), union dues, garnishments."
          onChange={e => setValues({ otherDeductions: toAmount(e.target.value) })}
        />

        <Accordion multiple defaultValue={openSections} className="border-t">
          <AccordionItem value="overtime">
            <AccordionTrigger>Overtime</AccordionTrigger>
            <AccordionContent className="space-y-4 px-1 pt-1">
              {isHourly ? (
                <>
                  <Field label="Overtime Hours per Week" type="number" min={0} max={HOURS_PER_WEEK_MAX} value={inputs.overtimeHoursPerWeek} onChange={e => setValues({ overtimeHoursPerWeek: toHours(e.target.value) })} />
                  <Field label="Overtime Multiplier" suffix="×" type="number" min={0} step="0.1" value={inputs.overtimeMultiplier} hint="1.5× is the federal minimum for hours over 40." onChange={e => setValues({ overtimeMultiplier: toAmount(e.target.value) })} />
                </>
              ) : (
                <p className="text-muted-foreground">Overtime applies to hourly pay. Salaried exempt employees don&apos;t earn overtime, so switch to Hourly to add it.</p>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="bonus">
            <AccordionTrigger>Bonus &amp; Commission</AccordionTrigger>
            <AccordionContent className="space-y-4 px-1 pt-1">
              <Field label="Annual Bonus" prefix="$" type="number" min={0} value={inputs.annualBonus} onChange={e => setValues({ annualBonus: toAmount(e.target.value) })} />
              <Field label="Annual Commission" prefix="$" type="number" min={0} value={inputs.annualCommission} onChange={e => setValues({ annualCommission: toAmount(e.target.value) })} />
              <div className="flex items-start gap-2">
                <input
                  id={supplementalId}
                  type="checkbox"
                  checked={inputs.supplementalFlatRate}
                  onChange={e => setValues({ supplementalFlatRate: e.target.checked })}
                  className="mt-0.5 size-4 accent-primary"
                />
                <label htmlFor={supplementalId} className="text-sm text-foreground">
                  Withhold federal tax on bonus and commission at the {SUPPLEMENTAL_FEDERAL_RATE}% supplemental rate
                </label>
              </div>
              <p className="text-xs text-muted-foreground">Amounts are spread evenly across your paychecks. Unchecked, they are taxed at your federal rate above.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="pretax">
            <AccordionTrigger>Pre-tax Deductions</AccordionTrigger>
            <AccordionContent className="space-y-4 px-1 pt-1">
              <div>
                <p id={retirementUnitLabelId} className="mb-1.5 block text-sm font-medium text-foreground">Retirement Contribution As</p>
                <div role="group" aria-labelledby={retirementUnitLabelId} className="flex gap-2">
                  {RETIREMENT_UNIT_OPTIONS.map(o => (
                    <button key={o.value} type="button" aria-pressed={inputs.retirementUnit === o.value} onClick={() => setValues({ retirementUnit: o.value })} className={toggleClass(inputs.retirementUnit === o.value)}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
              <Field
                label="401(k) / 403(b) Contribution"
                prefix={inputs.retirementUnit === 'amount' ? '$' : undefined}
                suffix={inputs.retirementUnit === 'percent' ? '%' : undefined}
                type="number"
                min={0}
                value={inputs.retirementContribution}
                hint="Lowers federal and state taxable wages, not Social Security or Medicare."
                onChange={e => setValues({ retirementContribution: toAmount(e.target.value) })}
              />
              <Field
                label="Health / HSA / FSA per Paycheck"
                prefix="$"
                type="number"
                min={0}
                value={inputs.pretaxHealth}
                hint="Section 125 deductions lower income tax and FICA wages."
                onChange={e => setValues({ pretaxHealth: toAmount(e.target.value) })}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </InputPanel>

      <ResultPanel id="salary-results">
        <ResultHero
          label="Net Pay (per period)"
          value={fmt(result.netPay)}
          caption={`${frequencyLabel} take-home from ${fmt(result.grossPay)} gross`}
        >
          <ProportionBar label="Where each paycheck goes" segments={paycheck} />
        </ResultHero>

        <ResultStats>
          <ResultStat label="Annual Gross" value={fmt(result.annualGross)} />
          <ResultStat label="Annual Net" value={fmt(result.annualNet)} />
          <ResultStat label="Monthly Net" value={fmt(result.monthlyNet)} />
          <ResultStat label="Monthly Gross" value={fmt(result.monthlyGross)} />
          <ResultStat label={isHourly ? 'Hourly Rate' : 'Equivalent Hourly Rate'} value={fmtRate(result.equivalentHourlyRate)} />
        </ResultStats>

        <ResultActions
          resultsId="salary-results"
          filename="salary-paycheck-breakdown"
          csvRows={csvRows}
          canExport={canExport}
        />

        <Card>
          <CardHeader><CardTitle>Deductions Breakdown</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deductionData} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                <CartesianGrid stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tickFormatter={v => `$${v}`} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" width={110} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(v: number) => fmt(v)}
                  cursor={{ fill: 'var(--muted)' }}
                  contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }}
                />
                <Bar dataKey="value" name="Amount" radius={[0, 4, 4, 0]}>
                  {deductionData.map(d => <Cell key={d.name} fill={d.fill} fillOpacity={d.fillOpacity} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Pay Breakdown</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Per Period</TableHead>
                  <TableHead className="text-right">Monthly</TableHead>
                  <TableHead className="text-right">Annual</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {breakdownRows.filter(row => row.show !== false).map(row => {
                  const sign = row.isDeduction ? '- ' : ''
                  const annual = row.perPeriod * periods
                  return (
                    <TableRow key={row.label}>
                      <TableCell className={row.isSubItem ? 'pl-6 text-muted-foreground' : row.isDeduction ? '' : 'font-medium'}>{row.label}</TableCell>
                      <TableCell className="text-right tabular-nums">{sign}{fmt(row.perPeriod)}</TableCell>
                      <TableCell className="text-right tabular-nums">{sign}{fmt(annual / 12)}</TableCell>
                      <TableCell className="text-right tabular-nums">{sign}{fmt(annual)}</TableCell>
                    </TableRow>
                  )
                })}
                <TableRow className="font-semibold border-t-2">
                  <TableCell>Net Pay</TableCell>
                  <TableCell className="text-right tabular-nums">{fmt(result.netPay)}</TableCell>
                  <TableCell className="text-right tabular-nums">{fmt(result.monthlyNet)}</TableCell>
                  <TableCell className="text-right tabular-nums">{fmt(result.annualNet)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            {result.isSocialSecurityCapped && (
              <p className="mt-3 text-xs text-muted-foreground">
                Social Security stops at the {fmt(SOCIAL_SECURITY_WAGE_BASE)} wage base (2026). It is averaged over the year here; real payroll withholds in full until the cap, then stops.
              </p>
            )}
          </CardContent>
        </Card>
      </ResultPanel>

      <MobileResultBar targetId="salary-results" value={fmt(result.netPay)} caption="per paycheck" />
    </CalculatorGrid>
  )
}
