import { NextResponse } from 'next/server'

/**
 * M24-UI wave 2 — THE LANDING'S LIVE TRUTH DOOR
 * ----------------------------------------------
 * The menu's ribbon no longer CLAIMS the wire — it ASKS. This door
 * passes through the nation-wire's own /health verdict (127.0.0.1 on
 * the wire's port, 1.5s budget, no store, no invention):
 *
 *   { live: true,  online: <present souls> }   — the wire answered ok
 *   { live: false, online: 0 }                 — the wire is quiet/unreachable
 *
 * The menu renders exactly what this returns — a quiet wire renders as
 * a quiet wire, never as a promise.
 */

export const dynamic = 'force-dynamic'

export async function GET() {
  const port = process.env.WIRE_PORT ?? '3003'
  try {
    const r = await fetch(`http://127.0.0.1:${port}/health`, {
      signal: AbortSignal.timeout(1500),
      cache: 'no-store',
    })
    if (!r.ok) return NextResponse.json({ live: false, online: 0 })
    const j = (await r.json()) as { ok?: boolean; online?: number }
    return NextResponse.json({
      live: j.ok === true,
      online: typeof j.online === 'number' ? j.online : 0,
    })
  } catch {
    return NextResponse.json({ live: false, online: 0 })
  }
}
