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
      <div className="lko-root flex min-h-dvh flex-col items-center justify-center gap-3">
        <div className="lko-float text-5xl" aria-hidden>
          🌊
        </div>
        <p className="lko-display text-xl text-[var(--lko-green-deep)]">LOKOJA LIFE</p>
        <p className="text-xs text-[var(--lko-ink-soft)]">Loading the Confluence…</p>
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
