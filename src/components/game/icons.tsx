/**
 * LOKOJA LIFE — Icon system (R1)
 * ------------------------------
 * One coherent, hand-drawn SVG icon set for the whole game.
 * • 24×24 grid, 1.9px rounded strokes, currentColor — tinted by context.
 * • Replaces oversized emoji previously used as interface art (nav, needs,
 *   skills, jobs, places, transport). Emojis stay only where they are
 *   game-world flavour (NPC chat messages, food items, toasts).
 */

import type { SVGProps, ReactNode } from 'react'

export type IconProps = SVGProps<SVGSVGElement> & { size?: number | string }

function Svg({ size = 20, children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

/* ------------------------------ navigation ------------------------------ */

export function HomeIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6 9.5V20h12V9.5" />
      <path d="M10 20v-5h4v5" />
    </Svg>
  )
}

export function MapIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Z" />
      <path d="M9 4v14M15 6v14" />
    </Svg>
  )
}

export function WorkIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="3.5" y="7.5" width="17" height="12" rx="2.5" />
      <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" />
      <path d="M3.5 12.5h17" />
      <path d="M10.5 12.5v2h3v-2" />
    </Svg>
  )
}

export function BagIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M7 8.5a5 5 0 0 1 10 0" />
      <rect x="4" y="8.5" width="16" height="11.5" rx="3" />
      <path d="M9 12.5h6" />
    </Svg>
  )
}

export function ProfileIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="8.2" r="3.6" />
      <path d="M5 20c.8-3.4 3.6-5.3 7-5.3s6.2 1.9 7 5.3" />
    </Svg>
  )
}

/* -------------------------------- needs --------------------------------- */

export function HealthIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 20s-7.2-4.4-8.8-9.1C2.1 7.7 4 5 6.9 5c2 0 3.6 1.1 5.1 3 1.5-1.9 3-3 5.1-3 2.9 0 4.8 2.7 3.7 5.9C19.2 15.6 12 20 12 20Z" />
    </Svg>
  )
}

export function EnergyIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M13 3 5 13.5h5.5L11 21l8-10.5h-5.5L13 3Z" />
    </Svg>
  )
}

export function FoodIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 11h16a8 8 0 0 1-16 0Z" />
      <path d="M9.5 7.5c0-1 .8-1.2.8-2M13.7 7.5c0-1 .8-1.2.8-2" />
      <path d="M6 20h12" />
    </Svg>
  )
}

export function MoodIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M9 10h.01M15 10h.01" strokeWidth={2.4} />
      <path d="M8.6 14.2c.9 1.1 2 1.7 3.4 1.7s2.5-.6 3.4-1.7" />
    </Svg>
  )
}

/* -------------------------------- skills -------------------------------- */

export function HustleIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M14.5 6.5 17 4l3 3-2.5 2.5" />
      <path d="M13 8 4.5 16.5 7.5 19.5 16 11" />
      <path d="M12.5 5.5 15 8" transform="translate(1.5 1.5)" />
      <path d="m15 9 1.5 1.5" />
    </Svg>
  )
}

export function SmartIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M9 18.5c-1.8 1-4.5 1-5.5.5V5c1 .5 3.7.5 5.5-.5 1.8 1 4.5 1 5.5.5v14c-1 .5-3.7.5-5.5-.5Z" transform="translate(3.5 0)" />
      <path d="M9 18.5c-1.8 1-4.5 1-5.5.5V5c1 .5 3.7.5 5.5-.5 1.8 1 4.5 1 5.5.5" />
    </Svg>
  )
}

export function SocialIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h7A2.5 2.5 0 0 1 16 6.5v4a2.5 2.5 0 0 1-2.5 2.5H9l-3.5 3v-3H6.5A2.5 2.5 0 0 1 4 10.5v-4Z" />
      <path d="M17.5 9.5c1.4.3 2.5 1.5 2.5 3v3.2c0 1.7-1.4 3.1-3 3.1H16v2.2L13 18.6" />
    </Svg>
  )
}

/* ---------------------------- weather / time ---------------------------- */

export function SunIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </Svg>
  )
}

export function CloudIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M7 18a4 4 0 0 1-.6-7.9A5.5 5.5 0 0 1 17 9.6 3.8 3.8 0 0 1 17.5 18H7Z" />
    </Svg>
  )
}

export function RainIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M7 14a4 4 0 0 1-.6-7.9A5.5 5.5 0 0 1 17 5.6 3.8 3.8 0 0 1 17.5 14H7Z" />
      <path d="M9 17l-.8 2.4M13 17l-.8 2.4M17 17l-.8 2.4" />
    </Svg>
  )
}

export function MoonIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M19.5 14.5A8 8 0 0 1 9.5 4.6a8 8 0 1 0 10 9.9Z" />
      <path d="M16.8 4.5l.5 1.4 1.4.5-1.4.5-.5 1.4-.5-1.4-1.4-.5 1.4-.5.5-1.4Z" fill="currentColor" strokeWidth={1} />
    </Svg>
  )
}

export function SunriseIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M7.5 15a4.5 4.5 0 0 1 9 0" />
      <path d="M12 4.5V7M5.2 8.2l1.4 1.4M18.8 8.2l-1.4 1.4M3 15h2M19 15h2M4 19h16" />
    </Svg>
  )
}

export function SunsetIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M7.5 13a4.5 4.5 0 0 1 9 0" />
      <path d="M12 7V4.5M5.2 6.2l1.4 1.4M18.8 6.2l-1.4 1.4M3 13h2M19 13h2M4 18.5h16" />
    </Svg>
  )
}

export function ClockIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 7.5V12l3 2" />
    </Svg>
  )
}

/* -------------------------------- places -------------------------------- */

export function StallIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 4h16l1 4a2.6 2.6 0 0 1-5.2 0 2.6 2.6 0 0 1-5.2 0 2.6 2.6 0 0 1-5.2 0L4 4Z" transform="translate(1 0) scale(0.92)" />
      <path d="M5.5 11v9h13v-9" />
      <path d="M9 20v-5h4v5" />
    </Svg>
  )
}

export function SignpostIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 3v18" />
      <path d="M12 5h6.5l2 2.5-2 2.5H12V5Z" />
      <path d="M12 12H5.5l-2 2.5 2 2.5H12V12Z" />
    </Svg>
  )
}

export function ConfluenceIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 6c4 0 6 2.4 8 6s4 6 8 6" />
      <path d="M20 6c-4 0-6 2.4-8 6s-4 6-8 6" opacity={0.55} />
    </Svg>
  )
}

export function MountainIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="m3 19 6-10 4 6 2.5-3.5L21 19H3Z" />
      <path d="M9 9V5.5l2.4 1-2.4 1" fill="currentColor" strokeWidth={1.4} />
    </Svg>
  )
}

export function LandmarkIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 9.5 12 5l8 4.5" />
      <path d="M5.5 10.5V17M9.8 10.5V17M14.2 10.5V17M18.5 10.5V17" />
      <path d="M4 19.5h16M4 17h16" />
    </Svg>
  )
}

export function OfficeIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="5" y="4" width="14" height="16" rx="1.6" />
      <path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2" />
    </Svg>
  )
}

export function GradCapIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="m2.8 9.5 9.2-4 9.2 4-9.2 4-9.2-4Z" />
      <path d="M6.5 11.5v4c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5v-4" />
      <path d="M21 9.5v4.5" />
    </Svg>
  )
}

export function PotIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4.5 10.5h15v3.5a5.5 5.5 0 0 1-5.5 5.5h-4a5.5 5.5 0 0 1-5.5-5.5v-3.5Z" />
      <path d="M3 10.5h18" />
      <path d="M9.5 7.5c0-1 .8-1.2.8-2M13.7 7.5c0-1 .8-1.2.8-2" />
    </Svg>
  )
}

export function TaxiIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M5 13.5 6.6 9a2 2 0 0 1 1.9-1.4h7A2 2 0 0 1 17.4 9L19 13.5" />
      <rect x="3.5" y="13.5" width="17" height="5.5" rx="1.8" />
      <path d="M7 19v1.6M17 19v1.6M6.8 16.2h.01M17.2 16.2h.01" strokeWidth={2.2} />
      <path d="M10.5 7.5V6a1.2 1.2 0 0 1 1.2-1.2h.6a1.2 1.2 0 0 1 1.2 1.2v1.5" />
    </Svg>
  )
}

/* ------------------------------- transport ------------------------------ */

export function WalkIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="13" cy="4.6" r="1.9" />
      <path d="M9.5 21l2.2-5.5-2.4-2.5 1.4-5 3.3 1.6 2.5 2.4" />
      <path d="M10.7 8 8 10.5l-.6 3M13 15.5 14.5 21" />
    </Svg>
  )
}

export function KekeIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4.5 15.5v-2A7.5 7.5 0 0 1 12 6h1a6 6 0 0 1 6 6v3.5" />
      <path d="M4.5 13.5h9.5" />
      <circle cx="7" cy="17" r="2.2" />
      <circle cx="17" cy="17" r="2.2" />
      <path d="M11.5 6.2 10 3.5h3.4" />
    </Svg>
  )
}

/* ---------------------------------- jobs -------------------------------- */

export function BasketIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 9.5h16l-1.6 8a2.4 2.4 0 0 1-2.4 2H8a2.4 2.4 0 0 1-2.4-2L4 9.5Z" />
      <path d="m8.5 9.5 2-5M15.5 9.5l-2-5M9.8 13v3.2M14.2 13v3.2" />
    </Svg>
  )
}

export function BoxIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 3 20 7v10l-8 4-8-4V7l8-4Z" />
      <path d="M4.4 7.2 12 11l7.6-3.8M12 11v9.6" />
    </Svg>
  )
}

export function SteeringIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M4 11c2.5 1 5.3 1.6 8 1.6s5.5-.6 8-1.6" />
      <path d="M11 14.5 9 19.6M13 14.5l2 5.1" />
    </Svg>
  )
}

export function FishIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M3 12c2.6-3.4 6-5 9.2-5 3 0 5.6 1.6 7.8 5-2.2 3.4-4.8 5-7.8 5C9 17 5.6 15.4 3 12Z" />
      <path d="M3 12c1.5 1 3 1.5 4.6 1.7M20 12l1.6-2.6M20 12l1.6 2.6" transform="translate(-1 0)" />
      <path d="M8.5 10.8h.01" strokeWidth={2.4} />
    </Svg>
  )
}

export function CameraIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="3.5" y="7" width="17" height="12.5" rx="2.4" />
      <path d="M8.5 7 10 4.5h4L15.5 7" />
      <circle cx="12" cy="13" r="3.4" />
      <path d="M17.5 10h.01" strokeWidth={2.4} />
    </Svg>
  )
}

export function ShopIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4.5 9 6 4h12l1.5 5" />
      <path d="M5.5 9v11h13V9" />
      <rect x="9" y="13" width="6" height="7" rx="1" />
    </Svg>
  )
}

export function BroomIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="m13.5 10 5-7" />
      <path d="M13 9.8c-3 .5-5.6 2.4-7.3 5.4L4 18.5l7.5-1.7c3-.7 5.2-2.8 6-5.8l-4.5-1.2Z" />
    </Svg>
  )
}

export function CompassIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.2" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </Svg>
  )
}

export function BankIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 9 12 4.5 20 9" />
      <path d="M5.5 9.5V17M10 9.5V17M14 9.5V17M18.5 9.5V17" />
      <path d="M4 19.5h16" />
    </Svg>
  )
}

export function TrendUpIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 17l5.5-5.5 3.5 3.5L20 8" />
      <path d="M15.5 8H20v4.5" />
    </Svg>
  )
}

/* ---------------------------------- ui ---------------------------------- */

export function PinIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 21s-6.5-5.4-6.5-10.2A6.4 6.4 0 0 1 12 4.5a6.4 6.4 0 0 1 6.5 6.3C18.5 15.6 12 21 12 21Z" />
      <circle cx="12" cy="10.6" r="2.2" />
    </Svg>
  )
}

export function StarIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 9.7l5.4-.8L12 4Z" />
    </Svg>
  )
}

export function LockIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="5.5" y="10.5" width="13" height="9" rx="2.2" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
      <path d="M12 14v2.4" />
    </Svg>
  )
}

export function CheckIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </Svg>
  )
}

export function ChevronRightIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
    </Svg>
  )
}

export function ArrowLeftIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </Svg>
  )
}

export function ArrowRightIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  )
}

export function SearchIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </Svg>
  )
}

export function DiceIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="4" y="4" width="16" height="16" rx="3.5" />
      <path d="M8.8 8.8h.01M15.2 8.8h.01M12 12h.01M8.8 15.2h.01M15.2 15.2h.01" strokeWidth={2.5} />
    </Svg>
  )
}

export function SparkleIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 4.5 13.8 10l5.5 1.8-5.5 1.8L12 19.5l-1.8-5.9L4.7 11.8 10.2 10 12 4.5Z" />
      <path d="M19 4.5l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6.6-1.9Z" fill="currentColor" strokeWidth={1} />
    </Svg>
  )
}

export function TargetIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="7.8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </Svg>
  )
}

export function HourglassIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M7 4h10M7 20h10M8 4c0 4 3 5 4 8-1 3-4 4-4 8M16 4c0 4-3 5-4 8 1 3 4 4 4 8" />
    </Svg>
  )
}

export function CoinsIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <ellipse cx="9" cy="7.5" rx="5.5" ry="2.8" />
      <path d="M3.5 7.5v4c0 1.6 2.5 2.9 5.5 2.9s5.5-1.3 5.5-2.9v-4" />
      <path d="M9 14.4v2.1c0 1.6 2.5 2.9 5.5 2.9s5.5-1.3 5.5-2.9v-4c0-1.3-1.6-2.4-3.8-2.8" />
    </Svg>
  )
}

export function TrendDownIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 7l5.5 5.5 3.5-3.5L20 16" />
      <path d="M15.5 16H20v-4.5" />
    </Svg>
  )
}

export function SoundIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 9.5v5h3.5L12 19V5L7.5 9.5H4Z" />
      <path d="M15.5 9c1 .8 1.6 1.8 1.6 3s-.6 2.2-1.6 3M18 6.5c1.7 1.3 2.7 3.2 2.7 5.5s-1 4.2-2.7 5.5" />
    </Svg>
  )
}

export function SaveIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M5 4.5h11L19.5 8v11.5h-15V4.5Z" />
      <path d="M8 4.5V9h7V4.5" />
      <rect x="8" y="13" width="8" height="6.5" rx="0.8" />
    </Svg>
  )
}

export function ExitIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M13.5 4.5h-8v15h8" />
      <path d="M10 12h10.5M17 8.5l3.5 3.5-3.5 3.5" />
    </Svg>
  )
}

export function SettingsIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.2v2.3M12 18.5v2.3M4.9 7.9l2 1.15M17.1 15l2 1.15M4.9 16.1l2-1.15M17.1 9l2-1.15" />
    </Svg>
  )
}

export function TrashIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4.5 6.5h15M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7" />
      <path d="M6.5 6.5 7.4 19c.1 1 .9 1.5 1.8 1.5h5.6c.9 0 1.7-.5 1.8-1.5l.9-12.5" />
      <path d="M10 10.5v6M14 10.5v6" />
    </Svg>
  )
}

export function AlertIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 4 21 19.5H3L12 4Z" />
      <path d="M12 10v4M12 16.8h.01" strokeWidth={2.3} />
    </Svg>
  )
}

export function ThumbsUpIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M7 11v9H4.5a.5.5 0 0 1-.5-.5V11.5a.5.5 0 0 1 .5-.5H7Z" />
      <path d="M7 11.5 11 3.5c1.6 0 2.6 1 2.6 2.4 0 .9-.6 2.6-1 3.6h5.6c1.1 0 1.9 1 1.6 2.1l-1.6 6.4a2 2 0 0 1-1.9 1.5H7" />
    </Svg>
  )
}

export function FireIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 21c-3.6 0-6-2.3-6-5.6 0-2.4 1.5-4.4 3-6.4.4 1 1.1 1.9 2 2.3C11 8.6 11.4 5.4 14 3c-.3 2.3.6 3.6 1.9 5.2 1.3 1.7 2.1 3.4 2.1 5.4 0 4.1-2.4 7.4-6 7.4Z" />
      <path d="M12 21c-1.4 0-2.4-1-2.4-2.5 0-1.6 1.4-2.5 2.4-4.3 1 1.8 2.4 2.7 2.4 4.3 0 1.5-1 2.5-2.4 2.5Z" />
    </Svg>
  )
}

/* ------------------------------- mapped sets ----------------------------- */

export type NavIconKey = 'home' | 'map' | 'work' | 'bag' | 'profile'

const NAV_ICONS: Record<NavIconKey, (p: IconProps) => ReactNode> = {
  home: HomeIcon,
  map: MapIcon,
  work: WorkIcon,
  bag: BagIcon,
  profile: ProfileIcon,
}

export function NavIcon({ name, ...p }: { name: NavIconKey } & IconProps) {
  const C = NAV_ICONS[name]
  return <C {...p} />
}

/* ------------------------------ need icons ------------------------------ */

export type NeedIconKey = 'health' | 'energy' | 'hunger' | 'mood'

const NEED_ICONS: Record<NeedIconKey, (p: IconProps) => ReactNode> = {
  health: HealthIcon,
  energy: EnergyIcon,
  hunger: FoodIcon,
  mood: MoodIcon,
}

export function NeedIcon({ name, ...p }: { name: NeedIconKey } & IconProps) {
  const C = NEED_ICONS[name]
  return <C {...p} />
}

/* ------------------------------ skill icons ----------------------------- */

export type SkillIconKey = 'hustle' | 'smart' | 'social'

const SKILL_ICONS: Record<SkillIconKey, (p: IconProps) => ReactNode> = {
  hustle: HustleIcon,
  smart: SmartIcon,
  social: SocialIcon,
}

export function SkillIcon({ name, ...p }: { name: SkillIconKey } & IconProps) {
  const C = SKILL_ICONS[name]
  return <C {...p} />
}

/* ----------------------------- weather icons ---------------------------- */

export type WeatherIconKey = 'sunny' | 'cloudy' | 'rain' | 'night-clear'

const WEATHER_ICONS: Record<WeatherIconKey, (p: IconProps) => ReactNode> = {
  sunny: SunIcon,
  cloudy: CloudIcon,
  rain: RainIcon,
  'night-clear': MoonIcon,
}

export function WeatherIcon({ name, ...p }: { name: WeatherIconKey } & IconProps) {
  const C = WEATHER_ICONS[name]
  return <C {...p} />
}

/* --------------------------- time-of-day icons -------------------------- */

export type TimeIconKey = 'morning' | 'afternoon' | 'evening' | 'night'

const TIME_ICONS: Record<TimeIconKey, (p: IconProps) => ReactNode> = {
  morning: SunriseIcon,
  afternoon: SunIcon,
  evening: SunsetIcon,
  night: MoonIcon,
}

export function TimeIcon({ name, ...p }: { name: TimeIconKey } & IconProps) {
  const C = TIME_ICONS[name]
  return <C {...p} />
}

/* ------------------------------ place icons ----------------------------- */

const PLACE_ICONS: Record<string, (p: IconProps) => ReactNode> = {
  home: HomeIcon,
  'kpata-market': StallIcon,
  'ganaja-junction': SignpostIcon,
  confluence: ConfluenceIcon,
  'mount-patti': MountainIcon,
  'historic-lokoja': LandmarkIcon,
  'government-area': OfficeIcon,
  'university-area': GradCapIcon,
  'food-area': PotIcon,
  'transport-area': TaxiIcon,
}

export function PlaceIcon({ id, ...p }: { id: string } & IconProps) {
  const C = PLACE_ICONS[id] ?? PinIcon
  return <C {...p} />
}

/* ------------------------------- job icons ------------------------------ */

const JOB_ICONS: Record<string, (p: IconProps) => ReactNode> = {
  'market-worker': BasketIcon,
  'delivery-worker': BoxIcon,
  driver: SteeringIcon,
  fisherman: FishIcon,
  photographer: CameraIcon,
  'shop-assistant': ShopIcon,
  cleaner: BroomIcon,
  'tour-guide': CompassIcon,
  'government-worker': BankIcon,
  entrepreneur: TrendUpIcon,
}

export function JobIcon({ id, ...p }: { id: string } & IconProps) {
  const C = JOB_ICONS[id] ?? WorkIcon
  return <C {...p} />
}

/* ---------------------------- transport icons --------------------------- */

export type TransportIconKey = 'walk' | 'keke' | 'taxi'

const TRANSPORT_ICONS: Record<TransportIconKey, (p: IconProps) => ReactNode> = {
  walk: WalkIcon,
  keke: KekeIcon,
  taxi: TaxiIcon,
}

export function TransportIcon({ name, ...p }: { name: TransportIconKey } & IconProps) {
  const C = TRANSPORT_ICONS[name]
  return <C {...p} />
}
