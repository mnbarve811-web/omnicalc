import { readFile } from 'node:fs/promises'
import { test, expect, type Page, type Locator } from '@playwright/test'
import { calculateBMI, calculateBodyFat, calculateMacro, calculatePregnancy, calculateTDEE } from '@/lib/engine/fitness'
import * as tdeeContent from '@/app/fitness/tdee/content'
import * as bmiContent from '@/app/fitness/bmi/content'
import * as bodyFatContent from '@/app/fitness/body-fat/content'
import * as macroContent from '@/app/fitness/macro/content'
import * as pregnancyContent from '@/app/fitness/pregnancy/content'

let pageErrors: Error[] = []

test.beforeEach(({ page }) => {
  pageErrors = []
  page.on('pageerror', error => pageErrors.push(error))
})

test.afterEach(() => {
  expect(pageErrors, 'uncaught page errors').toEqual([])
})

function fmt(n: number): string {
  return Math.round(n).toLocaleString('en-US')
}

function inputByLabel(page: Page, label: string): Locator {
  return page.locator('label', { hasText: new RegExp(`^${label.replace(/[()]/g, '\\$&')}$`) }).locator('xpath=..').locator('input')
}

function cardWithTitle(scope: Locator, title: string): Locator {
  return scope.locator('[data-slot="card"]').filter({ has: scope.page().getByText(title, { exact: true }) })
}

function query(page: Page): URLSearchParams {
  return new URL(page.url()).searchParams
}

async function expectPageChrome(page: Page, opts: { path: string; h1: string; guideText: string; firstQuestion: string }) {
  await expect(page.getByRole('heading', { level: 1, name: opts.h1, exact: true })).toBeVisible()
  await expect(page.getByText(opts.guideText.split('\n\n')[0], { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Frequently Asked Questions', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: opts.firstQuestion, exact: true })).toBeVisible()

  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
  expect(canonical).toMatch(new RegExp(`${opts.path}$`))

  const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents()
  const types = jsonLd.map(text => (JSON.parse(text) as { '@type': string })['@type'])
  expect(types).toContain('WebApplication')
  expect(types).toContain('FAQPage')
}

async function expectCsvDownload(page: Page, expectedFilename: string, expectedHeader: string, expectedDataRows: number): Promise<string> {
  const buttons = page.locator('[data-export-buttons]')
  const downloadPromise = page.waitForEvent('download')
  await buttons.getByRole('button', { name: 'Download CSV', exact: true }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe(expectedFilename)
  const csv = await readFile(await download.path(), 'utf8')
  const lines = csv.split('\r\n')
  expect(lines[0]).toBe(expectedHeader)
  expect(lines).toHaveLength(expectedDataRows + 1)
  expect(csv).not.toMatch(/NaN|undefined|\[object Object\]/)
  return csv
}

async function expectPdfDownload(page: Page, expectedFilename: string) {
  // Charts animate for ~1.5s; capturing mid-animation produces a partial PDF
  await page.waitForTimeout(1600)
  const downloadPromise = page.waitForEvent('download', { timeout: 30_000 })
  await page.locator('[data-export-buttons]').getByRole('button', { name: 'Download PDF', exact: true }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe(expectedFilename)
  const pdf = await readFile(await download.path())
  expect(pdf.subarray(0, 4).toString('latin1')).toBe('%PDF')
}

async function expectExportDisabled(page: Page) {
  const buttons = page.locator('[data-export-buttons]')
  await expect(buttons.getByRole('button', { name: 'Download CSV', exact: true })).toBeDisabled()
  await expect(buttons.getByRole('button', { name: 'Download PDF', exact: true })).toBeDisabled()
}

test.describe('Fitness pillar hub', () => {
  const calculators = [
    { title: 'TDEE Calculator', href: '/fitness/tdee', h1: 'TDEE Calculator' },
    { title: 'BMI Calculator', href: '/fitness/bmi', h1: 'BMI Calculator' },
    { title: 'Body Fat Calculator', href: '/fitness/body-fat', h1: 'Body Fat Calculator' },
    { title: 'Macro Calculator', href: '/fitness/macro', h1: 'Macro Calculator' },
    { title: 'Pregnancy Due Date', href: '/fitness/pregnancy', h1: 'Pregnancy Due Date Calculator' },
  ]

  test('lists all 5 calculators with working links', async ({ page }) => {
    await page.goto('/fitness')
    await expect(page.getByRole('heading', { level: 1, name: 'Fitness & Health Calculators' })).toBeVisible()
    const main = page.getByRole('main')
    for (const calc of calculators) {
      await expect(main.locator(`a[href="${calc.href}"]`)).toBeVisible()
      await expect(main.locator(`a[href="${calc.href}"]`)).toContainText(calc.title)
    }
    for (const calc of calculators) {
      await page.goto('/fitness')
      await main.locator(`a[href="${calc.href}"]`).click()
      await expect(page).toHaveURL(new RegExp(`${calc.href}$`))
      await expect(page.getByRole('heading', { level: 1, name: calc.h1, exact: true })).toBeVisible()
    }
  })

  test('has canonical /fitness', async ({ page }) => {
    await page.goto('/fitness')
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toMatch(/\/fitness$/)
  })
})

test.describe('TDEE calculator', () => {
  const results = (page: Page) => page.locator('#tdee-results')
  const bmrValue = (page: Page) => cardWithTitle(results(page), 'Basal Metabolic Rate (BMR)').locator('[data-slot="card-content"]')
  const goalValue = (page: Page, title: string) => cardWithTitle(results(page), title).locator('[data-slot="card-content"]').first()

  test('renders with default result, guide, FAQ, canonical and JSON-LD', async ({ page }) => {
    await page.goto('/fitness/tdee')
    await expectPageChrome(page, { path: '/fitness/tdee', h1: 'TDEE Calculator', guideText: tdeeContent.guideText, firstQuestion: tdeeContent.faqItems[0].question })
    const expected = calculateTDEE({ gender: 'male', weightKg: 75, heightCm: 170, ageYears: 30, activityLevel: 'moderate' })
    await expect(bmrValue(page)).toHaveText(`${fmt(expected.bmr)} cal/day`)
    await expect(goalValue(page, 'Maintain')).toHaveText(fmt(expected.maintain))
  })

  test('changing weight, sex and activity updates the result', async ({ page }) => {
    await page.goto('/fitness/tdee')
    await inputByLabel(page, 'Weight').fill('82')
    await page.getByRole('button', { name: 'Female', exact: true }).click()
    await page.getByRole('button', { name: /^Heavy/ }).click()
    const expected = calculateTDEE({ gender: 'female', weightKg: 82, heightCm: 170, ageYears: 30, activityLevel: 'heavy' })
    await expect(bmrValue(page)).toHaveText(`${fmt(expected.bmr)} cal/day`)
    await expect(goalValue(page, 'Cut (−20%)')).toHaveText(fmt(expected.cut))
    await expect(goalValue(page, 'Maintain')).toHaveText(fmt(expected.maintain))
    await expect(goalValue(page, 'Bulk (+15%)')).toHaveText(fmt(expected.bulk))
  })

  test('inputs are reflected in the URL and restored from it', async ({ page }) => {
    await page.goto('/fitness/tdee')
    await inputByLabel(page, 'Age').fill('45')
    await page.getByRole('button', { name: /^Athlete/ }).click()
    await expect.poll(() => query(page).get('activity')).toBe('athlete')
    expect(query(page).get('age')).toBe('45')

    await page.goto('/fitness/tdee?gender=female&weight=60&height=160&age=40&activity=light')
    await expect(inputByLabel(page, 'Weight')).toHaveValue('60')
    await expect(inputByLabel(page, 'Height')).toHaveValue('160')
    await expect(inputByLabel(page, 'Age')).toHaveValue('40')
    const expected = calculateTDEE({ gender: 'female', weightKg: 60, heightCm: 160, ageYears: 40, activityLevel: 'light' })
    await expect(bmrValue(page)).toHaveText(`${fmt(expected.bmr)} cal/day`)
    await expect(goalValue(page, 'Maintain')).toHaveText(fmt(expected.maintain))
  })

  test('invalid numeric param falls back to the default', async ({ page }) => {
    await page.goto('/fitness/tdee?weight=abc')
    await expect(inputByLabel(page, 'Weight')).toHaveValue('75')
    const expected = calculateTDEE({ gender: 'male', weightKg: 75, heightCm: 170, ageYears: 30, activityLevel: 'moderate' })
    await expect(bmrValue(page)).toHaveText(`${fmt(expected.bmr)} cal/day`)
  })

  test('invalid activity param falls back to moderate', async ({ page }) => {
    await page.goto('/fitness/tdee?activity=bogus')
    const expected = calculateTDEE({ gender: 'male', weightKg: 75, heightCm: 170, ageYears: 30, activityLevel: 'moderate' })
    await expect(goalValue(page, 'Maintain')).toHaveText(fmt(expected.maintain))
  })

  test('invalid gender param falls back to male', async ({ page }) => {
    await page.goto('/fitness/tdee?gender=bogus')
    const expected = calculateTDEE({ gender: 'male', weightKg: 75, heightCm: 170, ageYears: 30, activityLevel: 'moderate' })
    await expect(bmrValue(page)).toHaveText(`${fmt(expected.bmr)} cal/day`)
  })

  test('exports CSV and PDF', async ({ page }) => {
    await page.goto('/fitness/tdee?weight=90')
    const expected = calculateTDEE({ gender: 'male', weightKg: 90, heightCm: 170, ageYears: 30, activityLevel: 'moderate' })
    const csv = await expectCsvDownload(page, 'tdee-calories.csv', 'Metric,Calories per Day', 4)
    expect(csv).toContain(`Maintain (TDEE),${Math.round(expected.maintain)}`)
    await expectPdfDownload(page, 'tdee-calories.pdf')
  })

  test('export is disabled for zero weight', async ({ page }) => {
    await page.goto('/fitness/tdee?weight=0')
    await expectExportDisabled(page)
  })
})

test.describe('BMI calculator', () => {
  const resultCard = (page: Page) => cardWithTitle(page.locator('#bmi-results'), 'Your BMI')
  const bmiValue = (page: Page) => resultCard(page).locator('p').nth(1)
  const bmiCategory = (page: Page) => resultCard(page).locator('span')

  test('renders with default result, guide, FAQ, canonical and JSON-LD', async ({ page }) => {
    await page.goto('/fitness/bmi')
    await expectPageChrome(page, { path: '/fitness/bmi', h1: 'BMI Calculator', guideText: bmiContent.guideText, firstQuestion: bmiContent.faqItems[0].question })
    const expected = calculateBMI({ weightKg: 70, heightCm: 170 })
    await expect(bmiValue(page)).toHaveText(expected.value.toFixed(1))
    await expect(bmiCategory(page)).toHaveText(expected.category)
  })

  test('changing weight and height updates value and category', async ({ page }) => {
    await page.goto('/fitness/bmi')
    await inputByLabel(page, 'Weight (kg)').fill('95')
    await inputByLabel(page, 'Height (cm)').fill('172')
    const expected = calculateBMI({ weightKg: 95, heightCm: 172 })
    expect(expected.category).toBe('Obese')
    await expect(bmiValue(page)).toHaveText(expected.value.toFixed(1))
    await expect(bmiCategory(page)).toHaveText(expected.category)
  })

  test('inputs are reflected in the URL and restored from it', async ({ page }) => {
    await page.goto('/fitness/bmi')
    await inputByLabel(page, 'Weight (kg)').fill('58')
    await expect.poll(() => query(page).get('weight')).toBe('58')

    await page.goto('/fitness/bmi?weight=50&height=180')
    await expect(inputByLabel(page, 'Weight (kg)')).toHaveValue('50')
    await expect(inputByLabel(page, 'Height (cm)')).toHaveValue('180')
    const expected = calculateBMI({ weightKg: 50, heightCm: 180 })
    expect(expected.category).toBe('Underweight')
    await expect(bmiValue(page)).toHaveText(expected.value.toFixed(1))
    await expect(bmiCategory(page)).toHaveText(expected.category)
  })

  test('invalid param falls back to the default', async ({ page }) => {
    await page.goto('/fitness/bmi?height=tall&weight=80')
    await expect(inputByLabel(page, 'Height (cm)')).toHaveValue('170')
    await expect(bmiValue(page)).toHaveText(calculateBMI({ weightKg: 80, heightCm: 170 }).value.toFixed(1))
  })

  test('exports CSV and PDF', async ({ page }) => {
    await page.goto('/fitness/bmi?weight=85')
    const expected = calculateBMI({ weightKg: 85, heightCm: 170 })
    const csv = await expectCsvDownload(page, 'bmi-result.csv', 'Category,BMI Range,Your BMI', 4)
    expect(csv).toContain(`${expected.category},`)
    expect(csv).toContain(`,${expected.value.toFixed(1)}`)
    await expectPdfDownload(page, 'bmi-result.pdf')
  })

  test('export is disabled for zero weight', async ({ page }) => {
    await page.goto('/fitness/bmi?weight=0')
    await expectExportDisabled(page)
  })
})

test.describe('Body fat calculator', () => {
  const resultCard = (page: Page) => cardWithTitle(page.locator('#body-fat-results'), 'Result')
  const bfValue = (page: Page) => resultCard(page).locator('p').nth(1)
  const bfCategory = (page: Page) => resultCard(page).locator('span')

  test('renders with default result, guide, FAQ, canonical and JSON-LD', async ({ page }) => {
    await page.goto('/fitness/body-fat')
    await expectPageChrome(page, { path: '/fitness/body-fat', h1: 'Body Fat Calculator', guideText: bodyFatContent.guideText, firstQuestion: bodyFatContent.faqItems[0].question })
    const expected = calculateBodyFat({ gender: 'male', heightCm: 177, neckCm: 38, waistCm: 85, hipCm: 95 })
    await expect(bfValue(page)).toHaveText(`${expected.bodyFatPercentage.toFixed(1)}%`)
    await expect(bfCategory(page)).toHaveText(expected.category)
    await expect(inputByLabel(page, 'Hip (cm)')).toHaveCount(0)
  })

  test('switching to female shows hip input and uses the female formula', async ({ page }) => {
    await page.goto('/fitness/body-fat')
    await page.getByRole('button', { name: 'Female', exact: true }).click()
    await expect(inputByLabel(page, 'Hip (cm)')).toBeVisible()
    await inputByLabel(page, 'Waist (cm)').fill('75')
    await inputByLabel(page, 'Hip (cm)').fill('100')
    const expected = calculateBodyFat({ gender: 'female', heightCm: 177, neckCm: 38, waistCm: 75, hipCm: 100 })
    await expect(bfValue(page)).toHaveText(`${expected.bodyFatPercentage.toFixed(1)}%`)
    await expect(bfCategory(page)).toHaveText(expected.category)
    await expect(page.getByText('Body Fat Categories (Female)', { exact: true })).toBeVisible()
  })

  test('inputs are reflected in the URL and restored from it', async ({ page }) => {
    await page.goto('/fitness/body-fat')
    await inputByLabel(page, 'Neck (cm)').fill('40')
    await page.getByRole('button', { name: 'Female', exact: true }).click()
    await expect.poll(() => query(page).get('gender')).toBe('female')
    expect(query(page).get('neck')).toBe('40')

    await page.goto('/fitness/body-fat?gender=female&height=165&neck=32&waist=70&hip=96')
    await expect(inputByLabel(page, 'Height (cm)')).toHaveValue('165')
    await expect(inputByLabel(page, 'Hip (cm)')).toHaveValue('96')
    const expected = calculateBodyFat({ gender: 'female', heightCm: 165, neckCm: 32, waistCm: 70, hipCm: 96 })
    await expect(bfValue(page)).toHaveText(`${expected.bodyFatPercentage.toFixed(1)}%`)
    await expect(bfCategory(page)).toHaveText(expected.category)
  })

  test('invalid params fall back to the defaults', async ({ page }) => {
    await page.goto('/fitness/body-fat?gender=other&waist=wide')
    await expect(page.getByText('Body Fat Categories (Male)', { exact: true })).toBeVisible()
    await expect(inputByLabel(page, 'Waist (cm)')).toHaveValue('85')
    const expected = calculateBodyFat({ gender: 'male', heightCm: 177, neckCm: 38, waistCm: 85, hipCm: 95 })
    await expect(bfValue(page)).toHaveText(`${expected.bodyFatPercentage.toFixed(1)}%`)
  })

  test('exports CSV and PDF', async ({ page }) => {
    await page.goto('/fitness/body-fat?waist=95')
    const expected = calculateBodyFat({ gender: 'male', heightCm: 177, neckCm: 38, waistCm: 95, hipCm: 95 })
    const csv = await expectCsvDownload(page, 'body-fat-percentage.csv', 'Category,Range (Male),Your Body Fat %', 5)
    expect(csv).toContain(`${expected.category},`)
    expect(csv).toContain(`,${expected.bodyFatPercentage.toFixed(1)}`)
    await expectPdfDownload(page, 'body-fat-percentage.pdf')
  })

  test('export is disabled for zero neck, and for zero hip when female', async ({ page }) => {
    await page.goto('/fitness/body-fat?neck=0')
    await expectExportDisabled(page)
    await page.goto('/fitness/body-fat?gender=female&hip=0')
    await expectExportDisabled(page)
  })
})

test.describe('Macro calculator', () => {
  const stat = (page: Page, label: string) =>
    page.locator('#macro-results > .grid > [data-slot="card"]').filter({ has: page.getByText(label, { exact: true }) }).locator('p').nth(1)

  async function expectMacros(page: Page, tdee: number, goal: 'cut' | 'maintain' | 'bulk', split: 'balanced' | 'lowCarb' | 'highProtein') {
    const expected = calculateMacro({ tdee, goal, split })
    await expect(stat(page, 'Calories')).toHaveText(String(Math.round(expected.calories)))
    await expect(stat(page, 'Protein')).toHaveText(String(Math.round(expected.proteinG)))
    await expect(stat(page, 'Carbs')).toHaveText(String(Math.round(expected.carbsG)))
    await expect(stat(page, 'Fat')).toHaveText(String(Math.round(expected.fatG)))
  }

  test('renders with default result, guide, FAQ, canonical and JSON-LD', async ({ page }) => {
    await page.goto('/fitness/macro')
    await expectPageChrome(page, { path: '/fitness/macro', h1: 'Macro Calculator', guideText: macroContent.guideText, firstQuestion: macroContent.faqItems[0].question })
    await expectMacros(page, 2000, 'maintain', 'balanced')
  })

  test('changing TDEE, goal and split updates the macros', async ({ page }) => {
    await page.goto('/fitness/macro')
    await page.getByLabel('Daily TDEE (calories)').fill('2600')
    await page.getByRole('button', { name: 'Bulk', exact: true }).click()
    await page.getByRole('button', { name: 'High Protein', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Bulk', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await expectMacros(page, 2600, 'bulk', 'highProtein')
  })

  test('inputs are reflected in the URL and restored from it', async ({ page }) => {
    await page.goto('/fitness/macro')
    await page.getByRole('button', { name: 'Cut', exact: true }).click()
    await page.getByRole('button', { name: 'Low Carb', exact: true }).click()
    await expect.poll(() => query(page).get('split')).toBe('lowCarb')
    expect(query(page).get('goal')).toBe('cut')

    await page.goto('/fitness/macro?tdee=3100&goal=cut&split=lowCarb')
    await expect(page.getByLabel('Daily TDEE (calories)')).toHaveValue('3100')
    await expect(page.getByRole('button', { name: 'Cut', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByRole('button', { name: 'Low Carb', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await expectMacros(page, 3100, 'cut', 'lowCarb')
  })

  test('invalid params fall back to the defaults', async ({ page }) => {
    await page.goto('/fitness/macro?tdee=lots&goal=shred&split=keto')
    await expect(page.getByLabel('Daily TDEE (calories)')).toHaveValue('2000')
    await expect(page.getByRole('button', { name: 'Maintain', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByRole('button', { name: 'Balanced', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await expectMacros(page, 2000, 'maintain', 'balanced')
  })

  test('exports CSV and PDF', async ({ page }) => {
    await page.goto('/fitness/macro?tdee=2400&goal=bulk')
    const expected = calculateMacro({ tdee: 2400, goal: 'bulk', split: 'balanced' })
    const csv = await expectCsvDownload(page, 'macro-breakdown.csv', 'Macro,Grams per Day,Calories per Day', 4)
    expect(csv).toContain(`Protein,${Math.round(expected.proteinG)},`)
    expect(csv).toContain(`Total,,${Math.round(expected.calories)}`)
    await expectPdfDownload(page, 'macro-breakdown.pdf')
  })

  test('export is disabled for zero or negative TDEE', async ({ page }) => {
    await page.goto('/fitness/macro?tdee=0')
    await expectExportDisabled(page)
    await page.goto('/fitness/macro?tdee=-500')
    await expectExportDisabled(page)
    await expect(stat(page, 'Calories')).toHaveText('0')
  })
})

test.describe('Pregnancy due date calculator', () => {
  // Fixed "today" so week and trimester are deterministic; the engine's due date does not depend on today
  const TODAY = new Date('2026-06-15T12:00:00')
  const results = (page: Page) => page.locator('#pregnancy-results')
  const summary = (page: Page, title: string) => cardWithTitle(results(page), title).locator('[data-slot="card-content"]')

  function formatDate(iso: string): string {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(TODAY)
  })

  test('renders with default result, guide, FAQ, canonical and JSON-LD', async ({ page }) => {
    await page.goto('/fitness/pregnancy')
    await expectPageChrome(page, { path: '/fitness/pregnancy', h1: 'Pregnancy Due Date Calculator', guideText: pregnancyContent.guideText, firstQuestion: pregnancyContent.faqItems[0].question })
    // Default LMP is 70 days before today
    await expect(page.getByLabel('Date of LMP')).toHaveValue('2026-04-06')
    await expect(summary(page, 'Due Date')).toHaveText(formatDate(calculatePregnancy({ lastMenstrualPeriod: '2026-04-06' }).dueDate))
    await expect(summary(page, 'Current Week')).toHaveText('Week 10 of 40')
    await expect(summary(page, 'Trimester')).toHaveText('1st Trimester')
  })

  test('changing the LMP updates due date, week and trimester', async ({ page }) => {
    await page.goto('/fitness/pregnancy')
    await page.getByLabel('Date of LMP').fill('2026-01-05')
    // 2026-01-05 to 2026-06-15 is 161 days = 23 weeks
    await expect(summary(page, 'Due Date')).toHaveText(formatDate('2026-10-12'))
    expect(calculatePregnancy({ lastMenstrualPeriod: '2026-01-05' }).dueDate).toBe('2026-10-12')
    await expect(summary(page, 'Current Week')).toHaveText('Week 23 of 40')
    await expect(summary(page, 'Trimester')).toHaveText('2nd Trimester')
  })

  test('inputs are reflected in the URL and restored from it', async ({ page }) => {
    await page.goto('/fitness/pregnancy')
    await page.getByLabel('Date of LMP').fill('2025-12-01')
    await expect.poll(() => query(page).get('lmp')).toBe('2025-12-01')

    // 2025-11-17 to 2026-06-15 is 210 days = 30 weeks
    await page.goto('/fitness/pregnancy?lmp=2025-11-17')
    await expect(page.getByLabel('Date of LMP')).toHaveValue('2025-11-17')
    await expect(summary(page, 'Due Date')).toHaveText(formatDate(calculatePregnancy({ lastMenstrualPeriod: '2025-11-17' }).dueDate))
    await expect(summary(page, 'Current Week')).toHaveText('Week 30 of 40')
    await expect(summary(page, 'Trimester')).toHaveText('3rd Trimester')
  })

  test('invalid lmp param falls back to the default', async ({ page }) => {
    await page.goto('/fitness/pregnancy?lmp=not-a-date')
    await expect(page.getByLabel('Date of LMP')).toHaveValue('2026-04-06')
    await expect(summary(page, 'Current Week')).toHaveText('Week 10 of 40')
    await page.goto('/fitness/pregnancy?lmp=2026-13-45')
    await expect(page.getByLabel('Date of LMP')).toHaveValue('2026-04-06')
  })

  test('clearing the date input does not crash the page', async ({ page }) => {
    await page.goto('/fitness/pregnancy?lmp=2026-01-05')
    await expect(summary(page, 'Current Week')).toHaveText('Week 23 of 40')
    await page.getByLabel('Date of LMP').fill('')
    await expect(summary(page, 'Current Week')).toHaveText('Week 10 of 40')
    await expect(page.getByRole('heading', { level: 1, name: 'Pregnancy Due Date Calculator' })).toBeVisible()
  })

  test('exports CSV and PDF', async ({ page }) => {
    await page.goto('/fitness/pregnancy?lmp=2026-01-05')
    const csv = await expectCsvDownload(page, 'pregnancy-due-date.csv', 'Milestone,Value', 4)
    expect(csv).toContain(`Estimated Due Date,"${formatDate('2026-10-12')}"`)
    expect(csv).toContain('Current Week,Week 23 of 40')
    expect(csv).toContain('Current Trimester,2nd Trimester')
    await expectPdfDownload(page, 'pregnancy-due-date.pdf')
  })
})
