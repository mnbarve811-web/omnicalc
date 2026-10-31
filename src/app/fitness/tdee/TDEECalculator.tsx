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
import { Input } from '@/components/ui/input'

const SCHEMA = {
  gender:        { param: 'gender',   default: 'male' as GenderBiological, parse: s => s as GenderBiological, serialize: s => s },
  weightKg:      { param: 'weight',   default: 75,   parse: Number, serialize: String },
  heightCm:      { param: 'height',   default: 170,  parse: Number, serialize: String },
  ageYears:      { param: 'age',      default: 30,   parse: Number, serialize: String },
  activityLevel: { param: 'activity', default: 'moderate' as ActivityLevel, parse: s => s as ActivityLevel, serialize: s => s },
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
    { name: 'Cut',      calories: Math.round(result.cut),      fill: '#f97316' },
    { name: 'Maintain', calories: Math.round(result.maintain), fill: '#2563eb' },
    { name: 'Bulk',     calories: Math.round(result.bulk),     fill: '#16a34a' },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
      {/* Left column: inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Your Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Gender toggle */}
          <div>
            <label className="text-sm font-medium mb-1 block">Biological Sex</label>
            <div className="flex gap-2">
              {(['male', 'female'] as GenderBiological[]).map(g => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setValues({ gender: g })}
                  className={`flex-1 py-2 rounded-md border text-sm font-medium transition-colors ${
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

          {/* Weight */}
          <div>
            <label className="text-sm font-medium mb-1 block">Weight</label>
            <div className="relative">
              <Input
                type="number"
                className="pr-12"
                value={values.weightKg}
                onChange={e => setValues({ weightKg: Number(e.target.value) })}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">kg</span>
            </div>
          </div>

          {/* Height */}
          <div>
            <label className="text-sm font-medium mb-1 block">Height</label>
            <div className="relative">
              <Input
                type="number"
                className="pr-12"
                value={values.heightCm}
                onChange={e => setValues({ heightCm: Number(e.target.value) })}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">cm</span>
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="text-sm font-medium mb-1 block">Age</label>
            <div className="relative">
              <Input
                type="number"
                className="pr-16"
                value={values.ageYears}
                onChange={e => setValues({ ageYears: Number(e.target.value) })}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">years</span>
            </div>
          </div>

          {/* Activity level */}
          <div>
            <label className="text-sm font-medium mb-1 block">Activity Level</label>
            <div className="space-y-2">
              {ACTIVITY_LABELS.map(({ value, label, description }) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setValues({ activityLevel: value })}
                  className={`w-full text-left px-3 py-2 rounded-md border text-sm transition-colors ${
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
        </CardContent>
      </Card>

      {/* Right column: results */}
      <div className="space-y-6">
        {/* BMR summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Basal Metabolic Rate (BMR)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Math.round(result.bmr).toLocaleString()} <span className="text-base font-normal text-muted-foreground">cal/day</span></p>
          </CardContent>
        </Card>

        {/* Goal cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="text-xs text-muted-foreground font-normal">Cut (−20%)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-orange-600">{Math.round(result.cut).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">cal/day</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-xs text-muted-foreground font-normal">Maintain</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-blue-600">{Math.round(result.maintain).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">cal/day</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-xs text-muted-foreground font-normal">Bulk (+15%)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-green-600">{Math.round(result.bulk).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">cal/day</p>
            </CardContent>
          </Card>
        </div>

        {/* Bar chart */}
        <Card>
          <CardHeader>
            <CardTitle>Calorie Targets</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 16, left: 16, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k`} />
                <YAxis type="category" dataKey="name" width={72} />
                <Tooltip formatter={(v) => typeof v === 'number' ? `${Math.round(v).toLocaleString()} cal` : String(v)} />
                <Bar dataKey="calories" radius={[0, 4, 4, 0]}>
                  {chartData.map(entry => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
