/**
 * Gutter calculation utilities
 */

/**
 * Calculate total gutter width for a given column count
 */
export function calculateGapTotal(gutter: number, cols: number): number {
  return gutter * (cols - 1)
}

/**
 * Calculate stride (column unit + gutter)
 */
export function calculateStride(colUnitRaw: number, gutter: number): number {
  return colUnitRaw + gutter
}
