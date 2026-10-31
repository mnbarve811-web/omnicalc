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
  it('matches the guide worked example for the default inputs', () => {
    const r = calculateTDEE({ gender: 'male', weightKg: 75, heightCm: 170, ageYears: 30, activityLevel: 'moderate' })
    expect(r.bmr).toBeCloseTo(1667.5, 5)
    expect(r.tdee).toBeCloseTo(2584.625, 5)
  })
  it.each([
    ['sedentary', 1.2],
    ['light', 1.375],
    ['moderate', 1.55],
    ['heavy', 1.725],
    ['athlete', 1.9],
  ] as const)('%s multiplier is %s', (activityLevel, multiplier) => {
    const r = calculateTDEE({ ...BASE, activityLevel })
    expect(r.tdee).toBeCloseTo(r.bmr * multiplier, 8)
  })
  it('female BMR is 166 lower than male for the same inputs', () => {
    const male = calculateTDEE(BASE)
    const female = calculateTDEE({ ...BASE, gender: 'female' })
    expect(male.bmr - female.bmr).toBeCloseTo(166, 8)
  })
  it('female cut and bulk derive from female TDEE', () => {
    const r = calculateTDEE({ ...BASE, gender: 'female', activityLevel: 'light' })
    expect(r.tdee).toBeCloseTo((10*80 + 6.25*175 - 5*30 - 161) * 1.375, 8)
    expect(r.cut).toBeCloseTo(r.tdee * 0.8, 8)
    expect(r.bulk).toBeCloseTo(r.tdee * 1.15, 8)
  })
  it('negative inputs are clamped to 1 like zero inputs', () => {
    const negative = calculateTDEE({ ...BASE, weightKg: -50, heightCm: -10, ageYears: -5 })
    const zero = calculateTDEE({ ...BASE, weightKg: 0, heightCm: 0, ageYears: 0 })
    expect(negative.bmr).toBe(zero.bmr)
  })
  it('older age lowers BMR by 5 per year', () => {
    const young = calculateTDEE({ ...BASE, ageYears: 30 })
    const old = calculateTDEE({ ...BASE, ageYears: 50 })
    expect(young.bmr - old.bmr).toBeCloseTo(100, 8)
  })
})
