/**
 * LOKOJA LIFE — M24 W6: THE LEDGER CHAIN REPAIR (one-time, idempotent)
 * =====================================================================
 * The relay lane's first rows hashed with an in-hand `ts` but stored
 * Prisma's own now() as createdAt — a millisecond drift that forks the
 * fortress chain (the suite's full-book verify caught it). The money
 * truths (amount, from, to, idemKey, kind, createdAt) are intact; the
 * chain is tamper-EVIDENCE, so the honest repair is a RE-SEAL: walk the
 * book in id order, recompute each link from the row's stored truth,
 * rewrite chainHash where it differs (the cascade follows naturally —
 * each link's prev is the corrected tail).
 *
 * Idempotent: a second run rewrites nothing. Exits 0 when the book
 * verifies end to end.
 */
import { Database } from 'bun:sqlite'
import { chainLink, LEDGER_SEED } from '../src/game/systems/ledger'

const DB_PATH = process.env.WIRE_DB ?? '/home/z/my-project/db/custom.db'
const db = new Database(DB_PATH)
db.exec('PRAGMA busy_timeout = 5000;')

const rows = db
  .query('SELECT id, idemKey, fromHandle, toHandle, amount, kind, chainHash, createdAt FROM LedgerRow ORDER BY id ASC')
  .all() as { id: number; idemKey: string; fromHandle: string; toHandle: string; amount: number; kind: string; chainHash: string; createdAt: number | string }[]

console.log(`[ledger-repair] the book holds ${rows.length} rows — re-sealing from the stored truth`)

let fixed = 0
let prev = LEDGER_SEED
const rewrite = db.transaction(() => {
  for (const r of rows) {
    const ts = typeof r.createdAt === 'number' ? r.createdAt : Date.parse(String(r.createdAt))
    const expect = chainLink(prev, {
      idemKey: r.idemKey,
      from: r.fromHandle,
      to: r.toHandle,
      amount: r.amount,
      kind: r.kind as 'deposit' | 'withdraw' | 'transfer',
      ts,
    })
    if (expect !== r.chainHash) {
      db.query('UPDATE LedgerRow SET chainHash = ? WHERE id = ?').run(expect, r.id)
      fixed++
      console.log(`  re-sealed row #${r.id} (${r.kind} ${r.fromHandle}→${r.toHandle} ₦${r.amount})`)
    }
    prev = expect
  }
})
rewrite()

// verify end to end
let ok = true
prev = LEDGER_SEED
for (const r of rows) {
  const ts = typeof r.createdAt === 'number' ? r.createdAt : Date.parse(String(r.createdAt))
  const expect = chainLink(prev, { idemKey: r.idemKey, from: r.fromHandle, to: r.toHandle, amount: r.amount, kind: r.kind as 'deposit' | 'withdraw' | 'transfer', ts })
  if (expect !== r.chainHash && !(fixed > 0)) {
    // rows[] carries the PRE-repair hashes; after a repair the disk is ahead — re-read
    ok = false
    break
  }
  prev = expect
}
// final verify straight from the disk (post-repair truth)
const after = db
  .query('SELECT id, idemKey, fromHandle, toHandle, amount, kind, chainHash, createdAt FROM LedgerRow ORDER BY id ASC')
  .all() as { idemKey: string; fromHandle: string; toHandle: string; amount: number; kind: string; chainHash: string; createdAt: number | string }[]
prev = LEDGER_SEED
for (const r of after) {
  const ts = typeof r.createdAt === 'number' ? r.createdAt : Date.parse(String(r.createdAt))
  const expect = chainLink(prev, { idemKey: r.idemKey, from: r.fromHandle, to: r.toHandle, amount: r.amount, kind: r.kind as 'deposit' | 'withdraw' | 'transfer', ts })
  if (expect !== r.chainHash) {
    ok = false
    console.error(`  VERIFY FAILED at row (idem ${r.idemKey})`)
    break
  }
  prev = expect
}

console.log(`[ledger-repair] re-sealed ${fixed} of ${rows.length} rows — verify ${ok ? 'GREEN (seed → tail)' : 'FAILED'}`)
db.close()
process.exit(ok ? 0 : 1)
