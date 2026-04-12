import { expect, test } from '@playwright/test'

test.describe('Debug overlay layers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(200)
  })

  test('initial layers: cols and baseline are on by default', async ({ page }) => {
    const root = page.locator('.g-debug-root')
    await expect(root).toHaveAttribute('data-g-debug-cols', 'true')
    await expect(root).toHaveAttribute('data-g-debug-baseline', 'true')
  })

  test('initial layers: rhythm, zones, drift are off by default', async ({ page }) => {
    const root = page.locator('.g-debug-root')
    await expect(root).toHaveAttribute('data-g-debug-rhythm', 'false')
    await expect(root).toHaveAttribute('data-g-debug-zones', 'false')
    await expect(root).toHaveAttribute('data-g-debug-drift', 'false')
  })

  test('Alt+1 toggles cols layer', async ({ page }) => {
    const root = page.locator('.g-debug-root')
    await expect(root).toHaveAttribute('data-g-debug-cols', 'true')

    await page.keyboard.press('Alt+1')
    await expect(root).toHaveAttribute('data-g-debug-cols', 'false')

    await page.keyboard.press('Alt+1')
    await expect(root).toHaveAttribute('data-g-debug-cols', 'true')
  })

  test('Alt+2 toggles baseline layer', async ({ page }) => {
    const root = page.locator('.g-debug-root')
    await expect(root).toHaveAttribute('data-g-debug-baseline', 'true')

    await page.keyboard.press('Alt+2')
    await expect(root).toHaveAttribute('data-g-debug-baseline', 'false')

    await page.keyboard.press('Alt+2')
    await expect(root).toHaveAttribute('data-g-debug-baseline', 'true')
  })

  test('Alt+3 toggles rhythm layer', async ({ page }) => {
    const root = page.locator('.g-debug-root')
    await expect(root).toHaveAttribute('data-g-debug-rhythm', 'false')

    await page.keyboard.press('Alt+3')
    await expect(root).toHaveAttribute('data-g-debug-rhythm', 'true')

    await page.keyboard.press('Alt+3')
    await expect(root).toHaveAttribute('data-g-debug-rhythm', 'false')
  })

  test('Alt+4 toggles zones layer', async ({ page }) => {
    const root = page.locator('.g-debug-root')
    await expect(root).toHaveAttribute('data-g-debug-zones', 'false')

    await page.keyboard.press('Alt+4')
    await expect(root).toHaveAttribute('data-g-debug-zones', 'true')
  })

  test('Alt+0 turns all layers off', async ({ page }) => {
    const root = page.locator('.g-debug-root')
    await expect(root).toHaveAttribute('data-g-debug-cols', 'true')

    await page.keyboard.press('Alt+0')

    await expect(root).toHaveAttribute('data-g-debug-cols', 'false')
    await expect(root).toHaveAttribute('data-g-debug-baseline', 'false')
    await expect(root).toHaveAttribute('data-g-debug-rhythm', 'false')
    await expect(root).toHaveAttribute('data-g-debug-zones', 'false')
    await expect(root).toHaveAttribute('data-g-debug-drift', 'false')
  })

  test('cols layer injects .g-debug-col-overlay with vertical gradient', async ({ page }) => {
    const hasGradient = await page.evaluate(() => {
      const overlay = document.querySelector('.g-debug-col-overlay') as HTMLElement | null
      if (!overlay) return false
      const bg = getComputedStyle(overlay).backgroundImage
      return bg.includes('linear-gradient')
    })
    expect(hasGradient).toBe(true)
  })

  test('baseline overlay on .g-debug-root::after when baseline on', async ({ page }) => {
    const hasGradient = await page.evaluate(() => {
      const root = document.querySelector('.g-debug-root')
      if (!root) return false
      const after = getComputedStyle(root, '::after')
      return after.backgroundImage !== 'none' && after.display !== 'none'
    })
    expect(hasGradient).toBe(true)
  })

  test('turning cols off removes column overlay nodes', async ({ page }) => {
    await page.keyboard.press('Alt+1')
    await page.waitForTimeout(50)
    const count = await page.locator('.g-debug-col-overlay').count()
    expect(count).toBe(0)
  })

  test('turning baseline off removes ::after gradient on debug root', async ({ page }) => {
    await page.keyboard.press('Alt+2')

    const hasGradient = await page.evaluate(() => {
      const root = document.querySelector('.g-debug-root')
      if (!root) return true
      const after = getComputedStyle(root, '::after')
      return after.backgroundImage !== 'none'
    })
    expect(hasGradient).toBe(false)
  })

  test('rhythm overlay uses .g-debug-root::before', async ({ page }) => {
    await page.keyboard.press('Alt+3')

    const bgImage = await page.evaluate(() => {
      const root = document.querySelector('.g-debug-root')
      if (!root) return ''
      return getComputedStyle(root, '::before').backgroundImage
    })
    expect(bgImage).toContain('repeating-linear-gradient')
  })

  test('zones overlay adds dashed outline to .g-shell', async ({ page }) => {
    await page.keyboard.press('Alt+4')

    const outline = await page
      .locator('.g-shell')
      .first()
      .evaluate((el) => getComputedStyle(el).outline)
    expect(outline).toContain('dashed')
  })

  test('syncMetrics sets --g-debug-col-px on .g-debug-root', async ({ page }) => {
    const colPx = await page.evaluate(() => {
      const root = document.querySelector('.g-debug-root') as HTMLElement | null
      return root?.style.getPropertyValue('--g-debug-col-px') ?? ''
    })
    expect(colPx).toMatch(/^\d+(\.\d+)?px$/)
  })

  test('syncMetrics sets --g-debug-stride-px on .g-debug-root', async ({ page }) => {
    const stridePx = await page.evaluate(() => {
      const root = document.querySelector('.g-debug-root') as HTMLElement | null
      return root?.style.getPropertyValue('--g-debug-stride-px') ?? ''
    })
    expect(stridePx).toMatch(/^\d+(\.\d+)?px$/)
  })

  test('--g-debug-stride-px equals --g-debug-col-px + --g-debug-gutter-px on debug root', async ({
    page,
  }) => {
    const { colPx, gutterPx, stridePx } = await page.evaluate(() => {
      const root = document.querySelector('.g-debug-root') as HTMLElement
      return {
        colPx: parseFloat(root.style.getPropertyValue('--g-debug-col-px')),
        gutterPx: parseFloat(root.style.getPropertyValue('--g-debug-gutter-px')),
        stridePx: parseFloat(root.style.getPropertyValue('--g-debug-stride-px')),
      }
    })
    expect(stridePx).toBeCloseTo(colPx + gutterPx, 1)
  })

  test('.g-sub does not get .g-debug-col-overlay (subgrid inherits parent shell)', async ({
    page,
  }) => {
    const subHasOverlay = await page.evaluate(() => {
      const sub = document.querySelector('.g-sub')
      if (!sub) return null
      return sub.querySelector(':scope > .g-debug-col-overlay') !== null
    })
    expect(subHasOverlay).toBe(false)
  })
})

test.describe('DialKit panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(200)
  })

  test('DialKit React root is mounted', async ({ page }) => {
    const debugRoot = page.locator('.g-debug-root')
    await expect(debugRoot).toBeAttached()
  })

  test.skip('DialKit panel toggles with Alt+G - skipped in production', async ({ page }) => {
    await page.keyboard.press('Alt+G')
    await page.waitForTimeout(500)
    const panelVisible = await page.evaluate(() => {
      const dialEl = document.querySelector('[data-dialkit], [data-testid="dialkit"]')
      if (dialEl) return true
      const fixed = document.querySelector('[style*="position: fixed"]')
      return !!fixed
    })
    expect(panelVisible).toBe(true)
  })
})
