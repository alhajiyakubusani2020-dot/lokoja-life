'use client'

/**
 * LOKOJA LIFE — M24-UI: THE AUTH SHEET (the landing's register doors)
 * --------------------------------------------------------------------
 * The login/signup sheet the rebuilt landing opens. Rides the SAME
 * store doors and pure validation laws as the in-game gate — no second
 * identity system exists anywhere in the app (the identity law):
 *   registerAccount({handle, contact, pin, birthYear, parentPin?})
 *   loginAccount({handle, pin})
 * M13 rides live: the birth year picks the band, a minor claims behind
 * a parent PIN and collects NOTHING (contact stays empty for kid/teen).
 *
 * THE HONEST DOOR: every failure reason the store returns shows as-is —
 * the sheet never invents a success.
 */

import { useState } from 'react'
import { useGameStore } from '@/game/store/useGameStore'
import { useMenuStore } from '@/game/store/menu-store'
import { audio } from '@/game/systems/audio'
import { validateHandle, validatePin, validateContact, ageBandForYear } from '@/game/systems/guest'

const NOW_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 60 }, (_, i) => NOW_YEAR - 6 - i)

export function MenuAuthSheet({ onClose }: { onClose: () => void }) {
  const registerAccount = useGameStore((s) => s.registerAccount)
  const loginAccount = useGameStore((s) => s.loginAccount)
  const notify = useGameStore((s) => s.notify)
  const hasSave = useMenuStore((s) => s.hasSave)
  const continueGame = useMenuStore((s) => s.continueGame)
  const setScreen = useMenuStore((s) => s.setScreen)

  const [mode, setMode] = useState<'claim' | 'return'>('claim')
  const [handle, setHandle] = useState('')
  const [contact, setContact] = useState('')
  const [pin, setPin] = useState('')
  const [birthYear, setBirthYear] = useState(String(NOW_YEAR - 22))
  const [parentPin, setParentPin] = useState('')
  const [busy, setBusy] = useState(false)
  const [why, setWhy] = useState<string | null>(null)

  const band = ageBandForYear(Number(birthYear), NOW_YEAR)
  const minor = band !== null && band !== 'adult'

  const submit = async () => {
    setBusy(true)
    setWhy(null)
    try {
      const res =
        mode === 'claim'
          ? await registerAccount({ handle, contact, pin, birthYear: Number(birthYear), parentPin: minor ? parentPin : undefined })
          : await loginAccount({ handle, pin })
      if (res.ok) {
        audio.play('chime')
        notify({ icon: '🪪', text: `Welcome, ${handle} — your name don enter the register.`, tone: 'good' })
        if (hasSave) void continueGame()
        else setScreen('creation')
        onClose()
      } else {
        setWhy(res.why ?? 'E no gree — try again.')
        audio.play('notify')
      }
    } finally {
      setBusy(false)
    }
  }

  const clientWhy =
    validatePin(pin).ok === false && pin.length > 0
      ? validatePin(pin).why
      : mode === 'claim' && validateHandle(handle).ok === false && handle.length > 0
        ? validateHandle(handle).why
        : mode === 'claim' && validateContact(contact).ok === false && contact.length > 0
          ? validateContact(contact).why
          : null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-[3px] sm:items-center" role="dialog" aria-modal aria-label="Enter Lokoja — login or signup">
      <div data-testid="menu-auth-sheet" className="lko-fade max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-white/15 bg-[#0e1512]/95 p-5 text-white shadow-2xl backdrop-blur-xl sm:rounded-3xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="lko-display text-xl leading-tight">Enter the city</h2>
            <p className="mt-0.5 text-[11.5px] font-semibold text-white/60">
              One name, one PIN — the same identity carry your save, your paddies and your pocket.
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
              onClick={() => { audio.play('click'); setMode(m); setWhy(null) }}
              className={`lko-press rounded-lg px-2 py-2 text-[12px] font-extrabold ${mode === m ? 'bg-white text-[#123528] shadow' : 'text-white/70'}`}
            >
              {label}
            </button>
          ))}
        </div>

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
                  placeholder="Email or phone — the register wants one (adults)"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  autoComplete="email"
                />
              )}
            </>
          )}
        </div>

        {(clientWhy || why) && (
          <p data-testid="auth-why" className="mt-2.5 rounded-xl bg-[#fdecea]/90 px-3 py-2 text-[11px] font-bold text-[#a63d33]">
            {clientWhy ?? why}
          </p>
        )}

        <button
          type="button"
          data-testid="auth-submit"
          disabled={busy || !handle || !pin}
          onClick={() => void submit()}
          className="lko-press mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#ffd88a] text-[15px] font-extrabold tracking-wide text-[#123528] shadow-[0_10px_28px_-10px_rgba(255,216,138,0.5)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? 'Deh open the gate…' : mode === 'claim' ? 'Claim your name 🪪' : 'Enter Lokoja 🔑'}
        </button>
        <p className="mt-3 text-center text-[10px] font-semibold leading-relaxed text-white/40">
          Your name na your multiplayer identity — the whole city go know you by am. Minors dey behind the family shield, always.
        </p>
      </div>
    </div>
  )
}
