// omnicalc/src/lib/engine/fitness.ts

export type GenderBiological = 'male' | 'female'
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'heavy' | 'athlete'
export type MacroGoal = 'cut' | 'maintain' | 'bulk'
export type MacroSplit = 'balanced' | 'lowCarb' | 'highProtein'

// --- BMI ---
export interface BMIInputs {
  weightKg: number
  heightCm: number
}

export interface BMIResult {
  value: number
  category: 'Underweight' | 'Normal weight' | 'Overweight' | 'Obese'
}

export function calculateBMI(_inputs: BMIInputs): BMIResult {
  throw new Error('Not implemented')
}

// --- TDEE ---
export interface TDEEInputs {
  gender: GenderBiological
  weightKg: number
  heightCm: number
  ageYears: number
  activityLevel: ActivityLevel
}

export interface TDEEResult {
  bmr: number
  tdee: number
  cut: number      // tdee - 20%
  maintain: number // tdee
  bulk: number     // tdee + 15%
}

export function calculateTDEE(_inputs: TDEEInputs): TDEEResult {
  throw new Error('Not implemented')
}

// --- Body Fat (US Navy Method) ---
export interface BodyFatInputs {
  gender: GenderBiological
  heightCm: number
  neckCm: number
  waistCm: number
  hipCm: number   // used for female only; ignored for male
}

export interface BodyFatResult {
  bodyFatPercentage: number
  fatMassKg: number
  leanMassKg: number
  category: string
}

export function calculateBodyFat(inputs: BodyFatInputs): BodyFatResult {
  const { gender, heightCm, neckCm, waistCm, hipCm } = inputs

  let bf: number
  if (gender === 'male') {
    const logArg = Math.max(waistCm - neckCm, 0.001)
    bf = 495 / (1.0324 - 0.19077 * Math.log10(logArg) + 0.15456 * Math.log10(heightCm)) - 450
  } else {
    const logArg = Math.max(waistCm + hipCm - neckCm, 0.001)
    bf = 495 / (1.29579 - 0.35004 * Math.log10(logArg) + 0.22100 * Math.log10(heightCm)) - 450
  }

  // Clamped log10 arguments still yield a negative percentage; floor at 0 so invalid tapes show a safe minimum.
  bf = Math.max(0, bf)
  const bodyFatPercentage = Math.round(bf * 10) / 10

  let category: string
  if (gender === 'male') {
    if (bf < 6)       category = 'Essential'
    else if (bf < 14) category = 'Athletes'
    else if (bf < 18) category = 'Fitness'
    else if (bf < 25) category = 'Acceptable'
    else              category = 'Obese'
  } else {
    if (bf < 14)      category = 'Essential'
    else if (bf < 21) category = 'Athletes'
    else if (bf < 25) category = 'Fitness'
    else if (bf < 32) category = 'Acceptable'
    else              category = 'Obese'
  }

  return { bodyFatPercentage, fatMassKg: 0, leanMassKg: 0, category }
}

// --- Macro ---
export interface MacroInputs {
  tdee: number
  goal: MacroGoal
  split: MacroSplit
}

export interface MacroResult {
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
}

export function calculateMacro(_inputs: MacroInputs): MacroResult {
  throw new Error('Not implemented')
}

// --- Pregnancy Due Date ---
export interface PregnancyInputs {
  lastMenstrualPeriod: string   // ISO date string YYYY-MM-DD
}

export interface PregnancyResult {
  dueDate: string       // ISO date string YYYY-MM-DD
  currentWeek: number
  trimester: 1 | 2 | 3
}

export function calculatePregnancy(_inputs: PregnancyInputs): PregnancyResult {
  throw new Error('Not implemented')
}
