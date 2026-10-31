import { test, expect } from '@playwright/test'

test('hub page loads and shows four pillar cards', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('OmniCalc')
  await expect(page.locator('text=Financial Calculators')).toBeVisible()
  await expect(page.locator('text=Fitness & Health')).toBeVisible()
  await expect(page.locator('text=Math & Scientific')).toBeVisible()
  await expect(page.locator('[data-slot="card-title"]', { hasText: 'Utility' })).toBeVisible()
})

test('nav contains Utility link', async ({ page, viewport }) => {
  await page.goto('/')
  if (viewport && viewport.width < 640) {
    // Nav uses hidden sm:flex — should not be visible on mobile
    await expect(page.getByRole('navigation')).toBeHidden()
    return
  }
  await expect(page.getByRole('navigation').getByText('Utility')).toBeVisible()
})
