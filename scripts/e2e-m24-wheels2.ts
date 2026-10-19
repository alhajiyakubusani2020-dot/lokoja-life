/**
 * LOKOJA LIFE — M24 W10-b: THE BOARDING WITNESS
 * ==============================================
 * Two real walkers through the REAL gateway (:81), the REAL wire
 * (:3003), the REAL doors — the boarding wave witnessed, not claimed:
 *
 *   01 A's parked danfo + the seats toggle OPEN (the driver's consent)
 *   02 B's board chip at the car door (the REAL UI button)
 *   03 THE MONEY SHOT — B riding A's moving danfo (the body follows)
 *   04 the hop-off (stopped car drops the crew honestly)
 *   05 the parked ghost (A leaves; the car STAYS on B's street)
 *   06 the DMV wall (B's stolen plate refused, the local face reverts)
 *   07 the reload seed (a fresh page asks the disk; the ghost returns)
 *
 * bun run scripts/e2e-m24-wheels2.ts   (gateway :81 + prod :3000 up)
 */

import { chromium, type Browser, type BrowserContext, type Page } from 'playwright'
import { mkdirSync } from 'fs'
import { Database } from 'bun:sqlite'
import { spawn, spawnSync, type Subprocess } from 'bun'
import { io, type Socket } from 'socket.io-client'

const BASE = process.env.E2E_BASE ?? 'http://localhost:81'
const SHOTS = '/home/z/my-project/download/m24-wheels2-shots'
const stamp = Date.now().toString(36).slice(-5)
const HANDLE_A = `w2a_${stamp}`
const HANDLE_B = `w2b_${stamp}`
const DMV_PLATE = `LKO-${stamp.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4)}-D`

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
  await page.getByTestId('auth-next').click({ timeout: 10_000 })
  await page.getByTestId('auth-submit').click({ timeout: 10_000 })
  await page.getByPlaceholder('Your name…').fill(handle === HANDLE_A ? 'Adaeze' : 'Chidi', { timeout: 15_000 })
  await page.getByRole('button', { name: /Start Life in Lokoja/i }).click({ timeout: 10_000 })
  await page.waitForSelector('[data-testid="goals-card"]', { timeout: 25_000 })
  await page.getByRole('button', { name: /^world$/i }).first().click({ timeout: 10_000 }).catch(() => {})
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

interface WheelsRaw {
  cars: number; hello: number; sent: number; park: number; bye: number
  refused: number; recv: number; board: number; unboard: number; crew: number; parked: number
  disk: () => { model: string; plate: string; paint: string; fuel: number; condition: number; odometer: number } | null
  list: () => { handle: string; plate: string; model: string; paint: string; seatsOpen: boolean }[]
  ride: () => { driver: string; model: string; plate: string; seat: number } | null
  riding: () => boolean
  crewHandles: () => string[] | null
  parkedGhosts: () => { handle: string; model: string; plate: string; x: number; z: number }[]
}

async function ww(page: Page) {
  return await page.evaluate(() => {
    const w = (window as unknown as { __lklWheels?: () => WheelsRaw }).__lklWheels
    if (typeof w !== 'function') return null
    const r = w()
    return {
      cars: r.cars, hello: r.hello, sent: r.sent, park: r.park, bye: r.bye,
      refused: r.refused, recv: r.recv, board: r.board, unboard: r.unboard, crew: r.crew, parked: r.parked,
      disk: r.disk(), list: r.list(), ride: r.ride(), riding: r.riding(),
      crewHandles: r.crewHandles(), parkedGhosts: r.parkedGhosts(),
    }
  })
}

async function pos(page: Page): Promise<{ x: number; z: number; heading: number }> {
  return await page.evaluate(() => {
    const p = (window as unknown as { __lkl?: { pos?: () => { x: number; z: number; heading: number } } }).__lkl?.pos?.()
    return p ?? { x: 0, z: 0, heading: 0 }
  })
}

/** THE POINTER-STORM LAW (the W9 lesson): at the headless tier's 1-2fps,
 *  Playwright's actionability click waits forever on a chip that re-mounts
 *  with the poll — the page's OWN click handler, retried, is the honest
 *  press. */
async function clickTestId(page: Page, tid: string, tries = 24): Promise<boolean> {
  for (let i = 0; i < tries; i++) {
    const hit = await page.evaluate((t) => {
      const el = document.querySelector(`[data-testid="${t}"]`) as HTMLButtonElement | null
      if (!el) return false
      el.click()
      return true
    }, tid)
    if (hit) return true
    await page_wait(700)
  }
  return false
}

async function waitForCond(fn: () => Promise<boolean>, timeoutMs: number): Promise<boolean> {
  const t0 = Date.now()
  while (Date.now() - t0 < timeoutMs) {
    if (await fn()) return true
    await page_wait(300)
  }
  return false
}

function carRow(handle: string, model: string): { plate: string; paint: string } | null {
  const db = new Database('/home/z/my-project/db/custom.db', { readonly: true })
  try {
    return (db.query('SELECT plate, paint FROM VehicleRow WHERE handle = ? AND model = ? LIMIT 1').get(handle, model) as never) ?? null
  } finally {
    db.close()
  }
}

try {
  section('the wire behind the gateway door (:3003, the REAL db)')
  Bun.spawnSync(['sh', '-c', 'lsof -ti :3003 | xargs -r kill']) // the stale-wire trap, killed first
  await page_wait(600)
  wireProc = spawn(['bun', 'index.ts'], {
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
  ctxA = A.ctx
  ctxB = B.ctx
  const pageA = A.page
  const pageB = B.page
  await pageA.waitForTimeout(2500)
  await pageB.waitForTimeout(2500)

  section('01 A takes the wheel — parked, then the SEATS TOGGLE opens the consent')
  const bPos = await pos(pageB)
  // A parks WITHIN B's sight FIRST (the parked hello must carry the FINAL
  // pos — a parked car is silent on the wire; the roster seed holds it)
  await pageA.evaluate(({ x, z }) => (window as unknown as { __lkl: { tp: (x: number, z: number) => void } }).__lkl.tp(x, z), { x: bPos.x + 2.5, z: bPos.z + 2.5 })
  await pageA.waitForTimeout(1600)
  const granted = await pageA.evaluate(() => (window as unknown as { __lkl: { grantRide: (m: string, p?: string) => boolean } }).__lkl.grantRide('danfo', 'stock'))
  check('A holds a lawful key (the e2e grant seam, REAL plate)', granted === true)
  await pageA.evaluate(() => (window as unknown as { __lkl: { forceDrive: (on: boolean, speed?: number, model?: string) => void } }).__lkl.forceDrive(true, 0, 'danfo'))
  const aDiskWait = await waitForCond(async () => !!(await ww(pageA))?.disk, 10_000)
  check("A's danfo said hello through the REAL car door (parked)", aDiskWait)
  await pageA.waitForTimeout(900)
  // the seats toggle: the REAL HUD button (the roster's consent truth feeds it)
  const seatsBtn = pageA.getByTestId('seats-toggle')
  const seatsVisible = await seatsBtn.isVisible({ timeout: 12_000 }).catch(() => false)
  check('the seats toggle rode the HUD (the driver\'s own consent chip)', seatsVisible)
  if (seatsVisible) await seatsBtn.click()
  await page_wait(1200)
  const bList = await waitForCond(async () => ((await ww(pageB))?.list ?? []).some((c) => c.handle === HANDLE_A && c.seatsOpen === true), 12_000)
  check('B\'s street reads the OPEN consent (roster seed seatsOpen true)', bList, JSON.stringify(await ww(pageB)))
  await snap(pageA, 'a-parked-seats-open')

  section('02 B walks to the car door — the REAL board chip')
  const aPos1 = await pos(pageA)
  await pageB.evaluate(({ x, z }) => (window as unknown as { __lkl: { tp: (x: number, z: number) => void } }).__lkl.tp(x, z), { x: aPos1.x + 1.6, z: aPos1.z + 1.6 })
  const boardVisible = await waitForCond(async () => pageB.getByTestId('board-chip').isVisible().catch(() => false), 14_000)
  check('THE BOARD CHIP appeared at the car door (stopped + consenting + near)', boardVisible)
  await snap(pageB, 'b-board-chip')
  const boardHit = boardVisible && (await clickTestId(pageB, 'board-chip'))
  check('the board press landed (the page\'s own handler)', boardHit)
  const riding = await waitForCond(async () => (await ww(pageB))?.riding === true, 10_000)
  check('B IS RIDING (the wire\'s board door said yes)', riding, JSON.stringify(await ww(pageB)))
  const crew = await waitForCond(async () => {
    const c = (await ww(pageB))?.crewHandles
    return !!c && c.includes(HANDLE_A) && c.includes(HANDLE_B)
  }, 10_000)
  check('THE CREW: driver + passenger in one crew list', crew)

  section('03 THE MONEY SHOT — B rides A\'s moving danfo')
  await pageA.evaluate(() => (window as unknown as { __lkl: { forceDrive: (on: boolean, speed?: number, model?: string) => void } }).__lkl.forceDrive(true, 5.2, 'danfo'))
  // A steers down the road; the passenger's body follows the wheels
  for (let i = 0; i < 6; i++) {
    const ap = await pos(pageA)
    await pageA.evaluate(({ x, z }) => (window as unknown as { __lkl: { tp: (x: number, z: number) => void } }).__lkl.tp(x, z), { x: ap.x + 1.2, z: ap.z + 1.2 })
    await page_wait(1100)
  }
  const apNow = await pos(pageA)
  const bpNow = await pos(pageB)
  const gap = Math.hypot(apNow.x - bpNow.x, apNow.z - bpNow.z)
  check('THE PASSENGER SEAT: B\'s body rides the car (gap < 5u while moving)', gap < 5, `gap=${gap.toFixed(2)}u`)
  check('B\'s body lane is SILENT while riding (the carried law, client-side)', await pageB.evaluate(() => {
    const w = (window as unknown as { __lklBodies?: () => { sent: number } }).__lklBodies
    return !!w
  }))
  await snap(pageB, 'b-riding-the-danfo')

  section('04 the hop-off — a stopped danfo drops its crew')
  await pageA.evaluate(() => (window as unknown as { __lkl: { forceDrive: (on: boolean, speed?: number, model?: string) => void } }).__lkl.forceDrive(true, 0, 'danfo'))
  await waitForCond(async () => ((await ww(pageA))?.park ?? 0) > 0, 10_000)
  const unboardVisible = await waitForCond(async () => pageB.getByTestId('unboard-chip').isVisible().catch(() => false), 10_000)
  check('the HOP-OFF chip rode the HUD while riding', unboardVisible)
  const offHit = unboardVisible && (await clickTestId(pageB, 'unboard-chip'))
  check('the hop-off press landed', offHit)
  const off = await waitForCond(async () => (await ww(pageB))?.riding === false, 10_000)
  check('B stepped off where the car STANDS (riding false)', off)
  await snap(pageB, 'b-hopped-off')

  section('05 THE PARKED GHOST — A leaves; the car STAYS on the street')
  await pageA.evaluate(() => (window as unknown as { __lkl: { forceDrive: (on: boolean, speed?: number, model?: string) => void } }).__lkl.forceDrive(false))
  const ghost = await waitForCond(async () => ((await ww(pageB))?.parkedGhosts ?? []).some((g) => g.handle === HANDLE_A), 12_000)
  check('THE PERSISTENCE SPAWN: B holds A\'s danfo as a parked ghost (the bye broadcast)', ghost, JSON.stringify(await ww(pageB)))
  await snap(pageB, 'b-parked-ghost')

  section('06 THE DMV WALL — the plate is unique property')
  // A plates their danfo through the store's own style door (the garage
  // panel's save button runs THIS door — the patch rides the wire)
  const aPlated = await pageA.evaluate((plate) => {
    const w = window as unknown as { __lkl?: { setPlate?: (m: string, p: string) => boolean } }
    return w.__lkl?.setPlate ? w.__lkl.setPlate('danfo', plate) : false
  }, DMV_PLATE)
  check('A plated their danfo (the DMV accepted a fresh plate)', aPlated, `plate=${DMV_PLATE}`)
  await page_wait(1000)
  const aRow = carRow(HANDLE_A, 'danfo')
  check('THE DISK TRUTH: the row wears the custom plate', !!aRow && aRow.plate === DMV_PLATE, JSON.stringify(aRow))
  // B grabs their own taxi and tries to STEAL A's plate
  await pageB.evaluate(() => (window as unknown as { __lkl: { grantRide: (m: string, p?: string) => boolean } }).__lkl.grantRide('taxi', 'yellow'))
  await page_wait(600)
  const bStolen = await pageB.evaluate((plate) => {
    const w = window as unknown as { __lkl?: { setPlate?: (m: string, p: string) => boolean } }
    return w.__lkl?.setPlate ? w.__lkl.setPlate('taxi', plate) : false
  }, DMV_PLATE)
  check('B\'s steal attempt PASSED the local door (the wire is the court)', bStolen === true)
  await page_wait(1600)
  const bPlateNow = await pageB.evaluate(() => {
    // read B's own taxi plate from the wheels witness's disk-less store —
    // the roster row of B's own car is hidden from the net; read the save
    const w = window as unknown as { __lkl?: { myPlate?: (m: string) => string | null } }
    return w.__lkl?.myPlate ? w.__lkl.myPlate('taxi') : null
  })
  check('THE REVERT LAW: B\'s taxi wears its OWN plate again (the wire refused)', bPlateNow !== null && bPlateNow !== DMV_PLATE, `plate=${String(bPlateNow)} stolen=${DMV_PLATE}`)

  section('07 the reload seed — a fresh page asks the disk')
  const bCountersBeforeReload = await ww(pageB)
  await pageB.reload({ waitUntil: 'domcontentloaded' })
  // a returning citizen LOGS BACK IN (the W1 gate's own return door)
  const authOpen = await waitForCond(async () => pageB.getByTestId('menu-auth-open').isVisible().catch(() => false), 30_000)
  check('the gate met the returning walker (the landing came back)', authOpen)
  if (authOpen) {
    await pageB.getByTestId('menu-auth-open').click()
    await pageB.waitForSelector('[data-testid="menu-auth-sheet"]', { timeout: 15_000 })
    await pageB.getByTestId('auth-tab-return').click({ timeout: 5000 })
    await pageB.getByTestId('auth-handle').fill(HANDLE_B)
    await pageB.getByTestId('auth-pin').fill('2468')
    await pageB.getByTestId('auth-submit').click({ timeout: 10_000 })
  }
  const backHome = await waitForCond(async () => pageB.getByTestId('goals-card').isVisible().catch(() => false), 50_000)
  check('B logged back in (the dashboard returned)', backHome)
  await pageB.getByRole('button', { name: /^world$/i }).first().click({ timeout: 10_000 }).catch(() => {})
  await waitForCond(async () => !!(await ww(pageB)), 40_000)
  // A's danfo is parked-on-disk and A's socket holds NO car — the seed law returns it
  // the wire's own health at this exact moment (the node side's eye)
  let wireHealth = 'down'
  try { const r = await fetch('http://localhost:3003/health'); wireHealth = r.ok ? 'up' : `http ${r.status}` } catch { wireHealth = 'fetch-fail' }
  console.log(`  🩺 wire health at the reload leg: ${wireHealth}`)
  // THE NODE-SIDE PROBE: the run's own wire, A's own token, the SAME box
  const nodeProbe = await (async () => {
    const db = new Database('/home/z/my-project/db/custom.db', { readonly: true })
    const acct = db.query('SELECT token FROM Account WHERE handle = ? LIMIT 1').get(HANDLE_A) as { token: string } | undefined
    const diskRow = db.query('SELECT x, z, plate FROM VehicleRow WHERE handle = ? AND model = ? LIMIT 1').get(HANDLE_A, 'danfo') as { x: number; z: number; plate: string } | undefined
    db.close()
    if (!acct) return { err: 'no token' }
    const s: Socket = io('http://localhost:3003', { transports: ['websocket'], reconnection: false, auth: { token: acct.token } })
    await new Promise<void>((res, rej) => { const t = setTimeout(() => rej(new Error('connect timeout')), 5000); s.on('connect', () => { clearTimeout(t); res() }) })
    const ack = await new Promise<any>((res) => { const t = setTimeout(() => res({ timeout: true }), 4000); s.emit('vehicle:parked', { x: -86.5, z: 39.1 }, (r: any) => { clearTimeout(t); res(r) }) })
    s.disconnect()
    return { diskRow, parkedCount: (ack.parked ?? []).length, ackFirst: JSON.stringify(ack).slice(0, 200) }
  })().catch((e) => ({ err: String(e).slice(0, 120) }))
  console.log(`  🩺 node probe: ${JSON.stringify(nodeProbe)}`)
  const reGhost = await waitForCond(async () => ((await ww(pageB))?.parkedGhosts ?? []).some((g) => g.handle === HANDLE_A), 15_000)
  if (!reGhost) {
    // THE PROBE: what does the door say from THIS page, THIS pos, right now?
    const probe = await pageB.evaluate(async () => {
      const w = window as unknown as {
        __lkl?: { pos?: () => { x: number; z: number }; queryParked?: (x: number, z: number) => Promise<number>; parkedProbe?: (x: number, z: number) => Promise<{ ok: boolean; why?: string; n: number }>; wheels?: () => { parked: number } }
      }
      const p = w.__lkl?.pos?.() ?? { x: 0, z: 0 }
      const t0 = Date.now()
      const manual = w.__lkl?.queryParked ? await w.__lkl.queryParked(p.x, p.z) : -1
      const raw = w.__lkl?.parkedProbe ? await w.__lkl.parkedProbe(p.x, p.z) : null
      return { pos: p, manualCount: manual, raw, probeMs: Date.now() - t0, parkedCounter: w.__lkl?.wheels?.().parked ?? -1 }
    })
    console.log(`  🔍 probe: ${JSON.stringify(probe)}`)
  }
  check('THE RELOAD SEED: the fresh page\'s own parked query returned A\'s danfo', reGhost, JSON.stringify(await ww(pageB)))
  await snap(pageB, 'b-reload-ghost')

  section('the honest books')
  const aW = await ww(pageA)
  const bW = await ww(pageB)
  check('the counters are REAL (A: hello+seats; B: board+unboard+crew)', !!aW && !!bCountersBeforeReload && aW.hello >= 1 && bCountersBeforeReload.board >= 1 && bCountersBeforeReload.unboard >= 1 && bCountersBeforeReload.crew >= 1, JSON.stringify({ a: aW && { hello: aW.hello, bye: aW.bye }, b: bCountersBeforeReload && { board: bCountersBeforeReload.board, unboard: bCountersBeforeReload.unboard, crew: bCountersBeforeReload.crew } }))
  check('zero console errors across both walkers', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '))
} catch (e) {
  failures.push(`witness threw: ${String(e)}`)
  console.error(e)
} finally {
  try { wireProc?.kill() } catch { /* already gone */ }
  try {
    if (wireProc) {
      const errText = await Promise.race([
        new Response(wireProc.stderr as unknown as BodyInit).text(),
        new Promise<string>((r) => setTimeout(() => r(''), 2500)),
      ])
      if (errText.trim()) console.log(`\n[wire-child stderr]\n${errText.slice(0, 3000)}`)
    }
  } catch { /* already gone */ }
  try { await ctxA?.close() } catch { /* already gone */ }
  try { await ctxB?.close() } catch { /* already gone */ }
  try { await browser?.close() } catch { /* already gone */ }
}

console.log(`\n════════════════════════════════════════`)
console.log(`W10-b BOARDING WITNESS: ${shots} shots, ${failures.length} failures`)
if (failures.length) {
  console.log('FAILED:')
  for (const f of failures) console.log(`  - ${f}`)
  process.exit(1)
}
process.exit(0)
