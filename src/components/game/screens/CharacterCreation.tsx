'use client'

/**
 * LOKOJA LIFE — Character Creation
 * Live-preview avatar builder: name, gender, skin tone, hair colour,
 * hairstyle and clothing. All options come from game data files, so
 * future cosmetics (Loko Gems shop) plug straight in.
 */

import { useState } from 'react'
import { Avatar } from '../Avatar'
import { audio } from '@/game/systems/audio'
import {
  AVATAR_CLOTHING_STYLES,
  AVATAR_HAIRSTYLES,
  CLOTHING_COLORS,
  DEFAULT_AVATAR,
  HAIR_COLORS,
  SKIN_TONES,
} from '@/game/data/avatar'
import {
  NIGERIAN_FIRST_NAMES_FEMALE,
  NIGERIAN_FIRST_NAMES_MALE,
  NIGERIAN_SURNAMES,
} from '@/game/data/flavor'
import type { AvatarConfig, Gender } from '@/game/types'
import type { AgeBand } from '@/game/types'
import { useGameStore } from '@/game/store/useGameStore'
import { ArrowLeftIcon, DiceIcon, SparkleIcon } from '../icons'

/** M13 — the life stages: one download, three generations. */
const LIFE_STAGES: { band: AgeBand; label: string; note: string }[] = [
  { band: 'kid', label: 'Pikin (6–12)', note: 'Safe streets: no crime road, light hustles, emote greetings + Spot the Scammer.' },
  { band: 'teen', label: 'Teen (13–17)', note: 'Hustle hard, school pays ×1.25 smart — but betting, the agent and the lounge stay locked.' },
  { band: 'adult', label: 'Adult (18+)', note: 'The whole Lokoja: every hustle, every road, the JAPA gauntlet and the night life.' },
]

/** small circular swatch button used for colours */
function Swatch({
  color,
  active,
  label,
  onSelect,
}: {
  color: string
  active: boolean
  label: string
  onSelect: () => void
}) {
  return (
    <button
      onClick={() => {
        audio.play('click')
        onSelect()
      }}
      aria-label={label}
      aria-pressed={active}
      className={`lko-press h-11 w-11 shrink-0 rounded-full border-2 transition-shadow ${
        active
          ? 'border-[var(--lko-green)] shadow-[0_0_0_3px_var(--lko-green-soft)]'
          : 'border-black/15'
      }`}
      style={{ background: color }}
    />
  )
}

/** horizontal scroll strip with a section label */
function OptionStrip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section aria-label={label} className="mt-4">
      <h3 className="mb-2 text-xs font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">
        {label}
      </h3>
      <div className="lko-scroll-x flex gap-2 overflow-x-auto pb-1">{children}</div>
    </section>
  )
}

const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]

export function CharacterCreation() {
  const startNewGame = useGameStore((s) => s.startNewGame)
  const setScreen = useGameStore((s) => s.setScreen)

  const [name, setName] = useState('')
  const [gender, setGender] = useState<Gender>('male')
  const [avatar, setAvatar] = useState<AvatarConfig>({ ...DEFAULT_AVATAR })
  const [ageBand, setAgeBand] = useState<AgeBand>('adult')

  const patch = (p: Partial<AvatarConfig>) => setAvatar((a) => ({ ...a, ...p }))

  const randomizeName = () => {
    audio.play('click')
    const first = pick(gender === 'male' ? NIGERIAN_FIRST_NAMES_MALE : NIGERIAN_FIRST_NAMES_FEMALE)
    setName(`${first} ${pick(NIGERIAN_SURNAMES)}`)
  }

  const randomizeLook = () => {
    audio.play('click')
    setAvatar({
      skinTone: pick(SKIN_TONES).value,
      hairColor: pick(HAIR_COLORS).value,
      hairstyle: pick(AVATAR_HAIRSTYLES).key,
      clothingStyle: pick(AVATAR_CLOTHING_STYLES).key,
      clothingColor: pick(CLOTHING_COLORS).value,
    })
  }

  const canStart = name.trim().length >= 2

  return (
    <div className="lko-root lko-pop min-h-dvh pb-28">
      <header className="mx-auto flex w-full max-w-md items-center gap-3 px-4 pt-4">
        <button
          onClick={() => {
            audio.play('click')
            setScreen('menu')
          }}
          className="lko-press lko-card flex h-11 w-11 items-center justify-center rounded-xl text-[var(--lko-ink)]"
          aria-label="Back to menu"
        >
          <ArrowLeftIcon size={18} />
        </button>
        <div>
          <h1 className="lko-display text-xl text-[var(--lko-green-deep)]">Create Your Hustler</h1>
          <p className="text-xs text-[var(--lko-ink-soft)]">Who is coming to build a life in Lokoja?</p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md px-4">
        {/* live preview */}
        <div className="mt-4 flex items-center gap-4">
          <div className="lko-card shrink-0 p-2">
            <Avatar config={avatar} gender={gender} className="h-36 w-36" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="relative">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={24}
                placeholder="Your name…"
                aria-label="Character name"
                className="lko-card min-h-[48px] w-full rounded-xl px-4 py-3 pr-12 text-base font-bold outline-none placeholder:font-normal placeholder:text-[var(--lko-ink-soft)] focus:border-[var(--lko-green)]"
              />
              <button
                onClick={randomizeName}
                className="lko-press absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]"
                aria-label="Random Nigerian name"
              >
                <DiceIcon size={16} />
              </button>
            </div>
            <button
              onClick={randomizeLook}
              className="lko-press mt-2 flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-4 text-sm font-bold text-[var(--lko-ink)]"
            >
              <SparkleIcon size={15} className="text-[var(--lko-gold-deep)]" />
              Surprise me (random look)
            </button>
          </div>
        </div>

        {/* M13 — life stage: the family shield reads this for the whole game */}
        <section aria-label="Life stage" className="mt-4">
          <h3 className="mb-2 text-xs font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">
            Life stage — who dey play?
          </h3>
          <div className="grid grid-cols-3 gap-1.5">
            {LIFE_STAGES.map((s) => (
              <button
                key={s.band}
                data-testid={`stage-${s.band}`}
                onClick={() => {
                  audio.play('click')
                  setAgeBand(s.band)
                }}
                aria-pressed={ageBand === s.band}
                className={`lko-press min-h-[52px] rounded-xl border-2 px-2 py-2 text-[12px] font-extrabold leading-tight ${
                  ageBand === s.band
                    ? 'border-[var(--lko-green)] bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]'
                    : 'border-black/10 bg-white text-[var(--lko-ink-soft)]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p
            data-testid="stage-note"
            className="mt-1.5 rounded-lg bg-black/[0.04] px-2.5 py-1.5 text-[11px] font-semibold italic leading-snug text-[var(--lko-ink-soft)]"
          >
            {LIFE_STAGES.find((s) => s.band === ageBand)?.note}
          </p>
        </section>

        {/* gender */}
        <OptionStrip label="Gender / Avatar type">
          {(['male', 'female'] as Gender[]).map((g) => (
            <button
              key={g}
              onClick={() => {
                audio.play('click')
                setGender(g)
              }}
              aria-pressed={gender === g}
              className={`lko-press min-h-[44px] shrink-0 rounded-xl border-2 px-5 text-sm font-bold capitalize ${
                gender === g
                  ? 'border-[var(--lko-green)] bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]'
                  : 'border-black/10 bg-white text-[var(--lko-ink-soft)]'
              }`}
            >
              {g === 'male' ? 'Man' : 'Woman'}
            </button>
          ))}
        </OptionStrip>

        {/* skin tones */}
        <OptionStrip label="Skin tone">
          {SKIN_TONES.map((t) => (
            <Swatch
              key={t.key}
              color={t.value}
              label={t.label}
              active={avatar.skinTone === t.value}
              onSelect={() => patch({ skinTone: t.value })}
            />
          ))}
        </OptionStrip>

        {/* hairstyle */}
        <OptionStrip label="Hairstyle">
          {AVATAR_HAIRSTYLES.map((h) => (
            <button
              key={h.key}
              onClick={() => {
                audio.play('click')
                patch({ hairstyle: h.key })
              }}
              aria-pressed={avatar.hairstyle === h.key}
              className={`lko-press min-h-[44px] shrink-0 rounded-xl border-2 px-4 text-sm font-bold ${
                avatar.hairstyle === h.key
                  ? 'border-[var(--lko-green)] bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]'
                  : 'border-black/10 bg-white text-[var(--lko-ink-soft)]'
              }`}
            >
              {h.label}
            </button>
          ))}
        </OptionStrip>

        {/* hair colour */}
        <OptionStrip label="Hair colour">
          {HAIR_COLORS.map((c) => (
            <Swatch
              key={c.key}
              color={c.value}
              label={c.label}
              active={avatar.hairColor === c.value}
              onSelect={() => patch({ hairColor: c.value })}
            />
          ))}
        </OptionStrip>

        {/* clothing style */}
        <OptionStrip label="Clothing style">
          {AVATAR_CLOTHING_STYLES.map((s) => (
            <button
              key={s.key}
              onClick={() => {
                audio.play('click')
                patch({ clothingStyle: s.key })
              }}
              aria-pressed={avatar.clothingStyle === s.key}
              className={`lko-press min-h-[52px] w-28 shrink-0 rounded-xl border-2 px-2 py-2 text-left ${
                avatar.clothingStyle === s.key
                  ? 'border-[var(--lko-green)] bg-[var(--lko-green-soft)]'
                  : 'border-black/10 bg-white'
              }`}
            >
              <span className="block text-sm font-bold leading-tight text-[var(--lko-ink)]">{s.label}</span>
              <span className="mt-0.5 block text-[10px] leading-tight text-[var(--lko-ink-soft)]">
                {s.description}
              </span>
            </button>
          ))}
        </OptionStrip>

        {/* clothing colour */}
        <OptionStrip label="Clothing colour">
          {CLOTHING_COLORS.map((c) => (
            <Swatch
              key={c.key}
              color={c.value}
              label={c.label}
              active={avatar.clothingColor === c.value}
              onSelect={() => patch({ clothingColor: c.value })}
            />
          ))}
        </OptionStrip>
      </main>

      {/* sticky start CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-black/[0.06] bg-[#fffdf7]/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-md">
          <button
            onClick={() => {
              if (!canStart) return
              audio.play('levelup')
              startNewGame(name, gender, avatar, ageBand)
            }}
            disabled={!canStart}
            className="lko-press flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-[var(--lko-green)] text-lg font-extrabold tracking-wide text-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.18)] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
          >
            {canStart ? (
              <>
                <SparkleIcon size={18} className="text-[#ffd88a]" />
                Start Life in Lokoja
              </>
            ) : (
              'Enter your name to start'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
