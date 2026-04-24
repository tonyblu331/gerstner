/**
 * Line Layer — renders column line starts as vertical SVG lines.
 * Colors encode alignment truth.
 *
 * SPDX-License-Identifier: MIT
 */

import type { GridDebugSnapshot } from 'gerstner/stride/snapshot'
import { relationshipColor } from './colors.js'

export function renderLineLayer(snap: GridDebugSnapshot, svg: SVGSVGElement): void {
  const height = snap.rect.height
  const color = relationshipColor(snap.field.relationship)
  const strokeWidth = snap.field.relationship === 'approximate' ? 0.75 : 1

  snap.lines.lineStartPx.forEach((x, i) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', String(x))
    line.setAttribute('y1', '0')
    line.setAttribute('x2', String(x))
    line.setAttribute('y2', String(height))
    line.setAttribute('stroke', color.stroke)
    line.setAttribute('stroke-width', String(strokeWidth))
    if (color.dashArray) line.setAttribute('stroke-dasharray', color.dashArray)
    line.setAttribute('opacity', '0.6')
    line.setAttribute('data-g-col', String(i + 1))
    svg.appendChild(line)
  })
}
