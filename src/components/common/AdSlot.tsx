'use client'

import { useEffect, useRef } from 'react'
import { ADSENSE_CLIENT, AD_SLOTS, type AdPlacement } from '@/lib/adsense'

// Placements are chosen by the page template so an ad never sits between a calculator's inputs and its results.
export function AdSlot({ placement }: { placement: AdPlacement }) {
  const slot = AD_SLOTS[placement]
  const hasRequested = useRef(false)

  useEffect(() => {
    if (ADSENSE_CLIENT === undefined || slot === undefined || hasRequested.current) return
    hasRequested.current = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle ?? []).push({})
    } catch {
      // AdSense throws when blocked or when the slot was already filled; the page works without the ad
    }
  }, [slot])

  if (ADSENSE_CLIENT === undefined || slot === undefined) return null

  return (
    <aside aria-label="Advertisement" className="my-12">
      <p className="mb-2 text-xs text-muted-foreground">Advertisement</p>
      {/* min-height reserves the space so the page doesn't shift when the ad loads */}
      <div className="min-h-[280px]">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  )
}
