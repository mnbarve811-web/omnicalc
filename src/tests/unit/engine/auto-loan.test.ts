import { describe, it, expect } from 'vitest'
import { calculateAutoLoan } from '@/lib/engine'

const BASE = {
  vehiclePrice: 30000,
  downPayment: 5000,
  tradeInValue: 2000,
  interestRate: 6.0,
  loanTermMonths: 60,
  salesTaxRate: 8,
}

describe('calculateAutoLoan', () => {
  it('calculates positive monthly payment', () => {
    const r = calculateAutoLoan(BASE)
    expect(r.monthlyPayment).toBeGreaterThan(0)
  })

  it('amortization schedule has correct length', () => {
    const r = calculateAutoLoan(BASE)
    expect(r.amortizationSchedule).toHaveLength(BASE.loanTermMonths)
  })

  it('final balance is close to zero', () => {
    const r = calculateAutoLoan(BASE)
    expect(r.amortizationSchedule[BASE.loanTermMonths - 1].balance).toBeCloseTo(0, 0)
  })

  it('loanBalance = vehiclePrice * (1 + taxRate) - downPayment - tradeIn', () => {
    const r = calculateAutoLoan(BASE)
    const expected = BASE.vehiclePrice * (1 + BASE.salesTaxRate / 100) - BASE.downPayment - BASE.tradeInValue
    expect(r.loanBalance).toBeCloseTo(expected, 0)
  })

  it('totalInterestPaid is positive', () => {
    const r = calculateAutoLoan(BASE)
    expect(r.totalInterestPaid).toBeGreaterThan(0)
  })

  it('zero interest rate: monthly payment = loanBalance / term', () => {
    const r = calculateAutoLoan({ ...BASE, interestRate: 0 })
    const loanBalance = BASE.vehiclePrice * (1 + BASE.salesTaxRate / 100) - BASE.downPayment - BASE.tradeInValue
    expect(r.monthlyPayment).toBeCloseTo(loanBalance / BASE.loanTermMonths, 2)
  })
})
