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
  // Scoped to the header: the footer has its own always-visible navigation
  const headerNav = page.getByRole('banner').getByRole('navigation')
  if (viewport && viewport.width < 640) {
    // On mobile the category links live behind the menu button
    await page.getByRole('button', { name: 'Open menu' }).click()
    await expect(page.locator('#mobile-menu').getByRole('link', { name: 'Utility Calculators' })).toBeVisible()
    return
  }
  await expect(headerNav.getByText('Utility')).toBeVisible()
})

test('about page has every policy section and a canonical link', async ({ page }) => {
  await page.goto('/about')
  await expect(page.getByRole('heading', { level: 1, name: 'About OmniCalc' })).toBeVisible()
  for (const [id, heading] of [
    ['about', 'About Us'],
    ['faq', 'Frequently Asked Questions'],
    ['contact', 'Contact Us'],
    ['privacy', 'Privacy Policy'],
    ['terms', 'Terms of Use'],
  ]) {
    await expect(page.locator(`section#${id}`).getByRole('heading', { level: 2, name: heading })).toBeVisible()
  }
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/about$/)
})

test('footer links jump to the about, privacy, and terms sections', async ({ page }) => {
  await page.goto('/')
  const footer = page.getByRole('contentinfo')
  for (const [name, hash] of [['About', '#about'], ['Privacy Policy', '#privacy'], ['Terms of Use', '#terms']]) {
    await footer.getByRole('link', { name, exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`/about${hash}$`))
    await expect(page.locator(`section${hash}`)).toBeInViewport()
    await page.goto('/')
  }
})
