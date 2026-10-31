// omnicalc/src/lib/engine/financial.ts

// --- Mortgage ---
export interface MortgageInputs {
  homePrice: number
  downPayment: number
  loanTermYears: number
  interestRate: number   // annual %, e.g. 6.5
  propertyTax: number    // monthly $
  homeInsurance: number  // monthly $
  hoa: number            // monthly $
}

export interface AmortizationRow {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export interface MortgageResult {
  monthlyPrincipalAndInterest: number
  monthlyTotal: number
  totalPaymentCount: number
  totalInterestPaid: number
  amortizationSchedule: AmortizationRow[]
}

export function calculateMortgage(inputs: MortgageInputs): MortgageResult {
  const { homePrice, downPayment, loanTermYears, interestRate, propertyTax, homeInsurance, hoa } = inputs
  const principal = Math.max(0, homePrice - downPayment)
  const monthlyRate = interestRate / 100 / 12
  const n = loanTermYears * 12

  if (n === 0) {
    return { monthlyPrincipalAndInterest: 0, monthlyTotal: 0, totalPaymentCount: 0, totalInterestPaid: 0, amortizationSchedule: [] }
  }

  const monthlyPrincipalAndInterest = monthlyRate === 0
    ? principal / n
    : principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)

  const monthlyTotal = monthlyPrincipalAndInterest + propertyTax + homeInsurance + hoa

  const amortizationSchedule: AmortizationRow[] = []
  let balance = principal
  let totalInterestPaid = 0

  for (let month = 1; month <= n; month++) {
    const interest = balance * monthlyRate
    const principalPaid = monthlyPrincipalAndInterest - interest
    balance = Math.max(0, balance - principalPaid)
    totalInterestPaid += interest
    amortizationSchedule.push({ month, payment: monthlyPrincipalAndInterest, principal: principalPaid, interest, balance })
  }

  return { monthlyPrincipalAndInterest, monthlyTotal, totalPaymentCount: n, totalInterestPaid, amortizationSchedule }
}

// --- Auto Loan ---
export interface AutoLoanInputs {
  vehiclePrice: number
  downPayment: number
  tradeInValue: number
  interestRate: number   // annual %
  loanTermMonths: number
  salesTaxRate: number   // %
}

export interface AutoLoanResult {
  monthlyPayment: number
  loanBalance: number
  totalInterestPaid: number
  amortizationSchedule: AmortizationRow[]
}

export function calculateAutoLoan(_inputs: AutoLoanInputs): AutoLoanResult {
  throw new Error('Not implemented')
}

// --- Compound Interest ---
export interface CompoundInterestInputs {
  initialInvestment: number
  monthlyContribution: number
  annualInterestRate: number  // %
  compoundFrequency: number   // times per year, e.g. 12
  years: number
}

export interface CompoundInterestDataPoint {
  year: number
  balance: number
  contributions: number
  interest: number
}

export interface CompoundInterestResult {
  futureValue: number
  totalContributions: number
  totalInterestEarned: number
  yearlyBreakdown: CompoundInterestDataPoint[]
}

export function calculateCompoundInterest(_inputs: CompoundInterestInputs): CompoundInterestResult {
  throw new Error('Not implemented')
}

// --- Retirement ---
export interface RetirementInputs {
  currentAge: number
  retirementAge: number
  currentSavings: number
  annualSavings: number
  expectedReturn: number   // annual %, e.g. 7
  annualExpenses: number   // in today's dollars
}

export interface RetirementDataPoint {
  age: number
  balance: number
}

export interface RetirementResult {
  balanceAtRetirement: number
  yearsOfFunding: number
  projectedRunout: number | null   // age at which funds run out, or null if they don't
  growthPhase: RetirementDataPoint[]
  drawdownPhase: RetirementDataPoint[]
}

export function calculateRetirement(inputs: RetirementInputs): RetirementResult {
  const { currentAge, retirementAge, currentSavings, annualSavings, expectedReturn, annualExpenses } = inputs
  const r = expectedReturn / 100

  // Growth phase: accumulate savings
  const growthPhase: RetirementDataPoint[] = []
  let balance = currentSavings
  for (let age = currentAge; age <= retirementAge; age++) {
    growthPhase.push({ age, balance })
    if (age < retirementAge) {
      balance = balance * (1 + r) + annualSavings
    }
  }
  const balanceAtRetirement = balance

  // Drawdown phase: spend until funds run out or 50 years post-retirement
  const drawdownPhase: RetirementDataPoint[] = []
  let drawBalance = balanceAtRetirement
  let projectedRunout: number | null = null
  const maxDrawdownYears = 50

  for (let i = 0; i <= maxDrawdownYears; i++) {
    const age = retirementAge + i
    drawdownPhase.push({ age, balance: Math.max(0, drawBalance) })
    if (drawBalance <= 0 && projectedRunout === null) {
      projectedRunout = age
      break
    }
    drawBalance = drawBalance * (1 + r) - annualExpenses
  }

  const yearsOfFunding = projectedRunout !== null
    ? projectedRunout - retirementAge
    : maxDrawdownYears

  return { balanceAtRetirement, yearsOfFunding, projectedRunout, growthPhase, drawdownPhase }
}

// --- Salary / Paycheck ---
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

export function calculateSalary(_inputs: SalaryInputs): SalaryResult {
  throw new Error('Not implemented')
}

// --- Debt Payoff ---
export interface DebtItem {
  name: string
  balance: number
  interestRate: number     // annual %
  minimumPayment: number
}

export type DebtPayoffStrategy = 'snowball' | 'avalanche'

export interface DebtPayoffInputs {
  debts: DebtItem[]
  strategy: DebtPayoffStrategy
  extraMonthlyPayment: number
}

export interface DebtPayoffResult {
  monthsToDebtFree: number
  totalInterestPaid: number
  payoffOrder: string[]   // debt names in order paid off
}

export function calculateDebtPayoff(_inputs: DebtPayoffInputs): DebtPayoffResult {
  throw new Error('Not implemented')
}
