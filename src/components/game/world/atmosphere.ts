/**
 * LOKOJA LIFE — World Atmosphere (Stage 3D)
 * -------------------------------------------
 * Maps the REAL world clock (world.timeOfDay) + weather to lighting,
 * sky, fog and night-glow parameters. Pure derivation — no second
 * time system: if the store says "evening", Lokoja looks like evening.
 */

import type { TimeOfDay, Weather } from '@/game/types'

export interface AtmosphereParams {
  sunDir: [number, number, number]
  sunColor: string
  sunIntensity: number
  hemiSky: string
  hemiGround: string
  hemiIntensity: number
  skyTop: string
  skyHorizon: string
  fogColor: string
  fogDensity: number
  /** 0 = all windows/lamps dark, 1 = full night glow */
  nightGlow: number
  stars: number // 0..1 opacity
  showMoon: boolean
  /** M19 — the Confluence sunset band: 0 = none, 1 = the full viral-shot
   *  golden-magenta horizon glow (clear evening only; rain families strip it) */
  sunsetBand: number
}

const KEYFRAMES: Record<TimeOfDay, AtmosphereParams> = {
  morning: {
    // golden Harmattan sunrise — long warm light across the savanna
    sunDir: [0.74, 0.42, 0.32],
    sunColor: '#ffce8a',
    sunIntensity: 2.9,
    hemiSky: '#a9cbe4',
    hemiGround: '#b29468',
    hemiIntensity: 0.88,
    skyTop: '#5fa3d4',
    skyHorizon: '#f2d9a4',
    fogColor: '#e8d5ae',
    fogDensity: 0.0036,
    nightGlow: 0.04,
    stars: 0,
    showMoon: false,
    sunsetBand: 0.35, // M19 — the sunrise carries a soft gold band
  },
  afternoon: {
    // high hot light, but gently warm — never flat white
    sunDir: [0.25, 0.94, -0.2],
    sunColor: '#fff2d0',
    sunIntensity: 3.2,
    hemiSky: '#b4d8e8',
    hemiGround: '#a68e5c',
    hemiIntensity: 1.05,
    skyTop: '#4f9fd8',
    skyHorizon: '#cfe4d4',
    fogColor: '#d8e4d0',
    fogDensity: 0.0028,
    nightGlow: 0,
    stars: 0,
    showMoon: false,
    sunsetBand: 0,
  },
  evening: {
    // M19 — THE CONFLUENCE SUNSET, the viral shot: the Niger turns liquid
    // amber, the horizon burns rose-gold under the harmattan haze, and the
    // whole town glows like the inside of a lantern.
    sunDir: [-0.85, 0.16, 0.26],
    sunColor: '#ff7e3c',
    sunIntensity: 2.75,
    hemiSky: '#c98d5e',
    hemiGround: '#6a4c38',
    hemiIntensity: 0.62,
    skyTop: '#3f4a8e',
    skyHorizon: '#ff9a4e',
    fogColor: '#e09a5e',
    fogDensity: 0.0050,
    nightGlow: 0.65,
    stars: 0.25,
    showMoon: false,
    sunsetBand: 1,
  },
  night: {
    // deep blue night; sodium streetlight pools + lit windows carry the town
    sunDir: [-0.35, 0.72, -0.55],
    sunColor: '#8fa8dc',
    sunIntensity: 0.8,
    hemiSky: '#2c3a62',
    hemiGround: '#222a38',
    hemiIntensity: 0.6,
    skyTop: '#0a1230',
    skyHorizon: '#1e2c50',
    fogColor: '#161f3a',
    fogDensity: 0.0046,
    nightGlow: 1,
    stars: 1,
    showMoon: true,
    sunsetBand: 0,
  },
}

export function getAtmosphere(timeOfDay: TimeOfDay, weather: Weather): AtmosphereParams {
  const base = { ...KEYFRAMES[timeOfDay] }

  if (weather === 'rain') {
    base.sunIntensity *= 0.4
    base.hemiIntensity *= 0.8
    base.fogDensity *= 2.1
    base.fogColor = '#9aa89e'
    base.skyTop = '#6a7a76'
    base.skyHorizon = '#9aa89a'
    base.nightGlow = Math.max(base.nightGlow, 0.45)
    base.stars = 0
    base.sunsetBand = 0 // M19 — rain owns the horizon
  } else if (weather === 'cloudy') {
    base.sunIntensity *= 0.68
    base.fogDensity *= 1.45
    base.fogColor = '#c2c9b8'
    base.skyTop = '#8a9a94'
    base.skyHorizon = '#c2c9b4'
    base.stars = 0
    base.sunsetBand *= 0.3 // M19 — the band survives, dulled
  } else if (weather === 'harmattan') {
    // M6 — the Sahara's dust rides the dry season: a pale ochre wash, the
    // sun a dim orange coin, visibility cut hard. The city feels muffled.
    base.sunIntensity *= 0.62
    base.sunColor = '#e8a45e'
    base.hemiIntensity *= 0.9
    base.fogDensity *= 2.6
    base.fogColor = '#d9c09a'
    base.skyTop = '#b7a37e'
    base.skyHorizon = '#e3cda4'
    base.stars = 0
    // M19 — harmattan SUNSETS are the famous ones: dust scatters the band
    // wider and redder. Harmattan mornings keep their soft gold.
    base.sunsetBand = Math.max(base.sunsetBand, timeOfDay === 'evening' ? 1 : 0.2)
  } else if (weather === 'storm') {
    // M6 — a confluence thunderstorm: rain turned to eleven. Near-dark
    // noon, green-grey sky, the town's windows fighting back.
    base.sunIntensity *= 0.24
    base.hemiIntensity *= 0.7
    base.fogDensity *= 2.9
    base.fogColor = '#6e7d78'
    base.skyTop = '#3c4a4a'
    base.skyHorizon = '#77857c'
    base.nightGlow = Math.max(base.nightGlow, 0.55)
    base.stars = 0
    base.sunsetBand = 0
  } else if (weather === 'flood') {
    // M6 — flood watch: the rivers own the day. Heavy grey-green veil,
    // soaked light, the town holding its breath.
    base.sunIntensity *= 0.32
    base.hemiIntensity *= 0.74
    base.fogDensity *= 2.4
    base.fogColor = '#7d8a80'
    base.skyTop = '#44524e'
    base.skyHorizon = '#8a9488'
    base.nightGlow = Math.max(base.nightGlow, 0.5)
    base.stars = 0
    base.sunsetBand = 0
  } else if (weather === 'night-clear' && timeOfDay === 'night') {
    base.stars = 1
  }

  return base
}

/** normalised sun direction vector */
export function sunVec(dir: [number, number, number]): [number, number, number] {
  const len = Math.hypot(dir[0], dir[1], dir[2]) || 1
  return [dir[0] / len, dir[1] / len, dir[2] / len]
}

/* ------------------------- live shared state (mutable) ------------------------ */

/**
 * The atmosphere controller writes here every frame; materials that are
 * expensive to re-render through React (instanced window emissives, lamp
 * glow) read from it instead — one shared mutable, zero React churn.
 */
export const atmoLive = {
  nightGlow: 0,
  fogColor: '#d6e5d8' as string,
  /** M19 — the eased sunset-band strength (sky shader reads it) */
  sunsetBand: 0,
  /** M19 — 0..1 flood presence for the water veil (weather==='flood' eases in) */
  flood: 0,
  /** M19 — the live weather string (polish layers read without React) */
  weather: 'sunny' as Weather,
}
