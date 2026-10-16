import { assocChainLink, ajoCourtFine } from '../../src/game/systems/live'
const s1a = assocChainLink('lko-chain-seed', 15, 500, 'assoc-dues', 'dues by Bola')
const s1b = assocChainLink('lko-chain-seed', 15, 500, 'assoc-dues', 'dues by Bola')
console.log('sig deterministic:', s1a === s1b, s1a.slice(0, 12), s1b.slice(0, 12))
const circle = { id: 'x', name: 'n', contribution: 1000, order: ['a'], round: 1, roundStartDay: 1, pot: 0, paid: {}, paidThisRound: [], defaulters: [], status: 'open' as const, createdDay: 1 }
console.log('fine:', ajoCourtFine(circle, 'a'))
