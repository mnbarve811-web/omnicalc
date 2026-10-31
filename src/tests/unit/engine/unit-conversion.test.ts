import { describe, it, expect } from 'vitest'
import { calculateConversion, type UnitCategory } from '@/lib/engine'

describe('calculateConversion', () => {
  it('1 km = 1000 m', () => {
    const r = calculateConversion({ category: 'length', fromUnit: 'km', toUnit: 'm', value: 1 })
    expect(r.result).toBeCloseTo(1000, 2)
  })
  it('1 mi ≈ 1.609 km', () => {
    const r = calculateConversion({ category: 'length', fromUnit: 'mi', toUnit: 'km', value: 1 })
    expect(r.result).toBeCloseTo(1.609, 2)
  })
  it('100°C = 212°F', () => {
    const r = calculateConversion({ category: 'temperature', fromUnit: 'C', toUnit: 'F', value: 100 })
    expect(r.result).toBeCloseTo(212, 2)
  })
  it('0°C = 273.15 K', () => {
    const r = calculateConversion({ category: 'temperature', fromUnit: 'C', toUnit: 'K', value: 0 })
    expect(r.result).toBeCloseTo(273.15, 2)
  })
  it('same unit returns same value', () => {
    const r = calculateConversion({ category: 'weight', fromUnit: 'kg', toUnit: 'kg', value: 5 })
    expect(r.result).toBeCloseTo(5, 6)
  })
  it('1 kg ≈ 2.205 lb', () => {
    const r = calculateConversion({ category: 'weight', fromUnit: 'kg', toUnit: 'lb', value: 1 })
    expect(r.result).toBeCloseTo(2.205, 2)
  })
  it('formula is a non-empty string', () => {
    const r = calculateConversion({ category: 'length', fromUnit: 'm', toUnit: 'ft', value: 1 })
    expect(typeof r.formula).toBe('string')
    expect(r.formula.length).toBeGreaterThan(0)
  })
  it('writes kelvin without a degree sign', () => {
    const r = calculateConversion({ category: 'temperature', fromUnit: 'C', toUnit: 'K', value: 25 })
    expect(r.formula).toBe('25°C = 298.15 K')
  })
})

const UNITS_BY_CATEGORY: Record<Exclude<UnitCategory, 'temperature'>, string[]> = {
  length: ['m', 'km', 'mi', 'ft', 'in', 'cm', 'yd'],
  weight: ['kg', 'g', 'lb', 'oz', 't'],
  volume: ['L', 'mL', 'gal', 'fl oz', 'cup', 'pt', 'qt'],
  speed: ['m/s', 'km/h', 'mph', 'knot'],
  area: ['m²', 'km²', 'ft²', 'acre', 'mi²', 'cm²'],
  pressure: ['Pa', 'kPa', 'bar', 'psi', 'atm'],
}

describe('calculateConversion: every linear category', () => {
  it.each<[UnitCategory, string, string, number, number]>([
    ['length', 'ft', 'in', 1, 12],
    ['length', 'yd', 'm', 1, 0.9144],
    ['length', 'cm', 'in', 2.54, 1],
    ['weight', 't', 'kg', 1, 1000],
    ['weight', 'lb', 'oz', 1, 16],
    ['weight', 'g', 'kg', 500, 0.5],
    ['volume', 'gal', 'L', 1, 3.78541],
    ['volume', 'qt', 'pt', 1, 2],
    ['volume', 'cup', 'fl oz', 1, 8],
    ['volume', 'L', 'mL', 1, 1000],
    ['speed', 'km/h', 'm/s', 36, 10],
    ['speed', 'mph', 'km/h', 60, 96.56064],
    ['speed', 'knot', 'm/s', 1, 0.514444],
    ['area', 'km²', 'm²', 1, 1e6],
    ['area', 'acre', 'ft²', 1, 43560],
    ['area', 'm²', 'cm²', 1, 10000],
    ['area', 'mi²', 'km²', 1, 2.59],
    ['pressure', 'atm', 'kPa', 1, 101.325],
    ['pressure', 'bar', 'Pa', 1, 100000],
    ['pressure', 'psi', 'kPa', 1, 6.89476],
  ])('%s: %d %s to %s', (category, fromUnit, toUnit, value, expected) => {
    const r = calculateConversion({ category, fromUnit, toUnit, value })
    expect(r.result / expected).toBeCloseTo(1, 4)
  })

  it.each(Object.entries(UNITS_BY_CATEGORY))('%s: every unit pair round-trips', (category, units) => {
    for (const fromUnit of units) {
      for (const toUnit of units) {
        const forward = calculateConversion({ category: category as UnitCategory, fromUnit, toUnit, value: 7.5 })
        const back = calculateConversion({ category: category as UnitCategory, fromUnit: toUnit, toUnit: fromUnit, value: forward.result })
        expect(back.result).toBeCloseTo(7.5, 9)
      }
    }
  })

  it('converts zero to zero', () => {
    expect(calculateConversion({ category: 'pressure', fromUnit: 'psi', toUnit: 'bar', value: 0 }).result).toBe(0)
  })

  it('converts negative values linearly', () => {
    const r = calculateConversion({ category: 'length', fromUnit: 'km', toUnit: 'm', value: -2 })
    expect(r.result).toBeCloseTo(-2000, 6)
  })

  it('formula states the per-unit ratio rounded to 6 significant digits', () => {
    expect(calculateConversion({ category: 'length', fromUnit: 'mi', toUnit: 'km', value: 3 }).formula).toBe('1 mi = 1.60934 km')
    expect(calculateConversion({ category: 'speed', fromUnit: 'm/s', toUnit: 'km/h', value: 1 }).formula).toBe('1 m/s = 3.6 km/h')
  })

  it('an unknown unit yields NaN rather than throwing', () => {
    const r = calculateConversion({ category: 'length', fromUnit: 'parsec', toUnit: 'm', value: 1 })
    expect(r.result).toBeNaN()
  })
})

describe('calculateConversion: temperature', () => {
  it.each<[string, string, number, number]>([
    ['C', 'F', 0, 32],
    ['C', 'K', 0, 273.15],
    ['F', 'C', 32, 0],
    ['F', 'K', 212, 373.15],
    ['K', 'C', 0, -273.15],
    ['K', 'F', 0, -459.67],
    ['C', 'C', 37, 37],
    ['F', 'F', 98.6, 98.6],
    ['K', 'K', 300, 300],
    ['C', 'F', -40, -40],
  ])('%s to %s: %d gives %d', (fromUnit, toUnit, value, expected) => {
    const r = calculateConversion({ category: 'temperature', fromUnit, toUnit, value })
    expect(r.result).toBeCloseTo(expected, 9)
  })

  it('every temperature pair round-trips', () => {
    const units = ['C', 'F', 'K']
    for (const fromUnit of units) {
      for (const toUnit of units) {
        const forward = calculateConversion({ category: 'temperature', fromUnit, toUnit, value: 21.5 })
        const back = calculateConversion({ category: 'temperature', fromUnit: toUnit, toUnit: fromUnit, value: forward.result })
        expect(back.result).toBeCloseTo(21.5, 9)
      }
    }
  })

  it('formats degree signs for C and F and a spaced K', () => {
    expect(calculateConversion({ category: 'temperature', fromUnit: 'C', toUnit: 'F', value: 0 }).formula).toBe('0°C = 32°F')
    expect(calculateConversion({ category: 'temperature', fromUnit: 'K', toUnit: 'C', value: 0 }).formula).toBe('0 K = -273.15°C')
    expect(calculateConversion({ category: 'temperature', fromUnit: 'F', toUnit: 'K', value: 212 }).formula).toBe('212°F = 373.15 K')
  })

  it('rounds the formula result to 6 significant digits', () => {
    expect(calculateConversion({ category: 'temperature', fromUnit: 'F', toUnit: 'C', value: 100 }).formula).toBe('100°F = 37.7778°C')
  })
})
