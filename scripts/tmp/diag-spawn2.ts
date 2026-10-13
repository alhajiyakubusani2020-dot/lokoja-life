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
  await page.waitForTimeout(2700)
  await page.evaluate(() => {
    const save = JSON.parse(localStorage.getItem('lokoja-life:save')!)
    save.player.level = 3
    save.player.cash = 15000
    save.world.currentLocation = 'government-area'
    localStorage.setItem('lokoja-life:save', JSON.stringify(save))
  })
  await page.goto('http://localhost:3000/?e2e=1', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1300)
  const patched = await page.evaluate(() => {
    const r = JSON.parse(localStorage.getItem('lokoja-life:save')!)
    return { loc: r.world.currentLocation, lvl: r.player.level, version: r.version, civic: !!r.civic }
  })
  console.log('patched save read back:', JSON.stringify(patched))
  await page.getByText('Continue your life').first().click({ timeout: 6000 })
  await page.waitForTimeout(700)
  await page.getByText('Explore in 3D').first().click({ timeout: 6000 })
  await page.waitForTimeout(5500)
  const after = await page.evaluate(() => {
    const r = JSON.parse(localStorage.getItem('lokoja-life:save')!)
    return { savedLoc: r.world.currentLocation, pos: (window as any).__lkl?.pos?.() }
  })
  console.log('after 3D entry:', JSON.stringify(after))
  await browser.close()
}
run().catch((e) => { console.error('failed', String(e).slice(0, 150)); process.exit(1) })
