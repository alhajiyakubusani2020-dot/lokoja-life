/**
 * LOKOJA LIFE — Haptics (M19)
 * ---------------------------
 * Tiny vibration pulses for the moments that deserve one. THE HAPTIC
 * LAW: fire(event) calls navigator.vibrate at most ONCE per event,
 * guarded — desktop (no vibrate) is a no-op by nature, every failure is
 * swallowed, and Elder mode is structurally still (belt + braces: the
 * store also gates, but the engine refuses on its own). Zero timers,
 * zero state beyond two booleans — haptics can never break gameplay.
 */

export type HapticEvent = 'reward' | 'levelup' | 'arrival' | 'festival' | 'quest' | 'secret'

/** Vibration patterns in ms — exported so the tests assert them exactly. */
export const HAPTIC_PATTERNS: Readonly<Record<HapticEvent, number | number[]>> = {
  reward: 18,
  levelup: [30, 40, 60],
  arrival: [15, 30, 15],
  festival: [20, 30, 20, 30, 40],
  quest: [25, 25, 25],
  secret: [10, 20, 10, 20, 50],
}

class Haptics {
  private enabled = true
  private elder = false

  setEnabled(on: boolean) {
    this.enabled = on
  }

  isEnabled() {
    return this.enabled
  }

  /** Elder mode force-mutes REGARDLESS of enabled — the still hand law. */
  setElder(on: boolean) {
    this.elder = on
  }

  /**
   * Fire one haptic event — at most one navigator.vibrate call, guarded,
   * silent no-op anywhere vibration doesn't exist. Never throws.
   */
  fire(event: HapticEvent) {
    if (!this.enabled || this.elder) return
    try {
      if (typeof navigator === 'undefined') return
      if (typeof navigator.vibrate !== 'function') return
      navigator.vibrate(HAPTIC_PATTERNS[event])
    } catch {
      // haptics are best-effort; never crash the game for them
    }
  }
}

/** App-level singleton wired to the settings store. */
export const haptics = new Haptics()
