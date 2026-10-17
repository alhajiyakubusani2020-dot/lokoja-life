/**
 * LOKOJA LIFE — M24-UI E2E: THE SOCIAL FACES WITNESS (fail-fast)
 * ---------------------------------------------------------------
 * Every critical navigation is a HARD step: if the expected face does
 * not appear, the script dies loudly with the page state — the silent
 * drift that shot-09 caught in the first draft can never lie again.
 *  01 landing   02 auth sheet   03 home   04 phone grid   05 wire
 *  06 dms       07 ringing      08 paddies 09 receipt     10 profile
 *  11 world rail 12 call banner 13 call pill 14 active face
 *  15 phone over world          16 food sheet
 * The demo ring rides the labeled __lkl door. FRESH context.
 * Run: E2E_BASE=http://localhost:3000 bun scripts/e2e-m24-ui.ts
 */
import { chromium, devices } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = process.env.E2E_BASE ?? 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/m24-ui-shots'
mkdirSync(SHOTS, { recursive: true })
const watchdog = setTimeout(() => { console.error('WATCHDOG'); process.exit(2) }, 560_000)
const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}
const allErrors: string[] = []
let shot = 0
const snap = async (page: import('playwright').Page, name: string): Promise<void> => {
  shot++
  await page.waitForTimeout(650)
  await page.screenshot({ path: `${SHOTS}/${String(shot).padStart(2, '0')}-${name}.png` })
  console.log(`  📸 ${String(shot).padStart(2, '0')}-${name}`)
}
/** HARD step: do it, then prove the destination. No silent drift. */
const step = async (name: string, fn: () => Promise<void>): Promise<void> => {
  try { await fn() } catch (e) {
    console.error(`STEP FAILED: ${name} — ${String(e).slice(0, 200)}`)
    clearTimeout(watchdog)
    process.exit(3)
  }
}
const settleWorld = async (page: import('playwright').Page): Promise<boolean> => {
  const t0 = Date.now()
  while (Date.now() - t0 < 70_000) {
    const ping = await race(page.evaluate(() => ({
      canvas: !!document.querySelector('canvas'),
      hook: !!(window as unknown as { __lkl?: unknown }).__lkl,
    })), 4000, { canvas: false, hook: false })
    if (ping.canvas && ping.hook) return true
    await page.waitForTimeout(900)
  }
  return false
}

const run = async (): Promise<void> => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const ctx = await browser.newContext({ ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => allErrors.push('pageerror: ' + String(e).slice(0, 140)))
  page.on('console', (m) => { if (m.type() === 'error') allErrors.push('console: ' + m.text().slice(0, 140)) })
  const HANDLE = `m24_${Date.now() % 100000}`

  /* 01 — the landing */
  await step('open landing', async () => {
    await page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded', timeout: 20_000 })
    await page.waitForSelector('[data-testid="menu-live-ribbon"]', { timeout: 15_000 })
  })
  await snap(page, 'landing')

  /* 02 — the auth sheet: CLAIM through the M9 door (hard) */
  await step('open auth sheet', async () => {
    await page.getByTestId('menu-auth-open').click({ timeout: 8_000 })
    await page.waitForSelector('[data-testid="menu-auth-sheet"]', { timeout: 8_000 })
  })
  await step('claim a fresh name', async () => {
    await page.getByTestId('auth-tab-claim').click({ timeout: 5_000 })
    await page.getByTestId('auth-handle').fill(HANDLE)
    await page.getByTestId('auth-pin').fill('2468')
    await page.getByTestId('auth-contact').fill(`m24_${Date.now() % 100000}@lokoja.life`)
  })
  await snap(page, 'auth-sheet')
  await step('submit the claim → creation appears', async () => {
    await page.getByTestId('auth-submit').click({ timeout: 8_000 })
    try {
      await page.waitForSelector('text=Enter your name to start', { timeout: 20_000 })
    } catch {
      const why = await page.getByTestId('auth-why').textContent().catch(() => null)
      throw new Error(`claim did not land — auth-why: ${why ?? 'none'}`)
    }
  })

  /* 03 — creation → home (hard) */
  await step('start life', async () => {
    await page.locator('input').first().fill('Adaeze')
    await page.getByRole('button', { name: /Start Life in Lokoja/i }).click({ timeout: 8_000 })
    await page.waitForSelector('[data-testid="goals-card"]', { timeout: 20_000 })
  })
  await snap(page, 'home')

  /* 04 — the phone grid with the five new tiles (hard) */
  await step('open the phone tab', async () => {
    await page.getByRole('button', { name: 'Phone', exact: true }).click({ timeout: 8_000 })
    await page.waitForSelector('text=Wetin dey happen', { timeout: 10_000 })
  })
  await snap(page, 'phone-grid')

  /* 05/06 — messages: wire + DMs (hard) */
  await step('open Messages', async () => {
    await page.getByText('Messages', { exact: true }).first().click({ timeout: 8_000 })
    await page.waitForSelector('[data-testid="messages-wire"], [data-testid="messages-locked"]', { timeout: 10_000 })
  })
  await snap(page, 'messages-wire')
  await step('open the DM tab', async () => {
    await page.getByRole('button', { name: /DMs/ }).first().click({ timeout: 8_000 })
    await page.waitForSelector('[data-testid="messages-dm-list"]', { timeout: 8_000 })
  })
  await snap(page, 'messages-dms')

  /* 07 — calls: a practice ring on Musa (hard) */
  await step('open Calls and dial Musa', async () => {
    await page.getByRole('button', { name: 'Back' }).first().click({ timeout: 6_000 })
    await page.getByText('Calls', { exact: true }).first().click({ timeout: 8_000 })
    await page.getByText('Street paddies').waitFor({ timeout: 10_000 })
    await page.getByText('Musa', { exact: true }).first().click({ timeout: 8_000 })
    await page.getByTestId('calls-dial-voice').click({ timeout: 8_000 })
    await page.waitForSelector('[data-testid="calls-screen-dialing"]', { timeout: 8_000 })
  })
  await snap(page, 'calls-ringing')
  await step('cancel the ring', async () => {
    await page.getByTestId('calls-cancel').click({ timeout: 8_000 })
    await page.getByTestId('calls-done').click({ timeout: 8_000 })
  })

  /* 08 — connect: add a paddy (hard) */
  await step('open Connect and add a paddy', async () => {
    await page.getByRole('button', { name: 'Back' }).first().click({ timeout: 6_000 })
    await page.getByText('Connect', { exact: true }).first().click({ timeout: 8_000 })
    await page.waitForSelector('[data-testid="connect-paddies"]', { timeout: 10_000 })
    await page.getByRole('button', { name: /Find/ }).click({ timeout: 8_000 })
    await page.waitForSelector('[data-testid="connect-find"]', { timeout: 8_000 })
    await page.getByTestId('connect-add-input').fill('ada_hustle')
    await page.getByTestId('connect-add-btn').click({ timeout: 8_000 })
  })
  await page.waitForTimeout(500)
  await snap(page, 'connect-paddies')

  /* 09 — wallet: the real outgoing engine + the receipt (hard) */
  await step('open Wallet and send to Musa', async () => {
    await page.getByRole('button', { name: 'Back' }).first().click({ timeout: 6_000 })
    await page.getByText('Wallet', { exact: true }).first().click({ timeout: 8_000 })
    await page.waitForSelector('[data-testid="wallet-who"]', { timeout: 10_000 })
    await page.getByText('Musa', { exact: true }).first().click({ timeout: 8_000 })
    await page.getByTestId('wallet-confirm').click({ timeout: 8_000 })
    await page.getByTestId('wallet-receipt').waitFor({ timeout: 8_000 }).catch(async () => {
      const broke = await page.getByText('you no carry').first().isVisible().catch(() => false)
      if (!broke) throw new Error('neither the receipt nor the honest broke notice appeared')
      console.log('  (honest broke notice shown — pocket too light, receipt skipped)')
    })
  })
  await snap(page, 'wallet-receipt')

  /* 10 — profile: save the face (hard) */
  await step('open Profile and save', async () => {
    await page.getByRole('button', { name: 'Back' }).first().click({ timeout: 6_000 })
    await page.getByText('Profile', { exact: true }).first().click({ timeout: 8_000 })
    await page.waitForSelector('[data-testid="profile-app"]', { timeout: 10_000 })
    await page.getByTestId('profile-name').fill('Ada O.')
    await page.getByTestId('profile-bio').fill('Hustler for the confluence city.')
    await page.getByTestId('profile-save').click({ timeout: 8_000 })
    await page.waitForSelector('text=Saved ✓', { timeout: 8_000 })
  })
  await snap(page, 'profile')

  /* 11 — the world: needs rail + FAB above the living city (hard) */
  await step('enter the world tab', async () => {
    await page.getByRole('button', { name: 'Back' }).first().click({ timeout: 6_000 })
    await page.getByRole('button', { name: 'World', exact: true }).click({ timeout: 8_000 })
    const ok = await settleWorld(page)
    if (!ok) throw new Error('the 3D world never settled')
    await page.waitForSelector('[data-testid="world-phone-fab"]', { timeout: 15_000 })
    await page.waitForSelector('[data-testid="hud-hunger"]', { timeout: 15_000 })
  })
  await page.waitForTimeout(1200)
  await snap(page, 'world-rail')

  /* 12/13 — the demo ring (labeled): banner → answer → pill (hard) */
  await step('fire the demo ring and answer', async () => {
    await page.evaluate(() => {
      const door = (window as unknown as { __lklSocial?: { incoming?: (p: string, v: boolean) => void } }).__lklSocial
      if (!door?.incoming) throw new Error('the __lklSocial demo door is not registered')
      door.incoming('Musa', false)
    })
    await page.waitForSelector('[data-testid="call-banner"]', { timeout: 8_000 })
  })
  await snap(page, 'call-banner')
  await step('answer → the active pill', async () => {
    await page.getByTestId('call-banner-answer').click({ timeout: 8_000 })
    await page.waitForSelector('[data-testid="call-pill"]', { timeout: 8_000 })
  })
  await snap(page, 'call-pill')

  /* 15 — the diegetic phone OPEN over the living world (hard) */
  await step('open the phone overlay', async () => {
    await page.getByTestId('world-phone-fab').click({ timeout: 8_000 })
    await page.waitForSelector('[data-testid="world-phone-overlay"]', { timeout: 8_000 })
  })
  await snap(page, 'phone-over-world')

  /* 14 — the active call face inside the handset (hard) */
  await step('open Calls inside the overlay', async () => {
    await page.getByText('Calls', { exact: true }).first().click({ timeout: 8_000 })
    await page.waitForSelector('[data-testid="calls-screen-active"]', { timeout: 8_000 })
  })
  await snap(page, 'call-active-face')
  await step('hang up from the face', async () => {
    await page.getByTestId('calls-hangup').click({ timeout: 8_000 })
    await page.getByTestId('calls-done').click({ timeout: 8_000 })
  })

  /* 16 — the food sheet through the REAL eatMeal door (hard) */
  await step('open the food sheet', async () => {
    await page.getByRole('dialog', { name: 'Your phone' }).click({ timeout: 8_000, position: { x: 10, y: 10 } })
    await page.waitForSelector('[data-testid="hud-hunger"]', { timeout: 8_000 })
    await page.getByTestId('hud-hunger').click({ timeout: 8_000 })
    await page.waitForSelector('text=Eat something', { timeout: 8_000 })
  })
  await snap(page, 'food-sheet')

  await browser.close()
  console.log(`\nSHOTS: ${shot}  CONSOLE/PAGE ERRORS: ${allErrors.length}`)
  for (const e of allErrors.slice(0, 10)) console.log('  ' + e)
  clearTimeout(watchdog)
  if (allErrors.length > 0) process.exit(1)
}

void run()
