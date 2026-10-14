'use client'

/**
 * LOKOJA LIFE — PerfChip (M4: real-device FPS capture)
 * -----------------------------------------------------
 * A tiny live fps pill in the HUD's top-right column. Tap it and it
 * opens the diagnostics panel: live fps + p95 frame time, draw calls,
 * triangles, GPU name — and two honest buttons: CAPTURE (samples a
 * fresh 5-second window) and COPY REPORT (clipboard, with an execCommand
 * fallback for locked-down WebViews). The report is what a player on a
 * real phone sends back — the SwiftShader harness can never lie for them.
 *
 * Cost law: the chip re-renders 2×/s from the probe ring buffer — never
 * per frame, never through the store.
 */

import { useEffect, useRef, useState } from 'react'
import {
  buildReport,
  readFrameStats,
  sampleFor,
  startProbe,
  stopProbe,
} from '@/game/systems/perfProbe'
import { audio } from '@/game/systems/audio'

export function PerfChip() {
  const [open, setOpen] = useState(false)
  const [stats, setStats] = useState<{ fps: number; p95ms: number } | null>(null)
  const [report, setReport] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [capturing, setCapturing] = useState(false)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    startProbe()
    const id = setInterval(() => {
      const s = readFrameStats()
      if (mounted.current) setStats(s ? { fps: s.fps, p95ms: s.p95ms } : null)
    }, 500)
    return () => {
      mounted.current = false
      clearInterval(id)
      stopProbe()
    }
  }, [])

  const copy = async (text: string) => {
    let ok = false
    try {
      await navigator.clipboard.writeText(text)
      ok = true
    } catch {
      try {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        ok = document.execCommand('copy')
        document.body.removeChild(ta)
      } catch {
        ok = false
      }
    }
    if (mounted.current) {
      setCopied(ok)
      setTimeout(() => mounted.current && setCopied(false), 2200)
    }
  }

  const capture = async () => {
    audio.play('click')
    setCapturing(true)
    setReport(null)
    const r = await sampleFor(5000, 'manual capture 5s')
    if (!mounted.current) return
    setReport(r)
    setCapturing(false)
    audio.play('chime')
  }

  const tone =
    stats == null
      ? 'text-white/80'
      : stats.fps >= 50
        ? 'text-[#7dffa8]'
        : stats.fps >= 28
          ? 'text-[#ffd88a]'
          : 'text-[#ff9a7d]'

  return (
    <div className="pointer-events-auto flex flex-col items-end gap-1.5">
      {/* the pill — honest number, colour-coded, invisible cost */}
      <button
        data-testid="perf-chip"
        onClick={() => {
          audio.play('click')
          setOpen((o) => !o)
        }}
        aria-label="Performance diagnostics"
        className="lko-press flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-[10.5px] font-extrabold backdrop-blur-md"
      >
        <span className={`lko-num ${tone}`}>{stats ? `${Math.round(stats.fps)} fps` : '— fps'}</span>
      </button>

      {open && (
        <div
          data-testid="perf-panel"
          className="w-[228px] rounded-2xl border border-white/15 bg-black/70 p-3 text-white backdrop-blur-md"
        >
          <p className="text-[11px] font-extrabold uppercase tracking-wide text-[#ffd88a]">
            Real-device diagnostics
          </p>
          <div className="mt-1.5 space-y-0.5 text-[10.5px] font-semibold leading-snug text-white/85">
            <p className="lko-num">
              fps <b className={tone}>{stats ? stats.fps.toFixed(1) : '…'}</b>
              {stats && (
                <>
                  {' '}
                  · p95 {stats.p95ms.toFixed(0)}ms
                </>
              )}
            </p>
            <p className="opacity-80">Numbers are sampled live on THIS device.</p>
            {report && (
              <pre
                data-testid="perf-report"
                className="mt-1.5 max-h-28 overflow-y-auto whitespace-pre-wrap rounded-lg bg-white/10 p-1.5 text-[9px] leading-snug"
              >
                {report}
              </pre>
            )}
          </div>
          <div className="mt-2 flex gap-1.5">
            <button
              disabled={capturing}
              onClick={capture}
              className="lko-press h-8 flex-1 rounded-lg bg-[var(--lko-green)] text-[10.5px] font-extrabold text-white disabled:opacity-60"
            >
              {capturing ? 'Sampling…' : 'Capture 5s'}
            </button>
            <button
              disabled={!report}
              onClick={() => report && copy(report)}
              className="lko-press h-8 flex-1 rounded-lg bg-white/15 text-[10.5px] font-extrabold text-white disabled:opacity-40"
            >
              {copied ? 'Copied ✓' : 'Copy report'}
            </button>
          </div>
          <button
            onClick={() => {
              audio.play('click')
              setOpen(false)
            }}
            className="mt-1.5 w-full text-center text-[9.5px] font-bold uppercase tracking-wide text-white/60"
          >
            close
          </button>
        </div>
      )}
    </div>
  )
}
