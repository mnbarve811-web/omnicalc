// Guide paragraphs often open with a short lead-in such as "How to use this calculator:"; it becomes a subhead
// so the long text has entry points, with the paragraph's words unchanged.
const LEAD_IN = /^([A-Z][^.:!?]{2,60}):\s/

function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function GuideSection({ content }: { content: string }) {
  return (
    <section aria-labelledby="guide-heading" className="mt-16">
      <h2 id="guide-heading" className="text-2xl font-semibold tracking-[-0.02em]">
        About this calculator
      </h2>
      {/* rem rather than ch: Geist's "0" is wider than its average letter, so 68ch ran to ~95 characters */}
      <div className="mt-5 max-w-[38rem] space-y-5 text-base leading-7 text-foreground/85">
        {content.split('\n\n').map((para, i) => {
          const leadIn = para.match(LEAD_IN)
          if (leadIn === null) return <p key={i}>{para}</p>
          return (
            <div key={i}>
              <h3 className="pt-3 text-lg font-semibold tracking-[-0.01em] text-foreground">{leadIn[1]}</h3>
              <p className="mt-2">{capitalizeFirst(para.slice(leadIn[0].length))}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
