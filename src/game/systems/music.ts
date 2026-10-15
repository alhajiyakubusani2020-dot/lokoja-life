/**
 * LOKOJA LIFE — Procedural Afro-Fusion Soundtrack (M19)
 * ------------------------------------------------------
 * A synthesised soundtrack in the audio.ts spirit: WebAudio only, ZERO
 * asset files (the data-economy law). Four moods follow the day:
 *
 *   • morning   — bright highlife lift (lead an octave up, 108 bpm)
 *   • afternoon — steady market groove (100 bpm)
 *   • evening   — warm mid slowdown (92 bpm)
 *   • night     — lofi hush: softer gains, a lead that breathes (78 bpm)
 *
 * Everything is deterministic: the pattern for a (mood, bar) pair is a
 * PURE function seeded by a hash of both, so the same bar of the same
 * mood always plays the same music — testable with no AudioContext at
 * all (see patternFor()).
 *
 * House laws (audio.ts): failures silently swallowed, audio never
 * breaks gameplay, the AudioContext is created lazily after a user
 * gesture, and THE VOICE CAP — never more than MUSIC.maxVoices live
 * synth voices; when the cap binds the quietest layer drops first
 * (hat → shaker → lead). setIntensity() is the frame-stress governor's
 * extras-first hook: level 0 = bass+lead only, level 1 = no shaker,
 * level 2 = full kit.
 */

/* --------------------------------- exports --------------------------------- */

export type MusicMood = 'morning' | 'afternoon' | 'evening' | 'night'

export const MUSIC: {
  /** the pentatonic scale degrees (Hz base notes) the lead voice draws from */
  scaleHz: readonly number[]
  /** bpm per mood — morning bright highlife, night slow lofi */
  bpm: Readonly<Record<MusicMood, number>>
  /** hard cap on concurrent synth voices (THE AUDIO CAP LAW) */
  maxVoices: number
  /** scheduler lookahead window (s) and tick interval (ms) */
  lookaheadS: number
  tickMs: number
} = {
  scaleHz: [261.63, 293.66, 329.63, 392.0, 440.0], // C major pentatonic
  bpm: { morning: 108, afternoon: 100, evening: 92, night: 78 },
  maxVoices: 8,
  lookaheadS: 0.3,
  tickMs: 100,
}

/** one deterministic bar of afro-fusion — 16 sixteenth-steps */
export interface MusicPattern {
  kick: boolean[]
  hat: boolean[]
  /** Hz per step, 0 = rest — roots walk I–I–V–IV-style through the pentatonic */
  bass: number[]
  /** sparse kalimba notes; hz is always scaleHz × 0.5 | 1 | 2 */
  lead: { step: number; hz: number }[]
}

/* --------------------------- deterministic helpers ------------------------- */

/** mulberry32 — tiny deterministic PRNG (the world3d/layout.ts pattern) */
function makeRng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** FNV-1a — a stable string hash so (mood, bar) always seeds the same bar */
function hashSeed(s: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** root degrees per bar, counted inside the pentatonic itself: I–I–V–IV (C, C, A, G) */
const PROGRESSION = [0, 0, 4, 3]

/** per-mood playback softness — night is the lofi hush */
const MOOD_GAIN: Record<MusicMood, number> = { morning: 1.12, afternoon: 1, evening: 0.92, night: 0.7 }
/** lead rest probability — the melody breathes more as the day cools */
const LEAD_REST: Record<MusicMood, number> = { morning: 0.42, afternoon: 0.5, evening: 0.56, night: 0.68 }
/** seeded sixteenth-fill chance for hats */
const HAT_FILL: Record<MusicMood, number> = { morning: 0.28, afternoon: 0.2, evening: 0.16, night: 0.08 }

/* --------------------------------- engine ---------------------------------- */

class MusicEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private noiseBuf: AudioBuffer | null = null
  private bassFilter: BiquadFilterNode | null = null
  private hatFilter: BiquadFilterNode | null = null
  private shakerFilter: BiquadFilterNode | null = null
  private timer: ReturnType<typeof setInterval> | null = null
  private enabled = true
  private started = false
  private mood: MusicMood = 'morning'
  private intensity: 0 | 1 | 2 = 2
  private step = 0
  private nextNoteTime = 0
  private voiceEnds: number[] = []
  private liveVoices = 0
  private pat: MusicPattern | null = null
  private patBar = -1
  private patMood: MusicMood | null = null
  private patIntensity: 0 | 1 | 2 = 2

  setEnabled(on: boolean) {
    this.enabled = on
    if (!on) this.stop()
  }

  isEnabled() {
    return this.enabled
  }

  /** Lazy ctx creation (must follow a user gesture). Idempotent per mood; a mood change crossfades on the SAME ctx. */
  start(mood: MusicMood) {
    if (!this.enabled) return
    if (this.started) {
      if (mood !== this.mood) this.applyMood(mood)
      return
    }
    try {
      const ctx = this.ensureCtx()
      if (!ctx) return
      this.mood = mood
      const master = ctx.createGain()
      master.gain.value = 0
      master.connect(ctx.destination)
      this.master = master

      // shared noise — one buffer feeds hats + shaker, created once
      const len = Math.floor(ctx.sampleRate * 1.5)
      const buf = ctx.createBuffer(1, len, ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
      this.noiseBuf = buf

      // shared filters — no per-note filters where avoidable
      const bassFilter = ctx.createBiquadFilter()
      bassFilter.type = 'lowpass'
      bassFilter.frequency.value = 400
      bassFilter.connect(master)
      this.bassFilter = bassFilter
      const hatFilter = ctx.createBiquadFilter()
      hatFilter.type = 'highpass'
      hatFilter.frequency.value = 6000
      hatFilter.connect(master)
      this.hatFilter = hatFilter
      const shakerFilter = ctx.createBiquadFilter()
      shakerFilter.type = 'bandpass'
      shakerFilter.frequency.value = 2000
      shakerFilter.Q.value = 1.4
      shakerFilter.connect(master)
      this.shakerFilter = shakerFilter

      // fade in over ~1.2s, then let the grid roll
      master.gain.setValueAtTime(0, ctx.currentTime)
      master.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 1.2)
      this.step = 0
      this.nextNoteTime = ctx.currentTime + 0.12
      this.started = true
      this.timer = setInterval(() => this.tick(), MUSIC.tickMs)
    } catch {
      // audio is best-effort; never crash the game for it
    }
  }

  setMood(mood: MusicMood) {
    if (!this.started) {
      this.mood = mood
      return
    }
    if (mood !== this.mood) this.applyMood(mood)
  }

  stop() {
    if (this.timer !== null) clearInterval(this.timer)
    this.timer = null
    try {
      this.master?.disconnect()
    } catch {
      /* ignore */
    }
    try {
      void this.ctx?.close()
    } catch {
      /* ignore */
    }
    this.ctx = null
    this.master = null
    this.noiseBuf = null
    this.bassFilter = null
    this.hatFilter = null
    this.shakerFilter = null
    this.voiceEnds = []
    this.liveVoices = 0
    this.pat = null
    this.patBar = -1
    this.patMood = null
    this.started = false
  }

  isStarted() {
    return this.started
  }

  /** THE EXTRAS-FIRST hook — the frame-stress governor thins the music here before touching anything else. */
  setIntensity(level: 0 | 1 | 2) {
    this.intensity = level
  }

  /**
   * PURE — the deterministic pattern for one (mood, bar). No AudioContext,
   * no state, no side effects: the same arguments always return the same
   * music, so the tests can call this directly.
   */
  patternFor(mood: MusicMood, bar: number): MusicPattern {
    const rng = makeRng(hashSeed(mood + ':' + bar))
    const scale = MUSIC.scaleHz
    const kick: boolean[] = []
    const hat: boolean[] = []
    const bass: number[] = []
    const lead: { step: number; hz: number }[] = []
    // root for this bar — I–I–V–IV-style walk through the pentatonic
    const root = PROGRESSION[((bar % PROGRESSION.length) + PROGRESSION.length) % PROGRESSION.length]
    for (let i = 0; i < 16; i++) {
      // kick — the afro bedrock on 0/7/10, seeded ghost notes at the edges
      let k = i === 0 || i === 7 || i === 10
      if ((i === 3 || i === 13) && rng() < 0.3) k = true
      kick.push(k)
      // hats — off-beat eighths, seeded sixteenth fills (night barely fills)
      let h = i % 4 === 2
      if (!h && i % 2 === 0 && rng() < HAT_FILL[mood]) h = true
      hat.push(h)
      // bass — syncopated roots, mostly the bar's root, occasionally a step up
      let b = 0
      if (i === 0 || i === 3 || i === 6 || i === 8 || i === 11 || i === 14) {
        if (rng() > 0.12) {
          const deg = rng() < 0.18 ? (root + 1) % scale.length : root
          b = scale[deg] / 2
        }
      }
      bass.push(b)
      // lead — the kalimba breathes: seeded picks, rests allowed, ±1 octave only
      if (rng() > LEAD_REST[mood]) {
        const deg = Math.floor(rng() * scale.length) % scale.length
        const r = rng()
        let oct = 1
        if (mood === 'morning') oct = r < 0.7 ? 2 : 1
        else oct = r < 0.14 ? 2 : r < 0.88 ? 1 : 0.5
        lead.push({ step: i, hz: scale[deg] * oct })
      }
    }
    return { kick, hat, bass, lead }
  }

  /* ------------------------------ internals ------------------------------ */

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

  /** Mood change mid-play: old-pattern scheduling stops, the grid resets, the master ducks and rises. The ctx is reused, never closed. */
  private applyMood(mood: MusicMood) {
    this.mood = mood
    this.step = 0
    this.pat = null
    this.patBar = -1
    this.patMood = null
    const ctx = this.ctx
    if (!ctx || !this.master) return
    try {
      const now = ctx.currentTime
      this.nextNoteTime = Math.max(this.nextNoteTime, now + 0.1)
      const g = this.master.gain
      g.cancelScheduledValues(now)
      g.setTargetAtTime(0, now, 0.12)
      g.setTargetAtTime(0.14, now + 0.5, 0.3)
    } catch {
      /* ignore */
    }
  }

  /** ONE timer — schedules up to MUSIC.lookaheadS ahead on the 16th-note grid. */
  private tick() {
    try {
      const ctx = this.ctx
      if (!ctx || !this.started) return
      const now = ctx.currentTime
      // retire finished voices — the cap counts the LIVE ones
      if (this.voiceEnds.length > 0) {
        this.voiceEnds = this.voiceEnds.filter((e) => e > now)
        this.liveVoices = this.voiceEnds.length
      }
      if (typeof document !== 'undefined' && document.hidden) {
        // silent while hidden — the timer keeps running but nothing is
        // scheduled, and the grid never falls behind reality
        this.nextNoteTime = Math.max(this.nextNoteTime, now + 0.06)
        return
      }
      const horizon = now + MUSIC.lookaheadS
      let guard = 0
      while (this.nextNoteTime < horizon && guard < 32) {
        guard++
        const stepDur = 60 / MUSIC.bpm[this.mood] / 4
        const bar = Math.floor(this.step / 16)
        const inBar = this.step % 16
        this.triggerStep(this.nextNoteTime, bar, inBar)
        this.nextNoteTime += stepDur
        this.step++
      }
    } catch {
      // audio is best-effort; never crash the game for it
    }
  }

  /**
   * Trigger one 16th-step. The scheduling order IS the drop order: kick
   * and bass (the loud frame) claim cap slots first, so when the cap
   * binds the quiet layers — hat → shaker → lead — are the ones that
   * never start. THE VOICE CAP is never exceeded.
   */
  private triggerStep(t: number, bar: number, i: number) {
    if (bar !== this.patBar || this.mood !== this.patMood || !this.pat) {
      this.pat = this.patternFor(this.mood, bar)
      this.patBar = bar
      this.patMood = this.mood
      this.patIntensity = this.intensity // the governor's level is read per bar
    }
    const pat = this.pat
    const mg = MOOD_GAIN[this.mood]
    const cap = MUSIC.maxVoices
    if (pat.kick[i] && this.patIntensity >= 1 && this.liveVoices < cap) this.playKick(t, mg)
    const bassHz = pat.bass[i]
    if (bassHz > 0 && this.liveVoices < cap) this.playBass(t, bassHz, mg)
    for (const n of pat.lead) {
      if (n.step === i && this.liveVoices < cap) this.playLead(t, n.hz, mg)
    }
    // shaker — a steady off-beat tremolo, full kit only
    if (i % 4 === 2 && this.patIntensity >= 2 && this.liveVoices < cap) this.playShaker(t, mg)
    if (pat.hat[i] && this.patIntensity >= 1 && this.liveVoices < cap) this.playHat(t, mg)
  }

  private countVoice(end: number) {
    this.voiceEnds.push(end)
    this.liveVoices++
  }

  /** kick — sine 150→50Hz pitch drop, 0.12s */
  private playKick(t: number, mg: number) {
    const ctx = this.ctx
    if (!ctx || !this.master) return
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(150, t)
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.12)
    g.gain.setValueAtTime(0.55 * mg, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
    osc.connect(g)
    g.connect(this.master)
    osc.start(t)
    osc.stop(t + 0.14)
    this.countVoice(t + 0.14)
  }

  /** bass — triangle through the one shared lowpass (400Hz) */
  private playBass(t: number, hz: number, mg: number) {
    const ctx = this.ctx
    if (!ctx || !this.master || !this.bassFilter) return
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.value = hz
    g.gain.setValueAtTime(0.0001, t)
    g.gain.linearRampToValueAtTime(0.2 * mg, t + 0.02)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
    osc.connect(g)
    g.connect(this.bassFilter)
    osc.start(t)
    osc.stop(t + 0.32)
    this.countVoice(t + 0.32)
  }

  /** lead — kalimba/marimba feel: sine + 2nd harmonic at lower gain, short pluck decay */
  private playLead(t: number, hz: number, mg: number) {
    const ctx = this.ctx
    if (!ctx || !this.master) return
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = hz
    const harm = ctx.createOscillator()
    harm.type = 'sine'
    harm.frequency.value = hz * 2
    const hGain = ctx.createGain()
    hGain.gain.value = 0.35
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.16 * mg, t + 0.008)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.35)
    osc.connect(g)
    harm.connect(hGain)
    hGain.connect(g)
    g.connect(this.master)
    osc.start(t)
    harm.start(t)
    osc.stop(t + 0.38)
    harm.stop(t + 0.38)
    this.countVoice(t + 0.38)
  }

  /** hat — short white-noise burst through the one shared highpass (6kHz), quiet */
  private playHat(t: number, mg: number) {
    const ctx = this.ctx
    if (!ctx || !this.master || !this.hatFilter || !this.noiseBuf) return
    const src = ctx.createBufferSource()
    src.buffer = this.noiseBuf
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.06 * mg, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.03)
    src.connect(g)
    g.connect(this.hatFilter)
    src.start(t, Math.random() * 1.2)
    src.stop(t + 0.05)
    this.countVoice(t + 0.05)
  }

  /** shaker — bandpass noise (2kHz) with a two-bump tremolo "shake" envelope */
  private playShaker(t: number, mg: number) {
    const ctx = this.ctx
    if (!ctx || !this.master || !this.shakerFilter || !this.noiseBuf) return
    const src = ctx.createBufferSource()
    src.buffer = this.noiseBuf
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.linearRampToValueAtTime(0.045 * mg, t + 0.015)
    g.gain.linearRampToValueAtTime(0.012 * mg, t + 0.032)
    g.gain.linearRampToValueAtTime(0.04 * mg, t + 0.048)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.085)
    src.connect(g)
    g.connect(this.shakerFilter)
    src.start(t, Math.random() * 1.2)
    src.stop(t + 0.09)
    this.countVoice(t + 0.09)
  }
}

/** App-level singleton wired to the settings store. */
export const music = new MusicEngine()

/** The day bands share the mood names — this is the explicit hand-off. */
export function moodForTimeOfDay(t: 'morning' | 'afternoon' | 'evening' | 'night'): MusicMood {
  return t
}
