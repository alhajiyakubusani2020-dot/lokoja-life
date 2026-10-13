/**
 * LOKOJA LIFE — Real-Device FPS Probe (M4 perf duty)
 * ---------------------------------------------------
 * Closes the honest gap flagged in the M2/M3 perf audits: SwiftShader
 * numbers are sub-1 fps software rasterization — the number that matters
 * is the one a REAL phone produces. This module runs everywhere
 * (production included), costs almost nothing (one rAF callback pushing
 * into a ring buffer, read 2×/second by the HUD chip), and produces a
 * shareable report string the player can copy out of the game.
 *
 * Pure measurement — never mutates game state, never touches the store.
 */

/* ------------------------------- renderer registry ------------------------------ */

/** Minimal slice of WebGLRenderer.info the report needs (no three import). */
export interface RendererSnapshot {
  drawCalls: number
  triangles: number
  programs: number
}

type GlLike = {
  info?: { render: { calls: number; triangles: number }; programs: { length: number } | null }
  getContext?: () => WebGLRenderingContext | WebGL2RenderingContext | null
  domElement?: HTMLCanvasElement
}

let renderer: GlLike | null = null

/** WorldScene calls this in onCreated — works in production, both tiers. */
export function setPerfRenderer(gl: unknown): void {
  renderer = (gl as GlLike) ?? null
}

export function clearPerfRenderer(): void {
  renderer = null
}

function readRendererSnapshot(): RendererSnapshot | null {
  if (!renderer?.info) return null
  return {
    drawCalls: renderer.info.render.calls,
    triangles: renderer.info.render.triangles,
    programs: renderer.info.programs?.length ?? 0,
  }
}

/* --------------------------------- frame sampler -------------------------------- */

const RING = 240 // ~8s at 30fps, ~4s at 60fps

const deltas = new Float32Array(RING)
let head = 0
let count = 0
let rafId: number | null = null
let last = 0

function tick(now: number): void {
  if (last > 0) {
    const dt = now - last
    if (dt > 0 && dt < 4000) {
      // ignore tab-suspend spikes — they are not rendering truth
      deltas[head] = dt
      head = (head + 1) % RING
      if (count < RING) count++
    }
  }
  last = now
  rafId = requestAnimationFrame(tick)
}

/** Begin sampling (idempotent). Runs until stopProbe() — the chip keeps one alive. */
export function startProbe(): void {
  if (rafId !== null || typeof window === 'undefined') return
  last = 0
  rafId = requestAnimationFrame(tick)
}

export function stopProbe(): void {
  if (rafId !== null) cancelAnimationFrame(rafId)
  rafId = null
  last = 0
}

export function probeRunning(): boolean {
  return rafId !== null
}

export interface FrameStats {
  /** average fps over the ring buffer */
  fps: number
  /** 95th-percentile frame time, ms (the stutter number) */
  p95ms: number
  /** worst frame in the buffer, ms */
  worstMs: number
  /** frames currently in the buffer */
  frames: number
}

/** Read the ring buffer — O(240) sort on a copy, called 2×/s at most. */
export function readFrameStats(): FrameStats | null {
  if (count < 5) return null // not enough evidence yet — honest null
  const xs = Array.from(deltas.subarray(0, count)).sort((a, b) => a - b)
  const total = xs.reduce((s, v) => s + v, 0)
  const p95 = xs[Math.min(xs.length - 1, Math.floor(xs.length * 0.95))]
  return {
    fps: 1000 / (total / xs.length),
    p95ms: p95,
    worstMs: xs[xs.length - 1],
    frames: count,
  }
}

/* ----------------------------------- the report --------------------------------- */

function gpuName(): string | null {
  try {
    const gl = renderer?.getContext?.() ?? null
    if (!gl) return null
    const dbg = gl.getExtension('WEBGL_debug_renderer_info')
    if (!dbg) return String(gl.getParameter(gl.RENDERER) ?? '') || null
    return String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) ?? '') || null
  } catch {
    return null
  }
}

/** One honest line about the device this run happened on. */
function deviceLine(): string {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { effectiveType?: string } }
  const mem = nav.deviceMemory ? `~${nav.deviceMemory}GB` : '?'
  const net = nav.connection?.effectiveType ?? '?'
  return `${window.innerWidth}x${window.innerHeight} @${window.devicePixelRatio.toFixed(2)}x · ${mem} RAM · net ${net}`
}

/**
 * Build the shareable report. Samples what the ring buffer holds right
 * now (the chip keeps it warm); fpsReport() in the E2E hook awaits a
 * fresh window first via sampleFor().
 */
export function buildReport(label = 'live'): string {
  const stats = readFrameStats()
  const snap = readRendererSnapshot()
  const gpu = gpuName()
  const lines = [
    `Lokoja Life — FPS report (${label})`,
    `when: ${new Date().toISOString()}`,
    `device: ${deviceLine()}`,
    `gpu: ${gpu ?? 'unknown'}`,
  ]
  if (stats) {
    lines.push(
      `fps: ${stats.fps.toFixed(1)} avg · p95 frame ${stats.p95ms.toFixed(0)}ms · worst ${stats.worstMs.toFixed(0)}ms (${stats.frames} frames)`,
    )
  } else {
    lines.push('fps: not enough frames sampled yet')
  }
  if (snap) {
    lines.push(`render: ${snap.drawCalls} draw calls · ${(snap.triangles / 1000).toFixed(0)}k tris · ${snap.programs} programs`)
  }
  lines.push(`ua: ${navigator.userAgent}`)
  return lines.join('\n')
}

/** Sample fresh frames for `ms`, then build the report (E2E + capture button). */
export function sampleFor(ms: number, label = `capture ${Math.round(ms / 1000)}s`): Promise<string> {
  startProbe()
  const before = count
  return new Promise((resolve) => {
    const t0 = performance.now()
    const poll = () => {
      if (performance.now() - t0 >= ms || count - before >= RING - 1) {
        resolve(buildReport(label))
        return
      }
      setTimeout(poll, 120)
    }
    setTimeout(poll, ms)
  })
}
