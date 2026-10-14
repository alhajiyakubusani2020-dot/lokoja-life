/**
 * LOKOJA LIFE — Fleet System (M5: WORK & FLEET)
 * ----------------------------------------------
 * The Motor Park gig board: the rides you OWN from M4 become the work you
 * DO in M5. Passengers pay the counter fare for the trip (the public rate
 * everyone knows), you burn your own fuel (the M4 law guarantees fuel is
 * cheaper than that fare — the margin IS the business), and rain drives
 * the day's price up because misery pays.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: the board for (day, garage, level) is a pure
 *    function — same inputs, same gigs, reload-proof. The only persisted
 *    state is WHICH of today's gigs already ran (FleetState in the save).
 *  - Every naira traces to ECONOMY.transport + config FLEET — no magic
 *    numbers. Fuel reuses calculateTravel() so the pump can never disagree
 *    with the travel sheets.
 *  - Nothing here mutates state — the store applies outcomes.
 */

import { ECONOMY, FLEET, TRAVEL } from '../data/config'
import { LOCATIONS, LOCATION_BY_ID, type LokojaLocation } from '../data/locations'
import { canPersonalReach, publicCounterpartId } from './garage'
import { calculateTravel } from './travel'
import { weatherBlocksLocation, isRainSky } from './seasons'
import { civicHash } from './civic'
import type { OwnedVehicle, VehicleModel, Weather, FleetState } from '../types'

/* -------------------------------- the board -------------------------------- */

export interface GigDef {
  /** stable id: `gig-{day}-{model}-{i}` — doubles as the done-list key */
  id: string
  /** in-game day the gig belongs to (stale gigs fall off the board) */
  day: number
  /** which of your vehicles the run needs */
  model: VehicleModel
  /** destination location id — you drop the passenger there */
  toId: string
  /** what the passenger pays (counter fare × payout mult × rain premium) */
  payout: number
  /** your fuel for the run (the SAME law the travel sheets charge) */
  fuel: number
  /** energy the drive costs you */
  energyCost: number
  /** trip minutes for display */
  minutes: number
  /** straight-line km for display */
  distanceKm: number
  /** true when today's weather lifts the payout (rain runs pay more) */
  rainPremium: boolean
}

/** The gig's origin is always the Motor Park — that is where the passengers are. */
export const GIG_ORIGIN_ID = 'transport-area'

/**
 * Destinations a model can be hired to: real map locations the vehicle can
 * physically reach (keke-class roads for bikes/trikes, taxi roads for cars),
 * excluding the park itself, anything the player's level cannot enter —
 * a locked destination would strand the drop-off — and (M6) any location
 * today's weather closes: a flood day strands nobody at the riverfront.
 */
export function gigDestinationsFor(model: VehicleModel, level: number, weather?: Weather): LokojaLocation[] {
  return LOCATIONS.filter(
    (l) =>
      l.id !== GIG_ORIGIN_ID &&
      l.unlockLevel <= level &&
      canPersonalReach(l, model) &&
      !(weather && weatherBlocksLocation(weather, l.id)),
  )
}

/**
 * What the passenger pays for a hired run to `dest`: the PUBLIC counterpart
 * fare (base + perKm × km — the number the whole city knows) × the hired-run
 * multiplier, × the rain premium when the sky is open (M6: a storm or a
 * flood day stacks the rough-sky bonus on top — the harder the sky, the
 * fatter the pay). Rounded to the fare step so the board never shows
 * kobo-dust numbers.
 */
export function gigPayout(model: VehicleModel, dest: LokojaLocation, weather: Weather): number {
  const park = LOCATION_BY_ID[GIG_ORIGIN_ID]
  const km = Math.hypot(dest.mapX - park.mapX, dest.mapY - park.mapY) * TRAVEL.kmPerMapUnit
  const pub = ECONOMY.transport[publicCounterpartId(model)]
  const rain = isRainSky(weather) ? (FLEET.rainPayout[model] ?? 1) : 1
  const rough = isRainSky(weather) ? (FLEET.roughSkyBonus[weather] ?? 1) : 1
  const raw = (pub.cost.base + pub.cost.perKm * km) * FLEET.payoutMult * rain * rough
  return Math.round(raw / TRAVEL.fareRounding) * TRAVEL.fareRounding
}

/**
 * The day's board for one garage: FLEET.gigsPerModelPerDay offers per owned
 * vehicle, destinations picked by hash (distinct within a model), fully
 * priced against the CURRENT weather. Deterministic per (day, garage, level).
 */
export function gigBoard(day: number, vehicles: OwnedVehicle[], level: number, weather: Weather, fuelMult = 1): GigDef[] {
  const park = LOCATION_BY_ID[GIG_ORIGIN_ID]
  if (!park) return []
  const gigs: GigDef[] = []
  // showroom order keeps the board stable as the garage grows
  const order: VehicleModel[] = ['okada', 'keke', 'taxi', 'danfo']
  for (const model of order) {
    if (!vehicles.some((v) => v.model === model)) continue
    const dests = gigDestinationsFor(model, level, weather)
    if (dests.length === 0) continue
    let prevToId: string | null = null
    for (let i = 0; i < FLEET.gigsPerModelPerDay; i++) {
      // hash pick; when more than one destination exists, walk forward off
      // the PREVIOUS gig's destination so one model never double-books a run
      const h = civicHash('gig', day, model, i)
      let idx = h % dests.length
      if (prevToId !== null && dests.length > 1) {
        let tries = 0
        while (dests[idx].id === prevToId && tries < dests.length) {
          idx = (idx + 1) % dests.length
          tries++
        }
      }
      prevToId = dests[idx].id
      const dest = dests[idx]
      const plan = calculateTravel(park, dest, `own-${model}` as const, weather, 'morning', fuelMult)
      gigs.push({
        id: `gig-${day}-${model}-${i}`,
        day,
        model,
        toId: dest.id,
        payout: gigPayout(model, dest, weather),
        fuel: plan.cost,
        energyCost: plan.energyCost,
        minutes: plan.minutes,
        distanceKm: plan.distanceKm,
        rainPremium: isRainSky(weather),
      })
    }
  }
  return gigs
}

/** The board MINUS what you already ran today (the store's read for the UI). */
export function availableGigs(day: number, vehicles: OwnedVehicle[], level: number, weather: Weather, fleet: FleetState, fuelMult = 1): GigDef[] {
  const done = fleet.day === day ? fleet.done : []
  return gigBoard(day, vehicles, level, weather, fuelMult).filter((g) => !done.includes(g.id))
}

/** Human label for a gig — used by toasts and the ledger, one source. */
export function gigLabel(gig: GigDef): string {
  const dest = LOCATION_BY_ID[gig.toId]
  const VEHICLE_SHORT: Record<VehicleModel, string> = { okada: 'Okada', keke: 'Keke', taxi: 'Taxi', danfo: 'Danfo' }
  return `${VEHICLE_SHORT[gig.model]} run to ${dest?.name ?? gig.toId}`
}
