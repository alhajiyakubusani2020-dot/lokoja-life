'use client'

/**
 * LocationArt — original illustrated art for a location, with graceful fallback.
 * Art source: public/art/loc-<id>.webp (100% original AI-generated set, R2-ART).
 * If an image is missing/slow, falls back to the R1 stroke-icon disc so no
 * screen ever shows a broken image or a blank box.
 */
import Image from 'next/image'
import { useState } from 'react'
import { PlaceIcon } from './icons'

/* G2 — art for the new spaces. Every new id either reuses an existing
 * public/art/*.webp whose subject GENUINELY matches, or gets a coloured
 * emoji/gradient disc consistent with the pin language (no art file exists
 * for these ids — so no invented assets and no broken-image flash). */
const NEW_PIN_ART: Record<string, { emoji: string; from: string; to: string }> = {
  adankolo: { emoji: '🏘️', from: '#2E7D5B', to: '#14432E' },
  emiwoziri: { emoji: '🛶', from: '#2C6E8A', to: '#123B4C' },
  filele: { emoji: '🌾', from: '#7A8A3A', to: '#3D4519' },
  numai: { emoji: '🌳', from: '#A0672E', to: '#4F3113' },
  kpatakpoli: { emoji: '🏡', from: '#3F7A5C', to: '#1F4030' },
  kpato: { emoji: '🐐', from: '#B8763A', to: '#5C3A1A' },
  'township-stadium': { emoji: '🏟️', from: '#3D8A37', to: '#1D4519' },
  'maigari-palace': { emoji: '👑', from: '#8A3A6E', to: '#451D37' },
  'sokamms-motel': { emoji: '🛏️', from: '#4A6E8A', to: '#243745' },
}
/** subject-true reuse of an existing original art file */
const ART_REUSE: Record<string, string> = {
  // Pati Ridge Hill is the Patti ridge itself — the Mount Patti art shows exactly that subject
  'pati-ridge-hill': '/art/loc-mount-patti.webp',
}

export function LocationArt({
  id,
  name,
  className = '',
  sizes = '(max-width: 448px) 100vw, 448px',
  dimmed = false,
  priority = false,
}: {
  id: string
  name: string
  className?: string
  sizes?: string
  /** locked locations render the art quieter */
  dimmed?: boolean
  priority?: boolean
}) {
  const [failed, setFailed] = useState(false)

  // G2 new pins — emoji/gradient disc, drawn straight away
  const pin = NEW_PIN_ART[id]
  if (pin) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ background: `linear-gradient(150deg, ${pin.from}, ${pin.to})` }}
        aria-hidden
      >
        <span className={dimmed ? 'opacity-75 saturate-50' : ''} style={{ fontSize: 30, lineHeight: 1 }}>
          {pin.emoji}
        </span>
      </div>
    )
  }

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-[var(--lko-river-soft)] ${className}`}
        aria-hidden
      >
        <PlaceIcon id={id} size={30} className="text-white/90" />
      </div>
    )
  }

  return (
    <Image
      src={ART_REUSE[id] ?? `/art/loc-${id}.webp`}
      alt={name}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className={`object-cover ${dimmed ? 'opacity-80 grayscale-[45%]' : ''} ${className}`}
    />
  )
}
