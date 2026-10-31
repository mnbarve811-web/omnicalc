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
})
