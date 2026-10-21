/**
 * LOKOJA LIFE — M9 Guest Loop: /api/cloud/push
 * The cloud vault's write door. Bearer-token gated; the whole GameSave
 * JSON rides in the body exactly as the localStorage transport carries it.
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { applyDelta, patchFromBase64 } from '@/game/systems/binarydelta'
// F1 HARDENING — the version ceiling is single-sourced with the save system:
// a future SAVE_VERSION bump lifts the vault's ceiling automatically. save.ts
// imports cleanly server-side (pure constants/factories, no DOM at module
// scope — verified by import probe).
import { SAVE_VERSION } from '@/game/systems/save'
import { takeToken, rlKey, RL_LIMITS } from '@/lib/rate-limit'

/**
 * F1 HARDENING — the whole-envelope ceiling. The vault row is an unbounded
 * String column; a hostile client must not park megabytes in it. Honest
 * saves ride far under this (the M20 delta door exists because whole
 * envelopes are big). Rejections use the route's existing error shape
 * `{ ok: false, why }` with a 400, before any DB write.
 */
const MAX_SAVE_BYTES = 512_000

/** PH2.5 COMPLETION (Task 5-b) — THE SANITY CEILING: finite-and-nonnegative
 *  is not enough — the mandate probe proved {player:{cash:1e308}} pushes ok
 *  (a quadrillion-naira vault row, minted onto any device that pulls it).
 *  Honest play sits orders of magnitude below these ceilings: the ledger's
 *  own laws cap a single move at ₦50k and a day at ₦200k, so ₦1bn of cash
 *  and a 100-year-old day counter cannot be an honest save. Both write
 *  paths (whole envelope AND delta rebuild) run the same law. */
const MAX_SAVE_CASH = 1_000_000_000
const MAX_SAVE_DAY = 36_500

/** the minimal scalar law, shared by the whole-envelope and delta paths */
function saveScalarsOk(s: { player?: { cash?: unknown }; world?: { day?: unknown }; version?: unknown }): boolean {
  return (
    !!s.player && typeof s.player === 'object' &&
    typeof s.player.cash === 'number' && Number.isFinite(s.player.cash) && s.player.cash >= 0 && s.player.cash <= MAX_SAVE_CASH &&
    !!s.world && typeof s.world === 'object' &&
    typeof s.world.day === 'number' && Number.isFinite(s.world.day) && s.world.day >= 1 && s.world.day <= MAX_SAVE_DAY &&
    typeof s.version === 'number' && s.version <= SAVE_VERSION
  )
}

export async function POST(req: Request) {
  try {
    const auth = req.headers.get('authorization') ?? ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
    if (!token) return NextResponse.json({ ok: false, why: 'no token' }, { status: 401 })

    const account = await db.account.findFirst({ where: { token } })
    if (!account) return NextResponse.json({ ok: false, why: 'bad token' }, { status: 401 })

    // PH2.5 THE THROTTLE LAW — ≤30 vault writes/hour/account (fixed
    // window). The client's honest autosave is minutes-apart deltas; a
    // flood is abuse no matter how small each payload is. Volume counts
    // whether the write lands or not — the bucket fills on every
    // authenticated attempt.
    const gate = takeToken(rlKey('push', [account.id]), RL_LIMITS.PUSH_MAX_PER_WINDOW, RL_LIMITS.PUSH_WINDOW_MS)
    if (!gate.ok) {
      return NextResponse.json({ ok: false, why: 'too-many-pushes' }, {
        status: 429,
        headers: { 'Retry-After': String(gate.retryAfterSec) },
      })
    }

    const body = (await req.json()) as { schema_version?: number; data?: unknown; sig?: string; patch?: unknown }

    // M20 — THE DELTA DOOR: a patch carries the CHANGE against the exact
    // string this vault already stores. The base mismatch (another device
    // wrote since), a torn codec, or a wrong shape is refused honestly —
    // the client falls back to the whole envelope. The stored row stays a
    // WHOLE envelope either way: the vault never learns a new format.
    if (typeof body?.patch === 'string' && body.patch.length > 0 && (!body?.data || typeof body.data !== 'object')) {
      // PH2.5 — the patch itself is bounded too: a delta bigger than a
      // whole envelope is nonsense and a CPU/parse hazard before anything
      // is applied.
      if (body.patch.length > MAX_SAVE_BYTES) {
        return NextResponse.json({ ok: false, why: 'patch too large' }, { status: 400 })
      }
      const row = await db.cloudSave.findUnique({ where: { accountId: account.id } })
      if (!row) return NextResponse.json({ ok: false, why: 'no base — send whole' }, { status: 400 })
      let next: string
      try {
        next = applyDelta(row.data, patchFromBase64(body.patch))
        const parsed = JSON.parse(next) as { player?: unknown; version?: unknown; sig?: unknown }
        if (!parsed || typeof parsed !== 'object' || !('player' in parsed) || !('version' in parsed)) {
          return NextResponse.json({ ok: false, why: 'patch refused — wrong shape' }, { status: 400 })
        }
        // PH2.5 COMPLETION (Task 5-b) — the REBUILT envelope obeys the same
        // scalar law as the whole-envelope door (the delta path was the
        // second way to park a hostile cash:1e308 row in the vault).
        if (!saveScalarsOk(JSON.parse(next) as { player?: { cash?: unknown }; world?: { day?: unknown }; version?: unknown })) {
          return NextResponse.json({ ok: false, why: 'patch refused — bad payload' }, { status: 400 })
        }
      } catch {
        return NextResponse.json({ ok: false, why: 'patch refused — send whole' }, { status: 400 })
      }
      // PH2.5 — THE DELTA CEILING: the rebuilt WHOLE envelope obeys the
      // same MAX_SAVE_BYTES the whole-envelope path enforces (the old
      // delta door was the one write that could park an oversized row).
      if (next.length > MAX_SAVE_BYTES) {
        return NextResponse.json({ ok: false, why: 'payload too large' }, { status: 400 })
      }
      const version = typeof (JSON.parse(next) as { version?: unknown }).version === 'number' ? (JSON.parse(next) as { version: number }).version : (typeof body.schema_version === 'number' ? body.schema_version : 10)
      // the delta path's sig is computed by the client over the EXACT rebuilt string
      const deltaSig = typeof body.sig === 'string' && body.sig.length > 0 ? body.sig : null
      await db.cloudSave.upsert({
        where: { accountId: account.id },
        create: { accountId: account.id, data: next, version, sig: deltaSig },
        update: { data: next, version, sig: deltaSig },
      })
      return NextResponse.json({ ok: true, delta: true })
    }

    if (!body?.data || typeof body.data !== 'object') {
      return NextResponse.json({ ok: false, why: 'bad payload' }, { status: 400 })
    }

    const data = JSON.stringify(body.data)

    // F1 HARDENING — size cap before any DB write (see MAX_SAVE_BYTES).
    if (data.length > MAX_SAVE_BYTES) {
      return NextResponse.json({ ok: false, why: 'payload too large' }, { status: 400 })
    }

    // F1 HARDENING — the minimal save law: deserialize heals what it LOADS,
    // but the vault must not STORE what no honest client could write
    // (missing player/world, cash:-999999 or "5000", day:"5", a version
    // ahead of every migration this server knows — and PH2.5's ceiling: a
    // finite cash:1e308 / day:1e308 is refused too). Rejected before the
    // upsert, in this route's existing error shape.
    const save = body.data as { player?: { cash?: unknown }; world?: { day?: unknown }; version?: unknown }
    if (!saveScalarsOk(save)) {
      return NextResponse.json({ ok: false, why: 'bad payload' }, { status: 400 })
    }

    const version = typeof body.schema_version === 'number' ? body.schema_version : 10
    // M14 — the client's HMAC rides beside the save (tamper-evidence for the pull)
    const sig = typeof body.sig === 'string' && body.sig.length > 0 ? body.sig : null
    await db.cloudSave.upsert({
      where: { accountId: account.id },
      create: { accountId: account.id, data, version, sig },
      update: { data, version, sig },
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, why: 'vault no gree' }, { status: 500 })
  }
}
