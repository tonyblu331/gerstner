/**
 * Shell behavior utilities
 */

export interface ShellConfig {
  frame: number
  maxWidth: number
  gutter: number
  cols: number
}

/**
 * Calculate shell content width
 */
export function calculateContentInline(containerWidth: number, config: ShellConfig): number {
  return Math.min(config.maxWidth, containerWidth - config.frame * 2)
}

/**
 * Calculate frame adjustment for named grid lines
 */
export function calculateFrameAdjustment(frame: number, gutter: number): string {
  return `calc(${frame} - ${gutter})`
}
