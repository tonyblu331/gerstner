/**
 * Label Layer — renders relationship label, col count, field kind, col numbers.
 *
 * SPDX-License-Identifier: MIT
 */

import type { GridDebugSnapshot } from '../../stride/snapshot.js'
import { relationshipColor } from './colors.js'

export function renderLabelLayer(snap: GridDebugSnapshot, svg: SVGSVGElement): void {
  const color = relationshipColor(snap.field.relationship)

  // Top-left label: "g-shell · 12 cols · exact"
  const label = [
    snap.field.kind === 'shell'
      ? 'g-shell'
      : snap.field.kind === 'subgrid'
        ? 'g-sub'
        : snap.field.kind,
    `${snap.authored.cols} cols`,
    snap.field.relationship,
  ].join(' · ')

  _text(svg, snap.boundaries.contentStartPx + 4, 12, label, color.stroke, '10px')

  // Column numbers — at top of each column line
  snap.lines.lineStartPx.forEach((x, i) => {
    _text(svg, x + 2, 24, String(i + 1), color.stroke, '8px')
  })
}

function _text(
  svg: SVGSVGElement,
  x: number,
  y: number,
  content: string,
  fill: string,
  fontSize: string,
): void {
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  text.setAttribute('x', String(x))
  text.setAttribute('y', String(y))
  text.setAttribute('fill', fill)
  text.setAttribute('font-size', fontSize)
  text.setAttribute('font-family', 'monospace')
  text.setAttribute('pointer-events', 'none')
  text.textContent = content
  svg.appendChild(text)
}
