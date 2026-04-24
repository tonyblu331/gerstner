import { chromium } from '@playwright/test'
import { writeFileSync } from 'fs'

const browser = await chromium.launch()
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  bypassCSP: true,
})
await context.route('**/*', (route) => {
  route.continue({ headers: { ...route.request().headers(), 'Cache-Control': 'no-cache' } })
})
const page = await context.newPage()
const cdp = await page.context().newCDPSession(page)
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })

await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
await page.waitForTimeout(600)
const s1 = await page.screenshot({ fullPage: false })
writeFileSync('debug-default.png', s1)
console.log('wrote debug-default.png')

await page.click('[data-g-inspector-toggle]')
await page.waitForTimeout(400)
const s2 = await page.screenshot({ fullPage: false })
writeFileSync('debug-inspector.png', s2)
console.log('wrote debug-inspector.png')

await page.keyboard.press('Alt+4')
await page.waitForTimeout(300)
const s3 = await page.screenshot({ fullPage: false })
writeFileSync('debug-zones.png', s3)
console.log('wrote debug-zones.png')

await browser.close()
console.log('done')
