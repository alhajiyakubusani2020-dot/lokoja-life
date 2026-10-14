/**
 * M11 E2E — THE RIVERS AWAKE, live on the real game.
 * The Niger is at its peak (day 58 of the 72-day year — the honest season
 * curve puts the water at ~90%+), and the city answers. Each phase seeds an
 * honest v12 save at the law-computed day, reloads, and drives the REAL UI —
 * zero 3D, every CDP call raced.
 *   1. Day 58 — the surge: the river gauge + cut chips, 🌊 map pins, the
 *      land-travel refusal toast, the jetty's ferry board + ride rows
 *   2. The Crusher — buy sand on the Patti road
 *   3. Ferry into the cut Ganaja road — lay a sandbag segment
 *   4. Ferry into the drowned market — the cold-room rescue bowl takes a tier
 *   5. Desktop (1280) — the surge, wide
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/m11-rivers-shots'
mkdirSync(SHOTS, { recursive: true })

const SURGE_DAY = 58 // the peak of the river's year — the water owns the low ground

const watchdog = setTimeout(() => {
  console.error('WATCHDOG: 260s hard exit')
  process.exit(2)
}, 265_000)

const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

/** Seed one phase: patch the idle menu save (day 58 surge + the rivers slice) and continue. */
const seedPhase = async (page: import('playwright').Page, extraRivers: Record<string, unknown> = {}): Promise<string> => {
  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(900)
  const patched = await race(page.evaluate(({ day, extraRivers }) => {
    const raw = localStorage.getItem('lokoja-life:save')
    if (!raw) return 'no-save'
    const save = JSON.parse(raw)
    save.version = 12
    save.player.level = 2
    save.player.cash = 150000
    save.player.needs.energy = 100
    save.player.needs.mood = 70
    save.player.needs.hunger = 80
    save.player.relationships = { musa: { familiarity: 30, lastChatDay: 1, lastGiftDay: 0, lastHangoutDay: 0 } }
    save.world.day = day
    save.world.timeOfDay = 'morning'
    save.world.weather = 'sunny'
    save.world.currentLocation = 'home'
    save.account = { linked: true, handle: 'ada_hustle', token: 't', ageBand: 'adult', gateGraceDay: 0 }
    save.rivers = {
      day: day - 1,
      sandbags: 0,
      canoe: true,
      walkways: {},
      rescue: { zoneId: 'kpata-market', year: 1, pool: 3000, contribDays: [] },
      rescuedYear: 0,
      ferryDay: 0,
      ferryDone: [],
      stats: { sandBought: 0, segmentsLaid: 0, tollsCollected: 0, ferryRuns: 0, ferryEarned: 0, rescues: 0 },
      ...extraRivers,
    }
    localStorage.setItem('lokoja-life:save', JSON.stringify(save))
    return `patched d${day}`
  }, { day: SURGE_DAY, extraRivers }), 8000, 'eval-dead')
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

/** Travel through the 2D map: pin by prefix, first travel row. */
const travelVia = async (page: import('playwright').Page, namePrefix: string): Promise<boolean> => {
  await race(page.getByRole('button', { name: 'Map', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(800)
  await openPin(page, namePrefix)
  await race(page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const row = btns.find((b) => /min/.test(b.textContent ?? '') && /Walk|Keke|Taxi|Tricycle/.test(b.textContent ?? ''))
    if (row) row.click()
  }), 8000, null)
  await page.waitForTimeout(2600)
  const here = await race(page.evaluate((prefix) => document.body.innerText.includes(prefix), namePrefix), 6000, null)
  await openPin(page, namePrefix)
  return !!here
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

  // boot once so the real save exists (v12 shape from the live app)
  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1300)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(300)
  await race(page.getByLabel('Character name').fill('Ada').catch(() => {}), 8000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(2400)
  await race(page.reload({ waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1100)

  /* ---------- PHASE 1 — day 58: the peak surge ---------- */
  console.log('phase1:', await seedPhase(page))
  const banner = await race(page.evaluate(() => {
    const t = document.querySelector('[data-testid="rivers-banner"]')?.textContent ?? ''
    return {
      banner: !!document.querySelector('[data-testid="rivers-banner"]'),
      gaugePct: t.match(/(\d+)% full/)?.[1] ?? null,
      cuts: Array.from(document.querySelectorAll('[data-testid^="rivers-cut-"]')).map((el) => el.getAttribute('data-testid')),
      rescue: !!document.querySelector('[data-testid="rivers-rescue-pool"]'),
    }
  }), 8000, null)
  console.log('surge banner:', JSON.stringify(banner))
  await race(page.screenshot({ path: `${SHOTS}/01-surge-dashboard.png` }), 8000, null)

  // the map wears the 🌊 pins
  await race(page.getByRole('button', { name: 'Map', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(900)
  const pins = await race(page.evaluate(() => ({
    riverDots: Array.from(document.querySelectorAll('[data-testid="map-river-dot"]')).length,
  })), 8000, null)
  console.log('map pins:', JSON.stringify(pins))
  await race(page.screenshot({ path: `${SHOTS}/02-map-river-pins.png` }), 8000, null)

  // the land law refuses the Confluence — the toast tells the truth
  await openPin(page, 'The Confluence')
  await race(page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const row = btns.find((b) => /min/.test(b.textContent ?? '') && /Walk|Keke|Taxi/.test(b.textContent ?? ''))
    if (row) row.click()
  }), 8000, null)
  await page.waitForTimeout(700)
  const refusal = await race(page.evaluate(() => {
    const t = document.body.innerText
    return { toast: t.includes('river don take') || t.includes('under water'), stillMap: !!document.querySelector('[data-testid="map-river-dot"]') }
  }), 6000, null)
  console.log('travel refusal:', JSON.stringify(refusal))
  await race(page.screenshot({ path: `${SHOTS}/03-travel-refusal-toast.png` }), 8000, null)

  // the jetty: the ferry board + the ride rows
  await openPin(page, 'Motor Park')
  const jetty = await race(page.evaluate(() => {
    const t = document.body.innerText
    return {
      panel: !!document.querySelector('[data-testid="rivers-panel"]'),
      gigs: Array.from(document.querySelectorAll('[data-testid^="ferry-gig-"]')).length,
      rides: Array.from(document.querySelectorAll('[data-testid^="ferry-ride-"]')).map((el) => el.getAttribute('data-testid')),
      boardLive: /boatloads/i.test(t),
    }
  }), 8000, null)
  console.log('jetty panel:', JSON.stringify(jetty))
  await race(page.screenshot({ path: `${SHOTS}/04-jetty-ferry-board.png` }), 8000, null)
  await goHome(page)

  /* ---------- PHASE 2 — the Crusher sells sand ---------- */
  console.log('phase2: the Crusher —', await travelVia(page, 'Mount Patti'))
  await race(page.evaluate(() => {
    const b = document.querySelector('[data-testid="buy-sand-1"]') as HTMLButtonElement | null
    if (b && !b.disabled) b.click()
  }), 8000, null)
  await page.waitForTimeout(700)
  const sand = await race(page.evaluate(() => {
    const t = document.body.innerText
    return { bought: t.includes('sack') && (t.includes('Crusher') || t.includes('compound')), vendor: t.includes('Crusher') }
  }), 6000, null)
  console.log('sand:', JSON.stringify(sand))
  await race(page.screenshot({ path: `${SHOTS}/05-crusher-sand.png` }), 8000, null)

  /* ---------- PHASE 3 — ferry into the cut Ganaja road, lay a segment ---------- */
  console.log('phase3: the walkway —', await seedPhase(page, { sandbags: 10 }))
  // the canoes wait at the Motor Park jetty — land there first (the route law)
  await travelVia(page, 'Motor Park')
  await race(page.evaluate(() => {
    const b = document.querySelector('[data-testid="ferry-ride-ganaja-junction"]') as HTMLButtonElement | null
    if (b && !b.disabled) b.click()
  }), 8000, null)
  await page.waitForTimeout(2400)
  // the map closes the sheet on travel — re-open it on the arrival pin
  await openPin(page, 'Ganaja')
  const cutPanel = await race(page.evaluate(() => {
    const lay = document.querySelector('[data-testid="lay-segment"]') as HTMLButtonElement | null
    const t = document.body.innerText
    return {
      panel: !!document.querySelector('[data-testid="rivers-panel"]'),
      lay: !!lay && !lay.disabled,
      segments: /segments laid|segment left/.test(t),
      rideBack: !!document.querySelector('[data-testid="ferry-ride-back"]'),
    }
  }), 8000, null)
  console.log('cut-zone panel:', JSON.stringify(cutPanel))
  await race(page.screenshot({ path: `${SHOTS}/06-cut-zone-walkway.png` }), 8000, null)
  await race(page.evaluate(() => {
    const b = document.querySelector('[data-testid="lay-segment"]') as HTMLButtonElement | null
    if (b && !b.disabled) b.click()
  }), 8000, null)
  await page.waitForTimeout(700)
  const laid = await race(page.evaluate(() => document.body.innerText.includes('segment') || document.body.innerText.includes('sacks')), 6000, null)
  console.log('segment laid toast:', laid)
  await race(page.screenshot({ path: `${SHOTS}/07-segment-laid.png` }), 8000, null)

  /* ---------- PHASE 4 — the cold-room rescue bowl at Kpata ---------- */
  await race(page.evaluate(() => {
    const b = document.querySelector('[data-testid="ferry-ride-back"]') as HTMLButtonElement | null
    if (b && !b.disabled) b.click()
  }), 8000, null)
  await page.waitForTimeout(2400)
  await openPin(page, 'Motor Park')
  await race(page.evaluate(() => {
    const b = document.querySelector('[data-testid="ferry-ride-kpata-market"]') as HTMLButtonElement | null
    if (b && !b.disabled) b.click()
  }), 8000, null)
  await page.waitForTimeout(2400)
  await openPin(page, 'Kpata')
  const rescue = await race(page.evaluate(() => {
    const give = document.querySelector('[data-testid="rescue-give-1000"]') as HTMLButtonElement | null
    return {
      bowl: /cold-room rescue/i.test(document.body.innerText),
      tiers: Array.from(document.querySelectorAll('[data-testid^="rescue-give-"]')).length,
      give: !!give,
      giveEnabled: !!give && !give.disabled,
    }
  }), 8000, null)
  console.log('rescue bowl:', JSON.stringify(rescue))
  await race(page.screenshot({ path: `${SHOTS}/08-rescue-bowl.png` }), 8000, null)
  await race(page.evaluate(() => {
    const b = document.querySelector('[data-testid="rescue-give-1000"]') as HTMLButtonElement | null
    if (b && !b.disabled) b.click()
  }), 8000, null)
  await page.waitForTimeout(700)
  const gave = await race(page.evaluate(() => document.body.innerText.includes('You drop ₦1,000') || document.body.innerText.includes('trucks go roll')), 6000, null)
  console.log('rescue gift:', gave)

  // the rivers slice after a life on the water (let the debounced autosave flush)
  await page.waitForTimeout(2600)
  const finalState = await race(page.evaluate(() => {
    const save = JSON.parse(localStorage.getItem('lokoja-life:save') ?? '{}')
    const riv = save.rivers ?? {}
    return {
      version: save.version,
      sandbags: typeof riv.sandbags === 'number' ? riv.sandbags : -1,
      canoe: riv.canoe === true,
      segments: riv.walkways?.['ganaja-junction']?.laid ?? -1,
      rescuePool: riv.rescue?.pool ?? -1,
      stats: riv.stats ?? null,
    }
  }), 8000, null)
  console.log('final rivers slice:', JSON.stringify(finalState))

  /* ---------- PHASE 5 — desktop wide ---------- */
  await page.setViewportSize({ width: 1280, height: 800 })
  console.log('phase5:', await seedPhase(page))
  await race(page.screenshot({ path: `${SHOTS}/09-desktop-surge.png` }), 8000, null)

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
