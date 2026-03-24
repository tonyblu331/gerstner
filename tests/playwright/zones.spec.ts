import { expect, test } from '@playwright/test'

test.describe('zones and asymmetry', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('left breakout starts before the col-from band', async ({ page }) => {
    const breakout = await page.getByTestId('breakout-left').boundingBox()
    const fromBand = await page.getByTestId('from-band').boundingBox()

    expect(breakout).not.toBeNull()
    expect(fromBand).not.toBeNull()
    expect(breakout!.x).toBeLessThan(fromBand!.x)
  })

  test('col-from band reaches farther right than the left breakout card', async ({ page }) => {
    const breakout = await page.getByTestId('breakout-left').boundingBox()
    const fromBand = await page.getByTestId('from-band').boundingBox()

    expect(breakout).not.toBeNull()
    expect(fromBand).not.toBeNull()
    expect(fromBand!.x + fromBand!.width).toBeGreaterThan(breakout!.x + breakout!.width)
  })
})
