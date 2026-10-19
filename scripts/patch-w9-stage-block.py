#!/usr/bin/env python3
"""W9 patch 1 — insert the LiveKit mint + stage registry block before the social-graph anchor."""
import sys

P = '/home/z/my-project/mini-services/nation-wire/index.ts'
ANCHOR = open('/tmp/anchor.txt', encoding='utf-8').read().rstrip('\n')

BLOCK = '''/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 W9 THE STAGE \u2014 the media house + the registry \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

/* THE MEDIA HOUSE LAW: the stage's media flies through the self-hosted
 * LiveKit (WHIP ingest / WHEP playback) \u2014 NEVER through the wire (the wire
 * carries words, not freight; N5 stays true). The wire mints the TOKENS the
 * media house demands (its own JWT dialect, HMAC-SHA256 with the house
 * keys) and relays the stage's WORDS (chat) and MONEY (tips). The media
 * bytes are nobody's business but the two peers' \u2014 the wire never sees one.
 * THE KEY LAW: keys ride the environment (LK_API_KEY / LK_API_SECRET); the
 * defaults match the sandbox's livekit.yaml (loopback, --config), and the
 * deploy guide (W12) carries the production rotation. */
const LK_API_KEY = process.env.LK_API_KEY ?? 'devkey'
const LK_API_SECRET = process.env.LK_API_SECRET ?? 'lksecret9stage'

const b64url = (b: Buffer | string): string => Buffer.from(b).toString('base64url')

function lkToken(sub: string, room: string, canPublish: boolean): string {
  const now = Math.floor(Date.now() / 1000)
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = b64url(
    JSON.stringify({
      iss: LK_API_KEY,
      sub,
      exp: now + STAGE_TOKEN_TTL_S,
      video: { room, roomJoin: true, canPublish, canSubscribe: true, canPublishData: false, canPublishSources: [], hidden: false, recorder: false },
    })
  )
  const sig = b64url(createHmac('sha256', LK_API_SECRET).update(`${header}.${body}`).digest())
  return `${header}.${body}.${sig}`
}

interface StageT {
  id: string
  host: string
  title: string
  startedAt: number
  viewers: Set<string> // handles (guests watch with their socket id as the eye)
  hostSid: string
}

/* THE REGISTRY IS MEMORY \u2014 a stage is a LIVE thing: when the host's socket
 * dies, the stage dies with it (THE STAGE DIES WITH THE HOST law). The
 * StreamRow keeps the honest board record (status live \u2192 ended); the live
 * truth is this map, like presence, like calls. */
const stages = new Map<string, StageT>()
const stageIdByHost = new Map<string, string>()

function stageRow(id: string, status: 'live' | 'ended', viewersSnapshot: string[]): void {
  try {
    db.query('UPDATE StreamRow SET status = ?, viewersJson = ?, updatedAt = ? WHERE id = ?').run(
      status,
      JSON.stringify(viewersSnapshot),
      new Date(),
      id
    )
  } catch (e) {
    console.error(`[nation-wire] stageRow refused (${String(e).slice(0, 120)})`)
  }
}

function stageBoard() {
  return [...stages.values()]
    .sort((a, b) => a.startedAt - b.startedAt)
    .map((s) => ({ id: s.id, host: s.host, title: s.title, kind: STAGE_KIND, viewers: s.viewers.size, startedAt: s.startedAt }))
}

function endStage(io: Server, s: StageT, why: 'host' | 'system'): void {
  if (!stages.has(s.id)) return
  stages.delete(s.id)
  if (stageIdByHost.get(s.host) === s.id) stageIdByHost.delete(s.host)
  stageRow(s.id, 'ended', [...s.viewers])
  io.to(stageRoom(s.id)).emit('wire:stage', { type: 'ended', streamId: s.id, why })
  io.to('wire:global').emit('wire:stage', { type: 'ended', streamId: s.id, why })
}

function pushViewers(io: Server, s: StageT): void {
  io.to(stageRoom(s.id)).emit('wire:stage', { type: 'viewers', streamId: s.id, viewers: s.viewers.size })
}

function mintStageId(): string {
  return `stg-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`
}

'''

src = open(P, encoding='utf-8').read()
if 'W9 THE STAGE \u2014 the media house' in src:
    print('already patched \u2014 skip')
    sys.exit(0)
if src.count(ANCHOR) != 1:
    print(f'FATAL: anchor count = {src.count(ANCHOR)}')
    sys.exit(1)
src = src.replace(ANCHOR, BLOCK + ANCHOR, 1)
open(P, 'w', encoding='utf-8').write(src)
print('patched OK')
