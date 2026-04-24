/**
 * Debug Warning System — human-readable messages for DebugWarningCode.
 *
 * SPDX-License-Identifier: MIT
 */

import type { DebugWarning, DebugWarningCode } from '../stride/snapshot.js'

export type { DebugWarning, DebugWarningCode }

const WARNING_MESSAGES: Record<DebugWarningCode, string> = {
  NON_DIVISOR_VIEW:
    'View column count is not a divisor of the parent column count. The reinterpretation may produce unequal groupings.',
  VIEW_IS_APPROXIMATE:
    'g-view-* reinterprets the current content width. This is not exact track inheritance. Use g-sub for exact inheritance.',
  SHELL_FRAME_NOT_COLUMNS:
    'Shell frame is 0px. Frame zones are not content columns. Use .g for equal edge-to-edge columns.',
  TRACK_BELOW_MIN:
    'Column unit is below the declared minimum track size. Content may overflow or columns may collapse.',
  NEGATIVE_CONTENT_INLINE:
    'Content inline size is zero or negative. The grid cannot render columns at this viewport width.',
  ROUNDING_USED_IN_LAYOUT:
    'Rounded pixel values were used in layout math. Raw values must be used for precision; round only for visual output.',
  MISSING_DERIVED_VAR:
    'A required CSS custom property resolved to 0 or was not set on this scope. Check that stride/index.css is loaded.',
  STALE_TOKEN:
    'A Stride token value does not match the compiled contract manifest. Re-run the CLI to refresh the contract.',
  PROSE_LINE_HEIGHT_IS_LENGTH:
    'Prose line-height is a fixed length. Use a unitless multiplier for scale-independent rhythm.',
  GUTTER_ANCHOR_OUT_OF_RANGE:
    'Gutter anchor index is outside the valid range 1..(cols-1). The anchor references a non-existent gutter.',
  DEBUG_MUTATION_DETECTED:
    'The debug overlay wrote to a layout-affecting property. Debug must not mutate layout. File a bug.',
}

/**
 * Return a human-readable message for a warning code.
 */
export function formatWarning(warning: DebugWarning): string {
  return WARNING_MESSAGES[warning.code] ?? warning.message
}

/**
 * Format a warning for display in the inspector panel.
 */
export function formatWarningBadge(warning: DebugWarning): string {
  return `[${warning.code}] ${formatWarning(warning)}`
}
