/**
 * LOKOJA LIFE — M19 E2E: NEXT-GEN POLISH (screenshots)
 * -----------------------------------------------------
 * 1. the profile: THE CONFLUENCE PATH panel + the feel switches
 *    (music flipped ON, haptics visible)
 * 2. the world: the hill's whisper — walking onto the Patti summit
 *    discovers the summit-stone secret (the toast + the book moves)
 * 3. THE CONFLUENCE SUNSET — evening + clear: the band burns the horizon
 * 4. harmattan dusk — the dust haze layers drift under the red band
 * 5. rain — the puddles glint on the streets
 * 6. desktop wide sunset
 * 0 console errors across the run — the house law.
 * Run: bun scripts/e2e-m19-polish.ts
 */
import { chromium, devices } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/m19-polish-shots'
mkdirSync(SHOTS, { recursive: true })

const watchdog = setTimeout(() => { console.error('WATCHDOG: 288s hard exit'); process.exit(2) }, 287_000)
const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

const allErrors: string[] = []

/** a screenshot that silently fails is a lie — log it, count it */
const shot = async (page: import('playwright').Page, path: string): Promise<void> => {
  try {
    await page.screenshot({ path, timeout: 9000 })
    console.log(`📸 ${path.split('/').pop()}`)
  } catch (e) {
    allErrors.push(`shot-failed: ${path.split('/').pop()} ${String(e).slice(0, 80)}`)
    console.log(`✗ screenshot failed: ${path.split('/').pop()}`)
  }
}

/** the m11 progressive shot: the wedged compositor drops frames — retry the
 *  same shot up to 6 times with breathers, the LAST success is the truth */
const shotProgressive = async (page: import('playwright').Page, path: string): Promise<void> => {
  let done = false
  for (let i = 0; i < 6 && !done; i++) {
    try {
      await page.screenshot({ path, timeout: 9000 })
      done = true
      console.log(`📸 ${path.split('/').pop()} (attempt ${i + 1})`)
    } catch {
      await page.waitForTimeout(3000)
    }
  }
  if (!done) {
    allErrors.push(`shot-failed: ${path.split('/').pop()} progressive exhausted`)
    console.log(`✗ screenshot failed: ${path.split('/').pop()}`)
  }
}

/** the headless wedge: after world events the main thread jams ~30s — poll
 *  until two quick evaluates answer in a row, THEN the screenshot is honest */
const waitForResponsive = async (page: import('playwright').Page, maxMs = 40_000): Promise<void> => {
  const t0 = Date.now()
  let streak = 0
  while (Date.now() - t0 < maxMs) {
    const ok = await race(page.evaluate(() => 1), 2500, 0)
    streak = ok === 1 ? streak + 1 : 0
    if (streak >= 2) return
    await page.waitForTimeout(800)
  }
}

/** the m1 walk driver, ported: compass-calibrated joystick walking — no
 *  assumed stick mapping, empirical bearings only, honest feet arrival */
const WALK_DRIVER = `window.__walkTo = async function(target, opts = {}) {
  const { timeout = 90000, reach = 5.5 } = opts
  const t0 = Date.now()
  let bestDir = null
  let idle = 0
  while (Date.now() - t0 < timeout) {
    const p = window.__lkl.pos()
    const dist = Math.hypot(target.x - p.x, target.z - p.z)
    if (dist < reach) { window.__lkl.stick(0, 0); return { ok: true, dist } }
    if (!bestDir) {
      let bd = Infinity; let bc = null
      for (let a = 0; a < 8; a++) {
        const ang = (a / 8) * Math.PI * 2
        const sx = Math.sin(ang), sy = -Math.cos(ang)
        window.__lkl.stick(sx, sy)
        await new Promise((r) => setTimeout(r, 380))
        const p1 = window.__lkl.pos()
        const d1 = Math.hypot(target.x - p1.x, target.z - p1.z)
        if (d1 < bd) { bd = d1; bc = [sx, sy] }
        if (d1 < reach) break
      }
      bestDir = bc
    }
    window.__lkl.stick(bestDir[0], bestDir[1])
    await new Promise((r) => setTimeout(r, 900))
    const p2 = window.__lkl.pos()
    const moved = Math.hypot(p2.x - p.x, p2.z - p.z)
    if (moved < 0.4) {
      idle++
      bestDir = null // stuck — recalibrate
      if (idle > 40) { window.__lkl.stick(0, 0); return { ok: false, dist } }
    } else {
      idle = 0
    }
  }
  window.__lkl.stick(0, 0)
  return { ok: false }
}
window.__waitArrive = async function(timeout = 30000) {
  const t0 = Date.now()
  let stable = 0
  let last = window.__lkl.pos()
  while (Date.now() - t0 < timeout) {
    await new Promise((r) => setTimeout(r, 700))
    const p = window.__lkl.pos()
    if (Math.hypot(p.x - last.x, p.z - last.z) < 0.2) { stable++; if (stable >= 3) return true }
    else stable = 0
    last = p
  }
  return false
}`

/** the m7 lesson: poll until the world answers twice AND the canvas is in.
 *  After ~25s a bare canvas + live hook counts too (the veil text is not
 *  the law — the hook is). */
const settleWorld = async (page: import('playwright').Page, maxMs = 45_000): Promise<boolean> => {
  const t0 = Date.now()
  let aliveStreak = 0
  while (Date.now() - t0 < maxMs) {
    const ping = await race(page.evaluate(() => ({
      canvas: !!document.querySelector('canvas'),
      veil: document.body.innerText.includes('Entering Lokoja'),
      hook: !!(window as unknown as { __lkl?: unknown }).__lkl,
      alive: true,
    })), 4000, { canvas: false, veil: false, hook: false, alive: false })
    if (ping.alive && ping.canvas && ping.hook) {
      aliveStreak++
      if (aliveStreak >= 2 && (!ping.veil || Date.now() - t0 > 25_000)) return true
    } else {
      aliveStreak = 0
    }
    await page.waitForTimeout(900)
  }
  return false
}

const run = async (): Promise<void> => {
  /* -------- 1-2. the profile + the hill on the phone -------- */
  {
    const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
    const ctx = await browser.newContext({ ...devices['iPhone 13'] })
    const page = await ctx.newPage()
    page.on('pageerror', (e) => allErrors.push('phone: ' + String(e).slice(0, 120)))
    await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15_000, null)
    await page.waitForTimeout(1400)
    await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
    await page.waitForTimeout(400)
    await race(page.getByLabel('Character name').fill('Patti Walker').catch(() => {}), 8000, null)
    await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
    await page.waitForTimeout(1800)

    // the profile tab ('You') — the story panel + the feel switches
    await race(page.getByRole('button', { name: 'You', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 9000, null)
    await page.waitForTimeout(900)
    const profile = await race(page.evaluate(() => ({
      story: !!document.querySelector('[data-testid="story-panel"]'),
      chapter: document.querySelector('[data-testid="story-chapter"]')?.textContent ?? '',
      music: !!document.querySelector('[data-testid="music-toggle"]'),
      haptics: !!document.querySelector('[data-testid="haptics-toggle"]'),
      patti: document.querySelector('[data-testid="patti-count"]')?.textContent ?? '',
    })), 8000, null)
    console.log('profile:', JSON.stringify(profile))
    await shot(page, `${SHOTS}/01-story-profile.png`)

    // flip the music switch — the feel switches answer
    await race(page.locator('[data-testid="music-toggle"]').click({ timeout: 8000 }).catch(() => {}), 9000, null)
    await page.waitForTimeout(500)
    const musicOn = await race(page.evaluate(() => {
      const btn = document.querySelector('[data-testid="music-toggle"]')
      return btn?.getAttribute('aria-pressed') === 'true'
    }), 8000, false)
    console.log('music flipped:', musicOn)
    await shot(page, `${SHOTS}/02-music-on.png`)

    // the honest game flow: the MAP travels to the hill, the WORLD spawns
    // at its anchor — 6.4u from the summit stone, inside the whisper radius
    await race(page.getByRole('button', { name: 'Map', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 9000, null)
    await page.waitForTimeout(700)
    // the marker's aria-label is the full name
    const marker = page.getByRole('button', { name: /Mount Patti/ }).first()
    const markerOk = await race(marker.click({ timeout: 8000 }).then(() => true).catch(() => false), 9000, false)
    console.log('patti marker clicked:', markerOk)
    await page.waitForTimeout(700)
    const walkRow = page.getByRole('button', { name: /walk/i }).first()
    const walkOk = await race(walkRow.click({ timeout: 9000 }).then(() => true).catch(() => false), 10_000, false)
    console.log('walk row clicked:', walkOk)
    // THE GUEST GATE: forward travel stands behind the claim — take the honest
    // one-day grace ('Maybe later'), the travel then lands
    const maybe = page.locator('[data-testid="gate-maybe"]')
    if (await race(maybe.count(), 5000, 0)) {
      await race(maybe.click({ timeout: 8000 }).catch(() => {}), 9000, null)
      console.log('gate grace accepted')
    }
    // the travel overlay ('Travelling…') resolves in a few seconds
    for (let i = 0; i < 45; i++) {
      const busy = await race(page.evaluate(() => document.body.innerText.includes('Travelling')), 5000, true)
      if (!busy) break
      await page.waitForTimeout(800)
    }
    await page.waitForTimeout(1500)
    console.log('map travel done')

    // enter the world — the spawn lands on the Patti, the poll discovers
    await race(page.getByRole('button', { name: 'World', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 9000, null)
    let settled = await settleWorld(page, 60_000)
    if (!settled) {
      // the boot jam sometimes eats the first click — try once more
      await race(page.getByRole('button', { name: 'World', exact: true }).first().click({ timeout: 8000 }).catch(() => {}), 9000, null)
      settled = await settleWorld(page, 45_000)
    }
    console.log('world settled:', settled)
    if (!settled) {
      const diag = await race(page.evaluate(() => ({
        canvas: !!document.querySelector('canvas'),
        veil: document.body.innerText.includes('Entering Lokoja'),
        travelling: document.body.innerText.includes('Travelling'),
        bodyHead: document.body.innerText.slice(0, 160).replace(/\n/g, ' | '),
      })), 6000, null)
      console.log('world diag:', JSON.stringify(diag))
    }
    await race(page.evaluate(WALK_DRIVER), 5000, null)
    // skip the onboarding tour — it covers the world in every shot
    await race(page.getByRole('button', { name: 'Skip' }).first().click({ timeout: 5000 }).catch(() => {}), 6000, null)
    await page.waitForTimeout(600)
    // THE HONEST FEET: the dev teleport bridge (stripped from prod) places the
    // walker 5u off the stone — inside the whisper radius — and the 2Hz poll
    // (the game's own law) does the discovering. No store surgery.
    await race(page.evaluate(() => {
      const w = window as unknown as { __lkl?: { m19: () => { secrets: { id: string; x: number; z: number }[] } }; __lko?: { teleport: (x: number, z: number) => void } }
      const stone = w.__lkl?.m19().secrets.find((s) => s.id === 'summit-stone')
      if (stone && w.__lko) w.__lko.teleport(stone.x + 5.5, stone.z + 2)
    }), 8000, null)
    // the discovery poll ticks at 2Hz — give the whisper time to speak
    await page.waitForTimeout(5000)
    await waitForResponsive(page, 25_000)
    const m19 = await race(page.evaluate(() => {
      const w = window as unknown as { __lkl?: { m19: () => { patti: { found: Record<string, number> }; story: { chapter: number }; wardrobe: { activeWalk: string }; settings: { music: boolean } } } }
      if (!w.__lkl?.m19) return null
      const b = w.__lkl.m19()
      return { found: Object.keys(b.patti.found), chapter: b.story.chapter, walk: b.wardrobe.activeWalk, music: b.settings.music }
    }), 8000, null)
    console.log('hill whisper:', JSON.stringify(m19))
    await shot(page, `${SHOTS}/03-patti-secret.png`)

    /* -------- 3. THE CONFLUENCE SUNSET (from the summit) -------- */
    await race(page.evaluate(() => {
      const w = window as unknown as { __lkl?: { forceWeather: (w: string) => void; forceTime: (t: string) => void } }
      w.__lkl?.forceWeather('sunny')
      w.__lkl?.forceTime('evening')
    }), 8000, null)
    await page.waitForTimeout(3500) // the band eases in (~3s)
    await shot(page, `${SHOTS}/04-sunset-band.png`)

    /* -------- 4. harmattan dusk — the haze rides the red band -------- */
    await race(page.evaluate(() => {
      const w = window as unknown as { __lkl?: { forceWeather: (w: string) => void } }
      w.__lkl?.forceWeather('harmattan')
    }), 8000, null)
    await page.waitForTimeout(4500) // the dust eases slower (~4s)
    await shot(page, `${SHOTS}/05-harmattan-dusk.png`)

    /* -------- 5. rain — the puddles glint -------- */
    await race(page.evaluate(() => {
      const w = window as unknown as { __lkl?: { forceWeather: (w: string) => void; forceTime: (t: string) => void } }
      w.__lkl?.forceWeather('rain')
      w.__lkl?.forceTime('afternoon')
    }), 8000, null)
    await page.waitForTimeout(4500)
    await waitForResponsive(page)
    await shotProgressive(page, `${SHOTS}/06-puddles.png`)

    const errs1 = allErrors.slice()
    console.log('phone console errors:', errs1.length)
    await race(browser.close().catch(() => {}), 8000, null)
  }

  /* -------- 6. desktop wide sunset -------- */
  {
    const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
    page.on('pageerror', (e) => allErrors.push('desktop: ' + String(e).slice(0, 120)))
    await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'load' }), 20_000, null)
    await page.waitForTimeout(1200)
    await race(page.getByText('START YOUR LIFE').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
    await page.waitForTimeout(400)
    await race(page.getByLabel('Character name').fill('Sunset Eye').catch(() => {}), 8000, null)
    await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 8000 }).catch(() => {}), 10_000, null)
    await page.waitForTimeout(2000)
    await race(page.getByRole('button', { name: /world/i }).first().click({ timeout: 8000 }).catch(() => {}), 9000, null)
    const settled = await settleWorld(page, 75_000)
    console.log('desktop world settled:', settled)
    await race(page.evaluate(() => {
      const w = window as unknown as { __lkl?: { forceWeather: (w: string) => void; forceTime: (t: string) => void } }
      w.__lkl?.forceWeather('sunny')
      w.__lkl?.forceTime('evening')
    }), 8000, null)
    await page.waitForTimeout(3800)
    await waitForResponsive(page, 50_000)
    await shotProgressive(page, `${SHOTS}/07-desktop-sunset.png`)
    await race(browser.close().catch(() => {}), 8000, null)
  }

  console.log('\n══════════════════════════')
  console.log(`console errors: ${allErrors.length}`)
  if (allErrors.length) console.log(allErrors.join('\n'))
  console.log('══════════════════════════')
  process.exit(allErrors.length ? 1 : 0)
}

run().catch((e) => {
  console.error('E2E failed:', e)
  process.exit(1)
})
