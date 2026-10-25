/**
 * M20 — THE NATION WORKER
 * -------------------------
 * The off-thread half of the crowd sim. Owns NOTHING but the kernel
 * and its own 2-second heartbeat — no store, no DOM, no three.js.
 * Speaks three messages:
 *   {type:'init', seed, count, pulse}  → build the city
 *   {type:'pulse', pulse}              → the day's world facts
 *   {type:'stop'}                      → the quiet exit
 * and posts exactly one shape back: {type:'snapshot', snapshot} —
 * the small aggregate, never a per-NPC array.
 */

import { createCrowdState, stepCrowd, crowdAggregate } from '../systems/nation-sim'
import type { CrowdState, WorldPulse } from '../systems/nation-sim'

let state: CrowdState | null = null
let pulse: WorldPulse
let timer: ReturnType<typeof setInterval> | null = null

function tick(): void {
  if (!state) return
  stepCrowd(state, pulse)
  ;(self as unknown as Worker).postMessage({ type: 'snapshot', snapshot: crowdAggregate(state) })
}

self.onmessage = (ev: MessageEvent) => {
  const data = ev.data as { type?: string; seed?: number; count?: number; pulse?: WorldPulse }
  if (data.type === 'init') {
    state = createCrowdState(data.seed ?? 20261017, data.count ?? 10_000)
    pulse = data.pulse ?? { day: 1, weather: 'sunny', floodLevel: 0, marketMult: 1, festival: null }
    if (timer) clearInterval(timer)
    tick() // the first snapshot is never late
    timer = setInterval(tick, 2000)
  } else if (data.type === 'pulse' && data.pulse) {
    pulse = data.pulse
  } else if (data.type === 'stop') {
    if (timer) clearInterval(timer)
    timer = null
    state = null
  }
}
