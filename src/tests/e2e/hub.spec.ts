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

test('buttons and tabs on calculator pages meet the 44px mobile touch target', async ({ page, viewport }) => {
  test.skip(!viewport || viewport.width >= 768, 'touch target size applies to the mobile layout')
  const undersized: string[] = []
  for (const path of ['/financial/mortgage', '/financial/debt-payoff', '/fitness/tdee', '/fitness/body-fat', '/fitness/macro']) {
    await page.goto(path)
    await page.locator('[data-export-buttons]').waitFor()
    for (const control of await page.locator('main button, main [role="tab"]').all()) {
      if (!(await control.isVisible())) continue
      const box = await control.boundingBox()
      if (box && box.height < 44) undersized.push(`${path} "${(await control.innerText()).trim()}" ${Math.round(box.height)}px`)
    }
  }
  expect(undersized).toEqual([])
})

test('the mobile result bar hides while a field has focus so it cannot cover it', async ({ page, viewport }) => {
  test.skip(!viewport || viewport.width >= 1024, 'the result bar only exists below the desktop layout')
  await page.goto('/financial/mortgage')
  const bar = page.getByRole('link', { name: /See breakdown/ })
  await expect(bar).toBeVisible()
  await page.getByLabel('Home Price', { exact: true }).focus()
  await expect(bar).toBeHidden()
  await page.getByLabel('Home Price', { exact: true }).blur()
  await expect(bar).toBeVisible()
})
