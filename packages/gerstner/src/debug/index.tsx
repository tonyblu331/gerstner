import { createRoot } from 'react-dom/client'
import { DebugPanel } from './DebugPanel.js'

export interface GerstnerDebugOptions {
  defaultOpen?: boolean
  initial?: {
    layers?: Partial<Record<DebugLayer, boolean>>
  }
  scope?: string | HTMLElement
  root?: ParentNode
  onResize?: (metrics: GerstnerDebugMetrics) => void
}

export interface GerstnerDebugController {
  destroy: () => void
  refresh: () => void
  setScope: (scope: HTMLElement | null) => void
  toggleLayer: (layer: DebugLayer) => void
  exportContract: () => string
}

export interface GerstnerDebugMetrics {
  cols: number
  gutter: number
  frame: number
  contentWidth: number
  stride: number
  rhythm: number
  baseline: number
  maxWidth: number
  measure: string
  scaleRatio: number
}

export type DebugLayer = 'cols' | 'baseline' | 'rhythm' | 'zones' | 'drift'

export function initGerstnerDebug(options: GerstnerDebugOptions = {}): GerstnerDebugController {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return {
      destroy() {},
      refresh() {},
      setScope() {},
      toggleLayer() {},
      exportContract() {
        return ''
      },
    }
  }

  // Create mount container
  const container = document.createElement('div')
  container.className = 'g-debug-root'
  const mount = options.root ?? document.body
  mount.appendChild(container)

  // Mount React app
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
    const grids = document.querySelectorAll<HTMLElement>('.g-shell, .g, .g-fit, .g-fill, .g-sub')
    grids.forEach((grid) => {
      grid.setAttribute('data-g-debug-cols', String(initialLayers.cols ?? false))
      grid.setAttribute('data-g-debug-baseline', String(initialLayers.baseline ?? false))
      grid.setAttribute('data-g-debug-rhythm', String(initialLayers.rhythm ?? false))
      grid.setAttribute('data-g-debug-zones', String(initialLayers.zones ?? false))
      grid.setAttribute('data-g-debug-drift', String(initialLayers.drift ?? false))
    })
  }

  syncLayers()

  // Keyboard shortcuts for layer toggles
  const onKeyDown = (event: KeyboardEvent) => {
    if (!event.altKey) return

    const key = event.key.toLowerCase()
    if (key === 'g') {
      // Panel toggle handled by DialKit
      return
    }

    const layers: DebugLayer[] = ['cols', 'baseline', 'rhythm', 'zones', 'drift']
    const layerIndex = ['1', '2', '3', '4', '5'].indexOf(key)

    if (layerIndex >= 0) {
      const layer = layers[layerIndex]
      const grids = document.querySelectorAll<HTMLElement>('.g-shell, .g, .g-fit, .g-fill, .g-sub')
      grids.forEach((grid) => {
        const attr = `data-g-debug-${layer}`
        const current = grid.getAttribute(attr) === 'true'
        grid.setAttribute(attr, String(!current))
      })
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
      root.unmount()
      container.remove()
    },
    refresh() {
      // DialKit handles its own refresh via useEffect
    },
    setScope(scope) {
      // Handled by DebugPanel pointer tracking
      if (scope) {
        scope.dispatchEvent(new CustomEvent('g-debug-scope-change', { detail: { scope } }))
      }
    },
    toggleLayer(layer) {
      const grids = document.querySelectorAll<HTMLElement>('.g-shell, .g, .g-fit, .g-fill, .g-sub')
      grids.forEach((grid) => {
        const attr = `data-g-debug-${layer}`
        const current = grid.getAttribute(attr) === 'true'
        grid.setAttribute(attr, String(!current))
      })
    },
    exportContract,
  }
}
