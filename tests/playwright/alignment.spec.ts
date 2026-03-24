import { expect, test } from '@playwright/test'

test.describe('honest alignment API', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('reinterpretation advertises approximate mode', async ({ page }) => {
    const mode = await page.getByTestId('approx-child').evaluate((node) => {
      return getComputedStyle(node).getPropertyValue('--g-align-mode').trim()
    })

    expect(mode).toBe('approximate')
  })

  test('independent mode advertises independence explicitly', async ({ page }) => {
    const mode = await page.getByTestId('independent-grid').evaluate((node) => {
      return getComputedStyle(node).getPropertyValue('--g-align-mode').trim()
    })

    expect(mode).toBe('independent')
  })

  test('approximate reinterpretation does not claim the same line as exact alignment', async ({ page }) => {
    const marker7 = await page.getByTestId('approx-marker-7').boundingBox()
    const approxB = await page.getByTestId('approx-b').boundingBox()

    expect(marker7).not.toBeNull()
    expect(approxB).not.toBeNull()
    expect(Math.abs(approxB!.x - marker7!.x)).toBeGreaterThan(6)
  })
})
