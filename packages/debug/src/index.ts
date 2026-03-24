export interface GerstnerDebugOptions {
  defaultOpen?: boolean
  initial?: {
    overlay?: boolean
    badge?: boolean
    ruler?: boolean
  }
  scope?: string | HTMLElement
  root?: ParentNode
}

export interface GerstnerDebugController {
  destroy: () => void
  refresh: () => void
  setScope: (scope: HTMLElement | null) => void
}

interface DebugState {
  panel: boolean
  overlay: boolean
  badge: boolean
  ruler: boolean
  pinned: boolean
}

interface ScopeMetrics {
  label: string
  mode: string
  preset: string
  cols: number
  gap: number
  pagePad: number
  shellEdgeMin: number
  breakout: number
  contentMax: number
  fitMin: number
  contentWidth: number
  colWidth: number
  fullLeft: number
  fullWidth: number
  contentLeft: number
  viewportWidth: number
  viewportHeight: number
  trimSupport: string
  baseline: number | null
}

const STORAGE_KEY = 'gerstner:debug:v1'

export function initGerstnerDebug(options: GerstnerDebugOptions = {}): GerstnerDebugController {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return {
      destroy() {},
      refresh() {},
      setScope() {}
    }
  }

  const state = loadState(options)
  const root = createRoot(state)
  const overlay = root.querySelector<HTMLElement>('[data-testid="gerstner-debug-overlay"]')!
  const ruler = root.querySelector<HTMLElement>('[data-testid="gerstner-debug-ruler"]')!
  const panel = root.querySelector<HTMLElement>('[data-testid="gerstner-debug-panel"]')!
  const badge = root.querySelector<HTMLElement>('[data-testid="gerstner-debug-badge"]')!
  const launcher = root.querySelector<HTMLButtonElement>('[data-testid="gerstner-debug-launcher"]')!

  const rootNode = options.root ?? document.body
  rootNode.appendChild(root)

  let hoveredScope: HTMLElement | null = null
  let activeScope = resolveExplicitScope(options.scope) ?? document.documentElement
  let scopeObserver: ResizeObserver | null = null

  const bindScopeObserver = (scope: HTMLElement) => {
    scopeObserver?.disconnect()
    scopeObserver = new ResizeObserver(() => refresh())
    scopeObserver.observe(scope)
    scopeObserver.observe(document.documentElement)
  }

  const setScope = (scope: HTMLElement | null) => {
    activeScope = scope ?? document.documentElement
    bindScopeObserver(activeScope)
    refresh()
  }

  const saveAndRefresh = () => {
    persistState(state)
    syncStateToDom(root, state)
    refresh()
  }

  const refresh = () => {
    const metrics = readScopeMetrics(activeScope)
    writeOverlayVars(root, metrics)
    writeBadge(badge, metrics, state)
    writePanel(panel, metrics, state)
    root.dataset.baselineAvailable = String(metrics.baseline !== null)
    if (metrics.baseline !== null) {
      root.style.setProperty('--g-debug-baseline', `${metrics.baseline}px`)
    } else {
      root.style.removeProperty('--g-debug-baseline')
    }

    overlay.setAttribute('aria-hidden', String(!state.overlay))
    ruler.setAttribute('aria-hidden', String(!state.ruler || metrics.baseline === null))
    badge.setAttribute('aria-hidden', String(!state.badge))
  }

  const onPointerMove = (event: PointerEvent) => {
    const target = event.target instanceof HTMLElement ? event.target : null
    hoveredScope = resolveScopeFromTarget(target)
    if (!state.pinned && hoveredScope) {
      setScope(hoveredScope)
    }
  }

  const onClick = (event: MouseEvent) => {
    const target = event.target instanceof HTMLElement ? event.target : null
    const action = target?.closest<HTMLElement>('[data-g-debug-action]')?.dataset.gDebugAction

    if (action) {
      event.preventDefault()

      if (action === 'panel') {
        state.panel = !state.panel
      }

      if (action === 'overlay') {
        state.overlay = !state.overlay
      }

      if (action === 'badge') {
        state.badge = !state.badge
      }

      if (action === 'ruler') {
        const baselineAvailable = root.dataset.baselineAvailable === 'true'
        if (baselineAvailable) {
          state.ruler = !state.ruler
        }
      }

      if (action === 'pin') {
        state.pinned = !state.pinned
        if (state.pinned && hoveredScope) {
          setScope(hoveredScope)
        }
      }

      if (action === 'reset') {
        state.pinned = false
        setScope(resolveExplicitScope(options.scope) ?? document.documentElement)
      }

      saveAndRefresh()
      return
    }

    if (!event.altKey) {
      return
    }

    const scope = resolveScopeFromTarget(target)
    if (!scope) {
      return
    }

    state.pinned = true
    setScope(scope)
    saveAndRefresh()
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (!event.altKey) {
      return
    }

    const key = event.key.toLowerCase()

    if (key === 'g') {
      state.panel = !state.panel
      saveAndRefresh()
      event.preventDefault()
    }

    if (key === 'o') {
      state.overlay = !state.overlay
      saveAndRefresh()
      event.preventDefault()
    }

    if (key === 'b') {
      state.badge = !state.badge
      saveAndRefresh()
      event.preventDefault()
    }

    if (key === 'r' && root.dataset.baselineAvailable === 'true') {
      state.ruler = !state.ruler
      saveAndRefresh()
      event.preventDefault()
    }
  }

  const onScroll = () => refresh()

  document.addEventListener('pointermove', onPointerMove, { passive: true })
  document.addEventListener('click', onClick, true)
  document.addEventListener('keydown', onKeyDown)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', refresh, { passive: true })

  launcher.addEventListener('click', () => {
    state.panel = !state.panel
    saveAndRefresh()
  })

  bindScopeObserver(activeScope)
  syncStateToDom(root, state)
  refresh()

  return {
    destroy() {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', refresh)
      scopeObserver?.disconnect()
      root.remove()
    },
    refresh,
    setScope
  }
}

function createRoot(state: DebugState): HTMLElement {
  const root = document.createElement('div')
  root.className = 'g-debug-root'
  root.dataset.testid = 'gerstner-debug-root'
  root.innerHTML = `
    <div class="g-debug-overlay" data-testid="gerstner-debug-overlay" aria-hidden="false"></div>
    <div class="g-debug-ruler" data-testid="gerstner-debug-ruler" aria-hidden="true"></div>

    <aside class="g-debug-panel" data-testid="gerstner-debug-panel">
      <div class="g-debug-toolbar">
        <div class="g-debug-title">
          <strong>Gerstner debug</strong>
          <span>Optional observer for the layout programme</span>
        </div>
        <button class="g-debug-button" data-g-debug-action="panel" type="button" aria-pressed="${String(state.panel)}">Panel</button>
      </div>

      <div class="g-debug-actions">
        <button class="g-debug-button" data-g-debug-action="overlay" type="button" aria-pressed="${String(state.overlay)}">Overlay</button>
        <button class="g-debug-button" data-g-debug-action="badge" type="button" aria-pressed="${String(state.badge)}">Badge</button>
        <button class="g-debug-button" data-g-debug-action="ruler" type="button" aria-pressed="${String(state.ruler)}">Ruler</button>
        <button class="g-debug-button" data-g-debug-action="pin" type="button" aria-pressed="${String(state.pinned)}">Pin scope</button>
        <button class="g-debug-button" data-g-debug-action="reset" type="button" aria-pressed="false">Root</button>
      </div>

      <div class="g-debug-grid">
        <div>
          <p class="g-debug-caption">Scope</p>
          <div class="g-debug-status">
            <span class="g-debug-dot"></span>
            <strong data-g-debug-field="scope-label">Root</strong>
          </div>
          <div class="g-debug-meta" data-g-debug-field="scope-meta">Mode · shell</div>
        </div>

        <dl class="g-debug-stat-grid">
          <div class="g-debug-stat">
            <dt>Cols</dt>
            <dd data-g-debug-field="cols">12</dd>
          </div>
          <div class="g-debug-stat">
            <dt>Gap</dt>
            <dd data-g-debug-field="gap">16px</dd>
          </div>
          <div class="g-debug-stat">
            <dt>Content</dt>
            <dd data-g-debug-field="content-width">0px</dd>
          </div>
          <div class="g-debug-stat">
            <dt>Column</dt>
            <dd data-g-debug-field="col-width">0px</dd>
          </div>
          <div class="g-debug-stat">
            <dt>Breakout</dt>
            <dd data-g-debug-field="breakout">0px</dd>
          </div>
          <div class="g-debug-stat">
            <dt>Fit min</dt>
            <dd data-g-debug-field="fit-min">0px</dd>
          </div>
          <div class="g-debug-stat">
            <dt>Trim</dt>
            <dd data-g-debug-field="trim-support">Unknown</dd>
          </div>
          <div class="g-debug-stat">
            <dt>Baseline</dt>
            <dd data-g-debug-field="baseline">Unavailable</dd>
          </div>
        </dl>

        <p class="g-debug-shortcuts">
          <span class="g-debug-muted">Shortcuts</span> · Alt+G panel · Alt+O overlay · Alt+B badge · Alt+R ruler
          <br />
          <span class="g-debug-muted">Scope</span> · Hover a marked scope to inspect it · Alt+click to pin it
        </p>
      </div>
    </aside>

    <div class="g-debug-badge" data-testid="gerstner-debug-badge">
      <div class="g-debug-badge-grid">
        <div>
          <p class="g-debug-badge-label">Scope</p>
          <p class="g-debug-badge-value" data-g-debug-badge="label">Root</p>
        </div>
        <div>
          <p class="g-debug-badge-label">Mode</p>
          <p class="g-debug-badge-value" data-g-debug-badge="mode">shell</p>
        </div>
        <div>
          <p class="g-debug-badge-label">Preset</p>
          <p class="g-debug-badge-value" data-g-debug-badge="preset">default</p>
        </div>
        <div>
          <p class="g-debug-badge-label">Cols</p>
          <p class="g-debug-badge-value" data-g-debug-badge="cols">12</p>
        </div>
        <div>
          <p class="g-debug-badge-label">Gap</p>
          <p class="g-debug-badge-value" data-g-debug-badge="gap">16px</p>
        </div>
        <div>
          <p class="g-debug-badge-label">Content</p>
          <p class="g-debug-badge-value" data-g-debug-badge="content">0px</p>
        </div>
      </div>
    </div>

    <button class="g-debug-launcher g-debug-button" data-testid="gerstner-debug-launcher" type="button" aria-pressed="${String(state.panel)}">
      Gerstner debug
    </button>
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
    if (!raw) {
      return fallback
    }

    const parsed = JSON.parse(raw) as Partial<DebugState>
    return {
      ...fallback,
      ...parsed
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

function syncStateToDom(root: HTMLElement, state: DebugState) {
  root.dataset.panel = String(state.panel)
  root.dataset.overlay = String(state.overlay)
  root.dataset.badge = String(state.badge)
  root.dataset.ruler = String(state.ruler)
  root.dataset.pinned = String(state.pinned)

  root.querySelectorAll<HTMLButtonElement>('[data-g-debug-action]').forEach((button) => {
    const action = button.dataset.gDebugAction

    if (action === 'panel') {
      button.setAttribute('aria-pressed', String(state.panel))
    }

    if (action === 'overlay') {
      button.setAttribute('aria-pressed', String(state.overlay))
    }

    if (action === 'badge') {
      button.setAttribute('aria-pressed', String(state.badge))
    }

    if (action === 'ruler') {
      button.setAttribute('aria-pressed', String(state.ruler))
    }

    if (action === 'pin') {
      button.setAttribute('aria-pressed', String(state.pinned))
    }
  })

  root.querySelector<HTMLButtonElement>('[data-testid="gerstner-debug-launcher"]')?.setAttribute('aria-pressed', String(state.panel))
}

function resolveExplicitScope(scope: string | HTMLElement | undefined): HTMLElement | null {
  if (!scope) {
    return null
  }

  if (scope instanceof HTMLElement) {
    return scope
  }

  return document.querySelector<HTMLElement>(scope)
}

function resolveScopeFromTarget(target: HTMLElement | null): HTMLElement | null {
  if (!target) {
    return null
  }

  return target.closest<HTMLElement>('[data-g-debug-scope]') ?? document.documentElement
}

function readScopeMetrics(scope: HTMLElement): ScopeMetrics {
  const style = getComputedStyle(scope)
  const rect = scope === document.documentElement
    ? new DOMRect(0, 0, window.innerWidth, window.innerHeight)
    : scope.getBoundingClientRect()

  const cols = parseNumber(style.getPropertyValue('--g-cols'), 12)
  const gap = measureLength(style.getPropertyValue('--g-gap'))
  const pagePad = measureLength(style.getPropertyValue('--g-page-pad'))
  const shellEdgeMin = measureLength(style.getPropertyValue('--g-shell-edge-min'))
  const breakout = measureLength(style.getPropertyValue('--g-breakout'))
  const contentMax = measureLength(style.getPropertyValue('--g-content-max'))
  const fitMin = measureLength(style.getPropertyValue('--g-fit-min'))
  const baselineRaw = style.getPropertyValue('--g-baseline').trim()
  const baseline = baselineRaw ? measureLength(baselineRaw) : null
  const contentWidth = Math.max(0, Math.min(rect.width - (pagePad * 2), contentMax || rect.width))
  const colWidth = cols > 0 ? Math.max(0, (contentWidth - ((cols - 1) * gap)) / cols) : 0
  const shellInner = contentWidth + (breakout * 2)
  const side = Math.max(shellEdgeMin, (rect.width - shellInner) / 2)
  const fullLeft = rect.left + Math.max(0, side)
  const fullWidth = Math.max(0, rect.width - (Math.max(0, side) * 2))
  const contentLeft = rect.left + Math.max(0, side) + breakout
  const trimSupport = detectTrimSupport()
  const label = scope.dataset.gDebugLabel?.trim() || inferLabel(scope)
  const mode = inferMode(scope)
  const preset = scope.dataset.gPreset?.trim() || document.documentElement.dataset.gPreset?.trim() || 'default'

  return {
    label,
    mode,
    preset,
    cols,
    gap,
    pagePad,
    shellEdgeMin,
    breakout,
    contentMax,
    fitMin,
    contentWidth,
    colWidth,
    fullLeft,
    fullWidth,
    contentLeft,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    trimSupport,
    baseline
  }
}

function detectTrimSupport(): string {
  if (typeof CSS === 'undefined' || typeof CSS.supports !== 'function') {
    return 'unknown'
  }

  if (CSS.supports('text-box-trim: trim-both') || CSS.supports('leading-trim: both')) {
    return 'supported'
  }

  return 'not yet'
}

function inferLabel(scope: HTMLElement): string {
  if (scope === document.documentElement) {
    return 'Document root'
  }

  const tag = scope.tagName.toLowerCase()
  const classes = Array.from(scope.classList)
    .filter((name) => name.startsWith('g'))
    .slice(0, 2)
    .join(' ')

  return classes ? `${tag}.${classes}` : tag
}

function inferMode(scope: HTMLElement): string {
  const classes = new Set(Array.from(scope.classList))

  if (classes.has('g-fit') || classes.has('gc-fit')) {
    return 'fit'
  }

  if (classes.has('g-fill') || classes.has('gc-fill')) {
    return 'fill'
  }

  if (classes.has('g-sub') || classes.has('gc-sub')) {
    return 'subgrid'
  }

  const localView = Array.from(classes).find((name) => /^g(c)?-view-\d+$/.test(name))
  if (localView) {
    return localView.replace(/^gc?-/, '')
  }

  if (classes.has('g-shell') || classes.has('gc-shell')) {
    return 'shell'
  }

  if (classes.has('g') || classes.has('gc')) {
    return 'grid'
  }

  return 'scope'
}

function writeOverlayVars(root: HTMLElement, metrics: ScopeMetrics) {
  root.style.setProperty('--g-debug-overlay-left', `${metrics.contentLeft}px`)
  root.style.setProperty('--g-debug-overlay-width', `${metrics.contentWidth}px`)
  root.style.setProperty('--g-debug-col-width', `${metrics.colWidth}px`)
  root.style.setProperty('--g-debug-overlay-gap', `${metrics.gap}px`)
  root.style.setProperty('--g-debug-full-left', `${metrics.fullLeft}px`)
  root.style.setProperty('--g-debug-full-width', `${metrics.fullWidth}px`)
}

function writePanel(panel: HTMLElement, metrics: ScopeMetrics, state: DebugState) {
  setText(panel, 'scope-label', metrics.label)
  setText(panel, 'scope-meta', `Mode · ${metrics.mode} · Preset · ${metrics.preset}`)
  setText(panel, 'cols', String(metrics.cols))
  setText(panel, 'gap', formatPx(metrics.gap))
  setText(panel, 'content-width', formatPx(metrics.contentWidth))
  setText(panel, 'col-width', formatPx(metrics.colWidth))
  setText(panel, 'breakout', formatPx(metrics.breakout))
  setText(panel, 'fit-min', formatPx(metrics.fitMin))
  setText(panel, 'trim-support', metrics.trimSupport)
  setText(panel, 'baseline', metrics.baseline === null ? 'Unavailable' : formatPx(metrics.baseline))
  panel.querySelector<HTMLButtonElement>('[data-g-debug-action="pin"]')?.setAttribute('aria-pressed', String(state.pinned))
}

function writeBadge(badge: HTMLElement, metrics: ScopeMetrics, state: DebugState) {
  badge.querySelector<HTMLElement>('[data-g-debug-badge="label"]')!.textContent = metrics.label
  badge.querySelector<HTMLElement>('[data-g-debug-badge="mode"]')!.textContent = metrics.mode
  badge.querySelector<HTMLElement>('[data-g-debug-badge="preset"]')!.textContent = metrics.preset
  badge.querySelector<HTMLElement>('[data-g-debug-badge="cols"]')!.textContent = String(metrics.cols)
  badge.querySelector<HTMLElement>('[data-g-debug-badge="gap"]')!.textContent = formatPx(metrics.gap)
  badge.querySelector<HTMLElement>('[data-g-debug-badge="content"]')!.textContent = formatPx(metrics.contentWidth)
  badge.dataset.pinned = String(state.pinned)
}

function setText(root: ParentNode, field: string, value: string) {
  root.querySelector<HTMLElement>(`[data-g-debug-field="${field}"]`)!.textContent = value
}

function formatPx(value: number): string {
  return `${Math.round(value * 10) / 10}px`
}

function parseNumber(raw: string, fallback: number): number {
  const value = Number.parseFloat(raw)
  return Number.isFinite(value) ? value : fallback
}

function measureLength(raw: string): number {
  const value = raw.trim()
  if (!value) {
    return 0
  }

  const probe = document.createElement('div')
  probe.style.position = 'absolute'
  probe.style.visibility = 'hidden'
  probe.style.pointerEvents = 'none'
  probe.style.inset = '0 auto auto 0'
  probe.style.width = value
  document.body.appendChild(probe)
  const measured = probe.getBoundingClientRect().width
  probe.remove()

  if (Number.isFinite(measured) && measured > 0) {
    return measured
  }

  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}
