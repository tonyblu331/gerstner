import { createRoot } from 'react-dom/client'
import { DebugPanel } from './DebugPanel.js'
import { syncDebugMetrics, applyDriftDetection } from './observer.js'

export type DebugLayer = 'cols' | 'baseline' | 'rhythm' | 'zones' | 'drift'

const LAYERS: DebugLayer[] = ['cols', 'baseline', 'rhythm', 'zones', 'drift']

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
    const debugRoot = document.querySelector<HTMLElement>('.g-debug-root')
    if (!debugRoot) return

    for (const layer of LAYERS) {
      debugRoot.setAttribute(`data-g-debug-${layer}`, String(initialLayers[layer] ?? false))
    }
  }

  // Sync debug overlay pixel values from stride tokens (manifest truth).
  // No heuristic track parsing — observer.ts reads resolved stride CSS custom properties.
  const syncMetrics = () => {
    const debugRoot = document.querySelector<HTMLElement>('.g-debug-root')
    if (!debugRoot) return
    syncDebugMetrics(debugRoot, document.documentElement)
  }

  // Defer sync to ensure DOM is fully populated and laid out
  setTimeout(() => {
    syncLayers()
    syncMetrics()
    applyDriftDetection()
  }, 0)

  // Recompute metrics on resize
  const resizeObserver = new ResizeObserver(() => {
    syncMetrics()
    applyDriftDetection()
  })

  // Observe documentElement for global metrics
  setTimeout(() => {
    resizeObserver.observe(document.documentElement)
  }, 0)

  // Keyboard shortcuts for layer toggles
  const onKeyDown = (event: KeyboardEvent) => {
    if (!event.altKey) return

    const key = event.key.toLowerCase()
    const debugRoot = document.querySelector<HTMLElement>('.g-debug-root')
    if (!debugRoot) return

    if (key === '0') {
      // Alt+0 — turn all layers off
      for (const layer of LAYERS) {
        debugRoot.setAttribute(`data-g-debug-${layer}`, 'false')
      }
      event.preventDefault()
      return
    }

    const layerIndex = ['1', '2', '3', '4', '5'].indexOf(key)
    if (layerIndex >= 0) {
      const layer = LAYERS[layerIndex]
      const attr = `data-g-debug-${layer}`
      const current = debugRoot.getAttribute(attr) === 'true'
      debugRoot.setAttribute(attr, String(!current))
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
  --g-measure-body: ${style.getPropertyValue('--g-measure-body').trim() || '70ch'};
  --g-measure-tight: ${style.getPropertyValue('--g-measure-tight').trim() || '45ch'};
  --g-measure-ui: ${style.getPropertyValue('--g-measure-ui').trim() || '35ch'};
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
