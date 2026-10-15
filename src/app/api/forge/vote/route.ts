/**
 * LOKOJA LIFE — M18 CITY FORGE: /api/forge/vote
 * The "YOUR CITY NEXT?" door. GET returns the world's honest vote
 * counts; POST casts one vote per city per account (capped at 3 —
 * the client mirrors the same law). Thin bookkeeping, no simulation.
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { MY_VOTE_CAP } from '@/game/systems/citypack'

export async function GET() {
  try {
    const rows = await db.forgeVote.findMany()
    const counts: Record<string, number> = {}
    for (const r of rows) counts[r.city] = (counts[r.city] ?? 0) + 1
    return NextResponse.json({ ok: true, counts })
  } catch {
    return NextResponse.json({ ok: false, why: 'the ballot box no gree' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const auth = req.headers.get('authorization') ?? ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
    if (!token) return NextResponse.json({ ok: false, why: 'no token' }, { status: 401 })
    const account = await db.account.findFirst({ where: { token } })
    if (!account) return NextResponse.json({ ok: false, why: 'bad token' }, { status: 401 })

    const body = (await req.json().catch(() => ({}))) as { city?: string }
    const city = typeof body.city === 'string' ? body.city.slice(0, 32) : ''
    if (!/^[a-z-]{3,32}$/.test(city)) return NextResponse.json({ ok: false, why: 'bad-city' }, { status: 400 })

    const mine = await db.forgeVote.findMany({ where: { accountId: account.id } })
    if (mine.some((v) => v.city === city)) return NextResponse.json({ ok: false, why: 'duplicate' }, { status: 400 })
    if (mine.length >= MY_VOTE_CAP) return NextResponse.json({ ok: false, why: 'capped' }, { status: 400 })

    await db.forgeVote.create({ data: { accountId: account.id, city } })
    const rows = await db.forgeVote.findMany()
    const counts: Record<string, number> = {}
    for (const r of rows) counts[r.city] = (counts[r.city] ?? 0) + 1
    return NextResponse.json({ ok: true, counts, mine: mine.length + 1 })
  } catch {
    return NextResponse.json({ ok: false, why: 'the ballot box no gree' }, { status: 500 })
  }
}
