/**
 * LOKOJA LIFE — Travel Events
 * ----------------------------
 * Small flavour occurrences that can roll during any completed trip
 * (Stage 2). This is the seed of the reusable event framework — Stage 3's
 * hustle/opportunity system and Stage 5's gist system will extend this
 * same shape with their own catalogues.
 *
 * Rules:
 *  - effects are small and configured here, never hard-coded in UI
 *  - `requiresWeather` / `requiresTransport` gate eligibility
 *  - `weight` drives the weighted random pick
 */

import type { TransportId, Weather } from '../types'

export interface TravelEventDef {
  id: string
  icon: string
  title: string
  description: string
  tone: 'good' | 'bad' | 'neutral'
  /** relative likelihood among eligible events */
  weight: number
  /** only rolls in this weather (omit = any weather) */
  requiresWeather?: Weather[]
  /** only rolls with this transport (omit = any transport) */
  requiresTransport?: TransportId[]
  /** minutes added to the displayed trip time */
  extraMinutes?: number
  /** applied to energy (negative costs more) */
  energyDelta?: number
  /** applied to cash (positive = small gain, e.g. a tip) */
  cashDelta?: number
  /** applied to mood */
  moodDelta?: number
  /** applied to XP */
  xpDelta?: number
}

export const TRAVEL_EVENTS: TravelEventDef[] = [
  {
    id: 'rain-delay',
    icon: '🌧️',
    title: 'Rain on the road',
    description: 'Rain started while you were travelling. You sheltered small before continuing.',
    tone: 'bad',
    weight: 3,
    requiresWeather: ['rain'],
    extraMinutes: 10,
    energyDelta: -2,
  },
  {
    id: 'traffic',
    icon: '🚗',
    title: 'Go-slow',
    description: 'Traffic slowed your journey near the junction. Lokoja go-slow is not Lagos own — but it still bites.',
    tone: 'bad',
    weight: 3,
    extraMinutes: 8,
    moodDelta: -2,
  },
  {
    id: 'keke-stop',
    icon: '🛺',
    title: 'Keke refuel stop',
    description: 'The keke driver stopped to buy fuel mid-road. You waited, legs pressed against the rail.',
    tone: 'neutral',
    weight: 2,
    requiresTransport: ['keke'],
    extraMinutes: 6,
  },
  {
    id: 'quick-tip',
    icon: '🙌',
    title: 'Quick help, quick tip',
    description: 'Someone nearby needed help with a heavy load. You assisted small — and they gave you a tip.',
    tone: 'good',
    weight: 2,
    extraMinutes: 5,
    cashDelta: 250,
    xpDelta: 8,
    moodDelta: 3,
  },
]
