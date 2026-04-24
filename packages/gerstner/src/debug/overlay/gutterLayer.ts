/**
 * Gutter Layer — renders gutter center markers between columns.
 *
 * SPDX-License-Identifier: MIT
 */

import type { GridDebugSnapshot } from '../../stride/snapshot.js'
import { ZONE_COLORS } from './colors.js'

export function renderGutterLayer(snap: GridDebugSnapshot, svg: SVGSVGElement): void {
  const height = snap.rect.height
  const gutterW = snap.authored.gutterPx

  snap.lines.gutterCenterPx.forEach((cx, i) => {
    // Gutter rect: centered on cx with width = gutterPx
    const gx = cx - gutterW / 2
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', String(gx))
    rect.setAttribute('y', '0')
    rect.setAttribute('width', String(gutterW))
    rect.setAttribute('height', String(height))
    rect.setAttribute('fill', ZONE_COLORS.gutter)
    rect.setAttribute('data-g-gutter', String(i + 1))
    svg.appendChild(rect)

    // Center marker tick
    const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    tick.setAttribute('x1', String(cx))
    tick.setAttribute('y1', '0')
    tick.setAttribute('x2', String(cx))
    tick.setAttribute('y2', String(height))
    tick.setAttribute('stroke', ZONE_COLORS.boundary)
    tick.setAttribute('stroke-width', '0.5')
    tick.setAttribute('stroke-dasharray', '2 4')
    tick.setAttribute('data-g-gutter-center', String(i + 1))
    svg.appendChild(tick)
  })
}
