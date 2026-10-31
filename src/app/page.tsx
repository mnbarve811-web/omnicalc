import type { Metadata } from 'next'
import Link from 'next/link'
import { Geist, Instrument_Serif } from 'next/font/google'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { calculateCompoundInterest, calculateMortgage } from '@/lib/engine'

export const metadata: Metadata = {
  title: 'OmniCalc — Free Online Calculators',
  alternates: { canonical: '/' },
}

const geist = Geist({ subsets: ['latin'] })
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
})

const SPRING = 'ease-[cubic-bezier(0.32,0.72,0,1)]'

// Tailwind only picks up complete literal class names, so layout and glow live here per pillar.
const PILLARS = [
  {
    title: 'Financial Calculators',
    href: '/financial',
    featured: true,
    span: 'md:col-span-7 md:row-span-2',
    listColumns: 'md:grid-cols-1',
    glow: 'bg-[radial-gradient(70%_60%_at_100%_0%,rgba(16,185,129,0.14),transparent_70%)]',
    dot: 'bg-emerald-500',
    calculators: [
      { name: 'Mortgage', href: '/financial/mortgage' },
      { name: 'Compound Interest', href: '/financial/compound-interest' },
      { name: 'Retirement', href: '/financial/retirement' },
      { name: 'Auto Loan', href: '/financial/auto-loan' },
      { name: 'Salary / Paycheck', href: '/financial/salary' },
      { name: 'Debt Payoff', href: '/financial/debt-payoff' },
    ],
  },
  {
    title: 'Fitness & Health',
    href: '/fitness',
    featured: false,
    span: 'md:col-span-5',
    listColumns: 'md:grid-cols-1',
    glow: 'bg-[radial-gradient(70%_70%_at_100%_0%,rgba(244,63,94,0.12),transparent_70%)]',
    dot: 'bg-rose-500',
    calculators: [
      { name: 'TDEE', href: '/fitness/tdee' },
      { name: 'BMI', href: '/fitness/bmi' },
      { name: 'Body Fat', href: '/fitness/body-fat' },
      { name: 'Macros', href: '/fitness/macro' },
      { name: 'Pregnancy Due Date', href: '/fitness/pregnancy' },
    ],
  },
  {
    title: 'Math & Scientific',
    href: '/math',
    featured: false,
    span: 'md:col-span-5',
    listColumns: 'md:grid-cols-1',
    glow: 'bg-[radial-gradient(70%_70%_at_100%_0%,rgba(99,102,241,0.13),transparent_70%)]',
    dot: 'bg-indigo-500',
    calculators: [
      { name: 'Statistics', href: '/math/statistics' },
      { name: 'Scientific', href: '/math/scientific' },
      { name: 'Percentage', href: '/math/percentage' },
      { name: 'Fractions', href: '/math/fractions' },
      { name: 'Quadratic Solver', href: '/math/quadratic' },
    ],
  },
  {
    title: 'Utility',
    href: '/utility',
    featured: false,
    span: 'md:col-span-12',
    listColumns: 'md:grid-cols-3 md:gap-x-8',
    glow: 'bg-[radial-gradient(40%_90%_at_100%_0%,rgba(245,158,11,0.13),transparent_70%)]',
    dot: 'bg-amber-500',
    calculators: [
      { name: 'Unit Converter', href: '/utility/unit-conversion' },
      { name: 'Date Difference', href: '/utility/date-diff' },
      { name: 'Geometry', href: '/utility/geometry' },
    ],
  },
] as const

const TOTAL_CALCULATORS = PILLARS.reduce((sum, pillar) => sum + pillar.calculators.length, 0)

const ALL_CALCULATORS = PILLARS.flatMap((pillar) =>
  pillar.calculators.map((calculator) => ({ ...calculator, dot: pillar.dot }))
)

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

// Matches the mortgage calculator's defaults and URL params, so the "how it works" mock is accurate.
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
    <main className={`${geist.className} relative overflow-x-clip bg-white text-neutral-950`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[56rem] bg-[radial-gradient(50%_45%_at_85%_0%,rgba(99,102,241,0.10),transparent),radial-gradient(40%_40%_at_10%_10%,rgba(16,185,129,0.08),transparent),linear-gradient(to_bottom,#f5f5f4,#ffffff)]"
      />

      <section className="relative mx-auto max-w-7xl px-4 pb-24 pt-16 md:px-8 md:pb-32 md:pt-40">
        <span
          className="omni-rise inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-600 ring-1 ring-black/[0.06]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {TOTAL_CALCULATORS} free calculators
        </span>

        <h1
          className="omni-rise mt-8 text-[clamp(4.25rem,16vw,12.5rem)] font-semibold leading-[0.82] tracking-[-0.065em] [--rise-delay:80ms]"
        >
          OmniCalc
        </h1>

        <div className="mt-12 grid grid-cols-1 gap-12 md:mt-16 lg:grid-cols-12 lg:items-start">
          <div className="flex flex-col gap-10 lg:col-span-6">
            <p className="omni-rise text-xl leading-snug text-neutral-500 [--rise-delay:180ms] md:text-2xl">
              Free, fast, accurate calculators for{' '}
              <span className={`${instrumentSerif.className} text-[1.2em] text-neutral-950`}>
                financial planning, health tracking, math,
              </span>{' '}
              and everyday use.
            </p>

            <div className="omni-rise flex flex-col gap-6 [--rise-delay:280ms]">
              <Link
                href="#calculators"
                className={`group inline-flex w-max items-center gap-4 rounded-full bg-neutral-950 py-2 pl-6 pr-2 text-sm font-medium text-white shadow-[0_18px_40px_-18px_rgba(10,10,30,0.55),inset_0_1px_0_rgba(255,255,255,0.15)] transition-transform duration-500 ${SPRING} active:scale-[0.98]`}
              >
                Browse calculators
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-transform duration-500 ${SPRING} group-hover:translate-y-0.5 group-hover:scale-105`}
                >
                  <ArrowDown className="h-4 w-4" strokeWidth={1.25} />
                </span>
              </Link>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-neutral-500">
                {FACTS.map((fact) => (
                  <li key={fact} className="flex items-center gap-2">
                    <span className="h-px w-3 bg-neutral-300" />
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="omni-rise [--rise-delay:380ms] lg:col-span-4 lg:col-start-9 lg:-mt-56">
            <Link
              href={EXAMPLE_HREF}
              className={`group block rounded-[2rem] bg-black/[0.04] p-1.5 ring-1 ring-black/[0.06] outline-none transition-transform duration-700 ${SPRING} focus-visible:ring-2 focus-visible:ring-neutral-950 active:scale-[0.99] lg:rotate-2 lg:hover:rotate-0`}
            >
              <div className="relative overflow-hidden rounded-[calc(2rem-0.375rem)] bg-neutral-950 p-7 text-white shadow-[0_40px_80px_-30px_rgba(10,10,40,0.55),inset_0_1px_0_rgba(255,255,255,0.12)]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_100%_0%,rgba(16,185,129,0.22),transparent_70%)]"
                />

                <div className="relative flex items-center justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
                    Compound interest
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">
                    Worked example
                  </span>
                </div>

                <p className="relative mt-8 text-5xl font-semibold tracking-[-0.04em] tabular-nums">
                  {usd.format(EXAMPLE.futureValue)}
                </p>
                <p className="relative mt-2 text-sm text-white/50">
                  {usd.format(EXAMPLE_INPUTS.initialInvestment)} start, {usd.format(EXAMPLE_INPUTS.monthlyContribution)}
                  /mo at {EXAMPLE_INPUTS.annualInterestRate}% for {EXAMPLE_INPUTS.years} years
                </p>

                <div aria-hidden className="relative mt-8 flex h-28 items-end gap-1">
                  {EXAMPLE.yearlyBreakdown.map((point, index) => (
                    <div
                      key={point.year}
                      className="omni-grow flex flex-1 flex-col justify-end overflow-hidden rounded-t-[3px]"
                      style={{
                        height: `${(point.balance / EXAMPLE.futureValue) * 100}%`,
                        ['--rise-delay' as string]: `${500 + index * 35}ms`,
                      }}
                    >
                      <div className="flex-1 bg-emerald-400/90" />
                      <div
                        className="bg-white/20"
                        style={{ height: `${(point.contributions / point.balance) * 100}%` }}
                      />
                    </div>
                  ))}
                </div>

                <dl className="relative mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="flex items-center gap-2 text-white/50">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                      Contributed
                    </dt>
                    <dd className="mt-1 tabular-nums">{usd.format(EXAMPLE.totalContributions)}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2 text-white/50">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Interest earned
                    </dt>
                    <dd className="mt-1 tabular-nums">{usd.format(EXAMPLE.totalInterestEarned)}</dd>
                  </div>
                </dl>

                <div className="relative mt-8 flex items-center justify-between border-t border-white/10 pt-5 text-sm">
                  <span className="text-white/80">Try your own numbers</span>
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-transform duration-700 ${SPRING} group-hover:-translate-y-[1px] group-hover:translate-x-1 group-hover:scale-105`}
                  >
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.25} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="All calculators" className="relative pb-24 md:pb-32">
        <div className="omni-marquee-viewport overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="omni-marquee flex w-max">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1} className="flex gap-3 py-3 pr-3">
                {ALL_CALCULATORS.map((calculator) => (
                  <li key={calculator.href}>
                    <Link
                      href={calculator.href}
                      tabIndex={copy === 1 ? -1 : undefined}
                      className="group block rounded-full bg-black/[0.03] p-1 ring-1 ring-black/[0.05] outline-none focus-visible:ring-2 focus-visible:ring-neutral-950"
                    >
                      <span
                        className={`flex items-center gap-2.5 whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-sm text-neutral-700 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_24px_-14px_rgba(20,20,45,0.18)] transition-transform duration-500 ${SPRING} group-hover:-translate-y-0.5`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${calculator.dot}`} />
                        {calculator.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </section>

      <section
        id="calculators"
        className="relative mx-auto max-w-7xl scroll-mt-8 px-4 pb-24 md:px-8 md:pb-40"
      >
        <div className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500 ring-1 ring-black/[0.06]">
              {PILLARS.length} pillars
            </span>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
              Pick a{' '}
              <span className={`${instrumentSerif.className} whitespace-nowrap font-normal tracking-[-0.02em]`}>
                discipline.
              </span>
            </h2>
          </div>
          <p className="max-w-xs text-sm text-neutral-500">
            Every result can be shared as a link or exported, and nothing needs an account.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-5">
          {PILLARS.map((pillar, index) => (
            <div
              key={pillar.href}
              className={`omni-rise-on-scroll group rounded-[2rem] bg-black/[0.03] p-1.5 ring-1 ring-black/[0.05] ${pillar.span}`}
            >
              <div
                className={`relative flex h-full flex-col justify-between gap-10 overflow-hidden rounded-[calc(2rem-0.375rem)] bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_30px_60px_-30px_rgba(20,20,45,0.14),inset_0_1px_0_rgba(255,255,255,1)] transition-transform duration-700 md:p-9 ${SPRING} group-hover:-translate-y-1`}
              >
                <div aria-hidden className={`pointer-events-none absolute inset-0 ${pillar.glow}`} />

                <div className="relative flex items-center justify-between">
                  <span className="font-mono text-xs tracking-[0.2em] text-neutral-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-neutral-950/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-600">
                    <span className={`h-1.5 w-1.5 rounded-full ${pillar.dot}`} />
                    {pillar.calculators.length} calculators
                  </span>
                </div>

                {pillar.featured && (
                  <span
                    aria-hidden
                    className="relative hidden text-[11rem] font-extralight leading-none tracking-[-0.08em] text-neutral-950/[0.08] md:block"
                  >
                    {String(pillar.calculators.length).padStart(2, '0')}
                  </span>
                )}

                <div className="relative">
                  <Link
                    href={pillar.href}
                    className="group/title flex items-center justify-between gap-6 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-neutral-950"
                  >
                    <h3
                      data-slot="card-title"
                      className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl"
                    >
                      {pillar.title}
                    </h3>
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-950/[0.05] text-neutral-900 transition-transform duration-700 ${SPRING} group-hover/title:-translate-y-[1px] group-hover/title:translate-x-1 group-hover/title:scale-105`}
                    >
                      <ArrowUpRight className="h-5 w-5" strokeWidth={1.25} />
                    </span>
                  </Link>

                  <ul className={`mt-6 grid grid-cols-1 ${pillar.listColumns}`}>
                    {pillar.calculators.map((calculator) => (
                      <li key={calculator.href} className="border-t border-black/[0.06]">
                        <Link
                          href={calculator.href}
                          className={`group/row flex items-center justify-between py-3 text-sm text-neutral-600 outline-none transition-colors duration-500 ${SPRING} hover:text-neutral-950 focus-visible:text-neutral-950`}
                        >
                          <span className={`transition-transform duration-500 ${SPRING} group-hover/row:translate-x-1`}>
                            {calculator.name}
                          </span>
                          <ArrowUpRight
                            className={`h-4 w-4 text-neutral-400 opacity-0 transition-all duration-500 ${SPRING} group-hover/row:opacity-100 group-focus-visible/row:opacity-100`}
                            strokeWidth={1.25}
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-24 md:px-8 md:pb-40">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <div className="md:sticky md:top-24">
              <span className="inline-flex rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500 ring-1 ring-black/[0.06]">
                How it works
              </span>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
                Three steps.{' '}
                <span className={`${instrumentSerif.className} whitespace-nowrap font-normal tracking-[-0.02em]`}>
                  No sign-up.
                </span>
              </h2>
              <p className="mt-6 max-w-sm text-neutral-500">
                Every calculator works the same way, so once you have used one you know them all.
              </p>
            </div>
          </div>

          <ol className="flex flex-col gap-6 md:col-span-7">
            <li className="omni-rise-on-scroll rounded-[2rem] bg-black/[0.03] p-1.5 ring-1 ring-black/[0.05]">
              <div className="flex flex-col gap-8 rounded-[calc(2rem-0.375rem)] bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_30px_60px_-30px_rgba(20,20,45,0.14)] md:flex-row md:items-center md:justify-between md:p-9">
                <div className="max-w-xs">
                  <span className="font-mono text-xs tracking-[0.2em] text-neutral-400">01</span>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">Enter your numbers</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                    Results update as you type. There is no calculate button to press.
                  </p>
                </div>
                <div aria-hidden className="w-full rounded-2xl bg-neutral-50 p-4 ring-1 ring-black/[0.05] md:w-60">
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">Home price</span>
                  <div className="mt-2 flex items-center rounded-xl bg-white px-3 py-2.5 text-sm tabular-nums shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
                    {usd.format(MORTGAGE_INPUTS.homePrice)}
                    <span className="omni-caret ml-0.5 h-4 w-px bg-neutral-950" />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="text-xs text-neutral-500">Monthly P&amp;I</span>
                    <span className="text-lg font-semibold tracking-[-0.02em] tabular-nums">
                      {usd.format(MORTGAGE.monthlyPrincipalAndInterest)}
                    </span>
                  </div>
                </div>
              </div>
            </li>

            <li className="omni-rise-on-scroll rounded-[2rem] bg-black/[0.03] p-1.5 ring-1 ring-black/[0.05] md:ml-12">
              <div className="flex flex-col gap-8 rounded-[calc(2rem-0.375rem)] bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_30px_60px_-30px_rgba(20,20,45,0.14)] md:flex-row md:items-center md:justify-between md:p-9">
                <div className="max-w-xs">
                  <span className="font-mono text-xs tracking-[0.2em] text-neutral-400">02</span>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">Share the link</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                    Every input is saved in the page address, so you can bookmark a result or send it to someone.
                  </p>
                </div>
                <div aria-hidden className="w-full rounded-2xl bg-neutral-50 p-4 ring-1 ring-black/[0.05] md:w-60">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-neutral-300" />
                    <span className="h-2 w-2 rounded-full bg-neutral-300" />
                    <span className="h-2 w-2 rounded-full bg-neutral-300" />
                  </div>
                  <p className="mt-3 break-all rounded-xl bg-white px-3 py-2.5 font-mono text-[11px] leading-relaxed text-neutral-600 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
                    {MORTGAGE_PATH}
                  </p>
                </div>
              </div>
            </li>

            <li className="omni-rise-on-scroll rounded-[2rem] bg-black/[0.03] p-1.5 ring-1 ring-black/[0.05] md:ml-6">
              <div className="flex flex-col gap-8 rounded-[calc(2rem-0.375rem)] bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_30px_60px_-30px_rgba(20,20,45,0.14)] md:flex-row md:items-center md:justify-between md:p-9">
                <div className="max-w-xs">
                  <span className="font-mono text-xs tracking-[0.2em] text-neutral-400">03</span>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">Export the result</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                    Download a PDF to keep, or a CSV to open in your spreadsheet.
                  </p>
                </div>
                <div aria-hidden className="flex w-full gap-3 md:w-60">
                  {['PDF', 'CSV'].map((format) => (
                    <div
                      key={format}
                      className="flex flex-1 flex-col justify-between gap-6 rounded-2xl bg-neutral-50 p-4 ring-1 ring-black/[0.05]"
                    >
                      <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">{format}</span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
                        <ArrowDown className="h-4 w-4" strokeWidth={1.25} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-24 md:px-8 md:pb-32">
        <div className="omni-rise-on-scroll rounded-[2.5rem] bg-black/[0.04] p-2 ring-1 ring-black/[0.06]">
          <div className="relative overflow-hidden rounded-[calc(2.5rem-0.5rem)] bg-neutral-950 px-7 py-20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] md:px-16 md:py-28">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_70%_at_100%_0%,rgba(16,185,129,0.22),transparent_70%),radial-gradient(45%_60%_at_0%_100%,rgba(99,102,241,0.22),transparent_70%)]"
            />
            <div className="relative max-w-3xl">
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">
                Ready when you are
              </span>
              <h2 className="mt-6 text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-7xl">
                Your next number,{' '}
                <span className={`${instrumentSerif.className} whitespace-nowrap font-normal tracking-[-0.02em]`}>
                  worked out.
                </span>
              </h2>
              <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center">
                <Link
                  href="/financial/mortgage"
                  className={`group inline-flex w-max items-center gap-4 rounded-full bg-white py-2 pl-6 pr-2 text-sm font-medium text-neutral-950 transition-transform duration-500 ${SPRING} active:scale-[0.98]`}
                >
                  Open the mortgage calculator
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full bg-black/5 transition-transform duration-500 ${SPRING} group-hover:-translate-y-[1px] group-hover:translate-x-1 group-hover:scale-105`}
                  >
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.25} />
                  </span>
                </Link>
                <Link
                  href="#calculators"
                  className="w-max text-sm text-white/60 underline-offset-4 transition-colors duration-500 hover:text-white hover:underline"
                >
                  Or browse all {TOTAL_CALCULATORS}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
