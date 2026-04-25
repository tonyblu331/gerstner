import { expect, test } from '@playwright/test'

test.describe('Debug overlay layers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(200)
  })

  test('initial layers: cols and baseline are on by default', async ({ page }) => {
    const body = page.locator('body')
    await expect(body).toHaveAttribute('data-g-debug-cols', 'true')
    await expect(body).toHaveAttribute('data-g-debug-baseline', 'true')
  })

  test('initial layers: rhythm and zones are off by default', async ({ page }) => {
    const body = page.locator('body')
    await expect(body).toHaveAttribute('data-g-debug-rhythm', 'false')
    await expect(body).toHaveAttribute('data-g-debug-zones', 'false')
  })

  test('Alt+1 toggles cols layer', async ({ page }) => {
    const body = page.locator('body')
    await expect(body).toHaveAttribute('data-g-debug-cols', 'true')

    await page.keyboard.press('Alt+1')
    await expect(body).toHaveAttribute('data-g-debug-cols', 'false')

    await page.keyboard.press('Alt+1')
    await expect(body).toHaveAttribute('data-g-debug-cols', 'true')
  })

  test('Alt+2 toggles baseline layer', async ({ page }) => {
    const body = page.locator('body')
    await expect(body).toHaveAttribute('data-g-debug-baseline', 'true')

    await page.keyboard.press('Alt+2')
    await expect(body).toHaveAttribute('data-g-debug-baseline', 'false')

    await page.keyboard.press('Alt+2')
    await expect(body).toHaveAttribute('data-g-debug-baseline', 'true')
  })

  test('Alt+3 toggles rhythm layer', async ({ page }) => {
    const body = page.locator('body')
    await expect(body).toHaveAttribute('data-g-debug-rhythm', 'false')

    await page.keyboard.press('Alt+3')
    await expect(body).toHaveAttribute('data-g-debug-rhythm', 'true')

    await page.keyboard.press('Alt+3')
    await expect(body).toHaveAttribute('data-g-debug-rhythm', 'false')
  })

  test('Alt+4 toggles zones layer', async ({ page }) => {
    const body = page.locator('body')
    await expect(body).toHaveAttribute('data-g-debug-zones', 'false')

    await page.keyboard.press('Alt+4')
    await expect(body).toHaveAttribute('data-g-debug-zones', 'true')
  })

  test('Alt+0 turns all layers off', async ({ page }) => {
    const body = page.locator('body')
    await expect(body).toHaveAttribute('data-g-debug-cols', 'true')

    await page.keyboard.press('Alt+0')

    await expect(body).toHaveAttribute('data-g-debug-cols', 'false')
    await expect(body).toHaveAttribute('data-g-debug-baseline', 'false')
    await expect(body).toHaveAttribute('data-g-debug-rhythm', 'false')
    await expect(body).toHaveAttribute('data-g-debug-zones', 'false')
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

  test('baseline overlay on body::after when baseline on', async ({ page }) => {
    const hasGradient = await page.evaluate(() => {
      const after = getComputedStyle(document.body, '::after')
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

  test('turning baseline off removes ::after gradient on body', async ({ page }) => {
    await page.keyboard.press('Alt+2')

    const hasGradient = await page.evaluate(() => {
      const after = getComputedStyle(document.body, '::after')
      return after.backgroundImage !== 'none'
    })
    expect(hasGradient).toBe(false)
  })

  test('rhythm overlay uses body::before', async ({ page }) => {
    await page.keyboard.press('Alt+3')

    const bgImage = await page.evaluate(() => {
      return getComputedStyle(document.body, '::before').backgroundImage
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

test.describe('Relationship truth — passive observer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(200)
  })

  test('g-shell has --g-debug-field=shell and --g-debug-relationship=exact', async ({ page }) => {
    const result = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>('.g-shell')
      if (!el) return null
      const cs = getComputedStyle(el)
      return {
        field: cs.getPropertyValue('--g-debug-field').trim(),
        relationship: cs.getPropertyValue('--g-debug-relationship').trim(),
      }
    })
    expect(result).not.toBeNull()
    expect(result!.field).toBe('shell')
    expect(result!.relationship).toBe('exact')
  })

  test('g-sub has --g-debug-field=subgrid and --g-debug-relationship=exact', async ({ page }) => {
    const result = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>('.g-sub')
      if (!el) return null
      const cs = getComputedStyle(el)
      return {
        field: cs.getPropertyValue('--g-debug-field').trim(),
        relationship: cs.getPropertyValue('--g-debug-relationship').trim(),
      }
    })
    if (result === null) return // skip if no g-sub in playground
    expect(result.field).toBe('subgrid')
    expect(result.relationship).toBe('exact')
  })

  test('g-view-* has --g-debug-relationship=approximate', async ({ page }) => {
    const result = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>(
        '.g-view-2, .g-view-3, .g-view-4, .g-view-6, .g-view-8, .g-view-12',
      )
      if (!el) return null
      return getComputedStyle(el).getPropertyValue('--g-debug-relationship').trim()
    })
    if (result === null) return // skip if no g-view-* in playground
    expect(result).toBe('approximate')
  })

  test('g-align-independent has --g-debug-relationship=independent', async ({ page }) => {
    const result = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>('.g-align-independent')
      if (!el) return null
      return getComputedStyle(el).getPropertyValue('--g-debug-relationship').trim()
    })
    if (result === null) return // skip if no g-align-independent in playground
    expect(result).toBe('independent')
  })

  test('debug does not set data-g-debug-drift attribute (drift removed)', async ({ page }) => {
    const hasDrift = await page.evaluate(() => {
      return document.body.hasAttribute('data-g-debug-drift')
    })
    expect(hasDrift).toBe(false)
  })
})

test.describe('Inspector panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(200)
  })

  test('inspector toggle button is present in the DOM', async ({ page }) => {
    const toggle = page.locator('[data-g-inspector-toggle]')
    await expect(toggle).toBeAttached()
  })

  test('inspector shows field/relationship/cols after toggle click on g-shell', async ({
    page,
  }) => {
    const shell = page.locator('.g-shell').first()
    await shell.click()
    await page.waitForTimeout(100)

    const toggle = page.locator('[data-g-inspector-toggle]')
    await toggle.click()
    await page.waitForTimeout(100)

    const inspector = page.locator('[data-g-inspector]')
    await expect(inspector).toBeAttached()
    const text = await inspector.innerText()
    expect(text).toContain('Field:')
    expect(text).toContain('Relationship:')
    expect(text).toContain('Cols:')
  })
})

test.describe('No layout mutation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(200)
  })

  test('debug panel mount does not shift g-shell bounding rect', async ({ page }) => {
    const rectBefore = await page.locator('.g-shell').first().boundingBox()
    // Trigger a full resync
    await page.evaluate(() => {
      document.dispatchEvent(new CustomEvent('gerstner-debug-sync', { detail: {} }))
    })
    await page.waitForTimeout(100)
    const rectAfter = await page.locator('.g-shell').first().boundingBox()

    expect(rectAfter).not.toBeNull()
    expect(rectBefore).not.toBeNull()
    expect(rectAfter!.x).toBeCloseTo(rectBefore!.x, 0)
    expect(rectAfter!.y).toBeCloseTo(rectBefore!.y, 0)
    expect(rectAfter!.width).toBeCloseTo(rectBefore!.width, 0)
  })

  test('col overlay nodes have pointer-events:none (non-interactive)', async ({ page }) => {
    const pe = await page.evaluate(() => {
      const overlay = document.querySelector<HTMLElement>('.g-debug-col-overlay')
      if (!overlay) return null
      return getComputedStyle(overlay).pointerEvents
    })
    if (pe === null) return
    expect(pe).toBe('none')
  })
})

test.describe('Debug panel mount', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(200)
  })

  test('Debug root is mounted', async ({ page }) => {
    const debugRoot = page.locator('.g-debug-root')
    await expect(debugRoot).toBeAttached()
  })
})
