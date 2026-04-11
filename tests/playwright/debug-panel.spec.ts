import { expect, test } from '@playwright/test'

test.describe('Debug overlay layers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for syncLayers + syncMetrics to run (deferred via setTimeout(0))
    await page.waitForTimeout(200)
  })

  // ── Layer attributes ──

  test('initial layers: cols and baseline are on by default', async ({ page }) => {
    const shell = page.locator('.g-shell').first()
    await expect(shell).toHaveAttribute('data-g-debug-cols', 'true')
    await expect(shell).toHaveAttribute('data-g-debug-baseline', 'true')
  })

  test('initial layers: rhythm, zones, drift are off by default', async ({ page }) => {
    const shell = page.locator('.g-shell').first()
    await expect(shell).toHaveAttribute('data-g-debug-rhythm', 'false')
    await expect(shell).toHaveAttribute('data-g-debug-zones', 'false')
    await expect(shell).toHaveAttribute('data-g-debug-drift', 'false')
  })

  // ── Keyboard shortcuts ──

  test('Alt+1 toggles cols layer', async ({ page }) => {
    const shell = page.locator('.g-shell').first()
    // cols starts true
    await expect(shell).toHaveAttribute('data-g-debug-cols', 'true')

    await page.keyboard.press('Alt+1')
    await expect(shell).toHaveAttribute('data-g-debug-cols', 'false')

    await page.keyboard.press('Alt+1')
    await expect(shell).toHaveAttribute('data-g-debug-cols', 'true')
  })

  test('Alt+2 toggles baseline layer', async ({ page }) => {
    const shell = page.locator('.g-shell').first()
    // baseline starts true
    await expect(shell).toHaveAttribute('data-g-debug-baseline', 'true')

    await page.keyboard.press('Alt+2')
    await expect(shell).toHaveAttribute('data-g-debug-baseline', 'false')

    await page.keyboard.press('Alt+2')
    await expect(shell).toHaveAttribute('data-g-debug-baseline', 'true')
  })

  test('Alt+3 toggles rhythm layer', async ({ page }) => {
    const shell = page.locator('.g-shell').first()
    await expect(shell).toHaveAttribute('data-g-debug-rhythm', 'false')

    await page.keyboard.press('Alt+3')
    await expect(shell).toHaveAttribute('data-g-debug-rhythm', 'true')

    await page.keyboard.press('Alt+3')
    await expect(shell).toHaveAttribute('data-g-debug-rhythm', 'false')
  })

  test('Alt+4 toggles zones layer', async ({ page }) => {
    const shell = page.locator('.g-shell').first()
    await expect(shell).toHaveAttribute('data-g-debug-zones', 'false')

    await page.keyboard.press('Alt+4')
    await expect(shell).toHaveAttribute('data-g-debug-zones', 'true')
  })

  test('Alt+0 turns all layers off', async ({ page }) => {
    const shell = page.locator('.g-shell').first()
    // cols and baseline start on
    await expect(shell).toHaveAttribute('data-g-debug-cols', 'true')

    await page.keyboard.press('Alt+0')

    await expect(shell).toHaveAttribute('data-g-debug-cols', 'false')
    await expect(shell).toHaveAttribute('data-g-debug-baseline', 'false')
    await expect(shell).toHaveAttribute('data-g-debug-rhythm', 'false')
    await expect(shell).toHaveAttribute('data-g-debug-zones', 'false')
    await expect(shell).toHaveAttribute('data-g-debug-drift', 'false')
  })

  // ── Overlay rendering ──

  test('cols overlay renders a background-image on ::before', async ({ page }) => {
    const hasGradient = await page
      .locator('.g-shell')
      .first()
      .evaluate((el) => {
        const before = getComputedStyle(el, '::before')
        return before.backgroundImage !== 'none' && before.content !== 'none'
      })
    expect(hasGradient).toBe(true)
  })

  test('baseline overlay renders a background-image on ::after', async ({ page }) => {
    const hasGradient = await page
      .locator('.g-shell')
      .first()
      .evaluate((el) => {
        const after = getComputedStyle(el, '::after')
        return after.backgroundImage !== 'none' && after.content !== 'none'
      })
    expect(hasGradient).toBe(true)
  })

  test('turning cols off removes ::before gradient', async ({ page }) => {
    await page.keyboard.press('Alt+1') // turn cols off

    const hasGradient = await page
      .locator('.g-shell')
      .first()
      .evaluate((el) => {
        return getComputedStyle(el, '::before').backgroundImage !== 'none'
      })
    expect(hasGradient).toBe(false)
  })

  test('turning baseline off removes ::after gradient', async ({ page }) => {
    await page.keyboard.press('Alt+2') // turn baseline off

    const hasGradient = await page
      .locator('.g-shell')
      .first()
      .evaluate((el) => {
        return getComputedStyle(el, '::after').backgroundImage !== 'none'
      })
    expect(hasGradient).toBe(false)
  })

  test('rhythm overlay adds horizontal lines to ::before', async ({ page }) => {
    await page.keyboard.press('Alt+3') // turn rhythm on

    const bgImage = await page
      .locator('.g-shell')
      .first()
      .evaluate((el) => {
        return getComputedStyle(el, '::before').backgroundImage
      })
    // When cols + rhythm are both on, background-image should have two gradients
    // (rhythm horizontal + cols vertical)
    expect(bgImage).toContain('repeating-linear-gradient')
  })

  test('zones overlay adds dashed outline to .g-shell', async ({ page }) => {
    await page.keyboard.press('Alt+4') // turn zones on

    const outline = await page
      .locator('.g-shell')
      .first()
      .evaluate((el) => {
        return getComputedStyle(el).outline
      })
    expect(outline).toContain('dashed')
  })

  // ── syncMetrics ──

  test('syncMetrics sets --g-debug-col-px on grid elements', async ({ page }) => {
    const colPx = await page
      .locator('.g-shell')
      .first()
      .evaluate((el) => {
        return el.style.getPropertyValue('--g-debug-col-px')
      })
    expect(colPx).toMatch(/^\d+(\.\d+)?px$/)
  })

  test('syncMetrics sets --g-debug-stride-px on grid elements', async ({ page }) => {
    const stridePx = await page
      .locator('.g-shell')
      .first()
      .evaluate((el) => {
        return el.style.getPropertyValue('--g-debug-stride-px')
      })
    expect(stridePx).toMatch(/^\d+(\.\d+)?px$/)
  })

  test('--g-debug-stride-px equals --g-debug-col-px + --g-debug-gutter-px', async ({ page }) => {
    const { colPx, gutterPx, stridePx } = await page
      .locator('.g-shell')
      .first()
      .evaluate((el) => {
        return {
          colPx: parseFloat(el.style.getPropertyValue('--g-debug-col-px')),
          gutterPx: parseFloat(el.style.getPropertyValue('--g-debug-gutter-px')),
          stridePx: parseFloat(el.style.getPropertyValue('--g-debug-stride-px')),
        }
      })
    expect(stridePx).toBeCloseTo(colPx + gutterPx, 1)
  })

  // ── All grid types ──

  test('all grid types (.g-shell, .g, .g-fit, .g-fill) get col overlays', async ({ page }) => {
    const results = await page.evaluate(() => {
      const types = ['.g-shell', '.g', '.g-fit', '.g-fill']
      return types.map((sel) => {
        const el = document.querySelector(sel) as HTMLElement | null
        if (!el) return { sel, found: false }
        return {
          sel,
          found: true,
          colPx: el.style.getPropertyValue('--g-debug-col-px'),
          hasBeforeGrad: getComputedStyle(el, '::before').backgroundImage !== 'none',
        }
      })
    })

    for (const r of results) {
      if (!r.found) continue
      expect(r.colPx).toMatch(/^\d+(\.\d+)?px$/)
      expect(r.hasBeforeGrad).toBe(true)
    }
  })

  test('.g-sub does not get column overlay (inherits parent columns)', async ({ page }) => {
    const hasBeforeGrad = await page.evaluate(() => {
      const sub = document.querySelector('.g-sub')
      if (!sub) return null
      return getComputedStyle(sub, '::before').backgroundImage !== 'none'
    })
    // .g-sub has no ::before column overlay — it inherits from parent
    expect(hasBeforeGrad).toBe(false)
  })
})

test.describe('DialKit panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(200)
  })

  test('DialKit React root is mounted', async ({ page }) => {
    // The debug panel creates a .g-debug-root container for React
    const debugRoot = page.locator('.g-debug-root')
    await expect(debugRoot).toBeAttached()
  })

  test.skip('DialKit panel toggles with Alt+G - skipped in production', async ({ page }) => {
    // DialKit auto-disables in production builds
    // This test is valid for dev server testing but not for production preview
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
