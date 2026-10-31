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

export function calculateBodyFat(_inputs: BodyFatInputs): BodyFatResult {
  throw new Error('Not implemented')
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

export function calculateMacro(inputs: MacroInputs): MacroResult {
  if (inputs.tdee <= 0) return { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }

  const calorieMult = { cut: 0.8, maintain: 1, bulk: 1.15 }
  const calories = inputs.tdee * calorieMult[inputs.goal]

  const ratios = {
    balanced:    { protein: 30, carbs: 40, fat: 30 },
    lowCarb:     { protein: 35, carbs: 25, fat: 40 },
    highProtein: { protein: 40, carbs: 35, fat: 25 },
  }
  const { protein, carbs, fat } = ratios[inputs.split]

  return {
    calories,
    proteinG: calories * (protein / 100) / 4,
    carbsG:   calories * (carbs / 100) / 4,
    fatG:     calories * (fat / 100) / 9,
  }
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
