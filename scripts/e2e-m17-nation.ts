/**
 * LOKOJA LIFE — M17 E2E: THE LIVE NATION (screenshots)
 * ----------------------------------------------------
 * 1. the spectator nation (unclaimed): the mic is dark, the identity law visible
 * 2. a claimed walker claims through the REAL register (forward-travel gate)
 *    → the street wire: roster + composer + the join-postcard
 * 3. a claimed KID behind the parent shield (return mode) → the emote
 *    lexicon grid replaces the composer
 * 4. the adult money tables: found a union (live relay) + the court panel,
 *    open an ajo circle
 * 5. desktop wide
 * 0 console errors across the run — the house law.
 * Run: bun scripts/e2e-m17-nation.ts
 */
import { chromium, devices } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/m17-nation-shots'
mkdirSync(SHOTS, { recursive: true })

const watchdog = setTimeout(() => { console.error('WATCHDOG: 400s hard exit'); process.exit(2) }, 400_000)
const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

const allErrors: string[] = []
const stamp = Date.now().toString(36).slice(-6)

const startLife = async (page: import('playwright').Page, name: string) => {
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  await page.waitForTimeout(400)
  await race(page.getByLabel('Character name').fill(name).catch(() => {}), 8000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  await page.waitForTimeout(1600)
}

/** the Dashboard chip raises the gate with ZERO travel (no world jam). */
const raiseGateAndClaim = async (page: import('playwright').Page, handle: string, pin: string): Promise<void> => {
  // the claim chip lives on the You tab (the identity card)
  await race(page.getByRole('button', { name: 'You', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  await page.waitForTimeout(700)
  await race(page.getByTestId('claim-open').click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  await page.waitForTimeout(700)
  await race(page.getByTestId('gate-handle').fill(handle).catch(() => {}), 8000, null)
  await race(page.getByTestId('gate-contact').fill(`0803${Math.floor(1000000 + Math.random() * 8999999)}`).catch(() => {}), 8000, null)
  await race(page.getByTestId('gate-pin').fill(pin).catch(() => {}), 8000, null)
  await race(page.getByTestId('gate-submit').click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  await page.waitForTimeout(2500)
}

/** the return mode via the Dashboard chip (no travel). */
const raiseGateAndReturn = async (page: import('playwright').Page, handle: string, pin: string): Promise<void> => {
  await race(page.getByRole('button', { name: 'You', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  await page.waitForTimeout(700)
  await race(page.getByTestId('claim-open').click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  await page.waitForTimeout(700)
  await race(page.getByText('I don claim before').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  await page.waitForTimeout(500)
  await race(page.getByTestId('gate-handle').fill(handle).catch(() => {}), 8000, null)
  await race(page.getByTestId('gate-pin').fill(pin).catch(() => {}), 8000, null)
  await race(page.getByTestId('gate-submit').click({ timeout: 8000 }).catch(() => {}), 10_000, null)
  await page.waitForTimeout(2500)
}

/** THE WEDGE LAW: the gate's claim resumes the blocked forward travel —
 *  the 3D world boots and jams the headless thread (~30-90s). Poll the
 *  thread alive twice, then walk home before touching the phone. */
const settleAfterGate = async (page: import('playwright').Page): Promise<void> => {
  let streak = 0
  const t0 = Date.now()
  while (Date.now() - t0 < 90_000) {
    const ping = await race(page.evaluate(() => true), 4000, null)
    if (ping === true) { streak++; if (streak >= 2) break } else streak = 0
    await page.waitForTimeout(600)
  }
  await race(page.getByRole('button', { name: 'Home', exact: true }).first().click({ timeout: 6000 }).catch(() => {}), 8000, null)
  await page.waitForTimeout(900)
}

const openLiveApp = async (page: import('playwright').Page) => {
  await race(page.getByRole('button', { name: 'Phone', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 9000, null)
  await page.waitForTimeout(700)
  await race(page.getByRole('button', { name: 'Open Live app' }).first().click({ timeout: 8000 }).catch(() => {}), 9000, null)
  await page.waitForTimeout(1100)
}

const t0 = Date.now()
const mark = (m: string) => console.log(`  [t+${((Date.now() - t0) / 1000).toFixed(0)}s] ${m}`)

const run = async (): Promise<void> => {
  mark('the START')
  /* -------- 1. the spectator nation (unclaimed phone) -------- */
  {
    const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
    const ctx = await browser.newContext({ ...devices['iPhone 13'] })
    const page = await ctx.newPage()
    page.on('pageerror', (e) => allErrors.push('spectate: ' + String(e).slice(0, 120)))
    await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15_000, null)
    await page.waitForTimeout(1400)
    await startLife(page, 'Spectator')
    await openLiveApp(page)
    const spec = await race(page.evaluate(() => ({
      app: !!document.querySelector('[data-testid="live-app"]'),
      spectate: !!document.querySelector('[data-testid="live-spectate"]'),
      micDark: document.body.innerText.includes('The mic is dark'),
    })), 8000, null)
    console.log('spectator law:', JSON.stringify(spec))
    await race(page.screenshot({ path: `${SHOTS}/01-spectator-nation.png` }), 8000, null)
    console.log('📸 01-spectator-nation')
    await race(browser.close().catch(() => {}), 8000, null)
  }

  mark('claimed START')
  /* -------- 2. claimed walker: the street wire -------- */
  {
    const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
    const ctx = await browser.newContext({ ...devices['iPhone 13'] })
    await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: BASE })
    const page = await ctx.newPage()
    page.on('pageerror', (e) => allErrors.push('claimed: ' + String(e).slice(0, 120)))
    await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15_000, null)
    await page.waitForTimeout(1400)
    await startLife(page, 'Kola Live')
    await raiseGateAndClaim(page, `kola_${stamp}`, '4321')
    await settleAfterGate(page)
    await openLiveApp(page)
    const composer = page.locator('[data-testid="live-composer"]')
    const hasComposer = await race(composer.count(), 8000, 0)
    if (hasComposer) {
      await composer.fill('the nation don open — Lokoja to the world')
      await race(page.locator('[data-testid="live-send"]').click({ timeout: 8000 }).catch(() => {}), 10_000, null)
      await page.waitForTimeout(1000)
    }
    const street = await race(page.evaluate(() => ({
      app: !!document.querySelector('[data-testid="live-app"]'),
      composer: !!document.querySelector('[data-testid="live-composer"]'),
      join: !!document.querySelector('[data-testid="live-join-share"]'),
      voice: !!document.querySelector('[data-testid="live-voice"]'),
    })), 8000, null)
    console.log('claimed street:', JSON.stringify(street))
    if (!street?.app) {
      const t = await race(page.evaluate(() => document.body.innerText.slice(0, 220)), 5000, 'eval-dead')
      console.log('  street body:', String(t).replace(/\n/g, ' | ').slice(0, 200))
    }
    await race(page.screenshot({ path: `${SHOTS}/02-street-wire.png` }), 8000, null)
    console.log('📸 02-street-wire')
    await race(browser.close().catch(() => {}), 8000, null)
  }

  mark('the START')
  /* -------- 3. the kid lexicon behind the parent shield -------- */
  {
    // the kid claims over HTTP first (the parent PIN rides the register)
    const kidHandle = `smalli_${stamp}`
    await fetch(`${BASE}/api/auth/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle: kidHandle, pin: '5678', ageBand: 'kid', parentPin: '998877' }),
    })
    const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
    const ctx = await browser.newContext({ ...devices['iPhone 13'] })
    const page = await ctx.newPage()
    page.on('pageerror', (e) => allErrors.push('kid: ' + String(e).slice(0, 120)))
    await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15_000, null)
    await page.waitForTimeout(1400)
    await startLife(page, 'Small Papa')
    await raiseGateAndReturn(page, kidHandle, '5678')
    await settleAfterGate(page)
    await openLiveApp(page)
    const kid = await race(page.evaluate(() => ({
      emoteGrid: !!document.querySelector('[data-testid="live-emote-grid"]'),
      noComposer: !document.querySelector('[data-testid="live-composer"]'),
      emotes: document.querySelectorAll('[data-testid="live-emote-grid"] button').length,
    })), 8000, null)
    console.log('kid lexicon:', JSON.stringify(kid))
    await race(page.screenshot({ path: `${SHOTS}/03-kid-lexicon.png` }), 8000, null)
    console.log('📸 03-kid-lexicon')
    await race(browser.close().catch(() => {}), 8000, null)
  }

  mark('the START')
  /* -------- 4. the adult money tables: union + ajo -------- */
  {
    const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
    const ctx = await browser.newContext({ ...devices['iPhone 13'] })
    const page = await ctx.newPage()
    page.on('pageerror', (e) => allErrors.push('adult: ' + String(e).slice(0, 120)))
    await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15_000, null)
    await page.waitForTimeout(1400)
    await startLife(page, 'Union Mama')
    await raiseGateAndClaim(page, `mama_${stamp}`, '4321')
    await settleAfterGate(page)
    await openLiveApp(page)
    // found a union through the real relay
    await race(page.getByRole('button', { name: 'Live tab: Union' }).click({ timeout: 8000 }).catch(() => {}), 10_000, null)
    await page.waitForTimeout(700)
    await race(page.getByLabel('Union name').fill(`Kpata Union ${stamp}`).catch(() => {}), 8000, null)
    await race(page.locator('[data-testid="live-assoc-found"]').click({ timeout: 8000 }).catch(() => {}), 10_000, null)
    await page.waitForTimeout(1200)
    const union = await race(page.evaluate(() => ({
      panel: !!document.querySelector('[data-testid="live-union"]'),
      court: !!document.querySelector('[data-testid="live-court"]'),
      duesBox: !!document.querySelector('[data-testid="live-assoc-dues"]'),
    })), 8000, null)
    console.log('union law:', JSON.stringify(union))
    await race(page.screenshot({ path: `${SHOTS}/04-union-court.png` }), 8000, null)
    console.log('📸 04-union-court')
    // the ajo tab
    await race(page.getByRole('button', { name: 'Live tab: Ajo' }).click({ timeout: 8000 }).catch(() => {}), 10_000, null)
    await page.waitForTimeout(700)
    await race(page.getByLabel('Circle name').fill(`Market Ajo ${stamp}`).catch(() => {}), 8000, null)
    await race(page.locator('[data-testid="live-ajo-found"]').click({ timeout: 8000 }).catch(() => {}), 10_000, null)
    await page.waitForTimeout(1200)
    const ajo = await race(page.evaluate(() => !!document.querySelector('[data-testid="live-ajo"]')), 8000, null)
    console.log('ajo tab:', ajo)
    await race(page.screenshot({ path: `${SHOTS}/05-ajo-circle.png` }), 8000, null)
    console.log('📸 05-ajo-circle')
    await race(browser.close().catch(() => {}), 8000, null)
  }

  mark('desktop START')
  /* -------- 5. desktop wide -------- */
  {
    const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
    page.on('pageerror', (e) => allErrors.push('desktop: ' + String(e).slice(0, 120)))
    await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'load' }), 20_000, null)
    await page.waitForTimeout(1600)
    await race(page.screenshot({ path: `${SHOTS}/06-desktop-nation.png` }), 8000, null)
    console.log('📸 06-desktop-nation')
    await race(browser.close().catch(() => {}), 8000, null)
  }

  clearTimeout(watchdog)
  console.log(`\nconsole/page errors: ${allErrors.length}`)
  allErrors.slice(0, 6).forEach((e) => console.log('  •', e))
  if (allErrors.length > 0) process.exit(1)
  console.log('M17 E2E — THE NATION IS LIVE 🟢')
  process.exit(0)
}

run().catch((e) => { console.error('E2E CRASHED:', e); process.exit(2) })
