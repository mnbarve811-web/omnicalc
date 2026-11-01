// omnicalc/src/lib/engine/financial/compound-interest.ts

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

export function calculateCompoundInterest(inputs: CompoundInterestInputs): CompoundInterestResult {
  const { initialInvestment, monthlyContribution, annualInterestRate, compoundFrequency, years } = inputs

  if (years <= 0) {
    return { futureValue: initialInvestment, totalContributions: initialInvestment, totalInterestEarned: 0, yearlyBreakdown: [] }
  }

  const monthlyRate = compoundFrequency > 0 && annualInterestRate > 0
    ? Math.pow(1 + (annualInterestRate / 100) / compoundFrequency, compoundFrequency / 12) - 1
    : annualInterestRate / 100 / 12

  const yearlyBreakdown: CompoundInterestDataPoint[] = []
  let balance = initialInvestment
  let totalContributions = initialInvestment

  for (let year = 1; year <= years; year++) {
    for (let _month = 1; _month <= 12; _month++) {
      balance += monthlyContribution
      totalContributions += monthlyContribution
      balance *= (1 + monthlyRate)
    }
    yearlyBreakdown.push({
      year,
      balance: Math.round(balance * 100) / 100,
      contributions: totalContributions,
      interest: Math.round((balance - totalContributions) * 100) / 100,
    })
  }

  return {
    futureValue: Math.round(balance * 100) / 100,
    totalContributions,
    totalInterestEarned: Math.round((balance - totalContributions) * 100) / 100,
    yearlyBreakdown,
  }
}
