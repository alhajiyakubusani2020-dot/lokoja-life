/**
 * ONE-TIME REPAIR — the wire wrote LiveEvent.createdAt as TEXT
 * ("2026-10-17 21:50:13.229") but Prisma's SQLite connector stores
 * DateTime as INTEGER epoch millis. Every TEXT row poisons Prisma's
 * reads of this table ("Inconsistent column data"). This script converts
 * every TEXT createdAt to the true epoch millis (UTC — strftime 'now' is
 * UTC, Date.parse with an explicit Z is honest), verifies, and reports.
 * Idempotent: TEXT rows only; a second run is a no-op.
 */
import { Database } from 'bun:sqlite'

const db = new Database('/home/z/my-project/db/custom.db')
db.exec('PRAGMA busy_timeout = 5000;')

const rows = db
  .query("SELECT seq, createdAt FROM LiveEvent WHERE typeof(createdAt) = 'text' ORDER BY seq ASC")
  .all() as { seq: number; createdAt: string }[]

console.log(`[repair] found ${rows.length} TEXT createdAt rows in LiveEvent`)

let fixed = 0
let skipped = 0
const fixAll = db.transaction(() => {
  for (const r of rows) {
    // SQLite strftime 'now' speaks UTC — parse as UTC or lie
    const ms = Date.parse(r.createdAt.includes('T') ? r.createdAt : `${r.createdAt.replace(' ', 'T')}Z`)
    if (!Number.isFinite(ms)) {
      skipped++
      continue
    }
    db.query('UPDATE LiveEvent SET createdAt = ? WHERE seq = ?').run(ms, r.seq)
    fixed++
  }
})
fixAll()

const remaining = db
  .query("SELECT COUNT(*) AS n FROM LiveEvent WHERE typeof(createdAt) = 'text'")
  .get() as { n: number }
console.log(`[repair] converted=${fixed} skipped=${skipped} remaining_text=${remaining.n}`)

// the verification that matters: a row before AND after the boundary parse
const sample = db.query('SELECT seq, createdAt, typeof(createdAt) as t FROM LiveEvent ORDER BY seq DESC LIMIT 3').all()
console.log('[repair] sample tail:', JSON.stringify(sample))
db.close()
process.exit(remaining.n === 0 ? 0 : 1)
