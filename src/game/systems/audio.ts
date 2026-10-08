/**
 * LOKOJA LIFE — Audio Engine
 * ---------------------------
 * Lightweight synthesised sound (WebAudio, zero asset files) for the
 * small set of MVP sounds. Swappable later: Stage 9 can replace the
 * synth calls with sampled ambience (market, river) behind the same
 * `play(name)` interface, without touching UI code.
 *
 * Sounds: click, chime (money / reward), levelup, notify.
 */

import type { GameSettings } from '../types'

export type SoundName = 'click' | 'chime' | 'levelup' | 'notify'

class AudioEngine {
  private ctx: AudioContext | null = null
  private enabled = true

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  isEnabled() {
    return this.enabled
  }

  /** Lazily create the AudioContext on first user gesture (browser policy). */
  private ensureCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return null
      this.ctx = new Ctor()
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume()
    }
    return this.ctx
  }

  /**
   * Play a short synthesised tone sequence.
   * Failures are silently ignored — audio must never break gameplay.
   */
  play(name: SoundName) {
    if (!this.enabled) return
    try {
      const ctx = this.ensureCtx()
      if (!ctx) return

      const now = ctx.currentTime

      const sequences: Record<SoundName, Array<{ f: number; t: number; d: number; type: OscillatorType; g: number }>> = {
        // short soft tick
        click: [{ f: 660, t: 0, d: 0.05, type: 'triangle', g: 0.12 }],
        // pleasant two-note reward
        chime: [
          { f: 784, t: 0, d: 0.09, type: 'sine', g: 0.16 },
          { f: 1175, t: 0.09, d: 0.14, type: 'sine', g: 0.16 },
        ],
        // little fanfare
        levelup: [
          { f: 523, t: 0, d: 0.1, type: 'triangle', g: 0.14 },
          { f: 659, t: 0.1, d: 0.1, type: 'triangle', g: 0.14 },
          { f: 784, t: 0.2, d: 0.18, type: 'triangle', g: 0.16 },
        ],
        // gentle pop for notifications
        notify: [
          { f: 880, t: 0, d: 0.07, type: 'sine', g: 0.12 },
          { f: 660, t: 0.07, d: 0.1, type: 'sine', g: 0.1 },
        ],
      }

      for (const note of sequences[name]) {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = note.type
        osc.frequency.value = note.f
        gain.gain.setValueAtTime(note.g, now + note.t)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + note.t + note.d)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + note.t)
        osc.stop(now + note.t + note.d + 0.02)
      }
    } catch {
      // audio is best-effort; never crash the game for it
    }
  }
}

/** App-level singleton wired to the settings store. */
export const audio = new AudioEngine()

export function syncAudioWithSettings(settings: GameSettings) {
  audio.setEnabled(settings.sound)
}
