/** debug: what does A's Calls directory actually show? */
import { chromium } from 'playwright'

const BASE = 'http://localhost:81'
const stamp = Date.now().toString(36).slice(-5)
const A = `dbg_${stamp}`
const B = `dbg2_${stamp}`

async function walker(handle: string, browser: Awaited<ReturnType<typeof chromium.launch>>) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ['microphone'] })
  const page = await ctx.newPage()
  await page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded', timeout: 30_000 })
  await page.getByTestId('menu-auth-open').click({ timeout: 15_000 })
  await page.getByTestId('auth-tab-claim').click({ timeout: 5_000 })
  await page.getByTestId('auth-handle').fill(handle)
  await page.getByTestId('auth-pin').fill('1357')
  await page.getByTestId('auth-contact').fill(`${handle}_${Date.now() % 100000}@lokoja.life`)
  await page.getByTestId('auth-submit').click({ timeout: 10_000 })
  await page.getByPlaceholder('Your name…').fill('Ada', { timeout: 15_000 })
  await page.getByRole('button', { name: /Start Life in Lokoja/i }).click({ timeout: 10_000 })
  await page.waitForSelector('[data-testid="goals-card"]', { timeout: 25_000 })
  return page
}

const browser = await chromium.launch({ args: ['--disable-dev-shm-usage', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] })
const pa = await walker(A, browser)
const pb = await walker(B, browser)
await pa.waitForTimeout(3000)

await pa.getByRole('button', { name: 'Phone', exact: true }).click({ timeout: 10_000 })
await pa.waitForSelector('text=Wetin dey happen', { timeout: 10_000 })
await pa.screenshot({ path: '/tmp/dbg-phone-grid.png' })
const gridText = await pa.locator('body').textContent()
console.log('GRID has Calls?', gridText?.includes('Calls'))
await pa.getByText('Calls', { exact: true }).first().click({ timeout: 10_000 })
await pa.waitForTimeout(2500)
await pa.screenshot({ path: '/tmp/dbg-calls.png' })
const body = await pa.locator('body').textContent()
console.log('CALLS has @B?', body?.includes(`@${B}`))
console.log('CALLS body slice:', body?.slice(body.indexOf('Calls'), body.indexOf('Calls') + 600))
const lane = await pa.evaluate(`window.__lklVoice ? 'hook-alive' : 'no-hook'`)
console.log('voice hook:', lane)
await browser.close()
process.exit(0)
