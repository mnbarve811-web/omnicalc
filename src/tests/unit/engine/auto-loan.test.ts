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

describe('calculateAutoLoan edge cases', () => {
  it('matches the standard payment for $25,000 at 6% over 60 months', () => {
    const r = calculateAutoLoan({ vehiclePrice: 25000, downPayment: 0, tradeInValue: 0, interestRate: 6, loanTermMonths: 60, salesTaxRate: 0 })
    expect(r.monthlyPayment).toBeCloseTo(483.32, 2)
  })

  it('sales tax is charged on the full price before down payment and trade-in', () => {
    const r = calculateAutoLoan({ ...BASE, downPayment: 10000, tradeInValue: 5000 })
    expect(r.loanBalance).toBeCloseTo(30000 * 1.08 - 15000, 6)
  })

  it('a down payment and trade-in above the price are clamped to a zero loan', () => {
    const r = calculateAutoLoan({ ...BASE, downPayment: 30000, tradeInValue: 10000 })
    expect(r.loanBalance).toBe(0)
    expect(r.monthlyPayment).toBe(0)
    expect(r.totalInterestPaid).toBe(0)
  })

  it('total interest equals all payments minus the amount financed', () => {
    const r = calculateAutoLoan(BASE)
    expect(r.totalInterestPaid).toBeCloseTo(r.monthlyPayment * BASE.loanTermMonths - r.loanBalance, 2)
  })

  it('a one-month term repays the balance plus one month of interest', () => {
    const r = calculateAutoLoan({ vehiclePrice: 1000, downPayment: 0, tradeInValue: 0, interestRate: 12, loanTermMonths: 1, salesTaxRate: 0 })
    expect(r.monthlyPayment).toBeCloseTo(1010, 6)
    expect(r.totalInterestPaid).toBeCloseTo(10, 6)
  })

  it('zero interest rate charges no interest', () => {
    const r = calculateAutoLoan({ ...BASE, interestRate: 0 })
    expect(r.totalInterestPaid).toBe(0)
    expect(r.amortizationSchedule[BASE.loanTermMonths - 1].balance).toBeCloseTo(0, 6)
  })

  it('a longer term lowers the payment but raises total interest', () => {
    const short = calculateAutoLoan({ ...BASE, loanTermMonths: 36 })
    const long = calculateAutoLoan({ ...BASE, loanTermMonths: 84 })
    expect(long.monthlyPayment).toBeLessThan(short.monthlyPayment)
    expect(long.totalInterestPaid).toBeGreaterThan(short.totalInterestPaid)
  })

  it('a zero-month term returns a finite payment', () => {
    const r = calculateAutoLoan({ ...BASE, loanTermMonths: 0 })
    expect(Number.isFinite(r.monthlyPayment)).toBe(true)
  })
  it('a negative term is treated like a zero term', () => {
    const r = calculateAutoLoan({ ...BASE, loanTermMonths: -12 })
    expect(r.monthlyPayment).toBe(0)
    expect(r.amortizationSchedule).toEqual([])
  })
})
