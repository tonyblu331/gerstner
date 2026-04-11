export function renderDebugCss(): string {
  return `@import "gerstner/debug/debug.css";
`
}

export function renderDebugScript(): string {
  return `import { initGerstnerDebug } from 'gerstner/debug'

if (import.meta.env.DEV && !(window).__GERSTNER_DEBUG__) {
  ;(window).__GERSTNER_DEBUG__ = initGerstnerDebug({
    defaultOpen: false,
    initial: {
      layers: {
        cols: true,
        baseline: true,
        rhythm: false,
        zones: false,
        drift: false
      }
    }
  })
}
`
}
