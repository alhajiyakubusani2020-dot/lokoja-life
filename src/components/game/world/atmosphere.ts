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
  },
  evening: {
    // deep orange harmattan dusk — the whole town glows amber
    sunDir: [-0.85, 0.2, 0.2],
    sunColor: '#ff8c46',
    sunIntensity: 2.5,
    hemiSky: '#c28a68',
    hemiGround: '#6a5240',
    hemiIntensity: 0.66,
    skyTop: '#4a5690',
    skyHorizon: '#f09a52',
    fogColor: '#d9a478',
    fogDensity: 0.0048,
    nightGlow: 0.65,
    stars: 0.25,
    showMoon: false,
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
  } else if (weather === 'cloudy') {
    base.sunIntensity *= 0.68
    base.fogDensity *= 1.45
    base.fogColor = '#c2c9b8'
    base.skyTop = '#8a9a94'
    base.skyHorizon = '#c2c9b4'
    base.stars = 0
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
}
