import { chromium } from 'playwright'
const run = async () => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await page.goto('http://localhost:3000/?e2e=1', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1300)
  await page.getByText('START YOUR LIFE').first().click({ timeout: 6000 })
  await page.waitForTimeout(350)
  await page.getByLabel('Character name').fill('Ada')
  await page.getByText('Start Life in Lokoja').first().click({ timeout: 6000 })
  await page.waitForTimeout(350)
  await page.getByText('Explore in 3D').first().click({ timeout: 6000 })
  await page.waitForTimeout(4800)
  const err = await page.evaluate(() => {
    try {
      (window as any).__lkl.rest('sleep')
      return 'no-throw'
    } catch (e) {
      return String(e).slice(0, 300) + ' | ' + (e as Error)?.stack?.slice(0, 300)
    }
  })
  console.log('rest result:', err)
  await browser.close()
}
run().catch((e) => { console.error('failed', String(e).slice(0, 160)); process.exit(1) })
