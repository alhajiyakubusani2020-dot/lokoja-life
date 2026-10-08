'use client'

/**
 * LOKOJA LIFE — Main Menu
 * Splash scene + New Game / Continue / Settings.
 * Continue is honestly disabled when no save exists.
 */

import { useEffect, useState } from 'react'
import { SceneBackdrop } from '../SceneBackdrop'
import { audio } from '@/game/systems/audio'
import { GAME_META } from '@/game/data/config'
import { MENU_TIPS } from '@/game/data/flavor'
import { useGameStore } from '@/game/store/useGameStore'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'

export function MainMenu() {
  const hasSave = useGameStore((s) => s.hasSave)
  const settings = useGameStore((s) => s.settings)
  const toggleSound = useGameStore((s) => s.toggleSound)
  const setScreen = useGameStore((s) => s.setScreen)
  const continueGame = useGameStore((s) => s.continueGame)
  const resetGame = useGameStore((s) => s.resetGame)

  const [tipIndex, setTipIndex] = useState(0)

  // rotate the loading tips gently
  useEffect(() => {
    const t = setInterval(() => setTipIndex((i) => (i + 1) % MENU_TIPS.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="lko-root lko-pop flex min-h-dvh flex-col">
      {/* splash art */}
      <div className="relative h-[38dvh] min-h-[220px] w-full overflow-hidden">
        <SceneBackdrop className="absolute inset-0 h-full w-full" />
        {/* vignette into page bg */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--lko-cream)] to-transparent" />
      </div>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-6 pb-8">
        {/* wordmark */}
        <div className="mt-2 text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border-2 border-[var(--lko-gold)]/40 bg-[var(--lko-gold-soft)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8a5a00]">
            🌊 Lokoja • Kogi State
          </div>
          <h1 className="lko-display text-5xl leading-[1.02] text-[var(--lko-green-deep)]">
            LOKOJA
            <br />
            <span className="text-[var(--lko-terra)]">LIFE</span>
          </h1>
          <p className="mt-2 text-sm font-semibold italic text-[var(--lko-ink-soft)]">
            “{GAME_META.tagline}”
          </p>
        </div>

        {/* rotating tip */}
        <div className="lko-card mt-5 w-full px-4 py-3 text-center" aria-live="polite">
          <p className="text-[13px] leading-relaxed text-[var(--lko-ink-soft)]">
            💡 {MENU_TIPS[tipIndex]}
          </p>
        </div>

        {/* actions */}
        <div className="mt-6 flex w-full flex-col gap-3">
          <button
            onClick={() => {
              audio.play('click')
              setScreen('creation')
            }}
            className="lko-press min-h-[56px] w-full rounded-2xl border-b-4 border-[#0a5c2e] bg-[var(--lko-green)] text-lg font-extrabold tracking-wide text-white shadow-md"
          >
            ▶ NEW GAME
          </button>

          <button
            onClick={() => {
              audio.play('click')
              continueGame()
            }}
            disabled={!hasSave}
            className="lko-press min-h-[56px] w-full rounded-2xl border-b-4 border-[#b57d0a] bg-[var(--lko-gold)] text-lg font-extrabold tracking-wide text-[#3d2a00] shadow-md disabled:cursor-not-allowed disabled:opacity-45 disabled:[border-b-color:transparent]"
          >
            ⏩ CONTINUE
          </button>

          {/* settings */}
          <Dialog>
            <DialogTrigger asChild>
              <button
                onClick={() => audio.play('click')}
                className="lko-press lko-card min-h-[48px] w-full rounded-2xl py-3 text-sm font-bold text-[var(--lko-ink)]"
              >
                ⚙️ Settings
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-[calc(100vw-2rem)] rounded-2xl sm:max-w-sm">
              <DialogHeader>
                <DialogTitle className="lko-display">Settings</DialogTitle>
                <DialogDescription>Fine-tune your Lokoja Life experience.</DialogDescription>
              </DialogHeader>

              <div className="flex items-center justify-between rounded-xl border-2 border-black/[0.06] px-4 py-3">
                <div>
                  <p className="text-sm font-bold">Sound</p>
                  <p className="text-xs text-[var(--lko-ink-soft)]">Clicks, chimes & alerts</p>
                </div>
                <Switch checked={settings.sound} onCheckedChange={toggleSound} aria-label="Toggle sound" />
              </div>

              <div className="rounded-xl border-2 border-black/[0.06] px-4 py-3 text-xs leading-relaxed text-[var(--lko-ink-soft)]">
                <p className="mb-1 font-bold text-[var(--lko-ink)]">Lokoja Life {GAME_META.version}</p>
                <p>
                  {GAME_META.stage} — more life is coming to the city soon: jobs, markets, the
                  Confluence, Mount Patti and beyond.
                </p>
                {hasSave && (
                  <button
                    onClick={() => {
                      if (window.confirm('Delete your save and start fresh? This cannot be undone.')) {
                        audio.play('notify')
                        resetGame()
                      }
                    }}
                    className="mt-3 min-h-[40px] w-full rounded-lg border-2 border-red-200 bg-red-50 py-2 text-xs font-bold text-red-600"
                  >
                    🗑 Delete save & start fresh
                  </button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <p className="mt-auto pt-6 text-center text-[11px] text-[var(--lko-ink-soft)]">
          An original Nigerian life sim • Made with ❤️ for Lokoja
        </p>
      </main>
    </div>
  )
}
