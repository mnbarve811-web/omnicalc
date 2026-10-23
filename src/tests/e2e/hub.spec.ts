import { test, expect } from '@playwright/test'

test('hub page loads and shows four pillar cards', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('OmniCalc')
  await expect(page.locator('text=Financial Calculators')).toBeVisible()
  await expect(page.locator('text=Fitness & Health')).toBeVisible()
  await expect(page.locator('text=Math & Scientific')).toBeVisible()
  await expect(page.locator('text=Utility')).toBeVisible()
})
