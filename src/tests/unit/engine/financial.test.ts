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
    // $240k at 6.5% for 30 years = ~$1,517/mo
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
