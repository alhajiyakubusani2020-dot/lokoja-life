/**
 * LOKOJA LIFE — Avatar customisation data
 * ---------------------------------------
 * All character-creation options live here so new options
 * (cosmetics shop, Loko Gems items, premium styles) can be added
 * later purely through data + a `premium` flag.
 */

export interface AvatarOption {
  key: string
  label: string
  value: string
  /** Reserved for the future cosmetic shop — true = not selectable in creation. */
  premium?: boolean
}

/** Skin tones — a realistic Nigerian range. */
export const SKIN_TONES: AvatarOption[] = [
  { key: 'deep-ebony', label: 'Deep Ebony', value: '#4A2C17' },
  { key: 'dark-brown', label: 'Dark Brown', value: '#5C3A21' },
  { key: 'rich-brown', label: 'Rich Brown', value: '#6E4326' },
  { key: 'warm-brown', label: 'Warm Brown', value: '#8A5A32' },
  { key: 'light-brown', label: 'Light Brown', value: '#A9714B' },
  { key: 'pale-brown', label: 'Pale Brown', value: '#C08A5E' },
]

/** Hair colours — natural + a couple of popular dyed looks. */
export const HAIR_COLORS: AvatarOption[] = [
  { key: 'black', label: 'Black', value: '#1A1714' },
  { key: 'dark-brown', label: 'Dark Brown', value: '#2E1D12' },
  { key: 'burgundy', label: 'Burgundy', value: '#5C2330' },
  { key: 'honey', label: 'Honey Blonde', value: '#8A6A3B' },
  { key: 'gold-dye', label: 'Gold Dye', value: '#B79545' },
]

export interface HairstyleOption {
  key: string
  label: string
  gender: 'all' | 'male' | 'female'
  premium?: boolean
}

/** Hairstyles — the Avatar SVG component renders one path-set per key. */
export const AVATAR_HAIRSTYLES: HairstyleOption[] = [
  { key: 'bald', label: 'Bald', gender: 'all' },
  { key: 'low-cut', label: 'Low Cut', gender: 'all' },
  { key: 'waves', label: 'Waves', gender: 'all' },
  { key: 'afro', label: 'Afro', gender: 'all' },
  { key: 'cornrows', label: 'Cornrows', gender: 'all' },
  { key: 'dreads', label: 'Dreads', gender: 'all' },
  { key: 'braids', label: 'Long Braids', gender: 'all' },
  { key: 'puffs', label: 'Two Puffs', gender: 'all' },
]

export interface ClothingStyleOption {
  key: string
  label: string
  description: string
  premium?: boolean
}

/** Clothing styles — simple but distinctly Nigerian. */
export const AVATAR_CLOTHING_STYLES: ClothingStyleOption[] = [
  { key: 'tshirt', label: 'T-Shirt', description: 'Everyday hustle wear' },
  { key: 'kaftan', label: 'Kaftan', description: 'Clean traditional look' },
  { key: 'ankara', label: 'Ankara Print', description: 'Full pattern flex' },
  { key: 'senator', label: 'Senator Wear', description: 'Sharp for business' },
]

/** Clothing colours — warm Nigerian-fashion palette. */
export const CLOTHING_COLORS: AvatarOption[] = [
  { key: 'forest', label: 'Forest Green', value: '#1B7A43' },
  { key: 'gold', label: 'Amber Gold', value: '#E8A317' },
  { key: 'terra', label: 'Terracotta', value: '#C4562A' },
  { key: 'oxblood', label: 'Oxblood', value: '#7C2D2D' },
  { key: 'cream', label: 'Cream', value: '#F1E3C8' },
  { key: 'charcoal', label: 'Charcoal', value: '#33332E' },
]

/** A sensible default so the preview avatar is never empty. */
export const DEFAULT_AVATAR = {
  skinTone: '#6E4326',
  hairColor: '#1A1714',
  hairstyle: 'low-cut',
  clothingStyle: 'tshirt',
  clothingColor: '#1B7A43',
}
