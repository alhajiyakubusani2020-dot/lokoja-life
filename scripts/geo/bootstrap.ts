/**
 * THE CLI GEO BOOTSTRAP — import this FIRST in any bun script whose graph
 * reaches world3d/layout or world3d/schools. ESM evaluates imports in
 * document order, so a first-position import of this module fills the geo
 * arrays before layout's module-scope derivations ever run — the same
 * guarantee the browser's geo gate gives the world chunk.
 */
import { readFileSync } from 'fs'
import { initGeoWith } from '../../src/game/world3d/geo'

const bin = readFileSync('/home/z/my-project/public/world/geo-v1.bin')
initGeoWith(bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength))
