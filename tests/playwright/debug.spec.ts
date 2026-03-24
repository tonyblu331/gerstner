import { expect, test } from '@playwright/test'

test.describe('gerstner debug layer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders the debug panel and badge in dev playground', async ({ page }) => {
    await expect(page.getByTestId('gerstner-debug-panel')).toBeVisible()
    await expect(page.getByTestId('gerstner-debug-badge')).toBeVisible()
    await expect(page.getByText('Gerstner debug')).toBeVisible()
  })

  test('overlay can be toggled off from the panel', async ({ page }) => {
    const root = page.locator('.g-debug-root')
    await expect(root).toHaveAttribute('data-overlay', 'true')

    await page.getByRole('button', { name: 'Overlay' }).click()
    await expect(root).toHaveAttribute('data-overlay', 'false')
  })

  test('hovering a marked scope updates the inspector label', async ({ page }) => {
    await page.getByTestId('scene-breakout').hover()
    await expect(page.locator('[data-g-debug-field="scope-label"]')).toHaveText('Scene E · breakout')
    await expect(page.locator('[data-g-debug-badge="label"]')).toHaveText('Scene E · breakout')
  })
})
