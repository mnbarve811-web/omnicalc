'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { exportToCSV, exportToPDF } from '@/lib/export'

interface ExportButtonsProps {
  resultsId: string
  filename: string
  csvRows: Record<string, unknown>[]
  disabled: boolean
}

export function ExportButtons({ resultsId, filename, csvRows, disabled }: ExportButtonsProps) {
  const [isExportingPdf, setIsExportingPdf] = useState(false)

  async function handlePdf() {
    setIsExportingPdf(true)
    try {
      await exportToPDF(resultsId, filename)
    } finally {
      setIsExportingPdf(false)
    }
  }

  return (
    <div className="flex gap-2" data-export-buttons>
      <Button type="button" variant="outline" size="sm" disabled={disabled || isExportingPdf} onClick={handlePdf}>
        {isExportingPdf ? 'Preparing PDF…' : 'Download PDF'}
      </Button>
      <Button type="button" variant="outline" size="sm" disabled={disabled || csvRows.length === 0} onClick={() => exportToCSV(csvRows, filename)}>
        Download CSV
      </Button>
    </div>
  )
}
