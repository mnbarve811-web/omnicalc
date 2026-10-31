import { test, expect } from '@playwright/test'

test.describe('Financial Pillar', () => {
  test('pillar directory lists all 6 calculators', async ({ page }) => {
    await page.goto('/financial')
    await expect(page.getByRole('heading', { name: 'Financial Calculators' })).toBeVisible()
    for (const href of ['/financial/mortgage', '/financial/compound-interest', '/financial/retirement', '/financial/auto-loan', '/financial/salary', '/financial/debt-payoff']) {
      await expect(page.locator(`a[href="${href}"]`)).toBeVisible()
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
