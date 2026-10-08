/**
 * LOKOJA LIFE — World Clock
 * --------------------------
 * THE single time/weather engine for the whole game (Stage 1 rest,
 * Stage 2 travel, future stages). No other system may advance the
 * clock — everything calls these helpers so time stays coherent.
 */

import { TIME } from '../data/config'
import type { TimeOfDay, Weather } from '../types'

/** Advance one time-of-day slot; returns new slot + day delta. */
export function nextSlot(t: TimeOfDay): { timeOfDay: TimeOfDay; dayDelta: number } {
  const idx = TIME.slots.indexOf(t)
  const next = TIME.slots[(idx + 1) % TIME.slots.length]
  return { timeOfDay: next, dayDelta: next === 'morning' ? 1 : 0 }
}

/** Pick a random weather for a new day, weighted by config. */
export function rollNewDayWeather(): Weather {
  const entries = Object.entries(TIME.weatherWeights) as Array<[Weather, number]>
  const total = entries.reduce((sum, [, w]) => sum + w, 0)
  let roll = Math.random() * total
  for (const [weather, weight] of entries) {
    roll -= weight
    if (roll <= 0) return weather
  }
  return 'sunny'
}

/** Night-time weather is always clear night. */
export function weatherForSlot(weather: Weather, timeOfDay: TimeOfDay): Weather {
  if (timeOfDay === 'night') return 'night-clear'
  if (weather === 'night-clear') return 'sunny'
  return weather
}

/**
 * Advance the clock by N slots — the one true clock-advancing function.
 * Used by rest, travel and every future time-consuming activity.
 */
export function advanceWorldClock(
  timeOfDay: TimeOfDay,
  day: number,
  weather: Weather,
  slots: number,
): { timeOfDay: TimeOfDay; day: number; weather: Weather } {
  let t = timeOfDay
  let d = day
  let w = weather
  for (let i = 0; i < Math.max(0, slots); i++) {
    const r = nextSlot(t)
    t = r.timeOfDay
    d += r.dayDelta
    w = weatherForSlot(w, t)
  }
  return { timeOfDay: t, day: d, weather: w }
}
