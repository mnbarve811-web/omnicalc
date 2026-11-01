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

describe('calculateSalary hourly pay', () => {
  const HOURLY = { ...BASE, payType: 'hourly' as const, hourlyRate: 25, hoursPerWeek: 40, payFrequency: 'biweekly' as const, federalTaxRate: 12, stateTaxRate: 4, otherDeductions: 100 }

  it('annualises hourly rate x hours x 52 and ignores grossPay', () => {
    const r = calculateSalary(HOURLY)
    expect(r.annualGross).toBeCloseTo(52000, 6)
    expect(r.grossPay).toBeCloseTo(2000, 6)
    expect(r.monthlyGross).toBeCloseTo(52000 / 12, 6)
    expect(r.netPay).toBeCloseTo(1427, 6)
    expect(r.equivalentHourlyRate).toBe(25)
  })

  it('adds overtime at the multiplier in hourly mode', () => {
    const r = calculateSalary({ ...HOURLY, hourlyRate: 20, overtimeHoursPerWeek: 5, overtimeMultiplier: 1.5, payFrequency: 'weekly' })
    expect(r.annualBasePay).toBeCloseTo(41600, 6)
    expect(r.annualOvertimePay).toBeCloseTo(7800, 6)
    expect(r.annualGross).toBeCloseTo(49400, 6)
    expect(r.grossPay).toBeCloseTo(950, 6)
  })

  it('defaults the overtime multiplier to 1.5', () => {
    const r = calculateSalary({ ...HOURLY, hourlyRate: 20, overtimeHoursPerWeek: 5 })
    expect(r.annualOvertimePay).toBeCloseTo(7800, 6)
  })

  it('ignores overtime for salaried pay', () => {
    const r = calculateSalary({ ...BASE, overtimeHoursPerWeek: 10 })
    expect(r.annualOvertimePay).toBe(0)
    expect(r.annualGross).toBe(60000)
  })
})

describe('calculateSalary equivalent rates', () => {
  it('derives the hourly rate of a salary from regular hours', () => {
    const r = calculateSalary(BASE)
    expect(r.equivalentHourlyRate).toBeCloseTo(60000 / 2080, 8)
    expect(r.monthlyGross).toBeCloseTo(5000, 6)
    expect(r.monthlyNet).toBeCloseTo(3067.5, 6)
  })

  it('uses the entered weekly hours for the salaried hourly rate', () => {
    const r = calculateSalary({ ...BASE, hoursPerWeek: 50 })
    expect(r.equivalentHourlyRate).toBeCloseTo(60000 / 2600, 8)
  })

  it('reports a zero hourly rate when hours are zero', () => {
    const r = calculateSalary({ ...BASE, hoursPerWeek: 0 })
    expect(r.equivalentHourlyRate).toBe(0)
  })
})

describe('calculateSalary bonus and commission', () => {
  it('spreads annual bonus and commission across pay periods at the regular rate', () => {
    const r = calculateSalary({ ...BASE, annualBonus: 4000, annualCommission: 2000 })
    expect(r.annualGross).toBeCloseTo(66000, 6)
    expect(r.grossPay).toBeCloseTo(5500, 6)
    expect(r.federalTax).toBeCloseTo(1210, 6)
  })

  it('withholds bonus and commission at the 22% supplemental rate when selected', () => {
    const r = calculateSalary({ ...BASE, federalTaxRate: 15, annualBonus: 12000, supplementalFlatRate: true })
    // 60,000 x 15% + 12,000 x 22% = 11,640 a year
    expect(r.federalTax).toBeCloseTo(970, 6)
    expect(r.stateTax).toBeCloseTo(300, 6)
  })

  it('takes pre-tax deductions from regular wages before supplemental wages', () => {
    const r = calculateSalary({ ...BASE, grossPay: 100, federalTaxRate: 10, annualBonus: 1200, retirementContribution: 150, retirementUnit: 'amount', supplementalFlatRate: true })
    // regular 1,200 minus 1,800 retirement leaves 0 regular and 600 supplemental taxable
    expect(r.federalTax).toBeCloseTo(600 * 0.22 / 12, 8)
  })
})

describe('calculateSalary pre-tax deductions', () => {
  it('a retirement percentage reduces income-tax wages but not FICA wages', () => {
    const r = calculateSalary({ ...BASE, retirementContribution: 10 })
    expect(r.retirementContribution).toBeCloseTo(500, 6)
    expect(r.federalTax).toBeCloseTo(990, 6)
    expect(r.stateTax).toBeCloseTo(225, 6)
    expect(r.socialSecurity).toBeCloseTo(310, 6)
    expect(r.medicare).toBeCloseTo(72.5, 6)
    expect(r.netPay).toBeCloseTo(2702.5, 6)
  })

  it('a retirement percentage includes bonus pay', () => {
    const r = calculateSalary({ ...BASE, annualBonus: 6000, retirementContribution: 10 })
    expect(r.retirementContribution).toBeCloseTo(550, 6)
  })

  it('a retirement dollar amount is taken per period', () => {
    const r = calculateSalary({ ...BASE, retirementContribution: 300, retirementUnit: 'amount' })
    expect(r.retirementContribution).toBe(300)
    expect(r.federalTax).toBeCloseTo(1034, 6)
  })

  it('section 125 health deductions reduce income-tax and FICA wages', () => {
    const r = calculateSalary({ ...BASE, pretaxHealth: 200 })
    expect(r.federalTax).toBeCloseTo(1056, 6)
    expect(r.stateTax).toBeCloseTo(240, 6)
    expect(r.socialSecurity).toBeCloseTo(297.6, 6)
    expect(r.medicare).toBeCloseTo(69.6, 6)
    expect(r.pretaxHealth).toBe(200)
    expect(r.netPay).toBeCloseTo(2936.8, 6)
  })

  it('taxable wages never go below zero', () => {
    const r = calculateSalary({ ...BASE, grossPay: 100, retirementContribution: 200, retirementUnit: 'amount' })
    expect(r.federalTax).toBe(0)
    expect(r.stateTax).toBe(0)
  })

  it('every deduction sums to gross minus net', () => {
    const r = calculateSalary({ ...BASE, grossPay: 20000, retirementContribution: 6, pretaxHealth: 150, annualBonus: 5000 })
    const total = r.federalTax + r.stateTax + r.socialSecurity + r.medicare + r.additionalMedicare
      + r.retirementContribution + r.pretaxHealth + r.otherDeductions
    expect(r.grossPay - total).toBeCloseTo(r.netPay, 6)
  })
})

describe('calculateSalary FICA limits', () => {
  it('caps Social Security at the 2026 wage base', () => {
    const r = calculateSalary({ ...BASE, grossPay: 20000 })
    expect(r.socialSecurity).toBeCloseTo(184500 * 0.062 / 12, 6)
    expect(r.socialSecurity).toBeCloseTo(953.25, 6)
    expect(r.isSocialSecurityCapped).toBe(true)
    expect(calculateSalary(BASE).isSocialSecurityCapped).toBe(false)
  })

  it('applies the uncapped 1.45% Medicare plus 0.9% above $200,000', () => {
    const r = calculateSalary({ ...BASE, grossPay: 20000 })
    expect(r.medicare).toBeCloseTo(290, 6)
    expect(r.additionalMedicare).toBeCloseTo(30, 6)
  })

  it('has no Additional Medicare Tax at or below $200,000', () => {
    expect(calculateSalary({ ...BASE, grossPay: 200000 / 12 }).additionalMedicare).toBeCloseTo(0, 8)
    // 216,000 of wages is 16,000 over the threshold
    expect(calculateSalary({ ...BASE, grossPay: 18000 }).additionalMedicare).toBeCloseTo(12, 6)
  })

  it('section 125 deductions lower the wages used for the caps', () => {
    const r = calculateSalary({ ...BASE, grossPay: 20000, pretaxHealth: 1000 })
    expect(r.socialSecurity).toBeCloseTo(953.25, 6)
    expect(r.medicare).toBeCloseTo(275.5, 6)
    expect(r.additionalMedicare).toBeCloseTo(21, 6)
  })

  it('retirement contributions do not lower Social Security wages', () => {
    const r = calculateSalary({ ...BASE, grossPay: 16000, retirementContribution: 2000, retirementUnit: 'amount' })
    // 192,000 of FICA wages is above the cap even though income-tax wages are 168,000
    expect(r.socialSecurity).toBeCloseTo(953.25, 6)
    expect(r.medicare).toBeCloseTo(232, 6)
  })
})
