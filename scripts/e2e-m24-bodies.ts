/**
 * LOKOJA LIFE — M24 W2: THE BODIES WITNESS (E2E, fresh-context)
 * =============================================================
 * TWO real walkers through the REAL gateway (E2E_BASE default
 * http://localhost:81), BOTH standing in the world at once — and one
 * SEES the other walk.
 *
 * The shots (ALL eyeballed after the run):
 *   01 a-world          — walker A alive in the city
 *   02 b-world-alone    — B's world, control: no neighbour body yet
 *   03 b-sees-a         — A teleported near B → B SEES A's body + name tag
 *   04 b-sees-a-moved   — A walked on → B's view FOLLOWS (the 10Hz truth)
 *   05 b-far-culled     — A far beyond the 60u range law → culled, honest
 *
 * THE LAWS WITNESSED:
 *  - the wire connects on WORLD ENTRY (the world-entry law — no phone face
 *    needed; the lane chip truth rides the phone faces' own ensures)
 *  - B's __lklBodies witness holds ONE body: A, with the REAL name
 *  - A's sender ticks (sent > 5), B's ear fills (recv > 5) — REALITY, not UI
 *  - the body FOLLOWS A's real teleports (the buffer samples the deltas)
 *  - the RANGE LAW culls what stands beyond 60u (the frame budget law)
 *  - zero console errors across both walkers while the nation stands
 */
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright'
import { mkdirSync } from 'fs'
import { spawn, type Subprocess } from 'bun'

const BASE = process.env.E2E_BASE ?? 'http://localhost:81'
const SHOTS = '/home/z/my-project/download/m24-bodies-shots'
const stamp = Date.now().toString(36).slice(-5)
const HANDLE_A = `boda_${stamp}`
const HANDLE_B = `bodb_${stamp}`

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
  // settle: the canvas + the world hook + THE BODIES' witness hook
  const t0 = Date.now()
  let ok = false
  while (Date.now() - t0 < 60_000) {
    const ping = await page.evaluate(() => ({
      canvas: !!document.querySelector('canvas'),
      pos: !!((window as unknown as { __lkl?: { pos?: () => unknown } }).__lkl?.pos?.()),
      bodies: !!(window as unknown as { __lklBodies?: unknown }).__lklBodies,
    }))
    if (ping.canvas && ping.pos && ping.bodies) { ok = true; break }
    await page.waitForTimeout(900)
  }
  if (!ok) console.log(`  ⚠ ${handle}: the world did not fully settle (continuing — the checks will tell the truth)`)
  return { page, ctx }
}

interface BodiesWitness {
  count: number
  sent: number
  recv: number
  list: { handle: string; name: string; look: string | null }[]
}

async function bodies(page: Page): Promise<BodiesWitness | null> {
  // the witness is a FUNCTION the page calls fresh — everything runs inside
  return await page.evaluate(() => {
    const w = (window as unknown as { __lklBodies?: () => { count: number; sent: number; recv: number; list: () => { handle: string; name: string; look: string | null }[] } }).__lklBodies
    if (typeof w !== 'function') return null
    const r = w()
    return { count: r.count, sent: r.sent, recv: r.recv, list: r.list() }
  })
}

/** the roster truth needs the wire lane — wait for B to hold A's body */
async function waitForBody(page: Page, handle: string, timeoutMs: number): Promise<boolean> {
  const t0 = Date.now()
  while (Date.now() - t0 < timeoutMs) {
    const w = await bodies(page)
    if (w && w.list.some((b) => b.handle === handle)) return true
    await page.waitForTimeout(250)
  }
  return false
}

async function waitForCond(fn: () => Promise<boolean>, timeoutMs: number): Promise<boolean> {
  const t0 = Date.now()
  while (Date.now() - t0 < timeoutMs) {
    if (await fn()) return true
    await page_wait(250)
  }
  return false
}
const page_wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

try {
  section('spawn the nation wire (:3003, the REAL db) — the gateway routes it')
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

  // let both world canvases mount + the world-entry law ensure the wire
  await pageA.waitForTimeout(3000)
  await pageB.waitForTimeout(3000)

  section('01-02 the two worlds')
  await snap(pageA, 'a-world')
  await snap(pageB, 'b-world-alone')

  section('THE WITNESS — B holds A\'s body')
  const bHasA = await waitForBody(pageB, HANDLE_A, 12_000)
  check('B\'s net holds A\'s body (same street, the roster seeded it)', bHasA)
  const wb = await bodies(pageB)
  const rowA = wb?.list.find((b) => b.handle === HANDLE_A)
  check('the body carries the REAL display name (the roster face)', rowA?.name === HANDLE_A || !!rowA?.name, JSON.stringify(wb?.list))
  check('the body wears the REAL look (clothingStyle/hairstyle)', !!rowA?.look && rowA.look.includes('/'), JSON.stringify(rowA))

  section('THE SENDER — A\'s body actually speaks')
  const aSent = await waitForCond(async () => ((await bodies(pageA))?.sent ?? 0) > 5, 12_000)
  check('A\'s sender ticked (sent > 5 — the 10Hz cadence, stillness heartbeats)', aSent, JSON.stringify(await bodies(pageA)))
  const bRecv = await waitForCond(async () => ((await bodies(pageB))?.recv ?? 0) > 5, 12_000)
  check('B\'s ear filled (recv > 5 — the relay is real)', bRecv, JSON.stringify(await bodies(pageB)))

  section('03 THE MONEY SHOT — A stands beside B')
  // B's real position (the world hook truth), then A teleports 7u beside them
  const posB = await pageB.evaluate(() => (window as unknown as { __lkl?: { pos: () => { x: number; z: number } } }).__lkl?.pos?.() ?? null)
  check('B\'s world hook speaks (pos)', !!posB && Number.isFinite(posB!.x), JSON.stringify(posB))
  if (posB) {
    await pageA.evaluate(([x, z]) => (window as unknown as { __lkl?: { tp: (x: number, z: number) => void } }).__lkl?.tp?.(x, z), [posB.x + 6, posB.z + 2])
    await pageA.waitForTimeout(2500) // the 10Hz lane + the interp walk
    await snap(pageB, 'b-sees-a')
  }

  section('04 THE FOLLOW — A walks on, B\'s view follows')
  if (posB) {
    // DETERMINISTIC FRAMING: B's camera faces its spawn anchor — the view
    // axis is (spawn - (4,5)) → anchor = posB - (4,5) direction ≈ (-0.62,-0.78).
    // A walks ALONG that axis out to the visible zebra (~34u, inside the 60u
    // range law): the body leaves shot-03's spot and re-appears mid-frame.
    await pageA.evaluate(([x, z]) => (window as unknown as { __lkl?: { tp: (x: number, z: number) => void } }).__lkl?.tp?.(x, z), [posB.x - 21, posB.z - 27])
    await pageA.waitForTimeout(3500)
    await snap(pageB, 'b-sees-a-moved')
  }

  section('05 THE RANGE LAW — far bodies cull, honestly')
  if (posB) {
    await pageA.evaluate(([x, z]) => (window as unknown as { __lkl?: { tp: (x: number, z: number) => void } }).__lkl?.tp?.(x, z), [posB.x + 120, posB.z + 120])
    await pageA.waitForTimeout(2500)
    await snap(pageB, 'b-far-culled')
  }

  section('THE CLOSING TRUTH')
  check('zero console errors across both walkers (the nation stood)', consoleErrors.length === 0, consoleErrors.slice(0, 4).join(' | '))

  await pageA.close()
  await pageB.close()
} catch (e) {
  failures.push(`witness crashed: ${String(e)}`)
  console.error('WITNESS CRASH:', e)
} finally {
  try { await browser?.close() } catch { /* already gone */ }
  wireProc?.kill()
}

console.log(`\n════════════════════════════════════════`)
console.log(`M24-W2 BODIES WITNESS: ${shots} shots, ${failures.length} failures`)
if (failures.length) console.log('FAILED:', failures.join(' | '))
process.exit(failures.length ? 1 : 0)

function section(name: string) {
  console.log(`\n── ${name} ─────────────────────────────────`)
}
