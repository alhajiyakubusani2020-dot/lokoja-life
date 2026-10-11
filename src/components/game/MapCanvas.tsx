'use client'

/**
 * LOKOJA LIFE — MapCanvas (Stage "Real Explore" accuracy pass)
 * -------------------------------------------------------------
 * Original stylised 2D map of Lokoja, drawn north-up to match the REAL
 * geography of the city (verified against public references):
 *   • River Niger enters from the NORTH-WEST and curves east along the
 *     top of the map, north of the city and Mount Patti.
 *   • River Benue arrives from the EAST.
 *   • The two meet at the famous Confluence NORTH-EAST of the town.
 *   • The combined Niger then flows SOUTH along the town's eastern side —
 *     Lokoja is sandwiched between the Niger (east) and Mount Patti (west).
 *   • Mount Patti massif dominates the WEST with its summit trail.
 *   • Two road bridges cross the Niger: the Kogi Bridge road (east of
 *     Ganaja Junction) and the southern bypass (Felele side).
 * Markers are HTML buttons positioned by the same mapX/mapY grid the 3D
 * world derives its anchors from, so art and data can never drift apart.
 */

export function MapCanvas() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Stylised map of Lokoja showing the Niger and Benue rivers meeting at the Confluence, Mount Patti in the west and ten neighbourhoods"
    >
      <defs>
        <linearGradient id="lkoMapLand" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#efe4c0" />
          <stop offset="1" stopColor="#e4d2a0" />
        </linearGradient>
        <linearGradient id="lkoMapNiger" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#3d9481" />
          <stop offset="1" stopColor="#1c6b5e" />
        </linearGradient>
        <radialGradient id="lkoMapPatti" cx="0.42" cy="0.45" r="0.75">
          <stop offset="0" stopColor="#5d8a37" />
          <stop offset="0.72" stopColor="#4C7A2E" />
          <stop offset="1" stopColor="#3b6123" />
        </radialGradient>
      </defs>

      {/* ---------- land base + savanna texture ---------- */}
      <rect width="100" height="100" fill="url(#lkoMapLand)" />
      <ellipse cx="24" cy="14" rx="11" ry="5" fill="#cfe0b8" opacity="0.5" />
      <ellipse cx="86" cy="30" rx="9" ry="6" fill="#cfe0b8" opacity="0.45" />
      <ellipse cx="88" cy="88" rx="10" ry="6" fill="#d9e5c0" opacity="0.5" />
      <ellipse cx="14" cy="86" rx="9" ry="6" fill="#d9e5c0" opacity="0.45" />
      <ellipse cx="40" cy="22" rx="12" ry="6" fill="#d5e2bc" opacity="0.4" />

      {/* ---------- urban tint — the town between Patti and the Niger ---------- */}
      <ellipse cx="48" cy="58" rx="20" ry="17" fill="#f5e7c4" opacity="0.75" />
      <ellipse cx="52" cy="52" rx="14" ry="12" fill="#f8eed4" opacity="0.8" />

      {/* ---------- zone tints (under markers) ---------- */}
      <ellipse cx="30" cy="42" rx="7" ry="5" fill="#e5d9b8" opacity="0.8" />
      <ellipse cx="44" cy="30" rx="7" ry="5" fill="#c9d4b8" opacity="0.75" />
      <ellipse cx="62" cy="24" rx="6.5" ry="4.5" fill="#dbe7cf" opacity="0.8" />
      <ellipse cx="56" cy="52" rx="8" ry="6" fill="#f2d488" opacity="0.6" />
      <ellipse cx="44" cy="55" rx="6" ry="4.5" fill="#f6c9a0" opacity="0.65" />
      <ellipse cx="48" cy="66" rx="9" ry="6.5" fill="#fdf3dd" opacity="0.95" />
      <ellipse cx="64" cy="58" rx="7" ry="5.5" fill="#f0dcb0" opacity="0.75" />
      <ellipse cx="56" cy="78" rx="7" ry="5" fill="#e8d3a3" opacity="0.7" />
      <ellipse cx="68" cy="14" rx="7.5" ry="5.5" fill="#bfe0d4" opacity="0.6" />

      {/* ---------- Mount Patti massif (the town's western guardian) ---------- */}
      <path
        d="M 2 44 C 2 32 5 22 12 18 C 18 15 26 18 29 25 C 32 31 30 38 26 43 C 22 48 14 51 8 50 C 4 49 2 47 2 44 Z"
        fill="url(#lkoMapPatti)"
        opacity="0.85"
      />
      {/* contour ridgelines */}
      <path d="M 7 42 C 6 34 8 26 14 22" stroke="#3b6123" strokeWidth="1.2" fill="none" opacity="0.55" strokeLinecap="round" />
      <path d="M 11 45 C 9 37 12 28 18 24 C 21 22.5 24 23 26 25" stroke="#3b6123" strokeWidth="1.1" fill="none" opacity="0.45" strokeLinecap="round" />
      <path d="M 15 47 C 13 41 14 34 19 29" stroke="#3b6123" strokeWidth="1" fill="none" opacity="0.35" strokeLinecap="round" />
      {/* summit mark — Lord Lugard's rest house */}
      <g transform="translate(16.2 33.4)">
        <rect x="-1.7" y="-1" width="3.4" height="2" rx="0.4" fill="#f5efdd" stroke="#4A3418" strokeWidth="0.4" />
        <path d="M -2 -1 L 0 -2.6 L 2 -1 Z" fill="#8a4a2a" stroke="#4A3418" strokeWidth="0.3" />
      </g>
      <text x="4" y="55.5" fontSize="2.3" fontWeight="800" fill="#27401A" opacity="0.9">
        MOUNT PATTI
      </text>
      <text x="6.4" y="58.2" fontSize="1.6" fontWeight="600" fill="#27401A" opacity="0.65">
        458 m · summit trail
      </text>

      {/* ---------- rivers ---------- */}
      {/* River Niger — in from the north-west, curving east north of the city */}
      <path
        d="M -2 -2 C 6 2 14 4 24 7 C 34 10 46 10.5 56 11.2 C 60.5 11.5 65 11.8 68 12"
        stroke="url(#lkoMapNiger)"
        strokeWidth="5.2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M -2 -2 C 6 2 14 4 24 7 C 34 10 46 10.5 56 11.2 C 60.5 11.5 65 11.8 68 12"
        stroke="#5cb3a1"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* River Benue — arriving from the east */}
      <path
        d="M 104 8.6 C 96 9.6 88 10.6 80 11.2 C 76 11.5 71.5 11.8 68 12"
        stroke="url(#lkoMapNiger)"
        strokeWidth="4.4"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M 104 8.6 C 96 9.6 88 10.6 80 11.2 C 76 11.5 71.5 11.8 68 12" stroke="#5cb3a1" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* the combined Niger — flowing south past the town's eastern side */}
      <path
        d="M 68 12 C 69.5 15 70.4 18 70.6 22 C 71 27 71.4 33 71.6 39 C 71.9 45 72 50 71.4 55 C 70.7 60.5 69.8 66 69 71.5 C 68.2 77 67.4 82 67.2 87 C 67 92 67 98 67.2 104"
        stroke="url(#lkoMapNiger)"
        strokeWidth="6.2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 68 12 C 69.5 15 70.4 18 70.6 22 C 71 27 71.4 33 71.6 39 C 71.9 45 72 50 71.4 55 C 70.7 60.5 69.8 66 69 71.5 C 68.2 77 67.4 82 67.2 87 C 67 92 67 98 67.2 104"
        stroke="#5cb3a1"
        strokeWidth="2.1"
        fill="none"
        strokeLinecap="round"
        opacity="0.45"
      />
      {/* confluence swirl — where two great rivers meet */}
      <circle cx="68" cy="12" r="2.9" fill="#1c6b5e" opacity="0.75" />
      <circle cx="68" cy="12" r="1.3" fill="#ffffff" opacity="0.55" />
      <circle cx="68" cy="12" r="4.6" fill="none" stroke="#1c6b5e" strokeWidth="0.5" opacity="0.35" />

      {/* river labels */}
      <text x="22" y="4.6" fontSize="2.1" fill="#14574c" opacity="0.85" transform="rotate(8 22 4.6)" fontWeight="700">
        RIVER NIGER
      </text>
      <text x="84" y="6.6" fontSize="2.1" fill="#14574c" opacity="0.85" transform="rotate(-7 84 6.6)" fontWeight="700">
        RIVER BENUE
      </text>
      <text x="72.5" y="50" fontSize="2.1" fill="#14574c" opacity="0.85" transform="rotate(87 72.5 50)" fontWeight="700">
        RIVER NIGER
      </text>

      {/* ---------- roads (laterite) ---------- */}
      <g stroke="#c9a96b" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.9">
        {/* IBB Way: food strip ↔ kpata ↔ ganaja junction */}
        <path d="M 44 55 C 48 53.6 52 52.6 56 52 C 60 51.6 62.5 54.4 64 58" />
        {/* town spine: kpata ↔ home ↔ motor park */}
        <path d="M 56 52 C 53.5 57.5 50.5 62 48 66 C 49.5 69.5 53.5 74 56 78" />
        {/* Ganaja road hugging the west bank */}
        <path d="M 64 58 C 65.2 61.5 66 64.8 66 65.3 C 65.4 68.6 64.6 72.6 64.7 77.3" />
        {/* university road */}
        <path d="M 64 58 C 65.2 46.8 64.6 35.4 62 24" />
        {/* confluence viewpoint road */}
        <path d="M 62 24 C 60.4 21.4 59.4 19.6 58 18" />
        {/* Kogi Bridge road east */}
        <path d="M 64 58 C 68.5 59.4 72.4 59.9 76.7 60 C 79 60 80.6 59.7 82 59.3" />
        {/* southern bypass */}
        <path d="M 56 78 C 61.5 80.6 66 81.9 70.7 81.3 C 73.4 81 74.6 80.2 75.3 79.3" />
        {/* Patti foot road */}
        <path d="M 56 52 C 50.8 50.2 44 46.4 40 45.3 C 37 44.4 33.4 42.8 30 42" />
        {/* GRA road */}
        <path d="M 30 42 C 34.8 38 40 33.4 44 30" />
        {/* GRA ↔ IBB Way link */}
        <path d="M 44 30 C 43.2 40.6 43.8 48 44 55" />
        {/* Felele road south */}
        <path d="M 56 78 C 57.6 82.8 58.8 88 60.7 94.7" />
      </g>
      {/* Patti summit trail — dashed, climbing */}
      <g stroke="#b0812a" strokeWidth="1.7" fill="none" strokeLinecap="round" opacity="0.9" strokeDasharray="2.2 1.8">
        <path d="M 30 42 C 26.8 40.2 23.6 37.6 20.7 33.3 C 20 32 21.4 30.8 22 30 C 20 30.4 18 31.6 16.7 33.3" />
      </g>

      {/* two bridges over the Niger */}
      <g transform="rotate(85 71 60.2)">
        <rect x="67.8" y="59" width="6.4" height="2.4" rx="0.7" fill="#b0812a" stroke="#8a6a3b" strokeWidth="0.45" />
        <path d="M 69.4 59 L 69.4 61.4 M 71 59 L 71 61.4 M 72.6 59 L 72.6 61.4" stroke="#8a6a3b" strokeWidth="0.4" />
      </g>
      <g transform="rotate(96 68.7 82.2)">
        <rect x="65.5" y="81" width="6.4" height="2.4" rx="0.7" fill="#b0812a" stroke="#8a6a3b" strokeWidth="0.45" />
        <path d="M 67.1 81 L 67.1 83.4 M 68.7 81 L 68.7 83.4 M 70.3 81 L 70.3 83.4" stroke="#8a6a3b" strokeWidth="0.4" />
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
      <g transform="translate(92 94)">
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
