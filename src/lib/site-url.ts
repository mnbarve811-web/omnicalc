// Set SITE_URL (e.g. https://omnicalc.com) at build time; sitemap and robots need absolute URLs
export const SITE_URL = (process.env.SITE_URL ?? 'http://localhost:3000').replace(/\/+$/, '')
