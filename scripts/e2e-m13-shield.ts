/**
 * M13 E2E — THE FAMILY SHIELD, live on the real game.
 * One download, three generations: the life-stage picker at creation,
 * the phone's Family Shield app (band card + Spot the Scammer round +
 * the tier ladder + elder mode), the kid emote chat, and the guest
 * gate's minor branch (parent PIN, no contact). Zero 3D, every CDP
 * call raced, mobile (390) + desktop (1280).
 *   1. Creation — the life-stage strip (kid/teen/adult + the honest note)
 *   2. Kid city — the Family Shield app: band card + scammer round played
 *   3. The tier ladder — set the parent PIN, wrong PIN refused, climb to teen
 *   4. Kid chat — the emote grid replaces the composer (no free lines)
 *   5. Elder mode — the toggle lands the root class (large text, no motion)
 *   6. Guest gate — the minor claim branch (🛡️ parent PIN, contact gone)
 *   7. Desktop (1280) — the shield, wide
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/m13-shield-shots'
mkdirSync(SHOTS, { recursive: true })

const watchdog = setTimeout(() => {
  console.error('WATCHDOG: 260s hard exit')
  process.exit(2)
}, 265_000)

const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

/** Seed one phase: patch the idle menu save (v14 + the shield slices) and continue. */
const seedPhase = async (page: import('playwright').Page, opts: { at: string; band: 'kid' | 'teen' | 'adult'; name?: string; shield?: Record<string, unknown>; cash?: number }): Promise<string> => {
  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(900)
  const patched = await race(page.evaluate(({ opts }) => {
    const raw = localStorage.getItem('lokoja-life:save')
    if (!raw) return 'no-save'
    const save = JSON.parse(raw)
    save.version = 14
    save.player.ageBand = opts.band
    save.player.name = opts.name ?? 'Small Ada'
    save.player.cash = opts.cash ?? 12000
    save.player.level = 4
    save.player.reputation = 120
    save.player.needs.energy = 100
    save.player.needs.mood = 72
    save.player.needs.hunger = 80
    save.player.skills = { hustle: 3, smart: 4, social: 2 }
    save.player.relationships = { musa: { familiarity: 26, lastChatDay: 1, lastGiftDay: 0, lastHangoutDay: 0 } }
    save.world.day = 12
    save.world.timeOfDay = 'morning'
    save.world.weather = 'sunny'
    save.world.currentLocation = opts.at
    save.account = { linked: false, handle: null, token: null, ageBand: null, gateGraceDay: 0 }
    save.shield = { scammerDay: 0, scammerCorrect: 0, scammerWrong: 0, scammerStreak: 0, parentPinHash: null, ...(opts.shield ?? {}) }
    save.settings = { sound: false, graphics: 'low', chill: false, elder: false }
    save.goals = { day: 12, ids: ['waka', 'eat-well', 'gist-time'], progress: {}, done: [true, true, true], streak: 0, lastDoneDay: 0 }
    localStorage.setItem('lokoja-life:save', JSON.stringify(save))
    return `patched d12 @ ${opts.at} band=${opts.band}`
  }, { opts }), 8000, 'eval-dead')
  await race(page.getByText('Continue your life').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(1200)
  return patched
}

const shot = async (page: import('playwright').Page, name: string): Promise<void> => {
  await race(page.screenshot({ path: `${SHOTS}/${name}.png` }), 12000, undefined)
  console.log('  📸', name)
}

/** Open the phone tab then an app by tile label. */
const openPhoneApp = async (page: import('playwright').Page, appLabel: string): Promise<void> => {
  await race(page.getByRole('button', { name: 'Phone', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 9000, null)
  await page.waitForTimeout(700)
  await race(page.getByRole('button', { name: `Open ${appLabel} app` }).first().click({ timeout: 8000 }).catch(() => {}), 9000, null)
  await page.waitForTimeout(800)
}

const run = async (): Promise<void> => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 140)))

  // boot once so the real save exists (v14 shape from the live app)
  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1300)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(400)
  await race(page.getByLabel('Character name').fill('Small Ada').catch(() => {}), 8000, null)
  await page.waitForTimeout(300)
  await shot(page, '01-creation-lifestage')
  // pick the KID stage — the honest note updates
  await race(page.locator('[data-testid="stage-kid"]').click({ timeout: 8000 }).catch(() => {}), 9000, null)
  await page.waitForTimeout(300)
  const kidNote = await race(page.locator('[data-testid="stage-note"]').innerText().catch(() => ''), 6000, '')
  console.log('  kid note:', kidNote.slice(0, 66))
  await shot(page, '02-creation-kid-picked')
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(2400)
  await race(page.reload({ waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1100)

  /* ---------- PHASE 2 — the kid city: the Family Shield app + the scammer round ---------- */
  console.log('phase2:', await seedPhase(page, { at: 'kpata-market', band: 'kid' }))
  await openPhoneApp(page, 'Family Shield')
  const shield1 = await race(page.evaluate(() => {
    const t = document.body.innerText
    return {
      app: /Family Shield/.test(t),
      band: /Pikin \(6–12\)/.test(t),
      drill: /Spot the Scammer/.test(t),
      cards: document.querySelectorAll('[data-testid^="scam-card-"]').length,
      ladder: /Tier Ladder/.test(t),
      elder: /Elder Mode/.test(t),
    }
  }), 8000, null)
  console.log('  shield app:', JSON.stringify(shield1))
  await shot(page, '03-shield-app-kid')
  // play the round — pick the scam (the store resolves the SAME deterministic cards)
  const pick = await race(page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('[data-testid^="scam-card-"]')) as HTMLButtonElement[]
    if (btns.length < 3) return 'no-cards'
    btns[0].click()
    return 'picked'
  }), 8000, 'pick-dead')
  await page.waitForTimeout(900)
  const verdict = await race(page.evaluate(() => {
    const t = document.body.innerText
    return { done: !!document.querySelector('[data-testid="scam-done"]'), toast: /Correct!|honest talk/.test(t) }
  }), 8000, null)
  console.log('  scammer:', pick, JSON.stringify(verdict))
  await shot(page, '04-scammer-round-played')

  /* ---------- PHASE 3 — the tier ladder: parent PIN gates the climb ---------- */
  await race(page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('[data-testid]')).find((b) => b.getAttribute('data-testid') === 'tier-set-pin') as HTMLButtonElement | null
    if (btn) btn.click()
  }), 8000, null)
  await page.waitForTimeout(400)
  await race(page.locator('[data-testid="tier-pin-input"]').fill('654321').catch(() => {}), 8000, null)
  await shot(page, '05-parent-pin-set')
  await race(page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const save = btns.find((b) => (b.textContent ?? '').trim() === 'Save the PIN')
    if (save) save.click()
  }), 8000, null)
  await page.waitForTimeout(600)
  await race(page.locator('[data-testid="tier-pin-input"]').fill('111111').catch(() => {}), 8000, null)
  await race(page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('[data-testid]')).find((b) => b.getAttribute('data-testid') === 'tier-unlock') as HTMLButtonElement | null
    if (btn) btn.click()
  }), 8000, null)
  await page.waitForTimeout(700)
  const wrongPin = await race(page.evaluate(() => /Parent PIN|A parent must/.test(document.body.innerText)), 6000, false)
  console.log('  wrong PIN refused:', wrongPin)
  await shot(page, '06-wrong-pin-refused')
  await race(page.locator('[data-testid="tier-pin-input"]').fill('654321').catch(() => {}), 8000, null)
  await race(page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('[data-testid]')).find((b) => b.getAttribute('data-testid') === 'tier-unlock') as HTMLButtonElement | null
    if (btn) btn.click()
  }), 8000, null)
  await page.waitForTimeout(800)
  const climb = await race(page.evaluate(() => /Teen \(13–17\)/.test(document.body.innerText)), 6000, false)
  console.log('  climbed to teen:', climb)
  await shot(page, '07-climbed-to-teen')

  /* ---------- PHASE 4 — the kid chat: the emote grid ---------- */
  console.log('phase4:', await seedPhase(page, { at: 'kpata-market', band: 'kid', name: 'Small Ada' }))
  await race(page.getByRole('button', { name: 'Phone', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 9000, null)
  await page.waitForTimeout(700)
  await race(page.getByRole('button', { name: 'Open Chats app' }).first().click({ timeout: 8000 }).catch(() => {}), 9000, null)
  await page.waitForTimeout(700)
  await race(page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const musa = btns.find((b) => /Musa/.test(b.textContent ?? ''))
    if (musa) musa.click()
  }), 8000, null)
  await page.waitForTimeout(800)
  const emote = await race(page.evaluate(() => ({
    grid: !!document.querySelector('[data-testid="kid-emote-grid"]'),
    count: document.querySelectorAll('[data-testid^="kid-emote-"]').length,
    noOpener: !/Abeg how body\?/.test(document.body.innerText),
  })), 8000, null)
  console.log('  kid emote grid:', JSON.stringify(emote))
  await shot(page, '08-kid-emote-grid')
  await race(page.evaluate(() => {
    const btn = document.querySelector('[data-testid="kid-emote-fire"]') as HTMLButtonElement | null
    if (btn) btn.click()
  }), 8000, null)
  await page.waitForTimeout(1400)
  const greeted = await race(page.evaluate(() => /Haha! You too much!|You don greet today/.test(document.body.innerText)), 6000, false)
  console.log('  emote delivered:', greeted)
  await shot(page, '09-kid-emote-reply')

  /* ---------- PHASE 5 — elder mode: the root class ---------- */
  console.log('phase5:', await seedPhase(page, { at: 'home', band: 'adult', name: 'Baba Eddy' }))
  await openPhoneApp(page, 'Family Shield')
  await race(page.evaluate(() => {
    const btn = document.querySelector('[data-testid="elder-toggle"]') as HTMLButtonElement | null
    if (btn) btn.click()
  }), 8000, null)
  await page.waitForTimeout(700)
  const elder = await race(page.evaluate(() => ({
    on: document.documentElement.classList.contains('elder-mode'),
  })), 6000, null)
  console.log('  elder class:', JSON.stringify(elder))
  await shot(page, '10-elder-mode-on')
  await race(page.evaluate(() => {
    const btn = document.querySelector('[data-testid="elder-toggle"]') as HTMLButtonElement | null
    if (btn) btn.click()
  }), 8000, null)

  /* ---------- PHASE 6 — the guest gate: the minor claim branch ---------- */
  console.log('phase6:', await seedPhase(page, { at: 'home', band: 'kid', name: 'Small Ada' }))
  // the claim door lives on the PROFILE tab
  await race(page.getByRole('button', { name: 'You', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 9000, null)
  await page.waitForTimeout(700)
  const gateOpened = await race(page.evaluate(() => {
    const btn = document.querySelector('[data-testid="claim-open"]') as HTMLButtonElement | null
    if (!btn) return 'no-claim-btn'
    btn.click()
    return 'clicked'
  }), 8000, 'click-dead')
  await page.waitForTimeout(800)
  const gateUp = await race(page.evaluate(() => !!document.querySelector('[data-testid="guest-gate"]')), 6000, false)
  if (!gateUp) {
    // retry once by scanning every button labelled claim
    await race(page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const claim = btns.find((b) => /claim your name/i.test(b.textContent ?? ''))
      if (claim) claim.click()
    }), 8000, null)
    await page.waitForTimeout(800)
  }
  console.log('  gate:', gateOpened, 'up:', await race(page.evaluate(() => !!document.querySelector('[data-testid="guest-gate"]')), 6000, false))
  await race(page.locator('[data-testid="gate-handle"]').fill('small_ada').catch(() => {}), 8000, null)
  await race(page.locator('[data-testid="gate-year"]').selectOption(String(new Date().getFullYear() - 10)).catch(() => {}), 8000, null)
  await page.waitForTimeout(500)
  const minorBranch = await race(page.evaluate(() => ({
    shieldNote: !!document.querySelector('[data-testid="gate-minor-branch"]'),
    contactGone: !document.querySelector('[data-testid="gate-contact"]'),
    parentPin: !!document.querySelector('[data-testid="gate-parent-pin"]'),
    chip: /🛡️ pikin/.test(document.body.innerText),
  })), 8000, null)
  console.log('  minor branch:', JSON.stringify(minorBranch))
  await shot(page, '11-gate-minor-branch')
  await race(page.locator('[data-testid="gate-parent-pin"]').fill('998877').catch(() => {}), 8000, null)
  await shot(page, '12-gate-parent-pin-filled')
  await race(page.evaluate(() => {
    const btn = document.querySelector('[data-testid="gate-maybe"]') as HTMLButtonElement | null
    if (btn) btn.click()
  }), 8000, null)

  /* ---------- PHASE 7 — desktop wide ---------- */
  const desktop = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const dpage = await desktop.newPage()
  dpage.on('pageerror', (e) => errors.push(String(e).slice(0, 140)))
  // boot the fresh desktop context once so a real save exists, then seed
  await race(dpage.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await dpage.waitForTimeout(1300)
  await race(dpage.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await dpage.waitForTimeout(400)
  await race(dpage.getByLabel('Character name').fill('Small Ada').catch(() => {}), 8000, null)
  await race(dpage.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await dpage.waitForTimeout(2400)
  await race(dpage.reload({ waitUntil: 'domcontentloaded' }), 15000, null)
  await dpage.waitForTimeout(1000)
  console.log('phase7:', await seedPhase(dpage, { at: 'kpata-market', band: 'kid' }))
  await openPhoneApp(dpage, 'Family Shield')
  await dpage.waitForTimeout(500)
  await shot(dpage, '13-desktop-shield-wide')

  await browser.close()
  console.log(`\nM13 E2E — 13 shots, ${errors.length} console errors`)
  if (errors.length) console.log(errors.slice(0, 5))
  clearTimeout(watchdog)
  process.exit(errors.length ? 1 : 0)
}

run().catch((e) => {
  console.error('FATAL', e)
  process.exit(2)
})
