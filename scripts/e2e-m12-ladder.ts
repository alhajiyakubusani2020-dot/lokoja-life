/**
 * M12 E2E — THE LADDER, live on the real game.
 * The life above the hustle: the FUL semester clock, the rent book +
 * the landlord's wahala, the JAPA desks and the send-off, the MOPOL
 * detail. Each phase seeds an honest v13 save at the phase's state,
 * reloads, and drives the REAL UI — zero 3D, every CDP call raced.
 *   1. Day 12 — FUL: the semester banner + the lecture hall (calm index)
 *   2. Day 12 — home: the rent book, the landlord's wahala, the settle
 *   3. Day 12 — GRA: the four JAPA desks, the passport collection, the MOPOL detail
 *   4. Day 12 — the Motor Park: THE SEND-OFF
 *   5. Desktop (1280) — the ladder, wide
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/m12-ladder-shots'
mkdirSync(SHOTS, { recursive: true })

const DAY = 12 // dry season, day % 3 === 0 — the convoy day

const watchdog = setTimeout(() => {
  console.error('WATCHDOG: 260s hard exit')
  process.exit(2)
}, 265_000)

const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

/** Seed one phase: patch the idle menu save (v13 + the ladder slices) and continue. */
const seedPhase = async (page: import('playwright').Page, opts: { at: string; education?: Record<string, unknown>; housing?: Record<string, unknown>; japa?: Record<string, unknown> }): Promise<string> => {
  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(900)
  const patched = await race(page.evaluate(({ day, opts }) => {
    const raw = localStorage.getItem('lokoja-life:save')
    if (!raw) return 'no-save'
    const save = JSON.parse(raw)
    save.version = 13
    save.player.level = 8
    save.player.cash = 400000
    save.player.reputation = 500
    save.player.needs.energy = 100
    save.player.needs.mood = 70
    save.player.needs.hunger = 80
    save.player.skills = { hustle: 5, smart: 6, social: 5 }
    save.player.relationships = { musa: { familiarity: 30, lastChatDay: 1, lastGiftDay: 0, lastHangoutDay: 0 } }
    save.world.day = day
    save.world.timeOfDay = 'morning'
    save.world.weather = 'sunny'
    save.world.currentLocation = opts.at
    save.account = { linked: true, handle: 'ada_hustle', token: 't', ageBand: 'adult', gateGraceDay: 0 }
    save.education = {
      enrolled: false, semester: 1, semesterStartDay: 0, lecturesDone: 0, lastLectureDay: 0,
      lastGrantSemester: 0, examsPassed: 0, failedExams: 0, graduated: false, convocationDay: null,
      convocationAttended: false, stats: { lectures: 0, semestersPassed: 0, examSits: 0 },
      ...opts.education,
    }
    save.housing = {
      owned: null, furnishing: {}, rentPaidThrough: day - 6, lastPostedDay: day - 6, rentOwed: 0, wahala: null,
      stats: { rentPaid: 0, wahalaResolved: 0, cyclesLate: 0 },
      ...opts.housing,
    }
    save.japa = {
      nimcReadyDay: 0, nimcDay: 0, passportReadyDay: 0, passportDay: 0, agentTries: 0, agentScams: 0,
      clearanceDay: 0, policeDay: 0, flownDay: 0, remitDay: 0, policeShifts: 0, sirenUntilDay: 0,
      lastEscortDay: 0, stats: { escorts: 0, escortEarned: 0 },
      ...opts.japa,
    }
    localStorage.setItem('lokoja-life:save', JSON.stringify(save))
    return `patched d${day} @ ${opts.at}`
  }, { day: DAY, opts }), 8000, 'eval-dead')
  await race(page.getByText('Continue your life').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(1200)
  return patched
}

/** Open a location sheet by pin aria-label prefix. */
const openPin = async (page: import('playwright').Page, prefix: string): Promise<void> => {
  await race(page.evaluate((p) => {
    const el = Array.from(document.querySelectorAll('button[aria-label]'))
      .find((b) => (b.getAttribute('aria-label') ?? '').startsWith(p)) as HTMLButtonElement | null
    if (el) el.click()
  }, prefix), 8000, null)
  await page.waitForTimeout(800)
}

/** Close the open sheet and land back on the dashboard. */
const goHome = async (page: import('playwright').Page): Promise<void> => {
  await race(page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const cancel = btns.find((b) => (b.textContent ?? '').trim() === 'Cancel')
    if (cancel) cancel.click()
  }), 6000, null)
  await page.waitForTimeout(500)
  await race(page.getByRole('button', { name: 'Home', exact: true }).first().click({ timeout: 6000 }).catch(() => {}), 8000, null)
  await page.waitForTimeout(600)
}

const run = async (): Promise<void> => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 140)))

  // boot once so the real save exists (v13 shape from the live app)
  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1300)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(300)
  await race(page.getByLabel('Character name').fill('Ada').catch(() => {}), 8000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(2400)
  await race(page.reload({ waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1100)

  /* ---------- PHASE 1 — FUL: the semester clock + the lecture hall ---------- */
  // absolute semester index 2 reads calm (the suite proved it) — the halls are open
  console.log('phase1:', await seedPhase(page, {
    at: 'ful-adankolo',
    education: { enrolled: true, semester: 1, semesterStartDay: DAY - 4, lecturesDone: 5, examsPassed: 1 },
  }))
  const ladder = await race(page.evaluate(() => {
    const t = document.body.innerText
    return {
      banner: !!document.querySelector('[data-testid="ladder-banner"]'),
      semester: /Semester 1\/4/.test(t) || /FUL/.test(t),
      lecturePips: /5\/12/.test(t),
    }
  }), 8000, null)
  console.log('ladder banner:', JSON.stringify(ladder))
  await race(page.screenshot({ path: `${SHOTS}/01-ful-dashboard.png` }), 8000, null)

  // the FUL sheet: the lecture hall
  await race(page.getByRole('button', { name: 'Map', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(800)
  await openPin(page, 'FUL Adankolo')
  const edu = await race(page.evaluate(() => {
    const lecture = document.querySelector('[data-testid="ful-lecture"]') as HTMLButtonElement | null
    return {
      panel: !!document.querySelector('[data-testid="education-panel"]'),
      lecture: !!lecture && !lecture.disabled,
      label: lecture?.textContent?.slice(0, 60) ?? null,
    }
  }), 8000, null)
  console.log('ful sheet:', JSON.stringify(edu))
  await race(page.screenshot({ path: `${SHOTS}/02-ful-lecture-hall.png` }), 8000, null)
  await race(page.evaluate(() => {
    const b = document.querySelector('[data-testid="ful-lecture"]') as HTMLButtonElement | null
    if (b && !b.disabled) b.click()
  }), 8000, null)
  await page.waitForTimeout(700)
  const lectured = await race(page.evaluate(() => document.body.innerText.includes('Lecture 6/12')), 6000, null)
  console.log('lecture attended:', lectured)
  await goHome(page)

  /* ---------- PHASE 2 — home: the rent book + the wahala ---------- */
  console.log('phase2:', await seedPhase(page, {
    at: 'home',
    housing: {
      rentPaidThrough: DAY - 6, lastPostedDay: DAY, rentOwed: 900,
      wahala: { day: DAY, kind: 'repair', cost: 2000, note: 'The roof dey leak — the plumber wants his own money' },
    },
  }))
  const housingBanner = await race(page.evaluate(() => {
    const t = document.body.innerText
    return { housing: !!document.querySelector('[data-testid="ladder-housing"]'), owed: /₦900/.test(t) }
  }), 8000, null)
  console.log('housing banner:', JSON.stringify(housingBanner))
  await race(page.screenshot({ path: `${SHOTS}/03-home-rent-book.png` }), 8000, null)
  // the home sheet: the rent book + the wahala settle
  await race(page.getByRole('button', { name: 'Map', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(800)
  await openPin(page, 'Your Place')
  const housing = await race(page.evaluate(() => {
    const pay = document.querySelector('[data-testid="pay-rent"]') as HTMLButtonElement | null
    const settle = document.querySelector('[data-testid="resolve-wahala"]') as HTMLButtonElement | null
    return {
      panel: !!document.querySelector('[data-testid="housing-panel"]'),
      pay: !!pay && !pay.disabled,
      wahala: !!document.querySelector('[data-testid="housing-wahala"]'),
      settle: !!settle && !settle.disabled,
    }
  }), 8000, null)
  console.log('housing sheet:', JSON.stringify(housing))
  await race(page.screenshot({ path: `${SHOTS}/04-rent-wahala-sheet.png` }), 8000, null)
  await race(page.evaluate(() => {
    const b = document.querySelector('[data-testid="resolve-wahala"]') as HTMLButtonElement | null
    if (b && !b.disabled) b.click()
  }), 8000, null)
  await page.waitForTimeout(700)
  const settled = await race(page.evaluate(() => document.body.innerText.includes('Wahala settle')), 6000, null)
  console.log('wahala settled:', settled)

  /* ---------- PHASE 3 — GRA: the JAPA desks + the MOPOL detail ---------- */
  console.log('phase3:', await seedPhase(page, {
    at: 'government-area',
    japa: { nimcDay: DAY - 2, passportReadyDay: DAY - 1, policeShifts: 5 },
  }))
  const japaBanner = await race(page.evaluate(() => ({
    steps: Array.from(document.querySelectorAll('[data-testid^="japa-step-"]')).map((el) => el.getAttribute('data-testid')),
    escort: !!document.querySelector('[data-testid="ladder-escort"]'),
  })), 8000, null)
  console.log('japa banner:', JSON.stringify(japaBanner))
  await race(page.screenshot({ path: `${SHOTS}/05-japa-banner.png` }), 8000, null)
  await race(page.getByRole('button', { name: 'Map', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(800)
  await openPin(page, 'Government Area')
  const japa = await race(page.evaluate(() => {
    const collect = document.querySelector('[data-testid="japa-collect-passport"]') as HTMLButtonElement | null
    const escort = document.querySelector('[data-testid="mopol-escort"]') as HTMLButtonElement | null
    return {
      panel: !!document.querySelector('[data-testid="japa-panel"]'),
      desks: Array.from(document.querySelectorAll('[data-testid^="japa-"]')).map((el) => el.getAttribute('data-testid')),
      collectPassport: !!collect && !collect.disabled,
      escort: !!escort && !escort.disabled,
    }
  }), 8000, null)
  console.log('japa sheet:', JSON.stringify(japa))
  await race(page.screenshot({ path: `${SHOTS}/06-japa-desks-gra.png` }), 8000, null)
  await race(page.evaluate(() => {
    const b = document.querySelector('[data-testid="japa-collect-passport"]') as HTMLButtonElement | null
    if (b && !b.disabled) b.click()
  }), 8000, null)
  await page.waitForTimeout(700)
  const passport = await race(page.evaluate(() => document.body.innerText.includes('green book')), 6000, null)
  console.log('passport collected:', passport)
  await race(page.evaluate(() => {
    const b = document.querySelector('[data-testid="mopol-escort"]') as HTMLButtonElement | null
    if (b && !b.disabled) b.click()
  }), 8000, null)
  await page.waitForTimeout(700)
  const escorted = await race(page.evaluate(() => document.body.innerText.includes('Escort detail done')), 6000, null)
  console.log('escort ran:', escorted)
  await race(page.screenshot({ path: `${SHOTS}/07-mopol-escort.png` }), 8000, null)

  /* ---------- PHASE 4 — the Motor Park: THE SEND-OFF ---------- */
  console.log('phase4:', await seedPhase(page, {
    at: 'transport-area',
    japa: { nimcDay: DAY - 5, passportDay: DAY - 4, clearanceDay: DAY - 3, policeDay: DAY - 2 },
  }))
  await race(page.getByRole('button', { name: 'Map', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(800)
  await openPin(page, 'Motor Park')
  const flight = await race(page.evaluate(() => {
    const b = document.querySelector('[data-testid="japa-flight"]') as HTMLButtonElement | null
    return { panel: !!document.querySelector('[data-testid="japa-panel"]'), ready: !!b && !b.disabled, label: b?.textContent?.slice(0, 60) ?? null }
  }), 8000, null)
  console.log('flight desk:', JSON.stringify(flight))
  await race(page.screenshot({ path: `${SHOTS}/08-sendoff-desk.png` }), 8000, null)
  await race(page.evaluate(() => {
    const b = document.querySelector('[data-testid="japa-flight"]') as HTMLButtonElement | null
    if (b && !b.disabled) b.click()
  }), 8000, null)
  await page.waitForTimeout(700)
  const flown = await race(page.evaluate(() => document.body.innerText.includes('THE SEND-OFF') || document.body.innerText.includes('JAPA DON LAND')), 6000, null)
  console.log('send-off:', flown)
  await race(page.screenshot({ path: `${SHOTS}/09-the-sendoff.png` }), 8000, null)

  // the ladder slices after a life of climbing (let the debounced autosave flush)
  await page.waitForTimeout(2600)
  const finalState = await race(page.evaluate(() => {
    const save = JSON.parse(localStorage.getItem('lokoja-life:save') ?? '{}')
    return {
      version: save.version,
      graduated: save.education?.graduated ?? null,
      owned: save.housing?.owned ?? null,
      wahala: save.housing?.wahala ?? null,
      flown: (save.japa?.flownDay ?? 0) > 0,
      escorts: save.japa?.stats?.escorts ?? -1,
    }
  }), 8000, null)
  console.log('final ladder slices:', JSON.stringify(finalState))

  /* ---------- PHASE 5 — desktop wide ---------- */
  await page.setViewportSize({ width: 1280, height: 800 })
  console.log('phase5:', await seedPhase(page, {
    at: 'ful-adankolo',
    education: { enrolled: true, semester: 2, semesterStartDay: DAY - 6, lecturesDone: 9, examsPassed: 1 },
    housing: { owned: 'self-contain', furnishing: { 'self-contain': 2 } },
    japa: { nimcDay: DAY - 2, policeShifts: 5 },
  }))
  await race(page.screenshot({ path: `${SHOTS}/10-desktop-ladder.png` }), 8000, null)

  console.log('console errors:', errors.length, errors.slice(0, 3))

  await browser.close()
  if (errors.length > 0) process.exit(1)
}

run()
  .then(() => {
    clearTimeout(watchdog)
    console.log('E2E DONE')
    process.exit(0)
  })
  .catch((e) => {
    clearTimeout(watchdog)
    console.error('E2E FAILED:', String(e).slice(0, 200))
    process.exit(1)
  })
