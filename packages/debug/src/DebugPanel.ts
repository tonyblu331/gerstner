import { buildSnapshot, type GridDebugSnapshot } from 'gerstner/stride/snapshot'
import { renderFieldSummary, renderFieldDetail } from './inspector/fieldInspector.js'
import { formatWarningBadge } from './warnings.js'

const SCOPE_SELECTOR = '.g-shell, .g, .g-fit, .g-fill, .g-sub'
const LAYER_KEYS = ['cols', 'baseline', 'rhythm', 'zones'] as const

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

/* ── CSS value helpers ── */

function resolveVarAsPx(scope: HTMLElement, varName: string): number {
  const append = scope.appendChild?.bind(scope)
  const remove = scope.removeChild?.bind(scope)
  if (typeof append !== 'function' || typeof remove !== 'function') return 0

  let probe: HTMLDivElement | null = null
  try {
    probe = document.createElement('div')
    probe.setAttribute('data-g-debug-probe', '')
    probe.style.cssText = [
      'position:absolute',
      'visibility:hidden',
      'pointer-events:none',
      'inset-inline-start:-99999px',
      'inset-block-start:0',
      'inline-size:0',
      'margin:0',
      'padding:0',
      'border:none',
      'overflow:hidden',
      'box-sizing:border-box',
    ].join(';')
    probe.style.setProperty('width', `var(${varName})`)
    append(probe)
    const w = probe.getBoundingClientRect().width
    remove(probe)
    probe = null
    return Number.isFinite(w) && w > 0 ? w : 0
  } catch {
    if (probe) {
      try {
        remove!(probe)
      } catch {
        /* ignore */
      }
    }
    return 0
  }
}

function readScopeValues(scope: HTMLElement): ScopeValues {
  const style = getComputedStyle(scope)
  const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16

  const getNum = (prop: string, fallback: number) => {
    return parseFloat(style.getPropertyValue(prop).trim()) || fallback
  }

  const getRem = (prop: string, fallback: number) => {
    const px = resolveVarAsPx(scope, prop)
    return px > 0 ? px / rootFontSize : fallback
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

/* ── Panel control definitions ── */

interface ControlDef {
  label: string
  prop: string
  min: number
  max: number
  step: number
  unit?: string
}

const GRID_CONTROLS: ControlDef[] = [
  { label: 'Columns', prop: '--g-cols', min: 3, max: 24, step: 1 },
  { label: 'Gutter', prop: '--g-gutter', min: 0, max: 4, step: 0.25, unit: 'rem' },
  { label: 'Frame', prop: '--g-frame', min: 0, max: 10, step: 0.5, unit: 'rem' },
  { label: 'Body Size', prop: '--g-max-width', min: 40, max: 160, step: 5, unit: 'rem' },
]

const TYPE_CONTROLS: ControlDef[] = [
  { label: 'Baseline', prop: '--g-baseline', min: 0.25, max: 2, step: 0.25, unit: 'rem' },
  { label: 'Leading Steps', prop: '--g-leading-steps', min: 1, max: 6, step: 1 },
  { label: 'Scale Ratio', prop: '--g-scale-ratio', min: 1.05, max: 2, step: 0.05 },
]

const OVERLAYS = [
  { label: 'cols', key: 'cols' },
  { label: 'baseline', key: 'baseline' },
  { label: 'rhythm', key: 'rhythm' },
  { label: 'zones', key: 'zones' },
]

/* ── Vanilla Debug Panel ── */

export class DebugPanel {
  private container: HTMLElement
  private scope: HTMLElement = document.documentElement
  private pinned = false
  private inspectorOpen = false
  private snapshot: GridDebugSnapshot | null = null

  private panelBody: HTMLElement
  private inspectorEl: HTMLElement | null = null
  private inspectorToggle: HTMLButtonElement

  private pointerHandler: ((e: PointerEvent) => void) | null = null
  private clickHandler: ((e: MouseEvent) => void) | null = null
  private styleObserver: MutationObserver | null = null

  private inputMap = new Map<string, HTMLInputElement>()

  constructor() {
    this.container = document.createElement('div')
    this.container.className = 'g-debug-root'

    const panel = document.createElement('div')
    panel.className = 'g-debug-panel'

    // Header
    const header = document.createElement('header')
    header.className = 'g-debug-header'
    header.innerHTML = `<span class="g-debug-brand">Gerstner</span>`
    const toggleBtn = document.createElement('button')
    toggleBtn.className = 'g-debug-toggle'
    toggleBtn.setAttribute('aria-label', 'Toggle panel')
    toggleBtn.textContent = '▾'
    toggleBtn.addEventListener('click', () => this.togglePanel())
    header.appendChild(toggleBtn)

    // Body
    this.panelBody = document.createElement('div')
    this.panelBody.className = 'g-debug-body'

    this.panelBody.appendChild(this.buildSection('Grid', GRID_CONTROLS))
    this.panelBody.appendChild(this.buildSection('Typography', TYPE_CONTROLS))
    this.panelBody.appendChild(this.buildOverlaySection())

    panel.appendChild(header)
    panel.appendChild(this.panelBody)
    this.container.appendChild(panel)

    // Inspector toggle
    this.inspectorToggle = document.createElement('button')
    this.inspectorToggle.className = 'g-debug-inspector-toggle'
    this.inspectorToggle.textContent = 'inspector ▶'
    this.inspectorToggle.setAttribute('aria-label', 'Toggle field inspector')
    this.inspectorToggle.addEventListener('click', () => this.toggleInspector())
    this.container.appendChild(this.inspectorToggle)

    document.body.appendChild(this.container)

    this.setupEventListeners()
    this.setupObservers()

    const firstShell = document.querySelector<HTMLElement>(SCOPE_SELECTOR)
    this.rescope(firstShell ?? document.documentElement)
  }

  /* ── DOM builders ── */

  private buildSection(title: string, controls: ControlDef[]): HTMLElement {
    const section = document.createElement('section')
    section.className = 'g-debug-section'

    const h3 = document.createElement('h3')
    h3.textContent = title
    section.appendChild(h3)

    for (const ctrl of controls) {
      const row = document.createElement('label')
      row.className = 'g-debug-row'

      const labelSpan = document.createElement('span')
      labelSpan.className = 'g-debug-label'
      labelSpan.textContent = ctrl.label

      const input = document.createElement('input')
      input.type = 'range'
      input.className = 'g-debug-slider'
      input.min = String(ctrl.min)
      input.max = String(ctrl.max)
      input.step = String(ctrl.step)
      input.dataset.prop = ctrl.prop
      if (ctrl.unit) input.dataset.unit = ctrl.unit

      const output = document.createElement('output')
      output.className = 'g-debug-value'
      output.textContent = '-'

      input.addEventListener('input', () => {
        this.writeProperty(ctrl.prop, input.value + (ctrl.unit ?? ''))
        output.textContent = input.value + (ctrl.unit ? ` ${ctrl.unit}` : '')
      })

      row.appendChild(labelSpan)
      row.appendChild(input)
      row.appendChild(output)
      section.appendChild(row)

      this.inputMap.set(ctrl.prop, input)
    }

    return section
  }

  private buildOverlaySection(): HTMLElement {
    const section = document.createElement('section')
    section.className = 'g-debug-section'

    const h3 = document.createElement('h3')
    h3.textContent = 'Overlays'
    section.appendChild(h3)

    for (const layer of OVERLAYS) {
      const row = document.createElement('label')
      row.className = 'g-debug-row g-debug-row--toggle'

      const labelSpan = document.createElement('span')
      labelSpan.className = 'g-debug-label'
      labelSpan.textContent = layer.label

      const input = document.createElement('input')
      input.type = 'checkbox'
      input.dataset.layer = layer.key

      input.addEventListener('change', () => {
        document.body.setAttribute(`data-g-debug-${layer.key}`, String(input.checked))
      })

      row.appendChild(labelSpan)
      row.appendChild(input)
      section.appendChild(row)

      this.inputMap.set(`layer:${layer.key}`, input)
    }

    return section
  }

  /* ── Scope & value sync ── */

  private writeProperty(prop: string, value: string) {
    this.scope.style.setProperty(prop, value)
  }

  rescope(scope: HTMLElement) {
    if (this.scope === scope) return

    this.scope = scope
    const values = readScopeValues(scope)

    for (const ctrl of [...GRID_CONTROLS, ...TYPE_CONTROLS]) {
      const input = this.inputMap.get(ctrl.prop)
      if (!input) continue

      let value: number
      switch (ctrl.prop) {
        case '--g-cols':
          value = values.Columns
          break
        case '--g-gutter':
          value = values.Gutter
          break
        case '--g-frame':
          value = values.Frame
          break
        case '--g-max-width':
          value = values['Body Size']
          break
        case '--g-baseline':
          value = values.Baseline
          break
        case '--g-leading-steps':
          value = values['Leading Steps']
          break
        case '--g-scale-ratio':
          value = values['Scale Ratio']
          break
        default:
          value = parseFloat(input.value) || 0
      }

      input.value = String(value)
      const output = input.nextElementSibling as HTMLOutputElement
      if (output) {
        output.textContent = String(value) + (ctrl.unit ? ` ${ctrl.unit}` : '')
      }
    }

    // Refresh snapshot for inspector
    this.snapshot = buildSnapshot(scope)
    if (this.inspectorOpen && this.inspectorEl) {
      this.updateInspector()
    }

    document.dispatchEvent(new CustomEvent('gerstner-debug-sync', { detail: { scope } }))
  }

  private refreshOverlayToggles() {
    for (const layer of LAYER_KEYS) {
      const input = this.inputMap.get(`layer:${layer}`) as HTMLInputElement | undefined
      if (!input) continue
      input.checked = document.body.getAttribute(`data-g-debug-${layer}`) === 'true'
    }
  }

  /* ── Inspector ── */

  private toggleInspector() {
    this.inspectorOpen = !this.inspectorOpen

    if (!this.inspectorOpen) {
      if (this.inspectorEl) {
        this.inspectorEl.remove()
        this.inspectorEl = null
      }
      this.inspectorToggle.textContent = 'inspector ▶'
      return
    }

    this.inspectorToggle.textContent = 'inspector ▼'

    if (!this.snapshot) {
      this.snapshot = buildSnapshot(this.scope)
    }

    this.inspectorEl = document.createElement('div')
    this.inspectorEl.className = 'g-debug-inspector'
    this.updateInspector()
    this.container.appendChild(this.inspectorEl)
  }

  private updateInspector() {
    if (!this.inspectorEl || !this.snapshot) return

    const snap = this.snapshot
    const warningsHtml =
      snap.warnings.length > 0
        ? `<div class="g-debug-warnings">${snap.warnings
            .map((w) => `<div title="${formatWarningBadge(w)}">⚠ ${w.code}</div>`)
            .join('')}</div>`
        : ''

    this.inspectorEl.innerHTML = `
      <div class="g-debug-inspector-header">
        <strong>${renderFieldSummary(snap)}</strong>
        <button class="g-debug-inspector-close" aria-label="Close inspector">✕</button>
      </div>
      <pre class="g-debug-inspector-detail">${renderFieldDetail(snap)}</pre>
      ${warningsHtml}
    `

    this.inspectorEl.querySelector('.g-debug-inspector-close')?.addEventListener('click', () => {
      this.toggleInspector()
    })
  }

  /* ── Panel collapse ── */

  private togglePanel() {
    const collapsed = this.panelBody.classList.toggle('is-collapsed')
    const btn = this.container.querySelector('.g-debug-toggle')
    if (btn) btn.textContent = collapsed ? '▸' : '▾'
  }

  /* ── Event listeners ── */

  private setupEventListeners() {
    this.pointerHandler = (e: PointerEvent) => {
      if (this.pinned) return
      const target = e.target instanceof HTMLElement ? e.target : null
      const scope = target?.closest<HTMLElement>(SCOPE_SELECTOR) ?? document.documentElement
      if (scope !== this.scope) {
        this.rescope(scope)
      }
    }

    document.addEventListener('pointermove', this.pointerHandler, { passive: true })

    this.clickHandler = (e: MouseEvent) => {
      const target = e.target instanceof HTMLElement ? e.target : null
      // Don't intercept clicks on the panel itself
      if (target?.closest('.g-debug-panel, .g-debug-inspector, .g-debug-inspector-toggle')) return

      const scope = target?.closest<HTMLElement>(SCOPE_SELECTOR)
      if (!scope) {
        if (this.pinned) {
          this.pinned = false
          this.rescope(document.documentElement)
        }
        return
      }

      if (e.altKey || !this.pinned) {
        this.pinned = true
        this.rescope(scope)
      } else if (this.pinned && scope === this.scope) {
        this.pinned = false
      }
    }

    document.addEventListener('click', this.clickHandler)
  }

  /* ── Observers ── */

  private setupObservers() {
    this.styleObserver = new MutationObserver(() => {
      // Refresh slider values if the scope's inline style was changed externally
      const values = readScopeValues(this.scope)
      for (const ctrl of [...GRID_CONTROLS, ...TYPE_CONTROLS]) {
        const input = this.inputMap.get(ctrl.prop)
        if (!input || input === document.activeElement) continue // Don't overwrite while user is dragging

        let value: number
        switch (ctrl.prop) {
          case '--g-cols':
            value = values.Columns
            break
          case '--g-gutter':
            value = values.Gutter
            break
          case '--g-frame':
            value = values.Frame
            break
          case '--g-max-width':
            value = values['Body Size']
            break
          case '--g-baseline':
            value = values.Baseline
            break
          case '--g-leading-steps':
            value = values['Leading Steps']
            break
          case '--g-scale-ratio':
            value = values['Scale Ratio']
            break
          default:
            value = parseFloat(input.value) || 0
        }

        if (input.value !== String(value)) {
          input.value = String(value)
          const output = input.nextElementSibling as HTMLOutputElement
          if (output) {
            output.textContent = String(value) + (ctrl.unit ? ` ${ctrl.unit}` : '')
          }
        }
      }
    })

    this.styleObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style'],
    })
  }

  /* ── Cleanup ── */

  destroy() {
    if (this.pointerHandler) {
      document.removeEventListener('pointermove', this.pointerHandler)
    }
    if (this.clickHandler) {
      document.removeEventListener('click', this.clickHandler)
    }
    this.styleObserver?.disconnect()
    this.container.remove()
  }
}
