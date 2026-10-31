// omnicalc/src/lib/engine/utility.ts

// --- Date / Time ---
export interface DateDiffInputs {
  startDate: string   // ISO date string YYYY-MM-DD
  endDate: string     // ISO date string YYYY-MM-DD
}

export interface DateDiffResult {
  years: number
  months: number
  days: number
  totalDays: number
}

export function calculateDateDiff({ startDate, endDate }: DateDiffInputs): DateDiffResult {
  const start = new Date(startDate)
  const end   = new Date(endDate)
  const [early, late] = start <= end ? [start, end] : [end, start]

  const totalDays = Math.round((late.getTime() - early.getTime()) / (1000 * 60 * 60 * 24))

  let years = late.getFullYear() - early.getFullYear()
  let tempDate = new Date(early)
  tempDate.setFullYear(tempDate.getFullYear() + years)
  if (tempDate > late) { years--; tempDate.setFullYear(tempDate.getFullYear() - 1) }

  let months = late.getMonth() - tempDate.getMonth() + (late.getFullYear() - tempDate.getFullYear()) * 12
  tempDate.setMonth(tempDate.getMonth() + months)
  if (tempDate > late) { months--; tempDate.setMonth(tempDate.getMonth() - 1) }

  const days = Math.round((late.getTime() - tempDate.getTime()) / (1000 * 60 * 60 * 24))

  return { years, months, days, totalDays }
}

// --- Unit Conversion ---
export type UnitCategory =
  | 'length' | 'weight' | 'volume' | 'temperature'
  | 'speed' | 'area' | 'pressure'

export interface ConversionInputs {
  category: UnitCategory
  fromUnit: string
  toUnit: string
  value: number
}

export interface ConversionResult {
  result: number
  formula: string   // e.g. "1 km = 0.621371 miles"
}

const TO_BASE: Record<string, Record<string, number>> = {
  length:   { m: 1, km: 1000, mi: 1609.344, ft: 0.3048, in: 0.0254, cm: 0.01, yd: 0.9144 },
  weight:   { kg: 1, g: 0.001, lb: 0.453592, oz: 0.0283495, t: 1000 },
  volume:   { L: 1, mL: 0.001, gal: 3.78541, 'fl oz': 0.0295735, cup: 0.236588, pt: 0.473176, qt: 0.946353 },
  speed:    { 'm/s': 1, 'km/h': 1 / 3.6, mph: 0.44704, knot: 0.514444 },
  area:     { 'm²': 1, 'km²': 1e6, 'ft²': 0.092903, acre: 4046.86, 'mi²': 2.59e6, 'cm²': 0.0001 },
  pressure: { Pa: 1, kPa: 1000, bar: 100000, psi: 6894.76, atm: 101325 },
}

function convertTemperature(value: number, from: string, to: string): number {
  let celsius: number
  if (from === 'C') celsius = value
  else if (from === 'F') celsius = (value - 32) * 5 / 9
  else celsius = value - 273.15
  if (to === 'C') return celsius
  if (to === 'F') return celsius * 9 / 5 + 32
  return celsius + 273.15
}

export function calculateConversion({ category, fromUnit, toUnit, value }: ConversionInputs): ConversionResult {
  if (category === 'temperature') {
    const result = convertTemperature(value, fromUnit, toUnit)
    return {
      result,
      formula: `${value}°${fromUnit} = ${Number(result.toPrecision(6))}°${toUnit}`,
    }
  }
  const result = value * TO_BASE[category][fromUnit] / TO_BASE[category][toUnit]
  const ratio = TO_BASE[category][fromUnit] / TO_BASE[category][toUnit]
  return {
    result,
    formula: `1 ${fromUnit} = ${Number(ratio.toPrecision(6))} ${toUnit}`,
  }
}

// --- Geometry ---
export type GeometryShape =
  | 'circle' | 'triangle' | 'rectangle' | 'cylinder' | 'sphere' | 'cone'

export interface GeometryInputs {
  shape: GeometryShape
  dimensions: Record<string, number>  // e.g. { radius: 5 } or { base: 3, height: 4 }
}

export interface GeometryResult {
  area?: number
  perimeter?: number
  volume?: number
  surfaceArea?: number
}

export function calculateGeometry(_inputs: GeometryInputs): GeometryResult {
  throw new Error('Not implemented')
}
