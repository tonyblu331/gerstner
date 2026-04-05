import { expect, test } from '@playwright/test'

test.describe('honest alignment API - Phase 2 freeze', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('g-sub advertises exact mode', async ({ page }) => {
    const mode = await page.getByTestId('exact-child').evaluate((node) => {
      return getComputedStyle(node).getPropertyValue('--g-align-mode').trim()
    })
    expect(mode).toBe('exact')
  })

  test('g-view-* advertises approximate mode', async ({ page }) => {
    const mode = await page.getByTestId('approx-child').evaluate((node) => {
      return getComputedStyle(node).getPropertyValue('--g-align-mode').trim()
    })
    expect(mode).toBe('approximate')
  })

  test('g-align-independent advertises independent mode', async ({ page }) => {
    const mode = await page.getByTestId('independent-grid').evaluate((node) => {
      return getComputedStyle(node).getPropertyValue('--g-align-mode').trim()
    })
    expect(mode).toBe('independent')
  })

  test('exact alignment matches parent markers', async ({ page }) => {
    const marker3 = await page.getByTestId('marker-3').boundingBox()
    const marker7 = await page.getByTestId('marker-7').boundingBox()
    const exactA = await page.getByTestId('exact-a').boundingBox()
    const exactB = await page.getByTestId('exact-b').boundingBox()

    expect(marker3).not.toBeNull()
    expect(marker7).not.toBeNull()
    expect(exactA).not.toBeNull()
    expect(exactB).not.toBeNull()

    // Exact: within 2px tolerance
    expect(Math.abs(exactA!.x - marker3!.x)).toBeLessThanOrEqual(2)
    expect(Math.abs(exactB!.x - marker7!.x)).toBeLessThanOrEqual(2)
  })

  test('approximate reinterpretation does not match parent markers', async ({ page }) => {
    const marker7 = await page.getByTestId('approx-marker-7').boundingBox()
    const approxB = await page.getByTestId('approx-b').boundingBox()

    expect(marker7).not.toBeNull()
    expect(approxB).not.toBeNull()

    // Approximate: more than 6px difference (not exact)
    expect(Math.abs(approxB!.x - marker7!.x)).toBeGreaterThan(6)
  })

  test('col-to-* grammar places correctly', async ({ page }) => {
    const parent = await page.getByTestId('placement-parent').boundingBox()
    const numeric = await page.getByTestId('placement-numeric').boundingBox()

    expect(parent).not.toBeNull()
    expect(numeric).not.toBeNull()

    // col-from-2 col-to-6 should be positioned, not full width
    expect(numeric!.width).toBeLessThan(parent!.width * 0.5)
  })

  test('gutter anchors place correctly', async ({ page }) => {
    const gutter = await page.getByTestId('placement-gutter').boundingBox()
    expect(gutter).not.toBeNull()
    expect(gutter!.width).toBeGreaterThan(0)
  })

  test('named boundaries place correctly', async ({ page }) => {
    const breakout = await page.getByTestId('placement-breakout').boundingBox()
    const parent = await page.getByTestId('placement-parent').boundingBox()

    expect(breakout).not.toBeNull()
    expect(parent).not.toBeNull()

    // col-from-content-start col-to-full-end should be wide
    expect(breakout!.width).toBeGreaterThan(parent!.width * 0.8)
  })
})
