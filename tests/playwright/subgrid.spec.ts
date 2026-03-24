import { expect, test } from '@playwright/test'

test.describe('exact alignment path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('g-sub child items align with the matching parent markers', async ({ page }) => {
    const marker3 = await page.getByTestId('marker-3').boundingBox()
    const marker7 = await page.getByTestId('marker-7').boundingBox()
    const exactA = await page.getByTestId('exact-a').boundingBox()
    const exactB = await page.getByTestId('exact-b').boundingBox()

    expect(marker3).not.toBeNull()
    expect(marker7).not.toBeNull()
    expect(exactA).not.toBeNull()
    expect(exactB).not.toBeNull()

    expect(Math.abs(exactA!.x - marker3!.x)).toBeLessThanOrEqual(2)
    expect(Math.abs(exactB!.x - marker7!.x)).toBeLessThanOrEqual(2)
  })
})
