/**
 * LOKOJA LIFE — M17 LIVE NATION: /api/live/action
 * The nation's action door. Bearer-token gated — THE IDENTITY LAW is
 * enforced by the door itself: no claim, no action (guests spectate).
 * Every action applies the PURE laws of systems/live server-side
 * (defense in depth — the client applies the same laws first), keeps
 * the relay's thin books, and broadcasts the event. The relay never
 * simulates: it holds treasuries/trades/pots because money cannot be
 * trusted to any single client, but it rolls no dice and keeps no clock.
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import {
  canLive, sanitizeChat, emoteById, validateEvent,
  joinTeleportEvent, type LiveIdentity, type LiveBand,
  type Association, type AssocMemberRow, type LiveContract,
  assocIdFor, assocChainLink, withdrawVerdict, courtVerdict, courtPenalty, COURT_FEE, contractIdFor,
  tradeIdFor, tradeVerdict, type TradeOffer,
  ajoIdFor, ajoRoundReady, ajoNextBeneficiary, ajoPanicCheck, ajoCourtFine, AJO_MAX_MEMBERS,
  type AjoCircle,
} from '@/game/systems/live'

const CHAIN_SEED = 'lko-assoc-chain-seed'

type Json = Record<string, unknown>

const str = (v: unknown, cap: number): string => (typeof v === 'string' ? v.slice(0, cap) : '')
const int = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) ? Math.floor(v) : NaN)

function broadcast(kind: string, channel: string, actor: string, band: string, payload: Json) {
  return db.liveEvent.create({ data: { kind, channel, actor, band, payload: JSON.stringify(payload) } })
}

function rowToAssociation(r: {
  id: string; name: string; motto: string; founder: string; treasury: number
  chainTail: string; ledgerJson: string; membersJson: string; contractsJson: string; createdDay: number
}): Association {
  return {
    id: r.id, name: r.name, motto: r.motto, founder: r.founder,
    treasury: r.treasury, chainTail: r.chainTail, createdDay: r.createdDay,
    ledger: JSON.parse(r.ledgerJson || '[]'),
    members: JSON.parse(r.membersJson || '[]'),
    contracts: JSON.parse(r.contractsJson || '[]'),
  }
}

function rowToCircle(r: {
  id: string; name: string; contribution: number; orderJson: string; round: number
  roundStartDay: number; pot: number; paidJson: string; paidThisRoundJson: string
  defaultersJson: string; status: string; createdDay: number
}): AjoCircle {
  return {
    id: r.id, name: r.name, contribution: r.contribution,
    order: JSON.parse(r.orderJson || '[]'), round: r.round, roundStartDay: r.roundStartDay,
    pot: r.pot, paid: JSON.parse(r.paidJson || '{}'),
    paidThisRound: JSON.parse(r.paidThisRoundJson || '[]'),
    defaulters: JSON.parse(r.defaultersJson || '[]'),
    status: r.status as AjoCircle['status'], createdDay: r.createdDay,
  }
}

const pruneLedger = (ledger: Association['ledger']) => ledger.slice(-32)

export async function POST(req: Request) {
  try {
    const auth = req.headers.get('authorization') ?? ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
    if (!token) return NextResponse.json({ ok: false, why: 'no token' }, { status: 401 })
    const account = await db.account.findFirst({ where: { token } })
    if (!account) return NextResponse.json({ ok: false, why: 'bad token' }, { status: 401 })

    const identity: LiveIdentity = {
      handle: account.handle,
      band: (['kid', 'teen', 'adult'].includes(account.ageBand) ? account.ageBand : 'adult') as LiveBand,
    }
    const body = (await req.json().catch(() => ({}))) as { action?: string; payload?: Json }
    const action = str(body.action, 32)
    const p = body.payload ?? {}

    /* ----------------------------- the social wire ----------------------------- */
    if (action === 'chat') {
      if (!canLive(identity, 'text')) {
        return NextResponse.json({ ok: false, why: identity.band === 'guest' ? 'guest-mic-dark' : 'kid-text-refused' }, { status: 403 })
      }
      const verdict = sanitizeChat(identity, str(p.text, 400))
      if (!verdict.ok) return NextResponse.json({ ok: false, why: verdict.why }, { status: 400 })
      const channel = str(p.channel, 64) || 'global'
      const ev = { id: '', kind: 'chat' as const, channel, actor: account.handle, payload: { text: verdict.text, stripped: verdict.stripped ?? false } }
      const law = validateEvent({ ...ev, id: 'x' })
      if (!law.ok) return NextResponse.json({ ok: false, why: law.why }, { status: 400 })
      await broadcast('chat', channel, account.handle, identity.band, ev.payload)
      return NextResponse.json({ ok: true, text: verdict.text, stripped: verdict.stripped ?? false })
    }

    if (action === 'emote') {
      if (!canLive(identity, 'emote')) return NextResponse.json({ ok: false, why: 'mic-dark' }, { status: 403 })
      const emote = emoteById(str(p.emoteId, 32))
      if (!emote) return NextResponse.json({ ok: false, why: 'no-such-emote' }, { status: 400 })
      const channel = str(p.channel, 64) || 'global'
      await broadcast('emote', channel, account.handle, identity.band, emote)
      return NextResponse.json({ ok: true, emote })
    }

    if (action === 'join') {
      // THE JOIN-TELEPORT LAW: the code is an M15 postcard minted client-side
      const code = str(p.code, 112)
      const street = str(p.street, 48)
      if (!code || !street) return NextResponse.json({ ok: false, why: 'bad-invite' }, { status: 400 })
      const ev = joinTeleportEvent(account.handle, street, code)
      await broadcast(ev.kind, ev.channel, ev.actor, identity.band, ev.payload)
      return NextResponse.json({ ok: true })
    }

    /* -------------------------------- streams ---------------------------------- */
    if (action === 'stream-open') {
      if (!canLive(identity, 'host')) return NextResponse.json({ ok: false, why: 'adults-only' }, { status: 403 })
      const kind = str(p.kind, 12)
      if (!['stall', 'regatta', 'wedding'].includes(kind)) return NextResponse.json({ ok: false, why: 'bad-kind' }, { status: 400 })
      const title = str(p.title, 80) || `${account.handle}'s ${kind}`
      const id = `stm:${account.handle}:${Date.now() % 100_000}`
      await db.streamRow.create({ data: { id, host: account.handle, kind, title, startedDay: int(p.day) || 1 } })
      await broadcast('stream', 'global', account.handle, identity.band, { streamId: id, kind, title, live: true })
      return NextResponse.json({ ok: true, streamId: id, title })
    }

    if (action === 'stream-view') {
      const id = str(p.streamId, 64)
      const row = await db.streamRow.findUnique({ where: { id } })
      if (!row || row.status !== 'live') return NextResponse.json({ ok: false, why: 'not-live' }, { status: 400 })
      const viewers = JSON.parse(row.viewersJson || '[]') as string[]
      if (!viewers.includes(account.handle)) viewers.push(account.handle)
      await db.streamRow.update({ where: { id }, data: { viewersJson: JSON.stringify(viewers) } })
      return NextResponse.json({ ok: true, viewers: viewers.length })
    }

    if (action === 'stream-close') {
      const id = str(p.streamId, 64)
      const row = await db.streamRow.findUnique({ where: { id } })
      if (!row || row.host !== account.handle) return NextResponse.json({ ok: false, why: 'not-your-stream' }, { status: 403 })
      const viewers = JSON.parse(row.viewersJson || '[]') as string[]
      await db.streamRow.update({ where: { id }, data: { status: 'ended' } })
      await broadcast('stream', 'global', account.handle, identity.band, { streamId: id, live: false, viewers: viewers.length })
      return NextResponse.json({ ok: true, peakViewers: viewers.length })
    }

    if (action === 'streams') {
      const rows = await db.streamRow.findMany({ where: { status: 'live' }, take: 24 })
      return NextResponse.json({
        ok: true,
        streams: rows.map((r) => ({ id: r.id, host: r.host, kind: r.kind, title: r.title, viewers: (JSON.parse(r.viewersJson || '[]') as string[]).length })),
      })
    }

    /* ----------------------------- associations ------------------------------- */
    if (action === 'assocs') {
      const rows = await db.associationRow.findMany({ take: 24 })
      return NextResponse.json({ ok: true, assocs: rows.map((r) => ({ id: r.id, name: r.name, motto: r.motto, founder: r.founder, members: (JSON.parse(r.membersJson || '[]') as AssocMemberRow[]).length, treasury: r.treasury })) })
    }

    if (action === 'assoc-found') {
      if (!canLive(identity, 'assoc')) return NextResponse.json({ ok: false, why: 'adults-only' }, { status: 403 })
      const name = str(p.name, 48).trim()
      const motto = str(p.motto, 80).trim()
      const day = int(p.day) || 1
      if (name.length < 3) return NextResponse.json({ ok: false, why: 'name-too-short' }, { status: 400 })
      const dupe = await db.associationRow.findFirst({ where: { name } })
      if (dupe) return NextResponse.json({ ok: false, why: 'name-taken' }, { status: 400 })
      const id = assocIdFor(name, account.handle, day)
      await db.associationRow.create({
        data: {
          id, name, motto, founder: account.handle, treasury: 0, chainTail: CHAIN_SEED,
          membersJson: JSON.stringify([{ handle: account.handle, role: 'president', joinedDay: day }]),
        },
      })
      await broadcast('assoc', 'global', account.handle, identity.band, { assocId: id, name, founded: true })
      return NextResponse.json({ ok: true, assocId: id })
    }

    if (action === 'assoc-join') {
      if (!canLive(identity, 'assoc')) return NextResponse.json({ ok: false, why: 'adults-only' }, { status: 403 })
      const row = await db.associationRow.findUnique({ where: { id: str(p.assocId, 64) } })
      if (!row) return NextResponse.json({ ok: false, why: 'no-assoc' }, { status: 404 })
      const assoc = rowToAssociation(row)
      if (assoc.members.some((m) => m.handle === account.handle)) return NextResponse.json({ ok: false, why: 'already-member' }, { status: 400 })
      assoc.members.push({ handle: account.handle, role: 'member', joinedDay: int(p.day) || 1 })
      await db.associationRow.update({ where: { id: row.id }, data: { membersJson: JSON.stringify(assoc.members) } })
      await broadcast('assoc', `assoc:${row.id}`, account.handle, identity.band, { joined: account.handle })
      return NextResponse.json({ ok: true, members: assoc.members.length })
    }

    if (action === 'assoc-dues' || action === 'assoc-withdraw') {
      if (!canLive(identity, 'assoc')) return NextResponse.json({ ok: false, why: 'adults-only' }, { status: 403 })
      const row = await db.associationRow.findUnique({ where: { id: str(p.assocId, 64) } })
      if (!row) return NextResponse.json({ ok: false, why: 'no-assoc' }, { status: 404 })
      const assoc = rowToAssociation(row)
      const amount = int(p.amount)
      if (!Number.isFinite(amount) || amount <= 0) return NextResponse.json({ ok: false, why: 'bad-amount' }, { status: 400 })
      const day = int(p.day) || 1
      let delta: number
      let label: string
      if (action === 'assoc-dues') {
        if (!assoc.members.some((m) => m.handle === account.handle)) return NextResponse.json({ ok: false, why: 'not-member' }, { status: 403 })
        delta = amount
        label = `dues by ${account.handle}`
      } else {
        const verdict = withdrawVerdict(assoc, account.handle, str(p.coSigner, 48) || null, amount)
        if (!verdict.ok) return NextResponse.json({ ok: false, why: verdict.why }, { status: 403 })
        delta = -amount
        label = `withdrawal by ${account.handle} (co-signed by ${str(p.coSigner, 48)})`
      }
      const category = action === 'assoc-dues' ? 'assoc-dues' : 'assoc-withdraw'
      const sig = assocChainLink(assoc.chainTail, day, delta, category, label)
      const treasury = assoc.treasury + delta
      const ledger = pruneLedger([...assoc.ledger, { day, amount: delta, category, label, sig }])
      await db.associationRow.update({ where: { id: row.id }, data: { treasury, chainTail: sig, ledgerJson: JSON.stringify(ledger) } })
      await broadcast('assoc', `assoc:${row.id}`, account.handle, identity.band, { move: category, amount, treasury })
      return NextResponse.json({ ok: true, treasury, sig })
    }

    if (action === 'assoc-contract') {
      if (!canLive(identity, 'assoc')) return NextResponse.json({ ok: false, why: 'adults-only' }, { status: 403 })
      const row = await db.associationRow.findUnique({ where: { id: str(p.assocId, 64) } })
      if (!row) return NextResponse.json({ ok: false, why: 'no-assoc' }, { status: 404 })
      const assoc = rowToAssociation(row)
      if (!assoc.members.some((m) => m.handle === account.handle)) return NextResponse.json({ ok: false, why: 'not-member' }, { status: 403 })
      const terms = str(p.terms, 200).trim()
      const stake = int(p.stake)
      const day = int(p.day) || 1
      if (terms.length < 6) return NextResponse.json({ ok: false, why: 'terms-too-short' }, { status: 400 })
      if (!Number.isFinite(stake) || stake <= 0) return NextResponse.json({ ok: false, why: 'bad-stake' }, { status: 400 })
      const parties = (Array.isArray(p.parties) ? p.parties : []).map((x) => str(x, 48)).filter(Boolean).slice(0, 4)
      if (!parties.includes(account.handle)) parties.unshift(account.handle)
      const contract: LiveContract = {
        id: contractIdFor(terms, parties, day),
        kind: 'coop', parties, terms, stake, status: 'open', day,
      }
      assoc.contracts.push(contract)
      await db.associationRow.update({ where: { id: row.id }, data: { contractsJson: JSON.stringify(assoc.contracts.slice(-24)) } })
      await broadcast('court', `assoc:${row.id}`, account.handle, identity.band, { contract: contract.id, terms, stake, status: 'open' })
      return NextResponse.json({ ok: true, contract })
    }

    if (action === 'assoc-dispute') {
      if (!canLive(identity, 'assoc')) return NextResponse.json({ ok: false, why: 'adults-only' }, { status: 403 })
      const row = await db.associationRow.findUnique({ where: { id: str(p.assocId, 64) } })
      if (!row) return NextResponse.json({ ok: false, why: 'no-assoc' }, { status: 404 })
      const assoc = rowToAssociation(row)
      const contract = assoc.contracts.find((c) => c.id === str(p.contractId, 64))
      if (!contract) return NextResponse.json({ ok: false, why: 'no-contract' }, { status: 404 })
      if (contract.status !== 'open') return NextResponse.json({ ok: false, why: 'not-open' }, { status: 400 })
      const evidence = str(p.evidence, 200).trim() || 'no evidence filed'
      const day = int(p.day) || 1
      const verdict = courtVerdict(contract, evidence)
      contract.status = verdict === 'kept' ? 'kept' : 'disputed'
      contract.verdict = verdict
      contract.verdictDay = day
      if (verdict === 'broken') {
        const penalty = courtPenalty({ ...contract, status: 'disputed' })
        if (penalty) contract.liable = penalty.liable
      }
      contract.status = verdict === 'kept' ? 'kept' : 'settled'
      await db.associationRow.update({ where: { id: row.id }, data: { contractsJson: JSON.stringify(assoc.contracts) } })
      await broadcast('court', `assoc:${row.id}`, 'market-union-court', identity.band, {
        contract: contract.id, verdict, liable: contract.liable ?? null, penalty: verdict === 'broken' ? contract.stake : 0, fee: COURT_FEE,
      })
      return NextResponse.json({ ok: true, verdict, liable: contract.liable ?? null })
    }

    /* --------------------------------- trades ---------------------------------- */
    if (action === 'trades') {
      const rows = await db.tradeRow.findMany({ where: { toHandle: account.handle, status: 'offered' }, take: 24 })
      return NextResponse.json({ ok: true, trades: rows })
    }

    if (action === 'trade-offer') {
      if (!canLive(identity, 'trade')) return NextResponse.json({ ok: false, why: 'adults-only' }, { status: 403 })
      const to = str(p.to, 48)
      const giveCash = int(p.giveCash)
      const wantCash = int(p.wantCash)
      const terms = str(p.terms, 160).trim() || 'street trade'
      const day = int(p.day) || 1
      if (!to || to === account.handle) return NextResponse.json({ ok: false, why: 'bad-partner' }, { status: 400 })
      if ((!Number.isFinite(giveCash) || giveCash < 0) || (!Number.isFinite(wantCash) || wantCash < 0)) return NextResponse.json({ ok: false, why: 'bad-amounts' }, { status: 400 })
      if (giveCash === 0 && wantCash === 0) return NextResponse.json({ ok: false, why: 'empty-trade' }, { status: 400 })
      const count = await db.tradeRow.count({ where: { fromHandle: account.handle } })
      const id = tradeIdFor(account.handle, to, day, count + 1)
      await db.tradeRow.create({ data: { id, fromHandle: account.handle, toHandle: to, giveCash, wantCash, terms, day } })
      await broadcast('trade', 'global', account.handle, identity.band, { tradeId: id, to, giveCash, wantCash, terms })
      return NextResponse.json({ ok: true, tradeId: id })
    }

    if (action === 'trade-accept' || action === 'trade-cancel') {
      if (!canLive(identity, 'trade')) return NextResponse.json({ ok: false, why: 'adults-only' }, { status: 403 })
      const row = await db.tradeRow.findUnique({ where: { id: str(p.tradeId, 64) } })
      if (!row) return NextResponse.json({ ok: false, why: 'no-trade' }, { status: 404 })
      const offer: TradeOffer = {
        id: row.id, from: row.fromHandle, to: row.toHandle,
        giveCash: row.giveCash, wantCash: row.wantCash, terms: row.terms,
        status: row.status as TradeOffer['status'], day: row.day,
      }
      if (action === 'trade-cancel') {
        if (offer.from !== account.handle) return NextResponse.json({ ok: false, why: 'not-yours' }, { status: 403 })
        await db.tradeRow.update({ where: { id: row.id }, data: { status: 'cancelled' } })
        await broadcast('trade', 'global', account.handle, identity.band, { tradeId: row.id, cancelled: true })
        return NextResponse.json({ ok: true })
      }
      const rosterRows = await db.livePresence.findMany()
      const now = Date.now()
      const roster = rosterRows.map((r) => ({
        handle: r.handle, street: r.street, status: 'chilling' as const,
        band: r.band as LiveBand, ts: r.updatedAt.getTime(),
      }))
      const verdict = tradeVerdict(offer, account.handle, roster, now)
      if (!verdict.ok) return NextResponse.json({ ok: false, why: verdict.why }, { status: 400 })
      await db.tradeRow.update({ where: { id: row.id }, data: { status: 'accepted' } })
      await broadcast('trade', 'global', account.handle, identity.band, {
        tradeId: row.id, accepted: true,
        from: offer.from, to: offer.to, giveCash: offer.giveCash, wantCash: offer.wantCash, terms: offer.terms,
      })
      return NextResponse.json({ ok: true, trade: { ...offer, status: 'accepted' } })
    }

    /* ------------------------------ ajo / esusu -------------------------------- */
    if (action === 'ajos') {
      const rows = await db.ajoRow.findMany({ where: { status: { not: 'closed' } }, take: 24 })
      return NextResponse.json({ ok: true, circles: rows.map((r) => { const c = rowToCircle(r); return { id: c.id, name: c.name, contribution: c.contribution, members: c.order.length, round: c.round, pot: c.pot, status: c.status } }) })
    }

    if (action === 'ajo-found') {
      if (!canLive(identity, 'ajo')) return NextResponse.json({ ok: false, why: 'adults-only' }, { status: 403 })
      const name = str(p.name, 48).trim()
      const contribution = int(p.contribution)
      const day = int(p.day) || 1
      if (name.length < 3) return NextResponse.json({ ok: false, why: 'name-too-short' }, { status: 400 })
      if (!Number.isFinite(contribution) || contribution < 100) return NextResponse.json({ ok: false, why: 'bad-contribution' }, { status: 400 })
      const id = ajoIdFor(name, account.handle, day)
      await db.ajoRow.create({
        data: { id, name, contribution, orderJson: JSON.stringify([account.handle]), roundStartDay: day, createdDay: day, paidThisRoundJson: '[]' },
      })
      await broadcast('ajo', 'global', account.handle, identity.band, { ajoId: id, name, contribution, founded: true })
      return NextResponse.json({ ok: true, ajoId: id })
    }

    if (action === 'ajo-join' || action === 'ajo-pay') {
      if (!canLive(identity, 'ajo')) return NextResponse.json({ ok: false, why: 'adults-only' }, { status: 403 })
      const row = await db.ajoRow.findUnique({ where: { id: str(p.ajoId, 64) } })
      if (!row) return NextResponse.json({ ok: false, why: 'no-circle' }, { status: 404 })
      const circle = rowToCircle(row)
      if (circle.status === 'closed') return NextResponse.json({ ok: false, why: 'circle-closed' }, { status: 400 })
      const day = int(p.day) || 1
      if (action === 'ajo-join') {
        if (circle.order.includes(account.handle)) return NextResponse.json({ ok: false, why: 'already-member' }, { status: 400 })
        if (circle.order.length >= AJO_MAX_MEMBERS) return NextResponse.json({ ok: false, why: 'circle-full' }, { status: 400 })
        circle.order.push(account.handle)
        await db.ajoRow.update({ where: { id: row.id }, data: { orderJson: JSON.stringify(circle.order) } })
        await broadcast('ajo', `circle:${row.id}`, account.handle, identity.band, { joined: account.handle, members: circle.order.length })
        return NextResponse.json({ ok: true, members: circle.order.length })
      }
      // ajo-pay: the member's contribution lands in the pot
      if (!circle.order.includes(account.handle)) return NextResponse.json({ ok: false, why: 'not-member' }, { status: 403 })
      if (circle.paidThisRound.includes(account.handle)) return NextResponse.json({ ok: false, why: 'already-paid' }, { status: 400 })
      circle.pot += circle.contribution
      circle.paidThisRound.push(account.handle)
      circle.defaulters = circle.defaulters.filter((d) => d !== account.handle)
      let paidOut: string | null = null
      let payout = 0
      let round = circle.round
      let roundStartDay = circle.roundStartDay
      let paidThisRound = circle.paidThisRound
      if (ajoRoundReady(circle)) {
        // THE ROUND LAW: every head paid — the pot walks the ladder
        const next = ajoNextBeneficiary(circle)
        if (next) {
          paidOut = next
          payout = circle.pot
          circle.paid[circle.round] = next
          round = circle.round + 1
          roundStartDay = day
          circle.pot = 0
          paidThisRound = []
        }
      }
      await db.ajoRow.update({
        where: { id: row.id },
        data: {
          pot: circle.pot, paidJson: JSON.stringify(circle.paid),
          paidThisRoundJson: JSON.stringify(paidThisRound),
          round, roundStartDay, status: 'open', defaultersJson: JSON.stringify(circle.defaulters),
        },
      })
      await broadcast('ajo', `circle:${row.id}`, account.handle, identity.band, { paid: circle.contribution, pot: circle.pot, paidOut, payout })
      return NextResponse.json({ ok: true, pot: circle.pot, paidOut, payout })
    }

    if (action === 'ajo-court') {
      if (!canLive(identity, 'ajo')) return NextResponse.json({ ok: false, why: 'adults-only' }, { status: 403 })
      const row = await db.ajoRow.findUnique({ where: { id: str(p.ajoId, 64) } })
      if (!row) return NextResponse.json({ ok: false, why: 'no-circle' }, { status: 404 })
      const circle = rowToCircle(row)
      const day = int(p.day) || 1
      const panic = ajoPanicCheck(circle, day)
      if (!panic.panic || !panic.defaulter) return NextResponse.json({ ok: false, why: 'no-panic' }, { status: 400 })
      // THE COURT GUARANTEE: the defaulter is fined (their client applies
      // it), their round is covered, and the pot pays the ladder anyway
      const fine = ajoCourtFine(circle, panic.defaulter)
      circle.paid[circle.round] = panic.defaulter // the defaulter takes their round (covered by the fine)
      await db.ajoRow.update({
        where: { id: row.id },
        data: {
          paidJson: JSON.stringify(circle.paid),
          paidThisRoundJson: '[]',
          round: circle.round + 1, roundStartDay: day, status: 'open',
          defaultersJson: '[]', pot: 0,
        },
      })
      await broadcast('court', `circle:${row.id}`, 'market-union-court', identity.band, {
        circle: row.id, defaulter: panic.defaulter, fine: fine.fine, repHit: fine.repHit,
      })
      return NextResponse.json({ ok: true, defaulter: panic.defaulter, fine })
    }

    return NextResponse.json({ ok: false, why: 'unknown-action' }, { status: 400 })
  } catch {
    return NextResponse.json({ ok: false, why: 'relay no gree' }, { status: 500 })
  }
}
