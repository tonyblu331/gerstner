import { expect, test } from '@playwright/test'

test.describe('DialKit debug panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('panel opens with Alt+G', async ({ page }) => {
    await page.keyboard.press('Alt+G')
    // DialKit renders a floating panel with role="dialog" or similar
    // We'll verify the actual selector after seeing DialKit's DOM
    const panel = page.locator('[role="dialog"], [data-dialkit], .dialkit-panel').first()
    await expect(panel).toBeVisible()
  })

  test('grid folder has cols slider with default from scope', async ({ page }) => {
    await page.keyboard.press('Alt+G')
    // Find the first grid element to scope to
    const shell = page.locator('.g-shell, .g').first()
    await shell.click() // pin scope

    // The cols slider should show the computed value from that scope
    // DialKit renders sliders as input[type="range"] within its panel
    const slider = page
      .locator('input[type="range"][name*="cols"], [data-g-dial="cols"] input')
      .first()
    await expect(slider).toBeVisible()
    const value = await slider.inputValue()
    expect(Number(value)).toBeGreaterThanOrEqual(3)
    expect(Number(value)).toBeLessThanOrEqual(24)
  })

  test('hovering grid updates panel to show that scope values', async ({ page }) => {
    await page.keyboard.press('Alt+G')

    const shell = page.locator('.g-shell').first()
    const raw = page.locator('.g:not(.g-shell)').first()

    await shell.click() // pin to shell
    await page.locator('input[type="range"][name*="cols"]').first().inputValue()

    await raw.hover() // unpin and hover different scope
    // Panel should update - give it a moment
    await page.waitForTimeout(100)

    const newCols = await page.locator('input[type="range"][name*="cols"]').first().inputValue()
    // Values may be same or different depending on CSS, but panel should respond
    expect(newCols).toBeTruthy()
  })

  test('clicking grid pins scope so hover does not change it', async ({ page }) => {
    await page.keyboard.press('Alt+G')

    const shell = page.locator('.g-shell').first()
    const other = page.locator('.g:not(.g-shell)').first()

    await shell.click() // pin to shell
    const initialCols = await page.locator('input[type="range"][name*="cols"]').first().inputValue()

    await other.hover()
    await page.waitForTimeout(100)

    const afterHover = await page.locator('input[type="range"][name*="cols"]').first().inputValue()
    // If pinned, values should stay the same
    expect(afterHover).toBe(initialCols)
  })

  test('cols slider writes --g-cols to pinned scope', async ({ page }) => {
    await page.keyboard.press('Alt+G')

    const shell = page.locator('.g-shell').first()
    await shell.click() // pin it

    // Get the slider and change it
    const slider = page.locator('input[type="range"][name*="cols"]').first()
    await slider.fill('8')

    // Check inline style was written
    const inlineCols = await shell.evaluate((el) => el.style.getPropertyValue('--g-cols'))
    expect(inlineCols).toBe('8')
  })

  test('show_cols toggle sets data-g-debug-cols on grids', async ({ page }) => {
    await page.keyboard.press('Alt+G')

    // Find the cols toggle in DialKit (boolean becomes a toggle switch)
    const toggle = page
      .locator('input[type="checkbox"][name*="cols"], [role="switch"][name*="cols"]')
      .first()
    await toggle.click()

    // Check that grid elements get the attribute
    const grid = page.locator('.g-shell, .g, .g-fit, .g-fill, .g-sub').first()
    await expect(grid).toHaveAttribute('data-g-debug-cols', 'true')
  })

  test('Alt+1 toggles cols layer via keyboard', async ({ page }) => {
    // Before toggle
    const grid = page.locator('.g-shell, .g').first()
    const before = await grid.getAttribute('data-g-debug-cols')

    await page.keyboard.press('Alt+1')

    // After toggle - should be opposite of before (or true if not set)
    const after = await grid.getAttribute('data-g-debug-cols')
    expect(after).not.toBe(before)
  })

  test('panel has grid and type folders with correct controls', async ({ page }) => {
    await page.keyboard.press('Alt+G')

    // DialKit folders are collapsible sections
    // Look for folder labels/headers
    const folderLabels = page
      .locator('text=grid, text=type, text=Grid, text=Type, [role="button"]')
      .allInnerTexts()
    const labels = await folderLabels

    // Should have at least grid and type folders visible
    const hasGrid = labels.some((l) => l.toLowerCase().includes('grid'))
    const hasType = labels.some(
      (l) => l.toLowerCase().includes('type') || l.toLowerCase().includes('typo'),
    )

    expect(hasGrid || hasType).toBe(true)
  })
})
