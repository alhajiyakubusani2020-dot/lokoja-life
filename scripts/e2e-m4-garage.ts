/**
 * M4 E2E — THE GARAGE + REAL-DEVICE FPS CAPTURE, live on the real game.
 * Save-patch carries Ada to Level 5 with ₦500k and an okada in the garage:
 *   1. Map screen — 🔧 garage dot on Motor Park + "Your rides" strip + legend
 *   2. Ganaja sheet — the gold "Your Okada · fuel · no fare" travel row
 *   3. Fuel trip — arrives, ledger records "Fuel — Okada…", map updates
 *   4. 3D world at the Motor Park — Vehicle Shop pill → garage with Sell row
 *   5. PerfChip — live fps pill → panel → Capture 5s → report (real-device
 *      capture surface, works in production) + __lkl.fpsReport()
 * Every CDP call raced; 165s watchdog; the 3D leg runs LAST (wedge window).
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/m4-garage-shots'
mkdirSync(SHOTS, { recursive: true })

const watchdog = setTimeout(() => {
  console.error('WATCHDOG: 165s hard exit')
  process.exit(2)
}, 180_000)

const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

const run = async (): Promise<void> => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 140)))

  // 1. fresh game → autosave → reload → patch the IDLE menu page
  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1400)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(350)
  await race(page.getByLabel('Character name').fill('Ada').catch(() => {}), 8000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(2600)
  await race(page.reload({ waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1200)
  const patch = await race(page.evaluate(() => {
    const raw = localStorage.getItem('lokoja-life:save')
    if (!raw) return 'no-save'
    const save = JSON.parse(raw)
    save.version = 5
    save.player.level = 5
    save.player.cash = 500000
    save.player.needs.energy = 100
    save.player.vehicles = [{
      id: 'okada-e2e', model: 'okada', plate: 'LKO-419-AA', boughtDay: save.world.day,
    }]
    save.world.currentLocation = 'home'
    localStorage.setItem('lokoja-life:save', JSON.stringify(save))
    return 'patched'
  }), 8000, 'eval-dead')
  console.log('save patch:', patch)

  // 2. continue → Map tab — garage dot + rides strip + legend
  await race(page.getByText('Continue your life').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(800)
  await race(page.getByRole('button', { name: 'Map', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(900)
  const mapLayer = await race(page.evaluate(() => ({
    garageDot: !!document.querySelector('[data-testid="map-garage-dot"]'),
    rides: document.querySelector('[data-testid="map-rides"]')?.textContent?.slice(0, 80) ?? null,
    legend: document.body.innerText.includes('Motor Park garage sells rides'),
  })), 8000, null)
  console.log('map layer:', JSON.stringify(mapLayer))
  await race(page.screenshot({ path: `${SHOTS}/01-map-garage.png` }), 8000, null)

  // 3. open Ganaja Junction — the gold "Your Okada" row rides beside public fares
  const clicked = await race(page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('button[aria-label]'))
      .find((b) => (b.getAttribute('aria-label') ?? '').startsWith('Ganaja Junction')) as HTMLButtonElement | null
    if (!el) return 'no-marker'
    el.click()
    return 'clicked'
  }), 8000, 'eval-dead')
  console.log('ganaja marker:', clicked)
  await page.waitForTimeout(800)
  const hasOwnRow = await race(page.evaluate(() => {
    const t = document.body.innerText.toLowerCase()
    return t.includes('your okada') && t.includes('no fare')
  }), 6000, false)
  console.log('your-okada row visible:', hasOwnRow)
  await race(page.evaluate(() => {
    const scroller = document.querySelector('.lko-sheet .overflow-y-auto') as HTMLElement | null
      ?? (document.querySelector('[role="dialog"] > div > div') as HTMLElement | null)
    if (scroller) scroller.scrollTop = scroller.scrollHeight + 200
  }), 6000, null)
  await page.waitForTimeout(700)
  await race(page.screenshot({ path: `${SHOTS}/02-your-okada-row.png` }), 8000, null)

  // 4. take the fuel trip (850ms transition) — ledger records FUEL
  await race(page.locator('button:has-text("fuel · no fare")').first().click({ timeout: 6000 }).catch(() => {}), 8000, null)
  await page.waitForTimeout(2600)
  const trip = await race(page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('lokoja-life:save') ?? '{}')
    return {
      at: s?.world?.currentLocation ?? null,
      fuelTx: s?.player?.transactions?.find((t: { label?: string }) => (t.label ?? '').startsWith('Fuel — Okada')) ?? null,
      vehicles: s?.player?.vehicles?.length ?? 0,
    }
  }), 8000, null)
  console.log('fuel trip:', JSON.stringify(trip))
  await race(page.screenshot({ path: `${SHOTS}/03-arrived-by-okada.png` }), 8000, null)

  // 5. 3D world at the Motor Park: spawn there, Vehicle Shop pill → garage + Sell
  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1400)
  const patch2 = await race(page.evaluate(() => {
    const raw = localStorage.getItem('lokoja-life:save')
    if (!raw) return 'no-save'
    const save = JSON.parse(raw)
    save.world.currentLocation = 'transport-area'
    localStorage.setItem('lokoja-life:save', JSON.stringify(save))
    return 'patched'
  }), 8000, 'eval-dead')
  console.log('spawn patch:', patch2)
  await race(page.getByText('Continue your life').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(800)
  await race(page.getByRole('button', { name: 'World', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  // the 3D world builds slowly under SwiftShader — poll for the HUD itself
  // (the veil drops at the first rendered frame; the chip rides the HUD)
  let hudReady = false
  for (let i = 0; i < 25 && !hudReady; i++) {
    hudReady = await race(page.evaluate(() => !!document.querySelector('[data-testid="perf-chip"]')), 5000, false)
    if (!hudReady) await page.waitForTimeout(2500)
  }
  console.log('world hud ready:', hudReady)
  await page.waitForTimeout(1500)

  // diagnostic — where did we spawn?
  const p0 = await race(page.evaluate(() => (window as unknown as { __lkl: { pos: () => { x: number; z: number } } }).__lkl.pos()), 5000, null)
  console.log('spawn pos:', JSON.stringify(p0))

  // --- REAL-DEVICE FPS CAPTURE FIRST (browser at its freshest) ---
  // DOM-level click — the M3 lesson: animated HUD overlays eat coordinate clicks
  await race(page.evaluate(() => (document.querySelector('[data-testid="perf-chip"]') as HTMLElement | null)?.click()), 6000, null)
  await page.waitForTimeout(900)
  const panelOpen = await race(page.evaluate(() => !!document.querySelector('[data-testid="perf-panel"]')), 6000, false)
  console.log('perf panel open:', panelOpen)
  await race(page.screenshot({ path: `${SHOTS}/05-perf-panel.png` }), 8000, null)
  await race(page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    btns.find((b) => b.textContent?.trim() === 'Capture 5s')?.click()
  }), 6000, null)
  await page.waitForTimeout(9500) // capture = 5s + up to ~2.5s for the next software frame to render it
  const report = await race(page.evaluate(() => document.querySelector('[data-testid="perf-report"]')?.textContent ?? null), 8000, null)
  console.log('fps report (panel):\n' + (report ?? 'NO REPORT'))
  await race(page.screenshot({ path: `${SHOTS}/06-fps-captured.png` }), 8000, null)
  // close the panel so it can't eat the Vehicle Shop click
  await race(page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    btns.find((b) => b.textContent?.trim() === 'close')?.click()
  }), 6000, null)
  await page.waitForTimeout(600)

  // --- the garage: spawn is 6.4u from the anchor, INSIDE SHOP_RADIUS (28),
  // so the Vehicle Shop pill rides the HUD — open it at the DOM level
  const pill = await race(page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const pill = btns.find((b) => (b.textContent ?? '').includes('Vehicle Shop'))
    if (!pill) return 'no-pill'
    pill.click()
    return 'clicked'
  }), 8000, 'eval-dead')
  console.log('vehicle shop pill:', pill)
  await page.waitForTimeout(900)
  const garage = await race(page.evaluate(() => {
    const t = document.body.innerText.toLowerCase()
    return {
      sell: t.includes('sells for'),
      ride: t.includes('okada (motorcycle)'),
      fuelLaw: t.includes('your rides run on fuel'),
    }
  }), 8000, null)
  console.log('garage panel:', JSON.stringify(garage))
  await race(page.screenshot({ path: `${SHOTS}/04-garage-sell.png` }), 8000, null)

  // the E2E hook path — same builder, fresh sample window
  const hookReport = await race(page.evaluate(() => (window as unknown as { __lkl?: { fpsReport?: (ms?: number) => Promise<string> } }).__lkl?.fpsReport?.(2500) ?? 'no-hook'), 12000, 'hook-timeout')
  console.log('fps report (hook):\n' + String(hookReport).split('\n').slice(0, 5).join('\n'))

  console.log('\nconsole errors:', errors.length ? errors : 'NONE')
  await browser.close()
  clearTimeout(watchdog)
  if (errors.length > 0) process.exit(1)
}

run().catch((e) => {
  console.error('FATAL', e)
  process.exit(2)
})
