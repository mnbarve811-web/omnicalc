import { describe, it, expect } from 'vitest'
import { calculateRetirement } from '@/lib/engine'

const BASE = {
  currentAge: 30,
  retirementAge: 65,
  currentSavings: 50000,
  annualSavings: 15000,
  expectedReturn: 7,
  annualExpenses: 60000,
}

describe('calculateRetirement', () => {
  it('balanceAtRetirement is positive for reasonable inputs', () => {
    const r = calculateRetirement(BASE)
    expect(r.balanceAtRetirement).toBeGreaterThan(0)
  })

  it('growthPhase has one data point per year from currentAge to retirementAge', () => {
    const r = calculateRetirement(BASE)
    expect(r.growthPhase).toHaveLength(BASE.retirementAge - BASE.currentAge + 1)
  })

  it('first growthPhase point balance equals currentSavings', () => {
    const r = calculateRetirement(BASE)
    expect(r.growthPhase[0].balance).toBe(BASE.currentSavings)
  })

  it('last growthPhase point balance equals balanceAtRetirement', () => {
    const r = calculateRetirement(BASE)
    const last = r.growthPhase[r.growthPhase.length - 1]
    expect(last.balance).toBeCloseTo(r.balanceAtRetirement, 0)
  })

  it('drawdownPhase has at least one point', () => {
    const r = calculateRetirement(BASE)
    expect(r.drawdownPhase.length).toBeGreaterThan(0)
  })

  it('no savings eventually runs out (projectedRunout is a number)', () => {
    const r = calculateRetirement({ ...BASE, currentSavings: 10000, annualSavings: 0, expectedReturn: 0, annualExpenses: 60000 })
    expect(typeof r.projectedRunout).toBe('number')
  })

  it('very large savings never runs out (projectedRunout is null)', () => {
    const r = calculateRetirement({ ...BASE, currentSavings: 10000000, annualSavings: 50000, annualExpenses: 10000 })
    expect(r.projectedRunout).toBeNull()
  })
})
