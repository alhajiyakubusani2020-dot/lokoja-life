/**
 * LOKOJA LIFE — Wardrobe Bus (Stage 5)
 * --------------------------------------
 * Tiny cross-layer signal: the 3D interior hotspot ("Use the wardrobe")
 * and the 2D WardrobePanel live in different component trees, so a
 * one-flag store is the cleanest way to connect them. No game economy
 * lives here — appearance changes go through useGameStore.setAvatar.
 */

import { create } from 'zustand'

interface WardrobeBus {
  open: boolean
  show: () => void
  hide: () => void
}

export const useWardrobeBus = create<WardrobeBus>((set) => ({
  open: false,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
}))
