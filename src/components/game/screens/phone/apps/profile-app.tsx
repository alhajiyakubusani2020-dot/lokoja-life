'use client'

/**
 * LOKOJA LIFE — M24-UI: PROFILE (the face the street will see)
 * -------------------------------------------------------------
 * Display name, the vibe glyph, the bio — the details the W2 remote
 * avatar renderer will put on your body in the shared world. Stored
 * on this device until the W1 register wave pins them to the account
 * (ProfileRow), and every screen says so.
 */

import { useState } from 'react'
import { formatNaira } from '@/game/systems/progression'
import { useGameStore } from '@/game/store/useGameStore'
import { useSocialStore } from '@/game/store/social-store'

const VIBES = ['🌊', '🔥', '⚽', '🎵', '📚', '💼', '🍜', '🛺']

export function ProfileApp() {
  const account = useGameStore((s) => s.account)
  const player = useGameStore((s) => s.player)
  const world = useGameStore((s) => s.world)

  const profile = useSocialStore((s) => s.profile)
  const setProfile = useSocialStore((s) => s.setProfile)
  const friends = useSocialStore((s) => s.friends)

  const [name, setName] = useState(profile.displayName)
  const [bio, setBio] = useState(profile.bio)
  const [saved, setSaved] = useState(false)

  return (
    <div className="flex flex-col gap-2.5" data-testid="profile-app">
      {/* the card */}
      <div className="rounded-3xl border border-black/[0.05] bg-gradient-to-br from-[var(--lko-green-soft)] to-white p-4 text-center">
        <span className="flex mx-auto h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow" aria-hidden>
          {profile.vibe}
        </span>
        <p className="lko-display mt-2 text-[16px]">{profile.displayName || player?.name || 'Street name dey come'}</p>
        <p className="text-[11px] font-bold text-[var(--lko-ink-soft)]">@{account.handle || 'unclaimed'}</p>
        <span className="mt-1.5 inline-block rounded-full bg-[var(--lko-gold-soft)] px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-[var(--lko-gold-deep)]">
          {account.ageBand || 'guest'} band
        </span>
      </div>

      {/* honest scope chip */}
      <p className="rounded-xl bg-[var(--lko-gold-soft)]/60 px-3 py-2 text-[10px] font-bold text-[var(--lko-gold-deep)]">
        Profile dey on this device for now — the W1 register wave go pin am to your account, and the street go see am (W2).
      </p>

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
          maxLength={120}
          rows={2}
          onChange={(e) => { setBio(e.target.value); setSaved(false) }}
          placeholder="One line about your hustle…"
          className="w-full resize-none rounded-xl border border-[var(--lko-line)] bg-[var(--lko-cream)] px-3 py-2 text-[12.5px] font-semibold outline-none focus:border-[var(--lko-green)]"
        />
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
        <button
          data-testid="profile-save"
          onClick={() => { setProfile({ displayName: name.trim(), bio: bio.trim() }); setSaved(true) }}
          className="lko-press mt-1 rounded-xl bg-[var(--lko-green)] py-2.5 text-[12.5px] font-extrabold text-white"
        >
          {saved ? 'Saved ✓' : 'Save the profile'}
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
