/**
 * PHASE-2.5 TEAM ALPHA — report builder.
 * Reads scripts/perf/phase25/results/<tier>.json (both runs per tier) and
 * prints the truth table + reproducibility deltas. NO estimated numbers:
 * anything a launch could not capture prints as null/WHY verbatim from the record.
 *
 *   bun scripts/perf/phase25/report.ts
 */
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const RESULTS = '/home/z/my-project/scripts/perf/phase25/results'
const TIERS = ['high', 'mid', 'low'] as const

const fmt = (v: unknown, suffix = '') => (v === null || v === undefined ? '—' : `${v}${suffix}`)

for (const tier of TIERS) {
  const p = join(RESULTS, `${tier}.json`)
  if (!existsSync(p)) {
    console.log(`\n### ${tier.toUpperCase()} — NO RESULTS FILE (${p})`)
    continue
  }
  const runs = JSON.parse(readFileSync(p, 'utf8'))
  console.log(`\n### ${tier.toUpperCase()} — ${runs.length} run(s) on file — buildId ${runs[0]?.buildId ?? '?'}`)
  for (const r of runs) {
    const f = r.fps30s ?? {}
    const dc = r.drawCalls
    console.log(
      [
        `run${r.run} @ ${r.ts}`,
        `build=${String(r.buildId).slice(0, 8)}`,
        `emu=${r.emulation?.viewport}${r.emulation?.hasTouch ? ' touch' : ''} cpu×${r.emulation?.cpuThrottle}`,
        `boot=${fmt(r.boot?.worldSceneReadyMs, 'ms')} (tier=${r.boot?.tierInForce ?? '?'})`,
        `fps p50=${fmt(f.fpsP50)} p05=${fmt(f.fpsP05)} avg=${fmt(f.avgFps)} · frame p95=${fmt(f.p95GapMs, 'ms')} worst=${fmt(f.worstGapMs, 'ms')} (${fmt(f.frames, ' frames')})`,
        `draws=${dc ? dc.calls : '— ' + (r.drawCallsWhy ?? '')} tris=${dc ? dc.triangles : '—'}`,
        `probe(avg)=${r.probeReport?.fpsAvg ?? '—'} probeDraws=${r.probeReport?.drawCalls ?? '—'} gpu=${r.probeReport?.gpu ? String(r.probeReport.gpu).slice(0, 40) : '—'}`,
        `heap=${fmt(r.heap?.usedMB, 'MB')} (${r.heap?.source ?? r.heap?.why ?? ''})`,
        `errors: page=${r.errors?.pageerror ?? '?'} console=${r.errors?.consoleError ?? '?'}`,
        r.flow?.harnessError ? `HARNESS ERROR: ${r.flow.harnessError}` : '',
      ]
        .filter(Boolean)
        .join('\n  '),
    )
  }
}
