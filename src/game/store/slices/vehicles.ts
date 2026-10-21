/**
 * VEHICLES SLICE — moved VERBATIM from useGameStore.ts (PH2.5 god-store split).
 * Source lines: 1254-1254, 1915-1996, 1998-2163, 3476-3484.
 * Zero logic changes — this file only re-homes the original object members
 * (state initializers + actions) into one zustand slice of the composed store.
 */
import type { StateCreator } from 'zustand'
import type { GameStore, VehiclesSlice } from '../types'
// PH2.5: lazy wire — the socket.io client (src/game/systems/wire.ts) used to ride
// this module statically, which dragged it (and engine.io) into the menu's
// first-load game-core chunk. The DMV sync below is the ONLY wire use site in
// the store; the module now loads on demand through loadWire(). Type imports
// stay static where needed.
let wireP: Promise<typeof import('../../systems/wire')> | null = null
const loadWire = () => (wireP ??= import('../../systems/wire'))
import {
  WORK,
  WORLD3D,
  CHILL,
  FLEET,
} from '../../data/config'
import { LOCATION_BY_ID } from '../../data/locations'
import { VEHICLE_BY_MODEL, generatePlate } from '../../data/vehicles'
import { audio } from '../../systems/audio'
import { fuelMultFor } from '../../systems/chaos'
import { canAfford } from '../../systems/economy'
import { gigBoard, gigLabel } from '../../systems/fleet'
import { resaleValue } from '../../systems/garage'
import { haptics } from '../../systems/haptics'
import { applyNeedsDelta, applySlotDecay } from '../../systems/needs'
import { formatNaira } from '../../systems/progression'
import { plateOk, paintOk } from '../../systems/wheels'
import { advanceWorldClock } from '../../systems/world'
import {
  scheduleAutosave,
  commitCivicDays,
  bumpOnboarding,
} from '../shared'
import type { OwnedVehicle } from '../../types'

export const vehiclesSlice: StateCreator<GameStore, [], [], VehiclesSlice> = (set, get) => ({
  fleet: { day: 1, done: [] },

  runGig: (gigId) => {
    const { player, world, fleet, isWorking, isTravelling } = get()
    if (!player || !world || isWorking || isTravelling) return false

    const gig = gigBoard(world.day, player.vehicles, player.level, world.weather, fuelMultFor(world.day), get().calendar).find((g) => g.id === gigId)
    if (!gig) return false
    if (fleet.day === world.day && fleet.done.includes(gigId)) {
      get().notify({ icon: '🛵', text: 'You don run this one today — tomorrow get their own runs.', tone: 'neutral' })
      return false
    }
    if (world.currentLocation !== 'transport-area') {
      get().notify({ icon: '📍', text: 'The passengers dey wait at the Motor Park — travel come first.', tone: 'bad' })
      return false
    }
    if (player.needs.energy < gig.energyCost) {
      get().notify({ icon: '🥵', text: 'You are too tired for that run. Rest small first.', tone: 'bad' })
      return false
    }

    const label = gigLabel(gig)
    set({ isWorking: true, workingLabel: `Driving — ${label}` })

    const applyDone = () => {
      const { player: p, world: w } = get()
      if (!p || !w) return

      // fuel first — the pump does not take promises
      const fueled = get().removeMoney(gig.fuel, {
        label: `Fuel — ${label.split(' run ')[0]} (gig)`,
        category: 'transport',
      })
      if (!fueled) {
        set({ isWorking: false, workingLabel: null })
        get().notify({ icon: '💸', text: `The run needs ${formatNaira(gig.fuel)} fuel and your pocket no carry am.`, tone: 'bad' })
        return
      }
      // the passenger's fare — honest hustle income the KGIRS can see
      get().addMoney(gig.payout, { label: `Gig — ${label}`, category: 'hustle' })

      const paid = get().player!
      const needs = applySlotDecay(applyNeedsDelta(paid.needs, { energy: -gig.energyCost }), 1, get().settings.chill ? CHILL.decayMult : 1)
      const clock = advanceWorldClock(w.timeOfDay, w.day, w.weather, 1)
      const nextFleet = { day: w.day, done: [...(get().fleet.day === w.day ? get().fleet.done : []), gig.id] }

      set({
        player: {
          ...paid,
          needs,
          stats: { ...paid.stats, jobsCompleted: paid.stats.jobsCompleted + 1 },
        },
        world: { ...w, currentLocation: gig.toId, ...clock },
        fleet: nextFleet,
        isWorking: false,
        workingLabel: null,
        offers: [], // left the park — unclaimed gist goes cold
      })

      get().addXp(FLEET.gigXp)
      get().addSkillXp('hustle', FLEET.gigHustleXp)
      get().notify({
        icon: '🛵',
        text: `${label} done — passenger paid ${formatNaira(gig.payout)}${gig.rainPremium ? ' (rain price)' : ''}, fuel chop ${formatNaira(gig.fuel)}.`,
        tone: 'good',
      })
      get().notify({
        icon: '📍',
        text: `You drop the passenger at ${LOCATION_BY_ID[gig.toId]?.name ?? 'the drop-off'}.`,
        tone: 'neutral',
      })
      // M9 — the run lands on the daily goals + the onboarding arc
      get().bumpGoal('gig')
      bumpOnboarding(get, set, 'work')
      // a run can cross midnight — the civic mesh follows the day
      commitCivicDays(get, set, w.day, clock.day)
      audio.play('chime')
      haptics.fire('reward')
      scheduleAutosave(get)
    }

    setTimeout(applyDone, WORK.transitionMs)
    return true
  },

  /* ------------------ Stage 5 — ownership, bank, social ------------------ */

  buyVehicle: (model) => {
    const { player, world } = get()
    if (!player || !world) return false
    const def = VEHICLE_BY_MODEL[model]
    if (!def) return false
    if (player.vehicles.some((v) => v.model === model)) {
      get().notify({
        icon: def.emoji,
        text: `You already own a ${def.label}. One per model — garage space na premium.`,
        tone: 'neutral',
      })
      return false
    }
    if (!canAfford(player.cash, def.price)) {
      get().notify({
        icon: '💰',
        text: `${def.label} costs ${formatNaira(def.price)}. Keep pushing — e go reach.`,
        tone: 'bad',
      })
      return false
    }
    const vehicle: OwnedVehicle = {
      id: `${model}-${world.day}-${player.vehicles.length + 1}`,
      model,
      plate: generatePlate(model, world.day, player.vehicles.length),
      boughtDay: world.day,
    }
    const ok = get().removeMoney(def.price, {
      label: `${def.label} (${vehicle.plate})`,
      category: 'shop',
    })
    if (!ok) return false
    const paid = get().player
    if (!paid) return false
    set({ player: { ...paid, vehicles: [...paid.vehicles, vehicle] } })
    get().notify({
      icon: def.emoji,
      text: `Congratulations! ${def.label} na yours — plate ${vehicle.plate}.`,
      tone: 'good',
    })
    audio.play('levelup')
    haptics.fire('levelup')
    scheduleAutosave(get)
    return true
  },

  /* W10-c — THE METERS' ONE WRITER: the tank and the condition wear the
   * disk's truth (the hello readback + the pump/garage acks write here;
   * the pure burn math lives in wheels.ts). Additive fields — the save
   * carries them without a version bump, exactly like paint did. */
  patchVehicleMeters: (model, patch) => {
    const player = get().player
    if (!player) return
    if (!player.vehicles.some((v) => v.model === model)) return
    set({
      player: {
        ...player,
        vehicles: player.vehicles.map((v) =>
          v.model === model
            ? {
                ...v,
                ...(patch.fuel !== undefined ? { fuel: patch.fuel } : {}),
                ...(patch.condition !== undefined ? { condition: patch.condition } : {}),
              }
            : v,
        ),
      },
    })
  },

  /* W10 — THE WHEELS' FACE: the garage paints and plates through the SAME
   * laws the wire door runs (zero copies — an invented colour or a bad
   * plate refuses before it ever reaches the street). W10-b: the patch
   * also RIDES TO THE WIRE — the DMV door is the server's own eye (the
   * plate uniqueness wall); a refusal REVERTS the local face so the save
   * never disagrees with the disk. */
  setVehicleStyle: (vehicleId, style) => {
    const player = get().player
    if (!player) return false
    const vehicle = player.vehicles.find((v) => v.id === vehicleId)
    if (!vehicle) return false
    if (style.plate !== undefined && !plateOk(style.plate.toUpperCase())) {
      get().notify({
        icon: '🚫',
        text: 'Plate na 4–10 characters — letters, numbers and dash only.',
        tone: 'bad',
      })
      return false
    }
    if (style.paint !== undefined && !paintOk(vehicle.model, style.paint)) {
      get().notify({ icon: '🎨', text: 'That colour no dey the book for this ride.', tone: 'bad' })
      return false
    }
    const prevPaint = vehicle.paint ?? ''
    const prevPlate = vehicle.plate
    const paint = style.paint !== undefined ? style.paint : (vehicle.paint ?? '')
    const plate = style.plate !== undefined ? style.plate.toUpperCase() : vehicle.plate
    set({
      player: {
        ...player,
        vehicles: player.vehicles.map((v) => (v.id === vehicleId ? { ...v, paint, plate } : v)),
      },
    })
    const def = VEHICLE_BY_MODEL[vehicle.model]
    get().notify({ icon: def.emoji, text: `${def.short} done — plate ${plate}. The street go see am.`, tone: 'good' })
    scheduleAutosave(get)
    // W10-b — THE DMV SYNC: claimed + live only, fire-and-forget; the ack's
    // refusal reverts the local face (the disk is the court of final appeal)
    // PH2.5: lazy wire — the socket.io client loads on demand. The only
    // behavioral consequence: the 'live' check and the send run one import-
    // resolution later than the static import did; the revert-on-refusal
    // law and the fire-and-forget shape are unchanged.
    const { token } = get().account
    if (token) {
      void loadWire()
        .then((wire) => {
          if (wire.useWireStore.getState().state !== 'live') return
          return wire.wireSendVehiclePatch(vehicle.model, {
            ...(style.paint !== undefined ? { paint } : {}),
            ...(style.plate !== undefined ? { plate } : {}),
          })
            .then((r) => {
              if (r.ok) return
              const cur = get().player
              if (!cur) return
              set({
                player: {
                  ...cur,
                  vehicles: cur.vehicles.map((v) =>
                    v.id === vehicleId ? { ...v, paint: prevPaint, plate: prevPlate } : v,
                  ),
                },
              })
              const why =
                r.why === 'plate-taken'
                  ? 'DMV: that plate don belong to another motor — pick another.'
                  : r.why === 'bad-plate'
                    ? 'DMV: the plate no follow the law.'
                    : 'DMV no gree — the old face stands.'
              get().notify({ icon: '🚫', text: why, tone: 'bad' })
              scheduleAutosave(get)
            })
        })
        .catch(() => {
          /* the wire hiccuped — the local face stands, the next hello reconciles */
        })
    }
    return true
  },

  sellVehicle: (vehicleId) => {
    const { player, world } = get()
    if (!player || !world) return false
    const vehicle = player.vehicles.find((v) => v.id === vehicleId)
    if (!vehicle) return false
    const def = VEHICLE_BY_MODEL[vehicle.model]
    const value = resaleValue(vehicle.model, vehicle.boughtDay, world.day)
    set({ player: { ...player, vehicles: player.vehicles.filter((v) => v.id !== vehicleId) } })
    get().addMoney(value, {
      label: `Sold ${def.short} (${vehicle.plate})`,
      category: 'other',
    })
    get().notify({
      icon: def.emoji,
      text: `${def.short} sold for ${formatNaira(value)}. The park sabi your price.`,
      tone: 'neutral',
    })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  settleDrive: (meters) => {
    const { player } = get()
    if (!player || meters <= 0) return
    const cost = Math.min(4, (meters / 1000) * WORLD3D.driveEnergyPerKm)
    if (cost < 0.5) return
    const needs = applyNeedsDelta(player.needs, { energy: -Math.round(cost * 10) / 10 })
    set({ player: { ...player, needs } })
    scheduleAutosave(get)
  },
})
