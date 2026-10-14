'use client'

/**
 * LOKOJA LIFE — M9: THE GUEST LOOP (the gate)
 * --------------------------------------------
 * "Lokoja knows your face. Claim your name to keep going."
 * Play-first, login-to-continue: the modal stands before forward travel
 * for unlinked guests. Claim (register) or Return (login) — the store's
 * merge law decides what continues, and nothing is ever lost.
 * "Maybe later" buys the rest of TODAY through the honest grace law.
 */

import { useState } from 'react'
import { useGameStore } from '@/game/store/useGameStore'
import { audio } from '@/game/systems/audio'
import { validateHandle, validatePin, validateContact } from '@/game/systems/guest'

const NOW_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 60 }, (_, i) => NOW_YEAR - 6 - i)

export function GuestGate() {
  const gateOpen = useGameStore((s) => s.gateOpen)
  const account = useGameStore((s) => s.account)
  const acceptGateGrace = useGameStore((s) => s.acceptGateGrace)
  const closeGate = useGameStore((s) => s.closeGate)
  const registerAccount = useGameStore((s) => s.registerAccount)
  const loginAccount = useGameStore((s) => s.loginAccount)

  const [mode, setMode] = useState<'claim' | 'return'>('claim')
  const [handle, setHandle] = useState('')
  const [contact, setContact] = useState('')
  const [pin, setPin] = useState('')
  const [birthYear, setBirthYear] = useState(String(NOW_YEAR - 20))
  const [busy, setBusy] = useState(false)
  const [why, setWhy] = useState<string | null>(null)

  if (!gateOpen || account.linked) return null

  const submit = async () => {
    setBusy(true)
    setWhy(null)
    try {
      const res =
        mode === 'claim'
          ? await registerAccount({ handle, contact, pin, birthYear: Number(birthYear) })
          : await loginAccount({ handle, pin })
      if (!res.ok) {
        setWhy(res.why ?? 'E no gree — try again.')
        audio.play('notify')
      }
    } finally {
      setBusy(false)
    }
  }

  const clientWhy =
    mode === 'claim'
      ? validateHandle(handle).ok === false && handle.length > 0
        ? validateHandle(handle).why
        : validateContact(contact).ok === false && contact.length > 0
          ? validateContact(contact).why
          : validatePin(pin).ok === false && pin.length > 0
            ? validatePin(pin).why
            : null
      : validatePin(pin).ok === false && pin.length > 0
        ? validatePin(pin).why
        : null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-[2px] sm:items-center" role="dialog" aria-modal aria-label="Claim your name">
      <div data-testid="guest-gate" className="lko-fade w-full max-w-md rounded-t-3xl border border-[var(--lko-line)] bg-[var(--lko-cream)] p-4 shadow-2xl sm:rounded-3xl">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="lko-display text-lg leading-tight">Lokoja knows your face</h2>
            <p className="mt-0.5 text-[11.5px] font-semibold italic text-[var(--lko-ink-soft)]">
              Claim your name to keep going — your hustle dey safe, nothing dey lost.
            </p>
          </div>
          <button
            onClick={() => { audio.play('click'); closeGate() }}
            aria-label="Close"
            className="lko-press flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/[0.06] text-[var(--lko-ink-soft)]"
          >
            ✕
          </button>
        </div>

        {/* mode tabs */}
        <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl bg-black/[0.05] p-1">
          {(['claim', 'return'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { audio.play('click'); setMode(m); setWhy(null) }}
              className={`lko-press rounded-lg px-2 py-1.5 text-[12px] font-extrabold ${mode === m ? 'bg-white text-[var(--lko-green-deep)] shadow-sm' : 'text-[var(--lko-ink-soft)]'}`}
            >
              {m === 'claim' ? '🪪 Claim a name' : '🔁 I don claim before'}
            </button>
          ))}
        </div>

        <div className="mt-3 space-y-2">
          <input
            data-testid="gate-handle"
            className="w-full rounded-xl border border-[var(--lko-line)] bg-white px-3 py-2.5 text-[13px] font-bold outline-none focus:border-[var(--lko-green)]"
            placeholder="Your street name (e.g. ada_hustle)"
            value={handle}
            maxLength={16}
            onChange={(e) => setHandle(e.target.value)}
            autoComplete="username"
          />
          {mode === 'claim' && (
            <>
              <input
                data-testid="gate-contact"
                className="w-full rounded-xl border border-[var(--lko-line)] bg-white px-3 py-2.5 text-[13px] font-bold outline-none focus:border-[var(--lko-green)]"
                placeholder="Phone number or email (recovery)"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                autoComplete="tel"
              />
              <div className="flex items-center gap-2">
                <label className="shrink-0 text-[11px] font-extrabold text-[var(--lko-ink-soft)]" htmlFor="gate-year">
                  Born
                </label>
                <select
                  id="gate-year"
                  data-testid="gate-year"
                  className="flex-1 rounded-xl border border-[var(--lko-line)] bg-white px-3 py-2.5 text-[13px] font-bold outline-none focus:border-[var(--lko-green)]"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <span className="shrink-0 rounded-full bg-black/[0.05] px-2 py-1 text-[10px] font-extrabold text-[var(--lko-ink-soft)]">
                  {(() => {
                    const y = Number(birthYear)
                    return y <= NOW_YEAR - 13 ? '18+/teen' : 'kid — parent PIN later'
                  })()}
                </span>
              </div>
            </>
          )}
          <input
            data-testid="gate-pin"
            className="w-full rounded-xl border border-[var(--lko-line)] bg-white px-3 py-2.5 text-[13px] font-bold tracking-[0.3em] outline-none focus:border-[var(--lko-green)]"
            placeholder="PIN (4–8 digits)"
            value={pin}
            maxLength={8}
            inputMode="numeric"
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            autoComplete={mode === 'claim' ? 'new-password' : 'current-password'}
          />
        </div>

        {(why ?? clientWhy) && (
          <p data-testid="gate-why" className="mt-2 rounded-lg bg-[#fdecea] px-2.5 py-1.5 text-[11px] font-bold text-[#8a2a20]">
            {why ?? clientWhy}
          </p>
        )}

        <button
          data-testid="gate-submit"
          disabled={busy || handle.length < 3 || pin.length < 4 || (mode === 'claim' && contact.length < 5)}
          onClick={() => { audio.play('click'); void submit() }}
          className="lko-press mt-3 flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[var(--lko-green)] text-[14px] font-extrabold text-white disabled:opacity-40"
        >
          {busy ? 'The register dey write…' : mode === 'claim' ? 'Claim my name' : 'Return to my name'}
        </button>

        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-[10px] font-semibold leading-snug text-[var(--lko-ink-soft)]">
            Guests play free — the cloud save, streaks and leaderboards wait behind the name.
          </p>
          <button
            data-testid="gate-maybe"
            onClick={() => { audio.play('click'); acceptGateGrace() }}
            className="lko-press shrink-0 rounded-lg bg-black/[0.05] px-3 py-2 text-[11.5px] font-extrabold text-[var(--lko-ink-soft)]"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
