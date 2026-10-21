/**
 * LOKOJA LIFE — PH2.5 CHARLIE: THE NATION WIRE — ECONOMY (the purse)
 * ==================================================================
 * The nation purse at the server door, moved VERBATIM from index.ts
 * (zero logic changes). Domains: the W6 wallet family (wallet/deposit/
 * withdraw/transfer), the W10-c car purse doors (vehicle:refuel/repair
 * — wallet-capped ledger moves over live car state), and the W9 tip
 * door (stage:tip). THE MINOR BLOCK, THE PIN LAW (scrypt, timing-safe),
 * THE IDEMPOTENCY LAW and THE MOVE (atomic, chained) all live here —
 * theMove and its receipt lane are economy-exclusive per the census
 * (wire-map.md §2).
 */
import { scryptSync, timingSafeEqual } from 'node:crypto'
import {
  transferVerdict,
  depositVerdict,
  chainLink,
  receiptOf,
  dayStartMs,
  LEDGER_SEED,
  type LedgerReceipt,
} from '../../../src/game/systems/ledger'
import { refuelVerdict, repairVerdict, nearServiceSpot } from '../../../src/game/systems/wheels'
import { stageTipVerdict, stageIdOk, stageRoom } from '../../../src/game/systems/stage'
import { socialNorm } from '../../../src/game/systems/socialgraph'
import type { Server, IoSocket, WireCtx, WireConn } from '../context'
import type { AccountRow } from './identity'

interface AccountFullRow extends AccountRow {
  pinHash: string
  salt: string
}

interface WalletT { handle: string; balance: number }
interface LedgerT {
  id: number
  fromHandle: string
  toHandle: string
  amount: number
  kind: string
  idemKey: string
  chainHash: string
  note: string
  createdAt: number
}

/** THE PIN LAW'S DOOR — the token this socket shook hands with. */
function handshakeTokenOf(s: IoSocket): unknown {
  return s.handshake.auth?.token
}

/** THE PIN LAW — scrypt, per-account salt, timing-safe compare. */
function pinVerifies(account: AccountFullRow, pin: unknown): boolean {
  if (typeof pin !== 'string' || !/^[0-9]{4,8}$/.test(pin)) return false
  try {
    const h = scryptSync(pin, account.salt, 32)
    const stored = Buffer.from(account.pinHash, 'hex')
    return h.length === stored.length && timingSafeEqual(h, stored)
  } catch {
    return false
  }
}

export function register(io: Server, ctx: WireCtx, conn: WireConn): void {
  const { db, presence, stages, persistEvent, accountBand, vehiclePersist } = ctx
  const { socket, identity, allow, claimed } = conn

  /** THE PIN LAW'S EYE — the full account row (hash + salt ride along). */
  function accountFullByToken(token: unknown): AccountFullRow | null {
    if (typeof token !== 'string' || token.length < 8) return null
    try {
      return (
        db
          .query('SELECT id, handle, ageBand, pinHash, salt FROM Account WHERE token = ? LIMIT 1')
          .get(token.trim()) as AccountFullRow | undefined
      ) ?? null
    } catch {
      return null
    }
  }

  function walletGet(handle: string): WalletT {
    const r = db.query('SELECT handle, balance FROM WalletRow WHERE handle = ? LIMIT 1').get(handle) as WalletT | undefined
    if (r) return r
    db.query('INSERT INTO WalletRow (handle, balance, version, updatedAt) VALUES (?, 0, 0, ?)').run(handle, Date.now())
    return { handle, balance: 0 }
  }

  function ledgerTail(): string {
    const r = db.query('SELECT chainHash FROM LedgerRow ORDER BY id DESC LIMIT 1').get() as { chainHash: string } | undefined
    return r?.chainHash ?? LEDGER_SEED
  }

  /** THE DAY CAP'S EYE — W9's letter made TRUE (the disk showed tips were
   *  NOT counted): every SPEND kind rides the cap — transfer, tip, and now
   *  (W10-c) the pump and the garage. A citizen cannot dodge the day cap
   *  by buying fuel. */
  function dayTransferred(handle: string): number {
    const r = db
      .query("SELECT COALESCE(SUM(amount), 0) AS s FROM LedgerRow WHERE fromHandle = ? AND kind IN ('transfer', 'tip', 'refuel', 'repair') AND createdAt >= ?")
      .get(handle, dayStartMs()) as { s: number | null }
    return Number(r.s ?? 0)
  }

  /** THE DEPOSIT EYE (hardening) — today's deposits for this handle, the
   * sum the deposit cap is judged against. The mint died here: the cap
   * is the SERVER's sum of the disk rows, never the client's word. */
  function dayDeposited(handle: string): number {
    const r = db
      .query("SELECT COALESCE(SUM(amount), 0) AS s FROM LedgerRow WHERE fromHandle = ? AND kind = 'deposit' AND createdAt >= ?")
      .get(handle, dayStartMs()) as { s: number | null }
    return Number(r.s ?? 0)
  }

  function recentLedger(handle: string, cap = 8): LedgerReceipt[] {
    const rows = db
      .query('SELECT * FROM LedgerRow WHERE fromHandle = ? OR toHandle = ? ORDER BY id DESC LIMIT ?')
      .all(handle, handle, cap) as unknown as LedgerT[]
    return rows.map((r) => receiptOf(r))
  }

  function ledgerByIdem(idemKey: string): LedgerT | null {
    return (db.query('SELECT * FROM LedgerRow WHERE idemKey = ? LIMIT 1').get(idemKey) as LedgerT | undefined) ?? null
  }

  /** THE MOVE — atomic, idempotent, chained. Throws the refusal why, or
   * returns the receipt. A replayed idemKey returns the SAME row untouched. */
  const theMove = db.transaction((move: {
    kind: 'deposit' | 'withdraw' | 'transfer' | 'tip' | 'refuel' | 'repair'
    from: string
    to: string
    amount: number
    idemKey: string
    note: string
  }): LedgerReceipt => {
    const existing = ledgerByIdem(move.idemKey)
    if (existing) return receiptOf(existing) // THE IDEMPOTENCY LAW — same receipt, zero movement
    const ts = Date.now()
    if (move.kind === 'deposit') {
      walletGet(move.from) // the purse exists before the credit
      db.query('UPDATE WalletRow SET balance = balance + ?, version = version + 1, updatedAt = ? WHERE handle = ?').run(move.amount, ts, move.from)
      const hash = chainLink(ledgerTail(), { idemKey: move.idemKey, from: move.from, to: move.to, amount: move.amount, kind: move.kind, ts })
      const r = db
        .query('INSERT INTO LedgerRow (fromHandle, toHandle, amount, kind, idemKey, chainHash, note, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .run(move.from, move.to, move.amount, move.kind, move.idemKey, hash, move.note, ts)
      return { idemKey: move.idemKey, ledgerId: Number(r.lastInsertRowid), kind: move.kind, from: move.from, to: move.to, amount: move.amount, hash, ts }
    }
    if (move.kind === 'withdraw') {
      const w = walletGet(move.from)
      if (w.balance < move.amount) throw 'insufficient'
      db.query('UPDATE WalletRow SET balance = balance - ?, version = version + 1, updatedAt = ? WHERE handle = ?').run(move.amount, ts, move.from)
      const hash = chainLink(ledgerTail(), { idemKey: move.idemKey, from: move.from, to: move.to, amount: move.amount, kind: move.kind, ts })
      const r = db
        .query('INSERT INTO LedgerRow (fromHandle, toHandle, amount, kind, idemKey, chainHash, note, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .run(move.from, move.to, move.amount, move.kind, move.idemKey, hash, move.note, ts)
      return { idemKey: move.idemKey, ledgerId: Number(r.lastInsertRowid), kind: move.kind, from: move.from, to: move.to, amount: move.amount, hash, ts }
    }
    // W10-c — THE SPEND LEG: the pump and the garage DEBIT one purse and
    // credit NOBODY (the sink's name rides the receipt's `to` — the city's
    // own till is not a WalletRow, nothing phantom-mints).
    // PH2.5-NOTE (pre-existing, moved verbatim): move.kind here is
    // 'refuel' | 'repair' but src/game/systems/ledger.ts's LedgerKind does
    // not list those members — tsc flags TS2322 ×2 (baseline
    // index.ts:1062/1066) while bun:sqlite accepts the string at runtime.
    // Left as-is per the verbatim-movement law; the real fix belongs to
    // ledger.ts (src/, out of this team's scope).
    if (move.kind === 'refuel' || move.kind === 'repair') {
      const w = walletGet(move.from)
      if (w.balance < move.amount) throw 'insufficient'
      db.query('UPDATE WalletRow SET balance = balance - ?, version = version + 1, updatedAt = ? WHERE handle = ?').run(move.amount, ts, move.from)
      const hash = chainLink(ledgerTail(), { idemKey: move.idemKey, from: move.from, to: move.to, amount: move.amount, kind: move.kind, ts })
      const r = db
        .query('INSERT INTO LedgerRow (fromHandle, toHandle, amount, kind, idemKey, chainHash, note, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .run(move.from, move.to, move.amount, move.kind, move.idemKey, hash, move.note, ts)
      return { idemKey: move.idemKey, ledgerId: Number(r.lastInsertRowid), kind: move.kind, from: move.from, to: move.to, amount: move.amount, hash, ts }
    }
    // transfer — the N8 law's whole point: both legs in ONE transaction
    const wFrom = walletGet(move.from)
    if (wFrom.balance < move.amount) throw 'insufficient'
    walletGet(move.to) // the receiver's purse exists before the credit
    db.query('UPDATE WalletRow SET balance = balance - ?, version = version + 1, updatedAt = ? WHERE handle = ?').run(move.amount, ts, move.from)
    db.query('UPDATE WalletRow SET balance = balance + ?, version = version + 1, updatedAt = ? WHERE handle = ?').run(move.amount, ts, move.to)
    const hash = chainLink(ledgerTail(), { idemKey: move.idemKey, from: move.from, to: move.to, amount: move.amount, kind: move.kind, ts })
    const r = db
      .query('INSERT INTO LedgerRow (fromHandle, toHandle, amount, kind, idemKey, chainHash, note, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(move.from, move.to, move.amount, move.kind, move.idemKey, hash, move.note, ts)
    return { idemKey: move.idemKey, ledgerId: Number(r.lastInsertRowid), kind: move.kind, from: move.from, to: move.to, amount: move.amount, hash, ts }
  })

  /** THE RECEIPT LAW — the receiver learns on BOTH lanes: a direct push now
   * and the LiveEvent row the 12s relay reads (channel-scoped to them). */
  function deliverTransferReceipt(io: Server, receipt: LedgerReceipt, toHandle: string): void {
    const p = presence.get(toHandle)
    if (p?.sid) io.to(p.sid).emit('wire:ledger', receipt) // the fast lane, riding the person
    persistEvent('ledger', `ledger:${toHandle}`, receipt.from, 'adult', {
      ledgerId: receipt.ledgerId,
      kind: receipt.kind,
      from: receipt.from,
      amount: receipt.amount,
      hash: receipt.hash.slice(0, 16),
      ts: receipt.ts,
    }) // the relay lane — the sync's privacy filter shows it to them alone
  }

  /* ── W6 THE LEDGER — the nation purse at the server door ──
   * THE MINOR BLOCK: kid/teen refuse every purse verb, structurally.
   * THE PIN LAW: the spend sides answer to the REAL PIN (scrypt, timing-safe).
   * THE IDEMPOTENCY LAW: a replayed idemKey returns the SAME receipt.
   * THE RECEIPT LAW: the receiver learns on BOTH lanes. ── */
  socket.on('wallet', (_raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (identity.band === 'kid' || identity.band === 'teen') return ack?.({ ok: false, why: 'minors-no-money' })
    // THE RATE LAW (hardening): the purse read was the one unthrottled
    // DB door — the account eye now watches it like every money verb
    if (!allow('wallet')) return ack?.({ ok: false, why: 'too-fast' })
    const w = walletGet(identity.handle!)
    ack?.({ ok: true, balance: w.balance, transferredToday: dayTransferred(identity.handle!), recent: recentLedger(identity.handle!) })
  })

  socket.on('wallet:deposit', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('wallet')) return ack?.({ ok: false, why: 'too-fast' })
    if (identity.band === 'kid' || identity.band === 'teen') return ack?.({ ok: false, why: 'minors-no-money' })
    const body = (raw ?? {}) as { amount?: number; idemKey?: string; note?: string }
    const amount = Math.floor(Number(body.amount))
    const idemKey = typeof body.idemKey === 'string' ? body.idemKey.slice(0, 80) : ''
    if (!idemKey) return ack?.({ ok: false, why: 'bad-idem' })
    // THE DEPOSIT CAP (hardening) — the mint died: the server sums
    // today's deposits at its own eye and refuses the move that would
    // cross DAY_DEPOSIT_CAP, whatever the client claims about its pocket
    const verdict = depositVerdict({ band: identity.band, amount, depositedToday: dayDeposited(identity.handle!) })
    if (!verdict.ok) return ack?.({ ok: false, why: verdict.why })
    try {
      const receipt = theMove({ kind: 'deposit', from: identity.handle!, to: identity.handle!, amount, idemKey, note: typeof body.note === 'string' ? body.note.slice(0, 80) : 'pocket → purse' })
      ack?.({ ok: true, receipt, balance: walletGet(identity.handle!).balance })
    } catch (why) {
      ack?.({ ok: false, why: String(why) })
    }
  })

  socket.on('wallet:withdraw', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('wallet')) return ack?.({ ok: false, why: 'too-fast' })
    const account = accountFullByToken(handshakeTokenOf(socket))
    if (!account || account.handle !== identity.handle) return ack?.({ ok: false, why: 'unclaimed' })
    if (identity.band === 'kid' || identity.band === 'teen') return ack?.({ ok: false, why: 'minors-no-money' })
    const body = (raw ?? {}) as { amount?: number; pin?: string; idemKey?: string }
    const amount = Math.floor(Number(body.amount))
    const idemKey = typeof body.idemKey === 'string' ? body.idemKey.slice(0, 80) : ''
    if (!idemKey) return ack?.({ ok: false, why: 'bad-idem' })
    if (!pinVerifies(account, body.pin)) return ack?.({ ok: false, why: 'bad-pin' })
    // PH2.5-NOTE (pre-existing, moved verbatim): transferredToday is
    // hard-coded 0 on the withdraw leg while wallet:transfer passes
    // dayTransferred() — the documented day-cap asymmetry debt (worklog
    // Task 3+4+5+6, "withdraw day-cap asymmetry"). Left as-is.
    const verdict = transferVerdict({ band: identity.band, amount, purse: walletGet(identity.handle!).balance, transferredToday: 0 })
    if (!verdict.ok) return ack?.({ ok: false, why: verdict.why })
    try {
      const receipt = theMove({ kind: 'withdraw', from: identity.handle!, to: identity.handle!, amount, idemKey, note: 'purse → pocket' })
      ack?.({ ok: true, receipt, balance: walletGet(identity.handle!).balance })
    } catch (why) {
      ack?.({ ok: false, why: String(why) })
    }
  })

  socket.on('wallet:transfer', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('wallet')) return ack?.({ ok: false, why: 'too-fast' })
    const account = accountFullByToken(handshakeTokenOf(socket))
    if (!account || account.handle !== identity.handle) return ack?.({ ok: false, why: 'unclaimed' })
    if (identity.band === 'kid' || identity.band === 'teen') return ack?.({ ok: false, why: 'minors-no-money' })
    const body = (raw ?? {}) as { to?: string; amount?: number; pin?: string; idemKey?: string; note?: string }
    const to = socialNorm(body.to)
    const amount = Math.floor(Number(body.amount))
    const idemKey = typeof body.idemKey === 'string' ? body.idemKey.slice(0, 80) : ''
    if (!idemKey) return ack?.({ ok: false, why: 'bad-idem' })
    if (!pinVerifies(account, body.pin)) return ack?.({ ok: false, why: 'bad-pin' })
    // THE REPLAY FIRST: a retry with the SAME key returns the SAME receipt
    // with no laws re-judged — the receiver's credit never doubles.
    const replay = ledgerByIdem(idemKey)
    if (replay) return ack?.({ ok: true, receipt: receiptOf(replay), balance: walletGet(identity.handle!).balance, replayed: true })
    const toBand = accountBand(to)
    if (!toBand) return ack?.({ ok: false, why: 'no-such-paddy' })
    if (toBand !== 'adult') return ack?.({ ok: false, why: 'minors-collect-nothing' })
    if (to === identity.handle) return ack?.({ ok: false, why: 'self' })
    const verdict = transferVerdict({ band: identity.band, to, from: identity.handle, amount, purse: walletGet(identity.handle!).balance, transferredToday: dayTransferred(identity.handle!) })
    if (!verdict.ok) return ack?.({ ok: false, why: verdict.why })
    try {
      const receipt = theMove({ kind: 'transfer', from: identity.handle!, to, amount, idemKey, note: typeof body.note === 'string' ? body.note.slice(0, 80) : '' })
      deliverTransferReceipt(io, receipt, to)
      ack?.({ ok: true, receipt, balance: walletGet(identity.handle!).balance })
    } catch (why) {
      ack?.({ ok: false, why: String(why) })
    }
  })

  /* ── W10-c THE PUMP DOOR — fuel is bought through the REAL ledger. THE
   *   REFUEL VERDICT verbatim (adults only — minors' money walls hold,
   *   the pump proximity is the WIRE's own eye on the claimed pos, the
   *   tank-full and the amount laws), THE REPLAY LAW first (a lost ack
   *   never pours twice), THE MOVE through the fortress chain (debit,
   *   credit nobody), and the tank lands on the disk at once. ── */
  socket.on('vehicle:refuel', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-dark' })
    if (!allow('wallet')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { model?: unknown; amount?: unknown; x?: unknown; z?: unknown; idemKey?: unknown }
    const p = presence.get(identity.handle!)
    if (!p?.car || p.car.model !== body.model) return ack?.({ ok: false, why: 'no-car' })
    const idemKey = typeof body.idemKey === 'string' ? body.idemKey.slice(0, 80) : ''
    if (!idemKey) return ack?.({ ok: false, why: 'bad-idem' })
    // THE REPLAY LAW FIRST — the same idemKey returns the SAME receipt,
    // the tank never double-pours
    const replayed = ledgerByIdem(idemKey)
    if (replayed) {
      return ack?.({ ok: true, replayed: true, fuel: p.car.fuel, receipt: receiptOf(replayed), balance: walletGet(identity.handle!).balance })
    }
    // THE WIRE'S OWN EYES (hardening): the pump is judged on the SERVER's
    // clamped car pos — the client's paper coords are no longer read, so
    // a refuel from across the map is simply not at the pump
    const atPump = nearServiceSpot('pump', p.car.x, p.car.z)
    const v = refuelVerdict({ band: identity.band, model: p.car.model, fuel: p.car.fuel, amount: body.amount, atPump })
    if (!v.ok) return ack?.(v)
    try {
      const receipt = theMove({ kind: 'refuel', from: identity.handle!, to: 'pump', amount: v.amount, idemKey, note: `${p.car.model} @ the pump` })
      p.car.fuel = v.fuel
      vehiclePersist(p.car, identity.handle!)
      deliverTransferReceipt(io, receipt, identity.handle!)
      ack?.({ ok: true, fuel: p.car.fuel, receipt, balance: walletGet(identity.handle!).balance })
    } catch (why) {
      ack?.({ ok: false, why: String(why) })
    }
  })

  /* ── W10-c THE SERVICE DOOR — the garage repairs through the REAL
   *   ledger. THE REPAIR VERDICT verbatim (the garage proximity is the
   *   WIRE's own eye, the quote is the wear's own math), THE REPLAY LAW
   *   first, THE MOVE (debit, credit nobody), and the condition lands
   *   on the disk at once — the mechanic's books are the city's books. ── */
  socket.on('vehicle:repair', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-dark' })
    if (!allow('wallet')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { model?: unknown; x?: unknown; z?: unknown; idemKey?: unknown }
    const p = presence.get(identity.handle!)
    if (!p?.car || p.car.model !== body.model) return ack?.({ ok: false, why: 'no-car' })
    const idemKey = typeof body.idemKey === 'string' ? body.idemKey.slice(0, 80) : ''
    if (!idemKey) return ack?.({ ok: false, why: 'bad-idem' })
    const replayed = ledgerByIdem(idemKey)
    if (replayed) {
      return ack?.({ ok: true, replayed: true, condition: p.car.condition, receipt: receiptOf(replayed), balance: walletGet(identity.handle!).balance })
    }
    // THE WIRE'S OWN EYES (hardening): the garage is judged on the
    // SERVER's clamped car pos, same law as the pump
    const atGarage = nearServiceSpot('garage', p.car.x, p.car.z)
    const v = repairVerdict({ band: identity.band, model: p.car.model, condition: p.car.condition, atGarage })
    if (!v.ok) return ack?.(v)
    try {
      const receipt = theMove({ kind: 'repair', from: identity.handle!, to: 'garage', amount: v.amount, idemKey, note: `${p.car.model} full service` })
      p.car.condition = v.condition
      vehiclePersist(p.car, identity.handle!)
      deliverTransferReceipt(io, receipt, identity.handle!)
      ack?.({ ok: true, condition: p.car.condition, receipt, balance: walletGet(identity.handle!).balance })
    } catch (why) {
      ack?.({ ok: false, why: String(why) })
    }
  })

  /* ── THE TIP DOOR — a spray of REAL naira at the stage. The stage walls
   * (stageTipVerdict verbatim: live stage, no self-tip, adults) + the W6
   * money laws VERBATIM (the PIN law, the replay law, transferVerdict's
   * cap and minor walls, THE MOVE's idempotency + fortress chain). The
   * room hears the spray (the M17 SPRAY spirit); the receipts ride the
   * SAME deliverTransferReceipt both-lane law. ── */
  socket.on('stage:tip', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('wallet')) return ack?.({ ok: false, why: 'too-fast' })
    const account = accountFullByToken(handshakeTokenOf(socket))
    if (!account || account.handle !== identity.handle) return ack?.({ ok: false, why: 'unclaimed' })
    if (identity.band === 'kid' || identity.band === 'teen') return ack?.({ ok: false, why: 'minors-no-money' })
    const body = (raw ?? {}) as { streamId?: unknown; amount?: unknown; pin?: unknown; idemKey?: unknown }
    if (!stageIdOk(body.streamId)) return ack?.({ ok: false, why: 'bad-stage' })
    const s = stages.get(body.streamId)
    const tv = stageTipVerdict(identity, !!s, s?.host ?? '')
    if (!tv.ok || !s) return ack?.({ ok: false, why: tv.why ?? 'stage-not-live' })
    const amount = Math.floor(Number(body.amount))
    const idemKey = typeof body.idemKey === 'string' ? body.idemKey.slice(0, 80) : ''
    if (!idemKey) return ack?.({ ok: false, why: 'bad-idem' })
    if (!pinVerifies(account, body.pin)) return ack?.({ ok: false, why: 'bad-pin' })
    // THE REPLAY FIRST (the W6 law): a retry with the SAME key returns the
    // SAME receipt and sprays NOTHING twice.
    const replay = ledgerByIdem(idemKey)
    if (replay) return ack?.({ ok: true, receipt: receiptOf(replay), balance: walletGet(identity.handle!).balance, replayed: true })
    if (accountBand(s.host) !== 'adult') return ack?.({ ok: false, why: 'minors-collect-nothing' })
    const verdict = transferVerdict({ band: identity.band, to: s.host, from: identity.handle, amount, purse: walletGet(identity.handle!).balance, transferredToday: dayTransferred(identity.handle!) })
    if (!verdict.ok) return ack?.({ ok: false, why: verdict.why })
    try {
      const receipt = theMove({ kind: 'tip', from: identity.handle!, to: s.host, amount, idemKey, note: `tip@${s.id}` })
      deliverTransferReceipt(io, receipt, s.host)
      io.to(stageRoom(s.id)).emit('wire:stage', { type: 'tip', streamId: s.id, from: identity.handle, amount, host: s.host })
      ack?.({ ok: true, receipt, balance: walletGet(identity.handle!).balance })
    } catch (why) {
      ack?.({ ok: false, why: String(why) })
    }
  })
}
