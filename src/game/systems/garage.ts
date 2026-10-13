/**
 * LOKOJA LIFE — Garage System (M4: THE GARAGE)
 * ---------------------------------------------
 * Pure, deterministic laws that connect the vehicles you OWN to the map
 * you TRAVEL. Before M4 a bought okada was a garage ornament: the 2D map
 * still charged keke fares. Now ownership is an economy:
 *
 *   • your rides appear as personal transport options (own-okada, …)
 *   • fuel replaces the fare — always cheaper than the public rate
 *   • every destination says which vehicles can physically reach it
 *     (a keke-accessible street takes okadas; only taxi roads take cars)
 *   • resale value depreciates deterministically from the buy day
 *
 * Nothing here mutates state — the store applies outcomes through its
 * own actions. Every constant traces to data/vehicles.ts or
 * data/config.ts ECONOMY.transport — no magic numbers.
 */

import { ECONOMY } from '../data/config'
import { VEHICLE_BY_MODEL } from '../data/vehicles'
import type { LokojaLocation } from '../data/locations'
import type { OwnedVehicle, PersonalTransportId, TransportId, VehicleModel } from '../types'
import { calculateTravel, type TravelPlan } from './travel'
import type { TimeOfDay, Weather } from '../types'

/* ------------------------------ model ⇄ transport ------------------------------ */

/** The personal transport id for a model: okada → 'own-okada'. */
export function personalTransportId(model: VehicleModel): PersonalTransportId {
  return `own-${model}` as PersonalTransportId
}

/** Inverse of personalTransportId — null for walk/keke/taxi. */
export function personalModelOf(t: TransportId): VehicleModel | null {
  if (!t.startsWith('own-')) return null
  return t.slice(4) as VehicleModel
}

/* ---------------------------------- access law --------------------------------- */

/**
 * Which public road class a personal vehicle needs. Bikes and tricycles
 * go anywhere a keke can reach (back streets included); cars and the
 * danfo need real car roads.
 */
const COUNTERPART: Record<VehicleModel, 'keke' | 'taxi'> = {
  okada: 'keke',
  keke: 'keke',
  taxi: 'taxi',
  danfo: 'taxi',
}

/** Can this owned vehicle physically reach this destination? */
export function canPersonalReach(destination: LokojaLocation, model: VehicleModel): boolean {
  return destination.transport.includes(COUNTERPART[model])
}

/** Public fare a personal ride replaces — the ownership saving is measurable. */
export function publicCounterpartId(model: VehicleModel): TransportId {
  return COUNTERPART[model]
}

/* -------------------------------- availability -------------------------------- */

/**
 * The personal transport options a player's garage actually offers,
 * gate-ordered to match the showroom (okada → keke → taxi → danfo).
 */
export function personalTransportsFor(vehicles: OwnedVehicle[]): PersonalTransportId[] {
  const owned = new Set(vehicles.map((v) => v.model))
  const order: VehicleModel[] = ['okada', 'keke', 'taxi', 'danfo']
  return order.filter((m) => owned.has(m)).map(personalTransportId)
}

/**
 * The ONE law the store and every sheet share: may this transport be
 * offered for this destination with this garage? Public modes follow the
 * location data; personal modes follow ownership + the access law.
 */
export function transportAllowed(
  destination: LokojaLocation,
  transport: TransportId,
  vehicles: OwnedVehicle[],
): boolean {
  const model = personalModelOf(transport)
  if (model === null) return destination.transport.includes(transport)
  return (
    vehicles.some((v) => v.model === model) && canPersonalReach(destination, model)
  )
}

/* ------------------------------- travel options ------------------------------- */

export interface TravelOption {
  transport: TransportId
  plan: TravelPlan
  /** true = your own ride (fuel law, not a fare) */
  personal: boolean
  /** display label — "Keke" or "Your Okada" */
  label: string
  emoji: string
}

/**
 * Every way to make this trip: the location's public modes plus the
 * rides this garage can send. Public modes keep their data order;
 * personal modes follow the garage order. Nothing is offered the store
 * would refuse — the same transportAllowed() law gates here.
 */
export function allTravelOptions(
  origin: LokojaLocation,
  destination: LokojaLocation,
  weather: Weather,
  timeOfDay: TimeOfDay,
  vehicles: OwnedVehicle[],
): TravelOption[] {
  const options: TravelOption[] = destination.transport.map((t) => {
    const params = ECONOMY.transport[t]
    return {
      transport: t,
      plan: calculateTravel(origin, destination, t, weather, timeOfDay),
      personal: false,
      label: params.label,
      emoji: params.emoji,
    }
  })
  for (const t of personalTransportsFor(vehicles)) {
    const model = personalModelOf(t)
    if (model === null || !canPersonalReach(destination, model)) continue
    const def = VEHICLE_BY_MODEL[model]
    options.push({
      transport: t,
      plan: calculateTravel(origin, destination, t, weather, timeOfDay),
      personal: true,
      label: `Your ${def.short}`,
      emoji: def.emoji,
    })
  }
  return options
}

/* ---------------------------------- resale law --------------------------------- */

/** Day-one resale: 62% of showroom. Depreciates 1.5%/day owned, floors at 35%. */
export function resaleValue(model: VehicleModel, boughtDay: number, today: number): number {
  const age = Math.max(0, today - boughtDay)
  const rate = Math.max(0.35, 0.62 - 0.015 * age)
  return Math.round((VEHICLE_BY_MODEL[model].price * rate) / 100) * 100
}
