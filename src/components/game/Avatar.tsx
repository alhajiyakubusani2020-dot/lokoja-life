'use client'

/**
 * LOKOJA LIFE — Avatar
 * ---------------------
 * Fully original, layered SVG character renderer driven by AvatarConfig.
 * No external assets — every hairstyle/clothing style is drawn in code,
 * so future cosmetics can be added as new path sets (data-driven art).
 */

import { useId } from 'react'
import type { AvatarConfig } from '@/game/types'

interface AvatarProps {
  config: AvatarConfig
  gender: 'male' | 'female'
  /** show the soft background disc (menu/creation) */
  withBackdrop?: boolean
  className?: string
}

export function Avatar({ config, gender, withBackdrop = true, className }: AvatarProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const skin = config.skinTone
  const hair = config.hairColor
  const cloth = config.clothingColor

  // darker shades derived from the base colours for depth
  const skinShade = shade(skin, -18)
  const clothShade = shade(cloth, -22)

  const shoulderPath =
    gender === 'male'
      ? 'M 44 222 C 44 164 70 146 100 146 C 130 146 156 164 156 222 Z'
      : 'M 52 222 C 52 168 74 148 100 148 C 126 148 148 168 148 222 Z'

  return (
    <svg
      viewBox="0 0 200 224"
      className={className}
      role="img"
      aria-label="Character avatar"
    >
      <defs>
        <clipPath id={`disc-${uid}`}>
          <circle cx="100" cy="100" r="96" />
        </clipPath>
      </defs>

      {withBackdrop && (
        <>
          <circle cx="100" cy="100" r="96" fill="var(--lko-sand)" />
          <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(34,39,31,0.08)" strokeWidth="3" />
        </>
      )}

      <g clipPath={withBackdrop ? `url(#disc-${uid})` : undefined}>
        {/* ---------- behind-the-head hair (afro, dreads, braids, puffs) ---------- */}
        <HairBack config={config} hair={hair} />

        {/* ------------------------------- neck ------------------------------- */}
        <path d="M 88 116 L 88 146 Q 100 154 112 146 L 112 116 Z" fill={skinShade} />

        {/* --------------------------- torso / clothing ------------------------ */}
        <path d={shoulderPath} fill={cloth} />
        <ClothingDetail style={config.clothingStyle} cloth={cloth} clothShade={clothShade} />

        {/* -------------------------------- head ------------------------------- */}
        <path
          d="M 66 88 C 66 58 80 46 100 46 C 120 46 134 58 134 88 C 134 114 120 132 100 132 C 80 132 66 114 66 88 Z"
          fill={skin}
        />
        {/* ears */}
        <circle cx="66" cy="92" r="7" fill={skin} />
        <circle cx="134" cy="92" r="7" fill={skin} />
        <circle cx="66" cy="92" r="3.4" fill={skinShade} opacity="0.55" />
        <circle cx="134" cy="92" r="3.4" fill={skinShade} opacity="0.55" />

        {/* ----------------------------- face ---------------------------------- */}
        {/* brows */}
        <path d="M 80 81 Q 87 77 94 80" stroke={shade(hair, -10)} strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <path d="M 106 80 Q 113 77 120 81" stroke={shade(hair, -10)} strokeWidth="2.6" strokeLinecap="round" fill="none" />
        {/* eyes */}
        <circle cx="87" cy="91" r="3.6" fill="#241d16" />
        <circle cx="113" cy="91" r="3.6" fill="#241d16" />
        <circle cx="88.3" cy="89.7" r="1.1" fill="#ffffff" opacity="0.9" />
        <circle cx="114.3" cy="89.7" r="1.1" fill="#ffffff" opacity="0.9" />
        {/* nose */}
        <path d="M 100 96 L 98 103 Q 100 104.5 102 103" stroke={skinShade} strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* smile */}
        <path d="M 90 110 Q 100 119 110 110" stroke="#3d2b1f" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        {/* cheeks */}
        <circle cx="78" cy="101" r="4.5" fill={shade(skin, -8)} opacity="0.35" />
        <circle cx="122" cy="101" r="4.5" fill={shade(skin, -8)} opacity="0.35" />

        {/* --------------------------- front hair ------------------------------ */}
        <HairFront config={config} hair={hair} />
      </g>
    </svg>
  )
}

/* --------------------------- hair render helpers --------------------------- */

function HairBack({ config, hair }: { config: AvatarConfig; hair: string }) {
  switch (config.hairstyle) {
    case 'afro':
      return (
        <g fill={hair}>
          <circle cx="100" cy="62" r="44" />
          <circle cx="64" cy="76" r="20" />
          <circle cx="136" cy="76" r="20" />
        </g>
      )
    case 'dreads':
      return (
        <g fill={hair}>
          <rect x="58" y="64" width="11" height="58" rx="5.5" />
          <rect x="72" y="58" width="11" height="66" rx="5.5" />
          <rect x="117" y="58" width="11" height="66" rx="5.5" />
          <rect x="131" y="64" width="11" height="58" rx="5.5" />
        </g>
      )
    case 'braids':
      return (
        <g fill={hair}>
          <rect x="57" y="66" width="13" height="108" rx="6.5" />
          <rect x="130" y="66" width="13" height="108" rx="6.5" />
          {/* braid ties */}
          <rect x="55.5" y="120" width="16" height="7" rx="3.5" fill="#e8a317" opacity="0.85" />
          <rect x="128.5" y="120" width="16" height="7" rx="3.5" fill="#e8a317" opacity="0.85" />
        </g>
      )
    case 'puffs':
      return (
        <g fill={hair}>
          <circle cx="66" cy="56" r="19" />
          <circle cx="134" cy="56" r="19" />
          <circle cx="66" cy="56" r="19" fill="none" stroke={shade(hair, -15)} strokeWidth="2" />
          <circle cx="134" cy="56" r="19" fill="none" stroke={shade(hair, -15)} strokeWidth="2" />
        </g>
      )
    default:
      return null
  }
}

function HairFront({ config, hair }: { config: AvatarConfig; hair: string }) {
  switch (config.hairstyle) {
    case 'bald':
      return (
        <path
          d="M 82 54 Q 100 49 118 54"
          stroke={shade(config.skinTone, -10)}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
      )
    case 'low-cut':
      return (
        <path
          d="M 66 84 C 66 56 80 44 100 44 C 120 44 134 56 134 84 C 130 64 118 56 100 56 C 82 56 70 64 66 84 Z"
          fill={hair}
        />
      )
    case 'waves':
      return (
        <g>
          <path
            d="M 66 84 C 66 56 80 44 100 44 C 120 44 134 56 134 84 C 130 64 118 56 100 56 C 82 56 70 64 66 84 Z"
            fill={hair}
          />
          <path
            d="M 76 62 Q 88 58 100 60 Q 112 62 124 62 M 74 68 Q 88 64 100 66 Q 112 68 126 68"
            stroke={shade(hair, 30)}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />
        </g>
      )
    case 'afro':
      return (
        <path
          d="M 68 78 C 68 52 82 42 100 42 C 118 42 132 52 132 78 C 126 58 116 52 100 52 C 84 52 74 58 68 78 Z"
          fill={hair}
        />
      )
    case 'cornrows':
      return (
        <g>
          <path
            d="M 66 84 C 66 54 80 42 100 42 C 120 42 134 54 134 84 C 130 62 118 54 100 54 C 82 54 70 62 66 84 Z"
            fill={hair}
          />
          {[76, 88, 100, 112, 124].map((x, i) => (
            <path
              key={i}
              d={`M ${x} ${48 + Math.abs(100 - x) * 0.12} Q ${x - 2} ${58 + Math.abs(100 - x) * 0.1} ${x} ${66}`}
              stroke={shade(hair, 34)}
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
          ))}
        </g>
      )
    case 'dreads':
      return (
        <path
          d="M 64 80 C 64 52 80 42 100 42 C 120 42 136 52 136 80 C 130 58 118 52 100 52 C 82 52 70 58 64 80 Z"
          fill={hair}
        />
      )
    case 'braids':
      return (
        <path
          d="M 62 82 C 62 52 80 42 100 42 C 120 42 138 52 138 82 C 132 58 118 52 100 52 C 82 52 68 58 62 82 Z"
          fill={hair}
        />
      )
    case 'puffs':
      return (
        <path
          d="M 64 84 C 64 52 80 44 100 44 C 120 44 136 52 136 84 C 130 62 118 56 100 56 C 82 56 70 62 64 84 Z"
          fill={hair}
        />
      )
    default:
      return null
  }
}

/* ------------------------- clothing detail helpers ------------------------- */

function ClothingDetail({
  style,
  cloth,
  clothShade,
}: {
  style: string
  cloth: string
  clothShade: string
}) {
  switch (style) {
    case 'kaftan':
      return (
        <g>
          {/* V-neck opening + placket */}
          <path d="M 88 148 L 100 168 L 112 148 Q 100 156 88 148 Z" fill={clothShade} />
          <path d="M 100 168 L 100 200" stroke={clothShade} strokeWidth="2.5" strokeLinecap="round" />
          {/* embroidery */}
          <circle cx="100" cy="176" r="2" fill="#e8a317" opacity="0.9" />
          <circle cx="96" cy="184" r="2" fill="#e8a317" opacity="0.9" />
          <circle cx="104" cy="184" r="2" fill="#e8a317" opacity="0.9" />
          <circle cx="100" cy="192" r="2" fill="#e8a317" opacity="0.9" />
        </g>
      )
    case 'ankara':
      return (
        <g>
          <path d="M 88 148 Q 100 158 112 148 Q 100 156 88 148 Z" fill={clothShade} />
          {/* simple print motif — original abstract pattern */}
          {[
            { x: 70, y: 170 }, { x: 96, y: 180 }, { x: 122, y: 168 },
            { x: 82, y: 196 }, { x: 112, y: 200 }, { x: 62, y: 208 }, { x: 134, y: 208 },
          ].map((p, i) => (
            <g key={i} transform={`translate(${p.x} ${p.y})`}>
              <circle r="4.5" fill="#fdf0d5" opacity="0.95" />
              <circle r="1.8" fill={clothShade} />
            </g>
          ))}
        </g>
      )
    case 'senator':
      return (
        <g>
          {/* crisp straight collar + button line */}
          <path d="M 86 148 L 100 162 L 114 148" fill="none" stroke={clothShade} strokeWidth="4" strokeLinejoin="round" />
          <path d="M 100 162 L 100 210" stroke={clothShade} strokeWidth="2" />
          <circle cx="100" cy="172" r="1.6" fill="#fdf0d5" opacity="0.9" />
          <circle cx="100" cy="184" r="1.6" fill="#fdf0d5" opacity="0.9" />
          {/* pocket */}
          <rect x="116" y="176" width="16" height="12" rx="2" fill="none" stroke={clothShade} strokeWidth="2" />
        </g>
      )
    case 'tshirt':
    default:
      return (
        <g>
          {/* crew neckline */}
          <path d="M 88 146 Q 100 160 112 146 Q 100 154 88 146 Z" fill={clothShade} />
          {/* sleeve seams */}
          <path d="M 62 168 Q 66 158 72 152 M 138 152 Q 144 158 148 168" stroke={clothShade} strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      )
  }
}

/* ------------------------------ colour helper ------------------------------ */

/** Lighten (amount > 0) or darken (amount < 0) a hex colour by a percentage. */
function shade(hex: string, amount: number): string {
  const clean = hex.replace('#', '')
  const num = parseInt(clean, 16)
  const clamp = (v: number) => Math.max(0, Math.min(255, v))
  const r = clamp((num >> 16) + Math.round(2.55 * amount))
  const g = clamp(((num >> 8) & 0x00ff) + Math.round(2.55 * amount))
  const b = clamp((num & 0x0000ff) + Math.round(2.55 * amount))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}
