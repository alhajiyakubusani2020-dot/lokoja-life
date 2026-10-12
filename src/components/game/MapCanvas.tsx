'use client'

/**
 * LOKOJA LIFE — MapCanvas (Stage 4 cartography rebuild)
 * -------------------------------------------------------------
 * A complete hand-authored premium 2D map of Lokoja, drawn north-up to
 * the REAL geography (verified against public references):
 *   • River Niger enters from the NORTH-WEST and curves east along the
 *     top of the map, north of the city and Mount Patti.
 *   • River Benue arrives from the EAST.
 *   • The two meet at the famous Confluence NORTH-EAST of the town —
 *     drawn as a proper Y/V meeting with a widened basin, sandbanks
 *     and a swirl mark.
 *   • The combined Niger then flows SOUTH along the town's eastern side
 *     (two road bridges cross it), with Lokoja sandwiched between the
 *     river (east) and Mount Patti (west, 458 m, Lugard's rest house).
 *
 * Cartography rules of this pass:
 *   • Water = FILLED polygons with a shallow rim, a deep channel and a
 *     darker mid-line — never strokes that could read as roads.
 *   • Roads = 3-tier hierarchy (trunk / secondary / minor) with dark
 *     casing + laterite fill + centre dashes on trunk roads, and name
 *     labels along the main spines.
 *   • Urban fabric = clipped street grid + clustered building blocks,
 *     dense at Kpata/market and thinning to Felele/Adankolo/Otokiti.
 *   • Mount Patti = nested contour bands + ridge hachures + summit
 *     plateau with rest house + dashed switchback summit trail.
 *
 * Every shape is drawn AROUND the fixed mapX/mapY pins in locations.ts
 * (the single source of truth shared with the 3D world) — pins always
 * sit on the correct feature. Everything is deterministic: no
 * Math.random(), no SVG filters. viewBox stays 0 0 100 100 so the
 * HTML markers overlay (positioned by the same grid) never drift.
 */

export function MapCanvas() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Stylised premium map of Lokoja: the Niger and Benue rivers meeting at the Confluence, Mount Patti in the west, the town's street grid and districts, main roads with bridges and a compass, scale bar and title cartouche"
    >
      {/* small screens: hide annotation-tier labels, keep districts + water */}
      <style>{`@media (max-width: 639px){ .lko-lbl-sm{ display:none } }`}</style>

      <defs>
        {/* warm savanna land */}
        <linearGradient id="lko4-land" x1="0" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor="#f3e9cb" />
          <stop offset="1" stopColor="#e5d3a4" />
        </linearGradient>
        {/* confluence basin — deeper at the heart of the whirl */}
        <radialGradient id="lko4-pool" cx="0.46" cy="0.42" r="0.75">
          <stop offset="0" stopColor="#175a64" />
          <stop offset="0.62" stopColor="#23707a" />
          <stop offset="1" stopColor="#2c7f80" />
        </radialGradient>
        {/* savanna grain — deterministic dot texture */}
        <pattern id="lko4-grain" width="2.7" height="2.3" patternUnits="userSpaceOnUse">
          <circle cx="0.6" cy="0.7" r="0.17" fill="#a8946a" opacity="0.2" />
          <circle cx="1.9" cy="1.7" r="0.13" fill="#b3a077" opacity="0.16" />
          <circle cx="1.3" cy="0.4" r="0.1" fill="#8f7c55" opacity="0.12" />
        </pattern>
        {/* the built-up area — street grid is clipped to this shape */}
        <clipPath id="lko4-townClip">
          <path d="M 31 41 C 33.5 31.5 40 23.5 48.5 22.3 C 55.5 21.3 61.3 24 64.4 28.6 C 67.2 32.8 67.6 38.4 66.8 44.4 C 66 50.4 65.4 56.4 65.4 61.6 C 65.4 66.8 64.6 71.6 62.8 75.6 C 61 79.6 56.8 82.4 51.4 82.9 C 46 83.4 40.4 81.2 36.8 77.2 C 33.2 73.2 31.2 67.6 30.8 61.6 C 30.4 55.6 29.6 46.5 31 41 Z" />
        </clipPath>

        {/* building-row stamps (two tones, baked) — reused with <use> */}
        <g id="lko4-rowA">
          <rect x="0" y="0" width="1.15" height="0.8" rx="0.12" fill="#d3b787" />
          <rect x="1.55" y="0.05" width="1.15" height="0.75" rx="0.12" fill="#dfc79b" />
          <rect x="3.1" y="0" width="1.1" height="0.8" rx="0.12" fill="#c8a97b" />
          <rect x="4.65" y="0.05" width="1.15" height="0.75" rx="0.12" fill="#dfc79b" />
          <rect x="6.2" y="0" width="1.1" height="0.8" rx="0.12" fill="#d3b787" />
        </g>
        <g id="lko4-rowB">
          <rect x="0" y="0" width="0.95" height="1.05" rx="0.12" fill="#dfc79b" />
          <rect x="1.35" y="0.05" width="0.9" height="1" rx="0.12" fill="#c8a97b" />
          <rect x="2.7" y="0" width="0.95" height="1.05" rx="0.12" fill="#d3b787" />
          <rect x="4.05" y="0.05" width="0.9" height="1" rx="0.12" fill="#dfc79b" />
        </g>
        <g id="lko4-rowC">
          <rect x="0" y="0.15" width="0.62" height="0.62" rx="0.1" fill="#c8a97b" />
          <rect x="0.95" y="0.15" width="0.6" height="0.6" rx="0.1" fill="#dfc79b" />
          <rect x="1.9" y="0.15" width="0.62" height="0.62" rx="0.1" fill="#c9a97b" />
          <rect x="2.85" y="0.15" width="0.6" height="0.6" rx="0.1" fill="#d3b787" />
          <rect x="3.8" y="0.15" width="0.62" height="0.62" rx="0.1" fill="#dfc79b" />
          <rect x="4.75" y="0.15" width="0.6" height="0.6" rx="0.1" fill="#c8a97b" />
          <rect x="5.7" y="0.15" width="0.62" height="0.62" rx="0.1" fill="#d3b787" />
        </g>
      </defs>

      {/* ============================ LAND ============================ */}
      <rect width="100" height="100" fill="url(#lko4-land)" />
      <rect width="100" height="100" fill="url(#lko4-grain)" />

      {/* lowland greenery near the rivers + dusty ground near markets */}
      <ellipse cx="60" cy="15.5" rx="9" ry="4.4" fill="#c9dcae" opacity="0.5" />
      <ellipse cx="76" cy="24" rx="6" ry="4.5" fill="#c9dcae" opacity="0.42" />
      <ellipse cx="85" cy="18.5" rx="5" ry="3.4" fill="#cfdcb2" opacity="0.4" />
      <ellipse cx="63" cy="46" rx="4.5" ry="7" fill="#c9dcae" opacity="0.38" />
      <ellipse cx="73" cy="72" rx="5" ry="6" fill="#c9dcae" opacity="0.4" />
      <ellipse cx="12" cy="62" rx="6" ry="5" fill="#ccdcae" opacity="0.38" />
      <ellipse cx="56" cy="53" rx="6.5" ry="4" fill="#e9d3a4" opacity="0.5" />
      <ellipse cx="56" cy="78" rx="5" ry="3" fill="#e9d3a4" opacity="0.42" />
      <ellipse cx="44" cy="55" rx="4" ry="2.6" fill="#e9d3a4" opacity="0.36" />
      <ellipse cx="61.5" cy="24" rx="4.5" ry="3.4" fill="#cfe0b4" opacity="0.5" />
      <ellipse cx="44" cy="30" rx="5" ry="4" fill="#c9d8ab" opacity="0.5" />

      {/* ======================= URBAN FABRIC ======================== */}
      {/* town wash (between Mount Patti and the Niger) */}
      <path
        d="M 31 41 C 33.5 31.5 40 23.5 48.5 22.3 C 55.5 21.3 61.3 24 64.4 28.6 C 67.2 32.8 67.6 38.4 66.8 44.4 C 66 50.4 65.4 56.4 65.4 61.6 C 65.4 66.8 64.6 71.6 62.8 75.6 C 61 79.6 56.8 82.4 51.4 82.9 C 46 83.4 40.4 81.2 36.8 77.2 C 33.2 73.2 31.2 67.6 30.8 61.6 C 30.4 55.6 29.6 46.5 31 41 Z"
        fill="#f8efd6"
        opacity="0.88"
      />
      {/* faint irregular street grid, clipped to the town shape */}
      <g clipPath="url(#lko4-townClip)">
        <g transform="rotate(-8 48 52)" stroke="#93805b" strokeWidth="0.17" opacity="0.32">
          {/* avenues (roughly N–S) */}
          <path d="M 30 18 L 30 88 M 33.4 18 L 33.4 88 M 36.8 18 L 36.8 88 M 40.2 18 L 40.2 88 M 43.6 18 L 43.6 88 M 47 18 L 47 88 M 50.4 18 L 50.4 88 M 53.8 18 L 53.8 88 M 57.2 18 L 57.2 88 M 60.6 18 L 60.6 88 M 64 18 L 64 88 M 67.4 18 L 67.4 88" />
          {/* streets (roughly E–W) */}
          <path d="M 26 21 L 71 21 M 26 24.3 L 71 24.3 M 26 27.6 L 71 27.6 M 26 30.9 L 71 30.9 M 26 34.2 L 71 34.2 M 26 37.5 L 71 37.5 M 26 40.8 L 71 40.8 M 26 44.1 L 71 44.1 M 26 47.4 L 71 47.4 M 26 50.7 L 71 50.7 M 26 54 L 71 54 M 26 57.3 L 71 57.3 M 26 60.6 L 71 60.6 M 26 63.9 L 71 63.9 M 26 67.2 L 71 67.2 M 26 70.5 L 71 70.5 M 26 73.8 L 71 73.8 M 26 77.1 L 71 77.1 M 26 80.4 L 71 80.4 M 26 83.7 L 71 83.7" />
        </g>
        {/* market lanes around Kpata */}
        <path d="M 52.2 50.4 L 61.2 49.4 M 52.8 53.9 L 60.6 52.7 M 54.8 47 L 56.6 55.8" stroke="#93805b" strokeWidth="0.2" opacity="0.4" fill="none" />
      </g>

      {/* building clusters — dense at the Kpata/market core */}
      <g transform="translate(51.2 47.2) rotate(-6)">
        <use href="#lko4-rowA" />
      </g>
      <g transform="translate(50.2 49.6) rotate(-4) scale(0.95)">
        <use href="#lko4-rowB" />
      </g>
      <g transform="translate(58.6 48.2) rotate(8)">
        <use href="#lko4-rowC" />
      </g>
      <g transform="translate(52.4 55.6) rotate(-7) scale(1.05)">
        <use href="#lko4-rowA" />
      </g>
      <g transform="translate(59.4 53.4) rotate(14)">
        <use href="#lko4-rowB" />
      </g>
      <g transform="translate(55.6 44.4) rotate(-2) scale(0.9)">
        <use href="#lko4-rowC" />
      </g>
      <g transform="translate(48.6 51.4) rotate(-12)">
        <use href="#lko4-rowC" />
      </g>
      <g transform="translate(60.2 50.4) rotate(24) scale(0.85)">
        <use href="#lko4-rowC" />
      </g>
      {/* spine north (Murtala / University corridor) */}
      <g transform="translate(54.2 40.2) rotate(-4)">
        <use href="#lko4-rowA" />
      </g>
      <g transform="translate(57.4 35.4) rotate(6) scale(0.95)">
        <use href="#lko4-rowB" />
      </g>
      <g transform="translate(53 44.2) rotate(-8) scale(0.9)">
        <use href="#lko4-rowC" />
      </g>
      <g transform="translate(58.2 42.6) rotate(4)">
        <use href="#lko4-rowC" />
      </g>
      {/* GRA — leafy, spaced bungalows */}
      <g transform="translate(41.4 27.6) rotate(-4) scale(1.1)">
        <use href="#lko4-rowB" />
      </g>
      <g transform="translate(44.8 31.2) rotate(6) scale(0.95)">
        <use href="#lko4-rowA" />
      </g>
      <g transform="translate(42.2 33) rotate(-9) scale(0.85)">
        <use href="#lko4-rowC" />
      </g>
      {/* historic quarter at the Patti foot */}
      <g transform="translate(28.6 39.4) rotate(-8) scale(0.9)">
        <use href="#lko4-rowC" />
      </g>
      <g transform="translate(31.6 43.8) rotate(-4) scale(0.85)">
        <use href="#lko4-rowB" />
      </g>
      <g transform="translate(27.4 44.2) rotate(10) scale(0.8)">
        <use href="#lko4-rowC" />
      </g>
      {/* Adankolo (north-east) */}
      <g transform="translate(57 20.6) rotate(-6) scale(0.9)">
        <use href="#lko4-rowC" />
      </g>
      <g transform="translate(60.6 18.6) rotate(4) scale(0.85)">
        <use href="#lko4-rowB" />
      </g>
      <g transform="translate(63.4 21.2) rotate(-10) scale(0.8)">
        <use href="#lko4-rowC" />
      </g>
      {/* southern residential (Home / Felele side) */}
      <g transform="translate(44.4 62.4) rotate(-6)">
        <use href="#lko4-rowA" />
      </g>
      <g transform="translate(49.6 63.4) rotate(5) scale(0.95)">
        <use href="#lko4-rowB" />
      </g>
      <g transform="translate(43.2 67.8) rotate(-3) scale(0.9)">
        <use href="#lko4-rowC" />
      </g>
      <g transform="translate(49.2 70.4) rotate(8) scale(0.9)">
        <use href="#lko4-rowA" />
      </g>
      <g transform="translate(45.8 74.4) rotate(-5) scale(0.85)">
        <use href="#lko4-rowC" />
      </g>
      {/* motor park / Felele edge */}
      <g transform="translate(52.4 74.2) rotate(-4) scale(0.95)">
        <use href="#lko4-rowC" />
      </g>
      <g transform="translate(58.4 73.6) rotate(6) scale(0.9)">
        <use href="#lko4-rowB" />
      </g>
      <g transform="translate(51 79.4) rotate(-8) scale(0.85)">
        <use href="#lko4-rowC" />
      </g>
      <g transform="translate(57 80.2) rotate(4) scale(0.8)">
        <use href="#lko4-rowC" />
      </g>
      {/* Ganaja riverside strip + Otokiti */}
      <g transform="translate(61.2 60.4) rotate(14) scale(0.85)">
        <use href="#lko4-rowC" />
      </g>
      <g transform="translate(62.2 65.8) rotate(4) scale(0.85)">
        <use href="#lko4-rowC" />
      </g>
      <g transform="translate(61 71.6) rotate(-6) scale(0.8)">
        <use href="#lko4-rowC" />
      </g>
      <g transform="translate(56.2 68.6) rotate(7) scale(0.85)">
        <use href="#lko4-rowC" />
      </g>
      {/* a few standalone core buildings */}
      <rect x="57.6" y="55.2" width="1.5" height="1" rx="0.14" fill="#c8a97b" transform="rotate(10 58.3 55.7)" />
      <rect x="53.8" y="46.2" width="1.4" height="0.95" rx="0.14" fill="#dfc79b" transform="rotate(-6 54.5 46.7)" />
      <rect x="60.4" y="45.6" width="1.2" height="0.9" rx="0.14" fill="#d3b787" />
      <rect x="46.8" y="56.6" width="1.3" height="0.9" rx="0.14" fill="#dfc79b" transform="rotate(-8 47.4 57)" />
      <rect x="55.2" y="58.6" width="1.4" height="0.95" rx="0.14" fill="#c8a97b" transform="rotate(6 55.9 59)" />
      <rect x="50.4" y="43.8" width="1.2" height="0.85" rx="0.14" fill="#d3b787" />
      <rect x="59" y="57.8" width="1.2" height="0.85" rx="0.14" fill="#dfc79b" transform="rotate(-12 59.6 58.2)" />
      <rect x="47.8" y="60.2" width="1.3" height="0.9" rx="0.14" fill="#c8a97b" />

      {/* Kpata Market ground + stalls (marker pin sits right here) */}
      <path
        d="M 53.2 49.8 C 55 48.6 58 48.4 59.8 49.4 C 61.2 50.2 61.6 52 60.8 53.4 C 59.8 55 57.4 55.8 55.4 55.4 C 53.4 55 52 53.6 52.2 51.8 C 52.3 51 52.6 50.3 53.2 49.8 Z"
        fill="#f4d9a4"
        stroke="#d3a75c"
        strokeWidth="0.22"
      />
      <g opacity="0.85">
        <circle cx="54.2" cy="50.8" r="0.26" fill="#c4562a" />
        <circle cx="55.7" cy="50.2" r="0.26" fill="#8a5a00" />
        <circle cx="57.1" cy="50.7" r="0.26" fill="#0b6b45" />
        <circle cx="58.5" cy="51.3" r="0.26" fill="#c4562a" />
        <circle cx="59.4" cy="52.5" r="0.26" fill="#8a5a00" />
        <circle cx="58" cy="53.4" r="0.26" fill="#0b6b45" />
        <circle cx="56.4" cy="53.9" r="0.26" fill="#c4562a" />
        <circle cx="54.9" cy="53.2" r="0.26" fill="#8a5a00" />
        <circle cx="53.7" cy="52" r="0.26" fill="#0b6b45" />
      </g>

      {/* Motor Park apron + waiting kekes (marker pin sits here) */}
      <path
        d="M 53.6 75.6 C 55.4 74.9 57.8 74.8 59.2 75.4 C 59.8 76.6 59.9 78 59.4 79.2 C 57.6 79.9 55.2 80 53.9 79.4 C 53.4 78.2 53.3 76.8 53.6 75.6 Z"
        fill="#ecd6a6"
        opacity="0.9"
        stroke="#cbb083"
        strokeWidth="0.16"
      />
      <rect x="54.7" y="76.4" width="0.78" height="0.46" rx="0.12" fill="#b5652f" transform="rotate(80 55.1 76.6)" />
      <rect x="56.4" y="77.6" width="0.78" height="0.46" rx="0.12" fill="#0b6b45" transform="rotate(84 56.8 77.8)" />
      <rect x="58" y="76.7" width="0.78" height="0.46" rx="0.12" fill="#8a5a00" transform="rotate(78 58.4 76.9)" />

      {/* University campus blocks + pitch (marker pin sits here) */}
      <rect x="60.4" y="22.8" width="1.7" height="0.95" rx="0.16" fill="#b3926a" />
      <rect x="62.4" y="22.3" width="1.6" height="0.9" rx="0.16" fill="#c8a97b" />
      <rect x="61.4" y="24.8" width="1.7" height="0.9" rx="0.16" fill="#b3926a" />
      <ellipse cx="64.6" cy="26.2" rx="1.5" ry="1" fill="#bcd6a0" opacity="0.85" />

      {/* trees — GRA, Adankolo, riverfront, foot of Patti */}
      <g fill="#a5bc80" opacity="0.6">
        <circle cx="40.2" cy="28.2" r="0.5" />
        <circle cx="47.4" cy="27" r="0.55" />
        <circle cx="46.4" cy="33.6" r="0.45" />
        <circle cx="41" cy="33.8" r="0.5" />
        <circle cx="48.6" cy="30.4" r="0.4" />
        <circle cx="58.6" cy="21.8" r="0.5" />
        <circle cx="62" cy="19.6" r="0.45" />
        <circle cx="64.8" cy="24" r="0.45" />
        <circle cx="64" cy="41" r="0.5" />
        <circle cx="63.4" cy="49" r="0.45" />
        <circle cx="63" cy="55.6" r="0.5" />
        <circle cx="62.4" cy="52.2" r="0.4" />
        <circle cx="52.6" cy="84.6" r="0.5" />
        <circle cx="59.8" cy="84.2" r="0.45" />
        <circle cx="25.4" cy="47.6" r="0.5" />
        <circle cx="27.2" cy="49.8" r="0.45" />
        <circle cx="33" cy="47" r="0.5" />
        <circle cx="60.2" cy="67" r="0.45" />
        <circle cx="63.8" cy="70.6" r="0.4" />
      </g>

      {/* ======================== MOUNT PATTI ======================== */}
      {/* nested contour bands, darker toward the summit plateau */}
      <path
        d="M 0 26 C 1.5 18.5 6.5 12.8 13 12.2 C 19.5 11.6 25 14.4 28.2 19.4 C 31 23.8 31.6 29.4 30.2 34.6 C 28.8 39.8 26 44.2 22.2 47.8 C 18.2 51.6 12.6 52.8 7.8 51.2 C 3.4 49.7 0.6 46.2 0 42 Z"
        fill="#c6d39e"
      />
      <path
        d="M 2.8 27.2 C 4 21 8.2 16.6 13.6 16.2 C 19 15.8 23.4 18.2 26 22.4 C 28.4 26.2 28.8 30.8 27.6 35.2 C 26.4 39.6 24 43.4 20.8 46.4 C 17.4 49.6 12.8 50.6 9 49.2 C 5.4 47.9 3.2 44.8 2.8 41 Z"
        fill="#b0c385"
      />
      <path
        d="M 6.2 28.6 C 7.2 23.6 10.4 20.2 14.6 19.9 C 18.8 19.6 22 21.6 24 25 C 25.8 28.2 26 32 25 35.6 C 24 39.2 22 42.2 19.4 44.8 C 16.6 47.6 13 48.4 10.2 47.2 C 7.4 46 6.2 43.2 6.2 39.6 Z"
        fill="#94ab6b"
      />
      {/* summit plateau (Mount Patti marker + rest house live here) */}
      <path
        d="M 10.6 30.2 C 11 26.8 13.4 24.8 16.4 25.1 C 19.4 25.4 21.4 27.6 21.2 30.6 C 21 33.8 18.6 36.2 15.6 36.3 C 12.6 36.4 10.3 33.4 10.6 30.2 Z"
        fill="#79945a"
      />
      {/* ridge hachures radiating downslope */}
      <g stroke="#56733f" strokeWidth="0.32" opacity="0.5" fill="none" strokeLinecap="round">
        <path d="M 21.6 27.2 Q 24.6 26 26.4 24.2" />
        <path d="M 23.6 31.2 Q 26.8 31 29 30.2" />
        <path d="M 22.8 35.4 Q 25.8 36 27.8 37.2" />
        <path d="M 20 39.6 Q 22.4 41.4 23.8 43.6" />
        <path d="M 15.8 42.4 Q 16.4 45.4 16 48.2" />
        <path d="M 11 41.8 Q 9.4 44.4 7 46.2" />
        <path d="M 7.4 36.6 Q 4.6 37.4 2.2 37.6" />
        <path d="M 7.8 30.6 Q 5 29.6 2.6 28.8" />
        <path d="M 10.2 25 Q 8.4 22.6 6 21" />
        <path d="M 14.4 22.2 Q 14 19.4 12.8 17" />
        <path d="M 18.4 23.2 Q 19.6 20.6 19.8 18.2" />
      </g>
      {/* Lord Lugard's rest house on the summit */}
      <g transform="translate(13.6 31.3)">
        <rect x="-1.4" y="-0.7" width="2.8" height="1.5" rx="0.25" fill="#f6efdc" stroke="#4a3418" strokeWidth="0.28" />
        <path d="M -1.7 -0.7 L 0 -2 L 1.7 -0.7 Z" fill="#a14e2a" stroke="#4a3418" strokeWidth="0.22" />
        <rect x="-0.25" y="0.05" width="0.5" height="0.75" fill="#4a3418" opacity="0.7" />
      </g>
      {/* dashed switchback summit trail from the historic quarter */}
      <path
        d="M 29.3 43.6 C 26.6 42.6 24 43.4 22.3 45.2 C 20.8 46.8 18.8 46.2 18.1 44.3 C 17.4 42.4 18.5 40.6 20.2 39.5 C 22 38.3 22 36.6 20.6 35.5 C 19.2 34.4 17.4 34.9 16.5 36.3"
        stroke="#8a6a3b"
        strokeWidth="0.6"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="1.5 1.15"
        opacity="0.95"
      />
      <text x="2.6" y="55.8" fontSize="2.5" fontWeight="800" fill="#3c5227" letterSpacing="0.34" stroke="#f1e7c8" strokeWidth="0.5" paintOrder="stroke">
        MOUNT PATTI
      </text>
      <text x="3" y="58.4" fontSize="1.35" fontWeight="700" fill="#56683d" letterSpacing="0.14" stroke="#f1e7c8" strokeWidth="0.4" paintOrder="stroke">
        458 M · SUMMIT TRAIL
      </text>

      {/* =========================== WATER =========================== */}
      {/* shallow rims first, then deep channels, then the basin */}
      {/* River Niger — in from the north-west (filled polygon) */}
      <path
        d="M -4 2.1 C 8 3.1 20 4.4 32 5.7 C 44 7 56 8.4 65 9.5 L 70 9.2 L 70.5 15.6 L 66 15 C 56 13.9 44 12.7 32 11.4 C 20 10.1 8 8.3 -4 6.9 Z"
        fill="#9fd0c2"
        stroke="#dcefd9"
        strokeWidth="0.32"
        opacity="0.97"
      />
      {/* River Benue — arriving from the east (filled polygon) */}
      <path
        d="M 104 4.3 C 96 5.4 88 6.7 80 8.1 C 76 8.8 71.5 9.5 68 9.8 L 66.5 15.6 C 71 15.3 76 14.5 81 13.4 C 89 11.6 97 10 104 8.7 Z"
        fill="#9fd0c2"
        stroke="#dcefd9"
        strokeWidth="0.32"
        opacity="0.97"
      />
      {/* combined Niger — flowing south past the town (filled polygon) */}
      <path
        d="M 72.6 15.6 C 73.8 17.2 74.4 19.4 74.4 22 C 74.4 26 74.9 28 74.9 32 C 74.9 36 74.9 40 74.7 44 C 74.5 48 74.2 51 73.8 54 C 73.4 57 72.9 60 72.4 63 C 71.9 66 71.5 68.5 71.3 71 C 71 74 70.7 76.5 70.5 79 C 70.2 82 70.1 85 70.1 88 C 70.1 91 70.2 97.5 70.4 104 L 64.6 104 C 64.5 100 64.4 96 64.4 92 C 64.4 88.5 64.5 84.5 64.8 81 C 65.1 77.5 65.5 73.5 66.1 70 C 66.7 66.5 67.3 63 67.8 59.5 C 68.3 56 67.9 52.5 67.7 49 C 67.8 47.3 68 45.7 68.1 44 C 68.3 40.5 68.4 37 68.3 33.5 C 68.2 30 68 26.5 67.6 23 C 67.2 20 66.6 17.5 65.6 15.6 Z"
        fill="#9fd0c2"
        stroke="#dcefd9"
        strokeWidth="0.32"
        opacity="0.97"
      />
      {/* deep channels */}
      <g stroke="#23707a" fill="none" strokeLinecap="round">
        <path d="M -4 4.5 C 10 5.6 24 7.2 38 8.8 C 52 10.2 62 11.4 68.5 12.3" strokeWidth="3.3" />
        <path d="M 104 6.5 C 94 7.8 84 9.4 76 10.9 C 72 11.6 69 12.1 67.5 12.2" strokeWidth="3" />
        <path
          d="M 69 14 C 70.6 17.5 71.4 20 71.8 24 C 72.3 30 72.2 36 71.9 42 C 71.6 48 70.9 54 70 60 C 69.1 66 68.2 72 67.7 78 C 67.2 84 67 90 67.1 96 C 67.2 100 67.4 102.5 67.5 104"
          strokeWidth="4.1"
        />
      </g>
      {/* darker mid-lines (the current) */}
      <g stroke="#12464f" fill="none" strokeLinecap="round" opacity="0.45">
        <path d="M -4 4.5 C 10 5.6 24 7.2 38 8.8 C 52 10.2 62 11.4 68.5 12.3" strokeWidth="0.55" />
        <path d="M 104 6.5 C 94 7.8 84 9.4 76 10.9 C 72 11.6 69 12.1 67.5 12.2" strokeWidth="0.5" />
        <path
          d="M 69 14 C 70.6 17.5 71.4 20 71.8 24 C 72.3 30 72.2 36 71.9 42 C 71.6 48 70.9 54 70 60 C 69.1 66 68.2 72 67.7 78 C 67.2 84 67 90 67.1 96 C 67.2 100 67.4 102.5 67.5 104"
          strokeWidth="0.7"
        />
      </g>
      {/* confluence basin — the widening where the two rivers kiss */}
      <path
        d="M 64.5 9.6 C 67.5 7.2 72 6.9 75 8.6 C 78 10.3 79 13.2 77.6 16.2 C 76 19.6 71.5 21 68 19.8 C 64.8 18.7 63 15.9 63.4 12.8 C 63.7 11.4 63.9 10.4 64.5 9.6 Z"
        fill="url(#lko4-pool)"
        stroke="#dcefd9"
        strokeWidth="0.34"
      />
      {/* sandbanks */}
      <g fill="#ecdcae" stroke="#d8c48e" strokeWidth="0.14">
        <ellipse cx="74.6" cy="10.4" rx="2" ry="0.72" transform="rotate(-24 74.6 10.4)" opacity="0.92" />
        <ellipse cx="66.7" cy="17.5" rx="1.7" ry="0.58" transform="rotate(38 66.7 17.5)" opacity="0.85" />
        <ellipse cx="70.6" cy="21.8" rx="1.5" ry="0.5" transform="rotate(83 70.6 21.8)" opacity="0.85" />
        <ellipse cx="71.4" cy="44.5" rx="1.2" ry="0.42" transform="rotate(85 71.4 44.5)" opacity="0.75" />
      </g>
      {/* swirl at the meeting point */}
      <g stroke="#d9efe6" fill="none" strokeLinecap="round">
        <path d="M 66.2 10.4 C 67.8 8.9 70.2 8.7 71.9 9.9" strokeWidth="0.35" opacity="0.6" />
        <path d="M 65.9 14.8 C 67.6 16.6 70.4 16.9 72.3 15.5" strokeWidth="0.35" opacity="0.6" />
        <path d="M 70.6 11.2 C 71.9 11.6 72.3 13 71.4 13.9 C 70.6 14.7 69.3 14.4 69 13.4 C 68.8 12.6 69.4 11.9 70.2 12" strokeWidth="0.3" opacity="0.55" />
      </g>

      {/* water labels */}
      <text x="14" y="5.6" fontSize="2" fontWeight="700" fill="#0d4148" letterSpacing="0.28" transform="rotate(7.5 14 5.6)">
        RIVER NIGER
      </text>
      <text x="80.6" y="9.9" fontSize="2" fontWeight="700" fill="#0d4148" letterSpacing="0.28" transform="rotate(-6.5 80.6 9.9)">
        RIVER BENUE
      </text>
      <text x="70.2" y="29" fontSize="2" fontWeight="700" fill="#0d4148" letterSpacing="0.28" transform="rotate(84 70.2 29)">
        RIVER NIGER
      </text>

      {/* =========================== ROADS =========================== */}
      {/* dark casings */}
      <g stroke="#8a6840" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* trunk */}
        <path
          d="M 30 42.5 C 35.5 46.6 40.5 51.2 44 55 C 48.5 53 52 52.2 56 52 C 59.5 52.4 62.5 54.5 64 58 C 66.5 59.2 68.5 59.7 71 60 C 76 60.3 81 60 86 59.6 C 91 59.2 96 58.9 101 58.7"
          strokeWidth="2.1"
        />
        <path
          d="M 61.3 19.4 C 60 24 58.7 29 57.9 34 C 57.1 39 56.4 44 56.1 48.5 C 56 50.8 56.2 53.2 56.8 55.6 C 57.7 59.4 58.2 63 57.9 67 C 57.6 71 56.7 74.6 56 78"
          strokeWidth="2.1"
        />
        <path
          d="M 38.5 79.6 C 44.5 81.7 50.5 80.4 56 78 C 60.5 79.8 65 81 69 81.4 L 71.4 81.9 C 76 82.7 81 83.3 86 83.5 C 91 83.7 96 83.9 101 84"
          strokeWidth="2.1"
        />
        {/* secondary */}
        <path
          d="M 50.9 52.9 C 52.4 48.6 54 44.4 56.3 40.5 C 58.9 36.5 60.9 31.6 61.9 27.1 C 62.3 25.6 62.5 24.2 62.6 23 C 63.4 21.3 64.3 19.9 65.3 18.8"
          strokeWidth="1.55"
        />
        <path d="M 64 58 C 65.2 61.5 65.9 65 65.7 68.5 C 65.5 72 65 75.6 64.5 79.4" strokeWidth="1.55" />
        <path d="M 56 78 C 56.8 82.5 57.5 86.5 58.3 90.5 C 59 93.9 59.6 97 60.1 100.5" strokeWidth="1.55" />
        <path d="M 30.5 42.8 C 35 40 39.4 36.2 43.2 32.2 C 43.7 31.6 44.2 31 44.7 30.4" strokeWidth="1.55" />
        <path d="M 44.4 29.7 C 48.4 29.6 52.4 31.4 55.1 34.4 C 56.3 35.8 57.1 37.3 57.7 38.9" strokeWidth="1.55" />
        <path d="M 61.4 19.3 C 62.8 18.1 64.2 17.2 65.5 16.7" strokeWidth="1.4" />
        {/* minor */}
        <path d="M 46.2 54.4 C 47.4 57.6 48 60.8 48.2 64.2 C 48.4 67.8 47.7 71.4 46.5 74.8 C 45.7 77.2 45 79.4 44.6 81.4" strokeWidth="0.9" opacity="0.8" />
        <path d="M 57.9 67.2 C 60 68.8 61.7 71 62.6 73.6 C 63.1 75.6 62.7 77.8 61.7 80" strokeWidth="0.9" opacity="0.8" />
        <path d="M 62.7 22.6 C 61.3 21 60.4 19.2 60.1 17.3" strokeWidth="0.85" opacity="0.8" />
        <path d="M 50.2 53.3 C 51.6 55.4 52.9 57.2 54.1 58.8" strokeWidth="0.85" opacity="0.8" />
      </g>
      {/* laterite fills */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* tier 1 — trunk */}
        <g stroke="#cf7d38">
          <path d="M 30 42.5 C 35.5 46.6 40.5 51.2 44 55 C 48.5 53 52 52.2 56 52 C 59.5 52.4 62.5 54.5 64 58 C 66.5 59.2 68.5 59.7 71 60 C 76 60.3 81 60 86 59.6 C 91 59.2 96 58.9 101 58.7" strokeWidth="1.5" />
          <path d="M 61.3 19.4 C 60 24 58.7 29 57.9 34 C 57.1 39 56.4 44 56.1 48.5 C 56 50.8 56.2 53.2 56.8 55.6 C 57.7 59.4 58.2 63 57.9 67 C 57.6 71 56.7 74.6 56 78" strokeWidth="1.5" />
          <path d="M 38.5 79.6 C 44.5 81.7 50.5 80.4 56 78 C 60.5 79.8 65 81 69 81.4 L 71.4 81.9 C 76 82.7 81 83.3 86 83.5 C 91 83.7 96 83.9 101 84" strokeWidth="1.5" />
        </g>
        {/* tier 2 — secondary */}
        <g stroke="#d99a5c">
          <path d="M 50.9 52.9 C 52.4 48.6 54 44.4 56.3 40.5 C 58.9 36.5 60.9 31.6 61.9 27.1 C 62.3 25.6 62.5 24.2 62.6 23 C 63.4 21.3 64.3 19.9 65.3 18.8" strokeWidth="1.05" />
          <path d="M 64 58 C 65.2 61.5 65.9 65 65.7 68.5 C 65.5 72 65 75.6 64.5 79.4" strokeWidth="1.05" />
          <path d="M 56 78 C 56.8 82.5 57.5 86.5 58.3 90.5 C 59 93.9 59.6 97 60.1 100.5" strokeWidth="1.05" />
          <path d="M 30.5 42.8 C 35 40 39.4 36.2 43.2 32.2 C 43.7 31.6 44.2 31 44.7 30.4" strokeWidth="1.05" />
          <path d="M 44.4 29.7 C 48.4 29.6 52.4 31.4 55.1 34.4 C 56.3 35.8 57.1 37.3 57.7 38.9" strokeWidth="1.05" />
          <path d="M 61.4 19.3 C 62.8 18.1 64.2 17.2 65.5 16.7" strokeWidth="0.95" />
        </g>
        {/* tier 3 — minor */}
        <g stroke="#e3b387">
          <path d="M 46.2 54.4 C 47.4 57.6 48 60.8 48.2 64.2 C 48.4 67.8 47.7 71.4 46.5 74.8 C 45.7 77.2 45 79.4 44.6 81.4" strokeWidth="0.55" />
          <path d="M 57.9 67.2 C 60 68.8 61.7 71 62.6 73.6 C 63.1 75.6 62.7 77.8 61.7 80" strokeWidth="0.55" />
          <path d="M 62.7 22.6 C 61.3 21 60.4 19.2 60.1 17.3" strokeWidth="0.5" />
          <path d="M 50.2 53.3 C 51.6 55.4 52.9 57.2 54.1 58.8" strokeWidth="0.5" />
        </g>
      </g>
      {/* centre dashes on the trunk roads */}
      <g stroke="#ffe9c9" strokeWidth="0.17" fill="none" strokeLinecap="round" opacity="0.55" strokeDasharray="1.5 1.15">
        <path d="M 30 42.5 C 35.5 46.6 40.5 51.2 44 55 C 48.5 53 52 52.2 56 52 C 59.5 52.4 62.5 54.5 64 58 C 66.5 59.2 68.5 59.7 71 60 C 76 60.3 81 60 86 59.6 C 91 59.2 96 58.9 101 58.7" />
        <path d="M 61.3 19.4 C 60 24 58.7 29 57.9 34 C 57.1 39 56.4 44 56.1 48.5 C 56 50.8 56.2 53.2 56.8 55.6 C 57.7 59.4 58.2 63 57.9 67 C 57.6 71 56.7 74.6 56 78" />
        <path d="M 38.5 79.6 C 44.5 81.7 50.5 80.4 56 78 C 60.5 79.8 65 81 69 81.4 L 71.4 81.9 C 76 82.7 81 83.3 86 83.5 C 91 83.7 96 83.9 101 84" />
      </g>

      {/* two bridges over the Niger (decks wider than the road) */}
      <g>
        {/* Kogi Bridge — IBB Way crossing */}
        <g transform="rotate(-0.8 71.6 60)">
          <rect x="67.3" y="58.85" width="8.6" height="2.35" rx="0.5" fill="#c8a266" stroke="#6f5530" strokeWidth="0.32" />
          <path d="M 68.4 58.95 L 68.4 61.1 M 70 58.95 L 70 61.1 M 71.6 58.95 L 71.6 61.1 M 73.2 58.95 L 73.2 61.1 M 74.8 58.95 L 74.8 61.1" stroke="#6f5530" strokeWidth="0.26" />
        </g>
        {/* southern bypass bridge */}
        <g transform="rotate(1.5 68 81.65)">
          <rect x="63.6" y="80.5" width="8.8" height="2.3" rx="0.5" fill="#c8a266" stroke="#6f5530" strokeWidth="0.32" />
          <path d="M 64.7 80.6 L 64.7 82.7 M 66.45 80.6 L 66.45 82.7 M 68.2 80.6 L 68.2 82.7 M 69.95 80.6 L 69.95 82.7 M 71.7 80.6 L 71.7 82.7" stroke="#6f5530" strokeWidth="0.26" />
        </g>
      </g>

      {/* Ganaja jetty on the west bank */}
      <rect x="64.1" y="79.9" width="1.7" height="0.5" rx="0.15" fill="#b99763" stroke="#6f5530" strokeWidth="0.2" transform="rotate(16 65 80.2)" />

      {/* ========================== LABELS =========================== */}
      {/* road names (hidden on very small screens) */}
      <g className="lko-lbl-sm" fontSize="1.5" fontWeight="800" fill="#6e4f26" letterSpacing="0.16" stroke="#f7efdb" strokeWidth="0.5" paintOrder="stroke">
        <text x="48.6" y="55.9" transform="rotate(-9 48.6 55.9)">IBB WAY</text>
        <text x="58.7" y="30" transform="rotate(84 58.7 30)">MURTALA MOHAMMED WAY</text>
        <text x="54.7" y="38.6" transform="rotate(-60 54.7 38.6)">UNIVERSITY RD</text>
        <text x="67.3" y="62.4" transform="rotate(83 67.3 62.4)">GANAJA RD</text>
        <text x="59.8" y="85.4" transform="rotate(79 59.8 85.4)">FELELE RD</text>
        <text x="76.6" y="85.6" transform="rotate(3.5 76.6 85.6)">SOUTHERN BYPASS</text>
        <text x="60.4" y="17.4" transform="rotate(-30 60.4 17.4)" fontSize="1.25">CONFLUENCE RD</text>
      </g>

      {/* district names */}
      <g fontSize="1.9" fontWeight="800" fill="#5c4a2a" letterSpacing="0.3" stroke="#f7efdb" strokeWidth="0.55" paintOrder="stroke">
        <text x="56.4" y="15.9">ADANKOLO</text>
        <text x="39.6" y="26.4">GRA</text>
        <text x="56.9" y="69.6" fontSize="1.7">OTOKITI</text>
        <text x="58.9" y="76.9" fontSize="1.7">GANAJA</text>
        <text x="46.6" y="87.6">FELELE</text>
      </g>

      {/* small area annotations */}
      <g className="lko-lbl-sm" fontSize="1.2" fontWeight="600" fontStyle="italic" fill="#7a5b33" stroke="#f7efdb" strokeWidth="0.45" paintOrder="stroke">
        <text x="50" y="60.3">Old Market</text>
        <text x="57.8" y="46.2">New Market</text>
        <text x="61.9" y="81.9">Jetty</text>
        <text x="9.6" y="28.6">Rest House</text>
      </g>

      {/* ====================== CARTOGRAPHY CHROME =================== */}
      {/* compass rose */}
      <g transform="translate(91.5 16.5)">
        <circle r="4.3" fill="#fffdf7" opacity="0.94" stroke="#0b3d22" strokeWidth="0.4" />
        <circle r="3.4" fill="none" stroke="#0b3d22" strokeWidth="0.16" opacity="0.4" />
        <g stroke="#0b3d22" strokeWidth="0.2" opacity="0.55">
          <path d="M 0 -4.3 L 0 -3.4 M 0 4.3 L 0 3.4 M -4.3 0 L -3.4 0 M 4.3 0 L 3.4 0" />
        </g>
        <path d="M 0 -3.1 L 1.05 1.1 L 0 0.4 L -1.05 1.1 Z" fill="#c4562a" stroke="#7c2d12" strokeWidth="0.14" />
        <path d="M 0 2.6 L 0.7 0.9 L 0 1.3 L -0.7 0.9 Z" fill="#b0812a" />
        <circle r="0.42" fill="#fffdf7" stroke="#7c2d12" strokeWidth="0.16" />
        <text x="0" y="7.4" fontSize="1.7" fontWeight="800" fill="#0b3d22" textAnchor="middle">N</text>
      </g>

      {/* cartouche: title + confluence glyph + scale bar + mini legend */}
      <g transform="translate(3 84.2)">
        <rect width="27" height="13.6" rx="1.7" fill="#fffdf7" opacity="0.95" stroke="#0b3d22" strokeWidth="0.45" />
        <rect x="0.7" y="0.7" width="25.6" height="12.2" rx="1.2" fill="none" stroke="#0b3d22" strokeWidth="0.16" opacity="0.3" />
        <text x="1.8" y="4.6" fontSize="3.4" fontWeight="800" fill="#0b3d22" letterSpacing="0.2">LOKOJA</text>
        {/* confluence glyph — two rivers meeting */}
        <g transform="translate(21.6 1.4)">
          <path d="M 0.6 0.4 C 2.4 1.4 3 3 3.2 5" stroke="#1f7a6d" strokeWidth="1.15" fill="none" strokeLinecap="round" />
          <path d="M 5.6 2 C 4.4 2.5 3.7 3.4 3.3 4.9" stroke="#e8a317" strokeWidth="1.15" fill="none" strokeLinecap="round" />
          <circle cx="3.3" cy="5.4" r="0.8" fill="#146b3a" />
        </g>
        <text x="1.8" y="7.3" fontSize="1.55" fontWeight="700" fill="#8a5a00" letterSpacing="0.14">KOGI STATE • NIGERIA</text>
        {/* scale bar — 8 units = 2 km */}
        <g transform="translate(1.8 9.6)">
          <rect x="0" y="0" width="2" height="0.8" fill="#0b3d22" />
          <rect x="2" y="0" width="2" height="0.8" fill="#fffdf7" stroke="#0b3d22" strokeWidth="0.16" />
          <rect x="4" y="0" width="2" height="0.8" fill="#0b3d22" />
          <rect x="6" y="0" width="2" height="0.8" fill="#fffdf7" stroke="#0b3d22" strokeWidth="0.16" />
          <text x="0" y="2.5" fontSize="1.1" fontWeight="700" fill="#0b3d22">0</text>
          <text x="3.6" y="2.5" fontSize="1.1" fontWeight="700" fill="#0b3d22">1</text>
          <text x="7.2" y="2.5" fontSize="1.1" fontWeight="700" fill="#0b3d22">2 KM</text>
        </g>
        {/* mini legend */}
        <g transform="translate(13.4 9.7)">
          <path d="M 0 0.4 L 2.6 0.4" stroke="#cf7d38" strokeWidth="0.7" strokeLinecap="round" />
          <text x="3.4" y="1" fontSize="1.15" fontWeight="700" fill="#5c4a2a">ROAD</text>
          <rect x="8.2" y="0" width="1.5" height="0.85" rx="0.2" fill="#23707a" />
          <text x="10.5" y="1" fontSize="1.15" fontWeight="700" fill="#5c4a2a">WATER</text>
        </g>
      </g>

      {/* double map frame */}
      <rect x="0.9" y="0.9" width="98.2" height="98.2" fill="none" stroke="#0b3d22" strokeWidth="0.5" opacity="0.55" rx="2.2" />
      <rect x="2.1" y="2.1" width="95.8" height="95.8" fill="none" stroke="#0b3d22" strokeWidth="0.16" opacity="0.3" rx="1.6" />
    </svg>
  )
}
