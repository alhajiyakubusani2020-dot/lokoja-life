'use client'

/**
 * LOKOJA LIFE — MapCanvas (Stage 6: real cartography)
 * -------------------------------------------------------------
 * The 2D map is now generated from the SAME real Lokoja data as the 3D
 * world (OpenStreetMap via scripts/geo → geo-map.ts): every mapped
 * street, the true Niger/Benue courses meeting at the real Confluence
 * south-east of the town, the actual stream bridges, and the real
 * suburb names (Adankolo, Filele, Felele, Crusher, Ganaja, Kpato…).
 *
 * Cartography rules kept from the Stage-4 pass:
 *   • Water = wide strokes with a sand rim + deep channel line.
 *   • Roads = 3-tier hierarchy (trunk / main / minor) with dark casing +
 *     laterite fill + centre dashes on trunk roads.
 *   • Mount Patti = nested contour bands + summit rest house + the real
 *     Patti Road trail dashes.
 *   • Deterministic, no Math.random(), no SVG filters. viewBox 0 0 100 100
 *     so the HTML marker overlay (positioned by the same grid) never drifts.
 *
 * Scale: 1 map unit = 6.2 world units = 161 m real.
 */

import { GEO_MAP_TRUNK, GEO_MAP_MAIN, GEO_MAP_MINOR, GEO_MAP_BRIDGES, GEO_MAP_LABELS, GEO_MAP_RIVERS } from './geo-map'
import { LOCATION_BY_ID } from '@/game/data/locations'

/** Mount Patti summit in map grid — the same data the 3D world uses */
const PATTI = LOCATION_BY_ID['mount-patti']
const PATTI_TRAILHEAD = { x: 41.7, y: 36.3 }

export function MapCanvas() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Real map of Lokoja: the Niger and Benue rivers meeting at the Confluence, Mount Patti in the north-west, the town's real street network, main roads with bridges, suburbs and a compass, scale bar and title cartouche"
    >
      {/* small screens: hide annotation-tier labels, keep districts + water */}
      <style>{`@media (max-width: 639px){ .lko-lbl-sm{ display:none } }`}</style>

      <defs>
        {/* warm savanna land */}
        <linearGradient id="lko4-land" x1="0" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor="#f3e9cb" />
          <stop offset="1" stopColor="#e5d3a4" />
        </linearGradient>
        {/* savanna grain — deterministic dot texture */}
        <pattern id="lko4-grain" width="2.7" height="2.3" patternUnits="userSpaceOnUse">
          <circle cx="0.6" cy="0.7" r="0.17" fill="#a8946a" opacity="0.2" />
          <circle cx="1.9" cy="1.7" r="0.13" fill="#b3a077" opacity="0.16" />
          <circle cx="1.3" cy="0.4" r="0.1" fill="#8f7c55" opacity="0.12" />
        </pattern>
      </defs>

      {/* ============================ LAND ============================ */}
      <rect width="100" height="100" fill="url(#lko4-land)" />
      <rect width="100" height="100" fill="url(#lko4-grain)" />

      {/* riverine lowland greenery along the real water courses */}
      <ellipse cx="49.5" cy="77" rx="7" ry="5" fill="#c9dcae" opacity="0.5" />
      <ellipse cx="66" cy="12" rx="7" ry="4" fill="#c9dcae" opacity="0.45" />
      <ellipse cx="57.5" cy="58" rx="3.4" ry="7" fill="#c9dcae" opacity="0.42" />
      <ellipse cx="55" cy="92" rx="5" ry="4" fill="#cfdcb2" opacity="0.4" />
      <ellipse cx="76" cy="30" rx="6" ry="4" fill="#c9dcae" opacity="0.4" />
      <ellipse cx="86" cy="41" rx="5" ry="3.6" fill="#cfdcb2" opacity="0.38" />
      <ellipse cx="66" cy="45" rx="3.4" ry="5" fill="#c9dcae" opacity="0.34" />
      {/* Patti footslope greenery */}
      <ellipse cx="33" cy="31" rx="8" ry="6" fill="#c9d8ab" opacity="0.5" />

      {/* ====================== URBAN DISTRICT WASHES ================= */}
      {Object.values(LOCATION_BY_ID).map((l) => (
        <circle
          key={l.id}
          cx={l.mapX}
          cy={l.mapY}
          r={l.id === 'mount-patti' || l.id === 'confluence' ? 4.6 : 3.6}
          fill="#f8efd6"
          opacity="0.62"
        />
      ))}

      {/* ====================== REAL STREET FABRIC ==================== */}
      {/* minor streets — the real residential grid, thin worn lines */}
      <g fill="none" stroke="#a8946a" strokeWidth="0.3" opacity="0.55" strokeLinecap="round">
        {GEO_MAP_MINOR.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {/* main roads — dark casing + laterite fill */}
      <g fill="none" strokeLinecap="round">
        <g stroke="#8f7c55" strokeWidth="1.12" opacity="0.9">
          {GEO_MAP_MAIN.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <g stroke="#d9b98a" strokeWidth="0.72">
          {GEO_MAP_MAIN.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </g>

      {/* trunk roads (A2 Okene/Abuja, IBB Way) — casing + asphalt + dashes */}
      <g fill="none" strokeLinecap="round">
        <g stroke="#6e5c3e" strokeWidth="1.7">
          {GEO_MAP_TRUNK.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <g stroke="#e8dcc3" strokeWidth="1.12">
          {GEO_MAP_TRUNK.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <g stroke="#a8865a" strokeWidth="0.16" strokeDasharray="1.1 1.3">
          {GEO_MAP_TRUNK.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </g>

      {/* =========================== WATER ============================ */}
      {/* sand rim → body → deep channel, per real river */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {GEO_MAP_RIVERS.map((r) => (
          <path key={`rim-${r.id}`} d={r.d} stroke="#cdb87f" strokeWidth={r.w + 1.5} opacity="0.9" />
        ))}
        {GEO_MAP_RIVERS.map((r) => (
          <path key={`body-${r.id}`} d={r.d} stroke="#2e7f86" strokeWidth={r.w} />
        ))}
        {GEO_MAP_RIVERS.map((r) => (
          <path key={`deep-${r.id}`} d={r.d} stroke="#175a64" strokeWidth={r.w * 0.42} opacity="0.75" />
        ))}
      </g>

      {/* the real stream bridges */}
      {GEO_MAP_BRIDGES.map(([x, y], i) => (
        <rect key={i} x={x - 1.05} y={y - 0.55} width="2.1" height="1.1" rx="0.24" fill="#e8dcc3" stroke="#6e5c3e" strokeWidth="0.14" />
      ))}

      {/* ========================= MOUNT PATTI ======================== */}
      <g>
        <ellipse cx={PATTI.mapX} cy={PATTI.mapY} rx="11.5" ry="9" fill="#b5c48b" opacity="0.55" transform={`rotate(-18 ${PATTI.mapX} ${PATTI.mapY})`} />
        <ellipse cx={PATTI.mapX} cy={PATTI.mapY} rx="9" ry="7" fill="#93ab6b" opacity="0.6" transform={`rotate(-18 ${PATTI.mapX} ${PATTI.mapY})`} />
        <ellipse cx={PATTI.mapX} cy={PATTI.mapY} rx="6.4" ry="5" fill="#6f9450" opacity="0.62" transform={`rotate(-18 ${PATTI.mapX} ${PATTI.mapY})`} />
        <ellipse cx={PATTI.mapX} cy={PATTI.mapY} rx="3.6" ry="2.9" fill="#587a3e" transform={`rotate(-18 ${PATTI.mapX} ${PATTI.mapY})`} />
        {/* summit rest house (Lugard's) */}
        <rect x={PATTI.mapX - 0.8} y={PATTI.mapY - 0.6} width="1.6" height="1.2" rx="0.2" fill="#f3e9cb" stroke="#4a3418" strokeWidth="0.18" />
        {/* the real Patti Road up the mount */}
        <path
          d={`M ${PATTI_TRAILHEAD.x} ${PATTI_TRAILHEAD.y} L 40.2 35.3 L 38.9 33.9 L 39.4 32.1 L 37.9 30.8 L 36.6 29.3 L ${PATTI.mapX} ${PATTI.mapY}`}
          fill="none"
          stroke="#4a3418"
          strokeWidth="0.3"
          strokeDasharray="0.7 0.6"
          opacity="0.75"
        />
      </g>

      {/* ======================= CONFLUENCE MARK ====================== */}
      {/* the famous meeting point — a small swirl where the courses join */}
      <g opacity="0.85">
        <circle cx="49.5" cy="77.6" r="1.7" fill="none" stroke="#d9d2c0" strokeWidth="0.22" />
        <path d="M 48.4 77.2 C 49 76.4 50.2 76.5 50.6 77.3 C 51 78.1 50.3 78.9 49.5 78.7" fill="none" stroke="#d9d2c0" strokeWidth="0.2" />
      </g>

      {/* ============================ LABELS ========================== */}
      {/* real suburb + village names (hidden on small screens) */}
      {GEO_MAP_LABELS.map((l) => (
        <text
          key={l.name}
          className="lko-lbl-sm"
          x={l.x}
          y={l.y - 0.9}
          fontSize="1.55"
          fontWeight="700"
          fill={l.kind === 'suburb' ? '#5c4a28' : '#6b5a36'}
          letterSpacing="0.16"
          textAnchor="middle"
          stroke="#f1e7c8"
          strokeWidth="0.42"
          paintOrder="stroke"
        >
          {l.name}
        </text>
      ))}
      {/* the rivers themselves */}
      {GEO_MAP_RIVERS.filter((r) => r.name).map((r) => (
        <text
          key={`lbl-${r.id}`}
          className="lko-lbl-sm"
          x={r.lx}
          y={r.ly}
          fontSize="2.1"
          fontWeight="700"
          fill="#0d4148"
          letterSpacing="0.3"
          textAnchor="middle"
          transform={`rotate(${r.rot} ${r.lx} ${r.ly})`}
          stroke="#e8f0e2"
          strokeWidth="0.4"
          paintOrder="stroke"
        >
          {r.name}
        </text>
      ))}

      {/* =========================== CARTOUCHE ======================== */}
      <g>
        <rect x="2.2" y="2.2" width="30" height="10.4" rx="1.4" fill="#f8efd6" opacity="0.94" stroke="#a14e2a" strokeWidth="0.28" />
        <text x="4" y="6.2" fontSize="3" fontWeight="800" fill="#7a3a1e" letterSpacing="0.12">
          LOKOJA
        </text>
        <text x="4" y="9.4" fontSize="1.45" fontWeight="700" fill="#56683d" letterSpacing="0.24">
          KOGI STATE · NIGERIA
        </text>
        <text x="4" y="11.6" fontSize="1.15" fontWeight="600" fill="#8a7a58" letterSpacing="0.14">
          THE CONFLUENCE CITY · REAL STREET MAP
        </text>
      </g>

      {/* ============================ COMPASS ========================= */}
      <g transform="translate(93.4 88.6)">
        <circle r="4.4" fill="#f8efd6" opacity="0.92" stroke="#a14e2a" strokeWidth="0.26" />
        <path d="M -1.7 0.7 L 0 -2 L 1.7 0.7 Z" fill="#a14e2a" stroke="#4a3418" strokeWidth="0.22" />
        <text y="-4.9" fontSize="2.2" fontWeight="800" fill="#7a3a1e" textAnchor="middle">
          N
        </text>
      </g>

      {/* ========================== SCALE BAR ========================= */}
      <g transform="translate(60 95.4)">
        <rect x="-0.6" y="-1.5" width="27.4" height="3" rx="0.7" fill="#f8efd6" opacity="0.9" stroke="#a14e2a" strokeWidth="0.2" />
        <path d="M 0 0 L 12.4 0" stroke="#5c4a28" strokeWidth="0.34" />
        <path d="M 0 -0.8 L 0 0.8 M 6.2 -0.55 L 6.2 0.55 M 12.4 -0.8 L 12.4 0.8" stroke="#5c4a28" strokeWidth="0.3" />
        <text x="0" y="2.1" fontSize="1.05" fontWeight="700" fill="#5c4a28" textAnchor="middle">
          0
        </text>
        <text x="6.2" y="2.1" fontSize="1.05" fontWeight="700" fill="#5c4a28" textAnchor="middle">
          1 km
        </text>
        <text x="12.4" y="2.1" fontSize="1.05" fontWeight="700" fill="#5c4a28" textAnchor="middle">
          2 km
        </text>
      </g>
    </svg>
  )
}
