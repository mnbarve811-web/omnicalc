import { ADSENSE_CLIENT } from '@/lib/adsense'

// AdSense requires ads.txt to authorise the publisher; until a client id is configured there is nothing to publish.
export function GET() {
  if (ADSENSE_CLIENT === undefined) return new Response('Not found', { status: 404 })
  const publisherId = ADSENSE_CLIENT.replace('ca-', '')
  return new Response(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { 'Content-Type': 'text/plain' },
  })
}
