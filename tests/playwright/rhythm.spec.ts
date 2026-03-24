import { expect, test } from '@playwright/test'

test.describe('rhythm and typography tokens', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('rhythm stays length based while prose stays unitless', async ({ page }) => {
    const values = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement)
      return {
        rhythm: style.getPropertyValue('--g-rhythm').trim(),
        prose: style.getPropertyValue('--g-prose').trim(),
      }
    })

    expect(values.rhythm).toMatch(/px|rem|em|vw|vh|svh|dvh|lvh/)
    expect(values.prose).not.toMatch(/px|rem|em|vw|vh|svh|dvh|lvh/)
  })

  test('prose sample respects the contract tokens', async ({ page }) => {
    const result = await page.getByTestId('prose-sample').evaluate((node) => {
      const style = getComputedStyle(node)
      return {
        maxInlineSize: style.maxInlineSize,
        lineHeight: style.lineHeight,
      }
    })

    expect(result.maxInlineSize).not.toBe('none')
    expect(result.lineHeight).not.toBe('normal')
  })
})
