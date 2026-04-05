import { expect, test } from '@playwright/test'

test.describe('reference scenes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('all required phase 1 and 2 scenes render', async ({ page }) => {
    const ids = [
      'scene-shell-vs-raw',
      'scene-rhythm',
      'scene-viewport',
      'scene-zones',
      'scene-exact',
      'scene-approximate',
      'scene-independent',
      'scene-adaptive',
      'scene-scope-overrides',
    ]

    for (const id of ids) {
      await expect(page.getByTestId(id)).toBeVisible()
    }
  })

  test('local scope overrides do not mutate the root contract', async ({ page }) => {
    const values = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement).getPropertyValue('--g-cols').trim()
      const local = getComputedStyle(
        document.querySelector('[data-testid="override-scope"]') as Element,
      )
        .getPropertyValue('--g-cols')
        .trim()
      return { root, local }
    })

    expect(values.root).toBe('12')
    expect(values.local).toBe('6')
  })
})
