/**
 * LOKOJA LIFE — THE BOOKS REPAIR (Trust & World Hardening Update, Phase 1-C)
 * ===========================================================================
 * Two deliberate, audited, REVERSIBLE (a fresh backup exists on disk before
 * this runs) repairs to the LIVE books:
 *
 *  R1  THE DMV DEDUPE — 15 VehicleRow rows share 3 plates (LKO-137-DM ×7,
 *      LKO-222-CD ×4, LKO-419-AB ×4). The plate-unique index cannot be born
 *      while clones exist. The OLDEST row (lowest id) keeps the plate — the
 *      first citizen to hold it — every clone gets a fresh lawful plate.
 *
 *  R2  THE STREAMROW EPOCH LAW — 136 StreamRow rows carry updatedAt as ISO
 *      TEXT (the wire wrote toISOString) beside 60 INTEGER rows (Prisma's
 *      @updatedAt) — the exact mixed-type poison that once killed Prisma
 *      reads of LiveEvent. Every text row becomes epoch-ms.
 *
 * Every step prints before/after counts. Run: bun scripts/repair-books.ts
 */

import { Database } from 'bun:sqlite'

const DB = '/home/z/my-project/db/custom.db'
const db = new Database(DB)
db.exec('PRAGMA busy_timeout = 8000')

console.log('── THE BOOKS REPAIR ──')

/* ── R2 first: the type poison (no dependency on the plates) ── */
const before = db.query("SELECT typeof(updatedAt) t, COUNT(*) n FROM StreamRow GROUP BY t").all() as { t: string; n: number }[]
console.log('StreamRow updatedAt BEFORE:', JSON.stringify(before))
const textRows = db.query("SELECT id, updatedAt FROM StreamRow WHERE typeof(updatedAt) = 'text'").all() as { id: string; updatedAt: string }[]
let fixed = 0
for (const r of textRows) {
  const ms = Date.parse(r.updatedAt)
  if (Number.isFinite(ms)) {
    db.query('UPDATE StreamRow SET updatedAt = ? WHERE id = ?').run(ms, r.id)
    fixed++
  } else {
    console.log(`  ⚠️ unparseable timestamp on ${r.id}: ${r.updatedAt} — wrote repair epoch`)
    db.query('UPDATE StreamRow SET updatedAt = ? WHERE id = ?').run(Date.now(), r.id)
    fixed++
  }
}
const after = db.query("SELECT typeof(updatedAt) t, COUNT(*) n FROM StreamRow GROUP BY t").all() as { t: string; n: number }[]
console.log(`R2: ${fixed} text rows normalized. AFTER:`, JSON.stringify(after))

/* ── R1: the DMV dedupe ── */
const dupsBefore = db.query('SELECT plate, COUNT(*) n, COUNT(DISTINCT handle) h FROM VehicleRow GROUP BY plate HAVING n > 1').all() as { plate: string; n: number; h: number }[]
console.log('Dup plates BEFORE:', JSON.stringify(dupsBefore))

const taken = new Set<string>((db.query('SELECT plate FROM VehicleRow').all() as { plate: string }[]).map((r) => r.plate))
function freshPlate(): string {
  for (let i = 0; i < 1000; i++) {
    const letters = 'ABCDEFGHJKLMNPRSTUVWXYZ'
    const num = 100 + Math.floor(Math.random() * 900)
    const suf = letters[Math.floor(Math.random() * letters.length)]! + letters[Math.floor(Math.random() * letters.length)]!
    const p = `LKO-${num}-${suf}`
    if (!taken.has(p)) {
      taken.add(p)
      return p
    }
  }
  throw new Error('the DMV ran out of plates')
}

let reassignments = 0
for (const d of dupsBefore) {
  const rows = db.query('SELECT id, handle, model FROM VehicleRow WHERE plate = ? ORDER BY id ASC').all(d.plate) as { id: number; handle: string; model: string }[]
  const keeper = rows[0]!
  console.log(`  plate ${d.plate}: ${rows.length} rows — keeper ${keeper.handle} (row ${keeper.id})`)
  for (const clone of rows.slice(1)) {
    const np = freshPlate()
    db.query('UPDATE VehicleRow SET plate = ? WHERE id = ?').run(np, clone.id)
    console.log(`    ↳ ${clone.handle} (${clone.model}) re-plated: ${d.plate} → ${np}`)
    reassignments++
  }
}
const dupsAfter = db.query('SELECT plate, COUNT(*) n FROM VehicleRow GROUP BY plate HAVING n > 1').all()
console.log(`R1: ${reassignments} clones re-plated. Dup plates AFTER:`, JSON.stringify(dupsAfter))

/* ── the verdict ── */
const integrity = db.query('PRAGMA integrity_check').get() as { integrity_check: string }
console.log('integrity_check:', integrity.integrity_check)
db.close()
console.log(integrity.integrity_check === 'ok' && Array.isArray(dupsAfter) && dupsAfter.length === 0 ? '✅ THE BOOKS REPAIR: CLEAN' : '❌ THE BOOKS REPAIR: INCOMPLETE')
if (!(integrity.integrity_check === 'ok')) process.exit(1)
