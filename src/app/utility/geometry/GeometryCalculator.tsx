'use client'

import { useCalculatorUrl, type Schema } from '@/lib/hooks/use-calculator-url'
import { calculateGeometry, type GeometryShape } from '@/lib/engine/utility'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ExportButtons } from '@/components/common/ExportButtons'

interface GeomParams {
  shape: GeometryShape
  r: number
  w: number
  h: number
  base: number
  a: number
  b: number
  c: number
}

const SHAPES: { id: GeometryShape; label: string }[] = [
  { id: 'circle',    label: 'Circle' },
  { id: 'rectangle', label: 'Rectangle' },
  { id: 'triangle',  label: 'Triangle' },
  { id: 'cylinder',  label: 'Cylinder' },
  { id: 'sphere',    label: 'Sphere' },
  { id: 'cone',      label: 'Cone' },
]

// Unknown shape values from the URL fall back to the default instead of crashing the switch below.
function parseShape(raw: string): GeometryShape {
  const match = SHAPES.find(s => s.id === raw)
  if (!match) throw new Error(`Unknown shape: ${raw}`)
  return match.id
}

const SCHEMA = {
  shape: { param: 'shape', default: 'circle' as GeometryShape, parse: parseShape, serialize: (s: GeometryShape) => s },
  r:     { param: 'r',     default: 5,   parse: Number, serialize: String },
  w:     { param: 'w',     default: 4,   parse: Number, serialize: String },
  h:     { param: 'h',     default: 6,   parse: Number, serialize: String },
  base:  { param: 'base',  default: 3,   parse: Number, serialize: String },
  a:     { param: 'a',     default: 3,   parse: Number, serialize: String },
  b:     { param: 'b',     default: 4,   parse: Number, serialize: String },
  c:     { param: 'c',     default: 5,   parse: Number, serialize: String },
} as const satisfies Schema<GeomParams>

function getDimensions(v: GeomParams): Record<string, number> {
  switch (v.shape) {
    case 'circle':    return { radius: v.r }
    case 'rectangle': return { width: v.w, height: v.h }
    case 'triangle':  return { base: v.base, height: v.h, a: v.a, b: v.b, c: v.c }
    case 'cylinder':  return { radius: v.r, height: v.h }
    case 'sphere':    return { radius: v.r }
    case 'cone':      return { radius: v.r, height: v.h }
  }
}

function fmt(n: number) {
  return n.toFixed(4).replace(/\.?0+$/, '') || '0'
}

function ShapeDiagram({ shape }: { shape: GeometryShape }) {
  if (shape === 'circle') return (
    <svg viewBox="0 0 120 120" className="w-full max-w-[160px] mx-auto block" aria-hidden>
      <circle cx="60" cy="60" r="48" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
      <line x1="60" y1="60" x2="108" y2="60" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" className="text-muted-foreground" />
      <text x="80" y="55" fontSize="12" textAnchor="middle" className="fill-muted-foreground" fill="currentColor">r</text>
    </svg>
  )

  if (shape === 'rectangle') return (
    <svg viewBox="0 0 140 100" className="w-full max-w-[180px] mx-auto block" aria-hidden>
      <rect x="15" y="15" width="110" height="70" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
      <text x="70" y="100" fontSize="12" textAnchor="middle" fill="currentColor" className="fill-muted-foreground">width</text>
      <text x="4" y="52" fontSize="12" textAnchor="middle" fill="currentColor" className="fill-muted-foreground" transform="rotate(-90,4,52)">height</text>
    </svg>
  )

  if (shape === 'triangle') return (
    <svg viewBox="0 0 140 120" className="w-full max-w-[180px] mx-auto block" aria-hidden>
      <polygon points="70,10 10,110 130,110" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
      <line x1="70" y1="10" x2="70" y2="110" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" className="text-muted-foreground" />
      <text x="80" y="65" fontSize="12" fill="currentColor" className="fill-muted-foreground">h</text>
      <text x="70" y="120" fontSize="12" textAnchor="middle" fill="currentColor" className="fill-muted-foreground">base</text>
    </svg>
  )

  if (shape === 'cylinder') return (
    <svg viewBox="0 0 100 130" className="w-full max-w-[140px] mx-auto block" aria-hidden>
      <ellipse cx="50" cy="25" rx="38" ry="12" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
      <line x1="12" y1="25" x2="12" y2="105" stroke="currentColor" strokeWidth="2" className="text-primary" />
      <line x1="88" y1="25" x2="88" y2="105" stroke="currentColor" strokeWidth="2" className="text-primary" />
      <ellipse cx="50" cy="105" rx="38" ry="12" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
      <line x1="50" y1="25" x2="88" y2="25" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" className="text-muted-foreground" />
      <text x="69" y="20" fontSize="11" textAnchor="middle" fill="currentColor" className="fill-muted-foreground">r</text>
      <text x="95" y="68" fontSize="11" fill="currentColor" className="fill-muted-foreground">h</text>
    </svg>
  )

  if (shape === 'sphere') return (
    <svg viewBox="0 0 120 120" className="w-full max-w-[160px] mx-auto block" aria-hidden>
      <circle cx="60" cy="60" r="48" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
      <ellipse cx="60" cy="60" rx="48" ry="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" className="text-muted-foreground" />
      <line x1="60" y1="60" x2="108" y2="60" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" className="text-muted-foreground" />
      <text x="80" y="55" fontSize="12" textAnchor="middle" fill="currentColor" className="fill-muted-foreground">r</text>
    </svg>
  )

  // cone
  return (
    <svg viewBox="0 0 100 130" className="w-full max-w-[140px] mx-auto block" aria-hidden>
      <line x1="50" y1="10" x2="10" y2="110" stroke="currentColor" strokeWidth="2" className="text-primary" />
      <line x1="50" y1="10" x2="90" y2="110" stroke="currentColor" strokeWidth="2" className="text-primary" />
      <ellipse cx="50" cy="110" rx="40" ry="12" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
      <line x1="50" y1="10" x2="50" y2="110" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" className="text-muted-foreground" />
      <line x1="50" y1="110" x2="90" y2="110" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" className="text-muted-foreground" />
      <text x="55" y="65" fontSize="11" fill="currentColor" className="fill-muted-foreground">h</text>
      <text x="68" y="106" fontSize="11" textAnchor="middle" fill="currentColor" className="fill-muted-foreground">r</text>
    </svg>
  )
}

function NumericInput({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium mb-1 block">{label}</label>
      <Input
        id={id}
        type="number"
        value={value}
        min={0}
        onChange={e => onChange(Number(e.target.value))}
      />
    </div>
  )
}

const RESULT_LABELS: Record<string, string> = {
  area: 'Area',
  perimeter: 'Perimeter',
  volume: 'Volume',
  surfaceArea: 'Surface Area',
}

const DIMENSION_LABELS: Record<string, string> = {
  radius: 'Radius',
  width: 'Width',
  height: 'Height',
  base: 'Base',
  a: 'Side a',
  b: 'Side b',
  c: 'Side c',
}

function hasRequiredDimensions(v: GeomParams): boolean {
  switch (v.shape) {
    case 'circle':    return v.r > 0
    case 'rectangle': return v.w > 0 && v.h > 0
    case 'triangle':  return v.base > 0 && v.h > 0
    case 'cylinder':  return v.r > 0 && v.h > 0
    case 'sphere':    return v.r > 0
    case 'cone':      return v.r > 0 && v.h > 0
  }
}

export function GeometryCalculator() {
  const [values, setValues] = useCalculatorUrl<GeomParams & Record<string, unknown>>(
    SCHEMA as Schema<GeomParams & Record<string, unknown>>
  )

  const v = values
  const dimensions = getDimensions(v)
  const result = calculateGeometry({ shape: v.shape, dimensions })

  const resultEntries = Object.entries(result).filter(
    (entry): entry is [string, number] => entry[1] !== undefined
  )

  const canExport = hasRequiredDimensions(v)
  const csvRow: Record<string, unknown> = { Shape: SHAPES.find(s => s.id === v.shape)?.label ?? v.shape }
  for (const [key, val] of Object.entries(dimensions)) csvRow[DIMENSION_LABELS[key] ?? key] = val
  for (const [key, val] of resultEntries) csvRow[RESULT_LABELS[key] ?? key] = fmt(val)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
      {/* Left: shape selector + inputs */}
      <Card>
        <CardHeader><CardTitle>Shape &amp; Dimensions</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          {/* Shape buttons */}
          <div>
            <p className="text-sm font-medium mb-2">Shape</p>
            <div className="grid grid-cols-3 gap-2">
              {SHAPES.map(s => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={v.shape === s.id}
                  onClick={() => setValues({ shape: s.id })}
                  className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                    v.shape === s.id
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic dimension inputs */}
          <div className="space-y-4">
            {v.shape === 'circle' && (
              <NumericInput id="geom-radius" label="Radius" value={v.r} onChange={r => setValues({ r })} />
            )}
            {v.shape === 'rectangle' && (<>
              <NumericInput id="geom-width" label="Width" value={v.w} onChange={w => setValues({ w })} />
              <NumericInput id="geom-height" label="Height" value={v.h} onChange={h => setValues({ h })} />
            </>)}
            {v.shape === 'triangle' && (<>
              <NumericInput id="geom-base" label="Base" value={v.base} onChange={base => setValues({ base })} />
              <NumericInput id="geom-height" label="Height" value={v.h} onChange={h => setValues({ h })} />
              <p className="text-xs text-muted-foreground">Optional: enter all three sides to calculate perimeter</p>
              <NumericInput id="geom-side-a" label="Side a" value={v.a} onChange={a => setValues({ a })} />
              <NumericInput id="geom-side-b" label="Side b" value={v.b} onChange={b => setValues({ b })} />
              <NumericInput id="geom-side-c" label="Side c" value={v.c} onChange={c => setValues({ c })} />
            </>)}
            {(v.shape === 'cylinder' || v.shape === 'cone') && (<>
              <NumericInput id="geom-radius" label="Radius" value={v.r} onChange={r => setValues({ r })} />
              <NumericInput id="geom-height" label="Height" value={v.h} onChange={h => setValues({ h })} />
            </>)}
            {v.shape === 'sphere' && (
              <NumericInput id="geom-radius" label="Radius" value={v.r} onChange={r => setValues({ r })} />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Right: diagram + results */}
      <div id="geometry-results" className="space-y-6">
        <ExportButtons
          resultsId="geometry-results"
          filename="geometry"
          csvRows={[csvRow]}
          disabled={!canExport}
        />
        <Card>
          <CardHeader><CardTitle>Diagram</CardTitle></CardHeader>
          <CardContent>
            <ShapeDiagram shape={v.shape} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {resultEntries.map(([key, val]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {RESULT_LABELS[key] ?? key}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{fmt(val)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
