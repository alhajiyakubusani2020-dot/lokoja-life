import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * M20 — THE TELEMETRY DOOR
 * -------------------------
 * Opt-in counters ONLY, keyed by the bearer token's account. The door
 * re-judges every law server-side (the client is never trusted):
 *  - no token → 401 (the relay doctrine)
 *  - band 'kid' → 403 no-minor-data — THE KID WALL IS STRUCTURAL: the
 *    account row's canonical band decides, a child's counter NEVER lands
 *  - counters clamped to the closed enum the client's telemetry.ts
 *    speaks, values clamped 0..9999, payload ≤ 2KB
 * One row per account per day (upsert) — 10M players cost the same
 * ops as 10k: a keyed row, nothing else.
 */

const CLOSED_KEYS = ['day-rolled', 'travel-made', 'gig-run', 'meal-bought', 'biz-earned', 'festival-attended', 'flood-cut', 'share-sent'] as const

export async function POST(req: Request) {
  try {
    const auth = req.headers.get('authorization') ?? ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
    if (!token) return NextResponse.json({ ok: false, why: 'no token' }, { status: 401 })
    const account = await db.account.findFirst({ where: { token } })
    if (!account) return NextResponse.json({ ok: false, why: 'bad token' }, { status: 401 })

    // THE KID WALL — the account row's band is the canonical truth (M17's law)
    if (account.ageBand === 'kid') {
      return NextResponse.json({ ok: false, why: 'no-minor-data' }, { status: 403 })
    }

    const body = (await req.json().catch(() => ({}))) as { day?: unknown; counters?: unknown }
    const day = Math.max(1, Math.min(100_000, Math.floor(Number(body.day) || 0)))
    if (!day) return NextResponse.json({ ok: false, why: 'bad-day' }, { status: 400 })
    if (typeof body.counters !== 'object' || body.counters === null) {
      return NextResponse.json({ ok: false, why: 'bad-counters' }, { status: 400 })
    }
    // clamp to the closed enum + the value cap — an invented metric is refused, not stored
    const counters: Record<string, number> = {}
    let bytes = 2
    for (const [k, v] of Object.entries(body.counters as Record<string, unknown>)) {
      if (!(CLOSED_KEYS as readonly string[]).includes(k)) continue
      const n = Math.max(0, Math.min(9999, Math.floor(Number(v) || 0)))
      if (n <= 0) continue
      counters[k] = n
      bytes += k.length + 6
      if (bytes > 2048) break
    }
    const countersJson = JSON.stringify(counters)

    await db.telemetryRow.upsert({
      where: { accountId_day: { accountId: account.id, day } },
      create: { accountId: account.id, day, counters: countersJson },
      update: { counters: countersJson },
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, why: 'the counter box no gree' }, { status: 500 })
  }
}
