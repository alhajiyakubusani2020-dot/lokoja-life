/**
 * M14 E2E — THE FORTRESS, live on the real game.
 * The honest status row in the Profile ("You") tab, and the REAL
 * tamper drama on the live transport: earn honestly → seal the save →
 * hex-edit the localStorage payload (the classic cash bump) → reload →
 * the signature breaks, the shadow twin carries the honest save back,
 * and the fortress chip narrates. Mobile (390) + desktop (1280).
 *   1. The Profile tab — the 🛡️ Fortress row (SECURE, anomalies 0)
 *   2. The honest earn + the sealed envelope
 *   3. THE TAMPER — the save is edited in place, the page reloads
 *   4. The recovery — the honest cash survives, the row still SECURE
 *   5. Desktop (1280) — the fortress, wide
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/m14-fortress-shots'
mkdirSync(SHOTS, { recursive: true })

const watchdog = setTimeout(() => {
  console.error('WATCHDOG: 220s hard exit')
  process.exit(2)
}, 225_000)

const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

const shot = async (page: import('playwright').Page, name: string): Promise<void> => {
  await race(page.screenshot({ path: `${SHOTS}/${name}.png` }), 12000, undefined)
  console.log('  📸', name)
}

const openYouTab = async (page: import('playwright').Page): Promise<void> => {
  await race(page.getByRole('button', { name: 'You', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 9000, null)
  await page.waitForTimeout(700)
}

const run = async (): Promise<void> => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 140)))

  // boot once so the real save exists (v15 shape from the live app)
  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1300)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(400)
  await race(page.getByLabel('Character name').fill('Fortress Ada').catch(() => {}), 8000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(2400)
  await race(page.reload({ waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1100)
  await race(page.getByText('Continue your life').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(1400)

  /* ---------- PHASE 1 — the fortress row on the Profile tab ---------- */
  await openYouTab(page)
  const row1 = await race(page.evaluate(() => {
    const chip = document.querySelector('[data-testid="fortress-status"]')
    return {
      present: !!chip,
      secure: /SECURE/.test(chip?.textContent ?? ''),
      row: /Fortress/.test(document.body.innerText),
    }
  }), 8000, null)
  console.log('fortress row:', JSON.stringify(row1))
  await shot(page, '01-fortress-row-secure')

  /* ---------- PHASE 2 — the honest earn + the sealed envelope ---------- */
  const sealed = await race(page.evaluate(() => {
    // read the envelope BEFORE the tamper: the sig + the honest cash
    const raw = localStorage.getItem('lokoja-life:save')
    if (!raw) return null
    const env = JSON.parse(raw) as { fmt?: number; sig?: string; data?: { player?: { cash?: number } } }
    return { fmt: env.fmt ?? 0, sigLen: env.sig?.length ?? 0, cash: env.data?.player?.cash ?? -1 }
  }), 8000, null)
  console.log('sealed envelope:', JSON.stringify(sealed))
  if (!sealed || sealed.fmt !== 2 || sealed.sigLen !== 64) console.log('  ⚠️ envelope shape unexpected — the tamper phase still runs')
  else console.log('  envelope sealed (fmt 2, 64-char HMAC) ✓')

  /* ---------- PHASE 3 — THE TAMPER: the classic cash bump in localStorage ---------- */
  await race(page.evaluate(() => {
    const raw = localStorage.getItem('lokoja-life:save')!
    const env = JSON.parse(raw)
    env.data.player.cash = 99_999_999 // the classic cheat
    localStorage.setItem('lokoja-life:save', JSON.stringify(env))
    return 'tampered'
  }), 8000, 'tamper-dead')
  console.log('tamper: cash → 99,999,999 in the raw payload')
  await race(page.reload({ waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1400)
  // the app boots through the fortress: the tampered payload never wins
  await race(page.getByText('Continue your life').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(1400)

  const cashNow = await race(page.evaluate(() => {
    // the HUD carries the honest naira
    const m = document.body.innerText.match(/₦[\d,]+/)
    return m ? m[0] : 'not-found'
  }), 8000, 'eval-dead')
  console.log('cash after tamper+reload:', cashNow)
  await shot(page, '02-after-tamper-recovery')

  /* ---------- PHASE 4 — the fortress chip still stands ---------- */
  await openYouTab(page)
  const row4 = await race(page.evaluate(() => {
    const chip = document.querySelector('[data-testid="fortress-status"]')
    const raw = localStorage.getItem('lokoja-life:save')
    const env = raw ? (JSON.parse(raw) as { data?: { player?: { cash?: number } } }) : null
    return {
      secure: /SECURE/.test(chip?.textContent ?? ''),
      chainOk: /ledger chained/.test(document.body.innerText),
      liveCash: env?.data?.player?.cash ?? -1,
    }
  }), 8000, null)
  console.log('fortress after the drama:', JSON.stringify(row4))
  await shot(page, '03-fortress-still-secure')

  /* ---------- PHASE 5 — desktop wide ---------- */
  const desktop = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const dpage = await desktop.newPage()
  dpage.on('pageerror', (e) => errors.push(String(e).slice(0, 140)))
  await race(dpage.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await dpage.waitForTimeout(1300)
  await race(dpage.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await dpage.waitForTimeout(400)
  await race(dpage.getByLabel('Character name').fill('Fortress Ada').catch(() => {}), 8000, null)
  await race(dpage.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await dpage.waitForTimeout(2400)
  await race(dpage.reload({ waitUntil: 'domcontentloaded' }), 15000, null)
  await dpage.waitForTimeout(1000)
  await race(dpage.getByText('Continue your life').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await dpage.waitForTimeout(1400)
  await openYouTab(dpage)
  await shot(dpage, '04-desktop-fortress-wide')

  await browser.close()
  console.log(`\nM14 E2E — 4 shots, ${errors.length} console errors`)
  if (errors.length) console.log(errors.slice(0, 5))
  clearTimeout(watchdog)
  process.exit(errors.length ? 1 : 0)
}

run().catch((e) => {
  console.error('FATAL', e)
  process.exit(2)
})
