export function GuideSection({ content }: { content: string }) {
  return (
    <section className="mt-12 max-w-3xl mx-auto space-y-4 text-muted-foreground leading-relaxed">
      {content.split('\n\n').map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </section>
  )
}
