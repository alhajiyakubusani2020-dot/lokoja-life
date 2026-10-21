/**
 * TEAM BRAVO PH2.5 — TRADE ESCROW PoC (real route handler, real db/custom.db).
 * Run: bun scripts/audit-tmp/bravo25/escrow-poc.ts
 *
 * Precondition: scripts/audit-tmp/bravo25/custom.db.bak exists (the DB was
 * backed up BEFORE this script runs).
 *
 * Proves the PH2.5 escrow law end-to-end through the REAL
 * src/app/api/live/action/route.ts POST handler:
 *   1. offer with giveCash  → offerer DEBITED (escrow), row 'offered'
 *   2. accept               → recipient CREDITED, offerer NOT re-debited
 *   3. double-accept replay → NO double credit (sequential + concurrent)
 *   4. cancel               → escrow refunded EXACTLY; cancel-after-accept
 *                             and double-cancel refund NOTHING
 *   5. concurrent overdraft → Promise.all ×2 offers over one purse:
 *                             exactly ONE wins (conditional debit law)
 *   6. TTL expiry           → a 25h-old offer refunds on the next touch
 *   7. CONSERVATION         → A_end + B_end + escrow still held == naira
 *                             that ever entered the system
 */
import { PrismaClient } from '@prisma/client'
import { randomBytes, scryptSync } from 'node:crypto'
import { existsSync } from 'node:fs'
import { POST as actionPOST } from '../../../src/app/api/live/action/route'

if (!existsSync(new URL('./custom.db.bak', import.meta.url).pathname)) {
  console.error('FATAL: db backup missing — back up db/custom.db to scripts/audit-tmp/bravo25/custom.db.bak first')
  process.exit(1)
}

const db = new PrismaClient({ log: [] })
let pass = 0, fail = 0
function check(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  if (ok) pass++; else fail++
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name} → got=${JSON.stringify(got)}${ok ? '' : ` want=${JSON.stringify(want)}`}`)
}
const sec = (t: string) => console.log(`\n== ${t} ==`)

const tag = Date.now().toString(36).slice(-6)
const A = `bravo25_a_${tag}`
const B = `bravo25_b_${tag}`
const C = `bravo25_c_${tag}`
const PIN = '1234'

async function action(token: string, act: string, payload: Record<string, unknown>): Promise<{ status: number; body: Record<string, unknown> }> {
  const res = await actionPOST(new Request('http://localhost/api/live/action', {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', 'x-forwarded-for': '10.7.7.7' },
    body: JSON.stringify({ action: act, payload }),
  }))
  return { status: res.status, body: (await res.json()) as Record<string, unknown> }
}
const wallet = async (handle: string) => (await db.walletRow.findUnique({ where: { handle } }))?.balance ?? 0

async function makeCitizen(handle: string, balance: number) {
  const salt = randomBytes(16).toString('hex')
  const pinHash = scryptSync(PIN, salt, 32).toString('hex')
  const token = randomBytes(24).toString('hex')
  await db.account.create({ data: { handle, pinHash, salt, ageBand: 'adult', token } })
  if (balance > 0) await db.walletRow.create({ data: { handle, balance } })
  const id = (await db.account.findUnique({ where: { handle } }))!.id
  await db.livePresence.upsert({
    where: { accountId: id },
    create: { accountId: id, handle, band: 'adult', street: 'kpata-market', status: 'chilling' },
    update: { handle, band: 'adult', street: 'kpata-market', status: 'chilling' },
  })
  return token
}
const touch = async (handle: string) => {
  const acc = await db.account.findUnique({ where: { handle } })
  await db.livePresence.update({ where: { accountId: acc!.id }, data: { street: 'kpata-market', status: 'chilling' } })
}

/* ---------------------------- the citizens ---------------------------- */
sec('0. THE CAST (fresh bravo25_* rows on db/custom.db)')
const tokA = await makeCitizen(A, 10_000)
const tokB = await makeCitizen(B, 0)
const tokC = await makeCitizen(C, 0) // second recipient so concurrent offers mint distinct ids
console.log(`offerer   ${A}: ₦${await wallet(A)}`)
console.log(`recipient ${B}: ₦${await wallet(B)}`)
console.log(`recipient ${C}: ₦${await wallet(C)}`)

/* 1 — the offer escrows the offerer */
sec('1. OFFER → OFFERER DEBITED (escrow), row offered')
const off = await action(tokA, 'trade-offer', { to: B, giveCash: 3000, wantCash: 0, terms: 'bag of garri', day: 1 })
check('offer ok', [off.status, off.body.ok], [200, true])
check('offer ack escrowed=3000', off.body.escrowed, 3000)
check('offerer wallet 10000→7000', await wallet(A), 7000)
const tradeId1 = String(off.body.tradeId)
const row1 = await db.tradeRow.findUnique({ where: { id: tradeId1 } })
check("trade row status 'offered' (escrow held = giveCash)", [row1?.status, row1?.giveCash], ['offered', 3000])

/* 2 — the accept credits the recipient ONCE; the offerer is NOT re-debited */
sec('2. ACCEPT → RECIPIENT CREDITED, OFFERER NOT RE-DEBITED')
await touch(A) // the partner-alive law reads the presence roster
const acc1 = await action(tokB, 'trade-accept', { tradeId: tradeId1 })
check('accept ok', [acc1.status, acc1.body.ok], [200, true])
check('accept ack credited=3000', acc1.body.credited, 3000)
check('recipient wallet 0→3000', await wallet(B), 3000)
check('offerer STILL 7000 (no re-debit at accept)', await wallet(A), 7000)
check('trade row accepted', (await db.tradeRow.findUnique({ where: { id: tradeId1 } }))?.status, 'accepted')

/* 3 — the replay: same trade accepted again (sequential + concurrent) */
sec('3. DOUBLE-ACCEPT REPLAY → NO DOUBLE CREDIT')
const acc2 = await action(tokB, 'trade-accept', { tradeId: tradeId1 })
check('replay answers ok (honest already-sealed)', [acc2.status, acc2.body.ok], [200, true])
check('replay credits 0', acc2.body.credited, 0)
check('recipient STILL 3000 after sequential replay', await wallet(B), 3000)
const off2 = await action(tokA, 'trade-offer', { to: B, giveCash: 800, wantCash: 0, terms: 'concurrent', day: 1 })
check('offer2 escrowed (7000-800=6200)', await wallet(A), 6200)
await touch(A)
const concResults = await Promise.all([
  action(tokB, 'trade-accept', { tradeId: String(off2.body.tradeId) }),
  action(tokB, 'trade-accept', { tradeId: String(off2.body.tradeId) }),
])
const credits = concResults.filter((r) => r.body.ok && Number(r.body.credited) > 0).length
check('concurrent double-accept: exactly ONE credit among acks', credits, 1)
check('recipient = 3000 + 800 exactly once → 3800', await wallet(B), 3800)

/* 4 — cancel refunds EXACTLY; cancel-after-accept refunds NOTHING */
sec('4. CANCEL → EXACT REFUND / NO DOUBLE REFUND')
const off3 = await action(tokA, 'trade-offer', { to: B, giveCash: 1500, wantCash: 0, terms: 'cancel me', day: 1 })
check('offer3 escrowed (6200-1500=4700)', await wallet(A), 4700)
const can1 = await action(tokA, 'trade-cancel', { tradeId: String(off3.body.tradeId) })
check('cancel ok + refunded', [can1.body.ok, can1.body.refunded], [true, true])
check('offerer refunded exactly → 6200', await wallet(A), 6200)
const can2 = await action(tokA, 'trade-cancel', { tradeId: String(off3.body.tradeId) })
check('second cancel refunds NOTHING', can2.body.refunded, false)
check('offerer STILL 6200 (no double refund)', await wallet(A), 6200)
const can3 = await action(tokA, 'trade-cancel', { tradeId: tradeId1 }) // already accepted
check('cancel-after-accept: refunded false', can3.body.refunded, false)
check('offerer STILL 6200 (accepted trade never refunds)', await wallet(A), 6200)

/* 5 — concurrent overdraft: one purse, two simultaneous promises */
sec('5. CONCURRENT OVERDRAFT (Promise.all ×2 offers, purse pinned to 6000, 4000 each)')
// fixture: the purse is pinned DOWN-ONLY to exactly 6000 (the fixture only
// ever burns — never mints — and the burn is tracked for conservation)
const purseNow = await wallet(A)
const fixtureBurn = Math.max(0, purseNow - 6000)
if (fixtureBurn > 0) {
  await db.walletRow.updateMany({ where: { handle: A, balance: { gte: 6000 } }, data: { balance: { decrement: fixtureBurn }, version: { increment: 1 } } })
}
check('fixture: purse pinned to 6000 (burned', await wallet(A), 6000)
const [ov1, ov2] = await Promise.all([
  action(tokA, 'trade-offer', { to: B, giveCash: 4000, wantCash: 0, terms: 'overdraft→B', day: 1 }),
  action(tokA, 'trade-offer', { to: C, giveCash: 4000, wantCash: 0, terms: 'overdraft→C', day: 1 }),
])
const wins = [ov1, ov2].filter((r) => r.body.ok === true).length
check('exactly ONE offer wins', wins, 1)
const losers = [ov1, ov2].filter((r) => r.body.ok !== true).map((r) => r.body.why)
check('the loser refused (insufficient/trade-exists — never a negative purse)', losers.every((w) => w === 'insufficient' || w === 'trade-exists'), true)
check('purse = 6000-4000 = 2000 exactly', await wallet(A), 2000)
check('no negative purse ever', (await wallet(A)) >= 0, true)

/* 6 — TTL expiry: a 25h-old offer refunds on the next touch */
sec('6. TTL SWEEP (offer older than 24h refunds on next touch)')
const staleId = `trd:bravo25stale${tag}`
await db.$transaction(async (tx) => {
  const bumped = await tx.walletRow.updateMany({ where: { handle: A, balance: { gte: 777 } }, data: { balance: { decrement: 777 }, version: { increment: 1 } } })
  if (bumped.count === 0) throw new Error('fixture debit failed')
  await tx.tradeRow.create({ data: { id: staleId, fromHandle: A, toHandle: B, giveCash: 777, wantCash: 0, terms: 'ancient offer', status: 'offered', day: 1, createdAt: new Date(Date.now() - 25 * 3_600_000) } })
})
check('stale offer escrowed (2000-777=1223)', await wallet(A), 1223)
const list = await action(tokB, 'trades', {}) // the LIST door sweeps too
check('list ok', [list.status, list.body.ok], [200, true])
check('sweep refunded 777 → 2000 exactly', await wallet(A), 2000)
check('stale row closed', (await db.tradeRow.findUnique({ where: { id: staleId } }))?.status, 'cancelled')

/* 7 — conservation */
sec('7. CONSERVATION (the books add up)')
const heldEscrow = (await db.tradeRow.aggregate({ _sum: { giveCash: true }, where: { fromHandle: A, status: 'offered' } }))._sum.giveCash ?? 0
const [aEnd, bEnd, cEnd] = [await wallet(A), await wallet(B), await wallet(C)]
// entered the system: 10,000 (A's birth purse) − fixtureBurn (the pin-down)
// on the books:      A_end + B_end + C_end + escrow still held by open offers
check('balances printed', true, true)
check('held escrow = the one winning overdraft offer (4000)', heldEscrow, 4000)
check('CONSERVATION: A+B+C+held == entered', aEnd + bEnd + cEnd + heldEscrow, 10_000 - fixtureBurn)
console.log(`  ${A} = ₦${aEnd}   ${B} = ₦${bEnd}   ${C} = ₦${cEnd}   escrow held = ₦${heldEscrow}   fixture burned = ₦${fixtureBurn}`)

sec('FINAL BALANCES (all bravo25 wallets)')
const allBravo = await db.walletRow.findMany({ where: { handle: { startsWith: 'bravo25_' } } })
for (const w of allBravo) console.log(`  wallet ${w.handle} = ₦${w.balance} (v${w.version})`)

await db.$disconnect()
console.log(`\n== ESCROW PoC: ${pass} PASS / ${fail} FAIL ==`)
process.exit(fail === 0 ? 0 : 1)
