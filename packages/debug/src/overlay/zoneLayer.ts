/**
 * Zone Layer — renders full/frame/content zone rectangles.
 * Shell field only; raw fields have no frame zone.
 *
 * SPDX-License-Identifier: MIT
 */

import type { GridDebugSnapshot } from 'gerstner/stride/snapshot'
import { ZONE_COLORS } from './colors.js'

export function renderZoneLayer(snap: GridDebugSnapshot, svg: SVGSVGElement): void {
  const { fullStartPx, contentStartPx, contentEndPx, fullEndPx } = snap.boundaries
  const height = snap.rect.height

  // Full zone background (entire element)
  if (snap.field.kind === 'shell') {
    // Left frame zone
    if (contentStartPx > fullStartPx) {
      _rect(
        svg,
        fullStartPx,
        0,
        contentStartPx - fullStartPx,
        height,
        ZONE_COLORS.frame,
        'full-left',
      )
    }

    // Content zone
    _rect(
      svg,
      contentStartPx,
      0,
      contentEndPx - contentStartPx,
      height,
      ZONE_COLORS.content,
      'content',
    )

    // Right frame zone
    if (fullEndPx > contentEndPx) {
      _rect(svg, contentEndPx, 0, fullEndPx - contentEndPx, height, ZONE_COLORS.frame, 'full-right')
    }
  } else {
    // Raw/subgrid/view — single content zone
    _rect(svg, fullStartPx, 0, fullEndPx - fullStartPx, height, ZONE_COLORS.content, 'content')
  }

  // Boundary lines: content-start and content-end
  _boundaryLine(svg, contentStartPx, height, 'content-start')
  _boundaryLine(svg, contentEndPx, height, 'content-end')

  if (snap.field.kind === 'shell') {
    _boundaryLine(svg, fullStartPx, height, 'full-start')
    _boundaryLine(svg, fullEndPx, height, 'full-end')
  }
}

function _rect(
  svg: SVGSVGElement,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  zone: string,
): void {
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  rect.setAttribute('x', String(x))
  rect.setAttribute('y', String(y))
  rect.setAttribute('width', String(Math.max(0, width)))
  rect.setAttribute('height', String(height))
  rect.setAttribute('fill', fill)
  rect.setAttribute('data-g-zone', zone)
  svg.appendChild(rect)
}

function _boundaryLine(svg: SVGSVGElement, x: number, height: number, name: string): void {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  line.setAttribute('x1', String(x))
  line.setAttribute('y1', '0')
  line.setAttribute('x2', String(x))
  line.setAttribute('y2', String(height))
  line.setAttribute('stroke', ZONE_COLORS.boundary)
  line.setAttribute('stroke-width', '1')
  line.setAttribute('data-g-boundary', name)
  svg.appendChild(line)
}
