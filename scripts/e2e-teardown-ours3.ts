/**
 * TEARDOWN PASS 3 — INTERIORS on desktop 1280×800 (FRESH-CONTEXT law:
 * new browser context = new GL context; interiors photograph badly on
 * phone viewports). Walk the world, pick a real door from __lkl.doors(),
 * enter it, shoot the inside. Proves the thing Lagos Life doesn't have:
 * you WALK a 3D city and walk INTO its buildings.
 * Run: bun scripts/e2e-teardown-ours3.ts
 */
import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'fs'

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
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const page = await ctx.newPage()
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 180)) })
  page.on('pageerror', (e) => errors.push('pageerror: ' + String(e).slice(0, 180)))

  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 20_000, null)
  await page.waitForTimeout(1800)
  /* fresh context = empty localStorage = no save: ALWAYS create the life */
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  await race(page.getByLabel('Character name').fill('Tear Down'), 8000, null)
  const cont = await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 9000 }).then(() => true).catch(() => false), 10_000, false)
  console.log('life started:', cont)
  await page.waitForTimeout(2200)
  const world = await race(page.getByRole('button', { name: /^world$/i }).first().click({ timeout: 8000 }).then(() => true).catch(() => false), 10_000, false)
  console.log('World tab clicked:', world)
  /* headless SwiftShader needs the known ~30s settle window (m7 law) */
  let settled = false
  for (let i = 0; i < 14; i++) {
    settled = await race(page.evaluate(() => {
      const l = (window as unknown as { __lkl?: { doors?: () => unknown[] } }).__lkl
      return !!l?.doors && l.doors().length > 0
    }), 4000, false)
    if (settled) break
    await page.waitForTimeout(2000)
  }
  console.log('world settled with doors:', settled)

  /* choose the door of Kpata Market region — honestly: first door the API offers */
  const door = await race(page.evaluate(() => {
    const l = (window as unknown as { __lkl?: { doors?: () => Array<{ id: string; x: number; z: number }> } }).__lkl
    const ds = l?.doors?.() ?? []
    return ds.length ? ds[Math.floor(ds.length / 2)] : null
  }), 6000, null)
  console.log('door picked:', JSON.stringify(door))
  if (door) {
    await race(page.screenshot({ path: `${SHOTS}/40-exterior-street.png` }), 8000, null)
    const entered = await race(page.evaluate((id) => {
      const l = (window as unknown as { __lkl?: { enter?: (s: string) => void } }).__lkl
      if (l?.enter) { l.enter(id); return true }
      return false
    }, door.id), 6000, false)
    await page.waitForTimeout(3500)
    const interior = await race(page.evaluate(() => {
      const l = (window as unknown as { __lkl?: { interior?: () => unknown; scene?: () => unknown } }).__lkl
      return l?.interior ? JSON.stringify(l.interior()).slice(0, 300) : '(no interior api)'
    }), 6000, null)
    console.log('entered:', entered, 'interior truth:', interior)
    await race(page.screenshot({ path: `${SHOTS}/41-interior.png` }), 8000, null)
  }
  await browser.close()
}

run().then(() => {
  clearTimeout(watchdog)
  writeFileSync(`${SHOTS}/transcript3.json`, JSON.stringify({ errors }, null, 2))
  console.log(`\n=== PASS 3 DONE, ${errors.length} console errors ===`)
  process.exit(0)
}).catch((e) => { clearTimeout(watchdog); console.error('FATAL', e); process.exit(1) })
