import type { Metadata } from 'next'
import Link from 'next/link'

// Placeholder: replace with the real inbox before launch
const CONTACT_EMAIL = 'hello@example.com'
const LAST_UPDATED = 'October 31, 2026'

export const metadata: Metadata = {
  title: 'About Us, Privacy Policy & Terms of Use',
  description: 'About OmniCalc, how to contact us, our privacy policy, and our terms of use.',
  alternates: { canonical: '/about' },
}

const SECTIONS = [
  { id: 'about', title: 'About Us' },
  { id: 'faq', title: 'Frequently Asked Questions' },
  { id: 'contact', title: 'Contact Us' },
  { id: 'privacy', title: 'Privacy Policy' },
  { id: 'terms', title: 'Terms of Use' },
] as const

const FAQ = [
  {
    question: 'Is OmniCalc free?',
    answer: 'Yes. Every calculator is free to use, with no sign-up and no limit on how often you use it.',
  },
  {
    question: 'Do you store the numbers I enter?',
    answer:
      'No. Calculations run in your browser and your inputs are not sent to us. The inputs are written into the page address so you can bookmark or share a result, which means anyone you send the link to can see them. Avoid sharing links that contain information you want to keep private.',
  },
  {
    question: 'Can I link to a calculator or share my results?',
    answer:
      'Yes. You are welcome to link to any page on OmniCalc. Copying the page address after entering your numbers gives a link that reopens the calculator with the same inputs.',
  },
  {
    question: 'I found an error. How do I report it?',
    answer:
      'Please email us with the calculator name, the link showing the inputs you used, the result you got, and the result you expected. Reports like this are the fastest way for us to find and fix a problem.',
  },
  {
    question: 'Do you offer an API?',
    answer: 'Not at this time.',
  },
  {
    question: 'Is this financial, medical, or legal advice?',
    answer:
      'No. Results are estimates based on the formulas and assumptions described on each page. Talk to a qualified professional before making decisions that depend on them.',
  },
] as const

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 space-y-4">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
      {children}
    </section>
  )
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold text-foreground pt-2">{children}</h3>
}

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-12 leading-relaxed text-muted-foreground">
        <header className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">About OmniCalc</h1>
          <nav aria-label="On this page">
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="underline underline-offset-4 hover:text-foreground">
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <Section id="about" title="About Us">
          <p>
            OmniCalc is a free collection of online calculators for money, health, math, and everyday conversions. It
            covers four areas: <Link href="/financial" className="underline underline-offset-4">financial</Link>,{' '}
            <Link href="/fitness" className="underline underline-offset-4">fitness and health</Link>,{' '}
            <Link href="/math" className="underline underline-offset-4">math</Link>, and{' '}
            <Link href="/utility" className="underline underline-offset-4">utility</Link> tools, from mortgage payments
            and retirement savings to body mass index, statistics, and unit conversion.
          </p>
          <p>
            We built OmniCalc around three ideas. Calculators should be fast, so results update as you type. They should
            be private, so the arithmetic happens in your browser rather than on our servers. And they should be
            shareable, so every result has its own link you can bookmark or send to someone else.
          </p>
          <p>
            Each calculator comes with a guide that explains the formula it uses, works through an example, and points
            out its limitations. Every calculation is checked by an automated test suite before changes go live. Even
            so, results are estimates that depend on the inputs and assumptions involved, and they are not a substitute
            for advice from a qualified professional.
          </p>
        </Section>

        <Section id="faq" title="Frequently Asked Questions">
          <dl className="space-y-5">
            {FAQ.map((item) => (
              <div key={item.question} className="space-y-1">
                <dt className="font-semibold text-foreground">{item.question}</dt>
                <dd>{item.answer}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="contact" title="Contact Us">
          <p>
            Questions, corrections, and suggestions are welcome. Email us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-foreground underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>
            . When reporting a problem with a calculator, please include the link to the page with your inputs so we can
            reproduce it. We read every message, though we cannot promise an individual reply.
          </p>
        </Section>

        <Section id="privacy" title="Privacy Policy">
          <p className="text-sm">Last updated: {LAST_UPDATED}</p>
          <p>
            This policy explains what information OmniCalc handles when you use the site and how it is used. By using
            OmniCalc you agree to this policy.
          </p>

          <SubHeading>Information you enter into calculators</SubHeading>
          <p>
            Calculations are performed in your browser. The values you type are not sent to us or stored by us. To make
            results shareable, the values are placed in the page address (the URL). The address stays in your browser
            history, and anyone who receives a link you share can see the values in it. When a page is loaded from a
            link, the full address, including those values, is sent to our hosting provider as part of the request.
          </p>

          <SubHeading>Downloads</SubHeading>
          <p>
            PDF and CSV files you download are created in your browser from the results on your screen. They are not
            uploaded to or kept on our servers.
          </p>

          <SubHeading>Server logs</SubHeading>
          <p>
            Like most websites, the servers that deliver OmniCalc automatically record basic technical information about
            each request, such as your IP address, browser type, the page requested, the referring page, and the time of
            the request. This information is used to operate, secure, and troubleshoot the site, and it is retained
            according to our hosting provider&apos;s practices. We do not use it to identify you personally.
          </p>

          <SubHeading>Cookies, analytics, and advertising</SubHeading>
          <p>
            OmniCalc does not currently use cookies, analytics services, or advertising. If that changes, we will update
            this policy before doing so and describe what is collected and any choices available to you.
          </p>

          <SubHeading>Accounts and personal information</SubHeading>
          <p>
            OmniCalc has no user accounts, and we do not ask for your name, email address, or other personal
            information to use the calculators. If you email us, we use your message and address only to respond to you
            and to improve the site, and we do not sell or share them.
          </p>

          <SubHeading>Children&apos;s privacy</SubHeading>
          <p>
            OmniCalc is a general-audience site and does not knowingly collect personal information from children under
            13. If you believe a child has sent us personal information, please contact us and we will delete it.
          </p>

          <SubHeading>Security</SubHeading>
          <p>
            The site is served over an encrypted connection. No method of transmission or storage is completely secure,
            however, so we cannot guarantee absolute security.
          </p>

          <SubHeading>Links to other websites</SubHeading>
          <p>
            Pages may link to websites we do not control. We are not responsible for their content or privacy
            practices, and we encourage you to read their policies.
          </p>

          <SubHeading>Changes to this policy</SubHeading>
          <p>
            We may update this policy from time to time. The date at the top shows when it last changed, and continued
            use of the site after a change means you accept the updated policy.
          </p>
        </Section>

        <Section id="terms" title="Terms of Use">
          <p className="text-sm">Last updated: {LAST_UPDATED}</p>
          <p>
            These terms govern your use of OmniCalc. By using the site you agree to them. If you do not agree, please do
            not use the site.
          </p>

          <SubHeading>Use of the site</SubHeading>
          <p>
            You may use OmniCalc for personal, educational, and business purposes. You agree not to use the site in a
            way that is unlawful, that interferes with its operation or with other people&apos;s use of it, or that
            places an unreasonable load on it, for example through automated scraping or excessive requests.
          </p>

          <SubHeading>No professional advice</SubHeading>
          <p>
            The calculators, guides, and other content are provided for general information only. They are not
            financial, tax, legal, medical, or other professional advice. Results depend on the inputs you provide and
            on simplified formulas and assumptions that may not fit your circumstances. Consult a qualified professional
            before acting on any result.
          </p>

          <SubHeading>Accuracy</SubHeading>
          <p>
            We work to keep the calculators and content accurate, but we do not guarantee that they are complete,
            correct, or up to date. Tax rates, regulations, and other figures change, and errors can occur. You are
            responsible for checking any result that matters to you.
          </p>

          <SubHeading>Intellectual property</SubHeading>
          <p>
            The site&apos;s design, text, and code belong to OmniCalc. You may link to any page and share results, but
            you may not copy or republish substantial parts of the site without permission.
          </p>

          <SubHeading>Disclaimer of warranties</SubHeading>
          <p>
            OmniCalc is provided &quot;as is&quot; and &quot;as available&quot;, without warranties of any kind, express
            or implied, including warranties of accuracy, fitness for a particular purpose, and non-infringement. We do
            not promise that the site will be uninterrupted or error-free.
          </p>

          <SubHeading>Limitation of liability</SubHeading>
          <p>
            To the fullest extent permitted by law, OmniCalc is not liable for any direct, indirect, incidental,
            consequential, or other damages arising from your use of, or inability to use, the site or any result it
            produces.
          </p>

          <SubHeading>Changes to the site and these terms</SubHeading>
          <p>
            We may change, suspend, or discontinue any part of the site at any time. We may also update these terms;
            the date at the top shows when they last changed, and continued use of the site means you accept them.
          </p>

          <SubHeading>Severability and entire agreement</SubHeading>
          <p>
            If any part of these terms is found unenforceable, the rest remains in effect. These terms, together with
            the privacy policy above, are the entire agreement between you and OmniCalc about your use of the site.
          </p>

          <SubHeading>Contact</SubHeading>
          <p>
            Questions about these terms or the privacy policy can be sent to{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-foreground underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Section>
      </div>
    </main>
  )
}
