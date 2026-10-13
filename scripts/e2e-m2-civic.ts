/**
 * M2 E2E — THE CIVIC MESH, live on the real game.
 * Save-patch carries Ada to Level 3 / the Government Area (skipping the
 * ~50s travel animation that outlives the headless browser), then:
 *   1. GRA anchor frame
 *   2. walk WEST to the Government Grounds gate → campus shots
 *   3. into the KGIRS office → interior + CivicPanel
 *   4. phone → Civic app (bills / tax / EFCC / market board)
 *   5. sleep ×5 (NEPA bill posts on day 6) → the bill REALLY shows
 * Every CDP call raced; progressive shots; 150s watchdog.
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/m2-civic-shots'
mkdirSync(SHOTS, { recursive: true })

const watchdog = setTimeout(() => {
  console.error('WATCHDOG: 150s hard exit')
  process.exit(2)
}, 165_000)

const race = async <T,>(p: Promise<T>, ms: number, fb: T): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const guard = new Promise<T>((res) => { t = setTimeout(() => res(fb), ms) })
  try { return await Promise.race([p, guard]) } finally { if (t) clearTimeout(t) }
}

const WALK_DRIVER = `window.__walkTo = async function(target, opts = {}) {
  const { timeout = 150000, reach = 2.0 } = opts
  const t0 = Date.now()
  let bestDir = null
  let bestDist = Infinity
  while (Date.now() - t0 < timeout) {
    const p = window.__lkl.pos()
    const dx = target.x - p.x
    const dz = target.z - p.z
    const dist = Math.hypot(dx, dz)
    if (dist < reach) { window.__lkl.stick(0, 0); return { ok: true, dist } }
    if (bestDir === null) {
      let bd = Infinity; let bc = null
      for (let a = 0; a < 8; a++) {
        const ang = (a / 8) * Math.PI * 2
        const sx = Math.sin(ang), sy = -Math.cos(ang)
        window.__lkl.stick(sx, sy)
        await new Promise((r) => setTimeout(r, 360))
        const p1 = window.__lkl.pos()
        const d1 = Math.hypot(target.x - p1.x, target.z - p1.z)
        if (d1 < bd) { bd = d1; bc = [sx, sy] }
        if (d1 < reach) break
      }
      bestDir = bc; bestDist = bd
    }
    window.__lkl.stick(bestDir[0], bestDir[1])
    await new Promise((r) => setTimeout(r, 600))
    const p2 = window.__lkl.pos()
    const d2 = Math.hypot(target.x - p2.x, target.z - p2.z)
    if (d2 < reach) { window.__lkl.stick(0, 0); return { ok: true, dist: d2 } }
    if (d2 > bestDist + 0.6) bestDir = null
    else bestDist = Math.min(bestDist, d2)
  }
  window.__lkl.stick(0, 0)
  return { ok: false }
}`

const run = async (): Promise<void> => {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 120)))

  // 1. fresh game (creates the save)
  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1400)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 6000 }).catch(() => {}), 9000, null)
  await page.waitForTimeout(350)
  await race(page.getByLabel('Character name').fill('Ada').catch(() => {}), 6000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 6000 }).catch(() => {}), 9000, null)
  await page.waitForTimeout(2600) // autosave debounce

  // 2. reload FIRST (kills any pending autosave timer), THEN patch the idle
  //    menu page — a patch before the reload gets overwritten by the debounce
  await race(page.reload({ waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1200)
  const patch = await race(page.evaluate(() => {
    const raw = localStorage.getItem('lokoja-life:save')
    if (!raw) return 'no-save'
    const save = JSON.parse(raw)
    save.player.level = 3
    save.player.cash = 15000
    save.world.currentLocation = 'government-area'
    localStorage.setItem('lokoja-life:save', JSON.stringify(save))
    return 'patched'
  }), 6000, 'eval-dead')
  console.log('save patch:', patch)
  await race(page.getByText('Continue your life').first().click({ timeout: 6000 }).catch(() => {}), 9000, null)
  await page.waitForTimeout(350)
  await race(page.getByText('Explore in 3D').first().click({ timeout: 6000 }).catch(() => {}), 9000, null)
  await page.waitForTimeout(5000)
  await race(page.evaluate(WALK_DRIVER), 5000, null)
  const skip = page.getByText('Skip', { exact: true }).first()
  if (await skip.isVisible().catch(() => false)) await race(skip.click({ force: true }).catch(() => {}), 5000, null)

  const loc = await race(page.evaluate(() => (window as any).__lkl.pos()), 6000, null)
  console.log('spawn pos:', JSON.stringify(loc))

  // 4. GRA anchor frame
  await race(page.screenshot({ path: `${SHOTS}/01-gra-anchor.png` }), 8000, null)

  // 5. teleport to the gate apron (the road-dense quarter defeats the walk
  // driver — __lko.teleport is the dev/E2E bridge for exactly this), then
  // WALK the last stretch through the gate so the campus reveal is honest
  const tele = await race(page.evaluate(() => {
    const lko = (window as any).__lko
    if (!lko?.teleport) return 'no-bridge'
    lko.teleport(-122.5, 19.3)
    return 'teleported'
  }), 5000, 'eval-dead')
  console.log('teleport:', tele)
  await page.waitForTimeout(900)
  // walk IN through the gate (3u) — camera approaches the campus honestly
  const walked = await race(page.evaluate(() => (window as any).__walkTo({ x: -126, z: 19.3 }, { reach: 2.2, timeout: 15000 })), 22000, null)
  console.log('gate walk:', JSON.stringify(walked))
  await page.waitForTimeout(700)
  await race(page.screenshot({ path: `${SHOTS}/02-campus-walk.png` }), 8000, null)
  // drone frame of the whole grounds
  for (let i = 0; i < 5; i++) {
    await race(page.evaluate(() => {
      const c = document.querySelector('canvas')
      c?.dispatchEvent(new WheelEvent('wheel', { deltaY: 120, clientX: 195, clientY: 420, bubbles: true }))
    }), 3000, null)
    await page.waitForTimeout(230)
  }
  await page.waitForTimeout(1200)
  await race(page.screenshot({ path: `${SHOTS}/03-campus-drone.png` }), 8000, null)

  // 6. teleport to the EFCC door apron and step in — nearest civic office
  const door = await race(page.evaluate(() => {
    const pos = (window as any).__lkl.pos()
    const doors = (window as any).__lkl.doors() as { id: string; x: number; z: number }[]
    const civic = doors.filter((d) => ['kgirs-office', 'nepa-office', 'police-station', 'efcc-office'].includes(d.id))
    let best = civic[0]
    let bd = Infinity
    for (const d of civic) {
      const dist = Math.hypot(d.x - pos.x, d.z - pos.z)
      if (dist < bd) { bd = dist; best = d }
    }
    return best ? { id: best.id, x: best.x, z: best.z, dist: Math.round(bd) } : null
  }), 6000, null)
  console.log('civic door:', JSON.stringify(door))
  if (door) {
    await race(page.evaluate((t: { x: number; z: number }) => {
      (window as any).__lko?.teleport?.(t.x + 1.5, t.z)
    }, door), 5000, null)
    await page.waitForTimeout(700)
    const r = await race(page.evaluate(
      (t: { x: number; z: number }) => (window as any).__walkTo(t, { reach: 1.8, timeout: 12000 }), door,
    ), 18000, null)
    console.log('door walk:', JSON.stringify(r))
    await race(page.evaluate((id: string) => (window as any).__lkl.enter(id), door.id), 8000, null)
    // poll the scene swap (the transition takes a beat)
    let scene: string | null = null
    for (let i = 0; i < 8; i++) {
      await page.waitForTimeout(900)
      scene = await race(page.evaluate(() => (window as any).__lkl.scene()), 5000, null)
      if (scene === 'interior') break
    }
    console.log('scene:', scene)
    await race(page.screenshot({ path: `${SHOTS}/04-office-interior.png` }), 8000, null)

    // the desk — walk to the service counter, open the CivicPanel sheet
    const deskWalk = await race(page.evaluate(() => (window as any).__walkTo({ x: 0, z: 0.4 }, { reach: 1.6, timeout: 10000 })), 16000, null)
    console.log('desk walk:', JSON.stringify(deskWalk))
    await page.waitForTimeout(800)
    const chip = page.getByText(/Speak to the commission|Join the|Approach the duty desk/).first()
    if (await chip.isVisible().catch(() => false)) {
      await race(chip.click({ force: true }).catch(() => {}), 5000, null)
      await page.waitForTimeout(1000)
    }
    await race(page.screenshot({ path: `${SHOTS}/05-civic-panel.png` }), 8000, null)

    // close the sheet, walk to the exit, step out (chip → E key → HUD Outside)
    await race(page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' })) }), 4000, null)
    await page.waitForTimeout(600)
    await race(page.evaluate(() => (window as any).__walkTo({ x: 0, z: 2.5 }, { reach: 1.2, timeout: 8000 })), 13000, null)
    await page.waitForTimeout(600)
    const exitChip = page.getByText('Step back to the GRA').first()
    if (await exitChip.isVisible().catch(() => false)) {
      await race(exitChip.click({ force: true }).catch(() => {}), 5000, null)
      await page.waitForTimeout(1400)
    }
    let sceneNow: string | null = await race(page.evaluate(() => (window as any).__lkl.scene()), 5000, null)
    if (sceneNow === 'interior') {
      await race(page.evaluate(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyE', key: 'e' }))
      }), 4000, null)
      await page.waitForTimeout(1400)
      sceneNow = await race(page.evaluate(() => (window as any).__lkl.scene()), 5000, null)
    }
    if (sceneNow === 'interior') {
      await race(page.getByText('Outside', { exact: false }).first().click({ force: true }).catch(() => {}), 5000, null)
      await page.waitForTimeout(2000)
    }
    console.log('scene after exit attempts:', await race(page.evaluate(() => (window as any).__lkl.scene()), 5000, null))
  }

  // 7. phone Civic app (works only in the world — interiors hide the nav)
  const sceneNow = await race(page.evaluate(() => (window as any).__lkl.scene()), 5000, null)
  console.log('scene before phone:', sceneNow)
  if (sceneNow === 'interior') {
    await race(page.evaluate(() => { window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' })) }), 4000, null)
    await race(page.evaluate(() => (window as any).__walkTo({ x: 0, z: 2.5 }, { reach: 1.2, timeout: 8000 })), 13000, null)
    await page.waitForTimeout(500)
    const exitChip = page.getByText('Step back to the GRA').first()
    if (await exitChip.isVisible().catch(() => false)) {
      await race(exitChip.click({ force: true }).catch(() => {}), 5000, null)
      await page.waitForTimeout(1400)
    }
    if (await race(page.evaluate(() => (window as any).__lkl.scene()), 5000, null) === 'interior') {
      await race(page.evaluate(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyE', key: 'e' }))
      }), 4000, null)
      await page.waitForTimeout(1400)
    }
    if (await race(page.evaluate(() => (window as any).__lkl.scene()), 5000, null) === 'interior') {
      await race(page.getByText('Outside', { exact: false }).first().click({ force: true }).catch(() => {}), 5000, null)
      await page.waitForTimeout(2000)
    }
  }
  await race(page.getByLabel('Game navigation').getByText('Phone').click({ timeout: 5000 }).catch(() => {}), 6000, null)
  await page.waitForTimeout(900)
  await race(page.getByText('Civic', { exact: true }).first().click({ timeout: 5000 }).catch(() => {}), 6000, null)
  await page.waitForTimeout(1400)
  await race(page.screenshot({ path: `${SHOTS}/06-phone-civic.png` }), 8000, null)

  // 8. THE PROOF: sleep to day 6 — the NEPA bill posts for real
  for (let i = 0; i < 5; i++) {
    await race(page.evaluate(() => (window as any).__lkl.rest('sleep')), 6000, null)
    await page.waitForTimeout(500)
  }
  const tod = await race(page.evaluate(() => (window as any).__lkl.timeOfDay()), 5000, null)
  console.log('clock after 5 sleeps:', tod)
  await page.waitForTimeout(1000)
  await race(page.screenshot({ path: `${SHOTS}/07-phone-bill-due.png` }), 8000, null)

  await browser.close().catch(() => {})
  clearTimeout(watchdog)
  console.log('console errors:', errors.length, errors.slice(0, 3))
  console.log('M2 E2E DONE')
}

run().catch((e) => {
  console.error('failed:', String(e).slice(0, 200))
  process.exit(1)
})
