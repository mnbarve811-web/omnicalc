import { describe, it, expect } from 'vitest'
import { calculateMortgage } from '@/lib/engine'

const BASE = {
  homePrice: 300000,
  downPayment: 60000,
  loanTermYears: 30,
  interestRate: 6.5,
  propertyTax: 0,
  homeInsurance: 0,
  hoa: 0,
}

describe('calculateMortgage', () => {
  it('calculates monthly P&I for standard 30-year mortgage', () => {
    const r = calculateMortgage(BASE)
    expect(r.monthlyPrincipalAndInterest).toBeCloseTo(1517, 0)
    expect(r.totalPaymentCount).toBe(360)
  })

  it('generates amortization schedule with correct length and terminal balance', () => {
    const r = calculateMortgage(BASE)
    expect(r.amortizationSchedule).toHaveLength(360)
    expect(r.amortizationSchedule[359].balance).toBeCloseTo(0, 0)
  })

  it('first month interest = principal * monthly rate', () => {
    const r = calculateMortgage(BASE)
    const expectedInterest = 240000 * (6.5 / 100 / 12)
    expect(r.amortizationSchedule[0].interest).toBeCloseTo(expectedInterest, 2)
  })

  it('monthlyTotal adds taxes, insurance, HOA', () => {
    const r = calculateMortgage({ ...BASE, propertyTax: 300, homeInsurance: 120, hoa: 50 })
    expect(r.monthlyTotal).toBeCloseTo(r.monthlyPrincipalAndInterest + 470, 0)
  })

  it('handles zero interest rate', () => {
    const r = calculateMortgage({ ...BASE, interestRate: 0 })
    expect(r.monthlyPrincipalAndInterest).toBeCloseTo(240000 / 360, 2)
  })

  it('15-year mortgage has higher payment but less total interest', () => {
    const r30 = calculateMortgage(BASE)
    const r15 = calculateMortgage({ ...BASE, loanTermYears: 15 })
    expect(r15.monthlyPrincipalAndInterest).toBeGreaterThan(r30.monthlyPrincipalAndInterest)
    expect(r15.totalInterestPaid).toBeLessThan(r30.totalInterestPaid)
  })
})

import { calculateCompoundInterest } from '@/lib/engine'

describe('calculateCompoundInterest', () => {
  it('$10k at 7% annually for 10 years, no contributions', () => {
    const r = calculateCompoundInterest({ initialInvestment: 10000, monthlyContribution: 0, annualInterestRate: 7, compoundFrequency: 1, years: 10 })
    // FV = 10000 * (1.07)^10 ≈ 19672
    expect(r.futureValue).toBeCloseTo(19672, -1)
    expect(r.totalInterestEarned).toBeCloseTo(9672, -1)
  })

  it('generates yearly breakdown with correct length', () => {
    const r = calculateCompoundInterest({ initialInvestment: 1000, monthlyContribution: 100, annualInterestRate: 6, compoundFrequency: 12, years: 5 })
    expect(r.yearlyBreakdown).toHaveLength(5)
    expect(r.yearlyBreakdown[4].year).toBe(5)
  })

  it('zero interest rate returns principal + contributions only', () => {
    const r = calculateCompoundInterest({ initialInvestment: 1000, monthlyContribution: 100, annualInterestRate: 0, compoundFrequency: 12, years: 10 })
    expect(r.totalInterestEarned).toBeCloseTo(0, 0)
    expect(r.futureValue).toBeCloseTo(13000, 0) // 1000 + 100*12*10
  })
})
