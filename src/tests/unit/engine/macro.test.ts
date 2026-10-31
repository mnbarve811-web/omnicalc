import { describe, it, expect } from 'vitest'
import { calculateMacro } from '@/lib/engine'

describe('calculateMacro', () => {
  it('cut calories = tdee * 0.8', () => {
    const r = calculateMacro({ tdee: 2000, goal: 'cut', split: 'balanced' })
    expect(r.calories).toBeCloseTo(1600, 0)
  })
  it('maintain calories = tdee', () => {
    const r = calculateMacro({ tdee: 2000, goal: 'maintain', split: 'balanced' })
    expect(r.calories).toBeCloseTo(2000, 0)
  })
  it('bulk calories = tdee * 1.15', () => {
    const r = calculateMacro({ tdee: 2000, goal: 'bulk', split: 'balanced' })
    expect(r.calories).toBeCloseTo(2300, 0)
  })
  it('balanced split: protein=30%, carbs=40%, fat=30%', () => {
    const r = calculateMacro({ tdee: 2000, goal: 'maintain', split: 'balanced' })
    expect(r.proteinG).toBeCloseTo(2000 * 0.30 / 4, 0)
    expect(r.carbsG).toBeCloseTo(2000 * 0.40 / 4, 0)
    expect(r.fatG).toBeCloseTo(2000 * 0.30 / 9, 0)
  })
  it('lowCarb split: protein=35%, carbs=25%', () => {
    const r = calculateMacro({ tdee: 2000, goal: 'maintain', split: 'lowCarb' })
    expect(r.proteinG).toBeCloseTo(2000 * 0.35 / 4, 0)
    expect(r.carbsG).toBeCloseTo(2000 * 0.25 / 4, 0)
  })
  it('zero tdee returns zero macros without NaN', () => {
    const r = calculateMacro({ tdee: 0, goal: 'maintain', split: 'balanced' })
    expect(r.proteinG).toBe(0)
    expect(r.carbsG).toBe(0)
    expect(r.fatG).toBe(0)
  })
  it('highProtein split: protein=40%, carbs=35%, fat=25%', () => {
    const r = calculateMacro({ tdee: 2000, goal: 'maintain', split: 'highProtein' })
    expect(r.proteinG).toBeCloseTo(2000 * 0.40 / 4, 8)
    expect(r.carbsG).toBeCloseTo(2000 * 0.35 / 4, 8)
    expect(r.fatG).toBeCloseTo(2000 * 0.25 / 9, 8)
  })
  it('lowCarb split: fat=40%', () => {
    const r = calculateMacro({ tdee: 2000, goal: 'maintain', split: 'lowCarb' })
    expect(r.fatG).toBeCloseTo(2000 * 0.40 / 9, 8)
  })
  it.each(['cut', 'maintain', 'bulk'] as const)('%s: macro calories add up to the calorie target for every split', goal => {
    for (const split of ['balanced', 'lowCarb', 'highProtein'] as const) {
      const r = calculateMacro({ tdee: 2500, goal, split })
      expect(r.proteinG * 4 + r.carbsG * 4 + r.fatG * 9).toBeCloseTo(r.calories, 8)
    }
  })
  it('goal adjusts grams, not just calories', () => {
    const cut = calculateMacro({ tdee: 2000, goal: 'cut', split: 'balanced' })
    expect(cut.proteinG).toBeCloseTo(1600 * 0.30 / 4, 8)
  })
  it('negative tdee returns all zeros', () => {
    expect(calculateMacro({ tdee: -500, goal: 'bulk', split: 'highProtein' }))
      .toEqual({ calories: 0, proteinG: 0, carbsG: 0, fatG: 0 })
  })
})
