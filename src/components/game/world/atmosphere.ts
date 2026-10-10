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
    sunDir: [0.72, 0.5, 0.3],
    sunColor: '#ffd9a0',
    sunIntensity: 2.7,
    hemiSky: '#b8d4e4',
    hemiGround: '#a89468',
    hemiIntensity: 0.85,
    skyTop: '#6faed4',
    skyHorizon: '#f4e2b6',
    fogColor: '#e9dcc0',
    fogDensity: 0.0032,
    nightGlow: 0.05,
    stars: 0,
    showMoon: false,
  },
  afternoon: {
    sunDir: [0.25, 0.94, -0.2],
    sunColor: '#fff1d4',
    sunIntensity: 3.1,
    hemiSky: '#b4d8e8',
    hemiGround: '#a08e60',
    hemiIntensity: 1.0,
    skyTop: '#5ea8d6',
    skyHorizon: '#c8e4da',
    fogColor: '#d6e5d8',
    fogDensity: 0.0026,
    nightGlow: 0,
    stars: 0,
    showMoon: false,
  },
  evening: {
    sunDir: [-0.8, 0.26, 0.18],
    sunColor: '#ff9d58',
    sunIntensity: 2.3,
    hemiSky: '#c08a70',
    hemiGround: '#6a5240',
    hemiIntensity: 0.62,
    skyTop: '#58689e',
    skyHorizon: '#f0a462',
    fogColor: '#dfae80',
    fogDensity: 0.0042,
    nightGlow: 0.6,
    stars: 0.25,
    showMoon: false,
  },
  night: {
    sunDir: [-0.35, 0.72, -0.55],
    sunColor: '#a3b8e0',
    sunIntensity: 0.95,
    hemiSky: '#31416e',
    hemiGround: '#232c3c',
    hemiIntensity: 0.62,
    skyTop: '#0d1634',
    skyHorizon: '#243356',
    fogColor: '#1a2440',
    fogDensity: 0.0042,
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
