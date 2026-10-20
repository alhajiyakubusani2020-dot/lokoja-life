/**
 * LOKOJA LIFE — THE TEST/PROD SEAM (Trust & World Hardening Update, AUD-D)
 * ========================================================================
 * THE LAW handed down: NO test suite may ever write to the production
 * books (db/custom.db), and NO suite may kill or hijack a shared port.
 *
 * This module is the seam every suite rides:
 *   - makeTestDb(label)  — VACUUMs a consistent throwaway copy of the live
 *     books out of a READONLY open of db/custom.db into /tmp and returns
 *     the copy path. The copy is the arena: spawn the scratch wire with
 *     WIRE_DB=<copy>, seed fixtures into it, break it, drop it.
 *   - dropTestDb(path)   — the teardown law: the copy (and its WAL
 *     sidecars) leaves the disk.
 *   - seedAccount(db, …) — births a fixture citizen DIRECTLY in a copy,
 *     mirroring the register door's column set (scrypt PIN + salt, token,
 *     the M13 parent shield for minors). Fixtures live in the COPY, never
 *     in the live books.
 *   - scrubTestHandles(db, …) — clears a suite's own stamped handles (and
 *     their rows) out of a copy before seeding, so reruns are deterministic
 *     even when the snapshot carries stale fixture rows from past runs.
 *
 * The live books are opened READONLY here — once, briefly, per copy.
 * Run: import { makeTestDb } from './lib/test-db'
 */

import { Database } from 'bun:sqlite'
import { randomBytes, scryptSync } from 'node:crypto'
import { unlinkSync } from 'node:fs'

/** THE one production database. Never opened for writing by a suite. */
export const LIVE_DB = '/home/z/my-project/db/custom.db'

/**
 * The throwaway books: a consistent, ACID snapshot of the live db via
 * VACUUM INTO, taken through a readonly open (WAL-safe — the live wire
 * and the relay keep writing while the copy is cut). Returns the copy path.
 */
export function makeTestDb(label: string): string {
  const safe = label.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40) || 'test'
  const path = `/tmp/lokoja-${safe}-${Date.now().toString(36)}.db`
  const live = new Database(LIVE_DB, { readonly: true })
  try {
    live.exec(`VACUUM INTO '${path}'`)
  } finally {
    live.close()
  }
  return path
}

/** THE TEARDOWN LAW: the copy and its sidecars leave the disk. */
export function dropTestDb(path: string): void {
  for (const p of [path, `${path}-wal`, `${path}-shm`]) {
    try {
      unlinkSync(p)
    } catch {
      /* already gone */
    }
  }
}

/**
 * A fixture citizen born in a COPY (never in the live books): the same
 * column set the /api/auth/register door writes — scrypt-hashed PIN with a
 * per-account salt, a bearer token the wire's handshake trusts, and the
 * M13 parent shield (own salt + hash) behind every minor. Returns the token.
 */
export function seedAccount(
  db: Database,
  opts: { handle: string; band?: 'adult' | 'teen' | 'kid'; pin?: string; parentPin?: string; token?: string },
): { ok: true; token: string } {
  const band = opts.band ?? 'adult'
  const minor = band !== 'adult'
  const pin = opts.pin ?? '1234'
  if (minor && !opts.parentPin) throw new Error(`seedAccount: ${opts.handle} is a ${band} — a parent PIN is the law`)
  const salt = randomBytes(16).toString('hex')
  const pinHash = scryptSync(pin, salt, 32).toString('hex')
  const parentSalt = minor ? randomBytes(16).toString('hex') : null
  const parentPinHash = minor ? scryptSync(opts.parentPin!, parentSalt!, 32).toString('hex') : null
  const token = opts.token ?? randomBytes(24).toString('hex')
  const id = randomBytes(12).toString('hex')
  const now = Date.now()
  db.query(
    'INSERT INTO Account (id, handle, contact, pinHash, salt, ageBand, parentPinHash, parentSalt, token, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  ).run(id, opts.handle, minor ? null : `${opts.handle}@lokoja.ng`, pinHash, salt, band, parentPinHash, parentSalt, token, now, now)
  return { ok: true, token }
}

/**
 * Clear a suite's own stamped handles (and every row that hangs off them)
 * out of a COPY before seeding — the copy is ours, this is fixture prep.
 * Keeps reruns deterministic when the snapshot still carries stale rows
 * from a past run of the same suite (per-run stamps can repeat).
 */
export function scrubTestHandles(db: Database, handles: string[]): void {
  if (!handles.length) return
  const ph = handles.map(() => '?').join(',')
  db.query(`DELETE FROM VehicleRow WHERE handle IN (${ph})`).run(...handles)
  db.query(`DELETE FROM LedgerRow WHERE fromHandle IN (${ph}) OR toHandle IN (${ph})`).run(...handles, ...handles)
  db.query(`DELETE FROM LiveEvent WHERE actor IN (${ph}) OR channel IN (${ph})`).run(...handles, ...handles.map((h) => `ledger:${h}`))
  db.query(`DELETE FROM WalletRow WHERE handle IN (${ph})`).run(...handles)
  db.query(`DELETE FROM Account WHERE handle IN (${ph})`).run(...handles)
}
