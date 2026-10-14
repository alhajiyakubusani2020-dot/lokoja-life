/**
 * M6 E2E — LIVING WORLD, live on the real game (2D surfaces + one 3D sky).
 * Save-patch carries Ada to Level 5 with ₦600k and a paddy at Kpata, spawns
 * her at the Food Strip on a HARMATTAN EVENING (the night market open):
 *   1. Dashboard hero — the harmattan haze + the Harmattan chip (WEATHER_META)
 *   2. Food Strip sheet — "Night market dey open" + the three night dishes
 *   3. Phone → Musa thread — gift strip: recharge card sent (cash −₦500, +8 fam)
 *   4. Same thread — the paddy's favour bubble on a roll-true day → Accepted
 *   5. Flood day (patch + reload) — the Flood watch banner + the Confluence
 *      sheet blocked ("Flood don block the road")
 *   6. Explore in 3D — __lkl.forceWeather('storm') → the storm city
 * Every CDP call raced; DOM-level clicks only; the 3D shot goes LAST
 * (the headless wedge lives ~90-120s — we are out by then).
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'
import { favorRollsToday } from '../src/game/systems/social'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/m6-living-shots'
mkdirSync(SHOTS, { recursive: true })

const watchdog = setTimeout(() => {
  console.error('WATCHDOG: 280s hard exit')
  process.exit(2)
}, 285_000)

const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

const clickMarker = (page: import('playwright').Page, name: string) => {
  return page.evaluate((n) => {
    const el = Array.from(document.querySelectorAll('button[aria-label]'))
      .find((b) => (b.getAttribute('aria-label') ?? '').startsWith(n)) as HTMLButtonElement | null
    if (!el) return 'no-marker'
    el.click()
    return 'clicked'
  }, name)
}

// a day the musa favour roll hits with familiarity 50 (deterministic per npc+day)
const FAVOR_DAY = Array.from({ length: 300 }, (_, i) => i + 2).find((d) => favorRollsToday(50, 'musa', d)) ?? 9

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
  const patch = await race(page.evaluate((favorDay) => {
    const raw = localStorage.getItem('lokoja-life:save')
    if (!raw) return 'no-save'
    const save = JSON.parse(raw)
    save.player.level = 5
    save.player.cash = 600000
    save.player.needs.energy = 100
    save.player.needs.mood = 70
    save.player.relationships = { musa: { familiarity: 50, lastChatDay: 0, lastGiftDay: 0, lastHangoutDay: 0 } }
    save.world.currentLocation = 'food-area' // the night market's home
    save.world.timeOfDay = 'evening' // the stalls wake
    save.world.weather = 'harmattan' // dust day
    save.world.day = favorDay
    localStorage.setItem('lokoja-life:save', JSON.stringify(save))
    return 'patched'
  }, FAVOR_DAY), 8000, 'eval-dead')
  console.log('save patch:', patch, '| favor day:', FAVOR_DAY)

  // 2. continue → Dashboard: the harmattan hero
  await race(page.getByText('Continue your life').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(1100)
  const dash = await race(page.evaluate(() => {
    const t = document.body.innerText
    return {
      harmattanChip: t.includes('Harmattan'),
      day: /Day \d+/.exec(t)?.[0] ?? null,
      tip: t.includes('Dust haze everywhere'),
    }
  }), 8000, null)
  console.log('harmattan dashboard:', JSON.stringify(dash))
  await race(page.screenshot({ path: `${SHOTS}/01-harmattan-dashboard.png` }), 8000, null)

  // 3. Map → Food Strip sheet: the night market section
  await race(page.getByRole('button', { name: 'Map', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(900)
  console.log('food strip marker:', await race(clickMarker(page, 'Mama'), 8000, 'eval-dead'))
  await page.waitForTimeout(900)
  const nightMenu = await race(page.evaluate(() => {
    const t = document.body.innerText
    const rows = Array.from(document.querySelectorAll('button')).filter((b) => b.textContent?.includes('Night suya') || b.textContent?.includes('Boli') || b.textContent?.includes('pepper soup')).length
    return {
      banner: t.includes('Night market dey open'),
      nightRows: rows,
      closedNote: t.includes('dey wake after dark'),
    }
  }), 8000, null)
  console.log('night market:', JSON.stringify(nightMenu))
  await race(page.evaluate(() => {
    const scroller = document.querySelector('.lko-sheet .overflow-y-auto') as HTMLElement | null
      ?? (document.querySelector('[role="dialog"] > div > div') as HTMLElement | null)
    if (scroller) scroller.scrollTop = Math.min(scroller.scrollHeight, 520)
  }), 6000, null)
  await page.waitForTimeout(500)
  await race(page.screenshot({ path: `${SHOTS}/02-night-market-menu.png` }), 8000, null)
  await race(page.getByLabel('Close panel').first().click({ timeout: 5000 }).catch(() => {}), 6000, null)
  await page.waitForTimeout(500)

  // 4. Phone → Chats → Musa: opener → favour bubble → gift → hangout
  await race(page.getByRole('button', { name: 'Phone', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(900)
  await race(page.getByText('Chats', { exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 8000, null)
  await page.waitForTimeout(800)
  await race(page.getByText('Musa', { exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 8000, null)
  await page.waitForTimeout(800)
  await race(page.getByText('Abeg how body?').first().click({ timeout: 8000 }).catch(() => {}), 8000, null)
  await page.waitForTimeout(1900) // typing dots + reply + offer
  const chatProof = await race(page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('lokoja-life:save') ?? '{}')
    return {
      favorBubble: document.body.innerText.includes('Favour:'),
      tierChip: document.body.innerText.includes('Paddy'),
      socialXp: !!document.body.innerText,
      saveFam: s?.player?.relationships?.musa?.familiarity ?? null,
    }
  }), 8000, null)
  console.log('chat:', JSON.stringify(chatProof))
  await race(page.screenshot({ path: `${SHOTS}/03-chat-favor-bubble.png` }), 8000, null)

  // accept the favour if it landed
  await race(page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent?.trim() === 'Accept') as HTMLButtonElement | null
    btn?.click()
  }), 6000, null)
  await page.waitForTimeout(1600) // autosave debounce
  const favorProof = await race(page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('lokoja-life:save') ?? '{}')
    return {
      accepted: document.body.innerText.includes('Favour accepted'),
      actives: s?.player?.activeOpportunities?.length ?? 0,
      gistSource: s?.player?.activeOpportunities?.[0]?.source ?? null,
    }
  }), 8000, null)
  console.log('favor accept:', JSON.stringify(favorProof))

  // gift strip: send the recharge card
  await race(page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent?.includes('Send gift')) as HTMLButtonElement | null
    btn?.click()
  }), 6000, null)
  await page.waitForTimeout(500)
  await race(page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent?.includes('Recharge card')) as HTMLButtonElement | null
    btn?.click()
  }), 6000, null)
  await page.waitForTimeout(1700)
  const giftProof = await race(page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('lokoja-life:save') ?? '{}')
    return {
      giftTx: !!s?.player?.transactions?.find((t: { label?: string }) => (t.label ?? '').startsWith('Gift — ')),
      famAfterGift: s?.player?.relationships?.musa?.familiarity ?? null,
      lastGiftDay: s?.player?.relationships?.musa?.lastGiftDay ?? null,
      stripState: document.body.innerText.includes('Gifted today'),
    }
  }), 8000, null)
  console.log('gift:', JSON.stringify(giftProof))
  await race(page.screenshot({ path: `${SHOTS}/04-gift-sent.png` }), 8000, null)

  // 5. FLOOD DAY — the app flushes saveNow() on pagehide (honest), so the
  //    patch must land AFTER the reload while the menu screen is idle:
  //    no game state in memory, nothing can clobber it.
  await race(page.reload({ waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1300)
  const floodPatch = await race(page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('lokoja-life:save') ?? '{}')
    if (!s?.world) return 'no-save'
    s.world.weather = 'flood'
    s.world.timeOfDay = 'morning'
    localStorage.setItem('lokoja-life:save', JSON.stringify(s))
    return JSON.parse(localStorage.getItem('lokoja-life:save') ?? '{}')?.world?.weather ?? 'none'
  }), 6000, 'eval-dead')
  console.log('flood patch readback (menu screen):', floodPatch)
  await race(page.getByText('Continue your life').first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(1000)
  const floodDash = await race(page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('lokoja-life:save') ?? '{}')
    const t = document.body.innerText
    return {
      savedWeather: s?.world?.weather ?? 'none',
      chip: t.includes('Flood watch'),
      banner: t.includes('Flood watch: the Confluence'),
      tip: t.includes('Niger don overflow'),
    }
  }), 8000, null)
  console.log('flood dashboard:', JSON.stringify(floodDash))
  await race(page.screenshot({ path: `${SHOTS}/05-flood-dashboard.png` }), 8000, null)

  await race(page.getByRole('button', { name: 'Map', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 10000, null)
  await page.waitForTimeout(900)
  console.log('confluence marker:', await race(clickMarker(page, 'The Confluence'), 8000, 'eval-dead'))
  await page.waitForTimeout(1100)
  // retry once if the sheet did not open (first click can race the map boot)
  await race(page.evaluate(() => {
    const t = document.body.innerText
    if (!(t.includes('Travel to The Confluence?') || t.includes('Flood don block the road'))) {
      const el = Array.from(document.querySelectorAll('button[aria-label]'))
        .find((b) => (b.getAttribute('aria-label') ?? '').startsWith('The Confluence')) as HTMLButtonElement | null
      el?.click()
    }
  }), 6000, null)
  await page.waitForTimeout(900)
  const floodBlock = await race(page.evaluate(() => {
    const t = document.body.innerText
    return {
      sheetOpen: t.includes('The Confluence'),
      blockedNote: t.includes('Flood don block the road'),
      travelHeader: t.includes('Travel to The Confluence?'),
    }
  }), 8000, null)
  console.log('flood block:', JSON.stringify(floodBlock))
  await race(page.screenshot({ path: `${SHOTS}/06-flood-confluence-block.png` }), 8000, null)
  await race(page.getByLabel('Close panel').first().click({ timeout: 5000 }).catch(() => {}), 6000, null)
  await page.waitForTimeout(500)

  // 6. the storm city (3D) — the World nav tab IS the 3D world screen.
  //    m4 lesson: under SwiftShader the canvas boots slowly and pegs the
  //    main thread — poll for the HUD itself instead of sleeping blind.
  await race(page.getByRole('button', { name: 'World', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 8000, null)
  let hudReady = false
  for (let i = 0; i < 20 && !hudReady; i++) {
    hudReady = await race(page.evaluate(() => !!document.querySelector('[data-testid="perf-chip"]')), 5000, false)
    if (!hudReady) await page.waitForTimeout(2500)
  }
  console.log('world hud ready:', hudReady)
  await page.waitForTimeout(3000) // let the first software-GL frames actually PRESENT
  const in3d = await race(page.evaluate(() => {
    const api = (window as unknown as { __lkl?: { forceWeather?: (w: string) => void; scene?: () => string } }).__lkl
    const scene = api?.scene?.() ?? 'no-api'
    api?.forceWeather?.('storm')
    return scene
  }), 6000, 'eval-dead')
  console.log('3d scene:', in3d)
  await page.waitForTimeout(9000) // storm sky eases + fresh frames present (~0.7fps software GL)
  await race(page.screenshot({ path: `${SHOTS}/07-storm-city-3d.png` }), 8000, null)

  console.log('\nconsole errors:', errors.length ? errors : 'NONE')
  await browser.close()
  clearTimeout(watchdog)
  if (errors.length > 0) process.exit(1)
}

run().catch((e) => {
  console.error('FATAL', e)
  process.exit(2)
})
