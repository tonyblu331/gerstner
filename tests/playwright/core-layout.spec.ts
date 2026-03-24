import { expect, test } from '@playwright/test'

test.describe('gerstner playground', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders shell and content structure', async ({ page }) => {
    await expect(page.locator('.g-shell')).toBeVisible()
    await expect(page.locator('.g-content')).toBeVisible()
  })

  test('displays heading with proper typography classes', async ({ page }) => {
    const heading = page.locator('.g-display')
    await expect(heading).toBeVisible()
    await expect(heading).toContainText('Gerstner Playground')
  })

  test('prose content has proper styling', async ({ page }) => {
    const prose = page.locator('.g-prose')
    await expect(prose).toBeVisible()
    await expect(prose).toContainText('Testing the Gerstner layout system')
  })

  test('breakout element is present', async ({ page }) => {
    const breakout = page.locator('.g-breakout-r')
    await expect(breakout).toBeVisible()
  })

  test('buttons are present and interactive', async ({ page }) => {
    const buttons = page.locator('button')
    await expect(buttons).toHaveCount(2)
    
    const firstButton = buttons.first()
    await expect(firstButton).toContainText('Test Debug')
    
    const secondButton = buttons.last()
    await expect(secondButton).toContainText('Test CLI')
  })

  test('debug button click triggers console output', async ({ page }) => {
    const debugButton = page.locator('button').first()
    
    // Listen for console messages
    const consoleMessages: string[] = []
    page.on('console', msg => {
      consoleMessages.push(msg.text())
    })
    
    await debugButton.click()
    
    // Check that debug message was logged
    expect(consoleMessages.some(msg => msg.includes('Debug button clicked'))).toBeTruthy()
  })

  test('CLI button click triggers console output', async ({ page }) => {
    const cliButton = page.locator('button').last()
    
    // Listen for console messages
    const consoleMessages: string[] = []
    page.on('console', msg => {
      consoleMessages.push(msg.text())
    })
    
    await cliButton.click()
    
    // Check that CLI message was logged
    expect(consoleMessages.some(msg => msg.includes('Running command: build'))).toBeTruthy()
  })
})
