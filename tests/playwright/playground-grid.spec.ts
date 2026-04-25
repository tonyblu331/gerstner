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
    const heroTextClasses = await page.locator('.hero-text').getAttribute('class')
    expect(heroTextClasses).toContain('col-end-8')
    expect(heroTextClasses).not.toContain('gutter-')
  })

  test('ny-times route has shell, masthead subgrid, and editorial cards', async ({ page }) => {
    await page.goto('/#/ny-times')
    await page.waitForTimeout(200)

    const shell = page.locator('.page-nyt .g-shell').first()
    await expect(shell).toBeVisible()

    const mastheadSubgrid = page.locator('.nyt-masthead .g-sub').first()
    await expect(mastheadSubgrid).toBeVisible()

    const editorialGrid = page.locator('.nyt-editorial__grid').first()
    await expect(editorialGrid).toBeVisible()

    const editorialCards = page.locator('.nyt-editorial__grid .nyt-editorial__card')
    await expect(editorialCards).toHaveCount(3)

    for (let i = 0; i < 3; i++) {
      await expect(editorialCards.nth(i)).toBeVisible()
    }
  })
})
