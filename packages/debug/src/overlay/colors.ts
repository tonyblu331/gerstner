/**
 * Relationship color encoding for SVG overlays.
 * Colors use OKLCH for perceptual uniformity.
 *
 * exact       → solid green
 * approximate → dashed amber
 * independent → magenta
 *
 * SPDX-License-Identifier: MIT
 */

import type { AlignmentTruth } from 'gerstner/stride/snapshot'

export interface StrokeSpec {
  stroke: string
  dashArray?: string
}

export function relationshipColor(relationship: AlignmentTruth): StrokeSpec {
  switch (relationship) {
    case 'exact':
      return { stroke: 'oklch(0.65 0.2 145)' }
    case 'approximate':
      return { stroke: 'oklch(0.72 0.18 75)', dashArray: '4 3' }
    case 'independent':
      return { stroke: 'oklch(0.65 0.22 320)' }
  }
}

export const ZONE_COLORS = {
  shell: 'oklch(0.5 0 0 / 0.15)',
  frame: 'oklch(0.5 0 0 / 0.08)',
  content: 'oklch(0.65 0.18 254 / 0.08)',
  boundary: 'oklch(0.5 0 0 / 0.4)',
  warning: 'oklch(0.65 0.22 25)',
  gutter: 'oklch(0.72 0.18 75 / 0.5)',
  baseline: 'oklch(0.65 0.2 145 / 0.25)',
} as const
