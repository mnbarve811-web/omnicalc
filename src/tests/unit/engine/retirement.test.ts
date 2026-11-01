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

describe('calculateRetirement new inputs', () => {
  it('neutral values for every new input reproduce the original result', () => {
    const neutral = calculateRetirement({
      ...BASE,
      annualSalary: 0,
      employeeContributionPct: 0,
      employerMatchPct: 0,
      employerMatchCapPct: 0,
      salaryIncreasePct: 0,
      inflationRate: 0,
      postRetirementReturn: BASE.expectedReturn,
      socialSecurityMonthly: 0,
      socialSecurityStartAge: 67,
    })
    expect(neutral).toEqual(calculateRetirement(BASE))
  })

  it('employer match is capped at a share of salary and added to other savings', () => {
    const r = calculateRetirement({
      currentAge: 64, retirementAge: 65, currentSavings: 0, annualSavings: 1000, expectedReturn: 0, annualExpenses: 0,
      annualSalary: 100000, employeeContributionPct: 10, employerMatchPct: 50, employerMatchCapPct: 6,
    })
    // 10,000 employee + 50% of the first 6% of salary (3,000) + 1,000 other
    expect(r.balanceAtRetirement).toBeCloseTo(14000, 6)
  })

  it('employer match follows the employee contribution when it is below the cap', () => {
    const r = calculateRetirement({
      currentAge: 64, retirementAge: 65, currentSavings: 0, annualSavings: 1000, expectedReturn: 0, annualExpenses: 0,
      annualSalary: 100000, employeeContributionPct: 4, employerMatchPct: 50, employerMatchCapPct: 6,
    })
    expect(r.balanceAtRetirement).toBeCloseTo(7000, 6)
  })

  it('salary contributions grow with the annual salary increase', () => {
    const inputs = {
      currentAge: 63, retirementAge: 65, currentSavings: 0, annualSavings: 0, expectedReturn: 0, annualExpenses: 0,
      annualSalary: 100000, employeeContributionPct: 10, salaryIncreasePct: 3,
    }
    expect(calculateRetirement(inputs).balanceAtRetirement).toBeCloseTo(10000 + 10300, 6)
    expect(calculateRetirement({ ...inputs, expectedReturn: 10 }).balanceAtRetirement).toBeCloseTo(10000 * 1.1 + 10300, 6)
  })

  it('reports the balance at retirement in today\'s dollars', () => {
    const r = calculateRetirement({
      currentAge: 64, retirementAge: 65, currentSavings: 100000, annualSavings: 0, expectedReturn: 5, annualExpenses: 0, inflationRate: 2,
    })
    expect(r.balanceAtRetirement).toBeCloseTo(105000, 6)
    expect(r.balanceAtRetirementToday).toBeCloseTo(105000 / 1.02, 6)
  })

  it('today\'s-dollar balance equals the nominal balance without inflation', () => {
    const r = calculateRetirement(BASE)
    expect(r.balanceAtRetirementToday).toBe(r.balanceAtRetirement)
  })

  it('inflates spending to the retirement year and keeps inflating it during drawdown', () => {
    const r = calculateRetirement({
      currentAge: 63, retirementAge: 65, currentSavings: 100000, annualSavings: 0, expectedReturn: 0, annualExpenses: 25000, inflationRate: 10,
    })
    // Withdrawals: 25,000 x 1.1^2 = 30,250, then 33,275, then 36,602.50
    expect(r.firstYearWithdrawal).toBeCloseTo(30250, 6)
    const balances = r.drawdownPhase.map(p => p.balance)
    expect(balances).toHaveLength(4)
    expect(balances[0]).toBe(100000)
    expect(balances[1]).toBeCloseTo(69750, 6)
    expect(balances[2]).toBeCloseTo(36475, 6)
    expect(balances[3]).toBe(0)
    expect(r.projectedRunout).toBe(68)
    expect(r.yearsOfFunding).toBe(3)
  })

  it('uses the pre-retirement return before retiring and the post-retirement return after', () => {
    const inputs = { currentAge: 64, retirementAge: 65, currentSavings: 100000, annualSavings: 0, expectedReturn: 50, annualExpenses: 75000 }
    const r = calculateRetirement({ ...inputs, postRetirementReturn: 0 })
    expect(r.balanceAtRetirement).toBe(150000)
    expect(r.drawdownPhase.map(p => p.balance)).toEqual([150000, 75000, 0])
    expect(r.projectedRunout).toBe(67)
    // Without a post-retirement return the pre-retirement 50% keeps applying, and 50% of 150,000 covers spending
    expect(calculateRetirement(inputs).projectedRunout).toBeNull()
  })

  it('Social Security reduces withdrawals only from its start age', () => {
    const r = calculateRetirement({
      currentAge: 65, retirementAge: 65, currentSavings: 100000, annualSavings: 0, expectedReturn: 0, annualExpenses: 30000,
      socialSecurityMonthly: 1000, socialSecurityStartAge: 67,
    })
    // 30,000 at 65 and 66, then 18,000 a year once 12,000 of benefits start
    expect(r.drawdownPhase.map(p => p.balance)).toEqual([100000, 70000, 40000, 22000, 4000, 0])
    expect(r.projectedRunout).toBe(70)
    expect(r.firstYearWithdrawal).toBe(30000)
  })

  it('Social Security grows with inflation alongside spending', () => {
    const r = calculateRetirement({
      currentAge: 64, retirementAge: 65, currentSavings: 100000, annualSavings: 0, expectedReturn: 0, annualExpenses: 30000,
      inflationRate: 10, socialSecurityMonthly: 1000, socialSecurityStartAge: 65,
    })
    // Shortfall of 18,000 in today's dollars, inflated: 19,800, 21,780, 23,958, 26,353.80
    expect(r.firstYearWithdrawal).toBeCloseTo(19800, 6)
    expect(r.drawdownPhase.map(p => p.balance)).toEqual([100000, 80200, 58420, 34462, 8108.2, 0].map(v => expect.closeTo(v, 6)))
    expect(r.projectedRunout).toBe(70)
  })

  it('savings never run out when Social Security covers all spending', () => {
    const r = calculateRetirement({
      currentAge: 65, retirementAge: 65, currentSavings: 0, annualSavings: 0, expectedReturn: 0, annualExpenses: 12000,
      socialSecurityMonthly: 1500, socialSecurityStartAge: 65,
    })
    expect(r.firstYearWithdrawal).toBe(0)
    expect(r.projectedRunout).toBeNull()
    expect(r.yearsOfFunding).toBe(50)
    expect(r.drawdownPhase.every(p => p.balance === 0)).toBe(true)
  })

  it('savings that fall short before Social Security starts still count as running out', () => {
    const r = calculateRetirement({
      currentAge: 65, retirementAge: 65, currentSavings: 20000, annualSavings: 0, expectedReturn: 0, annualExpenses: 30000,
      socialSecurityMonthly: 2500, socialSecurityStartAge: 66,
    })
    expect(r.drawdownPhase.map(p => p.balance)).toEqual([20000, 0])
    expect(r.projectedRunout).toBe(66)
  })
})
