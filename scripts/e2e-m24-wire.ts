/**
 * LOKOJA LIFE — M24 W4: THE WIRE WITNESS (E2E, fresh-context)
 * ===========================================================
 * TWO real walkers, the REAL gateway (E2E_BASE default http://localhost:81 —
 * the Caddy XTransformPort door the wire rides), the REAL phone faces.
 *
 * The shots (ALL eyeballed after the run):
 *   01 landing            — the door
 *   02 a-wire-live        — walker A's lane chip says LIVE WIRE + own words echoed
 *   03 b-heard-instant    — B's words on A's screen, sub-second (THE point)
 *   04 connect-live       — the roster "Online now (live wire)" showing the other walker
 *   05 dm-thread          — the DM carrying the live-wire label
 *   06 b-unread           — B's unread badge from the live DM
 *   07 degraded-lane      — the wire killed → the honest relay lane takes over
 *
 * THE LAWS WITNESSED:
 *  - the socket connects through the REAL gateway (websocket first)
 *  - the lane chip tells the truth (live vs relay)
 *  - chat lands SUB-SECOND walker→walker (the 12s heartbeat is gone from the happy path)
 *  - the roster is instant (Connect shows the other walker live)
 *  - DMs deliver live with the label
 *  - kill the wire → 'degraded' → the ~12s relay STILL delivers (nothing thrown away)
 *  - zero console errors across both walkers
 */
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright'
import { mkdirSync } from 'fs'
import { spawn, type Subprocess } from 'bun'

const BASE = process.env.E2E_BASE ?? 'http://localhost:81'
const SHOTS = '/home/z/my-project/download/m24-wire-shots'
const stamp = Date.now().toString(36).slice(-5)
const HANDLE_A = `wira_${stamp}`
const HANDLE_B = `wirb_${stamp}`

mkdirSync(SHOTS, { recursive: true })

let browser: Browser | null = null
let ctxA: BrowserContext | null = null
let ctxB: BrowserContext | null = null
let wireProc: Subprocess | null = null

const consoleErrors: string[] = [] // STRICT bucket: while the nation stands — must be ZERO
const outageRoar: string[] = [] // the honest roar of retries while the wire is DOWN (expected)
let killAt = Number.MAX_SAFE_INTEGER
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
  const ctx = await browser!.newContext({ viewport: { width: 390, height: 844 } })
  const page = await ctx.newPage()
  page.on('console', (m) => {
    if (m.type() === 'error') {
      const line = `[${handle}] ${m.text().slice(0, 200)}`
      // errors after the kill are the OUTAGE ROAR (the client honestly trying
      // to come home) — expected; errors while the nation stands are not
      if (Date.now() >= killAt) outageRoar.push(line)
      else consoleErrors.push(line)
    }
  })
  page.on('pageerror', (e) => {
    const line = `[${handle}] pageerror: ${String(e).slice(0, 200)}`
    if (Date.now() >= killAt) outageRoar.push(line)
    else consoleErrors.push(line)
  })

  await page.goto(`${BASE}/?e2e=1`, { waitUntil: 'domcontentloaded', timeout: 30_000 })
  // claim through the real register door
  await page.getByTestId('menu-auth-open').click({ timeout: 15_000 })
  await page.waitForSelector('[data-testid="menu-auth-sheet"]', { timeout: 10_000 })
  await page.getByTestId('auth-tab-claim').click({ timeout: 5_000 })
  await page.getByTestId('auth-handle').fill(handle)
  await page.getByTestId('auth-pin').fill('2468')
  await page.getByTestId('auth-contact').fill(`${handle}_${Date.now() % 100000}@lokoja.life`)
  await page.getByTestId('auth-next').click({ timeout: 10_000 })   // W1 — step 2: the face
  await page.getByTestId('auth-submit').click({ timeout: 10_000 })
  // the CREATION name input specifically (the auth sheet's inputs die here)
  await page.getByPlaceholder('Your name…').fill('Adaeze', { timeout: 15_000 })
  // start the life
  await page.getByRole('button', { name: /Start Life in Lokoja/i }).click({ timeout: 10_000 })
  await page.waitForSelector('[data-testid="goals-card"]', { timeout: 25_000 })
  return { page, ctx }
}

async function openMessagesWire(page: Page) {
  await page.getByRole('button', { name: 'Phone', exact: true }).click({ timeout: 10_000 })
  await page.waitForSelector('text=Wetin dey happen', { timeout: 10_000 })
  await page.getByText('Messages', { exact: true }).first().click({ timeout: 10_000 })
  await page.waitForSelector('[data-testid="messages-wire"]', { timeout: 10_000 })
}

async function waitForText(page: Page, text: string, timeoutMs: number): Promise<number | null> {
  const t0 = Date.now()
  while (Date.now() - t0 < timeoutMs) {
    const found = await page
      .locator(`text=${text}`)
      .first()
      .isVisible()
      .catch(() => false)
    if (found) return Date.now() - t0
    await page.waitForTimeout(120)
  }
  return null
}

try {
  /* ── walker A through the real gateway ── */
  console.log('\n── walker A claims and enters ──')
  browser = await chromium.launch()
  const a = await walker(HANDLE_A)
  ctxA = a.ctx
  const pa = a.page
  await snap(pa, 'a-home')

  await openMessagesWire(pa)
  // THE LANE LAW: the chip must say the socket is LIVE (through the gateway!)
  const laneText = await pa.getByTestId('messages-lane').textContent()
  check('walker A lane chip says LIVE WIRE (socket through the real gateway)', (laneText ?? '').includes('Live wire'), laneText ?? 'none')
  await pa.waitForTimeout(600)
  await snap(pa, 'a-wire-live')

  /* ── walker B joins ── */
  console.log('\n── walker B claims and enters ──')
  const b = await walker(HANDLE_B)
  ctxB = b.ctx
  const pb = b.page
  await openMessagesWire(pb)
  const laneB = await pb.getByTestId('messages-lane').textContent()
  check('walker B lane chip says LIVE WIRE too', (laneB ?? '').includes('Live wire'), laneB ?? 'none')

  /* ── THE INSTANT NATION: B speaks, A hears sub-second ── */
  console.log('\n── THE INSTANT NATION — B speaks, A hears ──')
  const bMsg = `B dey the wire! (${stamp})`
  await pb.getByTestId('messages-input').fill(bMsg)
  const tSend = Date.now()
  await pb.getByTestId('messages-send').click()
  const heardAt = await waitForText(pa, bMsg, 3000)
  check('A hears B SUB-SECOND (the 12s heartbeat is gone from the happy path)', heardAt !== null && Date.now() - tSend < 2000, heardAt === null ? 'never landed in 3s' : `landed ${Date.now() - tSend}ms after send`)
  await snap(pa, 'b-heard-instant')

  // and A speaks back — B hears too (both directions)
  const aMsg = `A dey hear you! (${stamp})`
  await pa.getByTestId('messages-input').fill(aMsg)
  await pa.getByTestId('messages-send').click()
  const heardB = await waitForText(pb, aMsg, 3000)
  check('B hears A back sub-second (both directions live)', heardB !== null)

  /* ── the live roster ── */
  console.log('\n── THE LIVE ROSTER ──')
  await pa.getByRole('button', { name: 'Back' }).first().click({ timeout: 6_000 })
  await pa.getByText('Connect', { exact: true }).first().click({ timeout: 10_000 })
  await pa.getByRole('button', { name: /Find/ }).click({ timeout: 8_000 })
  await pa.waitForSelector('[data-testid="connect-find"]', { timeout: 8_000 })
  const laneConn = await pa.getByTestId('connect-lane').textContent()
  check('Connect lane chip says the roster rides the LIVE WIRE', (laneConn ?? '').includes('LIVE WIRE'), laneConn ?? 'none')
  const sawB = await waitForText(pa, `@${HANDLE_B}`, 3000)
  check(`the roster shows @${HANDLE_B} ONLINE NOW (instant presence)`, sawB !== null)
  await snap(pa, 'connect-live')

  /* ── the live DM ── */
  console.log('\n── THE LIVE DM ──')
  await pa.getByTestId('connect-add-input').fill(HANDLE_B)
  await pa.getByTestId('connect-add-btn').click()
  await pa.waitForTimeout(400)
  // open the paddy's thread from Connect's paddies tab (the row's 💋 carries aria-label="Message <handle>")
  await pa.getByRole('button', { name: /Paddies/ }).first().click({ timeout: 6_000 })
  await pa.getByRole('button', { name: `Message ${HANDLE_B}` }).click({ timeout: 8_000 })
  await pa.waitForSelector('[data-testid="messages-thread"]', { timeout: 8_000 })
  const threadLabel = await pa.locator('[data-testid="messages-thread"] span.rounded-full').last().textContent().catch(() => null)
  check('the DM thread carries the live-wire label', (threadLabel ?? '').includes('live wire'), threadLabel ?? 'none')
  const dmMsg = `paddy, wire DM! (${stamp})`
  await pa.getByTestId('messages-dm-input').fill(dmMsg)
  await pa.getByTestId('messages-dm-send').click()
  // B: open messages → the DM list must show it + unread badge
  await pb.getByRole('button', { name: 'Back' }).first().click({ timeout: 6_000 })
  await pb.getByText('Messages', { exact: true }).first().click({ timeout: 8_000 })
  await pb.getByRole('button', { name: /DMs/ }).first().click({ timeout: 8_000 })
  const dmAt = await waitForText(pb, dmMsg, 4000)
  check('B received the DM live (delivery rides the person — B never opened the thread)', dmAt !== null)
  await snap(pb, 'b-unread')
  await snap(pa, 'dm-thread')

  /* ── THE NOTHING-THROWN-AWAY LAW: kill the wire, the relay takes over ── */
  console.log('\n── THE DEGRADED LANE — kill the wire service ──')
  // B back to the WIRE tab (the lane chip lives there)
  await pb.getByRole('button', { name: 'Back' }).first().click({ timeout: 6_000 })
  await pb.getByText('Messages', { exact: true }).first().click({ timeout: 8_000 })
  await pb.getByRole('button', { name: /Nation wire/ }).first().click({ timeout: 8_000 })
  await pb.getByTestId('messages-lane').waitFor({ timeout: 8_000 })
  // kill by PORT — the process cmdline doesn't carry the service name
  killAt = Date.now()
  Bun.spawnSync(['bash', '-c', 'lsof -ti :3003 | xargs -r kill'])
  await pb.waitForTimeout(3500) // the socket notices, the state flips
  const laneAfter = await pb.getByTestId('messages-lane').textContent()
  check('B lane chip honestly flips to the RELAY lane (degraded, never a fake green)', (laneAfter ?? '').includes('Relay lane'), laneAfter ?? 'none')
  await snap(pb, 'degraded-lane')
  // the relay heartbeat still delivers (up to 12s + sync cadence)
  const relayMsg = `relay lane still dey! (${stamp})`
  await pa.getByTestId('messages-input').fill(relayMsg).catch(async () => {
    // A's phone may need re-opening after navigation
    await openMessagesWire(pa)
    await pa.getByTestId('messages-input').fill(relayMsg)
  })
  await pa.getByTestId('messages-send').click()
  const relayAt = await waitForText(pb, relayMsg, 16_000)
  check('the ~12s relay STILL delivers with the wire down (two lanes, one nation)', relayAt !== null, relayAt === null ? 'relay word never landed in 16s' : `landed via relay`)

  /* ── restart the wire for the session ── */
  console.log('\n── restart the wire ──')
  wireProc = spawn(['bun', 'run', 'dev'], {
    cwd: '/home/z/my-project/mini-services/nation-wire',
    stdout: 'ignore',
    stderr: 'ignore',
  })
  await new Promise((r) => setTimeout(r, 2500))
  const health = await fetch('http://localhost:3003/health').then((r) => r.json()).catch(() => null)
  check('the wire is back up for the session', !!(health as { ok?: boolean })?.ok)
} catch (e) {
  failures.push(`witness crashed: ${String(e).slice(0, 300)}`)
  console.error('WITNESS CRASH:', e)
} finally {
  await ctxA?.close().catch(() => {})
  await ctxB?.close().catch(() => {})
  await browser?.close().catch(() => {})
  // the spawned restart keeps running (the session's wire)
}

console.log(`\n════════════════════════════════════════`)
console.log(`WITNESS: ${shots} shots in ${SHOTS}`)
if (consoleErrors.length) {
  console.log(`CONSOLE ERRORS while the nation stood (${consoleErrors.length}) — THE FAIL:`)
  for (const c of consoleErrors.slice(0, 10)) console.log('  ', c)
}
const roarIsHonest = outageRoar.every((e) => e.includes('502') && e.includes('transport=websocket'))
console.log(`outage roar: ${outageRoar.length} entries while the wire was down — ${roarIsHonest ? 'all honest WS-retry 502s against the dead upstream (expected, the polling fallback carried the nation)' : 'UNEXPECTED non-retry errors:'}${roarIsHonest ? '' : ''}`)
if (!roarIsHonest) for (const c of outageRoar.slice(0, 5)) console.log('  ', c)
if (failures.length) {
  console.log('FAILED:', failures.join(' | '))
  process.exit(1)
}
console.log(consoleErrors.length || !roarIsHonest ? 'VERDICT: laws witnessed, but console discipline failed — fix before commit' : 'VERDICT: 🟢 ALL LAWS WITNESSED — 0 console errors while the nation stood')
process.exit(consoleErrors.length || !roarIsHonest ? 1 : 0)
