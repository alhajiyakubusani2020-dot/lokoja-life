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
  const r1 = await page.evaluate(() => {
    const before = (window as any).__lkl.timeOfDay()
    ;(window as any).__lkl.rest('sleep')
    return { before, hook: typeof (window as any).__lkl.rest }
  })
  console.log('first rest:', JSON.stringify(r1))
  await page.waitForTimeout(700)
  for (let i = 0; i < 4; i++) {
    await page.evaluate(() => (window as any).__lkl.rest('sleep'))
    await page.waitForTimeout(500)
  }
  await page.waitForTimeout(2200)
  const after = await page.evaluate(() => {
    const r = JSON.parse(localStorage.getItem('lokoja-life:save') ?? '{}')
    return { tod: (window as any).__lkl.timeOfDay(), day: r.world?.day, owed: r.civic?.nepa?.owed }
  })
  console.log('after 5 rests:', JSON.stringify(after))
  await browser.close()
}
run().catch((e) => { console.error('failed', String(e).slice(0, 160)); process.exit(1) })
