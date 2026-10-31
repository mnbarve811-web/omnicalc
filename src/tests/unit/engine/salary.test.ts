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
