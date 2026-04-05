import { expect, test } from '@playwright/test'

test.describe('stress and edge cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('long titles in display role do not collapse layout', async ({ page }) => {
    const display = await page.getByTestId('display-sample').boundingBox()
    expect(display).not.toBeNull()
    expect(display!.height).toBeGreaterThan(0)
    expect(display!.width).toBeGreaterThan(100)
  })

  test('heading role handles text stress', async ({ page }) => {
    const heading = await page.getByTestId('heading-sample').boundingBox()
    expect(heading).not.toBeNull()
    expect(heading!.height).toBeGreaterThan(0)
  })

  test('adaptive grids handle variable content heights', async ({ page }) => {
    const fitGrid = await page.getByTestId('fit-grid').boundingBox()
    const fillGrid = await page.getByTestId('fill-grid').boundingBox()
    expect(fitGrid).not.toBeNull()
    expect(fillGrid).not.toBeNull()
    expect(fitGrid!.height).toBeGreaterThan(0)
    expect(fillGrid!.height).toBeGreaterThan(0)
  })

  test('token readout displays computed values', async ({ page }) => {
    const readout = page.getByTestId('token-readout')
    await expect(readout).toBeVisible()
    const chips = readout.locator('.token-chip strong')
    const count = await chips.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      const text = await chips.nth(i).textContent()
      expect(text).not.toBe('')
      expect(text).not.toBeNull()
    }
  })

  test('prose sample respects measure and line-height', async ({ page }) => {
    const prose = await page.getByTestId('prose-sample').evaluate((node) => {
      const style = getComputedStyle(node)
      return {
        maxInlineSize: style.maxInlineSize,
        lineHeight: style.lineHeight,
      }
    })

    expect(prose.maxInlineSize).not.toBe('none')
    expect(prose.lineHeight).not.toBe('normal')
  })

  test('shell and raw grid produce different widths', async ({ page }) => {
    const shellCard = await page.getByTestId('shell-card').boundingBox()
    const rawBand = await page.getByTestId('raw-band').boundingBox()

    expect(shellCard).not.toBeNull()
    expect(rawBand).not.toBeNull()
    expect(shellCard!.width).toBeLessThan(rawBand!.width)
  })
})
