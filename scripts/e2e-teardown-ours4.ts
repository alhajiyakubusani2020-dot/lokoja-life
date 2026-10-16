/**
 * TEARDOWN PASS 4 — CLEAN WORLD SHOTS: dismiss the guest gate ("Maybe
 * later"), then photograph Mount Patti, the Confluence, and an interior.
 * Desktop 1280×800, fresh context, 0-error law.
 * Run: bun scripts/e2e-teardown-ours4.ts
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/teardown-ours'
mkdirSync(SHOTS, { recursive: true })

const watchdog = setTimeout(() => { console.error('WATCHDOG: 150s hard exit'); process.exit(2) }, 149_000)
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

  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 20_000, null)
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

  /* dismiss the guest gate if it stands */
  const dismissed = await race(page.getByText('Maybe later').first().click({ timeout: 5000 }).then(() => true).catch(() => false), 6000, false)
  console.log('guest gate dismissed:', dismissed)
  await page.waitForTimeout(1500)

  /* Mount Patti */
  await race(page.evaluate(() => {
    const l = (window as unknown as { __lkl?: { travel?: (s: string) => void } }).__lkl
    l?.travel?.('mount-patti')
  }), 6000, null)
  await page.waitForTimeout(3500)
  await race(page.screenshot({ path: `${SHOTS}/42-patti-clean.png` }), 8000, null)
  console.log('✓ patti clean')

  /* Confluence */
  await race(page.evaluate(() => {
    const l = (window as unknown as { __lkl?: { travel?: (s: string) => void } }).__lkl
    l?.travel?.('confluence')
  }), 6000, null)
  await page.waitForTimeout(3500)
  await race(page.screenshot({ path: `${SHOTS}/43-confluence-clean.png` }), 8000, null)
  console.log('✓ confluence clean')

  /* interior */
  const door = await race(page.evaluate(() => {
    const l = (window as unknown as { __lkl?: { doors?: () => Array<{ id: string }>; enter?: (s: string) => void } }).__lkl
    const ds = l?.doors?.() ?? []
    if (ds.length) { const d = ds[Math.floor(ds.length / 2)]; l?.enter?.(d.id); return d.id }
    return null
  }), 6000, null)
  await page.waitForTimeout(3500)
  await race(page.screenshot({ path: `${SHOTS}/44-interior-clean.png` }), 8000, null)
  console.log('✓ interior', door)

  await browser.close()
}

run().then(() => {
  clearTimeout(watchdog)
  console.log(`\n=== PASS 4 DONE, ${errors.length} console errors ===`)
  process.exit(0)
}).catch((e) => { clearTimeout(watchdog); console.error('FATAL', e); process.exit(1) })
