'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateBodyFat, type BodyFatInputs, type GenderBiological } from '@/lib/engine/fitness'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Field } from '@/components/common/Field'
import { CalculatorGrid, InputPanel, ResultPanel } from '@/components/common/CalculatorLayout'
import { ResultHero, ResultStat, ResultStats } from '@/components/common/Result'
import { ResultActions } from '@/components/common/ResultActions'
import { MobileResultBar } from '@/components/common/MobileResultBar'

const SCHEMA = {
  gender:   { param: 'gender', default: 'male' as GenderBiological, parse: s => (s === 'female' ? 'female' : 'male'), serialize: s => s },
  heightCm: { param: 'height', default: 177, parse: Number, serialize: String },
  neckCm:   { param: 'neck',   default: 38,  parse: Number, serialize: String },
  waistCm:  { param: 'waist',  default: 85,  parse: Number, serialize: String },
  hipCm:    { param: 'hip',    default: 95,  parse: Number, serialize: String },
  weightKg: { param: 'weight', default: 80,  parse: Number, serialize: String },
} as const satisfies Schema<BodyFatInputs>

// min/max mirror the engine's category thresholds; the last band's max only sets where the scale ends
const MALE_CATEGORIES = [
  { label: 'Essential',   range: '< 6%',   min: 0,  max: 6 },
  { label: 'Athletes',    range: '6–13%',  min: 6,  max: 14 },
  { label: 'Fitness',     range: '14–17%', min: 14, max: 18 },
  { label: 'Acceptable',  range: '18–24%', min: 18, max: 25 },
  { label: 'Obese',       range: '≥ 25%',  min: 25, max: 40 },
]

const FEMALE_CATEGORIES = [
  { label: 'Essential',   range: '< 14%',  min: 0,  max: 14 },
  { label: 'Athletes',    range: '14–20%', min: 14, max: 21 },
  { label: 'Fitness',     range: '21–24%', min: 21, max: 25 },
  { label: 'Acceptable',  range: '25–31%', min: 25, max: 32 },
  { label: 'Obese',       range: '≥ 32%',  min: 32, max: 45 },
]

const CATEGORY_COLORS: Record<string, string> = {
  Essential:  'bg-blue-100 text-blue-800',
  Athletes:   'bg-green-100 text-green-800',
  Fitness:    'bg-emerald-100 text-emerald-800',
  Acceptable: 'bg-yellow-100 text-yellow-800',
  Obese:      'bg-red-100 text-red-800',
}

const BAND_COLORS: Record<string, string> = {
  Essential:  'bg-blue-400',
  Athletes:   'bg-green-400',
  Fitness:    'bg-emerald-400',
  Acceptable: 'bg-yellow-400',
  Obese:      'bg-red-400',
}

export function BodyFatCalculator() {
  const [values, setValues] = useCalculatorUrl<BodyFatInputs & Record<string, unknown>>(
    SCHEMA as Schema<BodyFatInputs & Record<string, unknown>>
  )

  const result = calculateBodyFat(values)
  const categories = values.gender === 'male' ? MALE_CATEGORIES : FEMALE_CATEGORIES
  const badgeClass = CATEGORY_COLORS[result.category] ?? 'bg-gray-100 text-gray-800'
  const canExport =
    values.heightCm > 0 &&
    values.neckCm > 0 &&
    values.waistCm > 0 &&
    (values.gender === 'male' || values.hipCm > 0)

  const scaleMax = categories[categories.length - 1].max
  const toPercent = (bf: number) => (Math.max(0, Math.min(scaleMax, bf)) / scaleMax) * 100
  const scaleTicks = [0, ...categories.map(c => c.max)]
  const bodyFatText = `${result.bodyFatPercentage.toFixed(1)}%`

  return (
    <CalculatorGrid>
      <InputPanel title="Measurements">
        <div>
          <p id="body-fat-gender-label" className="mb-1.5 block text-sm font-medium text-foreground">Gender</p>
          <div role="group" aria-labelledby="body-fat-gender-label" className="flex gap-2">
            {(['male', 'female'] as GenderBiological[]).map(g => (
              <button
                key={g}
                type="button"
                aria-pressed={values.gender === g}
                onClick={() => setValues({ gender: g })}
                className={`flex-1 py-2 px-4 rounded-md border text-sm font-medium transition-colors ${
                  values.gender === g
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-input hover:bg-muted'
                }`}
              >
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <Field label="Height (cm)" type="number" value={values.heightCm} onChange={e => setValues({ heightCm: Number(e.target.value) })} />
        <Field label="Weight (kg)" type="number" value={values.weightKg} onChange={e => setValues({ weightKg: Number(e.target.value) })} />
        <Field label="Neck (cm)" type="number" value={values.neckCm} onChange={e => setValues({ neckCm: Number(e.target.value) })} />
        <Field label="Waist (cm)" type="number" value={values.waistCm} onChange={e => setValues({ waistCm: Number(e.target.value) })} />
        {values.gender === 'female' && (
          <Field label="Hip (cm)" type="number" value={values.hipCm} onChange={e => setValues({ hipCm: Number(e.target.value) })} />
        )}
      </InputPanel>

      <ResultPanel id="body-fat-results">
        {/* The hero's only <span> is the category badge; e2e reads the category from it */}
        <ResultHero
          label="Result"
          value={bodyFatText}
          caption={
            <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${badgeClass}`}>
              {result.category}
            </span>
          }
        >
          <figure aria-label={`Body fat ${bodyFatText} on a scale from 0% to ${scaleMax}%`} className="relative pt-3">
            <div aria-hidden className="flex h-3 gap-0.5 overflow-hidden rounded-full">
              {categories.map(c => (
                <div
                  key={c.label}
                  className={`${BAND_COLORS[c.label]} h-full`}
                  style={{ width: `${toPercent(c.max) - toPercent(c.min)}%` }}
                />
              ))}
            </div>
            <div
              aria-hidden
              className="absolute top-0 -translate-x-1/2 transition-[left] duration-300 ease-out motion-reduce:transition-none"
              style={{ left: `${toPercent(result.bodyFatPercentage)}%` }}
            >
              <div className="h-0 w-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-foreground" />
            </div>
            <div aria-hidden className="relative mt-2 h-4 text-xs tabular-nums text-muted-foreground">
              {scaleTicks.map(tick => (
                <div
                  key={tick}
                  className="absolute -translate-x-1/2 first:translate-x-0 last:-translate-x-full"
                  style={{ left: `${toPercent(tick)}%` }}
                >
                  {tick}
                </div>
              ))}
            </div>
          </figure>
        </ResultHero>

        <ResultStats>
          <ResultStat label="Fat Mass" value={`${result.fatMassKg.toFixed(1)} kg`} />
          <ResultStat label="Lean Mass" value={`${result.leanMassKg.toFixed(1)} kg`} />
        </ResultStats>

        <ResultActions
          resultsId="body-fat-results"
          filename="body-fat-percentage"
          csvRows={categories.map(cat => ({
            Category: cat.label,
            [`Range (${values.gender === 'male' ? 'Male' : 'Female'})`]: cat.range,
            'Your Body Fat %': cat.label === result.category ? result.bodyFatPercentage.toFixed(1) : '',
          }))}
          canExport={canExport}
        />

        <Card>
          <CardHeader><CardTitle>Body Fat Categories ({values.gender === 'male' ? 'Male' : 'Female'})</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Range</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map(cat => {
                  const isCurrent = cat.label === result.category
                  return (
                    <TableRow key={cat.label} aria-current={isCurrent ? 'true' : undefined} className={isCurrent ? 'bg-accent font-semibold' : ''}>
                      <TableCell>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${CATEGORY_COLORS[cat.label] ?? ''}`}>
                          {cat.label}
                        </span>
                      </TableCell>
                      <TableCell>{cat.range}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </ResultPanel>

      <MobileResultBar targetId="body-fat-results" value={bodyFatText} caption="body fat" />
    </CalculatorGrid>
  )
}
