/**
 * Rhythm Layer — renders horizontal baseline rows.
 * Displays baseline unit and rhythm (leading) interval as horizontal lines.
 *
 * SPDX-License-Identifier: MIT
 */

import type { GridDebugSnapshot } from '../../stride/snapshot.js'
import { ZONE_COLORS } from './colors.js'

export function renderRhythmLayer(snap: GridDebugSnapshot, svg: SVGSVGElement): void {
  const width = snap.rect.width
  const height = snap.rect.height
  const baselinePx = snap.authored.baselinePx
  const { rhythmPx } = snap.derived

  if (baselinePx <= 0 || rhythmPx <= 0) return

  // Baseline rows — thin lines at every baseline unit
  let y = baselinePx
  while (y <= height) {
    const isRhythm = Math.abs(y % rhythmPx) < 0.5 || Math.abs((y % rhythmPx) - rhythmPx) < 0.5
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', '0')
    line.setAttribute('y1', String(y))
    line.setAttribute('x2', String(width))
    line.setAttribute('y2', String(y))
    line.setAttribute('stroke', isRhythm ? ZONE_COLORS.baseline : ZONE_COLORS.boundary)
    line.setAttribute('stroke-width', isRhythm ? '0.75' : '0.25')
    line.setAttribute('opacity', isRhythm ? '0.5' : '0.2')
    line.setAttribute('data-g-baseline-row', isRhythm ? 'rhythm' : 'sub')
    svg.appendChild(line)
    y += baselinePx
  }
}
