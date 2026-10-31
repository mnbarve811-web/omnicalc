'use client'

import { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Link2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ExportButtons } from './ExportButtons'

interface ResultActionsProps {
  resultsId: string
  filename: string
  csvRows: Record<string, unknown>[]
  canExport: boolean
}

type CopyState = 'idle' | 'copied' | 'failed'

export function ResultActions({ resultsId, filename, csvRows, canExport }: ResultActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const hasCustomInputs = searchParams.toString().length > 0

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
    window.setTimeout(() => setCopyState('idle'), 2500)
  }

  const copyLabel = copyState === 'copied' ? 'Link copied' : copyState === 'failed' ? 'Copy the address bar instead' : 'Copy link'

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* data-export-ignore keeps these controls out of the PDF snapshot of the results */}
      <div data-export-ignore className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={copyLink}>
          <Link2 aria-hidden />
          <span aria-live="polite">{copyLabel}</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!hasCustomInputs}
          onClick={() => router.replace(pathname, { scroll: false })}
        >
          <RotateCcw aria-hidden />
          Reset
        </Button>
      </div>
      <div className="sm:ml-auto">
        <ExportButtons resultsId={resultsId} filename={filename} csvRows={csvRows} disabled={!canExport} />
      </div>
    </div>
  )
}
