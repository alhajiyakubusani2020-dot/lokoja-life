/**
 * 100% Procedural Web Audio API sound synthesis for Lagos Life 3D.
 * No external .mp3/.wav files needed - zero 404 risk, instant playback.
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private radioGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  // Radio state
  private radioPlaying: boolean = false;
  private radioStation: number = 0; // 0: Confluence FM 94.0, 1: Mount Patti Radio, 2: River Niger Chill
  private radioTimer: number | null = null;
  private beatStep: number = 0;

  // Engine sound state
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private isEngineRunning: boolean = false;

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.radioGain = this.ctx.createGain();
      this.radioGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.radioGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    } catch {
      console.warn('Web Audio not supported');
    }
  }

  public ensureContext() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- SOUND EFFECTS ---

  public playDanfoHorn() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Classic Nigerian two-tone Danfo horn (Peep-peep)
    const tones = [
      { f1: 370, f2: 440, start: 0, dur: 0.18 },
      { f1: 370, f2: 440, start: 0.22, dur: 0.26 }
    ];

    tones.forEach(({ f1, f2, start, dur }) => {
      const osc1 = this.ctx!.createOscillator();
      const osc2 = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(f1, t + start);
      osc2.frequency.setValueAtTime(f2, t + start);

      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, t + start);

      g.gain.setValueAtTime(0.3, t + start);
      g.gain.exponentialRampToValueAtTime(0.001, t + start + dur);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(g);
      g.connect(this.sfxGain!);

      osc1.start(t + start);
      osc2.start(t + start);
      osc1.stop(t + start + dur);
      osc2.stop(t + start + dur);
    });
  }

  public playCashChime() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const notes = [587.33, 880, 1174.66, 1760]; // D5, A5, D6, A6 sparkle
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.06);

      g.gain.setValueAtTime(0.18, t + idx * 0.06);
      g.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.06 + 0.35);

      osc.connect(g);
      g.connect(this.sfxGain!);
      osc.start(t + idx * 0.06);
      osc.stop(t + idx * 0.06 + 0.36);
    });
  }

  public playFootstep() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.08);

    g.gain.setValueAtTime(0.1, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  public playSizzle() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200, this.ctx.currentTime);
    filter.Q.setValueAtTime(3, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start();
  }

  public playKeyboardType() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800 + Math.random() * 400, t);

    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.04);
  }

  // --- ENGINE AUDIO ---

  public updateEngineSound(speedRatio: number, isDriving: boolean) {
    if (!isDriving || this.isMuted) {
      if (this.isEngineRunning) {
        this.stopEngine();
      }
      return;
    }

    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;

    if (!this.isEngineRunning) {
      const t = this.ctx.currentTime;
      this.engineOsc = this.ctx.createOscillator();
      this.engineGain = this.ctx.createGain();

      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.setValueAtTime(65, t);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, t);

      this.engineGain.gain.setValueAtTime(0.08, t);

      this.engineOsc.connect(filter);
      filter.connect(this.engineGain);
      this.engineGain.connect(this.sfxGain);

      this.engineOsc.start();
      this.isEngineRunning = true;
    }

    if (this.engineOsc && this.engineGain) {
      const targetFreq = 55 + Math.min(speedRatio, 1.2) * 120;
      const targetGain = 0.07 + Math.min(speedRatio, 1.0) * 0.12;
      this.engineOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.08);
      this.engineGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.08);
    }
  }

  public stopEngine() {
    if (this.engineOsc) {
      try {
        this.engineOsc.stop();
        this.engineOsc.disconnect();
      } catch {
        // Ignored
      }
      this.engineOsc = null;
    }
    if (this.engineGain) {
      this.engineGain.disconnect();
      this.engineGain = null;
    }
    this.isEngineRunning = false;
  }

  // --- AFROBEAT PROCEDURAL RADIO ---

  public toggleRadio(): boolean {
    this.ensureContext();
    if (this.radioPlaying) {
      this.stopRadio();
      return false;
    } else {
      this.startRadio();
      return true;
    }
  }

  public setRadioStation(station: number) {
    this.radioStation = station % 3;
  }

  public getRadioStation(): number {
    return this.radioStation;
  }

  public isRadioOn(): boolean {
    return this.radioPlaying;
  }

  private startRadio() {
    if (!this.ctx || !this.radioGain) return;
    this.radioPlaying = true;
    this.beatStep = 0;
    this.scheduleNextBeat();
  }

  private stopRadio() {
    this.radioPlaying = false;
    if (this.radioTimer !== null) {
      window.clearTimeout(this.radioTimer);
      this.radioTimer = null;
    }
  }

  private scheduleNextBeat() {
    if (!this.radioPlaying || !this.ctx || !this.radioGain) return;

    // Afrobeats tempo ~108 BPM -> 16th note ~138ms
    const sixteenthDuration = 0.138;
    const now = this.ctx.currentTime;

    const stepInBar = this.beatStep % 16;
    const bar = Math.floor(this.beatStep / 16) % 4;

    if (this.radioStation === 0) {
      // Lagos FM 99.9: Afrobeats & Amapiano log-drum feel
      this.synthesizeAfrobeatPattern(now, stepInBar, bar);
    } else if (this.radioStation === 1) {
      // Fela Shrine Afrobeat: Driving polyrhythms, funk bass, brass stabs
      this.synthesizeFelaPattern(now, stepInBar, bar);
    } else {
      // Naija Chill Waves: Smooth rhodes chords & subtle shaker
      this.synthesizeChillPattern(now, stepInBar, bar);
    }

    this.beatStep++;
    const nextIntervalMs = sixteenthDuration * 1000;
    this.radioTimer = window.setTimeout(() => this.scheduleNextBeat(), nextIntervalMs);
  }

  private synthesizeAfrobeatPattern(t: number, step: number, bar: number) {
    if (!this.ctx || !this.radioGain) return;

    // Shaker / Hi-hat pattern on almost every 16th note with velocity swing
    if (step % 2 === 0 || step === 3 || step === 7 || step === 11) {
      this.playShaker(t, step % 4 === 2 ? 0.08 : 0.04);
    }

    // Classic Afrobeats kick & log drum on syncopated steps (0, 3, 6, 10, 12)
    if ([0, 3, 6, 10, 12].includes(step)) {
      this.playKick(t, 0.28);
    }

    // Rimshot / Snare on 4 and 12
    if (step === 4 || step === 12) {
      this.playRimshot(t, 0.15);
    }

    // Log-drum bass pitch variation (Amapiano/Afropop bassline)
    const bassline = [110, 110, 130.8, 146.83, 164.81, 130.8]; // A2, C3, D3, E3
    if ([0, 3, 6, 10, 14].includes(step)) {
      const noteFreq = bassline[(bar + step) % bassline.length];
      this.playSynthBass(t, noteFreq, 0.22);
    }

    // Chord pad stab on beat 2 and beat 4
    if (step === 4 || step === 10) {
      const chordRoots = [220, 261.63, 196, 246.94]; // Am - C - G - Bm
      const root = chordRoots[bar];
      this.playChord(t, [root, root * 1.25, root * 1.5], 0.25);
    }
  }

  private synthesizeFelaPattern(t: number, step: number, bar: number) {
    if (!this.ctx || !this.radioGain) return;

    // Afrobeat clave / bell rhythm: steps 0, 3, 6, 8, 10, 12, 14
    if ([0, 3, 6, 8, 10, 12, 14].includes(step)) {
      this.playAfroBell(t, 0.06);
    }

    // Driving four-on-the-floor kick with Afrobeat bounce
    if (step % 4 === 0) {
      this.playKick(t, 0.3);
    }

    // Funky guitar / clavinet skank on offbeats
    if (step === 2 || step === 6 || step === 10 || step === 14) {
      const felaRoots = [174.61, 196, 220, 196]; // F - G - A - G
      const r = felaRoots[bar];
      this.playBrassStab(t, [r, r * 1.2, r * 1.5], 0.12);
    }

    // Funky bassline
    if ([0, 2, 5, 8, 11, 13].includes(step)) {
      const bassNotes = [87.3, 98, 110, 98, 87.3, 110];
      this.playSynthBass(t, bassNotes[(step + bar) % bassNotes.length], 0.18);
    }
  }

  private synthesizeChillPattern(t: number, step: number, bar: number) {
    if (!this.ctx || !this.radioGain) return;

    if (step % 2 === 0) {
      this.playShaker(t, 0.03);
    }
    if (step === 0 || step === 10) {
      this.playKick(t, 0.18);
    }
    if (step === 8) {
      this.playRimshot(t, 0.08);
    }
    if (step === 0) {
      // Soft neo-soul/Afro-fusion Rhodes chord
      const chords = [
        [220, 261.63, 329.63, 392], // Am7
        [174.61, 220, 261.63, 329.63], // Fmaj7
        [196, 246.94, 293.66, 349.23], // G7
        [164.81, 196, 246.94, 293.66] // Em7
      ];
      this.playChord(t, chords[bar], 0.7);
    }
  }

  // --- SYNTH INSTRUMENTS ---

  private playKick(t: number, vol: number) {
    if (!this.ctx || !this.radioGain) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(42, t + 0.12);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
    osc.connect(g);
    g.connect(this.radioGain);
    osc.start(t);
    osc.stop(t + 0.14);
  }

  private playRimshot(t: number, vol: number) {
    if (!this.ctx || !this.radioGain) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(360, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.08);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(g);
    g.connect(this.radioGain);
    osc.start(t);
    osc.stop(t + 0.09);
  }

  private playShaker(t: number, vol: number) {
    if (!this.ctx || !this.radioGain) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(4500, t);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(6000 + Math.random() * 2000, t);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(filter);
    filter.connect(g);
    g.connect(this.radioGain);
    osc.start(t);
    osc.stop(t + 0.045);
  }

  private playAfroBell(t: number, vol: number) {
    if (!this.ctx || !this.radioGain) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1240, t);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    osc.connect(g);
    g.connect(this.radioGain);
    osc.start(t);
    osc.stop(t + 0.095);
  }

  private playSynthBass(t: number, freq: number, vol: number) {
    if (!this.ctx || !this.radioGain) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, t);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(filter);
    filter.connect(g);
    g.connect(this.radioGain);
    osc.start(t);
    osc.stop(t + 0.19);
  }

  private playChord(t: number, freqs: number[], dur: number) {
    if (!this.ctx || !this.radioGain) return;
    freqs.forEach(freq => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.06, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(g);
      g.connect(this.radioGain!);
      osc.start(t);
      osc.stop(t + dur);
    });
  }

  private playBrassStab(t: number, freqs: number[], dur: number) {
    if (!this.ctx || !this.radioGain) return;
    freqs.forEach(freq => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, t);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.08, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(filter);
      filter.connect(g);
      g.connect(this.radioGain!);
      osc.start(t);
      osc.stop(t + dur);
    });
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.7, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }
}

export const soundSystem = new SoundSystem();
