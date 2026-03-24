import { expect, test } from '@playwright/test'

test.describe('adaptive collections', () => {
  test('fit wraps down on narrow viewports', async ({ browser }) => {
    const page = await browser.newPage({ viewport: { width: 560, height: 1200 } })
    await page.goto('/')

    const cards = page.getByTestId('fit-grid').locator('.card')
    const first = await cards.nth(0).boundingBox()
    const third = await cards.nth(2).boundingBox()

    expect(first).not.toBeNull()
    expect(third).not.toBeNull()
    expect(third!.y).toBeGreaterThan(first!.y)

    await page.close()
  })

  test('fill renders the collection scene', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('fill-grid')).toBeVisible()
  })
})
