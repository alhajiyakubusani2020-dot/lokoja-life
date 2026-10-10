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
      src={`/art/loc-${id}.webp`}
      alt={name}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className={`object-cover ${dimmed ? 'opacity-80 grayscale-[45%]' : ''} ${className}`}
    />
  )
}
