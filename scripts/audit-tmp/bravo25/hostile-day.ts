/** TEAM BRAVO PH2.5 — the same ceiling law for the day counter + delta path */
import { PrismaClient } from '@prisma/client'
import { randomBytes, scryptSync } from 'node:crypto'
import { POST as pushPOST } from '../../../src/app/api/cloud/push/route'
import { encodeDelta } from '../../../src/game/systems/binarydelta'

const db = new PrismaClient({ log: [] })
const tag = Date.now().toString(36).slice(-6)
const HANDLE = `bravo25_day_${tag}`
const salt = randomBytes(16).toString('hex')
const token = randomBytes(24).toString('hex')
await db.account.create({ data: { handle: HANDLE, pinHash: scryptSync('1234', salt, 32).toString('hex'), salt, ageBand: 'adult', token } })
let pass = 0, fail = 0
const check = (n: string, ok: boolean) => { if (ok) pass++; else fail++; console.log(`${ok ? 'PASS' : 'FAIL'} ${n}`) }
const push = async (body: unknown) => {
  const res = await pushPOST(new Request('http://localhost/api/cloud/push', {
    method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', 'x-forwarded-for': '10.4.4.4' },
    body: JSON.stringify(body),
  }))
  return { status: res.status, body: (await res.json()) as Record<string, unknown> }
}
const valid = { player: { cash: 100 }, world: { day: 1 }, version: 1 }
let r = await push({ data: { ...valid, world: { day: 1e308 } } })
check(`day:1e308 whole → 400 (got ${r.status})`, r.status === 400)
r = await push({ data: valid })
check(`lawful push still ok (got ${r.status})`, r.status === 200)
const baseStr = JSON.stringify(valid)
const hostileNext = JSON.stringify({ ...valid, player: { cash: 1e308 } })
r = await push({ patch: Buffer.from(encodeDelta(baseStr, hostileNext)).toString('base64'), sig: 'x' })
check(`delta rebuild cash:1e308 → 400 (got ${r.status} ${JSON.stringify(r.body.why)})`, r.status === 400)
const goodNext = JSON.stringify({ ...valid, world: { day: 2 } })
r = await push({ patch: Buffer.from(encodeDelta(baseStr, goodNext)).toString('base64'), sig: 'x' })
check(`lawful delta day 1→2 still ok (got ${r.status})`, r.status === 200)
console.log(`== HOSTILE CEILING PROBE: ${pass} PASS / ${fail} FAIL ==`)
await db.$disconnect()
process.exit(fail === 0 ? 0 : 1)
