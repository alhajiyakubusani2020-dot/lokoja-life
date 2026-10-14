/**
 * LOKOJA LIFE — M14: THE FORTRESS (pure rules)
 * ---------------------------------------------
 * Prerequisite for virality + trading: the save is SIGNED, the ledger
 * is a CHAIN, the income is GUARDED, and the writes are DOUBLE-BUFFERED.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic. The SHA-256 + HMAC live here in pure TS so
 *    the signing is SYNCHRONOUS everywhere (browser autosave, bun tests,
 *    node) — no async WebCrypto in the save path, no dependency drift.
 *  - The signature is HMAC-SHA256 over the EXACT serialized save string,
 *    keyed by a device-local key stored OUTSIDE the save. A player who
 *    hex-edits their save in localStorage breaks the signature; re-signing
 *    requires the key. (An honest note: anything client-side is a barrier,
 *    not a vault — the barriers here stop casual cheats, memory editors
 *    and shared save hacks, and make tampering LOUD.)
 *  - The kobo-chain: every ledger entry carries hash = H(prevHash | day |
 *    slot | amount | category | label). The chain anchors at 'seed' and
 *    walks oldest→newest; any edited amount, category or order breaks it.
 *  - The income guard: no single event may exceed the ceiling, no day may
 *    out-earn the day cap — an overflow is CLAMPED (never crashed) and
 *    flagged as an anomaly for the honest toast + the anomaly counter.
 *  - Double-buffer: the previous primary payload is copied to the shadow
 *    key BEFORE the primary is overwritten; a torn primary write falls
 *    back to the shadow, then the M9 backup slot, then fresh. Nobody
 *    ever loses a save to a crashed tab mid-write.
 */

/* --------------------------------- SHA-256 ---------------------------------- */

/** Pure TS SHA-256 core over RAW BYTES — returns the digest as 32 raw bytes. */
function sha256BytesRaw(msg: number[]): number[] {
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ]
  const rr = (x: number, n: number) => (x >>> n) | (x << (32 - n))

  const bytes = [...msg]
  const bitLen = bytes.length * 8
  bytes.push(0x80)
  while (bytes.length % 64 !== 56) bytes.push(0)
  // big-endian 64-bit length (we never exceed 2^32 bits — push hi then lo)
  bytes.push(0, 0, 0, 0, (bitLen >>> 24) & 255, (bitLen >>> 16) & 255, (bitLen >>> 8) & 255, bitLen & 255)

  let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a
  let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19
  const w = new Array<number>(64)

  for (let off = 0; off < bytes.length; off += 64) {
    for (let i = 0; i < 16; i++) {
      w[i] = (bytes[off + i * 4] << 24) | (bytes[off + i * 4 + 1] << 16) | (bytes[off + i * 4 + 2] << 8) | bytes[off + i * 4 + 3]
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rr(w[i - 15], 7) ^ rr(w[i - 15], 18) ^ (w[i - 15] >>> 3)
      const s1 = rr(w[i - 2], 17) ^ rr(w[i - 2], 19) ^ (w[i - 2] >>> 10)
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0
    }
    let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7
    for (let i = 0; i < 64; i++) {
      const S1 = rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)
      const ch = (e & f) ^ (~e & g)
      const t1 = (h + S1 + ch + K[i] + w[i]) | 0
      const S0 = rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)
      const maj = (a & b) ^ (a & c) ^ (b & c)
      const t2 = (S0 + maj) | 0
      h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0
    }
    h0 = (h0 + a) | 0; h1 = (h1 + b) | 0; h2 = (h2 + c) | 0; h3 = (h3 + d) | 0
    h4 = (h4 + e) | 0; h5 = (h5 + f) | 0; h6 = (h6 + g) | 0; h7 = (h7 + h) | 0
  }
  const out: number[] = []
  for (const x of [h0, h1, h2, h3, h4, h5, h6, h7]) {
    out.push((x >>> 24) & 255, (x >>> 16) & 255, (x >>> 8) & 255, x & 255)
  }
  return out
}

/** UTF-8 encode a JS string into raw bytes (proper surrogate pairs). */
export function utf8Bytes(msg: string): number[] {
  const bytes: number[] = []
  for (let i = 0; i < msg.length; i++) {
    let c = msg.charCodeAt(i)
    if (c < 0x80) bytes.push(c)
    else if (c < 0x800) bytes.push(0xc0 | (c >> 6), 0x80 | (c & 63))
    else if (c >= 0xd800 && c <= 0xdbff && i + 1 < msg.length) {
      const c2 = msg.charCodeAt(++i)
      c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00)
      bytes.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63))
    } else bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63))
  }
  return bytes
}

/** Pure TS SHA-256 over a UTF-8 string. */
export function sha256(msg: string): string {
  return sha256BytesRaw(utf8Bytes(msg)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** HMAC-SHA256 (RFC 2104). The key is utf8; the pads ride RAW bytes; the inner digest feeds back as 32 RAW bytes. */
export function hmacSha256(key: string, msg: string): string {
  const block = 64
  let kBytes = utf8Bytes(key)
  if (kBytes.length > block) {
    kBytes = utf8Bytes(sha256BytesRaw(kBytes).map((b) => b.toString(16).padStart(2, '0')).join('')) // keyed-longer law: H(key) as hex, utf8
  }
  const kPadded = new Array<number>(block).fill(0)
  for (let i = 0; i < kBytes.length; i++) kPadded[i] = kBytes[i]
  const oKey = kPadded.map((b) => b ^ 0x5c)
  const iKey = kPadded.map((b) => b ^ 0x36)
  const innerDigest = sha256BytesRaw([...iKey, ...utf8Bytes(msg)]) // 32 RAW bytes
  return sha256BytesRaw([...oKey, ...innerDigest]).map((b) => b.toString(16).padStart(2, '0')).join('')
}

/* ------------------------------ save signing -------------------------------- */

/** The device-local fortress key — stored OUTSIDE the save key. */
export const FORT_KEY_STORAGE = 'lokoja-life:fortkey'

/** Sign the exact serialized payload. */
export function signPayload(payload: string, key: string): string {
  return hmacSha256(key, payload)
}

export type VerifyVerdict =
  | { ok: true }
  | { ok: false; why: 'tampered' | 'missing-key' | 'malformed' }

/**
 * Verify a signed envelope. A MISSING key never damns a save — the save
 * re-keys as legacy (the honest recovery: the device lost its key, not
 * the player's honesty). A WRONG signature with a present key = tampered.
 */
export function verifyPayload(payload: string, sig: string, key: string | null): VerifyVerdict {
  if (typeof sig !== 'string' || sig.length === 0) return { ok: false, why: 'malformed' }
  if (key === null || key.length === 0) return { ok: false, why: 'missing-key' }
  const expect = signPayload(payload, key)
  // constant-time-ish compare (length + xor walk)
  if (expect.length !== sig.length) return { ok: false, why: 'tampered' }
  let diff = 0
  for (let i = 0; i < expect.length; i++) diff |= expect.charCodeAt(i) ^ sig.charCodeAt(i)
  return diff === 0 ? { ok: true } : { ok: false, why: 'tampered' }
}

/* ------------------------------ the kobo-chain ------------------------------- */

/** The chain anchor — the first signed entry chains from here. */
export const CHAIN_SEED = 'lko-chain-seed'

export interface ChainTx {
  day: number
  slot: number
  amount: number
  category: string
  label: string
  /** the chain hash this entry carries (undefined = legacy pre-Fortress entry) */
  sig?: string
}

/** One link: H(prev | day | slot | amount | category | label). */
export function chainHash(prev: string, tx: Omit<ChainTx, 'sig'>): string {
  return sha256(`${prev}|${tx.day}|${tx.slot}|${tx.amount}|${tx.category}|${tx.label}`)
}

/** Append a link to the chain (the hash the NEW entry carries). */
export function chainNext(prevHash: string, tx: Omit<ChainTx, 'sig'>): string {
  return chainHash(prevHash, tx)
}

/**
 * Verify the ledger's chain. Legacy entries (no sig) pass as pre-Fortress
 * history; the chain anchors at the FIRST signed entry. Any edited amount,
 * category, order or inserted entry breaks the walk.
 */
export function verifyChain(txs: ChainTx[]): { ok: boolean; brokenAt: number } {
  let prev = CHAIN_SEED
  let anchoring = true
  for (let i = 0; i < txs.length; i++) {
    const t = txs[i]
    if (typeof t.sig !== 'string') {
      // legacy entry: before the first signed link the chain is not live yet
      if (anchoring) continue
      return { ok: false, brokenAt: i }
    }
    anchoring = false
    const expect = chainHash(prev, t)
    if (expect !== t.sig) return { ok: false, brokenAt: i }
    prev = t.sig
  }
  return { ok: true, brokenAt: -1 }
}

/* ------------------------------ the income guard ----------------------------- */

export interface IncomeGuardVerdict {
  /** the amount the player actually receives (≤ the requested amount) */
  allowed: number
  /** true when the ceiling bit and the amount was clamped */
  clamped: boolean
  /** which law bit ('single' | 'day') */
  law: 'single' | 'day' | null
}

export interface VelocityVerdict {
  allow: boolean
  /** the transactions-per-slot cap */
  cap: number
}

/**
 * THE INCOME GUARD — ceilings, not crashes. Every naira a system pays
 * rides through here: a single event above the single ceiling clamps to
 * it; a day's cumulative earned above the day cap clamps to the
 * remainder. Legit Lokoja flows (the ₦150k send-off, biz tills, the
 * remittance) sit far below both lines.
 */
export function incomeGuard(
  amount: number,
  dayEarned: number,
  cfg: { singleCeiling: number; dayCeiling: number },
): IncomeGuardVerdict {
  if (amount <= 0) return { allowed: 0, clamped: false, law: null }
  if (amount > cfg.singleCeiling) {
    return { allowed: cfg.singleCeiling, clamped: true, law: 'single' }
  }
  const room = cfg.dayCeiling - dayEarned
  if (room <= 0) return { allowed: 0, clamped: true, law: 'day' }
  if (amount > room) return { allowed: room, clamped: true, law: 'day' }
  return { allowed: amount, clamped: false, law: null }
}

/** THE VELOCITY GUARD — no flood of micro-events per clock slot. */
export function velocityGuard(txCountThisSlot: number, cap: number): VelocityVerdict {
  return { allow: txCountThisSlot < cap, cap }
}

/* ------------------------------ anomaly verdict ------------------------------ */

export type AnomalyAction = 'continue' | 'rollback'

/**
 * The anomaly verdict: a flagged save continues (clamped, counted,
 * narrated) — the ROLLBACK law only fires for a tampered signature,
 * where the shadow/backup slot decides. This keeps honest-but-weird
 * players in the city and cheaters on the recovery path.
 */
export function anomalyVerdict(anomalyFlag: boolean): AnomalyAction {
  return anomalyFlag ? 'continue' : 'continue'
}

/* --------------------------- the config fingerprint -------------------------- */

/**
 * The compiled-constants law: a fingerprint of the critical economy
 * tables rides in the save. A save from a DIFFERENT (patched or older)
 * build is marked legacy-trusted — we never punish an honest save, we
 * just KNOW which build it came from.
 */
export function configFingerprint(tables: unknown): string {
  let json: string
  try {
    json = JSON.stringify(tables)
  } catch {
    json = 'unserializable'
  }
  return sha256(json).slice(0, 16)
}

/* ------------------------------ fresh slice --------------------------------- */

import type { FortressState } from '../types'

/** A fresh fortress book: no anomalies, an empty day ledger, the seed tail. */
export function freshFortressState(): FortressState {
  return {
    anomalies: 0,
    dayEarnedDay: 0,
    dayEarned: 0,
    slotTxCount: 0,
    slotTxSlot: 0,
    chainTail: CHAIN_SEED,
    fingerprint: null,
  }
}

/* ---------------------------- the double-buffer ------------------------------ */

/** The storage keys the fortress owns. */
export const FORTRESS_KEYS = {
  primary: 'lokoja-life:save',
  shadow: 'lokoja-life:save-b',
} as const

export type LoadStep =
  | { step: 'primary' }
  | { step: 'shadow'; why: string }
  | { step: 'backup'; why: string }
  | { step: 'fresh'; why: string }

/**
 * THE LOAD PLAN — primary → shadow → backup → fresh, narrating each
 * descent. The caller tries each step in order; the first payload that
 * parses AND verifies wins.
 */
export function loadPlan(
  primaryOk: boolean,
  shadowExists: boolean,
  shadowOk: boolean,
  backupExists: boolean,
  backupOk: boolean,
  primaryWhy: string,
  shadowWhy: string,
): LoadStep {
  if (primaryOk) return { step: 'primary' }
  if (shadowExists) {
    if (shadowOk) return { step: 'shadow', why: primaryWhy }
  }
  if (backupExists) {
    if (backupOk) return { step: 'backup', why: shadowExists ? shadowWhy : primaryWhy }
  }
  return { step: 'fresh', why: primaryWhy }
}

/** The write plan: the shadow receives the CURRENT primary before the primary is overwritten. */
export function writePlan(currentPrimary: string | null): { shadowPayload: string | null; overwritePrimary: boolean } {
  return { shadowPayload: currentPrimary, overwritePrimary: true }
}

/** Bench law: signing a save-sized payload must be sub-5ms (the SILK budget). */
export function benchSign(key: string, sizeBytes = 8192): number {
  const payload = 'x'.repeat(sizeBytes)
  const t0 = Date.now()
  signPayload(payload, key)
  return Date.now() - t0
}
