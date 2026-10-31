import { describe, it, expect } from 'vitest'
import { calculateSalary } from '@/lib/engine'

const BASE = {
  grossPay: 5000,
  payFrequency: 'monthly' as const,
  federalTaxRate: 22,
  stateTaxRate: 5,
  otherDeductions: 200,
}

describe('calculateSalary', () => {
  it('netPay is less than grossPay', () => {
    const r = calculateSalary(BASE)
    expect(r.netPay).toBeLessThan(r.grossPay)
  })

  it('all deductions sum to grossPay - netPay', () => {
    const r = calculateSalary(BASE)
    const totalDeductions = r.federalTax + r.socialSecurity + r.medicare + r.stateTax + r.otherDeductions
    expect(r.grossPay - totalDeductions).toBeCloseTo(r.netPay, 2)
  })

  it('socialSecurity = 6.2% of grossPay', () => {
    const r = calculateSalary(BASE)
    expect(r.socialSecurity).toBeCloseTo(BASE.grossPay * 0.062, 2)
  })

  it('medicare = 1.45% of grossPay', () => {
    const r = calculateSalary(BASE)
    expect(r.medicare).toBeCloseTo(BASE.grossPay * 0.0145, 2)
  })

  it('annualGross multiplies correctly for biweekly', () => {
    const r = calculateSalary({ ...BASE, payFrequency: 'biweekly' })
    expect(r.annualGross).toBeCloseTo(BASE.grossPay * 26, 0)
  })

  it('annualGross multiplies correctly for monthly', () => {
    const r = calculateSalary(BASE)
    expect(r.annualGross).toBeCloseTo(BASE.grossPay * 12, 0)
  })

  it('zero taxes results in netPay = grossPay minus FICA minus other', () => {
    const r = calculateSalary({ ...BASE, federalTaxRate: 0, stateTaxRate: 0, otherDeductions: 0 })
    const fica = BASE.grossPay * 0.062 + BASE.grossPay * 0.0145
    expect(r.netPay).toBeCloseTo(BASE.grossPay - fica, 2)
  })
})

describe('calculateSalary edge cases', () => {
  it('annualises weekly pay over 52 periods', () => {
    const r = calculateSalary({ ...BASE, payFrequency: 'weekly' })
    expect(r.annualGross).toBe(5000 * 52)
    expect(r.annualNet).toBeCloseTo(r.netPay * 52, 6)
  })

  it('annualises semi-monthly pay over 24 periods', () => {
    const r = calculateSalary({ ...BASE, payFrequency: 'semimonthly' })
    expect(r.annualGross).toBe(5000 * 24)
    expect(r.annualNet).toBeCloseTo(r.netPay * 24, 6)
  })

  it('computes exact per-period amounts for the default example', () => {
    const r = calculateSalary(BASE)
    expect(r.federalTax).toBeCloseTo(1100, 6)
    expect(r.stateTax).toBeCloseTo(250, 6)
    expect(r.socialSecurity).toBeCloseTo(310, 6)
    expect(r.medicare).toBeCloseTo(72.5, 6)
    expect(r.netPay).toBeCloseTo(3067.5, 6)
  })

  it('zero gross pay leaves only the flat deductions', () => {
    const r = calculateSalary({ ...BASE, grossPay: 0 })
    expect(r.federalTax).toBe(0)
    expect(r.socialSecurity).toBe(0)
    expect(r.netPay).toBe(-200)
  })

  it('does not round intermediate amounts', () => {
    const r = calculateSalary({ ...BASE, grossPay: 1234.56 })
    expect(r.socialSecurity).toBeCloseTo(76.54272, 8)
    expect(r.medicare).toBeCloseTo(17.90112, 8)
  })

})
