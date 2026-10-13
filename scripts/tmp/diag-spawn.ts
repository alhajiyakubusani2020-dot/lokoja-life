import { chromium } from 'playwright'
const run = async () => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await page.goto('http://localhost:3000/?e2e=1', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1200)
  const pre = await page.evaluate(() => {
    const r = localStorage.getItem('lokoja-life:save')
    return r ? JSON.parse(r).world.currentLocation : 'none'
  })
  console.log('pre-existing save location:', pre)
  if (pre === 'none') { await browser.close(); return }
  await page.getByText('Continue your life').first().click({ timeout: 6000 })
  await page.waitForTimeout(500)
  const worldLoc = await page.evaluate(() => {
    const r = localStorage.getItem('lokoja-life:save')
    return r ? JSON.parse(r).world.currentLocation : 'none'
  })
  console.log('save location after continue click:', worldLoc)
  await page.getByText('Explore in 3D').first().click({ timeout: 6000 })
  await page.waitForTimeout(5500)
  const after = await page.evaluate(() => {
    const r = localStorage.getItem('lokoja-life:save')
    const pos = (window as any).__lkl?.pos?.()
    return { saved: r ? JSON.parse(r).world.currentLocation : 'none', pos }
  })
  console.log('after 3D entry:', JSON.stringify(after))
  await browser.close()
}
run().catch((e) => { console.error('failed', String(e).slice(0, 150)); process.exit(1) })
