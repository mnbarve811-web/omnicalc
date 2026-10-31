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

export function calculateGeometry({ shape, dimensions }: GeometryInputs): GeometryResult {
  const { radius = 0, width = 0, height = 0, base = 0, a, b, c } = dimensions

  switch (shape) {
    case 'circle':
      return {
        area: Math.PI * radius * radius,
        perimeter: 2 * Math.PI * radius,
      }
    case 'rectangle':
      return {
        area: width * height,
        perimeter: 2 * (width + height),
      }
    case 'triangle': {
      const perimeter = (a !== undefined && b !== undefined && c !== undefined) ? a + b + c : undefined
      return {
        area: 0.5 * base * height,
        ...(perimeter !== undefined ? { perimeter } : {}),
      }
    }
    case 'cylinder':
      return {
        volume: Math.PI * radius * radius * height,
        surfaceArea: 2 * Math.PI * radius * height + 2 * Math.PI * radius * radius,
      }
    case 'sphere':
      return {
        volume: (4 / 3) * Math.PI * radius * radius * radius,
        surfaceArea: 4 * Math.PI * radius * radius,
      }
    case 'cone': {
      const slant = Math.sqrt(radius * radius + height * height)
      return {
        volume: (1 / 3) * Math.PI * radius * radius * height,
        surfaceArea: Math.PI * radius * (radius + slant),
      }
    }
  }
}
