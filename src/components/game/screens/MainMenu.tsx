'use client'

/**
 * LOKOJA LIFE — Main Menu (R2-ART)
 * ---------------------------------
 * The world IS the menu: a full-bleed original painted key art of Lokoja
 * (Mount Patti + the Niger–Benue confluence + a keke on the laterite road)
 * with a slow Ken Burns drift, so the first screen feels alive — you are
 * looking INTO a world you are about to enter, not reading a webpage.
 * R1's LivingScene continues to render the in-game home hero.
 * No fake features: only New Game / Continue / Settings exist here.
 */

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { audio } from '@/game/systems/audio'
import { GAME_META } from '@/game/data/config'
import { MENU_TIPS } from '@/game/data/flavor'
import { useGameStore } from '@/game/store/useGameStore'
import { PinIcon, SparkleIcon, SettingsIcon } from '../icons'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { GraphicsPicker } from './GraphicsPicker'

function PlayMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M8 5.6c0-1.2 1.3-1.9 2.3-1.3l9 5.9c.9.6.9 2 0 2.6l-9 5.9c-1 .6-2.3-.1-2.3-1.3V5.6Z" />
    </svg>
  )
}

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
    <div
      className="relative min-h-dvh overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #f9bd77 0%, #f4925a 62%, #e56f4d 100%)' }}
    >
      {/* ---- the world itself (original key art, slow drift) ---- */}
      <div className="absolute inset-0" aria-hidden>
        <Image
          src="/art/menu-hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="lko-kenburns object-cover"
        />
      </div>

      {/* ---- legibility scrims (dusk-toned, subtle) ---- */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-[#123528]/80" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-[#123528]/55 via-transparent to-transparent lg:block" />

      {/* ---- content ---- */}
      <div className="relative z-10 flex min-h-dvh flex-col">
        {/* top row — place badge */}
        <div className="flex items-center gap-2 px-5 pt-[max(env(safe-area-inset-top),0.9rem)]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white/95 backdrop-blur-sm">
            <PinIcon size={13} className="text-[#ffd88a]" />
            Lokoja • Kogi State • Nigeria
          </span>
        </div>

        {/* menu block — bottom on phones, left-middle on desktop */}
        <div className="mx-auto mt-auto w-full max-w-md px-5 pb-[max(env(safe-area-inset-bottom),1.4rem)] pt-6 lg:mx-0 lg:ml-14 lg:max-w-lg lg:pb-14">
          {/* logo lockup */}
          <div className="drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
            <div className="mb-3 flex items-center gap-2.5">
              {/* confluence mark */}
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/95 shadow-lg">
                <svg viewBox="0 0 48 48" className="h-7 w-7" aria-hidden>
                  <path d="M8 8 C 20 13 23 22 24 36" stroke="#1f7a6d" strokeWidth="6" fill="none" strokeLinecap="round" />
                  <path d="M41 17 C 31 20 26 26 24 36" stroke="#e8a317" strokeWidth="6" fill="none" strokeLinecap="round" />
                  <circle cx="24" cy="37.5" r="4" fill="#146b3a" />
                </svg>
              </span>
              <span className="rounded-full border border-white/25 bg-black/20 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm">
                A Nigerian life sim
              </span>
            </div>
            <h1 className="lko-display text-[2.9rem] leading-[0.95] text-white sm:text-6xl">
              LOKOJA
              <span className="block text-[#ffd88a]">LIFE</span>
            </h1>
            <p className="mt-2.5 max-w-[30ch] text-sm font-semibold leading-snug text-white/90">
              Build your life at the meeting point of the Niger and Benue.
            </p>
          </div>

          {/* rotating tip — glass chip */}
          <div
            className="mt-5 flex min-h-[44px] items-center gap-2 rounded-2xl border border-white/15 bg-black/25 px-3.5 py-2 backdrop-blur-sm"
            aria-live="polite"
          >
            <SparkleIcon size={15} className="shrink-0 text-[#ffd88a]" />
            <p className="text-[12.5px] font-medium leading-snug text-white/90">
              {MENU_TIPS[tipIndex]}
            </p>
          </div>

          {/* actions */}
          <div className="mt-5 flex w-full flex-col gap-2.5">
            <button
              onClick={() => {
                audio.play('click')
                setScreen('creation')
              }}
              className="lko-press group flex min-h-[58px] w-full items-center justify-center gap-2.5 rounded-2xl bg-white text-lg font-extrabold tracking-wide text-[var(--lko-green-deep)] shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)]"
            >
              <PlayMark className="h-5 w-5 text-[var(--lko-terra)] transition-transform group-hover:scale-110" />
              START YOUR LIFE
            </button>

            <button
              onClick={() => {
                audio.play('click')
                continueGame()
              }}
              disabled={!hasSave}
              className="lko-press flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/12 text-base font-extrabold tracking-wide text-white backdrop-blur-sm disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-white/40"
            >
              Continue your life
            </button>

            {/* settings — subordinate text action */}
            <Dialog>
              <DialogTrigger asChild>
                <button
                  onClick={() => audio.play('click')}
                  className="lko-press mx-auto flex min-h-[44px] items-center gap-1.5 px-4 text-sm font-bold text-white/85"
                >
                  <SettingsIcon size={16} />
                  Settings
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-[calc(100vw-2rem)] rounded-2xl sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle className="lko-display">Settings</DialogTitle>
                  <DialogDescription>Fine-tune your Lokoja Life experience.</DialogDescription>
                </DialogHeader>

                <div className="flex items-center justify-between rounded-xl border border-black/[0.06] px-4 py-3">
                  <div>
                    <p className="text-sm font-bold">Sound</p>
                    <p className="text-xs text-[var(--lko-ink-soft)]">Clicks, chimes &amp; alerts</p>
                  </div>
                  <Switch checked={settings.sound} onCheckedChange={toggleSound} aria-label="Toggle sound" />
                </div>

                {/* M7 — RUN ON ANY DEVICE: pick a tier before the world even opens */}
                <GraphicsPicker />

                <div className="rounded-xl border border-black/[0.06] px-4 py-3 text-xs leading-relaxed text-[var(--lko-ink-soft)]">
                  <p className="mb-1 font-bold text-[var(--lko-ink)]">Lokoja Life {GAME_META.version}</p>
                  <p>
                    {GAME_META.stage} — more life is coming to the city soon: shops, homes, the
                    phone and beyond.
                  </p>
                  {hasSave && (
                    <button
                      onClick={() => {
                        if (window.confirm('Delete your save and start fresh? This cannot be undone.')) {
                          audio.play('notify')
                          resetGame()
                        }
                      }}
                      className="lko-press mt-3 min-h-[40px] w-full rounded-lg border border-red-200 bg-red-50 py-2 text-xs font-bold text-red-600"
                    >
                      Delete save &amp; start fresh
                    </button>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <p className="mt-5 text-center text-[11px] font-medium text-white/60 lg:text-left">
            An original Nigerian life sim • Made for Lokoja
          </p>
        </div>
      </div>
    </div>
  )
}
