'use client'

import { useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export type FieldDef<V> = {
  param: string
  default: V
  parse: (s: string) => V
  serialize: (v: V) => string
}

export type Schema<T> = { [K in keyof T]: FieldDef<T[K]> }

export function useCalculatorUrl<T extends Record<string, unknown>>(
  schema: Schema<T>
): [T, (patch: Partial<T>) => void] {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  // Edits written since the URL last changed. Two quick edits would otherwise both start from the
  // same render's values, and the second router.replace would drop the first edit.
  const pending = useRef<{ params: unknown; values: T } | null>(null)

  const values = Object.fromEntries(
    Object.entries(schema).map(([key, fieldRaw]) => {
      const field = fieldRaw as FieldDef<unknown>
      const raw = searchParams.get(field.param)
      if (raw === null) return [key, field.default]
      try {
        const parsed = field.parse(raw)
        if (typeof parsed === 'number' && isNaN(parsed)) return [key, field.default]
        return [key, parsed]
      } catch {
        return [key, field.default]
      }
    })
  ) as T

  function setValues(patch: Partial<T>) {
    const base = pending.current?.params === searchParams ? pending.current.values : values
    const next = { ...base, ...patch }
    pending.current = { params: searchParams, values: next }
    const params = new URLSearchParams()
    let hasNonDefault = false
    for (const [key, fieldRaw] of Object.entries(schema)) {
      const field = fieldRaw as FieldDef<unknown>
      const val = (next as Record<string, unknown>)[key]
      // Compared serialized so a list edited back to its default content is still omitted
      if (field.serialize(val) !== field.serialize(field.default)) {
        params.set(field.param, field.serialize(val))
        hasNonDefault = true
      }
    }
    const query = hasNonDefault ? `?${params.toString()}` : ''
    router.replace(`${pathname}${query}`, { scroll: false })
  }

  return [values, setValues]
}

// URLs are untrusted input, and every item adds work to the per-month simulations
const MAX_LIST_ITEMS = 50

// Only the separators and '%' are escaped: URLSearchParams percent-encodes the rest, and a full
// encodeURIComponent here would double-encode (a space would reach the URL as %2520)
function encodeListPart(part: string | number): string {
  return String(part).replace(/[%_~]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
}

// Items are joined by '_' and their fields by '~'
export function listField<Item extends object>(
  param: string,
  defaultValue: Item[],
  toParts: (item: Item) => (string | number)[],
  fromParts: (parts: string[]) => Item,
): FieldDef<Item[]> {
  return {
    param,
    default: defaultValue,
    serialize: items => items.map(item => toParts(item).map(encodeListPart).join('~')).join('_'),
    parse: raw => {
      if (raw === '') return []
      return raw.split('_').slice(0, MAX_LIST_ITEMS).map(chunk => {
        const item = fromParts(chunk.split('~').map(decodeURIComponent))
        if (Object.values(item).some(v => typeof v === 'number' && !Number.isFinite(v))) {
          throw new Error(`Invalid number in ${param}`)
        }
        return item
      })
    },
  }
}
