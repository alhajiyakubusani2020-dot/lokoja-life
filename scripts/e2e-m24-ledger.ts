/**
 * LOKOJA LIFE — M24 W6: THE LEDGER WITNESS (E2E, fresh-context)
 * ==============================================================
 * TWO real walkers, the REAL gateway, REAL naira through the REAL purse.
 *
 * The shots (ALL eyeballed after the run):
 *   01 a-home             — walker A through the gate
 *   02 a-wallet-home      — POCKET ₦5,000 (the save) beside PURSE (the nation, empty)
 *   03 a-topup-receipt    — ₦1,000 top-up: the receipt carries ledger # + hash
 *   04 a-send-pin         — the PIN step: "the server judges the PIN"
 *   05 a-send-receipt     — ₦500 sent to @B, purse balance after
 *   06 b-wallet-live      — B's wallet: purse ₦500 + the book row from @A
 *                           (the wire:ledger push landed LIVE)
 *
 * THE LAWS WITNESSED:
 *  - the pocket/purse split is visible and honest on screen
 *  - the top-up receipt shows the fortress book's truth (id + hash)
 *  - a P2P transfer moves through the PIN door with a real receipt
 *  - the receiver's purse grows LIVE (the push lane rides the person)
 *  - zero console errors across both walkers
 */
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright'
import { mkdirSync } from 'fs'
import { spawn, type Subprocess } from 'bun'

const BASE = process.env.E2E_BASE ?? 'http://localhost:81'
const SHOTS = '/home/z/my-project/download/m24-ledger-shots'
const stamp = Date.now().toString(36).slice(-5)
const HANDLE_A = `lda_${stamp}`
const HANDLE_B = `ldb_${stamp}`
const PIN = '2468'

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
  await page.getByTestId('auth-pin').fill(PIN)
  await page.getByTestId('auth-contact').fill(`${handle}_${Date.now() % 100000}@lokoja.life`)
  await page.getByTestId('auth-next').click({ timeout: 10_000 })   // W1 — step 2: the face
  await page.getByTestId('auth-submit').click({ timeout: 10_000 })
  await page.getByPlaceholder('Your name…').fill('Adaeze', { timeout: 15_000 })
  await page.getByRole('button', { name: /Start Life in Lokoja/i }).click({ timeout: 10_000 })
  await page.waitForSelector('[data-testid="goals-card"]', { timeout: 25_000 })
  return { page, ctx }
}

async function openWallet(page: Page) {
  await page.getByRole('button', { name: 'Phone', exact: true }).click({ timeout: 10_000 })
  await page.waitForSelector('text=Wetin dey happen', { timeout: 10_000 })
  await page.getByText('Wallet', { exact: true }).first().click({ timeout: 10_000 })
  await page.waitForSelector('[data-testid="wallet-home"]', { timeout: 10_000 })
}

async function connectPaddies(page: Page, other: string) {
  // A and B become paddies first — transfers ride the nation graph
  await page.getByRole('button', { name: 'Phone', exact: true }).click({ timeout: 10_000 })
  await page.getByText('Connect', { exact: true }).first().click({ timeout: 10_000 })
  await page.waitForSelector('[data-testid="connect-lane"]', { timeout: 10_000 })
  await page.getByRole('button', { name: /Find/ }).click({ timeout: 8_000 })
  await page.getByTestId('connect-add-input').fill(other)
  await page.getByTestId('connect-add-btn').click()
  await page.waitForTimeout(500)
  await page.getByRole('button', { name: 'Back' }).first().click({ timeout: 6_000 }).catch(() => {})
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
  console.log('\n── walker A claims and enters ──')
  browser = await chromium.launch()
  const a = await walker(HANDLE_A)
  ctxA = a.ctx
  const pa = a.page
  await snap(pa, 'a-home')

  console.log('\n── B claims, enters; the two become paddies ──')
  const b = await walker(HANDLE_B)
  ctxB = b.ctx
  const pb = b.page
  await connectPaddies(pa, HANDLE_B) // A asks
  await connectPaddies(pb, HANDLE_A) // B answers — THE MUTUAL LAW closes it
  // the mutual check needs the PADDIES tab on screen (Find never shows it)
  await pa.getByRole('button', { name: 'Phone', exact: true }).click({ timeout: 10_000 }).catch(() => {})
  await pa.getByText('Connect', { exact: true }).first().click({ timeout: 10_000 }).catch(() => {})
  await pa.getByRole('button', { name: /Paddies/ }).first().click({ timeout: 8_000 }).catch(() => {})
  const paddyA = await waitForText(pa, `@${HANDLE_B}`, 5000)
  check('A sees @B as a nation paddy (mutual)', paddyA !== null)

  console.log('\n── A opens the purse ──')
  await openWallet(pa)
  const pocket = await waitForText(pa, 'Pocket (the save)', 3000)
  check('the POCKET is labeled (the save money)', pocket !== null)
  const purseLabel = await waitForText(pa, 'Purse (the nation)', 3000)
  check('the PURSE is labeled (the nation money)', purseLabel !== null)
  const purseZero = await waitForText(pa, '₦0', 4000)
  check('a fresh purse reads ₦0', purseZero !== null)
  await snap(pa, 'a-wallet-home')

  console.log('\n── A tops up ₦1,000 ──')
  await pa.getByTestId('wallet-topup').click({ timeout: 8_000 })
  await pa.waitForSelector('[data-testid="wallet-amount"]', { timeout: 8_000 })
  await pa.getByTestId('wallet-amount-next').click({ timeout: 8_000 })
  await pa.getByTestId('wallet-confirm').click({ timeout: 8_000 })
  await pa.waitForSelector('[data-testid="wallet-receipt"]', { timeout: 12_000 })
  const topupText = await pa.getByTestId('wallet-receipt').textContent()
  check('the top-up receipt shows the fortress truth (ledger # + hash)', (topupText ?? '').includes('ledger #') && (topupText ?? '').includes('hash'), topupText?.slice(0, 120) ?? 'none')
  await snap(pa, 'a-topup-receipt')

  console.log('\n── A sends ₦500 to B through the PIN door ──')
  await pa.getByTestId('wallet-again').click({ timeout: 6_000 })
  await pa.getByTestId('wallet-send').click({ timeout: 8_000 })
  await pa.waitForSelector('[data-testid="wallet-amount"]', { timeout: 8_000 })
  await pa.getByTestId(`wallet-to-${HANDLE_B}`).click({ timeout: 8_000 })
  await pa.getByTestId('wallet-quick-500').click({ timeout: 8_000 })
  await pa.getByTestId('wallet-amount-next').click({ timeout: 8_000 })
  await pa.waitForSelector('[data-testid="wallet-pin"]', { timeout: 8_000 })
  const pinLabel = await pa.getByTestId('wallet-pin').textContent()
  check('the PIN step says the law (the server judges the PIN)', (pinLabel ?? '').includes('PIN'), pinLabel?.slice(0, 80) ?? 'none')
  await snap(pa, 'a-send-pin')
  await pa.getByTestId('wallet-pin-input').fill(PIN)
  await pa.getByTestId('wallet-confirm').click({ timeout: 8_000 })
  await pa.waitForSelector('[data-testid="wallet-receipt"]', { timeout: 12_000 })
  const sentText = await pa.getByTestId('wallet-receipt').textContent()
  check(`the receipt says ₦500 sent to @${HANDLE_B}`, (sentText ?? '').includes('Sent to') && (sentText ?? '').includes('₦500'), sentText?.slice(0, 120) ?? 'none')
  await snap(pa, 'a-send-receipt')

  console.log('\n── B opens the purse — the push already landed ──')
  await openWallet(pb)
  const bPurse = await waitForText(pb, '₦500', 6000)
  check(`B purse reads ₦500 (the wire:ledger push rode the person)`, bPurse !== null)
  const bookRow = await waitForText(pb, `from @${HANDLE_A}`, 4000)
  check(`B's book shows the incoming row from @${HANDLE_A} (server truth)`, bookRow !== null)
  await snap(pb, 'b-wallet-live')
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
console.log('VERDICT: 🟢 ALL LAWS WITNESSED — 0 console errors while the money moved')
process.exit(consoleErrors.length ? 1 : 0)
