'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field } from '@/components/common/Field'
import { CalculatorGrid, InputPanel, ResultPanel } from '@/components/common/CalculatorLayout'
import { ProportionBar, ResultHero, ResultStat, ResultStats, type ProportionSegment } from '@/components/common/Result'
import { ResultActions } from '@/components/common/ResultActions'
import { MobileResultBar } from '@/components/common/MobileResultBar'
import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateMacro, type MacroInputs, type MacroGoal, type MacroSplit } from '@/lib/engine/fitness'

const GOALS: { key: MacroGoal; label: string }[] = [
  { key: 'cut',      label: 'Cut' },
  { key: 'maintain', label: 'Maintain' },
  { key: 'bulk',     label: 'Bulk' },
]

const SPLITS: { key: MacroSplit; label: string }[] = [
  { key: 'balanced',    label: 'Balanced' },
  { key: 'lowCarb',     label: 'Low Carb' },
  { key: 'highProtein', label: 'High Protein' },
]

// The hook falls back to the default when parse throws, so unknown URL values never reach the engine.
function parseGoal(s: string): MacroGoal {
  const match = GOALS.find(g => g.key === s)
  if (!match) throw new Error(`Invalid goal: ${s}`)
  return match.key
}

function parseSplit(s: string): MacroSplit {
  const match = SPLITS.find(sp => sp.key === s)
  if (!match) throw new Error(`Invalid split: ${s}`)
  return match.key
}

const SCHEMA = {
  tdee:  { param: 'tdee',  default: 2000,       parse: Number,     serialize: String },
  goal:  { param: 'goal',  default: 'maintain', parse: parseGoal,  serialize: (v: MacroGoal) => v },
  split: { param: 'split', default: 'balanced', parse: parseSplit, serialize: (v: MacroSplit) => v },
} as const satisfies Schema<MacroInputs>

const PIE_COLORS = ['var(--chart-1)', 'var(--chart-1-tint)', 'var(--chart-4)']
const BAR_COLORS = ['bg-chart-1', 'bg-chart-1-tint', 'bg-chart-4']
const SEGMENT_LABELS = ['From protein', 'From carbs', 'From fat']

export function MacroCalculator() {
  const [values, setValues] = useCalculatorUrl<MacroInputs & Record<string, unknown>>(
    SCHEMA as Schema<MacroInputs & Record<string, unknown>>
  )

  const result = calculateMacro(values)

  const pieData = [
    { name: 'Protein', value: Math.round(result.proteinG * 4) },
    { name: 'Carbs',   value: Math.round(result.carbsG * 4) },
    { name: 'Fat',     value: Math.round(result.fatG * 9) },
  ]

  const canExport = values.tdee > 0

  const breakdown: ProportionSegment[] = pieData.map((entry, i) => ({
    label: SEGMENT_LABELS[i],
    value: entry.value,
    display: `${entry.value} kcal`,
    colorClass: BAR_COLORS[i],
  }))

  return (
    <CalculatorGrid>
      <InputPanel title="Inputs">
        <Field label="Daily TDEE (calories)" type="number" min={0} value={values.tdee} onChange={e => setValues({ tdee: Number(e.target.value) })} />

        <div>
          <p id="macro-goal-label" className="mb-1.5 block text-sm font-medium text-foreground">Goal</p>
          <div role="group" aria-labelledby="macro-goal-label" className="flex gap-2">
            {GOALS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                aria-pressed={values.goal === key}
                onClick={() => setValues({ goal: key })}
                className={`min-h-11 flex-1 py-2 rounded-md text-sm md:min-h-10 font-medium border transition-colors ${
                  values.goal === key
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border hover:bg-muted'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p id="macro-split-label" className="mb-1.5 block text-sm font-medium text-foreground">Split</p>
          <div role="group" aria-labelledby="macro-split-label" className="flex gap-2">
            {SPLITS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                aria-pressed={values.split === key}
                onClick={() => setValues({ split: key })}
                className={`min-h-11 flex-1 py-2 rounded-md text-sm md:min-h-10 font-medium border transition-colors ${
                  values.split === key
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border hover:bg-muted'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </InputPanel>

      <ResultPanel id="macro-results">
        <ResultHero label="Calories" value={String(Math.round(result.calories))} caption="kcal per day for your goal">
          <ProportionBar label="Where the daily calories come from" segments={breakdown} />
        </ResultHero>

        <ResultStats>
          <ResultStat label="Protein" value={`${Math.round(result.proteinG)} g`} />
          <ResultStat label="Carbs" value={`${Math.round(result.carbsG)} g`} />
          <ResultStat label="Fat" value={`${Math.round(result.fatG)} g`} />
        </ResultStats>

        <ResultActions
          resultsId="macro-results"
          filename="macro-breakdown"
          csvRows={[
            { Macro: 'Protein', 'Grams per Day': Math.round(result.proteinG), 'Calories per Day': pieData[0].value },
            { Macro: 'Carbs',   'Grams per Day': Math.round(result.carbsG),   'Calories per Day': pieData[1].value },
            { Macro: 'Fat',     'Grams per Day': Math.round(result.fatG),     'Calories per Day': pieData[2].value },
            { Macro: 'Total',   'Grams per Day': '',                          'Calories per Day': Math.round(result.calories) },
          ]}
          canExport={canExport}
        />

        <Card>
          <CardHeader>
            <CardTitle>Macro Split (calories)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  stroke="var(--card)"
                  label={({ name, percent }) => `${name} ${Math.round((percent ?? 0) * 100)}%`}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => [`${v} kcal`]}
                  contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }}
                />
                <Legend wrapperStyle={{ fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </ResultPanel>

      <MobileResultBar targetId="macro-results" value={String(Math.round(result.calories))} caption="kcal/day" />
    </CalculatorGrid>
  )
}
