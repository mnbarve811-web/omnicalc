'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateBodyFat, type BodyFatInputs, type GenderBiological } from '@/lib/engine/fitness'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ExportButtons } from '@/components/common/ExportButtons'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const SCHEMA = {
  gender:   { param: 'gender', default: 'male' as GenderBiological, parse: s => (s === 'female' ? 'female' : 'male'), serialize: s => s },
  heightCm: { param: 'height', default: 177, parse: Number, serialize: String },
  neckCm:   { param: 'neck',   default: 38,  parse: Number, serialize: String },
  waistCm:  { param: 'waist',  default: 85,  parse: Number, serialize: String },
  hipCm:    { param: 'hip',    default: 95,  parse: Number, serialize: String },
} as const satisfies Schema<BodyFatInputs>

const MALE_CATEGORIES = [
  { label: 'Essential',   range: '< 6%' },
  { label: 'Athletes',    range: '6–13%' },
  { label: 'Fitness',     range: '14–17%' },
  { label: 'Acceptable',  range: '18–24%' },
  { label: 'Obese',       range: '≥ 25%' },
]

const FEMALE_CATEGORIES = [
  { label: 'Essential',   range: '< 14%' },
  { label: 'Athletes',    range: '14–20%' },
  { label: 'Fitness',     range: '21–24%' },
  { label: 'Acceptable',  range: '25–31%' },
  { label: 'Obese',       range: '≥ 32%' },
]

const CATEGORY_COLORS: Record<string, string> = {
  Essential:  'bg-blue-100 text-blue-800',
  Athletes:   'bg-green-100 text-green-800',
  Fitness:    'bg-emerald-100 text-emerald-800',
  Acceptable: 'bg-yellow-100 text-yellow-800',
  Obese:      'bg-red-100 text-red-800',
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
      <Card>
        <CardHeader><CardTitle>Measurements</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Gender</label>
            <div className="flex gap-2">
              {(['male', 'female'] as GenderBiological[]).map(g => (
                <button
                  key={g}
                  type="button"
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

          {[
            { label: 'Height (cm)', key: 'heightCm' as const },
            { label: 'Neck (cm)',   key: 'neckCm'   as const },
            { label: 'Waist (cm)',  key: 'waistCm'  as const },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="text-sm font-medium mb-1 block">{label}</label>
              <Input
                type="number"
                value={values[key]}
                onChange={e => setValues({ [key]: Number(e.target.value) })}
              />
            </div>
          ))}

          {values.gender === 'female' && (
            <div>
              <label className="text-sm font-medium mb-1 block">Hip (cm)</label>
              <Input
                type="number"
                value={values.hipCm}
                onChange={e => setValues({ hipCm: Number(e.target.value) })}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div id="body-fat-results" className="space-y-6">
        <ExportButtons
          resultsId="body-fat-results"
          filename="body-fat-percentage"
          csvRows={categories.map(cat => ({
            Category: cat.label,
            [`Range (${values.gender === 'male' ? 'Male' : 'Female'})`]: cat.range,
            'Your Body Fat %': cat.label === result.category ? result.bodyFatPercentage.toFixed(1) : '',
          }))}
          disabled={!canExport}
        />

        <Card>
          <CardHeader><CardTitle>Result</CardTitle></CardHeader>
          <CardContent className="flex items-center gap-6">
            <p className="text-5xl font-bold">{result.bodyFatPercentage.toFixed(1)}%</p>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeClass}`}>
              {result.category}
            </span>
          </CardContent>
        </Card>

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
                    <TableRow key={cat.label} className={isCurrent ? 'bg-muted font-semibold' : ''}>
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
      </div>
    </div>
  )
}
