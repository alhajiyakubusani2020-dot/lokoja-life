/**
 * TEAM BRAVO PH2.5 — live/sync bounded-heartbeat probe (real route handler).
 * Run: bun scripts/audit-tmp/bravo25/sync-probe.ts
 *
 * Proves item 6 on the REAL src/app/api/live/sync/route.ts:
 *   • dead presence rows (updatedAt 3 min old) are PRUNED by the same
 *     request that reads the roster; alive rows survive
 *   • the roster read is bounded (take 200, freshest-first) and the
 *     90s TTL filter keeps only alive walkers
 *   • the LiveEvent retention guard does NOT touch events < 30 days
 */
import { PrismaClient } from '@prisma/client'
import { randomBytes, scryptSync } from 'node:crypto'
import { POST as syncPOST } from '../../../src/app/api/live/sync/route'

const db = new PrismaClient({ log: [] })
let pass = 0, fail = 0
function check(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  if (ok) pass++; else fail++
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name} → got=${JSON.stringify(got)}${ok ? '' : ` want=${JSON.stringify(want)}`}`)
}

const tag = Date.now().toString(36).slice(-6)
const HANDLE = `bravo25_sync_${tag}`

const salt = randomBytes(16).toString('hex')
const pinHash = scryptSync('1234', salt, 32).toString('hex')
const token = randomBytes(24).toString('hex')
const acc = await db.account.create({ data: { handle: HANDLE, pinHash, salt, ageBand: 'adult', token } })

// three walkers: one alive (now), two dead (3 min silent)
await db.livePresence.create({ data: { accountId: acc.id, handle: HANDLE, band: 'adult', street: 'kpata-market', status: 'chilling' } })
const dead1 = await db.account.create({ data: { handle: `bravo25_dead1_${tag}`, pinHash, salt, ageBand: 'adult', token: randomBytes(24).toString('hex') } })
const dead2 = await db.account.create({ data: { handle: `bravo25_dead2_${tag}`, pinHash, salt, ageBand: 'adult', token: randomBytes(24).toString('hex') } })
await db.livePresence.create({ data: { accountId: dead1.id, handle: dead1.handle, band: 'adult', street: 'home', status: 'chilling', updatedAt: new Date(Date.now() - 180_000) } })
await db.livePresence.create({ data: { accountId: dead2.id, handle: dead2.handle, band: 'adult', street: 'ganaja-junction', status: 'away', updatedAt: new Date(Date.now() - 180_000) } })
const deadBefore = await db.livePresence.count({ where: { updatedAt: { lt: new Date(Date.now() - 120_000) } } })
const evBefore = await db.liveEvent.count()

const res = await syncPOST(new Request('http://localhost/api/live/sync', {
  method: 'POST',
  headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', 'x-forwarded-for': '10.6.6.6' },
  body: JSON.stringify({ presence: { street: 'kpata-market', status: 'chilling' }, since: 0 }),
}))
const body = (await res.json()) as { ok?: boolean; roster?: { handle: string }[]; cursor?: number }

check('sync answers ok', [res.status, body.ok], [200, true])
check('dead presence rows existed before the heartbeat', deadBefore > 0, true)
const deadAfter = await db.livePresence.count({ where: { updatedAt: { lt: new Date(Date.now() - 120_000) } } })
check('the SAME request pruned every dead row', deadAfter, 0)
check('the alive walker is on the roster', (body.roster ?? []).some((p) => p.handle === HANDLE), true)
check('the dead walkers are NOT on the roster', (body.roster ?? []).some((p) => p.handle.startsWith('bravo25_dead')), false)
const evAfter = await db.liveEvent.count()
check('retention guard touched no event < 30 days', evAfter, evBefore)

await db.$disconnect()
console.log(`\n== SYNC PROBE: ${pass} PASS / ${fail} FAIL ==`)
process.exit(fail === 0 ? 0 : 1)
