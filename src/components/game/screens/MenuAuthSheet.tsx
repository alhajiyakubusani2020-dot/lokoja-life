'use client'

/**
 * LOKOJA LIFE — M24 W1: THE AUTH SHEET (the register's front door)
 * --------------------------------------------------------------------
 * The signup the rebuilt landing opens — now the FULL face the street
 * will see (the W1 register law): handle + PIN + birthday (the band
 * law live) in step one, then DISPLAY NAME + AVATAR LOOK + optional
 * BIO in step two, drawn with the REAL vocabularies from data/avatar.ts
 * — the same words CharacterCreation speaks and the W2 bodies will
 * render. Login stays one step. `inWorld` (the preview wall's door)
 * claims without touching the menu screens — the guest continues the
 * life they were living.
 *
 * THE HONEST DOOR: every failure reason the store returns shows as-is —
 * the sheet never invents a success. Contact is OPTIONAL now (the v2
 * register law): validated-if-present, never demanded. M13 rides live:
 * a minor claims behind a parent PIN and collects NOTHING.
 */

import { useMemo, useState } from 'react'
import { useGameStore } from '@/game/store/useGameStore'
import { useMenuStore } from '@/game/store/menu-store'
import { audio } from '@/game/systems/audio'
import { validateHandle, validatePin, validateContact, ageBandForYear } from '@/game/systems/guest'
import {
  validateDisplayName,
  validateBio,
  validateAvatarLook,
  defaultLook,
  type AvatarLook,
} from '@/game/systems/profile'
import { SKIN_TONES, HAIR_COLORS, AVATAR_HAIRSTYLES, AVATAR_CLOTHING_STYLES, CLOTHING_COLORS } from '@/game/data/avatar'

const NOW_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 60 }, (_, i) => NOW_YEAR - 6 - i)

/* ------------------------ the honest little bust --------------------------- */

/**
 * A flat SVG bust preview — the REAL colors and the REAL style keys,
 * drawn light (no three.js on the landing — the N1 TTI law). This is
 * the "what the street sees" mirror, not the rig itself.
 */
function LookBust({ look }: { look: AvatarLook }) {
  const hair: Record<string, React.ReactNode> = {
    bald: null,
    'low-cut': <path d="M32 14c10-3 18-2 22 1l-2 8c-6-4-14-5-18-3l-2-6Z" fill={look.hairColor} />,
    waves: <path d="M30 16c4-6 22-6 26 0l-3 6c-2-4-5-5-10-5s-8 1-10 5l-3-6Z" fill={look.hairColor} />,
    afro: <circle cx="43" cy="16" r="14" fill={look.hairColor} />,
    cornrows: (
      <g fill={look.hairColor}>
        <path d="M32 14c10-3 18-2 22 1l-2 7c-6-4-14-5-18-3l-2-5Z" />
        <path d="M35 15l3 7M40 14l2 8M45 14l1 8M50 15l-1 7" stroke="#00000030" strokeWidth="1" />
      </g>
    ),
    dreads: (
      <g fill={look.hairColor}>
        <path d="M32 14c10-3 18-2 22 1l-2 8c-6-4-14-5-18-3l-2-6Z" />
        <path d="M31 20c-2 8-2 14-1 18l3-1c-1-5-1-11 1-16l-3-1ZM55 20c2 8 2 14 1 18l-3-1c1-5 1-11-1-16l3-1Z" />
      </g>
    ),
    braids: (
      <g fill={look.hairColor}>
        <path d="M32 14c10-3 18-2 22 1l-2 7c-6-4-14-5-18-3l-2-5Z" />
        <path d="M30 20c-1 12-1 20 1 26l4-1c-2-7-2-16 0-24l-5-1ZM56 20c1 12 1 20-1 26l-4-1c2-7 2-16 0-24l5-1Z" />
      </g>
    ),
    puffs: (
      <g fill={look.hairColor}>
        <path d="M32 15c8-4 16-4 22 0l-2 6c-6-3-12-3-18 0l-2-6Z" />
        <circle cx="28" cy="12" r="6" />
        <circle cx="58" cy="12" r="6" />
      </g>
    ),
  }
  const cloth: Record<string, React.ReactNode> = {
    tshirt: <path d="M24 62c2-8 8-12 19-12s17 4 19 12v14H24V62Z" fill={look.clothingColor} />,
    kaftan: (
      <g fill={look.clothingColor}>
        <path d="M26 60c3-7 9-10 17-10s14 3 17 10v16H26V60Z" />
        <path d="M43 50v26" stroke="#00000022" strokeWidth="2" />
      </g>
    ),
    ankara: (
      <g fill={look.clothingColor}>
        <path d="M24 62c2-8 8-12 19-12s17 4 19 12v14H24V62Z" />
        <circle cx="34" cy="66" r="2" fill="#ffffff40" />
        <circle cx="46" cy="70" r="2" fill="#ffffff40" />
        <circle cx="54" cy="64" r="2" fill="#ffffff40" />
      </g>
    ),
    senator: (
      <g fill={look.clothingColor}>
        <path d="M25 62c2-7 8-11 18-11s16 4 18 11v14H25V62Z" />
        <path d="M43 51l-5 4 5 5 5-5-5-4Z" fill="#00000030" />
      </g>
    ),
    hoodie: (
      <g fill={look.clothingColor}>
        <path d="M23 62c3-9 9-13 20-13s17 4 20 13v14H23V62Z" />
        <path d="M33 52c2 6 6 9 10 9s8-3 10-9c-3-2-6-3-10-3s-7 1-10 3Z" fill="#00000025" />
      </g>
    ),
    lace: (
      <g fill={look.clothingColor}>
        <path d="M24 62c2-8 8-12 19-12s17 4 19 12v14H24V62Z" />
        <circle cx="30" cy="64" r="1.6" fill="#ffffff50" /><circle cx="37" cy="68" r="1.6" fill="#ffffff50" />
        <circle cx="44" cy="63" r="1.6" fill="#ffffff50" /><circle cx="51" cy="68" r="1.6" fill="#ffffff50" />
        <circle cx="57" cy="64" r="1.6" fill="#ffffff50" />
      </g>
    ),
  }
  return (
    <svg viewBox="0 0 86 86" className="h-24 w-24 shrink-0 drop-shadow" aria-hidden>
      <circle cx="43" cy="45" r="41" fill="#0f1a15" />
      {/* shoulders/torso */}
      {cloth[look.clothingStyle] ?? cloth.tshirt}
      {/* neck + head */}
      <rect x="38" y="38" width="10" height="10" rx="4" fill={look.skinTone} />
      <ellipse cx="43" cy="28" rx="13" ry="15" fill={look.skinTone} />
      {/* hair sits BEHIND nothing — drawn after the head so caps read */}
      {hair[look.hairstyle]}
      {/* honest face marks */}
      <circle cx="38" cy="28" r="1.4" fill="#1b1b1b" />
      <circle cx="48" cy="28" r="1.4" fill="#1b1b1b" />
      <path d="M39 35c2.5 2 5.5 2 8 0" stroke="#1b1b1b" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  )
}

/* ------------------------------- the sheet --------------------------------- */

export function MenuAuthSheet({ onClose, inWorld = false }: { onClose: () => void; inWorld?: boolean }) {
  const registerAccount = useGameStore((s) => s.registerAccount)
  const loginAccount = useGameStore((s) => s.loginAccount)
  const notify = useGameStore((s) => s.notify)
  const hasSave = useMenuStore((s) => s.hasSave)
  const continueGame = useMenuStore((s) => s.continueGame)
  const setScreen = useMenuStore((s) => s.setScreen)

  const [mode, setMode] = useState<'claim' | 'return'>('claim')
  const [step, setStep] = useState<1 | 2>(1)
  const [handle, setHandle] = useState('')
  const [contact, setContact] = useState('')
  const [pin, setPin] = useState('')
  const [birthYear, setBirthYear] = useState(String(NOW_YEAR - 22))
  const [parentPin, setParentPin] = useState('')
  // W1 — the face fields (prefilled from the body the save already built)
  const prefill = useGameStore.getState().player?.avatar
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [look, setLook] = useState<AvatarLook>(prefill ?? defaultLook())
  const [busy, setBusy] = useState(false)
  const [why, setWhy] = useState<string | null>(null)

  const band = ageBandForYear(Number(birthYear), NOW_YEAR)
  const minor = band !== null && band !== 'adult'

  // the look the player touched must be one the vocabularies minted —
  // the picker can only emit real values, but the prefill verifies too
  const lookOk = useMemo(() => validateAvatarLook(look).ok, [look])
  const nameWhy = useMemo(() => (displayName.length > 0 ? (validateDisplayName(displayName).ok ? null : validateDisplayName(displayName).why) : null), [displayName])
  const bioWhy = useMemo(() => (bio.length > 0 ? (validateBio(bio).ok ? null : validateBio(bio).why) : null), [bio])

  const submit = async () => {
    setBusy(true)
    setWhy(null)
    try {
      const res =
        mode === 'claim'
          ? await registerAccount({
              handle,
              contact,
              pin,
              birthYear: Number(birthYear),
              parentPin: minor ? parentPin : undefined,
              displayName: displayName.trim() || handle,
              avatarLook: JSON.stringify(look),
              bio,
            })
          : await loginAccount({ handle, pin })
      if (res.ok) {
        audio.play('chime')
        notify({ icon: '🪪', text: `Welcome, ${handle} — your name and your face don enter the register.`, tone: 'good' })
        if (!inWorld) {
          if (hasSave) void continueGame()
          else setScreen('creation')
        }
        onClose()
      } else {
        setWhy(res.why ?? 'E no gree — try again.')
        audio.play('notify')
      }
    } finally {
      setBusy(false)
    }
  }

  const step1Why =
    validatePin(pin).ok === false && pin.length > 0
      ? validatePin(pin).why
      : mode === 'claim' && validateHandle(handle).ok === false && handle.length > 0
        ? validateHandle(handle).why
        : mode === 'claim' && contact.length > 0 && validateContact(contact).ok === false
          ? validateContact(contact).why
          : null
  const step2Why = nameWhy ?? bioWhy ?? (lookOk ? null : 'Pick a look from the real options.')

  const canStep1 = handle.length >= 3 && pin.length >= 4 && (mode === 'return' || (minor ? parentPin.length === 6 : true))
  const canSubmit = mode === 'claim' ? canStep1 && lookOk && validateDisplayName(displayName.trim() || handle).ok && validateBio(bio).ok : canStep1

  const switchMode = (m: 'claim' | 'return') => {
    audio.play('click')
    setMode(m)
    setWhy(null)
    setStep(1)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-[3px] sm:items-center" role="dialog" aria-modal aria-label="Enter Lokoja — login or signup">
      <div data-testid="menu-auth-sheet" className="lko-fade max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-white/15 bg-[#0e1512]/95 p-5 text-white shadow-2xl backdrop-blur-xl sm:rounded-3xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="lko-display text-xl leading-tight">
              {mode === 'claim' ? (step === 1 ? 'Claim your name' : 'Design your face') : 'Enter the city'}
            </h2>
            <p className="mt-0.5 text-[11.5px] font-semibold text-white/60">
              {mode === 'claim'
                ? step === 1
                  ? 'One name, one PIN — step 1 of 2. Step 2 na your face.'
                  : 'Wetin the street go see when W2 bodies land — design am now.'
                : 'One name, one PIN — the same identity carry your save, your paddies and your pocket.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="lko-press flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-white/[0.07] p-1">
          {([['return', 'Log in'], ['claim', 'Sign up']] as const).map(([m, label]) => (
            <button
              key={m}
              type="button"
              data-testid={`auth-tab-${m}`}
              onClick={() => switchMode(m)}
              className={`lko-press rounded-lg px-2 py-2 text-[12px] font-extrabold ${mode === m ? 'bg-white text-[#123528] shadow' : 'text-white/70'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === 'claim' && step === 2 && (
          /* ------------------- STEP 2 — the face the street sees ------------------- */
          <div data-testid="auth-face-step" className="mt-4">
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <LookBust look={look} />
              <div className="min-w-0 flex-1 space-y-2">
                <input
                  data-testid="auth-display-name"
                  className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2.5 text-[13px] font-bold text-white placeholder:text-white/35 outline-none focus:border-[#ffd88a]"
                  placeholder="Display name (the roster shows this)"
                  value={displayName}
                  maxLength={24}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
                <textarea
                  data-testid="auth-bio"
                  className="w-full resize-none rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2.5 text-[12px] font-semibold text-white placeholder:text-white/35 outline-none focus:border-[#ffd88a]"
                  placeholder="Bio — one line about your hustle (optional)"
                  value={bio}
                  maxLength={280}
                  rows={2}
                  onChange={(e) => setBio(e.target.value)}
                />
                <p className="text-right text-[10px] font-bold text-white/40">{bio.length}/280</p>
              </div>
            </div>

            {/* the REAL vocabularies — the same words the rig renders */}
            <div className="mt-3 space-y-2.5">
              <SwatchRow label="Skin" options={SKIN_TONES} active={look.skinTone} onPick={(v) => setLook((l) => ({ ...l, skinTone: v }))} testid="auth-look-skin" />
              <SwatchRow label="Hair" options={HAIR_COLORS} active={look.hairColor} onPick={(v) => setLook((l) => ({ ...l, hairColor: v }))} testid="auth-look-hair" />
              <ChipRow label="Style" options={AVATAR_HAIRSTYLES.map((h) => ({ key: h.key, label: h.label }))} active={look.hairstyle} onPick={(k) => setLook((l) => ({ ...l, hairstyle: k }))} testid="auth-look-hairstyle" />
              <ChipRow label="Wear" options={AVATAR_CLOTHING_STYLES.map((c) => ({ key: c.key, label: c.label }))} active={look.clothingStyle} onPick={(k) => setLook((l) => ({ ...l, clothingStyle: k }))} testid="auth-look-clothing" />
              <SwatchRow label="Colour" options={CLOTHING_COLORS} active={look.clothingColor} onPick={(v) => setLook((l) => ({ ...l, clothingColor: v }))} testid="auth-look-clothcolor" />
            </div>
          </div>
        )}

        {!(mode === 'claim' && step === 2) && (
          /* ------------------------- STEP 1 — the identity ------------------------- */
          <div className="mt-4 space-y-2.5">
            <input
              data-testid="auth-handle"
              className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-3 text-[13px] font-bold text-white placeholder:text-white/35 outline-none focus:border-[#ffd88a]"
              placeholder="Your street name (e.g. ada_hustle)"
              value={handle}
              maxLength={16}
              onChange={(e) => setHandle(e.target.value)}
              autoComplete="username"
            />
            <input
              data-testid="auth-pin"
              type="password"
              className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-3 text-[13px] font-bold tracking-widest text-white placeholder:text-white/35 outline-none focus:border-[#ffd88a]"
              placeholder="Your PIN (4+ digits)"
              value={pin}
              maxLength={12}
              onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
              autoComplete={mode === 'claim' ? 'new-password' : 'current-password'}
            />
            {mode === 'claim' && (
              <>
                <select
                  data-testid="auth-birth-year"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  aria-label="Birth year — sets your age band honestly"
                  className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-3 text-[13px] font-bold text-white outline-none focus:border-[#ffd88a]"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y} className="text-black">{y}</option>
                  ))}
                </select>
                <p className="px-1 text-[10px] font-bold text-white/50">
                  {band === 'adult' ? 'Adult band — full mic and money tables.' : band === 'teen' ? 'Teen band — moderated mic, no money tables.' : 'Kid band — parent PIN dey guard the gate, and we collect nothing.'}
                </p>
                {minor && (
                  <input
                    data-testid="auth-parent-pin"
                    type="password"
                    className="w-full rounded-xl border border-[#ffd88a]/40 bg-[#ffd88a]/[0.08] px-3.5 py-3 text-[13px] font-bold tracking-widest text-white placeholder:text-white/35 outline-none focus:border-[#ffd88a]"
                    placeholder="Parent PIN — guards the minor account"
                    value={parentPin}
                    maxLength={12}
                    onChange={(e) => setParentPin(e.target.value.replace(/[^0-9]/g, ''))}
                  />
                )}
                {!minor && (
                  <input
                    data-testid="auth-contact"
                    className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-3 text-[13px] font-bold text-white placeholder:text-white/35 outline-none focus:border-[#ffd88a]"
                    placeholder="Email or phone — optional now (the recovery line)"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    autoComplete="email"
                  />
                )}
              </>
            )}
          </div>
        )}

        {(step1Why || step2Why || why) && (
          <p data-testid="auth-why" className="mt-2.5 rounded-xl bg-[#fdecea]/90 px-3 py-2 text-[11px] font-bold text-[#a63d33]">
            {step1Why ?? step2Why ?? why}
          </p>
        )}

        {mode === 'claim' && step === 1 ? (
          <button
            type="button"
            data-testid="auth-next"
            disabled={!canStep1 || busy}
            onClick={() => { audio.play('click'); setStep(2); setWhy(null) }}
            className="lko-press mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#ffd88a] text-[15px] font-extrabold tracking-wide text-[#123528] shadow-[0_10px_28px_-10px_rgba(255,216,138,0.5)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next — design your face →
          </button>
        ) : (
          <div className="mt-4 flex gap-2">
            {mode === 'claim' && (
              <button
                type="button"
                data-testid="auth-back"
                onClick={() => { audio.play('click'); setStep(1); setWhy(null) }}
                className="lko-press flex min-h-[52px] items-center justify-center rounded-2xl border border-white/20 bg-white/[0.06] px-5 text-[13px] font-extrabold text-white/80"
              >
                ← Back
              </button>
            )}
            <button
              type="button"
              data-testid="auth-submit"
              disabled={busy || !canSubmit}
              onClick={() => void submit()}
              className="lko-press flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl bg-[#ffd88a] text-[15px] font-extrabold tracking-wide text-[#123528] shadow-[0_10px_28px_-10px_rgba(255,216,138,0.5)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? 'Deh open the gate…' : mode === 'claim' ? 'Claim your name 🪪' : 'Enter Lokoja 🔑'}
            </button>
          </div>
        )}
        <p className="mt-3 text-center text-[10px] font-semibold leading-relaxed text-white/40">
          {mode === 'claim'
            ? 'Your name and face na your multiplayer identity — the whole city go know you by am. Minors dey behind the family shield, always.'
            : 'Your name na your multiplayer identity — the whole city go know you by am. Minors dey behind the family shield, always.'}
        </p>
      </div>
    </div>
  )
}

/* ------------------------------- the rows ---------------------------------- */

function SwatchRow({ label, options, active, onPick, testid }: {
  label: string
  options: { key: string; label: string; value: string }[]
  active: string
  onPick: (value: string) => void
  testid: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-11 shrink-0 text-[10px] font-extrabold uppercase tracking-wider text-white/45">{label}</span>
      <div className="flex flex-wrap gap-1.5" data-testid={testid}>
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            aria-label={`${label}: ${o.label}`}
            onClick={() => { audio.play('click'); onPick(o.value) }}
            className={`lko-press h-7 w-7 rounded-full border-2 ${active === o.value ? 'border-[#ffd88a] shadow-[0_0_0_2px_rgba(255,216,138,0.35)]' : 'border-white/20'}`}
            style={{ backgroundColor: o.value }}
          />
        ))}
      </div>
    </div>
  )
}

function ChipRow({ label, options, active, onPick, testid }: {
  label: string
  options: { key: string; label: string }[]
  active: string
  onPick: (key: string) => void
  testid: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-11 shrink-0 text-[10px] font-extrabold uppercase tracking-wider text-white/45">{label}</span>
      <div className="flex flex-wrap gap-1.5" data-testid={testid}>
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => { audio.play('click'); onPick(o.key) }}
            className={`lko-press rounded-full px-2.5 py-1 text-[10.5px] font-extrabold ${active === o.key ? 'bg-[#ffd88a] text-[#123528]' : 'bg-white/10 text-white/75'}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}
