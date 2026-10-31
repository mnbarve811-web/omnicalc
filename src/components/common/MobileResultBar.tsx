'use client'

import { useEffect, useState } from 'react'
import { ArrowDown } from 'lucide-react'

interface MobileResultBarProps {
  targetId: string
  value: string
  caption: string
}

// Below lg the result sits under the inputs; this bar keeps the answer in view until the visitor reaches it.
// It repeats only the value, never the result label, so label-based lookups still find a single element.
export function MobileResultBar({ targetId, value, caption }: MobileResultBarProps) {
  const [isTargetBelow, setIsTargetBelow] = useState(false)

  useEffect(() => {
    const target = document.getElementById(targetId)
    if (target === null) return
    const observer = new IntersectionObserver(([entry]) => {
      setIsTargetBelow(!entry.isIntersecting && entry.boundingClientRect.top > 0)
    })
    observer.observe(target)
    return () => observer.disconnect()
  }, [targetId])

  if (!isTargetBelow) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_-16px_rgba(20,27,45,0.3)] lg:hidden">
      <a href={`#${targetId}`} className="flex items-center justify-between gap-4">
        <span className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-[-0.02em] tabular-nums text-foreground">{value}</span>
          <span className="text-sm text-muted-foreground">{caption}</span>
        </span>
        <span className="flex h-11 items-center gap-1.5 rounded-sm bg-primary px-3.5 text-sm font-medium text-primary-foreground">
          See breakdown
          <ArrowDown aria-hidden className="h-4 w-4" />
        </span>
      </a>
    </div>
  )
}
