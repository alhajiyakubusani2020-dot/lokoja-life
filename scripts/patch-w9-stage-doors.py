#!/usr/bin/env python3
"""W9 patch 2 — insert the seven stage doors before the disconnect handler + the stage cleanup law."""
import sys

P = '/home/z/my-project/mini-services/nation-wire/index.ts'
src = open(P, encoding='utf-8').read()

DOORS = r'''
  /* ── W9 THE STAGE — the nation's broadcast at the server door.
   * THE BROADCAST DOOR (stageVerdict verbatim): guests stay dark, minors
   * never broadcast, the title law, THE ONE-STAGE LAW. THE TOKEN LAW: the
   * wire mints the media-house token; the media NEVER rides this wire.
   * THE BOARD LAW: the StreamRow is the board record; the live registry
   * is the truth; every start/end rides BOTH lanes (the room + the
   * global board). ── */
  socket.on('stage:start', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('stage')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { title?: unknown }
    const v = stageVerdict(identity, body.title, stageIdByHost.has(identity.handle!))
    if (!v.ok) return ack?.({ ok: false, why: v.why })
    const id = mintStageId()
    const stage: StageT = { id, host: identity.handle!, title: v.title!, startedAt: Date.now(), viewers: new Set(), hostSid: socket.id }
    stages.set(id, stage)
    stageIdByHost.set(identity.handle!, id)
    socket.join(stageRoom(id))
    // THE BOARD RECORD — StreamRow is upserted live; a crash between map
    // and row leaves an honest 'live' row that the next start/end re-pins.
    try {
      db.query(
        "INSERT INTO StreamRow (id, host, kind, title, viewersJson, startedDay, status, updatedAt) VALUES (?, ?, ?, ?, '[]', ?, 'live', ?) ON CONFLICT(id) DO UPDATE SET status = 'live', title = excluded.title, kind = excluded.kind, updatedAt = excluded.updatedAt"
      ).run(id, stage.host, STAGE_KIND, stage.title, 1, new Date())
    } catch (e) {
      stages.delete(id)
      stageIdByHost.delete(stage.host)
      console.error(`[nation-wire] stage board row refused (${String(e).slice(0, 120)})`)
      return ack?.({ ok: false, why: 'wire no gree — try again' })
    }
    io.to('wire:global').emit('wire:stage', { type: 'started', stage: { id, host: stage.host, title: stage.title, kind: STAGE_KIND, viewers: 0, startedAt: stage.startedAt } })
    ack?.({ ok: true, streamId: id, title: stage.title, token: lkToken(stage.host, id, true) })
  })

  /* ── THE SPECTATE DOOR (stageWatchVerdict verbatim): ANYBODY on the wire
   * may watch a LIVE stage — claimed or guest, kid or adult. Watching is
   * not speaking: the chat door below still runs the M17 tier laws. ── */
  socket.on('stage:watch', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!allow('stage')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { streamId?: unknown }
    if (!stageIdOk(body.streamId)) return ack?.({ ok: false, why: 'bad-stage' })
    const s = stages.get(body.streamId)
    const w = stageWatchVerdict(identity, !!s)
    if (!w.ok || !s) return ack?.({ ok: false, why: w.why ?? 'stage-not-live' })
    const eye = identity.handle ?? `guest:${socket.id}`
    s.viewers.add(eye)
    socket.join(stageRoom(s.id))
    pushViewers(io, s)
    ack?.({ ok: true, streamId: s.id, title: s.title, host: s.host, viewers: s.viewers.size, token: lkToken(eye, s.id, false) })
  })

  socket.on('stage:leave', (raw: unknown, ack?: (r: unknown) => void) => {
    const body = (raw ?? {}) as { streamId?: unknown }
    if (!stageIdOk(body.streamId)) return ack?.({ ok: false, why: 'bad-stage' })
    const s = stages.get(body.streamId)
    if (!s) return ack?.({ ok: true })
    const eye = identity.handle ?? `guest:${socket.id}`
    if (s.viewers.delete(eye)) {
      socket.leave(stageRoom(s.id))
      pushViewers(io, s)
    }
    ack?.({ ok: true })
  })

  /* ── THE STAGE CHAT — the SAME words the street speaks: sanitizeChat at
   * the door (kid emote-only / teen 140 / adult 280 + the link law), the
   * SAME LiveEvent table (THE ONE-NATION LAW — the 12s lane and the cursor
   * replay carry the stage's words too), relayed to the stage room alone. ── */
  socket.on('stage:chat', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('chat')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { streamId?: unknown; text?: unknown }
    if (!stageIdOk(body.streamId)) return ack?.({ ok: false, why: 'bad-stage' })
    if (!stages.has(body.streamId)) return ack?.({ ok: false, why: 'stage-not-live' })
    const verdict = sanitizeChat(identity, typeof body.text === 'string' ? body.text : '')
    if (!verdict.ok) return ack?.({ ok: false, why: verdict.why })
    const channel = stageChannel(body.streamId)
    const seq = persistEvent('chat', channel, identity.handle!, identity.band, {
      text: verdict.text,
      stripped: verdict.stripped ?? false,
    })
    if (seq === null) return ack?.({ ok: false, why: 'wire no gree — try again' })
    const ev = { seq, kind: 'chat' as const, channel, actor: identity.handle!, band: identity.band, payload: { text: verdict.text, stripped: verdict.stripped ?? false } }
    io.to(stageRoom(body.streamId)).emit('wire:event', ev)
    ack?.({ ok: true, seq, stripped: verdict.stripped ?? false, echo: ev })
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

  /* ── THE END DOOR — the host's own hand, or the system's (the disconnect
   * law below). THE ONE-UNMOUNT SPIRIT: the stage ends ONCE, the room and
   * the global board both learn it, the row reads 'ended'. ── */
  socket.on('stage:end', (raw: unknown, ack?: (r: unknown) => void) => {
    const body = (raw ?? {}) as { streamId?: unknown }
    if (!stageIdOk(body.streamId)) return ack?.({ ok: false, why: 'bad-stage' })
    const s = stages.get(body.streamId)
    if (!s) return ack?.({ ok: true })
    const e = stageEndOk(identity, s.host)
    if (!e.ok) return ack?.({ ok: false, why: e.why })
    endStage(io, s, 'host')
    ack?.({ ok: true })
  })

  /* ── THE BOARD DOOR — the LIVE truth only (ended rows are history, the
   * honest empty state is the board's own face). ── */
  socket.on('stage:list', (_raw: unknown, ack?: (r: unknown) => void) => {
    ack?.({ ok: true, stages: stageBoard() })
  })

'''

DISC_ANCHOR = "  socket.on('disconnect', () => {"
CLEANUP = r'''    // W9 — THE STAGE DIES WITH THE HOST: my socket's goodbye ends my live
    // stage (the sweep is not needed — a stage without its host is a dead
    // air lie), and my eye leaves every stage I was watching.
    if (identity.handle) {
      const myStageId = stageIdByHost.get(identity.handle)
      if (myStageId) {
        const s = stages.get(myStageId)
        if (s && s.hostSid === socket.id) endStage(io, s, 'system')
      }
      for (const s of stages.values()) {
        if (s.viewers.has(identity.handle)) {
          s.viewers.delete(identity.handle)
          pushViewers(io, s)
        }
      }
    }
'''

if 'stage:start' in src:
    print('already patched — skip')
    sys.exit(0)
if src.count(DISC_ANCHOR) != 1:
    print(f'FATAL: disconnect anchor count = {src.count(DISC_ANCHOR)}')
    sys.exit(1)

# Insert doors before the disconnect handler
src = src.replace(DISC_ANCHOR, DOORS + DISC_ANCHOR, 1)

# Insert the cleanup at the TOP of the disconnect body (right after the opening line)
src = src.replace(DISC_ANCHOR, DISC_ANCHOR + '\n' + CLEANUP, 1)

open(P, 'w', encoding='utf-8').write(src)
print('doors patched OK')
