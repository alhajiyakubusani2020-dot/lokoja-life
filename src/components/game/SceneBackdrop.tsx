'use client'

/**
 * LOKOJA LIFE — SceneBackdrop
 * Original stylised SVG of Lokoja for the main menu:
 * Mount Patti on the horizon, the Niger–Benue confluence,
 * riverside greens and a keke rolling past. No external assets.
 */

export function SceneBackdrop({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 260"
      className={className}
      role="img"
      aria-label="Illustrated view of Lokoja: Mount Patti, the river confluence and a keke"
      preserveAspectRatio="xMidYMax slice"
    >
      {/* sky */}
      <rect width="400" height="260" fill="url(#lkoSky)" />

      {/* sun */}
      <circle cx="316" cy="56" r="26" fill="#f6c445" />
      <circle cx="316" cy="56" r="34" fill="#f6c445" opacity="0.25" />

      {/* distant hills — Mount Patti silhouette */}
      <path d="M 0 150 L 60 92 L 118 150 Z" fill="#3d6b34" />
      <path d="M 40 150 L 104 74 L 176 150 Z" fill="#2f5a2b" />
      <path d="M 130 150 L 196 104 L 268 150 Z" fill="#3d6b34" />
      {/* Patti crown flag */}
      <path d="M 104 74 L 104 62 L 116 66 L 104 70" fill="#e8a317" />

      {/* treeline */}
      <path
        d="M 0 152 Q 30 138 60 150 Q 95 136 130 150 Q 165 138 200 150 Q 240 136 280 150 Q 320 138 360 150 Q 385 142 400 150 L 400 160 L 0 160 Z"
        fill="#274a24"
      />

      {/* river — the confluence: two tones meeting */}
      <rect y="158" width="400" height="102" fill="url(#lkoRiverA)" />
      <path d="M 400 158 L 400 260 L 236 260 Q 300 208 400 158 Z" fill="url(#lkoRiverB)" />
      {/* meeting line shimmer */}
      <path
        d="M 240 258 Q 305 205 398 160"
        stroke="#ffffff"
        strokeWidth="2.5"
        fill="none"
        opacity="0.5"
        strokeDasharray="6 7"
      />
      {/* ripples */}
      <path d="M 40 196 Q 60 192 80 196" stroke="#ffffff" strokeWidth="2" opacity="0.4" fill="none" strokeLinecap="round" />
      <path d="M 110 220 Q 134 215 158 220" stroke="#ffffff" strokeWidth="2" opacity="0.35" fill="none" strokeLinecap="round" />
      <path d="M 300 236 Q 324 231 348 236" stroke="#ffffff" strokeWidth="2" opacity="0.4" fill="none" strokeLinecap="round" />

      {/* canoe on the river */}
      <g transform="translate(96 182)">
        <path d="M 0 8 Q 26 16 52 8 Q 26 12 0 8 Z" fill="#7c4a1e" />
        <path d="M 24 -12 L 26 6" stroke="#4a2c14" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 26 -12 Q 38 -6 30 2 Q 27 -4 26 -12 Z" fill="#e8a317" />
        <circle cx="16" cy="4" r="4" fill="#5c3a21" />
        <rect x="12" y="-2" width="8" height="7" rx="2" fill="#1b7a43" />
      </g>

      {/* shore foreground — grass bank */}
      <path
        d="M 0 260 L 0 216 Q 60 200 130 216 Q 200 232 260 218 Q 330 204 400 222 L 400 260 Z"
        fill="#31702f"
      />
      <path
        d="M 0 260 L 0 238 Q 70 226 150 238 Q 240 250 320 236 Q 370 228 400 236 L 400 260 Z"
        fill="#275c27"
      />

      {/* grass tufts */}
      {[
        { x: 24, y: 234 }, { x: 48, y: 242 }, { x: 200, y: 244 }, { x: 236, y: 236 }, { x: 330, y: 246 },
      ].map((g, i) => (
        <path
          key={i}
          d={`M ${g.x} ${g.y} q 2 -8 0 -12 M ${g.x + 5} ${g.y} q 2 -6 4 -9 M ${g.x - 5} ${g.y} q -2 -6 -4 -9`}
          stroke="#1d451d"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      ))}

      {/* keke on the shore road */}
      <g transform="translate(244 214) scale(0.9)">
        {/* body */}
        <path d="M 0 26 L 4 10 Q 6 2 16 2 L 34 2 Q 42 2 44 10 L 46 26 Z" fill="#e8a317" />
        <path d="M 8 12 L 40 12 L 40 22 L 8 22 Z" fill="#fdf0d5" />
        {/* windshield */}
        <path d="M 12 5 L 30 5 Q 34 5 35 9 L 36 12 L 10 12 Z" fill="#bfe3dc" />
        {/* wheels */}
        <circle cx="10" cy="27" r="5" fill="#241d16" />
        <circle cx="10" cy="27" r="2" fill="#8a8a82" />
        <circle cx="38" cy="27" r="5" fill="#241d16" />
        <circle cx="38" cy="27" r="2" fill="#8a8a82" />
      </g>

      <defs>
        <linearGradient id="lkoSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbe7b7" />
          <stop offset="0.55" stopColor="#f9d489" />
          <stop offset="1" stopColor="#f2b95f" />
        </linearGradient>
        <linearGradient id="lkoRiverA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a8a7a" />
          <stop offset="1" stopColor="#1c6b5e" />
        </linearGradient>
        <linearGradient id="lkoRiverB" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3d9481" />
          <stop offset="1" stopColor="#25755f" />
        </linearGradient>
      </defs>
    </svg>
  )
}
