'use client'

/**
 * LOKOJA LIFE — App Shell
 * A single-page game shell: the only route is `/`, screens are
 * switched in-app (menu → creation → game) exactly like a game client.
 * Handles boot (save detection) and auto-save on exit.
 *
 * PERF (M3): the game screens (Dashboard → 3D world → three.js) are
 * dynamically imported, so the first paint is the lightweight menu shell
 * alone. The chunk is preloaded in the background the moment the menu is
 * interactive, so tapping "start" lands on an already-cached bundle.
 */

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { MainMenu } from '@/components/game/screens/MainMenu'
import { useGameStore } from '@/game/store/useGameStore'
import { preloadDashboard } from '@/components/game/screens/dashboard-chunk'

const CharacterCreation = dynamic(
  () => import('@/components/game/screens/CharacterCreation').then((m) => m.CharacterCreation),
  { ssr: false },
)
const Dashboard = dynamic(() => import('@/components/game/screens/Dashboard').then((m) => m.Dashboard), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-[#f5edd8]">
      <p className="lko-display text-xl text-[var(--lko-green-deep)]">Opening Lokoja…</p>
      <p className="text-xs font-semibold text-[var(--lko-ink-soft)]">warming the Confluence</p>
    </div>
  ),
})

export default function Home() {
  const screen = useGameStore((s) => s.screen)
  const booted = useGameStore((s) => s.booted)
  const boot = useGameStore((s) => s.boot)
  const saveNow = useGameStore((s) => s.saveNow)

  // boot once on mount: detect existing save, sync audio settings
  useEffect(() => {
    boot()
    // PERF: warm the game bundle while the menu is on screen (idle — never
    // competes with the first paint or the menu's own hydration)
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (h: number) => void
    }
    let idleHandle = 0
    const timeout = window.setTimeout(preloadDashboard, 1200)
    if (typeof w.requestIdleCallback === 'function') {
      window.clearTimeout(timeout)
      idleHandle = w.requestIdleCallback(() => preloadDashboard(), { timeout: 2500 })
    }
    return () => {
      window.clearTimeout(timeout)
      if (idleHandle) w.cancelIdleCallback?.(idleHandle)
    }
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
