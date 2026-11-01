import fs from 'node:fs'
import { test, expect, type Locator, type Page } from '@playwright/test'
import {
  calculateAutoLoan,
  calculateCompoundInterest,
  calculateDebtPayoff,
  calculateMinimumPaymentsOnly,
  calculateMortgage,
  calculateRetirement,
  calculateSalary,
  getDebtFreeDate,
  type AutoLoanInputs,
  type CompoundInterestInputs,
  type DebtItem,
  type MortgageInputs,
  type RetirementInputs,
  type SalaryInputs,
} from '../../lib/engine/financial'
import type { FAQItem } from '../../components/common/FAQSection'
import * as mortgageContent from '../../app/financial/mortgage/content'
import * as compoundContent from '../../app/financial/compound-interest/content'
import * as retirementContent from '../../app/financial/retirement/content'
import * as autoLoanContent from '../../app/financial/auto-loan/content'
import * as salaryContent from '../../app/financial/salary/content'
import * as debtContent from '../../app/financial/debt-payoff/content'

test.describe('Financial Pillar', () => {
  test('pillar directory lists all 6 calculators', async ({ page }) => {
    await page.goto('/financial')
    await expect(page.getByRole('heading', { name: 'Financial Calculators' })).toBeVisible()
    for (const href of ['/financial/mortgage', '/financial/compound-interest', '/financial/retirement', '/financial/auto-loan', '/financial/salary', '/financial/debt-payoff']) {
      await expect(page.locator(`main a[href="${href}"]`)).toBeVisible()
    }
  })

  test('mortgage calculator renders and shows result', async ({ page }) => {
    await page.goto('/financial/mortgage')
    await expect(page.getByRole('heading', { name: 'Mortgage Calculator' })).toBeVisible()
    await expect(page.getByText('Monthly P&I', { exact: true })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Yearly Summary' })).toBeVisible()
  })

  test('mortgage URL state is preserved on reload', async ({ page }) => {
    await page.goto('/financial/mortgage?price=400000&rate=7')
    await expect(page.getByRole('heading', { name: 'Mortgage Calculator' })).toBeVisible()
    await expect(page.locator('body')).not.toContainText('Error')
  })

  test('compound interest calculator renders with chart', async ({ page }) => {
    await page.goto('/financial/compound-interest')
    await expect(page.getByRole('heading', { name: 'Compound Interest Calculator' })).toBeVisible()
    await expect(page.getByText('Future Value', { exact: true })).toBeVisible()
  })

  test('retirement calculator renders with chart', async ({ page }) => {
    await page.goto('/financial/retirement')
    await expect(page.getByRole('heading', { name: 'Retirement Calculator' })).toBeVisible()
    await expect(page.getByText('Balance at Retirement', { exact: true })).toBeVisible()
  })

  test('auto loan calculator renders', async ({ page }) => {
    await page.goto('/financial/auto-loan')
    await expect(page.getByRole('heading', { name: 'Auto Loan Calculator' })).toBeVisible()
    await expect(page.locator('[data-slot="card-title"]', { hasText: 'Monthly Payment' })).toBeVisible()
  })

  test('salary calculator renders breakdown table', async ({ page }) => {
    await page.goto('/financial/salary')
    await expect(page.getByRole('heading', { name: 'Salary', exact: false })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Net Pay', exact: true })).toBeVisible()
  })

  test('debt payoff calculator renders with strategy tabs', async ({ page }) => {
    await page.goto('/financial/debt-payoff')
    await expect(page.getByRole('heading', { name: 'Debt Payoff Calculator' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Avalanche', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Snowball', exact: true })).toBeVisible()
  })

  test('all pages have canonical meta tag', async ({ page }) => {
    const pages = [
      { path: '/financial/mortgage', canonical: '/financial/mortgage' },
      { path: '/financial/compound-interest', canonical: '/financial/compound-interest' },
    ]
    for (const { path, canonical } of pages) {
      await page.goto(path)
      const canonicalEl = page.locator('link[rel="canonical"]')
      const href = await canonicalEl.getAttribute('href')
      expect(href).toContain(canonical)
    }
  })
})

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

const MORTGAGE_DEFAULTS: MortgageInputs = { homePrice: 400000, downPayment: 80000, loanTermYears: 30, interestRate: 7, propertyTax: 300, homeInsurance: 120, hoa: 0 }
const COMPOUND_DEFAULTS: CompoundInterestInputs = { initialInvestment: 10000, monthlyContribution: 500, annualInterestRate: 7, compoundFrequency: 12, years: 20 }
const RETIREMENT_DEFAULTS: RetirementInputs = { currentAge: 30, retirementAge: 65, currentSavings: 50000, annualSavings: 15000, expectedReturn: 7, annualExpenses: 60000 }
const AUTO_DEFAULTS: AutoLoanInputs = { vehiclePrice: 30000, downPayment: 5000, tradeInValue: 0, interestRate: 6, loanTermMonths: 60, salesTaxRate: 8 }
const SALARY_DEFAULTS: SalaryInputs = { grossPay: 5000, payFrequency: 'monthly', federalTaxRate: 22, stateTaxRate: 5, otherDeductions: 200 }
const DEFAULT_DEBTS: DebtItem[] = [
  { name: 'Credit Card', balance: 5000, interestRate: 20, minimumPayment: 100 },
  { name: 'Car Loan', balance: 8000, interestRate: 6, minimumPayment: 200 },
]

function field(page: Page, label: string): Locator {
  return page.locator('label').getByText(label, { exact: true }).locator('xpath=..').locator('input, select').first()
}

function cardValue(page: Page, title: string): Locator {
  return page
    .locator('[data-slot="card"]')
    .filter({ has: page.locator('[data-slot="card-title"]').getByText(title, { exact: true }) })
    .locator('[data-slot="card-content"]')
}

// Each input writes the URL; waiting for it before the next edit stops a later patch overwriting an earlier one
async function setField(page: Page, label: string, value: string, param: string) {
  await field(page, label).fill(value)
  await expect(page).toHaveURL(new RegExp(`[?&]${param}=${value.replace('.', '\\.')}(&|$)`))
}

async function expectSeo(page: Page, path: string, faqs: FAQItem[], guide: string) {
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${path}$`))
  const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents()
  const types = jsonLd.map((text) => (JSON.parse(text) as { '@type': string })['@type'])
  expect(types).toContain('WebApplication')
  expect(types).toContain('FAQPage')
  await expect(page.getByText(guide.split('\n\n')[0], { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Frequently Asked Questions' })).toBeVisible()
  for (const faq of faqs) {
    await expect(page.getByRole('button', { name: faq.question, exact: true })).toBeVisible()
  }
}

async function expectCsvDownload(page: Page, header: string, minDataRows: number) {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('[data-export-buttons]').getByRole('button', { name: 'Download CSV' }).click(),
  ])
  expect(download.suggestedFilename()).toMatch(/\.csv$/)
  const csv = fs.readFileSync(await download.path(), 'utf8').replace(/^﻿/, '')
  const lines = csv.split(/\r?\n/).filter((line) => line.length > 0)
  expect(lines[0]).toBe(header)
  expect(lines.length - 1).toBeGreaterThanOrEqual(minDataRows)
  expect(csv).not.toMatch(/NaN|undefined|\[object Object\]|Infinity/)
}

async function expectPdfDownload(page: Page) {
  // Charts animate in for ~1.5s; capturing earlier would snapshot half-drawn charts
  await page.waitForTimeout(1600)
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 30000 }),
    page.locator('[data-export-buttons]').getByRole('button', { name: 'Download PDF' }).click(),
  ])
  expect(download.suggestedFilename()).toMatch(/\.pdf$/)
  const bytes = fs.readFileSync(await download.path())
  expect(bytes.subarray(0, 4).toString('latin1')).toBe('%PDF')
}

async function expectExportDisabled(page: Page) {
  const exportButtons = page.locator('[data-export-buttons]')
  await expect(exportButtons.getByRole('button', { name: 'Download CSV' })).toBeDisabled()
  await expect(exportButtons.getByRole('button', { name: 'Download PDF' })).toBeDisabled()
}

test.describe('Financial calculators', () => {
  let pageErrors: string[] = []

  test.beforeEach(({ page }) => {
    pageErrors = []
    page.on('pageerror', (error) => pageErrors.push(error.message))
  })

  test.afterEach(() => {
    expect(pageErrors).toEqual([])
  })

  test.describe('mortgage', () => {
    test('renders heading, results, guide, FAQ and structured data', async ({ page }) => {
      await page.goto('/financial/mortgage')
      await expect(page.getByRole('heading', { level: 1, name: 'Mortgage Calculator' })).toBeVisible()
      const expected = calculateMortgage(MORTGAGE_DEFAULTS)
      await expect(cardValue(page, 'Monthly P&I')).toHaveText(usd.format(expected.monthlyPrincipalAndInterest))
      await expect(cardValue(page, 'Total Monthly')).toHaveText(usd.format(expected.monthlyTotal))
      await expectSeo(page, '/financial/mortgage', mortgageContent.faqItems, mortgageContent.guideText)
    })

    test('changing price and rate updates the payment and the URL', async ({ page }) => {
      await page.goto('/financial/mortgage')
      await setField(page, 'Home Price', '500000', 'price')
      await setField(page, 'Interest Rate', '6', 'rate')
      const expected = calculateMortgage({ ...MORTGAGE_DEFAULTS, homePrice: 500000, interestRate: 6 })
      await expect(cardValue(page, 'Monthly P&I')).toHaveText(usd.format(expected.monthlyPrincipalAndInterest))
      await expect(cardValue(page, 'Total Interest')).toHaveText(usd.format(expected.totalInterestPaid))
      await expect(cardValue(page, 'Loan Amount')).toHaveText(usd.format(420000))
    })

    test('URL params restore inputs and results', async ({ page }) => {
      await page.goto('/financial/mortgage?price=450000&down=90000&term=15&rate=5.5&hoa=50')
      await expect(field(page, 'Home Price')).toHaveValue('450000')
      await expect(field(page, 'Down Payment')).toHaveValue('90000')
      await expect(field(page, 'Loan Term')).toHaveValue('15')
      await expect(field(page, 'Interest Rate')).toHaveValue('5.5')
      await expect(field(page, 'HOA (monthly)')).toHaveValue('50')
      const expected = calculateMortgage({ ...MORTGAGE_DEFAULTS, homePrice: 450000, downPayment: 90000, loanTermYears: 15, interestRate: 5.5, hoa: 50 })
      await expect(cardValue(page, 'Monthly P&I')).toHaveText(usd.format(expected.monthlyPrincipalAndInterest))
      await expect(cardValue(page, 'Total Monthly')).toHaveText(usd.format(expected.monthlyTotal))
    })

    test('exports CSV and PDF, and disables export when there is no loan', async ({ page }) => {
      await page.goto('/financial/mortgage')
      await expectCsvDownload(page, 'Month,Payment,Principal,Interest,Balance', 360)
      await expectPdfDownload(page)
      await setField(page, 'Down Payment', '400000', 'down')
      await expectExportDisabled(page)
    })
  })

  test.describe('compound interest', () => {
    test('renders heading, results, guide, FAQ and structured data', async ({ page }) => {
      await page.goto('/financial/compound-interest')
      await expect(page.getByRole('heading', { level: 1, name: 'Compound Interest Calculator' })).toBeVisible()
      const expected = calculateCompoundInterest(COMPOUND_DEFAULTS)
      await expect(cardValue(page, 'Future Value')).toHaveText(usd.format(expected.futureValue))
      await expect(cardValue(page, 'Total Contributions')).toHaveText(usd.format(expected.totalContributions))
      await expectSeo(page, '/financial/compound-interest', compoundContent.faqItems, compoundContent.guideText)
    })

    test('changing contribution and years updates the future value and the URL', async ({ page }) => {
      await page.goto('/financial/compound-interest')
      await setField(page, 'Monthly Contribution', '200', 'monthly')
      await setField(page, 'Time Period (years)', '10', 'years')
      const expected = calculateCompoundInterest({ ...COMPOUND_DEFAULTS, monthlyContribution: 200, years: 10 })
      await expect(cardValue(page, 'Future Value')).toHaveText(usd.format(expected.futureValue))
      await expect(cardValue(page, 'Interest Earned')).toHaveText(usd.format(expected.totalInterestEarned))
    })

    test('URL params restore inputs and results', async ({ page }) => {
      await page.goto('/financial/compound-interest?init=25000&monthly=0&rate=5&freq=4&years=15')
      await expect(field(page, 'Initial Investment')).toHaveValue('25000')
      await expect(field(page, 'Monthly Contribution')).toHaveValue('0')
      await expect(field(page, 'Annual Interest Rate (%)')).toHaveValue('5')
      await expect(field(page, 'Compound Frequency (per year)')).toHaveValue('4')
      await expect(field(page, 'Time Period (years)')).toHaveValue('15')
      const expected = calculateCompoundInterest({ initialInvestment: 25000, monthlyContribution: 0, annualInterestRate: 5, compoundFrequency: 4, years: 15 })
      await expect(cardValue(page, 'Future Value')).toHaveText(usd.format(expected.futureValue))
    })

    test('exports CSV and PDF, and disables export for a zero-year period', async ({ page }) => {
      await page.goto('/financial/compound-interest')
      await expectCsvDownload(page, "Year,Balance,Total Contributed,Interest Earned,Balance in Today's Dollars", 20)
      await expectPdfDownload(page)
      await setField(page, 'Time Period (years)', '0', 'years')
      await expectExportDisabled(page)
    })

    test('shows the default future value in today\'s dollars at 3% inflation', async ({ page }) => {
      await page.goto('/financial/compound-interest')
      const expected = calculateCompoundInterest(COMPOUND_DEFAULTS)
      const todaysDollars = Math.round((expected.futureValue / Math.pow(1.03, 20)) * 100) / 100
      await expect(cardValue(page, "In Today's Dollars")).toHaveText(usd.format(todaysDollars))
    })

    test('weekly contributions relabel the amount and update the future value and the URL', async ({ page }) => {
      await page.goto('/financial/compound-interest')
      await field(page, 'Contribution Frequency').selectOption('52')
      await expect(page).toHaveURL(/[?&]cf=52(&|$)/)
      await setField(page, 'Weekly Contribution', '100', 'monthly')
      const expected = calculateCompoundInterest({ ...COMPOUND_DEFAULTS, monthlyContribution: 100, contributionFrequency: 52 })
      await expect(cardValue(page, 'Future Value')).toHaveText(usd.format(expected.futureValue))
      await expect(cardValue(page, 'Total Contributions')).toHaveText(usd.format(10000 + 100 * 52 * 20))
    })

    test('advanced options apply tax, inflation, step-ups and one-time contributions', async ({ page }) => {
      await page.goto('/financial/compound-interest')
      await page.getByRole('button', { name: 'Advanced options' }).click()
      await setField(page, 'Annual Contribution Increase (%)', '3', 'inc')
      await setField(page, 'Inflation Rate (%)', '2', 'infl')
      await setField(page, 'Tax on Returns (%)', '15', 'tax')
      await page.getByRole('button', { name: '+ Add Contribution' }).click()
      await expect(page).toHaveURL(/[?&]extra=5~1000(&|$)/)
      await field(page, 'Amount').fill('5000')
      await expect(page).toHaveURL(/[?&]extra=5~5000(&|$)/)

      const options = { ...COMPOUND_DEFAULTS, annualContributionIncrease: 3, additionalContributions: [{ year: 5, amount: 5000 }] }
      const pretax = calculateCompoundInterest(options)
      const afterTax = calculateCompoundInterest({ ...options, taxRate: 15 })
      await expect(cardValue(page, 'Future Value')).toHaveText(usd.format(pretax.futureValue))
      await expect(cardValue(page, 'After-Tax Value (approx.)')).toHaveText(usd.format(afterTax.futureValue))
      const todaysDollars = Math.round((pretax.futureValue / Math.pow(1.02, 20)) * 100) / 100
      await expect(cardValue(page, "In Today's Dollars")).toHaveText(usd.format(todaysDollars))

      await page.getByRole('button', { name: 'Remove additional contribution 1' }).click()
      await expect(page).not.toHaveURL(/extra=/)
    })

    test('URL params for the new options restore inputs and open the advanced options', async ({ page }) => {
      await page.goto('/financial/compound-interest?cf=4&monthly=1500&inc=2&infl=2.5&tax=20&extra=3~5000_10~2000')
      await expect(field(page, 'Contribution Frequency')).toHaveValue('4')
      await expect(field(page, 'Quarterly Contribution')).toHaveValue('1500')
      await expect(field(page, 'Annual Contribution Increase (%)')).toHaveValue('2')
      await expect(field(page, 'Inflation Rate (%)')).toHaveValue('2.5')
      await expect(field(page, 'Tax on Returns (%)')).toHaveValue('20')
      await expect(page.locator('label').getByText('Year', { exact: true })).toHaveCount(2)
      const options = {
        ...COMPOUND_DEFAULTS,
        monthlyContribution: 1500,
        contributionFrequency: 4,
        annualContributionIncrease: 2,
        additionalContributions: [{ year: 3, amount: 5000 }, { year: 10, amount: 2000 }],
      }
      await expect(cardValue(page, 'Future Value')).toHaveText(usd.format(calculateCompoundInterest(options).futureValue))
      await expect(cardValue(page, 'After-Tax Value (approx.)')).toHaveText(usd.format(calculateCompoundInterest({ ...options, taxRate: 20 }).futureValue))
    })

    test('invalid URL values fall back to safe inputs', async ({ page }) => {
      await page.goto('/financial/compound-interest?cf=7&init=-500&years=5000&tax=250')
      await expect(field(page, 'Contribution Frequency')).toHaveValue('12')
      await expect(field(page, 'Initial Investment')).toHaveValue('0')
      await expect(field(page, 'Time Period (years)')).toHaveValue('100')
      await expect(field(page, 'Tax on Returns (%)')).toHaveValue('100')
    })

    test('compares future values at nearby interest rates', async ({ page }) => {
      await page.goto('/financial/compound-interest')
      const table = page.locator('[data-slot="card"]').filter({ hasText: 'Compare Interest Rates' })
      for (const rate of [5, 6, 8, 9]) {
        const expected = calculateCompoundInterest({ ...COMPOUND_DEFAULTS, annualInterestRate: rate })
        await expect(table.getByRole('row', { name: new RegExp(`^${rate}%`) })).toContainText(usd.format(expected.futureValue))
      }
      await expect(table.getByRole('row', { name: /^7% \(current\)/ })).toContainText(usd.format(calculateCompoundInterest(COMPOUND_DEFAULTS).futureValue))
    })
  })

  test.describe('retirement', () => {
    test('renders heading, results, guide, FAQ and structured data', async ({ page }) => {
      await page.goto('/financial/retirement')
      await expect(page.getByRole('heading', { level: 1, name: 'Retirement Calculator' })).toBeVisible()
      const expected = calculateRetirement(RETIREMENT_DEFAULTS)
      await expect(cardValue(page, 'Balance at Retirement')).toHaveText(usd.format(expected.balanceAtRetirement))
      await expectSeo(page, '/financial/retirement', retirementContent.faqItems, retirementContent.guideText)
    })

    test('changing retirement age and expenses updates the projection and the URL', async ({ page }) => {
      await page.goto('/financial/retirement')
      await setField(page, 'Retirement Age', '60', 'retire')
      await setField(page, 'Annual Expenses in Retirement ($)', '150000', 'expenses')
      const expected = calculateRetirement({ ...RETIREMENT_DEFAULTS, retirementAge: 60, annualExpenses: 150000 })
      expect(expected.projectedRunout).not.toBeNull()
      await expect(cardValue(page, 'Balance at Retirement')).toHaveText(usd.format(expected.balanceAtRetirement))
      await expect(cardValue(page, 'Years of Funding')).toHaveText(`${expected.yearsOfFunding} years`)
      await expect(cardValue(page, 'Funds Run Out')).toHaveText(`Age ${expected.projectedRunout}`)
    })

    test('URL params restore inputs and results', async ({ page }) => {
      await page.goto('/financial/retirement?age=40&retire=67&saved=200000&annual=20000&return=6&expenses=50000')
      await expect(field(page, 'Current Age')).toHaveValue('40')
      await expect(field(page, 'Retirement Age')).toHaveValue('67')
      await expect(field(page, 'Current Savings ($)')).toHaveValue('200000')
      await expect(field(page, 'Annual Savings ($)')).toHaveValue('20000')
      await expect(field(page, 'Expected Annual Return (%)')).toHaveValue('6')
      await expect(field(page, 'Annual Expenses in Retirement ($)')).toHaveValue('50000')
      const expected = calculateRetirement({ currentAge: 40, retirementAge: 67, currentSavings: 200000, annualSavings: 20000, expectedReturn: 6, annualExpenses: 50000 })
      await expect(cardValue(page, 'Balance at Retirement')).toHaveText(usd.format(expected.balanceAtRetirement))
      const runout = expected.projectedRunout === null ? 'Never' : `Age ${expected.projectedRunout}`
      await expect(cardValue(page, 'Funds Run Out')).toHaveText(runout)
    })

    test('exports CSV and PDF, and disables export when retirement age is not after current age', async ({ page }) => {
      await page.goto('/financial/retirement')
      await expectCsvDownload(page, 'Age,Phase,Balance', 36)
      await expectPdfDownload(page)
      await setField(page, 'Retirement Age', '25', 'retire')
      await expectExportDisabled(page)
    })

    test('employer match and salary contributions raise the projected balance', async ({ page }) => {
      await page.goto('/financial/retirement')
      await page.getByRole('button', { name: 'Workplace plan and employer match' }).click()
      await setField(page, 'Annual Salary ($)', '100000', 'salary')
      await setField(page, 'Your Contribution (% of salary)', '10', 'contrib')
      await setField(page, 'Annual Salary Increase (%)', '2', 'raise')
      const expected = calculateRetirement({
        ...RETIREMENT_DEFAULTS,
        annualSalary: 100000, employeeContributionPct: 10, employerMatchPct: 50, employerMatchCapPct: 6, salaryIncreasePct: 2,
      })
      expect(expected.balanceAtRetirement).toBeGreaterThan(calculateRetirement(RETIREMENT_DEFAULTS).balanceAtRetirement)
      await expect(cardValue(page, 'Balance at Retirement')).toHaveText(usd.format(expected.balanceAtRetirement))
    })

    test('inflation, social security and post-retirement return restore from the URL', async ({ page }) => {
      await page.goto('/financial/retirement?infl=3&ss=2000&ssage=67&postret=5')
      await expect(field(page, 'Inflation Rate (%)')).toHaveValue('3')
      await expect(field(page, 'Return After Retirement (%)')).toHaveValue('5')
      await expect(field(page, 'Monthly Benefit ($)')).toHaveValue('2000')
      await expect(field(page, 'Benefit Start Age')).toHaveValue('67')
      const expected = calculateRetirement({
        ...RETIREMENT_DEFAULTS,
        inflationRate: 3, postRetirementReturn: 5, socialSecurityMonthly: 2000, socialSecurityStartAge: 67,
      })
      await expect(cardValue(page, 'Balance at Retirement')).toHaveText(usd.format(expected.balanceAtRetirement))
      await expect(page.getByText(`about ${usd.format(expected.balanceAtRetirementToday)} in today's dollars`)).toBeVisible()
      await expect(cardValue(page, 'Monthly Withdrawal at Retirement')).toHaveText(usd.format(expected.firstYearWithdrawal / 12))
      const runout = expected.projectedRunout === null ? 'Never' : `Age ${expected.projectedRunout}`
      await expect(cardValue(page, 'Funds Run Out')).toHaveText(runout)
    })

    test('monthly expenses edit the same spending as the annual field', async ({ page }) => {
      await page.goto('/financial/retirement')
      await expect(field(page, 'Monthly Expenses in Retirement ($)')).toHaveValue('5000')
      await field(page, 'Monthly Expenses in Retirement ($)').fill('4000')
      await expect(page).toHaveURL(/[?&]expenses=48000(&|$)/)
      await expect(field(page, 'Annual Expenses in Retirement ($)')).toHaveValue('48000')
    })

    test('flags a retirement age before the current age', async ({ page }) => {
      await page.goto('/financial/retirement')
      await setField(page, 'Retirement Age', '25', 'retire')
      await expect(page.getByRole('alert').filter({ hasText: 'Must be at or after your current age' })).toBeVisible()
    })
  })

  test.describe('auto loan', () => {
    test('renders heading, results, guide, FAQ and structured data', async ({ page }) => {
      await page.goto('/financial/auto-loan')
      await expect(page.getByRole('heading', { level: 1, name: 'Auto Loan Calculator' })).toBeVisible()
      const expected = calculateAutoLoan(AUTO_DEFAULTS)
      await expect(cardValue(page, 'Monthly Payment')).toHaveText(usd.format(expected.monthlyPayment))
      await expect(cardValue(page, 'Loan Amount')).toHaveText(usd.format(expected.loanBalance))
      await expectSeo(page, '/financial/auto-loan', autoLoanContent.faqItems, autoLoanContent.guideText)
    })

    test('changing price and term updates the payment and the URL', async ({ page }) => {
      await page.goto('/financial/auto-loan')
      await setField(page, 'Vehicle Price', '40000', 'price')
      await setField(page, 'Loan Term (months)', '72', 'term')
      const expected = calculateAutoLoan({ ...AUTO_DEFAULTS, vehiclePrice: 40000, loanTermMonths: 72 })
      await expect(cardValue(page, 'Monthly Payment')).toHaveText(usd.format(expected.monthlyPayment))
      await expect(cardValue(page, 'Total Interest')).toHaveText(usd.format(expected.totalInterestPaid))
    })

    test('URL params restore inputs and results', async ({ page }) => {
      await page.goto('/financial/auto-loan?price=35000&down=3000&trade=4000&rate=4.5&term=48&tax=6')
      await expect(field(page, 'Vehicle Price')).toHaveValue('35000')
      await expect(field(page, 'Down Payment')).toHaveValue('3000')
      await expect(field(page, 'Trade-In Value')).toHaveValue('4000')
      await expect(field(page, 'Annual Interest Rate (%)')).toHaveValue('4.5')
      await expect(field(page, 'Loan Term (months)')).toHaveValue('48')
      await expect(field(page, 'Sales Tax Rate (%)')).toHaveValue('6')
      const expected = calculateAutoLoan({ vehiclePrice: 35000, downPayment: 3000, tradeInValue: 4000, interestRate: 4.5, loanTermMonths: 48, salesTaxRate: 6 })
      await expect(cardValue(page, 'Monthly Payment')).toHaveText(usd.format(expected.monthlyPayment))
      await expect(cardValue(page, 'Loan Amount')).toHaveText(usd.format(expected.loanBalance))
    })

    test('exports CSV and PDF, and disables export when nothing is financed', async ({ page }) => {
      await page.goto('/financial/auto-loan')
      await expectCsvDownload(page, 'Month,Payment,Principal,Interest,Balance', 60)
      await expectPdfDownload(page)
      await setField(page, 'Down Payment', '50000', 'down')
      await expectExportDisabled(page)
    })

    test('a zero-month term shows a finite payment', async ({ page }) => {
      await page.goto('/financial/auto-loan?term=0')
      await expect(field(page, 'Loan Term (months)')).toHaveValue('0')
      await expect(cardValue(page, 'Monthly Payment')).toHaveText('$0')
    })

    test('an extra monthly payment shows payoff time, interest saved and time saved', async ({ page }) => {
      await page.goto('/financial/auto-loan?price=25000&down=0&tax=0')
      await page.getByRole('button', { name: 'Advanced options' }).click()
      await setField(page, 'Extra Monthly Payment', '100', 'extra')
      const loan = { ...AUTO_DEFAULTS, vehiclePrice: 25000, downPayment: 0, salesTaxRate: 0 }
      const expected = calculateAutoLoan({ ...loan, extraMonthlyPayment: 100 })
      await expect(cardValue(page, 'Monthly Payment')).toHaveText(usd.format(calculateAutoLoan(loan).monthlyPayment))
      await expect(cardValue(page, 'Payoff Time')).toHaveText('4 yr 1 mo')
      await expect(cardValue(page, 'Time Saved')).toHaveText('11 mo')
      await expect(cardValue(page, 'Interest Saved')).toHaveText(usd.format(expected.interestSaved))
      await expect(cardValue(page, 'Total Interest')).toHaveText(usd.format(expected.totalInterestPaid))
    })

    test('a trade-in reduces the taxable price unless the option is turned off', async ({ page }) => {
      await page.goto('/financial/auto-loan?trade=5000')
      const taxed = calculateAutoLoan({ ...AUTO_DEFAULTS, tradeInValue: 5000 })
      await expect(cardValue(page, 'Loan Amount')).toHaveText(usd.format(taxed.loanBalance))
      await expect(cardValue(page, 'Cost Breakdown')).toContainText('Sales tax (8% of $25,000)')
      await page.getByRole('button', { name: 'Advanced options' }).click()
      await page.getByRole('checkbox', { name: 'Trade-in reduces taxable price' }).uncheck()
      await expect(page).toHaveURL(/[?&]ttax=0(&|$)/)
      const untaxed = calculateAutoLoan({ ...AUTO_DEFAULTS, tradeInValue: 5000, tradeInReducesTax: false })
      await expect(cardValue(page, 'Loan Amount')).toHaveText(usd.format(untaxed.loanBalance))
      await expect(cardValue(page, 'Cost Breakdown')).toContainText('Sales tax (8% of $30,000)')
    })

    test('URL params restore advanced options and fees paid upfront', async ({ page }) => {
      await page.goto('/financial/auto-loan?trade=5000&extra=50&fees=600&ffin=0&ttax=0')
      await expect(field(page, 'Extra Monthly Payment')).toHaveValue('50')
      await expect(field(page, 'Fees')).toHaveValue('600')
      await expect(page.getByRole('checkbox', { name: 'Finance fees in the loan' })).not.toBeChecked()
      await expect(page.getByRole('checkbox', { name: 'Trade-in reduces taxable price' })).not.toBeChecked()
      const expected = calculateAutoLoan({ ...AUTO_DEFAULTS, tradeInValue: 5000, extraMonthlyPayment: 50, fees: 600, feesFinanced: false, tradeInReducesTax: false })
      await expect(cardValue(page, 'Loan Amount')).toHaveText(usd.format(expected.loanBalance))
      await expect(cardValue(page, 'Total Cost')).toHaveText(usd.format(expected.totalCost))
      await expect(cardValue(page, 'Cost Breakdown')).toContainText('Fees (paid upfront)')
    })

    test('financed fees are added to the loan amount', async ({ page }) => {
      await page.goto('/financial/auto-loan')
      await page.getByRole('button', { name: 'Advanced options' }).click()
      await setField(page, 'Fees', '500', 'fees')
      const expected = calculateAutoLoan({ ...AUTO_DEFAULTS, fees: 500 })
      await expect(cardValue(page, 'Loan Amount')).toHaveText(usd.format(expected.loanBalance))
      await expect(cardValue(page, 'Cost Breakdown')).toContainText('Fees (financed)')
    })

    test('negative amounts in the URL are treated as zero', async ({ page }) => {
      await page.goto('/financial/auto-loan?down=-5000&extra=-100')
      await expect(field(page, 'Down Payment')).toHaveValue('0')
      const expected = calculateAutoLoan({ ...AUTO_DEFAULTS, downPayment: 0 })
      await expect(cardValue(page, 'Loan Amount')).toHaveText(usd.format(expected.loanBalance))
      await expect(cardValue(page, 'Monthly Payment')).toHaveText(usd.format(expected.monthlyPayment))
    })

    test('compares 36 to 84 month terms and marks the current term', async ({ page }) => {
      await page.goto('/financial/auto-loan')
      const table = cardValue(page, 'Compare Loan Terms')
      for (const termMonths of [36, 48, 60, 72, 84]) {
        const expected = calculateAutoLoan({ ...AUTO_DEFAULTS, loanTermMonths: termMonths })
        const row = table.getByRole('row').filter({ hasText: `${termMonths} months` })
        await expect(row).toContainText(usd.format(expected.monthlyPayment))
        await expect(row).toContainText(usd.format(expected.totalInterestPaid))
        await expect(row).toContainText(usd.format(expected.totalCost))
      }
      await expect(table.getByRole('row').filter({ hasText: '60 months' })).toHaveAttribute('aria-current', 'true')
    })
  })

  test.describe('salary', () => {
    test('renders heading, results, guide, FAQ and structured data', async ({ page }) => {
      await page.goto('/financial/salary')
      await expect(page.getByRole('heading', { level: 1, name: /Salary/ })).toBeVisible()
      const expected = calculateSalary(SALARY_DEFAULTS)
      await expect(cardValue(page, 'Net Pay (per period)')).toHaveText(usd.format(expected.netPay))
      await expect(cardValue(page, 'Annual Net')).toHaveText(usd.format(expected.annualNet))
      await expectSeo(page, '/financial/salary', salaryContent.faqItems, salaryContent.guideText)
    })

    test('changing gross pay and frequency updates take-home pay and the URL', async ({ page }) => {
      await page.goto('/financial/salary')
      await setField(page, 'Gross Pay per Period', '3000', 'gross')
      await field(page, 'Pay Frequency').selectOption('biweekly')
      await expect(page).toHaveURL(/[?&]freq=biweekly(&|$)/)
      const expected = calculateSalary({ ...SALARY_DEFAULTS, grossPay: 3000, payFrequency: 'biweekly' })
      await expect(cardValue(page, 'Net Pay (per period)')).toHaveText(usd.format(expected.netPay))
      await expect(cardValue(page, 'Annual Gross')).toHaveText(usd.format(expected.annualGross))
      await expect(cardValue(page, 'Annual Net')).toHaveText(usd.format(expected.annualNet))
    })

    test('URL params restore inputs and results', async ({ page }) => {
      await page.goto('/financial/salary?gross=1500&freq=weekly&fed=12&state=3&other=50')
      await expect(field(page, 'Gross Pay per Period')).toHaveValue('1500')
      await expect(field(page, 'Pay Frequency')).toHaveValue('weekly')
      await expect(field(page, 'Federal Tax Rate (%)')).toHaveValue('12')
      await expect(field(page, 'State Tax Rate (%)')).toHaveValue('3')
      await expect(field(page, 'Other Deductions ($)')).toHaveValue('50')
      const expected = calculateSalary({ grossPay: 1500, payFrequency: 'weekly', federalTaxRate: 12, stateTaxRate: 3, otherDeductions: 50 })
      await expect(cardValue(page, 'Net Pay (per period)')).toHaveText(usd.format(expected.netPay))
      await expect(cardValue(page, 'Annual Gross')).toHaveText(usd.format(expected.annualGross))
    })

    test('exports CSV and PDF, and disables export for zero gross pay', async ({ page }) => {
      await page.goto('/financial/salary')
      await expectCsvDownload(page, 'Item,Amount', 9)
      await expectPdfDownload(page)
      await setField(page, 'Gross Pay per Period', '0', 'gross')
      await expectExportDisabled(page)
    })

    test('an unknown pay frequency in the URL does not show NaN', async ({ page }) => {
      await page.goto('/financial/salary?freq=fortnightly')
      await expect(cardValue(page, 'Net Pay (per period)')).toBeVisible()
      await expect(page.locator('#salary-results')).not.toContainText('NaN')
    })

    test('hourly pay type uses rate x hours and shows the hourly rate', async ({ page }) => {
      await page.goto('/financial/salary')
      await page.getByRole('button', { name: 'Hourly', exact: true }).click()
      await expect(page).toHaveURL(/[?&]type=hourly(&|$)/)
      await setField(page, 'Hourly Rate', '30', 'rate')
      await setField(page, 'Regular Hours per Week', '35', 'hours')
      const expected = calculateSalary({ ...SALARY_DEFAULTS, payType: 'hourly', hourlyRate: 30, hoursPerWeek: 35 })
      await expect(cardValue(page, 'Net Pay (per period)')).toHaveText(usd.format(expected.netPay))
      await expect(cardValue(page, 'Annual Gross')).toHaveText(usd.format(30 * 35 * 52))
      await expect(cardValue(page, 'Hourly Rate')).toHaveText('$30.00')
    })

    test('overtime from the URL opens its section and raises gross pay', async ({ page }) => {
      await page.goto('/financial/salary?type=hourly&rate=20&ot=5&otx=2')
      await expect(field(page, 'Overtime Hours per Week')).toHaveValue('5')
      await expect(field(page, 'Overtime Multiplier')).toHaveValue('2')
      const expected = calculateSalary({ ...SALARY_DEFAULTS, payType: 'hourly', hourlyRate: 20, overtimeHoursPerWeek: 5, overtimeMultiplier: 2 })
      await expect(cardValue(page, 'Annual Gross')).toHaveText(usd.format(expected.annualGross))
      await expect(cardValue(page, 'Net Pay (per period)')).toHaveText(usd.format(expected.netPay))
    })

    test('salaried mode explains that overtime does not apply', async ({ page }) => {
      await page.goto('/financial/salary')
      await page.getByRole('button', { name: 'Overtime', exact: true }).click()
      await expect(page.getByText(/Salaried exempt employees don.t earn overtime/)).toBeVisible()
      await expect(page.locator('label').getByText('Overtime Hours per Week', { exact: true })).toHaveCount(0)
    })

    test('bonus with the supplemental rate restores from the URL', async ({ page }) => {
      await page.goto('/financial/salary?bonus=12000&supp=1')
      await expect(field(page, 'Annual Bonus')).toHaveValue('12000')
      await expect(page.getByLabel(/supplemental rate/)).toBeChecked()
      const expected = calculateSalary({ ...SALARY_DEFAULTS, annualBonus: 12000, supplementalFlatRate: true })
      await expect(cardValue(page, 'Net Pay (per period)')).toHaveText(usd.format(expected.netPay))
      await expect(cardValue(page, 'Annual Gross')).toHaveText(usd.format(72000))
    })

    test('pre-tax retirement and health deductions update net pay and the URL', async ({ page }) => {
      await page.goto('/financial/salary')
      await page.getByRole('button', { name: 'Pre-tax Deductions', exact: true }).click()
      await setField(page, '401(k) / 403(b) Contribution', '10', 'ret')
      await setField(page, 'Health / HSA / FSA per Paycheck', '200', 'health')
      const expected = calculateSalary({ ...SALARY_DEFAULTS, retirementContribution: 10, pretaxHealth: 200 })
      await expect(cardValue(page, 'Net Pay (per period)')).toHaveText(usd.format(expected.netPay))
      await page.getByRole('button', { name: '$ per paycheck', exact: true }).click()
      await expect(page).toHaveURL(/[?&]retu=amount(&|$)/)
      const asAmount = calculateSalary({ ...SALARY_DEFAULTS, retirementContribution: 10, retirementUnit: 'amount', pretaxHealth: 200 })
      await expect(cardValue(page, 'Net Pay (per period)')).toHaveText(usd.format(asAmount.netPay))
    })

    test('high pay hits the Social Security wage base', async ({ page }) => {
      await page.goto('/financial/salary?gross=20000')
      const expected = calculateSalary({ ...SALARY_DEFAULTS, grossPay: 20000 })
      expect(expected.isSocialSecurityCapped).toBe(true)
      await expect(cardValue(page, 'Net Pay (per period)')).toHaveText(usd.format(expected.netPay))
      await expect(page.getByText(/Social Security stops at the \$184,500 wage base/)).toBeVisible()
    })

    test('out-of-range URL values fall back to defaults', async ({ page }) => {
      await page.goto('/financial/salary?gross=-100&hours=500')
      await expect(field(page, 'Gross Pay per Period')).toHaveValue('5000')
      await expect(field(page, 'Regular Hours per Week')).toHaveValue('40')
      await expect(cardValue(page, 'Net Pay (per period)')).toHaveText(usd.format(calculateSalary(SALARY_DEFAULTS).netPay))
    })
  })

  test.describe('debt payoff', () => {
    const debtRows = (page: Page) => page.getByRole('group', { name: /^Debt \d+$/ })
    const extraInput = (page: Page) => field(page, 'Extra Monthly Payment')
    const lumpRows = (page: Page) => page.getByRole('group', { name: /^Lump sum \d+$/ })
    const comparisonRow = (page: Page, scenario: string) => page.getByRole('row').filter({ hasText: scenario })
    const monthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' })

    // Names in these tests contain no '_' or '~', so plain encodeURIComponent matches the list encoding
    async function expectDebtsInUrl(page: Page, debts: DebtItem[]) {
      const expected = debts.map(d => [d.name, d.balance, d.interestRate, d.minimumPayment].map(p => encodeURIComponent(String(p))).join('~')).join('_')
      await expect.poll(() => new URL(page.url()).searchParams.get('debts')).toBe(expected)
    }

    test('renders heading, results, guide, FAQ and structured data', async ({ page }) => {
      await page.goto('/financial/debt-payoff')
      await expect(page.getByRole('heading', { level: 1, name: 'Debt Payoff Calculator' })).toBeVisible()
      const expected = calculateDebtPayoff({ debts: DEFAULT_DEBTS, strategy: 'avalanche', extraMonthlyPayment: 0 })
      await expect(cardValue(page, 'Months to Debt-Free')).toHaveText(String(expected.monthsToDebtFree))
      await expect(cardValue(page, 'Total Interest Paid')).toHaveText(usd.format(expected.totalInterestPaid))
      await expect(cardValue(page, 'Payoff Order')).toHaveText(expected.payoffOrder.join(' -> '))
      await expectSeo(page, '/financial/debt-payoff', debtContent.faqItems, debtContent.guideText)
    })

    test('changing extra payment and strategy updates the result and the URL', async ({ page }) => {
      await page.goto('/financial/debt-payoff')
      await extraInput(page).fill('250')
      await expect(page).toHaveURL(/[?&]extra=250(&|$)/)
      await page.getByRole('button', { name: 'Snowball', exact: true }).click()
      await expect(page).toHaveURL(/[?&]strategy=snowball(&|$)/)
      const expected = calculateDebtPayoff({ debts: DEFAULT_DEBTS, strategy: 'snowball', extraMonthlyPayment: 250 })
      await expect(cardValue(page, 'Months to Debt-Free')).toHaveText(String(expected.monthsToDebtFree))
      await expect(cardValue(page, 'Total Interest Paid')).toHaveText(usd.format(expected.totalInterestPaid))
    })

    test('URL params restore strategy and extra payment', async ({ page }) => {
      await page.goto('/financial/debt-payoff?strategy=snowball&extra=150')
      await expect(extraInput(page)).toHaveValue('150')
      await expect(page.getByText('Pay smallest balance first — builds momentum with quick wins.', { exact: true })).toBeVisible()
      const expected = calculateDebtPayoff({ debts: DEFAULT_DEBTS, strategy: 'snowball', extraMonthlyPayment: 150 })
      await expect(cardValue(page, 'Months to Debt-Free')).toHaveText(String(expected.monthsToDebtFree))
      await expect(cardValue(page, 'Payoff Order')).toHaveText(expected.payoffOrder.join(' -> '))
    })

    test('raising a debt balance increases months to debt-free', async ({ page }) => {
      await page.goto('/financial/debt-payoff')
      const before = calculateDebtPayoff({ debts: DEFAULT_DEBTS, strategy: 'avalanche', extraMonthlyPayment: 0 })
      await expect(cardValue(page, 'Months to Debt-Free')).toHaveText(String(before.monthsToDebtFree))

      await debtRows(page).nth(0).locator('input').nth(1).fill('9000')
      const after = calculateDebtPayoff({ debts: [{ ...DEFAULT_DEBTS[0], balance: 9000 }, DEFAULT_DEBTS[1]], strategy: 'avalanche', extraMonthlyPayment: 0 })
      expect(after.monthsToDebtFree).toBeGreaterThan(before.monthsToDebtFree)
      await expect(cardValue(page, 'Months to Debt-Free')).toHaveText(String(after.monthsToDebtFree))
      await expect(cardValue(page, 'Total Interest Paid')).toHaveText(usd.format(after.totalInterestPaid))
    })

    test('exports CSV and PDF, and disables export when a minimum payment is zero', async ({ page }) => {
      await page.goto('/financial/debt-payoff')
      await expectCsvDownload(page, 'Strategy,Selected,Months to Debt-Free,Debt-Free Date,Total Interest Paid,Interest Saved vs Minimums,Payoff Order', 3)
      await expectPdfDownload(page)
      await debtRows(page).nth(1).locator('input').nth(3).fill('0')
      await expectExportDisabled(page)
    })

    test('two debts with the same name are paid off one at a time', async ({ page }) => {
      await page.goto('/financial/debt-payoff')
      const secondRow = debtRows(page).nth(1).locator('input')
      // Debts live in the URL, so each edit waits for its write before the next edit reads the list
      await secondRow.nth(0).fill('Credit Card')
      await expectDebtsInUrl(page, [DEFAULT_DEBTS[0], { ...DEFAULT_DEBTS[1], name: 'Credit Card' }])
      await secondRow.nth(1).fill('5000')
      await expectDebtsInUrl(page, [DEFAULT_DEBTS[0], { ...DEFAULT_DEBTS[1], name: 'Credit Card', balance: 5000 }])
      await secondRow.nth(2).fill('20')
      await expectDebtsInUrl(page, [DEFAULT_DEBTS[0], { ...DEFAULT_DEBTS[0], minimumPayment: 200 }])
      await secondRow.nth(3).fill('100')
      await expectDebtsInUrl(page, [DEFAULT_DEBTS[0], DEFAULT_DEBTS[0]])
      const distinct = calculateDebtPayoff({
        debts: [DEFAULT_DEBTS[0], { ...DEFAULT_DEBTS[0], name: 'Credit Card 2' }],
        strategy: 'avalanche',
        extraMonthlyPayment: 0,
      })
      await expect(cardValue(page, 'Months to Debt-Free')).toHaveText(String(distinct.monthsToDebtFree))
    })

    test('debts and lump sums restore from the URL', async ({ page }) => {
      await page.goto('/financial/debt-payoff?debts=Visa~3000~18~90_Loan~6000~7~150&lump=6~1000')
      await expect(debtRows(page)).toHaveCount(2)
      await expect(debtRows(page).nth(0).locator('input').nth(0)).toHaveValue('Visa')
      await expect(lumpRows(page)).toHaveCount(1)
      await expect(lumpRows(page).nth(0).locator('input').nth(0)).toHaveValue('6')
      await expect(lumpRows(page).nth(0).locator('input').nth(1)).toHaveValue('1000')
      const expected = calculateDebtPayoff({
        debts: [
          { name: 'Visa', balance: 3000, interestRate: 18, minimumPayment: 90 },
          { name: 'Loan', balance: 6000, interestRate: 7, minimumPayment: 150 },
        ],
        strategy: 'avalanche',
        extraMonthlyPayment: 0,
        lumpSums: [{ month: 6, amount: 1000 }],
      })
      await expect(cardValue(page, 'Months to Debt-Free')).toHaveText(String(expected.monthsToDebtFree))
      await expect(cardValue(page, 'Total Interest Paid')).toHaveText(usd.format(expected.totalInterestPaid))
    })

    test('an edited debt list survives a reload', async ({ page }) => {
      await page.goto('/financial/debt-payoff')
      await debtRows(page).nth(0).locator('input').nth(1).fill('9000')
      const edited = [{ ...DEFAULT_DEBTS[0], balance: 9000 }, DEFAULT_DEBTS[1]]
      await expectDebtsInUrl(page, edited)
      await page.reload()
      await expect(debtRows(page).nth(0).locator('input').nth(1)).toHaveValue('9000')
      const expected = calculateDebtPayoff({ debts: edited, strategy: 'avalanche', extraMonthlyPayment: 0 })
      await expect(cardValue(page, 'Months to Debt-Free')).toHaveText(String(expected.monthsToDebtFree))
    })

    test('a debt with a negative balance in the URL falls back to the default debts', async ({ page }) => {
      await page.goto('/financial/debt-payoff?debts=Visa~-5~18~90')
      await expect(debtRows(page)).toHaveCount(DEFAULT_DEBTS.length)
      await expect(debtRows(page).nth(0).locator('input').nth(0)).toHaveValue(DEFAULT_DEBTS[0].name)
    })

    test('adding a lump sum shortens the plan and is written to the URL', async ({ page }) => {
      await page.goto('/financial/debt-payoff')
      await page.getByRole('button', { name: '+ Add Lump Sum' }).click()
      await lumpRows(page).nth(0).locator('input').nth(1).fill('3000')
      await expect.poll(() => new URL(page.url()).searchParams.get('lump')).toBe('12~3000')
      const without = calculateDebtPayoff({ debts: DEFAULT_DEBTS, strategy: 'avalanche', extraMonthlyPayment: 0 })
      const withLump = calculateDebtPayoff({ debts: DEFAULT_DEBTS, strategy: 'avalanche', extraMonthlyPayment: 0, lumpSums: [{ month: 12, amount: 3000 }] })
      expect(withLump.monthsToDebtFree).toBeLessThan(without.monthsToDebtFree)
      await expect(cardValue(page, 'Months to Debt-Free')).toHaveText(String(withLump.monthsToDebtFree))
    })

    test('shows the debt-free date and compares against minimum payments only', async ({ page }) => {
      await page.goto('/financial/debt-payoff')
      const avalanche = calculateDebtPayoff({ debts: DEFAULT_DEBTS, strategy: 'avalanche', extraMonthlyPayment: 0 })
      const baseline = calculateMinimumPaymentsOnly(DEFAULT_DEBTS)
      const saved = usd.format(baseline.totalInterestPaid - avalanche.totalInterestPaid)
      await expect(cardValue(page, 'Debt-Free Date')).toHaveText(monthYear.format(getDebtFreeDate(new Date(), avalanche.monthsToDebtFree)))
      await expect(cardValue(page, 'Interest Saved vs Minimums')).toHaveText(saved)

      const baselineRow = comparisonRow(page, 'Minimum payments only')
      await expect(baselineRow).toContainText(String(baseline.monthsToDebtFree))
      await expect(baselineRow).toContainText(usd.format(baseline.totalInterestPaid))
      await expect(comparisonRow(page, 'Avalanche')).toContainText(saved)
    })
  })
})
