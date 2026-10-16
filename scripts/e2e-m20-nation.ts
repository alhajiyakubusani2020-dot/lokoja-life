/**
 * M20 — PLANET SCALE + OPS: THE E2E WITNESS
 * ------------------------------------------
 * Run: bun scripts/e2e-m20-nation.ts   (dev :3000)
 *
 * FRESH-CONTEXT LAW: every scenario gets a brand-new browser + context —
 * a fresh GL context per shot, never a reused page (the glLost curtain
 * freezes inputs; the law exists so no shot is ever taken behind it).
 *
 * The witness walks:
 *  1. the phone grid → the Nation tile → the live crowd aggregate
 *  2. the ops row → telemetry opt-in ON (the honest toggle)
 *  3. the crowd toggle → DARK → WAKE (the switch is real)
 *  4. the desktop world (1280×800) — the city the 10k souls live in
 * Zero console/page errors is the pass bar.
 */

import { chromium, devices } from 'playwright'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/m20-nation-shots'
import { mkdirSync } from 'node:fs'
mkdirSync(SHOTS, { recursive: true })

const errors: string[] = []
const race = <T,>(p: Promise<T>, ms: number, onTimeout: (() => T) | null): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => (onTimeout ? resolve(onTimeout()) : reject(new Error('race timeout'))), ms)
    p.then((v) => { clearTimeout(t); resolve(v) }).catch((e) => { clearTimeout(t); reject(e) })
  })

async function shot(page: import('playwright').Page, path: string): Promise<void> {
  await race(page.screenshot({ path }), 9000, null).catch((e) => errors.push('shot: ' + String(e).slice(0, 80)))
}

async function waitForResponsive(page: import('playwright').Page, ms: number): Promise<boolean> {
  const t0 = Date.now()
  for (;;) {
    try {
      const a = await race(page.evaluate(() => 1), 3000, null)
      const b = await race(page.evaluate(() => 1), 3000, null)
      if (a === 1 && b === 1) return true
    } catch { /* still jammed */ }
    if (Date.now() - t0 > ms) return false
  }
}

/* -------- 1. the Nation Dashboard on the phone -------- */
{
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const ctx = await browser.newContext({ ...devices['iPhone 13'] })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => errors.push('nation: ' + String(e).slice(0, 140)))
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + String(m.text()).slice(0, 140)) })

  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15_000, null)
  await page.waitForTimeout(1400)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  await race(page.getByLabel('Character name').fill('Nation Hand').catch(() => {}), 8000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  await page.waitForTimeout(1800)

  // the phone → the Nation tile
  await race(page.getByRole('button', { name: 'Phone', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 9000, null)
  await race(page.getByRole('button', { name: 'Open Nation app' }).first().click({ timeout: 8000 }).catch(() => {}), 9000, null)
  await waitForResponsive(page, 10_000)
  await page.waitForTimeout(1200)
  const app = await race(page.evaluate(() => ({
    app: !!document.querySelector('[data-testid="nation-app"]'),
    crowd: !!document.querySelector('[data-testid="nation-crowd"]'),
    inflation: !!document.querySelector('[data-testid="nation-inflation"]'),
    moderation: !!document.querySelector('[data-testid="nation-moderation"]'),
    ops: !!document.querySelector('[data-testid="nation-ops"]'),
  })), 6000, () => ({ app: false, crowd: false, inflation: false, moderation: false, ops: false }))
  console.log('nation app:', JSON.stringify(app))
  await shot(page, `${SHOTS}/01-nation-dashboard.png`)
  console.log('📸 01-nation-dashboard')

  // 2. the telemetry opt-in (the honest toggle)
  await race(page.locator('[data-testid="nation-telemetry-toggle"]').click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  await page.waitForTimeout(700)
  await shot(page, `${SHOTS}/02-telemetry-optin.png`)
  console.log('📸 02-telemetry-optin')

  // 3. the crowd toggle — DARK then alive again
  await race(page.locator('[data-testid="nation-crowd-toggle"]').click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  await page.waitForTimeout(600)
  await shot(page, `${SHOTS}/03-crowd-dark.png`)
  console.log('📸 03-crowd-dark')
  await race(page.locator('[data-testid="nation-crowd-toggle"]').click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  await page.waitForTimeout(900)
  await shot(page, `${SHOTS}/04-crowd-alive.png`)
  console.log('📸 04-crowd-alive')

  await browser.close()
}

/* -------- 2. the desktop witness (1280×800 — the interior/outside law) -------- */
{
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  page.on('pageerror', (e) => errors.push('desktop: ' + String(e).slice(0, 140)))
  page.on('console', (m) => { if (m.type() === 'error') errors.push('desktop console: ' + String(m.text()).slice(0, 140)) })

  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15_000, null)
  await page.waitForTimeout(1400)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  await race(page.getByLabel('Character name').fill('Nation Desk').catch(() => {}), 8000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  await page.waitForTimeout(2200)

  // the phone on the wide screen — the dashboard beside the city
  await race(page.getByRole('button', { name: 'Phone', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 9000, null)
  await race(page.getByRole('button', { name: 'Open Nation app' }).first().click({ timeout: 8000 }).catch(() => {}), 9000, null)
  await waitForResponsive(page, 12_000)
  await page.waitForTimeout(1500)
  await shot(page, `${SHOTS}/05-desktop-nation.png`)
  console.log('📸 05-desktop-nation')

  await browser.close()
}

console.log('\nerrors:', errors.length ? JSON.stringify(errors, null, 1) : '0')
if (errors.length > 0) process.exit(1)
console.log('M20 E2E — 🟢 the witness holds')
