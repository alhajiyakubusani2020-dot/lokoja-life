/**
 * M21 — THE WHOT ENGINE (pure, headless — no React, no store, no DOM)
 * -------------------------------------------------------------------
 * The complete match kernel for the Whot! app: the REAL 54-card pack,
 * the seeded shuffle, the legality law, the turn resolution, the NPC's
 * greedy policy, and the stake law. Tests import this file directly
 * under Bun — it must stay free of any React/DOM/store import.
 *
 * THE PACK (the standard Nigerian Whot deck — exactly 54 cards; 6 and
 * 9 do not exist, and the suits are unequal, which is what makes 54):
 *     circles   1 2 3 4 5 7 8 10 11 12 13 14   (12 cards)
 *     triangles 1 2 3 4 5 7 8 10 11 12 13 14   (12 cards)
 *     squares   1 2 3 5 7 10 11 13 14          ( 9 cards)
 *     crosses   1 2 3 5 7 10 11 13 14          ( 9 cards)
 *     stars     1 2 3 4 5 7 8                  ( 7 cards)
 *     five "20" Whot cards                      ( 5 cards)
 *
 * THE HOUSE RULESET (stated in the app, one line, exactly what this
 * engine implements): match the call card's suit or number · 1 = skip
 * the next player · 8 = hold on — in a two-man match both mean the
 * same player goes again · 2 = pick two · 5 = pick three (a same-number
 * card defends, and it stacks) · 14 = go to market (the opponent picks
 * 1, you play again) · 20 = Whot — wild, the caller names the suit ·
 * no legal card? pick from the market.
 *
 * DETERMINISM: the shuffle is seeded through mulberry32; the seed comes
 * from (world.day, match counter) via whotSeed(). The RNG state lives
 * inside the match object, so mid-match reshuffles stay deterministic
 * too — the same seed replays the exact same match, proven in tests.
 *
 * THE STAKE LAW: the table stake is ₦200, winner takes 2× (paid by the
 * COMPONENT through the store's removeMoney/addMoney — no money moves
 * here). The kid wall is structural: AGE_LAW says a child plays for
 * joy, so stakeFor('kid') is ₦0 before any door is even looked at.
 */

export type WhotSuit = 'circle' | 'triangle' | 'square' | 'cross' | 'star' | 'whot'

export interface WhotCard {
  id: string
  suit: WhotSuit
  n: number
}

export const WHOT_STAKE = 200

/** The REAL pack: 6 and 9 do not exist; squares/crosses also skip 4, 8, 12. */
export const DECK_LAW = {
  circle: [1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14],
  triangle: [1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14],
  square: [1, 2, 3, 5, 7, 10, 11, 13, 14],
  cross: [1, 2, 3, 5, 7, 10, 11, 13, 14],
  star: [1, 2, 3, 4, 5, 7, 8],
  whots: 5,
} as const

export const SUIT_GLYPH: Record<WhotSuit, string> = {
  circle: '●',
  triangle: '▲',
  square: '■',
  cross: '✕',
  star: '★',
  whot: '★20',
}

export const SUIT_LABEL: Record<WhotSuit, string> = {
  circle: 'Circles',
  triangle: 'Triangles',
  square: 'Squares',
  cross: 'Crosses',
  star: 'Stars',
  whot: 'Whot',
}

export function buildDeck(): WhotCard[] {
  const cards: WhotCard[] = []
  const suits: Exclude<WhotSuit, 'whot'>[] = ['circle', 'triangle', 'square', 'cross', 'star']
  for (const suit of suits) {
    for (const n of DECK_LAW[suit]) cards.push({ id: `${suit}-${n}`, suit, n })
  }
  for (let i = 0; i < DECK_LAW.whots; i++) cards.push({ id: `whot-${i + 1}`, suit: 'whot', n: 20 })
  return cards
}

/** mulberry32 with an explicit state so the whole match stays serialisable. */
export function rngStep(seed: number): { value: number; next: number } {
  const next = (seed + 0x6d2b79f5) | 0
  let t = next
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return { value: ((t ^ (t >>> 14)) >>> 0) / 4294967296, next }
}

/** THE SEED LAW: same (day, matchNo) → the same shuffle. Every time. */
export function whotSeed(day: number, matchNo: number): number {
  return (Math.imul(day, 0x9e3779b1) ^ Math.imul(matchNo, 0x85ebca6b)) >>> 0
}

/** Fisher–Yates with the seeded state — pure, returns the new state. */
export function shuffleDeck(deck: readonly WhotCard[], seed: number): { cards: WhotCard[]; seed: number } {
  const cards = [...deck]
  let s = seed >>> 0
  for (let i = cards.length - 1; i > 0; i--) {
    const r = rngStep(s)
    s = r.next
    const j = Math.floor(r.value * (i + 1))
    const tmp = cards[i]!
    cards[i] = cards[j]!
    cards[j] = tmp
  }
  return { cards, seed: s }
}

export interface WhotMatch {
  deck: WhotCard[]
  pile: WhotCard[]
  hands: { you: WhotCard[]; npc: WhotCard[] }
  turn: 'you' | 'npc'
  activeSuit: WhotSuit
  activeN: number
  /** pick-2/5 debt the CURRENT-turn player owes (0 = none) */
  pendingPick: number
  pendingKind: 0 | 2 | 5
  over: boolean
  winner: 'you' | 'npc' | null
  rngState: number
  note: string
}

export const HAND_SIZE = 6

/** the action numbers the opener law skips (a match never opens on a debt) */
function isActionCard(c: WhotCard): boolean {
  return c.suit === 'whot' || c.n === 1 || c.n === 2 || c.n === 5 || c.n === 14
}

/** How many cards actually left the deck (an empty market returns 0 — the note never lies). */
function draw(m: WhotMatch, who: 'you' | 'npc', count: number): number {
  let taken = 0
  for (let k = 0; k < count; k++) {
    if (m.deck.length === 0) {
      // THE MARKET LAW: market finished — shuffle the played pile (top stays) back in
      if (m.pile.length <= 1) return taken
      const top = m.pile[m.pile.length - 1]!
      const sh = shuffleDeck(m.pile.slice(0, -1), m.rngState)
      m.deck = sh.cards
      m.rngState = sh.seed
      m.pile = [top]
    }
    const card = m.deck.pop()
    if (!card) return taken
    m.hands[who].push(card)
    taken++
  }
  return taken
}

export function dealMatch(seed: number): WhotMatch {
  const sh = shuffleDeck(buildDeck(), seed)
  const m: WhotMatch = {
    deck: sh.cards,
    pile: [],
    hands: { you: [], npc: [] },
    turn: 'you',
    activeSuit: 'circle',
    activeN: 1,
    pendingPick: 0,
    pendingKind: 0,
    over: false,
    winner: null,
    rngState: sh.seed,
    note: 'The market dey open — your move.',
  }
  draw(m, 'you', HAND_SIZE)
  draw(m, 'npc', HAND_SIZE)
  // the opener: flip until a plain number card — a 1/2/5/14/20 would
  // start the match with a debt nobody asked for
  const setAside: WhotCard[] = []
  let starter: WhotCard | null = null
  while (m.deck.length > 0) {
    const c = m.deck.pop()!
    if (!isActionCard(c)) {
      starter = c
      break
    }
    setAside.push(c)
  }
  if (!starter && setAside.length > 0) starter = setAside.shift()!
  if (starter) {
    m.pile.push(starter)
    m.activeSuit = starter.suit
    m.activeN = starter.n
  }
  for (let i = setAside.length - 1; i >= 0; i--) m.deck.unshift(setAside[i]!)
  return m
}

/** The legality law: debt first (defend with the same number), then suit/number/whot. */
export function legalMoves(m: WhotMatch, hand: readonly WhotCard[]): number[] {
  const out: number[] = []
  for (let i = 0; i < hand.length; i++) {
    const c = hand[i]!
    if (m.pendingKind > 0) {
      if (c.n === m.pendingKind) out.push(i)
    } else if (c.suit === 'whot' || c.suit === m.activeSuit || c.n === m.activeN) {
      out.push(i)
    }
  }
  return out
}

export function playCard(m: WhotMatch, who: 'you' | 'npc', index: number, calledSuit?: WhotSuit): WhotMatch {
  const hand = m.hands[who]
  const card = hand[index]
  if (m.over || !card) return m
  if (!legalMoves(m, hand).includes(index)) return m

  const next: WhotMatch = {
    ...m,
    deck: [...m.deck],
    pile: [...m.pile],
    hands: { you: [...m.hands.you], npc: [...m.hands.npc] },
  }
  next.hands[who] = hand.filter((_, i) => i !== index)
  next.pile.push(card)

  const other: 'you' | 'npc' = who === 'you' ? 'npc' : 'you'
  const self = who === 'you' ? 'You' : 'Emeka'
  let again = false

  if (card.suit === 'whot') {
    const call = calledSuit && calledSuit !== 'whot' ? calledSuit : 'circle'
    next.activeSuit = call
    next.activeN = 20
    next.turn = other
    next.pendingPick = 0
    next.pendingKind = 0
    next.note = `${self} call${who === 'you' ? '' : 's'} ${SUIT_LABEL[call].toLowerCase()} — follow am or pick.`
  } else {
    next.activeSuit = card.suit
    next.activeN = card.n
    if (card.n === 1 || card.n === 8) {
      again = true
      next.note =
        card.n === 1
          ? `1 — the next player skips. Two-man match: ${self === 'You' ? 'you go' : 'Emeka goes'} again.`
          : `8 — hold on: ${self === 'You' ? 'you play' : 'Emeka plays'} again.`
    } else if (card.n === 14) {
      const took = draw(next, other, 1)
      again = true
      next.note = `14 — general market: ${other === 'you' ? 'you pick' : 'Emeka picks'} ${took}, then ${who === 'you' ? 'you play' : 'Emeka plays'} again.`
    } else if (card.n === 2 || card.n === 5) {
      const per = card.n === 2 ? 2 : 3
      next.pendingPick = m.pendingKind === card.n ? m.pendingPick + per : per
      next.pendingKind = card.n
      next.turn = other
      next.note = `Pick ${next.pendingPick}! ${other === 'you' ? 'You owe the market' : 'Emeka owes the market'} (a ${card.n} defends).`
    } else {
      next.turn = other
      next.pendingPick = 0
      next.pendingKind = 0
      next.note = `${self} drop${who === 'you' ? '' : 's'} ${SUIT_GLYPH[card.suit]} ${card.n}.`
    }
  }

  if (again) {
    next.turn = who
    next.pendingPick = 0
    next.pendingKind = 0
  }

  if (next.hands[who].length === 0) {
    next.over = true
    next.winner = who
    next.note = who === 'you' ? 'YOU WIN — hand dry!' : 'Emeka wins — hand dry.'
  }
  return next
}

/** Pick from the market: clears the debt (whatever it says) or a plain forced pick. */
export function pickFromMarket(m: WhotMatch): WhotMatch {
  if (m.over) return m
  const who = m.turn
  const next: WhotMatch = {
    ...m,
    deck: [...m.deck],
    pile: [...m.pile],
    hands: { you: [...m.hands.you], npc: [...m.hands.npc] },
  }
  const count = m.pendingPick > 0 ? m.pendingPick : 1
  const took = draw(next, who, count)
  next.pendingPick = 0
  next.pendingKind = 0
  next.turn = who === 'you' ? 'npc' : 'you'
  next.note = `${who === 'you' ? 'You pick' : 'Emeka picks'} ${took} from the market${took === 0 ? ' — market don finish' : ''}.`
  return next
}

/**
 * THE STAKE LAW — the kid wall is structural, not a UI preference:
 * a kid's stake is ₦0 before any money door is even looked at, and a
 * pocket that cannot carry the table stake plays free (honestly
 * labelled, never blocked — the street no dey stop pass pass).
 */
export function stakeFor(band: 'kid' | 'teen' | 'adult', cash: number): number {
  if (band === 'kid') return 0
  return cash >= WHOT_STAKE ? WHOT_STAKE : 0
}

/**
 * THE NPC POLICY — greedy-legal, whots last: defend a pick debt with the
 * same number; otherwise shed the highest-value legal card and hold the
 * 20s for the endgame. No legal card → the market.
 */
export function greedyChoose(m: WhotMatch, who: 'you' | 'npc'): { kind: 'play'; index: number; call?: WhotSuit } | { kind: 'pick' } {
  const hand = m.hands[who]
  const legal = legalMoves(m, hand)
  if (legal.length === 0) return { kind: 'pick' }
  const scored = legal
    .map((i) => {
      const c = hand[i]!
      return { i, w: c.suit === 'whot' ? -1 : c.n }
    })
    .sort((a, b) => b.w - a.w)
  const best = scored[0]!
  const card = hand[best.i]!
  if (card.suit === 'whot') {
    // call the suit the player holds most of (ties → the law's fixed order)
    const held: Record<'circle' | 'triangle' | 'square' | 'cross' | 'star', number> = { circle: 0, triangle: 0, square: 0, cross: 0, star: 0 }
    for (const c of hand) if (c.suit !== 'whot') held[c.suit]++
    const order: ('circle' | 'triangle' | 'square' | 'cross' | 'star')[] = ['circle', 'triangle', 'square', 'cross', 'star']
    let call: (typeof order)[number] = 'circle'
    let bestN = -1
    for (const s of order) {
      if (held[s] > bestN) {
        bestN = held[s]
        call = s
      }
    }
    return { kind: 'play', index: best.i, call }
  }
  return { kind: 'play', index: best.i }
}

export function npcChoose(m: WhotMatch): { kind: 'play'; index: number; call?: WhotSuit } | { kind: 'pick' } {
  return greedyChoose(m, 'npc')
}

export function npcTurn(m: WhotMatch): WhotMatch {
  if (m.over || m.turn !== 'npc') return m
  const choice = npcChoose(m)
  if (choice.kind === 'pick') return pickFromMarket(m)
  return playCard(m, 'npc', choice.index, choice.call)
}

/** Both sides greedy — the scripted-match law runs this until a winner. */
export function autoTurn(m: WhotMatch): WhotMatch {
  if (m.over) return m
  const choice = greedyChoose(m, m.turn)
  if (choice.kind === 'pick') return pickFromMarket(m)
  return playCard(m, m.turn, choice.index, choice.call)
}
