import { createRoot } from 'react-dom/client'
import { DebugPanel } from './DebugPanel.js'
import { syncDebugMetrics, applyDriftDetection, syncShellOverlays } from './observer.js'

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
    for (const layer of LAYERS) {
      document.body.setAttribute(`data-g-debug-${layer}`, String(initialLayers[layer] ?? false))
    }
  }

  // DialKit scope (hover/pin) drives baseline/rhythm on .g-debug-root; else first .g-shell.
  let metricsScope: HTMLElement | null = null

  const syncMetrics = () => {
    const debugRoot = document.querySelector<HTMLElement>('.g-debug-root')
    if (!debugRoot) return
    const scope =
      metricsScope ?? document.querySelector<HTMLElement>('.g-shell') ?? document.documentElement
    syncDebugMetrics(debugRoot, scope)
  }

  const syncCols = () => {
    const colsActive = document.body.getAttribute('data-g-debug-cols') === 'true'
    syncShellOverlays(colsActive)
  }

  // Defer sync to ensure DOM is fully populated and laid out
  setTimeout(() => {
    syncLayers()
    syncMetrics()
    syncCols()
    applyDriftDetection()
  }, 0)

  // Recompute metrics and per-shell overlays on resize
  const resizeObserver = new ResizeObserver(() => {
    syncMetrics()
    syncCols()
    applyDriftDetection()
  })

  // Observe documentElement for resize events
  setTimeout(() => {
    resizeObserver.observe(document.documentElement)
  }, 0)

  // Watch for cols layer toggle to re-render per-shell overlays
  const colsObserver = new MutationObserver(() => {
    syncCols()
  })
  setTimeout(() => {
    colsObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-g-debug-cols'],
    })
  }, 0)

  // Watch for inline style changes on scope element (DialKit writes --g-cols etc. to inline style).
  // ResizeObserver on documentElement doesn't fire when --g-cols changes because the document
  // size doesn't change — only the internal grid layout reflows.
  const styleObserver = new MutationObserver(() => {
    syncMetrics()
    syncCols()
    applyDriftDetection()
  })

  const observeShellStyles = () => {
    document.querySelectorAll<HTMLElement>('.g-shell').forEach((shell) => {
      styleObserver.observe(shell, {
        attributes: true,
        attributeFilter: ['style'],
      })
    })
  }

  setTimeout(() => {
    styleObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style'],
    })
    observeShellStyles()
  }, 0)

  const fullResync = () => {
    syncMetrics()
    syncCols()
    applyDriftDetection()
  }

  // DebugPanel rescopes DialKit to hovered/pinned .g-shell — refresh metrics for baseline/rhythm.
  const onGerstnerDebugSync = (ev: Event) => {
    const ce = ev as CustomEvent<{ scope?: HTMLElement }>
    if (ce.detail?.scope) metricsScope = ce.detail.scope
    queueMicrotask(() => fullResync())
  }
  document.addEventListener('gerstner-debug-sync', onGerstnerDebugSync)

  // Re-sync per-shell overlays after SPA route changes.
  // The router replaces mount innerHTML, destroying old overlay divs.
  const onRouteChange = () => {
    metricsScope = null
    setTimeout(() => {
      observeShellStyles()
      fullResync()
    }, 0)
  }
  window.addEventListener('hashchange', onRouteChange)

  // Keyboard shortcuts for layer toggles
  const onKeyDown = (event: KeyboardEvent) => {
    if (!event.altKey) return

    const key = event.key.toLowerCase()
    const debugRoot = document.querySelector<HTMLElement>('.g-debug-root')
    if (!debugRoot) return

    if (key === '0') {
      // Alt+0 — turn all layers off
      for (const layer of LAYERS) {
        document.body.setAttribute(`data-g-debug-${layer}`, 'false')
      }
      event.preventDefault()
      return
    }

    const layerIndex = ['1', '2', '3', '4', '5'].indexOf(key)
    if (layerIndex >= 0) {
      const layer = LAYERS[layerIndex]
      const attr = `data-g-debug-${layer}`
      const current = document.body.getAttribute(attr) === 'true'
      document.body.setAttribute(attr, String(!current))
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
      document.removeEventListener('gerstner-debug-sync', onGerstnerDebugSync)
      window.removeEventListener('hashchange', onRouteChange)
      resizeObserver.disconnect()
      colsObserver.disconnect()
      styleObserver.disconnect()
      syncShellOverlays(false)
      root.unmount()
      container.remove()
    },
    toggleLayer(layer) {
      const attr = `data-g-debug-${layer}`
      const current = document.body.getAttribute(attr) === 'true'
      document.body.setAttribute(attr, String(!current))
    },
    exportContract,
  }
}
