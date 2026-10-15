/**
 * LOKOJA LIFE — World Ambience (INC 4)
 * -------------------------------------
 * Procedural WebAudio bed for the 3D world — zero asset files, in the
 * same spirit as audio.ts. Layers:
 *   • breeze   — filtered noise, always on outdoors (softer indoors)
 *   • river    — bandpassed noise, gain blended by river proximity
 *   • market   — low murmur, gain blended by market proximity
 *   • rain     — bright noise while the real weather says rain
 *   • birds    — scheduled chirp blips by day (outdoors)
 *   • crickets — pulsed high band at night
 *   • room     — faint indoor room tone while inside
 *   • horns    — traffic hum + stochastic horn stabs (M19, by the roads)
 *   • zinc     — bright rain-on-zinc-roof ticks while indoors in the rain (M19)
 *
 * update() is called from the HUD poll (throttled) with pure numbers;
 * nothing here touches game state. Failures are swallowed — audio can
 * never break gameplay.
 */

interface AmbienceParams {
  night: boolean
  rain: boolean
  indoors: boolean
  /** M19 — true while the walker is indoors during rain (bright zinc ticks) */
  rainIndoors?: boolean
  /** M19 — 0..1 proximity to roads/traffic (drives the horns layer + stabs) */
  traffic?: number
  /** 0..1 proximity blends (already computed by the caller) */
  river: number
  market: number
}

class WorldAmbience {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private layers: Partial<Record<'breeze' | 'river' | 'market' | 'rain' | 'room' | 'crickets' | 'horns' | 'zinc', GainNode>> = {}
  private birdTimer: ReturnType<typeof setTimeout> | null = null
  private hornTimer: ReturnType<typeof setTimeout> | null = null
  private started = false
  private enabled = true
  private last: AmbienceParams = { night: false, rain: false, indoors: false, river: 0, market: 0 }

  setEnabled(on: boolean) {
    this.enabled = on
    if (this.master && this.ctx) {
      try {
        this.master.gain.setTargetAtTime(on ? 1 : 0, this.ctx.currentTime, 0.2)
      } catch {
        /* ignore */
      }
    }
    if (!on) this.stop()
  }

  /** Build the graph lazily (must follow a user gesture — the world is entered by a tap). */
  start() {
    if (this.started || !this.enabled) return
    try {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return
      const ctx = new Ctor()
      this.ctx = ctx
      const master = ctx.createGain()
      master.gain.value = 0
      master.connect(ctx.destination)
      this.master = master

      // shared 2s looping noise buffer
      const len = ctx.sampleRate * 2
      const buf = ctx.createBuffer(1, len, ctx.sampleRate)
      const data = buf.getChannelData(0)
      let brown = 0
      for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1
        brown = (brown + 0.02 * white) / 1.02
        data[i] = white * 0.6 + brown * 2.2
      }

      const layer = (filterType: BiquadFilterType, freq: number, q: number, base: number): GainNode => {
        const src = ctx.createBufferSource()
        src.buffer = buf
        src.loop = true
        const filter = ctx.createBiquadFilter()
        filter.type = filterType
        filter.frequency.value = freq
        filter.Q.value = q
        const gain = ctx.createGain()
        gain.gain.value = base
        src.connect(filter)
        filter.connect(gain)
        gain.connect(master)
        src.start()
        return gain
      }

      this.layers.breeze = layer('lowpass', 320, 0.5, 0.045)
      this.layers.river = layer('bandpass', 850, 0.7, 0)
      this.layers.market = layer('lowpass', 480, 0.6, 0)
      this.layers.rain = layer('highpass', 1400, 0.4, 0)
      this.layers.room = layer('lowpass', 140, 0.5, 0)
      this.layers.crickets = layer('bandpass', 4400, 6, 0)
      this.layers.horns = layer('bandpass', 520, 2.5, 0)
      this.layers.zinc = layer('bandpass', 3200, 1.2, 0)

      // slow swell on the breeze — the wind breathes
      const lfo = ctx.createOscillator()
      lfo.frequency.value = 0.07
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 0.02
      lfo.connect(lfoGain)
      lfoGain.connect(this.layers.breeze.gain)
      lfo.start()

      // cricket pulse — amplitude tremolo on the high band (depth stays
      // small relative to the update()-set base so gain never goes wild)
      const cLfo = ctx.createOscillator()
      cLfo.type = 'square'
      cLfo.frequency.value = 16
      const cLfoGain = ctx.createGain()
      cLfoGain.gain.value = 0.012
      cLfo.connect(cLfoGain)
      cLfoGain.connect(this.layers.crickets.gain)
      cLfo.start()

      master.gain.setTargetAtTime(1, ctx.currentTime, 0.6)
      this.started = true
      this.scheduleBirds()
      this.scheduleHorns(buf)
    } catch {
      this.started = false
    }
  }

  stop() {
    if (this.birdTimer !== null) clearTimeout(this.birdTimer)
    this.birdTimer = null
    if (this.hornTimer !== null) clearTimeout(this.hornTimer)
    this.hornTimer = null
    try {
      this.ctx?.close()
    } catch {
      /* ignore */
    }
    this.ctx = null
    this.master = null
    this.layers = {}
    this.started = false
  }

  /** Throttled per-frame-ish blend from the HUD poll. */
  update(p: AmbienceParams) {
    // M19 fields default here so existing callers compile untouched
    const p2 = { rainIndoors: false, traffic: 0, ...p }
    this.last = p2
    const ctx = this.ctx
    if (!ctx || !this.started) return
    try {
      const t = ctx.currentTime
      const set = (g: GainNode | undefined, v: number, tc = 0.9) => {
        if (g) g.gain.setTargetAtTime(v, t, tc)
      }
      const outdoor = p2.indoors ? 0.25 : 1
      set(this.layers.breeze, p2.indoors ? 0.012 : 0.045)
      set(this.layers.river, Math.max(0, 1 - p2.river / 85) * 0.11 * outdoor)
      set(this.layers.market, Math.max(0, 1 - p2.market / 55) * 0.085 * outdoor)
      set(this.layers.rain, p2.rain ? 0.075 * (p2.indoors ? 0.4 : 1) : 0, 1.4)
      set(this.layers.room, p2.indoors ? 0.028 : 0, 1.2)
      set(this.layers.crickets, p2.night && !p2.indoors ? 0.032 : 0, 1.5)
      set(this.layers.horns, p2.traffic * 0.05 * outdoor)
      set(this.layers.zinc, p2.rainIndoors ? 0.05 : 0, 1.1)
    } catch {
      /* ignore */
    }
  }

  /** day-time bird chirps — 2-4 quick pitch-sliding blips, random interval */
  private scheduleBirds() {
    const tick = () => {
      this.birdTimer = setTimeout(tick, 2600 + Math.random() * 5200)
      const ctx = this.ctx
      if (!ctx || !this.started || !this.enabled) return
      if (this.last.night || this.last.indoors) return
      try {
        const now = ctx.currentTime
        const n = 2 + Math.floor(Math.random() * 3)
        const base = 2300 + Math.random() * 1900
        for (let i = 0; i < n; i++) {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          const t0 = now + i * (0.09 + Math.random() * 0.06)
          osc.frequency.setValueAtTime(base * (0.9 + Math.random() * 0.25), t0)
          osc.frequency.exponentialRampToValueAtTime(base * (1.25 + Math.random() * 0.3), t0 + 0.07)
          gain.gain.setValueAtTime(0.0001, t0)
          gain.gain.exponentialRampToValueAtTime(0.028, t0 + 0.02)
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.1)
          osc.connect(gain)
          gain.connect(this.master!)
          osc.start(t0)
          osc.stop(t0 + 0.13)
        }
      } catch {
        /* ignore */
      }
    }
    this.birdTimer = setTimeout(tick, 1800)
  }

  /**
   * M19 — traffic horns + zinc-roof rain ticks, one random 4-9s timer for
   * both. Horn stabs only with real traffic nearby and by day; the zinc
   * ticks only while the walker is indoors in the rain.
   */
  private scheduleHorns(buf: AudioBuffer) {
    const tick = () => {
      this.hornTimer = setTimeout(tick, 4000 + Math.random() * 5000)
      const ctx = this.ctx
      if (!ctx || !this.started || !this.enabled) return
      try {
        // zinc — a tiny 4ms white-noise tick, 30% per tick, 4-6kHz
        if (this.last.rainIndoors && Math.random() < 0.3 && this.master) {
          const now = ctx.currentTime
          const src = ctx.createBufferSource()
          src.buffer = buf
          const filter = ctx.createBiquadFilter()
          filter.type = 'bandpass'
          filter.frequency.value = 4000 + Math.random() * 2000
          filter.Q.value = 2
          const g = ctx.createGain()
          g.gain.setValueAtTime(0.02, now)
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.012)
          src.connect(filter)
          filter.connect(g)
          g.connect(this.master)
          src.start(now, Math.random() * 1.5, 0.004)
        }
        // horn stab — a short detuned saw pair, only with traffic close and by day
        const traffic = this.last.traffic ?? 0
        if (traffic <= 0.25 || this.last.night || !this.master) return
        const now = ctx.currentTime
        const base = 300 + Math.random() * 200
        const det = base * 0.02
        const g = ctx.createGain()
        g.gain.setValueAtTime(0.0001, now)
        g.gain.exponentialRampToValueAtTime(0.035 * traffic, now + 0.015)
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18)
        for (const f of [base - det / 2, base + det / 2]) {
          const osc = ctx.createOscillator()
          osc.type = 'sawtooth'
          osc.frequency.value = f
          osc.connect(g)
          osc.start(now)
          osc.stop(now + 0.2)
        }
        g.connect(this.master)
      } catch {
        /* ignore */
      }
    }
    this.hornTimer = setTimeout(tick, 2600)
  }
}

/** App-level singleton — the world mounts/unmounts it. */
export const ambience = new WorldAmbience()
