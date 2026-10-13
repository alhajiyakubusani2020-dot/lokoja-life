/**
 * M1 E2E — REAL LOKOJA: roads, street lights, bridges, the no-houses-on-road law.
 * Server must already be running on :3000 (started in the same shell).
 * Shots (mobile 390×844): day street with lamps + markings, the highway,
 * the stream bridge, and the night street with sodium glow.
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/m1-roads-shots'
mkdirSync(SHOTS, { recursive: true })

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
      const p0 = window.__lkl.pos()
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
      bestDir = bc; bestDist = bd
    }
    window.__lkl.stick(bestDir[0], bestDir[1])
    await new Promise((r) => setTimeout(r, 650))
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
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)) })

  await page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2000)
  await page.getByText('START YOUR LIFE').first().click()
  await page.waitForTimeout(600)
  await page.getByLabel('Character name').fill('Ada')
  await page.getByText('Start Life in Lokoja').first().click()
  await page.waitForTimeout(700)
  await page.getByText('Explore in 3D').first().click()
  await page.waitForTimeout(3200)
  await page.evaluate(WALK_DRIVER)
  const skip = page.getByText('Skip', { exact: true }).first()
  if (await skip.isVisible().catch(() => false)) { await skip.click({ force: true }).catch(() => {}); await page.waitForTimeout(800) }

  /** travel + wait for the arrival teleport (headless runs ~7× slow) */
  const travel = async (id: string): Promise<boolean> => {
    const homePos = await page.evaluate(() => (window as any).__lkl.pos())
    await page.evaluate((i: string) => (window as any).__lkl.travel(i), id)
    for (let i = 0; i < 44; i++) {
      await page.waitForTimeout(700)
      const p = await page.evaluate(() => (window as any).__lkl.pos())
      if (Math.hypot(p.x - homePos.x, p.z - homePos.z) > 20) return true
    }
    return false
  }

  // ---- 1. DAY STREET — home district: houses clear of the road, lamps on the
  // shoulder, worn lane paint. Walk to the nearest major road centreline.
  console.log('travel home:', await travel('home'))
  await page.waitForTimeout(1500)
  // the home anchor sits beside a road — walk toward it via the store layout:
  // use the school-road walk: head to the door of the house (faces the street)
  const door = await page.evaluate(() => {
    const doors = (window as any).__lkl.doors()
    return doors.find((d: { id: string }) => d.id === 'home-interior') ?? null
  })
  console.log('home door:', door)
  if (door) {
    const r = await page.evaluate((t: { x: number; z: number }) => (window as any).__walkTo(t, { reach: 3, timeout: 60000 }), { x: door.x + 4, z: door.z + 4 })
    console.log('walked to street:', r)
  }
  await page.waitForTimeout(1200)
  await page.screenshot({ path: `${SHOTS}/01-street-day.png` })

  // ---- 2. THE HIGHWAY — ganaja-junction sits on the major network: dashed
  // centreline + edge lines + tall masts.
  console.log('travel ganaja-junction:', await travel('ganaja-junction'))
  await page.waitForTimeout(1500)
  for (let i = 0; i < 6; i++) {
    await page.evaluate(() => (window as any).__lkl.stick(0, -1))
    await page.waitForTimeout(650)
  }
  await page.evaluate(() => (window as any).__lkl.stick(0, 0))
  await page.waitForTimeout(1500)
  await page.screenshot({ path: `${SHOTS}/02-highway-marks.png` })

  // ---- 3. THE BRIDGE — bridge 2 lies 46u from the university anchor; walk
  // onto the deck (railings, pylons, abutment masts).
  console.log('travel university-area:', await travel('university-area'))
  await page.waitForTimeout(1500)
  const bridgeTarget = await page.evaluate(() => (window as any).__lkl.bridges()[2] ?? null)
  console.log('bridge target:', bridgeTarget)
  if (bridgeTarget) {
    const r = await page.evaluate(
      (t: { x: number; z: number }) => (window as any).__walkTo(t, { reach: 5, timeout: 180000 }),
      { x: bridgeTarget.x, z: bridgeTarget.z },
    )
    console.log('walked to bridge:', r)
  }
  await page.waitForTimeout(1500)
  await page.screenshot({ path: `${SHOTS}/03-bridge.png` })

  // ---- 4. NIGHT STREET — advance the clock to night through the rest system,
  // back to a lit street: sodium heads glow, pools of light on the tarmac.
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => (window as any).__lkl.rest('nap'))
    await page.waitForTimeout(700)
  }
  console.log('travel kpata-market:', await travel('kpata-market'))
  await page.waitForTimeout(1500)
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => (window as any).__lkl.stick(0, 1))
    await page.waitForTimeout(650)
  }
  await page.evaluate(() => (window as any).__lkl.stick(0, 0))
  await page.waitForTimeout(1800)
  await page.screenshot({ path: `${SHOTS}/04-street-night.png` })

  await browser.close()
  console.log('console errors:', errors.length, errors.slice(0, 3))
  if (errors.length > 0) process.exit(1)
  console.log('M1 E2E DONE ✅')
}

run().catch((e) => {
  console.error('E2E failed:', e)
  process.exit(1)
})
