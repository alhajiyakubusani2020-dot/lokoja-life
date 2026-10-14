/**
 * M10 E2E — THE LIVING CALENDAR, live on the real game.
 * The year turns: the Confluence Regatta wears the shoreline, the town
 * union breaks ground on a street, the ram market fills Kpata, and a
 * wedding lands in somebody's compound. Each phase seeds an honest save
 * at the phase's day (the same law the store runs), reloads, and drives
 * the REAL UI — zero 3D, every CDP call raced.
 *   1. Day 37 — the Regatta: banner, 🎉 map pin, crews sheet, sponsor ★
 *   2. Day 43 — ground-breaking: the paving pool, the tier buttons
 *   3. Day 45 — the ram market: buy the ram, the packs + share rows
 *   4. Day 46+ — the wedding: the 💍 banner, the gift table at the canopy
 *   5. Desktop (1280) — the calendar, wide
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'
import { pavingZoneFor, weddingForCycle, regattaWinnerFor } from '../src/game/systems/calendar'

// the deterministic year-1 answers, computed from the SAME laws the page runs
const PAVING_ZONE = pavingZoneFor(3) // cycle 3 breaks ground on day 43
const WEDDING_DAY = weddingForCycle(46).day // the first wedding after day 45
const WEDDING_VENUE_PREFIX = 'Lokoja' // refined below from the real data
const REGATTA_FAVOURITE = regattaWinnerFor(1)

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/m10-calendar-shots'
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

/** Seed one phase: patch the idle menu save (day, level, cash, ties) and continue. */
const seedPhase = async (page: import('playwright').Page, day: number, extra: Record<string, unknown> = {}): Promise<string> => {
  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(900)
  const patched = await race(page.evaluate(({ day, extra }) => {
    const raw = localStorage.getItem('lokoja-life:save')
    if (!raw) return 'no-save'
    const save = JSON.parse(raw)
    save.version = 11
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
    save.calendar = {
      day,
      meatPacks: 0, meatShares: [], sponsored: [], bets: [], asoEbi: [], attended: [], paved: [],
      paving: day === 43 ? { cycle: 3, zoneId: (extra as { pavingZone?: string }).pavingZone ?? 'kpata-market', pool: 0, contribDays: [] } : null,
      stats: { festivalsAttended: 0, ramsBought: 0, meatShared: 0, regattaWins: 0, weddings: 0, projectsDone: 0 },
    }
    for (const [k, v] of Object.entries(extra)) (save as Record<string, unknown>)[k] = v
    localStorage.setItem('lokoja-life:save', JSON.stringify(save))
    return `patched d${day}`
  }, { day, extra }), 8000, 'eval-dead')
  await race(page.getByText('Continue your life').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(1200)
  return patched
}

/** Travel through the 2D map: pin by aria-label prefix, first travel row. */
const travelVia = async (page: import('playwright').Page, namePrefix: string): Promise<boolean> => {
  await race(page.getByRole('button', { name: 'Map', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(800)
  await race(page.evaluate((prefix) => {
    const el = Array.from(document.querySelectorAll('button[aria-label]'))
      .find((b) => (b.getAttribute('aria-label') ?? '').startsWith(prefix)) as HTMLButtonElement | null
    if (el) el.click()
  }, namePrefix), 8000, null)
  await page.waitForTimeout(700)
  await race(page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const row = btns.find((b) => /min/.test(b.textContent ?? '') && /Walk|Keke|Taxi|Tricycle/.test(b.textContent ?? ''))
    if (row) row.click()
  }), 8000, null)
  await page.waitForTimeout(2600)
  const here = await race(page.evaluate((prefix) => document.body.innerText.includes(prefix), namePrefix), 6000, null)
  // the 2D map closes the sheet on travel — re-open it on the arrival pin
  await race(page.evaluate((prefix) => {
    const el = Array.from(document.querySelectorAll('button[aria-label]'))
      .find((b) => (b.getAttribute('aria-label') ?? '').startsWith(prefix)) as HTMLButtonElement | null
    if (el) el.click()
  }, namePrefix), 8000, null)
  await page.waitForTimeout(900)
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

  // boot once so the real save exists (version 11 shape from the live app)
  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1300)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(300)
  await race(page.getByLabel('Character name').fill('Ada').catch(() => {}), 8000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(2400)
  await race(page.reload({ waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1100)

  /* ---------- PHASE 1 — day 37: the Confluence Regatta ---------- */
  console.log('phase1:', await seedPhase(page, 37))
  const p1 = await race(page.evaluate(() => {
    const t = document.body.innerText
    return {
      banner: !!document.querySelector('[data-testid="festival-today"]'),
      regatta: /confluence regatta/i.test(t),
      note: t.includes('naira dey spray'),
      next: !!document.querySelector('[data-testid="festival-next"]'),
    }
  }), 8000, null)
  console.log('regatta banner:', JSON.stringify(p1))
  await race(page.screenshot({ path: `${SHOTS}/01-regatta-dashboard.png` }), 8000, null)

  await race(page.getByRole('button', { name: 'Map', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(900)
  const pin = await race(page.evaluate(() => ({ festivalDot: !!document.querySelector('[data-testid="map-festival-dot"]') })), 8000, null)
  console.log('map pin:', JSON.stringify(pin))
  await race(page.screenshot({ path: `${SHOTS}/02-map-festival-pin.png` }), 8000, null)

  // open the Confluence sheet → travel → the crews + the bookie
  await race(page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('button[aria-label]'))
      .find((b) => (b.getAttribute('aria-label') ?? '').startsWith('The Confluence')) as HTMLButtonElement | null
    if (el) el.click()
  }), 8000, null)
  await page.waitForTimeout(700)
  await race(page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const row = btns.find((b) => /min/.test(b.textContent ?? '') && /Walk|Keke|Taxi/.test(b.textContent ?? ''))
    if (row) row.click()
  }), 8000, null)
  await page.waitForTimeout(2600)
  // the map closes the sheet on travel — re-open it on the arrival pin
  await race(page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('button[aria-label]'))
      .find((b) => (b.getAttribute('aria-label') ?? '').startsWith('The Confluence')) as HTMLButtonElement | null
    if (el) el.click()
  }), 8000, null)
  await page.waitForTimeout(1000)
  // the sheet re-opens on arrival — the festival panel shows the crews
  const crews = await race(page.evaluate(() => {
    const panel = document.querySelector('[data-testid="festival-panel"]')
    const attend = document.querySelector('[data-testid="festival-attend"]')
    return {
      panel: !!panel,
      attend: !!attend && !(attend as HTMLButtonElement).disabled,
      ganaja: !!Array.from(document.querySelectorAll('button')).find((b) => (b.textContent ?? '').includes('Ganaja Lightning')),
      bet: !!document.querySelector('[data-testid="bet-tier-1000"]'),
    }
  }), 8000, null)
  console.log('regatta sheet:', JSON.stringify(crews))
  await race(page.screenshot({ path: `${SHOTS}/03-regatta-crews-sheet.png` }), 8000, null)

  await race(page.evaluate(() => {
    const b = document.querySelector('[data-testid="festival-attend"]') as HTMLButtonElement | null
    if (b && !b.disabled) b.click()
  }), 8000, null)
  await page.waitForTimeout(700)
  await race(page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button')).find((x) => (x.textContent ?? '').includes('Ganaja Lightning')) as HTMLButtonElement | null
    if (b && !b.disabled) b.click()
  }), 8000, null)
  await page.waitForTimeout(800)
  const staked = await race(page.evaluate(() => {
    const t = document.body.innerText
    return {
      spray: t.includes('crowd spray') || t.includes('naira spray'),
      sponsor: t.includes('sponsor Ganaja') || t.includes("You don sponsor"),
      star: !!Array.from(document.querySelectorAll('button')).find((b) => (b.textContent ?? '').includes('★')),
    }
  }), 8000, null)
  console.log('regatta actions:', JSON.stringify(staked))
  await race(page.screenshot({ path: `${SHOTS}/04-regatta-sponsor-spray.png` }), 8000, null)
  await goHome(page)

  /* ---------- PHASE 2 — day 43: the town union breaks ground ---------- */
  await race(page.getByRole('button', { name: 'Home', exact: true }).first().click({ timeout: 6000 }).catch(() => {}), 8000, null)
  await page.waitForTimeout(500)
  console.log('phase2:', await seedPhase(page, 43, { pavingZone: PAVING_ZONE }))
  const pavingBanner = await race(page.evaluate(() => {
    const el = document.querySelector('[data-testid="festival-paving"]')
    const t = el?.textContent ?? ''
    const m = t.match(/paving — ([^₦]+?)₦/)
    return { present: !!el, zone: m ? m[1].trim() : null, text: t.slice(0, 120) }
  }), 8000, null)
  console.log('paving banner:', JSON.stringify(pavingBanner))
  if (pavingBanner?.zone) {
    const zonePrefix = pavingBanner.zone.split(' ')[0]
    await travelVia(page, zonePrefix)
    const pavingPanel = await race(page.evaluate(() => {
      const give = document.querySelector('[data-testid="paving-give-2500"]') as HTMLButtonElement | null
      return { panel: !!document.querySelector('[data-testid="festival-panel"]'), give: !!give && !give.disabled }
    }), 8000, null)
    console.log('paving panel:', JSON.stringify(pavingPanel))
    await race(page.screenshot({ path: `${SHOTS}/05-paving-groundbreaking.png` }), 8000, null)
    await race(page.evaluate(() => {
      const b = document.querySelector('[data-testid="paving-give-2500"]') as HTMLButtonElement | null
      if (b && !b.disabled) b.click()
    }), 8000, null)
    await page.waitForTimeout(700)
    const gave = await race(page.evaluate(() => document.body.innerText.includes('You drop ₦2,500') || document.body.innerText.includes('Pool don complete')), 6000, null)
    console.log('paving gift:', gave)
    await goHome(page)
  }

  /* ---------- PHASE 3 — day 45: the ram market at Kpata ---------- */
  console.log('phase3:', await seedPhase(page, 45))
  const ramChip = await race(page.evaluate(() => {
    const t = document.body.innerText
    return { chip: /Ram market day 2\/3/.test(t), price: /ram na ₦[\d,]+ for Kpata/.test(t), packs: !!document.querySelector('[data-testid="festival-packs"]') }
  }), 8000, null)
  console.log('ram chip:', JSON.stringify(ramChip))
  await travelVia(page, 'Kpata')
  const ramPanel = await race(page.evaluate(() => {
    const buy = document.querySelector('[data-testid="ram-buy"]') as HTMLButtonElement | null
    return { panel: !!document.querySelector('[data-testid="festival-panel"]'), buy: !!buy && !buy.disabled, label: buy?.textContent ?? '' }
  }), 8000, null)
  console.log('ram panel:', JSON.stringify(ramPanel))
  await race(page.screenshot({ path: `${SHOTS}/06-ram-market-kpata.png` }), 8000, null)
  await race(page.evaluate(() => {
    const b = document.querySelector('[data-testid="ram-buy"]') as HTMLButtonElement | null
    if (b && !b.disabled) b.click()
  }), 8000, null)
  await page.waitForTimeout(700)
  const packs = await race(page.evaluate(() => {
    const t = document.body.innerText
    return {
      toast: t.includes('Ram don land'),
      packs: /6 meat packs/.test(t),
      shareRows: Array.from(document.querySelectorAll('button')).filter((b) => (b.getAttribute('data-testid') ?? '').startsWith('share-meat-')).length,
    }
  }), 8000, null)
  console.log('ram bought:', JSON.stringify(packs))
  await race(page.screenshot({ path: `${SHOTS}/07-ram-packs-share.png` }), 8000, null)

  /* ---------- PHASE 4 — the wedding (the law names the day) ---------- */
  const weddingDay = WEDDING_DAY
  console.log(`phase4: the wedding lands on day ${weddingDay} —`, await seedPhase(page, weddingDay))
  {
    const w = await race(page.evaluate(() => ({ wedding: !!document.querySelector('[data-testid="festival-wedding"]') })), 8000, null)
    console.log('wedding banner:', JSON.stringify(w))
  }
  if (weddingDay > 0) {
    await race(page.screenshot({ path: `${SHOTS}/08-wedding-banner.png` }), 8000, null)
    const venue = await race(page.evaluate(() => {
      const t = document.querySelector('[data-testid="festival-wedding"]')?.textContent ?? ''
      const m = t.match(/at ([^-]+) — aso-ebi/)
      return m ? m[1].trim() : null
    }), 8000, null)
    console.log('wedding venue:', venue)
    if (venue) {
      const prefix = venue.split(' ')[0]
      console.log('wedding travel prefix:', prefix)
      await travelVia(page, prefix)
      const wedPanel = await race(page.evaluate(() => ({
        panel: !!document.querySelector('[data-testid="festival-panel"]'),
        gifts: Array.from(document.querySelectorAll('button')).filter((b) => (b.getAttribute('data-testid') ?? '').startsWith('wedding-gift-')).length,
        noAso: document.body.innerText.includes('you no buy aso-ebi'),
      })), 8000, null)
      console.log('wedding panel:', JSON.stringify(wedPanel))
      await race(page.evaluate(() => {
        const b = document.querySelector('[data-testid="wedding-gift-1000"]') as HTMLButtonElement | null
        if (b && !b.disabled) b.click()
      }), 8000, null)
      await page.waitForTimeout(700)
      await race(page.screenshot({ path: `${SHOTS}/09-wedding-canopy.png` }), 8000, null)
    }
  } else {
    console.log('wedding: none found in 46..52')
  }

  // the calendar slice after a life of festivals (let the debounced autosave flush)
  await page.waitForTimeout(2600)
  const finalState = await race(page.evaluate(() => {
    const save = JSON.parse(localStorage.getItem('lokoja-life:save') ?? '{}')
    const cal = save.calendar ?? {}
    return {
      version: save.version,
      sponsored: Array.isArray(cal.sponsored) ? cal.sponsored.length : -1,
      meatPacks: typeof cal.meatPacks === 'number' ? cal.meatPacks : -1,
      attended: Array.isArray(cal.attended) ? cal.attended.length : -1,
      asoEbi: Array.isArray(cal.asoEbi) ? cal.asoEbi.length : -1,
      stats: cal.stats ?? null,
    }
  }), 8000, null)
  console.log('final calendar slice:', JSON.stringify(finalState))

  /* ---------- PHASE 5 — desktop wide ---------- */
  await page.setViewportSize({ width: 1280, height: 800 })
  console.log('phase5:', await seedPhase(page, 37))
  await race(page.screenshot({ path: `${SHOTS}/10-desktop-calendar.png` }), 8000, null)

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
