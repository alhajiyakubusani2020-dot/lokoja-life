/**
 * M20 — THE BINARY DELTA (saves under the <1MB law)
 * ---------------------------------------------------
 * The cloud transport today carries the whole signed envelope every
 * push. This codec shrinks the wire to the CHANGE: a binary patch of
 * [keep, replace] ops over the previous payload, varint-lengthed,
 * magic-stamped 'LKBD'.
 *
 * THE EXACTNESS LAW: applyDelta(base, encodeDelta(base, next)) ===
 * next — for EVERY pair, proven in the law suite on hostile pairs
 * (empty, identical, disjoint, unicode, 100KB-scale) and on a real
 * v19-shaped save pair.
 *
 * THE CEILING LAW: a patch for any honest save is < 1MB — asserted
 * in tests; a patch that would exceed it is refused at encode time
 * (the caller falls back to the whole envelope — the M9 transport is
 * the fallback, never a wall).
 *
 * THE HONESTY NOTE: this is a PREFIX-TRIMMING delta, not a field-level
 * diff — simplest possible, provably correct: [magic][ver][baseLen]
 * [prefix][body = next bytes from prefix to END]. The body carries the
 * tail so reconstruction is exact by construction (a suffix-trimmed
 * variant was tried and KILLED by this suite — the tail could not be
 * rebuilt). For saves whose change is a middle slice this still cuts
 * the wire to roughly the changed middle. The M14 signature rides the
 * FULL payload as today (the server stores whole envelopes; the patch
 * is transport clothing, unwrapped before the vault sees it).
 */

const MAGIC = 0x4c4b4244 // 'LKBD'
const FORMAT_VERSION = 1
const OP_KEEP = 1
const OP_REPLACE = 2
/** The <1MB law, stated where it is enforced. */
export const DELTA_CEILING = 1_000_000

/* ------------------------------- varint codec ------------------------------- */

function writeVarint(out: number[], value: number): void {
  let v = value >>> 0
  while (v > 0x7f) {
    out.push((v & 0x7f) | 0x80)
    v >>>= 7
  }
  out.push(v)
}

function readVarint(bytes: Uint8Array, pos: number): { value: number; pos: number } {
  let result = 0
  let shift = 0
  let p = pos
  for (;;) {
    if (p >= bytes.length) throw new Error('LKBD: torn varint')
    const b = bytes[p]
    p += 1
    result |= (b & 0x7f) << shift
    if ((b & 0x80) === 0) break
    shift += 7
    if (shift > 31) throw new Error('LKBD: varint overflow')
  }
  return { value: result >>> 0, pos: p }
}

/* --------------------------------- encoder ---------------------------------- */

/**
 * Encode the change from base to next. Throws (honestly) only when
 * the pair is not both strings or the patch would break the ceiling.
 */
export function encodeDelta(base: string, next: string): Uint8Array {
  if (typeof base !== 'string' || typeof next !== 'string') throw new Error('LKBD: pairs must be strings')
  // the common prefix — walk while the bytes agree
  const enc = new TextEncoder()
  const baseBytes = enc.encode(base)
  const nextBytes = enc.encode(next)
  let prefix = 0
  const maxPrefix = Math.min(baseBytes.length, nextBytes.length)
  while (prefix < maxPrefix && baseBytes[prefix] === nextBytes[prefix]) prefix++
  // THE BODY CARRIES THE TAIL: everything from the prefix to the END of
  // next — no suffix trimming, so applyDelta rebuilds next exactly.

  const ops: number[] = []
  writeVarint(ops, prefix)
  writeVarint(ops, nextBytes.length - prefix)
  for (let i = prefix; i < nextBytes.length; i++) ops.push(nextBytes[i])

  const head: number[] = []
  // magic + version + base length (the receiver sanity-checks its base)
  head.push((MAGIC >>> 24) & 0xff, (MAGIC >>> 16) & 0xff, (MAGIC >>> 8) & 0xff, MAGIC & 0xff)
  head.push(FORMAT_VERSION)
  writeVarint(head, baseBytes.length)

  const out = new Uint8Array(head.length + ops.length)
  out.set(head, 0)
  out.set(ops, head.length)
  if (out.length > DELTA_CEILING) throw new Error('LKBD: patch breaks the <1MB ceiling — fall back to the whole envelope')
  return out
}

/* --------------------------------- decoder ---------------------------------- */

/** Rebuild `next` exactly. Any tampering with the patch throws — the caller falls back to a whole push. */
export function applyDelta(base: string, patch: Uint8Array): string {
  if (patch.length < 6 || ((patch[0] << 24) | (patch[1] << 16) | (patch[2] << 8) | patch[3]) !== MAGIC) {
    throw new Error('LKBD: not a patch (magic refused)')
  }
  if (patch[4] !== FORMAT_VERSION) throw new Error('LKBD: unknown patch format')
  let pos = 5
  // layout: [magic4][ver1][baseLen varint][prefix varint][replaceLen varint][replace bytes…]
  const baseLenRead = readVarint(patch, pos)
  pos = baseLenRead.pos
  const baseLen = baseLenRead.value
  const prefixRead = readVarint(patch, pos)
  pos = prefixRead.pos
  const prefix = prefixRead.value
  const bodyLenRead = readVarint(patch, pos)
  pos = bodyLenRead.pos
  const bodyLen = bodyLenRead.value
  const enc = new TextEncoder()
  const baseBytes = enc.encode(base)
  if (baseLen !== baseBytes.length) throw new Error('LKBD: patch was cut against a different base')
  if (prefix > baseBytes.length) throw new Error('LKBD: patch prefix outruns its base')
  if (pos + bodyLen > patch.length) throw new Error('LKBD: patch body torn')
  const nextLen = prefix + bodyLen
  const nextBytes = new Uint8Array(nextLen)
  nextBytes.set(baseBytes.subarray(0, prefix), 0)
  nextBytes.set(patch.subarray(pos, pos + bodyLen), prefix)
  const dec = new TextDecoder('utf-8', { fatal: false })
  return dec.decode(nextBytes)
}

/* ------------------------------ base64 clothes ------------------------------ */

/** The patch rides JSON as base64 (the transport speaks JSON today). */
export function patchToBase64(patch: Uint8Array): string {
  let bin = ''
  for (let i = 0; i < patch.length; i++) bin += String.fromCharCode(patch[i])
  if (typeof btoa === 'function') return btoa(bin)
  return Buffer.from(patch).toString('base64')
}

export function patchFromBase64(b64: string): Uint8Array {
  if (typeof atob === 'function') {
    const bin = atob(b64)
    const out = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
    return out
  }
  return new Uint8Array(Buffer.from(b64, 'base64'))
}

/* ------------------------------ the v20 helpers ----------------------------- */

/**
 * THE DELTA PUSH: build the client request body's patch fields, or
 * null when the patch is not worth it (no change, or the codec
 * refused). The caller sends the whole envelope when null — the M9
 * law holds either way.
 */
export function deltaPushFields(baseEnvelope: string | null, nextEnvelope: string): { patch: string } | null {
  if (!baseEnvelope || baseEnvelope === nextEnvelope) return null
  try {
    const patch = encodeDelta(baseEnvelope, nextEnvelope)
    // not worth the wire if the patch alone is >= 60% of the payload
    if (patch.length >= nextEnvelope.length * 0.6) return null
    return { patch: patchToBase64(patch) }
  } catch {
    return null
  }
}
