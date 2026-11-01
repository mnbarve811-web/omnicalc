'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateRetirement, type RetirementInputs } from '@/lib/engine/financial'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Field } from '@/components/common/Field'
import { CalculatorGrid, InputPanel, ResultPanel } from '@/components/common/CalculatorLayout'
import { ResultHero, ResultStat, ResultStats } from '@/components/common/Result'
import { ResultActions } from '@/components/common/ResultActions'
import { MobileResultBar } from '@/components/common/MobileResultBar'

const SCHEMA = {
  currentAge:              { param: 'age',      default: 30,     parse: Number, serialize: String },
  retirementAge:           { param: 'retire',   default: 65,     parse: Number, serialize: String },
  currentSavings:          { param: 'saved',    default: 50000,  parse: Number, serialize: String },
  annualSavings:           { param: 'annual',   default: 15000,  parse: Number, serialize: String },
  expectedReturn:          { param: 'return',   default: 7,      parse: Number, serialize: String },
  annualExpenses:          { param: 'expenses', default: 60000,  parse: Number, serialize: String },
  annualSalary:            { param: 'salary',   default: 0,      parse: Number, serialize: String },
  employeeContributionPct: { param: 'contrib',  default: 0,      parse: Number, serialize: String },
  employerMatchPct:        { param: 'match',    default: 50,     parse: Number, serialize: String },
  employerMatchCapPct:     { param: 'cap',      default: 6,      parse: Number, serialize: String },
  salaryIncreasePct:       { param: 'raise',    default: 0,      parse: Number, serialize: String },
  inflationRate:           { param: 'infl',     default: 0,      parse: Number, serialize: String },
  // Left out of the URL until edited, so it keeps following the pre-retirement return
  postRetirementReturn: {
    param: 'postret',
    default: undefined,
    parse: (s: string) => (s === '' ? undefined : Number(s)),
    serialize: (v: number | undefined) => (v === undefined ? '' : String(v)),
  },
  socialSecurityMonthly:   { param: 'ss',       default: 0,      parse: Number, serialize: String },
  socialSecurityStartAge:  { param: 'ssage',    default: 67,     parse: Number, serialize: String },
} as const satisfies Schema<RetirementInputs>

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

const AXIS_TICK = { fill: 'var(--muted-foreground)', fontSize: 12 }

const NEGATIVE_ERROR = 'Cannot be negative'

export function RetirementCalculator() {
  const [inputs, setValues] = useCalculatorUrl(SCHEMA)
  const result = calculateRetirement(inputs)

  const allPoints = [
    ...result.growthPhase.map(p => ({ ...p, phase: 'Accumulation' })),
    ...result.drawdownPhase.slice(1).map(p => ({ ...p, phase: 'Drawdown' })),
  ]

  const errors = {
    retirementAge: inputs.retirementAge < inputs.currentAge ? 'Must be at or after your current age' : undefined,
    annualSalary: inputs.annualSalary < 0 ? NEGATIVE_ERROR : undefined,
    employeeContributionPct: inputs.employeeContributionPct < 0 ? NEGATIVE_ERROR : undefined,
    employerMatchPct: inputs.employerMatchPct < 0 ? NEGATIVE_ERROR : undefined,
    employerMatchCapPct: inputs.employerMatchCapPct < 0 ? NEGATIVE_ERROR : undefined,
    salaryIncreasePct: inputs.salaryIncreasePct < 0 ? NEGATIVE_ERROR : undefined,
    inflationRate: inputs.inflationRate < 0 ? NEGATIVE_ERROR : undefined,
    socialSecurityMonthly: inputs.socialSecurityMonthly < 0 ? NEGATIVE_ERROR : undefined,
  }
  const hasErrors = Object.values(errors).some(Boolean)

  const canExport =
    !hasErrors &&
    inputs.currentAge > 0 &&
    inputs.retirementAge > inputs.currentAge &&
    (inputs.currentSavings > 0 || inputs.annualSavings > 0 || inputs.annualSalary > 0)

  // Sections holding values from a shared link start open so those values are not hidden
  const openSections = [
    (inputs.annualSalary !== 0 || inputs.salaryIncreasePct !== 0) && 'workplace',
    inputs.socialSecurityMonthly !== 0 && 'income',
    (inputs.inflationRate !== 0 || inputs.postRetirementReturn !== undefined) && 'assumptions',
  ].filter((section): section is string => typeof section === 'string')

  return (
    <CalculatorGrid>
      <InputPanel title="Inputs">
        <Field label="Current Age" type="number" value={inputs.currentAge} onChange={e => setValues({ currentAge: Number(e.target.value) })} />
        <Field label="Retirement Age" type="number" value={inputs.retirementAge} error={errors.retirementAge} onChange={e => setValues({ retirementAge: Number(e.target.value) })} />
        <Field label="Current Savings ($)" prefix="$" type="number" value={inputs.currentSavings} onChange={e => setValues({ currentSavings: Number(e.target.value) })} />
        <Field label="Annual Savings ($)" prefix="$" type="number" hint="Other yearly savings, on top of the workplace plan below" value={inputs.annualSavings} onChange={e => setValues({ annualSavings: Number(e.target.value) })} />
        <Field label="Expected Annual Return (%)" suffix="%" type="number" step="0.1" hint="Before retirement" value={inputs.expectedReturn} onChange={e => setValues({ expectedReturn: Number(e.target.value) })} />
        <Field label="Annual Expenses in Retirement ($)" prefix="$" type="number" hint="In today's dollars" value={inputs.annualExpenses} onChange={e => setValues({ annualExpenses: Number(e.target.value) })} />
        <Field
          label="Monthly Expenses in Retirement ($)"
          prefix="$"
          type="number"
          hint="The same spending per month; edit either one"
          value={Math.round((inputs.annualExpenses / 12) * 100) / 100}
          onChange={e => setValues({ annualExpenses: Number(e.target.value) * 12 })}
        />

        <Accordion multiple defaultValue={openSections}>
          <AccordionItem value="workplace">
            <AccordionTrigger>Workplace plan and employer match</AccordionTrigger>
            <AccordionContent className="space-y-5 pt-2">
              <Field label="Annual Salary ($)" prefix="$" type="number" error={errors.annualSalary} value={inputs.annualSalary} onChange={e => setValues({ annualSalary: Number(e.target.value) })} />
              <Field label="Your Contribution (% of salary)" suffix="%" type="number" step="0.5" error={errors.employeeContributionPct} value={inputs.employeeContributionPct} onChange={e => setValues({ employeeContributionPct: Number(e.target.value) })} />
              <Field label="Employer Match (%)" suffix="%" type="number" hint="Share of your contribution your employer adds" error={errors.employerMatchPct} value={inputs.employerMatchPct} onChange={e => setValues({ employerMatchPct: Number(e.target.value) })} />
              <Field label="Match Limit (% of salary)" suffix="%" type="number" step="0.5" hint="Contributions above this share of salary are not matched" error={errors.employerMatchCapPct} value={inputs.employerMatchCapPct} onChange={e => setValues({ employerMatchCapPct: Number(e.target.value) })} />
              <Field label="Annual Salary Increase (%)" suffix="%" type="number" step="0.1" error={errors.salaryIncreasePct} value={inputs.salaryIncreasePct} onChange={e => setValues({ salaryIncreasePct: Number(e.target.value) })} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="income">
            <AccordionTrigger>Social Security and pension</AccordionTrigger>
            <AccordionContent className="space-y-5 pt-2">
              <Field label="Monthly Benefit ($)" prefix="$" type="number" hint="In today's dollars; rises with inflation" error={errors.socialSecurityMonthly} value={inputs.socialSecurityMonthly} onChange={e => setValues({ socialSecurityMonthly: Number(e.target.value) })} />
              <Field label="Benefit Start Age" type="number" value={inputs.socialSecurityStartAge} onChange={e => setValues({ socialSecurityStartAge: Number(e.target.value) })} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="assumptions">
            <AccordionTrigger>Inflation and returns in retirement</AccordionTrigger>
            <AccordionContent className="space-y-5 pt-2">
              <Field label="Inflation Rate (%)" suffix="%" type="number" step="0.1" hint="Raises spending and benefits each year" error={errors.inflationRate} value={inputs.inflationRate} onChange={e => setValues({ inflationRate: Number(e.target.value) })} />
              <Field
                label="Return After Retirement (%)"
                suffix="%"
                type="number"
                step="0.1"
                hint="Matches the return before retirement until you change it"
                value={inputs.postRetirementReturn ?? inputs.expectedReturn}
                onChange={e => setValues({ postRetirementReturn: e.target.value === '' ? undefined : Number(e.target.value) })}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </InputPanel>

      <ResultPanel id="retirement-results">
        <ResultHero
          label="Balance at Retirement"
          value={fmt(result.balanceAtRetirement)}
          caption={
            inputs.inflationRate > 0
              ? `Projected savings at age ${inputs.retirementAge}, about ${fmt(result.balanceAtRetirementToday)} in today's dollars`
              : `Projected savings at age ${inputs.retirementAge}`
          }
        />

        <ResultStats>
          <ResultStat
            label="Years of Funding"
            value={result.projectedRunout === null ? '50+ years' : `${result.yearsOfFunding} years`}
          />
          <ResultStat
            label="Funds Run Out"
            value={result.projectedRunout === null ? 'Never' : `Age ${result.projectedRunout}`}
          />
          <ResultStat label="Monthly Withdrawal at Retirement" value={fmt(result.firstYearWithdrawal / 12)} />
        </ResultStats>

        <ResultActions
          resultsId="retirement-results"
          filename="retirement-projection"
          csvRows={allPoints.map((point) => ({
            Age: point.age,
            Phase: point.phase,
            Balance: point.balance.toFixed(2),
          }))}
          canExport={canExport}
        />

        <Card>
          <CardHeader><CardTitle>Balance Over Time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={allPoints} margin={{ top: 16, right: 16, left: 16, bottom: 4 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="age" tickFormatter={(v: number) => `Age ${v}`} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(v: number) => fmt(v)}
                  labelFormatter={l => `Age ${l}`}
                  contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }}
                />
                <ReferenceLine
                  x={inputs.retirementAge}
                  stroke="var(--muted-foreground)"
                  strokeDasharray="4 4"
                  label={{ value: 'Retirement', position: 'top', fill: 'var(--muted-foreground)', fontSize: 12 }}
                />
                <Line type="monotone" dataKey="balance" stroke="var(--chart-1)" strokeWidth={2} dot={false} name="Balance" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </ResultPanel>

      <MobileResultBar targetId="retirement-results" value={fmt(result.balanceAtRetirement)} caption="at retirement" />
    </CalculatorGrid>
  )
}
