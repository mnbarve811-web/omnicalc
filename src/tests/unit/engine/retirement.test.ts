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

describe('calculateRetirement edge cases', () => {
  it('one year of growth applies the return then adds the annual savings', () => {
    const r = calculateRetirement({ ...BASE, currentAge: 64, retirementAge: 65 })
    expect(r.balanceAtRetirement).toBeCloseTo(50000 * 1.07 + 15000, 6)
  })

  it('zero return accumulates savings with no growth', () => {
    const r = calculateRetirement({ ...BASE, expectedReturn: 0 })
    expect(r.balanceAtRetirement).toBe(50000 + 15000 * 35)
  })

  it('retiring at the current age keeps the current savings', () => {
    const r = calculateRetirement({ ...BASE, retirementAge: 30 })
    expect(r.growthPhase).toEqual([{ age: 30, balance: 50000 }])
    expect(r.balanceAtRetirement).toBe(50000)
  })

  it('funds run out at the exact age when spending exhausts the balance', () => {
    const r = calculateRetirement({ currentAge: 65, retirementAge: 65, currentSavings: 100000, annualSavings: 0, expectedReturn: 0, annualExpenses: 25000 })
    expect(r.projectedRunout).toBe(69)
    expect(r.yearsOfFunding).toBe(4)
    expect(r.drawdownPhase.map(p => p.balance)).toEqual([100000, 75000, 50000, 25000, 0])
  })

  it('zero savings at retirement runs out immediately', () => {
    const r = calculateRetirement({ currentAge: 65, retirementAge: 65, currentSavings: 0, annualSavings: 0, expectedReturn: 5, annualExpenses: 1000 })
    expect(r.projectedRunout).toBe(65)
    expect(r.yearsOfFunding).toBe(0)
  })

  it('funds that never run out report the 50-year cap', () => {
    const r = calculateRetirement({ ...BASE, annualExpenses: 0 })
    expect(r.projectedRunout).toBeNull()
    expect(r.yearsOfFunding).toBe(50)
    expect(r.drawdownPhase).toHaveLength(51)
    expect(r.drawdownPhase[50].age).toBe(115)
  })

  it('drawdown balances are never negative', () => {
    const r = calculateRetirement({ ...BASE, annualExpenses: 500000 })
    expect(r.drawdownPhase.every(p => p.balance >= 0)).toBe(true)
    expect(r.drawdownPhase[r.drawdownPhase.length - 1].balance).toBe(0)
  })

  it('a higher return grows a larger balance that lasts at least as long', () => {
    const low = calculateRetirement({ ...BASE, expectedReturn: 3 })
    const high = calculateRetirement({ ...BASE, expectedReturn: 7 })
    expect(high.balanceAtRetirement).toBeGreaterThan(low.balanceAtRetirement)
    expect(high.yearsOfFunding).toBeGreaterThanOrEqual(low.yearsOfFunding)
  })
})
