import { describe, it, expect } from 'vitest'
import { calculateTDEE } from '@/lib/engine'

const BASE = { gender: 'male' as const, weightKg: 80, heightCm: 175, ageYears: 30, activityLevel: 'moderate' as const }

describe('calculateTDEE', () => {
  it('male BMR uses +5 offset', () => {
    const r = calculateTDEE(BASE)
    expect(r.bmr).toBeCloseTo(10*80 + 6.25*175 - 5*30 + 5, 0)
  })
  it('female BMR uses -161 offset', () => {
    const r = calculateTDEE({ ...BASE, gender: 'female' })
    expect(r.bmr).toBeCloseTo(10*80 + 6.25*175 - 5*30 - 161, 0)
  })
  it('moderate multiplier is 1.55', () => {
    const r = calculateTDEE(BASE)
    expect(r.tdee).toBeCloseTo(r.bmr * 1.55, 0)
  })
  it('cut = tdee * 0.8', () => {
    const r = calculateTDEE(BASE)
    expect(r.cut).toBeCloseTo(r.tdee * 0.8, 0)
  })
  it('bulk = tdee * 1.15', () => {
    const r = calculateTDEE(BASE)
    expect(r.bulk).toBeCloseTo(r.tdee * 1.15, 0)
  })
  it('maintain equals tdee', () => {
    const r = calculateTDEE(BASE)
    expect(r.maintain).toBeCloseTo(r.tdee, 0)
  })
  it('sedentary multiplier is 1.2', () => {
    const r = calculateTDEE({ ...BASE, activityLevel: 'sedentary' })
    expect(r.tdee).toBeCloseTo(r.bmr * 1.2, 0)
  })
  it('zero weight, height, and age do not produce NaN', () => {
    const r = calculateTDEE({ ...BASE, weightKg: 0, heightCm: 0, ageYears: 0 })
    expect(Number.isFinite(r.bmr)).toBe(true)
    expect(Number.isFinite(r.tdee)).toBe(true)
    expect(r.bmr).toBeCloseTo(10*1 + 6.25*1 - 5*1 + 5, 5)
  })
})
