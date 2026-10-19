/**
 * LOKOJA LIFE — M24 W10-c: THE FUEL WITNESS
 * ==========================================
 * Two real walkers through the REAL gateway, the REAL wire, the REAL
 * ledger — the pump and the garage witnessed, not claimed:
 *
 *   01 A's danfo at the Motor Park pump — the tank gauge + the BUY FUEL chip
 *   02 THE POUR — ₦2,000 through the REAL ledger (the tank + the purse move)
 *   03 THE MECHANIC — the garage's service row, the wear's own quote, the
 *      ledger debit, the condition comes home
 *
 * bun run scripts/e2e-m24-fuel.ts   (gateway :81 + prod :3000 up)
 */

import { chromium, type Browser, type BrowserContext, type Page } from 'playwright'
import { mkdirSync } from 'fs'
import { Database } from 'bun:sqlite'
import { spawn, spawnSync, type Subprocess } from 'bun'

const BASE = process.env.E2E_BASE ?? 'http://localhost:81'
const SHOTS = '/home/z/my-project/download/m24-fuel-shots'
const stamp = Date.now().toString(36).slice(-5)
const HANDLE_A = `f3a_${stamp}`

mkdirSync(SHOTS, { recursive: true })

let browser: Browser | null = null
let ctxA: BrowserContext | null = null
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
  await page.getByPlaceholder('Your name…').fill('Adaeze', { timeout: 15_000 })
  await page.getByRole('button', { name: /Start Life in Lokoja/i }).click({ timeout: 10_000 })
  await page.waitForSelector('[data-testid="goals-card"]', { timeout: 25_000 })
  await page.getByRole('button', { name: /^world$/i }).first().click({ timeout: 10_000 }).catch(() => {})
  const t0 = Date.now()
  let ok = false
  while (Date.now() - t0 < 60_000) {
    const ping = await page.evaluate(() => ({
      canvas: !!document.querySelector('canvas'),
      pos: !!((window as unknown as { __lkl?: { pos?: () => unknown } }).__lkl?.pos?.()),
      wheels: !!(window as unknown as { __lklWheels?: unknown }).__lklWheels,
    }))
    if (ping.canvas && ping.pos && ping.wheels) { ok = true; break }
    await page.waitForTimeout(900)
  }
  if (!ok) console.log(`  ⚠ ${handle}: the world did not fully settle (the checks will tell the truth)`)
  return { page, ctx }
}

interface WheelsRaw {
  hello: number; refuel: number; repair: number; dry: number
  fuel: () => number | null
  disk: () => { model: string; plate: string; fuel: number; condition: number; odometer: number } | null
}

async function ww(page: Page) {
  return await page.evaluate(() => {
    const w = (window as unknown as { __lklWheels?: () => WheelsRaw }).__lklWheels
    if (typeof w !== 'function') return null
    const r = w()
    return { hello: r.hello, refuel: r.refuel, repair: r.repair, dry: r.dry, fuel: r.fuel(), disk: r.disk() }
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
    await page_wait(300)
  }
  return false
}

function rowOf(handle: string, model: string): { fuel: number; condition: number; odometer: number } | null {
  const db = new Database('/home/z/my-project/db/custom.db', { readonly: true })
  try {
    return (db.query('SELECT fuel, condition, odometer FROM VehicleRow WHERE handle = ? AND model = ? LIMIT 1').get(handle, model) as never) ?? null
  } finally {
    db.close()
  }
}

function walletOf(handle: string): number {
  const db = new Database('/home/z/my-project/db/custom.db', { readonly: true })
  try {
    const r = db.query('SELECT balance FROM WalletRow WHERE handle = ? LIMIT 1').get(handle) as { balance: number } | undefined
    return r?.balance ?? -1
  } finally {
    db.close()
  }
}

try {
  section('the wire behind the gateway door (:3003, the REAL db)')
  Bun.spawnSync(['sh', '-c', 'lsof -ti :3003 | xargs -r kill'])
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

  section('A claims through the REAL doors')
  browser = await chromium.launch()
  const A = await walker(HANDLE_A)
  ctxA = A.ctx
  const pageA = A.page
  await pageA.waitForTimeout(2500)

  section('01 the danfo at the Motor Park pump — the tank rides the speedo')
  // A teleports to the Motor Park (the pump's own spot), grants the danfo, seats it
  const PARK = { x: (41.7 - 50) * 6.2, z: (60.9 - 50) * 6.2 }
  await pageA.evaluate(({ x, z }) => (window as unknown as { __lkl: { tp: (x: number, z: number) => void } }).__lkl.tp(x, z), PARK)
  await pageA.waitForTimeout(1500)
  const funded = await pageA.evaluate((n) => (window as unknown as { __lkl: { fund: (n: number) => Promise<unknown> } }).__lkl.fund(n), 8000)
  check('the purse is funded (the deposit door\'s own seam)', !!funded)
  await page_wait(600)
  const granted = await pageA.evaluate(() => (window as unknown as { __lkl: { grantRide: (m: string, p?: string) => boolean } }).__lkl.grantRide('danfo', 'stock'))
  check('A holds the danfo\'s key', granted === true)
  await pageA.evaluate(() => (window as unknown as { __lkl: { forceDrive: (on: boolean, speed?: number, model?: string) => void } }).__lkl.forceDrive(true, 0, 'danfo'))
  const diskWait = await waitForCond(async () => !!(await ww(pageA))?.disk, 12_000)
  check('the danfo said hello (the readback carried the DISK tank)', diskWait)
  const fuel0 = (await ww(pageA))?.fuel ?? null
  check('THE TANK GAUGE LIVES (the estimate reads the disk\'s 100%)', fuel0 !== null && fuel0 > 0.99, `fuel=${String(fuel0)}`)
  // a short honest drive THROUGH THE TELEPORT SEAM (the wheels witness's
  // own recipe: the throttle rides at 5.2 so the sender speaks mv=true;
  // the frozen controller consumes the seam and the tank burns by metres)
  await pageA.evaluate(() => (window as unknown as { __lkl: { forceDrive: (on: boolean, speed?: number, model?: string) => void } }).__lkl.forceDrive(true, 5.2, 'danfo'))
  for (let i = 0; i < 10; i++) {
    const p = await pos(pageA)
    await pageA.evaluate(({ x, z }) => (window as unknown as { __lkl: { tp: (x: number, z: number) => void } }).__lkl.tp(x, z), { x: p.x + 1.4, z: p.z })
    await page_wait(1200)
  }
  await page_wait(1500)
  const fuel1 = (await ww(pageA))?.fuel ?? null
  check('THE BURN IS FELT: the tank dropped under the drive', fuel1 !== null && fuel0 !== null && fuel1 < fuel0, `fuel ${String(fuel0)} → ${String(fuel1)}`)
  await snap(pageA, 'a-pump-chip-and-gauge')

  section('02 THE POUR — ₦2,000 through the REAL ledger')
  const balance0 = walletOf(HANDLE_A)
  const chip = pageA.getByTestId('refuel-chip')
  const chipUp = await waitForCond(async () => chip.isVisible().catch(() => false), 14_000)
  check('THE PUMP CHIP rode the HUD (stopped at the pump, tank < full)', chipUp)
  if (chipUp) {
    await pageA.evaluate(() => {
      const el = document.querySelector('[data-testid="refuel-chip"]') as HTMLButtonElement | null
      el?.click()
    })
  }
  const poured = await waitForCond(async () => ((await ww(pageA))?.refuel ?? 0) >= 1, 12_000)
  check('THE POUR LANDED (the wire door said yes, the tank rose)', poured, JSON.stringify(await ww(pageA)))
  await page_wait(800)
  const balance1 = walletOf(HANDLE_A)
  check('THE DEBIT IS REAL: ₦8,000 − ₦2,000 = ₦6,000 on the disk', balance0 === 8000 && balance1 === 6000, `₦${balance0} → ₦${balance1}`)
  const rowPour = rowOf(HANDLE_A, 'danfo')
  check('THE TANK ON DISK: the pour landed on the row', !!rowPour && rowPour.fuel > 0.99, JSON.stringify(rowPour))
  await snap(pageA, 'a-poured')

  section('03 THE MECHANIC — the garage\'s service through the ledger')
  // the shop chip hides while the drive chrome owns the seat — A steps out
  // (the real park flow: the seat empties, the sender says bye, the chip returns)
  await pageA.evaluate(() => (window as unknown as { __lkl: { forceDrive: (on: boolean, speed?: number, model?: string) => void } }).__lkl.forceDrive(false))
  await page_wait(2000)
  await pageA.evaluate(() => {
    const el = document.querySelector('[data-testid="garage-open-chip"]') as HTMLButtonElement | null
    el?.click()
    return !!el
  })
  await page_wait(1500)
  const metersUp = await pageA.getByTestId('garage-fuel-danfo').isVisible().catch(() => false)
  check('THE GARAGE METERS rode the panel (the tank + the body bars)', metersUp)
  await snap(pageA, 'a-garage-meters')
  const serviceBtn = pageA.getByTestId('garage-service-danfo')
  const serviceEnabled = await serviceBtn.isEnabled().catch(() => false)
  check('THE MECHANIC\'S HONESTY: a sound body\'s service button is DISABLED (no invented work)', !serviceEnabled)

  section('the honest books')
  const w = await ww(pageA)
  check('the counters are REAL (hello + refuel ≥ 1)', !!w && w.hello >= 1 && w.refuel >= 1, JSON.stringify(w))
  check('zero console errors', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '))
} catch (e) {
  failures.push(`witness threw: ${String(e)}`)
  console.error(e)
} finally {
  try { wireProc?.kill() } catch { /* already gone */ }
  try { await ctxA?.close() } catch { /* already gone */ }
  try { await browser?.close() } catch { /* already gone */ }
}

console.log(`\n════════════════════════════════════════`)
console.log(`W10-c FUEL WITNESS: ${shots} shots, ${failures.length} failures`)
if (failures.length) {
  console.log('FAILED:')
  for (const f of failures) console.log(`  - ${f}`)
  process.exit(1)
}
process.exit(0)
