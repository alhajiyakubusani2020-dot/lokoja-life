'use client'

/**
 * LOKOJA LIFE — MapCanvas
 * ------------------------
 * Original stylised 2D map of Lokoja (no external map API, no assets):
 *   • River Niger flowing in from the north-west, River Benue from the
 *     east, meeting at the famous Confluence (south-east) — matching the
 *     location data coordinates.
 *   • Mount Patti green mass on the west bank, one river bridge on the
 *     Kpata–Patti road, laterite roads radiating from Ganaja Junction.
 *   • Soft zone tints: market, residential, GRA, university, motor park,
 *     food strip, riverside.
 * Markers are HTML buttons positioned by the same mapX/mapY grid, so the
 * art and the data can never drift apart.
 */

export function MapCanvas() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Stylised map of Lokoja showing the Niger and Benue rivers, Mount Patti and ten neighbourhoods"
    >
      <defs>
        <linearGradient id="lkoMapLand" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#efe4c0" />
          <stop offset="1" stopColor="#e6d6a8" />
        </linearGradient>
        <linearGradient id="lkoMapNiger" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3d9481" />
          <stop offset="1" stopColor="#1c6b5e" />
        </linearGradient>
      </defs>

      {/* ---------- land base + texture ---------- */}
      <rect width="100" height="100" fill="url(#lkoMapLand)" />
      <ellipse cx="14" cy="46" rx="10" ry="7" fill="#cfe0b8" opacity="0.55" />
      <ellipse cx="88" cy="18" rx="9" ry="6" fill="#cfe0b8" opacity="0.5" />
      <ellipse cx="90" cy="88" rx="10" ry="6" fill="#d9e5c0" opacity="0.5" />
      <ellipse cx="12" cy="78" rx="8" ry="5" fill="#d9e5c0" opacity="0.45" />

      {/* ---------- zone tints (under markers) ---------- */}
      <ellipse cx="30" cy="52" rx="8" ry="6" fill="#f2d488" opacity="0.55" />
      <ellipse cx="50" cy="72" rx="9" ry="6.5" fill="#fdf3dd" opacity="0.9" />
      <ellipse cx="58" cy="18" rx="7" ry="5" fill="#c9d4b8" opacity="0.7" />
      <ellipse cx="74" cy="28" rx="6.5" ry="4.5" fill="#dbe7cf" opacity="0.75" />
      <ellipse cx="60" cy="80" rx="7" ry="5" fill="#e8d3a3" opacity="0.65" />
      <ellipse cx="46" cy="62" rx="6" ry="4.5" fill="#f6c9a0" opacity="0.6" />
      <ellipse cx="68" cy="44" rx="7" ry="5.5" fill="#f0dcb0" opacity="0.7" />
      <ellipse cx="42" cy="30" rx="6" ry="4.5" fill="#e5d9b8" opacity="0.7" />
      <ellipse cx="82" cy="68" rx="7.5" ry="6" fill="#bfe0d4" opacity="0.65" />

      {/* ---------- Mount Patti mass (west bank) ---------- */}
      <path
        d="M 2 30 C 4 18 10 10 18 9 C 26 10 31 16 32 25 C 33 33 29 30 24 33 C 17 36 8 36 2 30 Z"
        fill="#4C7A2E"
        opacity="0.6"
      />
      <path d="M 8 24 C 11 17 16 13 21 13" stroke="#3b6123" strokeWidth="1.4" fill="none" opacity="0.5" strokeLinecap="round" />
      <path d="M 10 29 C 14 24 19 21 25 21" stroke="#3b6123" strokeWidth="1.4" fill="none" opacity="0.4" strokeLinecap="round" />

      {/* ---------- rivers ---------- */}
      {/* River Niger — from the north-west, past Mount Patti's east side */}
      <path
        d="M 2 24 C 10 27 18 33 24 43 C 28 51 26 59 30 67 C 36 79 52 87 68 85 C 74 84 79 82 83 79"
        stroke="url(#lkoMapNiger)"
        strokeWidth="5.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 2 24 C 10 27 18 33 24 43 C 28 51 26 59 30 67 C 36 79 52 87 68 85 C 74 84 79 82 83 79"
        stroke="#5cb3a1"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* River Benue — arriving from the east */}
      <path
        d="M 102 52 C 94 54 88 58 84 64"
        stroke="url(#lkoMapNiger)"
        strokeWidth="4.5"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M 102 52 C 94 54 88 58 84 64" stroke="#5cb3a1" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* merged flow to the sea */}
      <path
        d="M 83 70 C 80 80 79 90 80 102"
        stroke="url(#lkoMapNiger)"
        strokeWidth="6.5"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M 83 70 C 80 80 79 90 80 102" stroke="#5cb3a1" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.45" />
      {/* confluence swirl */}
      <circle cx="83" cy="67" r="2.6" fill="#1c6b5e" opacity="0.7" />
      <circle cx="83" cy="67" r="1.2" fill="#ffffff" opacity="0.5" />

      {/* river labels */}
      <text x="16" y="52" fontSize="2.1" fill="#14574c" opacity="0.85" transform="rotate(64 16 52)" fontWeight="700">
        RIVER NIGER
      </text>
      <text x="90" y="50" fontSize="2.1" fill="#14574c" opacity="0.85" transform="rotate(24 90 50)" fontWeight="700">
        RIVER BENUE
      </text>

      {/* ---------- roads (laterite) radiating from Ganaja Junction ---------- */}
      <g stroke="#c9a96b" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.9">
        <path d="M 68 44 C 55 46 40 48 30 52" />
        <path d="M 68 44 C 66 34 62 26 58 18" />
        <path d="M 68 44 C 70 38 72 33 74 28" />
        <path d="M 68 44 C 58 40 50 34 42 30" />
        <path d="M 68 44 C 66 56 62 68 60 80" />
        <path d="M 68 44 C 74 52 78 60 82 68" />
        <path d="M 68 44 C 60 54 54 64 50 72" />
      </g>
      <g stroke="#c9a96b" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.75" strokeDasharray="3 2.4">
        <path d="M 30 52 C 35 56 40 60 46 62" />
        <path d="M 46 62 C 47 66 48 69 50 72" />
        <path d="M 50 72 C 54 74 57 77 60 80" />
        <path d="M 60 80 C 70 79 76 74 82 69" />
        <path d="M 30 52 C 26 44 22 32 19 22" />
      </g>

      {/* the one bridge: Kpata road crossing the Niger to Mount Patti */}
      <g transform="rotate(38 25 43)">
        <rect x="21.6" y="41.7" width="7" height="2.6" rx="0.8" fill="#b0812a" stroke="#8a6a3b" strokeWidth="0.5" />
        <path d="M 23 41.7 L 23 44.3 M 25 41.7 L 25 44.3 M 27 41.7 L 27 44.3" stroke="#8a6a3b" strokeWidth="0.45" />
      </g>

      {/* ---------- cartouche + compass ---------- */}
      <g>
        <rect x="2.5" y="2.5" width="24" height="8.5" rx="2" fill="#fffdf7" opacity="0.92" stroke="#0b3d22" strokeWidth="0.4" />
        <text x="4.5" y="6.4" fontSize="3" fontWeight="800" fill="#0b3d22">
          LOKOJA
        </text>
        <text x="4.5" y="9.6" fontSize="1.7" fontWeight="600" fill="#8a5a00">
          KOGI STATE • NIGERIA
        </text>
      </g>
      <g transform="translate(92 10)">
        <circle r="4.6" fill="#fffdf7" opacity="0.92" stroke="#0b3d22" strokeWidth="0.4" />
        <path d="M 0 -3 L 1.4 1.6 L 0 0.8 L -1.4 1.6 Z" fill="#c4562a" />
        <text x="-0.9" y="3.9" fontSize="1.7" fontWeight="800" fill="#0b3d22">
          N
        </text>
      </g>

      {/* map frame */}
      <rect x="0.4" y="0.4" width="99.2" height="99.2" fill="none" stroke="#0b3d22" strokeWidth="0.8" opacity="0.25" rx="2" />
    </svg>
  )
}
