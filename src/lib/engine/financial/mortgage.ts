// omnicalc/src/lib/engine/financial/mortgage.ts

import type { AmortizationRow } from './amortization'

export interface LumpSum {
  month: number  // 1-based payment month
  amount: number // $
}

export interface MortgageInputs {
  homePrice: number
  downPayment: number
  loanTermYears: number
  interestRate: number   // annual %, e.g. 6.5
  propertyTax: number    // monthly $
  homeInsurance: number  // monthly $
  hoa: number            // monthly $
  extraMonthlyPayment?: number // $ added to principal every month
  lumpSums?: LumpSum[]
  biweekly?: boolean     // half the monthly P&I every two weeks
}

// payment and principal include the extra; in biweekly mode a row sums the 2 or 3 payments made that month
export interface MortgageScheduleRow extends AmortizationRow {
  extra: number
}

export interface MortgageResult {
  monthlyPrincipalAndInterest: number
  monthlyTotal: number
  totalPaymentCount: number
  totalInterestPaid: number
  amortizationSchedule: MortgageScheduleRow[]
}

const BIWEEKLY_PERIODS_PER_YEAR = 26

// Floating-point residue left after the last scheduled payment would otherwise add a fraction-of-a-cent row
const PAID_OFF_TOLERANCE = 0.005

export function calculateMortgage(inputs: MortgageInputs): MortgageResult {
  const { homePrice, downPayment, loanTermYears, interestRate, propertyTax, homeInsurance, hoa } = inputs
  const extraMonthlyPayment = inputs.extraMonthlyPayment ?? 0
  const lumpSums = inputs.lumpSums ?? []
  const biweekly = inputs.biweekly ?? false
  const principal = Math.max(0, homePrice - downPayment)
  const monthlyRate = interestRate / 100 / 12
  const n = loanTermYears * 12

  if (n <= 0) {
    return { monthlyPrincipalAndInterest: 0, monthlyTotal: 0, totalPaymentCount: 0, totalInterestPaid: 0, amortizationSchedule: [] }
  }

  const monthlyPrincipalAndInterest = monthlyRate === 0
    ? principal / n
    : principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)

  const monthlyTotal = monthlyPrincipalAndInterest + propertyTax + homeInsurance + hoa

  const extraByMonth = new Map<number, number>()
  for (const lump of lumpSums) {
    extraByMonth.set(lump.month, (extraByMonth.get(lump.month) ?? 0) + lump.amount)
  }

  // Biweekly is simulated per two-week period at the annual rate / 26, then grouped into calendar months
  const periodsPerYear = biweekly ? BIWEEKLY_PERIODS_PER_YEAR : 12
  const periodRate = interestRate / 100 / periodsPerYear
  const periodPayment = biweekly ? monthlyPrincipalAndInterest / 2 : monthlyPrincipalAndInterest
  const maxPeriods = loanTermYears * periodsPerYear

  const amortizationSchedule: MortgageScheduleRow[] = []
  let balance = principal
  let totalInterestPaid = 0

  for (let period = 1; period <= maxPeriods && balance > 0; period++) {
    // Period k of a biweekly year falls in month ceil(12k/26), so months get two or three payments
    const month = biweekly ? Math.ceil((period * 12) / BIWEEKLY_PERIODS_PER_YEAR) : period
    let row = amortizationSchedule.at(-1)
    const isFirstPeriodOfMonth = row?.month !== month
    if (!row || isFirstPeriodOfMonth) {
      row = { month, payment: 0, principal: 0, interest: 0, balance, extra: 0 }
      amortizationSchedule.push(row)
    }

    const interest = balance * periodRate
    let scheduledPrincipal = Math.min(balance, periodPayment - interest)
    if (period === maxPeriods) scheduledPrincipal = balance
    const requestedExtra = isFirstPeriodOfMonth ? extraMonthlyPayment + (extraByMonth.get(month) ?? 0) : 0
    const extra = Math.min(requestedExtra, balance - scheduledPrincipal)

    balance -= scheduledPrincipal + extra
    if (balance < PAID_OFF_TOLERANCE) balance = 0

    totalInterestPaid += interest
    row.interest += interest
    row.principal += scheduledPrincipal + extra
    row.extra += extra
    row.payment += interest + scheduledPrincipal + extra
    row.balance = balance
  }

  return { monthlyPrincipalAndInterest, monthlyTotal, totalPaymentCount: n, totalInterestPaid, amortizationSchedule }
}

export interface ExtraPaymentSavings {
  payoffMonths: number
  baselinePayoffMonths: number
  monthsSaved: number
  totalInterestPaid: number
  baselineTotalInterest: number
  interestSaved: number
}

export function calculateExtraPaymentSavings(inputs: MortgageInputs): ExtraPaymentSavings {
  const withExtras = calculateMortgage(inputs)
  const baseline = calculateMortgage({ ...inputs, extraMonthlyPayment: 0, lumpSums: [], biweekly: false })
  const payoffMonths = withExtras.amortizationSchedule.length
  const baselinePayoffMonths = baseline.amortizationSchedule.length
  return {
    payoffMonths,
    baselinePayoffMonths,
    monthsSaved: baselinePayoffMonths - payoffMonths,
    totalInterestPaid: withExtras.totalInterestPaid,
    baselineTotalInterest: baseline.totalInterestPaid,
    interestSaved: baseline.totalInterestPaid - withExtras.totalInterestPaid,
  }
}

export interface TermComparisonRow {
  termYears: number
  monthlyPrincipalAndInterest: number
  totalInterestPaid: number
  payoffMonths: number
}

export function compareMortgageTerms(inputs: MortgageInputs, terms: number[] = [15, 20, 25, 30]): TermComparisonRow[] {
  return terms.map(termYears => {
    const result = calculateMortgage({ ...inputs, loanTermYears: termYears })
    return {
      termYears,
      monthlyPrincipalAndInterest: result.monthlyPrincipalAndInterest,
      totalInterestPaid: result.totalInterestPaid,
      payoffMonths: result.amortizationSchedule.length,
    }
  })
}
