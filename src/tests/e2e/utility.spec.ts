import { readFileSync } from 'node:fs'
import { test, expect, type Page } from '@playwright/test'
import { calculateConversion, calculateDateDiff, calculateGeometry } from '@/lib/engine/utility'
import * as unitContent from '@/app/utility/unit-conversion/content'
import * as dateContent from '@/app/utility/date-diff/content'
import * as geometryContent from '@/app/utility/geometry/content'

let pageErrors: Error[] = []

test.beforeEach(async ({ page }) => {
  pageErrors = []
  page.on('pageerror', (error) => pageErrors.push(error))
})

test.afterEach(() => {
  expect(pageErrors.map((error) => error.message)).toEqual([])
})

// Mirrors the calculators' display formatting so expected values come from the engine, not hand-typed numbers
function formatConversion(value: number): string {
  return Number(value.toPrecision(7)).toString()
}

function formatGeometry(value: number): string {
  return value.toFixed(4).replace(/\.?0+$/, '') || '0'
}

async function expectSeoBasics(page: Page, path: string, content: { guideText: string; faqItems: { question: string }[] }) {
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${path}$`))

  const jsonLdTypes = (await page.locator('script[type="application/ld+json"]').allTextContents())
    .map((text) => (JSON.parse(text) as { '@type': string })['@type'])
  expect(jsonLdTypes).toEqual(expect.arrayContaining(['WebApplication', 'FAQPage']))

  const firstGuideParagraph = content.guideText.split('\n\n')[0]
  await expect(page.getByText(firstGuideParagraph, { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Frequently Asked Questions' })).toBeVisible()
  for (const { question } of content.faqItems) {
    await expect(page.getByRole('button', { name: question, exact: true })).toBeVisible()
  }
}

async function expectCsvAndPdfDownloads(page: Page) {
  const exportButtons = page.locator('[data-export-buttons]')

  const csvDownloadPromise = page.waitForEvent('download')
  await exportButtons.getByRole('button', { name: 'Download CSV', exact: true }).click()
  const csvDownload = await csvDownloadPromise
  expect(csvDownload.suggestedFilename()).toMatch(/\.csv$/)
  const csv = readFileSync(await csvDownload.path(), 'utf-8')
  const lines = csv.split('\r\n').filter((line) => line.length > 0)
  expect(lines.length).toBeGreaterThanOrEqual(2)
  expect(csv).not.toMatch(/NaN|undefined|\[object Object\]/)

  // The PDF exporter needs fonts and layout to settle before html2canvas captures the results
  await page.waitForTimeout(1600)
  const pdfDownloadPromise = page.waitForEvent('download')
  await exportButtons.getByRole('button', { name: 'Download PDF', exact: true }).click()
  const pdfDownload = await pdfDownloadPromise
  expect(pdfDownload.suggestedFilename()).toMatch(/\.pdf$/)
  const pdf = readFileSync(await pdfDownload.path())
  expect(pdf.subarray(0, 4).toString('latin1')).toBe('%PDF')

  return lines
}

test.describe('Utility Pillar hub', () => {
  test('lists all 3 calculators with working links', async ({ page }) => {
    await page.goto('/utility')
    await expect(page.getByRole('heading', { level: 1, name: 'Utility Calculators' })).toBeVisible()

    const calculators = [
      { href: '/utility/unit-conversion', heading: 'Unit Converter' },
      { href: '/utility/date-diff', heading: 'Date Calculator' },
      { href: '/utility/geometry', heading: 'Geometry Calculator' },
    ]
    for (const { href } of calculators) {
      await expect(page.locator(`main a[href="${href}"]`)).toBeVisible()
    }
    for (const { href, heading } of calculators) {
      await page.goto('/utility')
      await page.locator(`main a[href="${href}"]`).click()
      await expect(page).toHaveURL(new RegExp(`${href}$`))
      await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible()
    }
  })
})

test.describe('Unit Converter', () => {
  const resultHero = (page: Page) =>
    page.locator('#unit-conversion-results [data-slot="card"]').filter({
      has: page.locator('[data-slot="card-title"]').getByText('Result', { exact: true }),
    })
  const resultValue = (page: Page) => resultHero(page).locator('[data-slot="card-content"]')
  const formulaText = (page: Page) => resultHero(page).locator('[data-slot="card-content"] + div')
  const categorySelect = (page: Page) => page.locator('main select').nth(0)
  const fromSelect = (page: Page) => page.locator('main select').nth(1)
  const toSelect = (page: Page) => page.locator('main select').nth(2)
  const valueInput = (page: Page) => page.locator('main input[type="number"]')

  test('renders heading, default result, guide, FAQ and structured data', async ({ page }) => {
    await page.goto('/utility/unit-conversion')
    await expect(page.getByRole('heading', { level: 1, name: 'Unit Converter' })).toBeVisible()
    const expected = calculateConversion({ category: 'length', fromUnit: 'km', toUnit: 'm', value: 1 })
    await expect(resultValue(page)).toHaveText(`${formatConversion(expected.result)} m`)
    await expect(formulaText(page)).toHaveText(expected.formula)
    await expectSeoBasics(page, '/utility/unit-conversion', unitContent)
  })

  test('converts length and weight values as inputs change', async ({ page }) => {
    await page.goto('/utility/unit-conversion')
    await valueInput(page).fill('5')
    await fromSelect(page).selectOption('mi')
    await toSelect(page).selectOption('km')
    const miles = calculateConversion({ category: 'length', fromUnit: 'mi', toUnit: 'km', value: 5 })
    await expect(resultValue(page)).toHaveText(`${formatConversion(miles.result)} km`)

    await categorySelect(page).selectOption('weight')
    await expect(fromSelect(page)).toHaveValue('kg')
    await expect(toSelect(page)).toHaveValue('g')
    await toSelect(page).selectOption('lb')
    const kilos = calculateConversion({ category: 'weight', fromUnit: 'kg', toUnit: 'lb', value: 5 })
    await expect(resultValue(page)).toHaveText(`${formatConversion(kilos.result)} lb`)
    await expect(formulaText(page)).toHaveText(kilos.formula)
  })

  test('switching category resets the unit lists for every category', async ({ page }) => {
    await page.goto('/utility/unit-conversion')
    const firstTwoUnits: Record<string, [string, string]> = {
      volume: ['L', 'mL'],
      temperature: ['C', 'F'],
      speed: ['m/s', 'km/h'],
      area: ['m²', 'km²'],
      pressure: ['Pa', 'kPa'],
      length: ['m', 'km'],
    }
    for (const [category, [from, to]] of Object.entries(firstTwoUnits)) {
      await categorySelect(page).selectOption(category)
      await expect(fromSelect(page)).toHaveValue(from)
      await expect(toSelect(page)).toHaveValue(to)
      await expect(resultValue(page)).not.toContainText('NaN')
    }
  })

  test('converts temperature, writing kelvin without a degree sign', async ({ page }) => {
    await page.goto('/utility/unit-conversion')
    await categorySelect(page).selectOption('temperature')
    await valueInput(page).fill('0')
    await expect(resultValue(page)).toHaveText('32 F')
    await expect(formulaText(page)).toHaveText('0°C = 32°F')

    await toSelect(page).selectOption('K')
    await expect(resultValue(page)).toHaveText('273.15 K')
    await expect(formulaText(page)).toHaveText('0°C = 273.15 K')
    await expect(formulaText(page)).not.toContainText('°K')

    await fromSelect(page).selectOption('F')
    await valueInput(page).fill('212')
    const expected = calculateConversion({ category: 'temperature', fromUnit: 'F', toUnit: 'K', value: 212 })
    await expect(resultValue(page)).toHaveText(`${formatConversion(expected.result)} K`)
    await expect(formulaText(page)).toHaveText(expected.formula)
  })

  test('reflects inputs in the URL and restores them on load', async ({ page }) => {
    await page.goto('/utility/unit-conversion')
    await categorySelect(page).selectOption('temperature')
    await valueInput(page).fill('100')
    await expect(page).toHaveURL(/cat=temperature/)
    await expect(page).toHaveURL(/from=C/)
    await expect(page).toHaveURL(/to=F/)
    await expect(page).toHaveURL(/value=100/)

    await page.goto('/utility/unit-conversion?cat=speed&from=mph&to=km%2Fh&value=60')
    await expect(categorySelect(page)).toHaveValue('speed')
    await expect(fromSelect(page)).toHaveValue('mph')
    await expect(toSelect(page)).toHaveValue('km/h')
    await expect(valueInput(page)).toHaveValue('60')
    const expected = calculateConversion({ category: 'speed', fromUnit: 'mph', toUnit: 'km/h', value: 60 })
    await expect(resultValue(page)).toHaveText(`${formatConversion(expected.result)} km/h`)
  })

  test('a non-numeric value param falls back to the default', async ({ page }) => {
    await page.goto('/utility/unit-conversion?value=abc')
    await expect(valueInput(page)).toHaveValue('1')
    await expect(resultValue(page)).toHaveText('1000 m')
  })

  test('an unknown category param falls back to the default', async ({ page }) => {
    await page.goto('/utility/unit-conversion?cat=bogus')
    await expect(page.getByRole('heading', { level: 1, name: 'Unit Converter' })).toBeVisible()
    await expect(categorySelect(page)).toHaveValue('length')
    await expect(resultValue(page)).toHaveText('1000 m')
  })

  test('an unknown unit param falls back to the default', async ({ page }) => {
    await page.goto('/utility/unit-conversion?from=parsec')
    await expect(resultValue(page)).not.toContainText('NaN')
    await expect(resultValue(page)).toHaveText('1000 m')
  })

  test('exports CSV and PDF for a conversion', async ({ page }) => {
    await page.goto('/utility/unit-conversion?cat=weight&from=kg&to=lb&value=3')
    const lines = await expectCsvAndPdfDownloads(page)
    expect(lines[0]).toBe('Category,From Value,From Unit,To Value,To Unit,Formula')
    const expected = calculateConversion({ category: 'weight', fromUnit: 'kg', toUnit: 'lb', value: 3 })
    expect(lines[1]).toBe(`Weight,3,kg,${formatConversion(expected.result)},lb,${expected.formula}`)
  })

  test('export is enabled for 0 °C but disabled for an empty non-temperature value', async ({ page }) => {
    const exportButtons = page.locator('[data-export-buttons]')
    await page.goto('/utility/unit-conversion?cat=temperature&from=C&to=F&value=0')
    await expect(resultValue(page)).toHaveText('32 F')
    await expect(exportButtons.getByRole('button', { name: 'Download CSV', exact: true })).toBeEnabled()
    await expect(exportButtons.getByRole('button', { name: 'Download PDF', exact: true })).toBeEnabled()

    await page.goto('/utility/unit-conversion?value=0')
    await expect(exportButtons.getByRole('button', { name: 'Download CSV', exact: true })).toBeDisabled()
    await expect(exportButtons.getByRole('button', { name: 'Download PDF', exact: true })).toBeDisabled()
  })
})

test.describe('Date Calculator', () => {
  const startInput = (page: Page) => page.locator('main input[type="date"]').nth(0)
  const endInput = (page: Page) => page.locator('main input[type="date"]').nth(1)
  const resultCard = (page: Page, label: string) =>
    page.locator('#date-diff-results [data-slot="card"]').filter({
      has: page.locator('[data-slot="card-title"]').getByText(label, { exact: true }),
    }).locator('p')

  async function expectBreakdown(page: Page, startDate: string, endDate: string) {
    const expected = calculateDateDiff({ startDate, endDate })
    await expect(resultCard(page, 'Years')).toHaveText(expected.years.toLocaleString('en-US'))
    await expect(resultCard(page, 'Months')).toHaveText(expected.months.toLocaleString('en-US'))
    await expect(resultCard(page, 'Days')).toHaveText(expected.days.toLocaleString('en-US'))
    await expect(resultCard(page, 'Total Days')).toHaveText(expected.totalDays.toLocaleString('en-US'))
    return expected
  }

  test('renders heading, default result, guide, FAQ and structured data', async ({ page }) => {
    await page.goto('/utility/date-diff')
    await expect(page.getByRole('heading', { level: 1, name: 'Date Calculator' })).toBeVisible()
    const startDate = await startInput(page).inputValue()
    const endDate = await endInput(page).inputValue()
    expect(startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    const expected = await expectBreakdown(page, startDate, endDate)
    expect(expected.years).toBe(1)
    await expectSeoBasics(page, '/utility/date-diff', dateContent)
  })

  test('first of one month to the first of the next is exactly 1 month', async ({ page }) => {
    await page.goto('/utility/date-diff')
    await startInput(page).fill('2026-03-01')
    await endInput(page).fill('2026-04-01')
    const expected = await expectBreakdown(page, '2026-03-01', '2026-04-01')
    expect([expected.years, expected.months, expected.days, expected.totalDays]).toEqual([0, 1, 0, 31])
    await expect(page.locator('#date-diff-results')).toContainText('From Mar 1, 2026 to Apr 1, 2026 is 0 years, 1 month, and 0 days.')
  })

  test('reversed dates give the same breakdown', async ({ page }) => {
    await page.goto('/utility/date-diff')
    await startInput(page).fill('2026-10-31')
    await endInput(page).fill('2024-03-15')
    const expected = await expectBreakdown(page, '2026-10-31', '2024-03-15')
    expect([expected.years, expected.months, expected.days, expected.totalDays]).toEqual([2, 7, 16, 960])
  })

  test('counts across a leap year and a year boundary', async ({ page }) => {
    await page.goto('/utility/date-diff')
    await startInput(page).fill('2023-12-15')
    await endInput(page).fill('2025-01-10')
    const expected = await expectBreakdown(page, '2023-12-15', '2025-01-10')
    expect(expected.totalDays).toBe(392)
  })

  test('reflects dates in the URL and restores them on load', async ({ page }) => {
    await page.goto('/utility/date-diff')
    await startInput(page).fill('2020-02-29')
    await endInput(page).fill('2021-02-28')
    await expect(page).toHaveURL(/start=2020-02-29/)
    await expect(page).toHaveURL(/end=2021-02-28/)

    await page.goto('/utility/date-diff?start=2000-01-01&end=2026-10-31')
    await expect(startInput(page)).toHaveValue('2000-01-01')
    await expect(endInput(page)).toHaveValue('2026-10-31')
    await expectBreakdown(page, '2000-01-01', '2026-10-31')
  })

  test('an invalid date param falls back to the default', async ({ page }) => {
    await page.goto('/utility/date-diff?start=not-a-date&end=2026-10-31')
    await expect(page.getByRole('heading', { level: 1, name: 'Date Calculator' })).toBeVisible()
    await expect(page.locator('#date-diff-results')).not.toContainText('NaN')
    await expect(startInput(page)).not.toHaveValue('')
  })

  test('an invalid date param falls back to a valid date, so export stays enabled', async ({ page }) => {
    await page.goto('/utility/date-diff?start=not-a-date&end=2026-10-31')
    await expect(page.getByRole('heading', { level: 1, name: 'Date Calculator' })).toBeVisible()
    const exportButtons = page.locator('[data-export-buttons]')
    await expect(exportButtons.getByRole('button', { name: 'Download CSV', exact: true })).toBeEnabled()
    await expect(exportButtons.getByRole('button', { name: 'Download PDF', exact: true })).toBeEnabled()
  })

  test('exports CSV and PDF for a date range', async ({ page }) => {
    await page.goto('/utility/date-diff?start=2024-03-15&end=2026-10-31')
    const lines = await expectCsvAndPdfDownloads(page)
    expect(lines[0]).toBe('Start Date,End Date,Years,Months,Days,Total Days')
    expect(lines[1]).toBe('2024-03-15,2026-10-31,2,7,16,960')
  })
})

test.describe('Geometry Calculator', () => {
  const shapeButton = (page: Page, label: string) => page.getByRole('button', { name: label, exact: true })
  const resultCards = (page: Page) =>
    page.locator('#geometry-results [data-slot="card"]').filter({ hasNot: page.locator('svg') })
  const resultValue = (page: Page, label: string) =>
    page.locator('#geometry-results [data-slot="card"]').filter({
      has: page.locator('[data-slot="card-title"]').getByText(label, { exact: true }),
    }).locator('p')

  const RESULT_LABELS: Record<string, string> = {
    area: 'Area',
    perimeter: 'Perimeter',
    volume: 'Volume',
    surfaceArea: 'Surface Area',
  }

  test('renders heading, default result, guide, FAQ and structured data', async ({ page }) => {
    await page.goto('/utility/geometry')
    await expect(page.getByRole('heading', { level: 1, name: 'Geometry Calculator' })).toBeVisible()
    await expect(shapeButton(page, 'Circle')).toHaveAttribute('aria-pressed', 'true')
    const expected = calculateGeometry({ shape: 'circle', dimensions: { radius: 5 } })
    await expect(resultValue(page, 'Area')).toHaveText(formatGeometry(expected.area!))
    await expect(resultValue(page, 'Perimeter')).toHaveText(formatGeometry(expected.perimeter!))
    await expectSeoBasics(page, '/utility/geometry', geometryContent)
  })

  const SHAPE_CASES = [
    { shape: 'circle', label: 'Circle', inputs: ['Radius'], dimensions: { radius: 5 } },
    { shape: 'rectangle', label: 'Rectangle', inputs: ['Width', 'Height'], dimensions: { width: 4, height: 6 } },
    { shape: 'triangle', label: 'Triangle', inputs: ['Base', 'Height', 'Side a', 'Side b', 'Side c'], dimensions: { base: 3, height: 6, a: 3, b: 4, c: 5 } },
    { shape: 'cylinder', label: 'Cylinder', inputs: ['Radius', 'Height'], dimensions: { radius: 5, height: 6 } },
    { shape: 'sphere', label: 'Sphere', inputs: ['Radius'], dimensions: { radius: 5 } },
    { shape: 'cone', label: 'Cone', inputs: ['Radius', 'Height'], dimensions: { radius: 5, height: 6 } },
  ] as const
  const ALL_INPUTS = ['Radius', 'Width', 'Height', 'Base', 'Side a', 'Side b', 'Side c']

  test('each shape button shows the right inputs and outputs', async ({ page }) => {
    await page.goto('/utility/geometry')
    for (const { shape, label, inputs, dimensions } of SHAPE_CASES) {
      await shapeButton(page, label).click()
      await expect(shapeButton(page, label)).toHaveAttribute('aria-pressed', 'true')
      for (const inputLabel of ALL_INPUTS) {
        const input = page.getByLabel(inputLabel, { exact: true })
        if ((inputs as readonly string[]).includes(inputLabel)) await expect(input).toBeVisible()
        else await expect(input).toHaveCount(0)
      }
      const expected = calculateGeometry({ shape, dimensions })
      const expectedEntries = Object.entries(expected).filter(([, value]) => value !== undefined)
      await expect(resultCards(page)).toHaveCount(expectedEntries.length)
      for (const [key, value] of expectedEntries) {
        await expect(resultValue(page, RESULT_LABELS[key])).toHaveText(formatGeometry(value as number))
      }
    }
  })

  test('updates results as dimensions change', async ({ page }) => {
    await page.goto('/utility/geometry')
    await shapeButton(page, 'Cone').click()
    await page.getByLabel('Radius', { exact: true }).fill('3')
    await page.getByLabel('Height', { exact: true }).fill('4')
    const expected = calculateGeometry({ shape: 'cone', dimensions: { radius: 3, height: 4 } })
    await expect(resultValue(page, 'Volume')).toHaveText(formatGeometry(expected.volume!))
    await expect(resultValue(page, 'Surface Area')).toHaveText(formatGeometry(expected.surfaceArea!))
  })

  test('triangle perimeter follows the entered sides', async ({ page }) => {
    await page.goto('/utility/geometry?shape=triangle')
    await expect(resultValue(page, 'Perimeter')).toHaveText('12')
    await page.getByLabel('Side c', { exact: true }).fill('')
    // An emptied input becomes 0, which still counts as a side, so perimeter stays visible
    const expected = calculateGeometry({ shape: 'triangle', dimensions: { base: 3, height: 6, a: 3, b: 4, c: 0 } })
    await expect(resultValue(page, 'Perimeter')).toHaveText(formatGeometry(expected.perimeter!))
    await expect(resultValue(page, 'Area')).toHaveText(formatGeometry(expected.area!))
  })

  test('reflects inputs in the URL and restores them on load', async ({ page }) => {
    await page.goto('/utility/geometry')
    await shapeButton(page, 'Rectangle').click()
    await page.getByLabel('Width', { exact: true }).fill('10')
    await expect(page).toHaveURL(/shape=rectangle/)
    await expect(page).toHaveURL(/w=10/)

    await page.goto('/utility/geometry?shape=cylinder&r=2&h=5')
    await expect(shapeButton(page, 'Cylinder')).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByLabel('Radius', { exact: true })).toHaveValue('2')
    await expect(page.getByLabel('Height', { exact: true })).toHaveValue('5')
    const expected = calculateGeometry({ shape: 'cylinder', dimensions: { radius: 2, height: 5 } })
    await expect(resultValue(page, 'Volume')).toHaveText(formatGeometry(expected.volume!))
  })

  test('an unknown shape param falls back to circle', async ({ page }) => {
    await page.goto('/utility/geometry?shape=hexagon&r=abc')
    await expect(shapeButton(page, 'Circle')).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByLabel('Radius', { exact: true })).toHaveValue('5')
    const expected = calculateGeometry({ shape: 'circle', dimensions: { radius: 5 } })
    await expect(resultValue(page, 'Area')).toHaveText(formatGeometry(expected.area!))
  })

  test('exports CSV and PDF for a shape', async ({ page }) => {
    await page.goto('/utility/geometry?shape=rectangle&w=4&h=6')
    const lines = await expectCsvAndPdfDownloads(page)
    expect(lines[0]).toBe('Shape,Width,Height,Area,Perimeter')
    expect(lines[1]).toBe('Rectangle,4,6,24,20')
  })

  test('export is disabled for a zero radius', async ({ page }) => {
    const exportButtons = page.locator('[data-export-buttons]')
    await page.goto('/utility/geometry')
    await expect(exportButtons.getByRole('button', { name: 'Download CSV', exact: true })).toBeEnabled()
    await page.getByLabel('Radius', { exact: true }).fill('0')
    await expect(resultValue(page, 'Area')).toHaveText('0')
    await expect(exportButtons.getByRole('button', { name: 'Download CSV', exact: true })).toBeDisabled()
    await expect(exportButtons.getByRole('button', { name: 'Download PDF', exact: true })).toBeDisabled()
  })
})
