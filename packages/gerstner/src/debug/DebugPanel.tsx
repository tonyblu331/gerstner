import { useCallback, useEffect, useRef, useState } from 'react'
import { DialRoot, DialStore, useDialKit } from 'dialkit'

const SCOPE_SELECTOR = '.g-shell, .g, .g-fit, .g-fill, .g-sub'
const LAYER_KEYS = ['cols', 'baseline', 'rhythm', 'zones', 'drift'] as const
const DEFAULT_LAYERS: Record<string, boolean> = {
  cols: true,
  baseline: true,
  rhythm: false,
  zones: false,
  drift: false,
}

// @property initial-value declarations from stride/index.css — single source of truth
const PROPERTY_DEFAULTS = {
  '--g-cols': 12,
  '--g-gutter': 1,
  '--g-frame': 1,
  '--g-max-width': 90,
  '--g-baseline': 0.5,
  '--g-leading-steps': 3,
  '--g-scale-ratio': 1.25,
} as const

interface ScopeValues {
  Columns: number
  Gutter: number
  Frame: number
  'Body Size': number
  Baseline: number
  'Leading Steps': number
  'Scale Ratio': number
}

// Read CSS custom properties from an element — called ONCE per scope change, never in render path
function readScopeValues(scope: HTMLElement): ScopeValues {
  const style = getComputedStyle(scope)
  const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  const getRem = (prop: string, fallback: number) => {
    const val = style.getPropertyValue(prop).trim()
    if (!val) return fallback
    if (val.endsWith('rem')) return parseFloat(val)
    if (val.endsWith('px')) return parseFloat(val) / rootFontSize
    return parseFloat(val) || fallback
  }
  const getNum = (prop: string, fallback: number) => {
    return parseFloat(style.getPropertyValue(prop).trim()) || fallback
  }

  return {
    Columns: getNum('--g-cols', PROPERTY_DEFAULTS['--g-cols']),
    Gutter: getRem('--g-gutter', PROPERTY_DEFAULTS['--g-gutter']),
    Frame: getRem('--g-frame', PROPERTY_DEFAULTS['--g-frame']),
    'Body Size': getRem('--g-max-width', PROPERTY_DEFAULTS['--g-max-width']),
    Baseline: getRem('--g-baseline', PROPERTY_DEFAULTS['--g-baseline']),
    'Leading Steps': getNum('--g-leading-steps', PROPERTY_DEFAULTS['--g-leading-steps']),
    'Scale Ratio': getNum('--g-scale-ratio', PROPERTY_DEFAULTS['--g-scale-ratio']),
  }
}

export function DebugPanel() {
  const scopeRef = useRef<HTMLElement>(document.documentElement)
  const pinnedRef = useRef(false)
  const layerStatesRef = useRef<Record<string, boolean>>({})
  const syncingRef = useRef(false)

  // Read CSS values ONCE at mount, store in state — never in render path
  const [values, setValues] = useState<ScopeValues>(() => readScopeValues(document.documentElement))
  // Initialize from DEFAULT_LAYERS (matches index.tsx defaults) — MutationObserver syncs external changes
  const [layerStates, setLayerStates] = useState<Record<string, boolean>>(() => ({
    ...DEFAULT_LAYERS,
  }))
  layerStatesRef.current = layerStates

  // Re-read scope values when scope changes (hover/pin) — single getComputedStyle call
  const rescope = useCallback((scope: HTMLElement) => {
    scopeRef.current = scope
    setValues(readScopeValues(scope))
    document.dispatchEvent(new CustomEvent('gerstner-debug-sync', { detail: { scope } }))
  }, [])

  const params = useDialKit(
    'Gerstner',
    {
      Grid: {
        Columns: [values.Columns, 3, 24, 1],
        Gutter: [values.Gutter, 0, 4, 0.25],
        Frame: [values.Frame, 0, 10, 0.5],
        'Body Size': [values['Body Size'], 40, 160, 5],
      },
      Typography: {
        Baseline: [values.Baseline, 0.25, 2, 0.25],
        'Leading Steps': [values['Leading Steps'], 1, 6, 1],
        'Scale Ratio': [values['Scale Ratio'], 1.05, 2, 0.05],
      },
      Overlays: {
        cols: layerStates.cols,
        baseline: layerStates.baseline,
        rhythm: layerStates.rhythm,
        zones: layerStates.zones,
        drift: layerStates.drift,
      },
    },
    {
      shortcuts: {
        'Overlays.cols': { key: '1', modifier: 'alt' },
        'Overlays.baseline': { key: '2', modifier: 'alt' },
        'Overlays.rhythm': { key: '3', modifier: 'alt' },
        'Overlays.zones': { key: '4', modifier: 'alt' },
        'Overlays.drift': { key: '5', modifier: 'alt' },
      },
    },
  )

  // Write CSS custom properties when params change — DialKit owns the state, writes to CSS
  useEffect(() => {
    const scope = scopeRef.current
    scope.style.setProperty('--g-cols', String(params.Grid.Columns))
    scope.style.setProperty('--g-gutter', `${params.Grid.Gutter}rem`)
    scope.style.setProperty('--g-frame', `${params.Grid.Frame}rem`)
    scope.style.setProperty('--g-max-width', `${params.Grid['Body Size']}rem`)
    scope.style.setProperty('--g-baseline', `${params.Typography.Baseline}rem`)
    scope.style.setProperty('--g-leading-steps', String(params.Typography['Leading Steps']))
    scope.style.setProperty('--g-scale-ratio', String(params.Typography['Scale Ratio']))
  }, [params.Grid, params.Typography])

  // Sync overlay toggles → DOM data attributes
  useEffect(() => {
    const debugRoot = document.querySelector<HTMLElement>('.g-debug-root')
    if (!debugRoot) return
    syncingRef.current = true // prevent observer from echoing back
    for (const layer of LAYER_KEYS) {
      const current = debugRoot.getAttribute(`data-g-debug-${layer}`) === 'true'
      const target = params.Overlays[layer]
      if (current !== target) {
        debugRoot.setAttribute(`data-g-debug-${layer}`, String(target))
      }
    }
    syncingRef.current = false
  }, [
    params.Overlays.cols,
    params.Overlays.baseline,
    params.Overlays.rhythm,
    params.Overlays.zones,
    params.Overlays.drift,
  ])

  // Watch for DOM attribute changes (keyboard shortcuts) → sync back to DialKit + state
  useEffect(() => {
    const debugRoot = document.querySelector<HTMLElement>('.g-debug-root')
    if (!debugRoot) return

    const observer = new MutationObserver(() => {
      if (syncingRef.current) return // skip echo from panel-initiated changes

      const panels = DialStore.getPanels()
      const panel = panels.find((p) => p.name === 'Gerstner')
      if (!panel) return

      const newStates = { ...layerStatesRef.current }
      let changed = false
      for (const layer of LAYER_KEYS) {
        const domValue = debugRoot.getAttribute(`data-g-debug-${layer}`) === 'true'
        const dialValue = DialStore.getValue(panel.id, `Overlays.${layer}`)
        if (domValue !== dialValue) {
          DialStore.updateValue(panel.id, `Overlays.${layer}`, domValue)
        }
        if (newStates[layer] !== domValue) {
          newStates[layer] = domValue
          changed = true
        }
      }
      if (changed) setLayerStates(newStates)
    })

    observer.observe(debugRoot, {
      attributes: true,
      attributeFilter: LAYER_KEYS.map((l) => `data-g-debug-${l}`),
    })
    return () => observer.disconnect()
  }, [])

  // Pointer tracking for scope — hover to dial
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (pinnedRef.current) return
      const target = e.target instanceof HTMLElement ? e.target : null
      const scope = target?.closest<HTMLElement>(SCOPE_SELECTOR) ?? document.documentElement
      if (scope !== scopeRef.current) {
        rescope(scope)
      }
    }

    document.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => document.removeEventListener('pointermove', onPointerMove)
  }, [rescope])

  // Click to pin/unpin scope
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target instanceof HTMLElement ? e.target : null
      // Don't intercept clicks on the DialKit panel
      if (target?.closest('.dialkit-root')) return

      const scope = target?.closest<HTMLElement>(SCOPE_SELECTOR)
      if (!scope) return

      if (e.altKey || !pinnedRef.current) {
        pinnedRef.current = true
        rescope(scope)
      } else if (pinnedRef.current && scope === scopeRef.current) {
        pinnedRef.current = false
      }
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [rescope])

  return <DialRoot position="top-right" defaultOpen />
}
