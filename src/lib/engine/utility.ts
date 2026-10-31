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

export function calculateConversion(_inputs: ConversionInputs): ConversionResult {
  throw new Error('Not implemented')
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
