/**
 * SVG Overlay — composes layer modules into a positioned SVGElement.
 *
 * Mounts an absolutely positioned SVG inside each scope element.
 * SVG coordinate space: (0,0) = element top-left, (width, height) = element size.
 * All pixel values come from GridDebugSnapshot — no geometry recomputation here.
 *
 * Modes:
 *   minimal  — zones + boundary lines + column lines + relationship label
 *   detailed — + gutter markers + col numbers + metric label
 *   stress   — + warning badges
 *   rhythm   — + baseline rows
 *
 * SPDX-License-Identifier: MIT
 */

import type { GridDebugSnapshot } from 'gerstner/stride/snapshot'
import { renderLineLayer } from './lineLayer.js'
import { renderZoneLayer } from './zoneLayer.js'
import { renderGutterLayer } from './gutterLayer.js'
import { renderLabelLayer } from './labelLayer.js'
import { renderRhythmLayer } from './rhythmLayer.js'

export type OverlayMode = 'minimal' | 'detailed' | 'stress' | 'rhythm'

export const SVG_OVERLAY_CLASS = 'g-debug-svg-overlay'

/**
 * Create a fresh SVG overlay element for the given snapshot.
 * The caller is responsible for appending it to the scope element.
 */
export function createSVGOverlay(
  snap: GridDebugSnapshot,
  mode: OverlayMode = 'minimal',
): SVGSVGElement {
  const { width, height } = snap.rect

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('class', SVG_OVERLAY_CLASS)
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  svg.setAttribute('width', String(width))
  svg.setAttribute('height', String(height))
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('data-g-snapshot-id', snap.id)
  svg.setAttribute('data-g-overlay-mode', mode)
  svg.style.cssText = [
    'position:absolute',
    'inset:0',
    'pointer-events:none',
    'overflow:visible',
    'z-index:9999',
  ].join(';')

  // Zone layer always rendered (full/frame/content zones)
  renderZoneLayer(snap, svg)

  // Column line layer always rendered
  renderLineLayer(snap, svg)

  if (mode === 'detailed' || mode === 'stress') {
    renderGutterLayer(snap, svg)
    renderLabelLayer(snap, svg)
  }

  if (mode === 'minimal') {
    renderLabelLayer(snap, svg)
  }

  if (mode === 'rhythm') {
    renderRhythmLayer(snap, svg)
    renderLabelLayer(snap, svg)
  }

  if (mode === 'stress') {
    _renderWarningBadges(snap, svg)
  }

  return svg
}

function _renderWarningBadges(snap: GridDebugSnapshot, svg: SVGSVGElement): void {
  if (!snap.warnings.length) return

  const x = snap.boundaries.contentEndPx - 20
  let y = 16

  for (const warning of snap.warnings) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.setAttribute('data-g-warning', warning.code)

    const badge = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    badge.setAttribute('x', String(x))
    badge.setAttribute('y', String(y - 10))
    badge.setAttribute('width', '18')
    badge.setAttribute('height', '12')
    badge.setAttribute('rx', '2')
    badge.setAttribute('fill', 'oklch(0.65 0.22 25)')
    badge.setAttribute('opacity', '0.9')
    g.appendChild(badge)

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.setAttribute('x', String(x + 2))
    text.setAttribute('y', String(y))
    text.setAttribute('fill', 'white')
    text.setAttribute('font-size', '7px')
    text.setAttribute('font-family', 'monospace')
    text.setAttribute('pointer-events', 'none')
    text.textContent = warning.code.slice(0, 3)
    g.appendChild(text)

    svg.appendChild(g)
    y += 16
  }
}

/**
 * Mount SVG overlays on all Gerstner scope elements in the document.
 * Removes existing overlays before re-mounting.
 */
export function mountAllSVGOverlays(
  snapshots: GridDebugSnapshot[],
  mode: OverlayMode = 'minimal',
): void {
  // Remove stale overlays
  document.querySelectorAll(`.${SVG_OVERLAY_CLASS}`).forEach((el) => el.remove())

  for (const snap of snapshots) {
    const el = snap.element as HTMLElement
    const pos = getComputedStyle(el).position
    if (pos === 'static') el.style.position = 'relative'

    const svg = createSVGOverlay(snap, mode)
    el.appendChild(svg)
  }
}

/**
 * Remove all mounted SVG overlays.
 */
export function unmountAllSVGOverlays(): void {
  document.querySelectorAll(`.${SVG_OVERLAY_CLASS}`).forEach((el) => el.remove())
}
