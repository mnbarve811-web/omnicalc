// html2canvas 1.4 cannot parse modern colour functions, which Tailwind v4 themes use everywhere.
// Browsers resolve color-mix() to lab() in computed styles, so these four forms cover what it sees.
const UNSUPPORTED_COLOR = /\b(?:oklch|oklab|lab|lch)\([^()]*\)/g

function createColorConverter(): (cssColor: string) => string {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  const cache = new Map<string, string>()

  return (cssColor) => {
    const cached = cache.get(cssColor)
    if (cached !== undefined) return cached
    if (ctx === null) return 'rgb(0, 0, 0)'
    ctx.clearRect(0, 0, 1, 1)
    ctx.fillStyle = cssColor
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
    const rgb = `rgba(${r}, ${g}, ${b}, ${Math.round((a / 255) * 1000) / 1000})`
    cache.set(cssColor, rgb)
    return rgb
  }
}

function inlineSupportedColors(root: HTMLElement): void {
  const view = root.ownerDocument.defaultView
  if (view === null) return
  const toRgb = createColorConverter()
  const elements = [root, ...Array.from(root.querySelectorAll<HTMLElement | SVGElement>('*'))]

  // Every property is scanned because html2canvas reads more than the obvious ones (e.g. -webkit-text-stroke-color)
  // and copies all computed styles onto the elements it creates for ::before/::after
  for (const element of elements) {
    const computed = view.getComputedStyle(element)
    for (let i = 0; i < computed.length; i++) {
      const property = computed[i]
      if (property.startsWith('--')) continue
      const value = computed.getPropertyValue(property)
      if (!value.includes('lab(') && !value.includes('lch(')) continue
      element.style.setProperty(property, value.replace(UNSUPPORTED_COLOR, toRgb))
    }
  }
}

export async function exportToPDF(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId)
  if (element === null) throw new Error(`Export target #${elementId} not found`)

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')])

  // html2canvas parses the live <html> and <body> backgrounds before cloning, so onclone cannot fix those two
  const pageRoots = [document.documentElement, document.body]
  const savedBackgrounds = pageRoots.map(el => el.style.backgroundColor)
  const toRgb = createColorConverter()
  for (const el of pageRoots) el.style.backgroundColor = toRgb(getComputedStyle(el).backgroundColor)

  let canvas: HTMLCanvasElement
  try {
    canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      ignoreElements: (el) => el.hasAttribute('data-export-buttons'),
      onclone: (_doc, clonedElement) => inlineSupportedColors(clonedElement),
    })
  } finally {
    pageRoots.forEach((el, i) => { el.style.backgroundColor = savedBackgrounds[i] })
  }

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const margin = 10
  const pageWidth = pdf.internal.pageSize.getWidth() - margin * 2
  const pageHeight = pdf.internal.pageSize.getHeight() - margin * 2
  const imageHeight = (canvas.height * pageWidth) / canvas.width
  const image = canvas.toDataURL('image/jpeg', 0.85)

  // Tall results are split across pages by re-drawing the same image shifted up one page at a time;
  // the shared alias makes jsPDF embed the image once rather than once per page
  for (let offset = 0; offset < imageHeight; offset += pageHeight) {
    if (offset > 0) pdf.addPage()
    pdf.addImage(image, 'JPEG', margin, margin - offset, pageWidth, imageHeight, 'results', 'FAST')
  }

  pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`)
}
