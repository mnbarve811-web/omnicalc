// AdSense stays dormant until these build-time variables are set; malformed values are ignored rather than rendered.
const CLIENT_PATTERN = /^ca-pub-\d{10,20}$/
const SLOT_PATTERN = /^\d{6,20}$/

function readId(value: string | undefined, pattern: RegExp): string | undefined {
  return value !== undefined && pattern.test(value) ? value : undefined
}

export const ADSENSE_CLIENT = readId(process.env.NEXT_PUBLIC_ADSENSE_CLIENT, CLIENT_PATTERN)

export const AD_SLOTS = {
  'after-results': readId(process.env.NEXT_PUBLIC_ADSENSE_SLOT_AFTER_RESULTS, SLOT_PATTERN),
  'in-content': readId(process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT, SLOT_PATTERN),
} as const

export type AdPlacement = keyof typeof AD_SLOTS

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}
