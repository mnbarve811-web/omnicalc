import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Header } from '@/components/common/Header'
import { Footer } from '@/components/common/Footer'
import { SITE_URL } from '@/lib/site-url'
import { ADSENSE_CLIENT } from '@/lib/adsense'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  // Without this, relative canonicals and OG URLs resolve against the wrong host in production
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s | OmniCalc',
    default: 'OmniCalc — Free Online Calculators',
  },
  description:
    'Free, accurate calculators for financial planning, health tracking, math, and everyday use.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        {ADSENSE_CLIENT && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  )
}
