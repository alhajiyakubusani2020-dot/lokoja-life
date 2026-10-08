/**
 * LOKOJA LIFE — Travel System (Stage 2)
 * --------------------------------------
 * Pure, deterministic travel maths. The store calls these before moving
 * the player; UI reads plans for the confirmation sheet. Nothing here
 * mutates game state — application happens through store actions only.
 *
 * Every number comes from the central config (ECONOMY.transport, TRAVEL,
 * location.travelModifier) — no hard-coded fares or speeds.
 */

import { ECONOMY, TRAVEL } from '../data/config'
import type { LokojaLocation } from '../data/locations'
import { TRAVEL_EVENTS, type TravelEventDef } from '../data/travelEvents'
import type { TimeOfDay, TransportId, Weather } from '../types'
import { advanceWorldClock } from './world'

export interface TravelPlan {
  originId: string
  destinationId: string
  transport: TransportId
  /** straight-line map distance in km (for display) */
  distanceKm: number
  /** ₦ fare after distance pricing + rounding */
  cost: number
  /** minutes before weather/location modifiers */
  baseMinutes: number
  /** weather multiplier actually applied (1 = none) */
  weatherModifier: number
  /** final displayed minutes (weather × location modifiers applied) */
  minutes: number
  /** final energy cost (location modifier applied) */
  energyCost: number
  /** time slots this trip advances on the world clock */
  slots: number
  /** arrival slot on the existing world clock */
  arrival: { timeOfDay: TimeOfDay; dayDelta: number }
}

/** Straight-line distance between two locations in kilometres. */
export function mapDistanceKm(a: LokojaLocation, b: LokojaLocation): number {
  const dx = b.mapX - a.mapX
  const dy = b.mapY - a.mapY
  return Math.hypot(dx, dy) * TRAVEL.kmPerMapUnit
}

/**
 * Calculate a complete trip plan.
 * Deterministic for identical inputs — randomness lives ONLY in
 * rollTravelEvent(), which is explicitly configured.
 */
export function calculateTravel(
  origin: LokojaLocation,
  destination: LokojaLocation,
  transport: TransportId,
  weather: Weather,
  currentTimeOfDay: TimeOfDay,
): TravelPlan {
  const params = ECONOMY.transport[transport]
  const km = mapDistanceKm(origin, destination)
  const locationMod = destination.travelModifier ?? 1
  const weatherMod =
    TRAVEL.weatherMinutesMultiplier[weather]?.[transport] ?? 1

  // fare = base + distance rate, rounded to the configured naira step
  const rawFare = params.cost.base + params.cost.perKm * km
  const cost = Math.round(rawFare / TRAVEL.fareRounding) * TRAVEL.fareRounding

  // minutes: distance × speed × location × weather
  const baseMinutes = km * params.minutesPerKm
  const minutes = Math.max(1, Math.round(baseMinutes * locationMod * weatherMod))

  // energy: distance × rate × location modifier (walking uphill costs!)
  const energyCost = Math.max(1, Math.round(km * params.energyPerKm * locationMod))

  const slots = TRAVEL.slotsPerTrip
  const arrival = advanceWorldClock(currentTimeOfDay, 0, weather, slots)

  return {
    originId: origin.id,
    destinationId: destination.id,
    transport,
    distanceKm: km,
    cost,
    baseMinutes: Math.round(baseMinutes),
    weatherModifier: weatherMod,
    minutes,
    energyCost,
    slots,
    arrival: { timeOfDay: arrival.timeOfDay, dayDelta: arrival.day },
  }
}

/**
 * Roll for a travel event on a completed trip.
 * Returns null most of the time (no event). When an event hits, the pick
 * is weighted among events eligible for the current transport + weather.
 */
export function rollTravelEvent(
  transport: TransportId,
  weather: Weather,
): TravelEventDef | null {
  if (Math.random() >= TRAVEL.eventChance) return null

  const eligible = TRAVEL_EVENTS.filter((e) => {
    if (e.requiresWeather && !e.requiresWeather.includes(weather)) return false
    if (e.requiresTransport && !e.requiresTransport.includes(transport)) return false
    return true
  })
  if (eligible.length === 0) return null

  const total = eligible.reduce((sum, e) => sum + e.weight, 0)
  let roll = Math.random() * total
  for (const e of eligible) {
    roll -= e.weight
    if (roll <= 0) return e
  }
  return eligible[eligible.length - 1] ?? null
}
