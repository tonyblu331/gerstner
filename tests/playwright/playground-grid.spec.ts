import { expect, test } from '@playwright/test'

test.describe('Playground grid smoke', () => {
  test('showcase has outer g-shell and hero subgrid', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(150)
    await expect(page.locator('main.g-shell').first()).toBeVisible()
    await expect(page.locator('header.g-sub.hero').first()).toBeVisible()
  })

  test('hash navigation remounts shells and column overlay can sync', async ({ page }) => {
    await page.goto('/#/article')
    await page.waitForTimeout(200)
    const articleShell = page.locator('.g-shell').first()
    await expect(articleShell).toBeVisible()

    await page.goto('/#/')
    await page.waitForTimeout(200)
    await expect(page.locator('main.g-shell').first()).toBeVisible()

    const overlayCount = await page.locator('.g-debug-col-overlay').count()
    expect(overlayCount).toBeGreaterThan(0)
  })

  test('g-shell uses gap-based template (no legacy gutter track names in inline placement)', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForTimeout(150)
    const heroTextCol = await page.locator('.hero-text').getAttribute('style')
    expect(heroTextCol).toContain('col 8')
    expect(heroTextCol).not.toContain('gutter-')
  })
})
