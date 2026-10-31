'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ExportButtons } from '@/components/common/ExportButtons'
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

const PIE_COLORS = ['#6366f1', '#22c55e', '#f59e0b']

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
      {/* Left column: inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="macro-tdee" className="text-sm font-medium block">Daily TDEE (calories)</label>
            <Input
              id="macro-tdee"
              type="number"
              min={0}
              value={values.tdee}
              onChange={e => setValues({ tdee: Number(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Goal</p>
            <div className="flex gap-2">
              {GOALS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={values.goal === key}
                  onClick={() => setValues({ goal: key })}
                  className={`flex-1 py-2 rounded-md text-sm font-medium border transition-colors ${
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

          <div className="space-y-2">
            <p className="text-sm font-medium">Split</p>
            <div className="flex gap-2">
              {SPLITS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={values.split === key}
                  onClick={() => setValues({ split: key })}
                  className={`flex-1 py-2 rounded-md text-sm font-medium border transition-colors ${
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
        </CardContent>
      </Card>

      {/* Right column: results */}
      <div id="macro-results" className="space-y-6">
        <ExportButtons
          resultsId="macro-results"
          filename="macro-breakdown"
          csvRows={[
            { Macro: 'Protein', 'Grams per Day': Math.round(result.proteinG), 'Calories per Day': pieData[0].value },
            { Macro: 'Carbs',   'Grams per Day': Math.round(result.carbsG),   'Calories per Day': pieData[1].value },
            { Macro: 'Fat',     'Grams per Day': Math.round(result.fatG),     'Calories per Day': pieData[2].value },
            { Macro: 'Total',   'Grams per Day': '',                          'Calories per Day': Math.round(result.calories) },
          ]}
          disabled={!canExport}
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Calories', value: Math.round(result.calories), unit: 'kcal' },
            { label: 'Protein',  value: Math.round(result.proteinG), unit: 'g' },
            { label: 'Carbs',    value: Math.round(result.carbsG),   unit: 'g' },
            { label: 'Fat',      value: Math.round(result.fatG),     unit: 'g' },
          ].map(({ label, value, unit }) => (
            <Card key={label}>
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{unit}</p>
              </CardContent>
            </Card>
          ))}
        </div>

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
                  label={({ name, percent }) => `${name} ${Math.round((percent ?? 0) * 100)}%`}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v} kcal`]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
