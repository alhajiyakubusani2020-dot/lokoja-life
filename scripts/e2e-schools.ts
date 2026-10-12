/**
 * Stage 8 E2E — drive the real app through the great schools.
 * Server must already be running on :3000 (started in the same shell).
 * Level-1 route: Crowther (unlock 1) for the compound walk, then the e2e
 * hook enters the FUL / Adankolo great interiors directly.
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/stage8-shots'
mkdirSync(SHOTS, { recursive: true })

const WALK_DRIVER = `window.__walkTo = async function(target, opts = {}) {
  const { timeout = 60000, reach = 2.0 } = opts
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

  // fresh life
  await page.getByText('START YOUR LIFE').first().click()
  await page.waitForTimeout(600)
  await page.getByLabel('Character name').fill('Ada')
  await page.getByText('Start Life in Lokoja').first().click()
  await page.waitForTimeout(700)

  // into the 3D world
  await page.getByText('Explore in 3D').first().click()
  await page.waitForTimeout(3200)
  await page.evaluate(WALK_DRIVER)
  // dismiss the tutorial card if it is up (force — the slow render keeps it "unstable")
  const skip = page.getByText('Skip', { exact: true }).first()
  if (await skip.isVisible().catch(() => false)) { await skip.click({ force: true }).catch(() => {}); await page.waitForTimeout(800) }

  console.log('doors registered:', await page.evaluate(() => (window as any).__lkl.doors().length))

  const enter = async (id: string): Promise<boolean> => {
    await page.evaluate((i: string) => (window as any).__lkl.enter(i), id)
    for (let i = 0; i < 12; i++) {
      await page.waitForTimeout(400)
      if ((await page.evaluate(() => (window as any).__lkl.scene())) === 'interior') return true
    }
    return false
  }
  /** walk deep into the room so the follow-cam (clamped behind spawn) shows the interior */
  const stepIn = async (): Promise<void> => {
    for (let i = 0; i < 4; i++) {
      await page.evaluate(() => (window as any).__lkl.stick(0, -1))
      await page.waitForTimeout(650)
    }
    await page.evaluate(() => (window as any).__lkl.stick(0, 0))
    await page.waitForTimeout(900)
  }
  const exitInterior = async (): Promise<void> => {
    const btn = page.getByText('Outside', { exact: true }).first()
    if (await btn.isVisible().catch(() => false)) {
      await btn.click()
      await page.waitForTimeout(1600)
    }
  }

  // ---- 1. Crowther Memorial (level 1) — arrive at the gate for the compound
  // shot, then straight into the science lab. NOTE: headless software-GL runs
  // the scene ~7× slow — poll until the arrival actually teleports the player.
  const homePos = await page.evaluate(() => (window as any).__lkl.pos())
  await page.evaluate(() => (window as any).__lkl.travel('crowther-memorial'))
  let arrived = false
  for (let i = 0; i < 44; i++) {
    await page.waitForTimeout(700)
    const p = await page.evaluate(() => (window as any).__lkl.pos())
    if (Math.hypot(p.x - homePos.x, p.z - homePos.z) > 20) { arrived = true; break }
  }
  console.log('arrived crowther:', arrived)
  await page.waitForTimeout(1200)
  // walk toward the buildings so the follow-cam frames the compound
  for (let i = 0; i < 9; i++) {
    await page.evaluate(() => (window as any).__lkl.stick(0, -1))
    await page.waitForTimeout(650)
  }
  await page.evaluate(() => (window as any).__lkl.stick(0, 0))
  await page.waitForTimeout(1500)
  await page.screenshot({ path: `${SHOTS}/01-crowther-compound.png` })
  console.log('enter sci-lab:', await enter('crowther-memorial-sci-lab'))
  await stepIn()
  await page.screenshot({ path: `${SHOTS}/02-science-lab.png` })
  await exitInterior()

  // ---- 2. FUL Felele — the Senate Building, entered straight from the hook
  console.log('enter senate:', await enter('ful-felele-senate'))
  await stepIn()
  await page.screenshot({ path: `${SHOTS}/03-senate-council.png` })
  await exitInterior()

  // ---- 3. FUL hostels — the bunk room + lockers + ablution
  console.log('enter hostel:', await enter('ful-felele-hostel'))
  await stepIn()
  await page.screenshot({ path: `${SHOTS}/04-hostel-bunks.png` })
  await exitInterior()

  // ---- 4. FUL Adankolo — the gross anatomy lab
  console.log('enter anatomy:', await enter('ful-adankolo-anatomy'))
  await stepIn()
  await page.screenshot({ path: `${SHOTS}/05-anatomy-lab.png` })
  await exitInterior()

  // ---- 5. KSP engineering workshop
  console.log('enter workshop:', await enter('ksp-felele-workshop'))
  await stepIn()
  await page.screenshot({ path: `${SHOTS}/06-workshop.png` })
  await exitInterior()

  console.log('console errors:', errors.length ? errors.slice(0, 4) : 'none')
  await browser.close()
  console.log('E2E DONE')
}

run().catch((e) => { console.error('E2E FAILED:', String(e).slice(0, 300)); process.exit(1) })
