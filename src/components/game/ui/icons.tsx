'use client'

/**
 * LOKOJA LIFE — Icon system ("Confluence" design language)
 * ---------------------------------------------------------
 * One consistent stroke icon set for UI chrome: navigation, needs,
 * actions and status. Same 24px grid, 1.9 stroke, round caps — so the
 * interface speaks one language instead of a mix of emoji.
 *
 * Emojis remain deliberately ONLY for *content* identity (NPC faces,
 * dishes, location markers) — never for controls.
 */

import type { SVGProps } from 'react'

export type IconName =
  | 'world' | 'map' | 'work' | 'bag' | 'user'
  | 'pin' | 'cash' | 'clock' | 'star' | 'lock'
  | 'chevron-right' | 'chevron-down' | 'arrow-left' | 'arrow-up-right'
  | 'close' | 'sliders' | 'volume' | 'volume-x' | 'save' | 'exit'
  | 'heart' | 'energy' | 'food' | 'mood'
  | 'sun' | 'moon' | 'cloud' | 'rain' | 'sunrise'
  | 'camera-follow' | 'camera-free' | 'locate' | 'sprint'
  | 'check' | 'eye' | 'dice' | 'sparkle' | 'bed' | 'compass' | 'ledger'

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
  /** pixel size — defaults to 18 */
  size?: number
}

/** stroke style shared by every icon in the set */
const base: SVGProps<SVGSVGElement> = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const PATHS: Record<IconName, React.ReactNode> = {
  world: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
      <path d="M3.4 9h17.2M3.4 15h17.2" />
    </>
  ),
  map: (
    <>
      <path d="M9 4.5 3.7 6.6a1 1 0 0 0-.7 1v10.9a1 1 0 0 0 1.3 1L9 17.5l6 2 5.3-2.1a1 1 0 0 0 .7-1V5.5a1 1 0 0 0-1.3-1L15 6.5l-6-2Z" />
      <path d="M9 4.5v13M15 6.5v13" />
    </>
  ),
  work: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2.5" />
      <path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7" />
      <path d="M3 12.5h6.5M14.5 12.5H21" />
      <path d="M12 11.4v2.2" />
    </>
  ),
  bag: (
    <>
      <path d="M6.3 8 4 11l1 8.3A2 2 0 0 0 7 21h10a2 2 0 0 0 2-1.7L20 11l-2.3-3Z" />
      <path d="M4 11h16" />
      <path d="M9 11V8a3 3 0 0 1 6 0v3" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </>
  ),
  pin: (
    <>
      <path d="M19 10c0 4.5-5 9.3-6.4 10.6a1 1 0 0 1-1.3 0C9.9 19.3 5 14.5 5 10a7 7 0 0 1 14 0Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  cash: (
    <>
      <rect x="2.5" y="6.5" width="19" height="11" rx="2" />
      <circle cx="12" cy="12" r="2.4" />
      <path d="M6 12h.01M18 12h.01" strokeWidth={2.6} />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7.2V12l3 1.8" />
    </>
  ),
  star: (
    <path d="m12 3.6 2.5 5a1.6 1.6 0 0 0 1.2.9l5.4.8-3.9 3.8a1.6 1.6 0 0 0-.5 1.4l1 5.4-4.9-2.6a1.6 1.6 0 0 0-1.5 0l-4.9 2.6 1-5.4a1.6 1.6 0 0 0-.5-1.4L3 10.3l5.4-.8a1.6 1.6 0 0 0 1.2-.9Z" />
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9.5" rx="2.2" />
      <path d="M8.2 11V7.8a3.8 3.8 0 0 1 7.6 0V11" />
    </>
  ),
  'chevron-right': <path d="m9.5 5.5 6.2 6.5-6.2 6.5" />,
  'chevron-down': <path d="m5.5 9.5 6.5 6.2 6.5-6.2" />,
  'arrow-left': (
    <>
      <path d="M19 12H5.5" />
      <path d="m11.5 5.5-6.4 6.5 6.4 6.5" />
    </>
  ),
  'arrow-up-right': (
    <>
      <path d="M6.5 17.5 17 7" />
      <path d="M8.5 6.5H17.5V15.5" />
    </>
  ),
  close: <path d="M6 6 18 18M18 6 6 18" />,
  sliders: (
    <>
      <path d="M4 7.5h9M17.5 7.5H20M4 16.5h3M11.5 16.5H20" />
      <circle cx="15" cy="7.5" r="2.2" />
      <circle cx="9" cy="16.5" r="2.2" />
    </>
  ),
  volume: (
    <>
      <path d="M11.5 4.8a.7.7 0 0 0-1.2-.5L7 7.6a1.4 1.4 0 0 1-1 .4H4.2a1.2 1.2 0 0 0-1.2 1.2v5.6a1.2 1.2 0 0 0 1.2 1.2H6a1.4 1.4 0 0 1 1 .4l3.3 3.3a.7.7 0 0 0 1.2-.5Z" />
      <path d="M15.5 8.8a5 5 0 0 1 0 6.4M18.2 6.2a8.6 8.6 0 0 1 0 11.6" />
    </>
  ),
  'volume-x': (
    <>
      <path d="M11.5 4.8a.7.7 0 0 0-1.2-.5L7 7.6a1.4 1.4 0 0 1-1 .4H4.2a1.2 1.2 0 0 0-1.2 1.2v5.6a1.2 1.2 0 0 0 1.2 1.2H6a1.4 1.4 0 0 1 1 .4l3.3 3.3a.7.7 0 0 0 1.2-.5Z" />
      <path d="m16 9.5 5 5M21 9.5l-5 5" />
    </>
  ),
  save: (
    <path d="m19 21-7-4.2L5 21V5.4A2.4 2.4 0 0 1 7.4 3h9.2A2.4 2.4 0 0 1 19 5.4Z" />
  ),
  exit: (
    <>
      <path d="M9.5 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.5" />
      <path d="m15.5 16.5 4.5-4.5-4.5-4.5" />
      <path d="M20 12H9.5" />
    </>
  ),
  heart: (
    <path d="M12 20.6C8.9 17.9 5.8 14.8 3.6 11.9a4.8 4.8 0 0 1-1-2.7A4.4 4.4 0 0 1 7 4.9c1.5 0 2.6.5 3.9 1.7l1.1 1 1.1-1A5.7 5.7 0 0 1 17 4.9a4.4 4.4 0 0 1 4.4 4.3 4.8 4.8 0 0 1-1 2.7c-2.2 2.9-5.3 6-8.4 8.7Z" />
  ),
  energy: <path d="M13.2 2.4 4.5 13.2a.55.55 0 0 0 .45.9h5.3l-1.4 7.4 8.7-10.8a.55.55 0 0 0-.45-.9h-5.3Z" />,
  food: (
    <>
      <path d="M4.5 3v6a2.2 2.2 0 0 0 2.2 2.2h1.6A2.2 2.2 0 0 0 10.5 9V3M7.5 3v18" />
      <path d="M19.5 3a4.2 4.2 0 0 0-4 4.2V13h4M19.5 3v18" />
    </>
  ),
  mood: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M8.4 14.2s1.3 1.9 3.6 1.9 3.6-1.9 3.6-1.9" />
      <path d="M9.2 9.4h.01M14.8 9.4h.01" strokeWidth={2.6} />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M18.5 5.5l-1.4 1.4M6.9 17.1l-1.4 1.4" />
    </>
  ),
  moon: <path d="M20.4 14.6A8.5 8.5 0 1 1 9.4 3.6a7 7 0 0 0 11 11Z" />,
  cloud: <path d="M17.3 18.5H8a6 6 0 1 1 5.8-7.6h1.3a3.8 3.8 0 1 1 .2 7.6Z" />,
  rain: (
    <>
      <path d="M17.3 15.5H8a6 6 0 1 1 5.8-7.6h1.3a3.8 3.8 0 1 1 .2 7.6Z" />
      <path d="M8.5 18.5v2.3M12.5 17.5v2.3M16.5 18.5v2.3" />
    </>
  ),
  sunrise: (
    <>
      <path d="M12 3.5v4M5 8.5 6.6 10M19 8.5 17.4 10M3 15h2.5M18.5 15H21M6.5 15a5.5 5.5 0 0 1 11 0" />
      <path d="M2.5 19h19" />
    </>
  ),
  'camera-follow': (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 4.5c4.6 0 8.4 3.1 10 7.5-1.6 4.4-5.4 7.5-10 7.5S3.6 16.4 2 12c1.6-4.4 5.4-7.5 10-7.5Z" />
    </>
  ),
  'camera-free': (
    <>
      <circle cx="12" cy="12" r="2.8" />
      <circle cx="19" cy="5.4" r="1.7" />
      <circle cx="5" cy="18.6" r="1.7" />
      <path d="M10.5 21.2a9.6 9.6 0 0 0 9.5-14.7M13.4 2.9a9.6 9.6 0 0 0-9.4 14.6" />
    </>
  ),
  locate: (
    <>
      <circle cx="12" cy="12" r="6.4" />
      <path d="M12 2.6v2.6M12 18.8v2.6M2.6 12h2.6M18.8 12h2.6" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  sprint: (
    <>
      <path d="m6 5.5 6.5 6.5L6 18.5" />
      <path d="m12.5 5.5 6.5 6.5-6.5 6.5" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5L19.5 6.5" />,
  eye: (
    <>
      <path d="M2.5 12.2a.9.9 0 0 1 0-.7A10.2 10.2 0 0 1 12 5a10.2 10.2 0 0 1 9.5 6.5.9.9 0 0 1 0 .7A10.2 10.2 0 0 1 12 18.7 10.2 10.2 0 0 1 2.5 12.2Z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  dice: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
      <path d="M8.2 8.2h.01M15.8 8.2h.01M12 12h.01M8.2 15.8h.01M15.8 15.8h.01" strokeWidth={2.6} />
    </>
  ),
  sparkle: (
    <path d="M11 4.2 12.4 9a2 2 0 0 0 1.4 1.4l4.8 1.4a.5.5 0 0 1 0 1L13.8 14a2 2 0 0 0-1.4 1.4L11 20.2a.5.5 0 0 1-1 0L8.6 15.4A2 2 0 0 0 7.2 14l-4.8-1.4a.5.5 0 0 1 0-1L7.2 10.4A2 2 0 0 0 8.6 9L10 4.2a.5.5 0 0 1 1 0Z" />
  ),
  bed: (
    <>
      <path d="M3 5.5v13M3 10h15.5A2.5 2.5 0 0 1 21 12.5v6M3 16.5h18" />
      <circle cx="7.5" cy="7.8" r="1.6" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="m15.6 8.4-1.9 4.9-4.9 1.9 1.9-4.9Z" />
    </>
  ),
  ledger: (
    <>
      <path d="M6 3.5h12a1.5 1.5 0 0 1 1.5 1.5v14A1.5 1.5 0 0 1 18 20.5H6A1.5 1.5 0 0 1 4.5 19V5A1.5 1.5 0 0 1 6 3.5Z" />
      <path d="M8.5 8h7M8.5 12h7M8.5 16h4.5" />
    </>
  ),
}

export function Icon({ name, size = 18, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base} {...rest}>
      {PATHS[name]}
    </svg>
  )
}

/** which icon represents a weather state in the HUD */
export function weatherIcon(weather: string): IconName {
  switch (weather) {
    case 'rain': return 'rain'
    case 'cloudy': return 'cloud'
    case 'night-clear': return 'moon'
    default: return 'sun'
  }
}
