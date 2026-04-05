/**
 * Stride math utilities
 * Internal engine for Gerstner layout calculations
 */

export interface StrideConfig {
  cols: number
  gutter: number
  frame: number
  maxWidth: number
}

export interface StrideMetrics {
  gapTotal: number
  contentInline: number
  colUnitRaw: number
  stride: number
  colUnit: number
}

/**
 * Calculate stride metrics from container width and config
 */
export function calculateStrideMetrics(
  containerWidth: number,
  config: StrideConfig,
): StrideMetrics {
  const gapTotal = config.gutter * (config.cols - 1)
  const contentInline = Math.min(config.maxWidth, containerWidth - config.frame * 2)
  const colUnitRaw = (contentInline - gapTotal) / config.cols
  const stride = colUnitRaw + config.gutter
  const colUnit = Math.round(colUnitRaw)

  return {
    gapTotal,
    contentInline,
    colUnitRaw,
    stride,
    colUnit,
  }
}

/**
 * Calculate rhythm from baseline and leading steps
 */
export function calculateRhythm(baseline: number, leadingSteps: number): number {
  return baseline * leadingSteps
}

/**
 * Calculate prose leading as unitless ratio
 */
export function calculateProse(rhythm: number, typeBase: number): number {
  return rhythm / typeBase
}

/**
 * Check if a column count is a valid divisor of the base columns
 */
export function isDivisorView(viewCols: number, baseCols: number = 12): boolean {
  return baseCols % viewCols === 0
}

/**
 * Normalize line index to valid column boundary
 */
export function normalizeLineIndex(index: number, maxCols: number = 12): number {
  if (index < 1) return 1
  if (index > maxCols + 1) return maxCols + 1
  return Math.round(index)
}

/**
 * Calculate scale value at given step
 */
export function calculateScale(typeBase: number, scaleRatio: number, step: number): number {
  return typeBase * Math.pow(scaleRatio, step)
}
