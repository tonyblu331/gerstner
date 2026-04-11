import { useEffect, useRef, useState } from 'react'
import { DialRoot, useDialKit } from 'dialkit'

const SCOPE_SELECTOR = '.g-shell, .g, .g-fit, .g-fill, .g-sub'

function readScopeValues(scope: HTMLElement) {
  const style = getComputedStyle(scope)
  const getRem = (prop: string, fallback: number) => {
    const val = style.getPropertyValue(prop).trim()
    if (!val) return fallback
    if (val.endsWith('rem')) return parseFloat(val)
    if (val.endsWith('px')) return parseFloat(val) / 16
    return parseFloat(val) || fallback
  }
  const getNum = (prop: string, fallback: number) => {
    return parseFloat(style.getPropertyValue(prop).trim()) || fallback
  }

  return {
    cols: getNum('--g-cols', 12),
    gutter: getRem('--g-gutter', 1.5),
    frame: getRem('--g-frame', 5),
    max_width: getRem('--g-max-width', 90),
    baseline: getRem('--g-baseline', 0.5),
    leading: getNum('--g-leading-steps', 3),
    scale: getNum('--g-scale-ratio', 1.25),
  }
}

export function DebugPanel() {
  const [scopeId, setScopeId] = useState(0) // bump to force re-render + DialKit re-init
  const [panelOpen, setPanelOpen] = useState(true)
  const scopeRef = useRef<HTMLElement>(document.documentElement)
  const pinnedRef = useRef(false)

  const values = readScopeValues(scopeRef.current)

  const params = useDialKit('Gerstner', {
    grid: {
      cols: [values.cols, 3, 24, 1],
      gutter: [values.gutter, 0, 4, 0.25],
      frame: [values.frame, 0, 10, 0.5],
      max_width: [values.max_width, 40, 160, 5],
    },
    type: {
      baseline: [values.baseline, 0.25, 2, 0.25],
      leading: [values.leading, 1, 6, 1],
      scale: [values.scale, 1.05, 2, 0.05],
    },
  })

  // Write CSS custom properties when params change — with correct units
  useEffect(() => {
    const scope = scopeRef.current
    scope.style.setProperty('--g-cols', String(params.grid.cols))
    scope.style.setProperty('--g-gutter', `${params.grid.gutter}rem`)
    scope.style.setProperty('--g-frame', `${params.grid.frame}rem`)
    scope.style.setProperty('--g-max-width', `${params.grid.max_width}rem`)
    scope.style.setProperty('--g-baseline', `${params.type.baseline}rem`)
    scope.style.setProperty('--g-leading-steps', String(params.type.leading))
    scope.style.setProperty('--g-scale-ratio', String(params.type.scale))
  }, [params])

  // Pointer tracking for scope — hover to dial
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (pinnedRef.current) return
      const target = e.target instanceof HTMLElement ? e.target : null
      const scope = target?.closest<HTMLElement>(SCOPE_SELECTOR) ?? document.documentElement
      if (scope !== scopeRef.current) {
        scopeRef.current = scope
        setScopeId((n) => n + 1)
      }
    }

    document.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => document.removeEventListener('pointermove', onPointerMove)
  }, [])

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
        scopeRef.current = scope
        setScopeId((n) => n + 1)
      } else if (pinnedRef.current && scope === scopeRef.current) {
        pinnedRef.current = false
      }
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  // Alt+D to toggle panel visibility (D for Debug)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'd') {
        setPanelOpen((v) => !v)
        e.preventDefault()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <button
        onClick={() => setPanelOpen((v) => !v)}
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 10000,
          padding: '0.5rem 1rem',
          background: '#000',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: '500',
        }}
      >
        {panelOpen ? 'Hide Panel' : 'Show Panel'}
      </button>
      {panelOpen && <DialRoot position="top-right" />}
    </>
  )
}
