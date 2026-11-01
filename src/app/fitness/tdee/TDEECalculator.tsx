'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateTDEE, type TDEEInputs, type GenderBiological, type ActivityLevel } from '@/lib/engine/fitness'
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field } from '@/components/common/Field'
import { CalculatorGrid, InputPanel, ResultPanel } from '@/components/common/CalculatorLayout'
import { ProportionBar, ResultHero, ResultStat, ResultStats, type ProportionSegment } from '@/components/common/Result'
import { ResultActions } from '@/components/common/ResultActions'
import { MobileResultBar } from '@/components/common/MobileResultBar'
import { niceTicks } from '@/lib/format'

// Unknown URL values throw so the hook falls back to the default instead of feeding the engine an invalid key
function parseGender(s: string): GenderBiological {
  if (s !== 'male' && s !== 'female') throw new Error(`Unknown gender: ${s}`)
  return s
}

function parseActivityLevel(s: string): ActivityLevel {
  const match = ACTIVITY_LABELS.find(a => a.value === s)
  if (!match) throw new Error(`Unknown activity level: ${s}`)
  return match.value
}

const SCHEMA = {
  gender:        { param: 'gender',   default: 'male' as GenderBiological, parse: parseGender, serialize: s => s },
  weightKg:      { param: 'weight',   default: 75,   parse: Number, serialize: String },
  heightCm:      { param: 'height',   default: 170,  parse: Number, serialize: String },
  ageYears:      { param: 'age',      default: 30,   parse: Number, serialize: String },
  activityLevel: { param: 'activity', default: 'moderate' as ActivityLevel, parse: parseActivityLevel, serialize: s => s },
} as const satisfies Schema<TDEEInputs>

const ACTIVITY_LABELS: { value: ActivityLevel; label: string; description: string }[] = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise' },
  { value: 'light',     label: 'Light',     description: '1–3 days/week' },
  { value: 'moderate',  label: 'Moderate',  description: '3–5 days/week' },
  { value: 'heavy',     label: 'Heavy',     description: '6–7 days/week' },
  { value: 'athlete',   label: 'Athlete',   description: '2× per day' },
]

export function TDEECalculator() {
  const [values, setValues] = useCalculatorUrl<TDEEInputs & Record<string, unknown>>(
    SCHEMA as Schema<TDEEInputs & Record<string, unknown>>
  )

  const result = calculateTDEE(values)

  const chartData = [
    { name: 'Cut',      calories: Math.round(result.cut),      fill: 'var(--chart-4)' },
    { name: 'Maintain', calories: Math.round(result.maintain), fill: 'var(--chart-1)' },
    { name: 'Bulk',     calories: Math.round(result.bulk),     fill: 'var(--chart-1-tint)' },
  ]
  const xTicks = niceTicks(Math.max(0, ...chartData.map((entry) => entry.calories)))

  const canExport = values.weightKg > 0 && values.heightCm > 0 && values.ageYears > 0

  const restingCalories = Math.round(result.bmr)
  const activityCalories = Math.round(result.maintain) - restingCalories
  const breakdown: ProportionSegment[] = [
    { label: 'Resting (BMR)', value: restingCalories, display: `${restingCalories.toLocaleString()} cal`, colorClass: 'bg-chart-1' },
    { label: 'Activity', value: activityCalories, display: `${activityCalories.toLocaleString()} cal`, colorClass: 'bg-chart-1-tint' },
  ]

  return (
    <CalculatorGrid>
      <InputPanel title="Your Details">
        <div>
          <p id="tdee-sex-label" className="mb-1.5 block text-sm font-medium text-foreground">Biological Sex</p>
          <div role="group" aria-labelledby="tdee-sex-label" className="flex gap-2">
            {(['male', 'female'] as GenderBiological[]).map(g => (
              <button
                type="button"
                key={g}
                aria-pressed={values.gender === g}
                onClick={() => setValues({ gender: g })}
                className={`min-h-11 flex-1 py-2 rounded-md md:min-h-10 border text-sm font-medium transition-colors ${
                  values.gender === g
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border hover:bg-muted'
                }`}
              >
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <Field label="Weight" suffix="kg" type="number" value={values.weightKg} onChange={e => setValues({ weightKg: Number(e.target.value) })} />
        <Field label="Height" suffix="cm" type="number" value={values.heightCm} onChange={e => setValues({ heightCm: Number(e.target.value) })} />
        <Field label="Age" suffix="years" type="number" value={values.ageYears} onChange={e => setValues({ ageYears: Number(e.target.value) })} />

        <div>
          <p id="tdee-activity-label" className="mb-1.5 block text-sm font-medium text-foreground">Activity Level</p>
          <div role="group" aria-labelledby="tdee-activity-label" className="space-y-2">
            {ACTIVITY_LABELS.map(({ value, label, description }) => (
              <button
                type="button"
                key={value}
                aria-pressed={values.activityLevel === value}
                onClick={() => setValues({ activityLevel: value })}
                className={`min-h-11 w-full text-left px-3 py-2 rounded-md md:min-h-10 border text-sm transition-colors ${
                  values.activityLevel === value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border hover:bg-muted'
                }`}
              >
                <span className="font-medium">{label}</span>
                <span className={`ml-2 text-xs ${values.activityLevel === value ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {description}
                </span>
              </button>
            ))}
          </div>
        </div>
      </InputPanel>

      <ResultPanel id="tdee-results">
        <ResultHero
          label="Maintain"
          value={Math.round(result.maintain).toLocaleString()}
          caption="Calories per day to hold your current weight (your TDEE)"
        >
          <ProportionBar label="What makes up your daily energy expenditure" segments={breakdown} />
        </ResultHero>

        <ResultStats>
          <ResultStat label="Basal Metabolic Rate (BMR)" value={`${Math.round(result.bmr).toLocaleString()} cal/day`} />
          <ResultStat label="Cut (−20%)" value={Math.round(result.cut).toLocaleString()} />
          <ResultStat label="Bulk (+15%)" value={Math.round(result.bulk).toLocaleString()} />
        </ResultStats>

        <ResultActions
          resultsId="tdee-results"
          filename="tdee-calories"
          csvRows={[
            { Metric: 'Basal Metabolic Rate (BMR)', 'Calories per Day': Math.round(result.bmr) },
            { Metric: 'Cut (20% deficit)',          'Calories per Day': Math.round(result.cut) },
            { Metric: 'Maintain (TDEE)',            'Calories per Day': Math.round(result.maintain) },
            { Metric: 'Bulk (15% surplus)',         'Calories per Day': Math.round(result.bulk) },
          ]}
          canExport={canExport}
        />

        <Card>
          <CardHeader>
            <CardTitle>Calorie Targets</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 16, left: 16, bottom: 4 }}>
                <CartesianGrid stroke="var(--border)" horizontal={false} />
                <XAxis type="number" ticks={xTicks} domain={[0, xTicks[xTicks.length - 1]]} tickFormatter={(v: number) => v.toLocaleString('en-US')} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" width={72} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(v) => typeof v === 'number' ? `${Math.round(v).toLocaleString()} cal` : String(v)}
                  contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }}
                  cursor={{ fill: 'var(--muted)' }}
                />
                <Bar dataKey="calories" radius={[0, 4, 4, 0]} maxBarSize={36}>
                  {chartData.map(entry => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </ResultPanel>

      <MobileResultBar targetId="tdee-results" value={Math.round(result.maintain).toLocaleString()} caption="cal/day" />
    </CalculatorGrid>
  )
}
