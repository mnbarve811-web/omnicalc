// Guide paragraphs often open with a short lead-in such as "How to use this calculator:"; setting it bold
// gives the long text scannable entry points without changing a word of it.
const LEAD_IN = /^([A-Z][^.:!?]{2,60}:)\s/

export function GuideSection({ content }: { content: string }) {
  return (
    <section aria-labelledby="guide-heading" className="mt-16">
      <h2 id="guide-heading" className="text-2xl font-semibold tracking-[-0.02em]">
        About this calculator
      </h2>
      <div className="mt-5 max-w-[68ch] space-y-5 text-base leading-7 text-foreground/85">
        {content.split('\n\n').map((para, i) => {
          const leadIn = para.match(LEAD_IN)?.[1]
          if (leadIn === undefined) return <p key={i}>{para}</p>
          return (
            <p key={i}>
              <strong className="font-semibold text-foreground">{leadIn}</strong>
              {para.slice(leadIn.length)}
            </p>
          )
        })}
      </div>
    </section>
  )
}
