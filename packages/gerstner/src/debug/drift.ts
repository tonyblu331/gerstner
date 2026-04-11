/**
 * Subgrid drift detection
 * Compares parent grid column widths with child grid column widths
 * to detect alignment drift between parent and child grids
 */

export interface DriftReport {
  parentCol: number
  childCol: number
  driftPx: number
  aligned: boolean
}

/**
 * Detect drift between parent and child grids
 * Returns null if the element is not a subgrid or has no parent grid
 */
export function detectDrift(child: HTMLElement): DriftReport | null {
  const parent = child.closest<HTMLElement>('.g-shell, .g, .g-fit, .g-fill, .g-sub')
  if (!parent) return null

  const parentStyle = getComputedStyle(parent)
  const childStyle = getComputedStyle(child)

  const parentColUnit = parseFloat(parentStyle.getPropertyValue('--g-col-unit-raw'))
  const childColUnit = parseFloat(childStyle.getPropertyValue('--g-col-unit-raw'))

  if (isNaN(parentColUnit) || isNaN(childColUnit)) return null

  const driftPx = Math.abs(parentColUnit - childColUnit)
  const aligned = driftPx < 1 // Consider aligned if drift is less than 1px

  return {
    parentCol: parentColUnit,
    childCol: childColUnit,
    driftPx,
    aligned,
  }
}

/**
 * Apply drift detection to all subgrid children in the document
 * Sets data attributes on drifted children for CSS visualization
 */
export function applyDriftDetection(): void {
  const subgrids = document.querySelectorAll<HTMLElement>('.g-sub')
  subgrids.forEach((subgrid) => {
    const report = detectDrift(subgrid)
    if (report && !report.aligned) {
      subgrid.setAttribute('data-g-debug-drift-px', report.driftPx.toFixed(2))
      subgrid.setAttribute('data-g-debug-drift-label', `${subgrid.tagName.toLowerCase()}`)
    } else {
      subgrid.removeAttribute('data-g-debug-drift-px')
      subgrid.removeAttribute('data-g-debug-drift-label')
    }
  })
}
