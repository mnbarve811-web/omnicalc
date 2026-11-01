// omnicalc/src/lib/engine/financial/retirement.ts

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
