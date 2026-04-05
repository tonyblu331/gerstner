/**
 * Zone calculation utilities
 */

export interface ZoneConfig {
  start: number
  end: number
}

/**
 * Validate zone boundaries
 */
export function validateZone(zone: ZoneConfig, maxCols: number = 12): ZoneConfig {
  return {
    start: Math.max(1, Math.min(zone.start, maxCols)),
    end: Math.max(1, Math.min(zone.end, maxCols + 1)),
  }
}

/**
 * Convert zone to grid-column value
 */
export function zoneToGridColumn(zone: ZoneConfig): string {
  const valid = validateZone(zone)
  return `${valid.start} / ${valid.end}`
}

/**
 * Check if zones overlap
 */
export function zonesOverlap(a: ZoneConfig, b: ZoneConfig): boolean {
  return a.start < b.end && b.start < a.end
}
