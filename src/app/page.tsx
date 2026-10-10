'use client'

/**
 * LOKOJA LIFE — App Shell
 * A single-page game shell: the only route is `/`, screens are
 * switched in-app (menu → creation → game) exactly like a game client.
 * Handles boot (save detection) and auto-save on exit.
 */

import { useEffect } from 'react'
import { MainMenu } from '@/components/game/screens/MainMenu'
import { CharacterCreation } from '@/components/game/screens/CharacterCreation'
import { Dashboard } from '@/components/game/screens/Dashboard'
import { useGameStore } from '@/game/store/useGameStore'

export default function Home() {
  const screen = useGameStore((s) => s.screen)
  const booted = useGameStore((s) => s.booted)
  const boot = useGameStore((s) => s.boot)
  const saveNow = useGameStore((s) => s.saveNow)

  // boot once on mount: detect existing save, sync audio settings
  useEffect(() => {
    boot()
  }, [boot])

  // flush the autosave when the tab/app is hidden or closed
  useEffect(() => {
    const flush = () => {
      if (useGameStore.getState().screen === 'game') saveNow()
    }
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('pagehide', flush)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [saveNow])

  // brief boot splash — avoids save-detection flicker on first paint
  if (!booted) {
    return (
      <div
        className="flex min-h-dvh flex-col items-center justify-center gap-4"
        style={{
          background:
            'linear-gradient(180deg, #fbe7b7 0%, #f9d489 46%, #2a8a7a 46%, #1c6b5e 100%)',
        }}
      >
        <div className="lko-float flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--lko-surface)] shadow-[var(--lko-shadow-lg)]">
          {/* confluence mark: two rivers meeting */}
          <svg viewBox="0 0 48 48" className="h-11 w-11" aria-hidden>
            <path d="M6 12 C 18 16 22 24 24 36" stroke="#1f7a6d" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M42 20 C 32 22 27 27 24 36" stroke="#e8a317" strokeWidth="5" fill="none" strokeLinecap="round" />
            <circle cx="24" cy="37" r="3.4" fill="#146b3a" />
          </svg>
        </div>
        <p className="lko-display text-2xl tracking-tight text-[var(--lko-green-deep)]">LOKOJA LIFE</p>
        <p className="text-xs font-semibold text-[var(--lko-ink-soft)]">Loading the Confluence…</p>
      </div>
    )
  }

  return (
    <>
      {screen === 'menu' && <MainMenu />}
      {screen === 'creation' && <CharacterCreation />}
      {screen === 'game' && <Dashboard />}
    </>
  )
}
