'use client'

/**
 * LOKOJA LIFE — LivingScene (R1)
 * ------------------------------
 * The living heart of the presentation: a layered, animated SVG of Lokoja
 * that responds to the REAL world clock and weather state.
 *   • Mount Patti on the horizon, the Niger–Benue confluence meeting line,
 *     a roofline of the city, drifting clouds, gliding birds, a bobbing
 *     canoe, and a keke that rolls past on the shore road.
 *   • timeOfDay drives the full lighting mood (morning / afternoon /
 *     evening / night — stars, moon and lit windows at night).
 *   • weather === 'rain' adds rain streaks and mutes the light.
 * Fully original vector art, no external assets, pure CSS motion
 * (respects prefers-reduced-motion via the lko-sv-* classes).
 */

export type SceneTime = 'morning' | 'afternoon' | 'evening' | 'night'

import { isRainSky } from '@/game/systems/seasons'

interface LivingSceneProps {
  /** comes straight from the world clock — defaults to golden afternoon */
  timeOfDay?: SceneTime
  /** comes straight from the world weather */
  weather?: 'sunny' | 'cloudy' | 'rain' | 'night-clear' | 'harmattan' | 'storm' | 'flood'
  className?: string
}

interface Mood {
  skyTop: string
  skyMid: string
  skyHorizon: string
  sun: string
  sunGlow: string
  pattiFar: string
  pattiNear: string
  pattiTop: string
  roofs: string
  roofsDeep: string
  tree: string
  riverA: string
  riverB: string
  riverDeep: string
  bank1: string
  bank2: string
  grass: string
  road: string
  windowsLit: boolean
  stars: boolean
}

const MOODS: Record<SceneTime, Mood> = {
  morning: {
    skyTop: '#ffeccb', skyMid: '#ffd99a', skyHorizon: '#ffc27d',
    sun: '#ffdf8a', sunGlow: '#ffdf8a',
    pattiFar: '#7ba266', pattiNear: '#55804a', pattiTop: '#46693d',
    roofs: '#7d8f6a', roofsDeep: '#5f7152',
    tree: '#3f6b38',
    riverA: '#49a693', riverB: '#3b9484', riverDeep: '#25766a',
    bank1: '#4e8a41', bank2: '#3d7034', grass: '#2c5427',
    road: '#d9b06c', windowsLit: false, stars: false,
  },
  afternoon: {
    skyTop: '#bfe4ee', skyMid: '#f6e2b2', skyHorizon: '#f6cf8b',
    sun: '#ffd23f', sunGlow: '#ffd23f',
    pattiFar: '#6f9c5c', pattiNear: '#4d7c43', pattiTop: '#3d6437',
    roofs: '#748862', roofsDeep: '#57684b',
    tree: '#38652f',
    riverA: '#3d9d8b', riverB: '#2f8a7a', riverDeep: '#1d6f63',
    bank1: '#487f3c', bank2: '#386630', grass: '#284d24',
    road: '#d3a962', windowsLit: false, stars: false,
  },
  evening: {
    skyTop: '#f9bd77', skyMid: '#f4925a', skyHorizon: '#e56f4d',
    sun: '#ff9d4d', sunGlow: '#ff9d4d',
    pattiFar: '#5c6e52', pattiNear: '#41573f', pattiTop: '#32462f',
    roofs: '#5a5348', roofsDeep: '#453f36',
    tree: '#2f4a2c',
    riverA: '#33796f', riverB: '#2a6a61', riverDeep: '#1d514b',
    bank1: '#3c6234', bank2: '#2e4d29', grass: '#223f1f',
    road: '#c19255', windowsLit: true, stars: false,
  },
  night: {
    skyTop: '#16233c', skyMid: '#1d3a49', skyHorizon: '#255059',
    sun: '#f2ead2', sunGlow: '#f2ead2',
    pattiFar: '#243528', pattiNear: '#1b2a20', pattiTop: '#142019',
    roofs: '#18251f', roofsDeep: '#101a15',
    tree: '#122015',
    riverA: '#1d4c55', riverB: '#173f49', riverDeep: '#0f2f37',
    bank1: '#1d3524', bank2: '#152819', grass: '#0e1d12',
    road: '#8a795a', windowsLit: true, stars: true,
  },
}

const RAIN_LINES = [
  { x: 90, y: 60, len: 20, d: '0s' }, { x: 190, y: 30, len: 18, d: '-0.4s' },
  { x: 300, y: 80, len: 22, d: '-0.2s' }, { x: 420, y: 40, len: 19, d: '-0.7s' },
  { x: 520, y: 90, len: 21, d: '-0.1s' }, { x: 640, y: 50, len: 18, d: '-0.55s' },
  { x: 720, y: 100, len: 22, d: '-0.3s' }, { x: 250, y: 140, len: 20, d: '-0.85s' },
  { x: 560, y: 160, len: 19, d: '-0.6s' }, { x: 700, y: 180, len: 21, d: '-0.15s' },
  { x: 120, y: 180, len: 18, d: '-0.45s' }, { x: 370, y: 130, len: 20, d: '-0.75s' },
]

const STARS = [
  { x: 70, y: 46, r: 1.6 }, { x: 150, y: 90, r: 1.2 }, { x: 240, y: 40, r: 1.8 },
  { x: 330, y: 110, r: 1.1 }, { x: 460, y: 60, r: 1.6 }, { x: 540, y: 120, r: 1.2 },
  { x: 620, y: 36, r: 1.7 }, { x: 700, y: 96, r: 1.2 }, { x: 760, y: 60, r: 1.5 },
  { x: 200, y: 140, r: 1.0 }, { x: 500, y: 150, r: 1.0 }, { x: 680, y: 150, r: 1.2 },
]

export function LivingScene({
  timeOfDay = 'afternoon',
  weather = 'sunny',
  className,
}: LivingSceneProps) {
  const m = MOODS[timeOfDay]
  const isNight = timeOfDay === 'night'
  // M6 — the wet-sky family shows the rain streaks; a storm/flood day is
  // just rain drawn heavier by the overcast wash below.
  const isRain = isRainSky(weather)
  const overcast = weather === 'cloudy' || isRain || weather === 'harmattan'
  // sun/moon position + size per time of day
  const orb =
    timeOfDay === 'morning'
      ? { x: 610, y: 150, r: 40 }
      : timeOfDay === 'afternoon'
        ? { x: 640, y: 96, r: 44 }
        : timeOfDay === 'evening'
          ? { x: 618, y: 286, r: 54 }
          : { x: 630, y: 92, r: 34 }

  return (
    <svg
      viewBox="0 0 800 450"
      className={className}
      role="img"
      aria-label={`Illustrated view of Lokoja at ${timeOfDay}${isRain ? ' in the rain' : ''}: Mount Patti, the city and the river confluence`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="ls-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={m.skyTop} />
          <stop offset="0.55" stopColor={m.skyMid} />
          <stop offset="1" stopColor={m.skyHorizon} />
        </linearGradient>
        <linearGradient id="ls-river" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={m.riverA} />
          <stop offset="1" stopColor={m.riverDeep} />
        </linearGradient>
        <linearGradient id="ls-river-b" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor={m.riverB} />
          <stop offset="1" stopColor={m.riverDeep} />
        </linearGradient>
        <radialGradient id="ls-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={m.sunGlow} stopOpacity="0.55" />
          <stop offset="1" stopColor={m.sunGlow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ls-scrim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity={isNight ? 0 : 0.06} />
          <stop offset="1" stopColor="#000" stopOpacity={isNight ? 0.35 : 0.16} />
        </linearGradient>
      </defs>

      {/* ---------------- sky ---------------- */}
      <rect width="800" height="450" fill="url(#ls-sky)" />

      {/* stars at night */}
      {m.stars && (
        <g fill="#e8ecf4">
          {STARS.map((s, i) => (
            <circle
              key={i}
              cx={s.x}
              cy={s.y}
              r={s.r}
              className="lko-sv-twinkle"
              style={{ animationDelay: `${(i % 5) * -0.6}s` }}
            />
          ))}
        </g>
      )}

      {/* sun / moon + halo */}
      <circle cx={orb.x} cy={orb.y} r={orb.r * 2.4} fill="url(#ls-glow)" />
      {isNight ? (
        <g>
          <circle cx={orb.x} cy={orb.y} r={orb.r} fill={m.sun} />
          <circle cx={orb.x - 12} cy={orb.y - 8} r={orb.r * 0.82} fill={m.skyTop} opacity="0.9" />
        </g>
      ) : (
        <circle cx={orb.x} cy={orb.y} r={orb.r} fill={m.sun} opacity={overcast ? 0.55 : 1} />
      )}

      {/* clouds — drifting, always a little present, more when overcast */}
      <g fill="#ffffff" opacity={overcast ? 0.92 : 0.66}>
        <g className="lko-sv-cloud-a">
          <g transform="translate(40 78)">
            <ellipse cx="0" cy="0" rx="46" ry="15" />
            <ellipse cx="30" cy="-10" rx="30" ry="13" />
            <ellipse cx="-28" cy="-6" rx="24" ry="10" />
          </g>
        </g>
        <g className="lko-sv-cloud-b" opacity="0.8">
          <g transform="translate(300 150)">
            <ellipse cx="0" cy="0" rx="38" ry="12" />
            <ellipse cx="26" cy="-8" rx="24" ry="10" />
          </g>
        </g>
        {overcast && (
          <g className="lko-sv-cloud-a" style={{ animationDuration: '70s', animationDelay: '-30s' }}>
            <g transform="translate(150 42)">
              <ellipse cx="0" cy="0" rx="58" ry="16" />
              <ellipse cx="34" cy="-10" rx="34" ry="13" />
              <ellipse cx="-36" cy="-8" rx="28" ry="11" />
            </g>
          </g>
        )}
      </g>

      {/* birds */}
      {!isNight && !isRain && (
        <g stroke={timeOfDay === 'evening' ? '#5b3a2e' : '#3a4a3a'} strokeWidth="2.4" fill="none" strokeLinecap="round">
          <g className="lko-sv-bird-a">
            <g transform="translate(60 96)">
              <path d="M-7 0 Q -3 -5 0 0 Q 3 -5 7 0" className="lko-anim-wing" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
            </g>
            <g transform="translate(88 108) scale(0.8)">
              <path d="M-7 0 Q -3 -5 0 0 Q 3 -5 7 0" className="lko-anim-wing" style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDelay: '-0.4s' }} />
            </g>
          </g>
          <g className="lko-sv-bird-b" opacity="0.8">
            <g transform="translate(140 70) scale(0.7)">
              <path d="M-7 0 Q -3 -5 0 0 Q 3 -5 7 0" className="lko-anim-wing" style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDelay: '-0.2s' }} />
            </g>
          </g>
        </g>
      )}

      {/* -------- Mount Patti + far hills -------- */}
      <path d="M -20 268 L 90 208 L 200 268 Z" fill={m.pattiFar} />
      <path d="M 120 268 L 262 186 L 410 268 Z" fill={m.pattiFar} opacity="0.85" />
      {/* Patti massif with crown flag */}
      <path d="M 30 268 L 150 158 L 236 224 L 292 268 Z" fill={m.pattiNear} />
      <path d="M 150 158 L 178 186 L 162 192 L 190 220 L 150 236 L 122 208 L 148 190 L 132 184 Z" fill={m.pattiTop} opacity="0.5" />
      <path d="M 150 158 L 150 140 L 164 145 L 150 151" fill="#e8a317" />
      <path d="M -30 268 Q 60 250 150 266 Q 260 282 360 268 L 360 276 L -30 276 Z" fill={m.pattiFar} opacity="0.6" />

      {/* -------- city roofline (lives between hills and river) -------- */}
      <g>
        <rect x="330" y="238" width="26" height="30" fill={m.roofs} />
        <path d="M 328 238 L 343 228 L 358 238 Z" fill={m.roofsDeep} />
        <rect x="366" y="230" width="20" height="38" fill={m.roofsDeep} />
        <path d="M 386 268 L 386 236 L 402 226 L 418 236 L 418 268 Z" fill={m.roofs} />
        {/* small minaret tower */}
        <rect x="428" y="216" width="10" height="52" fill={m.roofsDeep} />
        <path d="M 426 216 L 433 202 L 440 216 Z" fill={m.roofs} />
        <rect x="450" y="240" width="30" height="28" fill={m.roofs} />
        <path d="M 448 240 L 465 230 L 482 240 Z" fill={m.roofsDeep} />
        <rect x="492" y="234" width="18" height="34" fill={m.roofsDeep} />
        {/* water tower */}
        <path d="M 522 268 L 522 244 L 536 244 L 536 268 M 520 244 L 538 244 L 534 232 L 524 232 Z" fill={m.roofs} />
        <rect x="546" y="242" width="24" height="26" fill={m.roofs} />
        <path d="M 544 242 L 558 232 L 572 242 Z" fill={m.roofsDeep} />
        {/* lit windows at dusk/night */}
        {m.windowsLit && (
          <g fill="#ffd88a">
            <rect x="336" y="246" width="4" height="5" />
            <rect x="372" y="238" width="4" height="5" />
            <rect x="392" y="242" width="4" height="5" />
            <rect x="456" y="248" width="4" height="5" />
            <rect x="497" y="242" width="4" height="5" />
            <rect x="552" y="250" width="4" height="5" />
            <rect x="431" y="226" width="4" height="5" />
          </g>
        )}
      </g>

      {/* treeline */}
      <path
        d="M -20 270 Q 40 254 100 268 Q 170 252 240 268 Q 310 254 380 268 Q 460 252 540 268 Q 620 254 700 268 Q 750 258 800 268 L 800 286 L -20 286 Z"
        fill={m.tree}
      />

      {/* ---------------- the rivers ---------------- */}
      <rect y="282" width="800" height="168" fill="url(#ls-river)" />
      {/* Benue arm arriving from the right, meeting the Niger */}
      <path d="M 800 282 L 800 450 L 520 450 Q 640 360 800 282 Z" fill="url(#ls-river-b)" />
      {/* the famous meeting line — shimmering */}
      <path
        d="M 528 446 Q 648 358 796 286"
        stroke="#ffffff"
        strokeWidth="4"
        fill="none"
        opacity="0.5"
        strokeDasharray="10 12"
        className="lko-anim-shimmer"
      />
      {/* ripples */}
      <g stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M 90 340 Q 120 334 150 340" opacity="0.35" />
        <path d="M 240 396 Q 274 389 308 396" opacity="0.3" />
        <path d="M 560 322 Q 590 316 620 322" opacity="0.35" />
        <path d="M 660 412 Q 696 405 732 412" opacity="0.3" className="lko-anim-shimmer" style={{ animationDelay: '-1.6s' }} />
      </g>

      {/* canoe — bobbing on the Niger arm */}
      <g className="lko-sv-bob" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <g transform="translate(150 322)">
          <path d="M -30 8 Q 0 18 30 8 Q 0 13 -30 8 Z" fill="#7c4a1e" />
          <path d="M 2 -16 L 4 6" stroke="#4a2c14" strokeWidth="3" strokeLinecap="round" />
          <path d="M 4 -16 Q 19 -8 8 4 Q 5 -6 4 -16 Z" fill="#e8a317" />
          <circle cx="-12" cy="4" r="4.5" fill="#5c3a21" />
          <rect x="-17" y="-3" width="9" height="8" rx="2.4" fill="#1b7a43" />
        </g>
      </g>

      {/* --------------- foreground bank + shore road --------------- */}
      <path
        d="M 0 450 L 0 396 Q 90 378 190 394 Q 300 412 400 396 Q 510 380 610 398 Q 710 412 800 396 L 800 450 Z"
        fill={m.bank1}
      />
      <path
        d="M 0 450 L 0 424 Q 110 410 230 424 Q 360 440 500 426 Q 640 412 800 428 L 800 450 Z"
        fill={m.bank2}
      />
      {/* shore road ribbon the keke drives on */}
      <path
        d="M 0 428 Q 130 416 260 424 Q 420 434 560 424 Q 690 416 800 424"
        stroke={m.road}
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M 0 428 Q 130 416 260 424 Q 420 434 560 424 Q 690 416 800 424"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeDasharray="9 11"
        fill="none"
        opacity="0.5"
      />

      {/* grass tufts */}
      <g stroke={m.grass} strokeWidth="3" strokeLinecap="round" fill="none">
        {[
          { x: 60, y: 418 }, { x: 96, y: 432 }, { x: 205, y: 440 }, { x: 348, y: 428 },
          { x: 480, y: 442 }, { x: 610, y: 436 }, { x: 730, y: 444 },
        ].map((g, i) => (
          <path key={i} d={`M ${g.x} ${g.y} q 3 -10 0 -16 M ${g.x + 7} ${g.y} q 3 -7 6 -12 M ${g.x - 7} ${g.y} q -3 -7 -6 -12`} />
        ))}
      </g>

      {/* keke rolling past — the living detail */}
      <g className="lko-sv-drive">
        <g transform="translate(0 388) scale(1.15)">
          {/* body */}
          <path d="M 0 30 L 5 12 Q 7 3 18 3 L 39 3 Q 48 3 50 12 L 52 30 Z" fill="#e8a317" />
          <path d="M 9 14 L 44 14 L 44 25 L 9 25 Z" fill="#fdf0d5" />
          {/* windshield */}
          <path d="M 13 6 L 34 6 Q 39 6 40 11 L 41 14 L 11 14 Z" fill="#bfe3dc" />
          {/* wheels + driver hint */}
          <circle cx="11" cy="31" r="6" fill="#241d16" />
          <circle cx="11" cy="31" r="2.4" fill="#8a8a82" />
          <circle cx="43" cy="31" r="6" fill="#241d16" />
          <circle cx="43" cy="31" r="2.4" fill="#8a8a82" />
          {/* headlight beam at night */}
          {m.windowsLit && <path d="M 52 18 L 78 14 L 78 26 L 52 24 Z" fill="#ffe9a8" opacity="0.4" />}
        </g>
      </g>

      {/* rain streaks */}
      {isRain && (
        <g stroke="#cfe4ee" strokeWidth="2" strokeLinecap="round" opacity="0.5">
          {RAIN_LINES.map((r, i) => (
            <path
              key={i}
              d={`M ${r.x} ${r.y} l -6 ${r.len}`}
              className="lko-sv-rain"
              style={{ animationDelay: r.d }}
            />
          ))}
        </g>
      )}

      {/* gentle cinematic scrim at the base (helps overlay text read) */}
      <rect y="330" width="800" height="120" fill="url(#ls-scrim)" opacity="0.5" />
    </svg>
  )
}
