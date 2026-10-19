/** One-shot: re-shoot the Nation hero after the wrap fix. */
import { chromium, devices } from 'playwright'

const run = async () => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const ctx = await browser.newContext({ ...devices['iPhone 13'] })
  const page = await ctx.newPage()
  await page.goto('http://localhost:3000/?e2e=1', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1400)
  await page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {})
  await page.getByLabel('Character name').fill('Face Hand').catch(() => {})
  await page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {})
  await page.waitForTimeout(1800)
  await page.getByRole('button', { name: 'Phone', exact: true }).first().click({ timeout: 8000 }).catch(() => {})
  await page.waitForTimeout(500)
  await page.getByRole('button', { name: 'Open Nation app' }).first().click({ timeout: 8000 }).catch(() => {})
  await page.waitForTimeout(1200)
  const t = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="nation-hero"] h2')
    return { title: el?.textContent ?? null, clipped: el ? el.scrollWidth > el.clientWidth : null }
  })
  console.log('nation hero title:', JSON.stringify(t))
  await page.screenshot({ path: '/home/z/my-project/download/m24-uiface-shots/07-nation-face.png' })
  await browser.close()
  console.log('done')
}
void run()
