'use cache'

export async function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 h-14 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} OmniCalc. Free online calculators.
        </p>
      </div>
    </footer>
  )
}
