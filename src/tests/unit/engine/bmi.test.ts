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
  it('picks the category from the BMI as displayed to one decimal', () => {
    expect(calculateBMI({ weightKg: 24.96, heightCm: 100 }).category).toBe('Overweight')
    expect(calculateBMI({ weightKg: 18.46, heightCm: 100 }).category).toBe('Normal weight')
  })
  it('BMI exactly 18.5 is Normal weight', () => {
    expect(calculateBMI({ weightKg: 18.5, heightCm: 100 })).toEqual({ value: 18.5, category: 'Normal weight' })
  })
  it('BMI displayed as 18.4 is Underweight', () => {
    expect(calculateBMI({ weightKg: 18.44, heightCm: 100 }).category).toBe('Underweight')
  })
  it('BMI exactly 25 is Overweight', () => {
    expect(calculateBMI({ weightKg: 25, heightCm: 100 })).toEqual({ value: 25, category: 'Overweight' })
  })
  it('BMI displayed as 24.9 is Normal weight', () => {
    expect(calculateBMI({ weightKg: 24.94, heightCm: 100 }).category).toBe('Normal weight')
  })
  it('BMI exactly 30 is Obese', () => {
    expect(calculateBMI({ weightKg: 30, heightCm: 100 })).toEqual({ value: 30, category: 'Obese' })
  })
  it('BMI displayed as 29.9 is Overweight', () => {
    expect(calculateBMI({ weightKg: 29.94, heightCm: 100 }).category).toBe('Overweight')
  })
  it('zero weight is BMI 0 and Underweight', () => {
    expect(calculateBMI({ weightKg: 0, heightCm: 170 })).toEqual({ value: 0, category: 'Underweight' })
  })
  it('zero and negative height are both clamped to 1 cm', () => {
    expect(calculateBMI({ weightKg: 70, heightCm: 0 }).value).toBeCloseTo(700000, 5)
    expect(calculateBMI({ weightKg: 70, heightCm: -20 }).value).toBeCloseTo(700000, 5)
  })
})
