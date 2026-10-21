/**
 * F3 child probe — fresh module evaluation of the world generators in THIS
 * process only: prints sha256(JSON) of STALLS + GRASS + counts. Invoked
 * twice by census-verify.ts; identical output across independent processes
 * IS the determinism proof.
 * Usage: bun scripts/audit-tmp/f3/stall-sha.ts
 */
import './bootstrap-shim'
import { createHash } from 'crypto'

async function main() {
  const layout = await import('../../../src/game/world3d/layout')
  const sha = (v: unknown): string => createHash('sha256').update(JSON.stringify(v)).digest('hex')
  console.log(
    JSON.stringify({
      stallsLen: layout.STALLS.length,
      grassLen: layout.GRASS.length,
      stallsSha: sha(layout.STALLS),
      grassSha: sha(layout.GRASS),
    }),
  )
}

main()
