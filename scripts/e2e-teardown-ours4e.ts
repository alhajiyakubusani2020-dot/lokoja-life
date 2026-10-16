/* PASS 4e — the gate re-fires on EVERY arrival and is invisible to
   innerText/querySelector probes. My own screenshots pin its geometry at
   1280×800: X ≈ (828, 211), "Maybe later" ≈ (803, 587).
   Click BOTH after every arrival, then shoot. */
import { chromium } from 'playwright'
const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}
const errors: string[] = []
const run = async (): Promise<void> => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage()
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 180)) })
  page.on('pageerror', (e) => errors.push('pageerror: ' + String(e).slice(0, 180)))
  const banish = async (): Promise<void> => {
    for (const [x, y] of [[828, 211], [803, 587]] as const) {
      await page.mouse.click(x, y)
      await page.waitForTimeout(700)
    }
  }
  await race(page.goto('http://localhost:3000/?e2e=1', { waitUntil: 'domcontentloaded' }), 20_000, null)
  await page.waitForTimeout(1800)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  await race(page.getByLabel('Character name').fill('Beauty Shot'), 8000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 9000 }).catch(() => {}), 10_000, null)
  await page.waitForTimeout(2200)
  await race(page.getByRole('button', { name: /^world$/i }).first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  let settled = false
  for (let i = 0; i < 14; i++) {
    settled = await race(page.evaluate(() => {
      const l = (window as unknown as { __lkl?: { doors?: () => unknown[] } }).__lkl
      return !!l?.doors && l.doors().length > 0
    }), 4000, false)
    if (settled) break
    await page.waitForTimeout(2000)
  }
  console.log('settled:', settled)
  await banish()

  await race(page.evaluate(() => {
    (window as unknown as { __lkl?: { travel?: (s: string) => void } }).__lkl?.travel?.('mount-patti')
  }), 6000, null)
  await page.waitForTimeout(3000)
  await banish()
  await page.waitForTimeout(1200)
  await race(page.screenshot({ path: '/home/z/my-project/download/teardown-ours/42-patti-clean.png' }), 8000, null)
  console.log('✓ patti')

  await race(page.evaluate(() => {
    (window as unknown as { __lkl?: { travel?: (s: string) => void } }).__lkl?.travel?.('confluence')
  }), 6000, null)
  await page.waitForTimeout(3000)
  await banish()
  await page.waitForTimeout(1200)
  await race(page.screenshot({ path: '/home/z/my-project/download/teardown-ours/43-confluence-clean.png' }), 8000, null)
  console.log('✓ confluence')

  const door = await race(page.evaluate(() => {
    const l = (window as unknown as { __lkl?: { doors?: () => Array<{ id: string }>; enter?: (s: string) => void } }).__lkl
    const ds = l?.doors?.() ?? []
    if (ds.length) { const d = ds[Math.floor(ds.length / 2)]; l?.enter?.(d.id); return d.id }
    return null
  }), 6000, null)
  await page.waitForTimeout(3000)
  await banish()
  await page.waitForTimeout(1200)
  await race(page.screenshot({ path: '/home/z/my-project/download/teardown-ours/44-interior-clean.png' }), 8000, null)
  console.log('✓ interior', door)
  await browser.close()
}
run().then(() => { console.log(`DONE ${errors.length} errors`); if (errors.length) console.log(errors.slice(0, 5).join('\n')); process.exit(0) })
  .catch((e) => { console.error(e); process.exit(1) })
