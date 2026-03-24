import { expect, test } from '@playwright/test'

test.describe('phase 1 layout contract', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('shell content stays narrower than the raw equal-column band', async ({ page }) => {
    const shellCard = await page.getByTestId('shell-card').boundingBox()
    const rawBand = await page.getByTestId('raw-band').boundingBox()

    expect(shellCard).not.toBeNull()
    expect(rawBand).not.toBeNull()
    expect(shellCard!.width).toBeLessThan(rawBand!.width)
  })

  test('viewport proof scene is visible and uses a safe minimum height', async ({ page }) => {
    const viewportBox = await page.getByTestId('viewport-safe').boundingBox()

    expect(viewportBox).not.toBeNull()
    expect(viewportBox!.height).toBeGreaterThan(200)
  })
})
