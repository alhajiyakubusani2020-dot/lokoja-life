/**
 * LOKOJA LIFE — Vehicle Catalog (Stage 5)
 * ----------------------------------------
 * What you can own and drive in the 3D world. Prices are calibrated to
 * the existing hustle/job economy (₦350–₦800 per hustle, jobs a few
 * thousand a shift) — an okada is a real mid-game goal, a danfo is a
 * late-game flex. All presentation (meshes, speed feel, sounds) lives
 * in the 3D layer; this file is pure data + purchase authority.
 */

import type { VehicleModel } from '../types'

export interface VehicleDef {
  model: VehicleModel
  label: string
  /** short display name — "Your Okada" rows on the map/travel sheets */
  short: string
  emoji: string
  /** 💰 showroom price */
  price: number
  /** one honest line — shown on the buy card */
  description: string
  /** top speed in world units/second (presentation tuning, 3D layer reads it) */
  topSpeed: number
  /** acceleration in units/s² (presentation tuning) */
  accel: number
  /** turn rate multiplier (presentation tuning) */
  handling: number
}

export const VEHICLES: VehicleDef[] = [
  {
    model: 'okada',
    label: 'Okada (Motorcycle)',
    short: 'Okada',
    emoji: '🏍️',
    price: 85_000,
    description: 'The people\'s engine. Slip through traffic, own the back streets.',
    topSpeed: 9.5,
    accel: 6.5,
    handling: 1.25,
  },
  {
    model: 'keke',
    label: 'Keke Napep (Tricycle)',
    short: 'Keke',
    emoji: '🛺',
    price: 180_000,
    description: 'Yellow-and-green hustle. Steady, honest, everywhere welcome.',
    topSpeed: 7.5,
    accel: 4.2,
    handling: 1.0,
  },
  {
    model: 'taxi',
    label: 'Taxi (Saloon Car)',
    short: 'Taxi',
    emoji: '🚕',
    price: 420_000,
    description: 'Four doors and a meter. Respect arrives before you do.',
    topSpeed: 11,
    accel: 5.0,
    handling: 0.9,
  },
  {
    model: 'danfo',
    label: 'Danfo (Minibus)',
    short: 'Danfo',
    emoji: '🚐',
    price: 750_000,
    description: 'A moving enterprise. When you buy this one, Lokoja knows your name.',
    topSpeed: 9,
    accel: 3.4,
    handling: 0.72,
  },
]

export const VEHICLE_BY_MODEL = Object.fromEntries(
  VEHICLES.map((v) => [v.model, v]),
) as Record<VehicleModel, VehicleDef>

/** Deterministic-ish plate generator — flavour only, not economy. */
export function generatePlate(model: VehicleModel, day: number, index: number): string {
  const letters = 'ABCDEFGHJKLMN'
  const l1 = letters[(day * 3 + index) % letters.length]
  const l2 = letters[(day * 7 + index * 5 + 4) % letters.length]
  const digits = 100 + ((day * 37 + index * 91) % 900)
  return `LKO-${digits}-${l1}${l2}`
}
