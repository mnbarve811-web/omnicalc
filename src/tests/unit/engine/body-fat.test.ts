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
  it('male result matches the US Navy formula', () => {
    const expected = 495 / (1.0324 - 0.19077 * Math.log10(85 - 38) + 0.15456 * Math.log10(177)) - 450
    expect(calculateBodyFat(MALE).bodyFatPercentage).toBe(Math.round(expected * 10) / 10)
  })
  it('female result matches the US Navy formula', () => {
    const expected = 495 / (1.29579 - 0.35004 * Math.log10(70 + 95 - 32) + 0.22100 * Math.log10(165)) - 450
    expect(calculateBodyFat(FEMALE).bodyFatPercentage).toBe(Math.round(expected * 10) / 10)
  })
  it('male ignores the hip measurement', () => {
    expect(calculateBodyFat({ ...MALE, hipCm: 0 })).toEqual(calculateBodyFat({ ...MALE, hipCm: 120 }))
  })
  it.each([
    [72, 'Essential'],
    [80, 'Athletes'],
    [85, 'Fitness'],
    [90, 'Acceptable'],
    [100, 'Obese'],
  ])('male waist %d cm is %s', (waistCm, category) => {
    expect(calculateBodyFat({ ...MALE, waistCm }).category).toBe(category)
  })
  it.each([
    [55, 'Essential'],
    [62, 'Athletes'],
    [70, 'Fitness'],
    [80, 'Acceptable'],
    [90, 'Obese'],
  ])('female waist %d cm (hip 90) is %s', (waistCm, category) => {
    expect(calculateBodyFat({ ...FEMALE, hipCm: 90, waistCm }).category).toBe(category)
  })
  it('same tape measurements give a different result for female than male', () => {
    const tape = { heightCm: 170, neckCm: 35, waistCm: 80, hipCm: 95 }
    expect(calculateBodyFat({ ...tape, gender: 'female' }).bodyFatPercentage)
      .not.toBe(calculateBodyFat({ ...tape, gender: 'male' }).bodyFatPercentage)
  })
  it('negative formula result is floored to 0 and categorised Essential', () => {
    const r = calculateBodyFat({ ...MALE, waistCm: 60 })
    expect(r.bodyFatPercentage).toBe(0)
    expect(r.category).toBe('Essential')
  })
  // Bug: category uses the unrounded value, so 5.95% displays as 6.0% but is labelled Essential (< 6%)
  it.todo('male waist 72.85 cm rounds to 6.0% and should be categorised Athletes')
})
