/**
 * LOKOJA LIFE — PH2.5 CHARLIE: THE NATION WIRE — IDENTITY (the door)
 * ==================================================================
 * The handshake/auth domain of the wire, moved VERBATIM from index.ts
 * (io.use middleware at 1127–1134, bandOf 187–192, accountByToken
 * 194–211). THE IDENTITY LAW AT THE DOOR: the bearer token (Account.token
 * — the same token the register/login issue and the relay already trusts)
 * is verified against the REAL database at handshake. A guest or a bad
 * token may connect and READ (spectate per M17) but the mic stays dark.
 *
 * No socket.on handlers live here — every connection's first identity
 * truth is this middleware; the handlers live in world/social/economy/
 * transport.
 */
import { type LiveBand, type LiveIdentity } from '../../../src/game/systems/live'
import type { Server, WireCtx } from '../context'

const BANDS: readonly LiveBand[] = ['guest', 'kid', 'teen', 'adult']

/** THE DOOR'S PLAUSIBILITY law: unknown bands fail CLOSED to guest. */
function bandOf(raw: string | null | undefined): LiveBand {
  return BANDS.includes((raw ?? '') as LiveBand) ? (raw as LiveBand) : 'guest'
}

interface AccountRow {
  id: string
  handle: string
  ageBand: string
}
export type { AccountRow }

export function register(io: Server, ctx: WireCtx): void {
  const { db } = ctx

  function accountByToken(token: unknown): AccountRow | null {
    if (typeof token !== 'string' || token.length < 8) return null
    try {
      return (
        db
          .query('SELECT id, handle, ageBand FROM Account WHERE token = ? LIMIT 1')
          .get(token.trim()) as AccountRow | undefined
      ) ?? null
    } catch {
      return null
    }
  }

  io.use((socket, next) => {
    // THE IDENTITY LAW AT THE DOOR — the REAL db decides
    const account = accountByToken(socket.handshake.auth?.token)
    ;(socket.data as { identity: LiveIdentity & { accountId?: string } }).identity = account
      ? { handle: account.handle, band: bandOf(account.ageBand), accountId: account.id }
      : { handle: null, band: 'guest' }
    next()
  })
}
