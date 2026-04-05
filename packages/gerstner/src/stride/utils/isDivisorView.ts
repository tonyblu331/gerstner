/**
 * View validation utilities
 */

/**
 * Check if a column count is a valid divisor of the base column count
 * Valid views for 12-column grid: 1, 2, 3, 4, 6, 12
 */
export function isDivisorView(viewCols: number, baseCols: number = 12): boolean {
  if (viewCols < 1 || viewCols > baseCols) return false
  return baseCols % viewCols === 0
}

/**
 * Get all valid view column counts for a base grid
 */
export function getValidViews(baseCols: number = 12): number[] {
  const views: number[] = []
  for (let i = 1; i <= baseCols; i++) {
    if (baseCols % i === 0) {
      views.push(i)
    }
  }
  return views
}
