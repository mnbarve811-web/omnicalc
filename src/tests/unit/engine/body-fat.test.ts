import { describe, it, expect } from 'vitest'
import { calculateBodyFat } from '@/lib/engine'

const MALE = { gender: 'male' as const, heightCm: 177, neckCm: 38, waistCm: 85, hipCm: 0 }
const FEMALE = { gender: 'female' as const, heightCm: 165, neckCm: 32, waistCm: 70, hipCm: 95 }

describe('calculateBodyFat', () => {
  it('male body fat percentage is between 1 and 60', () => {
    const r = calculateBodyFat(MALE)
    expect(r.bodyFatPercentage).toBeGreaterThan(1)
    expect(r.bodyFatPercentage).toBeLessThan(60)
  })
  it('female body fat percentage is between 1 and 60', () => {
    const r = calculateBodyFat(FEMALE)
    expect(r.bodyFatPercentage).toBeGreaterThan(1)
    expect(r.bodyFatPercentage).toBeLessThan(60)
  })
  it('male with larger waist has higher body fat', () => {
    const lean = calculateBodyFat({ ...MALE, waistCm: 75 })
    const heavy = calculateBodyFat({ ...MALE, waistCm: 100 })
    expect(heavy.bodyFatPercentage).toBeGreaterThan(lean.bodyFatPercentage)
  })
  it('returns a category string', () => {
    const r = calculateBodyFat(MALE)
    expect(typeof r.category).toBe('string')
    expect(r.category.length).toBeGreaterThan(0)
  })
  it('female uses hip measurement', () => {
    const small = calculateBodyFat({ ...FEMALE, hipCm: 80 })
    const large = calculateBodyFat({ ...FEMALE, hipCm: 110 })
    expect(large.bodyFatPercentage).toBeGreaterThan(small.bodyFatPercentage)
  })
  it('male with neck >= waist returns a finite non-negative percentage', () => {
    const r = calculateBodyFat({ ...MALE, neckCm: 90, waistCm: 85 })
    expect(Number.isFinite(r.bodyFatPercentage)).toBe(true)
    expect(r.bodyFatPercentage).toBeGreaterThanOrEqual(0)
  })
  it('female with neck >= waist + hip returns a finite non-negative percentage', () => {
    const r = calculateBodyFat({ ...FEMALE, neckCm: 200 })
    expect(Number.isFinite(r.bodyFatPercentage)).toBe(true)
    expect(r.bodyFatPercentage).toBeGreaterThanOrEqual(0)
  })
  it('fat and lean mass are 0 since body weight is not an input', () => {
    const r = calculateBodyFat(MALE)
    expect(r.fatMassKg).toBe(0)
    expect(r.leanMassKg).toBe(0)
  })
})
