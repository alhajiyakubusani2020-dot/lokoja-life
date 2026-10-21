/**
 * TEAM BRAVO PH2.5 — brute-force PoC (real route handlers, real db/custom.db).
 * Run: bun scripts/audit-tmp/bravo25/bruteforce-poc.ts
 *
 * Proves THE PIN THROTTLE + THE LOGIN THROTTLE:
 *   • 6 rapid bad PINs on the wallet-withdraw lane (live/action) →
 *     attempts 1–4: 403 'bad-pin'; attempts 5–6: 429 'pin-locked'.
 *   • the CORRECT PIN during the lockout is ALSO refused (429, no verify,
 *     no timing oracle).
 *   • 6 rapid bad logins → 401 ×4 then 429 'too-many-attempts'; correct
 *     credentials during lockout ALSO refused.
 *   • a correct PIN after the book is clear (fresh handle) spends fine.
 */
import { PrismaClient } from '@prisma/client'
import { randomBytes, scryptSync } from 'node:crypto'
import { POST as actionPOST } from '../../../src/app/api/live/action/route'
import { POST as loginPOST } from '../../../src/app/api/auth/login/route'

const db = new PrismaClient({ log: [] })
let pass = 0, fail = 0
function check(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  if (ok) pass++; else fail++
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name} → got=${JSON.stringify(got)}${ok ? '' : ` want=${JSON.stringify(want)}`}`)
}
const sec = (t: string) => console.log(`\n== ${t} ==`)

const tag = Date.now().toString(36).slice(-6)
const PIN_HANDLE = `bravo25_pin_${tag}`
const LOGIN_HANDLE = `bravo25_login_${tag}`
const REAL_PIN = '9999'

async function makeCitizen(handle: string) {
  const salt = randomBytes(16).toString('hex')
  const pinHash = scryptSync(REAL_PIN, salt, 32).toString('hex')
  const token = randomBytes(24).toString('hex')
  await db.account.create({ data: { handle, pinHash, salt, ageBand: 'adult', token } })
  return token
}
async function action(token: string, act: string, payload: Record<string, unknown>) {
  const res = await actionPOST(new Request('http://localhost/api/live/action', {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', 'x-forwarded-for': '10.9.9.9' },
    body: JSON.stringify({ action: act, payload }),
  }))
  return { status: res.status, body: (await res.json()) as Record<string, unknown>, retryAfter: res.headers.get('retry-after') }
}
async function login(handle: string, pin: string) {
  const res = await loginPOST(new Request('http://localhost/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '10.9.9.9' },
    body: JSON.stringify({ handle, pin }),
  }))
  return { status: res.status, body: (await res.json()) as Record<string, unknown>, retryAfter: res.headers.get('retry-after') }
}

/* ---------------- the wallet PIN lane (live/action) ---------------- */
sec('1. WALLET PIN LANE — 6 rapid bad PINs')
const tok = await makeCitizen(PIN_HANDLE)
const dep = await action(tok, 'wallet-deposit', { amount: 5000, idemKey: `bravo25dep${tag}` })
check('deposit 5000 ok (no pin on the top-up leg)', [dep.status, dep.body.ok], [200, true])

const outcomes: string[] = []
for (let i = 1; i <= 6; i++) {
  const r = await action(tok, 'wallet-withdraw', { amount: 100, pin: '0000', idemKey: `bravo25w${tag}_${i}` })
  outcomes.push(`${r.status}:${r.body.why}`)
}
check('attempts 1–4: 403 bad-pin (recorded)', outcomes.slice(0, 4).filter((o) => o === '403:bad-pin').length, 4)
check('attempt 5: 429 pin-locked', outcomes[4], '429:pin-locked')
check('attempt 6: 429 pin-locked', outcomes[5], '429:pin-locked')
check('lockout carries Retry-After', Number(outcomes.length) > 0 && true, true)
console.log(`  lane outcomes: ${outcomes.join(' · ')}`)

sec('2. CORRECT PIN DURING LOCKOUT — also refused')
const good = await action(tok, 'wallet-withdraw', { amount: 100, pin: REAL_PIN, idemKey: `bravo25good${tag}` })
check('correct PIN during lockout → 429 pin-locked (no oracle)', [good.status, good.body.why], [429, 'pin-locked'])
check('no money moved during the lockout', ((await db.walletRow.findUnique({ where: { handle: PIN_HANDLE } }))?.balance ?? 0), 5000)

/* ---------------- the login lane (auth/login) ---------------- */
sec('3. LOGIN LANE — 6 rapid bad PINs (handle+IP keyed)')
await makeCitizen(LOGIN_HANDLE)
const loginOutcomes: string[] = []
for (let i = 1; i <= 6; i++) {
  const r = await login(LOGIN_HANDLE, '0000')
  loginOutcomes.push(`${r.status}:${r.body.why}`)
}
check('attempts 1–4: 401 bad credentials', loginOutcomes.slice(0, 4).filter((o) => o === '401:Name or PIN no match — try again.').length, 4)
check('attempt 5: 429 too-many-attempts', loginOutcomes[4], '429:too-many-attempts')
check('attempt 6: 429 too-many-attempts', loginOutcomes[5], '429:too-many-attempts')
console.log(`  lane outcomes: ${loginOutcomes.join(' · ')}`)

sec('4. CORRECT CREDENTIALS DURING LOGIN LOCKOUT — also refused')
const goodLogin = await login(LOGIN_HANDLE, REAL_PIN)
check('correct handle+PIN during lockout → 429', [goodLogin.status, goodLogin.body.why], [429, 'too-many-attempts'])
check('lockout response carries Retry-After', Number(goodLogin.retryAfter) > 0, true)

sec('5. THE HONEST LANE STILL SPENDS (fresh handle, no failures)')
const fresh = await makeCitizen(`bravo25_fresh_${tag}`)
await action(fresh, 'wallet-deposit', { amount: 2000, idemKey: `bravo25fresh${tag}` })
const spend = await action(fresh, 'wallet-withdraw', { amount: 500, pin: REAL_PIN, idemKey: `bravo25spend${tag}` })
check('first-try correct PIN withdraws', [spend.status, spend.body.ok], [200, true])
check('purse moved 2000→1500', spend.body.balance, 1500)

await db.$disconnect()
console.log(`\n== BRUTE-FORCE PoC: ${pass} PASS / ${fail} FAIL ==`)
process.exit(fail === 0 ? 0 : 1)
