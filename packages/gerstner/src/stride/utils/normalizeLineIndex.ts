/**
 * Line index normalization utilities
 */

/**
 * Normalize a line index to valid grid boundaries
 */
export function normalizeLineIndex(index: number, maxLines: number = 13): number {
  // Line indices are 1-based (1 to 13 for 12 columns)
  if (index < 1) return 1
  if (index > maxLines) return maxLines
  return Math.round(index)
}

/**
 * Convert column span to line index
 */
export function colSpanToLineIndex(span: number, startLine: number = 1): number {
  return normalizeLineIndex(startLine + span)
}

/**
 * Convert line indices to column span
 */
export function lineIndicesToColSpan(startLine: number, endLine: number): number {
  return Math.max(1, endLine - startLine)
}
