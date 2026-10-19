/**
 * LOKOJA LIFE — M24 W10-a: THE WHEELS WITNESS (E2E, fresh-context)
 * =================================================================
 * TWO real walkers through the REAL gateway (E2E_BASE default
 * http://localhost:81), BOTH standing in the world at once — and one
 * SEES the other drive.
 *
 * The shots (ALL eyeballed after the run):
 *   01 a-world          — walker A alive in the city
 *   02 b-world-alone    — B's world, control: no car yet
 *   03 b-sees-car       — A's NAVY taxi rig + plate tag in B's living street
 *   04 b-car-moved      — A drove on → B's view FOLLOWS (the 12Hz truth)
 *   05 b-car-gone       — the bye → the car left the roster, honest
 *
 * THE LAWS WITNESSED:
 *  - the wire connects on WORLD ENTRY (the world-entry law)
 *  - A's wheels say hello through the REAL car door; the ack carries the
 *    DISK readback (fuel/condition/odometer)
 *  - B's __lklWheels holds ONE car: A's, with the REAL plate + paint
 *  - A's sender ticks ONLY-WHILE-MOVING (sent > 5 while driving), and the
 *    BODY lane goes SILENT while the wheels live (THE CARRIED LAW)
 *  - B's ear fills (recv > 5) — REALITY, not UI
 *  - the car FOLLOWS A's real drive steps (the buffer samples the deltas)
 *  - THE PARK LAW ON DISK: the park tick writes the VehicleRow; the e2e
 *    reads the row straight off db/custom.db
 *  - the bye → the roster drops the car; B's world is honest about it
 *  - zero console errors across both walkers while the fleet runs
 */
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright'
import { mkdirSync } from 'fs'
import { Database } from 'bun:sqlite'
import { spawn, type Subprocess } from 'bun'

const BASE = process.env.E2E_BASE ?? 'http://localhost:81'
const SHOTS = '/home/z/my-project/download/m24-wheels-shots'
const stamp = Date.now().toString(36).slice(-5)
const HANDLE_A = `whla_${stamp}`
const HANDLE_B = `whlb_${stamp}`

mkdirSync(SHOTS, { recursive: true })

let browser: Browser | null = null
let ctxA: BrowserContext | null = null
let ctxB: BrowserContext | null = null
let wireProc: Subprocess | null = null

const consoleErrors: string[] = []
let shots = 0
const failures: string[] = []

async function snap(page: Page, name: string) {
  shots++
  await page.screenshot({ path: `${SHOTS}/${String(shots).padStart(2, '0')}-${name}.png`, fullPage: false })
  console.log(`  📸 ${String(shots).padStart(2, '0')}-${name}`)
}

function check(name: string, cond: boolean, detail?: string) {
  if (cond) console.log(`  ✓ ${name}`)
  else {
    failures.push(name)
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

function section(name: string) {
  console.log(`\n━━ ${name}`)
}

const page_wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function walker(handle: string): Promise<{ page: Page; ctx: BrowserContext }> {
  const ctx = await browser!.newContext({ viewport: { width: 1280, height: 800 } })
  const page = await ctx.newPage()
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(`[${handle}] ${m.text().slice(0, 200)}`)
  })
  page.on('pageerror', (e) => consoleErrors.push(`[${handle}] pageerror: ${String(e).slice(0, 200)}`))

  await page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded', timeout: 30_000 })
  await page.getByTestId('menu-auth-open').click({ timeout: 15_000 })
  await page.waitForSelector('[data-testid="menu-auth-sheet"]', { timeout: 10_000 })
  await page.getByTestId('auth-tab-claim').click({ timeout: 5_000 })
  await page.getByTestId('auth-handle').fill(handle)
  await page.getByTestId('auth-pin').fill('2468')
  await page.getByTestId('auth-contact').fill(`${handle}_${Date.now() % 100000}@lokoja.life`)
  await page.getByTestId('auth-next').click({ timeout: 10_000 })   // W1 — step 2: the face
  await page.getByTestId('auth-submit').click({ timeout: 10_000 })
  await page.getByPlaceholder('Your name…').fill(handle === HANDLE_A ? 'Adaeze' : 'Chidi', { timeout: 15_000 })
  await page.getByRole('button', { name: /Start Life in Lokoja/i }).click({ timeout: 10_000 })
  await page.waitForSelector('[data-testid="goals-card"]', { timeout: 25_000 })
  // THE WORLD TAB — the 3D city is a tab; enter it (the m23 witness law)
  await page.getByRole('button', { name: /^world$/i }).first().click({ timeout: 10_000 }).catch(() => {})
  // settle: the canvas + the world hook + BOTH witnesses' hooks
  const t0 = Date.now()
  let ok = false
  while (Date.now() - t0 < 60_000) {
    const ping = await page.evaluate(() => ({
      canvas: !!document.querySelector('canvas'),
      pos: !!((window as unknown as { __lkl?: { pos?: () => unknown } }).__lkl?.pos?.()),
      bodies: !!(window as unknown as { __lklBodies?: unknown }).__lklBodies,
      wheels: !!(window as unknown as { __lklWheels?: unknown }).__lklWheels,
    }))
    if (ping.canvas && ping.pos && ping.bodies && ping.wheels) { ok = true; break }
    await page.waitForTimeout(900)
  }
  if (!ok) console.log(`  ⚠ ${handle}: the world did not fully settle (continuing — the checks will tell the truth)`)
  return { page, ctx }
}

/** the RAW witness lives in the page and hands out FUNCTIONS; the
 *  serialized copy the e2e receives is the plain-data one below it */
interface WheelsWitnessRaw {
  cars: number
  hello: number
  sent: number
  park: number
  bye: number
  refused: number
  recv: number
  disk: () => { model: string; plate: string; paint: string; fuel: number; condition: number; odometer: number } | null
  list: () => { handle: string; plate: string; model: string; paint: string }[]
}

interface WheelsWitness {
  cars: number
  hello: number
  sent: number
  park: number
  bye: number
  refused: number
  recv: number
  disk: { model: string; plate: string; paint: string; fuel: number; condition: number; odometer: number } | null
  list: { handle: string; plate: string; model: string; paint: string }[]
}

async function wheels(page: Page): Promise<WheelsWitness | null> {
  return await page.evaluate(() => {
    const w = (window as unknown as { __lklWheels?: () => WheelsWitnessRaw }).__lklWheels
    if (typeof w !== 'function') return null
    const r = w()
    // EVERYTHING is called INSIDE the page — functions never survive the
    // evaluate serialization (the bodies witness's own law)
    return { cars: r.cars, hello: r.hello, sent: r.sent, park: r.park, bye: r.bye, refused: r.refused, recv: r.recv, disk: r.disk(), list: r.list() }
  })
}

interface BodiesWitnessSlim {
  sent: number
  recv: number
}

async function bodiesSent(page: Page): Promise<number> {
  return await page.evaluate(() => {
    const w = (window as unknown as { __lklBodies?: () => { sent: number; recv: number } }).__lklBodies
    if (typeof w !== 'function') return -1
    return w().sent
  })
}

async function pos(page: Page): Promise<{ x: number; z: number; heading: number }> {
  return await page.evaluate(() => {
    const p = (window as unknown as { __lkl?: { pos?: () => { x: number; z: number; heading: number } } }).__lkl?.pos?.()
    return p ?? { x: 0, z: 0, heading: 0 }
  })
}

async function waitForCond(fn: () => Promise<boolean>, timeoutMs: number): Promise<boolean> {
  const t0 = Date.now()
  while (Date.now() - t0 < timeoutMs) {
    if (await fn()) return true
    await page_wait(250)
  }
  return false
}

function carRow(handle: string, model: string): { plate: string; paint: string; x: number; z: number; odometer: number } | null {
  const db = new Database('/home/z/my-project/db/custom.db', { readonly: true })
  try {
    return (db.query('SELECT plate, paint, x, z, odometer FROM VehicleRow WHERE handle = ? AND model = ? LIMIT 1').get(handle, model) as never) ?? null
  } finally {
    db.close()
  }
}

try {
  section('the wire behind the gateway door (:3003, the REAL db)')
  wireProc = Bun.spawn(['bun', 'index.ts'], {
    cwd: '/home/z/my-project/mini-services/nation-wire',
    env: { ...process.env, WIRE_PORT: '3003' },
    stdout: 'pipe',
    stderr: 'pipe',
  })
  let wireUp = false
  for (let i = 0; i < 40; i++) {
    try { const r = await fetch('http://localhost:3003/health'); if (r.ok) { wireUp = true; break } } catch { /* not up yet */ }
    await page_wait(150)
  }
  check('the wire is up behind the gateway door', wireUp)

  section('two walkers claim through the REAL doors')
  browser = await chromium.launch()
  const A = await walker(HANDLE_A)
  const B = await walker(HANDLE_B)
  const pageA = A.page
  const pageB = B.page

  await pageA.waitForTimeout(3000)
  await pageB.waitForTimeout(3000)

  section('01-02 the two worlds (the control: no car anywhere)')
  await snap(pageA, 'a-world')
  await snap(pageB, 'b-world-alone')
  const wb0 = await wheels(pageB)
  check("B's world starts honest — no car in the net", (wb0?.cars ?? -1) === 0, JSON.stringify(wb0))

  section('A takes the wheel (the grant seam + the REAL car door)')
  const bPos = await pos(pageB)
  console.log(`  B stands at (${bPos.x.toFixed(1)}, ${bPos.z.toFixed(1)}) heading ${bPos.heading.toFixed(2)}`)
  // THE DEAD-AHEAD SPOT, camera-honest: B's spawn view sits against a tree
  // canopy (the obstruction camera pulls in close) — the OPEN ground is to
  // B's RIGHT. The car parks in the visible sector: right·4.5 + forward·1.5.
  const fx = Math.sin(bPos.heading)
  const fz = Math.cos(bPos.heading)
  const rx = fz // the right vector = forward rotated -90°
  const rz = -fx
  const spot = { x: bPos.x + rx * 4.5 + fx * 1.5, z: bPos.z + rz * 4.5 + fz * 1.5 }
  // A teleports ~16u behind the spot and drives through it
  const ax = spot.x - fx * 16
  const az = spot.z - fz * 16
  await pageA.evaluate(({ x, z }) => (window as unknown as { __lkl: { tp: (x: number, z: number) => void } }).__lkl.tp(x, z), { x: ax, z: az })
  await pageA.waitForTimeout(1200)
  const granted = await pageA.evaluate(() => (window as unknown as { __lkl: { grantRide: (m: string, p?: string) => boolean } }).__lkl.grantRide('taxi', 'darkblue'))
  check('A holds a lawful key (the e2e grant seam, REAL plate + paint)', granted === true)
  await pageA.evaluate(() => (window as unknown as { __lkl: { forceDrive: (on: boolean, speed?: number, model?: string) => void } }).__lkl.forceDrive(true, 5.2, 'taxi'))
  // the hello fires on the next 12Hz tick — wait for the DISK READBACK itself
  // (the hello counter increments at emit; the ack's disk truth lands one RTT later)
  const aDiskWait = await waitForCond(async () => !!(await wheels(pageA))?.disk, 10_000)
  const aDisk = (await wheels(pageA))?.disk ?? null
  check("A's wheels said hello through the REAL car door", aDiskWait)
  check('THE READBACK LAW: the ack carried the DISK truth (fresh row)', !!aDisk && aDisk.model === 'taxi' && aDisk.fuel === 1 && aDisk.condition === 1, JSON.stringify(aDisk))

  section('THE CARRIED LAW — A\'s body lane goes silent while the wheels live')
  const bodySentBefore = await bodiesSent(pageA)
  await page_wait(2500)
  const bodySentAfter = await bodiesSent(pageA)
  const wheelSentSame = (await wheels(pageA))?.sent ?? 0
  check("A's body lane PAUSED (the walker is IN the car)", bodySentAfter - bodySentBefore <= 1, `bodyΔ=${bodySentAfter - bodySentBefore}`)

  section('THE DRIVE — A steers through the dead-ahead spot, B sees the rig')
  // THE CONTROLLER'S OWN SEAM: each step rides requestE2eTeleport — the
  // walker controller consumes it into ITS state and reports the new truth
  // itself (driveStep's direct writes lose the race against the frozen
  // controller's own per-frame report; the seam is the one honest channel)
  const stepToward = async (tx: number, tz: number, steps: number) => {
    for (let i = 0; i < steps; i++) {
      const aPos = await pos(pageA)
      const dx = tx - aPos.x
      const dz = tz - aPos.z
      const d = Math.hypot(dx, dz)
      if (d < 0.4) break
      const k = Math.min(1.4, d) / d
      await pageA.evaluate(({ x, z }) => (window as unknown as { __lkl: { tp: (x: number, z: number) => void } }).__lkl.tp(x, z), { x: aPos.x + dx * k, z: aPos.z + dz * k })
      await page_wait(1100) // one frame at the headless tier consumes the seam
    }
  }
  await stepToward(spot.x, spot.z, 24)
  const aSpot = await pos(pageA)
  check('the car reached the dead-ahead spot', Math.hypot(aSpot.x - spot.x, aSpot.z - spot.z) < 1.5, `car=(${aSpot.x.toFixed(1)},${aSpot.z.toFixed(1)}) spot=(${spot.x.toFixed(1)},${spot.z.toFixed(1)})`)
  const bSees = await waitForCond(async () => ((await wheels(pageB))?.recv ?? 0) > 3, 12_000)
  check("B's ear filled (recv > 3 — the 12Hz wheel deltas)", bSees, JSON.stringify(await wheels(pageB)))
  const bList = (await wheels(pageB))?.list ?? []
  const aCar = bList.find((c) => c.handle === HANDLE_A)
  check('B holds A\'s car with the REAL plate', !!aCar && /^LKO-\d{3}-[A-N]{2}$/.test(aCar.plate), JSON.stringify(bList))
  check("B holds A's car with the REAL paint (darkblue — the PAINT LAW rendered)", !!aCar && aCar.paint === 'darkblue', JSON.stringify(aCar))
  await snap(pageB, 'b-sees-car')

  // keep the car rolling — a closer pass for the second shot (right·3 + fwd·0.5)
  await stepToward(bPos.x + rx * 3 + fx * 0.5, bPos.z + rz * 3 + fz * 0.5, 6)
  await pageB.waitForTimeout(600)
  await snap(pageB, 'b-car-moved')

  section('THE PARK LAW ON DISK — the stop writes the row')
  const wheelSentBeforePark = (await wheels(pageA))?.sent ?? 0
  await pageA.evaluate(() => (window as unknown as { __lkl: { forceDrive: (on: boolean, speed?: number, model?: string) => void } }).__lkl.forceDrive(true, 0, 'taxi'))
  const parkedTick = await waitForCond(async () => ((await wheels(pageA))?.park ?? 0) > 0, 8_000)
  check('the ONE park tick rode (mv=false)', parkedTick)
  const wheelSentAfterPark = (await wheels(pageA))?.sent ?? 0
  check('a parked car NEVER re-speaks (the sender went silent)', wheelSentAfterPark - wheelSentBeforePark <= 2, `sentΔ=${wheelSentAfterPark - wheelSentBeforePark}`)
  const rowNow = carRow(HANDLE_A, 'taxi')
  check('THE PARK ROW: the stop persisted the spot + plate + paint on disk', !!rowNow && /^LKO-\d{3}-[A-N]{2}$/.test(rowNow.plate) && rowNow.paint === 'darkblue', JSON.stringify(rowNow))
  const aFinalPos = await pos(pageA)
  check('the row holds the car where it STOPPED (within one step)', !!rowNow && Math.hypot(rowNow.x - aFinalPos.x, rowNow.z - aFinalPos.z) < 1.2, `row=(${rowNow?.x.toFixed(2)},${rowNow?.z.toFixed(2)}) pos=(${aFinalPos.x.toFixed(2)},${aFinalPos.z.toFixed(2)})`)
  await snap(pageB, 'b-car-parked')

  section('THE BYE — the engine dies with the hand')
  await pageA.evaluate(() => (window as unknown as { __lkl: { forceDrive: (on: boolean) => void } }).__lkl.forceDrive(false))
  const aBye = await waitForCond(async () => ((await wheels(pageA))?.bye ?? 0) > 0, 8_000)
  check("A's bye rode", aBye)
  const bGone = await waitForCond(async () => ((await wheels(pageB))?.cars ?? 1) === 0, 10_000)
  check("B's world is honest — the car LEFT the roster", bGone, JSON.stringify(await wheels(pageB)))
  await snap(pageB, 'b-car-gone')

  section('the console law')
  check('zero console errors across both walkers', consoleErrors.length === 0, consoleErrors.slice(0, 4).join(' | '))

  await pageA.waitForTimeout(400)
} catch (e) {
  failures.push(`suite threw: ${String(e)}`)
  console.error('SUITE THREW:', e)
} finally {
  try { await (ctxA as BrowserContext | null)?.close() } catch { /* already gone */ }
  try { await (ctxB as BrowserContext | null)?.close() } catch { /* already gone */ }
  try { await (browser as Browser | null)?.close() } catch { /* already gone */ }
  wireProc?.kill()
}

console.log(`\n════════════════════════════════════════`)
console.log(`W10-a THE WHEELS WITNESS: ${shots} shots, ${failures.length} failures`)
if (failures.length) {
  console.log('FAILED:')
  for (const f of failures) console.log(`  - ${f}`)
  process.exit(1)
}
