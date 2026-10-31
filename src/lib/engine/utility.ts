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

const MS_PER_DAY = 1000 * 60 * 60 * 24

interface CalendarDate {
  year: number
  month: number   // 0-11
  day: number
}

function parseIsoDate(iso: string): CalendarDate {
  const [year, month, day] = iso.split('-').map(Number)
  return { year, month: month - 1, day }
}

function toUtcMs({ year, month, day }: CalendarDate): number {
  return Date.UTC(year, month, day)
}

// Oct 31 + 1 month lands on Nov 30, not Dec 1, matching how people count calendar months
function addMonthsClamped(date: CalendarDate, months: number): number {
  const monthIndex = date.month + months
  const year = date.year + Math.floor(monthIndex / 12)
  const month = ((monthIndex % 12) + 12) % 12
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  return Date.UTC(year, month, Math.min(date.day, daysInMonth))
}

// All arithmetic is in UTC: mixing UTC-parsed dates with local-time setters shifted results west of UTC
export function calculateDateDiff({ startDate, endDate }: DateDiffInputs): DateDiffResult {
  const start = parseIsoDate(startDate)
  const end = parseIsoDate(endDate)
  const [early, late] = toUtcMs(start) <= toUtcMs(end) ? [start, end] : [end, start]
  const lateMs = toUtcMs(late)

  const totalDays = Math.round((lateMs - toUtcMs(early)) / MS_PER_DAY)

  let totalMonths = (late.year - early.year) * 12 + (late.month - early.month)
  if (addMonthsClamped(early, totalMonths) > lateMs) totalMonths--

  const days = Math.round((lateMs - addMonthsClamped(early, totalMonths)) / MS_PER_DAY)

  return { years: Math.floor(totalMonths / 12), months: totalMonths % 12, days, totalDays }
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
