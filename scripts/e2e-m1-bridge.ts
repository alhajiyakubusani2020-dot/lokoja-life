/**
 * M1 E2E — bridge proof v3 (final): fire-and-forget walk driver +
 * Node-side progressive screenshots. faithview-academy (L1) → bridge#3
 * (81u, offline-computed). Two naps top up energy before the hike.
 * Every CDP call raced; best frame always survives the renderer wedge.
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/m1-roads-shots'
mkdirSync(SHOTS, { recursive: true })

const watchdog = setTimeout(() => {
  console.error('WATCHDOG: 135s hard exit')
  process.exit(2)
}, 135_000)

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
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  page.on('pageerror', (e) => console.log('pageerror:', String(e).slice(0, 100)))

  await race(page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' }), 15000, null)
  await page.waitForTimeout(1500)
  await race(page.getByText('START YOUR LIFE').first().click({ timeout: 6000 }).catch(() => {}), 9000, null)
  await page.waitForTimeout(350)
  await race(page.getByLabel('Character name').fill('Ada').catch(() => {}), 6000, null)
  await race(page.getByText('Start Life in Lokoja').first().click({ timeout: 6000 }).catch(() => {}), 9000, null)
  await page.waitForTimeout(350)
  await race(page.getByText('Explore in 3D').first().click({ timeout: 6000 }).catch(() => {}), 9000, null)
  await page.waitForTimeout(4600)
  const skip = page.getByText('Skip', { exact: true }).first()
  if (await skip.isVisible().catch(() => false)) await race(skip.click({ force: true }).catch(() => {}), 5000, null)

  // FINAL strategy — no travel at all: the trip animations (50-90s) exceed
  // the headless wedge window. From SPAWN the nearest bridge (#3) is ~82u;
  // the whole browser life goes to ONE straight walk with progressive shots.
  const pick = await race(page.evaluate(() => {
    const pos = (window as any).__lkl.pos()
    const bs = (window as any).__lkl.bridges() as { x: number; z: number }[]
    let best = -1
    let bd = Infinity
    bs.forEach((b, i) => {
      const d = Math.hypot(b.x - pos.x, b.z - pos.z)
      if (d < bd) { bd = d; best = i }
    })
    return { index: best, dist: Math.round(bd), tx: bs[best]?.x ?? 0, tz: bs[best]?.z ?? 0 }
  }), 7000, null)
  if (!pick) { console.log('HOOK DEAD at pick'); await race(page.screenshot({ path: `${SHOTS}/03-bridge.png` }), 8000, null); await browser.close().catch(() => {}); process.exit(3) }
  console.log('bridge#', pick.index, 'start dist', pick.dist, 'u')

  // FIRE-AND-FORGET walk — do NOT await; the driver walks while Node shoots.
  // 30s cap: we only need ~25u closer to put the span inside the drone zoom.
  await race(page.evaluate(WALK_DRIVER), 6000, null)
  const walkPromise = race(
    page.evaluate((t: { x: number; z: number }) =>
      (window as any).__walkTo(t, { reach: 9, timeout: 55000 }), { x: pick.tx, z: pick.tz }),
    40000, { ok: null as unknown as boolean },
  )

  // progressive screenshots while the driver walks
  let last = pick.dist
  let shots = 0
  for (let i = 0; i < 26; i++) {
    await page.waitForTimeout(2100)
    const p = await race(page.evaluate(() => (window as any).__lkl.pos()), 4500, null)
    if (!p) break
    const d = Math.round(Math.hypot(pick.tx - p.x, pick.tz - p.z))
    if (d !== last) {
      last = d
      const ok = await race(page.screenshot({ path: `${SHOTS}/03-bridge-walk.png` }), 8000, null)
      if (ok !== null) shots++
      console.log(`  t+${i * 2.1 | 0}s dist ${d}u shot#${shots}`)
    }
    if (d < 11) break
  }
  const walked = await race(walkPromise, 15000, null)
  console.log('driver result:', JSON.stringify(walked))
  await page.waitForTimeout(700)
  // drone zoom OUT — brings the span + stream into frame from ~55u
  for (let i = 0; i < 7; i++) {
    await race(page.evaluate(() => {
      const c = document.querySelector('canvas')
      c?.dispatchEvent(new WheelEvent('wheel', { deltaY: 120, clientX: 195, clientY: 420, bubbles: true }))
    }), 3000, null)
    await page.waitForTimeout(230)
  }
  await page.waitForTimeout(1300)
  const final = await race(page.screenshot({ path: `${SHOTS}/03-bridge.png` }), 8000, null)
  console.log('final frame:', final === null ? 'wedge — walk frame kept' : 'saved, gap ' + last + 'u')

  await browser.close().catch(() => {})
  clearTimeout(watchdog)
  console.log('BRIDGE SHOT DONE')
}

run().catch((e) => {
  console.error('failed:', String(e).slice(0, 200))
  process.exit(1)
})
