import { createRoot } from 'react-dom/client'
import { DebugPanel } from './DebugPanel.js'

export type DebugLayer = 'cols' | 'baseline' | 'rhythm' | 'zones' | 'drift'

const LAYERS: DebugLayer[] = ['cols', 'baseline', 'rhythm', 'zones', 'drift']
const SCOPE_SELECTOR = '.g-shell, .g, .g-fit, .g-fill, .g-sub'

export interface GerstnerDebugOptions {
  defaultOpen?: boolean
  initial?: {
    layers?: Partial<Record<DebugLayer, boolean>>
  }
}

export interface GerstnerDebugController {
  destroy: () => void
  toggleLayer: (layer: DebugLayer) => void
  exportContract: () => string
}

export function initGerstnerDebug(options: GerstnerDebugOptions = {}): GerstnerDebugController {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return {
      destroy() {},
      toggleLayer() {},
      exportContract() {
        return ''
      },
    }
  }

  const container = document.createElement('div')
  container.className = 'g-debug-root'
  document.body.appendChild(container)

  const root = createRoot(container)
  root.render(<DebugPanel />)

  // Initialize layer attributes from options
  const initialLayers = options.initial?.layers ?? {
    cols: true,
    baseline: true,
    rhythm: false,
    zones: false,
    drift: false,
  }

  const syncLayers = () => {
    const root = document.querySelector<HTMLElement>('.g-debug-root')
    if (!root) return

    for (const layer of LAYERS) {
      root.setAttribute(`data-g-debug-${layer}`, String(initialLayers[layer] ?? false))
    }
  }

  // Compute resolved pixel values for overlay gradients.
  // var(--g-col-unit-raw) contains cqi which can't resolve in gradient color stops,
  // so JS must compute the actual pixel values and set them as --g-debug-* properties.
  const syncMetrics = () => {
    const root = document.querySelector<HTMLElement>('.g-debug-root')
    if (!root) return

    // Use the document root (or first grid) for global metrics
    const scope = document.documentElement
    const cs = getComputedStyle(scope)
    const cols = parseInt(cs.getPropertyValue('--g-cols')) || 12

    // Parse resolved track sizes from gridTemplateColumns
    const tracks = cs.gridTemplateColumns
    if (!tracks || tracks === 'none') return

    // Extract px values from the computed template
    const pxValues = [...tracks.matchAll(/([\d.]+)px/g)].map((m) => parseFloat(m[1]))
    if (pxValues.length === 0) return

    // Find column width: the smallest track that appears most frequently
    // (gutters are typically smaller than columns)
    const sorted = [...pxValues].sort((a, b) => a - b)
    const gutterPx = sorted[0] // smallest track = gutter
    const colPx = sorted.find((v) => v > gutterPx * 1.5) ?? sorted[sorted.length - 1] // first track bigger than 1.5x gutter = column

    const stridePx = colPx + gutterPx

    root.style.setProperty('--g-debug-col-px', `${colPx}px`)
    root.style.setProperty('--g-debug-gutter-px', `${gutterPx}px`)
    root.style.setProperty('--g-debug-stride-px', `${stridePx}px`)
  }

  // Defer sync to ensure DOM is fully populated and laid out
  setTimeout(() => {
    syncLayers()
    syncMetrics()
  }, 0)

  // Recompute metrics on resize
  const resizeObserver = new ResizeObserver(() => {
    syncMetrics()
  })

  // Observe documentElement for global metrics
  setTimeout(() => {
    resizeObserver.observe(document.documentElement)
  }, 0)

  // Keyboard shortcuts for layer toggles
  const onKeyDown = (event: KeyboardEvent) => {
    if (!event.altKey) return

    const key = event.key.toLowerCase()
    const root = document.querySelector<HTMLElement>('.g-debug-root')
    if (!root) return

    if (key === '0') {
      // Alt+0 — turn all layers off
      for (const layer of LAYERS) {
        root.setAttribute(`data-g-debug-${layer}`, 'false')
      }
      event.preventDefault()
      return
    }

    const layerIndex = ['1', '2', '3', '4', '5'].indexOf(key)
    if (layerIndex >= 0) {
      const layer = LAYERS[layerIndex]
      const attr = `data-g-debug-${layer}`
      const current = root.getAttribute(attr) === 'true'
      root.setAttribute(attr, String(!current))
      event.preventDefault()
    }
  }

  document.addEventListener('keydown', onKeyDown)

  const exportContract = () => {
    const scope = document.documentElement
    const style = getComputedStyle(scope)
    const css = `:root {
  --g-cols: ${style.getPropertyValue('--g-cols').trim() || '12'};
  --g-gutter: ${style.getPropertyValue('--g-gutter').trim() || 'clamp(0.875rem, 2.2vw, 1.5rem)'};
  --g-frame: ${style.getPropertyValue('--g-frame').trim() || 'clamp(1rem, 5dvw, 5rem)'};
  --g-max-width: ${style.getPropertyValue('--g-max-width').trim() || '90rem'};
  --g-min: ${style.getPropertyValue('--g-min').trim() || '16rem'};
  --g-type-base: ${style.getPropertyValue('--g-type-base').trim() || '1rem'};
  --g-baseline: ${style.getPropertyValue('--g-baseline').trim() || '0.5rem'};
  --g-leading-steps: ${style.getPropertyValue('--g-leading-steps').trim() || '3'};
  --g-scale-ratio: ${style.getPropertyValue('--g-scale-ratio').trim() || '1.25'};
  --g-measure: ${style.getPropertyValue('--g-measure').trim() || '70ch'};
}`
    navigator.clipboard.writeText(css).catch(() => {})
    return css
  }

  return {
    destroy() {
      document.removeEventListener('keydown', onKeyDown)
      resizeObserver.disconnect()
      root.unmount()
      container.remove()
    },
    toggleLayer(layer) {
      const debugRoot = document.querySelector<HTMLElement>('.g-debug-root')
      if (!debugRoot) return
      const attr = `data-g-debug-${layer}`
      const current = debugRoot.getAttribute(attr) === 'true'
      debugRoot.setAttribute(attr, String(!current))
    },
    exportContract,
  }
}
