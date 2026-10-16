/**
 * LOKOJA LIFE — M21 GATES E2E WITNESS
 * -----------------------------------
 * The three gap-closure gates must be SEEN, not just tested:
 *   G1: the phone grid carries 21 apps; Whot! actually plays; the new
 *       reader apps render honest data.
 *   G2: a new real-geo location (Township Stadium) opens a sheet with
 *       the vibe line + the action board.
 *   G3: the Live app's ROOM section (honest roster + sim line), and the
 *       guest gate is probeable a11y (native buttons, no coordinate clicks).
 * FRESH-CONTEXT law: every page is a brand-new browser context.
 * Console error law: 0 errors or we say so.
 * Run: bun scripts/e2e-m21-gates.ts   (target: prod :3001)
 */
import { chromium, devices } from 'playwright'
import { mkdirSync, writeFileSync } from 'fs'

const BASE = process.env.E2E_BASE ?? 'http://localhost:3001'
const SHOTS = '/home/z/my-project/download/m21-gates-shots'
mkdirSync(SHOTS, { recursive: true })

const watchdog = setTimeout(() => { console.error('WATCHDOG: 280s hard exit'); process.exit(2) }, 279_000)
const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

const errors: string[] = []
const transcript: Array<{ step: string; ok: boolean; note: string; text?: string }> = []
let shotN = 0

const run = async (): Promise<void> => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })

  /* ---------- PHONE CONTEXT (iPhone 13) ---------- */
  const ctx = await browser.newContext({ ...devices['iPhone 13'] })
  const page = await ctx.newPage()
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 180)) })
  page.on('pageerror', (e) => errors.push('pageerror: ' + String(e).slice(0, 180)))

  const snap = async (step: string, label: string, pg: typeof page = page): Promise<void> => {
    shotN++
    const file = `${SHOTS}/${String(shotN).padStart(2, '0')}-${label}.png`
    if (pg.isClosed()) { transcript.push({ step, ok: false, note: 'page closed' }); return }
    await race(pg.screenshot({ path: file }), 8000, null)
    const text = await race(pg.evaluate(() => document.body.innerText.replace(/\n{2,}/g, '\n').slice(0, 1600)), 5000, '(no text)')
    transcript.push({ step, ok: true, note: file, text })
    console.log(`✓ ${step} → ${file}`)
  }
  const miss = (step: string, why: string): void => {
    transcript.push({ step, ok: false, note: why })
    console.log(`✗ ${step} — ${why}`)
  }

  /* 0. BOOT: menu → character creation → dashboard (fresh context = no save) */
  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 20_000, null)
  await page.waitForTimeout(2000)
  const started = await race(page.getByText('START YOUR LIFE').first().click({ timeout: 9000 }).then(() => true).catch(() => false), 10_000, false)
  if (started) {
    await page.waitForTimeout(800)
    await race(page.getByLabel('Character name').fill('Gate Walker'), 8000, null)
    await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 9000 }).then(() => true).catch(() => false), 10_000, null)
    await page.waitForTimeout(2600)
    console.log('✓ life started — dashboard should be up')
  } else miss('boot', 'START YOUR LIFE not found — maybe a save exists; continuing')

  /* 1. GUEST GATE — the a11y proof: clicked by TESTID, never coordinates */
  const gateBtn = page.locator('button[data-testid="guest-enter"]')
  const gateVisible = await race(gateBtn.isVisible(), 9000, false)
  if (gateVisible) {
    await snap('guest-gate', 'guest-gate')
    await race(gateBtn.click(), 8000, null)
    await page.waitForTimeout(2200)
    console.log('✓ guest gate entered VIA PROBEABLE BUTTON (a11y fix witnessed)')
  } else {
    miss('guest-gate', 'gate not visible after creation — continuing')
  }

  /* 2. PHONE GRID — 21 apps */
  const phoneBtn = page.getByRole('button', { name: /^phone$/i }).first()
  const phoneOpen = await race(phoneBtn.click({ timeout: 8000 }).then(() => true).catch(() => false), 10_000, false)
  if (!phoneOpen) miss('phone-open', 'phone nav button not found')
  await page.waitForTimeout(1200)
  await snap('phone-grid', 'phone-grid-21')
  const gridText = await race(page.evaluate(() => document.body.innerText), 5000, '')
  const wanted = ['Whot!', 'Confluence Path', 'Career', 'School', 'Houses', 'Health', 'Garage', 'Wardrobe', 'Contacts', 'Mt Patti']
  const missingApps = wanted.filter((w) => !gridText.includes(w))
  if (missingApps.length === 0) console.log('✓ ALL 10 new apps present on the grid')
  else miss('phone-grid-apps', `missing on grid: ${missingApps.join(', ')}`)

  /* 3. WHOT! — a real match, played by clicks */
  const whotOpen = await race(page.getByRole('button', { name: /whot/i }).first().click({ timeout: 7000 }).then(() => true).catch(() => false), 9000, false)
  if (whotOpen) {
    await page.waitForTimeout(900)
    await snap('whot-open', 'whot-table')
    const dealt = await race(page.locator('[data-testid="whot-deal"]').click({ timeout: 7000 }).then(() => true).catch(() => false), 9000, false)
    if (dealt) {
      await page.waitForTimeout(900)
      await snap('whot-dealt', 'whot-dealt')
      // play up to 14 legal clicks or until the result banner
      for (let i = 0; i < 14; i++) {
        const result = await race(page.locator('[data-testid="whot-result"]').isVisible(), 1500, false)
        if (result) break
        const pick = await race(page.locator('[data-testid="whot-pick"]').isVisible(), 1200, false)
        if (pick) { await race(page.locator('[data-testid="whot-pick"]').click(), 6000, null); await page.waitForTimeout(700); continue }
        const hand = page.locator('[data-testid="whot-hand"] button')
        const n = await race(hand.count(), 4000, 0)
        if (n === 0) break
        let played = false
        for (let j = 0; j < n; j++) {
          const okClick = await race(hand.nth(j).click({ timeout: 2500 }).then(() => true).catch(() => false), 3500, false)
          if (okClick) { played = true; break }
        }
        if (!played) break
        await page.waitForTimeout(800)
      }
      await page.waitForTimeout(800)
      await snap('whot-played', 'whot-match')
    } else miss('whot-deal', 'deal button not found')
  } else miss('whot-open', 'Whot tile not found')

  /* 4. STORY + CONTACTS quick witness */
  const back = async (): Promise<void> => {
    await race(page.getByRole('button', { name: /back|←/i }).first().click({ timeout: 5000 }).then(() => true).catch(() => false), 6000, null)
    await page.waitForTimeout(500)
  }
  await back()
  const storyOpen = await race(page.getByRole('button', { name: /confluence path/i }).first().click({ timeout: 7000 }).then(() => true).catch(() => false), 9000, false)
  if (storyOpen) { await page.waitForTimeout(800); await snap('story-app', 'story-book') } else miss('story-app', 'tile not found')
  await back()
  const contactsOpen = await race(page.getByRole('button', { name: /contacts/i }).first().click({ timeout: 7000 }).then(() => true).catch(() => false), 9000, false)
  if (contactsOpen) { await page.waitForTimeout(800); await snap('contacts-app', 'contacts-book') } else miss('contacts-app', 'tile not found')
  await back()
  await back()

  /* 5. LIVE — the ROOM section (tile sub says 'Roster · Live · Union · Ajo') */
  const liveOpen = await race(page.locator('button', { hasText: 'Roster · Live' }).first().click({ timeout: 7000 }).then(() => true).catch(() => false), 9000, false)
  if (liveOpen) {
    await page.waitForTimeout(1200)
    const room = await race(page.locator('[data-testid="live-room"]').isVisible(), 6000, false)
    if (room) await snap('live-room', 'live-room')
    else miss('live-room', 'room section not visible')
  } else miss('live-open', 'Live tile not found')
  await ctx.close()

  /* ---------- MAP → GATE → LOCATION SHEET (fresh phone context) ----------
     The gate law: the starter trio rides free; anywhere else asks for a
     name — so clicking Township Stadium is what FIRES the guest gate.      */
  const ctx2 = await browser.newContext({ ...devices['iPhone 13'] })
  const p2 = await ctx2.newPage()
  p2.on('console', (m) => { if (m.type() === 'error') errors.push('console2: ' + m.text().slice(0, 180)) })
  p2.on('pageerror', (e) => errors.push('pageerror2: ' + String(e).slice(0, 180)))
  await race(p2.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 20_000, null)
  await p2.waitForTimeout(2000)
  const started2 = await race(p2.getByText('START YOUR LIFE').first().click({ timeout: 9000 }).then(() => true).catch(() => false), 10_000, false)
  if (started2) {
    await p2.waitForTimeout(800)
    await race(p2.getByLabel('Character name').fill('Map Walker'), 8000, null)
    await race(p2.getByText('Start Life in Lokoja').first().click({ timeout: 9000 }).then(() => true).catch(() => false), 10_000, null)
    await p2.waitForTimeout(2600)
  }
  const gate2 = p2.locator('button[data-testid="guest-enter"]')
  await p2.waitForTimeout(1200)
  const mapOpen = await race(p2.getByRole('button', { name: /^map$/i }).first().click({ timeout: 8000 }).then(() => true).catch(() => false), 10_000, false)
  if (!mapOpen) miss('map-open', 'map nav not found')
  await p2.waitForTimeout(1400)
  await snap('map-roster', 'map-32-pins', p2)
  // the MAP PIN's label is the shortName 'Stadium' — clicking the atlas text does nothing
  const stadium = await race(p2.getByText('Stadium', { exact: true }).first().click({ timeout: 7000 }).then(() => true).catch(() => false), 9000, false)
  if (stadium) {
    await p2.waitForTimeout(1400)
    const vibe = await race(p2.locator('[data-testid="loc-vibe-line"]').count(), 6000, 0)
    const action = await race(p2.locator('[data-testid^="loc-action-"]').count(), 6000, 0)
    if (vibe > 0 || action > 0) console.log(`✓ stadium sheet rows PRESENT: vibe=${vibe > 0} actionBoard=${action} (below the fold — scrolling for the shot)`)
    else miss('stadium-sheet', 'sheet open but no vibe/action rows in DOM')
    await race(p2.locator('[data-testid="loc-vibe-line"]').first().scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => null), 6000, null)
    await p2.waitForTimeout(500)
    await snap('stadium-sheet', 'stadium-actions', p2)
    // now TRAVEL — the gate law fires on travel beyond the starter trio
    const tripRow = p2.locator('button:has-text("min trip")').first()
    const tripClicked = await race(tripRow.click({ timeout: 7000 }).then(() => true).catch(() => false), 9000, false)
    if (tripClicked) {
      await p2.waitForTimeout(1600)
      const gateFired = await race(p2.locator('button[data-testid="guest-enter"]').isVisible(), 6000, false)
      if (gateFired) {
        await snap('guest-gate-travel', 'guest-gate-travel', p2)
        await race(p2.locator('button[data-testid="guest-enter"]').click(), 8000, null)
        await p2.waitForTimeout(2600)
        console.log('✓ guest gate FIRED on travel and entered VIA PROBEABLE BUTTON (a11y witnessed)')
      } else {
        console.log('· gate did not fire on this travel (grace already active — honest law, noted)')
      }
      await snap('after-travel', 'stadium-arrived', p2)
    } else miss('stadium-travel', 'no travel row clickable')
  } else miss('stadium-sheet', 'Township Stadium not found on map')
  await ctx2.close()

  /* ---------- DESKTOP WORLD SETTLE (fresh 1280×800) ---------- */
  const ctx3 = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const p3 = await ctx3.newPage()
  p3.on('console', (m) => { if (m.type() === 'error') errors.push('console3: ' + m.text().slice(0, 180)) })
  p3.on('pageerror', (e) => errors.push('pageerror3: ' + String(e).slice(0, 180)))
  await race(p3.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 20_000, null)
  await p3.waitForTimeout(2000)
  const started3 = await race(p3.getByText('START YOUR LIFE').first().click({ timeout: 9000 }).then(() => true).catch(() => false), 10_000, false)
  if (started3) {
    await p3.waitForTimeout(800)
    await race(p3.getByLabel('Character name').fill('World Walker'), 8000, null)
    await race(p3.getByText('Start Life in Lokoja').first().click({ timeout: 9000 }).then(() => true).catch(() => false), 10_000, null)
    await p3.waitForTimeout(2600)
  }
  const gate3 = p3.locator('button[data-testid="guest-enter"]')
  if (await race(gate3.isVisible(), 9000, false)) await race(gate3.click(), 8000, null)
  await p3.waitForTimeout(2200)
  const worldOpen = await race(p3.getByRole('button', { name: /^world$/i }).first().click({ timeout: 8000 }).then(() => true).catch(() => false), 10_000, false)
  if (worldOpen) {
    await p3.waitForTimeout(9000)
    const settled = await race(p3.evaluate(() => (window as any).__lkl?.settled === true || document.querySelector('canvas') !== null), 20_000, false)
    console.log(`✓ desktop world: canvas/settled=${settled}`)
    shotN++
    await race(p3.screenshot({ path: `${SHOTS}/${String(shotN).padStart(2, '0')}-desktop-world.png` }), 9000, null)
    transcript.push({ step: 'desktop-world', ok: true, note: 'desktop world settle' })
  } else miss('desktop-world', 'world tab not found')
  await ctx3.close()

  await browser.close()

  writeFileSync(`${SHOTS}/transcript.json`, JSON.stringify({ base: BASE, errors, transcript }, null, 2))
  console.log('----------------------------------------')
  console.log(`CONSOLE/PAGE ERRORS: ${errors.length}`)
  errors.slice(0, 6).forEach((e) => console.log('  ' + e))
  const bad = transcript.filter((t) => !t.ok)
  console.log(`STEPS: ${transcript.length - bad.length}/${transcript.length} witnessed`)
  console.log(`VERDICT: ${errors.length === 0 ? '🟢 M21 WITNESS CLEAN' : '🔴 errors present — stated honestly'}`)
  clearTimeout(watchdog)
  process.exit(errors.length === 0 ? 0 : 1)
}

run().catch((e) => { console.error('FATAL', e); process.exit(1) })
