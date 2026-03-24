export interface GerstnerDebugMetrics {
  label: string
  mode: string
  modeLabel: string
  preset: string
  cols: number
  gutter: number
  frame: number
  contentWidth: number
  columnWidth: number
  stride: number
  rhythm: number
  prose: number
  baseline: number
  fitMin: number
  maxWidth: number
  measure: string
  scaleRatio: number
  trimSupport: string
}

export interface GerstnerDebugOptions {
  defaultOpen?: boolean
  initial?: {
    overlay?: boolean
    badge?: boolean
    ruler?: boolean
  }
  scope?: string | HTMLElement
  root?: ParentNode
  onResize?: (metrics: GerstnerDebugMetrics) => void
}

export interface GerstnerDebugController {
  destroy: () => void
  refresh: () => void
  setScope: (scope: HTMLElement | null) => void
  exportContract: () => string
}

interface DebugState {
  panel: boolean
  overlay: boolean
  badge: boolean
  ruler: boolean
  pinned: boolean
}

const STORAGE_KEY = 'gerstner:debug:v2'

export function initGerstnerDebug(options: GerstnerDebugOptions = {}): GerstnerDebugController {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return {
      destroy() {},
      refresh() {},
      setScope() {},
      exportContract() {
        return ''
      }
    }
  }

  const state = loadState(options)
  const root = createRoot(state)
  const mount = options.root ?? document.body
  mount.appendChild(root)

  const overlay = root.querySelector<HTMLElement>('[data-testid="gerstner-debug-overlay"]')!
  const ruler = root.querySelector<HTMLElement>('[data-testid="gerstner-debug-ruler"]')!
  const panel = root.querySelector<HTMLElement>('[data-testid="gerstner-debug-panel"]')!
  const badge = root.querySelector<HTMLElement>('[data-testid="gerstner-debug-badge"]')!
  const launcher = root.querySelector<HTMLButtonElement>('[data-testid="gerstner-debug-launcher"]')!
  const status = root.querySelector<HTMLElement>('[data-g-debug-status]')!

  let hoveredScope: HTMLElement | null = null
  let activeScope = resolveExplicitScope(options.scope) ?? document.documentElement
  let activeMetrics = readMetrics(activeScope)
  let observer: ResizeObserver | null = null

  const bindObserver = (scope: HTMLElement) => {
    observer?.disconnect()
    observer = new ResizeObserver(() => refresh())
    observer.observe(scope)
    observer.observe(document.documentElement)
  }

  const sync = () => {
    persistState(state)
    syncState(root, state)
  }

  const exportContract = () => renderContractFromMetrics(activeScope)

  const flashStatus = (message: string) => {
    status.textContent = message
    status.dataset.state = 'visible'
    window.clearTimeout((flashStatus as { timer?: number }).timer)
    ;(flashStatus as { timer?: number }).timer = window.setTimeout(() => {
      status.dataset.state = 'idle'
    }, 1600)
  }

  const setScope = (scope: HTMLElement | null) => {
    activeScope = scope ?? document.documentElement
    bindObserver(activeScope)
    refresh()
  }

  const refresh = () => {
    activeMetrics = readMetrics(activeScope)
    writeOverlayVars(root, activeMetrics)
    writePanel(panel, activeMetrics, state)
    writeBadge(badge, activeMetrics)
    root.style.setProperty('--g-debug-baseline', `${activeMetrics.baseline}px`)
    overlay.setAttribute('aria-hidden', String(!state.overlay))
    ruler.setAttribute('aria-hidden', String(!state.ruler))
    badge.setAttribute('aria-hidden', String(!state.badge))
    options.onResize?.(activeMetrics)
  }

  const onPointerMove = (event: PointerEvent) => {
    const target = event.target instanceof HTMLElement ? event.target : null
    hoveredScope = resolveScopeFromTarget(target)
    if (!state.pinned && hoveredScope) {
      setScope(hoveredScope)
    }
  }

  const onClick = async (event: MouseEvent) => {
    const target = event.target instanceof HTMLElement ? event.target : null
    const action = target?.closest<HTMLElement>('[data-g-debug-action]')?.dataset.gDebugAction

    if (action) {
      event.preventDefault()

      if (action === 'panel') state.panel = !state.panel
      if (action === 'overlay') state.overlay = !state.overlay
      if (action === 'badge') state.badge = !state.badge
      if (action === 'ruler') state.ruler = !state.ruler
      if (action === 'pin') {
        state.pinned = !state.pinned
        if (state.pinned && hoveredScope) setScope(hoveredScope)
      }
      if (action === 'reset') {
        state.pinned = false
        setScope(resolveExplicitScope(options.scope) ?? document.documentElement)
      }
      if (action === 'export') {
        const css = exportContract()
        const copied = await copyText(css)
        flashStatus(copied ? 'Contract copied' : 'Contract ready below')
        const output = root.querySelector<HTMLTextAreaElement>('[data-g-debug-export]')
        if (output) {
          output.value = css
        }
      }

      sync()
      refresh()
      return
    }

    if (!event.altKey) return

    const scope = resolveScopeFromTarget(target)
    if (!scope) return

    state.pinned = true
    setScope(scope)
    sync()
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (!event.altKey) return

    const key = event.key.toLowerCase()
    if (key === 'g') state.panel = !state.panel
    if (key === 'o') state.overlay = !state.overlay
    if (key === 'b') state.badge = !state.badge
    if (key === 'r') state.ruler = !state.ruler
    if (!['g', 'o', 'b', 'r'].includes(key)) return

    sync()
    refresh()
    event.preventDefault()
  }

  document.addEventListener('pointermove', onPointerMove, { passive: true })
  document.addEventListener('click', onClick, true)
  document.addEventListener('keydown', onKeyDown)
  window.addEventListener('resize', refresh, { passive: true })
  window.addEventListener('scroll', refresh, { passive: true })

  launcher.addEventListener('click', () => {
    state.panel = !state.panel
    sync()
    refresh()
  })

  bindObserver(activeScope)
  sync()
  refresh()

  return {
    destroy() {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', refresh)
      window.removeEventListener('scroll', refresh)
      observer?.disconnect()
      root.remove()
    },
    refresh,
    setScope,
    exportContract
  }
}

function createRoot(state: DebugState): HTMLElement {
  const root = document.createElement('div')
  root.className = 'g-debug-root'
  root.innerHTML = `
    <div class="g-debug-overlay" data-testid="gerstner-debug-overlay" aria-hidden="false"></div>
    <div class="g-debug-ruler" data-testid="gerstner-debug-ruler" aria-hidden="true"></div>

    <aside class="g-debug-panel" data-testid="gerstner-debug-panel">
      <div class="g-debug-toolbar">
        <div class="g-debug-title">
          <strong>Gerstner inspector</strong>
          <span>Stride metrics and contract export for the current scope</span>
        </div>
        <button class="g-debug-button" data-g-debug-action="panel" type="button" aria-pressed="${String(state.panel)}">Panel</button>
      </div>

      <div class="g-debug-actions">
        <button class="g-debug-button" data-g-debug-action="overlay" type="button" aria-pressed="${String(state.overlay)}">Overlay</button>
        <button class="g-debug-button" data-g-debug-action="badge" type="button" aria-pressed="${String(state.badge)}">Badge</button>
        <button class="g-debug-button" data-g-debug-action="ruler" type="button" aria-pressed="${String(state.ruler)}">Baseline</button>
        <button class="g-debug-button" data-g-debug-action="pin" type="button" aria-pressed="${String(state.pinned)}">Pin scope</button>
        <button class="g-debug-button" data-g-debug-action="reset" type="button">Root</button>
        <button class="g-debug-button" data-g-debug-action="export" type="button">Export CSS</button>
      </div>

      <div class="g-debug-section">
        <div>
          <p class="g-debug-caption">Scope</p>
          <div class="g-debug-status-row">
            <span class="g-debug-dot"></span>
            <strong data-g-debug-field="scope-label">Document root</strong>
          </div>
          <p class="g-debug-meta" data-g-debug-field="scope-meta">Raw grid</p>
        </div>

        <dl class="g-debug-stat-grid">
          <div class="g-debug-stat"><dt>Columns</dt><dd data-g-debug-field="cols">12</dd></div>
          <div class="g-debug-stat"><dt>Gutter</dt><dd data-g-debug-field="gutter">0px</dd></div>
          <div class="g-debug-stat"><dt>Frame</dt><dd data-g-debug-field="frame">0px</dd></div>
          <div class="g-debug-stat"><dt>Content width</dt><dd data-g-debug-field="content-width">0px</dd></div>
          <div class="g-debug-stat"><dt>Column width</dt><dd data-g-debug-field="column-width">0px</dd></div>
          <div class="g-debug-stat"><dt>Stride</dt><dd data-g-debug-field="stride">0px</dd></div>
          <div class="g-debug-stat"><dt>Rhythm</dt><dd data-g-debug-field="rhythm">0px</dd></div>
          <div class="g-debug-stat"><dt>Prose leading</dt><dd data-g-debug-field="prose">0</dd></div>
          <div class="g-debug-stat"><dt>Baseline</dt><dd data-g-debug-field="baseline">0px</dd></div>
          <div class="g-debug-stat"><dt>Adaptive minimum</dt><dd data-g-debug-field="fit-min">0px</dd></div>
          <div class="g-debug-stat"><dt>Measure</dt><dd data-g-debug-field="measure">70ch</dd></div>
          <div class="g-debug-stat"><dt>Text trim</dt><dd data-g-debug-field="trim">unknown</dd></div>
        </dl>

        <textarea class="g-debug-export" data-g-debug-export spellcheck="false" aria-label="Exported contract CSS"></textarea>
        <p class="g-debug-shortcuts"><span class="g-debug-muted">Shortcuts</span> Alt+G panel · Alt+O overlay · Alt+B badge · Alt+R baseline · hover a marked scope to inspect · Alt+click to pin</p>
        <p class="g-debug-status-text" data-g-debug-status data-state="idle">Ready</p>
      </div>
    </aside>

    <div class="g-debug-badge" data-testid="gerstner-debug-badge">
      <div class="g-debug-badge-grid">
        <div><p class="g-debug-badge-label">Scope</p><p class="g-debug-badge-value" data-g-debug-badge="label">Document root</p></div>
        <div><p class="g-debug-badge-label">Alignment</p><p class="g-debug-badge-value" data-g-debug-badge="mode">Shell</p></div>
        <div><p class="g-debug-badge-label">Preset</p><p class="g-debug-badge-value" data-g-debug-badge="preset">default</p></div>
        <div><p class="g-debug-badge-label">Columns</p><p class="g-debug-badge-value" data-g-debug-badge="cols">12</p></div>
        <div><p class="g-debug-badge-label">Stride</p><p class="g-debug-badge-value" data-g-debug-badge="stride">0px</p></div>
        <div><p class="g-debug-badge-label">Content</p><p class="g-debug-badge-value" data-g-debug-badge="content">0px</p></div>
      </div>
    </div>

    <button class="g-debug-launcher g-debug-button" data-testid="gerstner-debug-launcher" type="button" aria-pressed="${String(state.panel)}">Gerstner inspector</button>
  `

  return root
}

function loadState(options: GerstnerDebugOptions): DebugState {
  const fallback: DebugState = {
    panel: options.defaultOpen ?? false,
    overlay: options.initial?.overlay ?? true,
    badge: options.initial?.badge ?? true,
    ruler: options.initial?.ruler ?? false,
    pinned: false
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    return {
      ...fallback,
      ...(JSON.parse(raw) as Partial<DebugState>)
    }
  } catch {
    return fallback
  }
}

function persistState(state: DebugState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

function syncState(root: HTMLElement, state: DebugState) {
  root.dataset.panel = String(state.panel)
  root.dataset.overlay = String(state.overlay)
  root.dataset.badge = String(state.badge)
  root.dataset.ruler = String(state.ruler)
  root.dataset.pinned = String(state.pinned)

  root.querySelectorAll<HTMLButtonElement>('[data-g-debug-action]').forEach((button) => {
    const action = button.dataset.gDebugAction
    if (action === 'panel') button.setAttribute('aria-pressed', String(state.panel))
    if (action === 'overlay') button.setAttribute('aria-pressed', String(state.overlay))
    if (action === 'badge') button.setAttribute('aria-pressed', String(state.badge))
    if (action === 'ruler') button.setAttribute('aria-pressed', String(state.ruler))
    if (action === 'pin') button.setAttribute('aria-pressed', String(state.pinned))
  })

  root.querySelector<HTMLButtonElement>('[data-testid="gerstner-debug-launcher"]')?.setAttribute('aria-pressed', String(state.panel))
}

function resolveExplicitScope(scope: string | HTMLElement | undefined): HTMLElement | null {
  if (!scope) return null
  if (scope instanceof HTMLElement) return scope
  return document.querySelector<HTMLElement>(scope)
}

function resolveScopeFromTarget(target: HTMLElement | null): HTMLElement | null {
  if (!target) return null
  return target.closest<HTMLElement>('[data-g-debug-scope]') ?? document.documentElement
}

function readMetrics(scope: HTMLElement): GerstnerDebugMetrics {
  const style = getComputedStyle(scope)
  const rect = scope === document.documentElement
    ? new DOMRect(0, 0, window.innerWidth, window.innerHeight)
    : scope.getBoundingClientRect()

  const cols = parseNumber(style.getPropertyValue('--g-cols'), 12)
  const gutter = measureLength(style.getPropertyValue('--g-gutter'))
  const frame = measureLength(style.getPropertyValue('--g-frame'))
  const contentWidth = measureLength(style.getPropertyValue('--g-content-inline')) || Math.max(0, rect.width - frame * 2)
  const columnWidth = measureLength(style.getPropertyValue('--g-col-unit-raw')) || (cols > 0 ? Math.max(0, (contentWidth - gutter * (cols - 1)) / cols) : 0)
  const stride = measureLength(style.getPropertyValue('--g-stride')) || columnWidth + gutter
  const rhythm = measureLength(style.getPropertyValue('--g-rhythm'))
  const prose = parseNumber(style.getPropertyValue('--g-prose'), 0)
  const baseline = measureLength(style.getPropertyValue('--g-baseline'))
  const fitMin = measureLength(style.getPropertyValue('--g-min'))
  const maxWidth = measureLength(style.getPropertyValue('--g-max-width'))
  const measure = style.getPropertyValue('--g-measure').trim() || '70ch'
  const scaleRatio = parseNumber(style.getPropertyValue('--g-scale-ratio'), 1.25)
  const mode = (style.getPropertyValue('--g-align-mode').trim() || inferMode(scope))
  const label = scope.dataset.gDebugLabel?.trim() || inferLabel(scope)
  const preset = scope.dataset.gPreset?.trim() || scope.dataset.gProjectPreset?.trim() || document.documentElement.dataset.gPreset?.trim() || 'default'

  return {
    label,
    mode,
    modeLabel: humanizeMode(mode),
    preset,
    cols,
    gutter,
    frame,
    contentWidth,
    columnWidth,
    stride,
    rhythm,
    prose,
    baseline,
    fitMin,
    maxWidth,
    measure,
    scaleRatio,
    trimSupport: detectTrimSupport()
  }
}

function inferLabel(scope: HTMLElement): string {
  if (scope === document.documentElement) return 'Document root'
  const tag = scope.tagName.toLowerCase()
  const tokens = Array.from(scope.classList).filter((name) => name.startsWith('g')).slice(0, 2)
  return tokens.length ? `${tag}.${tokens.join('.')}` : tag
}

function inferMode(scope: HTMLElement): string {
  const classes = new Set(Array.from(scope.classList))
  if (classes.has('g-sub')) return 'exact'
  if (classes.has('g-align-independent')) return 'independent'
  if (Array.from(classes).some((name) => /^g-view-\d+$/.test(name))) return 'approximate'
  if (classes.has('g-fit') || classes.has('g-fill')) return 'adaptive'
  if (classes.has('g-shell')) return 'shell'
  if (classes.has('g')) return 'raw'
  return 'scope'
}

function humanizeMode(mode: string): string {
  if (mode === 'exact') return 'Exact inheritance'
  if (mode === 'approximate') return 'Approximate view'
  if (mode === 'independent') return 'Independent'
  if (mode === 'adaptive') return 'Adaptive collection'
  if (mode === 'shell') return 'Editorial shell'
  if (mode === 'raw') return 'Raw equal grid'
  return mode
}

function detectTrimSupport(): string {
  if (typeof CSS === 'undefined' || typeof CSS.supports !== 'function') return 'unknown'
  return CSS.supports('text-box: trim-both cap alphabetic') ? 'supported' : 'not yet'
}

function writeOverlayVars(root: HTMLElement, metrics: GerstnerDebugMetrics) {
  const overlayWidth = Math.min(metrics.contentWidth, window.innerWidth)
  const overlayLeft = Math.max(0, (window.innerWidth - overlayWidth) / 2)
  root.style.setProperty('--g-debug-overlay-left', `${overlayLeft}px`)
  root.style.setProperty('--g-debug-overlay-width', `${overlayWidth}px`)
  root.style.setProperty('--g-debug-col-width', `${metrics.columnWidth}px`)
  root.style.setProperty('--g-debug-overlay-gap', `${metrics.gutter}px`)
}

function writePanel(panel: HTMLElement, metrics: GerstnerDebugMetrics, state: DebugState) {
  setText(panel, 'scope-label', metrics.label)
  setText(panel, 'scope-meta', `${metrics.modeLabel} · preset ${metrics.preset}`)
  setText(panel, 'cols', String(metrics.cols))
  setText(panel, 'gutter', formatPx(metrics.gutter))
  setText(panel, 'frame', formatPx(metrics.frame))
  setText(panel, 'content-width', formatPx(metrics.contentWidth))
  setText(panel, 'column-width', formatPx(metrics.columnWidth))
  setText(panel, 'stride', formatPx(metrics.stride))
  setText(panel, 'rhythm', formatPx(metrics.rhythm))
  setText(panel, 'prose', formatNumber(metrics.prose))
  setText(panel, 'baseline', formatPx(metrics.baseline))
  setText(panel, 'fit-min', formatPx(metrics.fitMin))
  setText(panel, 'measure', metrics.measure)
  setText(panel, 'trim', metrics.trimSupport)
  panel.querySelector<HTMLButtonElement>('[data-g-debug-action="pin"]')?.setAttribute('aria-pressed', String(state.pinned))
}

function writeBadge(badge: HTMLElement, metrics: GerstnerDebugMetrics) {
  badge.querySelector<HTMLElement>('[data-g-debug-badge="label"]')!.textContent = metrics.label
  badge.querySelector<HTMLElement>('[data-g-debug-badge="mode"]')!.textContent = metrics.modeLabel
  badge.querySelector<HTMLElement>('[data-g-debug-badge="preset"]')!.textContent = metrics.preset
  badge.querySelector<HTMLElement>('[data-g-debug-badge="cols"]')!.textContent = String(metrics.cols)
  badge.querySelector<HTMLElement>('[data-g-debug-badge="stride"]')!.textContent = formatPx(metrics.stride)
  badge.querySelector<HTMLElement>('[data-g-debug-badge="content"]')!.textContent = formatPx(metrics.contentWidth)
}

function renderContractFromMetrics(scope: HTMLElement): string {
  const style = getComputedStyle(scope)
  return `:root {\n  --g-cols: ${style.getPropertyValue('--g-cols').trim() || '12'};\n  --g-gutter: ${style.getPropertyValue('--g-gutter').trim() || 'clamp(0.875rem, 2.2vw, 1.5rem)'};\n  --g-frame: ${style.getPropertyValue('--g-frame').trim() || 'clamp(1rem, 5dvw, 5rem)'};\n  --g-max-width: ${style.getPropertyValue('--g-max-width').trim() || '90rem'};\n  --g-min: ${style.getPropertyValue('--g-min').trim() || '16rem'};\n  --g-type-base: ${style.getPropertyValue('--g-type-base').trim() || '1rem'};\n  --g-baseline: ${style.getPropertyValue('--g-baseline').trim() || '0.5rem'};\n  --g-leading-steps: ${style.getPropertyValue('--g-leading-steps').trim() || '3'};\n  --g-scale-ratio: ${style.getPropertyValue('--g-scale-ratio').trim() || '1.25'};\n  --g-measure: ${style.getPropertyValue('--g-measure').trim() || '70ch'};\n}`
}

async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    return false
  }
}

function setText(root: ParentNode, field: string, value: string) {
  root.querySelector<HTMLElement>(`[data-g-debug-field="${field}"]`)!.textContent = value
}

function formatPx(value: number): string {
  return `${Math.round(value * 10) / 10}px`
}

function formatNumber(value: number): string {
  return `${Math.round(value * 100) / 100}`
}

function parseNumber(raw: string, fallback: number): number {
  const value = Number.parseFloat(raw)
  return Number.isFinite(value) ? value : fallback
}

function measureLength(raw: string): number {
  const value = raw.trim()
  if (!value) return 0

  const probe = document.createElement('div')
  probe.style.position = 'absolute'
  probe.style.visibility = 'hidden'
  probe.style.pointerEvents = 'none'
  probe.style.inset = '0 auto auto 0'
  probe.style.width = value
  document.body.appendChild(probe)
  const measured = probe.getBoundingClientRect().width
  probe.remove()

  if (Number.isFinite(measured) && measured > 0) return measured
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}
