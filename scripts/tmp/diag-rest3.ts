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

  const readSave = () => page.evaluate(() => {
    const r = JSON.parse(localStorage.getItem('lokoja-life:save') ?? '{}')
    return { day: r.world?.day, civicOwed: r.civic?.nepa?.owed, version: r.version }
  })

  console.log('save at boot:', JSON.stringify(await readSave()))
  const r1 = await page.evaluate(() => {
    try { (window as any).__lkl.rest('sleep'); return 'ok' } catch (e) { return 'THREW: ' + String(e).slice(0, 200) }
  })
  console.log('rest#1:', r1)
  await page.waitForTimeout(2300)
  console.log('save after rest#1:', JSON.stringify(await readSave()))
  const r2 = await page.evaluate(() => {
    try { (window as any).__lkl.rest('sleep'); return 'ok' } catch (e) { return 'THREW: ' + String(e).slice(0, 200) }
  })
  console.log('rest#2:', r2)
  await page.waitForTimeout(2300)
  console.log('save after rest#2:', JSON.stringify(await readSave()))
  await browser.close()
}
run().catch((e) => { console.error('failed', String(e).slice(0, 160)); process.exit(1) })
