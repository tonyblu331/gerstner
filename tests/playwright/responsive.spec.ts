import { expect, test } from '@playwright/test'

test.describe('Phase 1: Responsive Stride', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', (msg) => console.log(`BROWSER: ${msg.text()}`))
    await page.goto('/')
  })

  test('g-view-3 col-count collapses at narrow widths', async ({ page }) => {
    // We target the g-view-3 container in the showcase
    const view3 = page.locator('.g.g-view-3').first()
    await expect(view3).toBeVisible()

    // 1. Check at desktop width
    await page.setViewportSize({ width: 1200, height: 800 })
    const colsDesktop = await view3.evaluate((node) => {
      return getComputedStyle(node).getPropertyValue('--g-cols').trim()
    })
    expect(colsDesktop).toBe('3')

    // 2. Check at mobile width
    await page.setViewportSize({ width: 375, height: 667 })

    const debug = await view3.evaluate((node) => {
      const style = getComputedStyle(node)
      const rect = node.getBoundingClientRect()
      return {
        width: rect.width,
        cols: style.getPropertyValue('--g-cols').trim(),
        containerType: style.containerType,
        bg: style.backgroundColor,
      }
    })
    console.log('Mobile debug:', debug)

    // If it's red, the query triggered
    expect(debug.bg).toBe('rgb(255, 0, 0)')
    expect(debug.cols).toBe('1')
  })

  test('g-shell columns stay 12 but tracks shrink (base behavior)', async ({ page }) => {
    const shell = page.locator('.site-shell').first()
    await page.setViewportSize({ width: 1200, height: 800 })

    const colsDesktop = await shell.evaluate((node) => {
      return getComputedStyle(node).getPropertyValue('--g-cols').trim()
    })
    expect(colsDesktop).toBe('12')

    await page.setViewportSize({ width: 375, height: 667 })
    const colsMobile = await shell.evaluate((node) => {
      return getComputedStyle(node).getPropertyValue('--g-cols').trim()
    })

    // For now, g-shell stays 12 (standard grid), but we might want to collapse it later.
    // The test confirms it stays 12 today.
    expect(colsMobile).toBe('12')
  })
})
