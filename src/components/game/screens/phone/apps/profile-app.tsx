'use client'

/**
 * LOKOJA LIFE — M24 W1: PROFILE (the face the street sees — SERVER truth)
 * ------------------------------------------------------------------------
 * The W1 wave this face was promised: display name, the look, the bio
 * now live in the caller's ProfileRow through PATCH /api/profile (the
 * SAME pure laws the register ran at the door — the sheet and this
 * editor cannot disagree). The look rides the REAL vocabularies from
 * data/avatar.ts — what you pick here is what the W2 bodies render.
 * Unclaimed guests keep the honest device chip: the street sees
 * claimed faces only.
 */

import { useState } from 'react'
import { formatNaira } from '@/game/systems/progression'
import { validateDisplayName, validateBio, validateAvatarLook, defaultLook, type AvatarLook } from '@/game/systems/profile'
import { SKIN_TONES, HAIR_COLORS, AVATAR_HAIRSTYLES, AVATAR_CLOTHING_STYLES, CLOTHING_COLORS } from '@/game/data/avatar'
import { useGameStore } from '@/game/store/useGameStore'
import { useSocialStore } from '@/game/store/social-store'

const VIBES = ['🌊', '🔥', '⚽', '🎵', '📚', '💼', '🍜', '🛺']

export function ProfileApp() {
  const account = useGameStore((s) => s.account)
  const player = useGameStore((s) => s.player)
  const world = useGameStore((s) => s.world)
  const updateProfile = useGameStore((s) => s.updateProfile)

  const profile = useSocialStore((s) => s.profile)
  const setProfile = useSocialStore((s) => s.setProfile)
  const friends = useSocialStore((s) => s.friends)

  const linked = account.linked
  // the mirror: linked → the account's server truth; guest → device truth
  const serverName = account.displayName ?? ''
  const serverBio = account.bio ?? ''
  const serverLook: AvatarLook = (() => {
    const v = validateAvatarLook(account.avatarLook ?? '')
    return v.ok && v.look ? v.look : (player?.avatar ?? defaultLook())
  })()

  const [name, setName] = useState(linked ? serverName : profile.displayName)
  const [bio, setBio] = useState(linked ? serverBio : profile.bio)
  const [look, setLook] = useState<AvatarLook>(serverLook)
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)
  const [why, setWhy] = useState<string | null>(null)

  const nameWhy = name.length > 0 && !validateDisplayName(name).ok ? validateDisplayName(name).why : null
  const bioWhy = bio.length > 0 && !validateBio(bio).ok ? validateBio(bio).why : null

  const save = async () => {
    setWhy(null)
    if (nameWhy || bioWhy) return
    setBusy(true)
    try {
      if (linked) {
        const res = await updateProfile({ displayName: name.trim(), bio: bio.trim(), avatarLook: JSON.stringify(look) })
        if (!res.ok) setWhy(res.why ?? 'E no gree — try again.')
      } else {
        setProfile({ displayName: name.trim(), bio: bio.trim() })
      }
      setSaved(true)
    } finally {
      setBusy(false)
    }
  }

  const shownName = linked ? serverName || player?.name || 'Street name dey come' : profile.displayName || player?.name || 'Street name dey come'

  return (
    <div className="flex flex-col gap-2.5" data-testid="profile-app">
      {/* the card */}
      <div className="rounded-3xl border border-black/[0.05] bg-gradient-to-br from-[var(--lko-green-soft)] to-white p-4 text-center">
        <span className="flex mx-auto h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow" aria-hidden>
          {profile.vibe}
        </span>
        <p className="lko-display mt-2 text-[16px]">{shownName}</p>
        <p className="text-[11px] font-bold text-[var(--lko-ink-soft)]">@{account.handle || 'unclaimed'}</p>
        <span className="mt-1.5 inline-block rounded-full bg-[var(--lko-gold-soft)] px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-[var(--lko-gold-deep)]">
          {account.ageBand || 'guest'} band
        </span>
      </div>

      {/* the honest scope chip — W1: the claim made it server truth */}
      {linked ? (
        <p data-testid="profile-scope" className="rounded-xl bg-[var(--lko-green-soft)] px-3 py-2 text-[10px] font-bold text-[var(--lko-green-deep)]">
          🌍 SERVER TRUTH — this face dey your ProfileRow on the register. Edit am here, the street go see am (W2 bodies go render am).
        </p>
      ) : (
        <p data-testid="profile-scope" className="rounded-xl bg-[var(--lko-gold-soft)]/60 px-3 py-2 text-[10px] font-bold text-[var(--lko-gold-deep)]">
          Device-truth: claim your name and this face go ride your ProfileRow — the street dey see claimed faces only.
        </p>
      )}

      {/* the editor */}
      <div className="flex flex-col gap-2 rounded-2xl border border-black/[0.05] bg-white p-3">
        <label className="text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]" htmlFor="profile-name">Display name</label>
        <input
          id="profile-name"
          data-testid="profile-name"
          value={name}
          maxLength={24}
          onChange={(e) => { setName(e.target.value); setSaved(false) }}
          placeholder="Wetin the street go call you"
          className="w-full rounded-xl border border-[var(--lko-line)] bg-[var(--lko-cream)] px-3 py-2 text-[13px] font-bold outline-none focus:border-[var(--lko-green)]"
        />
        <label className="pt-1 text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]" htmlFor="profile-bio">Bio</label>
        <textarea
          id="profile-bio"
          data-testid="profile-bio"
          value={bio}
          maxLength={280}
          rows={2}
          onChange={(e) => { setBio(e.target.value); setSaved(false) }}
          placeholder="One line about your hustle…"
          className="w-full resize-none rounded-xl border border-[var(--lko-line)] bg-[var(--lko-cream)] px-3 py-2 text-[12.5px] font-semibold outline-none focus:border-[var(--lko-green)]"
        />
        <p className="text-right text-[9px] font-bold text-[var(--lko-ink-soft)]">{bio.length}/280</p>

        {/* W1 — the look editor (the REAL vocabularies, the W2 body words) */}
        <p className="pt-1 text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">Your look (what the street sees)</p>
        <div className="flex flex-col gap-1.5 rounded-xl border border-[var(--lko-line)] bg-[var(--lko-cream)] p-2" data-testid="profile-look">
          <SwatchRow label="Skin" options={SKIN_TONES} active={look.skinTone} onPick={(v) => { setLook((l) => ({ ...l, skinTone: v })); setSaved(false) }} />
          <SwatchRow label="Hair" options={HAIR_COLORS} active={look.hairColor} onPick={(v) => { setLook((l) => ({ ...l, hairColor: v })); setSaved(false) }} />
          <ChipRow label="Style" options={AVATAR_HAIRSTYLES.map((h) => ({ key: h.key, label: h.label }))} active={look.hairstyle} onPick={(k) => { setLook((l) => ({ ...l, hairstyle: k })); setSaved(false) }} />
          <ChipRow label="Wear" options={AVATAR_CLOTHING_STYLES.map((c) => ({ key: c.key, label: c.label }))} active={look.clothingStyle} onPick={(k) => { setLook((l) => ({ ...l, clothingStyle: k })); setSaved(false) }} />
          <SwatchRow label="Colour" options={CLOTHING_COLORS} active={look.clothingColor} onPick={(v) => { setLook((l) => ({ ...l, clothingColor: v })); setSaved(false) }} />
        </div>

        <p className="pt-1 text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">Your vibe</p>
        <div className="flex flex-wrap gap-1.5">
          {VIBES.map((v) => (
            <button key={v} onClick={() => { setProfile({ vibe: v }); setSaved(false) }}
              aria-pressed={profile.vibe === v}
              className={`lko-press flex h-9 w-9 items-center justify-center rounded-xl text-lg ${profile.vibe === v ? 'bg-[var(--lko-green)]' : 'bg-black/[0.05]'}`}>
              {v}
            </button>
          ))}
        </div>
        {(nameWhy || bioWhy || why) && (
          <p data-testid="profile-why" className="rounded-lg bg-[#fdecea] px-2.5 py-1.5 text-[11px] font-bold text-[#8a2a20]">
            {nameWhy ?? bioWhy ?? why}
          </p>
        )}
        <button
          data-testid="profile-save"
          disabled={busy || !!nameWhy || !!bioWhy}
          onClick={() => void save()}
          className="lko-press mt-1 rounded-xl bg-[var(--lko-green)] py-2.5 text-[12.5px] font-extrabold text-white disabled:opacity-40"
        >
          {busy ? 'Deh write the register…' : saved ? 'Saved ✓' : linked ? 'Save to the register' : 'Save the profile'}
        </button>
      </div>

      {/* the honest stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { k: 'Day', v: String(world?.day ?? 1) },
          { k: 'Pocket', v: formatNaira(player?.cash ?? 0) },
          { k: 'Paddies', v: String(friends.length) },
        ].map((s) => (
          <div key={s.k} className="rounded-2xl border border-black/[0.05] bg-white p-2.5 text-center">
            <p className="text-[9px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">{s.k}</p>
            <p className="lko-num text-[13px] font-extrabold">{s.v}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SwatchRow({ label, options, active, onPick }: {
  label: string
  options: { key: string; label: string; value: string }[]
  active: string
  onPick: (value: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-10 shrink-0 text-[9px] font-extrabold uppercase tracking-wide text-[var(--lko-ink-soft)]">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            aria-label={`${label}: ${o.label}`}
            onClick={() => onPick(o.value)}
            className={`lko-press h-6 w-6 rounded-full border-2 ${active === o.value ? 'border-[var(--lko-green)] shadow-[0_0_0_2px_rgba(27,122,67,0.25)]' : 'border-black/10'}`}
            style={{ backgroundColor: o.value }}
          />
        ))}
      </div>
    </div>
  )
}

function ChipRow({ label, options, active, onPick }: {
  label: string
  options: { key: string; label: string }[]
  active: string
  onPick: (key: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-10 shrink-0 text-[9px] font-extrabold uppercase tracking-wide text-[var(--lko-ink-soft)]">{label}</span>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => onPick(o.key)}
            className={`lko-press rounded-full px-2 py-0.5 text-[9.5px] font-extrabold ${active === o.key ? 'bg-[var(--lko-green)] text-white' : 'bg-black/[0.06] text-[var(--lko-ink-soft)]'}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}
