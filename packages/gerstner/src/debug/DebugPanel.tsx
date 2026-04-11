import { useEffect, useRef, useState, useCallback } from 'react'
import { DialRoot, useDialKit } from 'dialkit'
import type { DebugLayer } from './index.js'

interface DebugPanelProps {
  onScopeChange?: (scope: HTMLElement | null) => void
  onPinChange?: (pinned: boolean) => void
}

const LAYERS: DebugLayer[] = ['cols', 'baseline', 'rhythm', 'zones', 'drift']

export function DebugPanel({ onScopeChange, onPinChange }: DebugPanelProps) {
  const [activeScope, setActiveScope] = useState<HTMLElement | null>(null)
  const [pinned, setPinned] = useState(false)
  const hoveredRef = useRef<HTMLElement | null>(null)

  // Read computed values from scope
  const readScopeValues = useCallback((scope: HTMLElement | null) => {
    if (!scope) {
      return {
        cols: 12,
        gutter: 1,
        frame: 2,
        max_width: 90,
        min: 16,
        baseline: 0.5,
        rhythm: 1,
        scale: 1.25,
        measure: '70ch',
        show_cols: false,
        show_baseline: false,
        show_rhythm: false,
        show_zones: false,
        show_drift: false,
      }
    }

    const style = getComputedStyle(scope)
    const getRem = (prop: string, fallback: number) => {
      const val = style.getPropertyValue(prop).trim()
      if (!val) return fallback
      // Convert to rem if in px, or parse rem directly
      if (val.endsWith('rem')) return parseFloat(val)
      if (val.endsWith('px')) return parseFloat(val) / 16
      return parseFloat(val) || fallback
    }
    const getNum = (prop: string, fallback: number) => {
      const val = style.getPropertyValue(prop).trim()
      return parseFloat(val) || fallback
    }
    const getStr = (prop: string, fallback: string) => {
      return style.getPropertyValue(prop).trim() || fallback
    }

    return {
      cols: getNum('--g-cols', 12),
      gutter: getRem('--g-gutter', 1),
      frame: getRem('--g-frame', 2),
      max_width: getRem('--g-max-width', 90),
      min: getRem('--g-min', 16),
      baseline: getRem('--g-baseline', 0.5),
      rhythm: getRem('--g-rhythm', 1),
      scale: getNum('--g-scale-ratio', 1.25),
      measure: getStr('--g-measure', '70ch'),
      show_cols: scope.getAttribute('data-g-debug-cols') === 'true',
      show_baseline: scope.getAttribute('data-g-debug-baseline') === 'true',
      show_rhythm: scope.getAttribute('data-g-debug-rhythm') === 'true',
      show_zones: scope.getAttribute('data-g-debug-zones') === 'true',
      show_drift: scope.getAttribute('data-g-debug-drift') === 'true',
    }
  }, [])

  // Initialize DialKit with scope values
  const [config, setConfig] = useState(() => readScopeValues(document.documentElement))

  const params = useDialKit('Gerstner', {
    grid: {
      cols: [config.cols, 3, 24, 1],
      gutter: [config.gutter, 0, 4],
      frame: [config.frame, 0, 8],
      max_width: [config.max_width, 40, 160],
      min: [config.min, 8, 32],
    },
    type: {
      baseline: [config.baseline, 0.25, 2],
      rhythm: [config.rhythm, 0.5, 4],
      scale: [config.scale, 1.05, 2],
      measure: config.measure,
    },
    show_cols: config.show_cols,
    show_baseline: config.show_baseline,
    show_rhythm: config.show_rhythm,
    show_zones: config.show_zones,
    show_drift: config.show_drift,
  })

  // Update config when scope changes
  useEffect(() => {
    const values = readScopeValues(activeScope)
    setConfig(values)
  }, [activeScope, readScopeValues])

  // Write CSS custom properties when params change
  useEffect(() => {
    const scope = activeScope || document.documentElement

    scope.style.setProperty('--g-cols', String(params.grid.cols))
    scope.style.setProperty('--g-gutter', `${params.grid.gutter}rem`)
    scope.style.setProperty('--g-frame', `${params.grid.frame}rem`)
    scope.style.setProperty('--g-max-width', `${params.grid.max_width}rem`)
    scope.style.setProperty('--g-min', `${params.grid.min}rem`)
    scope.style.setProperty('--g-baseline', `${params.type.baseline}rem`)
    scope.style.setProperty('--g-rhythm', `${params.type.rhythm}rem`)
    scope.style.setProperty('--g-scale-ratio', String(params.type.scale))
    scope.style.setProperty('--g-measure', params.type.measure)

    // Update layer attributes on all grid elements
    const grids = document.querySelectorAll<HTMLElement>('.g-shell, .g, .g-fit, .g-fill, .g-sub')
    grids.forEach((grid) => {
      grid.setAttribute('data-g-debug-cols', String(params.show_cols))
      grid.setAttribute('data-g-debug-baseline', String(params.show_baseline))
      grid.setAttribute('data-g-debug-rhythm', String(params.show_rhythm))
      grid.setAttribute('data-g-debug-zones', String(params.show_zones))
      grid.setAttribute('data-g-debug-drift', String(params.show_drift))
    })
  }, [params, activeScope])

  // Pointer tracking for scope
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const target = e.target instanceof HTMLElement ? e.target : null
      const scope =
        target?.closest<HTMLElement>('.g-shell, .g, .g-fit, .g-fill, .g-sub') ||
        document.documentElement
      hoveredRef.current = scope

      if (!pinned) {
        setActiveScope(scope)
        onScopeChange?.(scope)
      }
    }

    document.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => document.removeEventListener('pointermove', onPointerMove)
  }, [pinned, onScopeChange])

  // Click to pin/unpin
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target instanceof HTMLElement ? e.target : null
      const scope = target?.closest<HTMLElement>('.g-shell, .g, .g-fit, .g-fill, .g-sub')

      if (!scope) return

      if (e.altKey || !pinned) {
        setPinned(true)
        setActiveScope(scope)
        onScopeChange?.(scope)
        onPinChange?.(true)
      } else if (pinned && scope === activeScope) {
        // Click same scope when pinned = unpin
        setPinned(false)
        onPinChange?.(false)
      }
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [pinned, activeScope, onScopeChange, onPinChange])

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.altKey) return

      const key = e.key.toLowerCase()
      if (key === 'g') {
        // Toggle panel - handled by DialRoot internally
        return
      }

      const layerIndex = ['0', '1', '2', '3', '4', '5'].indexOf(key)
      if (layerIndex === 0) {
        // Alt+0 - turn all off
        const grids = document.querySelectorAll<HTMLElement>(
          '.g-shell, .g, .g-fit, .g-fill, .g-sub',
        )
        grids.forEach((grid) => {
          LAYERS.forEach((layer) => grid.setAttribute(`data-g-debug-${layer}`, 'false'))
        })
      } else if (layerIndex > 0) {
        const layer = LAYERS[layerIndex - 1]
        const attr = `data-g-debug-${layer}`
        const grids = document.querySelectorAll<HTMLElement>(
          '.g-shell, .g, .g-fit, .g-fill, .g-sub',
        )
        grids.forEach((grid) => {
          const current = grid.getAttribute(attr) === 'true'
          grid.setAttribute(attr, String(!current))
        })
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return <DialRoot position="top-right" />
}
