import { describe, it, expect } from 'vitest'
import { calculateBMI } from '@/lib/engine'

describe('calculateBMI', () => {
  it('BMI = weight / (height/100)^2', () => {
    const r = calculateBMI({ weightKg: 70, heightCm: 175 })
    expect(r.value).toBeCloseTo(70 / (1.75 * 1.75), 1)
  })
  it('BMI < 18.5 is Underweight', () => {
    expect(calculateBMI({ weightKg: 50, heightCm: 175 }).category).toBe('Underweight')
  })
  it('BMI 18.5–24.9 is Normal weight', () => {
    expect(calculateBMI({ weightKg: 70, heightCm: 175 }).category).toBe('Normal weight')
  })
  it('BMI 25–29.9 is Overweight', () => {
    expect(calculateBMI({ weightKg: 85, heightCm: 175 }).category).toBe('Overweight')
  })
  it('BMI ≥ 30 is Obese', () => {
    expect(calculateBMI({ weightKg: 100, heightCm: 175 }).category).toBe('Obese')
  })
  it('zero height returns a finite value', () => {
    expect(Number.isFinite(calculateBMI({ weightKg: 70, heightCm: 0 }).value)).toBe(true)
  })
})
