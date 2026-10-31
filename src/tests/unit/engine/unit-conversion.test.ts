import { describe, it, expect } from 'vitest'
import { calculateConversion } from '@/lib/engine'

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
})
