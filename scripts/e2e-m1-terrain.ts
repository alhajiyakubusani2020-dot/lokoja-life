/**
 * M1 FINALE E2E — Mount Patti terrain art + the savanna tree guild.
 * Server must already be running on :3000 (boot ancestry).
 * Shots (mobile 390×844): the grassy summit crown, the terraced flanks from
 * above (strata bands + boulders), a baobab giant and an acacia umbrella on
 * the open plains — tree targets come from the deterministic layout data.
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'
import { TREES, ANCHOR_BY_ID, type TreeDef } from '../src/game/world3d/layout'

const BASE = 'http://localhost:3000'
const SHOTS = '/home/z/my-project/download/m1-terrain-shots'
const MODE = process.argv[2] ?? 'patti' // 'patti' | 'baobab' | 'acacia'
mkdirSync(SHOTS, { recursive: true })

const WALK_DRIVER = `window.__homer = async function(target, opts = {}) {
  const { steps = 90, reach = 2.0, step = 620 } = opts
  for (let i = 0; i < steps; i++) {
    const p = window.__lkl.pos()
    const dx = target.x - p.x
    const dz = target.z - p.z
    const d = Math.hypot(dx, dz)
    if (d < reach) { window.__lkl.stick(0, 0); return { ok: true, dist: d } }
    window.__lkl.stick(dx / d, dz / d)
    await new Promise((r) => setTimeout(r, step))
  }
  window.__lkl.stick(0, 0)
  const p = window.__lkl.pos()
  return { ok: false, dist: Math.hypot(target.x - p.x, target.z - p.z) }
}`

const run = async (): Promise<void> => {
  // deterministic targets from the same layout data the game renders
  const patti = ANCHOR_BY_ID['mount-patti']
  const uni = ANCHOR_BY_ID['university-area']
  const pdOf = (t: TreeDef): number => Math.hypot(t.x - patti.x, t.z - patti.z)
  const flankAcacia = TREES.filter((t) => t.kind === 'acacia').sort((a, b) => pdOf(a) - pdOf(b))[0]
  const baobab = TREES.filter((t) => t.kind === 'baobab').sort((a, b) => pdOf(a) - pdOf(b))[0]
  const plainsAcacia = TREES.filter((t) => t.kind === 'acacia' && t !== flankAcacia)
    .sort((a, b) => Math.hypot(a.x - uni.x, a.z - uni.z) - Math.hypot(b.x - uni.x, b.z - uni.z))[0]
  console.log('flank acacia:', flankAcacia?.x.toFixed(0), flankAcacia?.z.toFixed(0), 'pd=', pdOf(flankAcacia).toFixed(0))
  console.log('baobab:', baobab?.x.toFixed(0), baobab?.z.toFixed(0), 'pd=', pdOf(baobab).toFixed(0))
  console.log('plains acacia:', plainsAcacia?.x.toFixed(0), plainsAcacia?.z.toFixed(0))

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)) })

  await page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1200)
  await page.getByText('START YOUR LIFE').first().click()
  await page.waitForTimeout(400)
  await page.getByLabel('Character name').fill('Ada')
  await page.getByText('Start Life in Lokoja').first().click()
  await page.waitForTimeout(500)
  await page.getByText('Explore in 3D').first().click()
  await page.waitForTimeout(2400)
  await page.evaluate(WALK_DRIVER)
  const skip = page.getByText('Skip', { exact: true }).first()
  if (await skip.isVisible().catch(() => false)) { await skip.click({ force: true }).catch(() => {}); await page.waitForTimeout(500) }

  /** travel + wait for the arrival teleport (headless runs ~7× slow) */
  const travel = async (id: string): Promise<boolean> => {
    const homePos = await page.evaluate(() => (window as any).__lkl.pos())
    await page.evaluate((i: string) => (window as any).__lkl.travel(i), id)
    for (let i = 0; i < 64; i++) {
      await page.waitForTimeout(500)
      const p = await page.evaluate(() => (window as any).__lkl.pos())
      if (Math.hypot(p.x - homePos.x, p.z - homePos.z) > 20) return true
    }
    return false
  }

  /** drone look — dispatch wheel events straight on the canvas (deltaY>0 =
   * zoom out, 9%/tick), then drag the orbit UP toward the horizon */
  const droneCam = async (): Promise<void> => {
    const cx = 195
    const cy = 380
    await page.evaluate(() => {
      const cv = document.querySelector('canvas')
      for (let i = 0; i < 14; i++) {
        cv?.dispatchEvent(new WheelEvent('wheel', { deltaY: 900, bubbles: true, cancelable: true }))
      }
    })
    await page.waitForTimeout(1300)
    await page.mouse.move(cx, cy)
    await page.mouse.down()
    await page.mouse.move(cx, cy - 160, { steps: 8 })
    await page.mouse.up()
    await page.waitForTimeout(1400)
  }

  /** progressive walk — shots keep overwriting as the player advances, so a
   * dead browser still leaves the best frame reached before it died */
  const walkShots = async (
    stick: [number, number],
    presses: number,
    shot: string,
    every = 12,
  ): Promise<void> => {
    for (let i = 1; i <= presses; i++) {
      await page.evaluate((s: number[]) => (window as any).__lkl.stick(s[0], s[1]), stick)
      await page.waitForTimeout(540)
      if (i % every === 0) {
        await page.evaluate(() => (window as any).__lkl.stick(0, 0))
        await page.waitForTimeout(800)
        await page.screenshot({ path: shot })
      }
    }
    await page.evaluate(() => (window as any).__lkl.stick(0, 0))
  }

  if (MODE === 'patti') {
    // ---- 1. SUMMIT CROWN — the tower + the grassy savanna top on arrival
    console.log('travel mount-patti:', await travel('mount-patti'))
    await page.waitForTimeout(800)
    await page.screenshot({ path: `${SHOTS}/01-summit-crown.png` })

    // ---- 2. THE FLANK — drone zoom (70u rig) then walk ~36u off the crown:
    // the frame spans the terraces, boulders, the plains + town beyond.
    await droneCam()
    await walkShots([0.55, 0.84], 36, `${SHOTS}/02-patti-flanks.png`)
  } else if (MODE === 'baobab') {
    // ---- 3. THE BAOBAB GIANT — drone zoom, then ~48u down the west flank;
    // the giant at the mountain foot (pd 69) enters the frame from ~25u out.
    console.log('travel mount-patti:', await travel('mount-patti'))
    await page.waitForTimeout(800)
    await droneCam()
    await walkShots([-1, 0], 64, `${SHOTS}/03-baobab-plain.png`)
  } else {
    // ---- 4. THE ACACIA UMBRELLA on the open plains near the university
    console.log('travel university-area:', await travel('university-area'))
    await page.waitForTimeout(800)
    await droneCam()
    if (plainsAcacia) {
      const a = ANCHOR_BY_ID['university-area']
      const dx = plainsAcacia.x - a.x
      const dz = plainsAcacia.z - a.z
      const d = Math.hypot(dx, dz)
      await walkShots([dx / d, dz / d], 42, `${SHOTS}/04-acacia-umbrella.png`)
    }
  }

  await browser.close()
  console.log('console errors:', errors.length, errors.slice(0, 3))
  if (errors.length > 0) process.exit(1)
  console.log(`M1 TERRAIN E2E (${MODE}) DONE ✅`)
}

run().catch((e) => {
  console.error('E2E failed:', e)
  process.exit(1)
})
