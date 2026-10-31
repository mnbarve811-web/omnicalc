import fs from 'node:fs'
import path from 'node:path'
import { describe, it, expect } from 'vitest'
import sitemap from '@/app/sitemap'
import robots from '@/app/robots'
import { SITE_URL } from '@/lib/site-url'

const APP_DIR = path.join(process.cwd(), 'src', 'app')

function findPageRoutes(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return findPageRoutes(full)
    if (entry.name !== 'page.tsx') return []
    const route = path.relative(APP_DIR, dir).split(path.sep).join('/')
    return [route === '' ? '/' : `/${route}`]
  })
}

describe('sitemap', () => {
  it('lists every page in the app exactly once, as an absolute URL', () => {
    const urls = sitemap().map((entry) => entry.url)
    const expected = findPageRoutes(APP_DIR).map((route) => (route === '/' ? SITE_URL : `${SITE_URL}${route}`))
    expect([...urls].sort()).toEqual([...expected].sort())
    expect(new Set(urls).size).toBe(urls.length)
  })

  it('covers the home page, 4 pillar hubs, and 19 calculators', () => {
    expect(sitemap()).toHaveLength(24)
  })
})

describe('robots', () => {
  it('allows all crawlers and points to the sitemap', () => {
    const result = robots()
    expect(result.rules).toEqual({ userAgent: '*', allow: '/' })
    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`)
  })
})
