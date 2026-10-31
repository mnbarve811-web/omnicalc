import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-url'

// Keep in sync with the pages under src/app; tests/unit/seo-routes.test.ts fails if a page is missing
const ROUTES = [
  '/',
  '/financial',
  '/financial/mortgage',
  '/financial/compound-interest',
  '/financial/retirement',
  '/financial/auto-loan',
  '/financial/salary',
  '/financial/debt-payoff',
  '/fitness',
  '/fitness/tdee',
  '/fitness/bmi',
  '/fitness/body-fat',
  '/fitness/macro',
  '/fitness/pregnancy',
  '/math',
  '/math/statistics',
  '/math/scientific',
  '/math/percentage',
  '/math/fractions',
  '/math/quadratic',
  '/utility',
  '/utility/unit-conversion',
  '/utility/date-diff',
  '/utility/geometry',
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({ url: route === '/' ? SITE_URL : `${SITE_URL}${route}` }))
}
