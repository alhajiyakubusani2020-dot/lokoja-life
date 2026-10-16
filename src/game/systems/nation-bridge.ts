/**
 * M20 — THE NATION BRIDGE (the worker's door)
 * --------------------------------------------
 * Owns the crowd sim's lifecycle for the store:
 *  - worker path: a real Web Worker steps the kernel off-thread and
 *    posts the small CrowdSnapshot aggregate every 2s;
 *  - fallback path (no Worker / construction refused / the workerSim
 *    flag dark): the SAME kernel steps on the main thread inside a
 *    2s setInterval — the kernel is a few ms for 10k NPCs, the same
 *    time-slice doctrine the terrain already proved. The UI never
 *    stutters either way, and the LAWS ARE THE LAWS in both paths
 *    (the suite runs the fallback path directly under Bun).
 *
 * THE BOUNDARY LAW: whatever the path, only crowdAggregate output
 * crosses into the store — per-NPC typed arrays never leave this
 * module's closure. The dashboard reads numbers, never people.
 */

import { createCrowdState, stepCrowd, crowdAggregate, quietPulse } from './nation-sim'
import type { CrowdState, CrowdSnapshot, WorldPulse } from './nation-sim'

const CADENCE_MS = 2000

export interface NationBridge {
  /** is the sim alive (either path) */
  alive: () => boolean
  /** which path won — 'worker' (off-thread) or 'main' (the time-sliced fallback) */
  path: () => 'worker' | 'main'
  /** push the day's world facts into the sim (the store calls at the day roll) */
  pulse: (p: WorldPulse) => void
  /** latest aggregate (null before the first tick) */
  snapshot: () => CrowdSnapshot | null
  stop: () => void
}

interface WorkerApi {
  postMessage: (msg: unknown) => void
  terminate: () => void
  onmessage: ((ev: MessageEvent) => void) | null
}

let active: {
  kind: 'worker' | 'main'
  engine: WorkerApi | 'main-loop'
  timer: ReturnType<typeof setInterval> | null
  state: CrowdState | null
  last: CrowdSnapshot | null
  pulse: WorldPulse
  onSnapshot: ((s: CrowdSnapshot) => void) | null
} | null = null

/** The main-thread fallback step — the same kernel, honest and small. */
function mainStep(): void {
  if (!active || active.kind !== 'main' || !active.state) return
  stepCrowd(active.state, active.pulse)
  const snap = crowdAggregate(active.state)
  active.last = snap
  if (active.onSnapshot) active.onSnapshot(snap)
}

/**
 * Start the sim. `workerFactory` is injectable so tests and the
 * fallback law never depend on the browser. Returns the bridge.
 */
export function startNationSim(opts: {
  seed: number
  count: number
  onSnapshot?: (s: CrowdSnapshot) => void
  allowWorker?: boolean
  initialPulse?: WorldPulse
}): NationBridge {
  stopNationSim()
  const pulse = opts.initialPulse ?? quietPulse(1)
  const onSnapshot = opts.onSnapshot ?? null

  // --- the worker path (REAL BROWSER ONLY, flag-allowed, construction guarded) ---
  // THE ENVIRONMENT LAW: Bun/Node implement Worker too, but a worker there
  // outlives the test process and hangs the suite exit. The worker path is
  // for the browser (document exists); every other runtime takes the
  // time-sliced main path — the same kernel, the same laws, honestly.
  const isRealBrowser = typeof document !== 'undefined'
  if (opts.allowWorker !== false && isRealBrowser && typeof Worker !== 'undefined') {
    try {
      const worker = new Worker(new URL('../workers/nation.worker.ts', import.meta.url)) as unknown as WorkerApi
      const bridge: typeof active = {
        kind: 'worker',
        engine: worker,
        timer: null,
        state: null,
        last: null,
        pulse,
        onSnapshot,
      }
      worker.onmessage = (ev: MessageEvent) => {
        const data = ev.data as { type?: string; snapshot?: CrowdSnapshot }
        if (data && data.type === 'snapshot' && data.snapshot && active === bridge) {
          bridge.last = data.snapshot
          if (onSnapshot) onSnapshot(data.snapshot)
        }
      }
      worker.postMessage({ type: 'init', seed: opts.seed, count: opts.count, pulse })
      active = bridge
      return {
        alive: () => active === bridge,
        path: () => 'worker',
        pulse: (p) => {
          bridge.pulse = p
          worker.postMessage({ type: 'pulse', pulse: p })
        },
        snapshot: () => active === bridge ? bridge.last : null,
        stop: stopNationSim,
      }
    } catch {
      // construction refused — fall through to the main path, honestly
    }
  }

  // --- the main-thread path (tests, odd browsers, flag-dark workers) ---
  const state = createCrowdState(opts.seed, opts.count)
  const main: typeof active = {
    kind: 'main',
    engine: 'main-loop',
    timer: null,
    state,
    last: null,
    pulse,
    onSnapshot,
  }
  main.timer = setInterval(mainStep, CADENCE_MS)
  // THE SUITE LAW: under Bun/Node the interval must never hold a test
  // process open — unref it where the API exists (browsers ignore this).
  const t = main.timer as unknown as { unref?: () => void }
  if (typeof t.unref === 'function') t.unref()
  active = main
  // first aggregate immediately — the dashboard is never empty on boot
  mainStep()
  return {
    alive: () => active === main,
    path: () => 'main',
    pulse: (p) => {
      if (active === main) main.pulse = p
    },
    snapshot: () => (active === main ? main.last : null),
    stop: stopNationSim,
  }
}

/** Stop whatever is running. Idempotent — stopping a stopped bridge is nothing. */
export function stopNationSim(): void {
  if (!active) return
  if (active.timer) clearInterval(active.timer)
  if (active.kind === 'worker' && active.engine !== 'main-loop') {
    try {
      ;(active.engine as WorkerApi).terminate()
    } catch {
      /* a dead worker is already stopped */
    }
  }
  active = null
}

/** Test hook — the bridge's full internal truth (laws assert on it). */
export function __nationBridgeForTests(): { kind: string | null; hasState: boolean } {
  if (!active) return { kind: null, hasState: false }
  return { kind: active.kind, hasState: active.state !== null }
}
