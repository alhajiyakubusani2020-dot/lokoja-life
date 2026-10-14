/**
 * LOKOJA LIFE — M7: RUN ON ANY DEVICE
 * ------------------------------------
 * Pure, deterministic device intelligence. This module is the LAW for
 * how the game looks on every phone, laptop and potato it meets:
 *
 *   signals  →  tier (low / mid / high)  →  render preset  →  live tuning
 *
 * Every decision is a named rule with a reason string (shown in the
 * settings UI — the player deserves to know WHY their game looks the
 * way it does), and every function takes its world as arguments so the
 * whole file tests without a browser.
 *
 * The companion hooks in here:
 *   - probeWebGL()      can the device do 3D at all? which GPU?
 *   - nextDynRes()      the dynamic-resolution hysteresis law — drops
 *                       render resolution under sustained frame stress,
 *                       climbs back when there is headroom, never
 *                       oscillates.
 */

/* --------------------------------- signals ---------------------------------- */

/** Everything detection needs, gathered from ONE device. All optional —
 *  Safari hides most of these, and the law must still hold. */
export interface DeviceSignals {
  /** navigator.hardwareConcurrency (0 = unknown, iOS hides it) */
  cores: number
  /** navigator.deviceMemory in GB (0 = unknown, capped at 8 by Chrome) */
  memoryGB: number
  /** unmasked GPU renderer string ('' = unknown) */
  gpu: string
  /** touch-first device (pointer: coarse) */
  coarsePointer: boolean
  /** navigator.userAgent mobile signal (belt to coarse's braces) */
  mobileUA: boolean
  /** the device can create a WebGL1 context at all */
  webgl1: boolean
  /** the device can create a WebGL2 context */
  webgl2: boolean
}

/* ----------------------------------- tiers ---------------------------------- */

export type QualityTier = 'low' | 'mid' | 'high'
/** what the player picks in settings — 'auto' trusts the law above */
export type QualitySetting = 'auto' | QualityTier

export interface TierVerdict {
  tier: QualityTier
  /** human-readable evidence, shown in the settings sheet */
  reasons: string[]
}

const SOFTWARE_GPU = /swiftshader|llvmpipe|softpipe|software|basic ?render/i

/**
 * THE TIER LAW — explicit, ordered, explainable. First decisive
 * evidence wins. Designed against real hardware:
 *
 *   desktop 16GB/8c          → high   (≥6GB + ≥6 cores)
 *   desktop 8GB/4c           → high   (desktop ladder)
 *   old laptop 4GB/2c        → low    (≤2 cores floor)
 *   mid Android 4GB/8c touch → mid    (≤4GB cap)
 *   flagship 8GB/8c          → high
 *   iPhone (hides specs)     → mid    (touch + unknown = safe middle)
 *   SwiftShader / headless   → low    (software GL is never high)
 */
export function detectTier(s: DeviceSignals): TierVerdict {
  if (!s.webgl1) return { tier: 'low', reasons: ['no WebGL — the game runs in Map Mode'] }
  if (SOFTWARE_GPU.test(s.gpu)) {
    return { tier: 'low', reasons: [`software GPU (${s.gpu.slice(0, 40)})`] }
  }
  if (s.memoryGB > 0 && s.memoryGB <= 2) return { tier: 'low', reasons: [`~${s.memoryGB}GB RAM`] }
  if (s.cores > 0 && s.cores <= 2) return { tier: 'low', reasons: [`${s.cores} cores`] }

  if (s.memoryGB >= 6 && s.cores >= 6) {
    return { tier: 'high', reasons: [`${s.memoryGB}GB RAM · ${s.cores} cores`] }
  }
  if (!s.coarsePointer && !s.mobileUA && s.cores >= 4 && (s.memoryGB === 0 || s.memoryGB >= 4)) {
    return { tier: 'high', reasons: [`${s.cores} cores · desktop`] }
  }

  if (s.memoryGB > 0 && s.memoryGB <= 4) return { tier: 'mid', reasons: [`~${s.memoryGB}GB RAM`] }
  if (s.cores > 0 && s.cores <= 4) return { tier: 'mid', reasons: [`${s.cores} cores`] }
  if (s.coarsePointer || s.mobileUA) {
    return { tier: 'mid', reasons: ['touch device — specs hidden, safe middle'] }
  }
  return { tier: 'mid', reasons: ['unknown specs — safe middle'] }
}

/* ------------------------------- render presets ------------------------------ */

/** Everything the 3D scene needs from the tier — renderer-level knobs only. */
export interface QualityPreset {
  shadows: boolean
  antialias: boolean
  /** maximum devicePixelRatio the renderer may use */
  dprCap: number
  /** dynamic resolution may never go below this */
  dprFloor: number
  /** camera far plane (u) — draw-distance / overdraw control */
  far: number
  /** 0 = render every frame ('always'); n = pace at n Hz demand mode */
  frameHz: number
  /** city scale (draw distance) skyline: cheap fog push on low tier */
  fogPush: number
}

export const QUALITY_PRESETS: Record<QualityTier, QualityPreset> = {
  high: { shadows: true, antialias: true, dprCap: 1.75, dprFloor: 1.0, far: 900, frameHz: 0, fogPush: 0 },
  mid: { shadows: false, antialias: true, dprCap: 1.4, dprFloor: 0.85, far: 820, frameHz: 0, fogPush: 0 },
  low: { shadows: false, antialias: false, dprCap: 1.05, dprFloor: 0.65, far: 720, frameHz: 30, fogPush: 0.12 },
}

/** THE QUALITY LAW: the player's explicit pick always wins; 'auto' trusts the tier. */
export function resolveQuality(setting: QualitySetting, tier: QualityTier): QualityTier {
  return setting === 'auto' ? tier : setting
}

/* ----------------------------- dynamic resolution ---------------------------- */

export interface DynResState {
  /** the dpr cap currently in force */
  cap: number
  /** direction the device is drifting */
  dir: 'steady' | 'hot' | 'cool'
  /** ms spent in the current direction */
  sinceMs: number
  /** total drops + raises this session (telemetry / tests) */
  changes: number
}

export interface DynResSample {
  /** 95th-percentile frame time this window, ms */
  p95ms: number
  /** when this sample was taken (ms monotonic-ish) */
  nowMs: number
}

export const DYNRES = {
  /** evaluate every ~2s (the HUD chip's cadence) */
  sampleMs: 2000,
  /** sustained p95 above this = the device is struggling */
  hotP95: 40,
  /** p95 under this = headroom, may climb back */
  coolP95: 22,
  /** hot dwell before dropping a step (ignore one-off hitches) */
  hotDwellMs: 4000,
  /** cool dwell before climbing a step (longer — flapping looks worse than sag) */
  coolDwellMs: 8000,
  stepDown: 0.15,
  stepUp: 0.1,
} as const

export interface DynResBounds {
  floor: number
  /** the tier's original cap — the ceiling it recovers toward */
  initialCap: number
}

/** never let the caller's state be mutated — pure law */
export function nextDynRes(
  state: DynResState,
  sample: DynResSample,
  b: DynResBounds,
): { state: DynResState; action: 'drop' | 'raise' | 'hold'; reason: string } {
  const { hotP95, coolP95, hotDwellMs, coolDwellMs, stepDown, stepUp } = DYNRES

  // --- heating ---------------------------------------------------------------
  if (sample.p95ms > hotP95) {
    const since = state.dir === 'hot' ? state.sinceMs + DYNRES.sampleMs : 0
    if (since >= hotDwellMs && state.cap > b.floor) {
      const cap = Math.max(b.floor, round2(state.cap - stepDown))
      return {
        state: { cap, dir: 'steady', sinceMs: 0, changes: state.changes + 1 },
        action: 'drop',
        reason: `p95 ${sample.p95ms.toFixed(0)}ms → cap ${cap.toFixed(2)}`,
      }
    }
    return { state: { ...state, dir: 'hot', sinceMs: since }, action: 'hold', reason: `hot ${since}ms` }
  }

  // --- cooling ---------------------------------------------------------------
  if (sample.p95ms < coolP95) {
    const since = state.dir === 'cool' ? state.sinceMs + DYNRES.sampleMs : 0
    if (since >= coolDwellMs && state.cap < b.initialCap) {
      const cap = Math.min(b.initialCap, round2(state.cap + stepUp))
      return {
        state: { cap, dir: 'steady', sinceMs: 0, changes: state.changes + 1 },
        action: 'raise',
        reason: `p95 ${sample.p95ms.toFixed(0)}ms → cap ${cap.toFixed(2)}`,
      }
    }
    return { state: { ...state, dir: 'cool', sinceMs: since }, action: 'hold', reason: `cool ${since}ms` }
  }

  // --- steady band (nothing acts between 22-40ms — that IS the target) --------
  return { state: { ...state, dir: 'steady', sinceMs: 0 }, action: 'hold', reason: 'steady' }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

/* -------------------------------- webgl probe -------------------------------- */

export interface GlSupport {
  webgl1: boolean
  webgl2: boolean
  /** best-effort unmasked GPU name ('' when hidden) */
  gpu: string
}

type GlFactory = (type: 'webgl2' | 'webgl') => { getParameter: (p: number) => unknown; getExtension: (n: string) => { UNMASKED_RENDERER_WEBGL: number } | null } | null

const GL_CONTEXTS: Array<'webgl2' | 'webgl'> = ['webgl2', 'webgl']
const UNMASKED = 0x9246 // UNMASKED_RENDERER_WEBGL constant (avoids a GL header import)

/**
 * Can this device do 3D at all — and on what chip? Probes with a
 * throwaway context, reads the GPU name, then immediately loses the
 * context so the browser can reclaim it. Injectable for tests; every
 * failure path degrades to "unsupported" honestly.
 */
export function probeWebGL(createCtx: GlFactory = defaultGlFactory): GlSupport {
  const out: GlSupport = { webgl1: false, webgl2: false, gpu: '' }
  for (const type of GL_CONTEXTS) {
    try {
      const gl = createCtx(type)
      if (!gl) continue
      if (type === 'webgl2') out.webgl2 = true
      else out.webgl1 = true
      if (!out.gpu) {
        try {
          const dbg = gl.getExtension('WEBGL_debug_renderer_info')
          const name = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(UNMASKED)
          out.gpu = typeof name === 'string' ? name : ''
        } catch {
          /* GPU name is a nicety, never a requirement */
        }
      }
      lose(gl)
    } catch {
      /* context creation threw — treat as unsupported for this type */
    }
  }
  return out
}

function lose(gl: ReturnType<GlFactory>): void {
  try {
    ;(gl as unknown as { getExtension(n: string): { loseContext(): void } | null })
      .getExtension('WEBGL_lose_context')
      ?.loseContext()
  } catch {
    /* best effort */
  }
}

function defaultGlFactory(type: 'webgl2' | 'webgl'): ReturnType<GlFactory> | null {
  if (typeof document === 'undefined') return null
  const canvas = document.createElement('canvas')
  return canvas.getContext(type) as unknown as ReturnType<GlFactory>
}

/* --------------------------------- the reader -------------------------------- */

/**
 * Gather the real device's signals. EVERY read is guarded — the law is
 * that this function cannot throw on any device, however old or locked
 * down (private-mode iOS, crawler headless, smart-TV browser).
 */
export function readDeviceSignals(): DeviceSignals {
  let cores = 0
  let memoryGB = 0
  let coarsePointer = false
  let mobileUA = false
  let gl: GlSupport = { webgl1: true, webgl2: true, gpu: '' } // assume yes when probe impossible — never block on this

  try {
    if (typeof navigator !== 'undefined') {
      const nav = navigator as Navigator & { deviceMemory?: number }
      cores = typeof nav.hardwareConcurrency === 'number' ? nav.hardwareConcurrency : 0
      memoryGB = typeof nav.deviceMemory === 'number' ? nav.deviceMemory : 0
      mobileUA = /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent)
      try {
        coarsePointer = window.matchMedia('(pointer: coarse)').matches
      } catch {
        /* matchMedia can throw in exotic embeds */
      }
    }
    gl = probeWebGL()
  } catch {
    /* signals are best-effort */
  }

  return { cores, memoryGB, gpu: gl.gpu, coarsePointer, mobileUA, webgl1: gl.webgl1, webgl2: gl.webgl2 }
}

/* ------------------------------- session cache ------------------------------- */

/**
 * The detected profile, read once per session (the GPU does not change
 * mid-game). The settings UI and the perf report read this; the test
 * hook can override the user's quality pick via __lklForceQuality.
 */
export interface DeviceProfile extends TierVerdict {
  preset: QualityPreset
  setting: QualitySetting
  /** the tier actually in force after the player's pick */
  effective: QualityTier
  gl: GlSupport
}

let cached: DeviceProfile | null = null

/** Internal: build a profile from explicit inputs (tests inject here). */
export function buildProfile(signals: DeviceSignals, setting: QualitySetting): DeviceProfile {
  const verdict = detectTier(signals)
  const effective = resolveQuality(setting, verdict.tier)
  return {
    tier: verdict.tier,
    reasons: verdict.reasons,
    preset: QUALITY_PRESETS[effective],
    setting,
    effective,
    gl: { webgl1: signals.webgl1, webgl2: signals.webgl2, gpu: signals.gpu },
  }
}

/** Read-or-build the session profile. `setting` comes from the live save. */
export function getDeviceProfile(setting: QualitySetting = 'auto'): DeviceProfile {
  if (cached && cached.setting === setting) return cached
  cached = buildProfile(readDeviceSignals(), setting)
  return cached
}

/** The player changed the quality pick — rebuild the profile against it. */
export function refreshDeviceProfile(setting: QualitySetting): DeviceProfile {
  cached = buildProfile(readDeviceSignals(), setting)
  return cached
}

/** Tests / storybook reset. */
export function resetDeviceProfile(): void {
  cached = null
}

/** One honest line for the perf report + settings UI. */
export function deviceLine(p: DeviceProfile): string {
  const gl = p.gl.webgl2 ? 'WebGL2' : p.gl.webgl1 ? 'WebGL1' : 'no WebGL'
  const gpu = p.gl.gpu ? p.gl.gpu.slice(0, 32) : 'gpu hidden'
  return `${p.effective.toUpperCase()} tier (${p.setting}) · ${gl} · ${gpu}${p.reasons.length ? ` · ${p.reasons[0]}` : ''}`
}
