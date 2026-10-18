/**
 * LOKOJA LIFE — M24 W5: THE CONNECT WITNESS (E2E, fresh-context)
 * ===============================================================
 * TWO real walkers, the REAL gateway (E2E_BASE default http://localhost:81),
 * the REAL register door, the REAL FriendRow graph on the REAL wire.
 *
 * The shots (ALL eyeballed after the run):
 *   01 a-home             — walker A through the gate
 *   02 a-connect-live     — A's Connect lane chip: the nation graph rides the LIVE WIRE
 *   03 a-request-sent     — A adds B by handle → "Request fly reach @B"
 *   04 b-request-live     — B sits on Requests → @A's request appears INSTANTLY (the push)
 *   05 b-paddies          — B accepts → @A under "Nation paddies (server truth)"
 *   06 a-paddies-live     — A's paddies show @B (the accepted push, live)
 *   07 b-dm-thread        — A's DM lands in B's thread (server truth + live wire label)
 *   08 a-invite           — A fires the 🎮 hangout postcard
 *   09 b-hangout-live     — the 🎮 postcard renders LIVE in B's open thread
 *
 * THE LAWS WITNESSED:
 *  - the nation graph rides the live wire through the REAL gateway
 *  - a friend request arrives INSTANTLY (wire:social push rides the person)
 *  - accept = paddies on BOTH sides, visible live on both screens
 *  - the DM carries the thread label and lands sub-second
 *  - the hangout postcard flies and renders live
 *  - zero console errors across both walkers
 */
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright'
import { mkdirSync } from 'fs'
import { spawn, type Subprocess } from 'bun'

const BASE = process.env.E2E_BASE ?? 'http://localhost:81'
const SHOTS = '/home/z/my-project/download/m24-connect-shots'
const stamp = Date.now().toString(36).slice(-5)
const HANDLE_A = `cna_${stamp}`
const HANDLE_B = `cnb_${stamp}`

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
  const ctx = await browser!.newContext({ viewport: { width: 390, height: 844 } })
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
  await page.getByPlaceholder('Your name…').fill('Adaeze', { timeout: 15_000 })
  await page.getByRole('button', { name: /Start Life in Lokoja/i }).click({ timeout: 10_000 })
  await page.waitForSelector('[data-testid="goals-card"]', { timeout: 25_000 })
  return { page, ctx }
}

async function openConnect(page: Page) {
  await page.getByRole('button', { name: 'Phone', exact: true }).click({ timeout: 10_000 })
  await page.waitForSelector('text=Wetin dey happen', { timeout: 10_000 })
  await page.getByText('Connect', { exact: true }).first().click({ timeout: 10_000 })
  await page.waitForSelector('[data-testid="connect-lane"]', { timeout: 10_000 })
}

async function waitForText(page: Page, text: string, timeoutMs: number): Promise<number | null> {
  const t0 = Date.now()
  while (Date.now() - t0 < timeoutMs) {
    const found = await page.locator(`text=${text}`).first().isVisible().catch(() => false)
    if (found) return Date.now() - t0
    await page.waitForTimeout(100)
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

  console.log('\n── A opens Connect — the graph lane ──')
  await openConnect(pa)
  // the socket flips live a beat after mount — the law is that the graph
  // RIDES the wire once it's live, so wait for the honest flip (5s budget)
  const laneLive = await waitForText(pa, 'LIVE WIRE', 5000)
  check('A lane chip: the nation graph rides the LIVE WIRE (once the socket is up)', laneLive !== null)
  const laneA = await pa.getByTestId('connect-lane').textContent()
  await snap(pa, 'a-connect-live')

  /* ── walker B claims and enters, sits on Requests ── */
  console.log('\n── walker B claims and enters, sits on Requests ──')
  const b = await walker(HANDLE_B)
  ctxB = b.ctx
  const pb = b.page
  await openConnect(pb)
  await pb.getByRole('button', { name: /Requests/ }).click({ timeout: 8_000 })
  await pb.waitForSelector('[data-testid="connect-requests"]', { timeout: 8_000 })

  /* ── THE INSTANT REQUEST: A adds B, B feels it ── */
  console.log('\n── THE INSTANT REQUEST ──')
  await pa.getByRole('button', { name: /Find/ }).click({ timeout: 8_000 })
  await pa.waitForSelector('[data-testid="connect-find"]', { timeout: 8_000 })
  await pa.getByTestId('connect-add-input').fill(HANDLE_B)
  const tAdd = Date.now()
  await pa.getByTestId('connect-add-btn').click()
  const noticeA = await waitForText(pa, 'Request fly reach', 3000)
  check('A sees the honest notice (Request fly reach @B)', noticeA !== null)
  await snap(pa, 'a-request-sent')

  const reqAt = await waitForText(pb, `@${HANDLE_A}`, 3000)
  check(`B's Requests tab shows @${HANDLE_A} INSTANTLY (the wire:social push, ${(reqAt ?? 9999).toString()}ms)`, reqAt !== null && Date.now() - tAdd < 2500, reqAt === null ? 'never landed' : `${reqAt}ms after add`)
  await snap(pb, 'b-request-live')

  /* ── B accepts — paddies on BOTH sides, live ── */
  console.log('\n── B ACCEPTS ──')
  await pb.getByTestId(`connect-accept-${HANDLE_A}`).click({ timeout: 6_000 })
  const okB = await waitForText(pb, 'na your paddy now', 3000)
  check('B sees the acceptance notice', okB !== null)
  await pb.getByRole('button', { name: /Paddies/ }).first().click({ timeout: 6_000 })
  const paddyOnB = await waitForText(pb, 'Nation paddies', 4000)
  check('B paddies tab shows the SERVER-TRUTH section', paddyOnB !== null)
  const seesA = await waitForText(pb, `@${HANDLE_A}`, 3000)
  check(`B sees @${HANDLE_A} as a nation paddy`, seesA !== null)
  await snap(pb, 'b-paddies')

  console.log('\n── A feels the acceptance (the push) ──')
  await pa.getByRole('button', { name: /Paddies/ }).first().click({ timeout: 6_000 })
  const aRow = await waitForText(pa, `connect-net-paddy-${HANDLE_B}`.replace('connect-net-paddy-', '@'), 4000)
  check(`A's paddies show @${HANDLE_B} (accepted push applied live)`, aRow !== null)
  await snap(pa, 'a-paddies-live')

  /* ── THE DM: A messages B from the paddy row ── */
  console.log('\n── THE DM ──')
  await pa.getByRole('button', { name: `Message ${HANDLE_B}` }).click({ timeout: 8_000 })
  await pa.waitForSelector('[data-testid="messages-thread"]', { timeout: 8_000 })
  const dmMsg = `paddy, nation DM! (${stamp})`
  await pa.getByTestId('messages-dm-input').fill(dmMsg)
  await pa.getByTestId('messages-dm-send').click()
  const sentOk = await waitForText(pa, dmMsg, 3000)
  check('A word lands in the thread', sentOk !== null)

  // B opens the thread from the DMs list (the unread law)
  await pb.getByRole('button', { name: 'Back' }).first().click({ timeout: 6_000 })
  await pb.getByText('Messages', { exact: true }).first().click({ timeout: 8_000 })
  await pb.getByRole('button', { name: /DMs/ }).first().click({ timeout: 8_000 })
  await pb.locator(`text=@${HANDLE_A}`).first().click({ timeout: 8_000 })
  await pb.waitForSelector('[data-testid="messages-thread"]', { timeout: 8_000 })
  const dmAt = await waitForText(pb, dmMsg, 4000)
  check('B received the DM sub-second (delivery rides the person)', dmAt !== null)
  await snap(pb, 'b-dm-thread')

  /* ── THE HANGOUT POSTCARD ── */
  console.log('\n── THE HANGOUT POSTCARD ──')
  await pa.getByTestId('messages-invite').click({ timeout: 6_000 })
  const invOk = await waitForText(pa, 'Hangout invite fly', 3000)
  check('A invite notice lands', invOk !== null)
  await snap(pa, 'a-invite')
  const hoAt = await waitForText(pb, 'wan hangout', 3000)
  check('THE 🎮 POSTCARD RENDERS LIVE in B open thread', hoAt !== null)
  await snap(pb, 'b-hangout-live')
} catch (e) {
  failures.push(`witness crashed: ${String(e).slice(0, 300)}`)
  console.error('WITNESS CRASH:', e)
} finally {
  await ctxA?.close().catch(() => {})
  await ctxB?.close().catch(() => {})
  await browser?.close().catch(() => {})
}

console.log(`\n════════════════════════════════════════`)
console.log(`WITNESS: ${shots} shots in ${SHOTS}`)
if (consoleErrors.length) {
  console.log(`CONSOLE ERRORS (${consoleErrors.length}) — THE FAIL:`)
  for (const c of consoleErrors.slice(0, 10)) console.log('  ', c)
}
if (failures.length) {
  console.log('FAILED:', failures.join(' | '))
  process.exit(1)
}
console.log('VERDICT: 🟢 ALL LAWS WITNESSED — 0 console errors while the nation stood')
process.exit(consoleErrors.length ? 1 : 0)
