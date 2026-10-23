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

export function calculateDateDiff(_inputs: DateDiffInputs): DateDiffResult {
  throw new Error('Not implemented')
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
