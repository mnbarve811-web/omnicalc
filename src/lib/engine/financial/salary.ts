// omnicalc/src/lib/engine/financial/salary.ts

export type PayFrequency = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly'
export type PayType = 'salary' | 'hourly'
export type RetirementUnit = 'percent' | 'amount'

// The newer inputs are optional so callers written before them keep their results
export interface SalaryInputs {
  grossPay: number         // $ per pay period, salaried pay only
  payFrequency: PayFrequency
  federalTaxRate: number   // %
  stateTaxRate: number     // %
  otherDeductions: number  // post-tax $ per pay period
  payType?: PayType
  hourlyRate?: number
  hoursPerWeek?: number
  overtimeHoursPerWeek?: number
  overtimeMultiplier?: number
  annualBonus?: number
  annualCommission?: number
  supplementalFlatRate?: boolean
  retirementContribution?: number  // % of gross or $ per pay period, per retirementUnit
  retirementUnit?: RetirementUnit
  pretaxHealth?: number            // Section 125 $ per pay period
}

export interface SalaryResult {
  grossPay: number
  federalTax: number
  socialSecurity: number
  medicare: number
  additionalMedicare: number
  stateTax: number
  retirementContribution: number
  pretaxHealth: number
  otherDeductions: number
  netPay: number
  annualGross: number
  annualNet: number
  monthlyGross: number
  monthlyNet: number
  annualBasePay: number
  annualOvertimePay: number
  equivalentHourlyRate: number
  isSocialSecurityCapped: boolean
}

export const PAY_PERIODS_PER_YEAR: Record<PayFrequency, number> = {
  weekly: 52,
  biweekly: 26,
  semimonthly: 24,
  monthly: 12,
}

const WEEKS_PER_YEAR = 52
// 2026 Social Security wage base; update each year
export const SOCIAL_SECURITY_WAGE_BASE = 184500
const SOCIAL_SECURITY_RATE = 0.062
const MEDICARE_RATE = 0.0145
// Employers must withhold above this regardless of filing status
const ADDITIONAL_MEDICARE_THRESHOLD = 200000
const ADDITIONAL_MEDICARE_RATE = 0.009
export const SUPPLEMENTAL_FEDERAL_RATE = 22

export function calculateSalary(inputs: SalaryInputs): SalaryResult {
  const {
    grossPay,
    payFrequency,
    federalTaxRate,
    stateTaxRate,
    otherDeductions,
    payType = 'salary',
    hourlyRate = 0,
    hoursPerWeek = 40,
    overtimeHoursPerWeek = 0,
    overtimeMultiplier = 1.5,
    annualBonus = 0,
    annualCommission = 0,
    supplementalFlatRate = false,
    retirementContribution = 0,
    retirementUnit = 'percent',
    pretaxHealth = 0,
  } = inputs

  const periods = PAY_PERIODS_PER_YEAR[payFrequency]
  const isHourly = payType === 'hourly'

  const annualBasePay = isHourly ? hourlyRate * hoursPerWeek * WEEKS_PER_YEAR : grossPay * periods
  // Salaried employees are treated as overtime-exempt
  const annualOvertimePay = isHourly ? hourlyRate * overtimeMultiplier * overtimeHoursPerWeek * WEEKS_PER_YEAR : 0
  const annualSupplementalPay = annualBonus + annualCommission
  const annualGross = annualBasePay + annualOvertimePay + annualSupplementalPay

  const annualRetirement = retirementUnit === 'percent'
    ? annualGross * (retirementContribution / 100)
    : retirementContribution * periods
  const annualHealth = pretaxHealth * periods

  // 401(k)/403(b) deferrals escape income tax but not FICA; Section 125 deductions escape both
  const incomeTaxWages = Math.max(0, annualGross - annualRetirement - annualHealth)
  const ficaWages = Math.max(0, annualGross - annualHealth)

  // Pre-tax deductions come out of regular wages first, so supplemental wages keep the flat rate as long as possible
  const supplementalTaxable = supplementalFlatRate ? Math.min(annualSupplementalPay, incomeTaxWages) : 0
  const annualFederal = (incomeTaxWages - supplementalTaxable) * (federalTaxRate / 100)
    + supplementalTaxable * (SUPPLEMENTAL_FEDERAL_RATE / 100)
  const annualState = incomeTaxWages * (stateTaxRate / 100)

  // Computed on annual wages and spread evenly; real payroll withholds in full until the cap or threshold is reached mid-year
  const annualSocialSecurity = Math.min(ficaWages, SOCIAL_SECURITY_WAGE_BASE) * SOCIAL_SECURITY_RATE
  const annualMedicare = ficaWages * MEDICARE_RATE
  const annualAdditionalMedicare = Math.max(0, ficaWages - ADDITIONAL_MEDICARE_THRESHOLD) * ADDITIONAL_MEDICARE_RATE

  const annualOther = otherDeductions * periods
  const annualNet = annualGross - annualFederal - annualState - annualSocialSecurity - annualMedicare
    - annualAdditionalMedicare - annualRetirement - annualHealth - annualOther

  const regularHoursPerYear = hoursPerWeek * WEEKS_PER_YEAR
  const equivalentHourlyRate = isHourly
    ? hourlyRate
    : regularHoursPerYear > 0 ? annualBasePay / regularHoursPerYear : 0

  return {
    grossPay: annualGross / periods,
    federalTax: annualFederal / periods,
    socialSecurity: annualSocialSecurity / periods,
    medicare: annualMedicare / periods,
    additionalMedicare: annualAdditionalMedicare / periods,
    stateTax: annualState / periods,
    retirementContribution: annualRetirement / periods,
    pretaxHealth,
    otherDeductions,
    netPay: annualNet / periods,
    annualGross,
    annualNet,
    monthlyGross: annualGross / 12,
    monthlyNet: annualNet / 12,
    annualBasePay,
    annualOvertimePay,
    equivalentHourlyRate,
    isSocialSecurityCapped: ficaWages > SOCIAL_SECURITY_WAGE_BASE,
  }
}
