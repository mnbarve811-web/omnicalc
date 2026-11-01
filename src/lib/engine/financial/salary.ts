// omnicalc/src/lib/engine/financial/salary.ts

export type PayFrequency = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly'

export interface SalaryInputs {
  grossPay: number
  payFrequency: PayFrequency
  federalTaxRate: number   // %
  stateTaxRate: number     // %
  otherDeductions: number  // $ per pay period
}

export interface SalaryResult {
  grossPay: number
  federalTax: number
  socialSecurity: number
  medicare: number
  stateTax: number
  otherDeductions: number
  netPay: number
  annualGross: number
  annualNet: number
}

export function calculateSalary(inputs: SalaryInputs): SalaryResult {
  const { grossPay, payFrequency, federalTaxRate, stateTaxRate, otherDeductions } = inputs

  const periodsPerYear: Record<PayFrequency, number> = {
    weekly: 52,
    biweekly: 26,
    semimonthly: 24,
    monthly: 12,
  }

  const federalTax = grossPay * (federalTaxRate / 100)
  const stateTax = grossPay * (stateTaxRate / 100)
  const socialSecurity = grossPay * 0.062
  const medicare = grossPay * 0.0145
  const netPay = grossPay - federalTax - stateTax - socialSecurity - medicare - otherDeductions
  const periods = periodsPerYear[payFrequency]

  return {
    grossPay,
    federalTax,
    socialSecurity,
    medicare,
    stateTax,
    otherDeductions,
    netPay,
    annualGross: grossPay * periods,
    annualNet: netPay * periods,
  }
}
