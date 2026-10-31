'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateConversion, type ConversionInputs, type UnitCategory } from '@/lib/engine/utility'
import { Field } from '@/components/common/Field'
import { CalculatorGrid, InputPanel, ResultPanel } from '@/components/common/CalculatorLayout'
import { ResultHero } from '@/components/common/Result'
import { ResultActions } from '@/components/common/ResultActions'
import { MobileResultBar } from '@/components/common/MobileResultBar'

const SELECT_CLASS =
  'h-11 w-full rounded-sm border border-input bg-card px-3 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:h-10 md:text-sm'
const LABEL_CLASS = 'mb-1.5 block text-sm font-medium text-foreground'

const UNITS_PER_CATEGORY: Record<UnitCategory, string[]> = {
  length:      ['m', 'km', 'mi', 'ft', 'in', 'cm', 'yd'],
  weight:      ['kg', 'g', 'lb', 'oz', 't'],
  volume:      ['L', 'mL', 'gal', 'fl oz', 'cup', 'pt', 'qt'],
  temperature: ['C', 'F', 'K'],
  speed:       ['m/s', 'km/h', 'mph', 'knot'],
  area:        ['m²', 'km²', 'ft²', 'acre', 'mi²', 'cm²'],
  pressure:    ['Pa', 'kPa', 'bar', 'psi', 'atm'],
}

function parseCategory(s: string): UnitCategory {
  if (!(s in UNITS_PER_CATEGORY)) throw new Error(`Unknown unit category: ${s}`)
  return s as UnitCategory
}

function pickUnit(requested: string, fallback: string, units: string[], fallbackIndex: number): string {
  if (units.includes(requested)) return requested
  if (units.includes(fallback)) return fallback
  return units[fallbackIndex]
}

const SCHEMA = {
  category: { param: 'cat',   default: 'length' as UnitCategory, parse: parseCategory, serialize: s => s },
  fromUnit: { param: 'from',  default: 'km',    parse: s => s,   serialize: s => s },
  toUnit:   { param: 'to',    default: 'm',     parse: s => s,   serialize: s => s },
  value:    { param: 'value', default: 1,       parse: Number,   serialize: String },
} as const satisfies Schema<ConversionInputs>

export function UnitConversionCalculator() {
  const [values, setValues] = useCalculatorUrl<ConversionInputs & Record<string, unknown>>(
    SCHEMA as Schema<ConversionInputs & Record<string, unknown>>
  )

  const units = UNITS_PER_CATEGORY[values.category]
  // Units come from the URL independently of the category, so ones that don't belong to it fall back
  const fromUnit = pickUnit(values.fromUnit, SCHEMA.fromUnit.default, units, 0)
  const toUnit = pickUnit(values.toUnit, SCHEMA.toUnit.default, units, 1)
  const result = calculateConversion({ ...values, fromUnit, toUnit })
  const canExport =
    Number.isFinite(values.value) &&
    // 0° is a real temperature, so only the other categories treat zero as an empty input
    (values.value !== 0 || values.category === 'temperature') &&
    Number.isFinite(result.result)

  function handleCategoryChange(newCategory: UnitCategory) {
    const newUnits = UNITS_PER_CATEGORY[newCategory]
    setValues({
      category: newCategory,
      fromUnit: newUnits[0],
      toUnit: newUnits[1],
    } as Partial<ConversionInputs & Record<string, unknown>>)
  }

  const CATEGORIES: { value: UnitCategory; label: string }[] = [
    { value: 'length',      label: 'Length' },
    { value: 'weight',      label: 'Weight' },
    { value: 'volume',      label: 'Volume' },
    { value: 'temperature', label: 'Temperature' },
    { value: 'speed',       label: 'Speed' },
    { value: 'area',        label: 'Area' },
    { value: 'pressure',    label: 'Pressure' },
  ]

  const convertedValue = `${Number(result.result.toPrecision(7)).toString()} ${toUnit}`

  return (
    <CalculatorGrid>
      <InputPanel title="Convert Units">
        <div>
          <label htmlFor="unit-category" className={LABEL_CLASS}>Category</label>
          <select
            id="unit-category"
            className={SELECT_CLASS}
            value={values.category}
            onChange={(e) => handleCategoryChange(e.target.value as UnitCategory)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <Field
          label="Value"
          type="number"
          value={values.value}
          onChange={(e) => setValues({ value: Number(e.target.value) } as Partial<ConversionInputs & Record<string, unknown>>)}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="unit-from" className={LABEL_CLASS}>From</label>
            <select
              id="unit-from"
              className={SELECT_CLASS}
              value={fromUnit}
              onChange={(e) => setValues({ fromUnit: e.target.value } as Partial<ConversionInputs & Record<string, unknown>>)}
            >
              {units.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="unit-to" className={LABEL_CLASS}>To</label>
            <select
              id="unit-to"
              className={SELECT_CLASS}
              value={toUnit}
              onChange={(e) => setValues({ toUnit: e.target.value } as Partial<ConversionInputs & Record<string, unknown>>)}
            >
              {units.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>
      </InputPanel>

      <ResultPanel id="unit-conversion-results">
        <ResultHero label="Result" value={convertedValue} caption={result.formula} />

        <ResultActions
          resultsId="unit-conversion-results"
          filename="unit-conversion"
          csvRows={[{
            Category: CATEGORIES.find((cat) => cat.value === values.category)?.label ?? values.category,
            'From Value': values.value,
            'From Unit': fromUnit,
            'To Value': Number(result.result.toPrecision(7)),
            'To Unit': toUnit,
            Formula: result.formula,
          }]}
          canExport={canExport}
        />
      </ResultPanel>

      <MobileResultBar targetId="unit-conversion-results" value={convertedValue} caption={`from ${values.value} ${fromUnit}`} />
    </CalculatorGrid>
  )
}
