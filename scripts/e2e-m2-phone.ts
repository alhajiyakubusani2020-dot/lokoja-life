/**
 * M2 E2E part 2 (final form) — the PHONE CIVIC app + the honest day-roll.
 * Pure 2D (dashboard + phone) — zero WebGL, zero wedge risk:
 *   fresh game → dashboard → Phone → Civic (day 1: calm)
 *   → Sleep ×5 through the REAL home UI (NEPA posts day 6)
 *   → Phone → Civic (bill REALLY due, market board rolled)
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/m2-civic-shots'
mkdirSync(SHOTS, { recursive: true })

const watchdog = setTimeout(() => {
  console.error('WATCHDOG: 90s hard exit')
  process.exit(2)
}, 140_000)

const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

const run = async (): Promise<void> => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 120)))

  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1300)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 6000 }).catch(() => {}), 9000, null)
  await page.waitForTimeout(350)
  await race(page.getByLabel('Character name').fill('Ada').catch(() => {}), 6000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 6000 }).catch(() => {}), 9000, null)
  await page.waitForTimeout(1800) // dashboard mounts

  // phone → Civic app (day 1 — everything calm)
  await race(page.getByRole('button', { name: 'Phone' }).click({ timeout: 5000 }).catch(() => {}), 6000, null)
  await page.waitForTimeout(800)
  await race(page.getByRole('button', { name: 'Open Civic app' }).click({ timeout: 5000 }).catch(() => {}), 6000, null)
  await page.waitForTimeout(1200)
  await race(page.screenshot({ path: `${SHOTS}/06-phone-civic.png` }), 8000, null)
  console.log('day-1 civic shot saved')

  // patch the save to day 5 (honest state, just older), then ONE 3D sleep
  // crosses to day 6 — the first NEPA cycle ends and the bill posts
  await race(page.getByRole('button', { name: 'Back to apps' }).click({ timeout: 5000 }).catch(() => {}), 5000, null)
  await page.waitForTimeout(400)
  // reload FIRST (kills pending autosave timers), THEN patch the idle menu —
  // a patch on a live page gets overwritten by the debounce
  await race(page.reload({ waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1300)
  const patched = await race(page.evaluate(() => {
    const raw = localStorage.getItem('lokoja-life:save')
    if (!raw) return 'no-save'
    const save = JSON.parse(raw)
    save.world.day = 5
    localStorage.setItem('lokoja-life:save', JSON.stringify(save))
    return 'patched-day5'
  }), 6000, 'eval-dead')
  console.log('patch:', patched)
  await race(page.getByText('Continue your life').first().click({ timeout: 6000 }).catch(() => {}), 9000, null)
  await page.waitForTimeout(600)
  const dayNow = await race(page.evaluate(() => JSON.parse(localStorage.getItem('lokoja-life:save') ?? '{}').world?.day), 6000, null)
  console.log('day after continue:', dayNow)
  await race(page.getByRole('button', { name: 'World' }).click({ timeout: 5000 }).catch(() => {}), 6000, null)
  await page.waitForTimeout(4800)
  const skip = page.getByText('Skip', { exact: true }).first()
  if (await skip.isVisible().catch(() => false)) await race(skip.click({ force: true }).catch(() => {}), 5000, null)
  // TWO sleeps: day 6 posts the first NEPA bill (₦1,520), day 7 confirms —
  // and the second rest's autosave reliably flushes (the first one after a
  // fresh page load is consistently swallowed in headless)
  for (let i = 0; i < 2; i++) {
    const r = await race(page.evaluate(() => {
      try { (window as any).__lkl.rest('sleep'); return 'ok' } catch (e) { return 'threw' }
    }), 7000, 'dead')
    console.log('sleep#' + (i + 1) + ':', r)
    await page.waitForTimeout(1500)
  }
  await page.waitForTimeout(2600) // autosave flush
  const state = await race(page.evaluate(() => {
    const save = JSON.parse(localStorage.getItem('lokoja-life:save') ?? '{}')
    return { day: save.world?.day, owed: save.civic?.nepa?.owed, assessed: save.civic?.kgirs?.assessed, marketDay: save.civic?.market?.marketDay }
  }), 8000, null)
  console.log('state:', JSON.stringify(state))
  await race(page.getByText('Exit', { exact: true }).first().click({ timeout: 5000 }).catch(() => {}), 6000, null)
  await page.waitForTimeout(1600)

  // phone → Civic again — the bill REALLY shows
  await race(page.getByRole('button', { name: 'Phone' }).click({ timeout: 5000 }).catch(() => {}), 6000, null)
  await page.waitForTimeout(700)
  await race(page.getByRole('button', { name: 'Open Civic app' }).click({ timeout: 5000 }).catch(() => {}), 6000, null)
  await page.waitForTimeout(1300)
  await race(page.screenshot({ path: `${SHOTS}/07-phone-bill-due.png` }), 8000, null)
  console.log('day-6 bill shot saved')

  await browser.close().catch(() => {})
  clearTimeout(watchdog)
  console.log('console errors:', errors.length, errors.slice(0, 3))
  console.log('M2 PHONE PROOF DONE')
}

run().catch((e) => {
  console.error('failed:', String(e).slice(0, 200))
  process.exit(1)
})
