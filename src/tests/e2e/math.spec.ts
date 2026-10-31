import { readFile } from 'node:fs/promises'
import { test as base, expect, type Page } from '@playwright/test'
import {
  calculateFraction,
  calculatePercentage,
  calculateQuadratic,
  calculateScientific,
  calculateStatistics,
} from '@/lib/engine/math'

const test = base.extend<{ pageErrors: string[] }>({
  pageErrors: [
    async ({ page }, use) => {
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))
      await use(errors)
      expect(errors).toEqual([])
    },
    { auto: true },
  ],
})

// Interactions sent before React hydrates are dropped, so every visit waits until React has attached
// its props to an element rendered by the client component
async function visit(page: Page, url: string, hydratedSelector = '[data-export-buttons]') {
  await page.goto(url)
  await page.waitForFunction((selector) => {
    const element = document.querySelector(selector)
    return element !== null && Object.keys(element).some((key) => key.startsWith('__reactProps'))
  }, hydratedSelector)
}

async function expectPageBasics(page: Page, path: string, heading: string) {
  await expect(page.getByRole('heading', { level: 1, name: heading, exact: true })).toBeVisible()
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${path}$`))

  const schemaTypes = (await page.locator('script[type="application/ld+json"]').allTextContents())
    .map((text) => (JSON.parse(text) as { '@type': string })['@type'])
  expect(schemaTypes).toEqual(expect.arrayContaining(['WebApplication', 'FAQPage']))

  const guideParagraph = page.locator('main > section').first().locator('p').first()
  await expect(guideParagraph).toBeVisible()
  expect((await guideParagraph.textContent())?.length ?? 0).toBeGreaterThan(100)

  await expect(page.getByRole('heading', { name: 'Frequently Asked Questions', exact: true })).toBeVisible()
  expect(await page.locator('main > section').last().getByRole('button').count()).toBeGreaterThan(0)
}

function exportButton(page: Page, name: 'Download CSV' | 'Download PDF') {
  return page.locator('[data-export-buttons]').getByRole('button', { name, exact: true })
}

async function downloadCsv(page: Page, filename: string): Promise<string[]> {
  const [download] = await Promise.all([page.waitForEvent('download'), exportButton(page, 'Download CSV').click()])
  expect(download.suggestedFilename()).toBe(filename)
  const text = await readFile(await download.path(), 'utf-8')
  expect(text).not.toMatch(/NaN|undefined|\[object Object\]/)
  const lines = text.split('\r\n').filter((line) => line !== '')
  expect(lines.length).toBeGreaterThanOrEqual(2)
  return lines
}

async function downloadPdf(page: Page, filename: string) {
  // Charts animate in; capturing mid-animation would export a half-drawn image
  await page.waitForTimeout(1600)
  const [download] = await Promise.all([page.waitForEvent('download'), exportButton(page, 'Download PDF').click()])
  expect(download.suggestedFilename()).toBe(filename)
  const bytes = await readFile(await download.path())
  expect(bytes.subarray(0, 4).toString('latin1')).toBe('%PDF')
}

async function expectExportDisabled(page: Page) {
  await expect(exportButton(page, 'Download CSV')).toBeDisabled()
  await expect(exportButton(page, 'Download PDF')).toBeDisabled()
}

test.describe('Math pillar hub', () => {
  const calculators = [
    { href: '/math/statistics', heading: 'Statistics Calculator' },
    { href: '/math/scientific', heading: 'Scientific Calculator' },
    { href: '/math/percentage', heading: 'Percentage Calculator' },
    { href: '/math/fractions', heading: 'Fractions Calculator' },
    { href: '/math/quadratic', heading: 'Quadratic Equation Solver' },
  ]

  test('lists all 5 calculators with working links', async ({ page }) => {
    await visit(page, '/math', 'main a')
    await expect(page.getByRole('heading', { level: 1, name: 'Math & Scientific Calculators' })).toBeVisible()
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/math$/)

    for (const { href } of calculators) {
      await expect(page.locator(`main a[href="${href}"]`)).toBeVisible()
      const response = await page.request.get(href)
      expect(response.status()).toBe(200)
    }

    for (const { href, heading } of calculators) {
      await visit(page, '/math', 'main a')
      await page.locator(`main a[href="${href}"]`).click()
      await expect(page).toHaveURL(new RegExp(`${href}$`))
      await expect(page.getByRole('heading', { level: 1, name: heading, exact: true })).toBeVisible()
    }
  })
})

test.describe('Statistics calculator', () => {
  const statValue = (page: Page, label: string) =>
    page
      .locator('[data-slot="card"]')
      .filter({ has: page.locator('[data-slot="card-title"]').getByText(label, { exact: true }) })
      .locator('p')

  function fmt(n: number): string {
    return Number.isInteger(n) ? String(n) : n.toFixed(4).replace(/\.?0+$/, '')
  }

  test('renders with default dataset, guide, FAQ, and SEO metadata', async ({ page }) => {
    await visit(page, '/math/statistics')
    await expectPageBasics(page, '/math/statistics', 'Statistics Calculator')
    await expect(statValue(page, 'Mean')).toHaveText('5')
    await expect(statValue(page, 'Std Dev')).toHaveText('2')
    await expect(page.locator('[data-slot="card-title"]').getByText('Frequency Distribution', { exact: true })).toBeVisible()
  })

  test('recalculates every statistic when the dataset changes', async ({ page }) => {
    await visit(page, '/math/statistics')
    const values = [1, 2, 3, 4, 100, 2]
    await page.locator('textarea').fill(values.join(', '))

    const expected = calculateStatistics({ values })
    await expect(statValue(page, 'Count')).toHaveText(String(expected.count))
    await expect(statValue(page, 'Sum')).toHaveText(fmt(expected.sum))
    await expect(statValue(page, 'Mean')).toHaveText(fmt(expected.mean))
    await expect(statValue(page, 'Median')).toHaveText(fmt(expected.median))
    await expect(statValue(page, 'Mode')).toHaveText(expected.mode.map(fmt).join(', '))
    await expect(statValue(page, 'Range')).toHaveText(fmt(expected.range))
    await expect(statValue(page, 'Min')).toHaveText(fmt(expected.min))
    await expect(statValue(page, 'Max')).toHaveText(fmt(expected.max))
    await expect(statValue(page, 'Variance')).toHaveText(fmt(expected.variance))
    await expect(statValue(page, 'Std Dev')).toHaveText(fmt(expected.standardDeviation))
  })

  test('handles negative numbers and decimals', async ({ page }) => {
    await visit(page, '/math/statistics')
    const values = [-3.5, -1, 0, 2.25]
    await page.locator('textarea').fill(values.join(','))

    const expected = calculateStatistics({ values })
    await expect(statValue(page, 'Mean')).toHaveText(fmt(expected.mean))
    await expect(statValue(page, 'Median')).toHaveText(fmt(expected.median))
    await expect(statValue(page, 'Min')).toHaveText('-3.5')
    await expect(statValue(page, 'Mode')).toHaveText('—')
  })

  test('shows a validation message and disables export for non-numeric input', async ({ page }) => {
    await visit(page, '/math/statistics')
    await page.locator('textarea').fill('abc, def')
    await expect(page.getByText('No valid numbers found.', { exact: true })).toBeVisible()
    await expect(statValue(page, 'Mean')).toHaveCount(0)
    await expectExportDisabled(page)
  })

  test('reflects the dataset in the URL query', async ({ page }) => {
    await visit(page, '/math/statistics')
    await page.locator('textarea').fill('1, 2, 3')
    await expect(page).toHaveURL(/\?.+/)
  })

  test('exports CSV and PDF', async ({ page }) => {
    await visit(page, '/math/statistics')
    const lines = await downloadCsv(page, 'statistics-summary.csv')
    expect(lines[0]).toBe('Metric,Value,Count')
    expect(lines).toContain('Mean,5,')
    expect(lines).toContain('Frequency,4,3')
    await downloadPdf(page, 'statistics-summary.pdf')
  })
})

test.describe('Scientific calculator', () => {
  const resultDisplay = (page: Page) => page.locator('#scientific-results [aria-live="polite"]')
  const expressionInput = (page: Page) => page.getByRole('textbox', { name: 'Expression', exact: true })
  const key = (page: Page, name: string) => page.getByRole('button', { name, exact: true })

  test('renders the default expression result, guide, FAQ, and SEO metadata', async ({ page }) => {
    await visit(page, '/math/scientific')
    await expectPageBasics(page, '/math/scientific', 'Scientific Calculator')
    await expect(expressionInput(page)).toHaveValue('sin(30) + √(16)')
    await expect(resultDisplay(page)).toHaveText(calculateScientific({ expression: 'sin(30) + √(16)', angleMode: 'deg' }).display)
  })

  test('evaluates a typed expression', async ({ page }) => {
    await visit(page, '/math/scientific')
    const expression = '2^10 - sqrt(144) / 3 + 5!'
    await expressionInput(page).fill(expression)
    await expect(resultDisplay(page)).toHaveText(calculateScientific({ expression, angleMode: 'deg' }).display)
  })

  test('builds and commits an expression with the keypad', async ({ page }) => {
    await visit(page, '/math/scientific')
    await key(page, 'clear').click()
    await expect(expressionInput(page)).toHaveValue('')
    await expect(resultDisplay(page)).toHaveText('0')

    await key(page, '2').click()
    await key(page, 'power').click()
    await key(page, '8').click()
    await key(page, 'plus').click()
    await key(page, '1').click()
    await key(page, 'backspace').click()
    await key(page, '4').click()
    await expect(expressionInput(page)).toHaveValue('2^8 +4')
    await expect(resultDisplay(page)).toHaveText('260')

    await key(page, 'equals').click()
    await expect(expressionInput(page)).toHaveValue('260')
  })

  test('toggles between degrees and radians', async ({ page }) => {
    await visit(page, '/math/scientific')
    await expressionInput(page).fill('sin(90)')
    await expect(resultDisplay(page)).toHaveText('1')

    await page.getByRole('button', { name: 'Radians', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Radians', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByRole('button', { name: 'Degrees', exact: true })).toHaveAttribute('aria-pressed', 'false')
    await expect(resultDisplay(page)).toHaveText(calculateScientific({ expression: 'sin(90)', angleMode: 'rad' }).display)
    await expect(page).toHaveURL(/angle=rad/)

    await page.getByRole('button', { name: 'Degrees', exact: true }).click()
    await expect(resultDisplay(page)).toHaveText('1')
  })

  test('shows an error for an undefined result and disables export', async ({ page }) => {
    await visit(page, '/math/scientific')
    await expressionInput(page).fill('1/0')
    await expect(page.locator('#scientific-results').getByRole('alert')).toHaveText('Result is undefined')
    await expectExportDisabled(page)

    await expressionInput(page).fill('(2 + 3')
    await expect(page.locator('#scientific-results').getByRole('alert')).toHaveText('Missing closing bracket')
    await expectExportDisabled(page)
  })

  test('reflects inputs in the URL and restores them on load', async ({ page }) => {
    await visit(page, '/math/scientific')
    await expressionInput(page).fill('3*4')
    await expect(page).toHaveURL(/expr=3\*4|expr=3%2A4/)

    await visit(page, `/math/scientific?expr=${encodeURIComponent('cos(pi)')}&angle=rad`)
    await expect(expressionInput(page)).toHaveValue('cos(pi)')
    await expect(page.getByRole('button', { name: 'Radians', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await expect(resultDisplay(page)).toHaveText('-1')
  })

  test('falls back to degrees for an invalid angle param', async ({ page }) => {
    await visit(page, '/math/scientific?angle=gradians')
    await expect(page.getByRole('button', { name: 'Degrees', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await expect(resultDisplay(page)).toHaveText(calculateScientific({ expression: 'sin(30) + √(16)', angleMode: 'deg' }).display)
  })

  test('exports CSV and PDF', async ({ page }) => {
    await visit(page, '/math/scientific')
    const lines = await downloadCsv(page, 'scientific-calculation.csv')
    expect(lines[0]).toBe('Expression,Angle mode,Result')
    expect(lines[1]).toBe('sin(30) + √(16),Degrees,4.5')
    await downloadPdf(page, 'scientific-calculation.pdf')
  })
})

test.describe('Percentage calculator', () => {
  const resultDisplay = (page: Page) => page.locator('#percentage-results [data-slot="card-content"] p').first()
  const modeButton = (page: Page, name: string) =>
    page.getByRole('group', { name: 'Calculation mode' }).getByRole('button', { name, exact: true })

  function formatPercentResult(mode: 'whatIsXPercentOfY' | 'xIsWhatPercentOfY' | 'percentChange', x: number, y: number): string {
    const rounded = Math.round(calculatePercentage({ mode, x, y }).result * 100) / 100
    if (mode === 'whatIsXPercentOfY') return String(rounded)
    if (mode === 'percentChange' && rounded > 0) return `+${rounded}%`
    return `${rounded}%`
  }

  test('renders the default result, guide, FAQ, and SEO metadata', async ({ page }) => {
    await visit(page, '/math/percentage')
    await expectPageBasics(page, '/math/percentage', 'Percentage Calculator')
    await expect(resultDisplay(page)).toHaveText(formatPercentResult('whatIsXPercentOfY', 20, 80))
  })

  test('recalculates in every mode', async ({ page }) => {
    await visit(page, '/math/percentage')
    await page.getByLabel('Percentage (%)', { exact: true }).fill('15')
    await page.getByLabel('Of what number?', { exact: true }).fill('240')
    await expect(resultDisplay(page)).toHaveText(formatPercentResult('whatIsXPercentOfY', 15, 240))

    await modeButton(page, 'X is what % of Y').click()
    await expect(modeButton(page, 'X is what % of Y')).toHaveAttribute('aria-pressed', 'true')
    await page.getByLabel('What number (X)?', { exact: true }).fill('45')
    await page.getByLabel('Of what number (Y)?', { exact: true }).fill('180')
    await expect(resultDisplay(page)).toHaveText(formatPercentResult('xIsWhatPercentOfY', 45, 180))

    await modeButton(page, '% Change').click()
    await page.getByLabel('New value', { exact: true }).fill('150')
    await page.getByLabel('Original value', { exact: true }).fill('120')
    await expect(resultDisplay(page)).toHaveText(formatPercentResult('percentChange', 150, 120))

    await page.getByLabel('New value', { exact: true }).fill('90')
    await expect(resultDisplay(page)).toHaveText(formatPercentResult('percentChange', 90, 120))
  })

  test('reflects inputs in the URL and restores them on load', async ({ page }) => {
    await visit(page, '/math/percentage')
    await page.getByLabel('Percentage (%)', { exact: true }).fill('35')
    await expect(page).toHaveURL(/x=35/)

    await visit(page, '/math/percentage?mode=percentChange&x=150&y=120')
    await expect(modeButton(page, '% Change')).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByLabel('New value', { exact: true })).toHaveValue('150')
    await expect(page.getByLabel('Original value', { exact: true })).toHaveValue('120')
    await expect(resultDisplay(page)).toHaveText('+25%')
  })

  test('falls back to defaults for an invalid mode or number', async ({ page }) => {
    await visit(page, '/math/percentage?mode=bogus&x=abc')
    await expect(modeButton(page, 'X% of Y')).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByLabel('Percentage (%)', { exact: true })).toHaveValue('20')
    await expect(resultDisplay(page)).toHaveText(formatPercentResult('whatIsXPercentOfY', 20, 80))
  })

  test('disables export when dividing by a zero base', async ({ page }) => {
    await visit(page, '/math/percentage?mode=xIsWhatPercentOfY&x=5&y=0')
    await expectExportDisabled(page)
  })

  test('exports CSV and PDF', async ({ page }) => {
    await visit(page, '/math/percentage')
    const lines = await downloadCsv(page, 'percentage-calculation.csv')
    expect(lines[0]).toBe('Mode,Percentage (%),Of what number?,Result,Summary')
    expect(lines[1]).toBe('X% of Y,20,80,16,20% of 80 = 16')
    await downloadPdf(page, 'percentage-calculation.pdf')
  })
})

test.describe('Fractions calculator', () => {
  const results = (page: Page) => page.locator('#fractions-results')
  const resultNumerator = (page: Page) => results(page).locator('[data-slot="card-content"] span').nth(0)
  const resultDenominator = (page: Page) => results(page).locator('[data-slot="card-content"] span').nth(1)
  const labelledValue = (page: Page, label: string) =>
    results(page).locator('div.text-center').filter({ has: page.getByText(label, { exact: true }) }).locator('p').last()
  const operationButton = (page: Page, label: string) => page.getByRole('button', { name: new RegExp(`${label}$`) })

  async function fillFractions(page: Page, n1: number, d1: number, n2: number, d2: number) {
    await page.getByLabel('First fraction numerator', { exact: true }).fill(String(n1))
    await page.getByLabel('First fraction denominator', { exact: true }).fill(String(d1))
    await page.getByLabel('Second fraction numerator', { exact: true }).fill(String(n2))
    await page.getByLabel('Second fraction denominator', { exact: true }).fill(String(d2))
  }

  async function expectFraction(page: Page, expected: ReturnType<typeof calculateFraction>) {
    await expect(resultNumerator(page)).toHaveText(String(expected.numerator))
    await expect(resultDenominator(page)).toHaveText(String(expected.denominator))
    await expect(labelledValue(page, 'Mixed Number')).toHaveText(expected.mixed)
    await expect(labelledValue(page, 'Decimal')).toHaveText(expected.decimal.toFixed(4).replace(/\.?0+$/, ''))
  }

  test('renders the default result, guide, FAQ, and SEO metadata', async ({ page }) => {
    await visit(page, '/math/fractions')
    await expectPageBasics(page, '/math/fractions', 'Fractions Calculator')
    await expectFraction(page, calculateFraction({ numerator1: 1, denominator1: 2, numerator2: 1, denominator2: 3, operation: 'add' }))
  })

  test('calculates every operation with simplification and negatives', async ({ page }) => {
    await visit(page, '/math/fractions')
    const cases = [
      { label: 'Add', operation: 'add', n1: 5, d1: 4, n2: 3, d2: 4 },
      { label: 'Subtract', operation: 'subtract', n1: 3, d1: 4, n2: 5, d2: 6 },
      { label: 'Multiply', operation: 'multiply', n1: -2, d1: 3, n2: 3, d2: 4 },
      { label: 'Divide', operation: 'divide', n1: 3, d1: 4, n2: 3, d2: 8 },
    ] as const

    for (const { label, operation, n1, d1, n2, d2 } of cases) {
      await operationButton(page, label).click()
      await expect(operationButton(page, label)).toHaveAttribute('aria-pressed', 'true')
      await fillFractions(page, n1, d1, n2, d2)
      await expectFraction(page, calculateFraction({ numerator1: n1, denominator1: d1, numerator2: n2, denominator2: d2, operation }))
    }
  })

  test('reflects inputs in the URL and restores them on load', async ({ page }) => {
    await visit(page, '/math/fractions')
    await operationButton(page, 'Multiply').click()
    await page.getByLabel('First fraction numerator', { exact: true }).fill('7')
    await expect(page).toHaveURL(/op=multiply/)
    await expect(page).toHaveURL(/n1=7/)

    await visit(page, '/math/fractions?n1=3&d1=4&n2=5&d2=6&op=subtract')
    await expect(operationButton(page, 'Subtract')).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByLabel('Second fraction denominator', { exact: true })).toHaveValue('6')
    await expectFraction(page, calculateFraction({ numerator1: 3, denominator1: 4, numerator2: 5, denominator2: 6, operation: 'subtract' }))
  })

  test('falls back to addition for an invalid operation param', async ({ page }) => {
    await visit(page, '/math/fractions?op=modulo')
    await expect(operationButton(page, 'Add')).toHaveAttribute('aria-pressed', 'true')
    await expectFraction(page, calculateFraction({ numerator1: 1, denominator1: 2, numerator2: 1, denominator2: 3, operation: 'add' }))
  })

  test('disables export for a zero denominator or division by zero', async ({ page }) => {
    await visit(page, '/math/fractions?d2=0')
    await expectExportDisabled(page)

    await visit(page, '/math/fractions?op=divide&n2=0')
    await expectExportDisabled(page)
  })

  test('exports CSV and PDF', async ({ page }) => {
    await visit(page, '/math/fractions')
    const lines = await downloadCsv(page, 'fraction-calculation.csv')
    expect(lines[0]).toBe('First fraction,Operation,Second fraction,Result,Mixed number,Decimal')
    expect(lines[1]).toBe('1/2,Add,1/3,5/6,5/6,0.8333')
    await downloadPdf(page, 'fraction-calculation.pdf')
  })
})

test.describe('Quadratic equation solver', () => {
  const cardValue = (page: Page, title: string) =>
    page
      .locator('#quadratic-results [data-slot="card"]')
      .filter({ has: page.locator('[data-slot="card-title"]').getByText(title, { exact: true }) })
      .locator('p')
      .first()
  const roots = (page: Page) => cardValue(page, 'Roots')
  const discriminant = (page: Page) => cardValue(page, 'Discriminant (b² − 4ac)')

  async function fillCoefficients(page: Page, a: number, b: number, c: number) {
    await page.getByLabel('Coefficient a', { exact: true }).fill(String(a))
    await page.getByLabel('Coefficient b', { exact: true }).fill(String(b))
    await page.getByLabel('Coefficient c', { exact: true }).fill(String(c))
  }

  test('renders the default roots, guide, FAQ, and SEO metadata', async ({ page }) => {
    await visit(page, '/math/quadratic')
    await expectPageBasics(page, '/math/quadratic', 'Quadratic Equation Solver')
    await expect(roots(page)).toHaveText(calculateQuadratic({ a: 1, b: -5, c: 6 }).rootsDisplay)
    await expect(discriminant(page)).toHaveText('1')
    await expect(page.getByRole('img', { name: /Number line marking roots/ })).toBeVisible()
  })

  test('solves two-root, repeated-root, negative-a, and no-real-root equations', async ({ page }) => {
    await visit(page, '/math/quadratic')
    const cases = [
      { a: 2, b: -4, c: -6 },
      { a: 1, b: -6, c: 9 },
      { a: -4.9, b: 20, c: 1.5 },
      { a: 1, b: 2, c: 5 },
    ]
    for (const coefficients of cases) {
      await fillCoefficients(page, coefficients.a, coefficients.b, coefficients.c)
      const expected = calculateQuadratic(coefficients)
      await expect(roots(page)).toHaveText(expected.rootsDisplay)
      await expect(discriminant(page)).toHaveText(Number(expected.discriminant.toPrecision(6)).toString())
    }
    await expect(page.getByText('Negative — no real roots', { exact: true })).toBeVisible()
  })

  test('reports a non-quadratic equation and disables export when a = 0', async ({ page }) => {
    await visit(page, '/math/quadratic')
    await page.getByLabel('Coefficient a', { exact: true }).fill('0')
    await expect(roots(page)).toHaveText('Not a quadratic equation (a = 0)')
    await expectExportDisabled(page)
  })

  test('reflects coefficients in the URL and restores them on load', async ({ page }) => {
    await visit(page, '/math/quadratic')
    await page.getByLabel('Coefficient c', { exact: true }).fill('-14')
    await expect(page).toHaveURL(/c=-14/)

    await visit(page, '/math/quadratic?a=1&b=-6&c=9')
    await expect(page.getByLabel('Coefficient b', { exact: true })).toHaveValue('-6')
    await expect(roots(page)).toHaveText('x = 3')
  })

  test('falls back to the default for a non-numeric coefficient param', async ({ page }) => {
    await visit(page, '/math/quadratic?a=abc&b=-3&c=2')
    await expect(page.getByLabel('Coefficient a', { exact: true })).toHaveValue('1')
    await expect(roots(page)).toHaveText(calculateQuadratic({ a: 1, b: -3, c: 2 }).rootsDisplay)
  })

  test('exports CSV and PDF', async ({ page }) => {
    await visit(page, '/math/quadratic')
    const lines = await downloadCsv(page, 'quadratic-roots.csv')
    expect(lines[0]).toBe('a,b,c,Discriminant,Root 1,Root 2,Roots')
    expect(lines[1]).toBe('1,-5,6,1,3,2,"x₁ = 3, x₂ = 2"')
    await downloadPdf(page, 'quadratic-roots.pdf')
  })
})
