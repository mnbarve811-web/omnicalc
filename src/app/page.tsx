import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { calculateCompoundInterest, calculateMortgage } from '@/lib/engine'
import { ALL_CALCULATORS, PILLARS } from '@/lib/calculators'
import { CalculatorSearch } from '@/components/common/CalculatorSearch'

export const metadata: Metadata = {
  title: 'OmniCalc — Free Online Calculators',
  alternates: { canonical: '/' },
}

const POPULAR_HREFS = [
  '/financial/mortgage',
  '/fitness/tdee',
  '/math/percentage',
  '/utility/unit-conversion',
  '/financial/compound-interest',
  '/fitness/bmi',
]
const POPULAR = POPULAR_HREFS.map((href) => ALL_CALCULATORS.find((calculator) => calculator.href === href)!)

const FACTS = ['No account required', 'Shareable result links', 'PDF & CSV export'] as const

// Computed with the same engine the calculator uses, so the hero figures are always real.
const EXAMPLE_INPUTS = {
  initialInvestment: 10000,
  monthlyContribution: 500,
  annualInterestRate: 7,
  compoundFrequency: 12,
  years: 20,
}
const EXAMPLE = calculateCompoundInterest(EXAMPLE_INPUTS)
const EXAMPLE_HREF = `/financial/compound-interest?init=${EXAMPLE_INPUTS.initialInvestment}&monthly=${EXAMPLE_INPUTS.monthlyContribution}&rate=${EXAMPLE_INPUTS.annualInterestRate}&freq=${EXAMPLE_INPUTS.compoundFrequency}&years=${EXAMPLE_INPUTS.years}`
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

// Matches the mortgage calculator's defaults and URL params, so the "share the link" example is accurate.
const MORTGAGE_INPUTS = {
  homePrice: 400000,
  downPayment: 80000,
  loanTermYears: 30,
  interestRate: 7,
  propertyTax: 300,
  homeInsurance: 120,
  hoa: 0,
}
const MORTGAGE = calculateMortgage(MORTGAGE_INPUTS)
const MORTGAGE_PATH = `/financial/mortgage?price=${MORTGAGE_INPUTS.homePrice}&down=${MORTGAGE_INPUTS.downPayment}&term=${MORTGAGE_INPUTS.loanTermYears}&rate=${MORTGAGE_INPUTS.interestRate}`

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 pb-16 pt-12 md:px-6 md:pb-24 md:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:gap-16">
        <div>
          <h1 className="text-5xl font-semibold tracking-[-0.04em] md:text-7xl">OmniCalc</h1>
          <p className="mt-4 max-w-[36ch] text-xl leading-snug text-muted-foreground md:text-2xl">
            Free, fast, accurate calculators for financial planning, health tracking, math, and everyday use.
          </p>

          <CalculatorSearch size="large" className="mt-8 max-w-xl" />

          <div className="mt-5 flex max-w-xl flex-wrap items-center gap-2">
            <span className="mr-1 text-sm text-muted-foreground">Popular</span>
            {POPULAR.map((calculator) => (
              <Link
                key={calculator.href}
                href={calculator.href}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-sm text-foreground transition-colors duration-150 hover:border-primary/40 hover:text-primary"
              >
                <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${calculator.pillar.dotClass}`} />
                {calculator.name}
              </Link>
            ))}
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {FACTS.map((fact) => (
              <li key={fact} className="flex items-center gap-1.5">
                <Check aria-hidden className="h-4 w-4 text-primary" />
                {fact}
              </li>
            ))}
          </ul>
        </div>

        <Link
          href={EXAMPLE_HREF}
          className="group block rounded-lg border border-border bg-card p-6 shadow-[0_1px_2px_rgba(20,27,45,0.04),0_16px_40px_-24px_rgba(20,27,45,0.3)] transition-colors duration-150 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 md:p-7"
        >
          <p className="text-sm font-medium text-muted-foreground">Compound interest, worked example</p>
          <p className="mt-2 text-5xl font-semibold tracking-[-0.035em] tabular-nums text-foreground">
            {usd.format(EXAMPLE.futureValue)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {usd.format(EXAMPLE_INPUTS.initialInvestment)} start, {usd.format(EXAMPLE_INPUTS.monthlyContribution)}/mo at{' '}
            {EXAMPLE_INPUTS.annualInterestRate}% for {EXAMPLE_INPUTS.years} years
          </p>

          <div aria-hidden className="mt-7 flex h-32 items-end gap-1">
            {EXAMPLE.yearlyBreakdown.map((point, index) => (
              <div
                key={point.year}
                className="omni-grow flex flex-1 flex-col justify-end overflow-hidden rounded-t-[3px]"
                style={{
                  height: `${(point.balance / EXAMPLE.futureValue) * 100}%`,
                  ['--rise-delay' as string]: `${200 + index * 30}ms`,
                }}
              >
                <div className="flex-1 bg-chart-1" />
                <div className="bg-chart-4/45" style={{ height: `${(point.contributions / point.balance) * 100}%` }} />
              </div>
            ))}
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="flex items-center gap-2 text-muted-foreground">
                <span aria-hidden className="h-2.5 w-2.5 rounded-[3px] bg-chart-4/45" />
                Contributed
              </dt>
              <dd className="mt-1 font-semibold tabular-nums text-foreground">{usd.format(EXAMPLE.totalContributions)}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-muted-foreground">
                <span aria-hidden className="h-2.5 w-2.5 rounded-[3px] bg-chart-1" />
                Interest earned
              </dt>
              <dd className="mt-1 font-semibold tabular-nums text-foreground">{usd.format(EXAMPLE.totalInterestEarned)}</dd>
            </div>
          </dl>

          <span className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm font-medium text-primary">
            Try your own numbers
            <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </span>
        </Link>
      </section>

      <section id="calculators" aria-labelledby="calculators-heading" className="scroll-mt-14 border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <h2 id="calculators-heading" className="text-3xl font-semibold tracking-[-0.03em]">
            All {ALL_CALCULATORS.length} calculators
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((pillar) => (
              <div key={pillar.href}>
                <h3 data-slot="card-title" className="text-base font-semibold">
                  <Link href={pillar.href} className="flex items-center gap-2 hover:text-primary">
                    <span aria-hidden className={`h-2 w-2 rounded-full ${pillar.dotClass}`} />
                    {pillar.title}
                  </Link>
                </h3>
                <ul className="mt-3 border-t border-border">
                  {pillar.calculators.map((calculator) => (
                    <li key={calculator.href} className="border-b border-border">
                      <Link href={calculator.href} className="group block py-3">
                        <span className="block text-sm font-medium text-foreground group-hover:text-primary">{calculator.title}</span>
                        <span className="mt-0.5 line-clamp-2 block text-sm text-muted-foreground">{calculator.description}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="how-heading" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <h2 id="how-heading" className="text-3xl font-semibold tracking-[-0.03em]">Every calculator works the same way</h2>
        <ol className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          <li className="border-t-2 border-foreground pt-5">
            <h3 className="text-lg font-semibold">1. Enter your numbers</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Results update as you type. With the mortgage defaults, the monthly principal and interest is{' '}
              <span className="font-medium tabular-nums text-foreground">{usd.format(MORTGAGE.monthlyPrincipalAndInterest)}</span>.
            </p>
          </li>
          <li className="border-t-2 border-foreground pt-5">
            <h3 className="text-lg font-semibold">2. Share the link</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Every input is saved in the page address, so you can bookmark a result or send it to someone.
            </p>
            <code className="mt-3 block break-all rounded-sm bg-muted px-3 py-2 font-mono text-xs leading-5 text-foreground">
              {MORTGAGE_PATH}
            </code>
          </li>
          <li className="border-t-2 border-foreground pt-5">
            <h3 className="text-lg font-semibold">3. Export the result</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Download a PDF to keep, or a CSV to open in your spreadsheet. Nothing needs an account.
            </p>
          </li>
        </ol>
      </section>
    </main>
  )
}
